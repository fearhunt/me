#!/usr/bin/env bash
# Weekly entry point: metrics snapshot, then a Claude review that proposes fixes on a branch.
# Safe to call any time: run.mjs skips when the latest report is under 7 days old.
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.bun/bin:$HOME/.local/bin:$PATH"

before=$(ls seo/reports/*.json 2>/dev/null | sort | tail -1 || true)
bun seo/run.mjs "$@"
after=$(ls seo/reports/*.json 2>/dev/null | sort | tail -1 || true)

# Only invoke Claude when a fresh report was actually produced.
if [ "$before" != "$after" ] || [ "${1:-}" = "--force" ]; then
  claude -p "$(cat seo/WEEKLY.md)" \
    --allowedTools "Read" "Edit" "Write" "WebSearch" "WebFetch" \
      "Bash(git status:*)" "Bash(git diff:*)" "Bash(git log:*)" "Bash(git checkout -b:*)" "Bash(git add:*)" "Bash(git commit:*)" \
      "Bash(bun run build:*)" "Bash(ls:*)" \
    >> seo/reports/claude.log 2>&1 || echo "claude review failed, see seo/reports/claude.log"
fi
