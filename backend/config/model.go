package config

import (
	"crypto/rsa"
	"time"

	"golang.org/x/oauth2"
)

type Config struct {
	App           App
	Auth          Auth
	GoogleOAuth2  *oauth2.Config
	GithubOAuth2  *oauth2.Config
	DiscordOAuth2 *oauth2.Config
	TiktokOAuth2  *oauth2.Config
	XOAuth2       *oauth2.Config
	DB            Database
	Resty         Resty
}

type App struct {
	LogSecret   string
	Header      string
	Name        string
	Environment string
	Port        string
}

type Database struct {
	Host         string
	Port         string
	Username     string
	Password     string
	DBName       string
	MaxOpenConns int
	MaxIdleConns int
	MaxLifetime  time.Duration
}

type Payment struct {
	FrontendEndpoint string
	LogSecret        string
	WebhookSecret    string
}
type Auth struct {
	RSASessionPrivateKey *rsa.PrivateKey
	RSASessionPublicKey  *rsa.PublicKey
}

type Resty struct {
	Path string
}
