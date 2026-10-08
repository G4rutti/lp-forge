---
name: vibe
description: Define a "vibe" do site (estilo, energia, formalidade, público, era estética, o que faz sentido pro negócio) a partir do DNA da marca e das referências do ramo, e escolhe dinamicamente os componentes de cada seção (hero, galeria, prova social, CTA) nos MCPs 21st.dev, OriginKit e southleft conforme essa vibe. Use depois do DNA/referências e antes do brief e do leque, e sempre que for escolher hero ou componente visual.
---

# Vibe → componentes

Nenhum componente é proibido por si só. Proibido é usar sempre o mesmo, ou usar um que não combina com o negócio. A vibe decide; os MCPs dão as opções; o histórico impede repetição.

## 1. Ler a vibe (de evidência, não de achismo)
Fontes: `dna.md` (fotos do Insta, logo, fachada, uniforme), `voz.md`, `referencias.md` + screenshots. Escreva `vibe.md`:
```md
# Vibe: <negócio>
| Eixo | Posição (1-10) | Evidência |
|---|---|---|
| Energia (calma → vibrante) | 7 | fotos do Insta com crianças, cores saturadas no logo |
| Formalidade (descontraído → institucional) | 5 | pais decidem; legendas em tom próximo |
| Era estética (clássico → contemporâneo) | 6 | fachada reformada, uniforme novo |
| Tátil/analógico ↔ digital/técnico | 3 | fotos de atividades manuais, história de 40 anos |
| Densidade de informação | 6 | segmentos, horários, bilíngue |
| Ousadia visual aceitável | 5 | público conservador (pais), concorrência fraca |
- Palavras da vibe (3-5): ex. "acolhedora, viva, de bairro, confiável"
- Combina: <tipos de componente que conversam com essa vibe>
- Não combina: <tipos que destoam, e por quê>
```

## 2. Buscar componentes por seção, conforme a vibe
Pra cada seção-chave (hero, galeria/fotos, prova social, segmentos/serviços, CTA final):
- **21st** `get_inspiration` com "<seção> + palavras da vibe + nicho" (metadado é livre; `get_component` gasta cota diária, só no escolhido).
- **OriginKit** `search` / `list_components` por categoria (hero, cards, animation) e `get_component` com `stack`/`styling` do projeto.
- **southleft** (`design-systems`) `search_design_knowledge` pro padrão certo (ex.: "testimonial pattern accessibility", "hero hierarchy").
- **shadcn** pras primitivas acessíveis.

Pegue **2-3 candidatos por seção** e registre em `componentes.md`:
`| Seção | Candidato (MCP + id/slug) | Fit com a vibe (1-10) | Por quê | Adaptação necessária |`

No leque, **cada variante recebe um hero diferente** dessa lista (o fanout distribui). Se nenhum MCP responder (sem login), diga qual conectar e monte a seção do zero seguindo a vibe.

## 3. Regras de fit
- O componente serve a vibe e o conteúdo real (fotos que o cliente TEM). Galeria 3D sem 10 fotos boas não faz sentido; hero de vídeo sem vídeo, idem.
- Efeito "assinatura" (fotos inclinadas, 3D, itálico de destaque, cursor custom, marquee) entra no máximo 1 por página, só com fit ≥ 8 e se não estiver no histórico recente (`scripts/historico.mjs fontes`). Marque no código: `<!-- lp-forge: vibe-ok <regra> · <motivo da vibe> -->` (o lint aceita e o validador confere o motivo contra `vibe.md`).
- Todo componente importado passa pela adaptação da skill `component-sourcing` (tokens, fontes, motion, a11y).
