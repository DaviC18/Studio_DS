// Presets de motion (SPEC §5). Chame dentro de um contexto GSAP (useGSAP /
// gsap.matchMedia) para o cleanup reverter tweens, ScrollTriggers e splits.
// Com `reduce`, todo preset vira um fade de --dur-fast: sem translate, sem
// split, sem scrub. O estado final é sempre o elemento visível.
import { COUNT_FROM, DEFAULT_ONCE, DEFAULT_START, MASK_ZOOM } from "./config";
import { gsap, SplitText } from "./gsap";
import {
  duration,
  ease,
  maskBleed,
  revealDistance,
  stagger,
  type DurationToken,
} from "./tokens";

export type PresetOptions = {
  /** false = toca ao montar, sem ScrollTrigger (ex.: hero). */
  scroll?: boolean;
  /** start do ScrollTrigger. */
  start?: string;
  duration?: DurationToken;
};

type RunOptions = PresetOptions & { reduce: boolean };

function scrollTrigger(trigger: Element, { scroll = true, start }: PresetOptions) {
  return scroll
    ? { trigger, start: start ?? DEFAULT_START, once: DEFAULT_ONCE }
    : undefined;
}

function fade(targets: Element | Element[], trigger: Element, opts: PresetOptions) {
  return gsap.from(targets, {
    opacity: 0,
    duration: duration("fast", trigger, { scaled: false }),
    ease: ease("out"),
    scrollTrigger: scrollTrigger(trigger, opts),
  });
}

/** Revelação simples: fade + --reveal-distance de baixo para cima. */
export function reveal(el: HTMLElement, opts: RunOptions) {
  if (opts.reduce) return fade(el, el, opts);
  return gsap.from(el, {
    opacity: 0,
    y: revealDistance(el),
    duration: duration(opts.duration ?? "base", el),
    ease: ease("out"),
    scrollTrigger: scrollTrigger(el, opts),
  });
}

// Sobe peças (linhas ou palavras) de dentro das máscaras, em stagger. Cada
// peça parte da própria altura + folgas: o acento nunca aparece antes.
function riseFromMask(pieces: Element[], el: HTMLElement, opts: RunOptions) {
  // Texto vazio: nada para animar (evita o aviso "GSAP target not found").
  if (pieces.length === 0) return;
  return gsap.from(pieces, {
    y: (_i: number, piece: HTMLElement) => {
      const bleed = maskBleed(piece);
      return piece.offsetHeight + bleed.top + bleed.bottom;
    },
    duration: duration(opts.duration ?? "slow", el),
    ease: ease("out"),
    stagger: stagger(el),
    scrollTrigger: scrollTrigger(el, opts),
  });
}

// SplitText com máscara. aria "none": o componente já esconde o texto
// dividido (aria-hidden) e expõe uma cópia sr-only, porque aria-label não vale
// em <p>. autoSplit re-divide no resize e no carregamento de fonte.
function splitAndRise(el: HTMLElement, opts: RunOptions, unit: "lines" | "words") {
  return SplitText.create(el, {
    type: unit,
    mask: unit,
    linesClass: "ds-line",
    wordsClass: "ds-word",
    aria: "none",
    autoSplit: true,
    onSplit(self) {
      return riseFromMask(self[unit], el, opts);
    },
  });
}

/**
 * Linhas sobem de dentro de uma máscara (.ds-line-mask, com folga para
 * acentos). Se o elemento já tiver linhas explícitas ([data-line] dentro de
 * .mask-line), usa essas; senão divide com SplitText.
 */
export function revealLines(el: HTMLElement, opts: RunOptions) {
  if (opts.reduce) return fade(el, el, opts);
  const explicit = Array.from(el.querySelectorAll("[data-line]"));
  if (explicit.length) return riseFromMask(explicit, el, opts);
  return splitAndRise(el, opts, "lines");
}

/** Como revealLines, por palavra (.ds-word-mask). */
export function revealWords(el: HTMLElement, opts: RunOptions) {
  if (opts.reduce) return fade(el, el, opts);
  return splitAndRise(el, opts, "words");
}

/**
 * Máscara que abre + leve zoom. Estrutura esperada:
 * frame (overflow: clip) > cortina > mídia.
 * A cortina sobe enquanto a mídia contra-desloca, então a imagem parece
 * parada e só a borda da máscara se move.
 */
export function mask(frame: HTMLElement, opts: RunOptions) {
  if (opts.reduce) return fade(frame, frame, opts);
  const curtain = frame.firstElementChild;
  const media = curtain?.firstElementChild;
  if (!curtain || !media) {
    throw new Error("mask: esperado frame > cortina > mídia");
  }
  return gsap
    .timeline({
      scrollTrigger: scrollTrigger(frame, opts),
      defaults: {
        duration: duration(opts.duration ?? "slow", frame),
        ease: ease("out"),
      },
    })
    .from(curtain, { yPercent: 100 })
    .from(media, { yPercent: -100, scale: MASK_ZOOM }, "<");
}

/** Filhos diretos revelados em sequência, com --stagger entre eles. */
export function staggerChildren(container: HTMLElement, opts: RunOptions) {
  const items = Array.from(container.children);
  if (opts.reduce) return fade(items, container, opts);
  return gsap.from(items, {
    opacity: 0,
    y: revealDistance(container),
    duration: duration(opts.duration ?? "base", container),
    ease: ease("out"),
    stagger: stagger(container),
    scrollTrigger: scrollTrigger(container, opts),
  });
}

export type CountOptions = PresetOptions & {
  /** Valor final; é o que o HTML pré-renderizado já mostra. */
  to: number;
  /** Formata o valor a cada quadro (inclusive arredondamento/decimais). */
  format: (n: number) => string;
};

/** Nó cujo texto conta: o filho [data-count-value] de `el`, ou o próprio `el`. */
function countTarget(el: HTMLElement): HTMLElement {
  return el.querySelector<HTMLElement>("[data-count-value]") ?? el;
}

/**
 * Conta de COUNT_FROM até `to` ao entrar na viewport (--dur-slow, --ease-out,
 * × --motion-scale). `el` é o gatilho e o que faz fade no reduce (ex.: prefixo
 * + número + sufixo); o texto que conta é o filho [data-count-value], ou o
 * próprio `el`. A largura do valor final deve estar reservada pelo componente.
 * Só zera quando o JS já rodou (§5.11). Reduce: sem contagem, valor final com
 * fade de --dur-fast.
 */
export function countUp(el: HTMLElement, opts: CountOptions & { reduce: boolean }) {
  if (opts.reduce) return fade(el, el, opts);
  const { to, format } = opts;
  const target = countTarget(el);
  const state = { n: COUNT_FROM };
  target.textContent = format(COUNT_FROM);
  return gsap.to(state, {
    n: to,
    duration: duration(opts.duration ?? "slow", el),
    ease: ease("out"),
    scrollTrigger: scrollTrigger(el, opts),
    onUpdate: () => {
      target.textContent = format(state.n);
    },
  });
}

/** Volta o texto que conta ao valor final (cleanup do countUp). */
export function countReset(el: HTMLElement, { to, format }: CountOptions) {
  countTarget(el).textContent = format(to);
}
