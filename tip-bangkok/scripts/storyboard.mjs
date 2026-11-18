// ถ้ากรุงเทพฯ มีระบบทิปแบบอเมริกา — 8-panel storyboard sheet (draft v1).
// Builds storyboard/storyboard.html (each panel is a 1080x1920 SVG shown small) and
// screenshots it with headless Chrome/Edge to renders/storyboard.png. Fonts come from ../bang-dubai/assets/fonts.
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from "node:fs";
import { extname, join } from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import {
  proj, repo, f1, placeChar, txt, asokBg, vehicle, presets,
  tipScreen, tipBadge, tipCounter, bubble, comic, heading, coin,
  cafeBg, cafeCounter, storeFront, storeCounter, curryShopFront, hiringBoard, shophouseBg, kapraoPlate, diningTable, stool, condiments, btsGate, atm, phone, bedroomBg, piggy, SHEET_DEFS,
} from "./draw.mjs";

const you = (x, feet, s, o = {}) => placeChar({ ...presets.officeMale, id: o.id || `you${x}`, expression: "worried", armL: 10, armR: 10, ...o }, x, feet, s);
const dim = `<rect width="1080" height="1920" fill="url(#dim)"/>`;
const stare = (x, y) => `<g stroke="#c8282f" stroke-width="7" stroke-linecap="round" opacity=".85"><path d="M${x} ${y} l-70 40 M${x + 10} ${y + 30} l-80 30 M${x + 6} ${y - 30} l-60 20"/></g>`;

const P = [];
const sweat = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#7ec8ff" stroke="#1a1208" stroke-width="3"><path d="M0 -26 Q16 0 0 12 Q-16 0 0 -26 Z"/></g>`;

// 1 — hook
P.push(`${asokBg({ time: "morning", prefix: "a1", trainX: 200 })}${dim}
  <circle cx="540" cy="840" r="480" fill="url(#spot)"/>
  ${tipScreen(540, 860, 1.85, { pick: -1 })}
  ${placeChar({ ...presets.officeFemale, id: "p1a", expression: "shocked", armL: 150, armR: 20, holdL: "phone" }, 130, 1960, 1.3)}
  ${placeChar({ ...presets.auntie, id: "p1d", expression: "shocked", holdR: "", armL: 40, armR: 40 }, 950, 1960, 1.25)}
  ${placeChar({ ...presets.winMale, id: "p1c", expression: "smirk", holdR: "" }, 740, 1990, 1.35)}
  ${you(370, 2010, 1.45, { id: "p1b", expression: "shocked", armL: 60, armR: 60 })}
  ${heading(["ถ้ากรุงเทพฯ ใช้", "ระบบทิปแบบอเมริกา"], { y: 200, size: 84 })}`);

// 2 — ทิป 10% coffee
P.push(`${cafeBg()}
  ${placeChar({ gender: "female", id: "p2b", hair: "pony", shirtColor: "#5a3a2a", accent: "#f4efe6", expression: "smile", armL: 30, armR: 60 }, 800, 1700, 1.45)}
  ${cafeCounter()}
  ${tipScreen(450, 1180, 0.82, { rot: -6 })}
  ${txt(450, 1020, "อเมริกาโน่ ฿55", { size: 42, weight: 900, fill: "#1a1208" })}
  ${you(220, 2060, 1.6, { id: "p2y", armR: 40 })}
  ${sweat(330, 1310, 1.4)}
  ${placeChar({ gender: "female", id: "p2q1", hair: "long", shirtColor: "#e07a9a", expression: "fierce" }, 760, 2120, 1.55)}
  ${placeChar({ gender: "male", id: "p2q2", hair: "short", shirtColor: "#3d6a45", expression: "angry" }, 980, 2140, 1.6)}
  ${stare(620, 1450)}
  ${comic(860, 1300, "จ้อง…", 84, "#ffffff", 6)}
  ${tipCounter(11, { x: 880, y: 410 })}
  ${tipBadge(10, "กาแฟแก้วแรก")}`);

// 3 — ทิป 15% motorbike taxi
P.push(`${asokBg({ time: "day", prefix: "a3", trainX: 520 })}
  ${placeChar({ ...presets.winMale, id: "p3w", expression: "smirk", holdR: "", armL: 20, armR: 120 }, 900, 1700, 1.45)}
  ${vehicle("moto", 600, 1700, { color: "#f26a1b", scale: 7.5 })}
  <path d="M640 1600 L560 1360" stroke="#2a2a30" stroke-width="12"/>
  ${tipScreen(540, 1210, 0.8, { title: "ทิปขั้นต่ำ 15%", opts: ["15%", "20%", "ซิ่ง+5%"], pick: 2, rot: 4 })}
  ${you(210, 2000, 1.5, { id: "p3y", holdL: "briefcase" })}
  ${sweat(330, 1300, 1.3)}
  ${comic(820, 960, "ซิ่ง!", 100, "#ffd166", 8)}
  ${tipCounter(24, { x: 880, y: 410 })}
  ${tipBadge(15, "วินมอเตอร์ไซค์")}`);

