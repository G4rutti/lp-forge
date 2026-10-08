---
description: Validação independente de uma LP pronta - portões mecânicos, slop, fatos contra fatos.md, visual e checklist - com APROVADO/REPROVADO
argument-hint: <pasta|arquivo|URL> [previa|final]
---

Valide: $ARGUMENTS

Dispare um subagente `lp-forge:validador` (no chat sem agentes do plugin: agente genérico com o corpo de `agents/validador.md` no prompt e o modelo da sessão) com o caminho da página, o modo (`previa` se não for dito `final`) e a pasta do projeto. Ele não pode ter visto a página ser feita: não passe resumo do que você fez, só os caminhos.

Mostre o resultado ao usuário: APROVADO/REPROVADO e os bloqueios. Se reprovou e o usuário quiser, corrija você mesmo (modelo principal) e rode `/lp-forge:validar` de novo com um validador novo.
