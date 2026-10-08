#!/usr/bin/env node
// update-vendored: atualiza as skills de terceiros incluídas no plugin a partir das origens.
// Uso (na raiz do plugin): node scripts/update-vendored.mjs   → depois revise `git diff` e commite.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const SOURCES = [
  { repo: "anthropics/skills", license: "skills/frontend-design/LICENSE.txt", map: { "skills/frontend-design": "frontend-design" } },
  { repo: "vercel-labs/agent-skills", license: null, map: { "skills/web-design-guidelines": "web-design-guidelines", "skills/react-best-practices": "vercel-react-best-practices" } },
  { repo: "vercel-labs/agent-browser", license: "LICENSE", map: { "skills/agent-browser": "agent-browser" } },
  { repo: "leonxlnx/taste-skill", license: "LICENSE", map: { "skills/taste-skill": "design-taste-frontend", "skills/redesign-skill": "redesign-existing-projects", "skills/soft-skill": "high-end-visual-design", "skills/minimalist-skill": "minimalist-ui", "skills/brutalist-skill": "industrial-brutalist-ui", "skills/imagegen-frontend-web": "imagegen-frontend-web", "skills/image-to-code-skill": "image-to-code", "skills/brandkit": "brandkit" } },
  { repo: "emilkowalski/skills", license: "LICENSE", map: Object.fromEntries(["emil-design-eng", "review-animations", "improve-animations", "animation-vocabulary", "find-animation-opportunities", "apple-design", "pick-ui-library"].map((s) => [`skills/${s}`, s])) },
  { repo: "pbakaus/impeccable", license: "LICENSE", map: { "plugin/skills/impeccable": "impeccable" } },
  { repo: "nextlevelbuilder/ui-ux-pro-max-skill", license: "LICENSE", map: { ".claude/skills/ui-ux-pro-max": "ui-ux-pro-max" } },
  { repo: "coreyhaines31/marketingskills", license: "LICENSE", map: Object.fromEntries(["copywriting", "copy-editing", "cro", "seo-audit", "schema", "marketing-psychology", "competitor-profiling", "customer-research"].map((s) => [`skills/${s}`, s])) },
  { repo: "addyosmani/web-quality-skills", license: "LICENSE", map: Object.fromEntries(["accessibility", "web-quality-audit", "core-web-vitals", "performance", "best-practices", "seo"].map((s) => [`skills/${s}`, s])) },
  { repo: "agricidaniel/claude-seo", license: "LICENSE", map: Object.fromEntries(["seo-local", "seo-page", "seo-technical", "seo-images", "seo-geo"].map((s) => [`skills/${s}`, s])), extra: (dir) => { for (const f of fs.readdirSync(path.join(dir, "scripts"))) if (f !== "__pycache__") fs.cpSync(path.join(dir, "scripts", f), path.join(ROOT, "scripts", f), { recursive: true }); fs.copyFileSync(path.join(dir, "requirements.txt"), path.join(ROOT, "requirements.txt")); } },
  { repo: "jakubkrehel/skills", license: "LICENSE", map: Object.fromEntries(["better-interface", "better-ui", "better-typography", "better-layout", "better-colors", "better-accessibility", "better-writing", "interface-review", "explain-interface"].map((s) => [`skills/${s}`, s])) },
  { repo: "vojtaholik/good-css", license: "LICENSE", map: { "skills/good-css": "good-css" } },
  { repo: "squirrelscan/skills", license: "LICENSE", map: { "skills/audit-website": "audit-website" } },
  { repo: "srinitude/skills", license: "LICENSE", map: { "skills/visual-design-system-extractor": "visual-design-system-extractor", "skills/mobile-first-website-design": "mobile-first-website-design" } },
  { repo: "addyosmani/agent-skills", license: "LICENSE", map: Object.fromEntries(["doubt-driven-development", "frontend-ui-engineering", "browser-testing-with-devtools", "shipping-and-launch"].map((s) => [`skills/${s}`, s])), fixRefs: true },
  { repo: "cloudflare/skills", license: "LICENSE", map: { "skills/web-perf": "web-perf", "skills/wrangler": "wrangler" } },
  { repo: "anthropics/skills", license: "skills/webapp-testing/LICENSE.txt", map: { "skills/webapp-testing": "webapp-testing" } },
  { repo: "hardikpandya/stop-slop", license: "LICENSE", map: { ".": "stop-slop" }, only: ["SKILL.md", "references"] },
  { repo: "heygen-com/hyperframes", license: "LICENSE", map: Object.fromEntries(["hyperframes", "hyperframes-core", "hyperframes-cli", "hyperframes-animation", "hyperframes-keyframes", "general-video", "product-launch-video", "motion-graphics", "media-use"].map((s) => [`skills/${s}`, s])) },
];
const JUNK = new Set(["node_modules", "__pycache__", ".DS_Store", ".git"]);

function copyDir(src, dst, only) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (JUNK.has(e.name) || e.name.endsWith(".zip")) continue;
    if (only && !only.includes(e.name)) continue;
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    const real = fs.statSync(s);
    if (real.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "lpf-"));
for (const src of SOURCES) {
  const dir = path.join(tmp, src.repo.replace("/", "_"));
  console.log(`↓ ${src.repo}`);
  execFileSync("git", ["clone", "-q", "--depth", "1", `https://github.com/${src.repo}`, dir], { stdio: "inherit" });
  for (const [from, to] of Object.entries(src.map)) {
    const target = path.join(ROOT, "skills", to);
    const keepLicense = path.join(target, "LICENSE.txt");
    const oldLicense = fs.existsSync(keepLicense) ? fs.readFileSync(keepLicense) : null;
    fs.rmSync(target, { recursive: true, force: true });
    copyDir(path.join(dir, from), target, src.only);
    if (src.license) fs.copyFileSync(path.join(dir, src.license), keepLicense);
    else if (oldLicense) fs.writeFileSync(keepLicense, oldLicense);
    if (src.fixRefs) {
      const sk = path.join(target, "SKILL.md"); let md = fs.readFileSync(sk, "utf8");
      for (const m of new Set(md.match(/\.\.\/\.\.\/references\/[\w.-]+\.md/g) || [])) { fs.mkdirSync(path.join(target, "references"), { recursive: true }); fs.copyFileSync(path.join(dir, m.slice(6)), path.join(target, "references", path.basename(m))); }
      fs.writeFileSync(sk, md.replace(/\.\.\/\.\.\/references\//g, "references/"));
    }
    console.log(`  ✓ ${to}`);
  }
  if (src.extra) src.extra(dir);
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log("\nPronto. Revise com `git diff --stat` e commite.");
