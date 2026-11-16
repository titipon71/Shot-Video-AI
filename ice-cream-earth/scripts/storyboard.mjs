// ไอศกรีมโลก — 7-panel storyboard sheet (draft v2).
// Builds storyboard/storyboard.html (each panel is a 1080x1920 SVG shown small) and
// screenshots it with headless Chrome/Edge to renders/storyboard.png.
// Land shapes: assets/land-110m.json (Natural Earth 1:110m via world-atlas, rings of [lon, lat]).
// Fonts are served from ../bang-dubai/assets/fonts (repo root is the web root).
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from "node:fs";
import { extname, join } from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { proj, repo, f1, T, heading, polarBg, penguin, cone, sleeve, mitten, space, globe, poleXY, comic, DEFS } from "./draw.mjs";


// ---------- the 7 panels ----------
const P = [];
P.push(`${polarBg()}${penguin(330, 1440, 1.25)}${heading("คุณอยู่ที่ขั้วโลกใต้", "You're at the South Pole")}`);

P.push(`${polarBg()}${penguin(250, 1450, 1.2, { look: 1 })}
  ${sleeve(690, 1130)}
  ${cone(640, 880, 250, 400)}
  ${mitten(690, 1130)}
  <g fill="#fff" filter="url(#softShadow)">${[[500, 820, 14], [790, 760, 18], [770, 960, 10]].map(([x, y, s]) => `<path d="M${x} ${y - s} L${x + s * 0.3} ${y} L${x} ${y + s} L${x - s * 0.3} ${y} Z M${x - s} ${y} L${x} ${y + s * 0.3} L${x + s} ${y} L${x} ${y - s * 0.3} Z"/>`).join("")}</g>
  ${heading("หยิบโคนออกจากกระเป๋า", "Take a cone out of your bag")}`);

P.push(`${polarBg()}${penguin(190, 1440, 1.15, { tilt: -14, look: 1, q: true })}
  ${sleeve(575, 1105)}
  <ellipse cx="540" cy="1590" rx="210" ry="30" fill="#9d8fc8" opacity=".4"/>
  ${cone(540, 1580, 330, -420)}
  <g fill="#fff" opacity=".95">${[[350, 1580, 22], [380, 1550, 14], [730, 1585, 24], [700, 1550, 13], [320, 1610, 12], [760, 1615, 12]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>
  ${mitten(575, 1105)}
  ${comic(800, 1760, "แกร๊บ!", 86, "#ffd166")}
  ${heading("วางด้านกว้างลงพื้น", "Wide side down")}`);

const g4 = { lon0: 20, lat0: -25, southUp: true };
const [p4x, p4y] = poleXY(540, 1160, 430, g4);
P.push(`${space()}
  <g stroke="#fff" stroke-linecap="round" opacity=".5">${[...Array(22)].map((_, i) => { const a = (i / 22) * Math.PI * 2 + 0.1; const r0 = 560 + (i % 3) * 60; return `<line x1="${f1(540 + Math.cos(a) * r0)}" y1="${f1(1160 + Math.sin(a) * r0)}" x2="${f1(540 + Math.cos(a) * (r0 + 260))}" y2="${f1(1160 + Math.sin(a) * (r0 + 260))}" stroke-width="${3 + (i % 3) * 2}"/>`; }).join("")}</g>
  ${globe(540, 1160, 430, g4)}
  ${cone(f1(p4x), f1(p4y), 30, -46)}
  <circle cx="${f1(p4x)}" cy="${f1(p4y - 20)}" r="62" fill="none" stroke="#ffd166" stroke-width="6" stroke-dasharray="14 10"/>
  <path d="M780 520 Q700 560 ${f1(p4x + 60)} ${f1(p4y - 40)}" stroke="#ffd166" stroke-width="7" fill="none" marker-end="url(#arrow)"/>
  ${T(820, 500, "โคนของคุณ", { size: 46, weight: 800, fill: "#ffd166", filter: "txtShadow" })}
  ${comic(540, 330, "วู้บบบ!", 120, "#fff")}`);

const g5 = { lon0: 20, lat0: -25 };
const [p5x, p5y] = poleXY(540, 900, 430, g5);
P.push(`${space()}
  ${globe(540, 900, 430, g5)}
  ${cone(f1(p5x), f1(p5y), 30, 46)}
  <circle cx="${f1(p5x)}" cy="${f1(p5y + 20)}" r="62" fill="none" stroke="#ffd166" stroke-width="6" stroke-dasharray="14 10"/>
  <path d="M120 760 A440 440 0 0 1 330 420" stroke="#ffd166" stroke-width="12" fill="none" stroke-linecap="round" marker-end="url(#arrow)"/>
  <path d="M960 1040 A440 440 0 0 1 750 1380" stroke="#ffd166" stroke-width="12" fill="none" stroke-linecap="round" marker-end="url(#arrow)"/>
  ${T(170, 560, "180°", { size: 64, weight: 900, fill: "#ffd166", filter: "txtShadow" })}
  ${heading("ในอวกาศ ไม่มีข้างบน-ข้างล่าง…", "In space, there's no up or down…", 1600)}`);

