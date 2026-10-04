# Omnie Edu — Product & Technical Plan

> **Status:** v0.5 draft · October 2026 (canvas: **Excalidraw**)
> **License:** MIT for all Omnie code; every core dependency is OSI-licensed (see [§9](#9-licensing--canvas-decision)).
> **Platforms:** iPhone, iPad, Mac (one SwiftUI multiplatform codebase) · minimum iOS / iPadOS / macOS 26
> **Audience:** students 13+ · **Publisher:** personal Apple developer account (Denmark) · decisions in [§12](#12-decisions)

---

## 0. TL;DR

Omnie Edu is an open-source AI learning app, similar to Gauth but built to teach instead of hand over answers. You snap or sketch a problem and **work it out** with a tutor on an infinite **Excalidraw** canvas. You can **explore** the topic inside generated 3D worlds (World Labs Marble / Atlas) and on an interactive globe. And you can **trust** the result, because every answer goes through a verification engine before you see it.

Three bets separate Omnie from Gauth and similar apps:

1. **Verified, not just generated.** Math is checked by a computer algebra system (CAS: software that does exact symbolic math). Facts are checked against real sources, and every citation is re-fetched to confirm it says what the answer claims. When the checks disagree, Omnie says so instead of guessing.
2. **Learn, don't copy.** Hints come first by default (backed by randomized trials, see §1.3). Mastery is tracked, and the full answer opens only after the student has tried.
3. **Yours.** Open source, BYOK (bring your own API keys) for nearly every major AI, search and verification provider, local-first data, no ads and no tracking. It also works with no key at all, using Apple's on-device models.

---

## 1. Landscape: what exists, what works, what breaks

### 1.1 Commercial apps

| App | What works | What breaks |
|---|---|---|
| **Gauth** (ByteDance / Gauthtech) | Instant photo-to-solution; good at handwriting and notebook photos; clean formatting; 50+ languages; live AI tutor + whiteboard; human experts | Claims a 95% solve rate, but makes silent errors in intermediate steps on long or advanced problems and misreads multi-step word problems. Paywall (Plus ≈ $11.99/mo or $99.99/yr) plus ads. "Snap and copy" invites cheating. Heavy tracking. Sept 2026 US class action alleges students' questions were sent to Google Analytics without consent. |
| **Photomath** (Google) | Best-in-class K-12 math scanning, animated steps | Math only; weak past calculus; explanations behind Plus |
| **Socratic → Google Lens** | Free, broad | Socratic discontinued; Lens is search, not tutoring |
| **Brainly** | Huge community Q&A archive | Uneven quality; shallow humanities answers |
| **Khanmigo** | Truly Socratic, child-safe, nonprofit | Locked to Khan content; slow; little memory across sessions |
| **Mathway / Symbolab** | Reliable CAS answers, step generators | Answers-only free tiers, daily limits, renewal complaints |
| **Wolfram\|Alpha** | Exact computation, the gold standard for checking | Not a tutor; step-by-step is paid; strict input syntax |
| **Question.AI, Solvely, StudyX and similar** | Fast, many subjects | ~65% accuracy on complex problems in one test; same ad/paywall model |
| **ChatGPT Study Mode / Gemini Guided Learning / Claude Learning mode** | Strong models, free toggles, Gemini good at visuals | Normal "just answer" mode is one tap away; no CAS verification; no canvas-native workflow; one vendor |
| **Microsoft Math Solver** | — | Retired July 2025 |

### 1.2 Open-source projects

| Project | License | Strength | Gap Omnie fills |
|---|---|---|---|
| [OpenMAIC](https://github.com/THU-MAIC/OpenMAIC) (~20k★) | MIT | Multi-agent AI classroom, whiteboard, 15+ LLMs | Web and lesson-centric; no native app, no photo-solve, no mastery tracking |
| [DeepTutor](https://github.com/HKUDS/DeepTutor) (~30k★) | Apache-2.0 | Solve, Quiz and Research modes, RAG, MCP | Needs a server; no mobile app, no camera OCR |
| [OATutor](https://github.com/CAHLR/OATutor) | (verify) | Bayesian Knowledge Tracing (a model that estimates which skills a student has mastered), scaffolded hints, OpenStax content | No free-form input, no LLM chat |
| [Pix2Text](https://github.com/breezedeus/Pix2Text), [LaTeX-OCR](https://github.com/lukas-blecher/LaTeX-OCR) | MIT | Open math OCR | Python; needs a server or a Core ML port |
| [Excalidraw](https://github.com/excalidraw/excalidraw) + text-to-diagram | MIT | Mature whiteboard; Mermaid → diagram conversion | A whiteboard, not a tutor; no verification, no pedagogy |

**Conclusion:** there is no credible open-source, native, Gauth-class learning app for Apple platforms. That gap is Omnie's opening.

### 1.3 What the research says about how to teach

- **Bastani et al., PNAS 2025** (~1,000 Turkish high-schoolers): unrestricted GPT-4 raised practice scores 48% but **cut exam scores 17%**. A hint-based tutor grounded in teacher solutions raised practice 127% with **no exam harm**.
- **Kestin et al., Harvard physics RCT, Sci. Reports 2025**: an AI tutor grounded in pre-written solutions, with scaffolding and controlled cognitive load, **roughly doubled learning gains** compared with in-class active learning.
- **Takeaway:** grounded answers + hints first + mastery tracking is the design. Omnie builds that in by default.

### 1.4 Patterns to keep, patterns to fix

| Keep (works in Gauth et al.) | Fix (Omnie does better) |
|---|---|
| One-tap photo capture, handwriting-tolerant OCR | OCR from two engines is compared; if they disagree, the student confirms the parsed problem before anything is solved |
| Clean step-by-step layout | Steps are canvas cards you can drag, question ("why?") and branch from |
| Live tutor + whiteboard | The whiteboard is the whole workspace (Excalidraw), and the AI draws on it |
| Many subjects and languages | Every subject passes the Truth Engine; subject packs are community-built |
| Fast answers | Answers unlock after an attempt; "Check my work" finds the first wrong step |
| Human expert fallback | "Ask a teacher" export: a shareable canvas plus a verification report |

---

## 2. What Omnie Edu does better

| Gauth et al. | Omnie Edu |
|---|---|
| The model guesses the answer | **Truth Engine** verifies before display (CAS, cross-vendor check, source check) and shows a confidence badge |
| Answer first | **Hints first**: Nudge → Hint → Worked step → Full solution, unlocked by attempts |
| Chat thread or fixed steps | **Infinite canvas** (Excalidraw, MIT): problems, ink, steps, graphs, sources and 3D worlds side by side; the AI draws on it too |
| Flat images | **Explorable worlds**: generate a 3D world (Roman forum, cell interior, volcano) and walk through it; an interactive **atlas/globe** for geography and history |
| One vendor's model | **BYOK** across ~30 AI providers, ~15 search/reading tools and ~12 verification tools, plus on-device Apple models with no key |
| Ads, tracking, data sent to analytics | **Local-first**, no ads, no third-party analytics, iCloud sync only, export anytime |
| Closed | **MIT-licensed** Omnie code, auditable prompts, community subject packs |
| Paywalled tiers | Free. You pay providers directly, at cost, with spend caps |

---

## 3. Core features (MVP → v1)

### 3.1 Capture
- Camera, photo, PDF, screenshot, Apple Pencil handwriting, paste text or LaTeX, drag and drop on Mac.
- **Math OCR pipeline:** Apple Vision (text) + a vision LLM (BYOK) + optional Mathpix or Mistral OCR (BYOK). Results are compared; if they disagree, the student confirms the parsed LaTeX before solving.

### 3.2 Tutor (hints first)
- Modes: **Learn** (Socratic, default), **Check my work** (the student writes a solution on the canvas and Omnie finds the first wrong step), **Explain** (concept deep-dive), **Answer** (only after an attempt, or when a parent/teacher allows it).
- Every step is a canvas card the student can drag, annotate, question ("why?") or branch from.
- Voice tutor (on-device speech recognition + Apple or BYOK text-to-speech).

### 3.3 Infinite canvas (Excalidraw)
- One canvas per topic or notebook, built on **Excalidraw** (MIT: mature, no license key, no watermark, freely forkable), running in a bundled WKWebView.
- **Omnie learning objects** are Excalidraw **embeddables** rendered by Omnie (MIT, ours) and linked to native data by ID: problem card, step card (with verification badge), live function graph, source card (quote + link), quiz card, flashcard, 3D-world portal, atlas map, code cell.
- **Arrow bindings** connect steps to the problem and sources to claims, so arrows follow the cards and the verification report can walk the graph.
- **Omnie Canvas Agent** (ours, MIT): the tutor draws diagrams, arrows, highlights and annotations by emitting Excalidraw elements through a typed tool interface. Mermaid diagrams convert via `@excalidraw/mermaid-to-excalidraw`. Everything the agent writes as fact is routed through the Truth Engine first.
- **Apple Pencil:** on iPad a native **PencilKit** layer captures handwriting at the lowest latency (pressure, palm rejection, Scribble). Finished strokes convert to Excalidraw freedraw elements, and handwriting is sent to OCR for math recognition.
- Keyboard and trackpad on Mac.
- Persistence: Excalidraw scene JSON in IndexedDB, mirrored to SwiftData and iCloud. No collaboration server.
- **Engine abstraction:** the app talks to a `CanvasEngine` interface, never to Excalidraw directly, so a custom engine can be added later without touching the rest of the app (see §9).

### 3.4 Worlds & Atlas ("expressive, visual, exploratory")
- **Worlds:** generate a 3D Gaussian-splat world (a 3D scene stored as millions of small colored blobs) from a prompt or image with **World Labs**: the Marble API today, and **Atlas** (announced Sept 2026, early access) once its API opens. The student walks through the world, and the tutor pins "learning hotspots" in 3D.
  - Open alternatives behind the same `WorldGenerator` interface: Microsoft TRELLIS (MIT, objects/scenes), NVIDIA Lyra (check the weights license).
  - Rendering: **MetalSplatter** (MIT, native Metal) on device; **Spark.js** (MIT) inside the canvas portal shape; RealityKit `GaussianSplatComponent` on OS 27+.
  - Every generated world is labeled **"Illustrative — AI-generated"**. Facts shown in hotspots go through the Truth Engine like everything else.
- **Atlas globe:** an interactive globe (MapLibre GL, BSD-3) with Natural Earth (public domain) and NASA imagery for geography, history timelines and climate. MapKit 3D is the native fallback. Map pins can be dropped onto the canvas as atlas cards.
- *Decided: "world atlas models" means both — World Labs worlds and the atlas globe ship in v1.*

### 3.5 Practice & mastery
- Auto-generated practice sets with CAS-verified answers, spaced-repetition flashcards, and a per-skill mastery map (Bayesian Knowledge Tracing, as in OATutor).
- "Exam mode" with no hints, then a review on the canvas.

### 3.6 Family / classroom (v1.x)
- Parent and teacher controls (optional, since v1 is 13+): answer-mode policy, provider allow-list, spend caps, age-appropriate models.
- Share a canvas as a read-only file (`.omnie` = zipped `.excalidraw` JSON + Omnie metadata + assets), as plain `.excalidraw`, or as PNG/SVG/PDF.

---

## 4. Truth Engine — making sure information is correct

**This is the most important subsystem.** Rule: *no unverified claim is shown as fact.*

```
 question ─▶ Classifier ─┬─▶ Math / quantitative science ─▶ Solve ×N ─▶ CAS check ─▶ Numeric spot-check ─┐
                         ├─▶ Factual / humanities ───────▶ Retrieve (search + refs) ─▶ Grounded answer ─▶ Claim split ─▶ Citation verify ─┤
                         └─▶ Code ───────────────────────▶ Solve ─▶ Sandbox run (Pyodide) ─────────────────────────────────────────────┤
                                                                                                                                       ▼
                                                                                         Cross-vendor judge ─▶ Verdict
                                                                                                                                       ▼
                                                      ✅ Verified · 🟡 Partly verified · ⚠️ Disagreement (both shown) · ⛔ Abstain
```

### 4.1 Layers
1. **Program-of-thought + CAS.** The model writes SymPy code; Omnie runs it locally (Pyodide + SymPy bundled in the app, allowed for educational apps under App Store guideline 2.5.2). Final answers are substituted back into the original problem and checked numerically at random points. Optional: Wolfram|Alpha LLM API with the user's own AppID.
2. **Self-consistency.** N independent solutions (default 3, adaptive). Disagreement triggers more samples or escalation.
3. **Cross-vendor check.** A second model from a *different* provider judges the solution step by step and must name the first wrong step if it finds one. Same-vendor checks don't count toward "Verified".
4. **Retrieval grounding.** Factual answers must cite sources from BYOK search (§5.2) and reference APIs: Wikipedia/Wikidata, OpenAlex, Crossref, arXiv, Semantic Scholar, PubChem, NASA, Natural Earth.
5. **Claim splitting.** The answer is split into atomic claims; each claim needs its own supporting source span. Claims without one are flagged in the UI.
6. **Citation verification.** Omnie re-fetches every cited URL or DOI (Jina Reader, Firecrawl or native fetch) and confirms that the quoted span exists and supports the claim. Unsupported citations are removed and the verdict is downgraded.
7. **Units & constants.** Foundation `Measurement` and a CODATA constants table; dimensional analysis on physics answers.
8. **Fact-check lookup.** For contested or current-events claims, Google Fact Check Tools results are shown alongside.
9. **Abstain gracefully.** If checks fail, Omnie shows its reasoning, what disagreed and "ask a teacher" guidance, never a confident wrong answer.

### 4.2 Verification levels (user setting, per subject)
| Level | Checks | Use |
|---|---|---|
| **Fast** | CAS (math) or 1 grounded source | Quick practice |
| **Standard** (default) | CAS + self-consistency + citation verify | Homework |
| **Strict** | Standard + cross-vendor judge + 2 independent sources per claim | Exams, research, teachers |

### 4.3 Transparency UI
- A badge on every answer card. Tap it to open the **Verification Report**: which checks ran, which models, sources with quoted spans, CAS output.
- "Report an error" creates a local regression case. Users can opt in to share anonymized cases with the public **Omnie Eval** set.

### 4.4 Measuring correctness (CI)
- `evals/` suite: GSM8K / MATH / physics / chemistry subsets, our own hand-checked K-12 set, adversarial OCR images, and a citation set (claims with known-good and known-bad sources).
- Each release publishes accuracy per subject × provider × verification level. **Ship gate:** verified-math accuracy ≥ 99% on the K-12 set; zero "Verified" badges on wrong answers in the regression set; ≥ 98% citation validity.

---

## 5. BYOK — providers & tools

Keys live in the **Keychain** (`kSecAttrSynchronizable` for iCloud Keychain sync, optional Face ID gate). There is no Omnie server and no proxy: requests go straight from the device to the provider. Keys are passed into the WebView only per request over the native bridge and are never stored in web storage. The provider list is a JSON registry ([`providers/providers.json`](../providers/providers.json)), so the community can add endpoints without code changes. All base URLs must be checked against vendor docs before release.

### 5.1 AI models (4 adapters cover nearly everything)
| Adapter | Providers |
|---|---|
| **OpenAI-compatible** (custom base URL) | OpenAI, xAI (Grok), Mistral, DeepSeek, Qwen (Alibaba DashScope), Moonshot (Kimi), Zhipu (GLM), MiniMax, Meta Llama API, Groq, Cerebras, SambaNova, Together, Fireworks, DeepInfra, Hugging Face Inference, NVIDIA NIM, OpenRouter, Perplexity Sonar, Azure OpenAI (v1), Amazon Bedrock (OpenAI-compatible endpoint), Ollama, LM Studio, any custom endpoint |
| **Anthropic native** | Claude (Messages API: citations, PDFs, prompt caching, extended thinking) |
| **Gemini native** | Google Gemini (Search grounding, long context, video), Vertex AI (advanced) |
| **On-device** | Apple Foundation Models (no key; available on OS 26+, Private Cloud Compute on OS 27 when present), MLX local models |

Also: Cohere (native adapter, strong for reranking and grounded answers).

**Smart routing:** for each task (OCR, tutor, judge, quiz generation, world generation) the user or "Auto" picks a model, with live cost estimates and monthly spend caps. The judge is always forced onto a different vendor than the solver.

### 5.2 Search & reading
Brave Search, Exa, Tavily, Perplexity Search API, Kagi, You.com, Linkup, Parallel, Serper and SerpAPI (user's choice; their terms apply), SearXNG (self-hosted, no key), Jina Reader, Firecrawl.
*Not supported:* Bing Search API (retired Aug 2025), Google Custom Search JSON API (sunsets Jan 1, 2027).

### 5.3 Verification & knowledge tools
SymPy/Pyodide (built in, offline), Wolfram|Alpha (LLM API), Mathpix and Mistral OCR, OpenAlex, Crossref, Semantic Scholar, arXiv, Wikipedia/Wikidata, PubChem, NASA APIs, Google Fact Check Tools.

### 5.4 Generative media & voice
World Labs (Marble / Atlas), image models via OpenAI, Gemini and others, text-to-speech and transcription via OpenAI, ElevenLabs, Deepgram or Apple on-device.

### 5.5 MCP
Omnie is also an **MCP client** (MCP = Model Context Protocol, a standard way to plug tools into AI apps), so advanced users can add any MCP tool server, such as a school's LMS or a custom knowledge base. MCP tools never bypass the Truth Engine.

---

## 6. Architecture

```
┌────────────────────────── SwiftUI app (iOS · iPadOS · macOS) ──────────────────────────┐
│  Capture  │  Tutor UI  │  Library/Notebooks  │  Settings (BYOK, privacy)  │  Worlds   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ OmnieKit (Swift Package)                                                               │
│   Providers/  (OpenAICompat, Anthropic, Gemini, Cohere, AppleFM, MLX)                  │
│   Truth/      (Classifier, Solver, CASRunner, ClaimSplitter, Judge, Retriever,         │
│                CitationVerifier, Verdict)                                              │
│   Search/     (Brave, Exa, Tavily, Perplexity, Kagi, SearXNG …)                        │
│   Pedagogy/   (HintLadder, MasteryModel/BKT, PracticeGen)                              │
│   Worlds/     (WorldGenerator: WorldLabs, TRELLIS)                                     │
│   Store/      (SwiftData + CloudKit private DB, Keychain)                              │
│   Bridge/     (typed, versioned JSON-RPC ↔ WKWebView)                                  │
├───────────────────────────── WKWebView (bundled, offline) ─────────────────────────────┤
│  canvas-web/  React + CanvasEngine ── Excalidraw + Omnie embeddables + Canvas Agent    │
│               Spark.js splat viewer · MapLibre globe · KaTeX · Pyodide+SymPy worker    │
└────────────────────────────────────────────────────────────────────────────────────────┘
          Native only: MetalSplatter / RealityKit world viewer, PencilKit ink layer (iPad)
```

**Why a native shell + web canvas:** Excalidraw, Spark.js, MapLibre and Pyodide are web-first and best in class. SwiftUI gives native camera, Pencil, Keychain, iCloud, Apple Intelligence and App Store polish. The bridge is typed and versioned.

### Repo layout
```
omnie-edu/
├─ apps/apple/            # Xcode multiplatform project (SwiftUI)
├─ packages/OmnieKit/     # Swift package: providers, truth engine, pedagogy, store
├─ canvas-web/            # TypeScript: CanvasEngine, Excalidraw embeddables + agent, viewers
├─ providers/             # providers.json registry
├─ evals/                 # correctness benchmarks + regression cases
├─ subject-packs/         # community prompts, curricula, practice templates
└─ docs/                  # PLAN.md and later ARCHITECTURE, PRIVACY, CONTRIBUTING
```

---

## 7. Privacy & safety

- Local-first. Sync uses the iCloud private database only. No accounts, no analytics SDKs, no ads.
- A per-provider consent screen before any data leaves the device (App Store guideline 5.1.2(i), Nov 2025), plus an accurate privacy nutrition label.
- Audience is 13+ (App Store age rating 13+; under-13 use is not supported in v1, so no COPPA verifiable-consent flow). In the EU, users under the national digital-consent age (13–16 depending on country; 13 in Denmark) see a parental-consent notice before any provider is enabled.
- Student mode: age-appropriate system prompts, content filters, optional parent PIN for Answer mode and provider changes.
- No hosted tier, ever: Omnie runs no servers and never pays for or relays AI calls.
- Generated media is labeled; no face or likeness generation of real people.
- Security: keys only in the Keychain; no keys in logs; dependency audits in CI; reproducible builds.

---

## 8. Roadmap

Built **solo with AI coding agents**, so phases are **scope-gated, not date-gated**: a phase ends when its exit criteria pass, not on a date. Rough estimates are given for planning only.

| Phase | Estimate | Deliverables |
|---|---|---|
| **0 · Foundations** | ~6–8 weeks | Repo, CI, `OmnieKit` skeleton, provider registry, Keychain BYOK. **Excalidraw + PencilKit spike in WKWebView**: Pencil → freedraw latency, embeddable performance with many cards, scene size limits. Pyodide + SymPy spike. |
| **1 · MVP "Snap → Learn → Verify"** | ~3 months | Camera + OCR, hints-first tutor, Truth Engine v1 (CAS + self-consistency + cross-vendor), canvas notebooks with Omnie shapes, 5 providers (Anthropic, OpenAI, Gemini, OpenRouter, Apple FM), TestFlight |
| **2 · Grounded knowledge** | ~2 months | Search BYOK (Brave, Exa, Tavily, Perplexity, SearXNG), claim splitting, citation verifier, Verification Report UI, evals CI + public scoreboard, Canvas Agent |
| **3 · Explore** | ~3 months | Worlds (World Labs Marble → Atlas), MetalSplatter viewer, atlas globe, practice + mastery map, voice tutor |
| **4 · v1.0 App Store** | when the §4.4 ship gate passes | All providers in §5, optional parent/teacher controls, accessibility audit, localization (English, Danish, Spanish, plus further EU languages), App Store launch |
| **5 · Community** | ongoing | Subject packs, MCP tools, classroom sharing, Android/web exploration |

---

## 9. Licensing & canvas decision

- **Omnie Edu code: MIT.** This includes every Omnie embeddable, the Canvas Agent, OmnieKit and the app.
- **Canvas decision (Oct 2026): Excalidraw (MIT).** Mature, widely used, no license key or watermark, and anyone can fork and ship it. That keeps Omnie fully open source with every core dependency OSI-licensed.
- **tldraw was dropped.** Since SDK 4.0 (Sept 2025) it ships under the source-available *tldraw license* ("not Open Source by any definition", in tldraw's words): production builds need a license key, the free hobby key is non-commercial with a "made with tldraw" watermark, and every fork would need its own key. That conflicts with a freely forkable open-source app.
- The canvas stays behind a `CanvasEngine` interface, and Omnie's learning objects use an engine-neutral schema, so the engine can be swapped later if Excalidraw hits limits.
- Alternatives considered: tldraw (dropped, see above), Quickdraw (MIT, promising but very young), Drawnix/Plait (MIT, strong for mind maps), BlockSuite (MPL-2.0, early stage), perfect-freehand + Konva/PixiJS (build our own), PencilKit (native ink only).
- Avoid GPL components in App Store builds (Giac/Maxima); avoid non-commercial model weights (Nougat, Apple SHARP); avoid region-restricted licenses (Tencent HunyuanWorld excludes the EU). Omnie is distributed from Denmark.
- World Labs output: check the Marble/Atlas terms for redistribution of generated worlds.

---

## 10. Risks

| Risk | Mitigation |
|---|---|
| Excalidraw limits for rich custom cards or AI drawing | Embeddables + `CanvasEngine` abstraction + engine-neutral schema; long-term option of an Omnie engine on perfect-freehand + Konva/PixiJS (all MIT) |
| Pencil latency through the WebView | Native PencilKit layer captures ink; only finished strokes go to Excalidraw |
| World Labs Atlas API not public, or pricey (~$0.12–1.70 per world on Marble) | Marble today, cache worlds, curated shared world library, open TRELLIS fallback |
| BYOK friction for students | On-device Apple model with no key; guided setup; OpenRouter "one key for many models" path |
| App Review (works without a key, AI data disclosure) | No-key on-device mode; demo notes; consent screens |
| Wrong answers despite verification | Abstain policy, public evals, regression set from user reports, "Verified" badge only when CAS/source checks actually passed |
| Search API shutdowns (Bing, Google CSE) | Many interchangeable search providers + self-hosted SearXNG |
| Solo developer: bus factor and burnout | Scope-gated roadmap; open repo from day one; small, well-specified issues that agents or contributors can pick up; evals in CI catch regressions |
| Academic integrity concerns | Hints-first default, Answer-mode policy, "Check my work" as the hero feature |

---

## 11. Success metrics

- **Correctness:** ≥ 99% on the verified K-12 math eval; < 0.5% wrong answers carrying a "Verified" badge; ≥ 98% citation validity.
- **Learning:** pre/post quiz gains in pilot classrooms; hint-to-answer ratio; mastery progression.
- **Trust:** share of answers with a passed verification; abstain rate (should be low but never zero).
- **Community:** contributors, subject packs, providers added via the registry.

---

## 12. Decisions

| Topic | Decision (Oct 2026) | Consequence |
|---|---|---|
| Audience | **13+** | App Store rating 13+; no COPPA consent flow; parental controls optional; EU digital-consent notice (§7) |
| Publisher | **Personal Apple developer account** (Denmark) | Owner's name shown as seller; World Labs and provider terms accepted personally; can move to an org later via App Store app transfer |
| "World atlas models" | **Both**: World Labs worlds (Marble → Atlas) + atlas globe | Both in Phase 3 |
| Minimum OS | **iOS / iPadOS / macOS 26** | On-device Apple models available everywhere; RealityKit splats and Private Cloud Compute used on OS 27 with MetalSplatter / on-device fallbacks on 26 |
| Team | **Solo + AI coding agents** | Scope-gated roadmap (§8); specs and issues written so agents can execute them |
| Timeline | **Scope first** | v1.0 ships when the ship gate passes, not on a fixed date |
| Hosted tier | **None** — BYOK + on-device only | No Omnie servers, no running costs, no accounts |
| Launch languages | **English, Danish, Spanish + further EU languages** | Which extra EU languages: still open |

---

### Sources (Oct 2026)
- Gauth & alternatives: [App Store](https://apps.apple.com/us/app/gauth-ai-%ED%95%99%EC%8A%B5-%EB%8F%99%EB%B0%98%EC%9E%90/id1542571008?l=en-US) · [Implicator](https://www.implicator.ai/bytedances-homework-app-gauthmath-quietly-conquers-american-classrooms/) · [Courthouse News (class action)](https://courthousenews.com/articles/tiktoks-us-entity-faces-class-action-over-ai-homework-helper) · [Pillitteri review](https://pasqualepillitteri.it/en/news/1281/gauth-ai-review-bytedance-homework-app) · [Nibble: Gauth alternatives](https://nibble-app.com/blog/gauth-alternatives) · [Blaze: Gauth alternatives](https://blaze.today/blog/gauth-ai-alternatives/)
- Study modes compared: [Glasp](https://glasp.co/articles/ai-study-modes-compared) · Microsoft Math Solver retirement: [Wikipedia](https://en.wikipedia.org/wiki/Microsoft_Math_Solver)
- Pedagogy: [Bastani et al. (Wharton)](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education) · [Kestin et al. (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)
- Canvas: [Excalidraw](https://github.com/excalidraw/excalidraw) · [mermaid-to-excalidraw](https://github.com/excalidraw/mermaid-to-excalidraw) · [PencilKit](https://developer.apple.com/documentation/pencilkit) · [Quickdraw: open-source tldraw alternatives](https://tryquickdraw.com/blog/open-source-tldraw-alternatives)
- tldraw (dropped): [license](https://tldraw.dev/legal/tldraw-license) · [license update for the SDK](https://tldraw.dev/blog/license-update-for-the-tldraw-sdk) · [hobby license](https://tldraw.dev/get-a-license/hobby)
- World Labs Atlas: [SiliconANGLE](https://siliconangle.com/2026/09/01/fei-fei-lis-world-labs-debuts-atlas-a-world-model-showcase-for-advanced-spatial-intelligence/) · [Radiance Fields](https://radiancefields.com/world-labs-announces-new-world-model-atlas) · [Marble API pricing](https://docs.worldlabs.ai/api/pricing)
- Rendering: [MetalSplatter](https://github.com/scier/MetalSplatter) · [Spark.js](https://github.com/sparkjsdev/spark) · [RealityKit GaussianSplatComponent](https://developer.apple.com/documentation/realitykit/gaussiansplatcomponent)
- Providers & search: [Anthropic OpenAI-SDK compat](https://platform.claude.com/docs/en/cli-sdks-libraries/libraries/openai-sdk) · [Gemini OpenAI compat](https://ai.google.dev/gemini-api/docs/openai) · [Bing API retirement](https://learn.microsoft.com/en-us/lifecycle/announcements/bing-search-api-retirement) · [Google CSE shutdown](https://brave.com/learn/google-api-shutdown/) · [Exa pricing](https://exa.ai/docs/changelog/pricing-update) · [Wolfram|Alpha APIs](https://products.wolframalpha.com/api)
- Apple: [WWDC26 Foundation Models](https://developer.apple.com/videos/play/wwdc2026/241) · [App Review 5.1.2(i) change](https://techcrunch.com/2025/11/13/apples-new-app-review-guidelines-clamp-down-on-apps-sharing-personal-data-with-third-party-ai) · [Guideline 2.5.2 educational code](https://www.macstories.net/linked/apples-app-store-guidelines-now-allow-executable-code-in-educational-apps-and-developer-tools/)
