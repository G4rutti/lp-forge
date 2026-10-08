#!/usr/bin/env node
// gallery: gera <rodada>/index.html com todas as variantes lado a lado (desktop + mobile).
// Uso: node gallery.mjs variantes/r1
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(process.argv[2] || ".");
if (!fs.existsSync(dir)) { console.error(`pasta não existe: ${dir}`); process.exit(1); }
const variants = fs.readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(dir, d.name, "index.html")))
  .map((d) => {
    const notes = path.join(dir, d.name, "notes.md");
    const n = fs.existsSync(notes) ? fs.readFileSync(notes, "utf8").split("\n").filter(Boolean).slice(0, 5).join(" · ") : "";
    return { name: d.name, notes: n.replace(/[<>&]/g, "") };
  })
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

if (!variants.length) { console.error("nenhuma variante com index.html encontrada"); process.exit(1); }

const cards = variants.map((v) => `
  <section class="v" id="${v.name}">
    <header><h2>${v.name}</h2><a href="./${v.name}/index.html" target="_blank" rel="noopener">abrir ↗</a></header>
    <p class="n">${v.notes}</p>
    <div class="frames">
      <div class="desk"><iframe src="./${v.name}/index.html" loading="lazy" title="${v.name} desktop"></iframe></div>
      <div class="mob"><iframe src="./${v.name}/index.html" loading="lazy" title="${v.name} mobile"></iframe></div>
    </div>
  </section>`).join("\n");

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Leque · ${path.basename(dir)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600&family=Geist+Mono&display=swap" rel="stylesheet">
<style>
:root{--bg:oklch(.17 .005 260);--fg:oklch(.95 .005 260);--muted:oklch(.65 .01 260);--line:oklch(.3 .01 260);--accent:oklch(.78 .15 70)}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 Geist,sans-serif}
.top{position:sticky;top:0;z-index:2;display:flex;gap:16px;align-items:center;padding:12px 24px;background:var(--bg);border-bottom:1px solid var(--line)}
.top b{font-family:"Geist Mono",monospace;font-size:13px;color:var(--accent)}.top nav{display:flex;gap:12px;flex-wrap:wrap}.top a{color:var(--muted);text-decoration:none;font-size:13px}.top a:hover{color:var(--fg)}
main{padding:24px;display:grid;gap:48px}
.v header{display:flex;justify-content:space-between;align-items:baseline}.v h2{margin:0;font:600 18px "Geist Mono",monospace}.v header a{color:var(--accent);font-size:13px}
.n{color:var(--muted);font-size:13px;margin:4px 0 12px;max-width:110ch}
.frames{display:grid;grid-template-columns:1fr 300px;gap:16px;align-items:start}
.desk,.mob{border:1px solid var(--line);border-radius:6px;overflow:hidden;background:#fff}
.desk{height:620px}.desk iframe{width:1440px;height:1033px;transform:scale(.6);transform-origin:0 0;border:0}
.mob{height:620px}.mob iframe{width:390px;height:806px;transform:scale(.77);transform-origin:0 0;border:0}
@media (max-width:1100px){.frames{grid-template-columns:1fr}.desk{height:auto;aspect-ratio:1440/900}.desk iframe{transform:scale(.4)}}
</style></head><body>
<div class="top"><b>leque · ${path.basename(dir)} · ${variants.length} variantes</b><nav>${variants.map((v) => `<a href="#${v.name}">${v.name}</a>`).join("")}</nav></div>
<main>${cards}</main></body></html>`;

fs.writeFileSync(path.join(dir, "index.html"), html);
console.log(`galeria: ${path.join(dir, "index.html")} (${variants.length} variantes)`);
