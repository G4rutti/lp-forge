#!/usr/bin/env node
// validate-page: portões mecânicos de uma landing page, em 1440 e 390px, sem julgamento estético.
// Uso: node validate-page.mjs <arquivo.html|pasta|URL> [--out pasta] [--preview] [--json]
//   --preview: exige noindex (prévia de lead); sem a flag, exige que NÃO tenha noindex (site final).
// Saída: tabela PASS/FAIL por portão + screenshots; exit 1 se algum portão "bloqueia" falhar.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { createRequire } from "node:module";
import os from "node:os";
import { pathToFileURL as _p2u } from "node:url";

// procura o playwright no projeto atual, depois em ~/.claude/lp-forge (instalado pelo bootstrap), depois junto do plugin
async function loadPlaywright() {
  const bases = [path.join(process.cwd(), "x.js"), path.join(os.homedir(), ".claude", "lp-forge", "x.js")];
  for (const b of bases) { try { return await import(_p2u(createRequire(b).resolve("playwright")).href); } catch {} }
  try { return await import("playwright"); } catch {}
  return null;
}
const _pw = await loadPlaywright();
if (!_pw) { console.error("playwright não encontrado. Ou espere o lp-forge terminar de instalar (1ª sessão), ou rode no projeto: npm i -D playwright && npx playwright install chromium"); process.exit(3); }
const { chromium } = _pw;

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const outIdx = args.indexOf("--out");
const out = outIdx > -1 ? args[outIdx + 1] : "qa";
const target = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--out");
if (!target) { console.error("uso: validate-page.mjs <arquivo.html|pasta|URL> [--out qa] [--preview] [--json]"); process.exit(64); }

let url = target;
if (!/^https?:\/\//.test(target)) {
  let f = path.resolve(target);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { console.error(`não achei ${f}`); process.exit(1); }
  url = pathToFileURL(f).href;
}
fs.mkdirSync(out, { recursive: true });
const name = /^https?:/.test(target) ? new URL(target).hostname.replace(/\W+/g, "-") : path.basename(path.resolve(target)).replace(/\.html?$/, "");

const isRoot = typeof process.getuid === "function" && process.getuid() === 0;
const browser = await chromium.launch({ chromiumSandbox: !isRoot });
const gates = [];
const gate = (id, ok, detail, blocks = true) => gates.push({ id, ok: !!ok, detail, blocks });

