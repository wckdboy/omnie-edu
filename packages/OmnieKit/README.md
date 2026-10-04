# OmnieKit

Swift package: Providers, Truth engine, Search, Pedagogy, Store, Bridge. See docs/PLAN.md §4–6 and docs/specs/.

Current stubs (not yet compiled in CI, see Phase 0 task P0-1):
- `Truth/Verdict.swift`, `Truth/VerdictRules.swift` — verification result and the "Verified" rules
- `Bridge/BridgeProtocol.swift` — messages to and from the canvas WebView
- `Store/Models.swift` — SwiftData model (CloudKit-compatible)

`swift test` runs the shared verdict fixtures in `docs/specs/fixtures/`.
