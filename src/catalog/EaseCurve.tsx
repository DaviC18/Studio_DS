import type { EaseToken } from "../lib/motion";
import { bezier } from "./css";

/** Curva do token desenhada + barra que enche com ela. */
export function EaseCurve({ name }: { name: EaseToken }) {
  const [x1, y1, x2, y2] = bezier(`--ease-${name}`);
  const p = (v: number) => (v * 100).toFixed(1);
  const q = (v: number) => (100 - v * 100).toFixed(1);
  return (
    <figure className="flex w-48 max-w-full flex-col gap-2">
      <svg viewBox="-4 -4 108 108" className="size-24 overflow-visible" aria-hidden="true">
        <path d="M0 100 L100 0" className="fill-none stroke-line [stroke-width:var(--line-width)]" vectorEffect="non-scaling-stroke" />
        <path
          d={`M0 100 C${p(x1)} ${q(y1)} ${p(x2)} ${q(y2)} 100 0`}
          className="fill-none stroke-ink [stroke-width:var(--focus-ring-width)]"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="h-2 overflow-clip rounded-full bg-surface" aria-hidden="true">
        <div data-ease={name} className="catalog-ease-bar size-full bg-ink-muted" />
      </div>
      <figcaption className="type-micro text-ink-muted">
        --ease-{name}: {x1}, {y1}, {x2}, {y2}
      </figcaption>
    </figure>
  );
}
