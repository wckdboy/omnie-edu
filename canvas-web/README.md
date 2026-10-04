# canvas-web

The infinite canvas, bundled into the app and loaded in WKWebView.

- `CanvasEngine` interface + engine-neutral Omnie shape schema
- **tldraw** adapter (default): Omnie custom shapes and bindings, Canvas Agent (based on tldraw's agent starter kit)
- **Excalidraw** adapter (`OMNIE_CANVAS=excalidraw`): fully MIT build using embeddables
- Spark.js splat viewer, MapLibre globe, KaTeX, Pyodide + SymPy worker

See docs/PLAN.md §3.3 and §9.
