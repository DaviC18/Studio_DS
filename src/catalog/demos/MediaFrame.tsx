import { Container } from "../../components/ds/layout";
import { MediaFrame, type MediaFocus } from "../../components/ds/MediaFrame";
import { DocEntry, Variant } from "../DocEntry";
import { IMAGE, VIDEO } from "../media";

// focus só muda o que aparece no eixo em que a proporção corta a mídia:
// 16:9 (largo) dentro de 4:5 (alto) corta nas laterais; 4:5 dentro de 16:9
// corta em cima e embaixo.
const HORIZONTAL: readonly MediaFocus[] = ["left", "center", "right"];
const VERTICAL: readonly MediaFocus[] = ["top", "center", "bottom"];

export function MediaFrameDemo() {
  return (
    <DocEntry
      name="MediaFrame"
      use="foto ou vídeo com proporção fixa (16:9, 4:5, 1:1) e legenda opcional; priority só no hero; focus quando a proporção corta a mídia e o assunto não está no centro."
      avoid="ícones ou logos (use img simples); vídeo com som ou que precisa de controles próprios."
      snippet={`
<MediaFrame ratio="video" caption="Torra da manhã"
  media={{ kind: "image", src: "/assets/torra.webp", alt: "Grãos saindo do torrador" }} />
<MediaFrame ratio="square" priority
  media={{ kind: "video", ambient: true, label: "Fumaça", poster: "/assets/p.webp",
           sources: [{ src: "/assets/v.webm", type: "video/webm" }] }} />
{/* imagem 16:9 num frame 4:5: o corte é nas laterais, então focus escolhe o lado */}
<MediaFrame ratio="portrait" focus="left" caption="Sítio Pedra Alta · 1.280 m"
  media={{ kind: "image", src: "/assets/sitio-16x9.webp", alt: "Terreiro ao amanhecer" }} />`}
    >
      <Variant label="ratio: 16:9 · 4:5 · 1:1 · proporção fixa (CLS zero), máscara que abre com leve zoom, lazy por padrão, vídeo de ambiente com botão de pausa e parado em reduced-motion">
        <Container layout="thirds" gap={12}>
          <MediaFrame ratio="video" media={IMAGE.wide} caption="16:9, imagem" />
          <MediaFrame ratio="portrait" media={IMAGE.tall} caption="4:5, imagem" />
          <MediaFrame ratio="square" media={VIDEO} caption="1:1, vídeo de ambiente" />
        </Container>
      </Variant>
      <Variant label='focus no corte lateral: a mesma imagem 16:9 num frame 4:5 — "left", "center" (padrão) e "right"'>
        <Container layout="thirds" gap={12}>
          {HORIZONTAL.map((focus) => (
            <MediaFrame
              key={focus}
              ratio="portrait"
              focus={focus}
              media={IMAGE.wide}
              caption={`focus="${focus}"`}
            />
          ))}
        </Container>
      </Variant>
      <Variant label='focus no corte vertical: imagem 4:5 num frame 16:9 — "top", "center" (padrão) e "bottom"'>
        <Container layout="thirds" gap={12}>
          {VERTICAL.map((focus) => (
            <MediaFrame
              key={focus}
              ratio="video"
              focus={focus}
              media={IMAGE.tall}
              caption={`focus="${focus}"`}
            />
          ))}
        </Container>
      </Variant>
    </DocEntry>
  );
}
