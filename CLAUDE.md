# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page "cinematic" studio site built from a reusable design system. `SPEC.md` (Portuguese) is the source of truth: read it before any task. Its golden rule: if something is not in the spec, do not invent it — record it as an open question.

Current state: the project is only the studio design system; the single page is a catalog of it (`src/App.tsx`). No tests or test runner exist yet.

## Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b (type check) then vite build
npm run lint      # eslint .
npm run preview   # serve the production build
```

## Stack (SPEC §9)

Vite + React 19 + TypeScript (strict unused locals/params, `verbatimModuleSyntax`, `erasableSyntaxOnly` — use `import type`, no enums/namespaces). Tailwind v4 via `@tailwindcss/vite`, tokens bound through `@theme`. Lenis for smooth scroll, GSAP + ScrollTrigger for scroll animation. Deploy target: Vercel.

Fonts are self-hosted with `@fontsource-variable/*` (no Google CDN), imported by the theme file. `vite.config.ts` preloads only the hero display font (`HERO_FONT`); change it together with the theme.

## Intended structure (SPEC §9)

- `src/styles/base.css` — structure shared by every client: space scale, grid, breakpoints, motion tokens, reset, focus, and the `@theme reference` contract each theme must fill
- `src/styles/themes/[tema].css` — identity only (brand colors → semantic `--color-*`, fonts, display/h2/h3 sizes, `--radius-base`, optional `--theme-dur-scene`), scoped to `[data-theme="…"]`. Switching client = switching this file
- Token levels: brand `--brand-*` (theme only) → semantic `--color-*` etc. → component (`--focus-*`, `--button-*`…, in base). Components use semantic or component tokens, never brand
- `src/components/ds/` — reusable design-system components (SPEC §8: `Button`, `Nav`, `HeroTitle`, `RevealText`, `MediaFrame`, `HorizontalGallery`, `PortalCard`, `CollectionGrid`, `StatCounter`, `LogoWall`, `PageTransition`, `Footer`)
- `src/components/sections/` — page sections composed from ds components (SPEC §3 narrative order)
- `src/lib/motion/` — animation hooks and presets
- `public/assets/` — optimized media

## ⚠ Spacing scale: Tailwind naming, restricted steps

`@theme` resets the default theme. Spacing keeps the Tailwind convention (name × 4 = px: `p-4` = 16px) but exists **only** for the SPEC §4 scale:

| name | 0 | 1 | 2 | 4 | 6 | 8 | 12 | 16 | 24 | 32 | 48 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| px | 0 | 4 | 8 | 16 | 24 | 32 | 48 | 64 | 96 | 128 | 192 |

Anything else (`p-5`, `gap-3`, `p-[13px]`) generates no CSS and fails silently in the browser, so `npm run lint` runs `scripts/check-spacing.mjs`, which fails on it. For a component token use `p-(--token)`.

## ⚠ Layout: space between components belongs to the section

Espaço ENTRE componentes é responsabilidade da seção, sempre via `Stack`/`Container`; nunca `div` com classes de espaço avulsas.

- `Section` (`src/components/ds/layout/`): full-width band, vertical padding (`space`), optional `theme` and `tone`.
- `Container`: SPEC §4 side margin + 4/12 grid; `layout` = `full | split | thirds | main-aside` places the children; `gap` = row gap.
- `Stack`: flex `direction` + `gap`, plus `align`, `justify`, `wrap`.
- `space`/`gap` props are the `Space` union (the scale above). ds components take no `className`/`style`; their variants are union types.

## Hard rules from the spec

- Tokens are the only visual source: no raw color, font size or spacing values outside `base.css` and theme files. `@theme` starts with `--*: initial`, so only token utilities exist (spacing: see the scale table above). Accent color max 3 uses per screen.
- Motion tokens: `--ease-out`, `--ease-in-out`, `--ease-snap`; `--dur-fast` 200ms, `--dur-base` 500ms, `--dur-slow` 900ms, `--dur-scene` 1200–1600ms; `--stagger` 60ms.
- One highlight animation per section; everything else is a simple reveal (fade + 24px translate).
- Animate only `transform` and `opacity`. No scroll-jacking.
- `prefers-reduced-motion`: disable parallax, scroll-scrub and rotating 3D; keep short fades only.
- Mobile first; on mobile cut motion distances/durations ~30% and avoid hover-dependent effects.
- No placeholders or unlicensed assets in production; every asset goes through the inventory in SPEC §6.
- New ds components need registering; a component enters the shared library only after use in 2 projects.
- Acceptance (SPEC §10, mobile): LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, Lighthouse perf ≥ 85, initial JS ≤ 250KB gzip, 3D/Rive lazy-loaded when visible, AA contrast, visible focus, one `h1`, works 375–1920px.

## Agent workflow (SPEC §11)

Roles: Orchestrator, Foundation (tokens + ds components + motion presets; runs first), Section (one per section), Motion & 3D, Reviewer. Sections and Motion start only after Foundation lands. Reviewer reports pass/fail and never fixes code itself. Each executor works in its own branch or worktree; role definitions go in `.claude/agents/`.
