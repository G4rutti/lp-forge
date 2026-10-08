# lp-forge

Plugin do Claude Code pra criar landing pages e sites **sem cara de IA**: brief em 4 inputs, DNA de marca do lead, leque de 3-5 subagentes **Haiku** gerando variantes em paralelo, e o modelo principal (Opus / Fable / Sonnet) auditando, fundindo e gerando versões melhores. Com linter de slop que roda sozinho a cada arquivo salvo.

## Instalar

```bash
# opção 1: do GitHub (depois de subir este repo)
/plugin marketplace add G4rutti/lp-forge
/plugin install lp-forge@g4rutti-plugins

# opção 2: local
/plugin marketplace add C:/caminho/para/lp-forge
/plugin install lp-forge@g4rutti-plugins
```
Depois rode `/mcp` e autentique os que pedem login (21st.dev usa OAuth no popup).

### Onde roda o quê
| | Claude Code (terminal / aba Code) | Cowork | Chat (claude.ai / desktop) |
|---|---|---|---|
| Skills e comandos | ✅ | ✅ | ✅ |
| Agentes `lp-forge:*` | ✅ | ✅ | ❌ (fallback: agente genérico em Haiku com o `.md` colado, já previsto na skill `variant-fanout`) |
| Hook do slop-lint | ✅ | ✅ | ❌ (rodar na mão) |
| MCPs locais (Playwright, shadcn) | ✅ | ✅ (sessão local) | ❌ |
| MCPs remotos (21st, OriginKit, Design Systems, Context7) | ✅ | ✅ | ✅ via aba Connectors |

Recomendado: **Claude Code**, onde o plugin funciona 100%. Pré-requisito: Node 18+.

## Comandos

| Comando | O que faz |
|---|---|
| `/lp-forge:forjar <@insta ou negócio> [n=4]` | pipeline inteiro: DNA → brief → leque Haiku → auditoria → rodada 2 refinada → lançamento |
| `/lp-forge:leque [n=3..5] [secao=hero] [dentro-de=familia]` | só o leque de variantes a partir do `brief.md` |
| `/lp-forge:auditar <arquivo/pasta> [--corrigir]` | lint + auditor independente + QA visual, notas 0-10 e top 5 correções |
| `/lp-forge:dna <@insta / Maps>` | extrai `dna.md`, `fatos.md`, `voz.md` + `assets/` do negócio |
| `/lp-forge:referencias <nicho> [cidade]` | pesquisa referências do ramo e escreve `referencias.md` |
| `/lp-forge:validar <pasta/URL> [previa\|final]` | validador independente: APROVADO/REPROVADO com evidência |
| `/lp-forge:lancar <pasta> [previa\|final]` | checklist dos 20 itens + deploy (pede confirmação) |
| `/lp-forge:video <pasta/URL>` | vídeo de 15s da LP com Remotion pra mandar no zap |

## Como o leque funciona

```
brief.md + dna.md
  ├─ variant-builder (haiku) · foto-real-full-bleed ┐
  ├─ variant-builder (haiku) · print-tech         ├─► variantes/r1/  +  galeria (index.html lado a lado)
  ├─ variant-builder (haiku) · cor-chapada-da-marca │
  └─ variant-builder (haiku) · editorial-bruto  ──┘
        ▼
  modelo principal: slop-lint + screenshots 1440/390 + rubrica 7 dimensões
        ▼
  r2/a-fiel  e  r2/b-ousada  (escritas pelo principal)  →  tweak panel  →  final/
```
Haiku explora largo e barato; o principal decide e escreve a versão boa. Página não se autoavalia: o `slop-auditor` é um agente separado que não viu a construção.

## O que tem dentro

