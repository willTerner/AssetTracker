#!/usr/bin/env bash
set -euo pipefail

echo "==> Checking package manager..."
if [ -f yarn.lock ] || [ -f pnpm-lock.yaml ]; then
  echo "ERROR: This project requires npm as the package manager."
  echo "  Detected yarn.lock or pnpm-lock.yaml. Please use npm instead."
  exit 1
fi
if [ "${npm_execpath:-}" ] && ! echo "$npm_execpath" | grep -q 'npm'; then
  echo "ERROR: This project requires npm as the package manager."
  echo "  Detected: $npm_execpath"
  exit 1
fi

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
