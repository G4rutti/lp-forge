---
description: Audita uma página (ou pasta de variantes) contra AI slop - lint, screenshots desktop/mobile, notas 0-10 por dimensão e top 5 correções
argument-hint: <arquivo ou pasta ou URL> [--corrigir]
---

Audite: $ARGUMENTS

1. Rode `node "${CLAUDE_PLUGIN_ROOT}/scripts/slop-lint.mjs" <alvo>`.
2. Delegue a avaliação a um subagente `lp-forge:slop-auditor` (ele não viu a página ser feita, então não se autoavalia). Se forem várias páginas, um auditor só para todas, para comparar.
3. Em paralelo, um `lp-forge:visual-qa` para o checklist mecânico.
4. Junte os dois relatórios numa resposta curta: tabela de notas, top 5 correções, o que manter.
5. Se o argumento tiver `--corrigir`, aplique as correções você mesmo (modelo principal), rode o lint de novo e mostre antes/depois.
