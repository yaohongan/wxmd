const templates = {
  h2: {
    prefix: "## ",
    suffix: "",
    placeholder: "小节标题"
  },
  bold: {
    prefix: "**",
    suffix: "**",
    placeholder: "重点内容"
  },
  quote: {
    block: "\n\n> 引用内容"
  },
  code: {
    block: "\n\n```js\nconst message = \"hello wechat\"\n```"
  },
  divider: {
    block: "\n\n---"
  },
  table: {
    block: "\n\n| 标题 | 内容 |\n| --- | --- |\n| 示例 | 在这里填写 |\n| 示例 | 在这里填写 |"
  }
};

export function applyEditorAction(action, value, selectionStart, selectionEnd) {
  const config = templates[action];
  if (!config) {
    return { value, selectionStart, selectionEnd };
  }

  const selected = value.slice(selectionStart, selectionEnd);

  if (config.block) {
    const insertion = normalizeBlock(value, selectionStart, config.block);
    return replaceRange(value, selectionStart, selectionEnd, insertion.text, insertion.cursorOffset);
  }

  const content = selected || config.placeholder;
  return replaceRange(
    value,
    selectionStart,
    selectionEnd,
    `${config.prefix}${content}${config.suffix}`,
    config.prefix.length,
    config.prefix.length + content.length
  );
}

export function insertImagesMarkdown(value, selectionStart, selectionEnd, images) {
  if (!images.length) {
    return { value, selectionStart, selectionEnd };
  }

  const imageBlocks = images
    .map((image) => `![${escapeAlt(image.alt || "配图")}](${image.src})`)
    .join("\n\n");

  const insertion = normalizeBlock(value, selectionStart, `\n\n${imageBlocks}`);
  return replaceRange(value, selectionStart, selectionEnd, insertion.text, insertion.cursorOffset);
}

function normalizeBlock(value, selectionStart, block) {
  const needsBreak = selectionStart > 0 && !value.slice(0, selectionStart).endsWith("\n");
  const text = needsBreak ? block.replace(/^\n/, "\n") : block.replace(/^\n\n/, "");
  return {
    text,
    cursorOffset: text.length
  };
}

function replaceRange(value, start, end, inserted, selectionOffsetStart = inserted.length, selectionOffsetEnd = selectionOffsetStart) {
  const nextValue = `${value.slice(0, start)}${inserted}${value.slice(end)}`;
  return {
    value: nextValue,
    selectionStart: start + selectionOffsetStart,
    selectionEnd: start + selectionOffsetEnd
  };
}

function escapeAlt(value) {
  return String(value).replace(/[[\]]/g, "");
}
