import type { ReactNode } from "react";
import {
  Button,
  Container,
  HeroTitle,
  MediaFrame,
  PortalCard,
  RevealText,
  Section,
  Stack,
  StatCounter,
} from "../components/ds";
import { DocEntry, Variant } from "./DocEntry";
import { IMAGE, PORTAL, VIDEO } from "./media";

/** Célula visível para demonstrar o layout. */
function Cell({ children }: { children: ReactNode }) {
  return <div translate="no" className="rounded-base border border-line bg-surface p-4 font-code type-micro">{children}</div>;
}

export function ComponentsSection() {
  return (
    <Section id="componentes" labelledBy="componentes-title" space={24} tone="surface">
      <Container gap={24}>
        <h2 id="componentes-title" className="type-h2">
          Componentes
        </h2>

        <DocEntry
          name="Button"
          use="ação que o usuário executa: CTA principal (primary), secundária (ghost) ou inline (link)."
          avoid="o item é navegação de menu ou um card inteiro clicável (use PortalCard)."
          snippet={`
<Button href="#agendar">Agendar degustação</Button>
<Button variant="ghost" onClick={abrir}>Ver cardápio</Button>
<Button variant="link" href="#origem">Conhecer a origem</Button>
<Button disabled>Esgotado</Button>`}
        >
          <Variant label="primary · ghost · link">
            <Stack direction="row" gap={4} align="center" wrap>
              <Button href="#componentes">Agendar degustação</Button>
              <Button variant="ghost">Ver cardápio</Button>
              <Button variant="link" href="#componentes">
                Conhecer a origem
              </Button>
            </Stack>
          </Variant>
          <Variant label="disabled (não recebe foco nem clique)">
            <Stack direction="row" gap={4} align="center" wrap>
              <Button disabled>Esgotado</Button>
              <Button variant="ghost" disabled>
                Ver cardápio
              </Button>
              <Button variant="link" href="#componentes" disabled>
                Conhecer a origem
              </Button>
            </Stack>
          </Variant>
        </DocEntry>

        <DocEntry
          name="HeroTitle"
          use="título principal do hero ou de uma seção de abertura, 1 a 3 linhas curtas."
          avoid="o texto passa de 3 linhas ou é parágrafo (use RevealText); já existe um h1 e você não passou as=&quot;h2&quot;."
          snippet={`
<HeroTitle lines={["Café", "de origem"]} />            // h1, toca ao carregar
<HeroTitle as="h2" play="scroll" lines={["Torra lenta"]} />`}
        >
          <Variant label="1 linha">
            <HeroTitle as="p" play="scroll" lines={["Torra"]} />
          </Variant>
          <Variant label="2 linhas">
            <HeroTitle as="p" play="scroll" lines={["Café", "de origem"]} />
          </Variant>
          <Variant label="3 linhas">
            <HeroTitle as="p" play="scroll" lines={["Ação", "torréfação", "épica"]} />
          </Variant>
        </DocEntry>

        <DocEntry
          name="RevealText"
          use="manifesto, parágrafo ou subtítulo que entra no scroll, por linha ou por palavra."
          avoid="texto de interface (labels, botões) ou listas; texto que o usuário precisa ler imediatamente."
          snippet={`
<RevealText>Torramos em lotes pequenos, de manhã.</RevealText>
<RevealText as="h2" size="h2" by="word">Do grão à xícara</RevealText>`}
        >
          <Container layout="split" gap={12}>
            <Variant label="por linha, body">
              <RevealText>
                Torramos em lotes pequenos, sempre de manhã, e anotamos cada curva de temperatura.
                O café sai da torra, descansa dois dias e só depois vai para a xícara.
              </RevealText>
            </Variant>
            <Variant label="por palavra, h2">
              <RevealText as="p" size="h2" by="word">
                Do grão à xícara
              </RevealText>
            </Variant>
          </Container>
        </DocEntry>

        <DocEntry
          name="MediaFrame"
          use="foto ou vídeo com proporção fixa (16:9, 4:5, 1:1) e legenda opcional; priority só no hero."
          avoid="ícones ou logos (use img simples); vídeo com som ou que precisa de controles próprios."
          snippet={`
<MediaFrame ratio="video" caption="Torra da manhã"
  media={{ kind: "image", src: "/assets/torra.webp", alt: "Grãos saindo do torrador" }} />
<MediaFrame ratio="square" priority
  media={{ kind: "video", ambient: true, label: "Fumaça", poster: "/assets/p.webp",
           sources: [{ src: "/assets/v.webm", type: "video/webm" }] }} />`}
        >
          <Container layout="thirds" gap={12}>
            <MediaFrame ratio="video" media={IMAGE.wide} caption="16:9, imagem" />
            <MediaFrame ratio="portrait" media={IMAGE.tall} caption="4:5, imagem" />
            <MediaFrame ratio="square" media={VIDEO} caption="1:1, vídeo de ambiente" />
          </Container>
        </DocEntry>

        <DocEntry
          name="PortalCard"
          use="link grande para outra seção ou página, com imagem que troca no hover, foco e toque."
          avoid="lista longa de itens parecidos (use CollectionGrid) ou ação que não navega (use Button)."
          snippet={`
<Container layout="split">          {/* 2 colunas; "thirds" = 3 */}
  <PortalCard href="#origem" title="Origem" description="Fazendas e lotes."
    image={{ src: "/assets/a.webp" }} hoverImage={{ src: "/assets/b.webp" }} />
</Container>`}
        >
          <Variant label="2 colunas (Container split)">
            <Container layout="split" gap={12}>
              <PortalCard titleAs="h4" href="#componentes" title="Torra clara" description="Notas cítricas e corpo leve." image={PORTAL.a} hoverImage={PORTAL.b} />
              <PortalCard titleAs="h4" href="#componentes" title="Torra escura" description="Chocolate amargo e corpo denso." image={PORTAL.c} hoverImage={PORTAL.b} />
            </Container>
          </Variant>
          <Variant label="3 colunas (Container thirds), 1:1">
            <Container layout="thirds" gap={12}>
              {["Origem", "Processo", "Loja"].map((t) => (
                <PortalCard key={t} titleAs="h4" href="#componentes" title={t} ratio="square" image={PORTAL.d} hoverImage={PORTAL.e} />
              ))}
            </Container>
          </Variant>
        </DocEntry>

        <DocEntry
          name="StatCounter"
          use="número que prova algo (anos, clientes, volume), com legenda curta embaixo; conta ao entrar na viewport."
          avoid="o número muda em tempo real, é negativo ou é dado de tabela; mais de 4 números lado a lado."
          snippet={`
<Container layout="thirds" gap={12}>
  <StatCounter value={12} suffix=" anos" label="torrando em lotes pequenos" />
  <StatCounter value={1200} prefix="R$ " label="ticket médio por cliente" />
  <StatCounter value={98} suffix="%" label="lotes rastreados" />
</Container>
<StatCounter value={4.8} decimals={1} suffix=" de 5" label="nota média na degustação" />
<StatCounter size="display" value={45000} suffix="+" label="xícaras por ano" />`}
        >
          <Variant label="h2, com unidade (prefixo, sufixo) e sem unidade · Container thirds">
            <Container layout="thirds" gap={12}>
              <StatCounter value={12} suffix=" anos" label="torrando em lotes pequenos" />
              <StatCounter value={1200} prefix="R$ " label="ticket médio por cliente" />
              <StatCounter value={340} label="fazendas parceiras" />
            </Container>
          </Variant>
          <Variant label="decimals={1}: vírgula pt-BR, casas fixas durante a contagem">
            <StatCounter value={4.8} decimals={1} suffix=" de 5" label="nota média na degustação" />
          </Variant>
          <Variant label="display">
            <StatCounter size="display" value={45000} suffix="+" label="xícaras servidas por ano" />
          </Variant>
        </DocEntry>

        <DocEntry
          name="Section · Container · Stack"
          use="sempre que houver espaço entre componentes: Section dá o ritmo vertical, Container o grid, Stack a pilha."
          avoid="nunca use div com classes de espaço avulsas; dentro de um componente ds o espaço é dele."
          snippet={`
<Section space={24} tone="surface" theme="neutro">
  <Container layout="main-aside" gap={8}>
    <Stack gap={6}>…</Stack>
    <Stack direction="row" gap={4} wrap>…</Stack>
  </Container>
</Section>`}
        >
          <Variant label="Container: full · split · thirds · main-aside">
            <Stack gap={4}>
              <Container layout="full" gap={4}>
                <Cell>full 12</Cell>
              </Container>
              <Container layout="split" gap={4}>
                <Cell>6</Cell>
                <Cell>6</Cell>
              </Container>
              <Container layout="thirds" gap={4}>
                <Cell>4</Cell>
                <Cell>4</Cell>
                <Cell>4</Cell>
              </Container>
              <Container layout="main-aside" gap={4}>
                <Cell>8</Cell>
                <Cell>4</Cell>
              </Container>
            </Stack>
          </Variant>
          <Variant label="Stack: row, gap 4, wrap · column-to-row">
            <Stack direction="row" gap={4} wrap>
              <Cell>gap 4</Cell>
              <Cell>gap 4</Cell>
              <Cell>gap 4</Cell>
            </Stack>
            <Stack direction="column-to-row" gap={8}>
              <Cell>coluna no mobile</Cell>
              <Cell>linha a partir de 1024px</Cell>
            </Stack>
          </Variant>
        </DocEntry>
      </Container>
    </Section>
  );
}
