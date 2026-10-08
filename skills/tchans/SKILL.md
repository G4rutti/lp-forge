---
name: tchans
description: Catálogo de efeitos "tchan" (gradientes da marca, gradiente animado/mesh, reveal de texto, scroll storytelling, marquee, contador, parallax, tilt 3D, fundo animado, Lottie, SVG que se desenha, botão magnético, smooth scroll) escolhidos pela VIBE do site, com orçamento mínimo de movimento pra página não ficar estática. Use ao construir ou polir qualquer LP, quando a página parecer parada/sem graça, e quando o usuário pedir animação, gradiente ou "um tchan".
---

# Tchans pela vibe

Página parada parece template; página com efeito em tudo parece IA exibida. A vibe (`vibe.md`, skill `vibe`) define **quanto** e **qual** efeito.

## 1. Orçamento de movimento (mínimo obrigatório)
Pela nota de **Energia** da vibe:

| Energia | Hero | Scroll | Micro | Tchans |
|---|---|---|---|---|
| 1-3 (calma: advocacia, clínica sóbria) | entrada coreografada (texto + foto, 400-700ms) | 2 momentos (reveal com máscara, contador) | todos os CTAs e cards com hover/press | 1 sutil |
| 4-6 (média: escola, estética, imobiliária) | coreografia + 1 elemento vivo (gradiente lento, parallax leve) | 3-4 momentos | idem + links | 2 |
| 7-10 (vibrante: academia, barbearia, evento, infantil) | coreografia forte + fundo animado ou vídeo | 4-6 momentos, 1 seção pinada com scroll storytelling | idem + cursor/magnético se combinar | 3 |

"Momento de scroll" = algo que reage ao scroll de propósito (não fade-up genérico em todo bloco). Nunca menos que o mínimo da linha: página sem nada disso reprova no validador.

## 2. Catálogo (escolha pelo fit com a vibe)
| Tchan | Vibe que pede | Como fazer (skill/MCP) |
|---|---|---|
| **Gradiente com as cores da marca** (fundo de seção, botão, texto) | qualquer, se a marca tem 2+ cores | CSS `linear/radial-gradient` em OKLCH entre cores do DNA; `better-colors` pra contraste |
| **Gradiente animado / mesh** lento no hero | energia ≥ 4, contemporâneo | skill `motion-background`; OriginKit (busque "gradient", "mesh", "aurora"); CSS `@property` animando ângulo/posição |
| **Fundo 3D leve** (ondas, névoa, pontos) | energia ≥ 6, digital | skill `lightweight-3d-effects` (Vanta.js); OriginKit backgrounds |
| **Reveal de texto** (linha por linha, máscara) | qualquer | `gsap-plugins` (SplitText) ou CSS `clip-path`; `animation-vocabulary` pra nomear |
| **Scroll storytelling pinado** (seção fixa que troca conteúdo) | energia ≥ 5, história pra contar (anos de casa, etapas, segmentos) | `gsap-scrolltrigger` (pin + scrub) |
| **Marquee** de serviços/bairros/marcas | energia ≥ 6, descontraído | CSS keyframes + `prefers-reduced-motion` |
| **Contador** de número real (anos, alunos, avaliações) | qualquer, se o número está no `fatos.md` | `gsap-core` ou IntersectionObserver + rAF |
| **Parallax** de foto | tátil/analógico, fotos boas | CSS `animation-timeline: view()` ou ScrollTrigger |
| **Tilt 3D** em card/foto | energia ≥ 5, digital | `lightweight-3d-effects` (Vanilla-Tilt) |
| **Imagem com reveal por máscara** | editorial, premium | `clip-path` + ScrollTrigger |
| **SVG que se desenha** (traço do logo, mapa, linha do tempo) | institucional, história | `gsap-plugins` (DrawSVG) ou `stroke-dashoffset` |
| **Lottie** (ícone/ilustração animada) | infantil, amigável, explicativo | skill `motion-design` (LottieFiles) |
| **Botão magnético / cursor custom** | energia ≥ 7, criativo | `motion-framer`; 21st ("magnetic button") |
| **Smooth scroll** (Lenis) | premium, com scroll storytelling | Lenis + ScrollTrigger (`gsap-scrolltrigger`) |
| **Transição entre seções por cor** | cor-chapada-da-marca | ScrollTrigger mudando `--bg` |
| **Componentes animados prontos** | quando a vibe pede e o MCP tem algo com fit ≥ 8 | 21st `get_inspiration`, OriginKit `search`, skill `animated-component-libraries` |

Pra calibrar o "feel" (tempo, easing, física): `design-motion-principles`, `animation-principles`, `emil-design-eng`. Pra GSAP correto e rápido: `gsap-core`, `gsap-timeline`, `gsap-performance`, `gsap-react`.

## 3. Regras
- Gradiente vem das cores do DNA. O gradiente "confiança" de IA (roxo→azul, azul→ciano, índigo→rosa) continua proibido se não for a marca.
- Cada tchan escolhido vai pra `notes.md`: `tchan · seção · por que combina com a vibe (eixo e nota)`.
- Performance: só `transform`/`opacity`/`filter`/`clip-path` animando; canvas/WebGL só acima da dobra se a vibe pedir e com fallback estático; lazy pro resto.
- `prefers-reduced-motion`: tudo desliga ou vira fade curto, inclusive marquee, parallax e fundo animado.
- Repetição: o mesmo tchan principal não pode repetir o do projeto anterior (`scripts/historico.mjs`).
