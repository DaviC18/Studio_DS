import type { ReactNode } from "react";
import { Nav, type NavCta, type NavLink } from "../../components/ds/Nav";
import { cx } from "../../lib/cx";
import { DocEntry, Variant } from "../DocEntry";

// Nomes das seções da Spec Golden Grains §3. No catálogo, os links apontam
// para a própria página (sem número de WhatsApp).
const HREF = "#componentes";

const WORDMARK: NavLink = { label: "Golden Grains", href: HREF };
const CTA: NavCta = { label: "Assine o clube", shortLabel: "Assinar", href: HREF };
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
 *
 * `height`: `bar` mostra só a barra (192px). `curtain` é para a variação em
 * que o leitor abre o menu: a cortina divide a altura disponível em fileiras
 * iguais, então qualquer moldura mais baixa que a janela mostraria uma
 * composição que não existe. Ela só cresce abaixo de lg, que é onde o menu
 * fullscreen existe; a partir de lg a cortina é display: none e a moldura
 * volta aos 192px, para o catálogo no desktop não ganhar um bloco vazio.
 */
function NavFrame({
  children,
  height = "bar",
}: {
  children: ReactNode;
  height?: "bar" | "curtain";
}) {
  return (
    <div
      className={cx(
        "relative transform-gpu overflow-clip rounded-base border border-line bg-bg",
        height === "curtain" ? "h-dvh lg:h-48" : "h-48",
      )}
    >
      {children}
    </div>
  );
}

export function NavDemo() {
  return (
    <DocEntry
      name="Nav"
      use="menu fixo da página: wordmark, âncoras e o CTA principal (sempre na barra); um por página, fora do <main>."
      avoid="navegação dentro de uma seção (use Button link) ou página sem âncoras nem CTA."
      snippet={`
<Nav
  wordmark={{ label: "Golden Grains", href: "#inicio" }}
  links={[
    { label: "Manifesto", href: "#manifesto" },
    { label: "Cafés", href: "#cafes" },
  ]}
  cta={{ label: "Assine o clube", shortLabel: "Assinar", href: "https://wa.me/…" }}
/>
// A seção logo abaixo reserva a altura da barra: padding-top --nav-height.`}
    >
      <Variant label="desktop (a partir de 1024px): âncoras e CTA na barra · mobile: botão Menu abre a cortina fullscreen, com uma fileira por âncora dividindo a tela em partes iguais; Esc fecha. Abaixo de 1024px a moldura tem a altura da janela, para a cortina caber inteira. Redimensione a janela para ver as duas">
        <NavFrame height="curtain">
          <Nav wordmark={WORDMARK} links={LINKS} cta={CTA} />
        </NavFrame>
      </Variant>
      <Variant label='CTA curto: abaixo de 640px a barra mostra shortLabel ("Assinar"); a partir de 640px, o label completo'>
        <p className="max-w-measure type-micro text-ink-muted">
          O CTA nunca sai da barra: com o menu aberto a barra fica por cima da cortina, então o menu
          não repete o CTA. Os dois rótulos ficam no HTML e o escondido sai da árvore de
          acessibilidade (display: none), então o nome acessível é o rótulo visível: no mobile o
          leitor de tela lê &quot;Assinar&quot;.
        </p>
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

/**
 * Casos de stress para o StressView (375px): texto longo e link vazio. Em
 * 375px a barra mostra wordmark + "Assinar" + "Menu": com o wordmark gigante
 * só ele encurta (truncate), os dois botões ficam inteiros e nada quebra.
 */
export function NavStress() {
  return (
    <NavFrame>
      <Nav
        wordmark={{
          label: "Golden Grains Torrefação de Cafés Especiais do Sul de Minas",
          href: HREF,
        }}
        links={LONG_LINKS}
        cta={{
          label: "Assine o clube de cafés especiais pelo WhatsApp",
          shortLabel: "Assinar",
          href: HREF,
        }}
      />
    </NavFrame>
  );
}
