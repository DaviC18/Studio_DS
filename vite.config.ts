import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

// Fonte display do hero do tema ativo. Trocar junto com o tema.
const HERO_FONT = "big-shoulders-display-latin-wght-normal.woff2";

// Preload só da fonte do hero, apontando para o arquivo com hash do build.
function preloadHeroFont(file: string): Plugin {
  let base = "/";
  return {
    name: "preload-hero-font",
    apply: "build",
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        const asset = Object.values(ctx.bundle ?? {}).find(
          (out) =>
            out.type === "asset" &&
            out.originalFileNames.some((name) => name.endsWith(file)),
        );
        if (!asset) {
          this.error(`preload-hero-font: ${file} não está no bundle`);
        }
        return [
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
        ];
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadHeroFont(HERO_FONT)],
});
