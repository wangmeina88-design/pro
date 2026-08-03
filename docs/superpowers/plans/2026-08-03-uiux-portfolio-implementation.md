# 王美娜 UI/UX 个人作品集 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个包含沉浸式视频入口与完整响应式作品集页面的可本地运行网站。

**Architecture:** 使用 Sites 初始化的 React/Vite 项目，以 `/` 和 `/portfolio` 两条路由承载入口与作品集。页面组件按职责拆分，个人信息与项目数据集中管理，视觉和响应式规则集中在全局样式中，媒体文件保存在 `public/media`。

**Tech Stack:** React、TypeScript、Vite、Vitest、Testing Library、原生 CSS。

## Global Constraints

- 首页使用用户指定的原始 MP4 视频，不修改或移除水印。
- 只使用简历、人物照片、5 张项目图与指定视频，不虚构项目数据。
- 页面路径必须为 `/` 与 `/portfolio`，且均支持直接访问和刷新。
- 视觉为近黑背景、暖白文字、冷蓝强调色的“电影感入口 + 编辑式作品集”。
- PC、平板和移动端不得出现横向溢出、遮挡或不可读内容。
- 支持键盘操作、清晰焦点态、替代文本和 `prefers-reduced-motion`。
- 首版不提供无内容的项目详情链接。

---

## File Structure

- `package.json`：项目依赖与开发、测试、构建脚本。
- `app/layout.tsx`：网站元信息与根布局。
- `app/page.tsx`：根据当前路径渲染入口页或作品集页。
- `app/globals.css`：设计令牌、布局、响应式、动效和可访问性样式。
- `components/VideoGate.tsx`：视频入口、静态封面兜底与导航行为。
- `components/PortfolioPage.tsx`：组合完整作品集模块。
- `components/PortfolioNav.tsx`：固定导航与移动菜单。
- `components/ProfileHero.tsx`：个人定位首屏。
- `components/Experience.tsx`：人物介绍、数据和经历时间线。
- `components/Projects.tsx`：精选项目卡片布局。
- `components/Strengths.tsx`：优势卡片与工作路径。
- `components/ContactFooter.tsx`：联系收尾与返回顶部。
- `content/portfolio.ts`：个人资料、经历、项目、优势和联系信息。
- `public/media/intro.mp4`：指定首页视频的站点副本。
- `public/media/intro-poster.jpg`：视频静态兜底封面。
- `public/media/profile.png`：从简历提取的人物照片。
- `public/media/projects/*`：5 张项目封面。
- `tests/content.test.ts`：内容完整性与真实性约束测试。
- `tests/navigation.test.tsx`：入口行为与页面结构测试。

---

### Task 1: 初始化项目并整理媒体素材

**Files:**
- Create: `package.json`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `public/media/intro.mp4`
- Create: `public/media/intro-poster.jpg`
- Create: `public/media/profile.png`
- Create: `public/media/projects/ai-experience.jpg`
- Create: `public/media/projects/starry-miracle.jpg`
- Create: `public/media/projects/wuge-miracle.jpg`
- Create: `public/media/projects/apa-school.jpg`
- Create: `public/media/projects/forise-wealth.jpg`

**Interfaces:**
- Consumes: `/Users/liepin/Downloads/电脑光晕与猫脸光影变化视频生成.mp4`、`简历.pdf`、`项目图片/*.jpg`。
- Produces: 可被组件通过 `/media/...` 路径读取的稳定媒体资源。

- [ ] **Step 1: 使用 Sites 初始化器创建基础项目**

Run: `/Users/liepin/.codex/plugins/cache/openai-bundled/sites/0.1.31/scripts/init-site.sh "$PWD"`

Expected: 生成可运行的 React/Vite 站点、`.openai/hosting.json` 和依赖锁文件。

- [ ] **Step 2: 启动开发预览并保持进程运行**

Run: `npm run dev`

Expected: 开发服务器输出可访问的 Local URL。

- [ ] **Step 3: 复制并标准化现有媒体文件**

复制原视频与 5 张项目图到上述稳定文件名；用 Poppler 渲染简历并从右上人物区域裁出 `profile.png`；从视频第 1 秒提取 `intro-poster.jpg`。不得对视频画面做水印移除或裁剪。

