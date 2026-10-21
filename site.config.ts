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
  /**
   * Número do WhatsApp do CTA principal, com código do país. Vira link wa.me em
   * src/lib/whatsapp.ts, que usa só os dígitos — separadores são livres.
   *
   * É o único dado fictício do site (Spec Golden Grains §2): num cliente real,
   * trocar este campo é a única mudança de dado necessária.
   */
  readonly whatsapp: string;
};

export const SITE: SiteConfig = {
  theme: "torrefacao",
  mode: "production",
  indexable: true,
  // Placeholder fictício: prefixo 5511 (Brasil, São Paulo) e número 90000-0000,
  // que não existe. Trocar pelo número real do cliente antes de publicar.
  whatsapp: "+55 11 90000-0000",
};
