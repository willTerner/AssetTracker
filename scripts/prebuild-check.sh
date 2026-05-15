#!/usr/bin/env bash
set -euo pipefail

echo "==> Running expo doctor..."
if ! npx expo-doctor; then
  echo "ERROR: expo doctor failed. Please fix the issues above before building."
  exit 1
fi

if [ -z "${SENTRY_AUTH_TOKEN:-}" ]; then
  echo "ERROR: SENTRY_AUTH_TOKEN environment variable is not set."
  echo "  Set it with: export SENTRY_AUTH_TOKEN=<your-token>"
  exit 1
fi

echo "==> Pre-build checks passed."
