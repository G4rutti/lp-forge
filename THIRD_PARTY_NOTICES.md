# Third-party skills incluídas

As skills abaixo foram copiadas sem alteração dos repositórios de origem, sob as licenças indicadas. Cada pasta contém o `LICENSE.txt` original. Snapshot de 2026-10-08.

| Skill(s) | Origem | Licença |
|---|---|---|
| frontend-design | [anthropics/skills](https://github.com/anthropics/skills) | Apache-2.0 |
| web-design-guidelines, vercel-react-best-practices | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | MIT |
| agent-browser | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | Apache-2.0 |
| design-taste-frontend, redesign-existing-projects, high-end-visual-design, minimalist-ui, industrial-brutalist-ui, imagegen-frontend-web, image-to-code, brandkit | [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) | MIT |
| emil-design-eng, review-animations, improve-animations, animation-vocabulary, find-animation-opportunities, apple-design, pick-ui-library | [emilkowalski/skills](https://github.com/emilkowalski/skills) | MIT |
| impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 |
| ui-ux-pro-max | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT |
| copywriting, copy-editing, cro, seo-audit, schema, marketing-psychology | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | MIT |
| hyperframes, hyperframes-core, hyperframes-cli, hyperframes-animation, hyperframes-keyframes, general-video, product-launch-video, motion-graphics, media-use | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | Apache-2.0 |

## Instaladas automaticamente (não redistribuídas)
| Skill(s) | Origem | Por quê |
|---|---|---|
| remotion-* (12 skills) | [remotion-dev/skills](https://github.com/remotion-dev/skills) | o repo não declara licença, então não pode ser copiado; o hook `SessionStart` roda `npx skills add remotion-dev/skills` uma vez por máquina |

## Atualizar o snapshot
`node scripts/update-vendored.mjs` re-baixa todas as skills vendorizadas das origens e mostra o diff no git.
