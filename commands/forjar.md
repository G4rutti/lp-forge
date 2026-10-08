---
description: Pipeline completo de LP - DNA da marca, brief, leque de 3-5 variantes Haiku, auditoria e refino pelo modelo principal, checklist de lançamento
argument-hint: <negócio ou @insta ou descrição> [n=4] [familias=a,b,c]
---

Forje uma landing page para: $ARGUMENTS

Siga esta ordem sem pular etapas (as skills do plugin lp-forge têm os detalhes):

1. **DNA** (skill `brand-dna`): se veio @ do Instagram, link do Maps ou nome de negócio real, colete e salve `dna.md` + `assets/`. Se é projeto próprio/sem negócio, pule e use o que o usuário disse.
2. **Brief** (skill `design-brief`): escreva `brief.md` com os 4 inputs e dials. Pergunte no máximo 3 coisas que realmente faltam; o resto decida e marque `(decidido)`.
3. **Leque** (skill `variant-fanout`): escolha N famílias contrastantes (padrão 4, ou as passadas em `familias=`), dispare N subagentes `lp-forge:variant-builder` **em paralelo numa única mensagem**, gere a galeria.
4. **Auditoria** (você, modelo principal): lint + screenshots 1440/390 + rubrica de 7 dimensões. Tabela comparativa, vencedora + enxertos.
5. **Rodada 2** (você escreve): `r2/a-fiel` e `r2/b-ousada`. Lint + screenshots de novo. Mostre as duas ao usuário com as notas e pergunte qual seguir.
6. Depois da escolha: painel de ajustes, `final/`, skill `lancamento-lp`, QC da skill `anti-slop`.

Mantenha o usuário informado com uma linha por etapa concluída, não narre cada passo.
