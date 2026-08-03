# Strengths BorderGlow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将个人优势改为四张独立的边缘感应高光卡片，文案完全不变。

**Architecture:** 新增无依赖的客户端 `BorderGlow` 组件及局部 CSS，个人优势数据继续由页面映射，仅替换卡片容器。全局 CSS 负责四列/两列布局和内容排版。

**Tech Stack:** React、CSS、Node test runner

## Global Constraints

- 四张卡片的编号、标题、说明文案、顺序完全不变。
- PC 四列，移动端两列；卡片间距 16px，圆角 20px。
- 不启用自动扫光，只响应指针靠近边缘。
- 保留当前分支的页尾 SplitText 改动。

---

### Task 1: 锁定 BorderGlow 结构与文案

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `/` 路由 HTML 和 `app/globals.css`。
- Produces: 四个 BorderGlow 容器、无自动扫光、原文案顺序和布局数值断言。

- [ ] **Step 1: 写失败测试**

```js
test('renders unchanged strengths inside four BorderGlow cards', async () => {
  const response = await render('/');
  const html = await response.text();
  const css = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8');
  assert.equal((html.match(/data-border-glow="strength"/g) ?? []).length, 4);
  assert.equal((html.match(/data-border-glow-animated="false"/g) ?? []).length, 4);
  ['业务拆解', '体验策略', '视觉落地', 'AI 协同'].forEach((copy, index, all) => {
    assert.match(html, new RegExp(`>${copy}<`));
    if (index) assert.ok(html.indexOf(copy) > html.indexOf(all[index - 1]));
  });
  assert.match(css, /\.strength-grid\{[^}]*gap:16px/);
});
```

- [ ] **Step 2: 运行 `npm test` 并确认因 BorderGlow 尚未接入而失败**

### Task 2: 新增并接入 BorderGlow

**Files:**
- Create: `components/BorderGlow.jsx`
- Create: `components/BorderGlow.css`
- Modify: `app/portfolio/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `children`、`className`、`edgeSensitivity`、`glowColor`、`backgroundColor`、`borderRadius`、`glowRadius`、`glowIntensity`、`coneSpread`、`animated`、`colors`、`fillOpacity`。
- Produces: `data-border-glow="strength"`、`data-border-glow-animated="false"` 的卡片容器。

- [ ] **Step 1: 按用户源码新增组件和 CSS**

组件顶部加入 `'use client';`，保留边缘距离和指针角度计算；为验收加入 `data-border-glow` 与动画状态属性。

- [ ] **Step 2: 替换个人优势原生 `article`**

```tsx
<BorderGlow
  key={title}
  className="strength-card"
  edgeSensitivity={34}
  glowColor="225 85 72"
  backgroundColor="#111417"
  borderRadius={20}
  glowRadius={28}
  glowIntensity={0.72}
  coneSpread={22}
  animated={false}
  colors={['#6B8CFF', '#8B7CFF', '#58C4DC']}
  fillOpacity={0.22}
>
  <article><span>{number}</span><h3>{title}</h3><p>{description}</p></article>
</BorderGlow>
```

- [ ] **Step 3: 调整布局样式**

```css
.strength-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;background:transparent}
.strength-card,.strength-card .border-glow-inner,.strength-card article{min-height:330px}
.strength-card article{padding:28px;display:flex;flex-direction:column}
@media(max-width:767px){.strength-grid{grid-template-columns:1fr 1fr}}
```

- [ ] **Step 4: 运行 `npm test && npm run build`**

Expected: 所有测试通过，两次构建退出码为 0。

- [ ] **Step 5: 检查并提交**

Run: `git diff --check && git status --short`

```bash
git add components/BorderGlow.jsx components/BorderGlow.css app/portfolio/page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: add border glow strengths cards"
```
