import type { ReactNode } from "react";
import { Stack } from "../components/ds";
import { CodeBlock } from "./CodeBlock";

export type DocEntryProps = {
  name: string;
  /** "Use quando" / "não use quando", uma linha cada. */
  use: string;
  avoid: string;
  snippet: string;
  children: ReactNode;
};

/** Documentação de um componente: nome, quando usar, snippet, variações. */
export function DocEntry({ name, use, avoid, snippet, children }: DocEntryProps) {
  return (
    <article aria-labelledby={`doc-${name}`}>
      <Stack gap={8}>
        <Stack gap={4}>
          <h3 id={`doc-${name}`} className="type-h3">
            {name}
          </h3>
          <Stack as="dl" gap={2}>
            <div className="max-w-measure">
              <dt className="type-micro text-ink-muted">Use quando</dt>
              <dd>{use}</dd>
            </div>
            <div className="max-w-measure">
              <dt className="type-micro text-ink-muted">Não use quando</dt>
              <dd>{avoid}</dd>
            </div>
          </Stack>
          <CodeBlock code={snippet} label={`Exemplo de uso de ${name}`} />
        </Stack>
        {children}
      </Stack>
    </article>
  );
}

/** Rótulo de uma variação dentro do DocEntry. */
export function Variant({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack gap={4}>
      <p className="type-micro text-ink-muted">{label}</p>
      {children}
    </Stack>
  );
}
