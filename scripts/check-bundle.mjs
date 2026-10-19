#!/usr/bin/env node
// Orçamento de JS inicial (SPEC §10): falha o build se passar de 250 kB gzip.
// "Inicial" = o script de entrada (src= ou o import() que o vite.config.ts
// adia para depois do primeiro paint) e os <link rel="modulepreload"> do
// dist/index.html. Chunks carregados sob demanda (3D, Rive) ficam de fora.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const BUDGET_KB = 250;
const DIST = new URL("../dist", import.meta.url).pathname;

const html = readFileSync(join(DIST, "index.html"), "utf8");
const files = [
  ...html.matchAll(/<script[^>]+type="module"[^>]+src="([^"]+)"/g),
  ...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+)"/g),
  ...html.matchAll(/<script type="module">[^<]*import\("([^"]+)"\)/g),
].map((m) => m[1]);

if (files.length === 0) {
  console.error("check-bundle: nenhum JS inicial encontrado em dist/index.html");
  process.exit(1);
}

const kb = (bytes) => bytes / 1000;
let total = 0;
for (const file of files) {
  const size = gzipSync(readFileSync(join(DIST, file)), { level: 9 }).length;
  total += size;
  console.log(`  ${file}  ${kb(size).toFixed(2)} kB gzip`);
}

const line = `JS inicial: ${kb(total).toFixed(2)} kB gzip / orçamento ${BUDGET_KB} kB (${((kb(total) / BUDGET_KB) * 100).toFixed(0)}%)`;
if (kb(total) > BUDGET_KB) {
  console.error(`check-bundle: FALHOU. ${line}`);
  process.exit(1);
}
console.log(`check-bundle: ok. ${line}`);
