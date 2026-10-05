# Specs

The contracts between Omnie's parts. Where a contract can be code, the code is the source of truth and these documents explain it.

| Spec | What it defines | Source of truth | Checked by |
|---|---|---|---|
| [canvas-engine.md](canvas-engine.md) | The `CanvasEngine` interface and Omnie's canvas objects | `canvas-web/src/engine/` | `tsc` |
| [bridge.md](bridge.md) | Messages between the Swift app and the canvas WebView | `canvas-web/src/bridge/protocol.ts` + `packages/OmnieKit/Sources/OmnieKit/Bridge/BridgeProtocol.swift` | `canvas-web/test/bridge-parity.test.ts` |
| [data-model.md](data-model.md) | What is stored on device and synced via iCloud | `packages/OmnieKit/Sources/OmnieKit/Store/Models.swift` | Swift build |
| [verdict.md](verdict.md) | The verification result and when an answer counts as "Verified" | `schemas/verdict.schema.json` + `canvas-web/src/truth/rules.ts` (mirrored in `VerdictRules.swift`) | `canvas-web/test/verdict.test.ts`, `OmnieKitTests/VerdictRulesTests.swift`, `fixtures/` |

## Changing a contract
1. Change the code on **both** sides (TypeScript and Swift) in the same pull request.
2. A breaking bridge change bumps `BRIDGE_PROTOCOL_VERSION` / `Bridge.protocolVersion`. A breaking verdict change bumps `schemaVersion` and adds a migration note to `verdict.md`.
3. Add or update a fixture when verdict rules change. Fixtures are the shared test cases for both languages.
