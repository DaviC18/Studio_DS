#!/usr/bin/env node
// Falha se algum utilitário de espaço usar valor fora da escala do SPEC §4.
// Motivo: o @theme zera o tema padrão do Tailwind e deixa só a escala do SPEC
// (nome × 4 = px, como no Tailwind). Um `p-5`/`gap-3` escrito por hábito vira
// classe vazia sem erro nenhum; este check transforma isso em erro de lint.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");
const BASE_CSS = join(SRC, "styles/base.css");

// Escala lida do próprio base.css: --spacing-<n>.
const scale = new Set(
  [...readFileSync(BASE_CSS, "utf8").matchAll(/--spacing-(\d+)\s*:/g)].map((m) => m[1]),
);

const UTILITIES = [
  "p", "px", "py", "ps", "pe", "pt", "pr", "pb", "pl",
  "m", "mx", "my", "ms", "me", "mt", "mr", "mb", "ml",
  "gap", "gap-x", "gap-y", "space-x", "space-y",
  "inset", "inset-x", "inset-y", "top", "right", "bottom", "left", "start", "end",
  "w", "h", "min-w", "min-h", "max-w", "max-h", "size", "basis", "indent",
  "translate-x", "translate-y",
  "scroll-m", "scroll-mx", "scroll-my", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml",
  "scroll-p", "scroll-px", "scroll-py", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl",
];

// variantes? !? -? utilitário-valor, onde valor é número ou [arbitrário].
// Frações (w-1/2) e tokens nomeados (max-w-measure, w-full) não entram.
const util = UTILITIES.sort((a, b) => b.length - a.length).join("|");
const PATTERN = new RegExp(
  String.raw`(?<![\w-])(?:[\w-]+:)*!?-?(${util})-(\d+(?:\.\d+)?(?![\d./\w])|\[[^\]\s]*\])`,
  "g",
);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.(tsx?|css)$/.test(entry.name)) yield path;
  }
}

const errors = [];
for (const file of walk(SRC)) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      for (const m of line.matchAll(PATTERN)) {
        const value = m[2];
        const reason = value.startsWith("[")
          ? "valor arbitrário; use um token da escala"
          : !scale.has(value) && `${value} fora da escala (${[...scale].join(", ")})`;
        if (reason) errors.push(`${relative(ROOT, file)}:${i + 1}  ${m[0]}  ${reason}`);
      }
    });
}

if (errors.length) {
  console.error(`check-spacing: ${errors.length} utilitário(s) de espaço inválido(s)\n`);
  console.error(errors.join("\n"));
  console.error("\nEscala: nome × 4 = px (p-4 = 16px). Ver CLAUDE.md.");
  process.exit(1);
}
console.log(`check-spacing: ok (escala ${[...scale].join(", ")})`);
