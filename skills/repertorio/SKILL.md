---
name: repertorio
description: Biblioteca de famílias visuais (com tokens, fontes, layout e movimento prontos) e sites de referência para dar repertório ao Claude. Use ao escolher a direção estética de uma página, ao distribuir direções diferentes entre subagentes de variantes, ou quando o usuário mandar um print/URL de referência.
---

# Repertório

O problema raramente é o modelo; é falta de repertório. Esta skill dá nomes e vocabulário para estilos, porque **nomear é poder**: "cor-chapada-da-marca, variância 7, display condensada" gera algo muito mais específico que "moderno e elegante".

## Como usar
1. Escolha 1 família para página única, ou 3-5 famílias DIFERENTES para o leque de variantes (ver `variant-fanout`).
2. Tokens NÃO vêm da família: cor do DNA da marca/referências, fonte do pool sem repetir o histórico.
3. Referências do usuário (prints, URLs) entram como "sensação a combinar", nunca para copiar layout pixel a pixel.

Famílias completas: `references/familias.md`.
Onde garimpar referência: `references/fontes-de-referencia.md`.

## Famílias (só estrutura e movimento; cor = DNA/referências; fonte = pool + histórico)
`foto-real-full-bleed`, `institucional-limpo`, `cor-chapada-da-marca`, `editorial-revista`, `print-tech`, `editorial-bruto`, `produto-denso`, `mapa-e-bairro`. Detalhes em `references/familias.md`. Pool de fontes: `references/fontes.md`.

Antes de distribuir direções, rode `node "${CLAUDE_PLUGIN_ROOT}/scripts/historico.mjs" fontes` e passe a lista do que NÃO repetir pra cada builder.
