import { useSyncExternalStore } from "react";
import { SITE } from "../../site.config";
import { syncThemeColor } from "../lib/theme-color";
import { THEMES, type ThemeName } from "../styles/themes";
import { THEME_STORAGE_KEY } from "./theme-boot";

// Fonte da verdade: o data-theme do <html>. O script inline do <head>
// (theme-boot.ts) já aplicou ?theme= ou a escolha salva antes do paint.

const listeners = new Set<() => void>();

function isTheme(value: string | null | undefined): value is ThemeName {
  return THEMES.some((t) => t.id === value);
}

function currentTheme(): ThemeName {
  const t = document.documentElement.dataset.theme;
  return isTheme(t) ? t : SITE.theme;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Tema aplicado. No servidor e na hidratação vale SITE.theme (o mesmo HTML do
 * build); logo depois o React re-renderiza com o tema do <html>, sem mismatch.
 */
export function useTheme(): ThemeName {
  return useSyncExternalStore(subscribe, currentTheme, () => SITE.theme);
}

export function applyTheme(theme: ThemeName) {
  document.documentElement.dataset.theme = theme;
  syncThemeColor();
  listeners.forEach((l) => l());
  // URL reflete o estado: o link compartilhado abre no mesmo tema.
  const url = new URL(location.href);
  url.searchParams.set("theme", theme);
  history.replaceState(null, "", url);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // storage bloqueado: a troca vale só nesta visita
  }
}
