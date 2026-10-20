// Configuração do site: único lugar. Dela saem, no vite.config.ts, o
// data-theme do <html>, o preload da fonte do hero, o script de troca de tema,
// o noindex do site e o robots.txt.
import type { ThemeName } from "./src/styles/themes/index.ts";

/**
 * production: tema fixo no <html>, sem script de troca de tema.
 * preview: o site aceita ?theme= e a escolha salva, como o catálogo.
 */
export type SiteMode = "production" | "preview";

export type SiteConfig = {
  readonly theme: ThemeName;
  readonly mode: SiteMode;
  /** false: <meta name="robots" content="noindex"> no site e robots.txt com Disallow: /. */
  readonly indexable: boolean;
};

export const SITE: SiteConfig = {
  theme: "torrefacao",
  mode: "production",
  indexable: true,
};
