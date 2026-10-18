// Constantes de motion que não são tokens CSS (SPEC §5). Único lugar delas.

/** Disparo padrão dos reveals: topo do elemento a 85% da viewport, uma vez. */
export const DEFAULT_START = "top 85%";
export const DEFAULT_ONCE = true;

/** Zoom inicial da mídia no preset mask ("leve zoom", SPEC §8). */
export const MASK_ZOOM = 1.1;

/**
 * PortalCard sem hover (touch): o card fica ativo, com a imagem de hover,
 * enquanto cruza o centro da viewport.
 */
export const PORTAL_ACTIVE_START = "top center";
export const PORTAL_ACTIVE_END = "bottom center";
