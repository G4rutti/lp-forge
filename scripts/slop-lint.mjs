#!/usr/bin/env node
// slop-lint: detecta tells de "AI slop" em HTML/CSS/JSX/TSX/Vue/Svelte/Astro + copy PT-BR
// (texto visível da página e arquivos copy*.md).
// Uso: node slop-lint.mjs <arquivo|pasta> [...] [--json]
//      node slop-lint.mjs --hook   (lê JSON do hook PostToolUse no stdin)
// Saída: exit 0 sem P0; exit 1 com P0 (modo CLI); modo hook: exit 2 + stderr com P0 (feedback pro Claude).
import fs from "node:fs";
import path from "node:path";

const EXT = new Set([".html", ".htm", ".css", ".scss", ".jsx", ".tsx", ".js", ".ts", ".vue", ".svelte", ".astro", ".mdx"]);
const COPY_MD = /^(copy|textos?)[\w-]*\.md$/i;
const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "dist", "build", ".astro", ".vercel", "out", "coverage"]);

const INDIGO = ["#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#8b5cf6", "#7c3aed", "#a855f7", "#9333ea", "#818cf8", "#a78bfa"];
const BANNED_FONTS = /font-family\s*:\s*['"]?(Inter|Roboto|Arial|Open Sans|Helvetica|system-ui)['"]?\s*[,;]|fonts\.googleapis\.com\/css2?\?family=(Inter|Roboto|Open\+Sans)(?![\w+])/i;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2728}]/u;


// ---------- copy PT-BR ----------
const L = (body) => new RegExp(`(?<!\\p{L})(?:${body})(?!\\p{L})`, "giu");
const BANNED_PT = [
  "neste artigo", "nesta página", "a seguir,? vamos", "vamos mergulhar", "vamos explorar",
  "(?:é|e) (?:importante|fundamental|crucial|essencial) (?:notar|destacar|ressaltar|lembrar|que)",
  "vale (?:ressaltar|destacar|lembrar|mencionar)", "cabe (?:destacar|ressaltar)", "não se pode negar", "sem dúvida alguma",
  "em suma", "em resumo", "em conclusão", "para resumir", "por fim,? mas não menos importante",
  "no mundo (?:acelerado|atual|moderno) de hoje", "na era digital", "nos dias de hoje",
  "(?:em )?um (?:cenário|mercado) (?:em constante (?:evolução|mudança)|cada vez mais competitivo)",
  "eleve (?:o |a )?(?:seu|sua|seus|suas)", "transforme (?:o |a )?(?:seu|sua|seus|suas)", "revolucion\\p{L}*", "desbloqueie", "potencialize",
  "(?:ao|para o) próximo nível", "faz(?:er)? toda a diferença", "faça a diferença",
  "experiência (?:única|incrível|inesquecível|transformadora)", "atendimento (?:de excelência|humanizado|diferenciado)",
  "compromisso com a qualidade", "paixão pelo que fazemos", "qualidade e confiança",
  "soluções (?:completas|inovadoras|personalizadas|sob medida)", "tudo (?:o )?que você precisa em um só lugar",
  "embarque (?:nessa|nesta) jornada", "sua jornada (?:começa|de)", "mergulhe (?:no|na|em)", "descubra o poder",
  "mudança de jogo", "divisor de águas", "de ponta", "estado da arte",
  "(?:seu|sua) (?:bem-estar|satisfação) é (?:a )?nossa prioridade", "você merece o melhor", "como ninguém",
  "não espere mais", "agende já",
];
const RESTRICTED_PT = "otimiz\\p{L}*|alavanc\\p{L}*|potencializ\\p{L}*|aprimor\\p{L}*|impulsion\\p{L}*|garant(?:ir|imos|e|indo)|promov\\p{L}*|proporcion\\p{L}*|oferec(?:er|emos|e)|utiliz\\p{L}*|sinergia|holístic\\p{L}*|robust\\p{L}*|abrangente|dinâmic\\p{L}*|inovador\\p{L}*|significativ\\p{L}*|relevante|essencial|fundamental|crucial|incríve(?:l|is)|únic[oa]s?|exclusiv[oa]s?|premium|excelência|qualidade|personalizad[oa]s?|especializad[oa]s?|diferenciad[oa]s?";
const ADVERBS_PT = "realmente|verdadeiramente|extremamente|incrivelmente|totalmente|completamente|absolutamente|simplesmente|literalmente|profundamente|genuinamente";

function blank(m) { return m.replace(/[^\n]/g, " "); }
function visibleText(src, f) {
  const ext = path.extname(f).toLowerCase();
  if (ext === ".md") return src.replace(/```[\s\S]*?```/g, blank);
  if (ext === ".css" || ext === ".scss") return "";
  let s = src.replace(/<style[\s\S]*?<\/style>/gi, blank).replace(/<!--[\s\S]*?-->/g, blank);
  if ([".html", ".htm", ".vue", ".svelte", ".astro"].includes(ext)) s = s.replace(/<script[\s\S]*?<\/script>/gi, blank);
  else s = s.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + blank(m.slice(p.length)));
  s = s.replace(/<[^<>]*>/g, (tag) => {
    const keep = [...tag.matchAll(/\b(?:alt|title|aria-label|placeholder)=["']([^"']*)["']/g)].map((m) => m[1]).join(" ");
    const nl = (tag.match(/\n/g) || []).length;
    return " " + keep + " " + "\n".repeat(nl);
  });
  return s.replace(/\[DADO REAL:[^\]]*\]/gi, (m) => blank(m));
}