// 4 — ทิป 18% made-to-order kaprao: the egg adds money AND tip, choosing how it's cooked adds more tip
const egg = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 -4 Q-34 -26 -8 -24 Q10 -34 26 -18 Q40 -4 24 12 Q6 24 -14 16 Q-36 12 -30 -4 Z" fill="#fff"/><circle cx="-2" cy="-4" r="11" fill="#f6a623"/></g>`;
const pill = (x, y, label, on) => `<rect x="${x - 78}" y="${y - 28}" width="156" height="50" rx="25" fill="${on ? "#f6a623" : "#ffffff"}" stroke="${on ? "#c98a3a" : "#d9d2c8"}" stroke-width="4"/>${txt(x, y + 8, label, { size: 28, weight: 800, fill: on ? "#fff" : "#7a6a5a" })}`;
const menuCard = `<g transform="translate(395 690) scale(.72)" filter="url(#tbShadow)">
  <rect x="-470" y="-190" width="940" height="460" rx="18" fill="#ffe066" stroke="#c8282f" stroke-width="14"/>
  ${txt(-420, -110, "กะเพราหมูสับ", { size: 54, weight: 900, fill: "#1a1208", anchor: "start" })}
  ${txt(150, -110, "฿50", { size: 50, weight: 900, fill: "#1a1208", anchor: "end" })}${txt(430, -110, "ทิป 18%", { size: 44, weight: 900, fill: "#c8282f", anchor: "end" })}
  ${egg(-385, -18, 1.1)}${txt(-335, -2, "+ ไข่ดาว", { size: 46, weight: 800, fill: "#1a1208", anchor: "start" })}
  ${txt(150, -2, "+฿10", { size: 46, weight: 900, fill: "#1a1208", anchor: "end" })}${txt(430, -2, "+5%", { size: 44, weight: 900, fill: "#c8282f", anchor: "end" })}
  ${txt(-420, 84, "เลือกความสุกไข่", { size: 42, weight: 800, fill: "#1a1208", anchor: "start" })}${txt(430, 84, "+5%", { size: 44, weight: 900, fill: "#c8282f", anchor: "end" })}
  ${pill(-320, 150, "ไม่สุก", false)}${pill(-150, 150, "ยางมะตูม", true)}${pill(20, 150, "สุก", false)}
  <path d="M-430 200 L430 200" stroke="#1a1208" stroke-width="3" stroke-dasharray="10 8" opacity=".4"/>
  ${txt(430, 250, "รวมทิป 28%", { size: 46, weight: 900, fill: "#c8282f", anchor: "end" })}
</g>`;
P.push(`${shophouseBg()}
  ${menuCard}
  ${placeChar({ ...presets.vendorFemale, id: "p4v", expression: "smile", armL: 60, armR: 30 }, 790, 1440, 1.3)}
  <rect x="480" y="1150" width="600" height="330" fill="#b9c1c8"/><rect x="480" y="1470" width="600" height="14" fill="#8a939a"/><rect x="480" y="1140" width="600" height="20" rx="6" fill="#dfe4e8"/>
  ${you(320, 1990, 1.45, { id: "p4y", expression: "shocked", armL: 30, armR: 100 })}
  ${diningTable(540, 1560, 780)}
  ${condiments(470, 1560)}
  ${kapraoPlate(660, 1540, 1.05)}
  <path d="M860 1560 L870 1500" stroke="#3a3a42" stroke-width="10"/>
  ${tipScreen(870, 1430, 0.5, { title: "ทิปไหมจ๊ะ?", opts: ["18%", "23%", "28%"], pick: 2, rot: 4 })}
  ${stool(200, 1850, 0.9)}${stool(880, 1850, 0.9)}
  ${comic(330, 1150, "ไข่ดาวด้วย!", 70, "#ffd166", -6)}
  ${tipCounter(41, { x: 880, y: 410 })}
  ${tipBadge(18, "ร้านอาหารตามสั่ง")}`);

