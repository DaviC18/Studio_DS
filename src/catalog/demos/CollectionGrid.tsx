import { CollectionGrid, type CollectionItem } from "../../components/ds/CollectionGrid";
import { DocEntry, Variant } from "../DocEntry";
import { PORTAL } from "../media";

// Os 6 lotes da Spec Golden Grains §6.5 (nome · processo · notas · pontuação).
// Mídia do catálogo: base = torra, ativa = crema (no site, grão → xícara).
const LOTES: ReadonlyArray<CollectionItem> = [
  ["Pedra Alta", "natural", "chocolate amargo, laranja", "86"],
  ["Boa Vista", "cereja descascado", "caramelo, castanha", "85"],
  ["Três Nascentes", "fermentado", "frutas vermelhas, vinho", "88"],
  ["Mantiqueira", "natural", "mel, damasco", "87"],
  ["Serra Fria", "lavado", "limão-siciliano, flor branca", "86"],
  ["Brasa da Casa", "blend", "cacau, rapadura", "84"],
].map(([name, process, notes, highlight]) => ({
  name,
  process,
  notes,
  highlight,
  highlightUnit: "pontos",
  image: PORTAL.c,
  activeImage: PORTAL.a,
}));

export function CollectionGridDemo() {
  return (
    <DocEntry
      name="CollectionGrid"
      use="coleção de itens parecidos (lotes, produtos, peças) em que cada um troca de imagem no hover, no foco e no toque, com um número em destaque. 4 colunas só para desktop com mouse."
      avoid="o item leva a outra página (use PortalCard); a informação está só na imagem; mais de 12 itens ou itens que precisam de filtro; 4 colunas em público de toque (no toque, cada lote fica ativo só ~80px de rolagem)."
      snippet={`
<CollectionGrid columns={3} items={[
  { name: "Pedra Alta", process: "natural", notes: "chocolate amargo, laranja",
    highlight: "86", highlightUnit: "pontos",
    image: { src: "/assets/grao.webp" }, activeImage: { src: "/assets/xicara.webp" } },
]} />
<CollectionGrid columns={2} ratio="portrait" nameAs="h4" items={…} />`}
    >
      <Variant label="3 colunas (1 no mobile, 2 a partir de 640px), 1:1 · os 6 lotes">
        <CollectionGrid nameAs="h4" items={LOTES} />
      </Variant>
      <Variant label="2 colunas, 4:5, destaque sem unidade">
        <CollectionGrid
          nameAs="h4"
          columns={2}
          ratio="portrait"
          items={LOTES.slice(0, 2).map((l) => ({ ...l, highlightUnit: undefined }))}
        />
      </Variant>
      <Variant label="4 colunas, 1:1, sem notas">
        <CollectionGrid
          nameAs="h4"
          columns={4}
          items={LOTES.slice(0, 4).map((l) => ({ ...l, notes: undefined }))}
        />
      </Variant>
    </DocEntry>
  );
}
