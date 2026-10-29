#!/bin/bash
set -euo pipefail

# Usage:
#   ./deploy.sh              build and deploy to not-so-dev
#   ./deploy.sh rollback     point the site at the previous release
#
# Overrides: HOST=user@ip SITE=firhan ./deploy.sh
#
# Layout on the server (created once, see deploy/nginx.conf):
#   /var/www/firhan/releases/<timestamp>-<sha>/   one dir per deploy
#   /var/www/firhan/current -> releases/<...>     nginx serves this symlink

HOST="${HOST:-not-so-dev}"
SITE="${SITE:-firhan}"
BASE="/var/www/${SITE}"
KEEP=5

if [ "${1:-}" = "rollback" ]; then
  echo "▶ Rolling back ${HOST}:${BASE}..."
  ssh "${HOST}" bash -s <<ENDSSH
    set -euo pipefail
    cd ${BASE}
    current=\$(basename "\$(readlink current)")
    previous=\$(ls -1 releases | sort | awk -v c="\$current" '\$0 < c' | tail -n 1)
    [ -n "\$previous" ] || { echo "  no older release to roll back to"; exit 1; }
    ln -sfn "releases/\$previous" current.tmp
    mv -T current.tmp current
    echo "  \$current -> \$previous"
ENDSSH
  exit 0
fi

TAG="$(date +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD 2>/dev/null || echo nogit)"
RELEASE="${BASE}/releases/${TAG}"

echo "▶ Target: ${HOST}:${RELEASE}"

echo "▶ Building..."
bun install --frozen-lockfile
bun run build

echo "▶ Uploading..."
ssh "${HOST}" "mkdir -p ${RELEASE}"
rsync -az --delete dist/ "${HOST}:${RELEASE}/"

echo "▶ Switching current -> ${TAG}..."
ssh "${HOST}" bash -s <<ENDSSH
  set -euo pipefail
  cd ${BASE}
  ln -sfn releases/${TAG} current.tmp
  mv -T current.tmp current
  # prune old releases, keeping the newest ${KEEP}
  ls -1 releases | sort | head -n -${KEEP} | xargs -r -I{} rm -rf releases/{}
ENDSSH

echo ""
echo "✓ Deployed ${TAG}"
echo "  Rollback: ./deploy.sh rollback"
