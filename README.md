# SaaS Starter

A open-source starter template for building SaaS applications with TypeScript. Clone this repo, swap in your own domain logic, and you have a working product with authentication, a dashboard, CRUD, i18n, and marketing pages out of the box.

**Who this is for:** Developers who want to skip the boilerplate and start building their product on a solid, modern stack (Next.js 15, PostgreSQL, Drizzle ORM, Turborepo monorepo).

**What you get:**
- Working login/register with session management (OAuth-ready)
- Dashboard with sidebar, dark mode, breadcrumbs, mobile nav
- Example CRUD (Collections + Notes) with React Query
- Internationalization (English + German, easily extensible)
- Marketing pages (landing, pricing, blog with Markdown posts)
- Stripe billing (checkout, customer portal, subscription webhooks)
- Email verification via Resend (auto-enabled when configured)
- Rate limiting via Upstash Redis (API routes)
- Error tracking via Sentry (auto-enabled when configured)
- SEO (dynamic sitemap.xml, robots.txt)
- Loading skeletons for all dashboard routes
- User settings (profile, password, sessions, account deletion)
- Shared packages for UI, DB, types, and API client
- Unit tests with Vitest (46 tests across packages)
- Dockerfile for Docker/Railway/Fly.io/Coolify deployment
- VPS deploy scripts + CI/CD GitHub Actions workflows

---

## What's Included

### Core Infrastructure

- **Turborepo monorepo** with pnpm workspaces - shared packages for UI, DB, types, API client
- **Next.js 15** (App Router, Turbopack) with `output: 'standalone'` for easy deployment
- **PostgreSQL** (Neon serverless) + **Drizzle ORM** - typed schema, migrations, HTTP driver
- **Better-Auth** - email/password authentication with session management (Google & GitHub OAuth ready)
- **React Query** - server state management with optimistic updates
- **Stripe billing** - checkout sessions, subscription management, customer portal, webhook handler
- **Rate limiting** - Upstash Redis with tiered limits (public / authenticated / sensitive)
- **Email verification** - Resend integration, auto-enabled when API key is set
- **Error tracking** - Sentry integration with client + server configs
- **SEO** - dynamic sitemap.xml and robots.txt with blog post indexing
- **Security headers** - HSTS, X-Frame-Options, CSP-ready, nosniff, referrer policy

### Authentication & Sessions

- Login / Register pages with form validation
- Session-based auth with secure cookies
- Email verification via Resend (when configured)
- Active sessions list - view device, browser, OS; revoke individual or all sessions
- Auth guard middleware for protected routes
- Account deletion (danger zone)

### Dashboard Shell

- **Collapsible sidebar** - persisted state, responsive design
- **Mobile navigation** - hamburger menu with sheet overlay
- **Breadcrumbs** - auto-generated from URL pathname
- **User menu** - avatar, settings link, sign out
- **Dark / Light / System theme** - toggle button with persisted preference

### CRUD Features

- **Collections** - create, rename, delete with inline editing
- **Notes** - create, edit, delete within collections; supports tags (comma-separated)
- All mutations use React Query with toast notifications for success/error feedback

### Internationalization (i18n)

- **next-intl v4** with cookie-based locale detection
- **English + German** - fully translated (180+ keys each)
- Locale switcher in sidebar - instant language change
- Zero hardcoded strings - all UI text goes through the translation system
- ICU message format support (e.g. `{browser} on {os}`)
- Server components use `getTranslations()`, client components use `useTranslations()`

### Marketing Pages

- Landing page with hero section
- Pricing page (Free / Pro / Enterprise tiers)
- Blog with Markdown posts (frontmatter, tags, static generation)
- Shared marketing layout with header navigation + footer

### Settings Page

- **Profile tab** - update name, view email
- **Security tab** - change password, manage active sessions
- **Danger zone** - delete account with confirmation

### Developer Experience

- Turbopack for fast dev server startup
- Typed routes (`typedRoutes: true`)
- Path aliases (`@/` for app, `@saas/` for packages)
- Prettier + ESLint shared configs
- Vitest unit tests (validations, config, permissions, formatting, constants)
- Playwright scaffolded for E2E
- `.env.example` with all required/optional variables documented
- Environment validation with Zod - fails fast in production if secrets are missing

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

