import { applyEditorAction, insertImagesMarkdown } from "./editorActions.js";
import {
  getAllThemeCss,
  getThemeById,
  getThemesByCategory,
  themeCategories,
  themes
} from "./themeCatalog.js";
import { renderMarkdown } from "./markdown.js";
import { buildWechatClipboardHtml, copyRichHtmlViaSelection } from "./wechatCopy.js";
import { buildXThread, formatXThreadForClipboard } from "./xThread.js";

const storageKey = "wxmd:draft";
const themeKey = "wxmd:theme";
const previewModeKey = "wxmd:preview-mode";
const categoryKey = "wxmd:theme-category";

const defaultMarkdown = `# 一篇更适合公众号发布的文章

> 先把内容写顺，再挑主题、带图片、复制出去，整条工作流会轻很多。

## 这版适合什么内容

- 带配图的产品更新和活动公告
- 教程、拆解、知识卡片
- 更像成品的品牌型长文

## 怎么用会更顺手

1. 先把正文写完，再切顶部风格
2. 直接粘贴截图或上传图片，复制到公众号时会一起带过去
3. 如果还想发到 X，可以点右上角的“复制到 X”

## 一个简单骨架

| 模块 | 建议写法 |
| --- | --- |
| 标题 | 尽量短，先给结论 |
| 小标题 | 一段一结论，不要太密 |
| 配图 | 一段一个重点，别堆太满 |

\`\`\`js
const html = renderMarkdown(markdown);
copyToWechat(html);
\`\`\`

---

先把内容写好，再决定它长什么样。`;

const editorTools = [
  { id: "h2", label: "H2", title: "插入二级标题" },
  { id: "bold", label: "B", title: "加粗重点" },
  { id: "quote", label: "引用", title: "插入引用" },
  { id: "code", label: "</>", title: "插入代码块" },
  { id: "image", label: "图片", title: "插入图片" },
  { id: "table", label: "表格", title: "插入表格" },
  { id: "divider", label: "分隔", title: "插入分隔线" }
];

const previewModes = [
  { id: "desktop", label: "桌面" },
  { id: "tablet", label: "平板" },
  { id: "mobile", label: "手机" }
];

const editor = document.querySelector("#editor");
const previewShell = document.querySelector("#previewShell");
const preview = document.querySelector("#preview");
const themeQuickStrip = document.querySelector("#themeQuickStrip");
const themeGrid = document.querySelector("#themeGrid");
const themeFilters = document.querySelector("#themeFilters");
const themeStyle = document.querySelector("#themeStyle");
const copyButton = document.querySelector("#copyButton");
const copyXButton = document.querySelector("#copyXButton");
const resetButton = document.querySelector("#resetButton");
const saveStatus = document.querySelector("#saveStatus");
const wordCount = document.querySelector("#wordCount");
const themeCount = document.querySelector("#themeCount");
const editorToolsHost = document.querySelector("#editorTools");
const previewModesHost = document.querySelector("#previewModes");
const currentThemeBadge = document.querySelector("#currentThemeBadge");
const imagePicker = document.querySelector("#imagePicker");
const themeDrawer = document.querySelector("#themeDrawer");
const openThemeDrawerButton = document.querySelector("#openThemeDrawer");
const closeThemeDrawerButton = document.querySelector("#closeThemeDrawer");

let activeThemeId = readStoredThemeId();
let activePreviewMode = readStoredPreviewMode();
let activeCategory = readStoredCategory();

themeStyle.textContent = getAllThemeCss();
editor.value = localStorage.getItem(storageKey) || defaultMarkdown;

renderThemeFilters();
renderThemeOptions();
renderEditorTools();
renderPreviewModes();
render();

editor.addEventListener("input", () => {
  localStorage.setItem(storageKey, editor.value);
  render();
  flashStatus("本地自动保存");
});

copyButton.addEventListener("click", async () => {
  const html = await buildWechatClipboardHtml(preview);

  try {
    const copied = copyRichHtmlViaSelection(html);
    if (!copied) {
      fallbackCopyRich(html);
    }

    flashStatus("已复制到剪贴板，可直接粘贴到公众号");
  } catch {
    fallbackCopyRich(html);
    flashStatus("已复制到剪贴板，可直接粘贴到公众号");
  }
});

