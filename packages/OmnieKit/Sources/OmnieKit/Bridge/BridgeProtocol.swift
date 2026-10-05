// Messages between the native app and the canvas WebView.
// Spec: docs/specs/bridge.md · TypeScript mirror: canvas-web/src/bridge/protocol.ts
//
// The method lists below must match protocol.ts exactly (checked in CI by
// canvas-web/test/bridge-parity.test.ts). API keys never cross this bridge.

import Foundation

public enum Bridge {
    /// Bump on any breaking change. Both sides refuse to talk on a mismatch.
    public static let protocolVersion = 1

    /// Requests the native app sends to the canvas.
    public enum NativeToWeb: String, CaseIterable, Sendable {
        case bridgeHello = "bridge.hello"
        case canvasMount = "canvas.mount"
        case canvasLoad = "canvas.load"
        case canvasSnapshot = "canvas.snapshot"
        case canvasUpsert = "canvas.upsert"
        case canvasRemove = "canvas.remove"
        case canvasLink = "canvas.link"
        case canvasAddInk = "canvas.addInk"
        case canvasApplyAgentOps = "canvas.applyAgentOps"
        case canvasFocus = "canvas.focus"
        case canvasExport = "canvas.export"
        case casRun = "cas.run"
    }

    /// Notifications the canvas sends to the native app (no reply).
    public enum WebToNative: String, CaseIterable, Sendable {
        case bridgeReady = "bridge.ready"
        case canvasChanged = "canvas.changed"
        case canvasObjectTapped = "canvas.objectTapped"
        case canvasAskWhy = "canvas.askWhy"
        case canvasSelectionChanged = "canvas.selectionChanged"
        case log = "log"
    }

    public enum ErrorCode: Int, Sendable {
        case parseError = -32700
        case invalidRequest = -32600
        case methodNotFound = -32601
        case invalidParams = -32602
        case internalError = -32603
        case versionMismatch = -32000
        case notReady = -32001
        case timeout = -32002
    }

    public struct Request<Params: Encodable & Sendable>: Encodable, Sendable {
        public var jsonrpc = "2.0"
        public var id: Int
        public var method: String
        public var params: Params

        public init(id: Int, method: NativeToWeb, params: Params) {
            self.id = id
            self.method = method.rawValue
            self.params = params
        }
    }

    public struct RPCError: Codable, Error, Sendable {
        public var code: Int
        public var message: String
    }

    public struct Response<Result: Decodable & Sendable>: Decodable, Sendable {
        public var jsonrpc: String
        public var id: Int
        public var result: Result?
        public var error: RPCError?
    }

    /// Envelope used for decoding incoming notifications before their params.
    public struct IncomingNotification: Decodable, Sendable {
        public var jsonrpc: String
        public var method: String
    }

    public struct CASRunParams: Codable, Sendable {
        /// Python source using SymPy. Runs in a worker with no network access.
        public var code: String
        public var timeoutMs: Int
    }

    public struct CASRunResult: Codable, Sendable {
        public var ok: Bool
        public var result: String?
        public var latex: String?
        public var stdout: String
        public var error: String?
        public var durationMs: Int
    }
}
