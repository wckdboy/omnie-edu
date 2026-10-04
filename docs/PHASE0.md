# Phase 0 — Foundations backlog

**Goal:** prove the risky parts work on real devices and set up the contracts, so Phase 1 ("Snap → Learn → Verify") is just building.
**Built by:** solo developer + AI coding agents. Each task is sized to be one agent session or one pull request, and has a GitHub issue labeled `phase-0` under the tracking issue [#1](https://github.com/wckdboy/omnie-edu/issues/1).
**Exit criteria:** every task below is done, and every spike has a written result (pass, or fail plus the chosen fallback) in `docs/spikes/`.

Reference devices for performance budgets: **iPhone 15** (A16), **iPad Air M2** with Apple Pencil Pro, **MacBook Air M1**. All on OS 26.

## Order
```
P0-1 CI ──┬─ P0-2 App shell ── P0-3 Bridge ──┬─ P0-4 Excalidraw engine ──┬─ P0-5 Pencil spike
          │                                  │                           └─ P0-6 Embeddable spike
          │                                  └─ P0-7 Pyodide/SymPy spike
          ├─ P0-8 Keychain + provider adapters
          └─ P0-9 Verify provider registry
P0-10 Eval set v0   P0-11 Licence & terms checks   (independent, any time)
```

## Tasks

### P0-1 · CI and repo hygiene · [#2](https://github.com/wckdboy/omnie-edu/issues/2)
- GitHub Actions: the `canvas-web` job (typecheck + tests on Ubuntu) already exists in `.github/workflows/ci.yml`; add `swift build` + `swift test` for `packages/OmnieKit` on a macOS runner with Xcode 26. The Swift stubs have never been compiled, so expect small fixes.
- `CONTRIBUTING.md`, `CODEOWNERS`, issue and PR templates, `.editorconfig`, SwiftFormat + Prettier configs.
- **Done when:** both jobs run on every PR and are green on `main`; the Swift verdict tests pass against the shared fixtures.

### P0-2 · Xcode multiplatform app shell · [#3](https://github.com/wckdboy/omnie-edu/issues/3)
- New SwiftUI app target in `apps/apple/` for iOS, iPadOS and macOS 26, depending on `OmnieKit`.
- A `WKWebView` that loads the bundled `canvas-web` build from `omnie://canvas/index.html` through a `WKURLSchemeHandler`; content rules block all other origins.
- **Done when:** the app launches on all three reference devices in airplane mode and shows a placeholder canvas page loaded from the bundle.

### P0-3 · Bridge v1 · [#4](https://github.com/wckdboy/omnie-edu/issues/4)
- Implement [docs/specs/bridge.md](specs/bridge.md) on both sides: handshake, request/response with IDs and timeouts, notifications, error codes.
- Contract tests: a Swift test that round-trips every `NativeToWeb` method against a stub web handler, and the existing parity test.
- **Done when:** `bridge.hello` with a mismatched version shows the "update" state; a 1,000-message round-trip benchmark has median latency < 5 ms on iPhone 15.

### P0-4 · Excalidraw `CanvasEngine` · [#5](https://github.com/wckdboy/omnie-edu/issues/5)
- Implement `CanvasEngine` on `@excalidraw/excalidraw` (currently 0.18.x) in `canvas-web/src/engine/excalidraw/`, following the mapping in [canvas-engine.md §3](specs/canvas-engine.md).
- Placeholder renderers for all nine object kinds; arrows bound to objects for `Link`s; `snapshot`/`load` round-trip; `applyAgentOps` with validation; Mermaid via `@excalidraw/mermaid-to-excalidraw`.
- **Done when:** a scene with every object kind and link survives `snapshot → load` unchanged (test), and an ESLint rule blocks `@excalidraw/*` imports outside `src/engine/excalidraw/`.

### P0-5 · Spike: Apple Pencil ink · [#10](https://github.com/wckdboy/omnie-edu/issues/10)
- Compare (a) Excalidraw's own pen input inside WKWebView with (b) a native PencilKit overlay whose finished strokes are sent via `canvas.addInk`.
- Measure on iPad Air M2: input-to-ink latency (high-speed video, 240 fps), dropped strokes over 500 strokes, pressure fidelity, palm rejection, Scribble.
- **Pass:** input-to-ink latency ≤ 30 ms with 0 dropped strokes; finished stroke appears as a freedraw element ≤ 100 ms after pen-up.
- **Write-up:** `docs/spikes/pencil.md` with numbers and the chosen approach.

### P0-6 · Spike: embeddable performance · [#11](https://github.com/wckdboy/omnie-edu/issues/11)
- Scenes with 50, 200 and 500 learning objects (mix of static cards and live graph/atlas/world).
- Measure pan/zoom frame rate and memory on iPhone 15 and iPad Air M2.
- **Pass:** ≥ 60 fps at 50 objects, ≥ 30 fps at 200, WebView memory ≤ 600 MB at 200.
- **If it fails:** test the fallback from canvas-engine.md §3 (native Excalidraw groups for static cards, embeddables only for live content) and record its numbers.
- **Write-up:** `docs/spikes/embeddables.md`.

### P0-7 · Spike: Pyodide + SymPy offline · [#12](https://github.com/wckdboy/omnie-edu/issues/12)
- Bundle Pyodide and SymPy (no CDN), run them in a Web Worker behind `cas.run`, with the network removed from the worker scope.
- Measure on iPhone 15: cold start, warm `solve`/`simplify` latency on 50 sample problems, app size increase, memory.
- **Pass:** cold start ≤ 4 s (and done in the background at launch), warm median ≤ 300 ms, p95 ≤ 2 s, download size increase ≤ 40 MB, works in airplane mode.
- **If it fails:** evaluate a slimmed Pyodide package set, or lazy download of the CAS on first use (still verified offline afterwards).
- **Write-up:** `docs/spikes/cas.md`.

### P0-8 · Keychain BYOK + first provider adapters · [#6](https://github.com/wckdboy/omnie-edu/issues/6)
- `KeyStore` in OmnieKit: save/read/delete per provider ID, `kSecAttrSynchronizable`, optional Face ID (`LAContext`) gate.
- Load `providers/providers.json`; implement the `openai-compat`, `anthropic` and `apple-foundation-models` adapters behind one `LanguageModelProvider` protocol (streaming text + tool calls).
- **Done when:** unit tests cover KeyStore; a smoke test calls one real model per adapter when a key is present in the environment (skipped otherwise); a log-scrubbing test proves keys never appear in logs.

### P0-9 · Verify the provider registry · [#7](https://github.com/wckdboy/omnie-edu/issues/7)
- For every entry in `providers.json`: check the base URL, auth header, and OpenAI-compatibility claims against the vendor's current docs; record the doc link and date.
- Add `docsURL` and `verifiedAt` fields to each entry; remove or mark anything that can't be confirmed.
- **Done when:** every entry has `verifiedAt`, and a CI check fails if a new entry lacks it.

### P0-10 · Eval set v0 · [#8](https://github.com/wckdboy/omnie-edu/issues/8)
- Format and runner skeleton in `evals/`: one JSONL record per problem (`id`, `language`, `domain`, `skillIds`, `problem`, `answer`, `answerLatex`, `checkedBy`).
- **200 hand-checked K-12 math problems in English** (algebra, geometry, fractions, word problems, intro calculus), each answer independently checked twice.
- Seed 20 problems each in Danish, Spanish and German so the format is proven for all launch languages.
- **Done when:** the runner can score any provider adapter against the set and print accuracy per skill.

### P0-11 · Licence and terms checks · [#9](https://github.com/wckdboy/omnie-edu/issues/9)
- Confirm licences: OATutor (marked "verify" in the plan), every Pyodide package we bundle, `@excalidraw/mermaid-to-excalidraw`, MapLibre, KaTeX.
- Read World Labs (Marble) API terms for redistributing generated worlds inside an app, as an individual developer.
- Read App Review guidelines 2.5.2 and 5.1.2(i) as they stand today and note what Omnie must show.
- **Done when:** `THIRD_PARTY_LICENSES.md` is complete and `docs/compliance.md` lists each requirement with a link.
