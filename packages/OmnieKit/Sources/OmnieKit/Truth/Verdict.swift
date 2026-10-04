// Verification result attached to every answer.
// Spec: docs/specs/verdict.md · JSON Schema: docs/specs/schemas/verdict.schema.json
// TypeScript mirror: canvas-web/src/truth/verdict.ts

import Foundation

public enum VerdictStatus: String, Codable, Sendable {
    case verified, partial, disagreement, abstain
}

public enum VerificationLevel: String, Codable, Sendable, CaseIterable {
    case fast, standard, strict
}

public enum Domain: String, Codable, Sendable, CaseIterable {
    case math, science, factual, code
}

public enum CheckKind: String, Codable, Sendable {
    case cas
    case numericSpot = "numeric_spot"
    case selfConsistency = "self_consistency"
    case crossVendor = "cross_vendor"
    case retrieval, citation, units, factcheck, sandbox
}

public enum CheckOutcome: String, Codable, Sendable {
    case pass, fail, skipped, error
}

public struct ModelRef: Codable, Hashable, Sendable {
    public var provider: String
    public var model: String
}

public struct Check: Codable, Sendable {
    public var kind: CheckKind
    public var outcome: CheckOutcome
    public var by: ModelRef?
    public var detail: String
    public var durationMs: Int
}

public struct Source: Codable, Sendable {
    public var id: String
    public var title: String
    public var url: URL
    public var doi: String?
    public var quote: String
    public var quoteFound: Bool
    public var fetchedAt: Date
}

public struct Claim: Codable, Sendable {
    public enum Support: String, Codable, Sendable { case supported, unsupported, contradicted }
    public var id: String
    public var text: String
    public var support: Support
    public var sourceIds: [String]
}

public struct Answer: Codable, Sendable {
    public var text: String
    public var latex: String?
}

public struct Alternative: Codable, Sendable {
    public var answer: Answer
    public var by: [ModelRef]
}

public struct Verdict: Codable, Sendable {
    public static let schemaVersion = 1

    public var schemaVersion: Int = Verdict.schemaVersion
    public var status: VerdictStatus
    public var level: VerificationLevel
    public var domain: Domain
    public var answer: Answer?
    public var checks: [Check]
    public var claims: [Claim]
    public var sources: [Source]
    public var alternatives: [Alternative]?
    public var firstWrongStep: Int?
    public var createdAt: Date

    public static func makeDecoder() -> JSONDecoder {
        let d = JSONDecoder()
        d.dateDecodingStrategy = .iso8601
        return d
    }

    public static func makeEncoder() -> JSONEncoder {
        let e = JSONEncoder()
        e.dateEncodingStrategy = .iso8601
        e.outputFormatting = [.sortedKeys]
        return e
    }
}
