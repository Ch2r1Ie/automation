package err

import (
	"encoding/json"
	"fmt"
)

var (
	// Success
	Success = AppError{Code: "0000", Message: "Success"}

	// TechnicalErrors
	ErrInvalidReq          = AppError{Code: "1001", Message: "Invalid request data"}
	ErrUnknown             = AppError{Code: "9999", Message: "Please contact admin"}
	ErrInternalServerError = AppError{Code: "9999", Message: "Internal server error"}
	ErrUnauthorized        = AppError{Code: "1004", Message: "Unauthorized"}

	// Session
	ErrSessionNotFound = AppError{Code: "2001", Message: "Session not found"}
	ErrSessionExpired  = AppError{Code: "2002", Message: "Session expired"}
)

type AppError struct {
	Code    string
	Message string
}

func (e *AppError) Error() string {
	return fmt.Sprintf("app error:%s|%s", e.Code, e.Message)
}

func (e *AppError) String() string {
	str, _ := json.Marshal(e)
	return string(str)
}

type ErrorResult struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func NewErrorResponse(err error) ErrorResult {
	var code, message string
	switch v := err.(type) {
	case *AppError:
		code = v.Code
		message = v.Message
	default:
		code = ErrUnknown.Code
		message = ErrUnknown.Message
	}

	return ErrorResult{
		Code:    code,
		Message: message,
	}
}
