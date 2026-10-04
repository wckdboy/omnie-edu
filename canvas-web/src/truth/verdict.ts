// Verification result attached to every answer.
// Spec: docs/specs/verdict.md · JSON Schema: docs/specs/schemas/verdict.schema.json
//
// The Truth Engine (native, OmnieKit/Truth) produces these. The canvas only
// renders them, so this file must stay in sync with Verdict.swift.

export const VERDICT_SCHEMA_VERSION = 1;

export type VerdictStatus = "verified" | "partial" | "disagreement" | "abstain";

export type VerificationLevel = "fast" | "standard" | "strict";

export type Domain = "math" | "science" | "factual" | "code";

export type CheckKind =
  | "cas"
  | "numeric_spot"
  | "self_consistency"
  | "cross_vendor"
  | "retrieval"
  | "citation"
  | "units"
  | "factcheck"
  | "sandbox";

export type CheckOutcome = "pass" | "fail" | "skipped" | "error";

export interface ModelRef {
  provider: string;
  model: string;
}

export interface Check {
  kind: CheckKind;
  outcome: CheckOutcome;
  by?: ModelRef;
  /** Short human-readable explanation, shown in the Verification Report. */
  detail: string;
  durationMs: number;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  doi?: string;
  quote: string;
  quoteFound: boolean;
  /** ISO 8601. */
  fetchedAt: string;
}

export interface Claim {
  id: string;
  text: string;
  support: "supported" | "unsupported" | "contradicted";
  sourceIds: string[];
}

export interface Answer {
  text: string;
  latex?: string;
}

export interface Verdict {
  schemaVersion: typeof VERDICT_SCHEMA_VERSION;
  status: VerdictStatus;
  level: VerificationLevel;
  domain: Domain;
  answer?: Answer;
  checks: Check[];
  claims: Claim[];
  sources: Source[];
  /** Present when status is "disagreement": every distinct answer and who gave it. */
  alternatives?: { answer: Answer; by: ModelRef[] }[];
  /** 1-based index of the first wrong step, for "Check my work". */
  firstWrongStep?: number;
  /** ISO 8601. */
  createdAt: string;
}
