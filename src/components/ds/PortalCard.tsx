import { createElement, useId, useRef } from "react";
import { cx } from "../../lib/cx";
import {
  gsap,
  PORTAL_ACTIVE_END,
  PORTAL_ACTIVE_START,
  ScrollTrigger,
  useGSAP,
} from "../../lib/motion";
import { RATIO, type MediaRatio } from "./ratio";

/** Imagem decorativa: o nome do link vem do título. */
export type PortalImage = { src: string; srcSet?: string; sizes?: string };

export type PortalCardProps = {
  href: string;
  title: string;
  description?: string;
  image: PortalImage;
  /** Troca no hover, no foco por teclado e, sem hover (touch), no centro da tela. */
  hoverImage: PortalImage;
  ratio?: MediaRatio;
  titleAs?: "h2" | "h3";
};

// Hover só existe em (hover: hover); foco e [data-active] dão o mesmo estado.
const ACTIVE_SCALE =
  "motion-safe:group-hover:scale-(--portal-zoom) motion-safe:group-focus-visible:scale-(--portal-zoom) motion-safe:group-data-active:scale-(--portal-zoom)";
const ACTIVE_SHOW =
  "group-hover:opacity-100 group-focus-visible:opacity-100 group-data-active:opacity-100";

function Img({ image, className }: { image: PortalImage; className: string }) {
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

/**
 * Link grande para outra seção/página: hover expande e troca a imagem.
 * 2 ou 3 colunas (SPEC §8) = <Container layout="split" | "thirds">.
 */
export function PortalCard({
  href,
  title,
  description,
  image,
  hoverImage,
  ratio = "portrait",
  titleAs = "h3",
}: PortalCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const titleId = useId();
  const descId = useId();

  // Touch: ativa enquanto o card cruza o centro da viewport.
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(hover: none)", () => {
        ScrollTrigger.create({
          trigger: el,
          start: PORTAL_ACTIVE_START,
          end: PORTAL_ACTIVE_END,
          onToggle: (self) => el.toggleAttribute("data-active", self.isActive),
        });
        return () => el.removeAttribute("data-active");
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <a
      ref={ref}
      href={href}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className="group block rounded-(--portal-radius)"
    >
      <div
        className={cx(
          "relative overflow-clip rounded-(--portal-radius) bg-(--media-placeholder)",
          RATIO[ratio],
        )}
      >
        <div
          className={cx(
            "absolute inset-0 transition-transform duration-base ease-out",
            ACTIVE_SCALE,
          )}
        >
          <Img image={image} className="" />
          <Img
            image={hoverImage}
            className={cx("opacity-0 transition-opacity duration-base ease-out", ACTIVE_SHOW)}
          />
        </div>
      </div>
      {createElement(titleAs, { id: titleId, className: "mt-4 type-h3" }, title)}
      {description && (
        <p id={descId} className="mt-2 max-w-measure type-body text-ink-muted">
          {description}
        </p>
      )}
    </a>
  );
}
