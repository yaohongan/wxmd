import test from "node:test";
import assert from "node:assert/strict";
import { buildClipboardHtml, buildResponsiveRootStyle, serializeComputedStyle } from "../src/wechatCopy.js";

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

test("normalizes copied article root to a responsive width", () => {
  const style = {
    0: "max-width",
    1: "width",
    2: "margin",
    3: "padding",
    4: "font-size",
    5: "line-height",
    6: "color",
    7: "background-color",
    length: 8,
    getPropertyValue(name) {
      return {
        "max-width": "680px",
        width: "680px",
        margin: "0px auto",
        padding: "34px 30px",
        "font-size": "16px",
        "line-height": "30px",
        color: "rgb(35, 53, 45)",
        "background-color": "rgb(251, 255, 252)"
      }[name] ?? "";
    }
  };

  const cssText = buildResponsiveRootStyle(style);
  assert.match(cssText, /width:100% !important;/);
  assert.match(cssText, /max-width:100% !important;/);
  assert.match(cssText, /margin:0 !important;/);
  assert.match(cssText, /box-sizing:border-box !important;/);
  assert.doesNotMatch(cssText, /680px/);
  assert.match(cssText, /padding:34px 30px !important;/);
});
