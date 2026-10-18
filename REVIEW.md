# Revisão final do design system

Data: 2026-10-18. Escopo: design system (`src/styles`, `src/lib/motion`, `src/components/ds`) e catálogo (`src/catalog`). Revisado contra as Web Interface Guidelines (Vercel), o SPEC §10, Lighthouse mobile e teste só por teclado.

## Resultado

| Check | Resultado | Status |
|---|---|---|
| `npm run lint` (eslint + escala de espaço) | 0 erros; `check-spacing: ok` | passou |
| `npm run build` (tsc + vite + orçamento) | **JS inicial 133.04 kB gzip / 250 kB (53%)**; CSS 7 kB gzip | passou |
| Lighthouse mobile, Performance | 94 (3 execuções) | passou (≥ 85) |
| Lighthouse mobile, Acessibilidade | 100 (era 93 antes das correções) | passou |
| Lighthouse mobile, Best Practices / SEO | 100 / 100 (SEO era 83) | passou |
| CLS | 0 no Lighthouse; 0.0001–0.0034 com fonte atrasada em 1.2s | passou (≤ 0.1) |
| LCP | **2.6 s** (render delay de 2.18 s); FCP 2.3 s; TBT 30–70 ms | **falhou por 0.1 s** (≤ 2.5 s) |
| Teclado | 37 paradas de Tab; primeira é "Pular para o conteúdo"; todas com anel de 2px `--color-ink`, `:focus-visible`, dentro da tela e com opacidade 1; grupo de rádio é uma parada só; iframe navegável | passou |
| Contraste AA | calculado ao vivo no catálogo nos dois temas: todos os textos ≥ 4.5 | passou |
| Stress test em 375px | sem scroll horizontal nos dois temas; acentos inteiros; labels longos quebram dentro do botão | passou |
| Reduced-motion | presets viram fade de `--dur-fast`; Lenis sem smooth; vídeo de ambiente parado | passou |
| Um `h1`, alvo de toque ≥ 44px | sim (catálogo e stress test) | passou |

Lighthouse: v12.8.2, emulação mobile, throttling simulado (4G lento, CPU 4×), `vite preview` local.

## Corrigido nesta etapa

- **Label/título vazio:** `Button` e `PortalCard` dão `console.error` em dev. Virou item do checklist do revisor (SPEC §10).
- **CLS da fonte:** fallback local com `size-adjust` medido para cada fonte. Torrefação: display 69.61%, texto 113.42%. Neutro: display 97.04%, texto 95.48%. No carregamento normal, o CLS da Torrefação caiu de 0.0014 para 0.0001.
- **Preload:** sai do tema configurado em `site.config.ts` (único lugar), que também define o `data-theme` do `<html>`. Testado com os dois temas.
- **Web Interface Guidelines e Lighthouse:**
  - link "Pular para o conteúdo" e `main` focável;
  - `<dl>` com estrutura válida (`Stack` aceita `as="dl"`);
  - nome do `PortalCard` = texto visível (resolveu `label-content-name-mismatch`);
  - hierarquia de headings: cards sob h3 usam h4, e o `PortalCard` aceita `titleAs="h4"`;
  - `meta description`, `robots.txt` válido, `<meta name="theme-color">` sincronizada com `--color-bg`;
  - `touch-action: manipulation` e `-webkit-tap-highlight-color` intencional em controles;
  - `overflow-wrap: break-word` no body;
  - `tabular-nums` nos números do catálogo e `translate="no"` em código e nomes de token;
  - o tema escolhido vai para a URL (`?theme=`);
  - vídeo de ambiente pausa se o reduced-motion for ligado com a página aberta.

## Pendente: decisões suas

1. **LCP 2.6 s.** O site é renderizado no cliente: nada aparece antes de baixar e executar 133 kB de JS (React, GSAP e plugins, Lenis). Esse piso vale para qualquer site de cliente feito com essa stack. Opções:
   - (a) pré-renderizar o HTML no build (SSG): o LCP vira o HTML estático, e é a recomendação para sites de cliente;
   - (b) voltar ao padrão do SPEC §9 (Next.js) nos sites de cliente;
   - (c) carregar GSAP e Lenis depois do primeiro paint, com o risco de o conteúdo piscar antes da animação.
2. **`robots.txt`:** está `Allow: /`. O catálogo deve ser indexado ou ficar com `Disallow: /`?
3. **Caixa de título:** as Guidelines pedem Title Case (padrão do inglês). Mantive caixa de frase, que é o padrão do pt-BR.
4. **Rubber-band:** as Guidelines sugerem `overscroll-behavior: none` no `<html>` com `(pointer: fine)`. Não apliquei, porque muda a sensação do scroll no macOS.
5. **Safe areas:** `env(safe-area-inset-*)` só faz diferença com `viewport-fit=cover`. Decida quando houver hero de tela cheia.
6. **Voz do texto:** os exemplos do catálogo usam a 1ª pessoa do cliente ("Torramos…"), e as Guidelines preferem a 2ª pessoa. O texto final é do cliente (SPEC §7).

## Pendente: conhecido e aceito

- **Aviso de preload no catálogo:** vem do iframe do stress test, porque é um segundo documento com o mesmo preload. Num site de cliente não existe.
- **Leituras de estilo no render:** o catálogo lê tokens com `getComputedStyle` durante a renderização (Lighthouse: `forced-reflow-insight`). Só existe no catálogo; os componentes do DS não fazem isso.
- **`unused-javascript`:** no carregamento, GSAP e o código das seções de baixo ainda não foram usados. Isso se resolve com a decisão 1.
- **Componentes ainda não feitos:** `Nav`, `HorizontalGallery`, `CollectionGrid`, `StatCounter`, `LogoWall`, `PageTransition` e `Footer` (SPEC §8) ficaram fora do escopo destas etapas.
- **Agentes:** as definições de papéis em `.claude/agents/` (SPEC §11) ainda não existem.
- **Git:** o projeto não é um repositório git; nada foi commitado.

## Bundle

| Arquivo | gzip |
|---|---|
| JS inicial (1 chunk) | 133.04 kB (53% do orçamento) |
| CSS | ~7 kB |
| Fontes do tema ativo (sob demanda por `unicode-range`) | display latin 35.5 kB + texto latin 52.5 kB |
