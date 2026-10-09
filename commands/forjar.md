---
description: Pipeline de LP - DNA, referências, vibe, brief, leque Haiku, auditoria, refino e validação. Modo rápido (padrão, econômico) ou completo
argument-hint: <negócio ou @insta ou descrição> [modo=rapido|completo] [n=3] [familias=a,b,c]
---

Forje uma landing page para: $ARGUMENTS

## Modo (leia primeiro, define o custo)
- **rapido** (padrão, se `modo=` não veio): 3 variantes, 1 scout de referências, capturas `--light`, auditoria enxuta, UMA rodada 2, validador 1x. Meta: caber em uma fração pequena do limite.
- **completo** (só se pedirem `modo=completo`): 4-5 variantes, 3 scouts, rodada 2 com a-fiel + b-ousada, skills complementares de auditoria, validador até aprovar.

## Regras de economia (valem nos dois modos)
- Skills de terceiros não são carregadas pelo nome: quando uma etapa pedir uma, leia só o `SKILL.md` dela por `${CLAUDE_PLUGIN_ROOT}/skills/<nome>/SKILL.md`, e só quando a etapa pedir. Nunca leia a pasta inteira.
- Imagem é o que mais gasta. Olhe no máximo **1 imagem desktop + 1 mobile por página**, só os `.jpg` que `validate-page.mjs` e `ref-capture.mjs --light` geram. Nunca refaça screenshot da mesma página sem ter mudado ela. Na auditoria compare as variantes pelo lint, pelos portões e pelo desktop; mobile só da vencedora.
- Não releia arquivos que você mesmo acabou de escrever. Passe caminhos pros subagentes, não conteúdo.
- Pare e pergunte antes de gastar mais: depois da galeria do leque (se o usuário só quer ver opções) e depois da rodada 2.

## Etapas
1. **DNA** (`brand-dna`): se veio @ do Instagram, link do Maps ou nome de negócio real, colete e salve `dna.md`, `fatos.md` (cada fato com fonte e data), `voz.md` e `assets/`. Projeto próprio/sem negócio: pule.
2. **Referências** (`referencias-do-ramo`): rapido = 1 `lp-forge:ref-scout` (recorte "mercado maior" + galeria da categoria), até 5 sites, `ref-capture.mjs --light`. completo = 3 scouts, até 8 sites, sem `--light`. Curadoria olhando só os `-desktop.jpg` escolhidos. Gera `referencias.md`.
3. **Vibe** (`vibe`): `vibe.md` + `componentes.md` com 2 candidatos por seção (21st, OriginKit, southleft). Consulta curta, sem baixar código de componente que não vai usar.
4. **Brief** (`design-brief`): `brief.md`. Pergunte no máximo 3 coisas; o resto decida e marque `(decidido)`.
5. **Leque** (`variant-fanout`): N famílias contrastantes (rapido 3, completo 4-5, ou `familias=`), N `lp-forge:variant-builder` **em paralelo numa única mensagem**, depois `gallery.mjs`.
6. **Auditoria** (você): `slop-lint --json` + `validate-page.mjs --out qa/<v>` em cada variante (a tabela de portões já diz muito), rubrica nas 7 dimensões olhando só o desktop. Vencedora + enxertos. completo: some `/impeccable audit` e `web-design-guidelines` na vencedora.
7. **Rodada 2**: rapido = uma só (`r2/final-candidata`: vencedora + enxertos corrigindo a auditoria). completo = `r2/a-fiel` e `r2/b-ousada`. Lint + validate de novo, mostre ao usuário e pergunte qual seguir.
8. Depois da escolha: passe de copy (`copy-sem-slop`, lint de copy zerado), `final/`, `lancamento-lp`.
9. **Validação** (`/lp-forge:validar`): um `lp-forge:validador` sem resumo do que você fez. REPROVADO → corrija só o que ele apontou e valide de novo (rapido: no máximo 1 reprovação; se reprovar 2x, mostre o relatório ao usuário). Só mostre/mande pro lead depois de APROVADO.

Uma linha por etapa concluída, sem narrar cada passo.
