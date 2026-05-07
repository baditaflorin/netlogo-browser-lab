package utils

import (
	"log/slog"
	"os"
)

func HandleErrorOrLogWithMessages(err error, errMsg string, successMsg string) {
	logger := slog.New(slog.NewJSONHandler(os.Stderr, nil))
	if err != nil {
		logger.Error(errMsg, "error", err)
		return
	}
	logger.Info(successMsg)
}
