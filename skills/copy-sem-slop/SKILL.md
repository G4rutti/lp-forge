---
name: copy-sem-slop
description: Escreve e revisa copy em português (landing page, site, legenda, mensagem de WhatsApp) sem os vícios de texto de IA - frases-clichê, "não é X, é Y", tricolon, advérbios, jargão, afirmação vaga - usando só fatos verificados do negócio e a voz real do dono. Use SEMPRE que for escrever ou revisar qualquer texto em PT-BR de página, e quando o usuário disser que o texto "tá com cara de IA".
---

# Copy sem slop (PT-BR)

O slop de texto nasce de dois lugares: **falta de contexto** (a IA não sabe nada específico do negócio, então enche com frase genérica) e **vício de estrutura** (os moldes que todo modelo repete). Banir palavras sozinho não resolve: quando você corta um clichê, aparece o próximo. Ataque as duas causas.

## 1. Contexto antes de texto
Nenhuma frase de copy é escrita antes de existir:
- **`fatos.md`** (gerado pela skill `brand-dna`): cada fato com valor, fonte e data. Ex.: `- Atende até 22h, inclusive domingo · fonte: Google Maps · 2026-10-08`.
- **`voz.md`**: perfil de 3-5 parágrafos da voz do dono, montado a partir de 5-10 textos reais dele (legendas do Insta, respostas a avaliações, mensagens). Como ele abre, que palavras usa, se usa "você" ou "vocês", gírias, emojis, tamanho das frases.

Regra: **a copy só afirma o que está em `fatos.md`.** O que não estiver lá vira `[DADO REAL: ...]` ou sai da página. Nada de "anos de experiência", "centenas de clientes", "atendimento de excelência" sem fonte.

Se `fatos.md` e `voz.md` não existirem, crie antes (skill `brand-dna`). Se o fato mudar (preço, horário), atualize `fatos.md` com a data nova; ele é a fonte versionada da verdade da página.

## 2. Matéria-prima da copy de LP local
Em ordem de força:
1. **Frases que se repetem nas avaliações do Google**: elas viram headline e prova. "Saí sem dor na primeira sessão" vence qualquer frase que a IA invente.
2. **Detalhe operacional que ninguém mais tem**: horário, bairro, estacionamento, "a dona atende pessoalmente", tempo de resposta.
3. **Nomes próprios**: bairro, rua, cidade, nome da profissional, nome do procedimento como o cliente fala.
4. **Números reais**: nota, nº de avaliações, preço "a partir de", duração da sessão.

Pelo menos 3 nomes próprios e 2 números reais por página. Zero promessa sem prova.

## 3. O que cortar
- Frases proibidas e palavras restritas: `references/frases-pt.md`
- Estruturas de IA em português (não é X é Y, tricolon, pergunta retórica + resposta, "E o melhor?", falsa agência, fechamento-frase-de-efeito): `references/estruturas-pt.md`
- Antes/depois em LP de negócio local: `references/exemplos-lp.md`
- Base em inglês da mesma ideia: skill `stop-slop`.

## 4. Regras de escrita
1. **Sujeito humano fazendo algo.** "A Ana atende de terça a sábado", não "o atendimento é realizado".
2. **Específico vence bonito.** Troque adjetivo por fato: "aberto até 22h" em vez de "horários flexíveis".
3. **Uma ideia por frase.** Varie o tamanho: algumas frases com menos de 8 palavras, nenhuma acima de ~25.
4. **Fala, não release.** Escreva como o dono explicaria no balcão. Contrações e "você" são bem-vindos.
5. **Sem travessão (—)** e sem dois-pontos dramático ("O segredo: ...").
6. **Dois itens em vez de três** quando der. Lista de três em uma frase é o tique mais reconhecível.
7. **Sem advérbio de ênfase** (realmente, verdadeiramente, extremamente, incrivelmente, totalmente).
8. **Sem anunciar estrutura** ("Confira abaixo", "Veja a seguir", "Conheça nossos serviços"). O título da seção já anuncia.
9. **Botão diz a ação e o canal**: "Chamar no WhatsApp", "Ver horários livres". Nunca "Saiba mais".
10. **Fechamento sem moral da história.** A última frase da seção é informação ou CTA, não frase de efeito.

## 5. Processo
1. Leia `fatos.md` e `voz.md`.
2. Escreva `copy.md` (todas as seções, em texto puro) **antes** do HTML. Layout se adapta ao texto, não o contrário.
3. Passe de slop: rode `node "${CLAUDE_PLUGIN_ROOT}/scripts/slop-lint.mjs" copy.md` (as regras de copy também leem `.md`) e releia procurando as estruturas de `estruturas-pt.md`.
4. Pontue (1-10): **Direto** (afirma ou anuncia?), **Ritmo** (varia ou é metrônomo?), **Específico** (dá pra saber de qual negócio é?), **Voz** (parece o dono falando?), **Densidade** (tem algo cortável?). Abaixo de 38/50, reescreva.
5. Só então leve pro HTML.

## Teste final
Cubra o nome do negócio. Se o texto servir pra qualquer outra clínica, barbearia ou loja da cidade, ele é slop. Reescreva até que só sirva pra este.
