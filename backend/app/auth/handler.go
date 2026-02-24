package auth

import (
	"fmt"
	"log/slog"
	"net/http"

	"automation/util/middleware"

	appErr "automation/util/err"
	httpclient "automation/util/httpClient"

	"github.com/labstack/echo/v4"
)

type handler struct {
	srv Service
}

func NewHandler(srv Service) *handler {
	return &handler{srv: srv}
}

func (h *handler) Register(c echo.Context) error {
	ctx := c.Request().Context()

	var req AuthReq
	if err := c.Bind(&req); err != nil {
		slog.ErrorContext(ctx, fmt.Sprintf("error binding request: %v", err))
		return c.JSON(http.StatusBadRequest, appErr.ErrInvalidReq)
	}

	accessToken, refreshToken, err := h.srv.Register(ctx, &req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, appErr.NewErrorResponse(err))
	}

	setCookies(c, refreshToken)

	return c.JSON(http.StatusOK, httpclient.HTTPSuccessResponse(accessToken))
}

func (h *handler) RefreshToken(c echo.Context) error {
	ctx := c.Request().Context()

	refreshToken, ok := c.Get(middleware.XRefreshToken).(string)
	if !ok {
		slog.ErrorContext(ctx, "empty refresh token")
		return c.JSON(http.StatusUnauthorized, appErr.ErrUnauthorized)
	}

	payload, ok := c.Get(middleware.XSessionToken).(*middleware.TokenPayload)
	if !ok {
		slog.ErrorContext(ctx, "empty access token")
		return c.JSON(http.StatusUnauthorized, appErr.ErrUnauthorized)
	}

	newAccessToken, newRefreshToken, err := h.srv.RefreshToken(ctx, payload, refreshToken)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, appErr.NewErrorResponse(err))
	}

	setCookies(c, newRefreshToken)

	return c.JSON(http.StatusOK, httpclient.HTTPSuccessResponse(newAccessToken))
}

func (h *handler) SignOut(c echo.Context) error {
	ctx := c.Request().Context()

	payload, ok := c.Get(middleware.XSessionToken).(*middleware.TokenPayload)
	if !ok {
		slog.ErrorContext(ctx, "empty access token")
		return c.JSON(http.StatusUnauthorized, appErr.ErrUnauthorized)
	}

	if err := h.srv.SignOut(ctx, payload); err != nil {
		return c.JSON(http.StatusInternalServerError, appErr.NewErrorResponse(err))
	}

	return c.JSON(http.StatusOK, httpclient.HTTPSuccessResponse(nil))
}
