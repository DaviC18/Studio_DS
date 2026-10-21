import { useEffect, useRef, useState } from "react";
import { cx } from "../../lib/cx";
import { useMask } from "../../lib/motion";
import { RATIO, type MediaRatio } from "./ratio";

export type FrameImage = {
  kind: "image";
  src: string;
  srcSet?: string;
  sizes?: string;
  /** Obrigatório. Use "" só se a imagem for decorativa. */
  alt: string;
  width?: number;
  height?: number;
};

export type FrameVideo = {
  kind: "video";
  sources: ReadonlyArray<{ src: string; type: "video/webm" | "video/mp4" }>;
  poster: string;
  /** Nome acessível do vídeo. */
  label: string;
  /**
   * Vídeo de ambiente: sem controles nativos, em loop, toca quando visível e
   * nunca com reduced-motion. Tem botão de pausa (WCAG 2.2.2).
   */
  ambient?: boolean;
};

/** Ponto focal do recorte: o que fica visível quando a proporção corta a mídia. */
export type MediaFocus = "center" | "top" | "bottom" | "left" | "right";

export type MediaFrameProps = {
  media: FrameImage | FrameVideo;
  ratio: MediaRatio;
  caption?: string;
  /** Hero / LCP: carrega eager com prioridade alta. */
  priority?: boolean;
  /** Máscara que abre + leve zoom. Padrão: ligado, exceto com priority. */
  reveal?: boolean;
  /**
   * Ponto focal do recorte (`object-position`). Vale quando a proporção do
   * frame corta a mídia — 16:9 dentro de um frame 4:5, por exemplo.
   * Padrão: "center".
   */
  focus?: MediaFocus;
};

const FILL = "block size-full object-cover";
const FOCUS: Record<MediaFocus, string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
};
const NO_TARGET = { current: null };

function Video({ media, priority, fill }: { media: FrameVideo; priority: boolean; fill: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const ambient = media.ambient ?? false;

  useEffect(() => {
    const video = ref.current;
    if (!video || !ambient) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !userPaused.current && !reduce.matches)
        video.play().catch(() => {});
      else video.pause();
    });
    const onReduce = () => reduce.matches && video.pause();
    io.observe(video);
    reduce.addEventListener("change", onReduce);
    return () => {
      io.disconnect();
      reduce.removeEventListener("change", onReduce);
    };
  }, [ambient]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    userPaused.current = !video.paused;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <>
      <video
        ref={ref}
        className={fill}
        poster={media.poster}
        aria-label={media.label}
        muted
        playsInline
        loop={ambient}
        controls={!ambient}
        preload={priority ? "auto" : "none"}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {media.sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      {ambient && (
        <button
          type="button"
          onClick={toggle}
          className="absolute right-2 bottom-2 min-h-(--touch-target) rounded-(--button-radius) bg-(--media-control-bg) px-4 type-micro text-(--media-control-ink)"
        >
          {playing ? "Pausar vídeo" : "Reproduzir vídeo"}
        </button>
      )}
    </>
  );
}

/** Imagem ou vídeo com legenda, proporção fixa (CLS zero) e máscara. */
export function MediaFrame({
  media,
  ratio,
  caption,
  priority = false,
  reveal = !priority,
  focus = "center",
}: MediaFrameProps) {
  const frame = useRef<HTMLDivElement>(null);
  const fill = cx(FILL, FOCUS[focus]);
  // Estrutura do preset mask: frame (clip) > cortina > mídia.
  useMask(reveal ? frame : NO_TARGET);

  return (
    <figure>
      <div
        ref={frame}
        className={cx(
          "relative overflow-clip rounded-(--media-radius) bg-(--media-placeholder)",
          RATIO[ratio],
        )}
      >
        <div className="size-full">
          {media.kind === "image" ? (
            <img
              className={fill}
              src={media.src}
              srcSet={media.srcSet}
              sizes={media.sizes}
              alt={media.alt}
              width={media.width}
              height={media.height}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
            />
          ) : (
            <Video media={media} priority={priority} fill={fill} />
          )}
        </div>
      </div>
      {caption && <figcaption className="mt-2 type-micro text-ink-muted">{caption}</figcaption>}
    </figure>
  );
}
