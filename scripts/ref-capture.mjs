#!/usr/bin/env node
// ref-capture: tira screenshots (desktop 1440 + mobile 390) de sites de referência e extrai
// o "esqueleto de design" de cada um: fontes reais, cores mais usadas, escala de títulos,
// nº de seções, raio, CTA principal. Saída: <out>/<slug>-desktop.jpg, -mobile.jpg e refs.json.
// Uso: node ref-capture.mjs <out-dir> <url> [url...]
// Requer playwright: npm i -D playwright && npx playwright install chromium (a 1ª vez)
import fs from "node:fs";
import path from "node:path";

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

const [out, ...urls] = process.argv.slice(2);
if (!out || !urls.length) { console.error("uso: ref-capture.mjs <out-dir> <url> [url...]"); process.exit(64); }
fs.mkdirSync(out, { recursive: true });

const slug = (u) => new URL(u).hostname.replace(/^www\./, "").replace(/[^a-z0-9]+/gi, "-");
const isRoot = typeof process.getuid === "function" && process.getuid() === 0;
const browser = await chromium.launch({ chromiumSandbox: !isRoot });

const extract = () => {
  const cs = (el) => getComputedStyle(el);
  const GENERIC = /^(sans-serif|serif|system-ui|-apple-system|blinkmacsystemfont|ui-sans-serif|ui-serif|monospace|arial|helvetica)$/i;
  const fam = (el) => { const l = cs(el).fontFamily.split(",").map((f) => f.replace(/["']/g, "").trim()); return l.find((f) => !GENERIC.test(f)) || l[0]; };
  const vis = (e) => { const r = e.getBoundingClientRect(); const s = cs(e); return r.width > 2 && r.height > 2 && s.visibility !== "hidden" && s.display !== "none" && +s.opacity > 0.05 && r.bottom > 0 && r.right > 0; };
  const heads = [...document.querySelectorAll("h1,h2,h3")].filter(vis).slice(0, 12);
  const display = heads.slice().sort((a, b) => parseFloat(cs(b).fontSize) - parseFloat(cs(a).fontSize))[0];
  const bodyText = [...document.querySelectorAll("p")].filter(vis)[0] || document.body;
  const colors = {};
  for (const el of [...document.querySelectorAll("body, body *")].slice(0, 1500)) {
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width * r.height < 400) continue;
    const bg = cs(el).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") colors[bg] = (colors[bg] || 0) + r.width * r.height;
    const c = cs(el).color; colors[c] = (colors[c] || 0) + 200;
  }
  const isSkip = (e) => /skip to|pular para|ir para o conte|skip-link/i.test(e.textContent + " " + e.className);
  const cta = [...document.querySelectorAll("a,button")].filter((e) => vis(e) && !isSkip(e)).find((e) => {
    const r = e.getBoundingClientRect(); const s = cs(e);
    const filled = s.backgroundColor !== "rgba(0, 0, 0, 0)" && s.backgroundColor !== "transparent";
    const outlined = parseFloat(s.borderTopWidth) >= 1 && s.borderTopStyle !== "none";
    return r.top < innerHeight && r.width >= 70 && r.height >= 28 && (filled || outlined) && e.textContent.trim().length > 1;
  });
  return {
    title: document.title,
    fonts: { display: display ? fam(display) : null, body: fam(bodyText) },
    headings: heads.map((h) => ({ tag: h.tagName, size: cs(h).fontSize, weight: cs(h).fontWeight, text: h.textContent.replace(/\s+/g, " ").trim().slice(0, 70) })),
    palette: Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([c]) => c),
    sections: document.querySelectorAll("section, main > div, [class*=section]").length,
    radius: cta ? cs(cta).borderRadius : null,
    cta: cta ? { text: cta.textContent.replace(/\s+/g, " ").trim().slice(0, 40), bg: cs(cta).backgroundColor, color: cs(cta).color } : null,
    scrollHeight: document.documentElement.scrollHeight,
  };
};

const results = [];
for (const url of urls) {
  const s = slug(url);
  const r = { url, slug: s };
  try {
    for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: name === "mobile", userAgent: name === "mobile" ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148" : undefined });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(2500);
      // esconde banners de cookie/consentimento sem aceitar nada
      await page.addStyleTag({ content: '[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],[class*="gdpr" i],[id*="onetrust" i],[class*="cc-window"]{display:none!important}' }).catch(() => {});
      const file = path.join(out, `${s}-${name}.jpg`);
      await page.screenshot({ path: file, type: "jpeg", quality: 70, fullPage: false });
      await page.screenshot({ path: path.join(out, `${s}-${name}-full.jpg`), type: "jpeg", quality: 55, fullPage: true }).catch(() => {});
      if (name === "desktop") Object.assign(r, await page.evaluate(extract));
      r[name] = file;
      await ctx.close();
    }
    console.log(`✓ ${url}`);
  } catch (e) { r.error = e.message.split("\n")[0]; console.log(`✗ ${url}: ${r.error}`); }
  results.push(r);
}
await browser.close();
fs.writeFileSync(path.join(out, "refs.json"), JSON.stringify(results, null, 2));
console.log(`refs.json: ${path.join(out, "refs.json")} (${results.filter((r) => !r.error).length}/${results.length} ok)`);
