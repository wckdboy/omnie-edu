// Every fixture in docs/specs/fixtures must match the JSON Schema, and its
// status must equal what deriveStatus() computes from its contents.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv2020 } from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import { crossVendorIsIndependent, deriveStatus } from "../src/truth/rules.js";
import type { Verdict } from "../src/truth/verdict.js";

const addFormats = addFormatsModule as unknown as (ajv: Ajv2020) => void;
const specs = join(dirname(fileURLToPath(import.meta.url)), "../../../docs/specs");
const schema = JSON.parse(readFileSync(join(specs, "schemas/verdict.schema.json"), "utf8"));
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

const fixtures = readdirSync(join(specs, "fixtures")).filter((f) => f.endsWith(".json"));

test("there are fixtures for every status", () => {
  const statuses = new Set(
    fixtures.map((f) => (JSON.parse(readFileSync(join(specs, "fixtures", f), "utf8")) as Verdict).status),
  );
  assert.deepEqual([...statuses].sort(), ["abstain", "disagreement", "partial", "verified"]);
});

for (const file of fixtures) {
  test(file, () => {
    const v = JSON.parse(readFileSync(join(specs, "fixtures", file), "utf8")) as Verdict;
    assert.ok(validate(v), JSON.stringify(validate.errors, null, 2));
    assert.equal(deriveStatus(v), v.status);
    assert.ok(crossVendorIsIndependent(v), "cross_vendor judge must use a different provider than the solvers");
  });
}
