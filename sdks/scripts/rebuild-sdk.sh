#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🚀 Building Native SDKs..."
"$REPO_ROOT/sdks/Native/FinXCore/scripts/build-all.sh"

echo "🚀 Generating Nitrogen specs..."
cd "$REPO_ROOT/sdks/ReactNative/FinXCoreRN"
npx nitrogen@0.31

echo "✅ SDK Rebuild Complete!"
