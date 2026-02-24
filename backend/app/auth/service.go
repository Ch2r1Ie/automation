package auth

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strconv"
	"strings"
	"time"

	"automation/app"
	"automation/config"
	"automation/util/aesgcm"
	appErr "automation/util/err"
	"automation/util/middleware"
	"automation/util/provider"
	"automation/util/repo"

	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

var (
	AccessTokenDurationSeconds  = 300000000
	RefreshTokenDurationSeconds = 2592000
)

type Service interface {
	Register(ctx context.Context, req *AuthReq) (*Response, string, error)
	RefreshToken(ctx context.Context, payload *middleware.TokenPayload, refreshToken string) (*Response, string, error)
	SignOut(ctx context.Context, payload *middleware.TokenPayload) error
}

type authService struct {
	conf          *config.Config
	userRepo      repo.UserRepository
	sessionRepo   repo.SessionRepository
	googleOAuth2  provider.GoogleOAuth2
	githubOAuth2  provider.GithubOAuth2
	discordOAuth2 provider.DiscordOAuth2
	tiktokOAuth2  provider.TiktokOAuth2
	xOAuth2       provider.XOAuth2
	encryptor     aesgcm.Encryptor
	newTime       func() time.Time
	newUUID       func() string
}

func NewService(
	conf *config.Config,
	userRepo repo.UserRepository,
	sessionRepo repo.SessionRepository,
	googleOAuth2 provider.GoogleOAuth2,
	githubOAuth2 provider.GithubOAuth2,
	discordOAuth2 provider.DiscordOAuth2,
	tiktokOAuth2 provider.TiktokOAuth2,
	xOAuth2 provider.XOAuth2,
	encryptor aesgcm.Encryptor,
	newTime func() time.Time,
	newUUID func() string,
) *authService {
	return &authService{
		conf:          conf,
		userRepo:      userRepo,
		sessionRepo:   sessionRepo,
		googleOAuth2:  googleOAuth2,
		githubOAuth2:  githubOAuth2,
		discordOAuth2: discordOAuth2,
		tiktokOAuth2:  tiktokOAuth2,
		encryptor:     encryptor,
		newTime:       newTime,
		newUUID:       newUUID,
	}
}

