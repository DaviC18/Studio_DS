import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { SITE } from "./site.config.ts";
import { themeBootScript } from "./src/catalog/theme-boot.ts";
import { THEMES } from "./src/styles/themes/index.ts";

// Páginas: o data-page do #root diz qual árvore o React monta (src/App.tsx).
// site = raiz; catalog e stress = /catalogo/, ferramenta interna (noindex).
const PAGE = /<div id="root" data-page="(site|catalog|stress)">/;

// Aplica o tema do site (site.config.ts) no <html> de toda página e, no build,
// faz preload só da fonte do hero desse tema, apontando para o arquivo com
// hash. O script inline (theme-boot.ts) aplica antes do paint a escolha de
// tema do catálogo; no site só entra fora do modo production. O noindex do
// site sai de SITE.indexable; o do catálogo está escrito no próprio HTML.
function siteTheme(): Plugin {
  const theme = THEMES.find((t) => t.id === SITE.theme);
  if (!theme) throw new Error(`site.config.ts: tema "${SITE.theme}" não existe em THEMES`);
  let base = "/";
  return {
    name: "site-theme",
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const page = html.match(PAGE)?.[1];
        if (!page) this.error(`site-theme: #root com data-page não encontrado em ${ctx.path}`);
        const isSite = page === "site";
        // Script logo depois do charset: roda antes de qualquer CSS ou paint.
        const charset = '<meta charset="UTF-8" />';
        if (!html.includes(charset)) this.error(`site-theme: ${charset} não encontrado`);
        const head = [
          !isSite || SITE.mode !== "production"
            ? `<script>${themeBootScript(THEMES.map((t) => t.id))}</script>`
            : "",
          isSite && !SITE.indexable ? '<meta name="robots" content="noindex" />' : "",
        ].filter(Boolean);
        let out = html.replace("<html ", `<html data-theme="${theme.id}" `);
        if (head.length) out = out.replace(charset, [charset, ...head].join("\n    "));
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
              attrs: {
                rel: "preload",
                href: base + asset.fileName,
                as: "font",
                type: "font/woff2",
                crossorigin: "",
              },
              injectTo: "head-prepend",
            },
          ],
        };
      },
    },
  };
}

// robots.txt gerado de SITE.indexable: indexável libera tudo; senão bloqueia
// tudo. Servido no dev e emitido no build.
function robotsTxt(): Plugin {
  // Indexável: o robots.txt não bloqueia nada, para o robô ler o noindex do
  // catálogo e do stress (é só ele que os tira do índice). Não indexável:
  // bloqueia tudo, e o site também leva noindex.
  const body = SITE.indexable ? "User-agent: *\nAllow: /\n" : "User-agent: *\nDisallow: /\n";
  return {
    name: "robots-txt",
    configureServer(server) {
      server.middlewares.use("/robots.txt", (_req, res) => {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end(body);
      });
    },
    generateBundle() {
      if (this.environment.name !== "client") return;
      this.emitFile({ type: "asset", fileName: "robots.txt", source: body });
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
  plugins: [react(), tailwindcss(), siteTheme(), robotsTxt(), hydrateAfterFirstPaint()],
  build: {
    // Uma página por HTML; as três são pré-renderizadas (scripts/prerender.mjs).
    rolldownOptions: {
      input: {
        index: "index.html",
        catalogo: "catalogo/index.html",
        stress: "catalogo/stress.html",
      },
    },
  },
  // Os plugins do GSAP (gsap/SplitText…) são ESM sem "type": "module": o Node
  // não os importa direto, então o build SSR os empacota.
  ssr: { noExternal: ["gsap", "@gsap/react"] },
});
