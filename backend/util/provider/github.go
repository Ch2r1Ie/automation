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

type GithubOAuth2 interface {
	ExchangeToken(ctx context.Context, code string) (*string, error)
	GetProfileFromProvider(ctx context.Context, accessToken string) (*UserProfileFromProviderGithub, error)
}

func (provider *githubProvider) ExchangeToken(ctx context.Context, code string) (*string, error) {
	payload := url.Values{
		"code":          {code},
		"client_id":     {provider.githubOAuth2.ClientID},
		"client_secret": {provider.githubOAuth2.ClientSecret},
		"redirect_uri":  {provider.githubOAuth2.RedirectURL},
		"grant_type":    {"authorization_code"},
	}

	req, err := http.NewRequestWithContext(ctx, "POST", string(githubOAuthTokenURL), strings.NewReader(payload.Encode()))
	if err != nil {
		return nil, fmt.Errorf("[github] failed to create token exchange request: %w", err)
	}
	req.Header.Set("Content-Type", contentTypeFormURLEncoded)
	req.Header.Set("Accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("[github] failed to send token exchange request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("[github] token exchange failed: %s", string(body))
	}

	var credentials credential
	if err := json.NewDecoder(resp.Body).Decode(&credentials); err != nil {
		return nil, fmt.Errorf("[github] failed to decode token response: %w", err)
	}

	return &credentials.AccessToken, nil
}

func (provider *githubProvider) GetProfileFromProvider(ctx context.Context, accessToken string) (*UserProfileFromProviderGithub, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", string(githubOAuthUserInfoURL), nil)
	if err != nil {
		return nil, fmt.Errorf("[github] failed to create user info request: %w", err)
	}
	req.Header.Set("Authorization", "token "+accessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("[github] failed to call userinfo endpoint: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("[github] userinfo request failed: %d - %s", resp.StatusCode, string(body))
	}

	var profile UserProfileFromProviderGithub
	if err := json.NewDecoder(resp.Body).Decode(&profile); err != nil {
		return nil, fmt.Errorf("[github] failed to decode userinfo response: %w", err)
	}

	return &profile, nil
}