async function run(vp, label) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: label === "mobile", hasTouch: label === "mobile" });
  const page = await ctx.newPage();
  const errors = [];
  const failed = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 120)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 120)); });
  page.on("requestfailed", (r) => { const u = r.url(); if (!/google-analytics|googletagmanager|plausible|fonts\.gstatic/.test(u)) failed.push(u.slice(0, 100)); });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => page.goto(url, { waitUntil: "load", timeout: 60000 }));
  await page.waitForTimeout(1200);
  const d = await page.evaluate(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
    const header = document.querySelector("header");
    const links = [...document.querySelectorAll("a[href]")];
    const wa = links.filter((a) => /wa\.me|api\.whatsapp\.com|whatsapp:\/\//.test(a.href));
    const ctas = [...document.querySelectorAll("a[href], button")].filter(vis);
    const aboveFold = ctas.find((e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.width >= 80 && (/wa\.me|whatsapp|tel:|#contato|agend/i.test(e.getAttribute("href") || "") || e.tagName === "BUTTON"); });
    const fixed = ctas.some((e) => { let n = e; while (n && n !== document.body) { const p = getComputedStyle(n).position; if (p === "fixed" || p === "sticky") return e.getBoundingClientRect().bottom > innerHeight * 0.75; n = n.parentElement; } return false; });
    const imgs = [...document.images];
    const meta = (n) => document.querySelector(`meta[name="${n}"],meta[property="${n}"]`)?.getAttribute("content") || "";
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { const j = JSON.parse(s.textContent); return [].concat(j["@graph"] || j).map((x) => x["@type"]).flat(); } catch { return ["INVALID"]; } }).flat();
    const small = [...document.querySelectorAll("a, button, input, select")].filter(vis).filter((e) => { const r = e.getBoundingClientRect(); return (r.width < 40 || r.height < 40) && e.textContent.trim().length > 0; }).length;
    const text = document.body.innerText;
    return {
      lang: document.documentElement.lang,
      title: document.title, desc: meta("description"), og: meta("og:image"), robots: meta("robots"),
      h1: document.querySelectorAll("h1").length,
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      headerH: header ? Math.round(header.getBoundingClientRect().height) : null,
      waLinks: wa.length, waBad: wa.filter((a) => !/wa\.me\/55\d{10,11}|phone=55\d{10,11}/.test(a.href)).map((a) => a.href.slice(0, 60)),
      aboveFold: aboveFold ? aboveFold.textContent.trim().slice(0, 40) : null,
      aboveFoldWraps: aboveFold ? aboveFold.getClientRects().length > 1 : null,
      fixedCta: fixed,
      brokenImgs: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src")).slice(0, 5),
      noAlt: imgs.filter((i) => !i.hasAttribute("alt")).length,
      noDims: imgs.filter((i) => !i.getAttribute("width") && !getComputedStyle(i).aspectRatio.match(/\d/)).length,
      ld,
      placeholders: (text.match(/\[DADO REAL[^\]]*\]|lorem ipsum/gi) || []).length,
      smallTargets: small,
      squeezed: [...document.querySelectorAll("p, li, td, span, div")].filter((e) => { if (!vis(e) || e.children.length > 2) return false; const t = e.textContent.trim(); if (t.length < 25) return false; const r = e.getBoundingClientRect(); const lh = parseFloat(getComputedStyle(e).lineHeight) || 20; return r.width < 130 && r.height / lh >= 4; }).slice(0, 5).map((e) => e.textContent.trim().slice(0, 40)),
      motion: (() => { const els = [...document.querySelectorAll("body *")]; const anim = els.filter((e) => { const st = getComputedStyle(e); return (st.animationName && st.animationName !== "none") || (st.transitionDuration && st.transitionDuration.split(",").some((d) => parseFloat(d) > 0)); }).length; const libs = ["gsap", "ScrollTrigger", "Motion", "Lenis", "lottie", "VANTA", "anime"].filter((k) => typeof window[k] !== "undefined"); const scrollTl = [...document.styleSheets].some((sh) => { try { return [...sh.cssRules].some((r) => /animation-timeline/.test(r.cssText)); } catch { return false; } }); return { anim, libs, scrollTl, grad: els.some((e) => /gradient\(/.test(getComputedStyle(e).backgroundImage)) }; })(),
      reducedMotion: [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => r.media && /prefers-reduced-motion/.test(r.media.mediaText)); } catch { return false; } }),
    };
  });
  const shot = path.join(out, `${name}-${label}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  await ctx.close();
  return { ...d, errors, failed, shot };
}

const D = await run({ width: 1440, height: 900 }, "desktop");
const M = await run({ width: 390, height: 844 }, "mobile");
await browser.close();

gate("lang-pt", /^pt/i.test(D.lang), `lang="${D.lang}"`, false);
gate("title", D.title && D.title.length <= 60, `${D.title.length} chars: ${D.title.slice(0, 60)}`);
gate("meta-description", D.desc && D.desc.length >= 50 && D.desc.length <= 160, `${D.desc.length} chars`);
gate("og-image", !!D.og, D.og || "ausente", false);
gate("um-h1", D.h1 === 1, `${D.h1} h1`);
gate("noindex", flag("--preview") ? /noindex/i.test(D.robots) : !/noindex/i.test(D.robots), `robots="${D.robots}" (${flag("--preview") ? "prévia exige noindex" : "final não pode ter noindex"})`);
gate("schema-jsonld", D.ld.length && !D.ld.includes("INVALID"), D.ld.join(", ") || "ausente", false);
gate("sem-overflow-x", !D.overflowX && !M.overflowX, `desktop=${D.overflowX} mobile=${M.overflowX}`);
gate("header<80px", D.headerH === null || D.headerH < 80, D.headerH === null ? "sem <header>" : `${D.headerH}px`, false);
gate("cta-na-dobra-desktop", !!D.aboveFold && !D.aboveFoldWraps, D.aboveFold || "nenhum CTA de contato visível na 1ª dobra");
gate("cta-na-dobra-mobile", !!M.aboveFold, M.aboveFold || "nenhum CTA de contato na 1ª dobra mobile");
gate("cta-fixo-mobile", M.fixedCta, M.fixedCta ? "ok" : "sem CTA fixo/sticky no rodapé do mobile");
gate("whatsapp-valido", D.waLinks > 0 && D.waBad.length === 0, D.waLinks ? (D.waBad.length ? `inválidos: ${D.waBad.join(" ")}` : `${D.waLinks} link(s) wa.me com DDI 55`) : "nenhum link de WhatsApp");
gate("imagens-ok", D.brokenImgs.length === 0 && D.failed.length === 0, [...D.brokenImgs, ...D.failed].slice(0, 4).join(" ") || "ok");
gate("alt", D.noAlt === 0, `${D.noAlt} <img> sem alt`);
gate("img-dimensoes", D.noDims === 0, `${D.noDims} imagem(ns) sem width/height ou aspect-ratio (CLS)`, false);
gate("sem-placeholder", D.placeholders === 0, `${D.placeholders} [DADO REAL]/lorem visível`, !flag("--preview"));
gate("console-limpo", D.errors.length === 0 && M.errors.length === 0, [...D.errors, ...M.errors].slice(0, 3).join(" | ") || "ok", false);
gate("tap-targets", M.smallTargets === 0, `${M.smallTargets} alvo(s) de toque < 40px no mobile`, false);
gate("texto-espremido", D.squeezed.length === 0 && M.squeezed.length === 0, [...D.squeezed, ...M.squeezed].slice(0, 3).map((t) => `"${t}…"`).join(" ") || "ok");
gate("movimento", D.motion.anim >= 6 || D.motion.libs.length > 0 || D.motion.scrollTl, `${D.motion.anim} elementos animados · libs: ${D.motion.libs.join(", ") || "nenhuma"} · scroll-driven: ${D.motion.scrollTl} · gradiente: ${D.motion.grad}`);
gate("reduced-motion", D.reducedMotion, D.reducedMotion ? "ok" : "sem @media (prefers-reduced-motion)", false);

const fails = gates.filter((g) => !g.ok);
const blocking = fails.filter((g) => g.blocks);
if (flag("--json")) console.log(JSON.stringify({ target, gates, screenshots: [D.shot, M.shot] }, null, 2));
else {
  console.log(`validate-page: ${target}\n`);
  for (const g of gates) console.log(`${g.ok ? "PASS" : g.blocks ? "FAIL" : "WARN"}  ${g.id.padEnd(22)} ${g.detail}`);
  console.log(`\nscreenshots: ${D.shot}  ${M.shot}`);
  console.log(`Resultado: ${blocking.length ? `REPROVADO (${blocking.length} bloqueante(s))` : "APROVADO"} · ${fails.length - blocking.length} aviso(s)`);
}
process.exit(blocking.length ? 1 : 0);
