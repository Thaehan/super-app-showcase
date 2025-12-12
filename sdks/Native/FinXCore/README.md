# FinXNativeCore native packaging

Build scripts now produce ready-to-consume binaries for Nitro modules or any native app.

## Included native helpers
- **Keychain**: simple set/get/remove/clear helpers.
- **Biometrics**: availability check + Face ID / Touch ID authentication prompt.
- **Crypto**: SHA256 + HMAC-SHA256, secure random bytes, AES-GCM encrypt/decrypt.

## Build outputs
- Android: local Maven repo under:
  - `dist/android/maven/com/finx/finxcore/0.1.0/` (standalone)
  - `../ReactNative/FinXCore/native-sdk/android/maven/com/finx/finxcore/0.1.0/` (auto-copied for Nitro)
- iOS: XCFramework under:
  - `dist/ios/FinXNativeCore.xcframework`
  - `../ReactNative/FinXCore/native-sdk/ios/FinXNativeCore.xcframework` (auto-copied for Nitro)

## Build commands
- Android AAR + Maven: `sdk/Native/FinXCore/scripts/build-android-aar.sh`  
  Uses the existing Gradle wrapper at `apps/finx-shell-app/android/gradlew`, publishes to the module’s local Maven repo, and syncs both `dist/android/maven` and `sdk/ReactNative/FinXCore/native-sdk/android/maven`.
- iOS XCFramework: `sdk/Native/FinXCore/scripts/build-ios-framework.sh`  
  Builds from the Swift package (`Package.swift`) and writes the XCFramework into `dist/ios` and `sdk/ReactNative/FinXCore/native-sdk/ios`.

## Consuming the artifacts
- Android (Nitro module or app):
  - Point Gradle at the bundled Maven repo: `maven { url "$rootDir/../sdk/ReactNative/FinXCore/native-sdk/android/maven" }` and add `implementation "com.finx:finxcore:0.1.0"`, **or**
  - Copy the AAR into your module/app `libs` folder and add `implementation files("libs/FinXCore.aar")`, **or**
  - Point Gradle at the standalone Maven repo: `maven { url "$rootDir/../sdk/Native/FinXCore/dist/android/maven" }` and add `implementation "com.finx:finxcore:0.1.0"`.
- iOS (Nitro module or app):
  - Add `sdk/ReactNative/FinXCore/native-sdk/ios/FinXNativeCore.xcframework` to your Xcode project, link it, and set “Embed & Sign”, **or**
  - In a Podspec, add `s.vendored_frameworks = 'sdk/ReactNative/FinXCore/native-sdk/ios/FinXNativeCore.xcframework'`, **or**
  - In Swift Package manifest, declare a binary target: `binaryTarget(name: "FinXNativeCore", path: "sdk/ReactNative/FinXCore/native-sdk/ios/FinXNativeCore.xcframework")`.

## Requirements
- Android: JDK 17, Android SDK/NDK matching `compileSdk=36`, Kotlin 2.1.20, Gradle 9 wrapper from `apps/finx-shell-app/android`.
- iOS: Xcode with iOS 15+ SDK available.
