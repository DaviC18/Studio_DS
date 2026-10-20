# Spec do site: Golden Grains

Oct 19, 2026 · @Davi Curty

Site de teste single page para uma torrefação fictícia, construído pela equipe de agentes sobre o design system (tema `torrefacao`). Objetivo: provar que o processo entrega um site cinematográfico de ponta a ponta.

## 1. Conceito

Golden Grains é uma torrefação fictícia de cafés especiais do Sul de Minas. O site se move como uma torra: começa lento, esquenta no meio e termina intenso.

| Campo | Decisão |
| --- | --- |
| Cliente | Golden Grains Torrefação (fictícia), cafés especiais, Sul de Minas |
| Conceito em 1 frase | "Cada grão no seu tempo": um site que tem a paciência da torra e a intensidade da xícara |
| 3 palavras de personalidade | artesanal, precisa, calorosa |
| 3 palavras que o site NÃO é | rústico de fazendinha, gourmet pretensioso, genérico |
| Metáfora de movimento | calor que sobe: revelações de baixo para cima, lentas, que se dissipam como fumaça; nada entra pelos lados |
| Referências | o princípio do landonorris.com de uma ideia e uma interação forte por seção, e o acento único com disciplina. Não pegar layout, 3D nem tipografia |
| Anti-referências | sites de cafeteria com foto de xícara em mesa de madeira e fonte manuscrita; e-commerce com grid de produtos e selo de desconto |

O rodapé leva a linha "Site conceitual · marca fictícia", para o site poder ir para o portfólio sem ser confundido com uma marca real.

## 2. Público e conversão

A ação principal é assinar o clube pelo WhatsApp. É um link nativo `wa.me`, então funciona antes do JS carregar (SPEC §10).

| Campo | Decisão |
| --- | --- |
| Público principal | quem bebe café especial em casa, 25 a 45 anos, já tem método (V60, prensa, espresso) e chega pelo Instagram |
| Dispositivo dominante | mobile primeiro (assumido: \~80% vindo do Instagram) |
| Ação principal | "Assine o clube": abre o WhatsApp com mensagem pronta |
| Ações secundárias | ver os cafés do mês; seguir no Instagram |
| Onde o CTA aparece | Nav (fixo), Hero, seção Clube e Footer |
| Métrica de sucesso | cliques no CTA do WhatsApp / visitas |
| Conteúdo | textos desta spec (finais, sem lorem ipsum); fotos e vídeo de bancos com licença comercial (§5) |
| Idiomas | pt-BR |

**Mensagem pronta do WhatsApp:** "Olá! Quero assinar o Clube Golden Grains." O número fica em `site.config.ts` como placeholder e é o único dado fictício que precisa ser trocado num cliente real.

## 3. Arquitetura narrativa

Oito seções numa única página, seguindo o ritmo da torra: calma no começo, aquecendo no meio e intensa no fim. Os portais viram âncoras para seções da própria página.

| # | Seção | Âncora | Papel | Interação de destaque | Intensidade |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | `#inicio` | Quem é | título revelado em CSS + vídeo da torra | Alta |
| 2 | Manifesto | `#manifesto` | No que acredita | texto revelado linha a linha | Baixa |
| 3 | Origem | `#origem` | Por que confiar | galeria horizontal das fazendas + números | Média |
| 4 | Portais | — | Para onde ir | dois cards grandes com troca de imagem | Média |
| 5 | Cafés | `#cafes` | O que é único | grid dos lotes: grão vira xícara no hover | Alta |
| 6 | Clube | `#clube` | O que fazer agora | CTA do WhatsApp com micro-interação | Média |
| 7 | Parceiros | `#parceiros` | Quem mais confia | marquee de cafeterias + 1 depoimento | Baixa |
| 8 | Footer | `#contato` | Última impressão | frase gigante + CTA final | Alta |

A 404 não entra neste teste: o site é de uma página só. Fica para o primeiro cliente com várias páginas.

## 4. Tema e motion

Nada novo: o site usa o tema `torrefacao` e o motion system como estão no design system. Se uma seção precisar de token novo, é sinal de problema, e o agente devolve como pergunta.

- **Tema:** `site.config.ts` com `theme: "torrefacao"`, `mode: "production"` e `indexable: true`. É o oposto do catálogo, e prova que o `noindex` não vaza.
- **Ritmo:** `--dur-scene` em 1600ms. As revelações usam `--ease-out` e sobem de baixo, nunca entram pelos lados (metáfora do calor).
- **Acento cobre:** no máximo 3 usos por tela. Reservado para CTA, palavra de destaque e hover.
- **Hero = CSS, scroll = GSAP** (SPEC §5). Elemento já visível na hidratação não anima.

