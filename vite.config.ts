import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { SITE_THEME } from "./site.config.ts";
import { themeBootScript } from "./src/catalog/theme-boot.ts";
import { THEMES } from "./src/styles/themes/index.ts";

// Aplica o tema do site no <html> e, no build, faz preload só da fonte do
// hero desse tema, apontando para o arquivo com hash. O script inline aplica
// antes do paint a escolha de tema do catálogo (theme-boot.ts).
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
        // Script logo depois do charset: roda antes de qualquer CSS ou paint.
        const charset = '<meta charset="UTF-8" />';
        if (!html.includes(charset)) this.error(`site-theme: ${charset} não encontrado`);
        const boot = `<script>${themeBootScript(THEMES.map((t) => t.id))}</script>`;
        const out = html
          .replace("<html ", `<html data-theme="${theme.id}" `)
          .replace(charset, `${charset}\n    ${boot}`);
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

// O HTML chega pré-renderizado e o hero entra só com CSS: o JS de entrada só
// hidrata. Ele é buscado depois do primeiro paint (rAF + setTimeout), então
// não disputa banda com HTML, CSS e fontes, que são o LCP.
function hydrateAfterFirstPaint(): Plugin {
  const entry = /<script type="module" crossorigin src="([^"]+)"><\/script>/;
  return {
    name: "hydrate-after-first-paint",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const match = html.match(entry);
        if (!match) this.error("hydrate-after-first-paint: script de entrada não encontrado");
        return html.replace(
          entry,
          `<script type="module">requestAnimationFrame(() => setTimeout(() => import("${match[1]}")))</script>`,
        );
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteTheme(), hydrateAfterFirstPaint()],
  build: {
    // Uma página por HTML; as duas são pré-renderizadas (scripts/prerender.mjs).
    rolldownOptions: {
      input: { index: "index.html", stress: "stress.html" },
    },
  },
  // Os plugins do GSAP (gsap/SplitText…) são ESM sem "type": "module": o Node
  // não os importa direto, então o build SSR os empacota.
  ssr: { noExternal: ["gsap", "@gsap/react"] },
});
