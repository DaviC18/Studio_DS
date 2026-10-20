# Template de Spec — Site Cinematográfico

## Como usar este template

Preencha uma cópia por cliente, na ordem das seções: as seções 1 a 6 são decisões de direção (suas), as 7 a 12 são o contrato que os agentes executam. Nenhum agente começa a codar antes das seções 1 a 6 estarem fechadas.

- **Quem preenche:** você, com o cliente nas seções 1 e 2; você sozinho nas seções 3 a 6.
- **Como os agentes leem:** este arquivo fica na raiz do projeto como `SPEC.md`. Cada agente recebe a spec inteira e a seção específica da tarefa dele.
- **Regra de ouro:** se algo não está na spec, o agente não inventa. Ele registra como pergunta aberta.
- **Campos entre colchetes** `[assim]` são para preencher. Os textos marcados como _Exemplo_ são só referência e devem ser apagados.

## 1. Visão e conceito criativo

O conceito é uma frase que decide todas as outras escolhas. Se uma animação ou seção não serve ao conceito, ela sai.

| Campo                       | Preencher                                                      |
| --------------------------- | -------------------------------------------------------------- |
| Cliente                     | [nome, segmento, cidade]                                       |
| Conceito em 1 frase         | [a ideia central do site]                                      |
| 3 palavras de personalidade | [ex.: preciso, ousado, caloroso]                               |
| 3 palavras que o site NÃO é | [ex.: corporativo, fofo, genérico]                             |
| Metáfora de movimento       | [como o site "se move": rápido, flutuante, mecânico, orgânico] |
| Referências (até 3)         | [link + o que exatamente pegar de cada uma]                    |
| Anti-referências            | [link + o que evitar]                                          |

_Exemplo de conceito:_ "Uma clínica de fisioterapia esportiva cujo site se move como um corpo em aquecimento: começa lento e ganha ritmo no scroll."

_Exemplo de referência bem escrita:_ "Site X: pegar só a hierarquia tipográfica do hero e o uso de um único acento de cor. Não pegar layout nem animações."

## 2. Público, objetivo e conversão

Um site cinematográfico que não converte é um portfólio caro. Defina uma ação principal e meça só ela.

| Campo                          | Preencher                                                               |
| ------------------------------ | ----------------------------------------------------------------------- |
| Público principal              | [quem, idade, o que busca, de onde chega: Instagram, Google, indicação] |
| Dispositivo dominante          | [mobile % / desktop %; se não souber, assuma mobile primeiro]           |
| Ação principal (1 só)          | [ex.: agendar pelo WhatsApp, pedir orçamento, comprar]                  |
| Ações secundárias              | [ex.: seguir no Instagram, newsletter]                                  |
| Onde o CTA aparece             | [hero, meio, footer; mínimo 3 pontos]                                   |
| Métrica de sucesso             | [ex.: cliques no CTA / visitas]                                         |
| Conteúdo que o cliente entrega | [textos, fotos, vídeos, logo, depoimentos + prazo]                      |
| Idiomas                        | [pt-BR, en]                                                             |

- [ ] Cliente aprovou o conceito e a ação principal por escrito

## 3. Arquitetura narrativa da página

Cada seção tem uma ideia e uma interação forte, no máximo. A ordem abaixo é o padrão; reordene ou corte por cliente, mas mantenha um ritmo de intenso, calmo, intenso.

| #   | Papel narrativo      | Pergunta que responde      | Interação de destaque                         | Intensidade |
| --- | -------------------- | -------------------------- | --------------------------------------------- | ----------- |
| 1   | Hero                 | Quem é e por que importa?  | [entrada do objeto herói, tipografia gigante] | Alta        |
| 2   | Manifesto            | No que acredita?           | [texto revelado no scroll]                    | Baixa       |
| 3   | Prova / história     | Por que confiar?           | [galeria horizontal, números animados]        | Média       |
| 4   | Portais              | Para onde ir agora?        | [hover que expande o portal]                  | Média       |
| 5   | Momento colecionável | O que é único aqui?        | [grid com hover, 3D, comparação]              | Alta        |
| 6   | Conversão            | O que eu faço agora?       | [CTA com micro-interação]                     | Média       |
| 7   | Prova social         | Quem mais confia?          | [logos, depoimentos em loop]                  | Baixa       |
| 8   | Footer de impacto    | Qual é a última impressão? | [frase grande + objeto herói de novo]         | Alta        |

Páginas internas: [listar cada página, o objetivo dela e quais seções acima ela reutiliza]. Em single page, os "portais" viram âncoras para seções da mesma página.

Páginas de detalhe que contam ponto: 404, loading e estado vazio também recebem motion próprio.

