# wxmd

[English](./README.md) | 简体中文

一个面向微信公众号写作的 Markdown 排版工具。

wxmd 把 Markdown 写作、公众号风格预览、多主题排版、复制到公众号编辑器和 X 线程转换放在一个轻量页面里完成。项目使用原生 HTML、CSS 和 JavaScript，不需要框架、构建步骤、登录或外部服务。

## 现在能做什么

- Markdown 写作。
- 公众号文章风格预览。
- 内置 30 套排版主题，覆盖品牌发布、知识卡片、专栏深读、商业复盘、极简留白、图片感等方向。
- 粘贴或上传图片。
- 复制带内联样式的响应式 HTML 到公众号编辑器。
- 把 Markdown 内容拆成适合 X 发布的线程文本。
- 本地自动保存草稿、主题和预览模式。

## 功能截图

### Markdown 编辑区和公众号预览

![Markdown 编辑区和公众号预览](./docs/screenshots/editor-preview.png)

左侧写 Markdown，右侧实时查看公众号文章预览。

### 多主题效果

![多主题效果](./docs/screenshots/themes.png)

内置多套排版主题，方便快速切换文章视觉风格。

### 复制到公众号和 X 线程转换

![复制到公众号和 X 线程转换](./docs/screenshots/copy-export.png)

可复制带样式的公众号 HTML，也可把同一篇 Markdown 转成 X 线程文案。

## 适合谁

- 写公众号文章的人。
- 需要先用 Markdown 起稿，再复制到微信编辑器的人。
- 想快速切换不同文章视觉风格的人。
- 需要同时兼顾公众号和 X 分发的人。

## 本地运行

项目不依赖构建工具，直接用一个很轻的静态服务器启动。

```bash
npm start
```

默认地址：

```text
http://127.0.0.1:5173/
```

## 测试

```bash
npm test
```

测试基于 Node 原生 `--test`，主要覆盖：

- Markdown 渲染
- 编辑器快捷插入
- 主题目录有效性
- 公众号复制样式序列化
- X 线程拆分逻辑

## 项目结构

```text
.
├── index.html              # 页面入口
├── styles.css              # 应用整体界面样式
├── scripts/
│   └── static-server.mjs   # 本地静态服务器
├── src/
│   ├── app.js              # 主交互逻辑
│   ├── editorActions.js    # 编辑器工具栏动作
│   ├── markdown.js         # 轻量 Markdown 渲染器
│   ├── themeCatalog.js     # 主题库
│   ├── wechatCopy.js       # 公众号复制与样式内联
│   └── xThread.js          # X 线程文本生成
└── tests/                  # 单元测试
```

## 复制到公众号的说明

这个项目不是把预览截图贴进去，而是把预览区转换成带内联样式的 HTML，再写入剪贴板。

当前实现已经针对两个方向做了优化：

- 尽量保留主题的字体、颜色、边框、引用块、表格等样式。
- 导出时按移动端版心做响应式收敛，避免把桌面固定宽度直接带进公众号。

如果你在微信编辑器里看到少量样式被吃掉，一般是微信编辑器自身的样式清洗规则导致，而不是 Markdown 没有被解析。

## 技术特点

- 原生 HTML + CSS + JavaScript
- ESM 模块
- 无框架、无打包器、上手成本低
- 适合快速迭代主题和排版细节

## 后续可以继续扩展

- 更多主题和主题导入能力
- 自定义主题编辑器
- 更完整的 Markdown 语法支持
- 代码高亮主题
- 导出为 HTML / PDF
- 文章封面样式模板

## License

MIT License. See [LICENSE](./LICENSE).
