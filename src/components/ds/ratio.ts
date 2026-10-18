export type MediaRatio = "video" | "portrait" | "square";

/** Proporções de mídia (SPEC §8), ligadas a --aspect-* do base.css. */
export const RATIO: Record<MediaRatio, string> = {
  video: "aspect-video",
  portrait: "aspect-portrait",
  square: "aspect-square",
};