// ---------- bege / fonte batida / componentes repetidos ----------
function hexToHsl(hex) {
  let h = hex.replace("#", ""); if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let s = 0, hu = 0;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); hu = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hu *= 60; }
  return { h: hu, s: s * 100, l: l * 100 };
}
function isBeige(v) {
  v = v.trim();
  let m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
  if (m) { const c = hexToHsl(m[0]); return c.l >= 88 && c.l < 99 && c.s >= 12 && c.h >= 20 && c.h <= 65; }
  m = v.match(/oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)/i);
  if (m) { const L = m[2] ? +m[1] / 100 : +m[1]; return L >= 0.9 && +m[3] >= 0.006 && +m[3] <= 0.06 && +m[4] >= 40 && +m[4] <= 110; }
  m = v.match(/hsla?\(\s*([\d.]+)[\s,]+([\d.]+)%[\s,]+([\d.]+)%/i);
  if (m) return +m[3] >= 88 && +m[3] < 99 && +m[2] >= 12 && +m[1] >= 20 && +m[1] <= 65;
  m = v.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
  if (m) { const hx = "#" + [m[1], m[2], m[3]].map((x) => (+x).toString(16).padStart(2, "0")).join(""); return isBeige(hx); }
  return false;
}
const CEMITERIO = "Fraunces|Instrument Serif|Playfair Display|DM Serif Display|Cormorant(?: Garamond)?|Libre Caslon(?: Display| Text)?|Gloock|Young Serif|Poppins|Montserrat|Space Grotesk|Syne";

