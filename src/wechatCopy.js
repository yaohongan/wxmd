const ROOT_STYLE_PROPS = [
  "padding",
  "font-family",
  "font-size",
  "line-height",
  "color",
  "background",
  "background-color",
  "word-break",
  "word-wrap",
  "overflow-wrap"
];

const TEXT_STYLE_PROPS = [
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "line-height",
  "letter-spacing",
  "text-align",
  "text-indent",
  "text-decoration",
  "text-transform",
  "color",
  "background",
  "background-color",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "border-radius",
  "box-shadow",
  "display"
];

const BOX_STYLE_PROPS = [
  "display",
  "width",
  "max-width",
  "min-width",
  "height",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "border-collapse",
  "border-spacing",
  "border-radius",
  "background",
  "background-color",
  "text-align",
  "vertical-align",
  "list-style-type",
  "list-style-position"
];

const IMAGE_STYLE_PROPS = [
  "display",
  "width",
  "max-width",
  "height",
  "max-height",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding",
  "border",
  "border-radius",
  "box-shadow",
  "object-fit"
];

const TAG_STYLE_MAP = {
  article: ROOT_STYLE_PROPS,
  section: ROOT_STYLE_PROPS,
  p: TEXT_STYLE_PROPS,
  h1: TEXT_STYLE_PROPS,
  h2: TEXT_STYLE_PROPS,
  h3: TEXT_STYLE_PROPS,
  h4: TEXT_STYLE_PROPS,
  h5: TEXT_STYLE_PROPS,
  h6: TEXT_STYLE_PROPS,
  blockquote: [...TEXT_STYLE_PROPS, ...BOX_STYLE_PROPS],
  strong: TEXT_STYLE_PROPS,
  b: TEXT_STYLE_PROPS,
  em: TEXT_STYLE_PROPS,
  i: TEXT_STYLE_PROPS,
  a: TEXT_STYLE_PROPS,
  code: TEXT_STYLE_PROPS,
  pre: [...TEXT_STYLE_PROPS, ...BOX_STYLE_PROPS, "overflow-x", "white-space"],
  ul: BOX_STYLE_PROPS,
  ol: BOX_STYLE_PROPS,
  li: [...TEXT_STYLE_PROPS, ...BOX_STYLE_PROPS],
  table: [...BOX_STYLE_PROPS, "font-size"],
  thead: BOX_STYLE_PROPS,
  tbody: BOX_STYLE_PROPS,
  tr: BOX_STYLE_PROPS,
  th: [...TEXT_STYLE_PROPS, ...BOX_STYLE_PROPS],
  td: [...TEXT_STYLE_PROPS, ...BOX_STYLE_PROPS],
  hr: BOX_STYLE_PROPS,
  img: IMAGE_STYLE_PROPS,
  span: TEXT_STYLE_PROPS,
  div: BOX_STYLE_PROPS
};

const IMPORTANT_PROPS = new Set([
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "color",
  "background",
  "background-color",
  "text-align",
  "border",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "border-radius",
  "margin",
  "padding",
  "width",
  "max-width",
  "display"
]);

export async function buildWechatClipboardHtml(root, options = {}) {
  const restorePreviewMode = applyForcedPreviewMode(root, options.forcePreviewMode);
  const section = root.ownerDocument.createElement("section");
  try {
    const rootStyle = buildResponsiveRootStyle(window.getComputedStyle(root));
    section.setAttribute("style", rootStyle);

    const clone = root.cloneNode(true);
    stripEditorAttributes(clone);
    inlineNodeStyles(root, clone);

    while (clone.firstChild) {
      section.appendChild(clone.firstChild);
    }

    flattenListParagraphs(section);
    enforceTextInheritance(section, rootStyle);
    await inlineExternalImages(section);

    return buildClipboardHtml(section.outerHTML);
  } finally {
    restorePreviewMode();
  }
}

export async function copyRichHtml(html, plainText = "") {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    return false;
  }

  const payload = {
    "text/html": new Blob([html], { type: "text/html" }),
    "text/plain": new Blob([plainText || extractPlainText(html)], { type: "text/plain" })
  };

  await navigator.clipboard.write([new ClipboardItem(payload)]);
  return true;
}

