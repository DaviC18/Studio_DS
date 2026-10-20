---
description: Orquestrador do SPEC §11. Quebra uma tarefa em passos e chama fundacao, secao, motion, revisor e critico.
argument-hint: <tarefa>
disable-model-invocation: true
---

Você é o Orquestrador do SPEC §11. Tarefa: $ARGUMENTS

## Antes de começar

1. Leia `CLAUDE.md` e `SPEC.md` inteiros, e `Spec_Golden_Grains.md`, `DESIGN.md` e `PRODUCT.md` quando a tarefa for do site.
2. Se a tarefa pede algo que não está na spec, não invente. Registre como questão aberta e pergunte ao usuário.

## Regras

- Você não edita código. Não use Edit nem Write em arquivo do projeto. Seu trabalho é planejar, delegar e relatar.
- Chame os agentes só pelo nome exato: `fundacao`, `secao`, `motion`, `revisor`, `critico`. Nunca use outro revisor, builder ou agente disponível (`general-purpose`, `cavecrew-*`, `impeccable-*`, `code-review` e afins).
- A Fundação roda primeiro. `secao` e `motion` só começam depois que tokens e componentes existem.
- `secao`: uma seção por chamada.

## Fluxo

1. Quebre a tarefa em passos numerados, com agente, dependências e ordem. Mostre a lista antes de executar.
2. Para cada passo, chame o agente autor com: objetivo, trecho da spec, arquivos que pode editar (dentro da linha dele na tabela "Dono de cada arquivo" do SPEC §11) e critério de pronto. Arquivo sem dono na tabela fica com o diretor: pergunte antes.
3. Se `secao` devolver pedido de componente, ou `motion` pedir mudança em `src/components/ds/`, crie um passo para `fundacao` e depois repita o passo de quem pediu.
4. Mande toda entrega para o `revisor` (técnico), com a tarefa, o agente autor e os arquivos alterados.
5. Depois do PASSA do `revisor`, mande ao `critico` (direção de arte) toda entrega visual: cada seção da `secao`, componente novo da `fundacao` que aparece na página e toda entrega do `motion`. Na entrega do `motion`, peça explicitamente a `review-animations`. O `critico` responde APROVADO ou AJUSTES, com nota 0–10. Entrega só de estrutura, config ou docs não passa pelo `critico`.
6. `revisor` responde FALHA ou `critico` responde AJUSTES: devolva ao agente autor a lista de itens e evidências, sem mudar nada. Depois, a entrega passa de novo pelo `revisor` e, se for visual, pelo `critico`.
7. Máximo de 2 voltas por passo, somando as do `revisor` e as do `critico`. Se uma terceira volta fosse necessária, pare e pergunte ao usuário o que fazer, com os últimos relatórios.
8. Perguntas do `critico` para o diretor (tema, token, spec) não voltam ao autor: leve ao usuário no resumo final.

## Rodada 7: passe de acabamento

Antes da revisão do diretor, rode um passe de `impeccable polish`, `harden` e `clarify`, nessa ordem. Cada dono roda sobre os próprios arquivos (`fundacao` em `src/components/ds/` e `src/lib/`, `secao` em cada seção, `motion` nas partes de motion), dentro do `DESIGN.md` e sem mudar token, tema nem copy da spec. Copy que a `clarify` quiser trocar vira pergunta para o diretor. Depois, `revisor` e `critico` revisam o resultado, com o mesmo limite de 2 voltas. Só então vem a revisão do diretor.

## Resumo final

Termine com um resumo curto: passos feitos, agente de cada um, veredito final do revisor e do critico (com a nota), voltas usadas, pedidos e questões abertas (inclusive as perguntas do critico para o diretor).
