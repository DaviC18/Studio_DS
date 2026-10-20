# Design system: tema novo para um cliente

O design system tem duas camadas. `src/styles/base.css` é estrutura e não muda entre clientes. `src/styles/themes/[tema].css` é a identidade. Um cliente novo é um arquivo de tema novo; componentes, motion e layout ficam iguais.

## Passos

1. **Feche a direção no `SPEC.md` (seções 1 a 6).** O tema sai da seção 4: 6 cores, par de fontes, escala display/h2/h3, raio e, se quiser, o ritmo de cena (`--dur-scene`).

2. **Valide o contraste antes de escrever CSS.** `--color-ink`, `--color-ink-muted` e `--color-accent` precisam de ≥ 4.5:1 sobre `--color-bg` e sobre `--color-surface`. `--color-bg` sobre `--color-accent` também, porque é o texto do botão primário. `--color-line` é decorativo.

3. **Instale as fontes** com versão travada:

   ```bash
   npm i --save-exact @fontsource-variable/<display> @fontsource-variable/<texto>
   ```

   As duas precisam ter licença de uso comercial (OFL no Google Fonts). Registre no inventário do SPEC §6.

4. **Copie um tema existente**, por exemplo `cp src/styles/themes/torrefacao.css src/styles/themes/<cliente>.css`, e troque:
   - os `@font-face`: arquivos `files/<fonte>-latin-wght-normal.woff2` e `-latin-ext-`, `font-weight` igual ao da fonte variável;
   - o seletor `[data-theme="<cliente>"]` e `color-scheme` (light ou dark);
   - as cores de marca `--brand-*` e o mapa delas para `--color-*`;
   - `--font-display` e `--font-text`;
   - `--text-display`, `--text-h2`, `--text-h3`, com `clamp()` de 375px a 1440px (mínimo padrão: 56px, 36px, 24px), mais `--line-height`, `--font-weight` e `--letter-spacing` de cada um;
   - `--radius-base`;
   - `--theme-dur-scene`, opcional, de 1200ms a 1600ms. Sem ele, vale 1400ms.

   O tema não define espaço, grid, motion nem tokens de componente: isso é do `base.css`.

5. **Meça o fallback das fontes.** Abra o catálogo e meça, no console, a largura de um texto pt-BR na fonte real e em Arial (sans) ou Times New Roman (serif), no peso usado. `size-adjust` = real ÷ fallback × 100%. Ajuste os `@font-face ... Fallback` do tema. Sem isso, a troca de fonte causa CLS.

6. **Registre o tema** em `src/styles/themes/index.ts` (`id`, `label`, `heroFont` = o woff2 latin da fonte display) e importe o CSS em `src/index.css`.

7. **Ative o tema** em `site.config.ts`: `SITE.theme = "<cliente>"`. O build aplica o `data-theme` e faz o preload da fonte do hero. Num site de cliente, importe só o tema dele no `index.css`.

8. **Rode o stress test.** `npm run build && npm run preview`, escolha o tema no catálogo e confira:
   - o status do stress test em 375px diz "sem scroll horizontal". Se a palavra mais longa do hero não couber, baixe o mínimo de `--text-display` ou `--text-h2` no tema (SPEC §4);
   - nenhum acento cortado no display e no h2. Se cortar, ajuste o line-height do tema, não a folga da máscara;
   - os contrastes da seção Tokens dizem "AA ok".

9. **Feche com os checks:** `npm run lint` (escala de espaço) e `npm run build` (tipos e orçamento de JS de 250 kB gzip).

## Regras que não mudam

- Componentes usam só tokens semânticos ou de componente; nunca `--brand-*`.
- Espaço entre componentes: só `Section`, `Container` e `Stack`. Escala: `1 2 4 6 8 12 16 24 32 48` (× 4 = px).
- Acento: no máximo 3 usos por tela.
- Motion: tokens do `base.css` e constantes de `src/lib/motion/config.ts`. Todo preset tem variante de reduced-motion.
- Hero = CSS, scroll = GSAP: a entrada do hero não espera o JS. O conteúdo fica visível mesmo se o JS falhar (SPEC §5.10–11).
