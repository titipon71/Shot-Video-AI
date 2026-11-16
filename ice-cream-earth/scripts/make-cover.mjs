// ไอศกรีมโลก — TikTok cover, 3:4 portrait (1080x1440), concept A: "วางโคนไอติมที่ขั้วโลกใต้… จะได้อะไร?"
// Shows the set-up only (cone pressed on the snow, puzzled penguin); never the ice-cream Earth.
// Builds cover/cover.html and screenshots it to renders/cover-tiktok-3x4.png with headless Chrome/Edge.
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from "node:fs";
import { extname, join } from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { proj, repo, T, polarBg, penguin, cone, sleeve, mitten, DEFS } from "./draw.mjs";

const W = 1080, H = 1440, Y0 = 420; // crop of the 1080x1920 scene: y 420..1860

const sparkle = (x, y, s) => `<path d="M${x} ${y - s} L${x + s * 0.3} ${y} L${x} ${y + s} L${x - s * 0.3} ${y} Z M${x - s} ${y} L${x} ${y + s * 0.3} L${x + s} ${y} L${x} ${y - s * 0.3} Z"/>`;

const scene = `
  ${polarBg()}
  ${penguin(215, 1450, 1.2, { tilt: -14, look: 1, q: true })}
  ${sleeve(600, 1115)}
  <ellipse cx="560" cy="1590" rx="210" ry="30" fill="#9d8fc8" opacity=".4"/>
  ${cone(560, 1580, 330, -420)}
  <g fill="#fff" opacity=".95">${[[370, 1580, 22], [400, 1550, 14], [750, 1585, 24], [720, 1550, 13], [340, 1610, 12], [780, 1615, 12]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>
  ${mitten(600, 1115)}
  <g fill="#fff" filter="url(#softShadow)">${sparkle(330, 1110, 16)}${sparkle(800, 1000, 12)}${sparkle(470, 1010, 10)}</g>

  <!-- headline -->
  <g transform="translate(540 560) rotate(-3)" filter="url(#softShadow)">
    <rect x="-330" y="-62" width="660" height="112" rx="22" fill="#fffaf4"/>
    ${T(0, 14, "วางโคนไอติม", { size: 84, weight: 900, fill: "#2b2350" })}
  </g>
  ${T(540, 760, "ที่ขั้วโลกใต้…", { size: 138, weight: 900, fill: "url(#gold)", stroke: "#2b2350", sw: 18, filter: "softShadow" })}

  <!-- sticker -->
  <g transform="translate(870 1420) rotate(8)" filter="url(#softShadow)">
    <path d="M0 -120 L30 -46 L110 -54 L50 0 L96 70 L16 40 L-22 116 L-32 36 L-112 40 L-54 -8 L-94 -80 L-18 -46 Z" fill="#ff9ad5"/>
    ${T(0, -6, "จะได้", { size: 44, weight: 900, fill: "#fff", stroke: "#2b2350", sw: 8 })}
    ${T(0, 46, "อะไร?", { size: 52, weight: 900, fill: "#fff", stroke: "#2b2350", sw: 8 })}
  </g>`;

const fontCss = ["Medium:500", "SemiBold:600", "Bold:700", "ExtraBold:800", "Black:900"]
  .map((f) => { const [n, w] = f.split(":"); return `@font-face{font-family:Kanit;font-weight:${w};font-display:block;src:url("/ice-cream-earth/assets/fonts/Kanit-${n}.ttf") format("truetype")}`; }).join("\n");
const html = `<!doctype html><html lang="th"><head><meta charset="UTF-8"><style>
${fontCss}
*{margin:0;padding:0}html,body{width:${W}px;height:${H}px;overflow:hidden;background:#1f2463}
svg{display:block}
</style></head><body>${DEFS}
<svg width="${W}" height="${H}" viewBox="0 ${Y0} ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${scene}</svg>
</body></html>`;
mkdirSync(join(proj, "cover"), { recursive: true });
writeFileSync(join(proj, "cover", "cover.html"), html);

// ---------- screenshot ----------
const MIME = { ".html": "text/html; charset=utf-8", ".ttf": "font/ttf" };
const server = createServer((req, res) => {
  const p = join(repo, decodeURIComponent((req.url || "/").split("?")[0]).replace(/^\//, ""));
  if (!p.startsWith(repo) || !existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "Content-Type": MIME[extname(p)] || "application/octet-stream" });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = [process.env.CHROME, "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome-stable"].filter(Boolean).find((p) => existsSync(p));
if (!browser) throw new Error("no Chrome/Edge found; set CHROME");
mkdirSync(join(proj, "renders"), { recursive: true });
const dest = join(proj, "renders", "cover-tiktok-3x4.png");
rmSync(dest, { force: true });
await new Promise((resolve, reject) => {
  const p = spawn(browser, [`--user-data-dir=${join(tmpdir(), "ice-cream-earth-profile")}`, "--no-first-run",
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    "--virtual-time-budget=5000", "--run-all-compositor-stages-before-draw",
    `--window-size=${W},${H}`, `--screenshot=${dest}`,
    `http://127.0.0.1:${server.address().port}/ice-cream-earth/cover/cover.html`], { stdio: ["ignore", "pipe", "pipe"] });
  let err = ""; p.stderr.on("data", (d) => { err += d; });
  p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(err || "browser exit " + code))));
});
for (let i = 0; i < 60 && !existsSync(dest); i++) await new Promise((r) => setTimeout(r, 250));
server.close();
if (!existsSync(dest)) throw new Error("screenshot not written: " + dest);
console.log("cover", dest, statSync(dest).size, "bytes");
