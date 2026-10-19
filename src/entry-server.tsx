import { renderToString } from "react-dom/server";
import App, { type Page } from "./App";

/** HTML da página para o prerender do build (scripts/prerender.mjs). */
export function render(page: Page): string {
  return renderToString(<App page={page} />);
}
