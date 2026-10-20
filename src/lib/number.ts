// Formato de número do site: pt-BR, separador de milhar, casas decimais fixas.
// Mesmo resultado no servidor (prerender) e no browser: sem hydration mismatch.
const FORMATS = new Map<number, Intl.NumberFormat>();

/**
 * 12000 → "12.000"; (4.8, 1) → "4,8". Sempre `decimals` casas (arredonda ou
 * completa com zero). `decimals` vai direto ao Intl (inteiro de 0 a 100).
 */
export function formatNumber(n: number, decimals = 0): string {
  let f = FORMATS.get(decimals);
  if (!f) {
    f = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      // Sem "-0" quando um valor negativo arredonda para zero (contagem 0 → -5).
      signDisplay: "negative",
    });
    FORMATS.set(decimals, f);
  }
  return f.format(n);
}
