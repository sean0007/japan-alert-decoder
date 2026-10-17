import assert from "node:assert/strict";
import test from "node:test";
import { apiHandler, openapiDoc, preflight } from "./agent-api";
import { API_DISCLAIMER, API_INFO, ENDPOINTS, EXAMPLE_GET, PUBLIC_URL } from "./api";

const e = ENDPOINTS.decode;
const handler = apiHandler(e.compute, { disclaimer: API_DISCLAIMER, docs: `${PUBLIC_URL}/openapi.json`, example: `${PUBLIC_URL}${e.example}` });

test(`GET ${EXAMPLE_GET} → EEW, CORS, disclaimer`, async () => {
  const res = await handler(new Request(`${PUBLIC_URL}${EXAMPLE_GET}`));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  const body = await res.json();
  assert.equal(body.disclaimer, API_DISCLAIMER);
  assert.equal(body.primary.id, "eew-warning");
  assert.equal(body.urgency, "act_now");
  assert.ok(body.sources.length);
});

test("POST JSON body matches GET", async () => {
  const get = await (await handler(new Request(`${PUBLIC_URL}${EXAMPLE_GET}`))).json();
  const post = await handler(new Request(`${PUBLIC_URL}${e.path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "緊急地震速報 強い揺れに備えてください", situation: "train" }) }));
  assert.equal(post.status, 200);
  assert.deepEqual(await post.json(), get);
});

test("alert id + lang via GET", async () => {
  const b = await (await handler(new Request(`${PUBLIC_URL}${e.path}?alert=l4-landslide&lang=zh-TW`))).json();
  assert.equal(b.primary.nameJa, "レベル4土砂災害危険警報");
  assert.equal(b.primary.nameLocal, "4級土石流危險警報");
});

test("bad inputs → 400 with disclaimer", async () => {
  for (const q of ["", "alert=nope", "text=x&lang=xx", "text=x&situation=moon"]) {
    const res = await handler(new Request(`${PUBLIC_URL}${e.path}?${q}`));
    assert.equal(res.status, 400, q);
    assert.equal((await res.json()).disclaimer, API_DISCLAIMER);
  }
});

test("unrecognised text → 200 not_recognized", async () => {
  const b = await (await handler(new Request(`${PUBLIC_URL}${e.path}?text=hello`))).json();
  assert.equal(b.verdict, "not_recognized");
});

test("malformed JSON body → 400", async () => {
  const res = await handler(new Request(`${PUBLIC_URL}${e.path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{nope" }));
  assert.equal(res.status, 400);
});

test("OPTIONS preflight is CORS open", () => {
  const res = preflight();
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
});

test("OpenAPI lists /api/decode GET and POST", () => {
  const spec = openapiDoc(API_INFO, PUBLIC_URL, [e]) as { openapi: string; paths: Record<string, { get: { parameters: { name: string }[] }; post: unknown }> };
  assert.ok(spec.openapi.startsWith("3."));
  assert.ok(spec.paths["/api/decode"]?.post);
  assert.ok(spec.paths["/api/decode"].get.parameters.find((p) => p.name === "text"));
});
