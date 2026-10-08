#!/usr/bin/env node
// bootstrap-extras: instala, UMA vez por máquina e em segundo plano, as skills que não podem
// ser redistribuídas dentro do plugin (sem licença no repo de origem). Roda no SessionStart.
// Forçar de novo: apague ~/.claude/lp-forge/bootstrap-v2.json
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const EXTRAS = [
  { label: "Remotion (remotion-dev/skills)", args: ["-y", "skills", "add", "remotion-dev/skills", "--skill", "*", "-g", "-a", "claude-code", "-y", "--copy"] },
];
// Playwright + Chromium para ref-capture.mjs e validate-page.mjs, numa pasta própria do lp-forge
const PW = { label: "Playwright + Chromium (screenshots e validação)", cmd: "npm i --no-audit --no-fund --prefix . playwright && npx --prefix . playwright install chromium" };

const dir = path.join(os.homedir(), ".claude", "lp-forge");
const marker = path.join(dir, "bootstrap-v2.json");
if (fs.existsSync(marker)) process.exit(0);

try {
  fs.mkdirSync(dir, { recursive: true });
  const log = fs.openSync(path.join(dir, "bootstrap.log"), "a");
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  for (const e of EXTRAS) {
    const child = spawn(npx, e.args, { detached: true, stdio: ["ignore", log, log], windowsHide: true, shell: process.platform === "win32" });
    child.unref();
  }
  const pw = spawn(PW.cmd, { cwd: dir, detached: true, stdio: ["ignore", log, log], windowsHide: true, shell: true });
  pw.unref();
  EXTRAS.push(PW);
  fs.writeFileSync(marker, JSON.stringify({ at: new Date().toISOString(), extras: EXTRAS.map((e) => e.label) }, null, 2));
  console.log(`lp-forge: instalando em segundo plano (1ª vez): ${EXTRAS.map((e) => e.label).join(", ")}. Disponível a partir da próxima sessão. Log: ${path.join(dir, "bootstrap.log")}`);
} catch (err) {
  console.log(`lp-forge: não consegui instalar os extras automaticamente (${err.message}). Rode: npx -y skills add remotion-dev/skills --skill '*' -g -a claude-code -y`);
}
process.exit(0);
