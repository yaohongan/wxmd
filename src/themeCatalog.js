const baseArticleCss = `
.wx-article {
  color: var(--wx-text);
  background: var(--wx-bg);
  font-family: var(--wx-font);
  line-height: 1.88;
  letter-spacing: 0;
  padding: 34px 30px;
  max-width: 680px;
  margin: 0 auto;
}

.wx-article h1,
.wx-article h2,
.wx-article h3 {
  color: var(--wx-heading);
  line-height: 1.35;
  margin: 1.3em 0 0.72em;
  font-weight: 800;
}

.wx-article h1 {
  font-size: 28px;
}

.wx-article h2 {
  font-size: 22px;
}

.wx-article h3 {
  font-size: 18px;
}

.wx-article p {
  margin: 1em 0;
  font-size: 16px;
}

.wx-article strong {
  color: var(--wx-accent);
  font-weight: 800;
}

.wx-article em {
  color: var(--wx-muted);
}

.wx-article a {
  color: var(--wx-accent);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}

.wx-article blockquote {
  margin: 1.2em 0;
  padding: 15px 18px;
  color: var(--wx-quote);
  background: var(--wx-soft);
  border-left: 4px solid var(--wx-accent);
}

.wx-article blockquote p {
  margin: 0;
}

.wx-article ul,
.wx-article ol {
  padding-left: 1.35em;
  margin: 1em 0;
}

.wx-article li {
  margin: 0.42em 0;
}

.wx-article code {
  color: var(--wx-code);
  background: var(--wx-code-bg);
  padding: 0.12em 0.34em;
  border-radius: 5px;
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.92em;
}

.wx-article pre {
  overflow: auto;
  background: var(--wx-code-block);
  border-radius: var(--wx-radius);
  padding: 16px;
  margin: 1.2em 0;
}

.wx-article pre code {
  color: var(--wx-code-block-text);
  background: transparent;
  padding: 0;
}

.wx-article table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.2em 0;
  font-size: 15px;
}

.wx-article th,
.wx-article td {
  border: 1px solid var(--wx-border);
  padding: 10px 12px;
}

.wx-article th {
  color: var(--wx-heading);
  background: var(--wx-soft);
  font-weight: 800;
}

.wx-article hr {
  border: 0;
  height: 1px;
  margin: 28px 0;
  background: var(--wx-border);
}

.wx-article img {
  display: block;
  max-width: 100%;
  margin: 18px auto;
  border-radius: var(--wx-radius);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.08);
}
`;

