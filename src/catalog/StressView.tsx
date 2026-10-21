import { useEffect, useState } from "react";
import {
  Button,
  CollectionGrid,
  Container,
  Footer,
  HeroTitle,
  HorizontalGallery,
  LogoWall,
  MediaFrame,
  PortalCard,
  RevealText,
  Section,
  Stack,
  StatCounter,
} from "../components/ds";
import { whatsappHref } from "../lib/whatsapp";
import { NavStress } from "./demos/Nav";
import { IMAGE, PORTAL } from "./media";

const ACCENTS = "ÁÉÇÃ Ação épica";
const SIZES = [
  "type-display",
  "type-h2",
  "type-h3",
  "type-body",
  "type-micro",
  "type-button",
] as const;
const LONG =
  "Torramos em lotes pequenos, sempre de manhã, e anotamos cada curva de temperatura. O café sai da torra, descansa dois dias e só depois vai para a xícara. ";
const LOTE = {
  href: whatsappHref("Quero o lote Boa Vista"),
  name: "Fazenda Boa Vista do Rio Sapucaí Mirim",
  process: "cereja descascado, fermentação anaeróbica",
  notes: "caramelo, castanha",
  highlight: "85",
  highlightUnit: "pontos",
  image: PORTAL.c,
  activeImage: PORTAL.a,
};
const LONG_PARTNER = "Cafeteria e Torrefação Artesanal Bem-Te-Vi da Serra da Mantiqueira";
const THIRTY = Array.from({ length: 30 }, (_, i) => `Cafeteria ${i + 1}`);