## 5. Objeto herói e assets

O objeto herói é o **vídeo da torra**: grãos girando no tambor do torrador, em loop curto. Ele aparece no hero e volta, como imagem parada, no footer.

| Campo | Decisão |
| --- | --- |
| Objeto herói | vídeo de 6 a 10s, loop, sem áudio: grãos no tambor do torrador |
| Formato | WebM + MP4, 1280px, ≤ 3MB, com poster em AVIF/WebP |
| Fallback | poster estático em reduced-motion e enquanto o vídeo carrega |
| Fonte | bancos com licença comercial gratuita: Pexels (vídeo) e Unsplash (fotos) |

**Inventário** (a fundação busca, otimiza e registra; você aprova as escolhas antes de entrar nas seções)

| Asset | Seção | Busca sugerida | Formato | Licença | Status |
| --- | --- | --- | --- | --- | --- |
| vídeo da torra | 1 | "coffee roasting machine beans" | WebM + MP4 | Pexels License | pendente |
| 5 fotos de fazenda e colheita | 3 | "coffee farm mountains", "coffee cherries harvest" | AVIF/WebP 1600px | Unsplash License | pendente |
| 2 fotos para portais | 4 | "coffee beans close up", "pour over coffee" | AVIF/WebP 1600px | Unsplash License | pendente |
| 12 fotos de lote (6 grão + 6 xícara) | 5 | "roasted coffee beans", "espresso cup top view" | AVIF/WebP 1000px | Unsplash License | pendente |
| 1 foto do clube | 6 | "coffee bag package" | AVIF/WebP 1600px | Unsplash License | pendente |

- Registrar no `SPEC.md` §6 a URL de origem e o autor de cada arquivo.
- Nenhum asset tem logotipo de marca real, rosto em destaque ou embalagem com marca visível.
- As fotos devem ter luz quente e baixa, para casar com o tema escuro. Foto de estúdio com fundo branco não entra.

## 6. Spec por seção

Cada bloco é a unidade de trabalho de um agente `secao`. Todos herdam os critérios padrão do SPEC §7: só tokens, 375/1024/1440px, reduced-motion e teclado. Aqui ficam só os critérios específicos.

### Seção 1 — Hero

- **Objetivo:** em 3 segundos, dizer que é uma torrefação artesanal e mostrar o caminho para assinar.
- **Conteúdo:**
  - Microcopy: "torrefação de cafés especiais · sul de minas · desde 2014"
  - HeroTitle (h1, 2 linhas): "Cada grão" / "no seu tempo."
  - Apoio: "Torramos pouco, toda semana, e entregamos em até 7 dias depois da torra."
  - CTA primário: "Assine o clube" (WhatsApp). CTA ghost: "Conheça os cafés" (`#cafes`)
- **Layout desktop:** título grande à esquerda, vídeo da torra em `MediaFrame` 4:5 à direita (`main-aside`), CTAs abaixo do título.
- **Layout mobile:** microcopy, título, CTAs e depois o vídeo. Os CTAs precisam aparecer sem rolar em 375 × 667.
- **Componentes:** Section, Container, Stack, HeroTitle (`play="load"`), RevealText, Button, MediaFrame (vídeo `ambient`, `priority`).
- **Interação de destaque:** entrada do título em CSS, linha a linha, `--dur-scene`; o vídeo entra com fade depois.
- **Critério específico:** o LCP é o título, não o vídeo; LCP ≤ 2,5s no mobile.

### Seção 2 — Manifesto

- **Objetivo:** mostrar que a lentidão é método, não pose.
- **Conteúdo (RevealText, h2):** "Não temos pressa. A torra leva o tempo que o grão pede: doze minutos, às vezes catorze. É nesse intervalo que o açúcar carameliza, a acidez se acalma e o café encontra a própria voz."
- **Destaque em cobre:** só a palavra "tempo".
- **Layout:** texto centralizado em uma coluna estreita, com muito respiro acima e abaixo (`space` 32 ou 48).
- **Componentes:** Section, Container, RevealText (`by="line"`).
- **Interação de destaque:** revelação linha a linha no scroll, sem scrub.
- **Critério específico:** o leitor de tela lê o parágrafo uma vez só.

### Seção 3 — Origem

