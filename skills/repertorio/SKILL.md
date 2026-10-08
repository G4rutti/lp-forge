---
name: repertorio
description: Biblioteca de famílias visuais (com tokens, fontes, layout e movimento prontos) e sites de referência para dar repertório ao Claude. Use ao escolher a direção estética de uma página, ao distribuir direções diferentes entre subagentes de variantes, ou quando o usuário mandar um print/URL de referência.
---

# Repertório

O problema raramente é o modelo; é falta de repertório. Esta skill dá nomes e vocabulário para estilos, porque **nomear é poder**: "galeria-editorial, variância 8" gera algo muito mais específico que "moderno e elegante".

## Como usar
1. Escolha 1 família para página única, ou 3-5 famílias DIFERENTES para o leque de variantes (ver `variant-fanout`).
2. Copie os tokens da família para o `brief.md` e ajuste a matiz pelo DNA da marca.
3. Referências do usuário (prints, URLs) entram como "sensação a combinar", nunca para copiar layout pixel a pixel.

Famílias completas: `references/familias.md`.
Onde garimpar referência: `references/fontes-de-referencia.md`.

## Resumo das famílias
| Família | Sensação | Bom pra |
|---|---|---|
| `galeria-editorial` | serif itálica grande, off-white, cards de imagem flutuando em perspectiva | estúdio, estética premium, fotógrafo, arquitetura |
| `editorial-classico` | revista, colunas, filetes, serif + grotesca | corretor premium, advocacia, consultório |
| `quieto-clinico` | muito respiro, neutros quentes, 1 acento suave | clínica, estética, saúde |
| `print-tech` | grid aparente, mono, labels técnicas, cor de sinalização | barbearia moderna, oficina, tech local |
| `dither-mono` | monocromático, textura de pontilhado, imagens tratadas | marca jovem, música, moda |
| `editorial-bruto` | tipografia gigante, contraste duro, bordas cheias | academia, barbearia, evento |
| `organico-quente` | tons terrosos, formas suaves (não blobs aleatórios), foto de textura | café, padaria, pet, terapias |
| `produto-denso` | denso, tabular, sem cards, divisões por linha | SaaS, dashboard, B2B |

Para o leque, combine famílias com **contraste real** entre si (ex.: galeria-editorial + print-tech + quieto-clinico), senão as variantes saem iguais.
