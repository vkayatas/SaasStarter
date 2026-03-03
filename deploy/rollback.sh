#!/bin/bash
set -euo pipefail

# Rollback to a previous commit/tag
# Usage: deploy/rollback.sh <commit-or-tag>

APP_DIR="/opt/saas"
TARGET="${1:?Usage: rollback.sh <commit-or-tag>}"

cd "$APP_DIR"

echo "=== Rolling back to: $TARGET ==="

git fetch origin
git checkout "$TARGET"

pnpm install --frozen-lockfile
pnpm build

sudo systemctl restart nextjs

sleep 5

if curl -sf http://localhost:3000/api/v1/health > /dev/null; then
  echo "[rollback] Health check passed ✓"
else
  echo "[rollback] Health check FAILED"
  exit 1
fi

echo "=== Rollback to $TARGET complete ==="
