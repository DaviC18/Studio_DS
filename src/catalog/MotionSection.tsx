import { useRef, useState, type ReactNode } from "react";
import { Button, Container, HeroTitle, MediaFrame, RevealText, Section, Stack } from "../components/ds";
import { useReveal, useStagger, type EaseToken } from "../lib/motion";
import { CodeBlock } from "./CodeBlock";
import { EaseCurve } from "./EaseCurve";
import { IMAGE } from "./media";

type DemoProps = {
  name: string;
  hook: string;
  ease: EaseToken;
  timing: string;
  children: ReactNode;
};

/** Preset ao lado da curva; "Rodar de novo" remonta a demo (cleanup + replay). */
function PresetDemo({ name, hook, ease, timing, children }: DemoProps) {
  const [run, setRun] = useState(0);
  return (
    <article aria-labelledby={`preset-${name}`}>
      <Container layout="main-aside" gap={8}>
        <Stack gap={6}>
          <Stack direction="row" gap={4} align="center" justify="between" wrap>
            <h3 id={`preset-${name}`} className="type-h3">
              {name}
            </h3>
            <Button variant="ghost" onClick={() => setRun((n) => n + 1)}>
              Rodar de novo
            </Button>
          </Stack>
          <div key={run}>{children}</div>
        </Stack>
        <Stack gap={4}>
          <EaseCurve name={ease} />
          <p className="type-micro text-ink-muted">{timing}</p>
          <CodeBlock code={hook} label={`Uso do preset ${name}`} />
        </Stack>
      </Container>
    </article>
  );
}

function RevealBox() {
  const ref = useRef<HTMLParagraphElement>(null);
  useReveal(ref, { scroll: false });
  return (
    <p ref={ref} className="max-w-measure">
      Revelação simples: fade com deslocamento de --reveal-distance (24px, ~17px no mobile).
    </p>
  );
}

function StaggerList() {
  const ref = useRef<HTMLUListElement>(null);
  useStagger(ref, { scroll: false });
  return (
    <ul ref={ref} className="flex flex-wrap gap-4">
      {["Grão", "Torra", "Descanso", "Moagem", "Xícara"].map((item) => (
        <li key={item} className="rounded-base bg-surface px-6 py-4">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function MotionSection() {
  return (
    <Section id="motion" labelledBy="motion-title" space={24}>
      <Container gap={24}>
        <Stack gap={4}>
          <h2 id="motion-title" className="type-h2">
            Motion
          </h2>
          <p className="max-w-measure text-ink-muted">
            Com reduced-motion ligado no sistema, todo preset vira um fade de --dur-fast, sem
            deslocamento.
          </p>
        </Stack>
        <PresetDemo name="revealLines" ease="out" timing="--dur-scene no HeroTitle, --dur-slow no RevealText; --stagger entre linhas" hook={`useRevealLines(ref, { scroll: false, duration: "scene" })\n// ou <HeroTitle lines={[…]} />`}>
          <HeroTitle as="p" play="load" lines={["Ação", "torréfação", "épica"]} />
        </PresetDemo>
        <PresetDemo name="revealWords" ease="out" timing="--dur-slow; --stagger entre palavras" hook={`<RevealText by="word" size="h2">…</RevealText>`}>
          <RevealText as="p" size="h2" by="word">
            Do grão à xícara, sem pressa
          </RevealText>
        </PresetDemo>
        <PresetDemo name="reveal" ease="out" timing="--dur-base; fade + --reveal-distance" hook={`useReveal(ref)              // dispara em "top 85%", uma vez`}>
          <RevealBox />
        </PresetDemo>
        <PresetDemo name="mask" ease="out" timing="--dur-slow; cortina + zoom 1.1 → 1" hook={`<MediaFrame ratio="video" media={…} />   // useMask por dentro`}>
          <MediaFrame ratio="video" media={IMAGE.wide} />
        </PresetDemo>
        <PresetDemo name="stagger" ease="out" timing="--dur-base; --stagger entre filhos" hook={`useStagger(listRef)`}>
          <StaggerList />
        </PresetDemo>
      </Container>
    </Section>
  );
}
