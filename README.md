# SaaS Starter

> A production-ready, fully-featured SaaS starter built with TypeScript everywhere. Includes authentication, CRUD, i18n, dark mode, and a polished dashboard — ready to extend with your own domain logic.

---

## What's Included

### Core Infrastructure

- **Turborepo monorepo** with pnpm workspaces — shared packages for UI, DB, types, API client
- **Next.js 15** (App Router, Turbopack) with `output: 'standalone'` for easy deployment
- **PostgreSQL** (Neon serverless) + **Drizzle ORM** — typed schema, migrations, HTTP driver
- **Better-Auth** — email/password authentication with session management (Google & GitHub OAuth ready)
- **React Query** — server state management with optimistic updates
- **Security headers** — HSTS, X-Frame-Options, CSP-ready, nosniff, referrer policy

### Authentication & Sessions

- Login / Register pages with form validation
- Session-based auth with secure cookies
- Active sessions list — view device, browser, OS; revoke individual or all sessions
- Auth guard middleware for protected routes
- Account deletion (danger zone)

### Dashboard Shell

- **Collapsible sidebar** — persisted state, responsive design
- **Mobile navigation** — hamburger menu with sheet overlay
- **Breadcrumbs** — auto-generated from URL pathname
- **User menu** — avatar, settings link, sign out
- **Dark / Light / System theme** — toggle button with persisted preference

### CRUD Features

- **Collections** — create, rename, delete with inline editing
- **Notes** — create, edit, delete within collections; supports tags (comma-separated)
- All mutations use React Query with toast notifications for success/error feedback

### Internationalization (i18n)

- **next-intl v4** with cookie-based locale detection
- **English + German** — fully translated (180+ keys each)
- Locale switcher in sidebar — instant language change
- Zero hardcoded strings — all UI text goes through the translation system
- ICU message format support (e.g. `{browser} on {os}`)
- Server components use `getTranslations()`, client components use `useTranslations()`

### Marketing Pages

- Landing page with hero section
- Pricing page (Free / Pro / Enterprise tiers)
- Blog placeholder with dynamic `[slug]` routing
- Shared marketing layout with header navigation + footer

### Settings Page

- **Profile tab** — update name, view email
- **Security tab** — change password, manage active sessions
- **Danger zone** — delete account with confirmation

### Developer Experience

- Turbopack for fast dev server startup
- Typed routes (`typedRoutes: true`)
- Path aliases (`@/` for app, `@saas/` for packages)
- Prettier + ESLint shared configs
- Vitest + Playwright scaffolded
- `.env.example` with all required/optional variables documented

---

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
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run database migrations

```bash
pnpm db:generate
pnpm db:migrate
```

### 5. Start developing

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — login and registration work out of the box.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router + Turbopack) |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Auth** | Better-Auth (email/password, Google, GitHub) |
| **Database** | PostgreSQL (Neon) + Drizzle ORM |
| **State** | React Query v5 + Zustand |
| **i18n** | next-intl v4 (EN + DE) |
| **Theme** | next-themes (dark/light/system) |
| **Monorepo** | Turborepo + pnpm workspaces |
| **Mobile** | Expo (React Native) — Phase 3 |
| **Desktop** | Tauri v2 — Phase 4 |

---

## Project Structure

