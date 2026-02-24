package repo

import "time"

type User struct {
	ID            uint64 `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	UserID        string `gorm:"column:user_id;size:255;not null" json:"userId"`
	ProviderID    string `gorm:"column:provider_id;size:100;not null" json:"providerId"`
	EncryptedName string `gorm:"column:encrypted_name;size:255" json:"encryptedName,omitempty"`
	Email         string `gorm:"column:email;size:255" json:"email,omitempty"`
	Image         string `gorm:"column:image;size:2048" json:"image,omitempty"`
	Provider      string `gorm:"column:provider;size:100;not null" json:"provider"`
	Loc           string `gorm:"column:loc" json:"loc"`
}

func (User) TableName() string {
	return "tbl_user"
}

type Session struct {
	SessionID    string    `gorm:"column:session_id"`
	UserID       string    `gorm:"column:user_id"`
	RefreshToken string    `gorm:"column:refresh_token"`
	IsRevoked    bool      `gorm:"column:is_revoked;default:false"`
	CreatedAt    time.Time `gorm:"column:created_at;autoCreateTime"`
	ExpiresAt    time.Time `gorm:"column:expires_at"`
}

func (Session) TableName() string {
	return "tbl_session"
}
