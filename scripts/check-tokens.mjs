#!/usr/bin/env node
// Falha em valor visual cru fora dos tokens (SPEC §4: tokens são a única fonte).
// 1. Espaço: utilitário fora da escala do SPEC §4. O @theme zera o tema padrão
//    do Tailwind e deixa só a escala (nome × 4 = px). Um `p-5`/`gap-3` escrito
//    por hábito vira classe vazia sem erro nenhum; este check transforma isso
//    em erro de lint.
// 2. Cor: valor arbitrário de cor em className (`text-[#fff]`, `bg-[rgb(…)]`)
//    e literal hex/rgb/hsl/oklch fora de src/styles/themes/ e das definições
//    de token (`--nome: valor`) do base.css.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");
const BASE_CSS = join(SRC, "styles/base.css");
const THEMES = join(SRC, "styles/themes/");
// Os HTML de entrada (site e catálogo) também vão para o cliente (meta theme-color, estilo inline).
const ROOT_FILES = ["index.html", "catalogo/index.html", "catalogo/stress.html"].map((f) =>
  join(ROOT, f),
);

// --- Espaço ---------------------------------------------------------------

// Escala lida do próprio base.css: --spacing-<n>.
const scale = new Set(
  [...readFileSync(BASE_CSS, "utf8").matchAll(/--spacing-(\d+)\s*:/g)].map((m) => m[1]),
);

const UTILITIES = [
  "p",
  "px",
  "py",
  "ps",
  "pe",
  "pt",
  "pr",
  "pb",
  "pl",
  "m",
  "mx",
  "my",
  "ms",
  "me",
  "mt",
  "mr",
  "mb",
  "ml",
  "gap",
  "gap-x",
  "gap-y",
  "space-x",
  "space-y",
  "inset",
  "inset-x",
  "inset-y",
  "top",
  "right",
  "bottom",
  "left",
  "start",
  "end",
  "w",
  "h",
  "min-w",
  "min-h",
  "max-w",
  "max-h",
  "size",
  "basis",
  "indent",
  "translate-x",
  "translate-y",
  "scroll-m",
  "scroll-mx",
  "scroll-my",
  "scroll-mt",
  "scroll-mr",
  "scroll-mb",
  "scroll-ml",
  "scroll-p",
  "scroll-px",
  "scroll-py",
  "scroll-pt",
  "scroll-pr",
  "scroll-pb",
  "scroll-pl",
];

// variantes? !? -? utilitário-valor, onde valor é número ou [arbitrário].
// Frações (w-1/2) e tokens nomeados (max-w-measure, w-full) não entram.
const util = UTILITIES.sort((a, b) => b.length - a.length).join("|");
const SPACING = new RegExp(
  String.raw`(?<![\w-])(?:[\w-]+:)*!?-?(${util})-(\d+(?:\.\d+)?(?![\d./\w])|\[[^\]\s]*\])`,
  "g",
);

// --- Cor ------------------------------------------------------------------

// Literal de cor: #rgb, #rgba, #rrggbb, #rrggbbaa ou função de cor CSS.
const COLOR_LITERAL = String.raw`#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(`;
const COLOR = new RegExp(COLOR_LITERAL, "g");
// Utilitário com valor arbitrário que contém cor: text-[#fff], bg-[rgb(0_0_0)],
// fill-[color:#000], hover:border-[oklch(…)].
const ARBITRARY_COLOR = new RegExp(
  String.raw`(?<![\w-])(?:[\w-]+:)*!?[\w-]+-\[[^\]\s]*(?:${COLOR_LITERAL})[^\]\s]*\]`,
  "g",
);
// No base.css, cor crua só na definição de token: `--nome: valor;`.
const TOKEN_DEFINITION = /^\s*--[\w-]+\s*:/;

function colorAllowed(file, line) {
  if (file.startsWith(THEMES)) return true;
  return file === BASE_CSS && TOKEN_DEFINITION.test(line);
}

// --- Varredura ------------------------------------------------------------

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.(tsx?|css)$/.test(entry.name)) yield path;
  }
}

const errors = [];
const report = (file, i, match, reason) =>
  errors.push(`${relative(ROOT, file)}:${i + 1}  ${match}  ${reason}`);

for (const file of [...walk(SRC), ...ROOT_FILES]) {
  const isSrc = file.startsWith(SRC);
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (isSrc) {
        for (const m of line.matchAll(SPACING)) {
          const value = m[2];
          const reason = value.startsWith("[")
            ? "espaço arbitrário; use um token da escala"
            : !scale.has(value) && `${value} fora da escala (${[...scale].join(", ")})`;
          if (reason) report(file, i, m[0], reason);
        }
      }
      if (colorAllowed(file, line)) return;
      const arbitrary = [...line.matchAll(ARBITRARY_COLOR)];
      for (const m of arbitrary)
        report(file, i, m[0], "cor arbitrária em classe; use um token --color-*");
      // Literal solto (fora de classe arbitrária já reportada).
      const rest = arbitrary.reduce((acc, m) => acc.replace(m[0], ""), line);
      for (const m of rest.matchAll(COLOR)) {
        report(
          file,
          i,
          m[0],
          "cor crua fora de src/styles/themes/ e das definições de token do base.css",
        );
      }
    });
}

if (errors.length) {
  console.error(`check-tokens: ${errors.length} valor(es) fora dos tokens\n`);
  console.error(errors.join("\n"));
  console.error(
    "\nEspaço: nome × 4 = px (p-4 = 16px). Cor: só tokens --color-*, valores nos temas. Ver CLAUDE.md.",
  );
  process.exit(1);
}
console.log(`check-tokens: ok (escala ${[...scale].join(", ")}; cor só em tokens)`);
