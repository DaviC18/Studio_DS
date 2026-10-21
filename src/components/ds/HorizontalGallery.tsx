import { useEffect, useRef } from "react";
import { isEmptyText } from "../../lib/dev";
import {
  gsap,
  GALLERY_PIN_END,
  GALLERY_SCRUB,
  galleryPinStart,
  LAYOUT_QUERIES,
  MOTION_QUERIES,
  useGSAP,
} from "../../lib/motion";
import { MediaFrame, type FrameImage } from "./MediaFrame";
import type { MediaRatio } from "./ratio";

/** Item "com legenda": a legenda fica embaixo da imagem (figcaption do MediaFrame). */
export type GalleryCaptionItem = { image: FrameImage; caption: string };

/** Item "com citação": a citação fica embaixo da imagem; `cite` = quem disse. */
export type GalleryQuoteItem = { image: FrameImage; quote: string; cite?: string };

/** Nome acessível da região rolável: texto próprio ou o id de um título visível. */
type GalleryName = { label: string; labelledBy?: never } | { labelledBy: string; label?: never };

type GalleryVariant =
  | { variant?: "caption"; items: readonly GalleryCaptionItem[] }
  | { variant: "quote"; items: readonly GalleryQuoteItem[] };

export type HorizontalGalleryProps = GalleryName &
  GalleryVariant & {
    /** Proporção de todas as imagens (fixa: CLS zero). Padrão 4:5. */
    ratio?: MediaRatio;
  };

type Item = GalleryCaptionItem | GalleryQuoteItem;

const isQuote = (item: Item): item is GalleryQuoteItem => "quote" in item;

/** Texto do item: legenda ou citação. */
const itemText = (item: Item) => (isQuote(item) ? item.quote : item.caption);

function GalleryItem({ item, ratio }: { item: Item; ratio: MediaRatio }) {
  if (!isQuote(item)) return <MediaFrame ratio={ratio} media={item.image} caption={item.caption} />;
  return (
    <>
      <MediaFrame ratio={ratio} media={item.image} />
      <blockquote className="mt-4 max-w-measure type-h3">
        <p>{item.quote}</p>
      </blockquote>
      {item.cite && <p className="mt-2 type-micro text-ink-muted">{item.cite}</p>}
    </>
  );
}

/**
 * Galeria horizontal (SPEC §8): "com legenda" ou "com citação".
 *
 * O HTML pré-renderizado é o scroll horizontal nativo, que funciona sem JS:
 * scroll-snap, arraste nativo e a lista focável (Tab, depois as setas rolam).
 * É o comportamento no mobile, no tablet e com reduced-motion.
 *
 * Desktop (>= 1024px) com janela alta (>= 700px, LAYOUT_QUERIES.tall) e sem
 * reduced-motion: o JS liga o scrub. A galeria fica presa por exatamente 1
 * viewport de scroll (GALLERY_PIN_END) e a faixa anda com o scroll vertical,
 * só por transform; faixa mais longa anda mais rápido, nunca prende mais. Se
 * tudo cabe na tela, não prende.
 *
 * Janela com menos de 700px de altura não prende: o quadro preso não caberia e
 * a legenda ficaria fora da tela. Nesse caso vale o scroll-snap nativo, igual
 * ao mobile e ao reduced-motion. O gsap.matchMedia troca de modo sozinho no
 * resize: mm.revert() desfaz o pin, o data-scrub e o tabindex="-1".
 *
 * Largura total (sangra até a borda da tela): use dentro de <Section> ou de um
 * <Stack>, fora de <Container>. A margem lateral do SPEC §4 já está dentro: a
 * primeira imagem alinha com o grid e as outras saem pela borda. Dentro de um
 * <Container> (.page-grid), a margem dele já foi aplicada e a galeria tira a
 * própria: alinha ao grid e corta na margem, sem margem dobrada. Itens: 3 de 4
 * colunas no mobile, 2 de 4 no tablet e 4 de 12 no desktop (--gallery-item-*).
 *
 * Preso, o quadro fica centralizado na área abaixo do Nav fixo (--nav-height,
 * galleryPinStart): a barra não cobre as fotos quando volta.
 *
 * O pin fica num wrapper próprio do componente (bloco, não flex): o pin-spacer
 * sempre reserva a rolagem de GALLERY_PIN_END, qualquer que seja o display do
 * pai (o GSAP desliga o pinSpacing quando o pai do alvo é flex).
 */
