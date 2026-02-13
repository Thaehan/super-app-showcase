#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BUILD_ROOT="$MODULE_ROOT/build/ios"
DEVICE_DERIVED="$BUILD_ROOT/device"
SIM_DERIVED="$BUILD_ROOT/simulator"
DIST_DIR="$MODULE_ROOT/dist/ios"
REPO_ROOT="$(cd "$MODULE_ROOT/../../.." && pwd)"

# Defaults: keep current scheme, output as FinXCore to host multiple native packages later.
FRAMEWORK_NAME="${FRAMEWORK_NAME:-FinXCore}"
SCHEME_NAME="${SCHEME_NAME:-FinXCore}"

FINXCORE_XCFRAMEWORK_DIR="$REPO_ROOT/sdks/ReactNative/FinXCoreRN/native-sdk/ios/${FRAMEWORK_NAME}.xcframework"

rm -rf "$BUILD_ROOT"
mkdir -p "$DEVICE_DERIVED" "$SIM_DERIVED" "$DIST_DIR"

cd "$MODULE_ROOT"

xcodebuild -scheme "$SCHEME_NAME" \
  -destination "generic/platform=iOS" \
  -configuration Release \
  -derivedDataPath "$DEVICE_DERIVED" \
  -sdk iphoneos \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES \
  SKIP_INSTALL=NO

xcodebuild -scheme "$SCHEME_NAME" \
  -destination "generic/platform=iOS Simulator" \
  -configuration Release \
  -derivedDataPath "$SIM_DERIVED" \
  -sdk iphonesimulator \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES \
  SKIP_INSTALL=NO

DEVICE_FRAMEWORK="$DEVICE_DERIVED/Build/Products/Release-iphoneos/PackageFrameworks/${SCHEME_NAME}.framework"
SIM_FRAMEWORK="$SIM_DERIVED/Build/Products/Release-iphonesimulator/PackageFrameworks/${SCHEME_NAME}.framework"
DEVICE_SWIFTMODULE="$DEVICE_DERIVED/Build/Products/Release-iphoneos/${SCHEME_NAME}.swiftmodule"
SIM_SWIFTMODULE="$SIM_DERIVED/Build/Products/Release-iphonesimulator/${SCHEME_NAME}.swiftmodule"

if [ ! -d "$DEVICE_FRAMEWORK" ] || [ ! -d "$SIM_FRAMEWORK" ]; then
  echo "Missing built frameworks." >&2
  echo "Device framework: $DEVICE_FRAMEWORK" >&2
  echo "Simulator framework: $SIM_FRAMEWORK" >&2
  exit 1
fi

# Ensure Swiftmodule files are embedded in the frameworks for proper import.
mkdir -p "$DEVICE_FRAMEWORK/Modules/${SCHEME_NAME}.swiftmodule" "$SIM_FRAMEWORK/Modules/${SCHEME_NAME}.swiftmodule"
if [ -d "$DEVICE_SWIFTMODULE" ]; then
  rsync -a "$DEVICE_SWIFTMODULE"/ "$DEVICE_FRAMEWORK/Modules/${SCHEME_NAME}.swiftmodule/"
fi
if [ -d "$SIM_SWIFTMODULE" ]; then
  rsync -a "$SIM_SWIFTMODULE"/ "$SIM_FRAMEWORK/Modules/${SCHEME_NAME}.swiftmodule/"
fi

rm -rf "$DIST_DIR/${FRAMEWORK_NAME}.xcframework"

xcodebuild -create-xcframework \
  -framework "$DEVICE_FRAMEWORK" \
  -framework "$SIM_FRAMEWORK" \
  -output "$DIST_DIR/${FRAMEWORK_NAME}.xcframework"

# Sync to FinXCore's bundled native-sdk so Nitro modules consume without extra setup.
rm -rf "$FINXCORE_XCFRAMEWORK_DIR"
rsync -a "$DIST_DIR/${FRAMEWORK_NAME}.xcframework/" "$FINXCORE_XCFRAMEWORK_DIR/"

# Clean up SwiftPM and build leftovers to keep the repo tidy.
rm -rf "$MODULE_ROOT/.swiftpm" "$MODULE_ROOT/.build" "$BUILD_ROOT"
rm -rf "$MODULE_ROOT/build" "$MODULE_ROOT/.dist" "$BUILD_ROOT"

echo "iOS XCFramework saved to:"
echo " - $DIST_DIR/${FRAMEWORK_NAME}.xcframework"
echo " - $FINXCORE_XCFRAMEWORK_DIR"
