// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "OmnieKit",
    platforms: [.iOS(.v26), .macOS(.v26)],
    products: [
        .library(name: "OmnieKit", targets: ["OmnieKit"]),
    ],
    targets: [
        .target(name: "OmnieKit"),
        .testTarget(name: "OmnieKitTests", dependencies: ["OmnieKit"]),
    ]
)
