---
name: referencias-do-ramo
description: Pesquisa sites de referência do mesmo ramo do cliente (galerias de design por categoria, listas "melhores sites de X", negócios do mesmo nicho em mercados maiores e concorrentes locais), captura screenshots desktop/mobile, extrai fontes, paleta e estrutura de cada um e escreve referencias.md com o que copiar como sensação e o que evitar. Use antes do brief de qualquer LP de nicho, quando o usuário pedir referências, inspiração ou "como os melhores do ramo fazem".
---

# Referências do ramo

Repertório genérico gera página genérica. Antes do brief, olhe como os melhores do **mesmo ramo** resolvem o mesmo problema (clínica de estética, barbearia, imobiliária...) e o que os concorrentes **locais** fazem mal. Saída: `referencias/` (screenshots + `refs.json`) e `referencias.md`.

## Passo a passo

### 1. Definir o recorte
Do `dna.md`: nicho em PT e em EN (ex.: "clínica de estética" / "med spa", "skin clinic"; "barbearia" / "barbershop"), cidade, público, faixa de preço. Busca em inglês acha referência visual melhor; em português acha concorrente local.

### 2. Coletar candidatos (em paralelo)
Dispare 3 subagentes `lp-forge:ref-scout` numa única mensagem (no chat sem agentes do plugin: agente genérico com `model: "haiku"` e o corpo de `agents/ref-scout.md` no prompt), um por fonte:
- **galerias**: categoria do lapa.ninja que bate com o nicho (`references/fontes.md`) + listas "best <niche> website design <ano>"
- **mercado maior**: negócios reais do mesmo nicho em cidades grandes ou fora do Brasil, com site próprio bem feito
- **concorrência local**: os 3-5 concorrentes do cliente na cidade (Google Maps/busca), com ou sem site, pra saber o que falta na praça

Cada scout devolve até 8 URLs com uma linha de "por quê". Fontes e o que funciona em cada uma: `references/fontes.md`.

### 3. Capturar
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/ref-capture.mjs" referencias <url1> <url2> ...
```
Gera `referencias/<site>-desktop.jpg`, `-mobile.jpg`, versões `-full` e `refs.json` com fontes reais, paleta dominante, escala dos títulos, raio e CTA principal de cada site. Precisa de `playwright` (o script diz como instalar). Banners de cookie são escondidos, nunca aceitos. Site que bloquear acesso automatizado: pule, não tente contornar.

Para entender **como** um efeito foi feito num site, use a skill `explain-interface`. Para transformar prints em tokens, `visual-design-system-extractor`.

### 4. Curar (modelo principal, olhando as imagens)
Abra os screenshots. Escolha **3 a 5** referências fortes e **2** anti-referências (concorrente local ou exemplo do que não fazer). Critério: a primeira dobra comunica o serviço em 3 segundos? Tem prova real? O CTA é óbvio? Tem algo que só aquele negócio teria?

### 5. Escrever `referencias.md`
```md
# Referências: <nicho> · <cidade> · <data>

## Fortes
### <site> (<url>)
- Por que entrou: <1 linha>
- Pegar a sensação de: <ritmo do hero / tratamento das fotos / como mostra preço / prova social>
- Tokens observados: display <fonte>, texto <fonte>, cores <2-3>, raio <x>
- NÃO copiar: <layout exato, ilustração, texto, marca>

## Anti-referências
### <site ou concorrente local>
- O que está ruim: <...> (vira argumento de venda pro cliente)

## Padrões do ramo
- O que quase todos fazem (e por isso é esperado): ...
- O que ninguém da cidade faz (oportunidade): ...
```
Depois leve 2-3 referências pro campo **Referência** do `brief.md` (skill `design-brief`) e use os padrões pra distribuir famílias no leque (skill `variant-fanout`).

## Regras
- Referência é sensação (ritmo, proporção, temperatura de cor), nunca cópia de layout, texto, ilustração ou marca.
- Volume baixo e só páginas públicas. Nada de login, nada de contornar bloqueio.
- Concorrente local entra como diagnóstico, não como modelo.
