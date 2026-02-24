// Package provider implements an OAuth2 client provider for integrating
// with Google as an external authentication provider.
//
// It handles exchanging authorization codes for access tokens,
// retrieving user profile data from Google's userinfo endpoint,
// and mapping the results into a standard format expected by the application.
//
// This package abstracts the low-level token and profile interactions
// behind the GoogleOAuth2 interface for clean integration with other components.
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

type GoogleOAuth2 interface {
	ExchangeToken(ctx context.Context, code string) (*string, error)
	GetProfileFromProvider(ctx context.Context, token string) (*UserProfileFromProviderGoogle, error)
}

func (provider *googleProvider) ExchangeToken(ctx context.Context, code string) (*string, error) {
	payload := url.Values{
		"code":          {code},
		"client_id":     {provider.googleOAuth2.ClientID},
		"client_secret": {provider.googleOAuth2.ClientSecret},
		"redirect_uri":  {provider.googleOAuth2.RedirectURL},
		"grant_type":    {"authorization_code"},
	}

	req, err := http.NewRequestWithContext(ctx, "POST", string(googleOAuthTokenURL), strings.NewReader(payload.Encode()))
	if err != nil {
		return nil, fmt.Errorf("[google] failed to create token exchange request: %w", err)
	}
	req.Header.Set("Content-Type", contentTypeFormURLEncoded)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("[google] failed to send token exchange request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("[google] token exchange failed: %s", string(body))
	}

	var credentials credential
	if err := json.NewDecoder(resp.Body).Decode(&credentials); err != nil {
		return nil, fmt.Errorf("[google] failed to decode token response: %w", err)
	}

	return &credentials.AccessToken, nil
}

func (provider *googleProvider) GetProfileFromProvider(ctx context.Context, accessToken string) (*UserProfileFromProviderGoogle, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", string(googleOAuthUserInfoURL), nil)
	if err != nil {
		return nil, fmt.Errorf("[google] failed to create user info request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("[google] failed to call userinfo endpoint: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("[google] userinfo request failed: %d - %s", resp.StatusCode, string(body))
	}

	var profile UserProfileFromProviderGoogle
	if err := json.NewDecoder(resp.Body).Decode(&profile); err != nil {
		return nil, fmt.Errorf("[google] failed to decode userinfo response: %w", err)
	}

	return &profile, nil
}