## 4. Design tokens

Os tokens são a única fonte de verdade visual. Nenhum agente usa cor, tamanho ou espaçamento fora desta tabela.

**Arquitetura** (passo a passo para tema novo em `DESIGN-SYSTEM.md`)

- Duas camadas. `src/styles/base.css`: estrutura igual para todo cliente (escala de espaço, grid, breakpoints, tokens de motion, reset, foco, tokens de componente). `src/styles/themes/[tema].css`: só identidade (cores, fontes, tamanhos display/h2/h3, raio, `--theme-dur-scene` opcional). Trocar de cliente = trocar o arquivo de tema.
- Três níveis: marca `--brand-*` (só no tema) → semântico `--color-*`, `--font-*`, `--text-*`, `--radius-base` (tema preenche, componentes consomem) → componente `--button-*`, `--media-*`, `--portal-*`, `--focus-*`, `--touch-target` (no base, derivados do semântico). Componente nunca usa token de marca.
- Tudo ligado ao Tailwind v4 por `@theme`, que começa com `--*: initial`: só existe utilitário para token. O contrato do tema é um `@theme reference` no base.
- Configuração do site: `site.config.ts` (único lugar), `SITE = { theme, mode, indexable }`. Dele saem o `data-theme` do `<html>`, o preload da fonte do hero, o script de troca de tema (só no catálogo; no site, só fora de `mode: "production"`), o `noindex` e o `robots.txt`.
- Fontes: auto-hospedadas com `@fontsource-variable` (sem CDN), só subsets latin e latin-ext, `font-display: swap`, preload só da display do hero. Cada fonte tem um fallback local com `size-adjust` medido, para a troca não mudar quebras de linha (CLS).

**Cor** (regra do acento único: o acento aparece em no máximo 3 usos por tela)

