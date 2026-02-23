#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SDKS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$SDKS_DIR/.." && pwd)"
SOURCE_WRAPPER_DIR="$REPO_ROOT/packages/host/android"

if [ ! -f "$SOURCE_WRAPPER_DIR/gradlew" ]; then
    echo "Error: Source gradle wrapper not found at $SOURCE_WRAPPER_DIR/gradlew"
    exit 1
fi

echo "Syncing Gradle Wrapper from $SOURCE_WRAPPER_DIR..."

find "$SDKS_DIR" -type d -name "android" | while read -r android_dir; do
    if [[ "$android_dir" == *"/dist/"* ]] || [[ "$android_dir" == *"/build/"* ]]; then
        continue
    fi

    echo "Symlinking to $android_dir"
    
    # Calculate relative path from target android_dir to source wrapper dir
    REL_PATH=$(python3 -c "import os; print(os.path.relpath('$SOURCE_WRAPPER_DIR', '$android_dir'))")
    
    # Remove existing files/dirs
    rm -rf "$android_dir/gradle" "$android_dir/gradlew" "$android_dir/gradlew.bat"
    
    # Create symlinks
    ln -s "$REL_PATH/gradle" "$android_dir/gradle"
    ln -s "$REL_PATH/gradlew" "$android_dir/gradlew"
    ln -s "$REL_PATH/gradlew.bat" "$android_dir/gradlew.bat"
done

echo "✅ Gradle Wrapper symlinked successfully across all SDKs!"
