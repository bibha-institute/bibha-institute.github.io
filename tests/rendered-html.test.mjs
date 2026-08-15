import assert from "node:assert/strict";
import test from "node:test";

test("server-renders the BIBHA stakeholder experience", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /BIBHA Institute/);
  assert.match(html, /Research talent is everywhere/);
  assert.match(html, /What we study/);
  assert.match(html, /Founding Pilot 01/);
  assert.match(html, /Version 2\.2/);
  assert.match(html, /href="https:\/\/khalid-saifullah\.com\/"/);
  assert.doesNotMatch(html, /WHAT THIS RELEASE WILL NOT DO/);
  assert.match(html, /Founding network registry/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});
