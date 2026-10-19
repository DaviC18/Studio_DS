import { Button, Container, HeroTitle, Section, Stack } from "../components/ds";
import "./catalog.css";
import { ComponentsSection } from "./ComponentsSection";
import { MotionSection } from "./MotionSection";
import { StressSection } from "./StressSection";
import { applyTheme, useTheme } from "./theme";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { TokensSection } from "./TokensSection";

const NAV = [
  { href: "#tokens", label: "Tokens" },
  { href: "#componentes", label: "Componentes" },
  { href: "#motion", label: "Motion" },
  { href: "#stress", label: "Stress test" },
];

/** Catálogo do design system: a documentação que os agentes leem. */
export function Catalog() {
  const theme = useTheme();

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-10 rounded-base bg-bg px-4 py-2 type-button focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Pular para o conteúdo
      </a>
      <Section as="header" space={16}>
        <Container layout="main-aside" gap={12}>
          <Stack gap={8}>
            <HeroTitle lines={["Design system", "do estúdio"]} />
            <p className="max-w-measure text-ink-muted">
              Tokens, componentes e motion num lugar só. Troque o tema: só cor, fonte, tamanhos
              display e raio mudam; estrutura e motion ficam.
            </p>
          </Stack>
          <Stack gap={6} align="start">
            <ThemeSwitcher value={theme} onChange={applyTheme} />
            <nav aria-label="Seções do catálogo">
              <Stack as="ul" gap={1}>
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Button variant="link" href={n.href}>
                      {n.label}
                    </Button>
                  </li>
                ))}
              </Stack>
            </nav>
          </Stack>
        </Container>
      </Section>
      {/* key: troca de tema remonta tudo (relê tokens, refaz splits de linha). */}
      <main key={theme} id="conteudo" tabIndex={-1}>
        <TokensSection />
        <ComponentsSection />
        <MotionSection />
        <StressSection theme={theme} />
      </main>
    </>
  );
}
