---
name: Golden Grains
description: Torrefação de cafés especiais do Sul de Minas. Cada grão no seu tempo.
colors:
  espresso: "#1c1411"
  torra: "#271c17"
  crema: "#f0e6d8"
  juta: "#b3a291"
  cobre: "#c8824f"
  casca: "#3e2f27"
typography:
  display:
    fontFamily: "Big Shoulders Display Variable, Big Shoulders Display Fallback, sans-serif"
    fontSize: "clamp(3.5rem, 0.331rem + 13.521vw, 12.5rem)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "0"
  headline:
    fontFamily: "Big Shoulders Display Variable, Big Shoulders Display Fallback, sans-serif"
    fontSize: "clamp(2.25rem, 0.929rem + 5.634vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "0"
  title:
    fontFamily: "Big Shoulders Display Variable, Big Shoulders Display Fallback, sans-serif"
    fontSize: "clamp(1.5rem, 1.148rem + 1.502vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.01em"
  body:
    fontFamily: "Literata Variable, Literata Fallback, serif"
    fontSize: "clamp(1rem, 0.956rem + 0.188vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Literata Variable, Literata Fallback, serif"
    fontSize: "clamp(0.75rem, 0.706rem + 0.188vw, 0.875rem)"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  base: "8px"
spacing:
  "1": "4px"
  "2": "8px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
  "24": "96px"
  "32": "128px"
  "48": "192px"
components:
  button-primary:
    backgroundColor: "{colors.cobre}"
    textColor: "{colors.espresso}"
    typography: "{typography.body}"
    rounded: "{rounded.base}"
    padding: "8px 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.crema}"
    textColor: "{colors.espresso}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.crema}"
    typography: "{typography.body}"
    rounded: "{rounded.base}"
    padding: "8px 24px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.torra}"
  button-link:
    textColor: "{colors.crema}"
    typography: "{typography.body}"
    height: "44px"
  media-frame:
    backgroundColor: "{colors.torra}"
    rounded: "{rounded.base}"
  portal-card:
    rounded: "{rounded.base}"
    textColor: "{colors.crema}"
  section-surface:
    backgroundColor: "{colors.torra}"
    textColor: "{colors.crema}"
---

# Design System: Golden Grains

<!-- Fonte da verdade: src/styles/base.css (estrutura, igual para todo cliente) e src/styles/themes/torrefacao.css (identidade). Este arquivo descreve o código; se divergir, o código vence e este arquivo é regenerado com /impeccable document. Mudança de token ou tema é decisão do diretor (SPEC §11). -->

## Overview

**Creative North Star: "A Torra Lenta"**

O sistema inteiro sai de uma frase: cada grão no seu tempo. A página é escura como café torrado, com um único calor, o cobre, que aparece pouco e por isso pesa. Nada **entra** pelos lados: as revelações sobem de baixo, devagar, como calor que sobe do tambor, e a cena mais longa usa o topo da faixa permitida (1600ms). A regra vale para entrada e revelação; movimento ambiente contínuo, que não revela nada, é exceção (ver a regra do Marquee). A precisão é artesanal, não rústica: tipografia de cartaz condensada, texto de livro, grid exato e números com casas fixas.

A densidade é baixa. Cada seção tem uma ideia e uma interação forte, e o resto é revelação simples (fade com 24px de subida). O peso visual vem da tipografia gigante e da fotografia de luz quente e baixa, nunca de ornamento, sombra ou gradiente. Os componentes são contidos: o gesto é pequeno e exato e não chama atenção para si.

Rejeições confirmadas na spec do site: nada de rústico de fazendinha, gourmet pretensioso ou genérico; nada de foto de xícara em mesa de madeira com fonte manuscrita; nada de grid de e-commerce com selo de desconto.

**Key Characteristics:**
- Fundo escuro quente (Espresso), uma superfície alternada (Torra) e texto creme.
- Um só acento, o Cobre, em no máximo 3 usos por tela.
- Display condensado gigante (até 200px) contra texto serifado de leitura.
- Plano: sem sombra; a profundidade vem do tom e da fotografia.
- Movimento só de baixo para cima, lento, em `transform` e `opacity`.

## Colors

Paleta de torra: marrons quase pretos, creme de espuma e um cobre de tambor como única cor viva.

### Primary
- **Cobre** (`cobre`): o único acento. CTA primário (fundo do botão), a palavra de destaque de uma seção (ex.: "tempo" no Manifesto), a pontuação do lote no hover do grid e a linha do link no hover. Contraste 5,84 sobre Espresso.

