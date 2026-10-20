import { useCallback, useEffect, useRef } from "react";
import { cx } from "../../lib/cx";
import { isEmptyText } from "../../lib/dev";
import { useCountUp } from "../../lib/motion";
import { formatNumber } from "../../lib/number";

export type StatCounterProps = {
  /** Valor final. Formato pt-BR com separador de milhar (12.000) e vírgula decimal (4,8). */
  value: number;
  /** Casas decimais, fixas durante a contagem e no valor final. Padrão 0. */
  decimals?: number;
  /** Antes do número, sem espaço automático: "R$ " → "R$ 1.200". */
  prefix?: string;
  /** Depois do número, sem espaço automático: "%" → "45%", " anos" → "12 anos". */
  suffix?: string;
  /** Legenda embaixo do número. Obrigatória. */
  label: string;
  size?: "h2" | "display";
};

const SIZE = { h2: "type-h2", display: "type-display" } as const;

/**
 * Número que conta ao entrar na viewport (SPEC §8), --dur-slow, --ease-out.
 * O HTML pré-renderizado já mostra o valor final; o JS só zera e conta depois
 * de rodar. O leitor de tela lê a cópia sr-only (valor final) e a legenda;
 * a parte que conta fica aria-hidden. A largura do valor final é reservada
 * por uma cópia invisível na mesma célula do grid: contar não mexe no layout
 * (com tabular-nums, nenhum passo da contagem é mais largo que o final).
 * Reduced-motion: sem contagem; prefixo, número e sufixo fazem fade juntos.
 */
export function StatCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  label,
  size = "h2",
}: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = useCallback((n: number) => formatNumber(n, decimals), [decimals]);
  const final = format(value);
  useCountUp(ref, { to: value, format });

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (isEmptyText(label)) {
      console.error(`StatCounter: label vazio (value=${value}). O número fica sem contexto.`);
    }
    if (value < 0) {
      console.error(`StatCounter: value negativo (${value}). O StatCounter espera valor >= 0.`);
    }
  }, [label, value]);

  return (
    <div>
      <p className={cx(SIZE[size], "tabular-nums")}>
        <span className="sr-only">{`${prefix}${final}${suffix}`}</span>
        <span ref={ref} aria-hidden="true">
          {prefix}
          <span className="inline-grid text-end">
            <span className="invisible col-start-1 row-start-1">{final}</span>
            <span data-count-value className="col-start-1 row-start-1">
              {final}
            </span>
          </span>
          {suffix}
        </span>
      </p>
      <p className="mt-2 type-micro text-ink-muted">{label}</p>
    </div>
  );
}
