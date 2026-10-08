# Famílias visuais (tokens prontos)

Matiz `H` = matiz do acento da marca (do DNA). Ajuste L/C se o contraste falhar.

---
## galeria-editorial
Referência: hero com headline serif itálica de 2-3 linhas ("We craft / motion that / *moves.*") com a última palavra no acento, fundo off-white, e uma nuvem de 10-14 cards de foto em perspectiva 3D espalhados à direita, sobrepondo levemente o título. Nav mínima de 4 links em versalete pequeno no topo; botão secundário discreto no canto inferior.
- Fontes: display `Instrument Serif` (itálico) ou `Fraunces` (opsz alto, itálico); texto `Geist` / `Manrope`
- Tokens: `--bg: oklch(0.965 0.008 70)` · `--fg: oklch(0.2 0.01 60)` · `--muted: oklch(0.52 0.01 60)` · `--accent: oklch(0.58 0.19 30)` (vermelho-tijolo) · `--line: oklch(0.88 0.008 70)`
- Display: `clamp(3.5rem, 9vw, 8.5rem)`, `line-height: .92`, `letter-spacing: -0.02em`
- Layout: hero 100svh, título ancorado embaixo-esquerda; cards com `transform: perspective(1200px) rotateY(-18deg) rotateX(6deg) translateZ(var(--z))`, tamanhos variados (aspect 4/5, 1/1, 3/2), z-index escalonado
- Movimento 7: cards entram em cascata (opacity+translateZ, 60ms de stagger), parallax leve no mouse (máx. 12px), hover em card = sobe Z e endireita 6deg
- Ousado: a palavra-chave da headline em itálico + acento
- Evitar: mais de 1 cor de acento; cards com sombra pesada (usar sombra curta `0 1px 0 var(--line), 0 18px 40px -24px oklch(0.2 0.02 60 / .35)`)

## editorial-classico
- Fontes: `Gloock` ou `DM Serif Display` + `IBM Plex Sans`
- Tokens: `--bg: oklch(0.975 0.006 85)` · `--fg: oklch(0.18 0.015 260)` · `--accent: oklch(0.42 0.09 255)` (azul-tinta, não índigo) · `--line: oklch(0.8 0.01 85)`
- Layout: grid de 12 col visível em filetes 1px, números de seção (01, 02), colunas de texto estreitas, citações recuadas, fotos com legenda
- Movimento 3: fade curto, sublinhado que desenha no hover
- Ousado: capitular (drop cap) no primeiro parágrafo ou índice lateral fixo

## quieto-clinico
- Fontes: `Fraunces` (peso 300, opsz 144) + `Public Sans`
- Tokens: `--bg: oklch(0.97 0.01 60)` · `--fg: oklch(0.25 0.015 40)` · `--accent: oklch(0.7 0.07 40)` (pêssego/nude) · `--surface: oklch(0.94 0.015 50)`
- Layout: 1 ideia por dobra, fotos grandes com raio 2px, muito espaço vertical (`section { padding-block: clamp(6rem, 14vw, 12rem) }`)
- Movimento 3: imagens com leve scale 1.04→1 ao entrar
- Ousado: depoimento real em tela cheia em serif grande, aspas desenhadas

## print-tech
- Fontes: `JetBrains Mono` / `IBM Plex Mono` (labels) + `Space Grotesk` ou `Bricolage Grotesque`
- Tokens: `--bg: oklch(0.96 0.005 100)` · `--fg: oklch(0.17 0 0)` · `--accent: oklch(0.72 0.19 50)` (laranja sinalização) · grid de pontos no fundo 24px
- Layout: labels em mono pequenas tipo ficha técnica ("SERVIÇO 03 / 45 MIN / R$ 60"), tabelas, bordas 1px pretas, raio 0
- Movimento 5: contadores, texto que "digita", hover que inverte cor
- Ousado: preço/horário como etiqueta técnica gigante

## dither-mono
- Fontes: `Syne` ou `Unbounded` + `Geist Mono`
- Tokens: `--bg: oklch(0.14 0.005 H)` · `--fg: oklch(0.95 0.005 H)` · `--accent: oklch(0.88 0.2 110)` (lima) usado só em 1 elemento
- Layout: imagens em dither 1-bit (CSS `filter: grayscale(1) contrast(1.6)` + máscara de pontilhado, ou pré-processar), tipografia larga
- Movimento 6: hover que revela a foto colorida por baixo do dither
- Ousado: o dither em si

## editorial-bruto
- Fontes: `Anton` / `Bebas Neue` (com cuidado) ou `Archivo Black` + `Inter Tight` só no texto pequeno
- Tokens: `--bg: oklch(0.95 0.02 95)` · `--fg: oklch(0.15 0.01 30)` · `--accent: oklch(0.62 0.22 28)`
- Layout: headline ocupando a largura toda, blocos de cor chapada, bordas 2-3px, marquee de serviços
- Movimento 6: marquee lento, botões que afundam 3px com sombra dura
- Ousado: palavra que sangra pra fora da viewport

## organico-quente
- Fontes: `Young Serif` ou `Recoleta`* + `Nunito Sans`
- Tokens: `--bg: oklch(0.95 0.025 75)` · `--fg: oklch(0.28 0.03 50)` · `--accent: oklch(0.6 0.12 45)` (terracota) · `--leaf: oklch(0.55 0.06 140)`
- Layout: fotos com recorte em arco (`border-radius: 999px 999px 0 0`), textura de papel sutil
- Movimento 4: entradas lentas (400ms), easing suave
- Ousado: forma de arco repetida como motivo

## produto-denso
- Fontes: `Geist` + `Geist Mono`
- Tokens: neutros frios tingidos, 1 acento funcional (verde/azul) só para estado
- Layout: sem cards, agrupamento por linha e espaço, tabelas `tabular-nums`, sidebar fixa
- Movimento 2: instantâneo em filtros/busca; só feedback de press
- Ousado: atalho de teclado visível (`⌘K`) e estado de produto real

*licenciada: use alternativa do Google Fonts se não houver licença.
