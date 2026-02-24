package repo

import (
	"context"
	"time"
)

type SessionRepository interface {
	CountActiveUser(ctx context.Context, cutoff time.Time) (int64, error)

	FindByRefreshToken(ctx context.Context, refreshToken string) (*Session, error)
	FirstUser(ctx context.Context, sessionID string) (*User, error)

	CreateSession(ctx context.Context, session *Session) error

	RevokeSessionBySessionID(ctx context.Context, sessionID string) error
	RevokeSessionByUserID(ctx context.Context, userID string) error
}

func (r *sessionRepository) CreateSession(ctx context.Context, session *Session) error {
	return r.db.WithContext(ctx).Create(session).Error
}

func (r *sessionRepository) FirstUser(ctx context.Context, sessionID string) (*User, error) {
	var user User

	if err := r.db.
		WithContext(ctx).
		Joins("INNER JOIN sessions ON sessions.user_id = users.user_id").
		Where("sessions.session_id = ?", sessionID).
		First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *sessionRepository) FindByRefreshToken(ctx context.Context, refreshToken string) (*Session, error) {
	var session Session

	if err := r.db.
		WithContext(ctx).
		Where("refresh_token = ? AND is_revoked = 0", refreshToken).
		First(&session).Error; err != nil {
		return nil, err
	}

	return &session, nil
}

func (r *sessionRepository) RevokeSessionBySessionID(ctx context.Context, sessionID string) error {
	return r.db.
		WithContext(ctx).
		Model(&Session{}).
		Where("session_id = ?", sessionID).
		Update("is_revoked", true).Error
}

func (r *sessionRepository) RevokeSessionByUserID(ctx context.Context, userID string) error {
	return r.db.
		WithContext(ctx).
		Model(&Session{}).
		Where("user_id = ?", userID).
		Update("is_revoked", true).Error
}

func (r *sessionRepository) CountActiveUser(ctx context.Context, cutoff time.Time) (int64, error) {
	var count int64

	if err := r.db.WithContext(ctx).
		Model(&Session{}).
		Where("created_at > ?", cutoff).
		Select("COUNT(DISTINCT user_id)").
		Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}
