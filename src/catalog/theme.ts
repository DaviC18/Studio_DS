import { syncThemeColor } from "../lib/theme-color";
import { THEMES, type ThemeName } from "../styles/themes";

const KEY = "studio-ds:theme";

function isTheme(value: string | null): value is ThemeName {
  return THEMES.some((t) => t.id === value);
}

/** ?theme= (iframe do stress test) > escolha salva > tema do index.html. */
export function initialTheme(): ThemeName {
  const fromUrl = new URLSearchParams(location.search).get("theme");
  if (isTheme(fromUrl)) return fromUrl;
  try {
    const saved = localStorage.getItem(KEY);
    if (isTheme(saved)) return saved;
  } catch {
    // storage bloqueado: segue com o padrão
  }
  const current = document.documentElement.dataset.theme ?? null;
  return isTheme(current) ? current : THEMES[0].id;
}

export function applyTheme(theme: ThemeName, persist = false) {
  document.documentElement.dataset.theme = theme;
  syncThemeColor();
  if (!persist) return;
  // URL reflete o estado: o link compartilhado abre no mesmo tema.
  const url = new URL(location.href);
  url.searchParams.set("theme", theme);
  history.replaceState(null, "", url);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // storage bloqueado: a troca vale só nesta visita
  }
}
