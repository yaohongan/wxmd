import test from "node:test";
import assert from "node:assert/strict";
import { buildXThread, formatXThreadForClipboard } from "../src/xThread.js";

test("converts markdown into X-friendly plain text blocks", () => {
  const posts = buildXThread(`# Launch note

> Faster shipping

- One clear change
- One stable copy path

![Cover](https://example.com/cover.jpg)
[Docs](https://example.com/docs)`);

  assert.equal(posts.length, 1);
  assert.match(posts[0], /Launch note/);
  assert.match(posts[0], /> Faster shipping/);
  assert.match(posts[0], /- One clear change/);
  assert.match(posts[0], /https:\/\/example\.com\/cover\.jpg/);
  assert.match(posts[0], /Docs https:\/\/example\.com\/docs/);
});

test("replaces embedded clipboard images with a readable placeholder", () => {
  const posts = buildXThread("![Screenshot](data:image/png;base64,abc123)");

  assert.equal(posts.length, 1);
  assert.match(posts[0], /\[Image: Screenshot\]/);
  assert.doesNotMatch(posts[0], /data:image/);
});

test("splits long content into numbered X thread posts under the limit", () => {
  const longParagraph = "This paragraph is long enough to force a split once it is repeated. ".repeat(20);
  const posts = buildXThread(`# Update

${longParagraph}

## Detail

${longParagraph}`);

  assert.ok(posts.length > 1);
  assert.match(posts[0], /^\d+\/\d+\s/);
  assert.match(posts[1], /^\d+\/\d+\s/);
  assert.ok(posts.every((post) => post.length <= 280));
});

test("formats thread posts for clipboard handoff", () => {
  const text = formatXThreadForClipboard(["1/2 First post", "2/2 Second post"]);

  assert.match(text, /1\/2 First post/);
  assert.match(text, /2\/2 Second post/);
  assert.match(text, /--------/);
});
