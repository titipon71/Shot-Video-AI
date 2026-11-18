// ถ้ากรุงเทพฯ มีระบบทิปแบบอเมริกา — TikTok cover, 3:4 portrait (1080x1440).
// Set-up only: a giant tip screen pushed at a shocked office worker in Asok, service workers grinning.
// Keeps the endings hidden (supercar, waiter, piggy bank).
// Builds cover/cover.html and screenshots it to renders/cover-tiktok-3x4.png with headless Chrome/Edge.
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from "node:fs";
import { extname, join } from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { proj, repo, placeChar, txt, asokBg, presets, tipScreen, coin, SHEET_DEFS } from "./draw.mjs";

const W = 1080, H = 1440, Y0 = 380; // crop of the 1080x1920 scene: y 380..1820

const sweat = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#7ec8ff" stroke="#1a1208" stroke-width="3"><path d="M0 -26 Q16 0 0 12 Q-16 0 0 -26 Z"/></g>`;
const burst = (cx, cy, r0, r1, n, fill) => {
  let d = "";
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? r0 : r1;
    d += `${i ? "L" : "M"}${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="${fill}"/>`;
};
const minis = [[150, 1010, -12, ["15%", "18%", "20%"]], [935, 960, 11, ["10%", "15%", "20%"]]];

const scene = `
  ${asokBg({ time: "morning", prefix: "cv", trainX: 140 })}
  <rect x="0" y="0" width="1080" height="1920" fill="#1a1208" opacity=".28"/>
  ${burst(540, 1080, 330, 640, 18, "#ffd166")}
  <g opacity=".55">${burst(540, 1080, 330, 640, 18, "url(#cv-ray)")}</g>
  ${minis.map(([x, y, r, opts]) => tipScreen(x, y, 0.55, { rot: r, opts, pick: -1 })).join("")}

  <!-- the giant tip screen -->
  ${tipScreen(540, 1060, 1.6, { title: "เพิ่มทิปไหมคะ?", opts: ["20%", "25%", "30%"], pick: 2, rot: -3 })}
  <g transform="translate(830 1150) rotate(-3)">
    <circle r="34" fill="#fff" opacity=".9"/>
    <path d="M-6 -20 L-6 22 L4 12 L12 30 L20 26 L12 8 L26 8 Z" fill="#1a1208" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
  </g>

  <!-- people -->
  ${placeChar({ ...presets.auntie, id: "cvau", expression: "smile", armL: 150, armR: 12 }, 950, 1990, 1.05)}
  ${placeChar({ ...presets.winMale, id: "cvwin", expression: "smirk", armL: 12, armR: 150 }, 755, 2010, 1.1)}
  ${placeChar({ ...presets.officeMale, id: "cvhero", expression: "shocked", armL: 150, armR: -150 }, 300, 1925, 1.4)}
  ${sweat(170, 1385, 1.2)}${sweat(430, 1370, 1)}
  ${coin(560, 1700, 30)}${coin(600, 1765, 24)}${coin(90, 1700, 26)}

  <!-- headline -->
  <rect x="0" y="${Y0}" width="${W}" height="430" fill="url(#cv-scrim)"/>
  <g transform="rotate(-3 540 500)" filter="url(#tbShadow)">
    <rect x="150" y="450" width="780" height="100" rx="18" fill="#c8282f" stroke="#1a1208" stroke-width="6"/>
    ${txt(540, 520, "ถ้ากรุงเทพฯ มีระบบ", { size: 62, weight: 800, fill: "#fff" })}
  </g>
  ${txt(540, 700, "ทิปแบบอเมริกา", { size: 132, weight: 900, fill: "url(#cv-gold)", stroke: "#1a1208", sw: 18 })}

  <!-- hook sticker -->
  <g transform="translate(800 1400) rotate(7)" filter="url(#tbShadow)">
    <rect x="-200" y="-62" width="400" height="124" rx="22" fill="#ffd166" stroke="#1a1208" stroke-width="6"/>
    ${txt(0, -10, "เงินเดือนเท่าเดิม", { size: 36, weight: 700, fill: "#1a1208" })}
    ${txt(0, 40, "แต่ทุกอย่างต้องทิป!", { size: 40, weight: 900, fill: "#c8282f" })}
  </g>`;

const fontCss = ["SemiBold:600", "Bold:700", "ExtraBold:800", "Black:900"]
  .map((f) => { const [n, w] = f.split(":"); return `@font-face{font-family:Kanit;font-weight:${w};font-display:block;src:url("/tip-bangkok/assets/fonts/Kanit-${n}.ttf") format("truetype")}`; }).join("\n");
const html = `<!doctype html><html lang="th"><head><meta charset="UTF-8"><style>
${fontCss}
*{margin:0;padding:0}html,body{width:${W}px;height:${H}px;overflow:hidden;background:#1a1208}
svg{display:block}
</style></head><body>${SHEET_DEFS}
<svg width="${W}" height="${H}" viewBox="0 ${Y0} ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="cv-scrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0e06" stop-opacity=".7"/><stop offset="1" stop-color="#1a0e06" stop-opacity="0"/></linearGradient>
  <linearGradient id="cv-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#f0c14a"/><stop offset="1" stop-color="#c88a1a"/></linearGradient>
  <radialGradient id="cv-ray" cx="50%" cy="50%" r="50%"><stop offset=".45" stop-color="#ff9a3a" stop-opacity="0"/><stop offset="1" stop-color="#ff9a3a"/></radialGradient>
  <radialGradient id="cv-vig" cx="50%" cy="50%" r="75%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></radialGradient>
</defs>
${scene}
<rect x="0" y="${Y0}" width="${W}" height="${H}" fill="url(#cv-vig)"/>
</svg>
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
  const p = spawn(browser, [`--user-data-dir=${join(tmpdir(), "tip-bangkok-profile")}`, "--no-first-run",
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    "--virtual-time-budget=5000", "--run-all-compositor-stages-before-draw",
    `--window-size=${W},${H}`, `--screenshot=${dest}`,
    `http://127.0.0.1:${server.address().port}/tip-bangkok/cover/cover.html`], { stdio: ["ignore", "pipe", "pipe"] });
  let err = ""; p.stderr.on("data", (d) => { err += d; });
  p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(err || "browser exit " + code))));
});
for (let i = 0; i < 60 && !existsSync(dest); i++) await new Promise((r) => setTimeout(r, 250));
server.close();
if (!existsSync(dest)) throw new Error("screenshot not written: " + dest);
console.log("cover", dest, statSync(dest).size, "bytes");
