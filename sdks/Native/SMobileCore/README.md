# SMobileNativeCore native packaging

Build scripts now produce ready-to-consume binaries for Nitro modules or any native app.

## Included native helpers
- **Keychain**: simple set/get/remove/clear helpers.
- **Biometrics**: availability check + Face ID / Touch ID authentication prompt.
- **Crypto**: SHA256 + HMAC-SHA256, secure random bytes, AES-GCM encrypt/decrypt.

## Build outputs
- Android: local Maven repo under:
  - `dist/android/maven/com/smobile/smobilecore/0.1.0/` (standalone)
  - `../ReactNative/SMobileCore/native-sdk/android/maven/com/smobile/smobilecore/0.1.0/` (auto-copied for Nitro)
- iOS: XCFramework under:
  - `dist/ios/SMobileNativeCore.xcframework`
  - `../ReactNative/SMobileCore/native-sdk/ios/SMobileNativeCore.xcframework` (auto-copied for Nitro)

## Build commands
- Android AAR + Maven: `sdk/Native/SMobileCore/scripts/build-android-aar.sh`  
  Uses the existing Gradle wrapper at `apps/smobile-shell-app/android/gradlew`, publishes to the module’s local Maven repo, and syncs both `dist/android/maven` and `sdk/ReactNative/SMobileCore/native-sdk/android/maven`.
- iOS XCFramework: `sdk/Native/SMobileCore/scripts/build-ios-framework.sh`  
  Builds from the Swift package (`Package.swift`) and writes the XCFramework into `dist/ios` and `sdk/ReactNative/SMobileCore/native-sdk/ios`.

## Consuming the artifacts
- Android (Nitro module or app):
  - Point Gradle at the bundled Maven repo: `maven { url "$rootDir/../sdk/ReactNative/SMobileCore/native-sdk/android/maven" }` and add `implementation "com.smobile:smobilecore:0.1.0"`, **or**
  - Copy the AAR into your module/app `libs` folder and add `implementation files("libs/SMobileCore.aar")`, **or**
  - Point Gradle at the standalone Maven repo: `maven { url "$rootDir/../sdk/Native/SMobileCore/dist/android/maven" }` and add `implementation "com.smobile:smobilecore:0.1.0"`.
- iOS (Nitro module or app):
  - Add `sdk/ReactNative/SMobileCore/native-sdk/ios/SMobileNativeCore.xcframework` to your Xcode project, link it, and set “Embed & Sign”, **or**
  - In a Podspec, add `s.vendored_frameworks = 'sdk/ReactNative/SMobileCore/native-sdk/ios/SMobileNativeCore.xcframework'`, **or**
  - In Swift Package manifest, declare a binary target: `binaryTarget(name: "SMobileNativeCore", path: "sdk/ReactNative/SMobileCore/native-sdk/ios/SMobileNativeCore.xcframework")`.

## Requirements
- Android: JDK 17, Android SDK/NDK matching `compileSdk=36`, Kotlin 2.1.20, Gradle 9 wrapper from `apps/smobile-shell-app/android`.
- iOS: Xcode with iOS 15+ SDK available.
