package adapter

import (
	"log/slog"

	"go.opentelemetry.io/contrib/propagators/b3"
	"go.opentelemetry.io/otel/propagation"
	"resty.dev/v3"
)

func AddTraceID(c *resty.Client, r *resty.Request) error {
	ctx := r.Context()

	w3cPropagator := propagation.TraceContext{}
	w3cPropagator.Inject(ctx, propagation.HeaderCarrier(r.Header))

	b3Propagator := b3.New()
	b3Propagator.Inject(ctx, propagation.HeaderCarrier(r.Header))

	slog.InfoContext(ctx, "Request API endpoint :: "+r.URL, "request", r.Body)
	return nil
}

func LogResponse(c *resty.Client, r *resty.Response) error {
	ctx := r.Request.Context()
	req := r.Request

	slog.InfoContext(ctx, "Response API endpoint :: "+req.URL, "status", r.Status(), "response", r.Result())
	return nil
}