// finale: same globe framing and cone as panel 5, now flavored
function finale(moon) {
  const g = { ...g5, flavored: true };
  const px = f1(p5x), py = f1(p5y);
  return `${space()}
  <circle cx="540" cy="1100" r="620" fill="url(#heroGlow)"/>
  ${globe(540, 900, 430, g)}
  ${cone(px, py, 30, 46)}
  ${moon ? `<g transform="translate(0 -40)">
    <circle cx="540" cy="430" r="150" fill="url(#moonGlow)"/>
    <path d="M548 372 C560 330 600 306 660 300" stroke="#3f8f45" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M630 306 C668 270 728 276 744 312 C702 326 656 326 630 306 Z" fill="#62b85a"/>
    <circle cx="540" cy="430" r="78" fill="url(#moonGrad)"/>
    <circle cx="512" cy="408" r="15" fill="#c9c6d6"/><circle cx="566" cy="452" r="11" fill="#c9c6d6"/><circle cx="562" cy="400" r="7" fill="#c9c6d6"/>
    <ellipse cx="510" cy="398" rx="22" ry="12" fill="#fff" opacity=".6"/></g>
    <g transform="translate(860 520) rotate(10)"><path d="M0 -90 L22 -34 L82 -40 L36 0 L70 52 L12 30 L-16 86 L-24 26 L-84 30 L-40 -6 L-70 -60 L-14 -34 Z" fill="#ff9ad5"/>${T(0, 18, "ป๊อป!", { size: 56, weight: 900, fill: "#fff", stroke: "#2b2350", sw: 8 })}</g>`
    : `<g stroke="#ffd166" stroke-width="9" stroke-linecap="round" opacity=".9">
      <path d="M${px - 50} ${py + 6} l-60 -6 M${px - 44} ${py + 36} l-56 14 M${px + 50} ${py + 6} l60 -6 M${px + 44} ${py + 36} l56 14"/></g>`}
  ${T(540, moon ? 170 : 250, "ไอศกรีมโลก", { size: 140, weight: 900, fill: "url(#gold)", stroke: "#2b2350", sw: 18, filter: "softShadow" })}
  ${T(540, moon ? 232 : 316, "EARTH ICE CREAM", { size: 44, weight: 700, fill: "#fff", filter: "txtShadow" })}`;
}
P.push(finale(false));
P.push(finale(true));

const NOTES = [
  ["0–2 วิ", "มุมมองบุคคลที่หนึ่ง กลางทุ่งน้ำแข็งยามแดดอ่อน ออโรราบนฟ้า เสาขั้วโลกใต้ เพนกวินยืนข้าง ๆ", "เสียงลมหนาว"],
  ["2–5 วิ", "มือถุงมือไหมพรมหยิบโคนเปล่าขึ้นมา เพนกวินหันมามอง", "เสียงซิป · วิ้ง"],
  ["5–8 วิ", "คว่ำโคนเอาปากกว้างลงพื้น กดเบา ๆ หิมะกระเซ็น เพนกวินเอียงคอ “?”", "“แกร๊บ!” · ค้างให้สงสัย"],
  ["8–11 วิ", "กล้องพุ่งถอยขึ้นอวกาศ เห็นโลกโดยขั้วใต้อยู่ด้านบน โคนจิ๋วชี้ขึ้น", "เสียงวู้บ · ดนตรีเข้า"],
  ["11–14 วิ", "กล้องหมุน 180° ขั้วใต้ลงล่าง โคนอยู่ใต้โลกพอดี", "จังหวะเฉลย “อ๋อ”"],
  ["14–17 วิ", "โลกกลายเป็นไอศกรีมบนโคนจิ๋ว ทะเลเป็นบลูฮาวาย ทวีปเป็นชาเขียว แอนตาร์กติกาเป็นวานิลลา", "ดนตรีพีค"],
  ["17–19 วิ", "ดวงจันทร์ลอยมาเป็นเชอร์รี่บนยอด แล้วตัดจบ", "“ป๊อป!”"],
];


const PW = 300, PH = 533, GAP = 30, COLS = 4;
const SHEET_W = COLS * PW + (COLS + 1) * GAP;
const SHEET_H = 1590;
const fontCss = ["Regular:400", "Medium:500", "SemiBold:600", "Bold:700", "ExtraBold:800", "Black:900"]
  .map((f) => { const [n, w] = f.split(":"); return `@font-face{font-family:Kanit;font-weight:${w};font-display:block;src:url("/bang-dubai/assets/fonts/Kanit-${n}.ttf") format("truetype")}`; }).join("\n");

