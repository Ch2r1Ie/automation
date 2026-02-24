package middleware

import "github.com/golang-jwt/jwt/v5"

type CustomClaims struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Image    string `json:"image"`
	Sub      string `json:"sub"`
	Provider string `json:"provider"`
	jwt.RegisteredClaims
}

type AdditionalInfoData struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Image string `json:"image"`
}

type TokenPayload struct {
	AdditionalInfo AdditionalInfoData `json:"additionalInfo"`
	jwt.RegisteredClaims
}
