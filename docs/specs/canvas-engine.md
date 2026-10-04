# Canvas engine

**Status:** v1 draft · **Code:** [`canvas-web/src/engine/CanvasEngine.ts`](../../canvas-web/src/engine/CanvasEngine.ts), [`objects.ts`](../../canvas-web/src/engine/objects.ts)

## 1. Purpose
The rest of Omnie (the native app via the bridge, and the Canvas Agent) talks to the canvas only through `CanvasEngine`. Today the only implementation is Excalidraw. Nothing outside `canvas-web/src/engine/excalidraw/` may import `@excalidraw/*`, so the engine can be replaced without touching anything else.

## 2. Omnie objects
Learning content is described by an engine-neutral `OmnieObject` union: `problem`, `step`, `graph`, `source`, `quiz`, `flashcard`, `world`, `atlas`, `code`. Each object has:

- `id`: stable UUID, chosen by whoever creates the object.
- `frame`: position and size in canvas units.
- `ref`: the ID of the native SwiftData record it shows. **The canvas holds only what it needs to draw.** Full problem text, solutions, verdicts and sources live natively.

`Link`s connect objects (`solves`, `next`, `supports`, `contradicts`, `explores`) and are drawn as arrows that follow both ends.

## 3. Excalidraw mapping (Phase 0 to confirm)
| Omnie | Excalidraw |
|---|---|
| Learning object | `embeddable` element rendered by Omnie's own React component, with `customData: { omnie: OmnieObject }` |
| Link | `arrow` element bound to both embeddables (`startBinding` / `endBinding`), `customData: { omnieLink: Link }` |
| Ink (`addInk`) | `freedraw` element, pressure from Pencil |
| Agent `mermaid` op | `@excalidraw/mermaid-to-excalidraw` → elements |
| `SceneSnapshot.scene` | `.excalidraw` JSON (elements + appState subset + files) |

`SceneSnapshot.objects` and `.links` are an index rebuilt from `customData` on every snapshot; the `.excalidraw` scene is authoritative.

**Phase 0 spike decides** whether embeddables (iframes) are fast enough. If not, the fallback is to render learning objects as Excalidraw-native groups (rectangle + text + image) and only use embeddables for live content (graph, world, atlas, code). The interface does not change either way.

## 4. Rules
- `upsert` replaces by `id`. If the student has moved or resized an object, a later upsert keeps the student's `frame` unless the new upsert's `frame` differs from the one it sent before (the student's layout wins over unchanged data).
- `locked` objects can't be moved or deleted by the student; the agent may still update them.
- `applyAgentOps` validates every op and returns `rejected` with a reason instead of throwing, so the agent can fix and retry. Ops are applied as one undo step.
- `world` objects always show the "Illustrative — AI-generated" label; the type makes it impossible to omit.
- The engine emits `changed` debounced (≥ 500 ms). The native side persists the snapshot.
- Read-only mode (`MountOptions.readOnly`) disables all edits, including agent ops.
