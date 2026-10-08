---
name: remotion-preview
description: Gera um vídeo curto (10-20s, vertical 1080x1920 ou 1080x1350) mostrando a landing page em scroll/montagem com Remotion, pra mandar a prévia no WhatsApp/Instagram de um lead ou postar como portfólio. Use quando o usuário pedir vídeo da página, vídeo de apresentação, reel ou "mandar a prévia em vídeo".
---

# Prévia em vídeo (Remotion)

Print estático é ignorado; um vídeo de 12s do site do próprio negócio rolando no celular chama atenção.

## Setup (uma vez por máquina/projeto)
```bash
npx create-video@latest --yes --blank lp-video
cd lp-video
npx remotion skills add   # instala as skills oficiais do Remotion pro Claude Code
npm run dev               # Remotion Studio
```
Consulte as skills do Remotion e a doc (https://www.remotion.dev/docs) via Context7 antes de escrever APIs.

## Captura dos insumos
Use o Playwright MCP para tirar screenshots full-page da LP em 390px (mobile) e 1440px (desktop) → `public/shots/mobile.png`, `public/shots/desktop.png`.

## Composição sugerida (15s @ 30fps = 450 frames)
1. 0-2s: nome do negócio em tipografia da marca sobre o `--bg`, entra com `spring`
2. 2-11s: moldura de celular com `mobile.png` rolando (interpolate do `translateY`, easing `Easing.bezier(.16,1,.3,1)`), pausas curtas no hero, prova social e CTA
3. 11-13s: corte para desktop em perspectiva leve
4. 13-15s: "Prévia feita pra <negócio>" + CTA "Responde aqui se curtir"

Regras: cores e fontes do `brief.md`; sem música com direito autoral (use silêncio ou trilha livre); legenda curta legível sem som.

## Render
```bash
npx remotion render Preview out/previa-<slug>.mp4 --codec h264
```
Vertical 1080x1920 pro WhatsApp/Status; 1080x1350 pro feed.
