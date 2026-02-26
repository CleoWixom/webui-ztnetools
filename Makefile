.PHONY: dev build lint test

dev:
	@trap 'kill 0' EXIT; \
	go run ./cmd/server & \
	npm run dev

build:
	@mkdir -p dist
	go build -o dist/server ./cmd/server
	npm run build

lint:
	golangci-lint run ./...
	npm run lint

test:
	go test ./...
