---
title: "Getting Started with SaaS Starter"
description: "A quick guide to setting up and customizing your new SaaS application."
date: 2026-03-15
author: "Team"
tags: ["guide", "tutorial"]
---

This guide walks you through the key steps to go from clone to running product.

## Prerequisites

- Node.js 20+
- pnpm 9+
- A PostgreSQL database (we recommend [Neon](https://neon.tech))

## Step 1: Clone and install

```bash
git clone <your-repo>
cd your-project
pnpm install
```

## Step 2: Configure your environment

Copy the example env file and fill in your database URL and auth secret:

```bash
cp apps/web/.env.example apps/web/.env.local
```

## Step 3: Run migrations and start developing

```bash
pnpm db:generate
pnpm db:migrate
pnpm dev
```

## Step 4: Make it yours

- Update the app name in your i18n message files
- Replace the example Collections + Notes with your domain entities
- Customize the landing page and pricing tiers
- Add your own blog posts in `content/blog/`

That's it - you're up and running!
