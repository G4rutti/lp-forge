# Third-party skills incluídas

As skills abaixo foram copiadas sem alteração dos repositórios de origem, sob as licenças indicadas. Cada pasta contém o `LICENSE.txt` original. Snapshot de 2026-10-08.

| Skill(s) | Origem | Licença |
|---|---|---|
| web-design-guidelines, vercel-react-best-practices | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | MIT |
| agent-browser | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | Apache-2.0 |
| design-taste-frontend, redesign-existing-projects, high-end-visual-design, industrial-brutalist-ui, imagegen-frontend-web, image-to-code, brandkit | [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) | MIT |
| emil-design-eng, review-animations, improve-animations, animation-vocabulary, find-animation-opportunities, apple-design, pick-ui-library | [emilkowalski/skills](https://github.com/emilkowalski/skills) | MIT |
| impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 |
| ui-ux-pro-max | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT |
| copywriting, copy-editing, cro, seo-audit, schema, marketing-psychology | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | MIT |
| stop-slop | [hardikpandya/stop-slop](https://github.com/hardikpandya/stop-slop) | MIT |
| accessibility, web-quality-audit, core-web-vitals, performance, best-practices, seo | [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) | MIT |
| seo-local, seo-page, seo-technical, seo-images, seo-geo + `scripts/*.py`, `scripts/claude-seo`, `requirements.txt` | [agricidaniel/claude-seo](https://github.com/agricidaniel/claude-seo) | MIT |
| better-interface, better-ui, better-typography, better-layout, better-colors, better-accessibility, better-writing, interface-review, explain-interface | [jakubkrehel/skills](https://github.com/jakubkrehel/skills) | MIT |
| good-css | [vojtaholik/good-css](https://github.com/vojtaholik/good-css) | MIT |
| audit-website | [squirrelscan/skills](https://github.com/squirrelscan/skills) | MIT |
| visual-design-system-extractor, mobile-first-website-design | [srinitude/skills](https://github.com/srinitude/skills) | MIT |
| doubt-driven-development, frontend-ui-engineering, browser-testing-with-devtools, shipping-and-launch (referências compartilhadas copiadas pra dentro de cada skill e caminhos ajustados) | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | MIT |
| web-perf, wrangler | [cloudflare/skills](https://github.com/cloudflare/skills) | Apache-2.0 |
| webapp-testing | [anthropics/skills](https://github.com/anthropics/skills) | Apache-2.0 |
| competitor-profiling, customer-research | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | MIT |
| hyperframes, hyperframes-core, hyperframes-cli, hyperframes-animation, hyperframes-keyframes, general-video, product-launch-video, motion-graphics, media-use | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | Apache-2.0 |

## Instaladas automaticamente (não redistribuídas)
| Skill(s) | Origem | Por quê |
|---|---|---|
| remotion-* (12 skills) | [remotion-dev/skills](https://github.com/remotion-dev/skills) | o repo não declara licença, então não pode ser copiado; o hook `SessionStart` roda `npx skills add remotion-dev/skills` uma vez por máquina |

Pago, não incluído: `ui-taste` da [Uizze](https://uizze.com) (busca em 800 mil telas reais).

## Atualizar o snapshot
`node scripts/update-vendored.mjs` re-baixa todas as skills vendorizadas das origens e mostra o diff no git.
