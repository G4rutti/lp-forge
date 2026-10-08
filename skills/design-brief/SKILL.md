---
name: design-brief
description: Monta o brief de design em 4 inputs (estética, referência, intenção, guardrails) + dials de variância/movimento/densidade antes de gerar qualquer página. Use no início de toda landing page, site ou redesign, e sempre que o pedido for vago tipo "faz uma LP bonita".
---

# Design brief (4 inputs, nada de design.md de 10 mil linhas)

Gere `brief.md` na raiz do projeto ANTES de qualquer código. Todo subagente lê esse arquivo. Se faltar informação, pergunte no máximo 3 coisas; o resto decida e marque como `(decidido)`.

## Template

```md
# Brief: <nome do negócio>

## 0. Contexto
- Negócio / nicho / cidade:
- Público (quem, idade aprox., o que teme, o que quer):
- Ação principal da página (UMA): ex. chamar no WhatsApp pra agendar avaliação
- Stack: HTML+Tailwind estático | Next.js + Tailwind + Motion | Astro
- Modo: marca | produto

## 1. Estética
- Família visual: (ver skill repertorio, ex. galeria-editorial)
- Dials: variância __/10 · movimento __/10 · densidade __/10
- Fonte display: ____ · Fonte texto: ____
- Tokens: --bg, --fg, --muted, --accent, --line (OKLCH)
- Raio: __ · Movimento ousado: ____

## 2. Referência (combinar a sensação, não copiar)
- URL/print 1: o que pegar dela (ex. ritmo do hero)
- URL/print 2: ...
- Anti-referência: o que NÃO queremos parecer

## 3. Intenção
- Pra quem e o que deve acontecer depois de 10s na página
- Detalhe de dono: ____
- Provas reais disponíveis: nº avaliações Google, nota, anos de casa, fotos

## 4. Guardrails
- SEMPRE: mobile-first, contraste AA, CTA WhatsApp fixo no mobile, fotos reais
- NUNCA: pop-up, autoplay com som, dark pattern, métrica inventada, jargão vazio, fontes/paletas banidas (skill anti-slop)
```

Se o cliente não tem identidade visual nenhuma, rode a skill `brandkit` antes pra gerar uma base (paleta, tipografia, tom). Para os dials com mais nuance, a skill `design-taste-frontend` usa a mesma lógica (variância/movimento/densidade).

## Dials (guia rápido)
| Dial | 1-3 | 4-6 | 7-10 |
|---|---|---|---|
| Variância | grid simétrico, previsível | quebras pontuais | assimetria forte, sobreposição, tipografia gigante |
| Movimento | quase estático | entradas suaves + hover | coreografia, scroll-driven, 3D/perspectiva |
| Densidade | muito respiro, 1 ideia por dobra | médio | denso, editorial, muita info por tela |

Padrões por nicho (ponto de partida, não regra):
- Estética/saúde/beleza local: 5 / 4 / 3
- Corretor/imobiliária premium: 6 / 5 / 4
- Agência/estúdio/portfólio: 8 / 7 / 4
- SaaS/produto: 4 / 3 / 6

## Ordem de construção (não pule)
1. Hero certo primeiro: gere opções, escolha uma, refine a cor.
2. Transições entre hero e corpo (sem corte seco).
3. Movimento: o que é mais pesado carrega com presença; o resto quieto.
4. Barra de ajustes (ver skill `variant-fanout`, painel de tweaks) pra fonte/tamanho/acento ao vivo, em vez de chutar no terminal.
5. Alimente com referências até parecer seu.
