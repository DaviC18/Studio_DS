import { createElement, useEffect, useRef } from "react";
import { cx } from "../../lib/cx";
import { isEmptyText } from "../../lib/dev";
import {
  ACTIVE_CENTER_END,
  ACTIVE_CENTER_START,
  gsap,
  LAYOUT_QUERIES,
  ScrollTrigger,
  useGSAP,
} from "../../lib/motion";
import { GAP_Y, type Space } from "./layout/space";
import { RATIO, type MediaRatio } from "./ratio";

/** Imagem decorativa: a informação do item é o texto real, fora da imagem. */
export type CollectionImage = { src: string; srcSet?: string; sizes?: string };

export type CollectionItem = {
  /**
   * Destino do item. Obrigatório: o item inteiro é um link, como no PortalCard.
   * Para o CTA do clube, use whatsappHref() (src/lib/whatsapp.ts).
   */
  href: string;
  /** Nome do item. Obrigatório: abre o nome acessível do link. */
  name: string;
  /** Linha curta embaixo do nome (ex.: processo do lote). */
  process?: string;
  /** Texto corrido (ex.: notas sensoriais). */
  notes?: string;
  /** Destaque numérico, já formatado (ex.: "86"). Vai para o acento no estado ativo. */
  highlight: string;
  /** Unidade do destaque, em microcopy ao lado (ex.: "pontos"). */
  highlightUnit?: string;
  /** Imagem em repouso. */
  image: CollectionImage;
  /** Imagem do estado ativo: hover, foco por teclado e, no toque, centro da tela. */
  activeImage: CollectionImage;
};

/** Colunas a partir de 1024px. Abaixo: 1 coluna no mobile, 2 a partir de 640px. */
export type CollectionColumns = 2 | 3 | 4;

export type CollectionGridProps = {
  items: ReadonlyArray<CollectionItem>;
  columns?: CollectionColumns;
  ratio?: MediaRatio;
  /** Espaço vertical entre linhas do grid. */
  gap?: Space;
  nameAs?: "h3" | "h4";
};

// Grid do page-grid (4 colunas no mobile, 12 a partir de lg).
const COLUMNS: Record<CollectionColumns, string> = {
  2: "*:col-span-full sm:*:col-span-2 lg:*:col-span-6",
  3: "*:col-span-full sm:*:col-span-2 lg:*:col-span-4",
  4: "*:col-span-full sm:*:col-span-2 lg:*:col-span-3",
};

// Hover só existe em (hover: hover); foco por teclado e [data-active] (toque)
// dão o mesmo estado.
const ACTIVE_SCALE =
  "motion-safe:group-hover:scale-(--collection-zoom) motion-safe:group-focus-visible:scale-(--collection-zoom) motion-safe:group-data-active:scale-(--collection-zoom)";
const ACTIVE_SHOW =
  "group-hover:opacity-100 group-focus-visible:opacity-100 group-data-active:opacity-100";
const ACTIVE_HIDE =
  "group-hover:opacity-0 group-focus-visible:opacity-0 group-data-active:opacity-0";

function Img({ image, className }: { image: CollectionImage; className: string }) {
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.sizes}
      alt=""
      loading="lazy"
      decoding="async"
      className={cx("absolute inset-0 size-full object-cover", className)}
    />
  );
}

