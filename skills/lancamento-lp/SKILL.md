---
name: lancamento-lp
description: Checklist de lançamento de landing page/site (SEO, conversão, confiança, analytics, páginas auxiliares, negócio local) com os 20 itens obrigatórios antes de publicar. Use antes de qualquer deploy, publicação na Cloudflare/Vercel, ou quando o usuário pedir pra "deixar pronto pra lançar".
---

# Lançamento: 20 itens antes de publicar

Rode item por item. Marque ✅ / ❌ / N/A em `lancamento.md`. ❌ em item marcado (obrigatório) bloqueia o deploy.

## Conversão
1. **(obrigatório) CTA claro** em cada dobra importante: verbo + objeto + canal ("Agendar pelo WhatsApp"). Link `https://wa.me/55DDDNUMERO?text=` com mensagem pré-preenchida citando a página.
2. **(obrigatório) CTA fixo no mobile**: barra inferior com WhatsApp (e ligar, se fizer sentido), respeitando `env(safe-area-inset-bottom)`.
3. **Página de obrigado** (`/obrigado`) se houver formulário; dispara evento de conversão.
4. **Promessa de tempo de resposta** perto do CTA ("respondemos em até 1h no horário comercial"), só se for verdade.
5. **FAQ com 5 perguntas reais** (dúvidas que aparecem nos reviews/DMs), com `FAQPage` schema.
6. **Seção de cases/resultados** (antes/depois com autorização, projetos, trabalhos).

## Confiança
7. **(obrigatório) Avaliações reais** (Google): nota, nº e 2-3 trechos com primeiro nome; link para o perfil. Nada inventado.
8. **Foto real da equipe/lugar** (pelo menos 1). Banco de imagem genérico derruba confiança.
9. **Mapa e rotas**: embed do Google Maps lazy (ou imagem estática + link "Como chegar").
10. **Marcação de negócio local**: JSON-LD `LocalBusiness` (ou subtipo: `BeautySalon`, `MedicalClinic`, `RealEstateAgent`...) com nome, endereço, geo, horário, telefone, `aggregateRating` só se os dados forem reais e exibidos na página.
11. **Política de privacidade** (`/privacidade`) simples, LGPD, especialmente se tiver formulário/analytics.

## SEO técnico
12. **(obrigatório) `<title>` único** por página: serviço + cidade + nome (≤ 60 caracteres).
13. **(obrigatório) Meta description** única (≤ 155), com cidade e diferencial.
14. **Imagem OG/social** 1200×630 por página (`og:image`, `twitter:card=summary_large_image`).
15. **(obrigatório) `alt` em todas as imagens** de conteúdo, descritivo e em PT-BR.
16. **Breadcrumbs** (com `BreadcrumbList`) se o site tiver mais de 1 nível.
17. **`robots.txt` + `sitemap.xml`**; prévia de cliente deve ter `noindex` até aprovação.
18. **Links personalizados**: URLs limpas (`/depilacao-a-laser-resende`), UTMs nos links de Insta/WhatsApp.
19. **Página 404** com a identidade da marca e CTA de volta/WhatsApp.

## Medição
20. **Analytics** (GA4, ou Plausible/Umami/Cloudflare Web Analytics se o cliente preferir sem cookie) + evento no clique do WhatsApp (`whatsapp_click`).

## Extra pra prévia de lead
- `noindex,nofollow` + banner discreto "Prévia criada para <negócio>" (removido na versão final)
- Deploy: `npx wrangler pages deploy ./dist --project-name <slug>` (Cloudflare Pages) ou Vercel
- Conferir desktop (1440) e mobile (390) por screenshot antes de mandar o link
- Opcional: vídeo de 10-15s rolando a página (skill `remotion-preview`) pra mandar no WhatsApp
