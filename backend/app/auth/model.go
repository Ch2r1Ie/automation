package auth

import "github.com/golang-jwt/jwt/v5"

type AuthReq struct {
	AuthCode string `json:"authCode"`
	Provider string `json:"provider"`
}

type Response struct {
	AccessToken string           `json:"accessToken"`
	ExpiredAt   *jwt.NumericDate `json:"expiredAt"`
}
