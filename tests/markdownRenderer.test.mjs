import test from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown } from "../src/markdown.js";

test("renders common WeChat article blocks", () => {
  const html = renderMarkdown(`# 标题

> 这是一段引用

- 第一项
- 第二项

\`\`\`js
console.log("hi")
\`\`\`

| 名称 | 状态 |
| --- | --- |
| 排版 | 好看 |
`);

  assert.match(html, /<h1>标题<\/h1>/);
  assert.match(html, /<blockquote><p>这是一段引用<\/p><\/blockquote>/);
  assert.match(html, /<ul><li>第一项<\/li><li>第二项<\/li><\/ul>/);
  assert.match(html, /<pre><code class="language-js">/);
  assert.match(html, /<table>/);
  assert.match(html, /<td>好看<\/td>/);
});

test("escapes unsafe html while keeping inline markdown", () => {
  const html = renderMarkdown(`这是一段 **重点** 和 \`代码\`

<script>alert(1)</script>`);

  assert.match(html, /<strong>重点<\/strong>/);
  assert.match(html, /<code>代码<\/code>/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});

test("keeps table headers out of the table body", () => {
  const html = renderMarkdown(`| 名称 | 状态 |
| --- | --- |
| 排版 | 好看 |`);

  assert.match(html, /<thead><tr><th>名称<\/th><th>状态<\/th><\/tr><\/thead>/);
  assert.match(html, /<tbody><tr><td>排版<\/td><td>好看<\/td><\/tr><\/tbody>/);
  assert.doesNotMatch(html, /<tbody><tr><td>名称<\/td><td>状态<\/td><\/tr>/);
});
