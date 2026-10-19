#!/usr/bin/env node
// Pré-render (SPEC §10, LCP): injeta o HTML do React em cada página do dist.
// Roda depois de `vite build` (cliente) e `vite build --ssr` (dist-ssr/). O
// cliente hidrata esse HTML com hydrateRoot (src/main.tsx).
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const DIST = join(ROOT, "dist");
const SSR = join(ROOT, "dist-ssr");

const { render } = await import(join(SSR, "entry-server.js"));

for (const [file, page] of [
  ["index.html", "catalog"],
  ["stress.html", "stress"],
]) {
  const path = join(DIST, file);
  const html = readFileSync(path, "utf8");
  const slot = `<div id="root" data-page="${page}"></div>`;
  if (!html.includes(slot)) {
    console.error(`prerender: ${slot} não encontrado em dist/${file}`);
    process.exit(1);
  }
  const body = render(page);
  writeFileSync(path, html.replace(slot, `<div id="root" data-page="${page}">${body}</div>`));
  console.log(`prerender: dist/${file} (${(body.length / 1000).toFixed(1)} kB de HTML)`);
}

rmSync(SSR, { recursive: true, force: true });
