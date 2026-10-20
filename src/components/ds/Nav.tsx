import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cx } from "../../lib/cx";
import { isEmptyText } from "../../lib/dev";
import { LAYOUT_QUERIES, NAV_DIRECTION_THRESHOLD, NAV_HIDE_AFTER } from "../../lib/motion";
import { Button } from "./Button";

export type NavLink = { label: string; href: string };

export type NavProps = {
  /** Wordmark em texto; o link volta ao topo (ex.: `#inicio`). */
  wordmark: NavLink;
  /** Âncoras da página. No desktop ficam na barra; abaixo de 1024px, no menu fullscreen. */
  links: readonly NavLink[];
  /** CTA principal, renderizado com Button primary. */
  cta: NavLink;
  /** Nome do landmark <nav>. */
  label?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Barra: altura fixa (--nav-height), então nada no layout depende do
// conteúdo dela. z baixo de propósito: o link "pular para o conteúdo" (z-10)
// fica por cima quando recebe foco. Esconder/mostrar responde à rolagem o
// tempo todo: é interação, então --dur-fast (SPEC §11, interação < 300ms).
const BAR =
  "fixed inset-x-0 top-0 z-2 h-(--nav-height) bg-(--nav-bg) text-(--nav-ink) transition-transform duration-fast ease-out motion-reduce:transition-opacity";
// Escondida: sobe a altura dela. Reduced-motion: sem slide, só fade curto.
const BAR_HIDDEN =
  "-translate-y-full motion-reduce:pointer-events-none motion-reduce:translate-y-0 motion-reduce:opacity-0";

// Menu fullscreen (abaixo de lg): cortina que sobe de baixo, --dur-base
// (SPEC §8). Abrir é entrada: --ease-out (SPEC §5). Fechar é o painel saindo
// do lugar: --ease-in-out.
// visibility só entra na transição ao fechar: o menu só some quando a cortina
// termina. Ao abrir ela fica fora da transição e vira visible na hora; com
// ela na transição, o painel ficaria hidden no primeiro frame (progresso 0)
// e o focus() no primeiro link falharia.
const PANEL =
  "fixed inset-0 z-1 flex flex-col overflow-y-auto overscroll-contain bg-(--nav-menu-bg) pt-(--nav-height) text-(--nav-ink) duration-base lg:hidden motion-reduce:duration-fast";
const PANEL_OPEN = "visible transition-[translate] ease-out motion-reduce:transition-opacity";
const PANEL_CLOSED =
  "invisible translate-y-full transition-[translate,visibility] ease-in-out motion-reduce:translate-y-0 motion-reduce:opacity-0 motion-reduce:transition-[opacity,visibility]";

// Link de âncora: linha que cresce da esquerda no hover e no foco (só transform).
function AnchorLink({
  link,
  size,
  onClick,
}: {
  link: NavLink;
  size: "bar" | "menu";
  onClick?: () => void;
}) {
  return (
    <a
      href={link.href}
      onClick={onClick}
      className={cx(
        "group inline-flex min-h-(--touch-target) items-center",
        size === "bar" ? "type-button" : "type-h2",
      )}
    >
      <span className="relative">
        {link.label}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-1 h-(--line-width) origin-left scale-x-0 bg-(--nav-link-line-hover) transition-transform duration-fast ease-snap group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
        />
      </span>
    </a>
  );
}

const isFilled = (l: NavLink) => !isEmptyText(l.label) && !isEmptyText(l.href);

/**
 * Menu fixo + menu fullscreen (SPEC §8). Desktop e mobile por breakpoint (lg).
 * Esconde ao rolar para baixo e volta ao rolar para cima, só com transform;
 * nunca esconde perto do topo, com foco dentro ou com o menu aberto.
 * Fixo e de altura fixa: não empurra o hero nem gera CLS. A seção abaixo
 * reserva o espaço com --nav-height.
 */
export function Nav({ wordmark, links, cta, label = "Principal" }: NavProps) {
  const root = useRef<HTMLElement>(null);
  const panelId = useId();
  const toggleId = useId();
  const [open, setOpen] = useState(false);
  const [scrolledAway, setScrolledAway] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const items = links.filter(isFilled);
  const hidden = scrolledAway && !open && !focusWithin;

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (isEmptyText(wordmark.label))
      console.error("Nav: wordmark vazio. O link de topo fica sem nome.");
    links.forEach((l, i) => {
      if (!isFilled(l))
        console.error(
          `Nav: link ${i} com label ou href vazio (label="${l.label}", href="${l.href}"). Ele não é renderizado.`,
        );
    });
  }, [wordmark.label, links]);

  // Direção da rolagem. Lê window.scrollY (o Lenis rola a janela), então
  // funciona com e sem smooth. Re-render só quando o estado muda.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < NAV_HIDE_AFTER) {
        setScrolledAway(false);
        last = y;
        return;
      }
      const delta = y - last;
      if (Math.abs(delta) < NAV_DIRECTION_THRESHOLD) return;
      setScrolledAway(delta > 0);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu aberto: trava a rolagem da página, Esc fecha e devolve o foco ao
  // botão, e o foco vai para o primeiro link do menu.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    // Primeiro item visível do menu (sem links, o CTA; a partir de 640px o CTA
    // do menu é display: none e fica de fora).
    const panel = document.getElementById(panelId);
    [...(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])]
      .find((el) => el.getClientRects().length > 0)
      ?.focus();

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      document.getElementById(toggleId)?.focus();
    };
    // Ao chegar no desktop o menu fullscreen some: fecha junto.
    const desktop = window.matchMedia(LAYOUT_QUERIES.desktop);
    const onDesktop = () => desktop.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      html.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open, panelId, toggleId]);

  // Foco preso no Nav (barra + menu) enquanto o menu está aberto.
  const trapTab = (e: KeyboardEvent<HTMLElement>) => {
    if (!open || e.key !== "Tab" || !root.current) return;
    const focusable = [...root.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (el) => el.getClientRects().length > 0,
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const lastEl = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !root.current.contains(active))) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && active === lastEl) {
      e.preventDefault();
      first.focus();
    }
  };

  const close = () => setOpen(false);

  return (
    <header
      ref={root}
      data-lenis-prevent={open ? "" : undefined}
      onKeyDown={trapTab}
      // Só foco de teclado prende a barra: clique de mouse num link também foca,
      // e a barra ficaria presa depois de pular para a âncora.
      onFocus={(e) => e.target.matches(":focus-visible") && setFocusWithin(true)}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
      }}
    >
      <div className={cx(BAR, hidden && BAR_HIDDEN)}>
        <div className="flex h-full items-center justify-between gap-6 px-(--page-margin)">
          <a
            href={wordmark.href}
            className="inline-flex min-h-(--touch-target) min-w-0 items-center type-h3"
          >
            <span className="min-w-0 truncate">{wordmark.label}</span>
          </a>
          <div className="flex shrink-0 items-center gap-6">
            <nav aria-label={label} className="hidden lg:block">
              <ul className="flex items-center gap-6">
                {items.map((l, i) => (
                  <li key={`${i}-${l.href}`}>
                    <AnchorLink link={l} size="bar" />
                  </li>
                ))}
              </ul>
            </nav>
            {/* nowrap herdado: o CTA não quebra linha e não estoura a altura da barra. */}
            <div className="hidden whitespace-nowrap sm:block">
              <Button href={cta.href}>{cta.label}</Button>
            </div>
            <div className="lg:hidden">
              <Button
                variant="ghost"
                id={toggleId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? "Fechar" : "Menu"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div id={panelId} inert={!open} className={cx(PANEL, open ? PANEL_OPEN : PANEL_CLOSED)}>
        <div className="flex grow flex-col justify-between gap-12 px-(--page-margin) py-8">
          <nav aria-label={label}>
            <ul className="flex flex-col gap-4">
              {items.map((l, i) => (
                <li key={`${i}-${l.href}`}>
                  <AnchorLink link={l} size="menu" onClick={close} />
                </li>
              ))}
            </ul>
          </nav>
          <div className="sm:hidden">
            <Button href={cta.href} onClick={close}>
              {cta.label}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
