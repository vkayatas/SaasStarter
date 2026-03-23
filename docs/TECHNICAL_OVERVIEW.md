# SaaS Starter Stack V2 - Technical Overview

> **Purpose:** Complete technical blueprint for a modern, cross-platform SaaS application. Optimized for scalability, cost-effectiveness, beautiful design, and a clear path to mobile and desktop apps.

---

## Table of Contents

1. [Stack at a Glance](#1-stack-at-a-glance)
2. [Architecture & Monorepo Structure](#2-architecture--monorepo-structure)
3. [Web Application (Next.js)](#3-web-application-nextjs)
4. [UI & Design System](#4-ui--design-system)
5. [Backend & API Layer](#5-backend--api-layer)
6. [Database & Schema](#6-database--schema)
7. [Authentication & Security](#7-authentication--security)
8. [Mobile Application (Expo)](#8-mobile-application-expo)
9. [Desktop Application (Tauri)](#9-desktop-application-tauri)
10. [Shared Packages](#10-shared-packages)
11. [Testing](#11-testing)
12. [CI/CD Workflows](#12-cicd-workflows)
13. [Deployment & Infrastructure](#13-deployment--infrastructure)
14. [Cost Breakdown](#14-cost-breakdown)
15. [Phased Rollout Plan](#15-phased-rollout-plan)
16. [Lessons Learned & Trade-offs](#16-lessons-learned--trade-offs)

---

## 1. Stack at a Glance

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Language** | TypeScript (everywhere) | One language across web, mobile, desktop, backend |
| **Web Framework** | Next.js 15 (App Router) | SSR, SSG, SPA - all in one. File-based routing |
| **UI Components** | shadcn/ui + Radix UI | Accessible, themeable, you own the code |
| **Styling** | Tailwind CSS 4 | Utility-first, dark mode built-in |
| **State** | Zustand | Lightweight, TypeScript-first, works in React + React Native |
| **Charts** | Recharts | React-native, composable, SSR-compatible, small bundle (~45KB) |
| **i18n** | next-intl | Built for App Router, type-safe, SSR-aware |
| **ORM** | Drizzle ORM | Type-safe, SQL-like, lightweight |
| **Database** | PostgreSQL (Neon) | Serverless, scales to zero, branching for dev/preview |
| **Cache** | Upstash Redis | Serverless Redis, pay-per-request |
| **Auth** | Better-Auth | Multi-provider, JWT + session, native Drizzle adapter, built for Next.js |
| **Validation** | Zod | Shared schemas across web, mobile, and API |
| **Mobile** | Expo (React Native) + Expo Router | True native apps, file-based routing, OTA updates |
| **Desktop** | Tauri v2 | Lightweight native shell (Rust + system webview) |
| **Monorepo** | Turborepo | Shared packages, unified CI, single `npm install` |
| **Hosting (Web)** | Vercel | Auto-scaling, preview deployments, zero ops |
| **Hosting (DB)** | Neon | Serverless PostgreSQL, free tier, branch per PR |
| **Email** | Resend + React Email | Transactional emails with React templates |
| **Monitoring** | Sentry | Error tracking, performance monitoring, free tier |
| **CI/CD** | GitHub Actions | Quality gate, deploy, maintenance workflows |
| **Package Mgmt** | pnpm | Fast, strict, monorepo-native |

---

## 2. Architecture & Monorepo Structure

### High-Level Architecture

```
                      TypeScript
                     ┌─────────┐
           ┌─────────┤  Shared  ├─────────┐
           │         │ packages │         │
           │         └─────────┘         │
      ┌────▼────┐  ┌─────▼─────┐  ┌─────▼─────┐
      │ Next.js  │  │   Expo    │  │  Tauri v2  │
      │   Web    │  │  Mobile   │  │  Desktop   │
      └────┬────┘  └─────┬─────┘  └─────┬─────┘
           │              │              │
           └──────────────┼──────────────┘
                          ▼
                  ┌──────────────┐
                  │  API Layer   │
                  │ (Next.js API │
                  │  Routes or   │
                  │  Hono/tRPC)  │
                  └──────┬───────┘
                         ▼
              ┌─────────────────────┐
              │    Neon PostgreSQL   │
              │    Upstash Redis    │
              └─────────────────────┘
```

### Monorepo Structure

```
saas/
├── apps/
│   ├── web/                        # Next.js 15 (App Router)
│   │   ├── app/
│   │   │   ├── (auth)/             # Auth pages (login, register, forgot-password)
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── (dashboard)/        # Protected app pages
│   │   │   │   ├── layout.tsx      # Dashboard shell (sidebar, nav)
│   │   │   │   ├── page.tsx        # Dashboard home
│   │   │   │   └── [feature]/page.tsx
│   │   │   ├── (marketing)/        # Public pages - SSR for SEO
│   │   │   │   ├── page.tsx        # Landing page
│   │   │   │   ├── pricing/page.tsx
│   │   │   │   └── blog/[slug]/page.tsx
│   │   │   ├── api/                # API routes
│   │   │   │   ├── auth/[...all]/route.ts
│   │   │   │   └── v1/             # Versioned API endpoints
│   │   │   ├── layout.tsx          # Root layout (providers, fonts)
│   │   │   ├── error.tsx           # Global error boundary
│   │   │   ├── not-found.tsx       # 404 page
│   │   │   └── global.css          # Tailwind base imports
│   │   ├── components/             # Web-specific components
│   │   │   ├── layouts/            # Page layouts (dashboard, marketing)
│   │   │   └── features/           # Feature-specific components
│   │   ├── lib/                    # Web-specific utilities
│   │   │   ├── api.ts              # Server-side API helpers
│   │   │   └── auth.ts             # Auth helpers (middleware, guards)
│   │   ├── middleware.ts           # Next.js middleware (auth, i18n, redirects)
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   ├── mobile/                     # Expo (React Native)
│   │   ├── app/                    # Expo Router (file-based, same pattern as Next.js)
│   │   │   ├── (auth)/
│   │   │   ├── (tabs)/             # Tab-based navigation
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── index.tsx       # Home tab
│   │   │   │   └── [feature].tsx
│   │   │   └── _layout.tsx         # Root layout
│   │   ├── components/             # Mobile-specific components
│   │   ├── lib/                    # Mobile-specific utilities
│   │   ├── app.json                # Expo config
│   │   ├── eas.json                # EAS Build config
│   │   └── package.json
│   │
│   └── desktop/                    # Tauri v2 (Phase 3)
│       ├── src-tauri/              # Rust backend
│       ├── src/                    # Can reuse web app or custom UI
│       └── package.json
│
├── packages/
│   ├── ui/                         # Shared UI components
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── api-client/                 # Type-safe API client
│   │   ├── src/
│   │   │   ├── client.ts           # HTTP client (fetch-based)
│   │   │   ├── types.ts            # Request/response types
│   │   │   ├── schemas.ts          # Zod validation schemas
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── shared/                     # Business logic, utils, constants
│   │   ├── src/
│   │   │   ├── permissions.ts      # Role/permission checks
│   │   │   ├── formatting.ts       # Date, currency, number formatting
│   │   │   ├── constants.ts        # App-wide constants
│   │   │   ├── types.ts            # Shared TypeScript types
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── db/                         # Drizzle schema + migrations
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── users.ts        # User tables
│   │   │   │   ├── auth.ts         # Auth tables (sessions, accounts)
│   │   │   │   ├── collections.ts  # Domain tables
│   │   │   │   ├── sharing.ts      # Share links + invite tracking
│   │   │   │   └── index.ts        # Re-export all schemas
│   │   │   ├── migrations/         # SQL migration files
│   │   │   ├── migrate.ts          # Migration runner
│   │   │   ├── client.ts           # DB connection (Neon serverless driver)
│   │   │   └── index.ts
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   │
│   └── data-quality/               # Cross-checks, reports, ETL utilities
│       ├── src/
│       │   ├── checks/             # Data integrity validators
│       │   │   ├── orphaned-records.ts
│       │   │   ├── schema-consistency.ts
│       │   │   └── index.ts
│       │   ├── loaders/            # ETL scripts (external API ingestion)
│       │   │   ├── base-loader.ts  # Abstract loader with retry + logging
│       │   │   └── index.ts
│       │   ├── reports/            # Report generators
│       │   │   └── quality-report.ts
│       │   └── index.ts
│       └── package.json
│
├── tooling/                        # Shared config
│   ├── eslint/                     # Shared ESLint config
│   ├── typescript/                 # Shared tsconfig
│   └── tailwind/                   # Shared Tailwind config
│
├── turbo.json                      # Turborepo pipeline config
├── pnpm-workspace.yaml             # Workspace definition
├── package.json                    # Root scripts
└── .github/
    └── workflows/
        ├── ci.yml                  # Quality gate
        ├── deploy.yml              # Production deploy
        ├── preview.yml             # Preview deployments for PRs
        └── maintenance.yml         # Dependency updates, security scans
```

---

## 3. Web Application (Next.js)

### Framework & Configuration

Next.js 15 with App Router. Key configuration:

```typescript
// next.config.ts
const config = {
  experimental: {
    typedRoutes: true,          // Type-safe <Link> components
  },
  images: {
    remotePatterns: [],         // Configure allowed image domains
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,  // CSP, HSTS, X-Frame-Options, etc.
    },
  ],
};
```

### Routing Strategy

| Route Group | Rendering | Auth | Purpose |
|-------------|-----------|------|---------|
| `(marketing)/*` | SSR / SSG | Public | Landing, pricing, blog - SEO optimized |
| `(auth)/*` | Client-side | Public | Login, register, forgot password |
| `(dashboard)/*` | Client-side | Protected | Core application |
| `api/v1/*` | Edge / Node | Varies | API endpoints |

### Middleware

```typescript
// middleware.ts - runs on every request at the edge
export function middleware(request: NextRequest) {
  // 1. i18n locale detection + redirect
  // 2. Auth check for protected routes (/dashboard/*)
  // 3. Rate limiting (via Upstash Redis)
  // 4. Bot detection / security headers
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### Key Frontend Conventions

| Rule | Enforcement |
|------|-------------|
| **App Router only** | No Pages Router. All routes use `app/` directory |
| **Server Components by default** | Only add `'use client'` when needed (interactivity, hooks) |
| **Tailwind only** | Zero custom CSS. Colors/spacing via `tailwind.config.ts` |
| **Dark mode** | Class-based (`dark:` variants). Toggle stored in Zustand + `localStorage` |
| **i18n completeness** | Every user-facing string via `next-intl`. All keys must exist in all locale files |
| **Error boundaries** | Every route group has an `error.tsx`. Global fallback in root `error.tsx` |
| **Loading states** | Every async page has a `loading.tsx` with skeleton UI |
| **Type-safe routes** | `experimental.typedRoutes` enabled - invalid `<Link href>` is a TS error |

### Key Web Dependencies

| Package | Purpose |
|---------|---------|
| `next` (15.x) | Framework |
| `react` (19.x) | UI library |
| `zustand` | State management |
| `next-intl` | i18n with App Router support |
| `@tanstack/react-query` | Server state management, caching, optimistic updates |
| `recharts` | Charts and data visualization |
| `react-hook-form` + `zod` | Forms with schema validation |
| `sonner` | Toast notifications |
| `cmdk` | Command palette (⌘K) |
| `nuqs` | Type-safe URL query state |
| `tailwindcss` (4.x) | Styling |
| `shadcn/ui` | UI components (generated, not a dependency) |

---

## 4. UI & Design System

### shadcn/ui Setup

shadcn/ui generates components into your codebase. You own every line - no black-box dependency.

```
apps/web/components/ui/        # Generated shadcn/ui components
├── button.tsx
├── card.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── input.tsx
├── select.tsx
├── sheet.tsx                   # Mobile-friendly side panel
├── skeleton.tsx                # Loading states
├── table.tsx
├── tabs.tsx
├── toast.tsx                   # Via sonner
└── tooltip.tsx
```

### Theming

All theming via CSS custom properties in `global.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... full color palette */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode overrides */
  }
}
```

Change the entire look of the app by editing these variables. No component code changes needed.

### Design Conventions

| Rule | Detail |
|------|--------|
| **Consistent spacing** | Use Tailwind spacing scale (`p-4`, `gap-6`, `mt-8`). No arbitrary values unless necessary |
| **Responsive breakpoints** | Mobile-first: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px) |
| **Animation** | Subtle transitions only. Use `tailwindcss-animate` or Framer Motion for complex animations |
| **Icons** | Lucide React (same icon set shadcn/ui uses) |
| **Typography** | Inter (body) + JetBrains Mono (code). Loaded via `next/font` for zero layout shift |
| **Accessibility** | All shadcn/ui components are Radix-based (WCAG 2.1 AA). Add `eslint-plugin-jsx-a11y` |

---

## 5. Backend & API Layer

### Strategy: Start Simple, Extract Later

Phase 1: Next.js API Routes handle everything.
Phase 2: When complexity grows, extract to a standalone TypeScript API (Hono or Fastify).

The shared `packages/db` and `packages/api-client` make this extraction seamless - the API contract doesn't change.

### Environment Configuration

Centralized, validated configuration loaded at startup. Inspired by the Pydantic Settings pattern - fail fast on misconfiguration, never silently run with bad defaults.

```typescript
// lib/config.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),
  CORS_ORIGINS: z.string().transform(s => s.split(',')),
  ADMIN_EMAILS: z.string().optional().transform(s => s?.split(',') ?? []),
  UPSTASH_REDIS_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().optional(),
});

export const config = envSchema.parse(process.env);
export type Config = z.infer<typeof envSchema>;
```

| Variable | Purpose | Default |
|----------|---------|--------|
| `NODE_ENV` | Controls behavior (dev relaxations, prod strictness) | `development` |
| `DATABASE_URL` | Neon PostgreSQL connection string | (required) |
| `AUTH_SECRET` | Signing key for sessions/tokens | (required - validated min 32 chars) |
| `CORS_ORIGINS` | Comma-separated allowed origins | (required) |
| `ADMIN_EMAILS` | Comma-separated admin email addresses | (none) |
| `UPSTASH_REDIS_URL` | Redis for rate limiting & cache | (optional in dev) |
| `RESEND_API_KEY` | Transactional email | (optional in dev) |

**Key rule:** Import `config` - never read `process.env` directly in business logic. One place to validate, one place to mock in tests.

### Startup Guards

Borrowed from the battle-tested pattern of refusing to start on misconfiguration. Prevents silent failures in staging/production.

```typescript
// lib/startup.ts - called from instrumentation.ts or root layout
export async function runStartupChecks() {
  const env = config.NODE_ENV;

  // 1. Schema migration check - refuse to start if DB is behind
  if (env !== 'development') {
    const applied = await getAppliedMigrationVersion();
    const expected = getExpectedMigrationVersion(); // from migration files on disk
    if (applied !== expected) {
      throw new Error(
        `Database schema mismatch: applied=${applied}, expected=${expected}. Run migrations first.`
      );
    }
  }

  // 2. Fail-fast on dangerous config in real-data environments
  if (env !== 'development') {
    if (config.CORS_ORIGINS.includes('*')) {
      throw new Error('Wildcard CORS origin (*) is not allowed in staging/production');
    }
    if (config.AUTH_SECRET.length < 32) {
      throw new Error('AUTH_SECRET is too short for staging/production');
    }
  }

  // 3. Database connectivity check
  await db.execute(sql`SELECT 1`);

  console.log(`[startup] All checks passed (env=${env})`);
}
```

**Why this matters:** This pattern alone prevents an entire class of deployment bugs - running app code against an outdated schema, accidentally shipping wildcard CORS, or deploying with a weak secret.

### API Routes Structure

```
app/api/
├── auth/
│   └── [...all]/route.ts         # Better-Auth catch-all
├── v1/
│   ├── {domain}/
│   │   ├── route.ts              # GET (list) + POST (create)
│   │   └── [id]/route.ts         # GET (detail) + PATCH + DELETE
│   ├── users/
│   │   ├── route.ts
│   │   └── me/route.ts           # Current user profile
│   ├── admin/
│   │   └── route.ts              # Admin-only endpoints
│   └── health/route.ts           # Health check endpoint
└── webhooks/
    └── stripe/route.ts           # Payment webhooks (when needed)
```

### Key Backend Patterns

| Pattern | Description |
|---------|-------------|
| **Input validation** | Every endpoint validates input with Zod (shared schemas from `packages/api-client`) |
| **Error responses** | Consistent error format: `{ error: string, code: string, details?: unknown }` |
| **Rate limiting** | Upstash Redis-based: per-IP for public, per-user for authenticated, stricter on sensitive endpoints |
| **Date bounds** | All date-range queries filter with both upper AND lower bounds (prevents future data leaking) |
| **Rounding** | All numeric values (currency, percentages, metrics) rounded to appropriate decimal places at the API layer - not in the UI |
| **Pagination** | Cursor-based pagination by default (offset-based for admin/reports) |
| **N+1 prevention** | Drizzle's relational queries with explicit `with` clauses |
| **Denormalized display key** | Child tables store a human-readable key (e.g. `slug`, `name`) alongside FK for fast display queries - reads vastly outnumber key changes |
| **Soft deletes** | User data uses `deletedAt` column for GDPR compliance |
| **Audit logging** | All mutations log `userId`, `action`, `entityType`, `entityId`, `timestamp` |

### API Documentation

V2 loses FastAPI's automatic Swagger/ReDoc generation. Compensate with an explicit documentation strategy:

| Approach | Tool | When to Use |
|----------|------|-------------|
| **OpenAPI spec generation** | `next-swagger-doc` or `swagger-jsdoc` | Generate OpenAPI 3.1 spec from JSDoc annotations on API routes |
| **Interactive docs** | Scalar or Swagger UI | Serve at `/api/docs` in development (`NODE_ENV !== 'production'`) |
| **Type-driven docs** | Zod schemas from `packages/api-client` | Schemas double as documentation - request/response shapes are always up-to-date |
| **Route catalog** | Custom `/api/health` extension | List all registered routes with methods and auth requirements |

```typescript
// app/api/docs/route.ts - serve OpenAPI docs (dev only)
import { createSwaggerSpec } from 'next-swagger-doc';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not Found', { status: 404 });
  }
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.1.0',
      info: { title: 'SaaS API', version: '1.0.0' },
    },
  });
  return Response.json(spec);
}
```

**Key rule:** API docs are auto-generated from code annotations + Zod schemas. Never maintain a separate spec file manually - it will drift.

### Data Ingestion & Quality (ETL)

For SaaS apps that ingest external data (APIs, CSV uploads, partner feeds):

```typescript
// packages/data-quality/src/loaders/base-loader.ts
export abstract class BaseLoader<T> {
  abstract name: string;
  abstract fetch(): Promise<T[]>;
  abstract validate(item: T): z.SafeParseReturnType<T, T>;
  abstract upsert(items: T[]): Promise<{ inserted: number; updated: number }>;

  async run(): Promise<LoaderResult> {
    const raw = await this.fetch();
    const valid = raw.filter(item => this.validate(item).success);
    const invalid = raw.length - valid.length;
    const result = await this.upsert(valid);
    await this.logResult({ ...result, skipped: invalid, total: raw.length });
    return { ...result, skipped: invalid, total: raw.length };
  }
}
```

```typescript
// packages/data-quality/src/checks/orphaned-records.ts
export async function checkOrphanedRecords(db: Database): Promise<QualityReport> {
  // Find child records with no valid parent
  // Find soft-deleted users past retention window
  // Find expired share links still marked active
  return { issues: [...], severity: 'warning', checkedAt: new Date() };
}
```

| Pattern | Description |
|---------|-------------|
| **Abstract loader base class** | All ETL scripts extend `BaseLoader` - consistent fetch → validate → upsert → log pipeline |
| **Zod validation on ingest** | Same schemas used for API input validate external data. Reject bad data early. |
| **Quality reports** | Scheduled checks (via Vercel Cron) surface orphaned records, data inconsistencies, expired tokens |
| **Admin dashboard** | Data quality report summary at `/dashboard/admin/data-quality` |
| **Retry with backoff** | External API fetches use exponential backoff. Failed batches are logged, not silently dropped |

Run ETL via Vercel Cron (Phase 1) or Trigger.dev (Phase 2). Never block API responses with data ingestion.

### Background Jobs

For tasks that shouldn't block API responses:

| Phase | Solution | Use Case |
|-------|----------|----------|
| Phase 1 | Vercel Cron + API routes | Scheduled tasks (reports, cleanup) |
| Phase 1 | `after()` (Next.js) | Post-response work (send email after signup) |
| Phase 2 | Trigger.dev or Inngest | Complex workflows, retries, long-running jobs |

### Caching Strategy

| Layer | Tool | TTL | Use Case |
|-------|------|-----|----------|
| **HTTP cache** | Next.js `revalidate` | 60s-24h | Static/semi-static pages |
| **Data cache** | React Query (client) | 5-30min | Avoid refetching on navigation |
| **API cache** | Upstash Redis | 5-60min | Expensive queries, aggregations |
| **CDN cache** | Vercel Edge | Varies | Static assets, images |

---

## 6. Database & Schema

### Overview

PostgreSQL via Neon (serverless). Schema defined in Drizzle ORM with type-safe queries.

### Connection Setup

```typescript
// packages/db/src/client.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

### Schema Design

#### User Domain

```typescript
// packages/db/src/schema/users.ts
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),                          // Soft delete (GDPR)
});

export const oauthAccounts = pgTable('oauth_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),     // 'google', 'github', etc.
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  // ... tokens, expiry
}, (table) => ({
  uniqueProvider: unique().on(table.provider, table.providerAccountId),
}));

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: varchar('token', { length: 512 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  revokedAt: timestamp('revoked_at'),
});
```

#### Domain Data (example)

```typescript
// packages/db/src/schema/collections.ts
export const collections = pgTable('collections', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  uniqueSlugPerUser: unique().on(table.userId, table.slug),
}));

export const notes = pgTable('notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  collectionId: uuid('collection_id').references(() => collections.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  tags: jsonb('tags').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tagsGinIndex: index('notes_tags_gin_idx').using('gin', table.tags),
}));
```

#### Sharing & Collaboration

```typescript
// packages/db/src/schema/sharing.ts
export const resourceShares = pgTable('resource_shares', {
  id: uuid('id').defaultRandom().primaryKey(),
  resourceType: varchar('resource_type', { length: 50 }).notNull(),  // 'collection', 'note', etc.
  resourceId: uuid('resource_id').notNull(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),          // Public share URL token
  accessLevel: varchar('access_level', { length: 20 })
    .default('public').notNull(),                                     // 'public' | 'authenticated' | 'invite-only'
  isActive: boolean('is_active').default(true).notNull(),
  expiresAt: timestamp('expires_at'),                                 // Optional expiry
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueResource: unique().on(table.resourceType, table.resourceId),
}));

export const shareInvites = pgTable('share_invites', {
  id: uuid('id').defaultRandom().primaryKey(),
  shareId: uuid('share_id').references(() => resourceShares.id, { onDelete: 'cascade' }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 128 }).notNull().unique(),       // Invite acceptance token
  role: varchar('role', { length: 20 }).default('viewer').notNull(), // 'viewer' | 'editor'
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueInvitePerShare: unique().on(table.shareId, table.email),
}));
```

This pattern supports three access modes:
- **Public** - anyone with the share link can view
- **Authenticated** - any logged-in user with the link can view
- **Invite-only** - only users with accepted invites can view/edit

### Notable Design Decisions

| Decision | Rationale |
|----------|-----------|
| **UUID PKs everywhere** | No info leakage, no collision on merge, consistent across all tables |
| **Drizzle over Prisma** | Lighter, closer to SQL, faster cold starts on serverless, better type inference |
| **Neon serverless driver** | HTTP-based - no persistent connection needed, works in Edge Runtime |
| **JSONB + GIN for tags** | Flexible tagging without junction tables. Native PostgreSQL `@>` operator queries |
| **CASCADE deletes on user FK** | GDPR: deleting a user removes all their data automatically |
| **Soft delete (`deletedAt`) for users** | Grace period for account recovery before hard delete |
| **Composite unique constraints** | Prevent duplicate data on all child tables |
| **`updatedAt` on mutable tables** | Enables optimistic concurrency and cache invalidation |
| **Sharing model (polymorphic)** | `resource_shares` + `share_invites` support public, authenticated, and invite-only access. Polymorphic `resourceType`/`resourceId` avoids per-table share tables |
| **Invite-only with email tokens** | Each invite gets a unique token for acceptance tracking. Composite unique on `(shareId, email)` prevents duplicate invites |

### Migrations

Drizzle Kit manages migrations:

```bash
# Generate migration from schema changes
pnpm --filter db drizzle-kit generate

# Apply migrations
pnpm --filter db drizzle-kit migrate

# Open Drizzle Studio (visual DB browser)
pnpm --filter db drizzle-kit studio
```

Migrations are SQL files committed to the repo, reviewed in PRs, and applied automatically on deploy.

---

## 7. Authentication & Security

### Auth Flow (Better-Auth)

1. User clicks "Sign in with Google/GitHub" on web or mobile
2. OAuth redirect → provider → callback URL
3. Auth library verifies token, creates/finds user via `oauthAccounts`
4. Session created: HTTP-only cookie (web) or secure token (mobile)
5. Protected routes check session via middleware (web) or API call (mobile)

### Session & Token Strategy

| Token Type | Storage | Lifetime | Details |
|------------|---------|----------|--------|
| **Session token** (web) | HTTP-only, Secure, SameSite=Lax cookie | 30 days | Primary auth mechanism for web |
| **Access token** (mobile) | `expo-secure-store` (encrypted) | 30 min | Short-lived, sent via `Authorization` header |
| **Refresh token** (mobile) | `expo-secure-store` (encrypted) | 7 days | Stored in DB with `jti` for one-time use |

#### Refresh Token Rotation (Mobile)

- On refresh: old token is revoked (`revokedAt` set), new pair issued
- **Reuse detection:** if an already-revoked token is presented, **all user tokens are revoked** (security breach signal)
- "Logout everywhere" support via bulk token revocation
- Tokens stored in DB with unique `jti` (JWT ID) for lookup and invalidation

This pattern (borrowed from battle-tested JWT rotation) adds meaningful defense-in-depth against token theft on mobile.

### Multi-Provider Support

| Provider | Priority | Notes |
|----------|----------|-------|
| Google | Day 1 | Most universal |
| GitHub | Day 1 | Developer audience |
| Email/Password | Day 1 | Fallback, password hashing via bcrypt/argon2 |
| Microsoft/Entra | Phase 2 | Enterprise customers |
| SAML/OIDC | Phase 3 | Enterprise SSO |

### Security Layers

| Layer | Implementation | Scope |
|-------|----------------|-------|
| **Auth middleware** | Next.js `middleware.ts` | Checks session on every protected route |
| **CORS** | Next.js config | Strict origin whitelist per environment |
| **Rate limiting** | Upstash Ratelimit | Per-IP (public), per-user (authenticated), per-endpoint (sensitive) |
| **Security headers** | Next.js `headers()` config | X-Content-Type-Options, X-Frame-Options, HSTS, CSP, Referrer-Policy |
| **CSP** | Strict in prod | Self + auth provider origins. Report violations to `/api/csp-report` |
| **CSRF** | Built into auth library | SameSite=Lax cookies + origin checking |
| **Input validation** | Zod on every endpoint | Reject malformed input before it reaches business logic |
| **SQL injection** | Drizzle parameterized queries | Never raw SQL with string interpolation |
| **Admin access** | Role-based in middleware | `role: 'admin'` check on admin routes |
| **GDPR compliance** | Soft delete + CASCADE | Full data erasure on user deletion |
| **Secret scanning** | Gitleaks in CI | Prevents credential commits |
| **Dependency audit** | `pnpm audit` in CI | Blocks PRs with high-severity vulnerabilities |
| **Static analysis** | `eslint-plugin-security` + `eslint-plugin-jsx-a11y` | Catches security anti-patterns and accessibility issues in code review |
| **API key auth** | `api_keys` table (Phase 2) | Scoped permissions, hashed storage, rate limits for programmatic access |
| **Startup guards** | Env validation + migration check | App refuses to start in staging/prod with bad config or outdated schema (see §5) |

---

## 8. Mobile Application (Expo)

### Why Expo (React Native)

- **True native rendering** - not a WebView wrapper
- **Expo Router** - file-based routing identical to Next.js (knowledge transfers)
- **EAS Build** - cloud builds for iOS and Android without local Xcode/Android Studio
- **Over-the-air updates** - push JS updates without App Store review
- **~60-80% code sharing** with web via shared packages

### Mobile Architecture

```
apps/mobile/
├── app/                          # Expo Router (file-based)
│   ├── _layout.tsx               # Root layout (providers, fonts, splash)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Home tab
│   │   ├── search.tsx            # Search tab
│   │   └── profile.tsx           # Profile tab
│   └── [feature]/
│       └── [id].tsx              # Detail screens
├── components/                   # Mobile-specific components
│   ├── navigation/
│   └── platform/                 # Platform-specific (iOS vs Android)
├── lib/
│   ├── api.ts                    # Uses shared api-client package
│   ├── auth.ts                   # Secure token storage (expo-secure-store)
│   └── notifications.ts          # Push notification setup
└── app.json
```

### What's Shared vs. Platform-Specific

| Shared (from `packages/`) | Platform-Specific |
|---------------------------|-------------------|
| API client + types | Navigation patterns (tabs vs sidebar) |
| Zod validation schemas | UI components (native vs web) |
| Business logic (permissions, formatting) | Gesture handling |
| Constants, enums, types | Push notifications |
| Auth state logic | Secure storage |

### Mobile-Specific Dependencies

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based navigation |
| `expo-secure-store` | Encrypted token storage |
| `expo-notifications` | Push notifications |
| `expo-haptics` | Haptic feedback |
| `nativewind` | Tailwind CSS for React Native |
| `react-native-reanimated` | 60fps animations |
| `react-native-gesture-handler` | Native gestures |

---

## 9. Desktop Application (Tauri)

### When to Add Desktop

Desktop is **Phase 3** - only when there's a clear need (offline access, system integration, heavy local processing). Most SaaS apps don't need this.

### Why Tauri v2 over Electron

| | Tauri v2 | Electron |
|--|---------|----------|
| **Bundle size** | ~5-10 MB | ~150+ MB |
| **Memory usage** | Low (system webview) | High (ships Chromium) |
| **Backend** | Rust (fast, secure) | Node.js |
| **When to use** | Wrapping an existing web app | Complex desktop-native features |

### Architecture

Tauri wraps your Next.js web app (or a static export) in a native window. For most SaaS use cases, this is sufficient - users get a native app icon, system tray, and keyboard shortcuts.

```
apps/desktop/
├── src-tauri/
│   ├── src/main.rs              # Rust entry point
│   ├── Cargo.toml               # Rust dependencies
│   └── tauri.conf.json          # Window config, permissions
├── src/                         # Reuses web app or custom UI
└── package.json
```

---

## 10. Shared Packages

### `packages/api-client`

Type-safe API client used by web, mobile, and desktop:

```typescript
// packages/api-client/src/client.ts
import { z } from 'zod';
import { CollectionSchema, CreateCollectionSchema } from './schemas';

export function createApiClient(baseUrl: string, getToken: () => Promise<string | null>) {
  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const token = await getToken();
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
    if (!response.ok) throw new ApiError(response);
    return response.json();
  }

  return {
    collections: {
      list: () => request<z.infer<typeof CollectionSchema>[]>('/api/v1/collections'),
      create: (data: z.infer<typeof CreateCollectionSchema>) =>
        request<z.infer<typeof CollectionSchema>>('/api/v1/collections', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      // ... get, update, delete
    },
    // ... other domains
  };
}
```

### `packages/shared`

Business logic that must be consistent everywhere:

```typescript
// packages/shared/src/permissions.ts
export const ROLES = ['user', 'admin', 'owner'] as const;
export type Role = typeof ROLES[number];

export function canEdit(userRole: Role, resourceOwnerId: string, userId: string): boolean {
  if (userRole === 'admin' || userRole === 'owner') return true;
  return resourceOwnerId === userId;
}

// packages/shared/src/formatting.ts
export function formatCurrency(amount: number, currency = 'EUR', locale = 'de-DE'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
```

### `packages/db`

Single source of truth for database schema. Used by the API layer and migration tooling - never imported by frontend/mobile.

### `packages/data-quality`

Data integrity checks, ETL loaders, and quality reports. Used by admin dashboard and scheduled jobs - never imported by frontend/mobile.

```typescript
// packages/data-quality/src/reports/quality-report.ts
export async function generateQualityReport(db: Database): Promise<QualityReport> {
  const checks = await Promise.all([
    checkOrphanedRecords(db),
    checkSchemaConsistency(db),
    checkExpiredShares(db),
    checkSoftDeleteRetention(db),
  ]);

  return {
    timestamp: new Date().toISOString(),
    checks,
    summary: {
      total: checks.length,
      passing: checks.filter(c => c.issues.length === 0).length,
      warnings: checks.filter(c => c.severity === 'warning').length,
      errors: checks.filter(c => c.severity === 'error').length,
    },
  };
}
```

---

## 11. Testing

### Strategy

| Level | Tool | Scope | Where |
|-------|------|-------|-------|
| **Unit** | Vitest | Functions, utils, shared logic | `packages/*/tests/` |
| **Component** | Vitest + Testing Library | React components in isolation | `apps/web/tests/`, `apps/mobile/tests/` |
| **Integration** | Vitest | API routes + DB (Neon branch) | `apps/web/tests/api/` |
| **E2E** | Playwright | Full browser flows | `apps/web/e2e/` |
| **Mobile E2E** | Maestro | Native app flows | `apps/mobile/e2e/` |

### Test Structure

```
apps/web/
├── tests/
│   ├── components/              # Component tests
│   ├── api/                     # API route integration tests
│   └── lib/                     # Utility function tests
├── e2e/
│   ├── auth.spec.ts             # Login, register, logout
│   ├── dashboard.spec.ts        # Core CRUD operations
│   └── fixtures/                # Test data, page objects
└── vitest.config.ts

packages/shared/
├── tests/
│   ├── permissions.test.ts
│   └── formatting.test.ts
└── vitest.config.ts
```

### Test Tags & Selective Execution

Inspired by pytest markers - tag tests so CI can run the right subset:

| Tag | Description | CI Behavior |
|-----|-------------|-------------|
| `unit` | Fast, no network, no real DB | Always runs on every PR |
| `integration` | API routes + DB (Neon branch) | Always runs on every PR |
| `e2e` | Full browser flows (Playwright) | Runs on merge to `main` or manual |
| `smoke` | Post-deploy sanity checks against live env | Runs after deploy, **excluded** from PR CI |

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    // Use --tags to filter: vitest --tags unit
    typecheck: { enabled: true },
  },
});
```

**Key rule:** smoke tests are never in the PR quality gate - they require a running deployment and may hit external services.

### Test Environment

- **Neon branching** - each PR gets its own database branch (isolated, production-like schema)
- **Environment variables** - test-specific values via `.env.test`
- **Seed data** - deterministic fixtures loaded before integration/E2E tests
- **CI** - unit + integration tests run on every PR. E2E runs on merge to `main`
- **`NODE_ENV=development`** enforced in CI - tests never run in staging/prod mode
- **`AUTH_SECRET`** defaults to `test_secret_key_for_testing_only_32chars!` in test env
- **CSRF enforcement** off by default in tests (can be forced with env flag)

---

## 12. CI/CD Workflows

### `ci.yml` - Quality Gate

**Triggers:** PRs to `main`, manual dispatch.

| Job | Steps |
|-----|-------|
| **Lint & Type Check** | `turbo lint` → ESLint + TypeScript across all apps/packages |
| **Unit & Integration** | `turbo test` → Vitest across all packages |
| **E2E** | Playwright tests on preview deployment |
| **Build** | `turbo build` → ensure all apps build successfully |
| **Security** | `pnpm audit --audit-level=high` + Gitleaks |
| **Dependency Review** | `dependency-review-action` on PRs |

### `preview.yml` - Preview Deployments

**Trigger:** Every PR automatically.

- Vercel creates a preview deployment for the web app
- Neon creates a database branch from production
- PR comment with preview URL + test results

### `deploy.yml` - Production

**Trigger:** Merge to `main` (auto) or manual dispatch.

| Step | Detail |
|------|--------|
| Run CI | Full quality gate |
| Deploy web | Vercel auto-deploys from `main` |
| Run migrations | `drizzle-kit migrate` against production DB |
| Health check | Verify `/api/health` returns 200 |
| Notify | Slack/Discord notification |

### `pre-release.yml` - Release Gate

**Trigger:** Manual dispatch before creating a release tag.

Full validation suite beyond the standard PR quality gate:

| Step | Detail |
|------|--------|
| Full CI | Lint, typecheck, unit, integration tests |
| E2E suite | Complete Playwright suite (not just smoke) |
| Build all targets | `turbo build` across all apps |
| Migration dry-run | Verify pending migrations apply cleanly against a production-schema Neon branch |
| Bundle size check | Fail if JS bundle exceeds threshold (e.g. 250 KB gzipped) |
| Lighthouse audit | Performance, accessibility, SEO scores meet minimums |

This prevents "it passed CI but broke in production" scenarios. Run it before every version tag.

### `maintenance.yml` - Automated Upkeep

| Task | Schedule | Description |
|------|----------|-------------|
| **Dependency update** | Weekly (Monday 6 AM UTC) | Updates all packages, opens PR |
| **Security scan** | Daily | `pnpm audit` + Gitleaks |
| **Database cleanup** | Weekly | Soft-deleted users past retention → hard delete |
| **Neon branch cleanup** | Daily | Remove DB branches for merged/closed PRs |
| **Auth secret rotation** | Quarterly (1st of Jan/Apr/Jul/Oct) | Rotates staging auth secret automatically (manual for prod to avoid surprise logouts) |

---

## 13. Deployment & Infrastructure

### Environments

| Environment | Platform | Database | URL |
|-------------|----------|----------|-----|
| **Dev** | Local (`next dev`) | Neon branch or local PostgreSQL | `localhost:3000` |
| **Preview** | Vercel Preview | Neon branch (per-PR) | `pr-{n}.vercel.app` |
| **Staging** | Vercel Preview (from `staging` branch) | Neon `staging` branch | `staging.example.com` |
| **Production** | Vercel Production | Neon `main` branch | `example.com` |

### Infrastructure Diagram

```
┌─────────────────────────────────────────────────┐
│  Vercel Edge Network (CDN + Edge Functions)     │
│    ├── Static assets (immutable cache)          │
│    ├── SSR pages (edge-rendered)                │
│    ├── API routes (serverless functions)         │
│    └── Middleware (auth, rate limiting, i18n)    │
├─────────────────────────────────────────────────┤
│  Services                                       │
│    ├── Neon PostgreSQL (serverless, auto-scale)  │
│    ├── Upstash Redis (rate limiting, cache)      │
│    ├── Resend (transactional email)              │
│    └── Sentry (error tracking, performance)      │
├─────────────────────────────────────────────────┤
│  Mobile                                         │
│    ├── EAS Build (cloud builds)                  │
│    ├── EAS Submit (App Store / Play Store)       │
│    └── EAS Update (over-the-air JS updates)      │
└─────────────────────────────────────────────────┘
```

### Local Development

```bash
# Initial setup
git clone <repo> && cd saas
pnpm install                      # Install all workspace dependencies
cp apps/web/.env.example apps/web/.env.local

# Start development
pnpm dev                          # Starts web (next dev) + any other apps
pnpm --filter web dev             # Web only
pnpm --filter mobile dev          # Mobile (Expo dev server)

# Database
pnpm --filter db studio           # Drizzle Studio (visual DB browser)
pnpm --filter db generate         # Generate migration from schema changes
pnpm --filter db migrate          # Apply migrations

# Testing
pnpm test                         # All unit/integration tests
pnpm --filter web e2e             # Playwright E2E
pnpm lint                         # Lint all workspaces
pnpm typecheck                    # TypeScript check all workspaces
```

### Health Check Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
    database: await checkDatabase(),   // SELECT 1
    uptime: process.uptime(),
  };
  const status = checks.database === 'ok' ? 200 : 503;
  return Response.json(checks, { status });
}
```

---

## 14. Cost Breakdown

### Phase 1: MVP (Months 1–6) - ~$1/month

| Service | Tier | Monthly Cost |
|---------|------|-------------|
| Vercel | Hobby (free) | $0 |
| Neon PostgreSQL | Free (0.5 GB, 190 compute hours) | $0 |
| Upstash Redis | Free (10K requests/day) | $0 |
| Resend | Free (100 emails/day) | $0 |
| Sentry | Free (5K events/mo) | $0 |
| GitHub | Free (private repos, Actions) | $0 |
| Domain | ~$12/year | ~$1 |
| **Total** | | **~$1/mo** |

### Phase 2: Growing (Months 6–18) - ~$60/month

| Service | Tier | Monthly Cost |
|---------|------|-------------|
| Vercel | Pro | $20 |
| Neon | Launch (10 GB) | $19 |
| Upstash Redis | Pay-as-you-go | $5 |
| Resend | Pro | $20 |
| Sentry | Team | $0 (within free tier for small team) |
| EAS Build (mobile) | Free tier (30 builds/mo) | $0 |
| **Total** | | **~$65/mo** |

### Phase 3: Scaling (18+ months) - ~$200–400/month

| Service | Tier | Monthly Cost |
|---------|------|-------------|
| Vercel | Pro + bandwidth | $50–150 |
| Neon | Scale (50 GB+) | $69–150 |
| Upstash Redis | Pro | $10–30 |
| Resend | Business | $40 |
| Sentry | Team | $26 |
| EAS Build | Production | $99 |
| **Total** | | **~$200–400/mo** |

### Phase 3 Alternative: VPS Migration (Hetzner) - ~€5–15/month

> **Trigger:** When serverless costs exceed ~€200/mo OR you want full infrastructure control.
> **Strategy:** Start serverless (Phase 1–2), migrate to VPS when it makes financial sense.

Hetzner Cloud (EU, GDPR-compliant) offers excellent value:

| Hetzner VPS | Spec | Monthly Cost |
|-------------|------|--------------|
| **CX22** | 2 vCPU, 4 GB RAM, 40 GB SSD | **€4.85/mo** |
| **CX32** | 4 vCPU, 8 GB RAM, 80 GB SSD | **€8.45/mo** |
| **CX42** | 8 vCPU, 16 GB RAM, 160 GB SSD | **€15.45/mo** |

Full stack on a single CX22 (€4.85/mo):

| Service | Serverless Cost | VPS Cost |
|---------|----------------|----------|
| Web hosting (Vercel Pro) | $20/mo | €0 (included) |
| Database (Neon Launch) | $19/mo | €0 (self-managed PostgreSQL) |
| Redis (Upstash) | $5/mo | €0 (self-managed Redis) |
| SSL | $0 (Vercel) | €0 (Caddy auto-SSL) |
| **Total** | **~$65/mo** | **~€5/mo** |
| **Savings** | - | **~$60/mo (~92%)** |

> **Keep managed where it matters:** You can also run a hybrid - VPS for compute (€5/mo) + Neon for database ($19/mo) + Upstash for Redis ($5/mo). Total ~€30/mo with zero database ops.

### Cost vs. VPS Self-Hosting

| | Serverless (this stack) | VPS Self-Hosting (Hetzner) |
|--|------------------------|------------------|
| **Phase 1 cost** | ~$1/mo | ~€5–15/mo |
| **Ops time** | Near zero | 2–5 hrs/mo (patches, monitoring) |
| **Scaling** | Automatic | Manual (resize VPS, add load balancer) |
| **SSL** | Automatic (Vercel) | Automatic (Caddy) |
| **Preview deployments** | Built-in (per PR) | DIY (Coolify/Dokku) or none |
| **Breaks even at** | ~$200/mo serverless spend | Immediately cheaper on paper |
| **Hidden cost** | Vendor lock-in | Your time maintaining infra |
| **Best for** | 0–18 months, zero ops | 18+ months, cost optimization |

---

## 15. Phased Rollout Plan

> **Reality check:** Timelines below assume a solo developer or small team (2–3 people). They include buffer for the inevitable yak-shaving, debugging, and "why isn't this working" moments. If something takes less time, use the buffer for polish.

### Phase 1: Web MVP (Weeks 1–8)

```
Week 1:  Project scaffold (Next.js 15 + Tailwind + shadcn/ui)
         Environment configuration (Zod-validated env, startup guards)
         Neon database + Drizzle schema + initial migration
         Auth setup (Better-Auth, Google + email/password)

Week 2:  Core layout (dashboard shell, sidebar, navigation, dark mode)
         i18n setup (next-intl, EN + DE)
         Global error handling (error.tsx per route group)
         Loading states (skeleton components)

Week 3:  Core domain pages (list view, detail view, create/edit forms)
         React Query integration (caching, optimistic updates)
         Form handling (react-hook-form + Zod validation)

Week 4:  Core domain continued (delete, search, filtering)
         Pagination (cursor-based)
         User settings page

Week 5:  Charts / data visualization (Recharts)
         Admin panel (user management, basic data quality dashboard)
         Rate limiting (Upstash) on sensitive endpoints

Week 6:  Polish & edge cases
         Transactional email (Resend) for critical flows
         Audit logging on all mutations
         Security hardening (CSP, headers, static analysis)

Week 7:  Testing (Vitest unit + integration for core flows)
         Playwright E2E tests (auth flow, core CRUD)
         CI pipeline (GitHub Actions: lint, typecheck, test, build)

Week 8:  Production deploy (Vercel)
         Health check endpoint
         Sentry error tracking
         Pre-release validation workflow
         BUFFER - fix what broke during weeks 1–7
```

### Phase 2: Harden & Grow (Months 3–6)

Don't jump to mobile. Harden what you have and respond to real user feedback.

```
- Upstash Redis caching for expensive queries
- API key auth for programmatic access
- Stripe integration (subscriptions, billing portal)
- Performance optimization (bundle analysis, query optimization)
- More E2E coverage, smoke tests against staging
- Convert to Turborepo monorepo IF shared packages are justified
- Background job system (Trigger.dev or Inngest) IF needed
```

### Phase 3: Mobile App (Months 6–10, if there's demand)

Only start this when you have validated demand for mobile. Not before.

```
Month 6–7:  Expo project setup in monorepo
            Shared packages extraction (api-client, shared, db)
            Auth flow (secure token storage, refresh rotation)
            Core screens (tab navigation, list, detail)
            NativeWind styling (Tailwind for RN)

Month 8:    Full CRUD on mobile
            Pull-to-refresh, infinite scroll
            Push notifications (Expo Notifications)
            Platform-specific polish (iOS/Android differences)

Month 9:    EAS Build setup (cloud builds)
            TestFlight / Play Store internal testing
            Maestro E2E tests
            Performance optimization

Month 10:   App Store assets (screenshots, descriptions, review guidelines)
            App Store submission
            OTA update pipeline (EAS Update)
```

### Phase 3b (Optional): VPS Migration (when serverless costs > €200/mo)

Migrate from Vercel to self-hosted VPS (e.g. Hetzner CX22 at €4.85/mo) to cut hosting costs by ~92%. See §14 for full cost comparison.

```
- Enable `output: 'standalone'` in next.config.ts (should already be set - verify!)
- Provision Hetzner CX22 (or CX32 for more headroom)
- Set up Caddy reverse proxy + auto-SSL
- Install PostgreSQL 16 + Redis (or keep Neon/Upstash managed)
- Configure systemd services (nextjs.service, backup.timer)
- Run deploy/bootstrap.sh for initial provisioning
- Test full deploy cycle: git pull → pnpm build → drizzle-kit migrate → restart
- Update CI/CD to deploy via SSH instead of Vercel
- Set up monitoring (Sentry stays, add uptime check via UptimeRobot free tier)
- IMPORTANT: Keep deploy/ scripts maintained and test VPS deploy quarterly
```

> **DX regression:** You lose Vercel preview deployments. Consider Coolify (~$0, self-hosted on same VPS) or Dokku as a middle ground.

### Phase 4: Desktop + Advanced Scale (12+ months, if needed)

Most SaaS apps never need this. Only pursue with clear user demand.

```
- Tauri v2 desktop wrapper (if offline access or system integration needed)
- Multi-tenant support (if B2B)
- Advanced caching (Redis, CDN optimization)
- SOC 2 / compliance preparation
- Horizontal scaling strategy (if VPS needs outgrow a single server)
```

---

## 16. Lessons Learned & Trade-offs

### Why This Stack

| Decision | Rationale |
|----------|-----------|
| **Full-stack TypeScript** | One language = shared types, shared validation, shared logic. Largest ecosystem and talent pool. |
| **Next.js over Nuxt/SvelteKit** | Largest community, best Vercel integration, React mental model transfers to React Native. |
| **shadcn/ui over Material/Ant/Chakra** | You own the code. No breaking updates from a component library. Radix accessibility built-in. |
| **Drizzle over Prisma** | Lighter, faster cold starts on serverless, SQL-like syntax, better type inference. |
| **Neon over Supabase/PlanetScale** | Pure PostgreSQL (no vendor-specific features to learn), serverless driver, branch-per-PR, generous free tier. |
| **Vercel over self-hosted VPS** | Zero ops for web. Preview deployments per PR. Edge network. Trade-off: vendor lock-in. |
| **Expo over Capacitor** | True native rendering, better performance, EAS build pipeline, OTA updates. |
| **Zod-validated env config** | Catches config errors at startup, not at 3 AM in production. Single source of truth for all settings. |
| **Startup guards** | Migration check + env validation = zero silent failures. Worth the 5 lines of code every single time. |

### What Works Well (Proven Patterns)

| Decision | Why It Works |
|----------|-------------|
| **Centralized env validation** | Pydantic Settings (Python) and Zod schemas (TS) both prove: validate config once at startup, fail fast, never scatter `process.env` reads across your codebase. |
| **Startup migration check** | Catches schema drift before any request is served. Prevents hours of debugging "column not found" errors in production. |
| **Surrogate PK + mutable business keys** | Business key changes (renames, slug updates) are a simple UPDATE instead of cascading FK migrations. |
| **JSONB tags with GIN index** | Flexible tagging without a join table. Native PostgreSQL query support (`@>` operator). Works identically in SQLAlchemy and Drizzle. |
| **HTTP-only cookie auth** | Eliminates XSS token theft. Combined with refresh token rotation, provides defense-in-depth without complexity for the user. |
| **Denormalized display key in child tables** | Faster reads at the cost of updating multiple tables on key change. Reads vastly outnumber key changes in any SaaS. |
| **CI security tooling on every PR** | Gitleaks + dependency audit + static analysis in every PR - catches issues before merge without manual effort. |
| **shadcn/ui component ownership** | No black-box dependency updates breaking your UI. `npx shadcn@latest diff` shows what changed upstream. |

### Known Trade-offs (Honest Assessment)

| Decision | Trade-off | Mitigation |
|----------|-----------|-----------|
| **Vercel hosting** | Vendor lock-in. Pricing scales with usage. Hobby tier disallows commercial use ($20/mo minimum). | Next.js can self-host on Node.js. Keep infra-specific code minimal. Document VPS fallback (see below). |
| **Serverless API routes** | Cold starts on infrequent endpoints (~200–500ms). No WebSockets. 10s execution limit (Hobby) / 60s (Pro). No persistent state. | Neon serverless driver (HTTP-based, no connection pool needed). Warm critical endpoints. Extract to Hono if you hit the ceiling. |
| **Separate web + mobile codebases** | UI components differ (React DOM vs React Native). The "60–80% code sharing" is misleading - types/schemas/logic are shared (~15%), but all UI is separate. | Share everything except UI via packages. Use NativeWind for consistent styling language. Be honest about the maintenance cost of two apps. |
| **Full TypeScript** | Loses Python's data science ecosystem. TypeScript is more verbose for scripts. No equivalent to FastAPI's auto-generated OpenAPI docs. | If you need ML/data processing, run Python microservices alongside. Use `swagger-jsdoc` or similar for API documentation if needed. |
| **shadcn/ui components are copied, not versioned** | No automatic updates when shadcn/ui improves a component. | `npx shadcn@latest diff` shows what changed. Manual upgrade is quick. |
| **Drizzle is newer than Prisma** | Smaller community, fewer tutorials, potential breaking changes between versions. | Growing fast. SQL knowledge transfers. Escape hatch: raw SQL is always available. |
| **No Redis in Phase 1** | No app-level caching for expensive queries. | React Query handles client-side caching. Add Upstash Redis in Phase 2 when you identify slow endpoints. |
| **No background task queue in Phase 1** | Scheduled tasks via Vercel Cron + `after()` only. No retries, no complex workflows. | Fine for early-stage. Graduate to Trigger.dev or Inngest when you need retries and long-running jobs. |
| **Denormalized display keys** | Requires updating multiple tables on key change. | Still worth it - reads vastly outnumber key changes. Consider a materialized view for complex reports. |

### VPS Migration Strategy (Hetzner)

> **This is not a fallback - it's the planned cost optimization path.** Start serverless, graduate to VPS when it makes financial sense (typically when serverless costs exceed ~€200/mo, or earlier if you prefer infrastructure control).

Hetzner CX22 (€4.85/mo) or CX32 (€8.45/mo) can run the entire stack:

```
┌──────────────────────────────────────────────┐
│  Caddy (reverse proxy + auto-SSL)            │
│    ├── Static files (Next.js build output)   │
│    └── Proxy → localhost:3000 (Node.js)      │
├──────────────────────────────────────────────┤
│  Next.js (standalone) → PostgreSQL           │
├──────────────────────────────────────────────┤
│  Systemd: nextjs.service, backup.timer       │
└──────────────────────────────────────────────┘
```

| Component | Serverless (current) | VPS Equivalent |
|-----------|---------------------|----------------|
| Web hosting | Vercel | Caddy + `next start` (standalone output) |
| Database | Neon (serverless) | Self-managed PostgreSQL or Neon (keep managed) |
| Redis | Upstash | Self-managed Redis or keep Upstash |
| SSL | Vercel (automatic) | Caddy (automatic via Let's Encrypt) |
| Deploys | Git push → Vercel | SSH + `git pull` + `pnpm build` + `systemctl restart` |
| Preview deploys | Vercel per-PR | Lost (or DIY with separate Caddy vhosts) |
| Cost | ~$65–400/mo at scale | **~€5–15/mo (Hetzner Cloud)** |

#### Migration Prerequisites (enforce from Day 1)

- [ ] `output: 'standalone'` set in `next.config.ts` - produces a self-contained Node.js server that runs anywhere
- [ ] No Vercel-specific APIs in business logic (avoid Vercel KV, Blob, Edge Config)
- [ ] `deploy/` scripts maintained and committed to repo
- [ ] Quarterly VPS deploy test - run `next build && next start` locally to verify standalone mode works
- [ ] Database connection string is standard PostgreSQL (works with both Neon and self-managed)

#### When to Pull the Trigger

| Signal | Action |
|--------|--------|
| Serverless bill > €200/mo consistently | Start VPS migration |
| Need for WebSockets or long-running processes | VPS removes Vercel's execution limits |
| Want full EU data residency control | Hetzner datacenters in Falkenstein, Nuremberg, Helsinki |
| Vercel Hobby tier limitations hit | Consider VPS before paying $20/mo for Pro |

### Deploy Scripts (VPS Migration)

Keep these scripts in `deploy/` from Day 1 - they're your migration-ready insurance policy:

| Script | Purpose |
|--------|---------|
| `deploy/bootstrap.sh` | One-time server provisioning (user creation, Caddy, PostgreSQL, systemd units) |
| `deploy/deploy.sh` | Pull latest code, run migrations, rebuild, restart services |
| `deploy/rollback.sh` | Revert to a previous tag/commit |
| `deploy/backup.sh` | PostgreSQL dump (scheduled via systemd timer) |
| `deploy/health-check.sh` | Verify API + frontend are responding |
