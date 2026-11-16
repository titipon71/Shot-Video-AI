// TikTok cover, 3:4 portrait (1080x1440). Builds cover/cover.html from the scene kit,
// then screenshots it with headless Chrome/Edge to renders/cover-tiktok-3x4.png.
// Browser path: env CHROME, else common Windows/Linux locations.
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { presets } from "../../shared/flat-people/index.mjs";
import { placeChar, txt, asokBg, oilGeyser, vehicle, FONT_CSS } from "../compositions/components/kit.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const W = 1080, H = 1440;
// Scenes are drawn on the 1080x1920 canvas; the cover shows the band y = CROP_Y .. CROP_Y + 1440.
const CROP_Y = 380;

const cars = [
  ["sedan", 150, 1290, { color: "#c8282f", scale: 0.75, rot: -16 }],
  ["taxi", 330, 1300, { color: "#f0c14a", stripe: "#3dca6a", scale: 0.72, rot: 12 }],
  ["sedan", 860, 1290, { color: "#2b6ea8", scale: 0.74, rot: 10, flip: true }],
  ["bus", 980, 1340, { color: "#e8893a", scale: 0.6, rot: -4 }],
  ["moto", 760, 1420, { color: "#f26a1b", scale: 1, rot: -24 }],
].map(([k, x, y, o]) => vehicle(k, x, y, o)).join("");

const body = `
  ${asokBg({ time: "morning", prefix: "cv", trainX: 200 })}
  ${cars}
  ${oilGeyser({ x: 540, y: 1660, h: 860, prefix: "cvoil" })}
  <ellipse cx="540" cy="1640" rx="300" ry="70" fill="#c8b898" opacity=".35"/>

  <!-- people -->
  ${placeChar({ ...presets.influencer, id: "cvinf", expression: "smile", armL: 16, armR: 155, holdR: "selfie" }, 130, 1800, 1.0)}
  ${placeChar({ ...presets.officeMale, id: "cvom", expression: "shocked", armL: 75, armR: 75 }, 300, 1810, 0.95)}
  ${placeChar({ ...presets.officeFemale, id: "cvof", expression: "shocked", armL: 140, armR: 20, holdL: "phone" }, 780, 1805, 0.92)}
  ${placeChar({ ...presets.businessGulf, id: "cvgulf", expression: "smile", keffiyehAccent: "#c8b8a8", armL: 12, armR: 10, holdL: "briefcase" }, 950, 1800, 0.98)}

  <!-- title block: dark scrim so the type reads over the sky -->
  <rect x="0" y="${CROP_Y}" width="${W}" height="440" fill="url(#cv-scrim)"/>
  <g transform="rotate(-3 540 500)">
    <rect x="130" y="448" width="820" height="96" rx="16" fill="#c8282f" stroke="#1a0e06" stroke-width="6"/>
    ${txt(540, 515, "ถ้าน้ำมันดิบพุ่งกลางอโศก…", { size: 56, weight: 800, fill: "#fff" })}
  </g>
  ${txt(540, 760, "บางดูไบ", { size: 210, weight: 900, fill: "url(#cv-gold)", stroke: "#1a0e06", sw: 18 })}

  <!-- hook sticker -->
  <g transform="translate(800 1010) rotate(6)">
    <rect x="-200" y="-56" width="400" height="112" rx="20" fill="#f0c14a" stroke="#1a0e06" stroke-width="6"/>
    ${txt(0, -6, "1 ปีต่อมา", { size: 34, weight: 700, fill: "#1a0e06" })}
    ${txt(0, 38, "จะเป็นยังไง?", { size: 40, weight: 900, fill: "#8e1d24" })}
  </g>
`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${CROP_Y} ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="cv-scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a0e06" stop-opacity=".55"/><stop offset="1" stop-color="#1a0e06" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="cv-gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#f0c14a"/><stop offset="1" stop-color="#c88a1a"/>
    </linearGradient>
    <radialGradient id="cv-vig" cx="50%" cy="50%" r="75%">
      <stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/>
    </radialGradient>
  </defs>
  ${body}
  <rect x="0" y="${CROP_Y}" width="${W}" height="${H}" fill="url(#cv-vig)"/>
</svg>`;

const html = `<!doctype html>
<html lang="th"><head><meta charset="UTF-8" />
<style>${FONT_CSS}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #0c0806; }
  svg { display: block; }
</style></head>
<body>${svg}</body></html>`;

mkdirSync(join(root, "cover"), { recursive: true });
writeFileSync(join(root, "cover", "cover.html"), html);

// --- screenshot ---
const MIME = { ".html": "text/html; charset=utf-8", ".ttf": "font/ttf", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  const p = join(root, url.replace(/^\//, ""));
  if (!p.startsWith(root) || !existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "Content-Type": MIME[extname(p)] || "application/octet-stream" });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));

const candidates = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome-stable",
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) throw new Error("no Chrome/Edge found; set CHROME");

mkdirSync(join(root, "renders"), { recursive: true });
const dest = join(root, "renders", "cover-tiktok-3x4.png");
rmSync(dest, { force: true });
await new Promise((resolve, reject) => {
  const p = spawn(browser, [
    // own profile dir: otherwise a running Edge/Chrome swallows the call and no file is written
    `--user-data-dir=${join(tmpdir(), "bang-dubai-cover-profile")}`, "--no-first-run",
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    "--default-background-color=FF0C0806", "--font-render-hinting=none", "--virtual-time-budget=5000",
    "--run-all-compositor-stages-before-draw", `--window-size=${W},${H}`, `--screenshot=${dest}`,
    `http://127.0.0.1:${server.address().port}/cover/cover.html`,
  ], { stdio: ["ignore", "pipe", "pipe"] });
  let err = ""; p.stderr.on("data", (d) => { err += d; });
  p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(err || "browser exit " + code))));
});
// On Windows the launcher process can exit before its child has written the file.
for (let i = 0; i < 60 && !existsSync(dest); i++) await new Promise((r) => setTimeout(r, 250));
if (!existsSync(dest)) throw new Error("screenshot not written: " + dest);
server.close();
console.log("cover", dest, statSync(dest).size, "bytes");
