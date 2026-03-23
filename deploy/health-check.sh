#!/bin/bash
set -euo pipefail

# Health check script
# Usage: deploy/health-check.sh [url]

URL="${1:-http://localhost:3000}"

echo "[health] Checking $URL/api/v1/health..."

RESPONSE=$(curl -sf "$URL/api/v1/health" 2>&1) || {
  echo "[health] FAILED - server not responding"
  exit 1
}

echo "[health] Response: $RESPONSE"
echo "[health] OK ✓"