**Skills próprias do lp-forge** (o Claude puxa sozinho quando precisa)
- `anti-slop`: P0/P1/P2 de tells de IA, regra do "movimento ousado" + "detalhe de dono", QC pre-flight, tabela de trocas
- `design-brief`: 4 inputs (estética, referência, intenção, guardrails) + dials variância/movimento/densidade
- `brand-dna`: DNA do lead via Insta + avaliações do Google + site atual
- `repertorio`: 8 famílias de estrutura e movimento (cor vem do DNA, fonte de um pool rotativo com histórico entre projetos) + onde garimpar referência
- `motion`: durações, easings, o que nunca animar, receitas CSS/Motion/GSAP
- `component-sourcing`: ordem de uso dos MCPs e adaptação obrigatória de componente importado
- `variant-fanout`: o orquestrador do leque + rubrica
- `lancamento-lp`: os 20 itens antes de lançar (404, CTA fixo mobile, obrigado, FAQ, schema LocalBusiness, OG, GA...)
- `remotion-preview`: vídeo da prévia (HyperFrames por padrão, Remotion opcional)
- `vibe`: lê a vibe do negócio (energia, formalidade, era, tátil↔digital, densidade, ousadia) com evidência do DNA e das referências, e escolhe os componentes de cada seção no 21st, OriginKit e southleft conforme essa vibe; cada variante do leque ganha um hero diferente. Efeitos-assinatura (3D, polaroid, itálico de destaque) não são proibidos: entram com fit ≥ 8 na vibe e marcados `lp-forge: vibe-ok`
- `referencias-do-ramo`: 3 scouts Haiku acham referências do nicho (galerias por categoria, mercado maior, concorrentes locais), `ref-capture.mjs` tira screenshot e extrai fontes/paleta/CTA, e o modelo principal escreve `referencias.md`. Fontes testadas em `references/fontes.md`
- `copy-sem-slop`: copy em PT-BR sem vício de IA. Só fatos do `fatos.md` (com fonte e data), voz real do dono (`voz.md`), frases e estruturas proibidas ("não é X, é Y", "mais que um X, um Y", "Sem X. Sem Y.", "E o melhor?"), antes/depois de LP local e nota de 5 dimensões

**Skills de terceiros já incluídas** (69, vêm junto no plugin, nada pra instalar à parte)
| Área | Skills | Origem |
|---|---|---|
| Gosto / anti-slop | `impeccable` (`/impeccable audit`, `critique`, `polish`, `bolder`...), `design-taste-frontend`, `high-end-visual-design`, `industrial-brutalist-ui`, `redesign-existing-projects`, `ui-ux-pro-max` | pbakaus, leonxlnx, nextlevelbuilder |
| Revisão de UI | `web-design-guidelines`, `vercel-react-best-practices` | Vercel |
| Animação | `emil-design-eng`, `animation-vocabulary`, `find-animation-opportunities`, `improve-animations`, `review-animations`, `apple-design`, `pick-ui-library` | Emil Kowalski |
| Imagem / marca | `imagegen-frontend-web`, `image-to-code`, `brandkit` | leonxlnx |
| Conversão / SEO / copy | `copywriting`, `copy-editing`, `cro`, `seo-audit`, `schema`, `marketing-psychology`, `stop-slop` (vícios de escrita de IA em inglês) | Corey Haines, Hardik Pandya |
| Vídeo (HyperFrames) | `hyperframes`, `hyperframes-core`, `hyperframes-cli`, `hyperframes-animation`, `hyperframes-keyframes`, `product-launch-video` (tour de site a partir da URL), `motion-graphics`, `general-video`, `media-use` | HeyGen |
| Navegador / QA | `agent-browser`, `webapp-testing`, `browser-testing-with-devtools` | Vercel, Anthropic, Addy Osmani |
| Auditoria web (Lighthouse) | `web-quality-audit`, `performance`, `core-web-vitals`, `accessibility`, `best-practices`, `seo`, `web-perf`, `audit-website` | Addy Osmani, Cloudflare, squirrelscan |
| SEO local | `seo-local`, `seo-page`, `seo-technical`, `seo-images`, `seo-geo` | claude-seo |
| Interface (review fino) | `better-interface`, `better-ui`, `better-typography`, `better-layout`, `better-colors`, `better-accessibility`, `better-writing`, `interface-review`, `explain-interface`, `good-css`, `frontend-ui-engineering`, `mobile-first-website-design`, `visual-design-system-extractor` | Jakub Krehel, Vojta Holík, Addy Osmani, srinitude |
| Validação / lançamento | `doubt-driven-development`, `shipping-and-launch`, `wrangler` (deploy Cloudflare) | Addy Osmani, Cloudflare |
| Pesquisa | `competitor-profiling`, `customer-research` | Corey Haines |

