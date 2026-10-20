import { useEffect } from "react";
import { Button } from "./Button";
import { HeroTitle, type HeroTitleLines } from "./HeroTitle";
import { MediaFrame, type FrameImage } from "./MediaFrame";
import type { MediaRatio } from "./ratio";
import { Container, Section, Stack } from "./layout";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterContact = {
  /** Rótulo da coluna (ex.: endereço, horário). Vira <dt>. */
  label: string;
  value: string;
};

export type FooterLinks = {
  /** Rótulo da coluna. Vira <dt>. */
  label: string;
  items: readonly FooterLink[];
};

export type FooterProps = {
  /** Frase de impacto em display, 1 a 3 linhas. Revela no scroll (HeroTitle). */
  phrase: HeroTitleLines;
  /** CTA final (Button primary). */
  cta: FooterLink;
  /** Colunas de contato, dentro de <address>. */
  contact?: readonly FooterContact[];
  /**
   * Coluna de links (redes, WhatsApp), com rótulo como as de contato, para o
   * texto dos links cair na mesma linha dos valores. Alvo de toque de 44px.
   */
  links?: FooterLinks;
  /** Linha final (legal). */
  legal: string;
  /**
   * Objeto herói de novo (SPEC §6), como imagem parada. Sem ele, a frase ocupa
   * a largura toda; com ele, frase 8 colunas + mídia 4 a partir de lg.
   */
  media?: FrameImage;
  /** Proporção do objeto herói. Padrão: 4:5, a mesma do hero. */
  mediaRatio?: MediaRatio;
  /** Âncora da seção (ex.: "contato"); o id é de quem usa o Footer. */
  id?: string;
};

const blank = (s: string) => s.trim() === "";

const LABEL = "type-micro text-ink-muted";

// Link de texto no papel body, no fluxo (mesma linha dos valores do contato).
// O ::before centrado dá o alvo de 44px sem mudar a altura da linha. Cor da
// linha troca no hover/foco sem transição (só transform/opacity animam).
const LINK =
  "relative inline-block text-ink underline decoration-ink-muted underline-offset-4 before:absolute before:inset-x-0 before:top-1/2 before:h-(--touch-target) before:-translate-y-1/2 hover:decoration-accent focus-visible:decoration-accent";

/**
 * Rodapé de impacto: frase display revelada no scroll, CTA, contato, links e
 * linha legal. Sem altura fixa nem pin: o disparo do HeroTitle usa o start
 * com clamp() (SPEC §5.8), então revela mesmo sendo o fim da página.
 */
export function Footer({
  phrase,
  cta,
  contact = [],
  links,
  legal,
  media,
  mediaRatio = "portrait",
  id,
}: FooterProps) {
  const phraseKey = phrase.join("\n");
  const linkItems = links?.items ?? [];

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (phraseKey.split("\n").every(blank)) {
      console.error("Footer: frase vazia. O rodapé fica sem a última impressão.");
    }
    if (blank(legal)) {
      console.error("Footer: linha legal vazia.");
    }
  }, [phraseKey, legal]);

  return (
    <Section as="footer" space={24} id={id}>
      <Container gap={16}>
        <Container layout={media ? "main-aside" : "full"} gap={12}>
          {/* 64px: a entrelinha 0.9 da display deixa o descendente (p de
              "pressa.") invadir o vão; o CTA final precisa de respiro. */}
          <Stack gap={16} align="start">
            <HeroTitle as="p" play="scroll" lines={phrase} />
            <Button href={cta.href}>{cta.label}</Button>
          </Stack>
          {/* Sem máscara: a frase é o destaque da seção (SPEC §5.1). */}
          {media && <MediaFrame ratio={mediaRatio} media={media} reveal={false} />}
        </Container>

        <Stack gap={8}>
          {(contact.length > 0 || linkItems.length > 0) && (
            <address className="not-italic">
              {/* Uma coluna do grid por item: rótulo em cima, valor embaixo. Os
                  links ficam no mesmo papel (type-body) e na mesma linha dos
                  valores; o alvo de 44px cresce por um ::before, sem mexer no
                  fluxo. O gap de 8px entre rótulo e valor, igual nas três
                  colunas, mantém os valores na mesma linha e deixa o anel de
                  foco (2px + 4px de offset) fora do rótulo. */}
              <Container layout="thirds" gap={8}>
                {contact.map((item, i) => (
                  <Stack as="dl" gap={2} key={`${i}-${item.label}`}>
                    <dt className={LABEL}>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </Stack>
                ))}
                {links && linkItems.length > 0 && (
                  <Stack as="dl" gap={2}>
                    <dt className={LABEL}>{links.label}</dt>
                    <dd>
                      <Stack as="ul" direction="row" gap={6} wrap>
                        {linkItems.map((link, i) => (
                          <li key={`${i}-${link.href}`}>
                            <a href={link.href} className={LINK}>
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </Stack>
                    </dd>
                  </Stack>
                )}
              </Container>
            </address>
          )}
          <p className="type-micro text-ink-muted">{legal}</p>
        </Stack>
      </Container>
    </Section>
  );
}
