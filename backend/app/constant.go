package app

var Providers = map[string]bool{
	GOOGLE:  true,
	DISCORD: true,
	GITHUB:  true,
}

var (
	GOOGLE  = "google"
	GITHUB  = "github"
	DISCORD = "discord"
	TIKTOK  = "tiktok"
)

var (
	DiscordAvartarURLOmit   = "https://cdn.discordapp.com/embed/avatars/0.png"
	DiscrodAvartarURLPrefix = "https://cdn.discordapp.com/avatars"
)

var (
	OWNER  = "owner"
	MEMBER = "member"
)

var (
	PENDING = "pending"
	DONE    = "done"
	REJECT  = "reject"
)
