# Native ↔ canvas bridge

**Status:** v1 draft · **Protocol version:** 1
**Code:** [`canvas-web/src/bridge/protocol.ts`](../../canvas-web/src/bridge/protocol.ts) · [`BridgeProtocol.swift`](../../packages/OmnieKit/Sources/OmnieKit/Bridge/BridgeProtocol.swift)

## 1. Transport
- The canvas is a bundled web app loaded in `WKWebView` from a custom scheme (`omnie://canvas/index.html`) served by a `WKURLSchemeHandler`. No network is needed to load it.
- **Native → web:** JSON-RPC 2.0 requests delivered with `callAsyncJavaScript("return window.omnie.handle(msg)", arguments: ["msg": …])`, which returns the response.
- **Web → native:** JSON-RPC 2.0 notifications via `window.webkit.messageHandlers.omnie.postMessage(…)`. In v1 the web side only sends notifications; it never asks native for data.
- Messages are UTF-8 JSON. Binary data (images) travels as base64 or, preferably, as an asset ID that the scheme handler serves at `omnie://asset/<id>`.

## 2. Handshake
1. Web loads, then sends `bridge.ready { version }`.
2. Native sends `bridge.hello { version }`. If versions differ, the web side answers with error `-32000 VersionMismatch` and native shows "Please update Omnie" instead of the canvas.
3. Native sends `canvas.mount`, then `canvas.load`.
Requests sent before `bridge.ready` fail with `-32001 NotReady`.

## 3. Methods
See `NativeToWeb` and `WebToNative` in the code; the two lists are kept identical by `bridge-parity.test.ts`.

| Method | Direction | Notes |
|---|---|---|
| `bridge.hello` | native → web | Version handshake |
| `canvas.mount / load / snapshot` | native → web | Scene lifecycle |
| `canvas.upsert / remove / link` | native → web | Learning objects |
| `canvas.addInk` | native → web | Finished PencilKit strokes |
| `canvas.applyAgentOps` | native → web | Canvas Agent drawing; returns rejected ops |
| `canvas.focus / export` | native → web | Navigation, PNG/SVG export |
| `cas.run` | native → web | SymPy in a Pyodide worker; see §4 |
| `bridge.ready`, `canvas.changed`, `canvas.objectTapped`, `canvas.askWhy`, `canvas.selectionChanged`, `log` | web → native | Notifications only |

## 4. CAS worker
- Pyodide + SymPy run in a dedicated Web Worker inside the canvas WebView, loaded from the bundle (no CDN).
- The worker has no network: `fetch`, `XMLHttpRequest` and `WebSocket` are removed from its global scope before user code runs, and the WebView's content rules block all non-`omnie:` loads.
- Each `cas.run` has a timeout (default 5 s). On timeout the worker is terminated and recreated; the result is `{ ok: false, error: "timeout" }`.
- The code must assign its answer to a variable named `result`; the worker returns `srepr(result)` and `latex(result)`.

## 5. Security rules
- **API keys never enter the WebView.** All provider, search and verification calls are made natively by OmnieKit. The canvas receives only results.
- The web side treats every native message as trusted and every canvas content string (student text, model output) as untrusted: no `innerHTML`, LaTeX rendered with KaTeX in `trust: false` mode.
- The WebView loads only `omnie://` URLs. External links open in the system browser after a confirmation.