function Item({
  item,
  ratio,
  nameAs,
}: {
  item: CollectionItem;
  ratio: MediaRatio;
  nameAs: "h3" | "h4";
}) {
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (isEmptyText(item.name)) {
      console.error(
        `CollectionGrid: item com name vazio (href="${item.href}"). O link fica sem nome acessível.`,
      );
    }
    if (isEmptyText(item.highlight)) {
      console.error(`CollectionGrid: item "${item.name}" com highlight vazio.`);
    }
  }, [item.name, item.highlight, item.href]);

  // O item inteiro é um link, e o nome acessível vem do texto visível (nome,
  // pontuação, processo e notas), como no PortalCard: nada de tabIndex avulso
  // nem de aria-labelledby/describedby.
  return (
    <li>
      <a
        data-collection-item
        href={item.href}
        className="group block rounded-(--collection-radius)"
      >
        <div
          className={cx(
            "relative overflow-clip rounded-(--collection-radius) bg-(--collection-placeholder)",
            RATIO[ratio],
          )}
        >
          <div
            className={cx(
              "absolute inset-0 transition-transform duration-base ease-out",
              ACTIVE_SCALE,
            )}
          >
            <Img image={item.image} className="" />
            <Img
              image={item.activeImage}
              className={cx(
                "opacity-0 transition-opacity duration-base ease-out motion-reduce:duration-fast",
                ACTIVE_SHOW,
              )}
            />
          </div>
        </div>
        {/* Sem min-w-0 no nome: a largura mínima dele é a palavra mais longa, então
            o nome não parte no meio da palavra; sem espaço, a pontuação desce
            para a linha de baixo (flex-wrap). */}
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          {createElement(nameAs, { className: "type-h3" }, item.name)}
          <p className="shrink-0 type-h3 tabular-nums">
            {/* Duas cópias na mesma célula: a troca de cor é só opacity. */}
            <span className="inline-grid *:col-start-1 *:row-start-1">
              <span className={cx("transition-opacity duration-fast ease-snap", ACTIVE_HIDE)}>
                {item.highlight}
              </span>
              <span
                aria-hidden="true"
                className={cx(
                  "text-accent opacity-0 transition-opacity duration-fast ease-snap",
                  ACTIVE_SHOW,
                )}
              >
                {item.highlight}
              </span>
            </span>
            {item.highlightUnit && (
              <span className="ms-1 type-micro text-ink-muted">{item.highlightUnit}</span>
            )}
          </p>
        </div>
        {item.process && <p className="mt-1 type-micro text-ink-muted">{item.process}</p>}
        {item.notes && <p className="mt-2 max-w-measure type-body text-ink-muted">{item.notes}</p>}
      </a>
    </li>
  );
}

/**
 * Grid de itens colecionáveis (SPEC §8): cada item é um link (no Golden Grains,
 * o wa.me do lote) e troca a imagem base pela ativa no hover, no foco por
 * teclado e, sem hover (toque), quando cruza o centro da tela, um item por vez.
 * Imagens absolute na proporção fixa: sem layout shift. Texto real fora da
 * imagem; no estado ativo o destaque vai para o acento.
 */
export function CollectionGrid({
  items,
  columns = 3,
  ratio = "square",
  gap = 12,
  nameAs = "h3",
}: CollectionGridProps) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (import.meta.env.DEV && items.length === 0) {
      console.error("CollectionGrid: items vazio. O grid não renderiza nenhum item.");
    }
  }, [items.length]);

  // Toque: um item ativo por vez no grid (Brasa Única: no máximo 3 usos de
  // acento por tela). Cada célula tem um trigger no centro da viewport; os
  // itens de uma mesma fileira cruzam o centro juntos, então a janela da
  // fileira é dividida em partes iguais, uma por coluna, da esquerda para a
  // direita: rolando, um lote acende por vez.
  useGSAP(
    () => {
      const list = ref.current;
      if (!list) return;
      const mm = gsap.matchMedia();
      mm.add(LAYOUT_QUERIES.noHover, () => {
        const els = Array.from(list.querySelectorAll<HTMLElement>("[data-collection-item]"));
        let current: HTMLElement | null = null;
        const activate = (el: HTMLElement | null) => {
          if (el === current) return;
          current?.removeAttribute("data-active");
          el?.setAttribute("data-active", "");
          current = el;
        };

        for (const el of els) {
          // A célula (li) estica até a altura da fileira: mesma janela para todos.
          const cell = el.parentElement ?? el;
          let slot: { index: number; count: number } | null = null;
          const measure = () => {
            const row = els.filter((other) => {
              const top = (other.parentElement ?? other).offsetTop;
              return Math.abs(top - cell.offsetTop) < 1;
            });
            return { index: row.indexOf(el), count: row.length };
          };
          const update = (isActive: boolean, progress: number) => {
            slot ??= measure();
            const part = Math.min(slot.count - 1, Math.floor(progress * slot.count));
            if (isActive && part === slot.index) activate(el);
            else if (current === el) activate(null);
          };

          ScrollTrigger.create({
            trigger: cell,
            start: ACTIVE_CENTER_START,
            end: ACTIVE_CENTER_END,
            onRefresh: (self) => {
              slot = null;
              update(self.isActive, self.progress);
            },
            onUpdate: (self) => update(self.isActive, self.progress),
            onToggle: (self) => update(self.isActive, self.progress),
          });
        }
        return () => activate(null);
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [items], revertOnUpdate: true },
  );

  return (
    <ul ref={ref} className={cx("page-grid", GAP_Y[gap], COLUMNS[columns])}>
      {items.map((item, i) => (
        <Item key={`${i}-${item.name}`} item={item} ratio={ratio} nameAs={nameAs} />
      ))}
    </ul>
  );
}
