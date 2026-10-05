# Verdict

**Status:** v1 draft · **Schema version:** 1
**Code:** [`verdict.schema.json`](schemas/verdict.schema.json) · [`verdict.ts`](../../canvas-web/src/truth/verdict.ts) · [`rules.ts`](../../canvas-web/src/truth/rules.ts) · [`Verdict.swift`](../../packages/OmnieKit/Sources/OmnieKit/Truth/Verdict.swift) · [`VerdictRules.swift`](../../packages/OmnieKit/Sources/OmnieKit/Truth/VerdictRules.swift) · [fixtures](fixtures/)

## 1. Purpose
Every answer Omnie shows carries a Verdict: which checks ran, what they found, which sources back which claims, and one overall status. The badge on the answer card and the Verification Report are both drawn from it.

## 2. Statuses
| Status | Badge | Meaning |
|---|---|---|
| `verified` | ✅ Verified | Every required check for the domain and level passed, nothing failed, and every claim has enough sources whose quote was found |
| `partial` | 🟡 Partly verified | Nothing required failed, but something required was skipped or errored, or a claim lacks enough found sources |
| `disagreement` | ⚠️ Disagreement | Two or more distinct answers; all are shown with who gave them |
| `abstain` | ⛔ Not sure | No answer, or a required check failed. Omnie shows its reasoning and "ask a teacher" guidance |

## 3. Rules
The status is **derived, never chosen**: `deriveStatus()` computes it from the verdict's contents, and both the TypeScript and Swift implementations must agree with every fixture.

Required checks:

| Domain | Fast | Standard (default) | Strict |
|---|---|---|---|
| math | cas | cas, numeric_spot, self_consistency | + cross_vendor |
| science | cas, units | cas, numeric_spot, units, self_consistency | + cross_vendor |
| factual | retrieval, citation | retrieval, citation | + cross_vendor |
| code | sandbox | sandbox, self_consistency | + cross_vendor |

Sources per claim: 1 (fast, standard), 2 (strict). A source counts only if `quoteFound` is true. Factual answers with zero claims can't be verified.

Order of evaluation: no answer → `abstain`; ≥ 2 alternatives → `disagreement`; any required check failed → `abstain`; all required passed and nothing failed and claims OK → `verified`; otherwise → `partial`.

**Cross-vendor independence:** a `cross_vendor` check must name a provider different from every solver's provider. A verdict that breaks this is invalid (tested on every fixture).

## 4. Fixtures
`fixtures/*.json` are the shared test cases. Each must validate against the schema and its `status` must equal `deriveStatus()` in both languages. There must be at least one fixture per status. Add a fixture with every rule change.

## 5. Versioning
Breaking changes bump `schemaVersion`. `StoredVerdict` keeps the raw JSON, so old verdicts are decoded with a migration step instead of a database migration.
