// swift-tools-version: 5.9
import PackageDescription

let package = Package(
  name: "SMobileCore",
  platforms: [
    .iOS(.v15)
  ],
  products: [
    .library(
      name: "SMobileCore",
      type: .dynamic,
      targets: ["SMobileCore"]
    )
  ],
  targets: [
    .target(
      name: "SMobileCore",
      path: "ios",
      sources: ["SMobileKeychain.swift", "SMobileBiometrics.swift", "SMobileCrypto.swift"]
    )
  ]
)
