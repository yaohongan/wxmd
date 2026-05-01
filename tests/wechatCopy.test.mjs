import test from "node:test";
import assert from "node:assert/strict";
import { buildClipboardHtml, serializeComputedStyle } from "../src/wechatCopy.js";

test("serializes computed styles into inline css text", () => {
  const style = {
    0: "color",
    1: "font-size",
    2: "margin-top",
    length: 3,
    getPropertyValue(name) {
      return {
        color: "rgb(32, 23, 18)",
        "font-size": "16px",
        "margin-top": "12px"
      }[name] ?? "";
    }
  };

  const cssText = serializeComputedStyle(style);
  assert.match(cssText, /color:rgb\(32, 23, 18\) !important;/);
  assert.match(cssText, /font-size:16px !important;/);
  assert.match(cssText, /margin-top:12px;/);
});

test("limits serialized styles to the allowed whitelist", () => {
  const style = {
    0: "color",
    1: "font-size",
    2: "position",
    length: 3,
    getPropertyValue(name) {
      return {
        color: "rgb(32, 23, 18)",
        "font-size": "16px",
        position: "absolute"
      }[name] ?? "";
    }
  };

  const cssText = serializeComputedStyle(style, ["color", "font-size"]);
  assert.match(cssText, /color:rgb\(32, 23, 18\) !important;/);
  assert.match(cssText, /font-size:16px !important;/);
  assert.doesNotMatch(cssText, /position/);
});

test("wraps inlined article html into clipboard-safe markup", () => {
  const html = buildClipboardHtml('<article style="color:rgb(0, 0, 0);"><p style="font-size:16px;">Hello</p></article>');

  assert.match(html, /<meta charset="utf-8">/);
  assert.match(html, /<article style="color:rgb\(0, 0, 0\);">/);
  assert.match(html, /<p style="font-size:16px;">Hello<\/p>/);
});
