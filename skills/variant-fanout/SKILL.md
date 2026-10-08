---
name: variant-fanout
description: Orquestra o "leque" de variantes - dispara 3 a 5 subagentes Haiku (variant-builder) em paralelo, cada um com uma família visual diferente, depois o modelo principal audita com rubrica, escolhe, funde e gera versões melhores. Use quando o usuário pedir variações, opções, "abre o leque", várias versões de uma página/seção, ou ao começar uma LP nova pelo comando /lp-forge:forjar.
---

# Leque de variantes (Haiku gera, modelo principal audita e refina)

One-shot é loteria de prompt. Abrir o leque = ver opções lado a lado, comparar em vez de adivinhar, e a fidelidade sobe a cada rodada.

```
brief.md + dna.md
      │
      ├─► variant-builder (haiku) · família A ─┐
      ├─► variant-builder (haiku) · família B ─┤
      ├─► variant-builder (haiku) · família C ─┼─► variantes/r1/vN-<familia>/
      ├─► variant-builder (haiku) · família D ─┤
      └─► variant-builder (haiku) · família E ─┘
                                               │
             modelo principal (Opus/Fable/Sonnet): screenshots + lint + rubrica
                                               │
                      vencedora + enxertos ──► variantes/r2/ (2 versões refinadas pelo principal)
                                               │
                                     ajustes finos (tweak panel) ──► final/
```

## Passo a passo (o modelo principal executa)

### 0. Pré-requisitos
- `brief.md` existe (skill `design-brief`). Se for lead, `dna.md`, `fatos.md`, `voz.md` (skill `brand-dna`) e `referencias.md` + `referencias/` (skill `referencias-do-ramo`) também.
- Defina N: padrão **4**; 3 se o brief for muito fechado; 5 se o usuário quer explorar.
- Escopo: página inteira ou só uma seção (hero, pricing...). Para hero, a regra é: 5 estilos → escolhe 1 → 3 variações dentro dele → 1 vencedor.

### 1. Distribuir direções
Antes: `node "${CLAUDE_PLUGIN_ROOT}/scripts/historico.mjs" fontes` → lista do que NÃO repetir (displays, fundos, padrões dos últimos projetos). Regras do leque (`repertorio/references/familias.md`):
- cada variante com família diferente E display de categoria diferente (serif / grotesk / condensada / humanista / mono), nenhuma do cemitério nem do histórico; escreva a fonte de cada uma no prompt, não deixe o Haiku escolher;
- paleta de cada variante sai do DNA (cores reais da marca); pelo menos 1 variante usa a cor da marca como fundo de seção inteira; nenhuma com fundo bege/creme;
- pelo menos 1 variante é "a referência mais forte do `referencias.md` traduzida pro cliente";
- cada prompt lista 2-3 referências (site + screenshot em `referencias/`) que aquela variante DEVE aplicar.

Escolha N famílias **contrastantes** da skill `repertorio` (ou N interpretações bem distintas de uma família, se o usuário já escolheu a família). Para cada uma, escreva uma direção de 4-6 linhas: família, dials, fonte display, ousadia específica, seção fora do padrão que ela deve ter.

### 2. Disparar em paralelo
Chame a ferramenta Agent N vezes **na mesma mensagem** (paralelo), `subagent_type: "lp-forge:variant-builder"`, cada uma com prompt:
```
Rodada: r1 · Variante: v<k>-<familia>
Pasta de saída: variantes/r1/v<k>-<familia>/
Brief: ./brief.md   DNA: ./dna.md (se existir)
Direção:
<as 4-6 linhas>
Escopo: <página inteira | seção X>
Stack: <do brief>
```
Não repita o brief no prompt; o agente lê o arquivo.

**Fallback (chat do claude.ai / onde os agentes do plugin não carregam):** se o tipo `lp-forge:variant-builder` não existir, leia `${CLAUDE_PLUGIN_ROOT}/agents/variant-builder.md` (ou o arquivo do plugin no repo) e dispare agentes genéricos (`general-purpose`) com `model: "haiku"`, colando o corpo desse arquivo antes do prompt acima. Mesmo para `slop-auditor` (modelo herdado) e `visual-qa` (haiku). O hook do lint não roda nesses ambientes: rode `slop-lint.mjs` na mão depois de cada variante.

### 3. Galeria
`node "${CLAUDE_PLUGIN_ROOT}/scripts/gallery.mjs" variantes/r1` → gera `variantes/r1/index.html` com todas lado a lado (desktop + mobile em iframes). Mostre ao usuário (abrir no navegador, publicar como artifact, ou screenshots via Playwright).

