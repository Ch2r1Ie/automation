package main

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"runtime/debug"
	"sort"
	"strings"
	"syscall"
	"time"

	"automation/app/auth"
	"automation/config"
	"automation/db"
	"automation/util/adapter"
	"automation/util/aesgcm"
	"automation/util/provider"
	"automation/util/repo"

	appLog "automation/util/logger"
	appMiddleware "automation/util/middleware"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/olekukonko/tablewriter"
	"go.opentelemetry.io/otel/trace"
	"resty.dev/v3"
)

const (
	gracefulShutdownDuration = 10 * time.Second
	serverReadHeaderTimeout  = 10 * time.Second
	serverReadTimeout        = 10 * time.Second
	serverWriteTimeout       = 10 * time.Second
	handlerTimeout           = serverWriteTimeout - (time.Millisecond * 100)
)

type ctxKey string

const (
	XRefID          = "X-Ref-Id"
	refIDKey ctxKey = "ref-id"
)

func init() {
	if os.Getenv("GOMAXPROCS") != "" {
		runtime.GOMAXPROCS(0)
	} else {
		runtime.GOMAXPROCS(1)
	}
	if os.Getenv("GOMEMLIMIT") != "" {
		debug.SetMemoryLimit(-1)
	}
}

var cfg config.Config

func main() {
	if err := config.InitEnv(&cfg); err != nil {
		slog.Error("cannot init env: " + err.Error())
		return
	}

	appLog := appLog.New(appLog.GCPKeyReplacer)

	r, stop := router(&cfg)
	defer stop()

	srv := &http.Server{
		Addr:              ":" + cfg.App.Port,
		Handler:           r,
		ReadHeaderTimeout: serverReadHeaderTimeout,
		ReadTimeout:       serverReadTimeout,
		WriteTimeout:      serverWriteTimeout,
		MaxHeaderBytes:    1 << 20,
	}

	go gracefully(srv)

	fmt.Println("running at : " + cfg.App.Port)
	if err := srv.ListenAndServe(); err != http.ErrServerClosed {
		appLog.Error("HTTP server ListenAndServe: " + err.Error())
		return
	}

	slog.Info("bye")
}

func router(conf *config.Config) (*echo.Echo, func()) {
	tracer := appLog.InitTracer(context.Background(), conf.App.Name)
	app := echo.New()

	middlewares(app, tracer, conf.App.Header)

	{
		app.GET("/health", health)
		app.GET("/metrics", metrics)
	}

	restful := resty.New().AddRequestMiddleware(adapter.AddTraceID).AddResponseMiddleware(adapter.LogResponse)
	mySQL := db.NewMySQL(cfg.App.Environment, &cfg.DB)
	userRepo, sessionRepo := repo.New(mySQL)
	google, github, discord, tiktok, x := provider.New(cfg.GoogleOAuth2, cfg.GithubOAuth2, cfg.DiscordOAuth2, cfg.TiktokOAuth2, cfg.XOAuth2)
	encryptor, _ := aesgcm.New(cfg.App.LogSecret)

	refreshTokenVerifyFunc := appMiddleware.NewRefreshTokenVerifyFunc(context.Background(), &conf.Auth)
	// sessionAuthenMiddleware := appMiddleware.NewSessionVerifyFunc(context.Background(), &conf.Auth)

	{
		authenService := auth.NewService(conf, userRepo, sessionRepo, google, github, discord, tiktok, x, encryptor, func() time.Time { return time.Now() }, uuid.NewString)
		authenHandler := auth.NewHandler(authenService)

		app.POST(`/api/v1/auth/register`, authenHandler.Register)
		app.POST(`/api/v1/auth/token-refresh`, authenHandler.RefreshToken, refreshTokenVerifyFunc)
		app.POST(`/api/v1/auth/sign-out`, authenHandler.SignOut, refreshTokenVerifyFunc)
	}

	_ = echoRoutes(app)

	return app, func() {
		restful.Close()
	}
}

func handlerTimeoutMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx, cancel := context.WithTimeout(c.Request().Context(), handlerTimeout)
		defer cancel()

		req := c.Request().WithContext(ctx)

		c.SetRequest(req)
		return next(c)
	}
}

