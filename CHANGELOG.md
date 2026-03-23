# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Stripe billing** - checkout sessions, customer portal, subscription webhook handler (`/api/v1/billing/`, `/api/webhooks/stripe/`)
- **Dockerfile** - multi-stage build with standalone Next.js output for Docker/Railway/Fly.io deployment
- **SEO** - dynamic `sitemap.xml` (includes blog posts) and `robots.txt` via Next.js route handlers
- **Loading skeletons** - `loading.tsx` files for dashboard, collections, collection detail, and settings routes
- **Webhook pattern** - generic `/api/webhooks/` route structure with Stripe signature verification
- **Sentry integration** - client + server error tracking, auto-enabled when `NEXT_PUBLIC_SENTRY_DSN` is set
- **Email verification** - Resend integration, automatically enabled when `RESEND_API_KEY` is set
- **Rate limiting** - Upstash Redis middleware with tiered limits (public: 60/min, auth: 120/min, sensitive: 10/min)
- **Blog system** - Markdown-based blog with frontmatter, tags, index page, and static generation
- **Health check** - `/api/v1/health` endpoint with database connectivity verification and latency reporting
- **Test suite** - 46 unit tests across web app (validations, config) and shared package (formatting, permissions, constants)
- **Data quality checks** - orphaned record detection and schema consistency verification against database

### Changed

- Environment config now fails fast in production when required secrets are missing (Zod validation)
- `NODE_ENV=test` is now a valid environment for the config schema

### Security

- Removed hardcoded fallback secrets for `AUTH_SECRET` and `DATABASE_URL` in non-development environments

## [0.1.0] - 2026-03-23

### Added

- Initial SaaS Starter boilerplate
- Turborepo monorepo with pnpm workspaces
- Next.js 15 (App Router, Turbopack) with standalone output
- Better-Auth authentication (email/password + OAuth scaffolding)
- PostgreSQL (Neon) + Drizzle ORM with typed schema and migrations
- Dashboard shell with collapsible sidebar, breadcrumbs, mobile nav, dark mode
- Collections + Notes CRUD with React Query and optimistic updates
- Internationalization (next-intl v4) with English + German (180+ keys)
- Marketing pages (landing, pricing)
- Settings page (profile, security, danger zone)
- Security headers (HSTS, X-Frame-Options, CSP-ready, nosniff)
- Shared packages: UI (shadcn/ui), DB, shared types, API client
- VPS deployment scripts (bootstrap, deploy, rollback, health-check)
- CI/CD workflows (lint, typecheck, test, build)
