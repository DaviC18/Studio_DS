// Lê os tokens de motion do CSS (src/styles/base.css). Nenhum valor de curva
// ou duração existe em JS: o CSS é a única fonte.
import { CustomEase } from "./gsap";

export type EaseToken = "out" | "in-out" | "snap";
export type DurationToken = "fast" | "base" | "slow" | "scene";

const root = () => document.documentElement;

function cssVar(name: string, el: Element = root()): string {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

function parseTime(value: string): number {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return 0;
  return value.endsWith("ms") ? n / 1000 : n;
}

/** Nome de um CustomEase criado a partir de --ease-{token}. */
export function ease(token: EaseToken): string {
  const name = `ds-${token}`;
  if (!CustomEase.get(name)) {
    const bezier = cssVar(`--ease-${token}`).match(/cubic-bezier\(([^)]+)\)/);
    if (!bezier) throw new Error(`--ease-${token} não é cubic-bezier()`);
    CustomEase.create(name, bezier[1].replace(/\s+/g, ""));
  }
  return name;
}

/**
 * --dur-{token} em segundos. Lido no elemento (o tema pode mudar
 * --dur-scene) e, com `scaled`, multiplicado por --motion-scale (0.7 no mobile).
 */
export function duration(
  token: DurationToken,
  el: Element = root(),
  { scaled = true } = {},
): number {
  const seconds = parseTime(cssVar(`--dur-${token}`, el));
  return scaled ? seconds * motionScale(el) : seconds;
}

/** --stagger em segundos, com --motion-scale. */
export function stagger(el: Element = root()): number {
  return parseTime(cssVar("--stagger", el)) * motionScale(el);
}

export function motionScale(el: Element = root()): number {
  const n = parseFloat(cssVar("--motion-scale", el));
  return Number.isNaN(n) ? 1 : n;
}

/** --reveal-distance em px (24px no desktop, ~17px no mobile, 0 em reduce). */
export function revealDistance(el: Element = root()): number {
  return parseFloat(cssVar("--reveal-distance", el)) || 0;
}

/** Folga da máscara de linha em px, resolvida no tamanho de fonte do elemento. */
export function maskBleed(el: Element): { top: number; bottom: number } {
  const fontSize = parseFloat(getComputedStyle(el).fontSize);
  const em = (name: string) => parseFloat(cssVar(name, el)) * fontSize || 0;
  return { top: em("--mask-bleed-top"), bottom: em("--mask-bleed-bottom") };
}
