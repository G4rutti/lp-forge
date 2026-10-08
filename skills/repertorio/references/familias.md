# Famílias visuais: só ESTRUTURA e MOVIMENTO

Família não traz cor nem fonte. Cor e fonte vêm de:
1. **Cor**: DNA da marca (logo, fachada, uniforme, fotos do Insta) → `dna.md`. Se a marca não tem cor, das referências do ramo (`referencias/refs.json`). Nunca de um "neutro elegante" padrão.
2. **Fonte**: `fontes.md` (pool por categoria), respeitando o histórico (`node scripts/historico.mjs fontes`): não repetir display usada nos últimos 5 projetos nem entre variantes da mesma rodada.

**Não é ponto de partida** (é o que toda IA faz; só entra se a skill `vibe` justificar e não repetir o histórico): fundo bege/creme/off-white quente, serif de alto contraste com uma palavra em itálico colorida no H1, colagem de fotos inclinadas tipo polaroid com legenda manuscrita, fundo escuro com glow. Só entra se a marca do cliente for literalmente isso (e aí `dna.md` prova).

---
## foto-real-full-bleed
Foto de verdade do lugar/equipe ocupando a primeira dobra inteira, texto curto por cima com tratamento de legibilidade (gradiente local, não blur). Ref típica: peachystudio.com.
- Layout: hero 85-100svh com foto; 1 linha de promessa + CTA; seções alternando foto grande / texto curto
- Movimento 3-4: foto com leve scale na entrada; nada mais
- Bom pra: negócio com espaço físico bonito ou equipe fotogênica

## institucional-limpo
Branco ou cor clara da própria marca, grid de 12 colunas visível no alinhamento, tipografia sans grande, muita informação organizada (horários, unidades, segmentos).
- Layout: header com contatos, hero dividido texto/foto, abas/segmentos, mapa
- Movimento 2: só hover e foco
- Bom pra: escola, clínica com várias especialidades, imobiliária

## cor-chapada-da-marca
A cor principal da marca vira o fundo de seções inteiras (não detalhe). Blocos de cor alternando, tipografia em uma cor só por bloco.
- Layout: seções full-width de cor, cards sem sombra, borda 0
- Movimento 4: transição de cor entre seções no scroll
- Bom pra: marca com cor forte (escola infantil, academia, pet, food)

## editorial-revista
Colunas, filetes 1px, números de seção, fotos com legenda real (factual, não manuscrita), capitular.
- Layout: grid assimétrico, texto em colunas estreitas, índice lateral
- Movimento 3: sublinhado que desenha, fade curto
- Bom pra: advocacia, consultoria, arquitetura, corretor premium

## print-tech
Grid aparente, labels em mono tipo ficha técnica, tabelas, cor de sinalização em UM elemento.
- Layout: bordas 1px, raio 0, preços/horários como etiqueta técnica
- Movimento 5: contadores, hover que inverte cor
- Bom pra: barbearia moderna, oficina, estúdio de tatuagem, tech local

## editorial-bruto
Tipografia gigante ocupando a largura, contraste duro, marquee de serviços, bordas grossas.
- Movimento 6: marquee lento, botão que afunda com sombra dura
- Bom pra: academia, crossfit, barbearia, evento

## produto-denso
Sem cards, divisão por linha e espaço, `tabular-nums`, informação acima de ornamento.
- Movimento 2: instantâneo
- Bom pra: SaaS, catálogo grande, cardápio extenso

## mapa-e-bairro
O lugar é o protagonista: mapa ilustrado ou foto aérea/fachada, "como chegar", pontos de referência do bairro, horários grandes.
- Movimento 3
- Bom pra: negócio de bairro onde a localização é o argumento (padaria, escola, clínica de rua movimentada)

---
## Regras de leque
- Cada variante da rodada usa família **diferente** E display de **categoria diferente** (serif / grotesk / mono / display condensada / humanista).
- Pelo menos 1 variante usa a cor da marca como fundo de seção (não só acento).
- Pelo menos 1 variante é "a referência mais forte do `referencias.md`, traduzida pro cliente".
