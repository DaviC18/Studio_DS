// Hooks React dos presets. Cada um roda em useGSAP (cleanup automático) com
// gsap.matchMedia: ao mudar prefers-reduced-motion, o preset é revertido e
// recriado na variante certa.
import type { RefObject } from "react";
import { gsap, MOTION_QUERIES, useGSAP } from "./gsap";
import {
  countReset,
  countUp,
  mask,
  reveal,
  revealLines,
  revealWords,
  staggerChildren,
  type CountOptions,
  type PresetOptions,
} from "./presets";

export type Preset = (el: HTMLElement, opts: PresetOptions & { reduce: boolean }) => unknown;

/** Roda qualquer preset com useGSAP + matchMedia. As opções são lidas na montagem. */
export function useMotionPreset(
  ref: RefObject<HTMLElement | null>,
  preset: Preset,
  options: PresetOptions,
) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES, (context) => {
        preset(el, { ...options, reduce: Boolean(context.conditions?.reduce) });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
}

export function useReveal(ref: RefObject<HTMLElement | null>, options: PresetOptions = {}) {
  useMotionPreset(ref, reveal, options);
}

export function useRevealLines(ref: RefObject<HTMLElement | null>, options: PresetOptions = {}) {
  useMotionPreset(ref, revealLines, options);
}

export function useRevealWords(ref: RefObject<HTMLElement | null>, options: PresetOptions = {}) {
  useMotionPreset(ref, revealWords, options);
}

export function useMask(ref: RefObject<HTMLElement | null>, options: PresetOptions = {}) {
  useMotionPreset(ref, mask, options);
}

export function useStagger(ref: RefObject<HTMLElement | null>, options: PresetOptions = {}) {
  useMotionPreset(ref, staggerChildren, options);
}

/**
 * Contagem do StatCounter. `ref` é o gatilho e o que faz fade no reduce; o
 * texto que conta é o filho [data-count-value] (ou o próprio elemento) e vem
 * do render com o valor final. Ao reverter (unmount, troca de reduced-motion,
 * novo `to`) ele volta ao valor final, nunca fica preso num passo da contagem.
 * `format` deve ser estável (função de módulo ou useCallback), senão a
 * contagem reinicia.
 */
export function useCountUp(ref: RefObject<HTMLElement | null>, options: CountOptions) {
  const { to, format, scroll, start, duration } = options;
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES, (context) => {
        countUp(el, {
          to,
          format,
          scroll,
          start,
          duration,
          reduce: Boolean(context.conditions?.reduce),
        });
        return () => countReset(el, { to, format });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [to, format, scroll, start, duration], revertOnUpdate: true },
  );
}