// 5 — ทิป 20% convenience store
P.push(`${storeFront()}
  ${placeChar({ gender: "female", id: "p5c", hair: "bob", shirtColor: "#1f7a8c", accent: "#f28c28", expression: "smile", armL: 30, armR: 140 }, 840, 1720, 1.45)}
  ${storeCounter()}
  ${tipScreen(420, 1200, 0.75, { title: "ทิปไหมคะ?", opts: ["20%", "25%", "30%"], pick: 0, rot: -4 })}
  ${bubble(720, 1000, "สวัสดีค่ะ (+5%)", { w: 470, size: 46, tail: "right" })}
  ${you(250, 2060, 1.55, { id: "p5y", expression: "shocked", holdR: "bottle", armR: 60 })}
  ${txt(780, 1560, "น้ำ ฿10 + ทิป ฿2", { size: 52, weight: 900, fill: "#c8282f" })}
  ${tipCounter(45, { x: 880, y: 1810 })}
  ${tipBadge(20, "ร้านสะดวกซื้อ")}`);

// 6 — ทิป 25% the whole city
const appInner = `${txt(0, -130, "สั่งอาหาร", { size: 30, weight: 800, fill: "#1a1208" })}
  <rect x="-80" y="-104" width="160" height="70" rx="12" fill="#f0e6d8"/>${txt(0, -60, "(ยังไม่ได้เลือก)", { size: 20, weight: 600, fill: "#9a8a7a" })}
  ${txt(0, 0, "ทิปไรเดอร์ก่อนสั่ง", { size: 24, weight: 800, fill: "#1a1208" })}
  ${["20%", "25%", "30%"].map((o, i) => `<rect x="${-84 + i * 58}" y="22" width="52" height="46" rx="10" fill="${i === 1 ? "#2fa36b" : "#fff"}" stroke="#d9d2c8" stroke-width="3"/>${txt(-58 + i * 58, 54, o, { size: 18, weight: 900, fill: i === 1 ? "#fff" : "#1a1208" })}`).join("")}`;
P.push(`${asokBg({ time: "day", prefix: "a6", trainX: 300 })}<rect width="1080" height="1920" fill="#1a1208" opacity=".3"/>
  ${btsGate(250, 1180, 1.3)}
  ${tipScreen(250, 900, 0.62, { title: "แตะบัตร… ทิปไหม?", pick: 2 })}
  ${txt(250, 1500, "ประตูรถไฟฟ้า", { size: 46, weight: 900, fill: "#fff", stroke: "#1a1208", sw: 9 })}
  ${atm(810, 1100, 1.05)}
  ${tipScreen(810, 980, 0.5, { title: "ทิปตู้ ATM?", pick: 1 })}
  ${txt(810, 1390, "ตู้ ATM", { size: 46, weight: 900, fill: "#fff", stroke: "#1a1208", sw: 9 })}
  ${phone(540, 1640, 1.15, -6, appInner)}
  ${txt(840, 1700, "แอปส่งอาหาร", { size: 46, weight: 900, fill: "#fff", stroke: "#1a1208", sw: 9 })}
  ${tipCounter(180, { x: 880, y: 410 })}
  ${tipBadge(25, "ทั้งเมืองขอทิป")}`);

// 7 — ทิป 30% life changes: service jobs get rich, the office worker quits to queue as a waiter
// apron drawn over a placed flat-person (frame 200x530, feet at local (100, 520), scaled about the feet)
const apron = (x, feet, s) => {
  const P2 = (lx, ly) => `${f1(x + (lx - 100) * s)} ${f1(feet + (ly - 520) * s)}`;
  return `<path d="M${P2(76, 262)} L${P2(124, 262)} L${P2(140, 440)} L${P2(60, 440)} Z" fill="#fff8ec" stroke="#d9d2c8" stroke-width="3"/>
    <path d="M${P2(80, 262)} Q${P2(100, 236)} ${P2(120, 262)}" fill="none" stroke="#fff8ec" stroke-width="${f1(6 * s)}"/>
    <rect x="${f1(x - 18 * s)}" y="${f1(feet + (330 - 520) * s)}" width="${f1(36 * s)}" height="${f1(26 * s)}" rx="${f1(4 * s)}" fill="#e9dcc4"/>`;
};
// waiter outfit for the hero after quitting: white shirt, black trousers, no tie or ID badge, apron + bow tie
const WAITER = { outfit: "shirt", shirtColor: "#fbf8f2", accent: "#e9e2d6", pantsColor: "#1c1c22", necktie: "", lanyard: "" };
const bowTie = (x, feet, s) => {
  const P2 = (lx, ly) => `${f1(x + (lx - 100) * s)} ${f1(feet + (ly - 520) * s)}`;
  return `<path d="M${P2(100, 250)} L${P2(84, 240)} L${P2(84, 262)} Z M${P2(100, 250)} L${P2(116, 240)} L${P2(116, 262)} Z" fill="#1c1c22"/><circle cx="${f1(x)}" cy="${f1(feet + (250 - 520) * s)}" r="${f1(4 * s)}" fill="#1c1c22"/>`;
};
const queue = [[560, 1545, 0.82, "#5bb3c9", "female"], [690, 1565, 0.88, "#3d6a45", "male"], [820, 1585, 0.94, "#e07a9a", "female"], [950, 1610, 1.0, "#f0c14a", "male"]]
  .map(([x, feet, s, c, g], i) => placeChar({ gender: g, id: `p7q${i}`, hair: g === "female" ? "pony" : "short", shirtColor: c, expression: "neutral", armL: 6, armR: 6 }, x, feet, s)).join("");
