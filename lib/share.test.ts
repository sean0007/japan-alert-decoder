import assert from "node:assert/strict";
import test from "node:test";
import { EXAMPLE_LANDSLIDE, EXAMPLE_SHARED, isIndexable, parseShared, resultPath, sharedQuery, sharedResult } from "./share";

test("example round-trips; plain alert pages are indexable", () => {
  assert.deepEqual(parseShared(new URLSearchParams(sharedQuery(EXAMPLE_SHARED))), EXAMPLE_SHARED);
  assert.equal(resultPath(EXAMPLE_SHARED), "/r?a=eew-warning&s=train");
  assert.equal(isIndexable(EXAMPLE_SHARED), false);
  assert.equal(isIndexable(EXAMPLE_LANDSLIDE), true);
});

test("share link → same result as the API", () => {
  const r = sharedResult(EXAMPLE_SHARED);
  assert.equal(r.primary?.id, "eew-warning");
  assert.match(r.primary!.doNow[0], /strap/);
  const ko = parseShared({ a: "tsunami-warning", s: "coast", l: "ko" })!;
  assert.equal(sharedResult(ko).primary?.nameLocal, "지진해일 경보");
});

test("bad share params → null", () => {
  assert.equal(parseShared({ a: "nope" }), null);
  assert.equal(parseShared({ a: "eew-warning", s: "moon" }), null);
  assert.equal(parseShared({ a: "eew-warning", l: "xx" }), null);
  assert.equal(parseShared({}), null);
});