- **Objetivo:** provar a origem com lugares e números, sem texto institucional.
- **Conteúdo:**
  - h2: "De onde vem"
  - Galeria (5 fotos) com legendas no formato local · altitude: "Sítio Pedra Alta · 1.280 m", "Fazenda Boa Vista do Rio · 1.150 m", "Sítio Três Nascentes · 1.320 m", "Colheita seletiva, maio", "Terreiro suspenso, junho" (nomes fictícios)
  - StatCounter × 4: 12 produtores parceiros · 1.250 m de altitude média · 86,5 pontos SCA em média (`decimals=1`) · 7 dias da torra ao envio
- **Layout desktop:** h2 à esquerda, galeria horizontal ocupando a largura toda e números em 4 colunas abaixo.
- **Layout mobile:** galeria com arraste nativo (scroll-snap), sem scrub; números em 2 × 2.
- **Componentes:** HorizontalGallery (**novo**), MediaFrame, StatCounter, Stack.
- **Interação de destaque:** no desktop, a galeria anda com o scroll vertical (scrub) e sem prender a página por mais de 1 viewport.
- **Critério específico:** com reduced-motion e no mobile, a galeria vira scroll horizontal nativo, navegável por teclado.

### Seção 4 — Portais

- **Objetivo:** levar a pessoa para o produto ou para a assinatura.
- **Conteúdo:**
  - Portal 1: "Os cafés do mês" · "Seis lotes, torrados nesta semana." → `#cafes`
  - Portal 2: "O clube" · "Café fresco na sua porta, todo mês." → `#clube`
- **Layout:** `split` no desktop; empilhados no mobile.
- **Componentes:** Container, PortalCard × 2.
- **Interação de destaque:** a imagem troca no hover e no foco; no toque, quando o card cruza o centro da tela.
- **Critério específico:** as âncoras rolam com Lenis e o foco vai para o título da seção de destino.

### Seção 5 — Cafés

- **Objetivo:** o momento colecionável. Cada lote parece único, como os capacetes do Lando.
- **Conteúdo:**
  - h2: "Os cafés do mês" · apoio: "Seis lotes. Quando acabam, acabam."
  - 6 itens (nome · processo · notas · pontuação):
    1. Pedra Alta · natural · chocolate amargo, laranja · 86
    2. Boa Vista · cereja descascado · caramelo, castanha · 85
    3. Três Nascentes · fermentado · frutas vermelhas, vinho · 88
    4. Mantiqueira · natural · mel, damasco · 87
    5. Serra Fria · lavado · limão-siciliano, flor branca · 86
    6. Brasa da Casa · blend · cacau, rapadura · 84
- **Layout:** grid de 3 colunas no desktop, 2 no tablet e 1 no mobile.
- **Componentes:** CollectionGrid (**novo**), MediaFrame.
- **Interação de destaque:** imagem base é o grão; no hover ou foco vira a xícara, com a pontuação em cobre. No mobile, a troca acontece quando o item cruza o centro da tela.
- **Critério específico:** sem layout shift na troca; as notas sensóriais são texto real, não parte da imagem.

### Seção 6 — Clube

- **Objetivo:** conversão. Uma oferta, um botão.
- **Conteúdo:**
  - h2: "Clube Golden Grains"
  - Apoio: "Dois cafés do mês, torrados na semana do envio, na sua porta."
  - 3 itens: "Torra na semana do envio" · "Moído para o seu método ou em grão" · "Pausa ou cancela pelo WhatsApp"
  - Preço: "a partir de R$ 59/mês" (fictício)
  - CTA primário: "Assine pelo WhatsApp"
- **Layout:** `split`, com a foto do pacote de um lado e a oferta do outro; no mobile, a oferta vem primeiro.
- **Componentes:** Section (`tone` de superfície), Container, Stack, MediaFrame (`mask`), Button.
- **Interação de destaque:** a foto abre com o preset `mask`; o botão usa o hover padrão, sem efeito extra.
- **Critério específico:** o CTA funciona sem JS e abre o WhatsApp com a mensagem pronta.

### Seção 7 — Parceiros

- **Objetivo:** prova social discreta.
- **Conteúdo:**
  - Microcopy: "onde servem nosso café"
  - Nomes de cafeterias, como texto, sem logos: "Café do Largo", "Moinho Azul", "Coado & Cia", "Casa Alvorada", "Ponto Torto", "Vila Grana" (fictícios)
  - 1 depoimento: "A Golden Grains mudou nosso espresso. A consistência de torra é rara." — Marina, Café do Largo (fictício)
- **Componentes:** LogoWall (**novo**, variante texto e marquee), RevealText.
- **Interação de destaque:** marquee contínuo e lento, que pausa no hover, no foco e com reduced-motion.
- **Critério específico:** o marquee tem botão de pausa (WCAG 2.2.2) e o leitor de tela lê a lista uma vez.

