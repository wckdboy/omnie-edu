# Omnie Edu

**An open-source AI learning app for iPhone, iPad and Mac.**
Snap or sketch a problem, work it out with a hints-first tutor on an infinite canvas, explore it in generated 3D worlds and an interactive atlas, and trust the result, because every answer is verified before you see it.

> 🚧 Pre-alpha. Start with the plan: **[docs/PLAN.md](docs/PLAN.md)**

## Why Omnie
- **Verified answers.** The Truth Engine checks math with a computer algebra system (SymPy, optional Wolfram|Alpha), cross-checks with a second AI vendor, grounds facts in real sources and re-fetches every citation. If the checks disagree, Omnie tells you instead of guessing.
- **Learn, don't copy.** Hints first, "check my work", mastery tracking.
- **Infinite canvas.** Built on [tldraw](https://tldraw.dev) with Apple Pencil support: problems, steps, graphs, sources and 3D worlds side by side, and the AI tutor can draw on it. An [Excalidraw](https://excalidraw.com) (MIT) build flavor keeps a fully open-source build possible.
- **Explore.** 3D worlds via World Labs (Marble / Atlas) and an interactive globe.
- **BYOK.** Bring your own keys for ~30 AI providers (Anthropic, OpenAI, Gemini, xAI, Mistral, DeepSeek, Qwen, Kimi, OpenRouter, Groq, Bedrock, Azure, Ollama…), search APIs (Brave, Exa, Tavily, Perplexity, Kagi, Linkup, SearXNG…) and verification tools. Works with no key using on-device Apple models.
- **Private.** Local-first, iCloud sync, keys in the Keychain, no ads, no tracking, no Omnie server.

## Repo layout
```
apps/apple/         SwiftUI multiplatform app (iOS · iPadOS · macOS)
packages/OmnieKit/  Swift package: providers, truth engine, pedagogy, storage
canvas-web/         tldraw canvas (Excalidraw fallback) + splat viewer + globe (runs in WKWebView)
providers/          providers.json registry (add a provider without code)
evals/              correctness benchmarks + regression cases
subject-packs/      community curricula, prompts, practice templates
docs/               plan & design docs
```

## License
Omnie Edu's code is [MIT](LICENSE). Dependencies use OSI-approved licenses (MIT, BSD, MPL), with one exception: the **tldraw SDK** is source-available under the [tldraw license](https://tldraw.dev/legal/tldraw-license) and needs a license key in production. The `OMNIE_CANVAS=excalidraw` build flavor uses only OSI-licensed code. See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) and [PLAN §9](docs/PLAN.md#9-licensing--the-tldraw-decision).