func (s *authService) Register(ctx context.Context, req *AuthReq) (*Response, string, error) {
	currentTime := s.newTime()

	if req.AuthCode == "" || req.Provider == "" {
		slog.ErrorContext(ctx, "invalid request: authCode or provider is empty")
		return nil, "", &appErr.ErrUnauthorized
	}

	var response *Response

	sessionID := s.newUUID()
	hashUserID := s.newUUID()
	refreshToken := s.newUUID()

	switch req.Provider {
	case app.GOOGLE:

		accessToken, err := s.googleOAuth2.ExchangeToken(ctx, req.AuthCode)
		if err != nil {
			slog.ErrorContext(ctx, fmt.Sprintf("[google] error exchanging token: %v", err))
			return nil, "", &appErr.ErrUnauthorized
		}

		userProfileFromProvider, err := s.googleOAuth2.GetProfileFromProvider(ctx, *accessToken)
		if err != nil {
			slog.ErrorContext(ctx, fmt.Sprintf("[google] error getting profile from provider: %v", err))
			return nil, "", &appErr.ErrUnauthorized
		}

		encryptedName, err := s.encryptor.Encrypt(userProfileFromProvider.Name)
		if err != nil {
			slog.ErrorContext(ctx, fmt.Sprintf("[google] error encrypting... name: %v", err))
			return nil, "", &appErr.ErrInternalServerError
		}

		newUser := true
		var user *repo.User

		user, err = s.userRepo.FirstUserByProvider(ctx, userProfileFromProvider.ID, req.Provider)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {

				tmpUser := repo.User{
					ProviderID:    userProfileFromProvider.ID,
					UserID:        hashUserID,
					EncryptedName: encryptedName,
					Email:         userProfileFromProvider.Email,
					Image:         userProfileFromProvider.Picture,
					Provider:      req.Provider,
					Loc:           userProfileFromProvider.Location,
				}

				if errCreating := s.userRepo.CreateUser(ctx, &tmpUser); errCreating != nil {
					slog.ErrorContext(ctx, fmt.Sprintf("[google] error creating... user: %v", errCreating))
					return nil, "", &appErr.ErrInternalServerError
				}

				user = &tmpUser
				newUser = false
			} else {
				slog.ErrorContext(ctx, fmt.Sprintf("[google] error why finding... user: %v", err))
				return nil, "", &appErr.ErrInternalServerError
			}
		}

		if newUser {
			if err = s.userRepo.UpdateUserByProvider(ctx, user); err != nil {
				slog.ErrorContext(ctx, fmt.Sprintf("[google] error why updating... user: %v", err))
				return nil, "", &appErr.ErrInternalServerError
			}
		}

		if err = s.sessionRepo.RevokeSessionByUserID(ctx, user.UserID); err != nil {
			slog.ErrorContext(ctx, fmt.Sprintf("[google] error why revoke... session: %v", err))
			return nil, "", &appErr.ErrInternalServerError
		}

		userClaims := &provider.UserProfileClaims{
			Name:    userProfileFromProvider.Name,
			Email:   userProfileFromProvider.Email,
			Picture: userProfileFromProvider.Picture,
		}

		session := repo.Session{
			SessionID:    sessionID,
			UserID:       user.UserID,
			RefreshToken: refreshToken,
			IsRevoked:    false,
			ExpiresAt:    currentTime.Add(time.Duration(RefreshTokenDurationSeconds) * time.Second),
		}

		if err = s.sessionRepo.CreateSession(ctx, &session); err != nil {
			slog.ErrorContext(ctx, "[google] error creating... session", slog.Any("err", err))
			return nil, "", &appErr.ErrInternalServerError
		}

		response, err = s.generateToken(ctx, sessionID, user.UserID, userClaims)
		if err != nil {
			slog.ErrorContext(ctx, "[google] error generating... access token", slog.Any("err", err))
			return nil, "", &appErr.ErrInternalServerError
		}

	case app.GITHUB:

		accessToken, err := s.githubOAuth2.ExchangeToken(ctx, req.AuthCode)
		if err != nil {
			slog.ErrorContext(ctx, fmt.Sprintf("[github] error exchanging token: %v", err))
			return nil, "", &appErr.ErrUnauthorized
		}

		userProfileFromProvider, err := s.githubOAuth2.GetProfileFromProvider(ctx, *accessToken)
		if err != nil {
			slog.ErrorContext(ctx, fmt.Sprintf("[github] error getting profile from provider: %v", err))
			return nil, "", &appErr.ErrUnauthorized
		}

		encryptedName, err := s.encryptor.Encrypt(userProfileFromProvider.Name)
		if err != nil {
			slog.ErrorContext(ctx, fmt.Sprintf("[github] error encrypting... name: %v", err))
			return nil, "", &appErr.ErrInternalServerError
		}

		newUser := true
		var user *repo.User

		user, err = s.userRepo.FirstUserByProvider(ctx, strconv.Itoa(userProfileFromProvider.ID), req.Provider)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {

				tmpUser := repo.User{
					ProviderID:    strconv.Itoa(userProfileFromProvider.ID),
					UserID:        hashUserID,
					EncryptedName: encryptedName,
					Email:         userProfileFromProvider.Email,
					Image:         userProfileFromProvider.Picture,
					Provider:      req.Provider,
					Loc:           userProfileFromProvider.Location,
				}

				if errCreating := s.userRepo.CreateUser(ctx, &tmpUser); errCreating != nil {
					slog.ErrorContext(ctx, fmt.Sprintf("[google] error creating... user: %v", errCreating))
					return nil, "", &appErr.ErrInternalServerError
				}

				user = &tmpUser
				newUser = false
			} else {
				slog.ErrorContext(ctx, fmt.Sprintf("[github] error why finding... user: %v", err))
				return nil, "", &appErr.ErrInternalServerError
			}
		}

		if newUser {
			if err = s.userRepo.UpdateUserByProvider(ctx, user); err != nil {
				slog.ErrorContext(ctx, fmt.Sprintf("[github] error why updating... user: %v", err))
				return nil, "", &appErr.ErrInternalServerError
			}
		}

		if err = s.sessionRepo.RevokeSessionByUserID(ctx, user.UserID); err != nil {
			slog.ErrorContext(ctx, fmt.Sprintf("[github] error why revoke... session: %v", err))
			return nil, "", &appErr.ErrInternalServerError
		}

		userClaims := &provider.UserProfileClaims{
			Name:    userProfileFromProvider.Name,
			Email:   userProfileFromProvider.Email,
			Picture: userProfileFromProvider.Picture,
		}

		session := repo.Session{
			SessionID:    sessionID,
			UserID:       user.UserID,
			RefreshToken: refreshToken,
			IsRevoked:    false,
			ExpiresAt:    currentTime.Add(time.Duration(RefreshTokenDurationSeconds) * time.Second),
		}

		if err = s.sessionRepo.CreateSession(ctx, &session); err != nil {
			slog.ErrorContext(ctx, "[github] error creating... session", slog.Any("err", err))
			return nil, "", &appErr.ErrInternalServerError
		}

		response, err = s.generateToken(ctx, sessionID, user.UserID, userClaims)
		if err != nil {
			slog.ErrorContext(ctx, "[github] error generating... access token", slog.Any("err", err))
			return nil, "", &appErr.ErrInternalServerError
		}

	case app.DISCORD:

		accessToken, err := s.discordOAuth2.ExchangeToken(ctx, req.AuthCode)
		if err != nil {
			slog.ErrorContext(ctx, fmt.Sprintf("[discord] error exchanging token: %v", err))
			return nil, "", &appErr.ErrUnauthorized
		}

		userProfileFromProvider, err := s.discordOAuth2.GetProfileFromProvider(ctx, *accessToken)
		if err != nil {
			slog.ErrorContext(ctx, fmt.Sprintf("[discord] error getting profile from provider: %v", err))
			return nil, "", &appErr.ErrUnauthorized
		}

		encryptedName, err := s.encryptor.Encrypt(userProfileFromProvider.Name)
		if err != nil {
			slog.ErrorContext(ctx, fmt.Sprintf("[discord] error encrypting... name: %v", err))
			return nil, "", &appErr.ErrInternalServerError
		}

		discordAvatarURL := discordAvatarURL(userProfileFromProvider.ID, userProfileFromProvider.Picture)

		newUser := true
		var user *repo.User

		user, err = s.userRepo.FirstUserByProvider(ctx, userProfileFromProvider.ID, req.Provider)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {

				tmpUser := repo.User{
					ProviderID:    userProfileFromProvider.ID,
					UserID:        hashUserID,
					EncryptedName: encryptedName,
					Email:         userProfileFromProvider.Email,
					Image:         discordAvatarURL,
					Provider:      req.Provider,
					Loc:           userProfileFromProvider.Location,
				}

				if errCreating := s.userRepo.CreateUser(ctx, &tmpUser); errCreating != nil {
					slog.ErrorContext(ctx, fmt.Sprintf("[google] error creating... user: %v", errCreating))
					return nil, "", &appErr.ErrInternalServerError
				}

				user = &tmpUser
				newUser = false
			} else {
				slog.ErrorContext(ctx, fmt.Sprintf("[discord] error why finding... user: %v", err))
				return nil, "", &appErr.ErrInternalServerError
			}
		}

		if newUser {
			if err = s.userRepo.UpdateUserByProvider(ctx, user); err != nil {
				slog.ErrorContext(ctx, fmt.Sprintf("[github] error why updating... user: %v", err))
				return nil, "", &appErr.ErrInternalServerError
			}
		}

		if err = s.sessionRepo.RevokeSessionByUserID(ctx, user.UserID); err != nil {
			slog.ErrorContext(ctx, fmt.Sprintf("[discord] error why revoke... session: %v", err))
			return nil, "", &appErr.ErrInternalServerError
		}

		userClaims := &provider.UserProfileClaims{
			Name:    userProfileFromProvider.Name,
			Email:   userProfileFromProvider.Email,
			Picture: discordAvatarURL,
		}

		session := repo.Session{
			SessionID:    sessionID,
			UserID:       user.UserID,
			RefreshToken: refreshToken,
			IsRevoked:    false,
			ExpiresAt:    currentTime.Add(time.Duration(RefreshTokenDurationSeconds) * time.Second),
		}

		if err = s.sessionRepo.CreateSession(ctx, &session); err != nil {
			slog.ErrorContext(ctx, "[discord] error creating... session", slog.Any("err", err))
			return nil, "", &appErr.ErrInternalServerError
		}

		response, err = s.generateToken(ctx, sessionID, user.UserID, userClaims)
		if err != nil {
			slog.ErrorContext(ctx, "[discord] error generating... access token", slog.Any("err", err))
			return nil, "", &appErr.ErrInternalServerError
		}

	case app.TIKTOK:
	}

	return response, refreshToken, nil
}

