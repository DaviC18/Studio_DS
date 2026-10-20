// Leitura de tokens já resolvidos para mostrar no catálogo.
export function token(name: string, el: Element = document.documentElement): string {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

function toRgb(color: string): [number, number, number] {
  const probe = document.createElement("span");
  probe.style.color = color;
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe)
    .color.match(/[\d.]+/g)!
    .slice(0, 3)
    .map(Number);
  probe.remove();
  return [rgb[0], rgb[1], rgb[2]];
}

export function toHex(color: string): string {
  return (
    "#" +
    toRgb(color)
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

function luminance(color: string): number {
  const [r, g, b] = toRgb(color).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contraste WCAG entre duas cores CSS. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Pontos de controle de um cubic-bezier() lido de um token. */
export function bezier(name: string): [number, number, number, number] {
  const nums = token(name)
    .match(/-?[\d.]+/g)
    ?.map(Number) ?? [0, 0, 1, 1];
  return [nums[0], nums[1], nums[2], nums[3]];
}
