# All Command Helper!!!
help:
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:|^#' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS=":"; blue="\033[34m"; reset="\033[0m"} \
		/^#/ {desc = substr($$0, 3)} \
		/^[a-zA-Z_-]+:/ {printf "  %s%-10s%s : %s\n", blue, $$1, reset, desc}'

# Run the Go application
.PHONY: run
run:
	go run main.go

# Start DB container with build
.PHONY: db
db:
	cd db && COMPOSE_BAKE=true docker-compose up -d --build

# Start Docker Compose services (build if needed)
.PHONY: up
up:
	COMPOSE_BAKE=true docker-compose up -d --build

# Stop Docker Compose services
.PHONY: down
down:
	docker-compose down

# Run the clear.sh script
.PHONY: clear
clear:
	cd ./util/command && ./clear.sh

# Run all tests with race detection and coverage
.PHONY: test
test:
	go test ./... -count=1 -v -race -cover


# Generate mocks for repos, providers, and services gomock "go.uber.org/mock/gomock"
mock:
	@echo "Running mockgen commands..."
	mockgen -source=./util/repo/session.go -destination=./app/auth/mock/mock_repository_session.go -package=mock
	mockgen -source=./util/repo/user.go -destination=./app/auth/mock/mock__repository_user.go -package=mock
	mockgen -source=./util/provider/google.go -destination=./app/auth/mock/mock_provider_google.go -package=mock
	mockgen -source=./util/provider/github.go -destination=./app/auth/mock/mock_provider_github.go -package=mock
	mockgen -source=./util/provider/discord.go -destination=./app/auth/mock/mock_provider_discord.go -package=mock
	mockgen -source=./util/provider/tiktok.go -destination=./app/auth/mock/mock_provider_tiktok.go -package=mock
	mockgen -source=./util/provider/x.go -destination=./app/auth/mock/mock_provider_x.go -package=mock
	mockgen -source=./util/aesgcm/port.go -destination=./app/auth/mock/mock_aesgcm.go -package=mock
	mockgen -source=./util/timer/port.go -destination=./app/auth/mock/mock_timer.go -package=mock
	mockgen -source=./app/auth/service.go -destination=./app/auth/mock/mock_service.go -package=mock

	