export const themes = [
  theme("amber-story", "品牌实验室", "琥珀图文", "暖金标题条配合留白正文，适合品牌文章和主推内容。", {
    accent: "#c76a2d",
    background: "#fffaf4",
    text: "#3a2a1f",
    heading: "#28170f",
    muted: "#856451",
    soft: "#f8e5d4",
    quote: "#6f503d",
    border: "#edd2bc",
    code: "#9a3412",
    codeBg: "#fde8d9",
    codeBlock: "#2f1d15",
    codeBlockText: "#fff4ea",
    radius: "18px",
    font: '"Source Han Serif SC", "Songti SC", serif'
  }, `
.wx-article h1 { text-align: center; margin-top: 0; }
.wx-article h2 { padding: 10px 14px; background: var(--wx-soft); border-radius: 14px; }
`),
  theme("forest-note", "知识卡片", "山野笔记", "绿色卡片感强，适合清单、教程和轻知识分享。", {
    accent: "#2b7d66",
    background: "#fbfffc",
    text: "#23352d",
    heading: "#123328",
    muted: "#547468",
    soft: "#dff4ea",
    quote: "#356154",
    border: "#b9e1d3",
    code: "#0f766e",
    codeBg: "#dff8f3",
    codeBlock: "#10362f",
    codeBlockText: "#dbfcef",
    radius: "20px",
    font: '"LXGW WenKai", "Kaiti SC", serif'
  }, `
.wx-article h2,
.wx-article blockquote {
  border-radius: 18px;
  box-shadow: 0 10px 24px rgba(43, 125, 102, 0.12);
}
.wx-article h2 { padding: 12px 16px; background: var(--wx-soft); }
`),
  theme("newspaper", "专栏深读", "早刊长文", "更像报刊专栏，适合评论、观点和深读长文。", {
    accent: "#aa2b24",
    background: "#fffdfa",
    text: "#2d241f",
    heading: "#1b1612",
    muted: "#7d6d63",
    soft: "#f4ece4",
    quote: "#5c4b40",
    border: "#ddcec0",
    code: "#9f1239",
    codeBg: "#ffe5ed",
    codeBlock: "#281c18",
    codeBlockText: "#fff0ea",
    radius: "8px",
    font: '"Source Han Serif SC", "Songti SC", serif'
  }, `
.wx-article h1 { padding-bottom: 14px; border-bottom: 3px solid var(--wx-heading); }
.wx-article h2 { border-top: 1px solid var(--wx-border); padding-top: 18px; }
`),
  theme("peach-card", "图片感", "桃雾卡片", "段落模块感更强，适合图文种草和生活方式内容。", {
    accent: "#db6c74",
    background: "#fff9fa",
    text: "#413036",
    heading: "#5a1f2b",
    muted: "#8d6670",
    soft: "#ffe8ec",
    quote: "#7e4855",
    border: "#f2cbd4",
    code: "#be123c",
    codeBg: "#ffe2ea",
    codeBlock: "#3c1821",
    codeBlockText: "#ffeef3",
    radius: "22px",
    font: '"PingFang SC", "Microsoft YaHei", sans-serif'
  }, `
.wx-article h2,
.wx-article pre,
.wx-article blockquote {
  border-radius: 22px;
}
.wx-article h2 {
  display: inline-block;
  padding: 10px 16px;
  background: linear-gradient(180deg, var(--wx-soft), #fff7f8);
}
`),
  theme("studio-grid", "品牌实验室", "创意样张", "适合案例拆解、作品介绍和品牌感更强的内容。", {
    accent: "#d2682f",
    background: "#fff8f1",
    text: "#3f2f24",
    heading: "#2f2017",
    muted: "#8a6f5d",
    soft: "#ffebdc",
    quote: "#765541",
    border: "#edd3c0",
    code: "#c2410c",
    codeBg: "#ffe4d3",
    codeBlock: "#34231a",
    codeBlockText: "#fff0e4",
    radius: "18px",
    font: '"PingFang SC", "Microsoft YaHei", sans-serif'
  }, `
.wx-article h2::before { content: "✦"; color: var(--wx-accent); margin-right: 8px; }
.wx-article img { box-shadow: 0 20px 34px rgba(122, 72, 38, 0.18); }
`),
  theme("blueprint", "商业复盘", "蓝图方案", "信息层级规整，适合方案、SOP 和项目复盘。", {
    accent: "#0f6a83",
    background: "#f7fdff",
    text: "#16313a",
    heading: "#0f3a49",
    muted: "#5c7780",
    soft: "#e0f4fa",
    quote: "#315a66",
    border: "#b9dfe9",
    code: "#0369a1",
    codeBg: "#dff2ff",
    codeBlock: "#082f49",
    codeBlockText: "#e4f8ff",
    radius: "12px",
    font: '"PingFang SC", "Microsoft YaHei", sans-serif'
  }, `
.wx-article h2 { padding-left: 14px; border-left: 4px double var(--wx-accent); }
.wx-article ul li::marker,
.wx-article ol li::marker { color: var(--wx-accent); font-weight: 800; }
`),
  theme("ink-minimal", "极简留白", "留白长页", "干净克制，适合纯文字表达和严肃主题。", {
    accent: "#111111",
    background: "#ffffff",
    text: "#222222",
    heading: "#050505",
    muted: "#707070",
    soft: "#f6f6f6",
    quote: "#4f4f4f",
    border: "#dddddd",
    code: "#1f2937",
    codeBg: "#f2f2f2",
    codeBlock: "#111111",
    codeBlockText: "#f5f5f5",
    radius: "4px",
    font: '"Helvetica Neue", "PingFang SC", sans-serif'
  }, `
.wx-article h1,
.wx-article h2 { font-weight: 900; }
`),
  theme("mint-board", "知识卡片", "薄荷白板", "适合课程摘要、要点提炼和清单式内容。", {
    accent: "#00a884",
    background: "#f7fffb",
    text: "#18342d",
    heading: "#083f35",
    muted: "#51756e",
    soft: "#e1f8ef",
    quote: "#2f665a",
    border: "#bde8da",
    code: "#047857",
    codeBg: "#d9f7ed",
    codeBlock: "#092f2a",
    codeBlockText: "#ccfbef",
    radius: "20px",
    font: '"PingFang SC", "Microsoft YaHei", sans-serif'
  }, `
.wx-article h2,
.wx-article blockquote,
.wx-article pre { box-shadow: 0 10px 20px rgba(0, 116, 90, 0.09); }
.wx-article h2 { padding: 12px 14px; background: var(--wx-soft); border-radius: 18px; }
`),
  theme("cocoa-book", "专栏深读", "咖色书页", "适合读书笔记、人物稿和叙事型文章。", {
    accent: "#8a4f24",
    background: "#fffaf1",
    text: "#372b22",
    heading: "#2b1d13",
    muted: "#806a58",
    soft: "#f6eadb",
    quote: "#684b37",
    border: "#dfc8ae",
    code: "#7c2d12",
    codeBg: "#f7dfc7",
    codeBlock: "#2b2119",
    codeBlockText: "#f6e9d8",
    radius: "14px",
    font: '"Source Han Serif SC", "Songti SC", serif'
  }, `
.wx-article h2 { border-bottom: 2px dotted var(--wx-border); padding-bottom: 8px; }
.wx-article blockquote { border-left-color: transparent; border-top: 1px solid var(--wx-border); border-bottom: 1px solid var(--wx-border); }
`),
  theme("violet-brief", "图片感", "纸面简报", "更适合节奏快的图片型内容和短篇轻表达。", {
    accent: "#7c3aed",
    background: "#fcfaff",
    text: "#31293f",
    heading: "#43206b",
    muted: "#786687",
    soft: "#f0e8ff",
    quote: "#62457d",
    border: "#dfcff7",
    code: "#6d28d9",
    codeBg: "#efe7ff",
    codeBlock: "#2d164f",
    codeBlockText: "#f1eaff",
    radius: "22px",
    font: '"PingFang SC", "Microsoft YaHei", sans-serif'
  }, `
.wx-article h2 { text-align: center; }
.wx-article h2::after { content: ""; display: block; width: 44px; height: 3px; background: var(--wx-accent); margin: 10px auto 0; }
`),
  theme("stone-report", "商业复盘", "灰石纪要", "沉稳规整，适合会议纪要、结论和项目总结。", {
    accent: "#475569",
    background: "#ffffff",
    text: "#27313f",
    heading: "#111827",
    muted: "#64748b",
    soft: "#f1f5f9",
    quote: "#475569",
    border: "#dbe3ec",
    code: "#4338ca",
    codeBg: "#eef2ff",
    codeBlock: "#172033",
    codeBlockText: "#e2e8f0",
    radius: "10px",
    font: '"PingFang SC", "Microsoft YaHei", sans-serif'
  }, `
.wx-article h2 { counter-increment: section; }
.wx-article h2::before { content: counter(section, decimal-leading-zero) " "; color: var(--wx-accent); }
`),
  theme("citrus-post", "品牌实验室", "柑橘晨报", "明亮有辨识度，适合活动预告和产品更新。", {
    accent: "#e36b16",
    background: "#fffdf7",
    text: "#34291f",
    heading: "#3a2110",
    muted: "#7c6755",
    soft: "#fff1d6",
    quote: "#77512e",
    border: "#f0d6a5",
    code: "#b45309",
    codeBg: "#ffeed0",
    codeBlock: "#3a2612",
    codeBlockText: "#fff1d3",
    radius: "18px",
    font: '"PingFang SC", "Microsoft YaHei", sans-serif'
  }, `
.wx-article h2 { padding: 8px 14px; background: var(--wx-soft); border-radius: 999px; display: inline-block; }
`),
  theme("navy-column", "专栏深读", "深蓝述评", "标题更硬朗，适合行业观察、评论和深度分析。", {
    accent: "#1d4f91",
    background: "#f8fbff",
    text: "#1d2735",
    heading: "#10203b",
    muted: "#5b6f88",
    soft: "#e4eefb",
    quote: "#355073",
    border: "#c8d8ef",
    code: "#1d4ed8",
    codeBg: "#e5efff",
    codeBlock: "#0f1d33",
    codeBlockText: "#edf4ff",
    radius: "10px",
    font: '"Source Han Serif SC", "Songti SC", serif'
  }, `
.wx-article h1 { text-align: center; letter-spacing: 0.04em; }
.wx-article h2 { border-bottom: 2px solid var(--wx-accent); padding-bottom: 8px; }
.wx-article blockquote { border-left-width: 0; border-top: 3px solid var(--wx-accent); }
`),
  theme("linen-digest", "极简留白", "亚麻摘要", "浅米色纸张感，适合轻总结、短评和安静表达。", {
    accent: "#8c6b44",
    background: "#fffdf8",
    text: "#33281f",
    heading: "#201811",
    muted: "#7d6f62",
    soft: "#f6f0e6",
    quote: "#5f4f40",
    border: "#e7ddcf",
    code: "#92400e",
    codeBg: "#f8ecdd",
    codeBlock: "#2b2017",
    codeBlockText: "#f9f0e5",
    radius: "6px",
    font: '"Noto Serif SC", "Songti SC", serif'
  }, `
.wx-article h2 { font-size: 21px; letter-spacing: 0.02em; }
.wx-article img { border-radius: 10px; }
`),
  theme("sunset-poster", "图片感", "落日海报", "暖色块面更强，适合情绪图文、种草和视觉导向内容。", {
    accent: "#f05d33",
    background: "#fff8f4",
    text: "#402823",
    heading: "#4c2014",
    muted: "#91695f",
    soft: "#ffe3d8",
    quote: "#844838",
    border: "#f4c5b3",
    code: "#c2410c",
    codeBg: "#ffe5da",
    codeBlock: "#381c16",
    codeBlockText: "#fff0ea",
    radius: "24px",
    font: '"PingFang SC", "Microsoft YaHei", sans-serif'
  }, `
.wx-article h1 { margin-top: 0; }
.wx-article h2 {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 999px;
  background: linear-gradient(180deg, #fff4ee, var(--wx-soft));
}
.wx-article img { box-shadow: 0 22px 44px rgba(240, 93, 51, 0.14); }
`),
  theme("jade-outline", "知识卡片", "玉石提纲", "干净清爽，适合要点提纲、课程摘录和方法论内容。", {
    accent: "#0b8d7d",
    background: "#f7fffd",
    text: "#173933",
    heading: "#0d3731",
    muted: "#587a72",
    soft: "#ddf7f0",
    quote: "#346b61",
    border: "#bae8dd",
    code: "#0f766e",
    codeBg: "#ddf7f3",
    codeBlock: "#0d2f2a",
    codeBlockText: "#dffcf6",
    radius: "16px",
    font: '"PingFang SC", "Microsoft YaHei", sans-serif'
  }, `
.wx-article h2 {
  padding: 0 0 10px;
  border-bottom: 3px solid var(--wx-soft);
}
.wx-article ul li::marker { color: var(--wx-accent); }
`),
  theme("plum-review", "商业复盘", "梅子复盘", "比常规复盘更柔和，适合复盘总结、案例拆解和经验归纳。", {
    accent: "#8b3352",
    background: "#fffafb",
    text: "#3a2730",
    heading: "#4c1c2f",
    muted: "#86626e",
    soft: "#f8e5eb",
    quote: "#70414f",
    border: "#eccdd8",
    code: "#9d174d",
    codeBg: "#fde7f0",
    codeBlock: "#311821",
    codeBlockText: "#ffeef5",
    radius: "16px",
    font: '"PingFang SC", "Microsoft YaHei", sans-serif'
  }, `
.wx-article h2 {
  padding-left: 16px;
  border-left: 4px solid var(--wx-accent);
  background: linear-gradient(90deg, var(--wx-soft), transparent 70%);
}
`),
  theme("aurora-lab", "品牌实验室", "极光实验", "更现代一点，适合新品发布、品牌故事和创意提案。", {
    accent: "#0f7ad6",
    background: "#f8fbff",
    text: "#1d2d3c",
    heading: "#0f2540",
    muted: "#607588",
    soft: "#e2efff",
    quote: "#395570",
    border: "#c9dcf5",
    code: "#2563eb",
    codeBg: "#e6efff",
    codeBlock: "#13263b",
    codeBlockText: "#edf5ff",
    radius: "20px",
    font: '"PingFang SC", "Microsoft YaHei", sans-serif'
  }, `
.wx-article h1 {
  text-align: center;
  padding: 0 0 14px;
  border-bottom: 1px solid var(--wx-border);
}
.wx-article h2 {
  padding: 10px 14px;
  background: linear-gradient(90deg, var(--wx-soft), rgba(255, 255, 255, 0));
  border-radius: 16px;
}
`),
  theme("cream-essay", "专栏深读", "奶油随笔", "更柔和的专栏感，适合叙事随笔、人物稿和慢读内容。", {
    accent: "#b7793f",
    background: "#fffdf8",
    text: "#372d25",
    heading: "#2e2219",
    muted: "#867467",
    soft: "#f8eddc",
    quote: "#6e5747",
    border: "#e7d5bc",
    code: "#9a3412",
    codeBg: "#fbe7d3",
    codeBlock: "#30231a",
    codeBlockText: "#fbefe0",
    radius: "14px",
    font: '"Source Han Serif SC", "Songti SC", serif'
  }, `
.wx-article h2 { margin-top: 2em; }
.wx-article h2::after {
  content: "";
  display: block;
  width: 56px;
  height: 2px;
  margin-top: 10px;
  background: var(--wx-accent);
}
`),
  theme("graphite-note", "极简留白", "石墨手记", "冷静克制，适合观点卡片、工作记录和条理型内容。", {
    accent: "#374151",
    background: "#ffffff",
    text: "#1f2937",
    heading: "#0f172a",
    muted: "#6b7280",
    soft: "#f3f4f6",
    quote: "#4b5563",
    border: "#d7dce3",
    code: "#334155",
    codeBg: "#eef2f7",
    codeBlock: "#111827",
    codeBlockText: "#e5e7eb",
    radius: "8px",
    font: '"Helvetica Neue", "PingFang SC", sans-serif'
  }, `
.wx-article h2 { text-transform: none; font-size: 20px; }
.wx-article blockquote { background: transparent; border: 1px solid var(--wx-border); }
`),
  theme("berry-zine", "图片感", "莓果画报", "对比更强，适合封面感图文、生活方式和短内容合集。", {
    accent: "#c13584",
    background: "#fff9fc",
    text: "#3f2634",
    heading: "#5b183d",
    muted: "#8e5f78",
    soft: "#ffe4f1",
    quote: "#83465f",
    border: "#f0c7dc",
    code: "#be185d",
    codeBg: "#ffe4ef",
    codeBlock: "#331522",
    codeBlockText: "#ffeef6",
    radius: "24px",
    font: '"PingFang SC", "Microsoft YaHei", sans-serif'
  }, `
.wx-article h2 {
  display: inline-block;
  padding: 8px 16px;
  background: var(--wx-soft);
  transform: rotate(-1deg);
}
.wx-article img { box-shadow: 0 24px 40px rgba(193, 53, 132, 0.15); }
`),
  theme("sage-manual", "商业复盘", "鼠尾草手册", "偏方法论和执行文档风格，适合 SOP、复盘和内部说明。", {
    accent: "#5d7a52",
    background: "#fbfdf9",
    text: "#2f372c",
    heading: "#243020",
    muted: "#6f7f68",
    soft: "#edf4e8",
    quote: "#52624c",
    border: "#d7e1d0",
    code: "#4d7c0f",
    codeBg: "#edf7da",
    codeBlock: "#24301f",
    codeBlockText: "#eef8e4",
    radius: "12px",
    font: '"PingFang SC", "Microsoft YaHei", sans-serif'
  }, `
.wx-article h2 {
  padding: 10px 12px;
  border: 1px solid var(--wx-border);
  border-radius: 12px;
  background: var(--wx-soft);
}
.wx-article table th { text-transform: uppercase; letter-spacing: 0.04em; }
`)
];