P.push(`${curryShopFront()}
  ${placeChar({ ...presets.auntie, id: "p7a", expression: "smirk", holdR: "", armL: 150, armR: 12 }, 230, 1470, 1.0)}
  ${comic(240, 990, "ป้าข้าวแกง", 64, "#ffd166", -4)}
  ${hiringBoard(410, 1220, 0.82)}
  ${queue}
  ${vehicle("supercar", 260, 1790, { color: "#f0c14a", scale: 3.4 })}
  ${you(800, 2010, 1.45, { id: "p7y", expression: "smile", necktie: "", lanyard: "", armL: 8, armR: 8 })}
  ${apron(800, 2010, 1.45)}
  ${comic(500, 1720, "ลาออก!", 80, "#ffffff", -8)}
  ${tipCounter(460, { x: 880, y: 410 })}
  ${tipBadge(30, "ชีวิตเปลี่ยน")}`);

// 8 — ending: digital piggy bank asks for a tip
const pigScreen = `${txt(0, -42, "ทิปไหมคะ?", { size: 40, weight: 900, fill: "#ffffff" })}
  ${["18%", "20%", "25%"].map((o, i) => `<rect x="${-120 + i * 82}" y="-8" width="74" height="60" rx="12" fill="${i === 1 ? "#2fa36b" : "#24343f"}" stroke="#5ad0a0" stroke-width="3"/>${txt(-83 + i * 82, 32, o, { size: 26, weight: 900, fill: "#fff" })}`).join("")}`;
P.push(`${bedroomBg()}
  ${piggy(620, 1180, 1.05, { screen: pigScreen })}
  ${coin(632, 930, 32)}
  <path d="M632 840 L632 885" stroke="#fff" stroke-width="6" stroke-dasharray="8 8" opacity=".6"/>
  ${comic(900, 900, "ติ๊ง!", 96, "#7ef0c0", 8)}
  ${you(230, 2040, 1.55, { id: "p8y", expression: "shocked", armR: 70, ...WAITER })}
  ${apron(230, 2040, 1.55)}${bowTie(230, 2040, 1.55)}
  ${bubble(600, 660, "…ทิปไหมคะ?", { w: 440, size: 52, tail: "center" })}
  ${heading(["หยอดกระปุก", "เก็บไว้เดือนหน้า…"], { y: 230, size: 76 })}`);

const NOTES = [
  ["0–7 วิ", "บทเปิด: เช้าที่อโศก จอทิปยักษ์ลอยกลางเมือง ทุกคนเงยหน้าตกใจ", "“ถ้าวันหนึ่ง กรุงเทพฯ ใช้ระบบทิปแบบอเมริกา…”"],
  ["7–18 วิ", "อเมริกาโน่ 55 บาท บาริสต้าหันจอมา คิวข้างหลังจ้อง สุดท้ายกด 20%", "เสียง “ติ๊ด” · มุก “คนข้างหลังจ้อง”"],
  ["18–29 วิ", "พี่วินมีจอทิปติดแฮนด์ ทิปขั้นต่ำ 15% อยากถึงเร็วเพิ่ม 5", "เสียงบิดคันเร่ง"],
  ["29–40 วิ", "ร้านตามสั่ง: กะเพราหมูสับ 50 บาท ทิป 18% เพิ่มไข่ดาว +10 บาท +5% เลือกความสุกไข่ +อีก 5% รวมทิป 28%", "เสียงตะหลิวกระทะ · ไข่ดาวฉ่า"],
  ["40–51 วิ", "น้ำ 10 บาท ทิป 2 บาท พนักงานพูดสวัสดีค่ะ บวกอีก 5%", "เสียงประตูร้าน · สแกนบาร์โค้ด"],
  ["51–62 วิ", "ประตูรถไฟฟ้า ตู้ ATM แอปส่งอาหาร… ทุกอย่างขอทิป", "จอทิปเด้งรัว ๆ"],
  ["62–73 วิ", "อาชีพบริการรวยจากทิป ป้าข้าวแกงขับซูเปอร์คาร์ ส่วนพนักงานออฟฟิศลาออกไปต่อคิวสมัครเป็นเด็กเสิร์ฟร้านป้า", "เสียงเครื่องยนต์ซูเปอร์คาร์ · “ลาออก!”"],
  ["73–85 วิ", "เลิกงานเสิร์ฟกลับถึงห้อง ได้ทิปมาไม่กี่เหรียญ หยอดลงกระปุกดิจิตอล… จอขึ้น 18 / 20 / 25%", "“ติ๊ง!” · “…ทิปไหมคะ?” · ตัดจบ"],
];

