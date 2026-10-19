import { Container, Section, Stack } from "../components/ds";
import type { ThemeName } from "../styles/themes";

/** Moldura de 375px: o iframe tem viewport própria, então as media queries são reais. */
export function StressSection({ theme }: { theme: ThemeName }) {
  return (
    <Section id="stress" labelledBy="stress-title" space={24} tone="surface">
      <Container layout="main-aside" gap={12}>
        <Stack gap={6}>
          <h2 id="stress-title" className="type-h2">
            Stress test em 375px
          </h2>
          <p className="max-w-measure">
            Palavra mais longa no display, acentos em todos os tamanhos, texto vazio, texto 3×
            maior e botão com label longo. O topo da moldura diz se houve scroll horizontal.
          </p>
        </Stack>
        <iframe
          title="Stress test do design system em 375px"
          src={`/stress.html?theme=${theme}`}
          loading="lazy"
          className="catalog-device"
        />
      </Container>
    </Section>
  );
}
