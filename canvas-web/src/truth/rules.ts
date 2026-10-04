// When an answer may be called "Verified". Spec: docs/specs/verdict.md §3
//
// This is the reference implementation. VerdictRules.swift must give the same
// result for every fixture in docs/specs/fixtures/ (checked in CI).

import type { CheckKind, Domain, Verdict, VerdictStatus, VerificationLevel } from "./verdict.js";

const REQUIRED: Record<Domain, Record<VerificationLevel, CheckKind[]>> = {
  math: {
    fast: ["cas"],
    standard: ["cas", "numeric_spot", "self_consistency"],
    strict: ["cas", "numeric_spot", "self_consistency", "cross_vendor"],
  },
  science: {
    fast: ["cas", "units"],
    standard: ["cas", "numeric_spot", "units", "self_consistency"],
    strict: ["cas", "numeric_spot", "units", "self_consistency", "cross_vendor"],
  },
  factual: {
    fast: ["retrieval", "citation"],
    standard: ["retrieval", "citation"],
    strict: ["retrieval", "citation", "cross_vendor"],
  },
  code: {
    fast: ["sandbox"],
    standard: ["sandbox", "self_consistency"],
    strict: ["sandbox", "self_consistency", "cross_vendor"],
  },
};

/** Supporting sources each claim needs, per level. */
const SOURCES_PER_CLAIM: Record<VerificationLevel, number> = { fast: 1, standard: 1, strict: 2 };

export function requiredChecks(domain: Domain, level: VerificationLevel): CheckKind[] {
  return REQUIRED[domain][level];
}

/** Derive the status a verdict must have from its contents. */
export function deriveStatus(v: Omit<Verdict, "status">): VerdictStatus {
  if (!v.answer) return "abstain";
  if (v.alternatives && v.alternatives.length >= 2) return "disagreement";

  const outcome = (kind: CheckKind) => {
    const runs = v.checks.filter((c) => c.kind === kind);
    if (runs.length === 0) return "missing";
    if (runs.some((c) => c.outcome === "fail")) return "fail";
    if (runs.some((c) => c.outcome === "pass")) return "pass";
    return "skipped";
  };

  const required = requiredChecks(v.domain, v.level);
  // A failed required check means the answer itself is in doubt.
  if (required.some((k) => outcome(k) === "fail")) return "abstain";

  const anyFailed = v.checks.some((c) => c.outcome === "fail");
  const allRequiredPassed = required.every((k) => outcome(k) === "pass");

  const sourceById = new Map(v.sources.map((s) => [s.id, s]));
  const needed = SOURCES_PER_CLAIM[v.level];
  const claimsOk = v.claims.every(
    (c) =>
      c.support === "supported" &&
      c.sourceIds.filter((id) => sourceById.get(id)?.quoteFound === true).length >= needed,
  );
  const factualNeedsClaims = v.domain === "factual" && v.claims.length === 0;

  if (allRequiredPassed && !anyFailed && claimsOk && !factualNeedsClaims) return "verified";
  return "partial";
}

/** Same-vendor judges don't count: a cross_vendor pass needs a different provider than every solver. */
export function crossVendorIsIndependent(v: Verdict): boolean {
  const judges = v.checks.filter((c) => c.kind === "cross_vendor" && c.by).map((c) => c.by!.provider);
  const solvers = v.checks.filter((c) => c.kind !== "cross_vendor" && c.by).map((c) => c.by!.provider);
  return judges.every((j) => !solvers.includes(j));
}
