import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { SITE_THEME } from "./site.config.ts";
import { THEMES } from "./src/styles/themes/index.ts";

// Aplica o tema do site no <html> e, no build, faz preload só da fonte do
// hero desse tema, apontando para o arquivo com hash.
function siteTheme(): Plugin {
  const theme = THEMES.find((t) => t.id === SITE_THEME);
  if (!theme) throw new Error(`site.config.ts: tema "${SITE_THEME}" não existe em THEMES`);
  let base = "/";
  return {
    name: "site-theme",
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const out = html.replace("<html ", `<html data-theme="${theme.id}" `);
        if (!ctx.bundle) return out;
        const asset = Object.values(ctx.bundle).find(
          (o) => o.type === "asset" && o.originalFileNames.some((n) => n.endsWith(theme.heroFont)),
        );
        if (!asset) this.error(`site-theme: ${theme.heroFont} não está no bundle`);
        return {
          html: out,
          tags: [
            {
              tag: "link",
              attrs: { rel: "preload", href: base + asset.fileName, as: "font", type: "font/woff2", crossorigin: "" },
              injectTo: "head-prepend",
            },
          ],
        };
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteTheme()],
});
