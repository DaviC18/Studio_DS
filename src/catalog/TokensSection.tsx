import type { ReactNode } from "react";
import { Container, Section, Stack } from "../components/ds";
import { useHydrated } from "../lib/hydrated";
import type { DurationToken, EaseToken } from "../lib/motion";
import { contrast, toHex, token } from "./css";
import { EaseCurve } from "./EaseCurve";

const COLORS = [
  { name: "bg", swatch: "bg-bg", use: "fundo principal" },
  { name: "surface", swatch: "bg-surface", use: "cards, seções alternadas" },
  { name: "ink", swatch: "bg-ink", use: "texto principal", text: true },
  { name: "ink-muted", swatch: "bg-ink-muted", use: "legendas, microcopy", text: true },
  { name: "accent", swatch: "bg-accent", use: "CTA, destaque, hover (máx. 3 por tela)", text: true },
  { name: "line", swatch: "bg-line", use: "bordas e divisores (decorativo)" },
] as const;

const TYPE = [
  { name: "display", cls: "type-display", token: "--text-display", spec: "--font-display" },
  { name: "h2", cls: "type-h2", token: "--text-h2", spec: "--font-h2" },
  { name: "h3", cls: "type-h3", token: "--text-h3", spec: "--font-h3" },
  { name: "body", cls: "type-body", token: "--text-body", spec: "--font-body" },
  { name: "micro", cls: "type-micro", token: "--text-micro", spec: "--font-micro" },
  { name: "button", cls: "type-button", token: "--text-body", spec: "Button" },
] as const;

const SPACE = [
  { step: 1, w: "w-1" }, { step: 2, w: "w-2" }, { step: 4, w: "w-4" }, { step: 6, w: "w-6" },
  { step: 8, w: "w-8" }, { step: 12, w: "w-12" }, { step: 16, w: "w-16" }, { step: 24, w: "w-24" },
  { step: 32, w: "w-32" }, { step: 48, w: "w-48" },
] as const;

const EASES: EaseToken[] = ["out", "in-out", "snap"];
const DURATIONS: DurationToken[] = ["fast", "base", "slow", "scene"];

/** Valor ainda desconhecido no HTML pré-renderizado (estilos só existem no browser). */
const PENDING = "…";

/** Lê um token resolvido; antes da hidratação devolve PENDING. */
function useToken() {
  const ready = useHydrated();
  return (name: string) => (ready ? token(name) : PENDING);
}

function ms(value: string) {
  if (value === PENDING) return value;
  const n = parseFloat(value);
  return `${value.endsWith("ms") ? n : n * 1000}ms`;
}

function Colors() {
  const read = useToken();
  const bg = read("--color-bg");
  const surface = read("--color-surface");
  return (
    <Container layout="thirds" gap={8}>
      {COLORS.map((c) => {
        const value = read(`--color-${c.name}`);
        const known = value !== PENDING;
        const onBg = known ? contrast(value, bg) : 0;
        const onSurface = known ? contrast(value, surface) : 0;
        return (
          <Stack key={c.name} direction="row" gap={4} align="start">
            <div className={`catalog-swatch shrink-0 rounded-base border border-line ${c.swatch}`} />
            <Stack gap={1}>
              <p translate="no" className="type-button">--color-{c.name}</p>
              <p translate="no" className="font-code tabular-nums type-micro">{known ? toHex(value) : PENDING}</p>
              <p className="type-micro text-ink-muted">{c.use}</p>
              {"text" in c && (
                <p className="tabular-nums type-micro">
                  {known ? (
                    <>
                      {onBg.toFixed(2)} sobre bg · {onSurface.toFixed(2)} sobre surface ·{" "}
                      {Math.min(onBg, onSurface) >= 4.5 ? "AA ok" : "abaixo de AA"}
                    </>
                  ) : (
                    PENDING
                  )}
                </p>
              )}
            </Stack>
          </Stack>
        );
      })}
    </Container>
  );
}

function Typography() {
  const read = useToken();
  return (
    <Stack gap={12}>
      {TYPE.map((t) => (
        <Stack key={t.name} gap={2}>
          <p translate="no" className="font-code tabular-nums type-micro text-ink-muted">
            {t.spec} · {t.token}: {read(t.token)}
          </p>
          <p className={t.cls}>Ação épica na torréfação</p>
        </Stack>
      ))}
    </Stack>
  );
}

function Spacing() {
  return (
    <Stack gap={2}>
      {SPACE.map((s) => (
        <Stack key={s.step} direction="row" gap={4} align="center">
          <p className="w-12 shrink-0 font-code type-micro">{s.step}</p>
          <p className="w-16 shrink-0 font-code type-micro text-ink-muted">{s.step * 4}px</p>
          <div className={`h-2 bg-ink-muted ${s.w}`} />
        </Stack>
      ))}
    </Stack>
  );
}

function Motion() {
  const read = useToken();
  return (
    <Container layout="split" gap={12}>
      <Stack direction="row" gap={8} wrap>
        {EASES.map((e) => (
          <EaseCurve key={e} name={e} />
        ))}
      </Stack>
      <Stack gap={2}>
        <Stack as="dl" gap={2}>
          {DURATIONS.map((d) => (
            <Stack key={d} direction="row" gap={4} justify="between">
              <dt translate="no" className="font-code tabular-nums type-micro">--dur-{d}</dt>
              <dd translate="no" className="font-code tabular-nums type-micro">{ms(read(`--dur-${d}`))}</dd>
            </Stack>
          ))}
          <Stack direction="row" gap={4} justify="between">
            <dt translate="no" className="font-code tabular-nums type-micro">--stagger</dt>
            <dd translate="no" className="font-code tabular-nums type-micro">{ms(read("--stagger"))}</dd>
          </Stack>
        </Stack>
        <p className="type-micro text-ink-muted">
          --dur-scene é o único que o tema muda (1200–1600ms). No mobile os presets usam 70%.
        </p>
      </Stack>
    </Container>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack gap={8}>
      <h3 className="type-h3">{title}</h3>
      {children}
    </Stack>
  );
}

function Radius() {
  const read = useToken();
  return (
    <Stack direction="row" gap={4} align="center">
      <div className="catalog-swatch rounded-base border border-ink-muted" />
      <p translate="no" className="font-code tabular-nums type-micro">--radius-base: {read("--radius-base")}</p>
    </Stack>
  );
}

export function TokensSection() {
  return (
    <Section id="tokens" labelledBy="tokens-title" space={24}>
      <Container gap={16}>
        <h2 id="tokens-title" className="type-h2">
          Tokens
        </h2>
        <Block title="Cor">
          <Colors />
        </Block>
        <Block title="Tipografia">
          <Typography />
        </Block>
        <Container layout="split" gap={16}>
          <Block title="Espaço">
            <Spacing />
          </Block>
          <Block title="Raio">
            <Radius />
          </Block>
        </Container>
        <Block title="Motion">
          <Motion />
        </Block>
      </Container>
    </Section>
  );
}
