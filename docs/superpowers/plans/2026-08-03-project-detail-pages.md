# Project Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 5 个精选项目建立可点击进入的响应式二级详情页，完整展示对应 PDF 内容。

**Architecture:** 使用 `app/projects/[slug]/page.tsx` 统一动态模板，项目元数据集中在 `lib/projects.ts`。详情页直接嵌入复制到公开目录的 PDF；首页 ChromaGrid 使用内部链接导航。

**Tech Stack:** React、Vinext、CSS、浏览器 PDF 阅读器、Node test runner

## Global Constraints

- 5 个项目映射和现有首页文案保持不变。
- 原始 PDF 不覆盖、不移动。
- 详情页直接展示 PDF，不转换为逐页图片。
- 当前标签页导航，支持鼠标、键盘和触摸。
- 保留当前分支已完成的页尾 SplitText 与 BorderGlow 改动。

---

### Task 1: 锁定项目路由和详情页结构

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `/` 和 5 个 `/projects/<slug>` 路由 HTML。
- Produces: 首页 URL、详情标题、页数、加载策略和项目导航断言。

- [ ] **Step 1: 写失败测试**

```js
const details = [
  ['ai-experience', 'AI 赋能产品体验', 14],
  ['starry-miracle', '星海情绪助手', 12],
  ['wuge-miracle', '吴歌陪伴体验升级', 16],
  ['apa-school', 'APa 网校系统', 16],
  ['forise-wealth', '复华财富', 8],
];

test('links every selected project to its detail route', async () => {
  const html = await (await render('/')).text();
  details.forEach(([slug]) => assert.match(html, new RegExp(`/projects/${slug}`)));
});

for (const [slug, title, pages] of details) {
  test(`renders ${slug} project detail`, async () => {
    const response = await render(`/projects/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(title));
    assert.match(html, /class="project-pdf-frame"/);
    assert.match(html, /单独打开 PDF/);
    assert.match(html, /返回精选项目/);
    assert.match(html, /上一个项目/);
    assert.match(html, /下一个项目/);
  });
}
```

- [ ] **Step 2: 运行 `npm test` 并确认路由缺失导致测试失败**

### Task 2: 准备可公开访问的 PDF 素材

**Files:**
- Create: `public/media/project-details/ai-experience.pdf`
- Create: `public/media/project-details/starry-miracle.pdf`
- Create: `public/media/project-details/wuge-miracle.pdf`
- Create: `public/media/project-details/apa-school.pdf`
- Create: `public/media/project-details/forise-wealth.pdf`

**Interfaces:**
- Consumes: 工作区根目录外的 5 份原始 PDF。
- Produces: 5 份名称稳定、可由网页直接访问的 PDF。

- [ ] **Step 1: 将 5 份原始 PDF 复制到 `public/media/project-details/` 并使用稳定英文文件名**
- [ ] **Step 2: 检查 5 份 PDF 均存在且可被本地服务器访问**

### Task 3: 建立项目数据和详情模板

**Files:**
- Create: `lib/projects.ts`
- Create: `app/projects/[slug]/page.tsx`
- Create: `app/projects/project-detail.css`
- Modify: `app/portfolio/page.tsx`
- Modify: `components/ChromaGrid.jsx`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Produces: `projects` 数组和 `getProjectBySlug(slug)`；每项包含 `slug`、`title`、`subtitle`、`handle`、`image`、`pdf`、`url`。
- Consumes: 详情模板通过 slug 查找项目，ChromaGrid 通过 `url` 导航。

- [ ] **Step 1: 将首页项目常量移动到 `lib/projects.ts` 并补充 slug、URL 和 PDF 地址**
- [ ] **Step 2: 创建动态详情模板，渲染统一导航、标题、PDF 阅读器、备用 PDF 链接与前后项目链接**
- [ ] **Step 4: 将 ChromaGrid 的 `window.open` 改为同标签 `window.location.assign(url)`，并为可点击卡片增加 `tabIndex=0`、链接语义及 Enter/Space 键处理**
- [ ] **Step 5: 添加暗色响应式详情页 CSS，PDF 阅读器宽度 100%、移动端缩小边距**

### Task 4: 验证与提交

**Files:**
- Test: `tests/rendered-html.test.mjs`

- [ ] **Step 1: 运行 `npm test && npm run build`**

Expected: 所有测试通过，两次构建退出码为 0。

- [ ] **Step 2: 运行 `git diff --check && git status --short`，确认仅包含计划文件和 5 份详情 PDF**
- [ ] **Step 3: 提交实现**

```bash
git add app components lib public/media/project-details tests/rendered-html.test.mjs
git commit -m "feat: add portfolio project detail pages"
```
