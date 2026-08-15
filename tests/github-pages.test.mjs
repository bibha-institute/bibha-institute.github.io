import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("builds the GitHub Pages mirror with working public routes", async () => {
  const index = await readFile("github-pages-dist/index.html", "utf8");
  const privacy = await readFile("github-pages-dist/privacy/index.html", "utf8");
  const assets = await readdir("github-pages-dist/assets");
  const scripts = await Promise.all(assets.filter((name) => name.endsWith(".js")).map((name) => readFile(`github-pages-dist/assets/${name}`, "utf8")));
  const javascript = scripts.join("\n");

  assert.match(index, /BIBHA Institute/);
  assert.match(index, /\/assets\//);
  assert.doesNotMatch(index, /\/bibha-institute\/assets\//);
  assert.match(index, /https:\/\/bibha\.medics-global\.com\//);
  assert.match(privacy, /Privacy \| BIBHA Institute/);
  assert.match(privacy, /\/assets\//);
  assert.doesNotMatch(privacy, /\/bibha-institute\/assets\//);
  assert.match(javascript, /baire-platform\.khalidsaifullahfahim\.chatgpt\.site/);
  assert.match(javascript, /bibha-institute\.github\.io/);
  assert.match(javascript, /bibha\.medics-global\.com/);
  assert.match(javascript, /desk\.medics-global\.com/);
  assert.doesNotMatch(javascript, /kingkhalid310\.github\.io/);
  assert.match(javascript, /Contact BIBHA/);
});
