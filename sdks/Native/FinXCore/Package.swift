// swift-tools-version: 5.9
import PackageDescription

let package = Package(
  name: "FinXCore",
  platforms: [
    .iOS(.v15)
  ],
  products: [
    .library(
      name: "FinXCore",
      type: .dynamic,
      targets: ["FinXCore"]
    )
  ],
  targets: [
    .target(
      name: "FinXCore",
      path: "ios",
      sources: ["FinXKeychain.swift", "FinXBiometrics.swift", "FinXCrypto.swift"]
    )
  ]
)