**Instalado automaticamente na 1ª sessão**: as 12 skills do **Remotion** (o repo delas não tem licença de redistribuição, então o hook `SessionStart` roda `npx skills add remotion-dev/skills` uma vez por máquina, em segundo plano).

Licenças e origens: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Pra puxar a versão mais nova das skills de terceiros: `node scripts/update-vendored.mjs`.

**Agentes**: `variant-builder` (haiku), `ref-scout` (haiku), `visual-qa` (haiku), `slop-auditor` (herda o modelo), `validador` (herda o modelo; portão final cético: mecânico + slop + fatos + visual + copy, APROVADO/REPROVADO)

**Scripts**: `slop-lint.mjs` (sem dependências; pega slop visual **e de copy em PT-BR** no texto visível da página e em `copy*.md`; também roda como hook após Write/Edit e bloqueia P0), `gallery.mjs`, `tweak-panel.js` (Alt+T, ajusta tokens ao vivo e copia o `:root`), `bootstrap-extras.mjs` (instala o Remotion na 1ª sessão), `update-vendored.mjs` (atualiza as skills de terceiros), `ref-capture.mjs` (screenshots + extração de design de referências), `validate-page.mjs` (20 portões mecânicos: meta, schema, WhatsApp, CTA na dobra, CTA fixo, overflow, imagens, noindex de prévia...). Os dois últimos usam Playwright, que o plugin instala sozinho na 1ª sessão. O Python das skills de SEO (`requirements.txt`) é instalado pelo próprio launcher `scripts/claude-seo` quando a skill precisa

**MCPs já configurados** (`.mcp.json`): 21st.dev, OriginKit, Design Systems (southleft), Context7, shadcn, Playwright

## MCPs pra conectar depois
| MCP | Pra quê | Como |
|---|---|---|
| Figma Dev Mode (oficial) | puxar frames, variáveis e Code Connect | ativar no app desktop do Figma (precisa seat pago) |
| Framelink / Figma Context | Figma via API em qualquer plano | `npx -y figma-developer-mcp --figma-api-key=SUA_KEY --stdio` |
| Magic UI | componentes animados React | `npx -y @magicuidesign/mcp@latest` |
| Chrome DevTools (Google) | inspecionar DOM, console, rede, performance | `npx -y chrome-devtools-mcp@latest` |
| Canva / Webflow / Framer (oficiais) | levar o design pra essas ferramentas | ver repo oficial de cada |
| Penpot | alternativa open source ao Figma | github.com/montevive/penpot-mcp |
| Storybook | componentes de um design system existente | `@storybook/addon-mcp` |
| Higgsfield | geração de imagem/vídeo dentro do Claude Code | ver site da Higgsfield |

Para adicionar: `claude mcp add --transport http <nome> <url>` ou edite o `.mcp.json` do plugin.

## Peso no contexto
São ~45 skills. Só a descrição curta de cada uma vai em toda mensagem; o conteúdo carrega quando é usado. Se sentir o limite apertando, rode `/skill-doctor` no Claude Code pra ver quais nunca são usadas.

## Créditos das ideias
Workflow em 3 etapas (repertório → armar o Claude → abrir o leque) e 4 inputs: @omatheusdaia · lista de lançamento: @fabianocarvalhojr · referências: @nocodealex · regras anti-slop inspiradas em nexu-io/open-design, uxdesign.cc e no anti-slop framework (Medium).
