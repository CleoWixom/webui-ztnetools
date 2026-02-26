package exec

import (
	"context"
	"os/exec"
	"strings"
)

func Run(ctx context.Context, args ...string) (string, string, error) {
	if len(args) == 0 {
		return "", "", exec.ErrNotFound
	}

	cmd := exec.CommandContext(ctx, args[0], args[1:]...)

	var stdout, stderr strings.Builder
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err := cmd.Run()
	return stdout.String(), stderr.String(), err
}
