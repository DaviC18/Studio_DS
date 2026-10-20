import type { ReactNode } from "react";

/**
 * Página do site (raiz, tema de site.config.ts). Só a casca: link para pular
 * para o conteúdo e o <main>. As seções chegam como children, em ordem, pelo
 * src/App.tsx.
 */
export function Site({ children }: { children?: ReactNode }) {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-10 rounded-base bg-bg px-4 py-2 type-button focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Pular para o conteúdo
      </a>
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
