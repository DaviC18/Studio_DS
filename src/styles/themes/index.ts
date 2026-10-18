// Temas disponíveis. Cada id tem um arquivo [id].css com [data-theme="id"].
export const THEMES = [
  { id: "torrefacao", label: "Torrefação" },
  { id: "neutro", label: "Neutro" },
] as const;

export type ThemeName = (typeof THEMES)[number]["id"];
