import { LogoWall, type LogoImage } from "../../components/ds/LogoWall";
import { DocEntry, Variant } from "../DocEntry";
import { IMAGE } from "../media";

// Nomes fictícios da Spec Golden Grains §6, seção 7.
const CAFES = [
  "Café do Largo",
  "Moinho Azul",
  "Coado & Cia",
  "Casa Alvorada",
  "Ponto Torto",
  "Vila Grana",
] as const;

// Não há logo real no projeto: a variante image usa a mídia abstrata do
// catálogo só para mostrar o encaixe (altura fixa, largura pela proporção).
// O alt diz o nome do parceiro, como faria um logo de verdade.
const SAMPLES = [IMAGE.wide, IMAGE.tall, IMAGE.square];
const LOGOS: readonly LogoImage[] = CAFES.map((name, i) => {
  const img = SAMPLES[i % SAMPLES.length];
  return { src: img.src, alt: name, width: img.width, height: img.height };
});

export function LogoWallDemo() {
  return (
    <DocEntry
      name="LogoWall"
      use="prova social discreta: nomes ou logos de parceiros, clientes ou pontos de venda, em lista estática ou marquee lento."
      avoid="os itens precisam ser comparados ou clicados (use CollectionGrid ou links), ou há só 1 ou 2 parceiros (escreva no texto)."
      snippet={`
<Section space={24} labelledBy="parceiros-title">
  <Container gap={8}>
    <p id="parceiros-title" className="type-micro text-ink-muted">onde servem nosso café</p>
    {/* marquee = largura total: sangra até a borda da tela, direto na Section
        ou em Container layout="full". Nunca numa coluna de split/thirds. */}
    <LogoWall content="text" mode="marquee" label="Cafeterias parceiras"
      items={["Café do Largo", "Moinho Azul", "Coado & Cia"]} />
  </Container>
</Section>
<LogoWall content="image" label="Parceiros"
  items={[{ src: "/assets/parceiros/largo.svg", alt: "Café do Largo", width: 160, height: 48 }]} />`}
    >
      <Variant label="text · marquee, largura total: sangra até a borda da tela, também dentro do Container · hover e foco pausam sem trocar o rótulo; Pausar para de vez em um clique · parado com reduced-motion">
        <LogoWall content="text" mode="marquee" label="Cafeterias parceiras" items={CAFES} />
      </Variant>
      <Variant label="text · static (também é o marquee sem JS)">
        <LogoWall content="text" label="Cafeterias parceiras" items={CAFES} />
      </Variant>
      <Variant label="image · marquee (mídia de exemplo do catálogo, não são logos reais)">
        <LogoWall content="image" mode="marquee" label="Parceiros" items={LOGOS} />
      </Variant>
      <Variant label="image · static (mídia de exemplo do catálogo, não são logos reais)">
        <LogoWall content="image" label="Parceiros" items={LOGOS} />
      </Variant>
    </DocEntry>
  );
}
