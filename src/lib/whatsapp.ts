// Link do WhatsApp a partir do número de site.config.ts (Spec Golden Grains
// §2: o número é o único dado fictício a trocar num cliente real).
import { SITE } from "../../site.config";

/**
 * Mensagem padrão do CTA principal (Nav, Hero, Clube e Footer).
 * Spec Golden Grains §2.
 */
export const CLUB_MESSAGE = "Olá! Quero assinar o Clube Golden Grains.";

/**
 * Link nativo wa.me com mensagem pronta: funciona antes do JS carregar
 * (SPEC §10). O número vai só com dígitos, como o wa.me exige.
 */
export function whatsappHref(message: string): string {
  const number = SITE.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
