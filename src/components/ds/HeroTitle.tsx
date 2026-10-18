import { Fragment, useEffect, useRef } from "react";
import { useRevealLines } from "../../lib/motion";

export type HeroTitleLines =
  | readonly [string]
  | readonly [string, string]
  | readonly [string, string, string];

export type HeroTitleProps = {
  /** 1 a 3 linhas (SPEC §8). Cada uma tem a própria máscara. */
  lines: HeroTitleLines;
  /** Só um h1 por página: use "h2" ou "p" nos outros. */
  as?: "h1" | "h2" | "p";
  /** "load" toca ao montar (hero); "scroll" ao entrar na viewport. */
  play?: "load" | "scroll";
};

/** Título gigante; linhas sobem em stagger com --dur-scene. */
export function HeroTitle({ lines, as = "h1", play = "load" }: HeroTitleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useRevealLines(ref, { scroll: play === "scroll", duration: "scene" });

  useEffect(() => {
    if (import.meta.env.DEV && as === "h1" && document.querySelectorAll("h1").length > 1) {
      console.warn("HeroTitle: mais de um <h1> na página. Use as=\"h2\" ou \"p\".");
    }
  }, [as]);

  const Tag = as;
  // Linhas são texto real (sem aria-hidden): o leitor lê uma vez, com espaço
  // entre elas.
  return (
    <Tag className="type-display">
      <span ref={ref} className="block">
        {lines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="mask-line">
              <span data-line className="block">
                {line}
              </span>
            </span>
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
