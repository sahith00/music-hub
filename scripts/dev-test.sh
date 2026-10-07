#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API_DIR="$ROOT_DIR/api"
WEB_DIR="$ROOT_DIR"

API_PID=""
WEB_PID=""
WATCH_PID=""
WATCH=0
WATCH_FLAG=""

for arg in "$@"; do
  case "$arg" in
    --watch) WATCH_FLAG=1 ;;
    --no-watch) WATCH_FLAG=0 ;;
    --help|-h)
      echo "Usage: npm run dev:test -- [--watch|--no-watch]"
      echo "  --watch     Poll the users table every 2s"
      echo "  --no-watch  Start API + frontend only (default)"
      echo "Or set DEV_TEST_WATCH=1 to enable polling."
      exit 0
      ;;
    *)
      echo "[dev:test] Unknown argument: $arg"
      echo "[dev:test] Use --watch, --no-watch, or --help."
      exit 1
      ;;
  esac
done

if [[ -n "${DEV_TEST_WATCH:-}" ]]; then
  case "${DEV_TEST_WATCH}" in
    1|true|yes|on) WATCH=1 ;;
    0|false|no|off) WATCH=0 ;;
    *)
      echo "[dev:test] DEV_TEST_WATCH must be 1 or 0 (got ${DEV_TEST_WATCH})"
      exit 1
      ;;
  esac
fi

if [[ -n "$WATCH_FLAG" ]]; then
  WATCH="$WATCH_FLAG"
fi

cleanup() {
  echo
  echo "[dev:test] Shutting down..."
  [[ -n "$WATCH_PID" ]] && kill "$WATCH_PID" 2>/dev/null || true
  [[ -n "$WEB_PID" ]] && kill "$WEB_PID" 2>/dev/null || true
  [[ -n "$API_PID" ]] && kill "$API_PID" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

if [[ -f /.dockerenv && -f "$API_DIR/.env.docker" ]]; then
  ENV_FILE="$API_DIR/.env.docker"
elif [[ -f "$API_DIR/.env" ]]; then
  ENV_FILE="$API_DIR/.env"
else
  echo "[dev:test] Missing $API_DIR/.env or $API_DIR/.env.docker"
  echo "[dev:test] Copy api/.env.example to api/.env and set DATABASE_URL."
  exit 1
fi

echo "[dev:test] Using $ENV_FILE"
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "[dev:test] DATABASE_URL is empty in $ENV_FILE"
  exit 1
fi

if [[ "$WATCH" -eq 1 ]] && ! command -v psql >/dev/null 2>&1; then
  echo "[dev:test] psql command not found."
  echo "[dev:test] Install Postgres CLI to enable live DB monitoring, or omit --watch."
  exit 1
fi

echo "[dev:test] Applying migrations..."
(cd "$API_DIR" && npm run db:migrate)

echo "[dev:test] Starting API (http://127.0.0.1:4000)..."
(cd "$API_DIR" && npm run dev) &
API_PID=$!

echo "[dev:test] Starting frontend (http://127.0.0.1:5173)..."
(cd "$WEB_DIR" && npm run dev) &
WEB_PID=$!

WAIT_PIDS=("$API_PID" "$WEB_PID")

if [[ "$WATCH" -eq 1 ]]; then
  echo "[dev:test] Starting DB watcher (users table)..."
  (
    while true; do
      echo
      echo "========== $(date '+%Y-%m-%d %H:%M:%S') =========="
      psql "$DATABASE_URL" -c "select id, display_name, email, username, created_at from users order by id desc limit 20;"
      sleep 2
    done
  ) &
  WATCH_PID=$!
  WAIT_PIDS+=("$WATCH_PID")
else
  echo "[dev:test] DB watcher off. Re-run with --watch or DEV_TEST_WATCH=1 to poll users."
fi

echo "[dev:test] Running. Press Ctrl+C to stop all processes."
wait -n "${WAIT_PIDS[@]}"
