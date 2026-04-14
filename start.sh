#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

PORT=8000
URL="http://localhost:$PORT"

if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  PY=python
else
  echo "Python not found. Install python3 or use: npx serve ."
  exit 1
fi

echo "Serving portfolio at $URL (Ctrl+C to stop)"

if command -v xdg-open >/dev/null 2>&1; then
  (sleep 1 && xdg-open "$URL") &
elif command -v open >/dev/null 2>&1; then
  (sleep 1 && open "$URL") &
fi

exec "$PY" -m http.server "$PORT"