const html = `<!doctype html><html lang="th"><head><meta charset="UTF-8"><style>
${fontCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${SHEET_W}px;height:${SHEET_H}px;overflow:hidden;background:#14122e;font-family:Kanit,sans-serif;color:#f4f0ff}
header{padding:28px ${GAP}px 4px;display:flex;align-items:baseline;gap:18px}
h1{font-size:40px;font-weight:800;background:linear-gradient(180deg,#fff6c2,#ffd166 55%,#f29b38);-webkit-background-clip:text;color:transparent}
.sub{font-size:18px;font-weight:500;color:#b9b2e0}
.grid{display:grid;grid-template-columns:repeat(${COLS},${PW}px);gap:22px ${GAP}px;padding:18px ${GAP}px}
.cell svg{display:block;width:${PW}px;height:${PH}px;border-radius:18px;box-shadow:0 10px 30px rgba(0,0,0,.45)}
.num{display:flex;align-items:center;gap:10px;margin-top:12px;font-size:16px;font-weight:600;color:#ffd166}
.num b{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#ffd166;color:#14122e;font-size:17px;font-weight:800}
.d{font-size:15.5px;font-weight:400;line-height:1.4;margin-top:6px;color:#ece8ff}
.s{font-size:14.5px;font-weight:500;color:#9d96c8;margin-top:4px}
.legend{background:#1f1c45;border-radius:18px;padding:22px 22px;height:${PH}px;font-size:16px;line-height:1.55;color:#d6d0f5}
.legend h3{font-size:19px;font-weight:700;color:#ffd166;margin-bottom:6px}
.legend .sw{display:inline-block;width:14px;height:14px;border-radius:4px;vertical-align:-1px;margin-right:6px}
.legend p{margin-bottom:14px}
</style></head><body>${DEFS}
<header><h1>ไอศกรีมโลก</h1><div class="sub">สตอรีบอร์ด ร่าง v2 · คลิปมุกภาพ 9:16 · ~19 วินาที · ดนตรี + เสียงประกอบ ไม่มีเสียงพากย์</div></header>
<div class="grid">
${P.map((body, i) => `<div class="cell"><svg viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">${body}</svg>
<div class="num"><b>${i + 1}</b>${NOTES[i][0]}</div><div class="d">${NOTES[i][1]}</div><div class="s">♪ ${NOTES[i][2]}</div></div>`).join("\n")}
<div class="cell"><div class="legend">
<h3>โทนสี</h3>
<p>ขั้วโลก: แดดเย็นพาสเทล + ออโรรา<br>อวกาศ: กรมท่า-ม่วง มีเนบิวลาชมพู/ฟ้า</p>
<h3>รสไอศกรีม</h3>
<p><span class="sw" style="background:#5cc9f5"></span>ทะเล = บลูฮาวาย<br><span class="sw" style="background:#a9dc6c"></span>ทวีป = ชาเขียว<br><span class="sw" style="background:#fff6df"></span>แอนตาร์กติกา = วานิลลา<br><span class="sw" style="background:#ff9ad5"></span>เม็ดโรยหลากสี</p>
<h3>จุดสำคัญ</h3>
<p>ช่อง 3 = จุดชวนสงสัย<br>ช่อง 5 = จุดเฉลย</p>
</div></div>
</div></body></html>`;

mkdirSync(join(proj, "storyboard"), { recursive: true });
writeFileSync(join(proj, "storyboard", "storyboard.html"), html);

// ---------- screenshot ----------
const MIME = { ".html": "text/html; charset=utf-8", ".ttf": "font/ttf" };
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  const p = join(repo, url.replace(/^\//, ""));
  if (!p.startsWith(repo) || !existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "Content-Type": MIME[extname(p)] || "application/octet-stream" });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = [process.env.CHROME, "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome-stable"].filter(Boolean).find((p) => existsSync(p));
if (!browser) throw new Error("no Chrome/Edge found; set CHROME");
mkdirSync(join(proj, "renders"), { recursive: true });
const dest = join(proj, "renders", "storyboard.png");
rmSync(dest, { force: true });
await new Promise((resolve, reject) => {
  const p = spawn(browser, [`--user-data-dir=${join(tmpdir(), "ice-cream-earth-profile")}`, "--no-first-run",
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    "--virtual-time-budget=5000", "--run-all-compositor-stages-before-draw",
    `--window-size=${SHEET_W},${SHEET_H}`, `--screenshot=${dest}`,
    `http://127.0.0.1:${server.address().port}/ice-cream-earth/storyboard/storyboard.html`], { stdio: ["ignore", "pipe", "pipe"] });
  let err = ""; p.stderr.on("data", (d) => { err += d; });
  p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(err || "browser exit " + code))));
});
// On Windows the launcher can exit before its child has written the file.
for (let i = 0; i < 60 && !existsSync(dest); i++) await new Promise((r) => setTimeout(r, 250));
server.close();
if (!existsSync(dest)) throw new Error("screenshot not written: " + dest);
console.log("storyboard", dest, statSync(dest).size, "bytes");
