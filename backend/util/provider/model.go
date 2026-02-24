package provider

type UserProfileFromProviderGoogle struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Picture  string `json:"picture"`
	Location string `json:"locale"`
}

type UserProfileFromProviderGithub struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Picture  string `json:"avatar_url"`
	Location string `json:"location"`
}

type UserProfileFromProviderDiscord struct {
	ID       string `json:"id"`
	Name     string `json:"username"`
	Email    string `json:"email"`
	Picture  string `json:"avatar"`
	Location string `json:"locale"`
}

type UserProfileFromProviderTikTok struct {
	ID       string `json:"id"`
	Name     string `json:"username"`
	Email    string `json:"email"`
	Picture  string `json:"avatar"`
	Location string `json:"locale"`
}

type UserProfileClaims struct {
	Name    string `json:"username"`
	Email   string `json:"email"`
	Picture string `json:"picture"`
}

type credential struct {
	AccessToken string `json:"access_token"`
}

type UserProfileFromProviderX struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Username string `json:"username"`
}
