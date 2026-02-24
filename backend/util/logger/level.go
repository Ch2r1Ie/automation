package logger

import (
	"log/slog"
	"os"
)

var logLevel = map[string]slog.Level{
	"DEBUG": slog.LevelDebug,
	"INFO":  slog.LevelInfo,
	"WARN":  slog.LevelWarn,
	"ERROR": slog.LevelError,
}

var (
	defaultLogLevel = "INFO"
	LogLevel        slog.Level
)

func initLevel() slog.Level {
	logLevelConf := os.Getenv("APP_LOG_LEVEL")
	if logLevelConf == "" {
		logLevelConf = defaultLogLevel
	}

	LogLevel = logLevel[logLevelConf]

	return LogLevel
}
