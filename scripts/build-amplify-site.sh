#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_DIR="$ROOT_DIR/generated-artifacts/aws-amplify/site"

cd "$ROOT_DIR"

PORT=3000 BASE_PATH=/ pnpm --filter @workspace/estrada-landscaping run build
PORT=3001 BASE_PATH=/estrada-landscaping-promo/ pnpm --filter @workspace/estrada-landscaping-promo run build

rm -rf "$SITE_DIR"
mkdir -p "$SITE_DIR/estrada-landscaping-promo"
cp -R artifacts/estrada-landscaping/dist/public/. "$SITE_DIR/"
cp -R artifacts/estrada-landscaping-promo/dist/public/. "$SITE_DIR/estrada-landscaping-promo/"

printf 'Amplify site bundle prepared at %s\n' "$SITE_DIR"