### 4. Auditoria (modelo principal, não delegue)
Para cada variante:
- `node "${CLAUDE_PLUGIN_ROOT}/scripts/slop-lint.mjs" variantes/r1/vK-*/`
- Screenshot 1440px e 390px (Playwright MCP: `browser_navigate` para `file://` ou servidor local, `browser_resize`, `browser_take_screenshot`). Olhe as imagens de verdade.
- Nota 0-10 em cada dimensão da rubrica abaixo, com 1 linha de justificativa. Diga como seria o 10.

**Rubrica**
| Dimensão | O que olhar |
|---|---|
| Tipografia | par de fontes, escala, ritmo, display com caráter |
| Cor | tokens coerentes, acento contido, contraste AA |
| Layout/espaço | hierarquia, respiro, quebra do esqueleto padrão, assimetria proposital |
| Conversão | ação principal óbvia, CTA claro e fixo no mobile, prova real perto do CTA |
| Movimento | adequado aos dials, só transform/opacity, reduced motion |
| Copy | só fatos do `fatos.md`, voz do `voz.md`, zero clichê/estrutura de IA (skill `copy-sem-slop`); passe o teste do nome coberto |
| Alma | dá pra reconhecer o negócio sem o logo? tem o "detalhe de dono"? |
| Referências | o mapa de referências existe e cada item aparece de verdade na tela? (abra os dois screenshots lado a lado) |
| Repetição (penalidade) | −3 se a display, o fundo ou um padrão (fotos inclinadas, H1 itálico) repetir o histórico ou outra variante |
| Slop (penalidade) | −2 por P0, −0.5 por P1 do lint/inspeção |

Complementos de auditoria (skills incluídas): rode `/impeccable audit` na vencedora provável e `web-design-guidelines` no HTML dela; some os achados à tabela. Para revisar só a animação, `review-animations`.

Variante com nota de Referências < 6 ou com penalidade de Repetição **não pode vencer**, mesmo com nota total maior. Não escolha a vencedora pela fonte "mais bonita"; escolha pela que mais parece aquele negócio + aplica as referências.

Monte a tabela comparativa e escolha: **1 vencedora + até 3 enxertos** (ex.: "hero da v2, prova social da v4, footer da v1").

### 5. Rodada 2 (modelo principal escreve)
O principal gera **2 versões refinadas** em `variantes/r2/`:
- `r2/a-fiel`: vencedora + enxertos, corrigindo tudo que a auditoria apontou
- `r2/b-ousada`: mesma base, empurrando a ousadia 1-2 pontos acima nos dials
Rode lint + screenshots de novo. Mostre ao usuário as duas com a tabela de notas atualizada.

Opcional: se o usuário quiser mais exploração, rode **mais uma rodada Haiku** com 3 variações *dentro* da família vencedora (ex.: 3 heros diferentes), e o principal funde.

### 5b. Passe de copy (você, modelo principal)
Antes do ajuste fino, reescreva a copy da escolhida com a skill `copy-sem-slop` (ou `copy-editing` + `stop-slop` se for em inglês): lint de copy zerado, nota ≥ 38/50, nenhum `[DADO REAL]` que o usuário já possa responder. Texto genérico em layout bom é o slop que mais sobra.

### 6. Ajuste fino
Injete o painel de ajustes na escolhida (só em dev):
`<script src="tweak-panel.js" defer></script>` copiando `${CLAUDE_PLUGIN_ROOT}/scripts/tweak-panel.js` para a pasta. Ele lê as CSS custom properties de `:root` e cria controles (cor, tamanho, fonte) ao vivo, com botão "copiar tokens". O usuário ajusta visualmente e cola os tokens de volta. Nunca chute ajuste fino no terminal.

### 7. Finalizar
Copie para `final/`, remova o tweak panel, rode a skill `lancamento-lp` e por fim `/lp-forge:validar` (agente `validador`, contexto limpo). Só entrega com APROVADO.

## Custos e limites
- Haiku é barato e rápido: ótimo para exploração larga. Não peça a ele decisões finais.
- Se o rate limit apertar, rode em 2 lotes (3 + 2).
- Cada builder deve entregar arquivo único autossuficiente (HTML + Tailwind CDN ou CSS inline) no r1, para a galeria funcionar sem build. Projeto Next/Astro só no `final/`.
