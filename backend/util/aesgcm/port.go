package aesgcm

type Encryptor interface {
	Encrypt(plaintext string) (string, error)
	Decrypt(base64ciphertext string) (string, error)
}
