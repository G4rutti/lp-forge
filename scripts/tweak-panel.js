/* tweak-panel: painel flutuante pra ajustar tokens CSS (:root) ao vivo. Só pra dev/prévia.
   Inclua: <script src="tweak-panel.js" defer></script>  ·  Atalho: Alt+T mostra/esconde. */
(() => {
  const root = document.documentElement;
  const vars = new Set();
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    for (const r of rules) if (r.selectorText === ":root") for (const p of r.style) if (p.startsWith("--")) vars.add(p);
  }
  if (!vars.size) return;
  const cs = getComputedStyle(root);
  const isColor = (v) => /^(#|rgb|hsl|oklch|oklab|lab|lch|color\()/i.test(v);
  const isLen = (v) => /^-?[\d.]+(px|rem|em|vw|vh|%)$/.test(v);
  const isFont = (n) => /font/i.test(n);

  const panel = document.createElement("div");
  panel.setAttribute("data-tweak", "");
  panel.innerHTML = `<style>
  [data-tweak]{position:fixed;right:12px;bottom:12px;z-index:2147483647;width:300px;max-height:70vh;overflow:auto;background:#111;color:#eee;font:12px/1.4 ui-monospace,monospace;border:1px solid #333;border-radius:8px;padding:10px;box-shadow:0 10px 30px -10px #0008}
  [data-tweak] h4{margin:0 0 8px;font-size:12px;display:flex;justify-content:space-between}[data-tweak] label{display:grid;grid-template-columns:1fr 120px;gap:6px;align-items:center;margin:4px 0}
  [data-tweak] input,[data-tweak] select{width:100%;background:#1c1c1c;color:#eee;border:1px solid #333;border-radius:4px;padding:3px 4px;font:inherit}
  [data-tweak] button{margin-top:8px;width:100%;background:#eee;color:#111;border:0;border-radius:4px;padding:6px;font:inherit;cursor:pointer}</style>
  <h4><span>tokens (${vars.size})</span><span>Alt+T</span></h4><div class="rows"></div><button type="button">copiar :root</button>`;
  const rows = panel.querySelector(".rows");
  const fonts = ["Instrument Serif","Fraunces","Gloock","DM Serif Display","Young Serif","Syne","Bricolage Grotesque","Space Grotesk","Archivo Black","Anton","Geist","Manrope","Public Sans","IBM Plex Sans","Nunito Sans","JetBrains Mono"];
  const loaded = new Set();
  const loadFont = (f) => { if (loaded.has(f)) return; loaded.add(f); const l = document.createElement("link"); l.rel = "stylesheet"; l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, "+")}:ital,wght@0,400;0,700;1,400&display=swap`; document.head.appendChild(l); };

  for (const name of vars) {
    const val = cs.getPropertyValue(name).trim();
    const lab = document.createElement("label");
    lab.innerHTML = `<span title="${name}">${name}</span>`;
    let input;
    if (isFont(name)) {
      input = document.createElement("select");
      const cur = val.split(",")[0].replace(/['"]/g, "").trim();
      [cur, ...fonts.filter((f) => f !== cur)].forEach((f) => input.add(new Option(f, f)));
      input.oninput = () => { loadFont(input.value); root.style.setProperty(name, `"${input.value}", ${val.split(",").slice(1).join(",") || "serif"}`); };
    } else if (isLen(val)) {
      const unit = val.match(/[a-z%]+$/)[0]; const num = parseFloat(val);
      input = document.createElement("input"); input.type = "range"; input.min = 0; input.max = Math.max(num * 3, 10); input.step = unit === "px" ? 1 : 0.05; input.value = num;
      input.oninput = () => root.style.setProperty(name, input.value + unit);
    } else {
      input = document.createElement("input"); input.type = "text"; input.value = val;
      if (isColor(val)) input.style.borderLeft = `14px solid ${val}`;
      input.onchange = () => { root.style.setProperty(name, input.value); if (isColor(input.value)) input.style.borderLeft = `14px solid ${input.value}`; };
    }
    lab.appendChild(input); rows.appendChild(lab);
  }
  panel.querySelector("button").onclick = async () => {
    const now = getComputedStyle(root);
    const out = `:root {\n${[...vars].map((n) => `  ${n}: ${now.getPropertyValue(n).trim()};`).join("\n")}\n}`;
    try { await navigator.clipboard.writeText(out); panel.querySelector("button").textContent = "copiado ✓"; } catch { prompt("Copie:", out); }
  };
  document.addEventListener("keydown", (e) => { if (e.altKey && e.key.toLowerCase() === "t") panel.hidden = !panel.hidden; });
  document.body.appendChild(panel);
})();
