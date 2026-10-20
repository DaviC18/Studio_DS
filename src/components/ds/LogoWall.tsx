import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { isEmptyText } from "../../lib/dev";
import { MARQUEE_SPEED, MOTION_QUERIES, motionScale } from "../../lib/motion";
import { Button } from "./Button";
import { Stack } from "./layout";

/** Logo de parceiro. `alt` é o nome do parceiro: o logo é conteúdo, não enfeite. */
export type LogoImage = { src: string; alt: string; width: number; height: number };

type TextItems = { content: "text"; items: readonly string[] };
type ImageItems = { content: "image"; items: readonly LogoImage[] };

export type LogoWallMode = "static" | "marquee";

export type LogoWallProps = (TextItems | ImageItems) & {
  /** Nome acessível da lista (ex.: "Cafeterias parceiras"). */
  label: string;
  /**
   * static: lista que quebra linha. marquee: faixa contínua e lenta, com botão
   * de pausa; sem JS e com reduced-motion vira a lista estática.
   */
  mode?: LogoWallMode;
};

// Distância entre itens; no marquee, também o respiro no fim de cada cópia,
// para a emenda do loop ter o mesmo espaço que os outros itens.
const ROW = "flex items-center gap-12";
const COPY = `${ROW} shrink-0 pr-12`;
const TEXT_ITEM = "type-h3 text-ink-muted";
const IMAGE_ITEM = "h-12 w-auto";

