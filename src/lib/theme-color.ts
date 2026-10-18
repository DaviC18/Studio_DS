/** <meta name="theme-color"> = --color-bg do tema aplicado no <html>. */
export function syncThemeColor() {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim();
}
