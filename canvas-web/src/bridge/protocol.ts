// Messages between the native app (Swift) and the canvas WebView.
// Spec: docs/specs/bridge.md · Swift mirror: packages/OmnieKit/Sources/OmnieKit/Bridge/BridgeProtocol.swift
//
// JSON-RPC 2.0 over WKScriptMessageHandlerWithReply (web → native) and
// evaluateJavaScript (native → web). API keys never cross this bridge.

import type { AgentOp, AgentOpResult, MountOptions, SceneSnapshot } from "../engine/CanvasEngine.js";
import type { InkStroke, Link, ObjectId, OmnieObject } from "../engine/objects.js";

/** Bump on any breaking change. Both sides refuse to talk on a mismatch. */
export const BRIDGE_PROTOCOL_VERSION = 1;

export interface RpcRequest<M extends string = string, P = unknown> {
  jsonrpc: "2.0";
  id: number;
  method: M;
  params: P;
}

export interface RpcNotification<M extends string = string, P = unknown> {
  jsonrpc: "2.0";
  method: M;
  params: P;
}

export interface RpcError {
  code: number;
  message: string;
  data?: unknown;
}

export type RpcResponse<R = unknown> =
  | { jsonrpc: "2.0"; id: number; result: R }
  | { jsonrpc: "2.0"; id: number; error: RpcError };

/** Standard JSON-RPC codes plus Omnie's own range (-32000 to -32099). */
export const RpcErrorCode = {
  ParseError: -32700,
  InvalidRequest: -32600,
  MethodNotFound: -32601,
  InvalidParams: -32602,
  InternalError: -32603,
  VersionMismatch: -32000,
  NotReady: -32001,
  Timeout: -32002,
} as const;

export interface CasRunParams {
  /** Python source using SymPy. Runs in a worker with no network access. */
  code: string;
  timeoutMs: number;
}

export interface CasRunResult {
  ok: boolean;
  /** Value of the variable `result` after the run, serialized with sympy.srepr. */
  result?: string;
  /** LaTeX of `result`, for display. */
  latex?: string;
  stdout: string;
  error?: string;
  durationMs: number;
}

/** Requests the native app sends to the canvas. Method name → [params, result]. */
export interface NativeToWeb {
  "bridge.hello": [{ version: number }, { version: number; engine: string; engineVersion: string }];
  "canvas.mount": [MountOptions, null];
  "canvas.load": [SceneSnapshot, null];
  "canvas.snapshot": [Record<string, never>, SceneSnapshot];
  "canvas.upsert": [{ objects: OmnieObject[] }, null];
  "canvas.remove": [{ ids: ObjectId[] }, null];
  "canvas.link": [{ links: Link[] }, null];
  "canvas.addInk": [{ strokes: InkStroke[] }, { elementIds: string[] }];
  "canvas.applyAgentOps": [{ ops: AgentOp[] }, AgentOpResult];
  "canvas.focus": [{ ids: ObjectId[]; animate?: boolean }, null];
  "canvas.export": [{ format: "png" | "svg"; ids?: ObjectId[]; scale?: number }, { base64: string; mimeType: string }];
  "cas.run": [CasRunParams, CasRunResult];
}

/** Notifications the canvas sends to the native app (no reply). */
export interface WebToNative {
  "bridge.ready": { version: number };
  /** Debounced (≥ 500 ms) after the scene changes. */
  "canvas.changed": { snapshot: SceneSnapshot };
  "canvas.objectTapped": { id: ObjectId };
  "canvas.askWhy": { id: ObjectId };
  "canvas.selectionChanged": { ids: ObjectId[] };
  "log": { level: "debug" | "info" | "warn" | "error"; message: string };
}

export type NativeToWebMethod = keyof NativeToWeb;
export type WebToNativeMethod = keyof WebToNative;