copyXButton.addEventListener("click", async () => {
  const posts = buildXThread(editor.value);
  const clipboardText = formatXThreadForClipboard(posts);

  try {
    await copyPlainText(clipboardText);
    flashStatus(`已复制 X 线程，共 ${posts.length} 条，可逐条粘贴发布`);
  } catch {
    fallbackCopyPlain(clipboardText);
    flashStatus(`已复制 X 线程，共 ${posts.length} 条，可逐条粘贴发布`);
  }
});

resetButton.addEventListener("click", () => {
  editor.value = defaultMarkdown;
  localStorage.setItem(storageKey, editor.value);
  render();
  flashStatus("已恢复示例内容");
});

openThemeDrawerButton.addEventListener("click", () => {
  openThemeDrawer();
});

closeThemeDrawerButton.addEventListener("click", () => {
  closeThemeDrawer();
});

themeDrawer.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.closeDrawer === "true") {
    closeThemeDrawer();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && themeDrawer.dataset.open === "true") {
    closeThemeDrawer();
  }
});

imagePicker.addEventListener("change", async () => {
  if (!imagePicker.files?.length) {
    return;
  }

  const images = await filesToImageEntries([...imagePicker.files]);
  applyImagesToEditor(images);
  imagePicker.value = "";
});

editor.addEventListener("paste", async (event) => {
  const files = [...(event.clipboardData?.files || [])].filter((file) => file.type.startsWith("image/"));
  if (!files.length) {
    return;
  }

  event.preventDefault();
  const images = await filesToImageEntries(files);
  applyImagesToEditor(images);
});

function render() {
  const theme = getThemeById(activeThemeId) || themes[0];
  preview.className = `wx-article theme-${theme.id}`;
  preview.innerHTML = renderMarkdown(editor.value);
  previewShell.dataset.view = activePreviewMode;
  previewShell.style.background = theme.palette.background;
  wordCount.textContent = `${countReadableChars(editor.value)} 字`;
  currentThemeBadge.textContent = `${theme.category} · ${theme.name}`;
  openThemeDrawerButton.setAttribute("aria-expanded", String(themeDrawer.dataset.open === "true"));
}

function renderThemeFilters() {
  themeFilters.innerHTML = "";

  for (const category of themeCategories) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-chip";
    button.dataset.active = String(category === activeCategory);
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      localStorage.setItem(categoryKey, activeCategory);
      renderThemeFilters();
      renderThemeOptions();
    });
    themeFilters.append(button);
  }
}

function renderThemeOptions() {
  const visibleThemes = getThemesByCategory(activeCategory);
  if (!visibleThemes.length) {
    return;
  }

  if (!visibleThemes.some((theme) => theme.id === activeThemeId)) {
    activeThemeId = visibleThemes[0].id;
    localStorage.setItem(themeKey, activeThemeId);
  }

  themeCount.textContent = `${visibleThemes.length} 套主题`;
  themeQuickStrip.innerHTML = "";
  themeGrid.innerHTML = "";

  for (const theme of visibleThemes.slice(0, 8)) {
    themeQuickStrip.append(renderQuickThemeButton(theme));
  }

  for (const theme of visibleThemes) {
    themeGrid.append(renderThemeCard(theme));
  }

  render();
}

function renderQuickThemeButton(theme) {
  const button = document.createElement("button");
  button.className = "quick-theme-pill";
  button.type = "button";
  button.dataset.active = String(theme.id === activeThemeId);
  button.innerHTML = `
    <span
      class="swatch"
      style="--swatch-accent:${theme.palette.accent};--swatch-bg:${theme.palette.background};"
    ></span>
    <strong>${theme.name}</strong>
  `;
  button.addEventListener("click", () => {
    activeThemeId = theme.id;
    localStorage.setItem(themeKey, activeThemeId);
    renderThemeOptions();
  });
  return button;
}

