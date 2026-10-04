// When an answer may be called "Verified". Spec: docs/specs/verdict.md §3
//
// Mirrors canvas-web/src/truth/rules.ts (the reference implementation).
// Both must agree on every fixture in docs/specs/fixtures/.

public enum VerdictRules {
    public static func requiredChecks(_ domain: Domain, _ level: VerificationLevel) -> [CheckKind] {
        switch (domain, level) {
        case (.math, .fast): [.cas]
        case (.math, .standard): [.cas, .numericSpot, .selfConsistency]
        case (.math, .strict): [.cas, .numericSpot, .selfConsistency, .crossVendor]
        case (.science, .fast): [.cas, .units]
        case (.science, .standard): [.cas, .numericSpot, .units, .selfConsistency]
        case (.science, .strict): [.cas, .numericSpot, .units, .selfConsistency, .crossVendor]
        case (.factual, .fast), (.factual, .standard): [.retrieval, .citation]
        case (.factual, .strict): [.retrieval, .citation, .crossVendor]
        case (.code, .fast): [.sandbox]
        case (.code, .standard): [.sandbox, .selfConsistency]
        case (.code, .strict): [.sandbox, .selfConsistency, .crossVendor]
        }
    }

    /// Supporting sources each claim needs, per level.
    public static func sourcesPerClaim(_ level: VerificationLevel) -> Int {
        level == .strict ? 2 : 1
    }

    /// Derive the status a verdict must have from its contents. Ignores `verdict.status`.
    public static func deriveStatus(_ v: Verdict) -> VerdictStatus {
        guard v.answer != nil else { return .abstain }
        if let alternatives = v.alternatives, alternatives.count >= 2 { return .disagreement }

        enum CheckResult { case missing, fail, pass, skipped }
        func outcome(_ kind: CheckKind) -> CheckResult {
            let runs = v.checks.filter { $0.kind == kind }
            if runs.isEmpty { return .missing }
            if runs.contains(where: { $0.outcome == .fail }) { return .fail }
            if runs.contains(where: { $0.outcome == .pass }) { return .pass }
            return .skipped
        }

        let required = requiredChecks(v.domain, v.level)
        // A failed required check means the answer itself is in doubt.
        if required.contains(where: { outcome($0) == .fail }) { return .abstain }

        let anyFailed = v.checks.contains { $0.outcome == .fail }
        let allRequiredPassed = required.allSatisfy { outcome($0) == .pass }

        let sourceById = Dictionary(v.sources.map { ($0.id, $0) }, uniquingKeysWith: { first, _ in first })
        let needed = sourcesPerClaim(v.level)
        let claimsOK = v.claims.allSatisfy { claim in
            claim.support == .supported
                && claim.sourceIds.filter { sourceById[$0]?.quoteFound == true }.count >= needed
        }
        let factualNeedsClaims = v.domain == .factual && v.claims.isEmpty

        if allRequiredPassed && !anyFailed && claimsOK && !factualNeedsClaims { return .verified }
        return .partial
    }

    /// Same-vendor judges don't count: a cross-vendor pass needs a different provider than every solver.
    public static func crossVendorIsIndependent(_ v: Verdict) -> Bool {
        let judges = v.checks.filter { $0.kind == .crossVendor }.compactMap { $0.by?.provider }
        let solvers = Set(v.checks.filter { $0.kind != .crossVendor }.compactMap { $0.by?.provider })
        return judges.allSatisfy { !solvers.contains($0) }
    }
}
