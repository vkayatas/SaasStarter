#!/bin/bash
set -euo pipefail

# Bootstrap script for VPS provisioning (Hetzner CX22+)
# Run once on a fresh Ubuntu 22.04+ server
# Usage: ssh root@your-server 'bash -s' < deploy/bootstrap.sh

echo "=== SaaS Starter - Server Bootstrap ==="

# 1. Create deploy user
if ! id -u deploy &>/dev/null; then
  adduser --disabled-password --gecos "" deploy
  usermod -aG sudo deploy
  echo "deploy ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deploy
  mkdir -p /home/deploy/.ssh
  cp ~/.ssh/authorized_keys /home/deploy/.ssh/
  chown -R deploy:deploy /home/deploy/.ssh
  echo "[bootstrap] Created deploy user"
fi

# 2. Install dependencies
apt-get update && apt-get upgrade -y
apt-get install -y curl git build-essential

# 3. Install Node.js 22
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
  npm install -g pnpm
  echo "[bootstrap] Installed Node.js $(node --version) + pnpm"
fi

# 4. Install Caddy (reverse proxy + auto-SSL)
if ! command -v caddy &>/dev/null; then
  apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
  apt-get update
  apt-get install -y caddy
  echo "[bootstrap] Installed Caddy"
fi

# 5. Install PostgreSQL 16
if ! command -v psql &>/dev/null; then
  sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
  curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
  apt-get update
  apt-get install -y postgresql-16
  echo "[bootstrap] Installed PostgreSQL 16"
fi

# 6. Create app directory
mkdir -p /opt/saas
chown deploy:deploy /opt/saas

# 7. Create systemd service for Next.js
cat > /etc/systemd/system/nextjs.service << 'EOF'
[Unit]
Description=Next.js Application
After=network.target postgresql.service

[Service]
Type=simple
User=deploy
WorkingDirectory=/opt/saas
ExecStart=/usr/bin/node /opt/saas/apps/web/.next/standalone/server.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/opt/saas/.env

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable nextjs

# 8. Configure Caddy
# Replace example.com with your actual domain
cat > /etc/caddy/Caddyfile << 'EOF'
# example.com {
#   reverse_proxy localhost:3000
# }
:80 {
  reverse_proxy localhost:3000
}
EOF

systemctl restart caddy

echo "=== Bootstrap complete ==="
echo "Next steps:"
echo "  1. Clone your repo to /opt/saas"
echo "  2. Copy .env.example to .env and fill in values"
echo "  3. Run deploy/deploy.sh"