function renderThemeCard(theme) {
  const button = document.createElement("button");
  button.className = "theme-card";
  button.type = "button";
  button.dataset.active = String(theme.id === activeThemeId);
  button.innerHTML = `
    <span
      class="swatch"
      style="--swatch-accent:${theme.palette.accent};--swatch-bg:${theme.palette.background};--swatch-card:${theme.palette.soft};"
    ></span>
    <span class="theme-copy">
      <span class="theme-meta">${theme.category}</span>
      <strong>${theme.name}</strong>
      <small>${theme.description}</small>
    </span>
  `;
  button.addEventListener("click", () => {
    activeThemeId = theme.id;
    localStorage.setItem(themeKey, activeThemeId);
    renderThemeOptions();
    closeThemeDrawer();
  });
  return button;
}

function renderEditorTools() {
  editorToolsHost.innerHTML = "";

  for (const tool of editorTools) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tool-button";
    button.title = tool.title;
    button.textContent = tool.label;
    button.addEventListener("click", () => {
      if (tool.id === "image") {
        imagePicker.click();
        return;
      }

      const result = applyEditorAction(tool.id, editor.value, editor.selectionStart, editor.selectionEnd);
      editor.value = result.value;
      editor.focus();
      editor.setSelectionRange(result.selectionStart, result.selectionEnd);
      localStorage.setItem(storageKey, editor.value);
      render();
      flashStatus(`已插入${tool.title.replace("插入", "")}`);
    });
    editorToolsHost.append(button);
  }
}

function renderPreviewModes() {
  previewModesHost.innerHTML = "";

  for (const mode of previewModes) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "view-button";
    button.dataset.active = String(mode.id === activePreviewMode);
    button.textContent = mode.label;
    button.addEventListener("click", () => {
      activePreviewMode = mode.id;
      localStorage.setItem(previewModeKey, activePreviewMode);
      renderPreviewModes();
      render();
    });
    previewModesHost.append(button);
  }
}

function readStoredThemeId() {
  const storedThemeId = localStorage.getItem(themeKey);
  return themes.some((theme) => theme.id === storedThemeId) ? storedThemeId : themes[0].id;
}

function readStoredPreviewMode() {
  const storedPreviewMode = localStorage.getItem(previewModeKey);
  return previewModes.some((mode) => mode.id === storedPreviewMode) ? storedPreviewMode : previewModes[0].id;
}

function readStoredCategory() {
  const storedCategory = localStorage.getItem(categoryKey);
  return themeCategories.includes(storedCategory) ? storedCategory : themeCategories[0];
}

function countReadableChars(value) {
  return value.replace(/[`*_#>\-|[\]\s]/g, "").length;
}

function flashStatus(message) {
  saveStatus.textContent = message;
  window.clearTimeout(flashStatus.timer);
  flashStatus.timer = window.setTimeout(() => {
    saveStatus.textContent = "本地自动保存";
  }, 2200);
}

function openThemeDrawer() {
  themeDrawer.dataset.open = "true";
  themeDrawer.setAttribute("aria-hidden", "false");
  document.body.dataset.drawerOpen = "true";
  openThemeDrawerButton.setAttribute("aria-expanded", "true");
}

function closeThemeDrawer() {
  themeDrawer.dataset.open = "false";
  themeDrawer.setAttribute("aria-hidden", "true");
  document.body.dataset.drawerOpen = "false";
  openThemeDrawerButton.setAttribute("aria-expanded", "false");
}

async function copyPlainText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  fallbackCopyPlain(value);
}

function fallbackCopyPlain(value) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function fallbackCopyRich(html) {
  const holder = document.createElement("div");
  holder.contentEditable = "true";
  holder.style.position = "fixed";
  holder.style.left = "-9999px";
  holder.style.top = "0";
  holder.innerHTML = html;
  document.body.append(holder);

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(holder);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
  selection.removeAllRanges();
  holder.remove();
}

async function filesToImageEntries(files) {
  const results = await Promise.all(files.map(readFileAsDataUrl));
  return results.map((src, index) => ({
    alt: files[index].name.replace(/\.[^.]+$/, "") || `配图${index + 1}`,
    src
  }));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function applyImagesToEditor(images) {
  const result = insertImagesMarkdown(editor.value, editor.selectionStart, editor.selectionEnd, images);
  editor.value = result.value;
  editor.focus();
  editor.setSelectionRange(result.selectionStart, result.selectionEnd);
  localStorage.setItem(storageKey, editor.value);
  render();
  flashStatus(`已插入 ${images.length} 张图片`);
}
