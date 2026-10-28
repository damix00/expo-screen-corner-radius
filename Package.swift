// swift-tools-version:5.9

// Only used to unit test the platform-independent lookup logic with `swift test`.
// The module itself is distributed through CocoaPods (ios/ExpoScreenCornerRadius.podspec).

import PackageDescription

let package = Package(
  name: "ExpoScreenCornerRadiusCore",
  platforms: [.macOS(.v13)],
  targets: [
    .target(
      name: "ExpoScreenCornerRadiusCore",
      path: "ios",
      sources: ["CornerRadiusResolver.swift", "CornerRadiusData.swift"]
    ),
    .testTarget(
      name: "ExpoScreenCornerRadiusCoreTests",
      dependencies: ["ExpoScreenCornerRadiusCore"],
      path: "Tests/ExpoScreenCornerRadiusCoreTests"
    )
  ]
)
