// Package repo defines the repository layer responsible for interacting with the data store, encapsulating query logic and persistence.
package repo

import (
	"gorm.io/gorm"
)

func New(db *gorm.DB) (
	*userRepository,
	*sessionRepository,
) {
	return &userRepository{db: db},
		&sessionRepository{db: db}
}

type sessionRepository struct {
	db *gorm.DB
}

type userRepository struct {
	db *gorm.DB
}