- [ ] **Step 4: 验证媒体可读性**

Run: `test -s public/media/intro.mp4 && test -s public/media/intro-poster.jpg && test -s public/media/profile.png && test "$(find public/media/projects -type f | wc -l | tr -d ' ')" = 5`

Expected: exit code 0。

- [ ] **Step 5: 提交项目基础与素材**

```bash
git add package.json package-lock.json app public .openai/hosting.json
git commit -m "chore: initialize portfolio site and media"
```

---

### Task 2: 建立内容模型与真实性测试

**Files:**
- Create: `content/portfolio.ts`
- Create: `tests/content.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: 设计规格中的个人资料、经历、项目、优势和联系方式。
- Produces: `profile`、`stats`、`experiences`、`projects`、`strengths` 与 `contact` 常量；后续组件只从此文件读取内容。

- [ ] **Step 1: 写内容完整性失败测试**

测试必须断言：姓名为“王美娜”；项目数为 5；经历数为 3；项目名称依次为“AI 赋能产品体验、星海情绪助手、吴歌陪伴体验升级、APa 网校系统、复华财富”；所有项目图片路径以 `/media/projects/` 开头；不存在空标题、空描述或虚构成果字段。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run tests/content.test.ts`

Expected: FAIL，原因是 `content/portfolio.ts` 尚不存在。

- [ ] **Step 3: 实现内容模型**

定义并导出 TypeScript 类型 `Experience`、`Project`、`Strength`，以及设计规格指定的真实内容常量。联系方式使用电话 `15718814725`、邮箱 `1135551233@qq.com`、微信 `15718814725`。

- [ ] **Step 4: 运行内容测试**

Run: `npm test -- --run tests/content.test.ts`

Expected: PASS。

- [ ] **Step 5: 提交内容模型**

```bash
git add content/portfolio.ts tests/content.test.ts package.json package-lock.json
git commit -m "feat: add verified portfolio content"
```

---

### Task 3: 实现视频入口与双路径导航

**Files:**
- Create: `components/VideoGate.tsx`
- Modify: `app/page.tsx`
- Create: `tests/navigation.test.tsx`

**Interfaces:**
- Consumes: `/media/intro.mp4` 与 `/media/intro-poster.jpg`。
- Produces: `VideoGate(): JSX.Element`；点击 `进入作品集` 后将 `window.location.href` 设置为 `/portfolio`；`app/page.tsx` 根据 `window.location.pathname` 选择页面。

- [ ] **Step 1: 写入口行为失败测试**

测试渲染根路径，断言存在标题“王美娜”、静音自动播放视频和“进入作品集”按钮；点击按钮后断言导航目标为 `/portfolio`。再模拟 `/portfolio`，断言作品集根容器存在。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run tests/navigation.test.tsx`

Expected: FAIL，原因是 `VideoGate` 与双路径选择尚未实现。

- [ ] **Step 3: 实现最小双路径页面**

实现 `VideoGate` 的视频、遮罩、姓名、角色和按钮；视频带 `autoPlay`、`muted`、`loop`、`playsInline` 与 `poster`。为 `/portfolio` 暂时输出带 `data-testid="portfolio-page"` 的语义容器。

- [ ] **Step 4: 运行入口测试**

Run: `npm test -- --run tests/navigation.test.tsx`

Expected: PASS。

- [ ] **Step 5: 提交入口功能**

```bash
git add components/VideoGate.tsx app/page.tsx tests/navigation.test.tsx
git commit -m "feat: add cinematic video entry"
```

---

### Task 4: 实现作品集页面组件

**Files:**
- Create: `components/PortfolioPage.tsx`
- Create: `components/PortfolioNav.tsx`
- Create: `components/ProfileHero.tsx`
- Create: `components/Experience.tsx`
- Create: `components/Projects.tsx`
- Create: `components/Strengths.tsx`
- Create: `components/ContactFooter.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/navigation.test.tsx`

**Interfaces:**
- Consumes: `content/portfolio.ts` 的全部导出数据。
- Produces: `PortfolioPage(): JSX.Element`，包含 `#about`、`#projects`、`#strengths` 和 `#contact` 锚点。

