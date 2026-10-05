// The only interface the rest of Omnie uses to talk to the canvas.
// Spec: docs/specs/canvas-engine.md
//
// Today there is one implementation (Excalidraw). Nothing outside
// src/engine/excalidraw/ may import @excalidraw/* directly.

import type { InkStroke, Link, ObjectId, OmnieObject } from "./objects.js";

/** Opaque, engine-specific scene data plus Omnie's own index. */
export interface SceneSnapshot {
  /** Which engine wrote `scene`. Loading a snapshot from another engine is an error. */
  engine: "excalidraw";
  engineVersion: string;
  /** The engine's native document (for Excalidraw: the .excalidraw JSON). */
  scene: unknown;
  objects: OmnieObject[];
  links: Link[];
}

export interface MountOptions {
  theme: "light" | "dark";
  /** Read-only canvases (shared files, exam review) disable all editing. */
  readOnly: boolean;
  /** On iPad, Pencil ink is captured natively and arrives via addInk(). */
  nativeInk: boolean;
  locale: "en" | "da" | "es" | "de";
}

/** Drawing operations the Canvas Agent may perform. Kept small on purpose. */
export type AgentOp =
  | { op: "upsert"; object: OmnieObject }
  | { op: "remove"; id: ObjectId }
  | { op: "link"; link: Link }
  | { op: "arrow"; from: { x: number; y: number }; to: { x: number; y: number }; label?: string }
  | { op: "highlight"; ids: ObjectId[]; color: string }
  | { op: "text"; at: { x: number; y: number }; text: string }
  | { op: "mermaid"; at: { x: number; y: number }; source: string };

export interface AgentOpResult {
  applied: number;
  /** Ops that failed, with the reason, so the agent can correct itself. */
  rejected: { index: number; reason: string }[];
}

export type CanvasEvent =
  | { type: "changed"; snapshot: SceneSnapshot }
  | { type: "objectTapped"; id: ObjectId }
  | { type: "askWhy"; id: ObjectId }
  | { type: "selectionChanged"; ids: ObjectId[] };

export type Unsubscribe = () => void;

export interface CanvasEngine {
  readonly id: SceneSnapshot["engine"];

  mount(el: HTMLElement, opts: MountOptions): Promise<void>;
  unmount(): void;

  load(snapshot: SceneSnapshot): Promise<void>;
  snapshot(): SceneSnapshot;

  /** Create or replace objects by ID. */
  upsert(objects: OmnieObject[]): void;
  remove(ids: ObjectId[]): void;
  link(links: Link[]): void;

  /** Add finished strokes as freehand drawing. Returns the new element IDs. */
  addInk(strokes: InkStroke[]): string[];

  applyAgentOps(ops: AgentOp[]): Promise<AgentOpResult>;

  /** Pan and zoom so the given objects are visible. */
  focus(ids: ObjectId[], opts?: { animate?: boolean; padding?: number }): void;

  exportImage(format: "png" | "svg", opts?: { ids?: ObjectId[]; scale?: number }): Promise<Blob>;

  on(handler: (event: CanvasEvent) => void): Unsubscribe;
}
