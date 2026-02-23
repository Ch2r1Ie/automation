.PHONY: help frontend backend db

# All Command Helper!!!
help:
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:|^#' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS=":"; blue="\033[34m"; reset="\033[0m"} \
		/^#/ {desc = substr($$0, 3)} \
		/^[a-zA-Z_-]+:/ {printf "  %s%-10s%s : %s\n", blue, $$1, reset, desc}'

# Start the Next.js dev server
frontend:
	cd frontend && pnpm dev

# Run the Go backend server
backend:
	cd backend && go run .

# Start the database via docker-compose
db:
	cd backend/db && docker-compose up -d