func (s *authService) RefreshToken(ctx context.Context, payload *middleware.TokenPayload, refreshToken string) (*Response, string, error) {
	currentTime := s.newTime()

	session, err := s.sessionRepo.FindByRefreshToken(ctx, refreshToken)
	if err != nil {
		slog.ErrorContext(ctx, "refresh token not found", slog.Any("err", err))
		return nil, "", &appErr.ErrUnauthorized
	}

	if session.SessionID != payload.ID || isSessionExpired(session, currentTime) {
		if err = s.sessionRepo.RevokeSessionBySessionID(ctx, session.SessionID); err != nil {
			slog.ErrorContext(ctx, "failed to revoke old session", slog.Any("err", err))
			return nil, "", &appErr.ErrInternalServerError
		}

		slog.ErrorContext(ctx, "session ID mismatch revoke this session", slog.String("sessionID", session.SessionID))
		return nil, "", &appErr.ErrUnauthorized
	}

	if isSessionRevoked(session) {
		slog.ErrorContext(ctx, "session is revoked or expired")
		return nil, "", &appErr.ErrUnauthorized
	}

	if err = s.sessionRepo.RevokeSessionBySessionID(ctx, session.SessionID); err != nil {
		slog.ErrorContext(ctx, "failed to revoke old session", slog.Any("err", err))
		return nil, "", &appErr.ErrInternalServerError
	}

	user, err := s.userRepo.FirstUserByHashUserID(ctx, session.UserID)
	if err != nil {
		slog.ErrorContext(ctx, "user not found", slog.Any("err", err))
		return nil, "", &appErr.ErrUnauthorized
	}

	decryptedName, err := s.encryptor.Decrypt(user.EncryptedName)
	if err != nil {
		slog.ErrorContext(ctx, "unable to decrypting... user name", slog.Any("err", err))
		return nil, "", &appErr.ErrInternalServerError
	}

	claims := provider.UserProfileClaims{
		Name:    decryptedName,
		Email:   user.Email,
		Picture: user.Image,
	}

	newSessionID := s.newUUID()
	newRefreshToken := s.newUUID()

	newSession := repo.Session{
		SessionID:    newSessionID,
		UserID:       user.UserID,
		RefreshToken: newRefreshToken,
		IsRevoked:    false,
		ExpiresAt:    currentTime.Add(time.Duration(RefreshTokenDurationSeconds) * time.Second),
		CreatedAt:    currentTime,
	}

	if err = s.sessionRepo.CreateSession(ctx, &newSession); err != nil {
		slog.ErrorContext(ctx, "error creating... new session", slog.Any("err", err))
		return nil, "", &appErr.ErrInternalServerError
	}

	response, err := s.generateToken(ctx, newSessionID, user.UserID, &claims)
	if err != nil {
		slog.ErrorContext(ctx, "failed to generate... new access token", slog.Any("err", err))
		return nil, "", &appErr.ErrInternalServerError
	}

	return response, newRefreshToken, nil
}

