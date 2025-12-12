#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/build-android-aar.sh"
"$SCRIPT_DIR/build-ios-framework.sh"

echo "✅ Finished building Android AAR + iOS XCFramework and syncing to native-sdk."
