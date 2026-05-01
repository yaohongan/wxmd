import test from "node:test";
import assert from "node:assert/strict";
import { themes } from "../src/themeCatalog.js";

test("theme catalog includes a broad set of polished article bodies", () => {
  assert.ok(themes.length >= 20);

  const ids = new Set();
  const categories = new Set();
  for (const theme of themes) {
    assert.ok(theme.id);
    assert.ok(theme.name);
    assert.ok(theme.description);
    assert.ok(theme.category);
    assert.ok(theme.palette.accent);
    assert.ok(theme.palette.background);
    assert.ok(theme.palette.text);
    assert.ok(theme.css.includes(".wx-article"));
    assert.equal(ids.has(theme.id), false, `duplicate theme id: ${theme.id}`);
    ids.add(theme.id);
    categories.add(theme.category);
  }

  assert.ok(categories.size >= 4);
});
