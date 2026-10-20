// Temas disponíveis. Cada id tem um arquivo [id].css com [data-theme="id"].
// heroFont: arquivo woff2 (do @fontsource-variable) da fonte display do hero,
// pré-carregado no build quando o tema é o do site (site.config.ts).
export const THEMES = [
  {
    id: "torrefacao",
    label: "Torrefação",
    heroFont: "big-shoulders-display-latin-wght-normal.woff2",
  },
  { id: "neutro", label: "Neutro", heroFont: "inter-tight-latin-wght-normal.woff2" },
] as const;

export type ThemeName = (typeof THEMES)[number]["id"];
