# Revisão final do design system

Data: 2026-10-18, atualizada em 2026-10-19 (etapa 7: LCP e robots). Escopo: design system (`src/styles`, `src/lib/motion`, `src/components/ds`) e catálogo (`src/catalog`). Revisado contra as Web Interface Guidelines (Vercel), o SPEC §10, Lighthouse mobile e teste só por teclado.

## Etapa 7 (2026-10-19): LCP

Decisão: ficar no Vite, pré-renderizar o HTML no build e fazer a entrada do hero só em CSS.

| Medida (mobile, mediana de 3) | Antes (etapa 6)     | Depois                                                         |
| ----------------------------- | ------------------- | -------------------------------------------------------------- |
| **LCP**                       | **2.6 s** (falhava) | **1.5 s** (meta ≤ 2.0 s)                                       |
| FCP                           | 2.3 s               | 1.2 s                                                          |
| Speed Index                   | —                   | 1.2 s                                                          |
| TBT                           | 30–70 ms            | 50–80 ms                                                       |
| CLS                           | 0                   | 0                                                              |
| Performance                   | 94                  | 100                                                            |
| Acessibilidade                | 100                 | 100                                                            |
| Best Practices                | 100                 | 100                                                            |
| SEO                           | 100                 | 66 (esperado: só falha `is-crawlable`, por causa do `noindex`) |

As 3 execuções deram o mesmo LCP (1.5 s), FCP 1.2 s e CLS 0, com Performance 100 em todas. TBT: 50, 80 e 50 ms.

Como o LCP caiu, passo a passo (todos com 3 execuções):

1. Pré-render com `renderToString` + `hydrateRoot`, hero só em CSS: LCP 2.2–2.3 s, FCP 1.9–2.0 s. O LCP é o parágrafo do header, pintado no primeiro frame (observado: 81 ms).
2. `fetchpriority="low"` no JS de entrada: FCP 1.2 s, mas o LCP continuou em 2.3 s. O Lighthouse simulado conta no LCP todo arquivo que terminou de baixar antes do LCP observado, e os 133 kB de JS ainda terminavam antes.
3. JS de entrada buscado depois do primeiro paint (`requestAnimationFrame` + `setTimeout` + `import()`, gerado no `vite.config.ts`): LCP 1.5 s. Na rede real, HTML, CSS e fontes deixam de disputar banda com o JS, que só hidrata.

Custo do passo 3: a interatividade espera o JS, como antes (TTI 2.3–2.4 s). Links e âncoras são HTML e funcionam antes disso. Troca de tema, botão do vídeo e "Rodar de novo" só respondem depois da hidratação.

O que mudou:

- **Pré-render:** `vite build --ssr src/entry-server.tsx` e `scripts/prerender.mjs` injetam o HTML em `dist/index.html` e `dist/stress.html`. O cliente hidrata com `hydrateRoot`. Em dev, o `#root` chega vazio e usa `createRoot`.
- **Stress test virou página própria:** `stress.html`, em vez de `/?view=stress`, para cada HTML ter um único render de servidor. O iframe agora tem `loading="lazy"`.
- **Sem hydration mismatch** (testado no build: zero erros no console, em `/`, `/?theme=neutro` e `stress.html`):
  - tema: um script inline logo depois do `<meta charset>` aplica `?theme=` ou a escolha salva no `<html>` antes do paint. O React lê o tema por `useSyncExternalStore`, com snapshot de servidor = `SITE_THEME`, e re-renderiza logo depois da hidratação;
  - tokens lidos com `getComputedStyle` (seção Tokens e curvas de easing) mostram "…" no HTML e o valor real depois da hidratação (`useHydrated`). Ficam abaixo da dobra.
- **Hero = CSS:** `HeroTitle play="load"` usa `.hero-in` (`@keyframes hero-rise` com `--dur-scene`, `--ease-out`, `--stagger`, × `--motion-scale`). Com reduced-motion, vira `hero-fade` de `--dur-fast`. `play="scroll"` continua no GSAP. Regra registrada no SPEC §5.10–11.
- **Sem JS, tudo visível:** com o JS desligado, a página mostra 5977 caracteres de texto, o hero termina em `transform: none` e `opacity: 1`, e nenhum elemento com texto fica em `opacity: 0`.
- **robots:** `Disallow: /` e `<meta name="robots" content="noindex">` nas duas páginas.
- **`RevealText` vazio:** o preset não chama mais o GSAP sem peças, o que gerava 4 avisos "GSAP target not found" no stress test.

