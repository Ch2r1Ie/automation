package httpclient

import appErr "automation/util/err"

type httpResponseTemplate struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func HTTPSuccessResponse(data interface{}) *httpResponseTemplate {
	return &httpResponseTemplate{
		Code:    appErr.Success.Code,
		Message: appErr.Success.Message,
		Data:    data,
	}
}

func HTTPFailedResponse(code, message string) *httpResponseTemplate {
	return &httpResponseTemplate{
		Code:    code,
		Message: message,
	}
}
