package service

import (
	"context"
	"fmt"
	"strings"

	ztexec "webui-ztnetools/internal/exec"
	"webui-ztnetools/internal/model"
)

type ExitNodeService struct {
	ztHost string
}

func NewExitNodeService(ztHost string) *ExitNodeService {
	return &ExitNodeService{ztHost: ztHost}
}

func (s *ExitNodeService) Setup(ctx context.Context, req model.ExitNodeRequest) (*model.ExitNodeResponse, error) {
	steps := make([]model.StepResult, 0, 9)

	workflow := []struct {
		name string
		args []string
	}{
		{name: "join", args: []string{"zerotier-cli", "-D" + s.ztHost, "join", req.NetworkID}},
		{name: "authorize", args: []string{"zerotier-cli", "-D" + s.ztHost, "set", req.NodeID, "authorized=1"}},
		{name: "wait_for_ip", args: []string{"sh", "-c", "sleep 2"}},
		{name: "ip_forward", args: []string{"sysctl", "-w", "net.ipv4.ip_forward=1"}},
		{name: "detect_interfaces", args: []string{"sh", "-c", "ip route | head -n 1"}},
		{name: "iptables_nat", args: []string{"iptables", "-t", "nat", "-A", "POSTROUTING", "-j", "MASQUERADE"}},
		{name: "iptables_fwd_out", args: []string{"iptables", "-A", "FORWARD", "-i", "zt+", "-j", "ACCEPT"}},
		{name: "iptables_fwd_in", args: []string{"iptables", "-A", "FORWARD", "-o", "zt+", "-m", "state", "--state", "RELATED,ESTABLISHED", "-j", "ACCEPT"}},
		{name: "persist", args: []string{"sh", "-c", "iptables-save"}},
	}

	for _, step := range workflow {
		stdout, stderr, err := ztexec.Run(ctx, step.args...)
		result := model.StepResult{
			Step:    step.name,
			Success: err == nil,
			Output:  strings.TrimSpace(stdout),
		}

		if err != nil {
			result.Error = strings.TrimSpace(stderr)
			if result.Error == "" {
				result.Error = err.Error()
			}
			steps = append(steps, result)
			return nil, &model.ExitNodeError{
				Step:    step.name,
				Message: fmt.Sprintf("step failed: %s", result.Error),
				Steps:   steps,
			}
		}

		steps = append(steps, result)
	}

	return &model.ExitNodeResponse{Success: true, Steps: steps}, nil
}
