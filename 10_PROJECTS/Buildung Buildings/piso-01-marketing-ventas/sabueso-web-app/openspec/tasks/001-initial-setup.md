# Tasks: Initial Setup & Auth

## Phase 1: Infrastructure (DB & Auth)
- [ ] 1.1 Provision Neon Postgres project and database.
- [ ] 1.2 Provision Stack Auth for the project.
- [ ] 1.3 Configure environment variables (`.env.local`).
- [ ] 1.4 Initialize Stack Auth in Next.js (`npx @stackframe/init-stack . --no-browser`).

## Phase 2: Core Styling & Layout
- [x] 2.1 Refactor `globals.css` with Piso 01 Cyber-Brutalism aesthetic (JetBrains Mono, scanlines, flicker).
- [x] 2.2 Implement root `layout.tsx` and landing `page.tsx` with high-fidelity brutalist UI.
- [x] 2.3 Create dashboard shell at `app/dashboard/page.tsx` with brutalist cards and data streams.

## Phase 3: Database Schema & Client
- [ ] 3.1 Install `drizzle-orm`, `drizzle-kit` and `postgres`.
- [ ] 3.2 Define lead schema in `lib/db/schema.ts`.
- [ ] 3.3 Create database client in `lib/db/index.ts`.

## Phase 4: Authentication Handlers
- [ ] 4.1 Set up auth middleware to protect `/dashboard`.
- [ ] 4.2 Verify sign-in and sign-up flows work.
