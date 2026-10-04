// Swift side of the shared verdict contract: every fixture must decode, and
// VerdictRules must derive the same status as canvas-web/src/truth/rules.ts.

import Foundation
import Testing
@testable import OmnieKit

private let fixturesDir = URL(fileURLWithPath: #filePath)
    .deletingLastPathComponent() // OmnieKitTests
    .deletingLastPathComponent() // Tests
    .deletingLastPathComponent() // OmnieKit
    .deletingLastPathComponent() // packages
    .deletingLastPathComponent() // repo root
    .appendingPathComponent("docs/specs/fixtures")

private func fixtureNames() throws -> [String] {
    try FileManager.default.contentsOfDirectory(atPath: fixturesDir.path)
        .filter { $0.hasSuffix(".json") }
        .sorted()
}

@Test func fixturesExist() throws {
    #expect(try fixtureNames().count >= 4)
}

@Test(arguments: try fixtureNames())
func fixtureStatusMatchesRules(_ name: String) throws {
    let data = try Data(contentsOf: fixturesDir.appendingPathComponent(name))
    let verdict = try Verdict.makeDecoder().decode(Verdict.self, from: data)
    #expect(VerdictRules.deriveStatus(verdict) == verdict.status, "\(name)")
    #expect(VerdictRules.crossVendorIsIndependent(verdict), "\(name)")
}

@Test func storedVerdictRoundTrips() throws {
    let data = try Data(contentsOf: fixturesDir.appendingPathComponent("math-verified-standard.json"))
    let verdict = try Verdict.makeDecoder().decode(Verdict.self, from: data)
    let stored = try StoredVerdict(verdict)
    #expect(stored.status == "verified")
    #expect(try stored.decoded().answer?.text == verdict.answer?.text)
}
