# Portfolio Assets, Spacing, and Global Cursor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the five selected-project covers with compressed assets, extend SplashCursor across the full page, and reduce inter-section spacing without changing content or project order.

**Architecture:** Keep all existing project URLs and data intact by replacing image binaries in place. Move the single SplashCursor render from the Hero into the page root and make its canvas a fixed, non-interactive viewport layer. Centralize section-spacing overrides in `app/globals.css` with desktop and mobile values.

**Tech Stack:** Next.js-compatible React, vinext, CSS, Node test runner, Cloudflare Worker build.

## Global Constraints

- Do not change existing copy, project order, detail routes, or internal card spacing.
- Keep Hero at full viewport height.
- Disable the fluid effect for `prefers-reduced-motion: reduce` and coarse-pointer touch devices.
- Preserve click, hover, copy, navigation, and horizontal carousel interactions.
- Push only verified changes to GitHub `main`.

---

### Task 1: Replace Selected-Project Cover Assets

**Files:**
- Modify: `public/media/projects/wuge-miracle.jpg`
- Modify: `public/media/projects/starry-miracle.jpg`
- Modify: `public/media/projects/apa-school.jpg`
- Modify: `public/media/projects/forise-wealth.jpg`
- Modify: `public/media/projects/ai-experience.jpg`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: Existing image paths from `lib/projects.ts`.
- Produces: The same five public URLs backed by smaller JPEG binaries.

- [ ] **Step 1: Record the expected mapping and size assertions in the test**

Add a test that reads the five files, asserts each is below `500_000` bytes, and confirms `lib/projects.ts` still contains the five established URLs.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --test-name-pattern="compressed project covers"`
Expected: FAIL because the existing images are between 2 MB and 3.5 MB.

- [ ] **Step 3: Replace each image in place**

Copy the exact files:

```text
项目图片/4 copy.jpg  -> public/media/projects/wuge-miracle.jpg
项目图片/20 copy.jpg -> public/media/projects/starry-miracle.jpg
项目图片/61 copy.jpg -> public/media/projects/apa-school.jpg
项目图片/52 copy.jpg -> public/media/projects/forise-wealth.jpg
项目图片/34 copy.jpg -> public/media/projects/ai-experience.jpg
```

- [ ] **Step 4: Run the focused test and inspect all five images**

Run: `npm test -- --test-name-pattern="compressed project covers"`
Expected: PASS, with each file below 500 KB.

---

### Task 2: Extend SplashCursor to the Full Page

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/SplashCursor.jsx`
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: Existing `SplashCursor` props and WebGL implementation.
- Produces: One element with `data-splash-cursor="global"` and a fixed full-viewport canvas.

- [ ] **Step 1: Change the cursor test to require a global layer**

Update the existing test to assert `data-splash-cursor="global"`, `.global-splash-cursor`, `position:fixed`, `pointer-events:none`, and the reduced-motion/coarse-pointer fallback.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --test-name-pattern="SplashCursor"`
Expected: FAIL because the cursor is still marked `hero` and positioned absolutely.

- [ ] **Step 3: Move the component to the page root and update its layer contract**

Render the existing `<SplashCursor ... />` immediately inside `<main>`, before navigation. Rename the wrapper class/data marker to `global-splash-cursor`/`global` and replace inline absolute layout with CSS-driven fixed layout.

- [ ] **Step 4: Add fixed-layer and accessibility CSS**

Define the fixed viewport layer with `position:fixed; inset:0; width:100vw; height:100vh; pointer-events:none; z-index:2; mix-blend-mode:screen; opacity:.58`. Keep page content and sticky navigation above it where necessary. Hide it under reduced motion and `(hover:none) and (pointer:coarse)`.

- [ ] **Step 5: Run the focused test**

Run: `npm test -- --test-name-pattern="SplashCursor"`
Expected: PASS.

---

### Task 3: Tighten Responsive Inter-Section Spacing

**Files:**
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: Existing `.strengths`, `.about`, `.projects`, and `.contact` section classes.
- Produces: Desktop and mobile spacing tokens expressed as final CSS overrides.

- [ ] **Step 1: Add a failing spacing contract test**

Require desktop `.strengths,.about,.projects{padding-top:72px}` and `.contact{margin-top:90px}`, with mobile values of `56px` and `64px`. Also assert the Hero min-height rule remains unchanged.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --test-name-pattern="compact section spacing"`
Expected: FAIL because current later overrides only set `.strengths{padding-top:88px}` and contact margin remains 160px.

- [ ] **Step 3: Add final desktop and mobile overrides**

Append one documented spacing block to `app/globals.css`. Do not change `.about-grid`, `.strength-grid`, card padding, or Hero height.

- [ ] **Step 4: Run the focused test**

Run: `npm test -- --test-name-pattern="compact section spacing"`
Expected: PASS.

---

### Task 4: Verify and Publish

**Files:**
- Verify all modified files from Tasks 1–3.

**Interfaces:**
- Consumes: Completed asset and code changes.
- Produces: A verified Git commit pushed to `origin/main`.

- [ ] **Step 1: Run full verification**

Run: `npm test && npm run lint && npm run build && git diff --check`
Expected: All tests pass, production build exits 0, lint has 0 errors, and diff check is clean.

- [ ] **Step 2: Inspect scope and asset sizes**

Run: `git status --short && git diff --stat && du -h public/media/projects/*.jpg`
Expected: Only the plan/spec, five cover images, cursor/layout source, CSS, and tests are changed; all five covers are below 500 KB.

- [ ] **Step 3: Commit implementation**

Stage explicit paths only and commit with `optimize portfolio visuals and spacing`.

- [ ] **Step 4: Push and verify GitHub**

Push `HEAD:main`, fetch `origin/main`, and assert local and remote commit SHA values are identical.

- [ ] **Step 5: Play completion notification**

Play `/System/Library/Sounds/Ping.aiff` twice after remote verification succeeds.
