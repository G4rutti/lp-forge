---
name: component-sourcing
description: Como buscar e encaixar componentes prontos via MCPs (21st.dev, OriginKit, shadcn, Magic UI) e docs atualizadas (Context7) em vez de inventar do zero, adaptando ao brief. Use quando precisar de hero, pricing, navbar, galeria, depoimentos, botão animado, background, ou qualquer bloco de UI em React/Tailwind.
---

# Component sourcing

Não reinvente botão. Mas também não cole componente de vitrine sem adaptar: componente de biblioteca sem ajuste é slop de outro tipo.

## Ordem de busca
1. **shadcn MCP**: primitivas acessíveis (dialog, accordion, tabs, sheet). Base estrutural.
2. **21st.dev MCP**: blocos de marketing (hero, pricing, testimonial, navbar), botões e cards com polish. Peça 2-3 opções e compare.
3. **OriginKit MCP**: componentes animados (texto, transições, galerias, backgrounds). Use 1-2 por página, não 10.
4. **Context7 MCP**: docs atuais de Tailwind v4, Motion, GSAP, Next.js, Astro antes de escrever API que pode ter mudado.
5. **design-systems MCP**: consultar boas práticas de tokens, acessibilidade, padrões de componente quando estiver criando o sistema.

Se um MCP não responder (não autenticado), siga com o próximo e avise em uma linha qual conectar (`/mcp` no Claude Code).

## Adaptação obrigatória (todo componente importado)
- Trocar cores hardcoded por tokens do `brief.md`
- Trocar fonte para as do brief
- Remover o que for tell de slop (gradiente roxo, glow, badge ✨, ícone emoji)
- Ajustar raio/sombra ao sistema
- Ajustar animação às regras da skill `motion`
- Conferir acessibilidade (foco, aria, contraste)
- Registrar origem num comentário curto: `// base: 21st.dev/<autor>/<componente>`

## Skills de apoio (incluídas)
- `pick-ui-library`: escolher a lib certa antes de começar
- `vercel-react-best-practices`: performance e padrões React/Next
- `image-to-code`: transformar print de referência em código
- `imagegen-frontend-web`: gerar imagens de hero/fundo coerentes com o site quando o cliente não tem foto

## Stack de animação
- CSS puro primeiro; Motion (`motion/react`) pra estado/layout; GSAP só pra timeline/scroll complexo; Three.js/R3F só quando o 3D for o "movimento ousado" da página e couber no orçamento de performance.