export function HorizontalGallery(props: HorizontalGalleryProps) {
  const { items, ratio = "portrait" } = props;
  const label = "label" in props ? props.label : undefined;
  const labelledBy = "labelledBy" in props ? props.labelledBy : undefined;
  const root = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (items.length === 0) console.error("HorizontalGallery: items vazio. A galeria fica vazia.");
    if (label !== undefined && isEmptyText(label)) {
      console.error("HorizontalGallery: label vazio. A região rolável fica sem nome acessível.");
    }
    items.forEach((item: Item, i) => {
      if (isEmptyText(itemText(item))) {
        const kind = isQuote(item) ? "citação" : "legenda";
        console.error(`HorizontalGallery: ${kind} vazia no item ${i} (src="${item.image.src}").`);
      }
    });
  }, [items, label]);

  // Scrub só no desktop com janela alta e sem reduced-motion. Fora disso, nada
  // roda: fica o scroll nativo do HTML. mm.revert() desfaz tudo ao sair da
  // condição, inclusive quando o resize baixa a janela abaixo de 700px.
  useGSAP(
    () => {
      const el = pin.current;
      const scroller = track.current;
      if (!el || !scroller) return;
      const mm = gsap.matchMedia();
      const query = `${LAYOUT_QUERIES.desktop} and ${LAYOUT_QUERIES.tall} and ${MOTION_QUERIES.full}`;
      mm.add(query, () => {
        const cells = Array.from(scroller.children) as HTMLElement[];
        const last = cells.at(-1);
        if (!last) return;

        // Quanto a faixa passa da tela, pela posição de layout (offsetLeft não
        // conta transform nem scrollLeft). Lido de novo a cada refresh.
        const distance = () => {
          const end = parseFloat(getComputedStyle(scroller).paddingInlineEnd) || 0;
          return Math.max(0, last.offsetLeft + last.offsetWidth + end - scroller.clientWidth);
        };
        if (distance() === 0) return;

        // Sem scroll nativo durante o scrub: quem move a faixa é o transform.
        scroller.scrollLeft = 0;
        scroller.setAttribute("data-scrub", "");
        scroller.setAttribute("tabindex", "-1");

        gsap.to(cells, {
          x: () => -distance(),
          // Scrub: posição colada ao scroll, linear; a curva vem do Lenis.
          ease: "none",
          scrollTrigger: {
            trigger: el,
            pin: true,
            // Explícito: o pai do alvo (o region) é bloco, mas sem isto o GSAP
            // zera o espaço reservado se um dia o pai virar flex.
            pinSpacing: true,
            // Centralizada abaixo do Nav: a altura da barra vem resolvida em px
            // do scroll-margin-top do wrapper (--nav-height).
            start: () =>
              galleryPinStart(
                parseFloat(getComputedStyle(el).scrollMarginTop) || 0,
                window.innerHeight,
                el.offsetHeight,
              ),
            end: GALLERY_PIN_END,
            scrub: GALLERY_SCRUB,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          scroller.removeAttribute("data-scrub");
          scroller.setAttribute("tabindex", "0");
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} role="region" aria-label={label} aria-labelledby={labelledBy}>
      <div ref={pin} className="scroll-mt-(--nav-height)">
        <ul
          ref={track}
          tabIndex={0}
          className="relative flex snap-x snap-mandatory gap-x-(--grid-gutter) overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-px-(--page-margin) px-(--page-margin) -outline-offset-(--focus-ring-width) py-2 in-[.page-grid]:scroll-px-0 in-[.page-grid]:px-0 in-[.page-grid]:outline-offset-0 data-scrub:overflow-x-hidden"
        >
          {items.map((item: Item, i) => (
            <li key={i} className="w-(--gallery-item-width) shrink-0 snap-start">
              <GalleryItem item={item} ratio={ratio} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