func (s *authService) SignOut(ctx context.Context, payload *middleware.TokenPayload) error {
	return s.sessionRepo.RevokeSessionByUserID(ctx, payload.Subject)
}

func isSessionRevoked(session *repo.Session) bool {
	return session.IsRevoked
}

func isSessionExpired(session *repo.Session, now time.Time) bool {
	return session.ExpiresAt.Before(now)
}

func (s *authService) generateToken(ctx context.Context, sessionID string, userID string, payload *provider.UserProfileClaims) (*Response, error) {
	claims := middleware.TokenPayload{
		AdditionalInfo: middleware.AdditionalInfoData{
			Name:  payload.Name,
			Email: payload.Email,
			Image: payload.Picture,
		},
		RegisteredClaims: jwt.RegisteredClaims{
			ID:        sessionID,
			Subject:   userID,
			ExpiresAt: jwt.NewNumericDate(s.newTime().Add(time.Duration(AccessTokenDurationSeconds) * time.Second)),
			IssuedAt:  jwt.NewNumericDate(s.newTime()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)

	accessToken, err := token.SignedString(s.conf.Auth.RSASessionPrivateKey)
	if err != nil {
		slog.ErrorContext(ctx, "error signing... token", slog.Any("error", err))
		return &Response{}, &appErr.ErrInternalServerError
	}

	response := Response{
		AccessToken: accessToken,
		ExpiredAt:   jwt.NewNumericDate(s.newTime().Add(time.Duration(AccessTokenDurationSeconds) * time.Second)),
	}

	return &response, nil
}

func discordAvatarURL(userID, avatarHash string) string {
	if avatarHash == "" {
		return app.DiscordAvartarURLOmit
	}
	ext := "png"
	if strings.HasPrefix(avatarHash, "a_") {
		ext = "gif"
	}
	return fmt.Sprintf("%s/%s/%s.%s", app.DiscrodAvartarURLPrefix, userID, avatarHash, ext)
}
