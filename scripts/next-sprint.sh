#!/usr/bin/env bash
set -euo pipefail

cd /var/www/viewcake

CURRENT_FILE="docs/sprints/CURRENT.md"
NEXT=$(grep -E '^sprint-.*\.md$' "$CURRENT_FILE" | head -1 || true)

if [ -z "$NEXT" ]; then
  echo "No sprint file found in docs/sprints/CURRENT.md"
  exit 1
fi

SPRINT_PATH="docs/sprints/$NEXT"

if [ ! -f "$SPRINT_PATH" ]; then
  echo "Sprint file does not exist: $SPRINT_PATH"
  exit 1
fi

echo "========================================"
echo "NEXT VIEWCAKE SPRINT"
echo "========================================"
echo
cat "$SPRINT_PATH"
