import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("uses the generic product name without custom domain branding", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /<title>公众号排版工具<\/title>/);
  assert.match(html, /<h1>公众号排版工具<\/h1>/);
  assert.doesNotMatch(html, /yaohongan\.com/);
  assert.doesNotMatch(html, /姚洪安排版编辑器/);
});

test("keeps the writer workflow centered on editor, preview, and theme controls", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /<section class="style-ribbon" aria-label="排版样式条">/);
  assert.match(html, /id="themeQuickStrip"/);
  assert.match(html, /id="themeDrawer"/);
  assert.match(html, /id="copyXButton"/);
  assert.match(html, /<section class="editor-pane" aria-label="Markdown 编辑区">/);
  assert.match(html, /<section class="preview-pane" aria-label="公众号预览区">/);
});
