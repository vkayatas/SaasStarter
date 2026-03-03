# SaaS Starter

> A modern, cross-platform SaaS application built with TypeScript everywhere.

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up the database

1. Create a free PostgreSQL database at [neon.tech](https://neon.tech)
2. Copy the connection string from your Neon dashboard

### 3. Configure environment

```bash
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local` and set:

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=<run: openssl rand -base64 32>
```

### 4. Run database migrations

```bash
cd packages/db
pnpm generate
pnpm migrate
```

### 5. Start developing

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — login and registration work out of the box.

## Stack

- **Web:** Next.js 15 (App Router) + Tailwind CSS 4 + shadcn/ui
- **Auth:** Better-Auth (Google, GitHub, email/password)
- **Database:** PostgreSQL (Neon) + Drizzle ORM
- **Mobile:** Expo (React Native) — Phase 3
- **Desktop:** Tauri v2 — Phase 4
- **Monorepo:** Turborepo + pnpm workspaces

## Structure

```
apps/
  web/          → Next.js web application
  mobile/       → Expo mobile app (Phase 3)
  desktop/      → Tauri desktop app (Phase 4)
packages/
  ui/           → Shared UI components (shadcn/ui)
  shared/       → Business logic, types, constants
  api-client/   → Type-safe API client
  db/           → Drizzle schema + migrations
  data-quality/ → ETL loaders + quality checks
tooling/
  eslint/       → Shared ESLint config
  typescript/   → Shared tsconfig
  tailwind/     → Shared Tailwind config
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all workspaces |
| `pnpm typecheck` | TypeScript check all workspaces |
| `pnpm test` | Run all tests |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:generate` | Generate migration from schema |
| `pnpm db:migrate` | Apply migrations |

See [TECHNICAL_OVERVIEW.md](./docs/TECHNICAL_OVERVIEW.md) for the full architecture documentation.
