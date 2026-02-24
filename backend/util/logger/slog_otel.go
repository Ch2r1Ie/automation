package logger

import (
	"context"
	"fmt"
	"log/slog"

	"go.opentelemetry.io/otel/trace"
)

const (
	TRACE_KEY = "traceId"
	SPEN_KEY  = "spanId"
)

type otelHandler struct {
	Next slog.Handler
}

func (h otelHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return otelHandler{Next: h.Next.WithAttrs(attrs)}
}

func (h otelHandler) WithGroup(name string) slog.Handler {
	return otelHandler{Next: h.Next.WithGroup(name)}
}

func (h otelHandler) Enabled(ctx context.Context, level slog.Level) bool {
	return h.Next.Enabled(ctx, level)
}

func (h otelHandler) Handle(ctx context.Context, record slog.Record) error {
	fmt.Println("otelHandler.Handle called")
	if ctx == nil {
		return h.Next.Handle(ctx, record)
	}

	span := trace.SpanFromContext(ctx)
	if !span.IsRecording() {
		return h.Next.Handle(ctx, record)
	}

	spanContext := span.SpanContext()
	if spanContext.HasTraceID() {
		record.AddAttrs(slog.String(TRACE_KEY, spanContext.TraceID().String()))
	}

	if spanContext.HasSpanID() {
		record.AddAttrs(slog.String(SPEN_KEY, spanContext.SpanID().String()))
	}

	return h.Next.Handle(ctx, record)
}
