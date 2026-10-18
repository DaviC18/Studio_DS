import type { FrameImage, FrameVideo, PortalImage } from "../components/ds";

// Mídia própria do catálogo (SPEC §6, gerada por scripts/generate-catalog-media.py).
const DIR = "/assets/catalog";

export const IMAGE = {
  wide: { kind: "image", src: `${DIR}/grao-16x9.webp`, alt: "Formas desfocadas em tons de grão torrado", width: 1600, height: 900 },
  tall: { kind: "image", src: `${DIR}/crema-4x5.webp`, alt: "Formas desfocadas em tons de creme", width: 960, height: 1200 },
  square: { kind: "image", src: `${DIR}/torra-4x5.webp`, alt: "Formas desfocadas em tons de torra escura", width: 960, height: 1200 },
} satisfies Record<string, FrameImage>;

export const VIDEO: FrameVideo = {
  kind: "video",
  ambient: true,
  label: "Formas escuras se movendo devagar, como fumaça",
  poster: `${DIR}/fumaca-poster.webp`,
  sources: [
    { src: `${DIR}/fumaca.webm`, type: "video/webm" },
    { src: `${DIR}/fumaca.mp4`, type: "video/mp4" },
  ],
};

export const PORTAL = {
  a: { src: `${DIR}/crema-4x5.webp` },
  b: { src: `${DIR}/grao-4x5.webp` },
  c: { src: `${DIR}/torra-4x5.webp` },
  d: { src: `${DIR}/torra-16x9.webp` },
  e: { src: `${DIR}/crema-16x9.webp` },
} satisfies Record<string, PortalImage>;
