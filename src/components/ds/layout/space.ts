/** Passos da escala de espaço (SPEC §4): nome × 4 = px. */
export type Space = 0 | 1 | 2 | 4 | 6 | 8 | 12 | 16 | 24 | 32 | 48;

// Classes escritas por extenso para o Tailwind encontrar no código.
export const PADDING_Y: Record<Space, string> = {
  0: "py-0", 1: "py-1", 2: "py-2", 4: "py-4", 6: "py-6", 8: "py-8",
  12: "py-12", 16: "py-16", 24: "py-24", 32: "py-32", 48: "py-48",
};

export const GAP: Record<Space, string> = {
  0: "gap-0", 1: "gap-1", 2: "gap-2", 4: "gap-4", 6: "gap-6", 8: "gap-8",
  12: "gap-12", 16: "gap-16", 24: "gap-24", 32: "gap-32", 48: "gap-48",
};

export const GAP_Y: Record<Space, string> = {
  0: "gap-y-0", 1: "gap-y-1", 2: "gap-y-2", 4: "gap-y-4", 6: "gap-y-6", 8: "gap-y-8",
  12: "gap-y-12", 16: "gap-y-16", 24: "gap-y-24", 32: "gap-y-32", 48: "gap-y-48",
};
