// The bridge method lists in protocol.ts and BridgeProtocol.swift must match,
// so neither side can add a method the other doesn't know about.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const ts = readFileSync(join(root, "canvas-web/src/bridge/protocol.ts"), "utf8");
const swift = readFileSync(join(root, "packages/OmnieKit/Sources/OmnieKit/Bridge/BridgeProtocol.swift"), "utf8");

function tsMethods(interfaceName: string): string[] {
  const body = ts.match(new RegExp(`export interface ${interfaceName} \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
  return [...body.matchAll(/^\s*"([^"]+)":/gm)].map((m) => m[1]!).sort();
}

function swiftMethods(enumName: string): string[] {
  const body = swift.match(new RegExp(`public enum ${enumName}[^{]*\\{([\\s\\S]*?)\\n    \\}`))?.[1] ?? "";
  return [...body.matchAll(/case \w+ = "([^"]+)"/g)].map((m) => m[1]!).sort();
}

for (const name of ["NativeToWeb", "WebToNative"]) {
  test(`${name} methods match between TypeScript and Swift`, () => {
    const a = tsMethods(name);
    const b = swiftMethods(name);
    assert.ok(a.length > 0, `no methods parsed from protocol.ts ${name}`);
    assert.deepEqual(a, b);
  });
}

test("protocol versions match", () => {
  const tsVersion = ts.match(/BRIDGE_PROTOCOL_VERSION = (\d+)/)?.[1];
  const swiftVersion = swift.match(/protocolVersion = (\d+)/)?.[1];
  assert.ok(tsVersion);
  assert.equal(tsVersion, swiftVersion);
});
