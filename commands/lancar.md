---
description: Checklist de lançamento (20 itens - SEO, conversão, confiança, analytics) e deploy da página
argument-hint: <pasta do site> [previa|final] [cloudflare|vercel]
---

Prepare para lançamento: $ARGUMENTS

1. Rode a skill `lancamento-lp` item por item e salve `lancamento.md` com ✅/❌/N/A.
2. Corrija os ❌ obrigatórios. Para os não obrigatórios, corrija o que for rápido e liste o resto.
3. Rode `/lp-forge:validar` (validador independente). Só siga se vier APROVADO.
4. Se for `previa`: garanta `noindex`, banner de prévia, e só então proponha o comando de deploy. **Peça confirmação antes de publicar** (deploy é público).
5. Depois do deploy, rode `scripts/validate-page.mjs <URL publicada>` (com `--preview` se for prévia) e mostre o resultado. Para Cloudflare Pages, a skill `wrangler` tem os comandos.
