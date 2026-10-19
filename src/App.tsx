import { StrictMode } from "react";
import { Catalog } from "./catalog/Catalog";
import { StressView } from "./catalog/StressView";
import { MotionProvider } from "./lib/motion";

/** Uma página por HTML: index.html (catálogo) e stress.html (iframe de 375px). */
export type Page = "catalog" | "stress";

/** Árvore inteira, igual no servidor (prerender) e no cliente (hidratação). */
function App({ page }: { page: Page }) {
  return (
    <StrictMode>
      <MotionProvider>{page === "stress" ? <StressView /> : <Catalog />}</MotionProvider>
    </StrictMode>
  );
}

export default App;
