package model

type ExitNodeRequest struct {
	NetworkID string `json:"networkId"`
	NodeID    string `json:"nodeId"`
}

type StepResult struct {
	Step    string `json:"step"`
	Success bool   `json:"success"`
	Output  string `json:"output,omitempty"`
	Error   string `json:"error,omitempty"`
}

type ExitNodeResponse struct {
	Success bool         `json:"success"`
	Steps   []StepResult `json:"steps"`
}

type ExitNodeError struct {
	Step    string       `json:"step"`
	Message string       `json:"message"`
	Steps   []StepResult `json:"steps"`
}

func (e *ExitNodeError) Error() string {
	return e.Step + ": " + e.Message
}