### Seção 8 — Footer

- **Objetivo:** última impressão e último CTA.
- **Conteúdo:**
  - Frase gigante (display): "Café bom não tem pressa."
  - CTA: "Assine o clube" (WhatsApp)
  - Endereço (fictício): "Rua das Brasas, 214 · Santa Rita do Sapucaí, MG". Horário da torra aberta: "sábados, 9h às 13h"
  - Links: Instagram, WhatsApp
  - Linha final: "© 2026 Golden Grains · Site conceitual · marca fictícia"
- **Componentes:** Footer (**novo**), HeroTitle (`as="p"`, `play="scroll"`), Button, MediaFrame (poster do vídeo do hero).
- **Interação de destaque:** a frase revela linha a linha quando o footer entra; precisa disparar mesmo sendo o fim da página (`clamp`).
- **Critério específico:** em 375px, a frase cabe sem scroll horizontal.

## 7. Componentes novos

A fundação cria 5 componentes antes de qualquer seção. Todos já estão na lista do SPEC §8, então a regra dos 2 projetos não se aplica.

| Componente | Usado em | Requisitos além do SPEC §8 |
| --- | --- | --- |
| `Nav` | todas | fixo; wordmark "Golden Grains" em texto + CTA; menu fullscreen no mobile com foco preso e Esc para fechar; esconde ao rolar para baixo e volta ao rolar para cima |
| `HorizontalGallery` | 3 | scrub só no desktop sem reduced-motion; no resto, scroll-snap nativo e teclado; prende no máximo 1 viewport |
| `CollectionGrid` | 5 | 2 imagens por item sem layout shift; troca no hover, no foco e no centro da tela (toque); texto fora da imagem |
| `LogoWall` | 7 | variantes `text` e `image`; marquee com botão de pausa; lista lida uma vez pelo leitor de tela |
| `Footer` | 8 | frase display, CTA, colunas de contato e links; dispara a revelação mesmo no fim da página |

O `Nav` é o único que fica sempre na tela. Ele precisa de atenção com o LCP e o CLS: não pode empurrar o hero quando carregar.

## 8. Plano de execução

Sete rodadas de `/orquestrar`, em sequência. Cada uma termina com PASSA do revisor e um commit seu antes da próxima. Duas paradas são obrigatórias: você aprova as fotos (rodada 2) e faz a revisão visual (rodada 7).

1. **Estrutura** (fundação): o catálogo sai da raiz (`/catalogo` ou build separado), o site vira a raiz, e `site.config.ts` fica com o tema `torrefacao`, `production` e `indexable: true`. O build continua gerando o catálogo.
2. **Assets** (fundação): busca e otimiza o inventário do §5, registra no SPEC §6 e **para** para você aprovar as escolhas.
3. **Componentes novos** (fundação): Nav, HorizontalGallery, CollectionGrid, LogoWall e Footer, todos no catálogo.
4. **Hero + Nav** (secao + motion): a seção 1 com o vídeo; o motion cuida da entrada em CSS e do fallback.
5. **Seções 2 a 4** (secao, uma por vez).
6. **Seções 5 a 8** (secao, uma por vez).
7. **Revisão final** (revisor + você): checklist completo do SPEC §10 e §12, Lighthouse mobile, teste só por teclado, preview na Vercel e **sua revisão no celular real**.

Prompt da primeira rodada:

```text
/orquestrar Leia Spec_Golden_Grains.md (spec do site Golden Grains) e execute a
rodada 1 do plano de execução (§8): estrutura. Não avance para a
rodada 2.
```

## 9. Perguntas abertas

Assumi um padrão para cada uma. Mude o que não fizer sentido antes da rodada 1.

1. **Nome e cidade:** Golden Grains, em Santa Rita do Sapucaí (MG). Os nomes de fazendas, cafeterias e pessoas são inventados.
2. **Preço visível:** "a partir de R$ 59/mês". Mostrar preço converte melhor num clube, mas dá para trocar por "consulte no WhatsApp".
3. **Depoimento fictício:** está no site de teste e coberto pela linha "marca fictícia" do rodapé. Num cliente real, só entram depoimentos reais.
4. **Catálogo:** vai para `/catalogo` no mesmo build, com `noindex`. A alternativa é um build separado, mas aí o catálogo deixa de ser testado junto com o site.
5. **Galeria com scrub no desktop:** é a interação mais arriscada para performance e acessibilidade. Se o revisor reprovar duas vezes, o plano B é scroll-snap em todos os tamanhos.
