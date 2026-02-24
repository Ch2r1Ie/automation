package logger

import (
	"bytes"
	"os"
	"testing"
)

func TestNewLogger(t *testing.T) {
	t.Run("ENV not set logger handler should be JSON Handler", func(t *testing.T) {
		os.Unsetenv("ENV")
		buf := bytes.NewBuffer([]byte{})

		defaultLogOutput = buf
		defer func() { defaultLogOutput = os.Stdout }()

		l := New()

		_, ok := l.Handler().(otelHandler)
		if !ok {
			t.Errorf("ENV local expect handler type is logger.otelHandler but actual is %T", l.Handler())
		}
	})
	t.Run("ENV local logger handler should be Text Handler", func(t *testing.T) {
		os.Setenv("ENV", "local")
		buf := bytes.NewBuffer([]byte{})

		defaultLogOutput = buf
		defer func() { defaultLogOutput = os.Stdout }()

		l := New()

		_, ok := l.Handler().(otelHandler)
		if !ok {
			t.Errorf("ENV local expect handler type is logger.otelHandler but actual is %T", l.Handler())
		}
	})
}
