package auth

import (
	"net/http"
	"time"

	"automation/util/middleware"

	"github.com/labstack/echo/v4"
)

func setCookies(c echo.Context, refreshToken string) {
	cookie := &http.Cookie{
		Name:     middleware.XRefreshToken,
		Value:    refreshToken,
		Path:     "/api/auth",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(30 * 24 * time.Hour),
		MaxAge:   30 * 24 * 60 * 60,
	}

	c.SetCookie(cookie)
}
