// Constantes de motion que não são tokens CSS (SPEC §5). Único lugar delas.

/**
 * Disparo padrão de todos os presets: topo do elemento a 85% da viewport, uma
 * vez (§5.8). clamp() do ScrollTrigger: se o start é alcançável, vale igual;
 * perto do fim da página, onde o topo nunca chega a 85%, o start é preso ao
 * scroll máximo e o preset ainda dispara, terminando no estado final visível.
 */
export const DEFAULT_START = "clamp(top 85%)";
export const DEFAULT_ONCE = true;

/** Zoom inicial da mídia no preset mask ("leve zoom", SPEC §8). */
export const MASK_ZOOM = 1.1;

/**
 * PortalCard sem hover (touch): o card fica ativo, com a imagem de hover,
 * enquanto cruza o centro da viewport.
 */
export const PORTAL_ACTIVE_START = "top center";
export const PORTAL_ACTIVE_END = "bottom center";

/** StatCounter: a contagem parte deste valor até o valor final. */
export const COUNT_FROM = 0;
