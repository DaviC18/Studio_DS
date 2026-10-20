import type { ReactNode } from "react";
import { Nav, type NavLink } from "../../components/ds/Nav";
import { DocEntry, Variant } from "../DocEntry";

// Nomes das seções da Spec Golden Grains §3. No catálogo, os links apontam
// para a própria página (sem número de WhatsApp).
const HREF = "#componentes";

const WORDMARK: NavLink = { label: "Golden Grains", href: HREF };
const CTA: NavLink = { label: "Assine o clube", href: HREF };
const LINKS: readonly NavLink[] = [
  { label: "Manifesto", href: HREF },
  { label: "Origem", href: HREF },
  { label: "Cafés", href: HREF },
  { label: "Clube", href: HREF },
];

/**
 * Moldura de demonstração: o Nav é position: fixed. O transform da moldura
 * vira o bloco de contenção dos filhos fixos, então barra e menu ficam presos
 * dentro dela em vez de cobrir o catálogo.
 */
function NavFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-48 transform-gpu overflow-clip rounded-base border border-line bg-bg">
      {children}
    </div>
  );
}

export function NavDemo() {
  return (
    <DocEntry
      name="Nav"
      use="menu fixo da página: wordmark, âncoras e o CTA principal; um por página, fora do <main>."
      avoid="navegação dentro de uma seção (use Button link) ou página sem âncoras nem CTA."
      snippet={`
<Nav
  wordmark={{ label: "Golden Grains", href: "#inicio" }}
  links={[
    { label: "Manifesto", href: "#manifesto" },
    { label: "Cafés", href: "#cafes" },
  ]}
  cta={{ label: "Assine o clube", href: "https://wa.me/…" }}
/>
// A seção logo abaixo reserva a altura da barra: padding-top --nav-height.`}
    >
      <Variant label="desktop (a partir de 1024px): âncoras e CTA na barra · mobile: botão Menu abre a cortina fullscreen, Esc fecha. Redimensione a janela para ver as duas">
        <NavFrame>
          <Nav wordmark={WORDMARK} links={LINKS} cta={CTA} />
        </NavFrame>
      </Variant>
      <Variant label="rolagem: some ao descer (depois de 96px) e volta ao subir; com foco de teclado dentro ou menu aberto, fica">
        <p className="max-w-measure type-micro text-ink-muted">
          Role o catálogo para baixo e para cima com a moldura acima na tela. Reduced-motion: sem
          slide nem cortina, só fade de --dur-fast.
        </p>
      </Variant>
    </DocEntry>
  );
}

const LONG_LINKS: readonly NavLink[] = [
  { label: "Manifesto da torra lenta e da paciência com cada grão", href: HREF },
  { label: "", href: HREF },
  { label: "Origem", href: "" },
  { label: "Os cafés do mês, seis lotes torrados nesta semana", href: HREF },
];

/** Casos de stress para o StressView (375px): texto longo e link vazio. */
export function NavStress() {
  return (
    <NavFrame>
      <Nav
        wordmark={{
          label: "Golden Grains Torrefação de Cafés Especiais do Sul de Minas",
          href: HREF,
        }}
        links={LONG_LINKS}
        cta={{ label: "Assine o clube de cafés especiais pelo WhatsApp", href: HREF }}
      />
    </NavFrame>
  );
}