export const themeCategories = ["全部", ...new Set(themes.map((theme) => theme.category))];

export function getThemeById(id) {
  return themes.find((item) => item.id === id) ?? themes[0];
}

export function getThemesByCategory(category = "全部") {
  if (category === "全部") {
    return themes;
  }

  return themes.filter((item) => item.category === category);
}

export function getAllThemeCss() {
  return themes.map((item) => item.css).join("\n");
}

function theme(id, category, name, description, tokens, extras = "") {
  const cssVars = `
.theme-${id} {
  --wx-accent: ${tokens.accent};
  --wx-bg: ${tokens.background};
  --wx-text: ${tokens.text};
  --wx-heading: ${tokens.heading};
  --wx-muted: ${tokens.muted};
  --wx-soft: ${tokens.soft};
  --wx-quote: ${tokens.quote};
  --wx-border: ${tokens.border};
  --wx-code: ${tokens.code};
  --wx-code-bg: ${tokens.codeBg};
  --wx-code-block: ${tokens.codeBlock};
  --wx-code-block-text: ${tokens.codeBlockText};
  --wx-radius: ${tokens.radius};
  --wx-font: ${tokens.font};
}
`;

  return {
    id,
    category,
    name,
    description,
    palette: {
      accent: tokens.accent,
      background: tokens.background,
      text: tokens.text,
      soft: tokens.soft
    },
    css: `${cssVars}${baseArticleCss}${extras}`
  };
}