// Reduced-motion via useSyncExternalStore: o servidor (e a hidratação) vê
// "reduce", então o HTML pré-renderizado traz a lista estática (SPEC §5.11).
function subscribeReduce(onChange: () => void) {
  const mq = window.matchMedia(MOTION_QUERIES.reduce);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getReduce = () => window.matchMedia(MOTION_QUERIES.reduce).matches;
const getReduceServer = () => true;

function Items(props: TextItems | ImageItems, nowrap: boolean): ReactNode {
  if (props.content === "text") {
    return props.items.map((name, i) => (
      <li key={`${i}-${name}`} className={nowrap ? `${TEXT_ITEM} whitespace-nowrap` : TEXT_ITEM}>
        {name}
      </li>
    ));
  }
  return props.items.map((logo, i) => (
    <li key={`${i}-${logo.src}`}>
      <img
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        loading="lazy"
        decoding="async"
        className={IMAGE_ITEM}
      />
    </li>
  ));
}

function Marquee({ label, children }: { label: string; children: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLUListElement>(null);
  const anim = useRef<Animation | null>(null);
  const [clones, setClones] = useState(1);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const trackId = useId();

  const running = visible && !userPaused && !hovered && !focused;
  const runningRef = useRef(running);

  // Antes do efeito que cria a animação, para ela nascer no estado certo.
  useEffect(() => {
    runningRef.current = running;
    const a = anim.current;
    if (!a) return;
    if (running) a.play();
    else a.pause();
  }, [running]);

  // Fora da tela, parado: não gasta frame com o que ninguém vê.
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Uma volta = largura de uma cópia, a MARQUEE_SPEED × --motion-scale px/s.
  // As cópias cobrem a viewport, então o salto de -largura para 0 cai num
  // quadro idêntico: loop sem emenda. Só transform (SPEC §5.3), via Web
  // Animations: roda no compositor, e a curva padrão já é linear.
  useEffect(() => {
    const vp = viewport.current;
    const tr = track.current;
    const copy = first.current;
    if (!vp || !tr || !copy) return;
    let current = 0;

    const build = () => {
      const width = copy.getBoundingClientRect().width;
      if (!width) return;
      setClones(Math.max(1, Math.ceil(vp.clientWidth / width)));
      const duration = (width / (MARQUEE_SPEED * motionScale(tr))) * 1000;
      if (duration === current && anim.current) return;

      // Recria mantendo a fração da volta, para a troca não dar salto.
      const prev = anim.current;
      const time = prev?.currentTime;
      const progress = typeof time === "number" && current ? (time % current) / current : 0;
      prev?.cancel();

      const a = tr.animate(
        [{ transform: "translateX(0)" }, { transform: `translateX(${-width}px)` }],
        { duration, iterations: Infinity },
      );
      a.currentTime = progress * duration;
      if (!runningRef.current) a.pause();
      anim.current = a;
      current = duration;
    };

    // Fontes carregando e troca de breakpoint mudam a largura: recalcula.
    const ro = new ResizeObserver(build);
    ro.observe(vp);
    ro.observe(copy);
    return () => {
      ro.disconnect();
      anim.current?.cancel();
      anim.current = null;
    };
  }, []);

  // Hover só com mouse/caneta: no toque, um tap não deixa a faixa presa.
  const onPointerEnter = (e: PointerEvent) => e.pointerType !== "touch" && setHovered(true);
  const onPointerLeave = () => setHovered(false);
  const onFocus = () => setFocused(true);
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
  };

  // Rótulo e toggle refletem só a pausa explícita. Hover e foco pausam sem
  // trocar o rótulo, que fica estável sob o cursor: chegar ao botão já para a
  // faixa, e um acionamento de "Pausar" garante a pausa permanente (WCAG
  // 2.2.2), que continua depois que o mouse ou o foco saem. "Reproduzir"
  // limpa as pausas de hover e foco, então a faixa volta a andar na hora;
  // elas valem de novo na próxima entrada.
  const toggle = () => {
    if (!userPaused) return setUserPaused(true);
    setUserPaused(false);
    setHovered(false);
    setFocused(false);
  };

  return (
    <div
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <Stack gap={4}>
        {/* Sangra até a borda da tela. Direto na Section, já tem a largura
            toda; dentro de um Container (.page-grid), anula a margem lateral
            que ele aplicou. Sem corte seco no meio de um nome na margem. */}
        <div ref={viewport} className="overflow-clip in-[.page-grid]:-mx-(--page-margin)">
          <div ref={track} id={trackId} className="flex w-max">
            <ul ref={first} aria-label={label} className={COPY}>
              {children}
            </ul>
            {/* Cópias do loop: fora da árvore de acessibilidade e da ordem de
                tab. O leitor de tela lê só a lista acima, uma vez. */}
            {Array.from({ length: clones }, (_, i) => (
              <ul key={i} aria-hidden="true" inert className={COPY}>
                {children}
              </ul>
            ))}
          </div>
        </div>
        {/* WCAG 2.2.2: movimento automático com mais de 5s precisa de pausa. */}
        {/* O botão fica no grid: margem lateral fora do Container, nenhuma
            dentro (já aplicada). */}
        <div className="px-(--page-margin) in-[.page-grid]:px-0">
          <Button variant="ghost" onClick={toggle} aria-controls={trackId}>
            {/* Os dois rótulos ocupam a mesma célula: a largura é a do maior,
                então a troca não mexe no layout. Só o visível dá o nome. */}
            <span className="grid">
              <span className="col-start-1 row-start-1">
                {userPaused ? "Reproduzir" : "Pausar"}
              </span>
              <span aria-hidden="true" className="invisible col-start-1 row-start-1">
                {userPaused ? "Pausar" : "Reproduzir"}
              </span>
            </span>
          </Button>
        </div>
      </Stack>
    </div>
  );
}

/**
 * Parceiros em texto ou logo, estático ou em marquee contínuo (SPEC §8). O
 * marquee pausa no hover, no foco e pelo botão; com reduced-motion e sem JS,
 * a lista aparece parada, inteira e com quebra de linha.
 *
 * Marquee = largura total: a faixa sangra até a borda da tela, direto numa
 * <Section> ou dentro de <Container layout="full">. Não use numa coluna de
 * split/thirds/main-aside: o sangramento só anula a margem da página. A lista
 * estática e o botão alinham com o grid.
 */
export function LogoWall(props: LogoWallProps) {
  const { label, mode = "static" } = props;
  const reduce = useSyncExternalStore(subscribeReduce, getReduce, getReduceServer);
  const marquee = mode === "marquee" && !reduce;

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (props.items.length === 0) console.error(`LogoWall "${label}": lista vazia.`);
    const empty =
      props.content === "text"
        ? props.items.some((name) => isEmptyText(name))
        : props.items.some((logo) => isEmptyText(logo.alt));
    if (empty) {
      console.error(
        `LogoWall "${label}": item sem nome (${props.content === "text" ? "texto" : "alt"} vazio).`,
      );
    }
  }, [props.content, props.items, label]);

  if (marquee) return <Marquee label={label}>{Items(props, true)}</Marquee>;

  return (
    <ul
      aria-label={label}
      className={`${ROW} flex-wrap gap-y-4 px-(--page-margin) in-[.page-grid]:px-0`}
    >
      {Items(props, false)}
    </ul>
  );
}
