package middleware

import (
	"context"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"automation/config"
	appErr "automation/util/err"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func NewSessionVerifyFunc(ctx context.Context, cfg *config.Auth) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			JWTToken := strings.TrimSpace(strings.Replace(c.Request().Header.Get(AUTHORIZATION), "Bearer ", "", 1))
			if JWTToken == "" {
				slog.ErrorContext(ctx, "missing Authorization bearer")
				return c.JSON(http.StatusUnauthorized, appErr.NewErrorResponse(&appErr.ErrUnauthorized))
			}

			parsedToken, err := jwt.ParseWithClaims(JWTToken, &TokenPayload{}, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
					slog.ErrorContext(ctx, "unexpected signing method", slog.String("alg", token.Header["alg"].(string)))
					return nil, jwt.ErrSignatureInvalid
				}
				return cfg.RSASessionPublicKey, nil
			}, jwt.WithExpirationRequired())
			if err != nil || !parsedToken.Valid {
				slog.ErrorContext(ctx, "invalid JWT token", slog.String("error", err.Error()))
				return c.JSON(http.StatusUnauthorized, appErr.NewErrorResponse(&appErr.ErrUnauthorized))
			}

			claims, ok := parsedToken.Claims.(*TokenPayload)
			if !ok {
				slog.ErrorContext(ctx, "invalid token claims")
				return c.JSON(http.StatusUnauthorized, appErr.NewErrorResponse(&appErr.ErrUnauthorized))
			}

			if claims.ExpiresAt == nil || claims.ExpiresAt.Time.Before(time.Now()) {
				slog.ErrorContext(ctx, "token expired", slog.Time("exp", claims.ExpiresAt.Time))
				return c.JSON(http.StatusUnauthorized, appErr.NewErrorResponse(&appErr.ErrUnauthorized))
			}

			if claims.Subject == "" && claims.ID == "" {
				slog.ErrorContext(ctx, "missing session ID in claims")
				return c.JSON(http.StatusUnauthorized, appErr.NewErrorResponse(&appErr.ErrUnauthorized))
			}

			c.Set(XSessionToken, claims)

			return next(c)
		}
	}
}

func NewRefreshTokenVerifyFunc(ctx context.Context, cfg *config.Auth) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			JWTToken := strings.TrimSpace(strings.Replace(c.Request().Header.Get(AUTHORIZATION), "Bearer ", "", 1))
			if JWTToken == "" {
				slog.ErrorContext(ctx, "missing Authorization bearer")
				return c.JSON(http.StatusUnauthorized, appErr.NewErrorResponse(&appErr.ErrUnauthorized))
			}

			parsedToken, err := jwt.ParseWithClaims(JWTToken, &TokenPayload{}, func(token *jwt.Token) (interface{}, error) {
				return cfg.RSASessionPublicKey, nil
			}, jwt.WithoutClaimsValidation())

			if err != nil || !parsedToken.Valid {
				slog.ErrorContext(ctx, "invalid JWT token", slog.String("error", err.Error()))
				return c.JSON(http.StatusUnauthorized, appErr.NewErrorResponse(&appErr.ErrUnauthorized))
			}

			tokenPayload, ok := parsedToken.Claims.(*TokenPayload)
			if !ok {
				slog.ErrorContext(ctx, "invalid token claims")
				return c.JSON(http.StatusUnauthorized, appErr.NewErrorResponse(&appErr.ErrUnauthorized))
			}

			refreshCookie, err := c.Cookie(XRefreshToken)
			if err != nil {
				slog.ErrorContext(ctx, "invalid refresh token cookie", slog.Any("error", err))
				return c.JSON(http.StatusUnauthorized, appErr.NewErrorResponse(&appErr.ErrUnauthorized))
			}

			refreshToken := refreshCookie.Value
			if refreshToken == "" {
				slog.ErrorContext(ctx, "refresh_token cookie is empty")
				return c.JSON(http.StatusUnauthorized, appErr.NewErrorResponse(&appErr.ErrUnauthorized))
			}

			c.Set(XSessionToken, tokenPayload)
			c.Set(XRefreshToken, refreshToken)

			return next(c)
		}
	}
}
