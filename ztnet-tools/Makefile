GO_CMD := go
FRONTEND_DIR := frontend
NPM_CMD := npm

.PHONY: dev build lint test backend-dev frontend-dev

dev: backend-dev frontend-dev

backend-dev:
	$(GO_CMD) run ./cmd/server

frontend-dev:
	cd $(FRONTEND_DIR) && $(NPM_CMD) run dev

build:
	$(GO_CMD) build ./...
	cd $(FRONTEND_DIR) && $(NPM_CMD) run build

lint:
	$(GO_CMD) vet ./...
	cd $(FRONTEND_DIR) && $(NPM_CMD) run lint

test:
	$(GO_CMD) test ./...
	cd $(FRONTEND_DIR) && $(NPM_CMD) run test
