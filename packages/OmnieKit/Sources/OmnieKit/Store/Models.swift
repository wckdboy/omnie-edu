// Local data model, synced through the iCloud private database.
// Spec: docs/specs/data-model.md
//
// CloudKit rules for SwiftData: every property has a default or is optional,
// every relationship is optional, no unique constraints. API keys are NOT
// stored here — they live only in the Keychain.

import Foundation
import SwiftData

@Model
public final class Notebook {
    public var id: UUID = UUID()
    public var title: String = ""
    public var subject: String = ""
    public var createdAt: Date = Date()
    public var updatedAt: Date = Date()

    @Relationship(deleteRule: .cascade, inverse: \CanvasDocument.notebook)
    public var canvas: CanvasDocument?

    @Relationship(deleteRule: .cascade, inverse: \Problem.notebook)
    public var problems: [Problem]? = []

    public init(title: String, subject: String) {
        self.title = title
        self.subject = subject
    }
}

/// The canvas scene for one notebook (a SceneSnapshot, JSON-encoded).
@Model
public final class CanvasDocument {
    public var id: UUID = UUID()
    /// "excalidraw" today. Lets us migrate if the engine ever changes.
    public var engine: String = "excalidraw"
    public var engineVersion: String = ""
    @Attribute(.externalStorage) public var snapshot: Data = Data()
    public var updatedAt: Date = Date()
    public var notebook: Notebook?

    public init(engineVersion: String, snapshot: Data) {
        self.engineVersion = engineVersion
        self.snapshot = snapshot
    }
}

@Model
public final class Problem {
    public var id: UUID = UUID()
    /// Text as confirmed by the student after OCR.
    public var text: String = ""
    public var latex: String?
    /// "math" | "science" | "factual" | "code" (see Domain).
    public var domain: String = Domain.math.rawValue
    /// Skill IDs from the subject pack, used by the mastery model.
    public var skillIds: [String] = []
    public var createdAt: Date = Date()
    public var notebook: Notebook?

    @Relationship(deleteRule: .cascade, inverse: \Asset.problem)
    public var images: [Asset]? = []

    @Relationship(deleteRule: .cascade, inverse: \Attempt.problem)
    public var attempts: [Attempt]? = []

    @Relationship(deleteRule: .cascade, inverse: \SolutionStep.problem)
    public var steps: [SolutionStep]? = []

    @Relationship(deleteRule: .cascade, inverse: \StoredVerdict.problem)
    public var verdicts: [StoredVerdict]? = []

    public init(text: String, domain: Domain) {
        self.text = text
        self.domain = domain.rawValue
    }
}

/// One step of the tutor's solution, revealed rung by rung.
@Model
public final class SolutionStep {
    public var id: UUID = UUID()
    public var index: Int = 0
    /// "nudge" | "hint" | "worked" | "full"
    public var rung: String = "nudge"
    public var text: String = ""
    public var latex: String?
    public var revealedAt: Date?
    public var problem: Problem?

    public init(index: Int, rung: String, text: String) {
        self.index = index
        self.rung = rung
        self.text = text
    }
}

/// A student's own try: what unlocks the next hint rung and feeds mastery.
@Model
public final class Attempt {
    public var id: UUID = UUID()
    public var answerText: String = ""
    public var correct: Bool?
    /// From "Check my work": 1-based index of the first wrong step.
    public var firstWrongStep: Int?
    public var hintsUsed: Int = 0
    public var createdAt: Date = Date()
    public var problem: Problem?

    public init(answerText: String) {
        self.answerText = answerText
    }
}

/// A Verdict, stored as its JSON so the schema can evolve without migrations.
@Model
public final class StoredVerdict {
    public var id: UUID = UUID()
    public var schemaVersion: Int = Verdict.schemaVersion
    /// Copied out of `json` for fast filtering ("show unverified answers").
    public var status: String = VerdictStatus.abstain.rawValue
    public var json: Data = Data()
    public var createdAt: Date = Date()
    public var problem: Problem?

    public init(_ verdict: Verdict) throws {
        self.status = verdict.status.rawValue
        self.json = try Verdict.makeEncoder().encode(verdict)
        self.createdAt = verdict.createdAt
    }

    public func decoded() throws -> Verdict {
        try Verdict.makeDecoder().decode(Verdict.self, from: json)
    }
}

/// Mastery estimate for one skill (Bayesian Knowledge Tracing).
@Model
public final class SkillMastery {
    public var skillId: String = ""
    /// P(skill is known), 0–1.
    public var pKnown: Double = 0.1
    public var opportunities: Int = 0
    public var updatedAt: Date = Date()

    public init(skillId: String) {
        self.skillId = skillId
    }
}

/// Images, PDFs and Gaussian-splat worlds referenced from the canvas by ID.
@Model
public final class Asset {
    public var id: UUID = UUID()
    /// "image" | "pdf" | "splat" | "poster"
    public var kind: String = "image"
    public var mimeType: String = ""
    @Attribute(.externalStorage) public var data: Data = Data()
    /// Where it came from, e.g. "camera", "worldlabs:marble".
    public var origin: String = ""
    public var problem: Problem?

    public init(kind: String, mimeType: String, data: Data, origin: String) {
        self.kind = kind
        self.mimeType = mimeType
        self.data = data
        self.origin = origin
    }
}
