package repo

import (
	"context"
)

type UserRepository interface {
	CountUser(ctx context.Context) (int64, error)

	FirstUserByHashUserID(ctx context.Context, userID string) (*User, error)
	FirstUserByEmail(ctx context.Context, email string) (*User, error)
	FirstUserByProvider(ctx context.Context, providerID string, provider string) (*User, error)

	CreateUser(ctx context.Context, user *User) error
	UpdateUserByProvider(ctx context.Context, user *User) error
}

func (r *userRepository) CreateUser(ctx context.Context, user *User) error {
	return r.db.WithContext(ctx).Model(&User{}).Create(user).Error
}

func (r *userRepository) FirstUserByHashUserID(ctx context.Context, hashUserID string) (*User, error) {
	var user User

	if err := r.db.
		WithContext(ctx).
		Where("user_id = ?", hashUserID).
		First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *userRepository) FirstUserByEmail(ctx context.Context, email string) (*User, error) {
	var user User

	if err := r.db.
		WithContext(ctx).
		Where("email = ?", email).
		First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *userRepository) FirstUserByProvider(ctx context.Context, providerID string, provider string) (*User, error) {
	var user User

	if err := r.db.
		WithContext(ctx).
		Where("provider_id = ? AND provider = ?", providerID, provider).
		First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *userRepository) UpdateUserByProvider(ctx context.Context, user *User) error {
	updateTxn := map[string]interface{}{
		"encrypted_name": user.EncryptedName,
		"email":          user.Email,
		"image":          user.Image,
	}

	if err := r.db.
		WithContext(ctx).
		Model(&User{}).
		Where("provider_id = ? AND provider = ?", user.ProviderID, user.Provider).
		Updates(updateTxn).Error; err != nil {
		return err
	}

	return nil
}

func (r *userRepository) CountUser(ctx context.Context) (int64, error) {
	var count int64
	if err := r.db.WithContext(ctx).Model(&User{}).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}
