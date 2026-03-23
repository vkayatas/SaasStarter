#!/bin/bash
set -euo pipefail

# Deploy script - pull, build, migrate, restart
# Usage: ssh deploy@your-server 'cd /opt/saas && bash deploy/deploy.sh'

APP_DIR="/opt/saas"
cd "$APP_DIR"

echo "=== Deploying SaaS Starter ==="

# 1. Pull latest code
echo "[deploy] Pulling latest code..."
git pull origin main

# 2. Install dependencies
echo "[deploy] Installing dependencies..."
pnpm install --frozen-lockfile

# 3. Run database migrations
echo "[deploy] Running migrations..."
pnpm db:migrate

# 4. Build the application
echo "[deploy] Building..."
pnpm build

# 5. Restart the service
echo "[deploy] Restarting Next.js..."
sudo systemctl restart nextjs

# 6. Wait and health check
echo "[deploy] Waiting for startup..."
sleep 5

if curl -sf http://localhost:3000/api/v1/health > /dev/null; then
  echo "[deploy] Health check passed ✓"
else
  echo "[deploy] Health check FAILED - check logs with: journalctl -u nextjs -n 50"
  exit 1
fi

echo "=== Deploy complete ==="
