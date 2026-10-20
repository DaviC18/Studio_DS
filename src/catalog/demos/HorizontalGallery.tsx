import {
  HorizontalGallery,
  type GalleryCaptionItem,
  type GalleryQuoteItem,
} from "../../components/ds/HorizontalGallery";
import { DocEntry, Variant } from "../DocEntry";
import { IMAGE } from "../media";

// Legendas da Spec Golden Grains §6, seção 3 (local · altitude). No catálogo,
// a mídia abstrata do §6 se repete; o alt descreve a imagem real, não a legenda.
const CAPTIONS: readonly GalleryCaptionItem[] = [
  { image: IMAGE.tall, caption: "Sítio Pedra Alta · 1.280 m" },
  { image: IMAGE.square, caption: "Fazenda Boa Vista do Rio · 1.150 m" },
  { image: IMAGE.wide, caption: "Sítio Três Nascentes · 1.320 m" },
  { image: IMAGE.tall, caption: "Colheita seletiva, maio" },
  { image: IMAGE.square, caption: "Terreiro suspenso, junho" },
];

// Textos da Spec Golden Grains §6 (manifesto e depoimento, ambos fictícios).
const QUOTES: readonly GalleryQuoteItem[] = [
  {
    image: IMAGE.wide,
    quote: "A Golden Grains mudou nosso espresso. A consistência de torra é rara.",
    cite: "Marina, Café do Largo",
  },
  { image: IMAGE.tall, quote: "Não temos pressa." },
  { image: IMAGE.square, quote: "A torra leva o tempo que o grão pede." },
  { image: IMAGE.wide, quote: "Doze minutos, às vezes catorze." },
  { image: IMAGE.tall, quote: "É nesse intervalo que o café encontra a própria voz." },
];

export function HorizontalGalleryDemo() {
  return (
    <DocEntry
      name="HorizontalGallery"
      use="sequência de 4 a 8 imagens que conta um percurso (lugares, etapas), com legenda curta ou citação; uma por página."
      avoid="itens para comparar ou escolher (use CollectionGrid); imagem que o usuário precisa ver toda de uma vez; menos de 3 itens."
      snippet={`
<Section space={24} labelledBy="origem-title">
  <Container><h2 id="origem-title" className="type-h2">De onde vem</h2></Container>
  {/* sangra até a borda: direto na Section ou num Stack, fora do Container.
      Dentro de um Container, alinha ao grid e corta na margem (é o caso aqui no catálogo). */}
  <HorizontalGallery labelledBy="origem-title" items={[
    { image: { kind: "image", src: "/assets/pedra-alta.webp", alt: "…" },
      caption: "Sítio Pedra Alta · 1.280 m" },
  ]} />
</Section>
<HorizontalGallery variant="quote" label="O que dizem" ratio="video" items={[
  { image, quote: "A consistência de torra é rara.", cite: "Marina, Café do Largo" },
]} />`}
    >
      <Variant label="com legenda, 4:5 · desktop sem reduced-motion: scrub, prende 1 viewport · resto: scroll-snap nativo, Tab + setas · no catálogo fica dentro de um Container: alinha ao grid, sem sangrar">
        <HorizontalGallery label="Galeria das fazendas (exemplo)" items={CAPTIONS} />
      </Variant>
      <Variant label="com citação, 16:9">
        <HorizontalGallery
          variant="quote"
          ratio="video"
          label="Citações sobre a torra (exemplo)"
          items={QUOTES}
        />
      </Variant>
    </DocEntry>
  );
}
