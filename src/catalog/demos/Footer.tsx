import {
  Footer,
  type FooterContact,
  type FooterLink,
  type FooterLinks,
} from "../../components/ds/Footer";
import { DocEntry, Variant } from "../DocEntry";
import { IMAGE } from "../media";

// Conteúdo da Spec Golden Grains §6, seção 8. No catálogo, os links apontam
// para a própria página (sem número de WhatsApp nem perfil real).
const HREF = "#componentes";

const CTA: FooterLink = { label: "Assine o clube", href: HREF };

const CONTACT: readonly FooterContact[] = [
  { label: "endereço", value: "Rua das Brasas, 214 · Santa Rita do Sapucaí, MG" },
  { label: "torra aberta", value: "sábados, 9h às 13h" },
];

const LINKS: FooterLinks = {
  label: "redes",
  items: [
    { label: "Instagram", href: HREF },
    { label: "WhatsApp", href: HREF },
  ],
};

const LEGAL = "© 2026 Golden Grains · Site conceitual · marca fictícia";

export function FooterDemo() {
  return (
    <DocEntry
      name="Footer"
      use="fim da página: frase de impacto, último CTA, contato, links e linha legal; uma vez por página."
      avoid="o bloco não é o último da página, ou não há frase de impacto (para só links e legal, use Stack simples)."
      snippet={`
<Footer
  id="contato"
  phrase={["Café bom", "não tem", "pressa."]}
  cta={{ label: "Assine o clube", href: "https://wa.me/…" }}
  contact={[{ label: "endereço", value: "Rua das Brasas, 214 · …" }]}
  links={{ label: "redes", items: [{ label: "Instagram", href: "https://instagram.com/…" }] }}
  legal="© 2026 Golden Grains · Site conceitual · marca fictícia"
  media={{ kind: "image", src: "/assets/torra-poster.webp", alt: "" }}  // opcional, sem máscara
/>`}
    >
      <Variant label="sem objeto herói">
        <Footer
          phrase={["Café bom", "não tem", "pressa."]}
          cta={CTA}
          contact={CONTACT}
          links={LINKS}
          legal={LEGAL}
        />
      </Variant>
      <Variant label="com objeto herói (MediaFrame 4:5, sem máscara: a frase é o destaque)">
        <Footer
          phrase={["Café bom", "não tem", "pressa."]}
          cta={CTA}
          contact={CONTACT}
          links={LINKS}
          legal={LEGAL}
          media={IMAGE.tall}
        />
      </Variant>
    </DocEntry>
  );
}