### Neutral
- **Espresso** (`espresso`): fundo da página e texto sobre o Cobre (botão primário).
- **Torra** (`torra`): superfície. Seções alternadas (`Section tone="surface"`), fundo de mídia enquanto carrega e camada de hover do botão ghost.
- **Crema** (`crema`): texto principal, anel de foco e camada de hover do botão primário. Contraste 14,70 sobre Espresso.
- **Juta** (`juta`): texto secundário (legendas, microcopy, descrição de card) e borda do botão ghost. Contraste 7,34.
- **Casca** (`casca`): só decorativa (bordas, divisores). Contraste 1,42: nunca carrega texto nem limite funcional.

### Named Rules
**The Brasa Única Rule.** O Cobre aparece em no máximo 3 usos por tela, reservado a CTA, palavra de destaque e hover. Se uma tela pede um quarto, um deles sai.

**The Brand Stays Home Rule.** Componentes só consomem `--color-*` ou tokens de componente (`--button-*`, `--media-*`, `--portal-*`). `--brand-*` existe só no arquivo de tema, e cor crua fora dos temas reprova no lint.

## Typography

**Display Font:** Big Shoulders Display (variável, com fallback Arial Bold em `size-adjust` 69,61%)
**Body Font:** Literata (variável, com fallback Times New Roman em `size-adjust` 113,42%)
**Label/Mono Font:** Literata no microcopy; o monoespaçado do sistema só no catálogo (código).

**Character:** cartaz de armazém contra página de livro. A display é alta, condensada e firme; a Literata dá calor e leitura longa. Os fallbacks têm a largura medida da fonte real, então a troca não muda quebras de linha.

### Hierarchy
- **Display** (700, `display`, 0.9): título do hero (h1, `HeroTitle`), frase gigante do footer e `StatCounter size="display"`. A palavra mais longa do hero cabe em 343px.
- **Headline** (600, `headline`, 0.95): títulos de seção (h2) e números do `StatCounter`.
- **Title** (600, `title`, 1, 0.01em): títulos de card (`PortalCard`) e h3.
- **Body** (400, `body`, 1.6): parágrafos, botões (peso 500, entrelinha 1.2) e `RevealText`. Medida máxima de 68ch.
- **Label** (500, `label`, 1.4): microcopy em caixa baixa, legendas de mídia e de número.

### Named Rules
**The Papel Completo Rule.** Texto usa o papel inteiro (`type-display`, `type-h2`, `type-h3`, `type-body`, `type-micro`): família, tamanho, entrelinha e peso juntos. Não existe tamanho de fonte avulso.

**The Máscara com Folga Rule.** Linha revelada por máscara tem folga de 0,25em em cima, 0,2em embaixo e 0,1em nas laterais, para acento (Á É Ã) e cedilha não serem cortados com entrelinha abaixo de 1.

## Layout

Grid de 4 colunas com gutter de 16px no mobile e 12 colunas com gutter de 24px a partir de 1024px. Margem lateral `clamp(16px, 4vw, 64px)`. Breakpoints em 640, 1024 e 1440px. Funciona de 375 a 1920px sem scroll horizontal.

Espaço só na escala de 4, 8, 16, 24, 32, 48, 64, 96, 128 e 192px. O espaço entre componentes é da seção: `Section` dá o ritmo vertical (`space`), `Container` dá o grid (`full`, `split` 6+6, `thirds` 4+4+4, `main-aside` 8+4) e `Stack` empilha. Mobile primeiro; no mobile, distâncias e durações de motion caem cerca de 30% (`--motion-scale` 0.7 abaixo de 1024px).

Mídia em três proporções fixas: 16:9, 4:5 e 1:1. A proporção é reservada antes do carregamento, então CLS zero. Alvo de toque mínimo de 44px.

**The Seção Manda Rule.** Nunca uma `div` com margem avulsa entre componentes: o espaço vem de `Section`, `Container` ou `Stack`.

## Elevation & Depth

Plano por princípio. Não há sombra em nenhum componente. A profundidade vem de três coisas: a alternância de tom entre Espresso e Torra, a fotografia de luz quente e baixa, e o movimento (camadas que sobem, máscara que abre com zoom de 1.1 para 1).

**The Sem Fumaça Falsa Rule.** Nada de `box-shadow`, brilho ou gradiente decorativo. Se algo precisa se destacar, use tom, tamanho ou o Cobre.

**The Marquee é Ambiente Rule.** O "nada entra pelos lados" governa entrada e revelação: o que aparece, aparece subindo. O marquee do `LogoWall` é a única exceção, porque não revela nada: é movimento ambiente contínuo, lento (40 px/s no desktop, ~28 no mobile), linear e sem começo nem fim visível, que pausa no hover, no foco e com reduced-motion. Movimento lateral novo que **revele** conteúdo continua proibido.

