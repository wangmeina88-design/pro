# Layout and Carousel Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine shared alignment, hero composition, strength numbering, project ordering and continuous carousel behavior.

**Architecture:** Keep the existing Next/Vinext structure and introduce shared navigation inner shells. Keep ChromaGrid's duplicated DOM rail for seamless looping, while making the source project list the single ordering authority.

**Tech Stack:** Next.js, React, TypeScript, CSS, Node test runner.

## Global Constraints

- Preserve all existing copy and project detail links.
- Use the user-provided watermark-free MP4.
- Preserve reduced-motion accessibility.

---

### Task 1: Lock requirements with rendering tests

**Files:**
- Modify: `tests/rendered-html.test.mjs`

- [ ] Add assertions for shared navigation shells, requested project order, decorative strength numbers, and hero composition hooks.
- [ ] Run `npm test` and confirm the new assertions fail for the missing behavior.

### Task 2: Update content structure and media

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/projects/[slug]/page.tsx`
- Modify: `lib/projects.ts`
- Replace: `public/media/intro.mp4`

- [ ] Add shared navigation inner wrappers.
- [ ] Reorder projects and renumber their handles.
- [ ] Add semantic classes for the hero title and decorative strength numbers.
- [ ] Copy the approved video into the public media location.

### Task 3: Refine responsive styling and carousel behavior

**Files:**
- Modify: `app/globals.css`
- Modify: `app/projects/project-detail.css`
- Modify: `components/ChromaGrid.css`
- Modify: `components/ChromaGrid.jsx`

- [ ] Align navigation, footer, and content edges through shared shells.
- [ ] Resize and constrain hero text while shifting video composition right.
- [ ] Style decorative strength numbers with restrained outlined typography.
- [ ] Maintain seamless leftward movement, hidden scrollbars, pause interactions, and reduced motion.

### Task 4: Verify

**Files:**
- Test: `tests/rendered-html.test.mjs`

- [ ] Run `npm test` and confirm all tests pass.
- [ ] Run `npm run build` and confirm exit code 0.
- [ ] Run `npm run lint` and confirm 0 errors.
- [ ] Inspect the local homepage and a project detail page at desktop and mobile widths.
