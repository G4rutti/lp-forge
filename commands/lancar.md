---
description: Checklist de lançamento (20 itens - SEO, conversão, confiança, analytics) e deploy da página
argument-hint: <pasta do site> [previa|final] [cloudflare|vercel]
---

Prepare para lançamento: $ARGUMENTS

1. Rode a skill `lancamento-lp` item por item e salve `lancamento.md` com ✅/❌/N/A.
2. Corrija os ❌ obrigatórios. Para os não obrigatórios, corrija o que for rápido e liste o resto.
3. Rode o QC da skill `anti-slop` e um `lp-forge:visual-qa`.
4. Se for `previa`: garanta `noindex`, banner de prévia, e só então proponha o comando de deploy. **Peça confirmação antes de publicar** (deploy é público).
5. Depois do deploy, confira o link publicado em desktop e mobile.
