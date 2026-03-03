#!/bin/bash
set -euo pipefail

# PostgreSQL backup script
# Intended to run via systemd timer (see bootstrap.sh)
# Usage: deploy/backup.sh

BACKUP_DIR="/opt/saas/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="saas"

mkdir -p "$BACKUP_DIR"

echo "[backup] Starting PostgreSQL backup..."
pg_dump "$DB_NAME" | gzip > "$BACKUP_DIR/db_${TIMESTAMP}.sql.gz"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "db_*.sql.gz" -mtime +7 -delete

echo "[backup] Backup complete: db_${TIMESTAMP}.sql.gz"