const PW = 300, PH = 533, GAP = 30, COLS = 4;
const SHEET_W = COLS * PW + (COLS + 1) * GAP;
const SHEET_H = 1500;
const fontCss = ["Regular:400", "Medium:500", "SemiBold:600", "Bold:700", "ExtraBold:800", "Black:900"]
  .map((f) => { const [n, w] = f.split(":"); return `@font-face{font-family:Kanit;font-weight:${w};font-display:block;src:url("/bang-dubai/assets/fonts/Kanit-${n}.ttf") format("truetype")}`; }).join("\n");

const html = `<!doctype html><html lang="th"><head><meta charset="UTF-8"><style>
${fontCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${SHEET_W}px;height:${SHEET_H}px;overflow:hidden;background:#1a1208;font-family:Kanit,sans-serif;color:#f7efe2}
header{padding:28px ${GAP}px 4px;display:flex;align-items:baseline;gap:18px}
h1{font-size:40px;font-weight:800;color:#ffd166}
.sub{font-size:18px;font-weight:500;color:#d8c3a8}
.grid{display:grid;grid-template-columns:repeat(${COLS},${PW}px);gap:22px ${GAP}px;padding:18px ${GAP}px}
.cell svg{display:block;width:${PW}px;height:${PH}px;border-radius:18px;box-shadow:0 10px 30px rgba(0,0,0,.5);border:2px solid #3a2a18}
.num{display:flex;align-items:center;gap:10px;margin-top:12px;font-size:16px;font-weight:600;color:#ffd166}
.num b{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#ffd166;color:#1a1208;font-size:17px;font-weight:800}
.d{font-size:15.5px;font-weight:400;line-height:1.4;margin-top:6px;color:#f7efe2}
.s{font-size:14.5px;font-weight:500;color:#c8b090;margin-top:4px}
</style></head><body>${SHEET_DEFS}
<header><h1>ถ้ากรุงเทพฯ มีระบบทิปแบบอเมริกา</h1><div class="sub">สตอรีบอร์ด ร่าง v1 · 9:16 · ~85 วินาที · เสียงพากย์ + ซับไทย สไตล์บางดูไบ</div></header>
<div class="grid">
${P.map((body, i) => `<div class="cell"><svg viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">${body}</svg>
<div class="num"><b>${i + 1}</b>${NOTES[i][0]}</div><div class="d">${NOTES[i][1]}</div><div class="s">♪ ${NOTES[i][2]}</div></div>`).join("\n")}
</div></body></html>`;

mkdirSync(join(proj, "storyboard"), { recursive: true });
writeFileSync(join(proj, "storyboard", "storyboard.html"), html);

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
const dest = join(proj, "renders", "storyboard.png");
rmSync(dest, { force: true });
await new Promise((resolve, reject) => {
  const p = spawn(browser, [`--user-data-dir=${join(tmpdir(), "tip-bangkok-profile")}`, "--no-first-run",
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    "--virtual-time-budget=5000", "--run-all-compositor-stages-before-draw",
    `--window-size=${SHEET_W},${SHEET_H}`, `--screenshot=${dest}`,
    `http://127.0.0.1:${server.address().port}/tip-bangkok/storyboard/storyboard.html`], { stdio: ["ignore", "pipe", "pipe"] });
  let err = ""; p.stderr.on("data", (d) => { err += d; });
  p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(err || "browser exit " + code))));
});
for (let i = 0; i < 60 && !existsSync(dest); i++) await new Promise((r) => setTimeout(r, 250));
server.close();
if (!existsSync(dest)) throw new Error("screenshot not written: " + dest);
console.log("storyboard", dest, statSync(dest).size, "bytes");
