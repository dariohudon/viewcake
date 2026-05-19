#!/usr/bin/env bash
set -euo pipefail

cd /var/www/viewcake

CURRENT_FILE="docs/sprints/CURRENT.md"
CURRENT=$(grep -E '^sprint-.*\.md$' "$CURRENT_FILE" | head -1 || true)

case "$CURRENT" in
  sprint-a-live-audience-engagement.md)
    NEXT="sprint-b-post-session-value.md"
    ;;
  sprint-b-post-session-value.md)
    NEXT="sprint-c-auth-ownership.md"
    ;;
  sprint-c-auth-ownership.md)
    NEXT="sprint-d-deployment-hardening.md"
    ;;
  sprint-d-deployment-hardening.md)
    echo "Sprint D is the final sprint in this queue."
    exit 0
    ;;
  *)
    echo "Unknown or missing current sprint: $CURRENT"
    exit 1
    ;;
esac

cat > "$CURRENT_FILE" <<EOF2
# Current Sprint

$NEXT
EOF2

echo "Advanced sprint:"
echo "$CURRENT -> $NEXT"
