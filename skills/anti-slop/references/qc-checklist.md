# QC pre-flight (qualquer item falho bloqueia entrega)

## Visual
- [ ] `slop-lint` sem P0
- [ ] Nenhuma fonte banida em título; display e texto definidos como tokens
- [ ] Acento ≤ 2 usos visíveis por tela
- [ ] Pelo menos 1 seção fora do esqueleto padrão
- [ ] Nenhum grid de 3 cards idênticos; nenhum card dentro de card
- [ ] O "movimento ousado" e o "detalhe de dono" estão visíveis acima da dobra ou na 2ª dobra

## Texto
- [ ] Zero lorem/placeholder; dados não verificados marcados `[DADO REAL: ...]`
- [ ] Zero métrica inventada
- [ ] CTAs com verbo + objeto ("Chamar no WhatsApp"), sem intenção duplicada lado a lado
- [ ] Sem travessões em excesso; PT-BR natural, sem "Eleve seu..." / "Transforme sua..." / "Descubra o poder"

## Acessibilidade
- [ ] Contraste AA (4.5:1 corpo / 3:1 títulos ≥ 24px)
- [ ] HTML semântico: um `h1`, `header/main/section/footer`, `button` vs `a` correto
- [ ] `alt` descritivo em toda imagem de conteúdo; `alt=""` nas decorativas
- [ ] Foco visível em tudo que é clicável
- [ ] `prefers-reduced-motion` respeitado

## Movimento
- [ ] Sem `transition: all`
- [ ] Só `transform`/`opacity` animados (ou `filter` com parcimônia)
- [ ] Durações de UI 120-250ms; entradas maiores ≤ 500ms; easing customizado
- [ ] Nada anima em ação frequente (digitar, filtrar, abrir menu repetidamente)

## Responsivo
- [ ] Testado em 390px e 1440px (screenshots via Playwright)
- [ ] Header < 80px; CTA do hero não quebra linha; CTA fixo no mobile
- [ ] Sem scroll horizontal; tap targets ≥ 44px

## Técnico
- [ ] Keys estáveis em listas React
- [ ] Imagens com `width/height` ou `aspect-ratio` (sem layout shift), `loading="lazy"` abaixo da dobra
- [ ] Estados de vazio/carregando/erro onde houver dados
- [ ] Lighthouse mobile: Performance ≥ 90, A11y ≥ 95 (quando rodar)
