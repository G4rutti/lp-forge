#!/usr/bin/env node
// slop-lint: detecta tells de "AI slop" em HTML/CSS/JSX/TSX/Vue/Svelte/Astro.
// Uso: node slop-lint.mjs <arquivo|pasta> [...] [--json]
//      node slop-lint.mjs --hook   (lê JSON do hook PostToolUse no stdin)
// Saída: exit 0 sem P0; exit 1 com P0 (modo CLI); modo hook: exit 2 + stderr com P0 (feedback pro Claude).
import fs from "node:fs";
import path from "node:path";

const EXT = new Set([".html", ".htm", ".css", ".scss", ".jsx", ".tsx", ".js", ".ts", ".vue", ".svelte", ".astro", ".mdx"]);
const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "dist", "build", ".astro", ".vercel", "out", "coverage"]);

const INDIGO = ["#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#8b5cf6", "#7c3aed", "#a855f7", "#9333ea", "#818cf8", "#a78bfa"];
const BANNED_FONTS = /font-family\s*:\s*['"]?(Inter|Roboto|Arial|Open Sans|Helvetica|system-ui)['"]?\s*[,;]|fonts\.googleapis\.com\/css2?\?family=(Inter|Roboto|Open\+Sans)(?![\w+])/i;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2728}]/u;

const rules = [
  // P0
  { id: "indigo-accent", sev: "P0", msg: "Acento índigo/roxo padrão de IA", test: (s) => findAll(s, new RegExp(INDIGO.join("|"), "gi")) },
  { id: "tailwind-indigo", sev: "P0", msg: "Classe Tailwind indigo/violet/purple como acento", test: (s) => findAll(s, /\b(?:bg|text|from|to|via|border|ring)-(?:indigo|violet|purple)-[3-7]00\b/g) },
  { id: "trust-gradient", sev: "P0", msg: "Gradiente 'confiança' (roxo→azul, azul→ciano, índigo→rosa)", test: (s) => findAll(s, /from-(?:purple|violet|indigo)-\d{3}[^"'`]{0,60}to-(?:blue|cyan|pink|fuchsia)-\d{3}|from-blue-\d{3}[^"'`]{0,60}to-cyan-\d{3}|linear-gradient\([^)]*(?:#6366f1|#8b5cf6|#7c3aed|#a855f7|purple|violet)[^)]*(?:#3b82f6|#06b6d4|blue|cyan|#ec4899|pink)[^)]*\)/gi) },
  { id: "banned-font", sev: "P0", msg: "Fonte genérica de IA (Inter/Roboto/Arial/Open Sans/system-ui) definida como fonte", test: (s) => findAll(s, new RegExp(BANNED_FONTS.source, "gi")) },
  { id: "transition-all", sev: "P0", msg: "transition: all (anime só transform/opacity)", test: (s) => findAll(s, /transition\s*:\s*all\b|\btransition-all\b/g) },
  { id: "layout-anim", sev: "P0", msg: "Animando propriedade de layout (width/height/top/left/margin)", test: (s) => findAll(s, /transition(?:-property)?\s*:\s*[^;{}]*\b(width|height|top|left|right|bottom|margin[\w-]*|padding[\w-]*)\b/g) },
  { id: "lorem", sev: "P0", msg: "Texto placeholder (lorem/feature 1/sample)", test: (s) => findAll(s, /lorem ipsum|dolor sit amet|\bfeature (one|two|three|1|2|3)\b|your (headline|tagline) here|texto de exemplo|placeholder text/gi) },
  { id: "emoji-icon", sev: "P0", msg: "Emoji usado como ícone em título/botão/lista", test: (s) => findAll(s, /<(h[1-6]|button|li)\b[^>]*>[^<]{0,40}?[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2728}]/gu) },
  { id: "fake-metric", sev: "P0", msg: "Métrica provavelmente inventada (verifique ou marque [DADO REAL])", test: (s) => findAll(s, />[^<]{0,30}(?:\b\d{1,3}x\b|99[.,]9\s*%|\+\s?\d{1,3}(?:[.,]\d{3})+\s*(?:clientes|usuários|users|customers))/gi) },
  // P1
  { id: "placeholder-img", sev: "P1", msg: "Imagem placeholder externa (unsplash/picsum/placehold)", test: (s) => findAll(s, /(?:images\.)?unsplash\.com|picsum\.photos|placehold\.co|placekitten|via\.placeholder|dummyimage\.com/gi) },
  { id: "glow-glass", sev: "P1", msg: "Glow/glassmorphism (backdrop-blur + transparência, sombras coloridas)", test: (s) => findAll(s, /backdrop-blur-(?:xl|2xl|3xl)|shadow-(?:indigo|purple|violet|blue)-500\/\d+|box-shadow\s*:[^;]*0 0 \d{2,}px[^;]*(?:rgba?\((?:99|139|168|124)|#(?:6366f1|8b5cf6|a855f7))/gi) },
  { id: "badge-sparkle", sev: "P1", msg: "Badge pílula com ✨/'Novo' acima do título", test: (s) => findAll(s, /rounded-full[^>]*>\s*(?:✨|🚀|⚡|New|Novo|Introducing|Apresentando)/gi) },
  { id: "em-dash", sev: "P1", msg: "Travessões em excesso na copy (>3)", test: (s) => { const m = findAll(s, /—/g); return m.length > 3 ? m.slice(0, 1).map((x) => ({ ...x, extra: `${m.length} ocorrências` })) : []; } },
  { id: "generic-cta", sev: "P1", msg: "CTA genérico ('Saiba mais', 'Get started', 'Começar')", test: (s) => findAll(s, />\s*(Saiba mais|Get started|Learn more|Começar agora|Comece agora|Clique aqui)\s*</gi) },
  { id: "ai-copy", sev: "P1", msg: "Frase-clichê de IA na copy", test: (s) => findAll(s, /\b(eleve (seu|sua)|transforme (seu|sua)|desbloqueie|descubra o poder|revolucion\w+|unlock the power|elevate your|seamless(ly)?|game[- ]changer|cutting[- ]edge|next[- ]level|supercharge)\b/gi) },
  { id: "raw-hex", sev: "P1", msg: "Muitos hex soltos fora de :root (>12) - use tokens", test: (s, f) => { const body = s.replace(/:root\s*\{[^}]*\}/g, ""); const m = findAll(body, /#[0-9a-f]{6}\b|#[0-9a-f]{3}\b(?![0-9a-f])/gi); return m.length > 12 ? [{ line: m[12].line, match: `${m.length} hex soltos` }] : []; } },
  { id: "pure-bw", sev: "P1", msg: "Preto/branco puro como fundo/texto (tinja os neutros)", test: (s) => findAll(s, /(?:background(?:-color)?|color)\s*:\s*(?:#000(?:000)?|#fff(?:fff)?|black|white)\s*[;}]/gi) },
  { id: "three-cards", sev: "P1", msg: "Grid de 3 colunas (provável trio de cards genérico) - varie", test: (s) => findAll(s, /\bmd:grid-cols-3\b|\blg:grid-cols-3\b|grid-template-columns\s*:\s*repeat\(\s*3\s*,\s*1fr\s*\)/g).slice(0, 1) },
  { id: "bounce", sev: "P1", msg: "Animação bounce/elastic", test: (s) => findAll(s, /\banimate-bounce\b|cubic-bezier\(\s*0?\.\d+\s*,\s*-?\d*\.?\d+\s*,\s*0?\.\d+\s*,\s*1\.[3-9]\d*\s*\)|easeOutBounce|easeOutElastic/g) },
  // P2
  { id: "no-reduced-motion", sev: "P2", msg: "Tem animação mas não trata prefers-reduced-motion", test: (s, f) => /@keyframes|animation\s*:|transition\s*:|framer-motion|motion\/react|gsap/i.test(s) && !/prefers-reduced-motion|useReducedMotion|motion-reduce:/i.test(s) && /\.(html?|css|scss)$/i.test(f) ? [{ line: 1, match: "sem prefers-reduced-motion" }] : [] },
  { id: "img-no-alt", sev: "P2", msg: "<img> sem alt", test: (s) => findAll(s, /<img\b(?![^>]*\balt=)[^>]*>/gi) },
  { id: "accent-overuse", sev: "P2", msg: "var(--accent) usado muitas vezes (>8) - acento é tempero", test: (s) => { const m = findAll(s, /var\(--accent\)/g); return m.length > 8 ? [{ line: m[8].line, match: `${m.length} usos` }] : []; } },
];

function findAll(src, re) {
  const out = [];
  if (!re.global) re = new RegExp(re.source, re.flags + "g");
  let m;
  while ((m = re.exec(src)) && out.length < 20) {
    const line = src.slice(0, m.index).split("\n").length;
    out.push({ line, match: m[0].slice(0, 80).replace(/\s+/g, " ") });
    if (m[0].length === 0) re.lastIndex++;
  }
  return out;
}

function walk(p, acc = []) {
  let st;
  try { st = fs.statSync(p); } catch { return acc; }
  if (st.isDirectory()) {
    if (SKIP_DIRS.has(path.basename(p))) return acc;
    for (const e of fs.readdirSync(p)) walk(path.join(p, e), acc);
  } else if (EXT.has(path.extname(p).toLowerCase())) acc.push(p);
  return acc;
}

function lintFile(f) {
  const src = fs.readFileSync(f, "utf8");
  const issues = [];
  for (const r of rules) {
    let hits = [];
    try { hits = r.test(src, f) || []; } catch { hits = []; }
    for (const h of hits) issues.push({ file: f, rule: r.id, sev: r.sev, msg: r.msg, line: h.line, match: h.extra ? `${h.match} (${h.extra})` : h.match });
  }
  return issues;
}

function format(issues) {
  if (!issues.length) return "slop-lint: limpo ✓";
  const by = { P0: [], P1: [], P2: [] };
  issues.forEach((i) => by[i.sev].push(i));
  const lines = [];
  for (const sev of ["P0", "P1", "P2"]) {
    if (!by[sev].length) continue;
    lines.push(`\n${sev} (${by[sev].length})`);
    for (const i of by[sev]) lines.push(`  ${i.file}:${i.line}  [${i.rule}] ${i.msg}  →  ${i.match}`);
  }
  lines.push(`\nResumo: P0=${by.P0.length} P1=${by.P1.length} P2=${by.P2.length}`);
  return lines.join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--hook")) {
    let raw = "";
    for await (const c of process.stdin) raw += c;
    let file;
    try { const j = JSON.parse(raw); file = j?.tool_input?.file_path || j?.tool_input?.path; } catch { process.exit(0); }
    if (!file || !EXT.has(path.extname(file).toLowerCase()) || !fs.existsSync(file)) process.exit(0);
    const p0 = lintFile(file).filter((i) => i.sev === "P0");
    if (!p0.length) process.exit(0);
    process.stderr.write(`slop-lint encontrou P0 em ${file} (corrija antes de seguir; regras na skill lp-forge:anti-slop):` + format(p0) + "\n");
    process.exit(2);
  }
  const json = args.includes("--json");
  const targets = args.filter((a) => !a.startsWith("--"));
  if (!targets.length) { console.error("uso: slop-lint.mjs <arquivo|pasta> [--json]"); process.exit(64); }
  const files = targets.flatMap((t) => walk(path.resolve(t)));
  const issues = files.flatMap(lintFile);
  if (json) console.log(JSON.stringify({ files: files.length, issues }, null, 2));
  else console.log(`slop-lint: ${files.length} arquivo(s)` + (issues.length ? format(issues) : "\nlimpo ✓"));
  process.exit(issues.some((i) => i.sev === "P0") ? 1 : 0);
}
main();
