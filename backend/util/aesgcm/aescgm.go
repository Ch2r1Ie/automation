package aesgcm

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io"
)

const nonceSize = 12

type AESgcmCrypto struct {
	cipherAEAD cipher.AEAD
}

func New(key string) (*AESgcmCrypto, error) {
	keyBytes := []byte(key)
	if len(keyBytes) != 16 && len(keyBytes) != 24 && len(keyBytes) != 32 {
		return nil, fmt.Errorf("invalid AES key size: must be 16, 24, or 32 bytes")
	}

	block, err := aes.NewCipher(keyBytes)
	if err != nil {
		return nil, err
	}

	aead, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	return &AESgcmCrypto{cipherAEAD: aead}, nil
}

func (c *AESgcmCrypto) Encrypt(plaintext string) (string, error) {
	if len(plaintext) == 0 {
		return "", nil
	}

	nonce := make([]byte, nonceSize)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", fmt.Errorf("cannot generate nonce: %v", err)
	}

	ciphertext := c.cipherAEAD.Seal(nil, nonce, []byte(plaintext), nil)
	combined := append(nonce, ciphertext...)

	return base64.StdEncoding.EncodeToString(combined), nil
}

func (c *AESgcmCrypto) Decrypt(base64ciphertext string) (string, error) {
	if len(base64ciphertext) == 0 {
		return "", nil
	}

	combined, err := base64.StdEncoding.DecodeString(base64ciphertext)
	if err != nil {
		return "", fmt.Errorf("cannot decode base64: %v", err)
	}

	if len(combined) < nonceSize {
		return "", fmt.Errorf("invalid ciphertext: too short")
	}

	nonce := combined[:nonceSize]
	ciphertext := combined[nonceSize:]

	plaintext, err := c.cipherAEAD.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", fmt.Errorf("decrypt failed: %v", err)
	}

	return string(plaintext), nil
}
