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
 * Media queries de layout para gsap.matchMedia(), somadas às de
 * MOTION_QUERIES (reduced-motion). `desktop` = breakpoint lg do base.css
 * (64rem = 1024px), o mesmo em que --motion-scale volta a 1. `noHover` =
 * toque, onde o estado ativo vem do centro da tela (SPEC §5.5). `tall` =
 * janela com altura suficiente para prender uma cena sem cortar nada: abaixo
 * de 43.75rem (700px) o conteúdo preso não cabe (a legenda da
 * HorizontalGallery sai da tela), então o pin não entra e vale o
 * comportamento nativo. Combine com `desktop` no mesmo `mm.add`: o
 * gsap.matchMedia troca de modo sozinho no resize.
 */
export const LAYOUT_QUERIES = {
  desktop: "(min-width: 64rem)",
  noHover: "(hover: none)",
  tall: "(min-height: 43.75rem)",
};

/**
 * Item ativo no toque (PortalCard, CollectionGrid): sem hover, o item fica
 * ativo, com a imagem de hover, enquanto cruza o centro da viewport (SPEC
 * §5.5). Start/end do ScrollTrigger com toggleClass/onToggle.
 */
export const ACTIVE_CENTER_START = "top center";
export const ACTIVE_CENTER_END = "bottom center";

/** PortalCard: mesmos valores de ACTIVE_CENTER_*; nomes mantidos. */
export const PORTAL_ACTIVE_START = ACTIVE_CENTER_START;
export const PORTAL_ACTIVE_END = ACTIVE_CENTER_END;

/** StatCounter: a contagem parte deste valor até o valor final. */
export const COUNT_FROM = 0;

/**
 * Nav: abaixo desta rolagem (px a partir do topo) o Nav fica sempre visível,
 * para não piscar no topo nem esconder o wordmark sobre o hero. 96px = passo
 * 24 da escala, perto da altura do Nav com respiro.
 */
export const NAV_HIDE_AFTER = 96;

/**
 * Nav: variação mínima de rolagem (px) para trocar a direção (esconder ou
 * mostrar). Filtra o tremor do trackpad e do momentum do Lenis. 8px = passo 2
 * da escala.
 */
export const NAV_DIRECTION_THRESHOLD = 8;

/**
 * HorizontalGallery: fim do pin no ScrollTrigger. A página fica presa por no
 * máximo 1 viewport (Spec Golden Grains §7); se a faixa for mais longa, a
 * galeria anda mais rápido em vez de prender mais. Use como `end`.
 */
export const GALLERY_PIN_END = "+=100%";

/**
 * HorizontalGallery: `start` do pin, recalculado a cada refresh. A galeria fica
 * presa centralizada na área abaixo do Nav fixo (`bar` = --nav-height em px),
 * para o quadro preso ficar composto e a barra, quando volta, não cobrir as
 * fotos. Se a galeria for mais alta que essa área, o topo prende logo abaixo
 * da barra. `viewport` e `height` em px (altura da janela e da galeria).
 */
export function galleryPinStart(bar: number, viewport: number, height: number): string {
  const free = Math.max(0, viewport - bar - height);
  return `top ${bar + free / 2}px`;
}

/**
 * HorizontalGallery: `scrub` do ScrollTrigger. `true` = colado ao scroll, sem
 * suavização extra, porque o Lenis já suaviza a rolagem; somar as duas daria
 * atraso. Só vale em LAYOUT_QUERIES.desktop + LAYOUT_QUERIES.tall +
 * MOTION_QUERIES.full.
 */
export const GALLERY_SCRUB = true;

/**
 * LogoWall marquee: velocidade em px por segundo, no desktop. Lenta (ritmo da
 * marca, "café bom não tem pressa"): cada nome leva alguns segundos para
 * cruzar a tela e dá para ler. Multiplique por motionScale() no mobile (~28px/s
 * abaixo de 1024px, viewport menor). Duração da volta = largura de uma cópia
 * da lista / velocidade, então o ritmo não depende de quantos nomes há.
 */
export const MARQUEE_SPEED = 40;
