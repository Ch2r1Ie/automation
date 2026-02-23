# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a monorepo with two separate services:

- **[frontend/](frontend/)** — Next.js 16 app (React 19, TypeScript, Tailwind CSS v4), managed with pnpm
- **[backend/](backend/)** — Go 1.25 service

The frontend and backend are independent — no shared packages or workspace linking between them.

## Frontend Commands

All commands run from the `frontend/` directory using pnpm:

```bash
pnpm dev       # Start dev server at http://localhost:3000
pnpm build     # Production build
pnpm start     # Run production build
pnpm lint      # Run ESLint
```

## Backend Commands

All commands run from the `backend/` directory:

```bash
go run .       # Run the server
go build .     # Compile binary
go test ./...  # Run all tests
go test ./path/to/pkg -run TestName  # Run a single test
```

## Tech Stack Notes

- **Package manager:** pnpm (frontend only; `pnpm-workspace.yaml` exists in frontend/)
- **Styling:** Tailwind CSS v4 via PostCSS plugin (no `tailwind.config.js` — configured via CSS)
- **TypeScript path alias:** `@/*` maps to the `frontend/` root
- **ESLint:** v9 flat config (`eslint.config.mjs`), Next.js + TypeScript presets
