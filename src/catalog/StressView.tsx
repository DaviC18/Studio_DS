import { useEffect, useState } from "react";
import {
  Button,
  Container,
  HeroTitle,
  MediaFrame,
  PortalCard,
  RevealText,
  Section,
  Stack,
} from "../components/ds";
import { IMAGE, PORTAL } from "./media";

const ACCENTS = "ÁÉÇÃ Ação épica";
const SIZES = ["type-display", "type-h2", "type-h3", "type-body", "type-micro", "type-button"] as const;
const LONG =
  "Torramos em lotes pequenos, sempre de manhã, e anotamos cada curva de temperatura. O café sai da torra, descansa dois dias e só depois vai para a xícara. ";

/** Página aberta dentro do iframe de 375px (?view=stress). */
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
    <main>
      <Section space={8}>
        <Container gap={4}>
          <h1 className="type-h3">Stress test</h1>
          <p role="status" className="type-micro">
            {overflow === null ? "medindo…" : overflow ? "FALHA: há scroll horizontal" : "ok: sem scroll horizontal"}
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
          <PortalCard href="#" title="" image={PORTAL.a} hoverImage={PORTAL.b} />
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
          />
          <MediaFrame ratio="portrait" media={IMAGE.tall} caption={LONG} />
        </Container>
      </Section>
    </main>
  );
}
