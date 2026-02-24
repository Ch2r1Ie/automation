package provider

import (
	"golang.org/x/oauth2"
)

func New(
	googleOAuth2 *oauth2.Config,
	githubOAuth2 *oauth2.Config,
	discordOAuth2 *oauth2.Config,
	tiktokOAuth2 *oauth2.Config,
	xOAuth2 *oauth2.Config,
) (*googleProvider, *githubProvider, *discordProvider, *tiktokProvider, *xProvider) {
	return &googleProvider{googleOAuth2: googleOAuth2},
		&githubProvider{githubOAuth2: githubOAuth2},
		&discordProvider{discordOAuth2: discordOAuth2},
		&tiktokProvider{tiktokOAuth2: tiktokOAuth2},
		&xProvider{xOAuth2: xOAuth2}
}

var (
	_ GoogleOAuth2  = (*googleProvider)(nil)
	_ GithubOAuth2  = (*githubProvider)(nil)
	_ DiscordOAuth2 = (*discordProvider)(nil)
	_ TiktokOAuth2  = (*tiktokProvider)(nil)
	_ XOAuth2       = (*xProvider)(nil)
)

const contentTypeFormURLEncoded = "application/x-www-form-urlencoded"

type oAuth2Url string

const (
	googleOAuthTokenURL    oAuth2Url = "https://oauth2.googleapis.com/token"
	googleOAuthUserInfoURL oAuth2Url = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json"
)

const (
	githubOAuthTokenURL    oAuth2Url = "https://github.com/login/oauth/access_token"
	githubOAuthUserInfoURL oAuth2Url = "https://api.github.com/user"
)

const (
	discordOAuthTokenURL    oAuth2Url = "https://discord.com/api/oauth2/token"
	discordOAuthUserInfoURL oAuth2Url = "https://discord.com/api/users/@me"
)

const (
	tiktokOAuthAuthorizeURL oAuth2Url = "https://www.tiktok.com/v2/auth/authorize/"
	tiktokOAuthTokenURL     oAuth2Url = "https://open.tiktokapis.com/v2/oauth/token/"
	tiktokOAuthUserInfoURL  oAuth2Url = "https://open.tiktokapis.com/v2/user/info/"
)

const (
	xOAuthTokenURL    oAuth2Url = "https://api.x.com/2/oauth2/token"
	xOAuthUserInfoURL oAuth2Url = "https://api.x.com/2/users/me"
)

type googleProvider struct {
	googleOAuth2 *oauth2.Config
}

type githubProvider struct {
	githubOAuth2 *oauth2.Config
}

type discordProvider struct {
	discordOAuth2 *oauth2.Config
}

type tiktokProvider struct {
	tiktokOAuth2 *oauth2.Config
}

type xProvider struct {
	xOAuth2 *oauth2.Config
}
