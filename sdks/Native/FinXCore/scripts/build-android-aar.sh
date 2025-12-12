#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ANDROID_DIR="$MODULE_ROOT/android"
REPO_ROOT="$(cd "$MODULE_ROOT/../../.." && pwd)"
WRAPPER="$REPO_ROOT/apps/finx-shell-app/android/gradlew"
LOCAL_MAVEN="$ANDROID_DIR/build/maven"
DIST_MAVEN="$MODULE_ROOT/dist/android/maven"
FINXCORE_NATIVE_SDK="$REPO_ROOT/sdk/ReactNative/FinXCoreRN/native-sdk/android/maven"

if [ ! -x "$WRAPPER" ]; then
  echo "Gradle wrapper not found at $WRAPPER" >&2
  exit 1
fi

mkdir -p "$DIST_MAVEN" "$FINXCORE_NATIVE_SDK"

# Publish AAR + POM to the module's local Maven repo.
"$WRAPPER" -p "$ANDROID_DIR" clean publishReleasePublicationToLocalDistRepository

POM_PATH=$(find "$LOCAL_MAVEN" -name "*.pom" -print -quit)
if [ -z "${POM_PATH:-}" ]; then
  echo "No POM found under $LOCAL_MAVEN" >&2
  exit 1
fi

ARTIFACT_DIR="$(cd "$(dirname "$POM_PATH")" && pwd)"
RELATIVE="${ARTIFACT_DIR#${LOCAL_MAVEN}/}" # e.g. com/finx/finxcore/0.1.0
VERSION="${RELATIVE##*/}"
GROUP_AND_ARTIFACT="${RELATIVE%/*}"        # com/finx/finxcore
ARTIFACT_ID="${GROUP_AND_ARTIFACT##*/}"    # finxcore
GROUP_PATH="${GROUP_AND_ARTIFACT%/*}"      # com/finx

if [ -z "$ARTIFACT_ID" ] || [ -z "$VERSION" ] || [ -z "$GROUP_PATH" ]; then
  echo "Failed to parse artifact details from $POM_PATH" >&2
  exit 1
fi

# Sync to dist for standalone usage
rsync -a --delete "$ARTIFACT_DIR/" "$DIST_MAVEN/$GROUP_PATH/$ARTIFACT_ID/$VERSION/"

# Sync to FinXCore's bundled native-sdk so Nitro modules consume without extra setup
rsync -a --delete "$ARTIFACT_DIR/" "$FINXCORE_NATIVE_SDK/$GROUP_PATH/$ARTIFACT_ID/$VERSION/"

# rm -rf "$MODULE_ROOT/.swiftpm" "$MODULE_ROOT/.build" "$BUILD_ROOT"
# rm -rf "$MODULE_ROOT/build" "$MODULE_ROOT/.dist" "$BUILD_ROOT"

echo "Android artifacts copied to:"
echo " - $DIST_MAVEN/$GROUP_PATH/$ARTIFACT_ID/$VERSION"
echo " - $FINXCORE_NATIVE_SDK/$GROUP_PATH/$ARTIFACT_ID/$VERSION"
