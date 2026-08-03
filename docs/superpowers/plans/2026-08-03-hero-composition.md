# Hero Composition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 缩小首屏标题、右移视频焦点，并使用裁掉底部水印的新视频。

**Architecture:** 保留原始 `public/media/intro.mp4`，通过 FFmpeg 生成独立的 `intro-cropped.mp4`。页面仅修改视频源引用，响应式构图继续由 `app/globals.css` 控制。

**Tech Stack:** React、Vinext、CSS、FFmpeg、Node test runner

## Global Constraints

- 原始 1280 × 720 视频必须保留，不覆盖写入。
- 新视频必须为浏览器可播放的 1280 × 620 MP4。
- 桌面端标题使用 `clamp(48px, 5.6vw, 84px)`，视频焦点为 `62% center`。
- 移动端标题为 `44px`，视频焦点为 `68% center`。
- 不修改首屏文案、导航、动效或其他页面模块。

---

### Task 1: 锁定首屏构图要求

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `/` 路由渲染后的 HTML，以及 `app/globals.css` 的文本内容。
- Produces: 对 `/media/intro-cropped.mp4`、桌面端标题规则和视频焦点规则的回归断言。

- [ ] **Step 1: 写失败测试**

```js
test('uses the cropped hero video and approved responsive composition', async () => {
  const html = await render('/');
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
  assert.match(html, /src="\/media\/intro-cropped\.mp4"/);
  assert.match(css, /clamp\(48px,5\.6vw,84px\)/);
  assert.match(css, /object-position:62% center/);
  assert.match(css, /font-size:44px/);
  assert.match(css, /object-position:68% center/);
});
```

- [ ] **Step 2: 运行测试并确认因功能缺失而失败**

Run: `npm test`

Expected: FAIL，错误指出页面仍引用 `intro.mp4` 或缺少新的 CSS 数值。

### Task 2: 生成裁剪后视频并接入页面

**Files:**
- Create: `public/media/intro-cropped.mp4`
- Modify: `app/portfolio/page.tsx`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `public/media/intro.mp4`，分辨率 1280 × 720。
- Produces: `public/media/intro-cropped.mp4`，分辨率 1280 × 620；页面 `<source>` 引用该文件。

- [ ] **Step 1: 生成不覆盖原文件的裁剪视频**

```bash
ffmpeg -y -i public/media/intro.mp4 -vf "crop=1280:620:0:0" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -movflags +faststart -an public/media/intro-cropped.mp4
```

- [ ] **Step 2: 验证输出尺寸**

Run: `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 public/media/intro-cropped.mp4`

Expected: `1280x620`

- [ ] **Step 3: 修改视频引用**

```tsx
<source src="/media/intro-cropped.mp4" type="video/mp4" />
```

### Task 3: 调整响应式标题与视频焦点

**Files:**
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `.portfolio-hero h1`、`.hero-video` 及现有移动端媒体查询。
- Produces: 桌面端与移动端确定的字号和 `object-position`。

- [ ] **Step 1: 写入桌面端规则**

```css
.portfolio-hero h1{font-size:clamp(48px,5.6vw,84px);max-width:900px}
.hero-video{object-position:62% center}
```

- [ ] **Step 2: 写入移动端覆盖规则**

```css
@media(max-width:767px){
  .portfolio-hero h1{font-size:44px}
  .hero-video{object-position:68% center}
}
```

- [ ] **Step 3: 运行完整测试和构建**

Run: `npm test && npm run build`

Expected: 所有测试通过，两次构建均以退出码 0 完成。

- [ ] **Step 4: 检查代码与媒体变更范围**

Run: `git diff --check && git status --short`

Expected: 无空白错误；变更只包含计划列出的测试、页面、CSS 和新视频。

- [ ] **Step 5: 提交实现**

```bash
git add tests/rendered-html.test.mjs app/portfolio/page.tsx app/globals.css public/media/intro-cropped.mp4
git commit -m "feat: refine hero composition and crop video"
```
