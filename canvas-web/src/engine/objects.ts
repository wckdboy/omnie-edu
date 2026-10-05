// Engine-neutral schema for Omnie's learning objects on the canvas.
// Spec: docs/specs/canvas-engine.md
//
// These objects are what the native app and the Canvas Agent talk about.
// Each engine adapter (today: Excalidraw) decides how to render them.
// The canvas holds only what is needed to draw an object; the full record
// (problem text, solution, verdict, sources) lives natively, keyed by `ref`.

import type { VerdictStatus } from "../truth/verdict.js";

/** Stable ID, created by the side that creates the object (UUID v4 string). */
export type ObjectId = string;

/** Canvas coordinates, in canvas units (not screen pixels). */
export interface Frame {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BaseObject {
  id: ObjectId;
  frame: Frame;
  /** ID of the native record this object shows (SwiftData model ID). */
  ref: string;
  /** Locked objects can't be moved or deleted by the student. */
  locked?: boolean;
}

export interface ProblemObject extends BaseObject {
  kind: "problem";
  /** Plain-text summary shown on the card. */
  title: string;
  latex?: string;
  /** Asset ID of the captured photo, if any. */
  imageAssetId?: string;
}

export interface StepObject extends BaseObject {
  kind: "step";
  /** 1-based position in the solution. */
  index: number;
  /** Hint ladder rung this step was revealed at. */
  rung: "nudge" | "hint" | "worked" | "full";
  text: string;
  latex?: string;
  /** Badge shown on the card. Absent while verification runs. */
  verdict?: VerdictStatus;
}

export interface GraphObject extends BaseObject {
  kind: "graph";
  /** Expressions in the plotter's syntax, e.g. "y = x^2 - 4". */
  expressions: string[];
  viewport: { xMin: number; xMax: number; yMin: number; yMax: number };
}

export interface SourceObject extends BaseObject {
  kind: "source";
  title: string;
  url: string;
  /** The exact span quoted from the source. */
  quote: string;
  /** False when citation verification could not find the quote. */
  quoteFound: boolean;
}

export interface QuizObject extends BaseObject {
  kind: "quiz";
  prompt: string;
  choices?: string[];
  /** Set once the student has answered. Correctness is decided natively. */
  answered?: { correct: boolean };
}

export interface FlashcardObject extends BaseObject {
  kind: "flashcard";
  front: string;
  back: string;
}

export interface WorldObject extends BaseObject {
  kind: "world";
  title: string;
  /** Asset ID of the Gaussian-splat file (.spz / .ply). */
  splatAssetId: string;
  posterAssetId?: string;
  /** Always shown: generated worlds are illustrative. */
  label: "Illustrative — AI-generated";
}

export interface AtlasObject extends BaseObject {
  kind: "atlas";
  title: string;
  center: { lat: number; lon: number };
  zoom: number;
  /** Optional year for historical layers. */
  year?: number;
  pins: { lat: number; lon: number; label: string }[];
}

export interface CodeObject extends BaseObject {
  kind: "code";
  language: "python";
  source: string;
  /** Output from the last sandbox run, if any. */
  output?: string;
}

export type OmnieObject =
  | ProblemObject
  | StepObject
  | GraphObject
  | SourceObject
  | QuizObject
  | FlashcardObject
  | WorldObject
  | AtlasObject
  | CodeObject;

export type OmnieObjectKind = OmnieObject["kind"];

/** An arrow that follows two objects, e.g. step → problem, source → claim. */
export interface Link {
  id: ObjectId;
  from: ObjectId;
  to: ObjectId;
  role: "solves" | "next" | "supports" | "contradicts" | "explores";
}

/** One finished Pencil or pointer stroke, in canvas coordinates. */
export interface InkStroke {
  /** [x, y, pressure 0–1] per sample. */
  points: [number, number, number][];
  color: string;
  width: number;
}
