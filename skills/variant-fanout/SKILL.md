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
- `brief.md` existe (skill `design-brief`). Se for lead, `dna.md` também (skill `brand-dna`).
- Defina N: padrão **4**; 3 se o brief for muito fechado; 5 se o usuário quer explorar.
- Escopo: página inteira ou só uma seção (hero, pricing...). Para hero, a regra é: 5 estilos → escolhe 1 → 3 variações dentro dele → 1 vencedor.

### 1. Distribuir direções
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
| Copy | voz do negócio (DNA), específica, sem jargão de IA |
| Alma | dá pra reconhecer o negócio sem o logo? tem o "detalhe de dono"? |
| Slop (penalidade) | −2 por P0, −0.5 por P1 do lint/inspeção |

Monte a tabela comparativa e escolha: **1 vencedora + até 3 enxertos** (ex.: "hero da v2, prova social da v4, footer da v1").

### 5. Rodada 2 (modelo principal escreve)
O principal gera **2 versões refinadas** em `variantes/r2/`:
- `r2/a-fiel`: vencedora + enxertos, corrigindo tudo que a auditoria apontou
- `r2/b-ousada`: mesma base, empurrando a ousadia 1-2 pontos acima nos dials
Rode lint + screenshots de novo. Mostre ao usuário as duas com a tabela de notas atualizada.

Opcional: se o usuário quiser mais exploração, rode **mais uma rodada Haiku** com 3 variações *dentro* da família vencedora (ex.: 3 heros diferentes), e o principal funde.

### 6. Ajuste fino
Injete o painel de ajustes na escolhida (só em dev):
`<script src="tweak-panel.js" defer></script>` copiando `${CLAUDE_PLUGIN_ROOT}/scripts/tweak-panel.js` para a pasta. Ele lê as CSS custom properties de `:root` e cria controles (cor, tamanho, fonte) ao vivo, com botão "copiar tokens". O usuário ajusta visualmente e cola os tokens de volta. Nunca chute ajuste fino no terminal.

### 7. Finalizar
Copie para `final/`, remova o tweak panel, rode a skill `lancamento-lp` e o QC da skill `anti-slop`.

## Custos e limites
- Haiku é barato e rápido: ótimo para exploração larga. Não peça a ele decisões finais.
- Se o rate limit apertar, rode em 2 lotes (3 + 2).
- Cada builder deve entregar arquivo único autossuficiente (HTML + Tailwind CDN ou CSS inline) no r1, para a galeria funcionar sem build. Projeto Next/Astro só no `final/`.
