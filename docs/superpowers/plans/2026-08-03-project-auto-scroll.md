# Project Auto-scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让精选项目保持彩色、自动无缝横向滚动，并隐藏原生滚动条。

**Architecture:** `ChromaGrid` 将项目渲染为两组连续卡片，通过 `requestAnimationFrame` 更新容器 `scrollLeft`，越过第一组宽度后回绕。组件以指针、焦点、滚轮和减少动态效果状态控制暂停，CSS 删除灰度层并隐藏滚动条。

**Tech Stack:** React、GSAP（保留卡片交互）、CSS、Node test runner

## Global Constraints

- 项目数据、顺序、图片和文案保持不变。
- 对辅助技术只暴露第一组五个项目。
- `prefers-reduced-motion: reduce` 下不启动自动滚动。
- 保留原生横向滑动与滚轮转横向滚动能力。
- 不修改其他页面模块。

---

### Task 1: 锁定彩色无缝滚动结构

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `/` 路由渲染 HTML 和 `components/ChromaGrid.css`。
- Produces: 自动滚动标识、两组轨道、重复组隐藏和滚动条隐藏断言。

- [ ] **Step 1: 写失败测试**

```js
test('renders colorful auto-scrolling projects without a visible scrollbar', async () => {
  const html = await render('/');
  const css = readFileSync(new URL('../components/ChromaGrid.css', import.meta.url), 'utf8');
  assert.match(html, /data-auto-scroll="true"/);
  assert.equal((html.match(/data-project-group=/g) ?? []).length, 2);
  assert.match(html, /data-project-group="duplicate" aria-hidden="true"/);
  assert.doesNotMatch(css, /grayscale\(/);
  assert.match(css, /scrollbar-width:\s*none/);
  assert.match(css, /::-webkit-scrollbar/);
});
```

- [ ] **Step 2: 运行测试并确认失败原因正确**

Run: `npm test`

Expected: FAIL，指出自动滚动标识或重复项目组尚不存在。

### Task 2: 实现两组项目与自动滚动

**Files:**
- Modify: `components/ChromaGrid.jsx`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `items` 数组和横向滚动根元素。
- Produces: `data-auto-scroll="true"` 根容器、`primary` 与 `duplicate` 两个 `.chroma-project-group`，以及可暂停的 RAF 循环。

- [ ] **Step 1: 增加滚动状态引用**

```jsx
const isPaused = useRef(false);
const resumeTimer = useRef(null);
const primaryGroupRef = useRef(null);
```

- [ ] **Step 2: 增加 RAF 循环和减少动态效果检查**

```jsx
useEffect(() => {
  const root = rootRef.current;
  const group = primaryGroupRef.current;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!root || !group || reduced) return;
  let raf;
  const tick = () => {
    if (!isPaused.current) {
      root.scrollLeft += 0.35;
      if (root.scrollLeft >= group.scrollWidth) root.scrollLeft -= group.scrollWidth;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}, [data.length]);
```

- [ ] **Step 3: 渲染两组卡片并隐藏重复组**

```jsx
{['primary', 'duplicate'].map(group => (
  <div
    key={group}
    ref={group === 'primary' ? primaryGroupRef : undefined}
    className="chroma-project-group"
    data-project-group={group}
    aria-hidden={group === 'duplicate' ? 'true' : undefined}
  >
    {data.map((c, i) => renderCard(c, i, group))}
  </div>
))}
```

- [ ] **Step 4: 增加悬停、焦点、指针和滚轮暂停处理**

```jsx
const pause = () => { isPaused.current = true; };
const resume = () => { isPaused.current = false; };
```

根容器绑定 `onMouseEnter={pause}`、`onMouseLeave={resume}`、`onFocus={pause}`、`onBlur={resume}`、`onPointerDown={pause}`、`onPointerUp={resume}`，滚轮操作后延迟恢复。

### Task 3: 移除灰度并隐藏滚动条

**Files:**
- Modify: `components/ChromaGrid.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `.chroma-project-rail` 和新增 `.chroma-project-group`。
- Produces: 连续横向轨道、隐藏滚动条和无灰度视觉。

- [ ] **Step 1: 删除 `.chroma-overlay`、`.chroma-fade` 灰度样式和对应 JSX 节点**

删除所有 `backdrop-filter: grayscale(...)` 与遮罩规则。

- [ ] **Step 2: 增加连续项目组样式**

```css
.chroma-project-group{display:flex;flex:0 0 auto;gap:24px}
```

- [ ] **Step 3: 隐藏原生滚动条**

```css
.chroma-grid.chroma-project-rail{scrollbar-width:none;-ms-overflow-style:none}
.chroma-grid.chroma-project-rail::-webkit-scrollbar{display:none}
```

- [ ] **Step 4: 运行完整测试和构建**

Run: `npm test && npm run build`

Expected: 所有测试通过，两次构建退出码均为 0。

- [ ] **Step 5: 检查变更并提交**

Run: `git diff --check && git status --short`

Expected: 无空白错误，变更仅包含 ChromaGrid、CSS 和测试。

```bash
git add components/ChromaGrid.jsx components/ChromaGrid.css tests/rendered-html.test.mjs
git commit -m "feat: auto-scroll colorful project rail"
```
