# ztnet-tools

Monorepo scaffold for a Go backend and Vite + React TypeScript frontend.

## Project Layout

- `cmd/server`: Go API server entrypoint.
- `internal/*`: Backend internal packages.
- `frontend/`: Vite app with strict TypeScript mode.

## Commands

- `make dev`: Run backend and frontend dev targets.
- `make build`: Build backend and frontend artifacts.
- `make lint`: Run backend vet and frontend lint.
- `make test`: Run backend and frontend tests.
