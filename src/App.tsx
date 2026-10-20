import { StrictMode } from "react";
import { Catalog } from "./catalog/Catalog";
import { StressView } from "./catalog/StressView";
import { MotionProvider } from "./lib/motion";
import { Site } from "./Site";

/**
 * Uma página por HTML: index.html (site, raiz), catalogo/index.html (catálogo)
 * e catalogo/stress.html (iframe de 375px).
 */
export type Page = "site" | "catalog" | "stress";

/** Árvore inteira, igual no servidor (prerender) e no cliente (hidratação). */
function App({ page }: { page: Page }) {
  return (
    <StrictMode>
      <MotionProvider>
        {page === "site" && (
          <Site>
            {/* Seções do site em ordem (Spec do site §3): importar e ordenar aqui. */}
          </Site>
        )}
        {page === "catalog" && <Catalog />}
        {page === "stress" && <StressView />}
      </MotionProvider>
    </StrictMode>
  );
}

export default App;