export function copyRichHtmlViaSelection(html) {
  const holder = document.createElement("div");
  holder.contentEditable = "true";
  holder.setAttribute("aria-hidden", "true");
  holder.style.position = "fixed";
  holder.style.left = "-9999px";
  holder.style.top = "0";
  holder.style.opacity = "0";
  holder.innerHTML = html;
  document.body.append(holder);

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(holder);
  selection.removeAllRanges();
  selection.addRange(range);

  const success = document.execCommand("copy");
  selection.removeAllRanges();
  holder.remove();
  return success;
}

export function buildClipboardHtml(articleHtml) {
  return `<meta charset="utf-8">${articleHtml}`;
}

export function buildResponsiveRootStyle(style) {
  const styleMap = parseStyleText(serializeComputedStyle(style, ROOT_STYLE_PROPS));
  styleMap.display = "block !important";
  styleMap.width = "100% !important";
  styleMap["max-width"] = "100% !important";
  styleMap.margin = "0 !important";
  styleMap["box-sizing"] = "border-box !important";

  if (!styleMap["word-break"]) {
    styleMap["word-break"] = "break-word !important";
  }
  if (!styleMap["word-wrap"]) {
    styleMap["word-wrap"] = "break-word !important";
  }
  if (!styleMap["overflow-wrap"]) {
    styleMap["overflow-wrap"] = "break-word !important";
  }

  return stringifyStyleMap(styleMap);
}

export function serializeComputedStyle(style, allowedProps = null) {
  const props = allowedProps ?? [...Array(style.length)].map((_, index) => style[index]);
  const seen = new Set();
  let cssText = "";

  for (const property of props) {
    if (!property || seen.has(property)) {
      continue;
    }

    seen.add(property);
    const value = style.getPropertyValue(property);
    if (!value || shouldSkipStyle(property, value)) {
      continue;
    }

    const suffix = IMPORTANT_PROPS.has(property) ? " !important" : "";
    cssText += `${property}:${value}${suffix};`;
  }

  return cssText;
}