```
apps/
  web/                    → Next.js web application
    app/
      (auth)/             → Login & register pages
      (dashboard)/        → Protected dashboard area
        dashboard/
          page.tsx        → Dashboard home (stats cards)
          collections/    → Collections CRUD
            [id]/         → Collection detail (notes)
          settings/       → Profile, security, danger zone
      (marketing)/        → Public pages (landing, pricing, blog)
      api/
        auth/             → Better-Auth handler
        v1/               → REST API routes (collections, health, users)
    components/           → Shared components (sidebar, breadcrumbs, theme, etc.)
    messages/             → i18n translation files (en.json, de.json)
    i18n/                 → next-intl request configuration
    lib/                  → Auth, API helpers, queries, validations
  mobile/                 → Expo mobile app (Phase 3)
  desktop/                → Tauri desktop app (Phase 4)
packages/
  ui/                     → Shared UI components (shadcn/ui)
  shared/                 → Business logic, types, constants
  api-client/             → Type-safe API client
  db/                     → Drizzle schema + migrations
    src/schema/
      auth.ts             → User, session, account, verification tables
      collections.ts      → Collections + notes tables
      sharing.ts          → Resource sharing + invite tables
  data-quality/           → ETL loaders + quality checks
tooling/
  eslint/                 → Shared ESLint config
  typescript/             → Shared tsconfig
  tailwind/               → Shared Tailwind config
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development (Turbopack) |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Lint all workspaces |
| `pnpm typecheck` | TypeScript check all workspaces |
| `pnpm test` | Run all tests |
| `pnpm format` | Format all files with Prettier |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |
| `pnpm db:generate` | Generate migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations |

---

## How to Continue — Project-Specific Customization

This starter gives you a working SaaS shell. Here's how to make it yours:

### 1. Rename the app

- Update `common.appName` in `apps/web/messages/en.json` and `de.json`
- Update `metadata.title` and `metadata.description` in both message files
- Update `package.json` names if desired

### 2. Add your domain models

The Collections + Notes CRUD is a reference implementation. To add your own entities:

1. **Define the schema** in `packages/db/src/schema/` (follow `collections.ts` as a pattern)
2. **Export it** from `packages/db/src/schema/index.ts`
3. **Generate a migration**: `pnpm db:generate`
4. **Apply it**: `pnpm db:migrate`
5. **Add query helpers** in `apps/web/lib/queries/`
6. **Create API routes** in `apps/web/app/api/v1/`
7. **Build the UI** in `apps/web/app/(dashboard)/dashboard/`
8. **Add i18n keys** to both `en.json` and `de.json`

### 3. Enable OAuth providers

Google and GitHub OAuth are scaffolded but require credentials:

1. Create OAuth apps at [Google Cloud Console](https://console.cloud.google.com/) and/or [GitHub Developer Settings](https://github.com/settings/developers)
2. Set the callback URL to `http://localhost:3000/api/auth/callback/google` (or `/github`)
3. Add credentials to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

### 4. Add a new language

1. Copy `apps/web/messages/en.json` → `apps/web/messages/fr.json` (or your locale)
2. Translate all values
3. Register the locale in `apps/web/i18n/request.ts`
4. Add it to the locale switcher in `apps/web/components/locale-switcher.tsx`

### 5. Add new dashboard pages

1. Create a folder under `apps/web/app/(dashboard)/dashboard/your-feature/`
2. Add a `page.tsx` — it's automatically protected by the dashboard layout
3. Add a sidebar link in `apps/web/components/sidebar.tsx`
4. Add i18n keys for the new page

### 6. Customize the marketing site

- Edit `apps/web/app/(marketing)/page.tsx` for the landing page
- Edit `apps/web/app/(marketing)/pricing/page.tsx` for pricing tiers
- Add new pages under `(marketing)/` — they share the marketing header/footer layout

### 7. Deploy

The app uses `output: 'standalone'` and is ready for:

- **Vercel** — zero config, just connect the repo
- **Docker** — use the Next.js standalone output (`node server.js`)
- **VPS** — build + `node apps/web/.next/standalone/server.js`

### 8. Roadmap placeholders (not yet implemented)

These are scaffolded but not yet wired:

- **Sharing system** — `resourceShares` + `shareInvites` tables exist in the DB schema
- **Stripe billing** — pricing page exists, payment integration not wired
- **Email (Resend)** — env var placeholder exists, transactional emails not implemented
- **Rate limiting (Upstash Redis)** — env var placeholder exists, middleware not wired
- **Mobile app** — Expo workspace exists, not started
- **Desktop app** — Tauri workspace exists, not started
- **Admin dashboard** — `ADMIN_EMAILS` env var exists, admin UI not built

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Auth secret (min 32 chars) — `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Yes | App URL (`http://localhost:3000` for dev) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL (same as above) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth client secret |
| `ADMIN_EMAILS` | No | Comma-separated admin email addresses |
| `UPSTASH_REDIS_URL` | No | Redis URL for rate limiting |
| `RESEND_API_KEY` | No | Resend API key for transactional emails |

---

See [TECHNICAL_OVERVIEW.md](./docs/TECHNICAL_OVERVIEW.md) for the full architecture documentation.
