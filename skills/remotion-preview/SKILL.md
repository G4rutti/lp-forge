---
name: remotion-preview
description: Gera um vídeo curto (10-20s, vertical 1080x1920 ou 1080x1350) mostrando a landing page (tour do site, scroll, montagem) pra mandar a prévia no WhatsApp/Instagram de um lead ou postar como portfólio. Usa HyperFrames (incluído no plugin) por padrão e Remotion como alternativa. Use quando o usuário pedir vídeo da página, vídeo de apresentação, reel ou "mandar a prévia em vídeo".
---

# Prévia em vídeo

Print estático é ignorado; um vídeo de 12s do site do próprio negócio rolando no celular chama atenção.

## Caminho padrão: HyperFrames (já incluído no plugin)
Vídeo em HTML + GSAP, renderizado pela CLI `npx hyperframes`. Skills do plugin envolvidas:
- `hyperframes` → ponto de entrada obrigatório; ele roteia o fluxo
- `product-launch-video` → **tour/vitrine de um site a partir da URL** (é o fluxo certo pra prévia de LP)
- `hyperframes-core`, `hyperframes-cli`, `hyperframes-animation`, `hyperframes-keyframes`, `motion-graphics`, `general-video`, `media-use`

Peça assim: "faz um vídeo vertical de 15s mostrando <URL da prévia>, tour no celular, termina com 'Prévia feita pra <negócio>'". A skill captura o site, usa as cores/fontes dele e renderiza.

## Alternativa: Remotion
As skills oficiais do Remotion são instaladas automaticamente pelo plugin na primeira sessão (o repo delas não tem licença de redistribuição, então não vêm dentro do plugin). Use se o usuário pedir Remotion explicitamente ou já tiver projeto Remotion.
```bash
npx create-video@latest --yes --blank lp-video && cd lp-video && npm run dev
```
Entrada: `remotion-best-practices`.

## Roteiro sugerido (15s)
1. 0-2s: nome do negócio na tipografia da marca sobre o `--bg`
2. 2-11s: moldura de celular com screenshot full-page (390px) rolando, pausas curtas no hero, prova social e CTA
3. 11-13s: corte pro desktop em perspectiva leve
4. 13-15s: "Prévia feita pra <negócio>" + "Responde aqui se curtir"

Regras: cores e fontes do `brief.md`; sem música com direito autoral (use silêncio ou trilha livre via `media-use`); legenda curta legível sem som. Vertical 1080x1920 pro WhatsApp/Status; 1080x1350 pro feed.
