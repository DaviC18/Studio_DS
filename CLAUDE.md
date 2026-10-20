# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page "cinematic" studio site built from a reusable design system. `SPEC.md` (Portuguese) is the source of truth: read it before any task. Its golden rule: if something is not in the spec, do not invent it — record it as an open question.

Current state: the root (`index.html`, `data-page="site"`) is the Golden Grains test site (`Spec_Golden_Grains.md`), an empty shell (`src/Site.tsx`: skip link + `<main id="conteudo">`) until sections land; `src/App.tsx` switches page by `data-page`. The design system catalog lives at `/catalogo/` (`catalogo/index.html`, `src/catalog/`) and `catalogo/stress.html` renders the 375px stress test, both `noindex`. All three HTML pages are prerendered at build (`renderToString` → `scripts/prerender.mjs`) and hydrated with `hydrateRoot`: never read browser-only values (theme, computed styles) during render — use `useTheme`/`useHydrated` (`useSyncExternalStore` with a server snapshot). Hero entrance is CSS only (`HeroTitle play="load"`); GSAP is for below-the-fold scroll motion (SPEC §5.10–11). No tests or test runner exist yet; checks are `npm run lint` and `npm run build`.

## Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b, vite build, SSR build + prerender, JS budget check
npm run lint      # eslint . + prettier --check . + scripts/check-tokens.mjs (spacing scale, raw colors)
npm run format    # prettier --write . (Markdown is ignored)
npm run preview   # serve the production build
```

## Stack (SPEC §9)

Vite + React 19 + TypeScript (strict unused locals/params, `verbatimModuleSyntax`, `erasableSyntaxOnly` — use `import type`, no enums/namespaces). Tailwind v4 via `@tailwindcss/vite`, tokens bound through `@theme`. Lenis for smooth scroll, GSAP + ScrollTrigger for scroll animation. Deploy target: Vercel.

Fonts are self-hosted with `@fontsource-variable/*` (no Google CDN), declared by `@font-face` in the theme file (latin + latin-ext only), each with a `size-adjust` local fallback against CLS. Site config lives only in `site.config.ts` (`SITE = { theme, mode, indexable }`); `vite.config.ts` derives from it `<html data-theme>`, the hero font preload (`heroFont` in `src/styles/themes/index.ts`), the catalog theme-boot script (catalog pages always; site only when `mode` is not `"production"`), `noindex` (catalog always; site when `indexable` is false) and `robots.txt` (`Allow: /`, or `Disallow: /` when not indexable). New client theme: follow `DESIGN-SYSTEM.md`. Last review: `REVIEW.md`.

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

| name | 0   | 1   | 2   | 4   | 6   | 8   | 12  | 16  | 24  | 32  | 48  |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| px   | 0   | 4   | 8   | 16  | 24  | 32  | 48  | 64  | 96  | 128 | 192 |

Anything else (`p-5`, `gap-3`, `p-[13px]`) generates no CSS and fails silently in the browser, so `npm run lint` runs `scripts/check-tokens.mjs`, which fails on it. For a component token use `p-(--token)`.

The same check fails on raw color: arbitrary color in a class (`text-[#fff]`, `bg-[rgb(…)]`) and any hex/rgb/hsl/oklch literal outside `src/styles/themes/` and the token definitions (`--name: value`) in `base.css`. Use `--color-*` tokens.

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
- New ds components need registering in the catalog. The SPEC §8 table components are the studio base and enter directly; the 2-projects rule applies only to components outside that table.
- Acceptance (SPEC §10, mobile): LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, Lighthouse perf ≥ 85, initial JS ≤ 250KB gzip, 3D/Rive lazy-loaded when visible, AA contrast, visible focus, one `h1`, works 375–1920px.

## Agent workflow (SPEC §11)

Roles: Orchestrator, Foundation (`base.css` + `themes/` + ds components + motion presets; runs first), Section (one per section), Motion & 3D, Reviewer (technical), Critic (art direction). Sections and Motion start only after Foundation lands. Reviewer reports pass/fail and never fixes code itself. Each executor works in its own branch or worktree.

- Orchestrator = the main session, driven by `/orquestrar` (`.claude/commands/orquestrar.md`); it never edits code. Max 2 return loops per task; a third review means stop and ask the director.
- Executors, reviewer and critic = subagents in `.claude/agents/`: `fundacao`, `secao`, `motion`, `revisor`, `critico`. None has the `Agent` tool. Visual deliveries go `revisor` (PASSA) then `critico` (APROVADO/AJUSTES + 0–10 "studio" score); motion gets `review-animations`. Max 2 loops counts both. Round 7 adds an `impeccable polish`/`harden`/`clarify` pass by each owner before the director review.
- Aesthetic is locked by `DESIGN.md` (North Star "A Torra Lenta") and `PRODUCT.md`; code wins if they drift. Impeccable is restricted here to `critique`, `audit`, `harden`, `clarify`, `polish`, `document` (`.claude/settings.json` `Skill(args:…)` denies + `.claude/hooks/impeccable-guard.mjs` allowlist); its detector hooks are off (`.impeccable/config.json`). UI interaction animations stay under 300ms (`--dur-fast`); scene/scroll motion follows SPEC §5 tokens (`--dur-slow` 900ms, `--dur-scene` 1600ms) and is never shortened to fit that rule.
- File owners (SPEC §11 table): `fundacao` = `src/styles/`, `src/components/ds/`, `src/lib/`, `src/catalog/`, `src/index.css`, `site.config.ts`, `package.json`, `public/assets/`; `secao` = `src/components/sections/<Nome>.tsx` and `src/App.tsx` (only importing and ordering sections); `motion` = `src/lib/motion/` and motion parts of sections, asks `fundacao` for `ds/` changes; `revisor` and `critico` = nothing (screenshots go to a temp dir outside the repo). `src/Site.tsx`, `src/main.tsx`, `src/entry-server.tsx` and the rest belong to the director.
