---
name: anti-slop
description: Regras anti-AI-slop para qualquer landing page, site ou tela. Use SEMPRE que for criar, revisar ou ajustar HTML/CSS/React/Tailwind de front-end, antes de entregar qualquer página, e quando o usuário reclamar que algo "tá com cara de IA", "genérico" ou "template".
---

# Anti-slop

Slop não é problema técnico, é problema de repertório e de decisões não tomadas. O modelo cai no padrão médio de SaaS quando o pedido é vago ("faz bonito", "deixa premium"). Este arquivo obriga decisões.

## Regra de ouro
Antes de escrever código, responda por escrito (no plano ou no `brief.md`):
1. Modo: **marca** (expressivo, marketing) ou **produto** (denso, funcional)?
2. Família visual (ver skill `repertorio`) e os 3 dials: variância 1-10, movimento 1-10, densidade 1-10.
3. Fonte display + fonte de texto (nenhuma das banidas).
4. Paleta: 1 acento, neutros tingidos na matiz da marca, em OKLCH.
5. **O movimento ousado**: UMA escolha que ninguém faria por padrão (tipografia, proporção, cor, layout).
6. **O detalhe de dono**: UMA coisa que só quem conhece o negócio saberia (horário, bairro, frase de cliente real, procedimento específico).

Se não dá pra responder 5 e 6, falta informação: busque no DNA da marca (skill `brand-dna`) antes de inventar.

## P0: pecados capitais (bloqueiam entrega)
- Acento índigo/roxo padrão (`#6366f1 #4f46e5 #4338ca #3730a3 #8b5cf6 #7c3aed #a855f7` e parentes). Use o token `--accent` do brief.
- Gradiente "confiança" de hero: roxo→azul, azul→ciano, índigo→rosa. Superfície chapada + tipografia forte ganha.
- Emoji como ícone em `h1-h6`, botão, `li` ou `.icon`. Use SVG monoline (stroke 1.5-1.8, `currentColor`), Lucide/Phosphor/Tabler.
- Inter, Roboto, Arial, Open Sans, `system-ui` como fonte de título.
- Card arredondado com borda colorida só na esquerda.
- Métricas inventadas ("10x mais vendas", "99,9%", "+5.000 clientes"). Use dado real do cliente ou placeholder rotulado `[DADO REAL: nº de avaliações no Google]`.
- Lorem ipsum, "Feature 1/2/3", "Lorem dolor", texto de exemplo.
- `transition: all`; animar `width/height/top/left/margin`.
- Texto cinza sem contraste (WCAG AA: 4.5:1 corpo, 3:1 títulos grandes).

## P1: tells fortes (corrigir)
- Esqueleto Hero → 3 cards de features → Pricing → FAQ → CTA sem nenhuma quebra. Toda página precisa de pelo menos UMA seção fora do padrão (citação de cliente em tela cheia, comparação com o "jeito de hoje", demo inline, linha do tempo do atendimento, mapa ilustrado).
- Grid de 3 cards idênticos com ícone + título + 2 linhas. Se tiver que listar, varie tamanho (bento com célula dominante) ou use lista tipográfica.
- Cards dentro de cards. Agrupe por espaço, borda fina ou tipografia.
- Hero centralizado com badge pílula em cima ("✨ Novo"), headline, sub, 2 botões e mockup falso de dashboard.
- Glassmorphism, glow escuro, blobs e ondas SVG decorativos sem significado.
- Placeholder externo (unsplash/picsum/placehold) na entrega final. Prévia pode usar foto do Insta do cliente; final usa foto real.
- Acento usado mais de ~2x por tela. Acento é tempero.
- Layout perfeitamente simétrico do começo ao fim. Alterne seções apertadas e respiradas.
- Travessão (—) espalhado pela copy. Troque por vírgula, dois-pontos ou parênteses.
- Animação bounce/elastic em tudo, scroll-reveal em todo bloco.

## P2: polimento
- Label de botão genérico ("Saiba mais", "Começar"). Escreva a ação: "Agendar avaliação pelo WhatsApp".
- Uma micro-interação memorável (botão que afunda 1-2px no press, número que conta), não dez.
- Linha de texto com 60-75 caracteres; `line-height` ~1.5 no corpo, ~1.05-1.15 no display.
- Números com `font-variant-numeric: tabular-nums`.
- Header < 80px de altura, CTA do hero visível sem scroll e sem quebrar linha.
- Headline máx. 2 linhas no desktop; sub máx. ~20 palavras.

## Texto (metade do slop está na copy)
Layout bom com texto genérico continua parecendo IA. Toda copy segue a skill `copy-sem-slop`: só fatos do `fatos.md`, voz do `voz.md`, sem frases-clichê nem estruturas de IA ("não é X, é Y", "mais que um X, um Y", "Sem X. Sem Y.", "E o melhor?"). Escreva `copy.md` antes do HTML. O `slop-lint` bloqueia (P0) clichês e contrastes binários em PT-BR no texto visível.

## Proporção 80/20
80% padrões comprovados (legibilidade, hierarquia, CTA claro), 20% decisões distintas. Teste final: alguém de fora reconhece de qual negócio é o print sem ler o logo? Se não, falta alma.

## Ferramentas
- Skills incluídas no plugin que complementam esta: `impeccable` (`/impeccable audit`, `critique`, `polish`, `bolder`, `quieter`, `typeset`...), `design-taste-frontend` (dials de variância/movimento/densidade), `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `redesign-existing-projects` (pra site que já existe), `web-design-guidelines` (revisão Vercel de a11y/UX em `file:line`), `frontend-design` (Anthropic).
- Rode `node "${CLAUDE_PLUGIN_ROOT}/scripts/slop-lint.mjs" <arquivo-ou-pasta>` antes de dizer que terminou. P0 = não entrega.
- Checklist completo de QA: `references/qc-checklist.md`.
- Tabela de troca rápida (o que a IA faz → o que fazer): `references/trocas.md`.
