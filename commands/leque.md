---
description: Abre o leque - gera 3 a 5 variantes em paralelo com subagentes Haiku a partir do brief.md (página inteira ou uma seção)
argument-hint: [n=3..5] [secao=hero|pricing|...] [familias=a,b,c] [dentro-de=<familia>]
---

Abra o leque com os parâmetros: $ARGUMENTS

- Exija `brief.md` (se não existir, rode a skill `design-brief` primeiro).
- Siga a skill `variant-fanout` passos 1 a 4: direções contrastantes (ou, com `dentro-de=`, N variações dentro daquela família), N chamadas paralelas de `lp-forge:variant-builder` numa única mensagem, galeria com `scripts/gallery.mjs`, auditoria com rubrica feita por você.
- Use a próxima rodada livre em `variantes/` (r1, r2, r3...).
- Termine com a tabela de notas e a recomendação (vencedora + enxertos). Não gere a rodada de refino sem o usuário pedir, a menos que ele tenha dito pra seguir direto.
