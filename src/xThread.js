const DEFAULT_MAX_CHARS = 280;
const THREAD_SEPARATOR = "\n\n--------\n\n";

export function buildXThread(markdown = "", options = {}) {
  const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS;
  const effectiveMaxChars = Math.max(40, maxChars - 8);
  const blocks = markdownToBlocks(markdown);
  const rawPosts = packBlocks(blocks, effectiveMaxChars);

  if (rawPosts.length <= 1) {
    return rawPosts;
  }

  const total = rawPosts.length;
  return rawPosts.map((post, index) => `${index + 1}/${total} ${post}`);
}

export function formatXThreadForClipboard(posts) {
  return posts.join(THREAD_SEPARATOR);
}

function markdownToBlocks(markdown) {
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim();
      const code = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index].trimEnd());
        index += 1;
      }

      index += 1;
      const header = language ? `\`\`\`${language}` : "```";
      blocks.push(compactBlock([header, ...code, "```"].join("\n")));
      continue;
    }

    if (/^#{1,3}\s+/.test(trimmed)) {
      blocks.push(compactBlock(trimmed.replace(/^#{1,3}\s+/, "")));
      index += 1;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quote = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quote.push(`> ${renderInlinePlain(lines[index].trim().replace(/^>\s?/, ""))}`);
        index += 1;
      }
      blocks.push(compactBlock(quote.join("\n")));
      continue;
    }

    if (isTableStart(lines, index)) {
      const headers = splitTableCells(lines[index]);
      const rows = [];
      index += 2;

      while (index < lines.length && isTableRow(lines[index])) {
        rows.push(splitTableCells(lines[index]));
        index += 1;
      }

      const tableBlocks = rows.map((row) => headers
        .map((header, cellIndex) => `${renderInlinePlain(header)}: ${renderInlinePlain(row[cellIndex] ?? "")}`)
        .join(" | "));
      blocks.push(...tableBlocks.map(compactBlock));
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(`- ${renderInlinePlain(lines[index].trim().replace(/^[-*]\s+/, ""))}`);
        index += 1;
      }
      blocks.push(compactBlock(items.join("\n")));
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        const itemNumber = lines[index].trim().match(/^\d+/)?.[0] ?? `${items.length + 1}`;
        items.push(`${itemNumber}. ${renderInlinePlain(lines[index].trim().replace(/^\d+\.\s+/, ""))}`);
        index += 1;
      }
      blocks.push(compactBlock(items.join("\n")));
      continue;
    }

    const paragraph = [];
    while (index < lines.length && shouldStayInParagraph(lines[index])) {
      paragraph.push(renderInlinePlain(lines[index].trim()));
      index += 1;
    }
    blocks.push(compactBlock(paragraph.join(" ")));
  }

  return blocks.filter(Boolean);
}

function packBlocks(blocks, maxChars) {
  if (!blocks.length) {
    return [""];
  }

  const posts = [];
  let currentPost = "";

  for (const block of blocks) {
    const pieces = splitLongBlock(block, maxChars);

    for (const piece of pieces) {
      if (!currentPost) {
        currentPost = piece;
        continue;
      }

      const nextValue = `${currentPost}\n\n${piece}`;
      if (nextValue.length <= maxChars) {
        currentPost = nextValue;
        continue;
      }

      posts.push(currentPost);
      currentPost = piece;
    }
  }

  if (currentPost) {
    posts.push(currentPost);
  }

  return posts;
}

function splitLongBlock(block, maxChars) {
  if (block.length <= maxChars) {
    return [block];
  }

  const segments = [];
  let remaining = block;

  while (remaining.length > maxChars) {
    const breakpoint = findBreakpoint(remaining, maxChars);
    segments.push(remaining.slice(0, breakpoint).trim());
    remaining = remaining.slice(breakpoint).trim();
  }

  if (remaining) {
    segments.push(remaining);
  }

  return segments.filter(Boolean);
}

function findBreakpoint(text, maxChars) {
  const searchWindow = text.slice(0, maxChars + 1);
  const newlineIndex = searchWindow.lastIndexOf("\n");
  if (newlineIndex >= Math.min(40, maxChars - 1)) {
    return newlineIndex;
  }

  const sentenceBreak = Math.max(
    searchWindow.lastIndexOf(". "),
    searchWindow.lastIndexOf("! "),
    searchWindow.lastIndexOf("? "),
    searchWindow.lastIndexOf("。"),
    searchWindow.lastIndexOf("！"),
    searchWindow.lastIndexOf("？")
  );
  if (sentenceBreak >= Math.min(40, maxChars - 1)) {
    return sentenceBreak + 1;
  }

  const spaceIndex = searchWindow.lastIndexOf(" ");
  if (spaceIndex >= Math.min(24, maxChars - 1)) {
    return spaceIndex;
  }

  return maxChars;
}

function shouldStayInParagraph(line = "") {
  const trimmed = line.trim();
  return Boolean(trimmed) &&
    !trimmed.startsWith("```") &&
    !/^#{1,3}\s+/.test(trimmed) &&
    !/^---+$/.test(trimmed) &&
    !trimmed.startsWith(">") &&
    !/^[-*]\s+/.test(trimmed) &&
    !/^\d+\.\s+/.test(trimmed) &&
    !isTableRow(trimmed);
}

function isTableStart(lines, index) {
  return isTableRow(lines[index]) && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1] ?? "");
}

function isTableRow(line = "") {
  return line.trim().startsWith("|") && line.trim().endsWith("|");
}

function splitTableCells(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function renderInlinePlain(text) {
  return String(text)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt = "", src = "") => renderImageToken(alt, src))
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 $2")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/[_~]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function renderImageToken(alt, src) {
  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  if (alt) {
    return `[Image: ${alt}]`;
  }

  return "[Image]";
}

function compactBlock(value) {
  return value
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
