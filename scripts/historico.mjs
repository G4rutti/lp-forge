#!/usr/bin/env node
// historico: memória entre projetos pra não repetir fonte, fundo e componente.
// Guarda em ~/.claude/lp-forge/historico.json.
//   node historico.mjs fontes            → display/cores/padrões usados nos últimos 8 projetos (pra evitar)
//   node historico.mjs registrar <pasta> → extrai do index.html final e adiciona ao histórico
//   node historico.mjs checar <pasta>    → exit 1 se repetir display ou fundo dos últimos 5 projetos
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const FILE = path.join(os.homedir(), ".claude", "lp-forge", "historico.json");
const load = () => { try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return []; } };
const save = (h) => { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(h.slice(-30), null, 2)); };

function extract(dir) {
  let f = path.resolve(dir); if (fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  const s = fs.readFileSync(f, "utf8");
  const fonts = [...s.matchAll(/family=([^&:"']+)/g)].map((m) => decodeURIComponent(m[1]).replace(/\+/g, " ").trim());
  const ff = [...s.matchAll(/font-family\s*:\s*['"]?([^'",;]+)/g)].map((m) => m[1].trim()).filter((x) => !/^var\(|sans-serif|serif|monospace|inherit|system-ui/.test(x));
  const h1 = s.match(/h1[^{]*\{[^}]*font-family\s*:\s*['"]?([^'",;]+)/);
  const display = (h1 && h1[1].trim()) || (s.match(/--font-display\s*:\s*['"]?([^'",;]+)/) || [])[1] || fonts[0] || ff[0] || null;
  const bg = (s.match(/--(?:bg|background|paper|surface)\s*:\s*([^;]+);/) || s.match(/body\s*\{[^}]*background(?:-color)?\s*:\s*([^;]+);/) || [])[1] || null;
  const patterns = [];
  if ((s.match(/rotate\(\s*-?[1-9]\d*(?:\.\d+)?deg\)/g) || []).length >= 3) patterns.push("fotos-inclinadas");
  if (/<h1[^>]*>[\s\S]{0,300}<(em|i)\b[\s\S]{0,120}<\/(em|i)>[\s\S]{0,40}<\/h1>/i.test(s)) patterns.push("h1-italico-colorido");
  if (/Caveat|Homemade Apple|Reenie Beanie|Kalam|Shadows Into Light|Gochi Hand|Nanum Pen/i.test(s)) patterns.push("legenda-manuscrita");
  return { display, fonts: [...new Set([...fonts, ...ff])].slice(0, 6), bg: bg && bg.trim(), patterns };
}

const [cmd, dir] = process.argv.slice(2);
const h = load();
if (cmd === "fontes" || !cmd) {
  const last = h.slice(-8);
  if (!last.length) { console.log("histórico vazio: nenhuma restrição ainda."); process.exit(0); }
  console.log("NÃO repita (últimos projetos):");
  console.log("- displays:", [...new Set(last.map((x) => x.display).filter(Boolean))].join(", ") || "-");
  console.log("- fundos:", [...new Set(last.map((x) => x.bg).filter(Boolean))].join(" | ") || "-");
  console.log("- padrões:", [...new Set(last.flatMap((x) => x.patterns))].join(", ") || "-");
} else if (cmd === "registrar") {
  const e = { at: new Date().toISOString(), projeto: path.basename(path.resolve(dir, "..")), ...extract(dir) };
  h.push(e); save(h); console.log("registrado:", JSON.stringify(e));
} else if (cmd === "checar") {
  const e = extract(dir); const last = h.slice(-5);
  const probs = [];
  const norm = (x) => (x || "").toLowerCase().replace(/\s+/g, "");
  if (e.display && last.some((x) => norm(x.display) === norm(e.display))) probs.push(`display "${e.display}" já usada nos últimos 5 projetos`);
  if (e.bg && last.some((x) => norm(x.bg) === norm(e.bg))) probs.push(`fundo "${e.bg}" já usado nos últimos 5 projetos`);
  for (const p of e.patterns) if (last.some((x) => x.patterns.includes(p))) probs.push(`padrão "${p}" repetido`);
  console.log(probs.length ? "REPETIÇÃO:\n- " + probs.join("\n- ") : `ok: nada repetido (display ${e.display || "?"}, fundo ${e.bg || "?"})`);
  process.exit(probs.length ? 1 : 0);
} else { console.error("uso: historico.mjs fontes | registrar <pasta> | checar <pasta>"); process.exit(64); }
