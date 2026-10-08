---
description: Pipeline completo de LP - DNA da marca, brief, leque de 3-5 variantes Haiku, auditoria e refino pelo modelo principal, checklist de lançamento
argument-hint: <negócio ou @insta ou descrição> [n=4] [familias=a,b,c]
---

Forje uma landing page para: $ARGUMENTS

Siga esta ordem sem pular etapas (as skills do plugin lp-forge têm os detalhes):

1. **DNA** (skill `brand-dna`): se veio @ do Instagram, link do Maps ou nome de negócio real, colete e salve `dna.md`, `fatos.md` (cada fato com fonte e data), `voz.md` (perfil da voz do dono a partir de textos reais) e `assets/`. Se é projeto próprio/sem negócio, pule e use o que o usuário disse.
2. **Referências do ramo** (skill `referencias-do-ramo`): 3 `lp-forge:ref-scout` em paralelo, captura com `scripts/ref-capture.mjs`, curadoria olhando os screenshots, `referencias.md`.
3. **Vibe** (skill `vibe`): `vibe.md` com os eixos e evidências + `componentes.md` com 2-3 candidatos por seção vindos do 21st, OriginKit e southleft.
4. **Brief** (skill `design-brief`): escreva `brief.md` com os 4 inputs e dials. Pergunte no máximo 3 coisas que realmente faltam; o resto decida e marque `(decidido)`.
5. **Leque** (skill `variant-fanout`): escolha N famílias contrastantes (padrão 4, ou as passadas em `familias=`), dispare N subagentes `lp-forge:variant-builder` **em paralelo numa única mensagem**, gere a galeria.
6. **Auditoria** (você, modelo principal): lint + screenshots 1440/390 + rubrica de 7 dimensões. Tabela comparativa, vencedora + enxertos.
7. **Rodada 2** (você escreve): `r2/a-fiel` e `r2/b-ousada`. Lint + screenshots de novo. Mostre as duas ao usuário com as notas e pergunte qual seguir.
8. Depois da escolha: passe de copy (skill `copy-sem-slop`, lint de copy zerado), painel de ajustes, `final/`, skill `lancamento-lp`.
9. **Validação** (`/lp-forge:validar`): um `lp-forge:validador` novo, sem resumo do que você fez. REPROVADO → corrija e valide de novo com outro validador. Só mostre/mande pro lead depois de APROVADO.

Mantenha o usuário informado com uma linha por etapa concluída, não narre cada passo.
