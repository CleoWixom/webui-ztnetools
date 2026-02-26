package config

import "os"

const (
	defaultBackendPort = "3001"
	defaultZTHost      = "http://localhost:9993"
)

type Config struct {
	BackendPort string
	ZTHost      string
	BackendKey  string
}

func LoadFromEnv() Config {
	cfg := Config{
		BackendPort: defaultBackendPort,
		ZTHost:      defaultZTHost,
	}

	if v := os.Getenv("BACKEND_PORT"); v != "" {
		cfg.BackendPort = v
	}

	if v := os.Getenv("ZTHost"); v != "" {
		cfg.ZTHost = v
	}

	cfg.BackendKey = os.Getenv("BACKEND_KEY")

	return cfg
}
