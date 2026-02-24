package adapter

import (
	"context"
	"fmt"
	"time"

	"automation/config"

	"resty.dev/v3"
)

type AI interface {
	AskAI(ctx context.Context, req Request) (*Response, error)
}

type chat struct {
	http *resty.Client
	cfg  config.Resty
}

const defaultTimeout = 10 * time.Minute

func New(http *resty.Client, cfg config.Resty) AI {
	http.SetTimeout(defaultTimeout)

	return &chat{http: http, cfg: cfg}
}

func (s *chat) AskAI(ctx context.Context, req Request) (*Response, error) {
	http := s.http.R().SetContext(ctx)

	resp := Response{}
	endpoint := s.cfg.Path

	r, err := http.
		SetBody(req).
		SetResult(&resp).
		Post(endpoint)
	if err != nil {
		return &resp, err
	}

	if r.IsError() {
		return &resp, fmt.Errorf("unexpected status %d: %s", r.StatusCode(), r.String())
	}

	return &resp, nil
}
