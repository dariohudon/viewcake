#!/usr/bin/env bash
# Viewcake health check
# Usage: bash scripts/health-check.sh

set -euo pipefail

PASS=0
FAIL=0

check() {
  local label="$1"
  local url="$2"
  local expected="${3:-200}"

  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")

  if [ "$code" = "$expected" ] || { [ "$expected" = "200" ] && [ "$code" -ge 200 ] 2>/dev/null && [ "$code" -lt 400 ] 2>/dev/null; }; then
    echo "  PASS  $label ($code)"
    PASS=$((PASS + 1))
  else
    echo "  FAIL  $label — expected $expected, got $code"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "Viewcake health check"
echo "---------------------"

check "local root"       "http://localhost:3020"
check "local /login"     "http://localhost:3020/login"
check "local /join"      "http://localhost:3020/join"
check "local /register"  "http://localhost:3020/register"
check "public root"      "https://viewcake.brightening.ca"
check "public /login"    "https://viewcake.brightening.ca/login"
check "public /join"     "https://viewcake.brightening.ca/join"

# Protected route should redirect (302) unauthenticated
check "auth redirect"    "http://localhost:3020/dashboard" "302"

echo "---------------------"
echo "  ${PASS} passed, ${FAIL} failed"
echo ""

[ "$FAIL" -eq 0 ]
