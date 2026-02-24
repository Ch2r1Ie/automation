package logger

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log"
	"log/slog"
	"maps"
	"net/http"
	"os"
	"strings"

	"github.com/labstack/echo/v4"
	"go.opentelemetry.io/contrib/propagators/b3"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/trace"
)

var (
	ENV       = "local"
	LOG_LEVEL = "dev"
)

type ReplacerFunc func(groups []string, a slog.Attr) (slog.Attr, bool)

var defaultLogOutput io.Writer = os.Stdout

type bodyDumpResponseWriter struct {
	Writer io.Writer
	http.ResponseWriter
}

func (w bodyDumpResponseWriter) Write(b []byte) (int, error) {
	return w.Writer.Write(b)
}

func New(r ...ReplacerFunc) *slog.Logger {
	logLevel := &slog.LevelVar{}
	logLevel.Set(initLevel())

	opts := &slog.HandlerOptions{
		Level: logLevel,
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			for _, replace := range r {
				if newAttr, ok := replace(groups, a); ok {
					return newAttr
				}
			}
			return a
		},
		AddSource: true,
	}

	var handler slog.Handler = slog.NewJSONHandler(defaultLogOutput, opts)
	if strings.ToLower(ENV) == "local" {
		handler = slog.NewTextHandler(defaultLogOutput, opts)
	}

	logger := slog.New(otelHandler{
		Next: handler,
	})
	slog.SetDefault(logger)

	return logger
}

func InitTracer(ctx context.Context, service string) trace.Tracer {
	res, err := resource.New(ctx)
	if err != nil {
		log.Fatalf("failed to initialize resource: %e", err)
	}

	tp := sdktrace.NewTracerProvider(
		sdktrace.WithResource(res),
	)

	otel.SetTracerProvider(tp)

	propagator := propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
		b3.New(),
		b3.New(b3.WithInjectEncoding(b3.B3SingleHeader)),
	)
	otel.SetTextMapPropagator(propagator)

	return tp.Tracer(service)
}

func LoggerMiddleware(tracer trace.Tracer) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			ctx := c.Request().Context()
			req := c.Request()

			setB3TraceHeaders(req.Header)

			headers := map[string][]string{}
			maps.Copy(headers, req.Header)

			ctx = otel.GetTextMapPropagator().Extract(ctx, propagation.HeaderCarrier(req.Header))
			ctx, span := tracer.Start(ctx, c.Path())

			requestBodyBytes, _ := io.ReadAll(req.Body)
			req.Body = io.NopCloser(bytes.NewReader(requestBodyBytes))

			request := echo.Map{}
			if len(requestBodyBytes) > 0 {
				if err := json.Unmarshal(requestBodyBytes, &request); err != nil {
					slog.ErrorContext(ctx, "Error unmarshalling request body: "+err.Error())
				}
			}

			slog.InfoContext(ctx, "Request path :: "+req.RequestURI, "request body", request, "headers", headers)

			c.SetRequest(req.WithContext(ctx))

			resBody := new(bytes.Buffer)
			mw := io.MultiWriter(c.Response().Writer, resBody)
			writer := &bodyDumpResponseWriter{
				Writer:         mw,
				ResponseWriter: c.Response().Writer,
			}
			c.Response().Writer = writer

			if err := next(c); err != nil {
				c.Error(err)
			}

			newResBody := echo.Map{}
			if resBody.Len() > 0 {
				if err := json.Unmarshal(resBody.Bytes(), &newResBody); err != nil {
					slog.WarnContext(ctx, "Non-JSON or empty response body", "error", err.Error(), "raw_response", resBody.String())
				}
			}

			slog.InfoContext(ctx, "Response path :: "+req.RequestURI, "response status", c.Response().Status, "response body", newResBody)
			span.End()
			return nil
		}
	}
}

func setB3TraceHeaders(reqHeader http.Header) {
	if values, ok := reqHeader["B3"]; ok {
		if len(values) != 0 {
			b3Raw := values[0]
			b3Value := strings.Split(b3Raw, "-")

			if len(b3Value) == 4 {
				xb3TraceID := b3Value[0]
				xb3SpanID := b3Value[1]
				xB3Sampled := b3Value[2]
				xB3ParentSpanID := b3Value[3]

				if xB3Sampled == "0" {
					xB3Sampled = "1"

					newB3 := xb3TraceID + "-" + xb3SpanID + "-" + xB3Sampled + "-" + xB3ParentSpanID
					reqHeader.Set("B3", newB3)
				}
			}
		}
	}
}