- [ ] **Step 1: 扩展失败测试覆盖全部模块**

断言 `/portfolio` 页面包含主标题“让复杂业务，变成清晰而有价值的产品体验。”、3 条经历、5 张项目卡、4 张优势卡和邮件链接；断言项目卡没有指向不存在详情页的链接。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run tests/navigation.test.tsx`

Expected: FAIL，原因是作品集模块未实现。

- [ ] **Step 3: 实现导航、Hero 与经历组件**

导航提供四个锚点链接；Hero 提供“查看精选项目”和“联系我”；经历组件使用人物照片、4 个数据项与 3 条时间线内容。

- [ ] **Step 4: 实现项目、优势与联系组件**

项目组件渲染 5 张真实封面及类型标签；优势组件渲染 4 张卡与六步工作路径；联系区提供 `mailto:`、`tel:`、微信文本与返回顶部链接。

- [ ] **Step 5: 组合页面并运行测试**

Run: `npm test -- --run tests/navigation.test.tsx`

Expected: PASS。

- [ ] **Step 6: 提交作品集结构**

```bash
git add components app/page.tsx tests/navigation.test.tsx
git commit -m "feat: build complete portfolio content"
```

---

### Task 5: 实现视觉系统、响应式与动效

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `components/PortfolioNav.tsx`

**Interfaces:**
- Consumes: 所有组件稳定的类名与锚点结构。
- Produces: 桌面、平板、移动端布局；焦点态；减少动态效果支持；站点专属元信息。

- [ ] **Step 1: 写静态样式约束测试**

在 `tests/content.test.ts` 中读取 `app/globals.css`，断言存在 `#080A0C`、`#6B8CFF`、`@media (max-width: 767px)`、`prefers-reduced-motion`、`:focus-visible` 与 `overflow-x: clip`。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run tests/content.test.ts`

Expected: FAIL，原因是完整设计令牌与响应式规则尚未加入。

- [ ] **Step 3: 实现设计令牌与桌面布局**

建立颜色、排版、间距、圆角变量；实现 1440px 内容上限、固定导航、流式大标题、人物信息双栏、交错项目网格、优势卡片和完整页尾。

- [ ] **Step 4: 实现平板与移动端规则**

在 1023px 与 767px 断点调整边距、栅格、字号和模块间距；移动端项目改为单列，时间线纵向排列，联系按钮全宽，视频主体居中裁切。

- [ ] **Step 5: 实现交互与无障碍样式**

加入卡片轻微缩放、内容淡入、清晰焦点态和触控尺寸；在 `prefers-reduced-motion: reduce` 下禁用平滑滚动、转场和缩放。

- [ ] **Step 6: 更新网站元信息并清理 starter**

标题设为“王美娜 — UI/UX Designer”，描述使用个人定位文案；移除 starter 预览组件、临时元信息与不再使用的依赖。

- [ ] **Step 7: 运行测试**

Run: `npm test -- --run`

Expected: 全部 PASS。

- [ ] **Step 8: 提交视觉系统**

```bash
git add app components tests package.json package-lock.json
git commit -m "feat: add responsive editorial visual system"
```

---

### Task 6: 构建与本地预览验证

**Files:**
- Modify: only files required to fix verified failures.

**Interfaces:**
- Consumes: 完整站点。
- Produces: 通过测试与生产构建、可在本地预览的基础版本。

- [ ] **Step 1: 运行完整测试**

Run: `npm test -- --run`

Expected: 全部 PASS，且无未处理异常。

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: exit code 0，生成生产构建产物。

- [ ] **Step 3: 检查关键资源与路由输出**

Run: `test -s public/media/intro.mp4 && test "$(find public/media/projects -type f | wc -l | tr -d ' ')" = 5 && rg -n '王美娜|portfolio' app components content`

Expected: 视频与 5 张项目图存在，关键页面内容可在源文件中定位。

- [ ] **Step 4: 检查工作区与提交最终修复**

Run: `git status --short`

Expected: 仅包含已知的用户原始素材和必要构建忽略项；若验证修复产生改动，提交：

```bash
git add app components content tests package.json package-lock.json .gitignore
git commit -m "fix: finalize portfolio preview"
```