const rules = [
  // bege, fonte batida e componentes que viraram assinatura de IA
  { id: "fundo-bege", sev: "P0", msg: "Fundo bege/creme/off-white quente (o padrão de IA). Cor de fundo vem do DNA da marca ou das referências", test: (s) => { if (/lp-forge:\s*bege-aprovado/.test(s)) return []; const out = []; const re = /(?:--(?:bg|background|paper|surface|base|cream|canvas)[\w-]*|background(?:-color)?)\s*:\s*([^;}{]+)/gi; let m; while ((m = re.exec(s)) && out.length < 5) if (m[1].split(/[\s,]+(?=#|oklch|rgb|hsl)/).some(isBeige)) out.push({ line: s.slice(0, m.index).split("\n").length, match: m[0].slice(0, 70) }); return out.concat(findAll(s, /\bbg-(?:amber|orange|stone|yellow)-(?:50|100)\b|\bbg-\[#(?:f[5-9a-f][e-f0-9][0-9a-f]{3}|faf[0-9a-f]{3})\]/gi).slice(0, 3)); } },
  { id: "fonte-cemiterio", sev: "P0", msg: "Fonte que todo modelo escolhe (Fraunces, Instrument Serif, Playfair, DM Serif, Cormorant, Poppins, Montserrat...). Use o pool de repertorio/references/fontes.md; se é a fonte REAL da marca, comente lp-forge: fonte-aprovada", test: (s) => /lp-forge:\s*fonte-aprovada/.test(s) ? [] : findAll(s, new RegExp(`family=(?:${CEMITERIO.replace(/ /g, "\\+")})(?![\\w+])|font-family\\s*:\\s*['"]?(?:${CEMITERIO})['"]?`, "gi")).slice(0, 3) },
  { id: "fotos-inclinadas", sev: "P0", msg: "Colagem de fotos inclinadas/polaroid (componente repetido em toda LP gerada). Use foto real em grid reto ou full-bleed", test: (s) => { const m = findAll(s, /rotate\(\s*-?(?:[1-9]\d*(?:\.\d+)?|0?\.[5-9]\d*)deg\s*\)|--(?:rot|tilt|r)\s*:\s*-?[1-9][\d.]*deg|\b-?rotate-(?:1|2|3|6|12)\b/g); return m.length >= 3 ? [{ line: m[0].line, match: `${m.length} elementos rotacionados` }] : []; } },
  { id: "legenda-manuscrita", sev: "P0", msg: "Fonte manuscrita em legenda de foto (tique de 'álbum de fotos' de IA)", test: (s) => findAll(s, /family=(?:Caveat|Homemade\+Apple|Reenie\+Beanie|Kalam|Shadows\+Into\+Light|Gochi\+Hand|Nanum\+Pen\+Script|Patrick\+Hand|Indie\+Flower|Gloria\+Hallelujah)|font-family\s*:\s*['"]?(?:Caveat|Homemade Apple|Reenie Beanie|Kalam|Shadows Into Light|Gochi Hand|Nanum Pen Script|Patrick Hand|Indie Flower|Gloria Hallelujah)/gi).slice(0, 2) },
  { id: "h1-italico-colorido", sev: "P0", msg: "H1 com a última palavra em itálico/cor de destaque (assinatura de IA). Hierarquia por tamanho/peso, não por itálico colorido", test: (s) => findAll(s, /<h1\b[^>]*>(?:(?!<\/h1>)[\s\S]){0,400}?<(?:em|i)\b[^>]*>(?:(?!<\/h1>)[\s\S]){0,120}?<\/(?:em|i)>\s*[.!]?\s*(?:<\/span>\s*)?<\/h1>/gi).slice(0, 2) },
  // copy PT-BR (rodam só no texto visível)
  { id: "copy-cliche-pt", kind: "copy", sev: "P0", msg: "Frase-clichê de IA em PT-BR (ver copy-sem-slop/references/frases-pt.md)", test: (t) => findAll(t, L(BANNED_PT.join("|"))) },
  { id: "copy-contraste", kind: "copy", sev: "P0", msg: "Contraste binário de IA ('não é X, é Y', 'mais que um X, um Y', 'não só X mas Y') - diga Y direto", test: (t) => findAll(t, L("não (?:é|são|foi|era|se trata de)\\s+(?:só |apenas |sobre )?[^.!?\\n]{1,60}?[,.;]\\s*(?:é|são|mas|e sim)|não se trata de|mais (?:do )?que (?:um|uma|apenas|só|simplesmente)\\s[^.!?\\n]{1,50}?[,:]\\s*(?:um|uma|é)|não (?:só|apenas|somente)\\s[^.!?\\n]{1,60}?\\s(?:mas|como também)|não precisa(?:m)? de\\s[^.!?\\n]{1,50}?,\\s*precisa")) },
  { id: "copy-retorica", kind: "copy", sev: "P1", msg: "Pergunta retórica/abertura imaginativa ('E o melhor?', 'Imagine...', 'Resultado?')", test: (t) => findAll(t, L("e o melhor\\s*\\?|sabe (?:o que|por que|porque)[^?\\n]{0,40}\\?|quer saber[^?\\n]{0,30}\\?|(?:resultado|o segredo|a diferença)\\s*\\?|imagine (?:só|chegar|ter|poder|você)|já pensou (?:em|se)")) },
  { id: "copy-lista-negativa", kind: "copy", sev: "P1", msg: "Lista negativa ('Sem X. Sem Y. Sem Z.') - diga o que acontece", test: (t) => findAll(t, L("(?:sem|nada de)\\s+[\\p{L}-]+[.,!]\\s*(?:sem|nada de)\\s+[\\p{L}-]+[.,!]?\\s*(?:(?:e )?(?:sem|nada de))?")).filter((m) => (m.match.match(/sem|nada de/gi) || []).length >= 2) },
  { id: "copy-adverbio", kind: "copy", sev: "P1", msg: "Advérbio de ênfase (corte)", test: (t) => findAll(t, L(ADVERBS_PT)) },
  { id: "copy-anuncio", kind: "copy", sev: "P1", msg: "Anúncio de estrutura ('Confira abaixo', 'Conheça nossos...')", test: (t) => findAll(t, L("confira (?:abaixo|a seguir)|veja (?:abaixo|a seguir)|conheça (?:nossos|nossas|nosso|nossa|mais)|saiba mais sobre")) },
  { id: "copy-restritas", kind: "copy", sev: "P1", msg: "Palavras restritas acima de 2 por página (otimizar, garantir, qualidade, exclusivo...)", test: (t) => { const m = findAll(t, L(RESTRICTED_PT)); return m.length > 2 ? [{ line: m[2].line, match: `${m.length}x: ${[...new Set(m.map((x) => x.match.toLowerCase()))].slice(0, 8).join(", ")}` }] : []; } },
  { id: "copy-transicao", kind: "copy", sev: "P1", msg: "'Além disso/Ademais/Adicionalmente' mais de 1x", test: (t) => { const m = findAll(t, L("além disso|ademais|adicionalmente")); return m.length > 1 ? m.slice(1) : []; } },
  { id: "copy-dado-real", kind: "copy", sev: "P2", msg: "Placeholders [DADO REAL] pendentes (preencher com fatos.md antes de entregar)", test: (t, f, raw) => { const m = findAll(raw, /\[DADO REAL:[^\]]*\]/gi); return m.length ? [{ line: m[0].line, match: `${m.length} pendente(s)` }] : []; } },
  // P0 (código/visual)
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
  { id: "generic-cta", kind: "code", sev: "P1", msg: "CTA genérico ('Saiba mais', 'Get started', 'Começar')", test: (s) => findAll(s, />\s*(Saiba mais|Get started|Learn more|Começar agora|Comece agora|Clique aqui)\s*</gi) },
  { id: "ai-copy", kind: "copy", sev: "P1", msg: "Frase-clichê de IA na copy (EN)", test: (s) => findAll(s, /\b(unlock the power|elevate your|seamless(ly)?|game[- ]changer|cutting[- ]edge|next[- ]level|supercharge)\b/gi) },
  { id: "raw-hex", sev: "P1", msg: "Muitos hex soltos fora de :root (>12) - use tokens", test: (s, f) => { const body = s.replace(/:root\s*\{[^}]*\}/g, ""); const m = findAll(body, /#[0-9a-f]{6}\b|#[0-9a-f]{3}\b(?![0-9a-f])/gi); return m.length > 12 ? [{ line: m[12].line, match: `${m.length} hex soltos` }] : []; } },
  { id: "pure-black", sev: "P1", msg: "Preto puro como fundo/texto (use quase-preto na matiz da marca)", test: (s) => findAll(s, /(?:background(?:-color)?|color)\s*:\s*(?:#000(?:000)?|black)\s*[;}]/gi) },
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
  } else if (EXT.has(path.extname(p).toLowerCase()) || COPY_MD.test(path.basename(p))) acc.push(p);
  return acc;
}

function lintFile(f) {
  const src = fs.readFileSync(f, "utf8");
  const isMd = path.extname(f).toLowerCase() === ".md";
  const text = visibleText(src, f);
  const issues = [];
  for (const r of rules) {
    if (isMd && r.kind !== "copy") continue;
    let hits = [];
    try { hits = (r.kind === "copy" ? r.test(text, f, src) : r.test(src, f)) || []; } catch { hits = []; }
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
    if (!file || !(EXT.has(path.extname(file).toLowerCase()) || COPY_MD.test(path.basename(file))) || !fs.existsSync(file)) process.exit(0);
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
