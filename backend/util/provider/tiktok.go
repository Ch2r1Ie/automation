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

type TiktokOAuth2 interface {
	ExchangeToken(ctx context.Context, code string) (*string, error)
	GetProfileFromProvider(ctx context.Context, accessToken string) (*UserProfileFromProviderTikTok, error)
}

func (provider *tiktokProvider) ExchangeToken(ctx context.Context, code string) (*string, error) {
	payload := url.Values{
		"code":          {code},
		"client_id":     {provider.tiktokOAuth2.ClientID},
		"client_secret": {provider.tiktokOAuth2.ClientSecret},
		"redirect_uri":  {provider.tiktokOAuth2.RedirectURL},
		"grant_type":    {"authorization_code"},
	}

	req, err := http.NewRequestWithContext(ctx, "POST", string(discordOAuthTokenURL), strings.NewReader(payload.Encode()))
	if err != nil {
		return nil, fmt.Errorf("[discord] failed to create token exchange request: %w", err)
	}
	req.Header.Set("Content-Type", contentTypeFormURLEncoded)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("[discord] failed to send token exchange request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("[discord] token exchange failed: %s", string(body))
	}

	var credentials credential
	if err := json.NewDecoder(resp.Body).Decode(&credentials); err != nil {
		return nil, fmt.Errorf("[discord] failed to decode token response: %w", err)
	}

	return &credentials.AccessToken, nil
}

func (provider *tiktokProvider) GetProfileFromProvider(ctx context.Context, accessToken string) (*UserProfileFromProviderTikTok, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", string(discordOAuthUserInfoURL), nil)
	if err != nil {
		return nil, fmt.Errorf("[discord] failed to create user info request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("[discord] failed to call userinfo endpoint: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("[discord] userinfo request failed: %d - %s", resp.StatusCode, string(body))
	}

	var profile UserProfileFromProviderTikTok
	if err := json.NewDecoder(resp.Body).Decode(&profile); err != nil {
		return nil, fmt.Errorf("[discord] failed to decode userinfo response: %w", err)
	}

	return &profile, nil
}
