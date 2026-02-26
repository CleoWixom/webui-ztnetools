package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"webui-ztnetools/internal/model"
	"webui-ztnetools/internal/service"
)

type ExitNodeHandler struct {
	service *service.ExitNodeService
}

func NewExitNodeHandler(svc *service.ExitNodeService) *ExitNodeHandler {
	return &ExitNodeHandler{service: svc}
}

func (h *ExitNodeHandler) Setup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req model.ExitNodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json payload", http.StatusBadRequest)
		return
	}

	resp, err := h.service.Setup(r.Context(), req)
	if err != nil {
		var exitErr *model.ExitNodeError
		statusCode := http.StatusInternalServerError
		if errors.As(err, &exitErr) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(statusCode)
			_ = json.NewEncoder(w).Encode(exitErr)
			return
		}
		http.Error(w, err.Error(), statusCode)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(resp)
}
