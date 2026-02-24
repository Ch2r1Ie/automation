package provider

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
)

type XOAuth2 interface {
	ExchangeToken(ctx context.Context, code string, codeVerifier string) (*string, error)
	GetProfileFromProvider(ctx context.Context, accessToken string) (*UserProfileFromProviderX, error)
}

func (provider *xProvider) ExchangeToken(ctx context.Context, code string, codeVerifier string) (*string, error) {
	payload := url.Values{
		"grant_type":    {"authorization_code"},
		"code":          {code},
		"redirect_uri":  {provider.xOAuth2.RedirectURL},
		"client_id":     {provider.xOAuth2.ClientID},
		"code_verifier": {codeVerifier},
	}

	req, err := http.NewRequestWithContext(
		ctx,
		"POST",
		string(xOAuthTokenURL),
		strings.NewReader(payload.Encode()),
	)
	if err != nil {
		return nil, fmt.Errorf("[x] failed to create token exchange request: %w", err)
	}

	req.Header.Set("Content-Type", contentTypeFormURLEncoded)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("[x] failed to send token exchange request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("[x] token exchange failed: %s", string(body))
	}

	var tokenResponse struct {
		AccessToken string `json:"access_token"`
		TokenType   string `json:"token_type"`
		ExpiresIn   int    `json:"expires_in"`
		Scope       string `json:"scope"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&tokenResponse); err != nil {
		return nil, fmt.Errorf("[x] failed to decode token response: %w", err)
	}

	return &tokenResponse.AccessToken, nil
}

func (provider *xProvider) GetProfileFromProvider(ctx context.Context, accessToken string) (*UserProfileFromProviderX, error) {
	req, err := http.NewRequestWithContext(
		ctx,
		"GET",
		string(xOAuthUserInfoURL),
		nil,
	)
	if err != nil {
		return nil, fmt.Errorf("[x] failed to create user info request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("[x] failed to call userinfo endpoint: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("[x] userinfo request failed: %d - %s",
			resp.StatusCode,
			string(body),
		)
	}

	var profileResponse struct {
		Data UserProfileFromProviderX `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&profileResponse); err != nil {
		return nil, fmt.Errorf("[x] failed to decode userinfo response: %w", err)
	}

	return &profileResponse.Data, nil
}