Teclado, de novo depois da mudança: 37 paradas, a primeira é "Pular para o conteúdo", todas com `:focus-visible` e anel de 2px. Trocar o tema por seta no grupo de rádio atualiza o `<html>`, a URL e o iframe.

## Resultado (etapa 6, atualizado)

| Check                                                | Resultado                                                                                                                                                                                        | Status                |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| `npm run lint` (eslint + escala de espaço)           | 0 erros; `check-spacing: ok`                                                                                                                                                                     | passou                |
| `npm run build` (tsc + vite + prerender + orçamento) | **JS inicial 133.32 kB gzip / 250 kB (53%)**; CSS 6.6 kB gzip                                                                                                                                    | passou                |
| Lighthouse mobile, Performance                       | 100 (3 execuções; era 94)                                                                                                                                                                        | passou (≥ 85)         |
| Lighthouse mobile, Acessibilidade                    | 100 (era 93 antes das correções da etapa 6)                                                                                                                                                      | passou                |
| Lighthouse mobile, Best Practices / SEO              | 100 / 66. SEO só falha `is-crawlable`, de propósito (`noindex`)                                                                                                                                  | passou                |
| CLS                                                  | 0 no Lighthouse; 0.0001–0.0034 com fonte atrasada em 1.2s (medido na etapa 6)                                                                                                                    | passou (≤ 0.1)        |
| LCP                                                  | **1.5 s** (era 2.6 s); FCP 1.2 s; TBT 50–80 ms                                                                                                                                                   | passou (meta ≤ 2.0 s) |
| Teclado                                              | 37 paradas de Tab; primeira é "Pular para o conteúdo"; todas com anel de 2px `--color-ink`, `:focus-visible`, dentro da tela e com opacidade 1; grupo de rádio é uma parada só; iframe navegável | passou                |
| Contraste AA                                         | calculado ao vivo no catálogo nos dois temas: todos os textos ≥ 4.5                                                                                                                              | passou                |
| Stress test em 375px                                 | sem scroll horizontal nos dois temas; acentos inteiros; labels longos quebram dentro do botão                                                                                                    | passou                |
| Reduced-motion                                       | presets viram fade de `--dur-fast`; Lenis sem smooth; vídeo de ambiente parado                                                                                                                   | passou                |
| Um `h1`, alvo de toque ≥ 44px                        | sim (catálogo e stress test)                                                                                                                                                                     | passou                |

Lighthouse: v12.8.2, emulação mobile, throttling simulado (4G lento, CPU 4×), `vite preview` local.

## Corrigido na etapa 6

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

## Decididas na etapa 7

1. **LCP:** Vite com pré-render e hero em CSS (resolvido acima).
2. **robots:** `Disallow: /` e `noindex`, porque o catálogo é ferramenta interna.
3. **Caixa de título:** caixa de frase (pt-BR).
4. **Rubber-band:** sem `overscroll-behavior: none`.
5. **Safe areas:** decidir quando houver hero de tela cheia.

## Pendente: decisões suas

1. **Voz do texto:** os exemplos do catálogo usam a 1ª pessoa do cliente ("Torramos…"), e as Guidelines preferem a 2ª pessoa. O texto final é do cliente (SPEC §7).

## Pendente: conhecido e aceito

- **Aviso de preload no catálogo:** vem do iframe do stress test, porque é um segundo documento com o mesmo preload. Num site de cliente não existe.
- **`unused-javascript`:** GSAP e o código das seções de baixo continuam no chunk de entrada. Com o JS buscado depois do primeiro paint, isso não pesa mais no LCP. Separar o GSAP num chunk à parte só reduziria o tempo até a hidratação.
- **Leituras de estilo no render:** agora só acontecem depois da hidratação (`useHydrated`). O HTML pré-renderizado mostra "…" nesses valores.
- **Componentes ainda não feitos:** `Nav`, `HorizontalGallery`, `CollectionGrid`, `StatCounter`, `LogoWall`, `PageTransition` e `Footer` (SPEC §8) ficaram fora do escopo destas etapas.
- **Agentes:** as definições de papéis em `.claude/agents/` (SPEC §11) ainda não existem.
- **Git:** a etapa 7 ainda não foi commitada.

## Bundle

| Arquivo                                                | gzip                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| JS inicial (1 chunk, buscado depois do primeiro paint) | 133.32 kB (53% do orçamento; era 133.04 kB)                                     |
| CSS                                                    | 6.6 kB                                                                          |
| HTML pré-renderizado                                   | `index.html` 48.6 kB sem compressão (6.8 kB transferidos); `stress.html` 7.6 kB |
| Fontes do tema ativo (sob demanda por `unicode-range`) | display latin 35.5 kB + texto latin 52.5 kB                                     |