/** Página aberta dentro do iframe de 375px (catalogo/stress.html). */
export function StressView() {
  const [overflow, setOverflow] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      const el = document.documentElement;
      setOverflow(el.scrollWidth > el.clientWidth);
    };
    const ro = new ResizeObserver(check);
    ro.observe(document.body);
    document.fonts.ready.then(check);
    return () => ro.disconnect();
  }, []);

  return (
    <main id="conteudo">
      <Section space={8}>
        <Container gap={4}>
          <h1 className="type-h3">Stress test</h1>
          <p role="status" className="type-micro">
            {overflow === null
              ? "medindo…"
              : overflow
                ? "FALHA: há scroll horizontal"
                : "ok: sem scroll horizontal"}
          </p>
        </Container>
      </Section>

      <Section space={12}>
        <Container gap={8}>
          <p className="type-micro text-ink-muted">palavra mais longa prevista no display</p>
          <HeroTitle as="p" lines={["Torréfação"]} />
          <HeroTitle as="p" lines={["Especialíssimo"]} />
        </Container>
      </Section>

      <Section space={12} tone="surface">
        <Container gap={4}>
          <p className="type-micro text-ink-muted">acentos em todos os tamanhos</p>
          {SIZES.map((s) => (
            <p key={s} className={s}>
              {ACCENTS}
            </p>
          ))}
        </Container>
      </Section>

      <Section space={12}>
        <Container gap={8}>
          <p className="type-micro text-ink-muted">texto vazio</p>
          <Stack direction="row" gap={4} wrap>
            <Button>{""}</Button>
            <Button variant="ghost">{""}</Button>
          </Stack>
          <HeroTitle as="p" lines={[""]} />
          <RevealText>{""}</RevealText>
          <PortalCard href="#" title="" image={PORTAL.a} hoverImage={PORTAL.b} titleAs="h2" />
          <StatCounter value={0} label="" />
          <HorizontalGallery label="" items={[{ image: IMAGE.tall, caption: "" }]} />
        </Container>
      </Section>

      <Section space={12} tone="surface">
        <Container gap={8}>
          <p className="type-micro text-ink-muted">texto 3× maior que o normal</p>
          <Button>Agendar uma degustação guiada de cafés especiais com o mestre de torra</Button>
          <Button variant="ghost">Ver o cardápio completo de métodos de preparo e origens</Button>
          <RevealText>{LONG.repeat(3)}</RevealText>
          <PortalCard
            href="#"
            title="Torra clara de fermentação anaeróbica do sul de Minas"
            description={LONG}
            image={PORTAL.a}
            hoverImage={PORTAL.b}
            titleAs="h2"
          />
          <MediaFrame ratio="portrait" media={IMAGE.tall} caption={LONG} />
          <StatCounter size="display" value={1250000} prefix="R$ " label={LONG} />
          <StatCounter value={9999999} suffix=" toneladas" label="valor grande em h2" />
          <StatCounter value={-1200} prefix="R$ " label="valor negativo (console.error em dev)" />
          <StatCounter value={1234567.89} decimals={2} prefix="R$ " label="decimais em h2" />
        </Container>
      </Section>

      <Section space={12}>
        <Container gap={8}>
          <p className="type-micro text-ink-muted">
            Nav: texto longo, link sem label e sem href (console.error em dev)
          </p>
          <NavStress />
        </Container>
      </Section>

      <Section space={12}>
        <Stack gap={12}>
          <Container gap={4}>
            <p className="type-micro text-ink-muted">
              HorizontalGallery: 1 item, legenda longa, 20 itens, vazia
            </p>
          </Container>
          <HorizontalGallery
            label="Galeria com 1 item"
            items={[{ image: IMAGE.tall, caption: "Sítio Pedra Alta · 1.280 m" }]}
          />
          <HorizontalGallery
            label="Galeria com legenda longa"
            items={[
              { image: IMAGE.tall, caption: LONG },
              { image: IMAGE.square, caption: LONG.repeat(2) },
            ]}
          />
          <HorizontalGallery
            label="Galeria com 20 itens"
            items={Array.from({ length: 20 }, (_, i) => ({
              image: i % 2 ? IMAGE.square : IMAGE.tall,
              caption: `Item ${i + 1} · 1.280 m`,
            }))}
          />
          <HorizontalGallery
            variant="quote"
            label="Citação longa"
            items={[{ image: IMAGE.wide, quote: LONG, cite: "Marina, Café do Largo" }]}
          />
          <HorizontalGallery label="Galeria vazia (console.error em dev)" items={[]} />
        </Stack>
      </Section>

      <Section space={12}>
        <Container gap={8}>
          <p className="type-micro text-ink-muted">
            CollectionGrid: nome longo, notas vazias, 1 item, 4 colunas
          </p>
          <CollectionGrid nameAs="h3" items={[LOTE]} />
          <CollectionGrid nameAs="h3" items={[{ ...LOTE, name: "Pedra Alta", notes: "" }]} />
          <CollectionGrid
            nameAs="h3"
            columns={4}
            items={[
              LOTE,
              { ...LOTE, notes: undefined },
              { ...LOTE, name: "Serra Fria" },
              { ...LOTE, name: "Mantiqueira" },
            ]}
          />
        </Container>
      </Section>

      <Section space={12}>
        <Container gap={8}>
          <p className="type-micro text-ink-muted">
            LogoWall: 1 nome · nome muito longo · 30 nomes
          </p>
          <LogoWall content="text" mode="marquee" label="Um parceiro" items={["Café do Largo"]} />
          <LogoWall content="text" mode="marquee" label="Nome longo" items={[LONG_PARTNER]} />
          <LogoWall content="text" label="Nome longo, estático" items={[LONG_PARTNER]} />
          <LogoWall content="text" mode="marquee" label="Trinta parceiros" items={THIRTY} />
        </Container>
      </Section>

      <Section space={12}>
        <Container gap={8}>
          <p className="type-micro text-ink-muted">
            Footer: frase de 3 linhas, endereço longo, sem links
          </p>
        </Container>
      </Section>
      <Footer
        phrase={["Café bom", "não tem", "pressa."]}
        cta={{ label: "Assine o clube", href: "#" }}
        contact={[
          {
            label: "endereço",
            value:
              "Rua das Brasas, 214, fundos, galpão 3 · Bairro Torrefação Velha · Santa Rita do Sapucaí, MG · CEP 37540-000",
          },
          { label: "torra aberta", value: "sábados, 9h às 13h" },
        ]}
        legal="© 2026 Golden Grains · Site conceitual · marca fictícia"
      />
      <Footer phrase={[""]} cta={{ label: "", href: "#" }} legal="" />
    </main>
  );
}
