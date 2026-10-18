import { createElement, useRef } from "react";
import { cx } from "../../lib/cx";
import { revealLines, revealWords, useMotionPreset } from "../../lib/motion";

export type RevealTextProps = {
  children: string;
  as?: "p" | "h2" | "h3" | "blockquote";
  /** Unidade revelada (SPEC §8). */
  by?: "line" | "word";
  size?: "body" | "h3" | "h2";
  tone?: "ink" | "muted";
};

const SIZE = {
  body: "type-body max-w-measure",
  h3: "type-h3",
  h2: "type-h2",
} as const;

const TONE = { ink: "text-ink", muted: "text-ink-muted" } as const;

/**
 * Texto revelado no scroll, --dur-slow, --ease-out.
 * O SplitText quebra o texto em várias peças; para o leitor de tela ler uma
 * vez só, a cópia dividida fica aria-hidden e uma cópia sr-only carrega o texto.
 */
export function RevealText({
  children,
  as = "p",
  by = "line",
  size = "body",
  tone = "ink",
}: RevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useMotionPreset(ref, by === "word" ? revealWords : revealLines, { duration: "slow" });

  return createElement(
    as,
    { className: cx(SIZE[size], TONE[tone]) },
    <span className="sr-only">{children}</span>,
    <span ref={ref} aria-hidden="true" className="block">
      {children}
    </span>,
  );
}