## Shapes

Cantos levemente arredondados de 8px (`--radius-base`), iguais em botão, mídia e card. A borda é de 1px e só no botão ghost. A forma recorrente é a máscara retangular: título e mídia se revelam por recorte (`clip-path`), não por fade lateral.

## Components

### Buttons
Precisos e contidos: o gesto é a camada que sobe, nada mais.
- **Shape:** cantos de 8px; altura mínima de 44px; padding de 8px por 24px.
- **Primary:** fundo Cobre e texto Espresso. É o CTA "Assine o clube" (link `wa.me`, funciona sem JS).
- **Hover / Focus:** uma camada Crema sobe de baixo (`translate-y`) em 200ms com `--ease-snap`. Foco por teclado dá o mesmo estado e o anel Crema de 2px com offset de 4px. Sem transição em reduced-motion.

**The Imagem Lenta, Texto Seco Rule.** Numa troca de estado que move imagem e texto juntos (`PortalCard`, `CollectionGrid`), a imagem faz crossfade em `--dur-base` (500ms, `--ease-out`): é a matéria pesada da página e atravessa o limite de 300ms de propósito, como linguagem da marca. O que é texto ou cor no mesmo gesto (a pontuação que vira Cobre, um rótulo) vai em `--dur-fast` (200ms, `--ease-snap`). A imagem assenta, a informação responde na hora.
- **Ghost:** borda de 1px Juta e texto Crema; no hover sobe uma camada Torra.
- **Link:** texto Crema com linha Juta embaixo; no hover, uma linha Cobre cresce da esquerda (`scale-x`).
- **Disabled:** opacidade 0,45 e `disabled` real.

### Cards / Containers
- **PortalCard:** o card inteiro é um link. Cantos de 8px e imagem `absolute` dentro da proporção. No hover, no foco e no centro da tela (toque), a imagem troca por fade de 500ms e aproxima com zoom de 1.04. Título no papel Title, descrição em Body Juta.
- **Section tone="surface":** faixa de largura total em Torra para alternar o ritmo.

### MediaFrame (Signature Component)
Imagem ou vídeo em proporção fixa, com cantos de 8px e fundo Torra enquanto carrega. A máscara abre com leve zoom (1.1 para 1). O vídeo ambiente toca em loop só quando visível, tem botão de pausa (Espresso, texto Crema, 44px) e fica parado em reduced-motion. Legenda em Label Juta, 8px abaixo.

### HeroTitle e RevealText
O título do hero entra só com CSS no primeiro paint: as linhas sobem da máscara com `--dur-scene` (1600ms neste tema), `--ease-out` e 60ms de stagger. `RevealText` revela por linha ou palavra no scroll, com `--dur-slow` (900ms). O leitor de tela lê uma cópia inteira; a parte dividida fica `aria-hidden`.

### StatCounter
Número que conta de 0 ao valor ao entrar na viewport (`--dur-slow`, `--ease-out`), em formato pt-BR, com `tabular-nums` e largura do valor final reservada. Legenda em Label embaixo.

## Do's and Don'ts

### Do:
- **Do** revelar de baixo para cima: fade com 24px de subida, `--ease-out`, disparo em `top 85%`, uma vez.
- **Do** uma só interação de destaque por seção; o resto é revelação simples.
- **Do** animar só `transform` e `opacity`, nas curvas `--ease-out`, `--ease-in-out` e `--ease-snap` e nas durações 200, 500, 900 e 1200–1600ms.
- **Do** manter tudo legível sem JS: o HTML pré-renderizado já traz o estado final.
- **Do** dar a hover, foco e centro da tela (toque) o mesmo estado ativo.
- **Do** usar fotografia de luz quente e baixa, que casa com o fundo escuro.

### Don't:
- **Don't** fazer nada entrar pelos lados: o calor sobe, não desliza. Única exceção: o marquee do `LogoWall` (ver a regra do Marquee).
- **Don't** usar o Cobre mais de 3 vezes por tela, nem em texto corrido.
- **Don't** usar sombra, brilho, gradiente ou texto em gradiente.
- **Don't** usar foto de estúdio com fundo branco, xícara em mesa de madeira ou fonte manuscrita.
- **Don't** usar logotipo de marca real, rosto em destaque ou embalagem com marca visível nos assets.
- **Don't** criar token, tamanho, cor ou espaço fora da escala. Se uma seção precisa de token novo, é pergunta para o diretor, não ajuste local.
- **Don't** usar scroll-jacking, parallax ou scrub com reduced-motion.