| Token               | Valor  | Uso permitido                   |
| ------------------- | ------ | ------------------------------- |
| `--color-bg`        | [#hex] | fundo principal                 |
| `--color-surface`   | [#hex] | cards, seções alternadas        |
| `--color-ink`       | [#hex] | texto principal                 |
| `--color-ink-muted` | [#hex] | legendas, microcopy             |
| `--color-accent`    | [#hex] | CTA, destaque de palavra, hover |
| `--color-line`      | [#hex] | bordas, divisores               |

**Tipografia** (escala fluida com `clamp()`, mínimo no mobile e máximo no desktop)

| Token            | Fonte           | Tamanho mobile → desktop | Peso  | Uso                                |
| ---------------- | --------------- | ------------------------ | ----- | ---------------------------------- |
| `--font-display` | [fonte display] | 56px → 200px             | [700] | hero, títulos de portal            |
| `--font-h2`      | [fonte display] | 36px → 96px              | [600] | títulos de seção                   |
| `--font-h3`      | [fonte display] | 24px → 40px              | [600] | títulos de card e `PortalCard`     |
| `--font-body`    | [fonte texto]   | 16px → 18px              | 400   | parágrafos                         |
| `--font-micro`   | [mono ou texto] | 12px → 14px              | 500   | legendas, microcopy em caixa baixa |

Mínimos de `--font-display` e `--font-h2`: 56px e 36px são o padrão; o tema pode baixar se a fonte for larga. Critério: a palavra mais longa prevista para o hero cabe na coluna de 343px (tela de 375px) sem scroll horizontal.

**Espaço e grid**

- Escala de espaço: 4, 8, 16, 24, 32, 48, 64, 96, 128, 192 px. Nomes seguem o Tailwind (nome × 4 = px): `1, 2, 4, 6, 8, 12, 16, 24, 32, 48`. Nenhum outro passo existe; `npm run lint` falha em utilitário fora da escala.
- Grid: 4 colunas no mobile (gutter 16px), 12 colunas no desktop (gutter 24px), margem lateral `clamp(16px, 4vw, 64px)`.
- Breakpoints: 640, 1024, 1440 px.
- Raio: [0 / 8 / 999] px. Escolha um estilo e mantenha (`--radius-base` no tema).
- Proporções de mídia: `--aspect-video` 16:9, `--aspect-portrait` 4:5, `--aspect-square` 1:1.
- Alvo de toque mínimo: `--touch-target` 44px.
- Máscara de linha (reveals): folga `--mask-bleed-top` 0.25em, `--mask-bleed-bottom` 0.2em, `--mask-bleed-inline` 0.1em, aplicada por `clip-path`. Acentos de maiúscula (Á É Ã) e cedilha não são cortados com line-height < 1.

**Elementos de marca:** [assinatura, símbolo, padrão gráfico] e onde cada um pode aparecer.

## 5. Motion system

Movimento também é token: 3 curvas, 4 durações e regras de quando usar cada uma. É isso que faz o site parecer dirigido, e não animado ao acaso.

| Token           | Valor                            | Quando usar                                         |
| --------------- | -------------------------------- | --------------------------------------------------- |
| `--ease-out`    | `cubic-bezier(0.16, 1, 0.3, 1)`  | entradas, revelações de texto e imagem              |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | transições de página, elementos que trocam de lugar |
| `--ease-snap`   | `cubic-bezier(0.7, 0, 0.2, 1)`   | hover, cliques, micro-interações                    |
| `--dur-fast`    | 200ms                            | hover, foco                                         |
| `--dur-base`    | 500ms                            | revelação de componentes                            |
| `--dur-slow`    | 900ms                            | títulos grandes, imagens                            |
| `--dur-scene`   | 1200–1600ms (base 1400ms)        | entrada do hero, transição de página                |
| `--stagger`     | 60ms                             | intervalo entre itens de uma lista ou letras        |

**Regras**

1. Uma animação de destaque por seção; o resto é revelação simples (fade + 24px de translate).
2. Scroll suave com Lenis; animações ligadas ao scroll com GSAP ScrollTrigger, sincronizados pelo `gsap.ticker`. Nada de scroll-jacking que trave o usuário. Presets em `src/lib/motion/`: `reveal`, `revealLines`, `revealWords`, `mask`, `staggerChildren`, cada um com hook (`useGSAP` + `gsap.matchMedia`, cleanup automático). Curvas e durações são lidas do CSS; nenhum valor de motion em JS fora de `config.ts`.
3. Só animar `transform` e `opacity`. Nunca `width`, `top` ou `filter` pesado em loop.
4. `prefers-reduced-motion`: desliga parallax, scroll-scrub e 3D em rotação; mantém só fades curtos. Implementação: todo preset vira fade de `--dur-fast`, sem translate, sem split de texto; o conteúdo sempre termina visível. Lenis fica sem smooth; vídeo de ambiente não toca.
5. Mobile: reduzir distâncias e durações em cerca de 30% (`--motion-scale` 0.7 abaixo de 1024px); sem efeitos que dependem de hover (hover do Tailwind só existe em `(hover: hover)`; o `PortalCard` ativa no centro da tela no toque).
6. Transição de página: [tipo, ex.: cortina de cor do acento, 1200ms]. Mesma em todas as páginas. Em single page, vale para a navegação entre âncoras.
7. Loading inicial: no máximo 1,5s visível, e só se houver asset pesado para carregar.
8. Disparo dos reveals: `clamp(top 85%)` (topo do elemento a 85% da viewport), uma vez só (`once`). O `clamp()` faz disparar também o elemento perto do fim da página, cujo topo nunca chega a 85%; sem ele, o elemento ficaria escondido para sempre. Zoom inicial do `MediaFrame`: 1.1 → 1. Constantes em `src/lib/motion/config.ts`, único lugar delas.
   - **Problema conhecido:** em 375px, no catálogo, os reveals disparam 16 a 40px antes da linha de 85%. Acontece igual com e sem `clamp()`. Causa não investigada; provável cálculo de posição do ScrollTrigger numa página longa.
9. Tokens de motion são estruturais (`src/styles/base.css`) e iguais para todos os clientes. Única exceção: o tema pode sobrescrever `--dur-scene`, via `--theme-dur-scene`, sempre dentro de 1200–1600ms (o base aplica `clamp()`). Sem override, vale 1400ms.
10. **Hero = CSS, scroll = GSAP.** A entrada do hero (o que aparece na primeira dobra ao carregar) é só CSS: `@keyframes` com `--dur-scene`, `--ease-out` e `--stagger`, que toca no primeiro paint sem esperar o JS (`HeroTitle play="load"`, classe `.hero-in` no `base.css`). GSAP só anima o que vem abaixo da dobra, no scroll. Reduced-motion vale por media query também no CSS (fade de `--dur-fast`).
11. **Conteúdo visível sem JS.** O HTML é pré-renderizado e nada começa em `opacity: 0` sem um fallback em CSS: a animação CSS do hero termina sozinha, e os presets GSAP só escondem um elemento quando o JS já rodou. Se o JS falhar, tudo fica visível.

## 6. Objeto herói e assets

Todo projeto tem um objeto herói: o elemento que vira a identidade do site e reaparece no hero, no meio e no footer. Os agentes implementam; os assets vêm de fora.

| Campo           | Preencher                                                                      |
| --------------- | ------------------------------------------------------------------------------ |
| Objeto herói    | [produto, logo em 3D, personagem, vídeo, tipografia cinética]                  |
| Formato técnico | [GLB/Three.js, Rive (.riv), vídeo WebM/MP4, SVG animado, sequência de imagens] |
| Quem produz     | [cliente, freelancer 3D/Rive, banco de imagens, você]                          |
| Peso máximo     | GLB ≤ 2MB com Draco, .riv ≤ 300KB, vídeo hero ≤ 3MB                            |
| Fallback        | [imagem estática para mobile fraco e reduced-motion]                           |

**Inventário de assets** (um por linha; nenhum agente usa placeholder em produção)

| Asset                                                                                     | Seção          | Formato                                | Origem                                         | Licença    | Status                                         |
| ----------------------------------------------------------------------------------------- | -------------- | -------------------------------------- | ---------------------------------------------- | ---------- | ---------------------------------------------- |
| [foto hero]                                                                               | 1              | WebP/AVIF 2400px                       | [cliente]                                      | [própria]  | [pendente]                                     |
| [vídeo de fundo]                                                                          | 3              | WebM + MP4, sem áudio                  | [freelancer]                                   | [contrato] | [pendente]                                     |
| [fontes]                                                                                  | todas          | WOFF2                                  | [Google Fonts / licença comprada]              | [tipo]     | [pendente]                                     |
| Big Shoulders Display (tema torrefacao)                                                   | todas          | WOFF2 variável, `@fontsource-variable` | Google Fonts                                   | OFL        | ok                                             |
| Literata (tema torrefacao)                                                                | todas          | WOFF2 variável, `@fontsource-variable` | Google Fonts                                   | OFL        | ok                                             |
| Inter Tight (tema neutro)                                                                 | todas          | WOFF2 variável, `@fontsource-variable` | Google Fonts                                   | OFL        | ok                                             |
| Mídia abstrata do catálogo (`public/assets/catalog/`: 6 WebP, 1 vídeo WebM+MP4, 1 poster) | catálogo do DS | WebP, WebM + MP4 sem áudio             | gerada por `scripts/generate-catalog-media.py` | própria    | ok (só catálogo, não vai para site de cliente) |

Regra: todo asset tem licença registrada. Nada de imagem, fonte ou modelo 3D de terceiros sem direito de uso comercial.

## 7. Spec por seção

Copie este bloco uma vez para cada seção da arquitetura (seção 3). É a unidade de trabalho que um agente recebe.

```markdown
### Seção [nº] — [nome]

**Objetivo:** [a pergunta que a seção responde, em 1 frase]
**Conteúdo:** [título, texto, imagens, links; texto final do cliente, não lorem ipsum]
**Layout desktop:** [descrição ou link do frame]
**Layout mobile:** [o que muda: ordem, tamanho, o que some]
**Componentes usados:** [nomes da seção 8]
**Interação de destaque:** [gatilho → efeito → duração/easing (tokens da seção 5)]
**Estados:** [hover, foco, carregando, vazio, erro]
**Assets:** [ids do inventário da seção 6]

**Critérios de aceite**

- [ ] Usa só tokens (nenhum valor solto de cor, fonte ou espaço)
- [ ] Funciona em 375px, 1024px e 1440px
- [ ] Com reduced-motion, o conteúdo aparece sem animação
- [ ] Navegável por teclado, com foco visível
- [ ] [critério específico desta seção]

**Perguntas abertas:** [o que o agente não conseguiu decidir]
```

_Exemplo de interação bem especificada:_ "Ao entrar 30% na viewport, o título revela linha por linha de baixo para cima, `--dur-slow`, `--ease-out`, `--stagger` entre linhas. Sem scrub."

## 8. Componentes do design system

Estes componentes são reutilizados entre clientes; só os tokens mudam. É o ativo que deixa cada projeto novo mais rápido que o anterior.

| Componente          | Função                              | Variações                | Motion padrão                     |
| ------------------- | ----------------------------------- | ------------------------ | --------------------------------- |
| `Button`            | CTA principal e secundário          | primary, ghost, link     | hover com `--ease-snap`, 200ms    |
| `Nav`               | menu fixo + menu fullscreen         | desktop, mobile          | abertura em cortina, `--dur-base` |
| `HeroTitle`         | título gigante revelado             | 1 a 3 linhas             | linhas em stagger, `--dur-scene`  |
| `RevealText`        | parágrafo revelado no scroll        | por linha, por palavra   | `--dur-slow`, `--ease-out`        |
| `MediaFrame`        | imagem/vídeo com legenda            | 16:9, 4:5, 1:1           | máscara que abre + leve zoom      |
| `HorizontalGallery` | galeria horizontal no scroll        | com legenda, com citação | scrub ligado ao scroll            |
| `PortalCard`        | link grande para outra seção/página | 2 ou 3 colunas           | hover expande e troca imagem      |
| `CollectionGrid`    | grid de itens com hover             | 2, 3 ou 4 colunas        | imagem base → imagem hover        |
| `StatCounter`       | números animados                    | com ou sem unidade       | conta ao entrar na viewport       |
| `LogoWall`          | logos de parceiros                  | estático, marquee        | marquee contínuo, pausa no hover  |
| `PageTransition`    | transição entre páginas             | 1 por projeto            | `--dur-scene`                     |
| `Footer`            | frase de impacto + links            | com ou sem objeto herói  | revelação final                   |

**Primitivas de layout** (`src/components/ds/layout/`). Espaço entre componentes é responsabilidade da seção, sempre via `Stack`/`Container`; nunca `div` com classes de espaço avulsas.

| Primitiva   | Função                              | Variações (union types)                                                    | Motion |
| ----------- | ----------------------------------- | -------------------------------------------------------------------------- | ------ |
| `Section`   | faixa de largura total              | `space` (padding vertical na escala), `theme`, `tone` bg/surface           | nenhum |
| `Container` | margem lateral + grid 4/12 colunas  | `layout`: full, split (6+6), thirds (4+4+4), main-aside (8+4); `gap`       | nenhum |
| `Stack`     | pilha flex entre componentes irmãos | `direction`: column, row, column-to-row; `gap`; `align`; `justify`; `wrap` | nenhum |

`PortalCard` em 2 ou 3 colunas = `Container layout="split"` ou `"thirds"`.

**Implementados** (`src/components/ds/`, documentados no catálogo com snippet e "use quando / não use quando"). Regras comuns: props tipadas, variações por union type, sem `className`/`style`, só tokens.

- `Button`: `variant` primary | ghost | link. Com `href` vira `<a>`, sem vira `<button>`. `disabled` real (button `disabled`; link sem `href` e com `aria-disabled`). Altura mínima 44px. Hover e foco: camada que sobe com `--ease-snap`, `--dur-fast`. Label vazio dá `console.error` em dev.
- `HeroTitle`: `lines` com 1 a 3 itens, `as` h1 | h2 | p, `play` load | scroll. Linhas em máscara com stagger e `--dur-scene`; `load` = só CSS (§5.10), `scroll` = GSAP. Avisa em dev se houver mais de um `h1`.
- `RevealText`: `by` line | word, `as`, `size` body | h3 | h2, `tone` ink | muted. O leitor de tela lê uma cópia `sr-only`; a parte dividida pelo SplitText fica `aria-hidden`.
- `MediaFrame`: `ratio` video | portrait | square; mídia `image` (`alt` obrigatório no tipo) ou `video` (`label`, `poster`, `muted`, `playsInline`; `ambient` = loop sem controles, toca só visível, com botão de pausa e parado em reduced-motion). Proporção fixa, então CLS zero. `lazy` por padrão; `priority` = `eager` + `fetchpriority=high` e sem máscara.
- `PortalCard`: o card inteiro é um link, e o nome vem do texto visível (título + descrição). Imagem troca no hover, no foco por teclado e, sem hover, no centro da tela. Imagens `absolute` dentro da proporção, então sem layout shift. `titleAs` h2 | h3 | h4. Título vazio dá `console.error` em dev.
- `StatCounter`: `value` (negativo dá `console.error` em dev), `decimals` (padrão 0), `prefix` e `suffix` opcionais sem espaço automático, `label` obrigatório embaixo do número (vazio dá `console.error` em dev), `size` h2 | display (padrão h2). Formato pt-BR com separador de milhar. Conta de 0 ao valor com `--dur-slow` e `--ease-out` ao cruzar o disparo do §5.8, uma vez. O HTML pré-renderizado já traz o valor final (§5.11). Reduced-motion: sem contagem; número, prefixo e sufixo entram juntos com fade de `--dur-fast`. O leitor de tela lê só o valor final (cópia `sr-only`, parte animada `aria-hidden`). `tabular-nums` e largura reservada do valor final, então a contagem não mexe no layout.

A regra dos 2 projetos vale só para componente fora da tabela acima: ele só entra na biblioteca depois de usado em 2 projetos. Os componentes da tabela são a base do estúdio e entram direto, registrados no catálogo.

## 9. Stack técnica

Stack padrão do estúdio; troque uma camada só com motivo escrito na linha "Exceções". Use sempre a versão estável mais recente de cada pacote no início do projeto e trave no `package.json`.

| Camada            | Padrão                               | Alternativa                                 |
| ----------------- | ------------------------------------ | ------------------------------------------- |
| Framework         | Next.js (App Router) + TypeScript    | Vite + React + TypeScript, para single page |
| Estilo            | Tailwind com tokens em CSS variables | CSS Modules                                 |
| Scroll suave      | Lenis                                | nativo, se não houver scroll animado        |
| Animação          | GSAP + ScrollTrigger                 | Motion (Framer Motion) para UI simples      |
| 3D                | React Three Fiber + drei             | Three.js puro                               |
| Motion de marca   | Rive (runtime web)                   | Lottie                                      |
| Conteúdo editável | [Sanity / Payload / arquivos MDX]    | Webflow, se o cliente quiser editar sozinho |
| Formulários       | [Resend / Formspree / WhatsApp link] | —                                           |
| Hospedagem        | Vercel                               | Netlify                                     |
| Analytics         | Vercel Analytics ou Plausible        | GA4, se o cliente exigir                    |

**Estrutura de pastas (Vite):** `src/components/ds/` design system (e `ds/layout/` com Section, Container, Stack), `src/components/sections/` seções, `src/lib/motion/` hooks, presets e `config.ts`, `src/styles/base.css` estrutura, `src/styles/themes/[tema].css` identidade (registrados em `themes/index.ts`), `site.config.ts` configuração do site, `src/Site.tsx` casca da página do site (link de pular + `<main id="conteudo">`), `src/catalog/` catálogo do DS, `src/App.tsx` árvore da página e troca por `data-page` (igual no servidor e no cliente), `src/entry-server.tsx` render para o pré-render, `scripts/` checks e pré-render, `public/assets/` mídia otimizada. Uma página por HTML: `index.html` (site, na raiz), `catalogo/index.html` (catálogo do DS, em `/catalogo/`) e `catalogo/stress.html` (stress test em 375px, aberto no iframe do catálogo). O build gera os três.

**Render (Vite):** o build pré-renderiza cada HTML com `renderToString` (`scripts/prerender.mjs`) e o cliente hidrata com `hydrateRoot`; em dev o `#root` chega vazio e o React renderiza do zero. Sem hydration mismatch: o primeiro render do cliente tem que ser igual ao do servidor. Valor que só o browser sabe (tema escolhido, estilo computado, medida) entra por `useSyncExternalStore` com snapshot de servidor (`useTheme`, `useHydrated`), nunca lido direto no render. O tema escolhido no catálogo é aplicado no `<html>` por um script inline no `<head>`, antes do paint. O JS de entrada só hidrata, então é buscado depois do primeiro paint e não disputa banda com HTML, CSS e fontes.

**Checks automáticos:** `npm run lint` = eslint + `prettier --check .` (formatação; `npm run format` corrige) + `scripts/check-tokens.mjs` (falha em espaço fora da escala, em cor arbitrária em classe como `text-[#…]` ou `bg-[rgb(…)]`, e em hex/rgb/hsl/oklch fora de `src/styles/themes/` e das definições de token do `base.css`). `npm run build` = tsc + vite (cliente) + vite `--ssr` + `scripts/prerender.mjs` + `scripts/check-bundle.mjs` (falha com JS inicial acima de 250 kB gzip e mostra o valor).

**Exceções deste projeto:** Framework → Vite + React + TypeScript com pré-render no build (sem Next.js), porque o site de teste é single page. O catálogo é ferramenta interna: `<meta name="robots" content="noindex">` no catálogo e no stress. O `robots.txt` não bloqueia o catálogo, para o robô conseguir ler o `noindex`; com `indexable: false`, ele vira `Disallow: /` e o site também leva `noindex`. Tailwind v4 via `@tailwindcss/vite`, com os tokens ligados por `@theme`.

## 10. Critérios de aceite

O site só é entregue quando passa em todos estes números, medidos no mobile. Bonito e lento não passa.

| Área            | Critério                                                                                         | Como medir                                   |
| --------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| Performance     | LCP ≤ 2,5s, INP ≤ 200ms, CLS ≤ 0,1                                                               | Lighthouse mobile + PageSpeed Insights       |
| Performance     | Lighthouse Performance ≥ 85 no mobile                                                            | Lighthouse                                   |
| Performance     | JS inicial ≤ 250KB gzip; 3D e Rive carregados só quando visíveis                                 | bundle analyzer                              |
| Performance     | Imagens em AVIF/WebP com `srcset`; nada acima de 400KB fora do hero                              | inspeção de rede                             |
| Fluidez         | 60fps no scroll em celular médio                                                                 | DevTools Performance, CPU 4x lento           |
| Acessibilidade  | contraste AA, foco visível, ordem de tab lógica, `alt` em toda imagem                            | axe + teclado                                |
| Acessibilidade  | site utilizável com `prefers-reduced-motion`                                                     | emulação no DevTools                         |
| Acessibilidade  | nenhum `Button` com label vazio nem `PortalCard` com título vazio (o dev mostra `console.error`) | console do `npm run dev` + leitura do código |
| Acessibilidade  | alvo de toque ≥ 44px; um `h1`; link "pular para o conteúdo"                                      | teclado + inspeção                           |
| Código          | `npm run lint` e `npm run build` passam (escala de espaço e orçamento de JS)                     | terminal                                     |
| SEO             | título, description, Open Graph e favicon                                                        | inspeção + preview de link                   |
| SEO             | HTML semântico (1 `h1` por página), sitemap, robots, dados estruturados [tipo]                   | Lighthouse SEO, Rich Results Test            |
| Compatibilidade | Chrome, Safari iOS, Firefox, Edge; 375px a 1920px                                                | teste manual                                 |
| Conversão       | CTA principal visível em até 1 scroll no mobile                                                  | teste manual                                 |

## 11. Equipe de agentes e fluxo de trabalho

Seis papéis: um orquestrador, três tipos de executor, um revisor técnico e um crítico de direção de arte. A Fundação roda primeiro; Seções e Motion só começam quando os tokens e componentes existem.

Fluxo:

1. **Você (diretor)** fecha as seções 1 a 6 da spec.
2. **Orquestrador** divide a spec em tarefas.
3. **Agentes executores:** Fundação (tokens e componentes) → depois, em paralelo, Seções (1 agente por seção) e Motion e 3D (3D, Rive e transições).
4. **Revisor (QA)** checa os critérios da seção 10. Depois do PASSA, toda entrega visual (seção, componente que aparece na página, motion) vai ao **Crítico**, que julga a direção de arte contra o `DESIGN.md`. Reprovado por qualquer um dos dois: volta ao agente da tarefa. No máximo 2 voltas por tarefa, somando revisor e crítico; se uma terceira fosse necessária, o orquestrador para e pergunta ao diretor.
5. **Rodada 7:** antes da sua revisão, um passe de `impeccable polish`, `harden` e `clarify`, cada dono nos próprios arquivos, e de novo revisor e crítico.
6. **Você** faz a revisão visual em celular real e desktop.
7. **Deploy na Vercel** com link de preview para o cliente.

O revisor nunca corrige sozinho: devolve a lista de erros ao agente da tarefa, e só o que passa chega à sua revisão visual.

| Agente              | Recebe                  | Entrega                                                       | Não pode                                |
| ------------------- | ----------------------- | ------------------------------------------------------------- | --------------------------------------- |
| Orquestrador        | `SPEC.md` inteira       | lista de tarefas com dependências e ordem                     | editar código                           |
| Fundação            | seções 4, 5, 8 e 9      | `base.css` + `themes/[tema].css`, componentes, presets de motion, projeto rodando | criar seção de página                   |
| Seção (1 por seção) | spec + bloco da seção 7 | seção pronta com critérios marcados                           | criar token ou componente sem registrar |
| Motion e 3D         | seções 5 e 6 + assets   | objeto herói, transições, fallbacks                           | usar asset fora do inventário           |
| Revisor             | branch + seção 10       | relatório passa/falha com prints (screenshots salvos fora do repo, em pasta temporária, com o caminho citado no relatório) | corrigir o código da tarefa             |
| Crítico             | entrega visual + `DESIGN.md` + `PRODUCT.md` | relatório APROVADO/AJUSTES com itens, prints (fora do repo) e nota 0–10 de "parece feito por estúdio" | corrigir código; sugerir mudar token ou tema (vira pergunta ao diretor) |

**No Claude Code:** o orquestrador é a sessão principal, guiada pelo comando `/orquestrar` (`.claude/commands/orquestrar.md`), porque os subagentes do projeto não têm a ferramenta `Agent` e não chamam outros agentes. Os outros papéis viram subagentes com seu arquivo em `.claude/agents/` (`fundacao`, `secao`, `motion`, `revisor`, `critico`), e cada executor trabalha em uma branch ou worktree própria para não pisar no código do outro.

**Dono de cada arquivo** (o revisor reprova edição fora da coluna do autor):

| Agente     | Pode editar                                                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `fundacao` | `src/styles/`, `src/components/ds/`, `src/lib/`, `src/catalog/`, `src/index.css`, `site.config.ts`, `package.json` (e o lockfile), `public/assets/` |
| `secao`    | `src/components/sections/<Nome>.tsx`, uma seção por tarefa; `src/App.tsx` só para importar e ordenar seções                                   |
| `motion`   | `src/lib/motion/` e as partes de motion de `src/components/sections/` que o orquestrador indicar. Mudança em `src/components/ds/` vira pedido à `fundacao` |
| `revisor`  | nada                                                                                                                                         |
| `critico`  | nada                                                                                                                                         |

O orquestrador não edita código. O resto (`vite.config.ts`, `index.html`, `catalogo/*.html`, `src/main.tsx`, `src/entry-server.tsx`, `src/Site.tsx`, `scripts/`, docs, `DESIGN.md`, `PRODUCT.md`, `.impeccable/` e `.claude/`) fica com o diretor. `src/Site.tsx`, `src/main.tsx` e `src/entry-server.tsx` são do diretor por decisão da rodada 1; a `secao` passa as seções como filhos de `<Site>` em `src/App.tsx`.

**Estética travada.** `DESIGN.md` (gerado do código pela `impeccable document`; North Star "A Torra Lenta") e `PRODUCT.md` (da `Spec_Golden_Grains.md`) são o critério de direção de arte. O código vence o `DESIGN.md`: se divergirem, regenera-se o arquivo. Mudar token, tema ou um desses arquivos é decisão do diretor.

**Skills por agente** (pré-carregadas pelo campo `skills` do agente, ou lidas do arquivo):

| Agente     | Skills                                                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `motion`   | `emil-design-eng` (+ as `gsap-*` já listadas)                                                                                          |
| `secao`    | `frontend-design` (plugin oficial, escopo do projeto), sempre abaixo da spec e do `DESIGN.md`                                             |
| `critico`  | `impeccable critique` e `audit` (tool Skill); `review-animations` lida de `.claude/skills/review-animations/` (ela não carrega pela tool) |
| `fundacao`, `secao`, `motion` | `impeccable polish`, `harden` e `clarify`, só no passe da rodada 7                                                     |

`emil-design-eng` e `review-animations` estão copiadas em `.claude/skills/` (`npx skills add emilkowalski/skills`, travadas em `skills-lock.json`).

**Impeccable com uso restrito.** Neste projeto só passam `critique`, `audit`, `harden`, `clarify`, `polish` e `document`. Os comandos que criam estética (`bolder`, `colorize`, `overdrive`, `delight`, `animate`, `typeset`, `layout`) e os demais são negados por regras `Skill(args:…)` no `.claude/settings.json` e por uma lista branca no hook `.claude/hooks/impeccable-guard.mjs`, que também nega pedido livre e chamada sem comando. Os subagentes `impeccable-*` ficam bloqueados. Os hooks de detector da impeccable estão desligados neste projeto (`.impeccable/config.json`, `hook.enabled: false`).

**Duração: interação rápida, cena lenta.** A regra da `review-animations` (animação de UI abaixo de 300ms) vale só para interação: hover, botão, menu, foco, toggle, controle de vídeo, com `--dur-fast` e `--ease-snap`. Não vale para cena e scroll (hero, revelações, `StatCounter`, galeria, footer, transição de página), que seguem os tokens do §5: `--dur-base`, `--dur-slow` e `--dur-scene`. O ritmo lento é o conceito da marca; o crítico não reprova duração de cena que usa o token certo.

**Decisões da rodada 1 (site Golden Grains):**

- Dono de `src/Site.tsx`, `src/main.tsx` e `src/entry-server.tsx`: diretor.
- `SiteMode = "production" | "preview"` aprovado: `preview` mantém a troca de tema no site; `production` tira.
- Separar a entrada JS do catálogo da do site: rodada 7.
- Link "pular para o conteúdo" com alvo de 44px: rodada 3.
- Prettier com check no `npm run lint` (`.prettierrc.json`, `printWidth` 100; Markdown fica fora).
- A spec do site é `Spec_Golden_Grains.md`.

## 12. Checklist de entrega

Marque tudo antes de mandar o link final ao cliente.

- [ ] Todos os critérios da seção 10 passaram (prints do Lighthouse salvos)
- [ ] Nenhum placeholder, lorem ipsum ou asset sem licença
- [ ] Revisão visual sua em celular real (iOS e Android) e em desktop
- [ ] Textos revisados pelo cliente
- [ ] Formulários e CTAs testados de ponta a ponta
- [ ] Domínio, HTTPS e redirecionamento www configurados
- [ ] Analytics ativo e evento do CTA principal registrado
- [ ] 404 e Open Graph conferidos
- [ ] Manual curto para o cliente: como editar conteúdo e a quem pedir suporte
- [ ] Repositório e acessos transferidos conforme o contrato
- [ ] Componentes novos que funcionaram bem levados para a biblioteca do design system
- [ ] Gravação de tela do site para o seu portfólio
