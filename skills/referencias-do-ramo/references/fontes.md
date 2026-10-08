# Fontes de referência (testadas em 2026-10-08)

| Fonte | Como acessar | Status do teste |
|---|---|---|
| **lapa.ninja** por categoria | WebFetch em `https://www.lapa.ninja/category/<slug>/` → lista sites com link original | ✅ WebFetch funciona. ❌ navegador headless toma desafio do Cloudflare: não use Playwright aqui |
| Listas "best <niche> website design <ano>" | WebSearch, depois WebFetch no artigo pra pegar os sites citados | ✅ funciona (ex.: "best med spa website design examples 2026") |
| Negócios reais do nicho | WebSearch "<niche> <cidade grande>" / Google Maps; abrir o site com `ref-capture.mjs` | ✅ captura testada em 3 sites de skincare |
| Concorrentes locais | WebSearch "<nicho> <cidade>" + Google Maps; anotar se tem site | ✅ |
| siteinspire.com | WebFetch em `/websites` lista os recentes; o parâmetro de busca é ignorado | ⚠️ só navegação geral |
| land-book.com, onepagelove.com, awwwards.com | robots.txt bloqueia leitura automática | ❌ automático. Só o usuário navegando |
| godly.website, dribbble, pinterest, mobbin | sem busca por nicho acessível | ❌ automático. Indicar pro usuário |
| Uizze (uizze.sh, skill `ui-taste`) | 800 mil telas reais pesquisáveis por agente | 💰 serviço pago, não incluído |

## Categorias do lapa.ninja por nicho de negócio local
| Nicho | Slugs |
|---|---|
| estética, salão, skincare, depilação | `beauty`, `wellness`, `health-fitness` |
| clínica, consultório, saúde | `health-fitness`, `wellness`, `biotechnology` |
| barbearia, moda | `fashion`, `lifestyle`, `beauty` |
| academia, estúdio de pilates | `health-fitness`, `sports`, `wellness` |
| restaurante, café, padaria | `food-drinks` |
| imobiliária, corretor, arquitetura | `real-estate`, `architecture`, `furniture-interiors`, `home-living` |
| advocacia, contabilidade, consultoria | `business`, `corporate`, `finance`, `insurance` |
| fotógrafo, estúdio criativo | `photography`, `portfolio`, `studio`, `creative` |
| escola, curso | `education`, `course` |
| oficina, auto | `automotive` |
| evento, casamento | `event`, `lifestyle` |
| pet | `lifestyle`, `ecommerce` |
| genérico / estilo | `minimal`, `typography`, `bento-grid`, `3d-websites`, `retro-style`, `magazine` |

Lista completa: 84 categorias em `https://www.lapa.ninja/category/<slug>/`.

## Termos de busca que funcionam (EN acha visual melhor)
- estética: med spa, skin clinic, aesthetics clinic, laser hair removal studio, beauty salon
- barbearia: barbershop, men's grooming
- imobiliária: real estate agent, luxury real estate, property developer
- clínica: dental clinic, physiotherapy clinic, dermatology
- restaurante: restaurant, bistro, bakery, coffee shop
Combine com "website design", "best websites <ano>", "site inspiration".
