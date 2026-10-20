#!/usr/bin/env node
// Orçamento de JS inicial (SPEC §10): falha o build se alguma página passar de
// 250 kB gzip. "Inicial" = o script de entrada (src= ou o import() que o
// vite.config.ts adia para depois do primeiro paint) e os
// <link rel="modulepreload"> de cada HTML do dist (site e catálogo). Chunks
// carregados sob demanda (3D, Rive) ficam de fora.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const BUDGET_KB = 250;
const DIST = new URL("../dist", import.meta.url).pathname;

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

const kb = (bytes) => bytes / 1000;
let failed = false;

for (const page of htmlFiles(DIST)) {
  const name = relative(DIST, page);
  const html = readFileSync(page, "utf8");
  const files = [
    ...new Set(
      [
        ...html.matchAll(/<script[^>]+type="module"[^>]+src="([^"]+)"/g),
        ...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+)"/g),
        ...html.matchAll(/<script type="module">[^<]*import\("([^"]+)"\)/g),
      ].map((m) => m[1]),
    ),
  ];

  if (files.length === 0) {
    console.error(`check-bundle: nenhum JS inicial encontrado em dist/${name}`);
    failed = true;
    continue;
  }

  console.log(`dist/${name}`);
  let total = 0;
  for (const file of files) {
    const size = gzipSync(readFileSync(join(DIST, file)), { level: 9 }).length;
    total += size;
    console.log(`  ${file}  ${kb(size).toFixed(2)} kB gzip`);
  }

  const line = `JS inicial: ${kb(total).toFixed(2)} kB gzip / orçamento ${BUDGET_KB} kB (${((kb(total) / BUDGET_KB) * 100).toFixed(0)}%)`;
  if (kb(total) > BUDGET_KB) {
    console.error(`  FALHOU. ${line}`);
    failed = true;
  } else console.log(`  ok. ${line}`);
}

if (failed) {
  console.error("check-bundle: FALHOU");
  process.exit(1);
}
console.log("check-bundle: ok");
