# Third-party licenses

Omnie Edu's own code is MIT. These planned dependencies have their own terms:

| Component | License | Notes |
|---|---|---|
| **tldraw SDK** | **tldraw license (source-available, not OSI)** | Default canvas engine. Production builds need a license key (free hobby key = non-commercial + "made with tldraw" watermark; commercial key = paid). Forks need their own key. |
| Excalidraw | MIT | Fallback canvas engine (`OMNIE_CANVAS=excalidraw`), fully OSI build |
| PencilKit | Apple SDK | Native Pencil ink fallback (iPad) |
| Spark.js | MIT | Gaussian-splat viewer (web) |
| MetalSplatter | MIT | Gaussian-splat viewer (native) |
| MapLibre GL JS | BSD-3-Clause | Globe / atlas |
| Natural Earth | Public domain | Map data |
| Pyodide / SymPy | MPL-2.0 / BSD-3-Clause | On-device CAS verification |
| KaTeX | MIT | Math rendering |

Policy: tldraw is the only non-OSI dependency and is reached only through the `CanvasEngine` interface. No GPL code in App Store builds, no non-commercial model weights, no region-restricted model licenses.
