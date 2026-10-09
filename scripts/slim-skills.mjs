#!/usr/bin/env node
// slim-skills: marca as skills vendorizadas (as que têm LICENSE.txt) com disable-model-invocation: true.
// Efeito: a descrição delas deixa de entrar no contexto de TODO turno (≈10k tokens), mas continuam
// disponíveis via /lp-forge:<nome> e o pipeline lê o SKILL.md delas direto pelo caminho.
import fs from "node:fs"; import path from "node:path";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const dir = path.join(ROOT, "skills"); let n = 0;
for (const s of fs.readdirSync(dir)) {
  const sk = path.join(dir, s, "SKILL.md");
  if (!fs.existsSync(sk) || !fs.existsSync(path.join(dir, s, "LICENSE.txt"))) continue;
  let md = fs.readFileSync(sk, "utf8");
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/); if (!m || /disable-model-invocation:/.test(m[1])) continue;
  fs.writeFileSync(sk, md.replace(/^---\r?\n/, "---\ndisable-model-invocation: true\n")); n++;
}
console.log(`slim-skills: ${n} skill(s) marcadas`);
