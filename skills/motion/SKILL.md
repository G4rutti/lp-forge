---
name: motion
description: Regras de animação e micro-interação para front-end (durações, easing, o que animar, o que nunca animar, reduced motion, receitas em CSS, Motion/Framer e GSAP; nada de fotos inclinadas/polaroid). Use ao adicionar qualquer animação, transição, hover, scroll effect ou ao polir o "feel" de uma página.
---

# Motion

Animação boa é a que ninguém percebe como "animação", só sente que a interface responde. A ruim é a que toda IA põe: fade-up em todo bloco, bounce e `transition: all`.

## Princípios
1. **Frequência decide.** Quanto mais vezes a ação acontece, menos animação. Busca, filtro, abrir menu, digitar: instantâneo. Entrada da página, troca de etapa, sucesso de formulário: pode ter presença.
2. **Só `transform` e `opacity`** (GPU). `filter`/`clip-path` com moderação. Nunca `width/height/top/left/margin/padding`.
3. **Durações**: feedback de press 80-120ms · hover e UI 150-220ms · entrada de elemento 250-400ms · troca de layout/página 350-500ms. Acima de 500ms só se for cinematográfico e único.
4. **Easing**: nada de `ease-in` em entrada (parece lento). Use:
   - UI responsiva: `cubic-bezier(.2, .8, .2, 1)`
   - Layout/entrada maior: `cubic-bezier(.16, 1, .3, 1)` (expo-out)
   - Saída: `cubic-bezier(.4, 0, 1, 1)`, mais curta que a entrada
   - Molas (Motion): `{ type: "spring", stiffness: 380, damping: 32 }` pra UI; `stiffness: 120, damping: 20` pra coisas grandes
5. **Origem faz sentido**: popover cresce a partir do gatilho (`transform-origin`), não do centro.
6. **Press feedback**: `:active { transform: translateY(1px) scale(.98) }` em 90ms. É a micro-interação com melhor custo-benefício.
7. **Stagger** curto (30-60ms) e só em grupos de até ~8 itens.
8. **Movimento proporcional à vibe, nunca zero.** Siga o orçamento da skill `tchans` (hero coreografado + momentos de scroll + micro-interação em todo CTA + 1 a 3 tchans conforme a Energia da `vibe.md`). O que evitar é fade-up genérico igual em todo bloco, não animação.
9. **Reduced motion sempre**:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
```

## Receitas

### Hover de card que sobe (CSS)
```css
.card { transition: transform .2s cubic-bezier(.2,.8,.2,1), box-shadow .2s cubic-bezier(.2,.8,.2,1); }
.card:hover { transform: translateY(-3px); }
```

### Scroll-driven sem JS (navegadores modernos)
```css
@supports (animation-timeline: view()) {
  .reveal { animation: reveal linear both; animation-timeline: view(); animation-range: entry 10% cover 30%; }
  @keyframes reveal { from { opacity: 0; transform: translateY(24px); } }
}
```

### Motion (React)
```tsx
<motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-10% 0px" }}
  transition={{ duration: .4, ease: [.16, 1, .3, 1] }} />
```

### GSAP: só quando precisa de timeline/scroll complexo
ScrollTrigger com `scrub` pra hero pinado; sempre `gsap.matchMedia()` pra desligar em mobile/reduced motion.

## Fontes de animação prontas
- Skills incluídas: `gsap-core`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-plugins` (SplitText, DrawSVG...), `gsap-react`, `gsap-performance` (oficiais da GreenSock), `motion-framer`, `design-motion-principles`, `animation-principles`, `motion-background` (gradiente/mesh animado), `lightweight-3d-effects` (Vanta, tilt), `motion-design` (Lottie), `animated-component-libraries`. Catálogo por vibe: skill `tchans`.
- 21st.dev e OriginKit (MCPs do plugin) para componentes animados
- transitions.dev para micro-transições copia-e-cola
- Skills do Emil Kowalski já incluídas no plugin: `emil-design-eng` (filosofia e regras), `animation-vocabulary` (nome certo pra cada efeito), `find-animation-opportunities` (onde animar), `improve-animations` (melhorar o que existe), `review-animations` (auditar), `apple-design` (sensação Apple)

## Saída ao polir
Ao revisar motion, entregue tabela **Antes / Depois / Por quê** e depois o código.