func gracefully(srv *http.Server) {
	{
		ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
		defer cancel()
		<-ctx.Done()
	}

	d := time.Duration(gracefulShutdownDuration)
	slog.Info(fmt.Sprintf("shutting down in %d ...\n", d))

	ctx, cancel := context.WithTimeout(context.Background(), d)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		slog.Info("HTTP server Shutdown: " + err.Error())
	}
}

// go build -ldflags "-X main.commit=123456"
var commit string

var version string

func health(c echo.Context) error {
	h, err := os.Hostname()
	if err != nil {
		h = fmt.Sprintf("unknown host err: %s", err.Error())
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"hostname": h,
		"version":  strings.ReplaceAll(version, "\n", ""),
		"commit":   commit,
	})
}

type Size uint64

const (
	Byte Size = 1 << (10 * iota)
	KB
	MB
)

func toMB(b uint64) string {
	return fmt.Sprintf("%.2f MB", megabytes(b))
}

func megabytes(b uint64) float64 {
	return float64(b) / float64(MB)
}

func metrics(c echo.Context) error {
	var mem runtime.MemStats
	runtime.ReadMemStats(&mem)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"memory": map[string]interface{}{
			"alloc":        toMB(mem.Alloc),
			"totalAlloc":   toMB(mem.TotalAlloc),
			"sysAlloc":     toMB(mem.Sys),
			"heapInuse":    toMB(mem.HeapInuse),
			"heapIdle":     toMB(mem.HeapIdle),
			"heapReleased": toMB(mem.HeapReleased),
			"stackInuse":   toMB(mem.StackInuse),
			"stackSys":     toMB(mem.StackSys),
		},
	})
}

func xRefIDMiddleware(headerKey string) echo.MiddlewareFunc {
	if headerKey == "" {
		headerKey = XRefID
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			req := c.Request()
			ctx := req.Context()

			refID := req.Header.Get(headerKey)
			if refID == "" {
				refID = newUUID()
			}

			c.SetRequest(c.Request().WithContext(newRefIDContext(ctx, refID)))
			return next(c)
		}
	}
}

func newRefIDContext(ctx context.Context, refID string) context.Context {
	return context.WithValue(ctx, refIDKey, refID)
}

func newUUID() string {
	uuid, err := uuid.NewV7()
	if err != nil {
		slog.Error("Gen UUID error", "err", err)
	}

	return uuid.String()
}

func secureMiddleware() echo.MiddlewareFunc {
	return echoMiddleware.SecureWithConfig(echoMiddleware.SecureConfig{
		XSSProtection:         "1; mode=block",
		XFrameOptions:         "DENY",
		HSTSMaxAge:            3600,
		ContentSecurityPolicy: "default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';",
		ReferrerPolicy:        "strict-origin",
	})
}

func corsMiddleware() echo.MiddlewareFunc {
	return echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{
			http.MethodGet,
			http.MethodPut,
			http.MethodPost,
			http.MethodDelete,
		},
		AllowHeaders: []string{
			echo.HeaderOrigin,
			echo.HeaderContentType,
			echo.HeaderAccept,
			echo.HeaderAuthorization,
		},
	})
}

func middlewares(app *echo.Echo, tracer trace.Tracer, headerKey string) {
	app.Use(
		appLog.LoggerMiddleware(tracer),
		echoMiddleware.RequestID(),
		echoMiddleware.Recover(),
		handlerTimeoutMiddleware,
		xRefIDMiddleware(headerKey),
		secureMiddleware(),
		corsMiddleware(),
	)
}

func echoRoutes(app *echo.Echo) error {
	table := tablewriter.NewWriter(os.Stdout)

	routes := app.Routes()

	sort.Slice(routes, func(i, j int) bool {
		methodOrder := map[string]int{"GET": 1, "POST": 2, "PUT": 3, "DELETE": 4, "PATCH": 5}
		mi := methodOrder[routes[i].Method]
		mj := methodOrder[routes[j].Method]
		if mi != mj {
			return mi < mj
		}
		return routes[i].Path < routes[j].Path
	})

	for _, r := range routes {
		_ = table.Append([]string{r.Method, r.Path})
	}

	return table.Render()
}
