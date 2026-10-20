# Product

<!-- impeccable:product-schema 1 -->
<!-- Fonte: `Spec_Golden_Grains.md` (§1, §2, §5, §9). A spec é a fonte da verdade; se divergir, a spec vence. -->

## Platform

web

## Users

Quem bebe café especial em casa, de 25 a 45 anos, e já tem um método (V60, prensa, espresso). Chega pelo Instagram, então o dispositivo dominante é o celular (assumido: cerca de 80% do tráfego). O trabalho dessa pessoa na página é decidir se confia na torrefação e assinar o clube.

## Product Purpose

Site de teste single page de uma torrefação fictícia, construído pela equipe de agentes sobre o design system do estúdio. Ele precisa provar que o processo entrega um site cinematográfico de ponta a ponta e vai para o portfólio do estúdio.

Dentro da ficção, a ação principal é assinar o Clube Golden Grains pelo WhatsApp. As ações secundárias são ver os cafés do mês e seguir no Instagram. A métrica de sucesso é cliques no CTA do WhatsApp sobre visitas.

## Positioning

Golden Grains Torrefação: cafés especiais do Sul de Minas, torrados em pequenos lotes toda semana e entregues em até 7 dias depois da torra. O conceito é "cada grão no seu tempo": a paciência da torra e a intensidade da xícara. A lentidão é método, não pose.

## Operating Context

- O CTA é um link nativo `wa.me` com a mensagem pronta "Olá! Quero assinar o Clube Golden Grains.". Funciona antes do JS carregar. O número fica em `site.config.ts` como placeholder: é o único dado fictício a trocar num cliente real.
- O CTA aparece no Nav (fixo), no Hero, na seção Clube e no Footer.
- A página tem 8 seções em ordem de torra (calma, aquece, intensa): Hero, Manifesto, Origem, Portais, Cafés, Clube, Parceiros e Footer. Os portais são âncoras para seções da própria página.
- Idioma: só pt-BR.

## Capabilities and Constraints

- Single page em Vite, React e TypeScript, pré-renderizada no build. O site fica na raiz, indexável; o catálogo do design system fica em `/catalogo/` com `noindex`.
- Usa o tema `torrefacao` e o motion system do design system como estão. Token novo é sinal de problema e vira pergunta para o diretor.
- Critérios de aceite do SPEC §10, medidos no mobile: LCP ≤ 2,5s, INP ≤ 200ms, CLS ≤ 0,1, Lighthouse performance ≥ 85, JS inicial ≤ 250 kB gzip, contraste AA, um `h1`, de 375 a 1920px.
- A 404 não entra neste teste: o site é de uma página só.
- Em aberto (§9 da spec): mostrar preço ("a partir de R$ 59/mês") ou trocar por "consulte no WhatsApp"; plano B da galeria (scroll-snap em todos os tamanhos) se o scrub reprovar duas vezes.

## Brand Commitments

- Nome: Golden Grains, de Santa Rita do Sapucaí (MG), desde 2014. Marca fictícia.
- Personalidade: artesanal, precisa, calorosa.
- O site não é: rústico de fazendinha, gourmet pretensioso, genérico.
- Metáfora de movimento: calor que sobe. As revelações vêm de baixo para cima, lentas, e se dissipam como fumaça; nada entra pelos lados.
- Referência: o princípio do landonorris.com de uma ideia e uma interação forte por seção, com disciplina de acento único. Não pegar layout, 3D nem tipografia dele.
- Anti-referências: sites de cafeteria com foto de xícara em mesa de madeira e fonte manuscrita; e-commerce com grid de produtos e selo de desconto.
- O rodapé leva a linha "Site conceitual · marca fictícia", para não ser confundido com uma marca real.

## Evidence on Hand

- Textos finais de todas as seções estão na spec do site (§6), sem lorem ipsum.
- Os nomes de fazendas, cafeterias e pessoas são inventados. O depoimento ("A Golden Grains mudou nosso espresso…", Marina, Café do Largo) é fictício e coberto pela linha "marca fictícia". Num cliente real, só entram depoimentos reais.
- Os números (12 produtores, 1.250 m de altitude média, 86,5 pontos SCA, 7 dias da torra ao envio) e o preço são fictícios.
- Fotos e vídeo: ainda pendentes (rodada 2). Vêm de bancos com licença comercial gratuita (Pexels e Unsplash) e são registrados no SPEC §6. Nenhum asset tem logotipo de marca real, rosto em destaque ou embalagem com marca visível.
- Não fabricar: clientes, prêmios, certificações, imprensa ou números além dos da spec.

## Product Principles

1. **Uma ação.** Tudo leva ao "Assine o clube" pelo WhatsApp; o resto é secundário.
2. **Provar com fatos, não com adjetivos.** Origem com lugares, altitude e pontuação, não texto institucional.
3. **O ritmo é o conceito.** A página começa lenta e termina intensa; cada seção tem uma ideia e uma interação forte.
4. **Funciona antes do JS.** CTA, conteúdo e navegação servem sem script; o motion é camada por cima.
5. **Honestidade de ficção.** Marca, pessoas e números fictícios ficam declarados como tal.

## Accessibility & Inclusion

WCAG AA: contraste, foco visível, ordem de tab lógica e `alt` em toda imagem. Alvo de toque ≥ 44px, link "pular para o conteúdo", site utilizável com `prefers-reduced-motion` (só fades curtos, sem scrub nem parallax). O marquee de parceiros tem botão de pausa (WCAG 2.2.2), e o leitor de tela lê cada texto revelado uma vez só.
