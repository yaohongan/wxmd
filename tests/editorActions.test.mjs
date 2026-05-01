import test from "node:test";
import assert from "node:assert/strict";
import { applyEditorAction, insertImagesMarkdown } from "../src/editorActions.js";

test("wraps selected text in bold markers", () => {
  const result = applyEditorAction("bold", "你好世界", 2, 4);

  assert.equal(result.value, "你好**世界**");
  assert.equal(result.selectionStart, 4);
  assert.equal(result.selectionEnd, 6);
});

test("inserts a quote block on a new line", () => {
  const result = applyEditorAction("quote", "第一段", 3, 3);

  assert.equal(result.value, "第一段\n\n> 引用内容");
});

test("inserts a markdown table template", () => {
  const result = applyEditorAction("table", "", 0, 0);

  assert.match(result.value, /\| 标题 \| 内容 \|/);
  assert.match(result.value, /\| --- \| --- \|/);
});

test("inserts pasted images as markdown image blocks", () => {
  const result = insertImagesMarkdown("第一段", 3, 3, [
    { alt: "封面图", src: "data:image/png;base64,abc123" },
    { alt: "配图", src: "data:image/png;base64,def456" }
  ]);

  assert.match(result.value, /!\[封面图\]\(data:image\/png;base64,abc123\)/);
  assert.match(result.value, /!\[配图\]\(data:image\/png;base64,def456\)/);
});
