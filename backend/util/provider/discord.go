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

type DiscordOAuth2 interface {
	ExchangeToken(ctx context.Context, code string) (*string, error)
	GetProfileFromProvider(ctx context.Context, accessToken string) (*UserProfileFromProviderDiscord, error)
}

func (provider *discordProvider) ExchangeToken(ctx context.Context, code string) (*string, error) {
	payload := url.Values{
		"code":          {code},
		"client_id":     {provider.discordOAuth2.ClientID},
		"client_secret": {provider.discordOAuth2.ClientSecret},
		"redirect_uri":  {provider.discordOAuth2.RedirectURL},
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

func (provider *discordProvider) GetProfileFromProvider(ctx context.Context, accessToken string) (*UserProfileFromProviderDiscord, error) {
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

	var profile UserProfileFromProviderDiscord
	if err := json.NewDecoder(resp.Body).Decode(&profile); err != nil {
		return nil, fmt.Errorf("[discord] failed to decode userinfo response: %w", err)
	}

	return &profile, nil
}
