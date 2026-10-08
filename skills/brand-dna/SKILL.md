---
name: brand-dna
description: Extrai o "DNA" de marca de um negócio a partir do Instagram, Google Maps/avaliações e site atual (cores, tom, serviços, público, provas reais, detalhe de dono) e salva em dna.md. Use antes de montar prévia de LP pra um lead, ou quando o usuário mandar @ do Insta / link do Maps de um cliente.
---

# DNA da marca

Objetivo: tudo que a página precisa pra parecer **daquele** negócio, não de um template. Saída: `dna.md` + pasta `assets/` com as imagens coletadas.

## Fontes (nesta ordem)
1. **Instagram** do negócio (abrir no navegador que a sessão tiver; se logado, ler bio, destaques, 12-24 últimos posts). Pegue: nome exato, bio, serviços que aparecem nos posts, paleta dominante dos posts, tipo de foto (estúdio, antes/depois, ambiente, equipe), tom das legendas.
2. **Google Maps / avaliações**: nota, nº de avaliações, 3-5 frases que se repetem nos reviews (são ouro pra headline e pra prova social), horário, endereço, bairro.
3. **Site atual** (se tiver): o que está ruim/faltando. Isso vira argumento de venda.

Respeite limites: volume baixo, só dados públicos do próprio negócio, nada de dados pessoais de clientes dele (use primeiro nome + inicial em depoimentos, ou só o texto).

## Template `dna.md`
```md
# DNA: <nome>
- Handle / Maps / site:
- Nicho, cidade, bairro:
- Nota Google: x.x (N avaliações) — capturado em <data>
- Horário / diferencial operacional:

## Voz
- Tom (3 adjetivos):
- Palavras que ELES usam:
- Palavras proibidas (não combinam com a marca):

## Visual observado
- Cores dominantes (hex aproximado → converter pra OKLCH no brief):
- Tipo de foto disponível:
- Logo existe? formato?

## Serviços (como o cliente fala, não como a IA fala)
1.
2.

## Prova real
- Frases que se repetem nos reviews:
- Números verificáveis:

## Detalhe de dono (candidatos)
-

## O que falta hoje (argumento de venda)
-
```

## Depois
Passe o `dna.md` para a skill `design-brief`. Família visual sugerida a partir do DNA: clínica de estética → `quieto-clinico` ou `galeria-editorial`; barbearia → `print-tech` ou `editorial-bruto`; corretor premium → `editorial-classico`.
