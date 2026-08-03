# Footer SplitText Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为页尾标题增加逐字进入动画，并移除联系信息横线和邮箱、电话后的箭头。

**Architecture:** 新增独立客户端 `SplitText` 组件，使用 GSAP SplitText 与 ScrollTrigger 在首次进入视口时运行动画，并在减少动态效果模式下直接展示内容。页尾继续由服务端页面组合，联系链接与复制按钮保持原有组件边界。

**Tech Stack:** React、GSAP、`@gsap/react`、CSS、Node test runner

## Global Constraints

- 页尾文案、联系方式内容和复制功能保持不变。
- 标题必须继续使用 `h2` 语义和左对齐两行展示。
- 动画仅首次进入视口触发。
- `prefers-reduced-motion: reduce` 下不执行位移动画。
- 不修改页尾以外的页面模块。

---

### Task 1: 锁定页尾结构与精简要求

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `/` 路由 HTML 和 `app/globals.css`。
- Produces: SplitText 标识、无箭头、无联系区边框和复制按钮保留的回归断言。

- [ ] **Step 1: 写失败测试**

```js
test('animates the footer message and removes contact dividers and arrows', async () => {
  const response = await render('/');
  const html = await response.text();
  const css = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8');
  assert.match(html, /<h2[^>]*data-split-text="footer"/);
  assert.doesNotMatch(html, /1135551233@qq\.com[^<]*↗/);
  assert.doesNotMatch(html, /157 1881 4725[^<]*↗/);
  assert.doesNotMatch(css, /\.contact-links\{[^}]*border-(?:top|bottom)/);
  assert.equal((html.match(/>复制<\/button>/g) ?? []).length, 3);
});
```

- [ ] **Step 2: 运行测试并确认失败原因正确**

Run: `npm test`

Expected: FAIL，指出页尾尚无 SplitText 标识或联系信息仍有箭头和边框。

### Task 2: 接入 SplitText 组件

**Files:**
- Create: `components/SplitText.jsx`
- Modify: `app/portfolio/page.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `text`、`tag`、`delay`、`duration`、`ease`、`splitType`、`from`、`to`、`threshold`、`rootMargin` 和 `textAlign` props。
- Produces: 带 `data-split-text="footer"` 的 `h2`，并在视口进入时执行一次动画。

- [ ] **Step 1: 安装 React GSAP 集成**

Run: `npm install @gsap/react`

Expected: `package.json` 和锁文件记录 `@gsap/react`。

- [ ] **Step 2: 按用户提供的源码新增 `components/SplitText.jsx`**

在源码顶部加入 `'use client';`，并增加减少动态效果判断；当匹配时跳过拆分动画并直接保持文字可见。

- [ ] **Step 3: 用 SplitText 渲染页尾标题**

```tsx
<SplitText
  tag="h2"
  text={'感谢您的观看，\n期待您的回复。'}
  className="contact-title"
  delay={34}
  duration={0.7}
  ease="power3.out"
  splitType="chars"
  from={{ opacity: 0, y: 28 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.15}
  rootMargin="-60px"
  textAlign="left"
  dataAttribute="footer"
/>
```

扩展组件接收 `dataAttribute` 并输出 `data-split-text={dataAttribute}`。

### Task 3: 精简联系信息样式

**Files:**
- Modify: `components/CopyContact.tsx`
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: 现有 `CopyContactProps` 与 `.contact-links`。
- Produces: 无箭头的链接和无上下边框的联系信息网格。

- [ ] **Step 1: 删除链接文本后的箭头**

```tsx
{href ? <a href={href}>{displayValue}</a> : <span>{displayValue}</span>}
```

- [ ] **Step 2: 删除桌面与移动端联系区边框规则**

将 `.contact-links` 的 `border-top`、`border-bottom` 移除，并删除移动端 `.contact-links>*` 的底部边框。

- [ ] **Step 3: 运行完整测试与构建**

Run: `npm test && npm run build`

Expected: 所有测试通过，两次构建退出码均为 0。

- [ ] **Step 4: 检查变更范围**

Run: `git diff --check && git status --short`

Expected: 无空白错误；仅包含 SplitText、页尾页面、联系组件、CSS、依赖和测试。

- [ ] **Step 5: 提交实现**

```bash
git add components/SplitText.jsx components/CopyContact.tsx app/portfolio/page.tsx app/globals.css package.json package-lock.json tests/rendered-html.test.mjs
git commit -m "feat: animate and simplify portfolio footer"
```