Open [http://localhost:3000](http://localhost:3000) - login and registration work out of the box.

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
| **Billing** | Stripe (checkout, subscriptions, webhooks) |
| **Error Tracking** | Sentry (auto-enabled when DSN is set) |
| **Email** | Resend (verification + transactional) |
| **Rate Limiting** | Upstash Redis (tiered: public/auth/sensitive) |
| **Monorepo** | Turborepo + pnpm workspaces |
| **Testing** | Vitest + Playwright |

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
        v1/               → REST API routes (collections, billing, health)
        webhooks/         → Webhook handlers (Stripe)
    components/           → Shared components (sidebar, breadcrumbs, theme, etc.)
    messages/             → i18n translation files (en.json, de.json)
    i18n/                 → next-intl request configuration
    lib/                  → Auth, API helpers, queries, validations, blog, rate-limit
    content/
      blog/               → Markdown blog posts with frontmatter
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
  data-quality/           → Database quality checks (orphaned records, schema consistency)
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

## How to Continue - Project-Specific Customization

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

Google and GitHub OAuth are scaffolded but require credentials.

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Select **Web application** as the application type
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the **Client ID** and **Client Secret**

#### GitHub OAuth

1. Go to [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the form:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3000` (or your production URL)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**
5. Copy the **Client ID** and generate a **Client Secret**

#### Add credentials to your environment

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

OAuth buttons appear automatically on the login/register pages when credentials are set.

### 4. Set up email verification (Resend)

Email verification is automatically enabled when `RESEND_API_KEY` is set.

1. Create a free account at [resend.com](https://resend.com)
2. Go to **API Keys** and create a new key
3. Go to **Domains** and add + verify your sending domain (or use the sandbox `onboarding@resend.dev` for testing)
4. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   EMAIL_FROM=noreply@yourdomain.com
   ```

When not set, users can register without email verification (fine for development).

### 5. Set up error tracking (Sentry)

1. Create a free project at [sentry.io](https://sentry.io)
2. Select **Next.js** as the platform
3. Copy the DSN from project settings
4. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   SENTRY_AUTH_TOKEN=sntrys_xxxxx
   ```

When not set, errors are logged to console only.

### 6. Set up rate limiting (Upstash Redis)

1. Create a free database at [upstash.com](https://upstash.com)
2. Copy the **REST URL** and **REST Token** from the database details
3. Add to `.env.local`:
   ```env
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxxxx
   ```

Rate limits: 60 req/min (public), 120 req/min (authenticated), 10 req/min (auth endpoints). When not set, rate limiting is skipped.

### 7. Database branching (Neon)

Neon supports database branching - isolated copies of your database for development, preview deployments, or testing migrations.

#### Create a branch manually

1. Go to your [Neon dashboard](https://console.neon.tech)
2. Select your project → **Branches** → **Create Branch**
3. Name it (e.g. `feature/my-feature` or `preview/pr-42`)
4. Copy the branch connection string
5. Use it as `DATABASE_URL` in your feature branch `.env.local`

#### Automated branch-per-PR (CI/CD)

Add to your GitHub Actions workflow:

```yaml
- name: Create Neon branch
  uses: neondatabase/create-branch-action@v5
  with:
    project_id: ${{ secrets.NEON_PROJECT_ID }}
    api_key: ${{ secrets.NEON_API_KEY }}
    branch_name: preview/pr-${{ github.event.number }}
```

This gives each PR its own database branch. Delete automatically on PR close:

```yaml
- name: Delete Neon branch
  uses: neondatabase/delete-branch-action@v3
  with:
    project_id: ${{ secrets.NEON_PROJECT_ID }}
    api_key: ${{ secrets.NEON_API_KEY }}
    branch: preview/pr-${{ github.event.number }}
```

### 8. Add a new language

1. Copy `apps/web/messages/en.json` → `apps/web/messages/fr.json` (or your locale)
2. Translate all values
3. Register the locale in `apps/web/i18n/request.ts`
4. Add it to the locale switcher in `apps/web/components/locale-switcher.tsx`

### 9. Add new dashboard pages

1. Create a folder under `apps/web/app/(dashboard)/dashboard/your-feature/`
2. Add a `page.tsx` - it's automatically protected by the dashboard layout
3. Add a sidebar link in `apps/web/components/sidebar.tsx`
4. Add i18n keys for the new page

### 10. Customize the marketing site

- Edit `apps/web/app/(marketing)/page.tsx` for the landing page
- Edit `apps/web/app/(marketing)/pricing/page.tsx` for pricing tiers
- Add new pages under `(marketing)/` - they share the marketing header/footer layout

### 11. Deploy

The app uses `output: 'standalone'` and is ready for:

- **Vercel** - zero config, just connect the repo
- **Docker** - `docker build -t saas . && docker run -p 3000:3000 --env-file apps/web/.env.local saas`
- **VPS** - build + `node apps/web/.next/standalone/server.js`
- **Railway / Fly.io / Coolify** - auto-detected via Dockerfile

### 12. Roadmap placeholders (not yet implemented)

These are scaffolded but not yet wired:

- **Sharing system** - `resourceShares` + `shareInvites` tables exist in the DB schema
- **Mobile app** - Expo workspace planned, not started
- **Desktop app** - Tauri workspace planned, not started
- **Admin dashboard** - `ADMIN_EMAILS` env var exists, admin UI not built

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Auth secret (min 32 chars) - `openssl rand -base64 32` |
| `BETTER_AUTH_SECRET` | Yes | Same as AUTH_SECRET (Better-Auth uses this) |
| `BETTER_AUTH_URL` | Yes | App URL (`http://localhost:3000` for dev) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL (same as above) |
| `CORS_ORIGINS` | Yes | Comma-separated allowed origins |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth client secret |
| `RESEND_API_KEY` | No | Resend API key - enables email verification |
| `EMAIL_FROM` | No | Sender email address (e.g. `noreply@yourdomain.com`) |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis REST URL - enables rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis REST token |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry DSN - enables error tracking |
| `SENTRY_AUTH_TOKEN` | No | Sentry auth token for source maps |
| `STRIPE_SECRET_KEY` | No | Stripe secret key - enables billing |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key (client-side) |
| `ADMIN_EMAILS` | No | Comma-separated admin email addresses |

---

See [TECHNICAL_OVERVIEW.md](./docs/TECHNICAL_OVERVIEW.md) for the full architecture documentation and [CHANGELOG.md](./CHANGELOG.md) for all changes.
