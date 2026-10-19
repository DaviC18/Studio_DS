// Escolha de tema do catálogo, aplicada antes do primeiro paint. Sem DOM nem
// React aqui: o vite.config.ts importa este arquivo e injeta o script inline
// no <head> das páginas pré-renderizadas.

export const THEME_STORAGE_KEY = "studio-ds:theme";

/**
 * Script inline: ?theme= (iframe do stress test) > escolha salva > data-theme
 * do build (site.config.ts). Muda só o atributo do <html>, que o React não
 * controla, então a hidratação não vê diferença.
 */
export function themeBootScript(ids: readonly string[]): string {
  return `(function(){var ids=${JSON.stringify(ids)},t=new URLSearchParams(location.search).get("theme");if(ids.indexOf(t)<0){try{t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){t=null}}if(ids.indexOf(t)>=0)document.documentElement.dataset.theme=t})()`;
}