function inlineNodeStyles(sourceNode, targetNode) {
  if (sourceNode.nodeType !== Node.ELEMENT_NODE || targetNode.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const sourceElement = /** @type {HTMLElement} */ (sourceNode);
  const targetElement = /** @type {HTMLElement} */ (targetNode);
  const tagName = targetElement.tagName.toLowerCase();
  const allowedProps = TAG_STYLE_MAP[tagName] ?? TEXT_STYLE_PROPS;
  const computed = window.getComputedStyle(sourceElement);
  const styleMap = normalizeExportStyleMap(
    tagName,
    parseStyleText(serializeComputedStyle(computed, allowedProps))
  );

  targetElement.removeAttribute("class");
  targetElement.removeAttribute("id");
  [...targetElement.attributes]
    .filter((attribute) => attribute.name.startsWith("data-"))
    .forEach((attribute) => targetElement.removeAttribute(attribute.name));

  if (Object.keys(styleMap).length) {
    targetElement.setAttribute("style", stringifyStyleMap(styleMap));
  }

  const sourceChildren = [...sourceElement.children];
  const targetChildren = [...targetElement.children];

  for (let index = 0; index < sourceChildren.length; index += 1) {
    inlineNodeStyles(sourceChildren[index], targetChildren[index]);
  }
}

function stripEditorAttributes(node) {
  if (!(node instanceof Element)) {
    return;
  }

  node.removeAttribute("class");
  node.removeAttribute("id");
  [...node.attributes]
    .filter((attribute) => attribute.name.startsWith("data-"))
    .forEach((attribute) => node.removeAttribute(attribute.name));

  for (const child of node.children) {
    stripEditorAttributes(child);
  }
}

function flattenListParagraphs(section) {
  const paragraphs = section.querySelectorAll("li p");
  for (const paragraph of paragraphs) {
    const span = section.ownerDocument.createElement("span");
    span.innerHTML = paragraph.innerHTML;
    const style = paragraph.getAttribute("style");
    if (style) {
      span.setAttribute("style", style);
    }
    paragraph.parentNode?.replaceChild(span, paragraph);
  }
}

function enforceTextInheritance(section, rootStyleText) {
  const rootStyles = parseStyleText(rootStyleText);
  const fontFamily = rootStyles["font-family"];
  const fontSize = rootStyles["font-size"];
  const lineHeight = rootStyles["line-height"];
  const color = rootStyles.color;

  const textNodes = section.querySelectorAll("p, li, h1, h2, h3, h4, h5, h6, blockquote, span");
  for (const node of textNodes) {
    if (node.tagName === "SPAN" && node.closest("pre, code")) {
      continue;
    }

    const styleMap = parseStyleText(node.getAttribute("style") || "");
    if (fontFamily && !styleMap["font-family"]) {
      styleMap["font-family"] = `${fontFamily} !important`;
    }
    if (lineHeight && !styleMap["line-height"]) {
      styleMap["line-height"] = `${lineHeight} !important`;
    }
    if (color && !styleMap.color) {
      styleMap.color = `${color} !important`;
    }
    if (fontSize && !styleMap["font-size"] && ["P", "LI", "BLOCKQUOTE", "SPAN"].includes(node.tagName)) {
      styleMap["font-size"] = `${fontSize} !important`;
    }

    node.setAttribute("style", stringifyStyleMap(styleMap));
  }
}

async function inlineExternalImages(section) {
  const images = [...section.querySelectorAll("img")];
  await Promise.all(images.map(async (img) => {
    const src = img.getAttribute("src");
    if (!src || src.startsWith("data:")) {
      return;
    }

    const dataUrl = await convertImageToDataUrl(src);
    if (dataUrl) {
      img.setAttribute("src", dataUrl);
    }
  }));
}

async function convertImageToDataUrl(src) {
  try {
    const response = await fetch(src, { mode: "cors", cache: "default" });
    if (!response.ok) {
      return src;
    }

    const blob = await response.blob();
    return await blobToDataUrl(blob);
  } catch {
    return src;
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function shouldSkipStyle(property, value) {
  return property.startsWith("--") ||
    value === "normal" ||
    value === "none" ||
    value === "rgba(0, 0, 0, 0)" ||
    value === "auto";
}

function parseStyleText(styleText) {
  return styleText
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .reduce((map, rule) => {
      const separatorIndex = rule.indexOf(":");
      if (separatorIndex === -1) {
        return map;
      }

      const property = rule.slice(0, separatorIndex).trim();
      const value = rule.slice(separatorIndex + 1).trim();
      if (property && value) {
        map[property] = value;
      }
      return map;
    }, {});
}

function stringifyStyleMap(styleMap) {
  return Object.entries(styleMap)
    .map(([property, value]) => `${property}:${value};`)
    .join("");
}

function extractPlainText(html) {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container.innerText.trim();
}

function applyForcedPreviewMode(root, forcePreviewMode) {
  if (!forcePreviewMode) {
    return () => {};
  }

  const shell = root.closest(".preview-shell");
  if (!(shell instanceof HTMLElement)) {
    return () => {};
  }

  const previousMode = shell.dataset.view;
  const previousTransition = shell.style.transition;
  shell.style.transition = "none";
  shell.dataset.view = forcePreviewMode;
  void shell.offsetWidth;

  return () => {
    shell.dataset.view = previousMode || "desktop";
    shell.style.transition = previousTransition;
  };
}

function normalizeExportStyleMap(tagName, styleMap) {
  const fluidBlockTags = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "ul", "ol", "li"]);

  if (fluidBlockTags.has(tagName)) {
    delete styleMap.width;
    delete styleMap["max-width"];
    delete styleMap["min-width"];
    delete styleMap.height;
  }

  if (tagName === "blockquote" || tagName === "pre" || /^h[1-6]$/.test(tagName)) {
    styleMap["box-sizing"] = "border-box !important";
    styleMap["overflow-wrap"] = "break-word !important";
    styleMap["word-break"] = "break-word !important";
  }

  if (tagName === "table") {
    styleMap.width = "100% !important";
    styleMap["max-width"] = "100% !important";
    delete styleMap["min-width"];
    delete styleMap.height;
    styleMap["box-sizing"] = "border-box !important";
  }

  if (tagName === "th" || tagName === "td") {
    delete styleMap.width;
    delete styleMap["max-width"];
    delete styleMap["min-width"];
    delete styleMap.height;
  }

  if (tagName === "img") {
    styleMap.width = "100% !important";
    styleMap["max-width"] = "100% !important";
    styleMap.height = "auto !important";
    styleMap["box-sizing"] = "border-box !important";
  }

  return styleMap;
}
