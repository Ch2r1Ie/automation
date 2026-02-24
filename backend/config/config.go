package config

import (
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func LoadEnvironment() {
	if err := godotenv.Load("./config/.env"); err != nil {
		panic("Error loading .env file")
	}
}

func InitEnv(config *Config) error {
	LoadEnvironment()

	rsaSessionPrivateKey, rsaSessionPublicKey := initRSAKeyPair(
		os.Getenv("RSA_SESSION_PRIVATE_KEY"),
		os.Getenv("RSA_SESSION_PUBLIC_KEY"),
	)

	config.App = App{
		Name:        os.Getenv("APP_NAME"),
		Port:        os.Getenv("APP_PORT"),
		Environment: os.Getenv("APP_ENV"),
		LogSecret:   os.Getenv("APP_LOG_SECRET"),
	}

	config.Auth = Auth{
		RSASessionPrivateKey: rsaSessionPrivateKey,
		RSASessionPublicKey:  rsaSessionPublicKey,
	}

	config.GoogleOAuth2 = &oauth2.Config{
		ClientID:     os.Getenv("PROVIDER_GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("PROVIDER_GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("PROVIDER_GOOGLE_REDIRECT_URI"),
		Endpoint:     google.Endpoint,
	}

	config.GithubOAuth2 = &oauth2.Config{
		ClientID:     os.Getenv("PROVIDER_GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("PROVIDER_GITHUB_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("PROVIDER_GITHUB_REDIRECT_URI"),
		Endpoint:     google.Endpoint,
	}

	config.DiscordOAuth2 = &oauth2.Config{
		ClientID:     os.Getenv("PROVIDER_DISCORD_CLIENT_ID"),
		ClientSecret: os.Getenv("PROVIDER_DISCORD_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("PROVIDER_DISCORD_REDIRECT_URI"),
		Endpoint:     google.Endpoint,
	}

	config.DB = Database{
		Host:         os.Getenv("USER_DB_HOST"),
		Port:         os.Getenv("USER_DB_PORT"),
		Username:     os.Getenv("USER_DB_USERNAME"),
		Password:     os.Getenv("USER_DB_PASSWORD"),
		DBName:       os.Getenv("USER_DB_DBNAME"),
		MaxOpenConns: 10,
		MaxIdleConns: 10,
		MaxLifetime:  300,
	}

	return nil
}

func parseRSAPrivateKeyFromString(pemStr string) (*rsa.PrivateKey, error) {
	decoded, err := base64.StdEncoding.DecodeString(pemStr)
	if err == nil {
		pemStr = string(decoded)
	} else {
		pemStr = strings.ReplaceAll(pemStr, `\n`, "\n")
	}

	block, _ := pem.Decode([]byte(pemStr))
	if block == nil || (block.Type != "PRIVATE KEY" && block.Type != "RSA PRIVATE KEY") {
		return nil, fmt.Errorf("invalid PEM block")
	}

	var parsedKey interface{}
	if block.Type == "PRIVATE KEY" {
		parsedKey, err = x509.ParsePKCS8PrivateKey(block.Bytes)
	} else {
		parsedKey, err = x509.ParsePKCS1PrivateKey(block.Bytes)
	}
	if err != nil {
		return nil, fmt.Errorf("failed to parse private key: %w", err)
	}

	rsaKey, ok := parsedKey.(*rsa.PrivateKey)
	if !ok {
		return nil, fmt.Errorf("not an RSA private key")
	}
	return rsaKey, nil
}

func parseRSAPublicKeyFromString(pemStr string) (*rsa.PublicKey, error) {
	decoded, err := base64.StdEncoding.DecodeString(pemStr)
	if err == nil {
		pemStr = string(decoded)
	} else {
		pemStr = strings.ReplaceAll(pemStr, `\n`, "\n")
	}

	block, _ := pem.Decode([]byte(pemStr))
	if block == nil || block.Type != "PUBLIC KEY" {
		return nil, fmt.Errorf("invalid PEM block")
	}

	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return nil, fmt.Errorf("failed to parse PKIX public key: %w", err)
	}

	rsaPubKey, ok := pub.(*rsa.PublicKey)
	if !ok {
		return nil, fmt.Errorf("not an RSA public key")
	}
	return rsaPubKey, nil
}

func initRSAKeyPair(privStr string, pubStr string) (*rsa.PrivateKey, *rsa.PublicKey) {
	rsaSessionPrivateKey, err := parseRSAPrivateKeyFromString(privStr)
	if err != nil {
		log.Fatal("Failed to load RSA session private key:", err)
	}

	rsaSessionPublicKey, err := parseRSAPublicKeyFromString(pubStr)
	if err != nil {
		log.Fatal("Failed to load RSA session public key:", err)
	}

	return rsaSessionPrivateKey, rsaSessionPublicKey
}
