// Build the animated bang-dubai video: 8 scene compositions + fx + subtitles + index.html + SRT.
// Voice: assets/voice/voice-tight.wav (option A). Line timings: assets/voice/lines-tight.json.
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scene0, scene1, scene2, scene3 } from "./video/scenes-a.mjs";
import { scene4, scene5, scene6, scene7 } from "./video/scenes-b.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const RUNTIME = readFileSync(join(root, "scripts/video/runtime.js"), "utf8");
const lines = JSON.parse(readFileSync(join(root, "assets/voice/lines-tight.json"), "utf8"));

export const BOUNDS = [0, 12.017, 26.042, 39.629, 53.937, 68.426, 83.441, 91.143];
export const VOICE_END = 96.663;
export const TOTAL = 98.0;
const FNS = [scene0, scene1, scene2, scene3, scene4, scene5, scene6, scene7];

const FONT_CSS = `
@font-face { font-family: Kanit; font-weight: 600; font-display: block; src: url("assets/fonts/Kanit-SemiBold.ttf") format("truetype"); }
@font-face { font-family: Kanit; font-weight: 700; font-display: block; src: url("assets/fonts/Kanit-Bold.ttf") format("truetype"); }
@font-face { font-family: Kanit; font-weight: 800; font-display: block; src: url("assets/fonts/Kanit-ExtraBold.ttf") format("truetype"); }
@font-face { font-family: Kanit; font-weight: 900; font-display: block; src: url("assets/fonts/Kanit-Black.ttf") format("truetype"); }`;

mkdirSync(join(root, "compositions"), { recursive: true });
const clips = [];
for (let i = 0; i < 8; i++) {
  const start = BOUNDS[i], end = i < 7 ? BOUNDS[i + 1] : TOTAL, dur = +(end - start).toFixed(3);
  // local line times for this scene
  const L = {};
  for (const ln of lines) L[ln.id] = { s: Math.max(0, +(ln.start - start).toFixed(3)), e: +(ln.end - start).toFixed(3) };
  const sc = FNS[i](L, dur);
  const id = `scene-${i}`, p = `s${i}`;
  const ids = sc.reg.map((r) => r.id);
  const html = `<template>
  <style>
    ${FONT_CSS}
    #root { position: absolute; inset: 0; overflow: hidden; background: #0c0806; font-family: Kanit, sans-serif; }
    .clip, .io, .cam, .shk { position: absolute; inset: 0; }
    .io, .cam { transform-origin: 50% 50%; }
    svg.scene { position: absolute; inset: 0; width: 1080px; height: 1920px; overflow: hidden; }
  </style>
  <div data-hf-id="hf-${id}" id="root" data-composition-id="${id}" data-width="1080" data-height="1920" data-layout-allow-overflow data-layout-allow-overlap>
    <div data-hf-id="hf-${id}-clip" class="clip" data-start="0" data-duration="${dur}" data-track-index="1" data-hold>
      <div class="io" id="${p}-io"><div class="cam" id="${p}-cam"><div class="shk" id="${p}-shk">
        <svg class="scene" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
          <defs><radialGradient id="${p}-vig" cx="50%" cy="45%" r="72%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs>
          ${sc.svg}
          <rect x="0" y="0" width="1080" height="1920" fill="url(#${p}-vig)" pointer-events="none"/>
        </svg>
      </div></div></div>
    </div>
  </div>
  <script>
  (() => {
    const SCENE_DUR = ${dur};
    ${RUNTIME}
    ${sc.js}
    blinkAll(${JSON.stringify(ids)}, ${17 + i});
    sceneIO("#${p}-io", { in: ${i > 0}, out: ${!sc.noOut} });
    window.__timelines = window.__timelines || {};
    window.__timelines["${id}"] = tl;
  })();
  </script>
</template>
`;
  writeFileSync(join(root, "compositions", `${id}.html`), html);
  clips.push(`      <div data-hf-id="hf-clip-${id}" id="${id}" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${start}" data-duration="${dur}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>`);
  console.log("wrote", id, "dur", dur, "chars", ids.length);
}

// ---------------- Subtitles ----------------
// Cue text (corrected wording, numerals). Some short voice lines are merged into one cue.
const CUES = [
  [["L01"], "ในเช้าวันจันทร์ กลางแยกอโศกมนตรี"],
  [["L02"], "พื้นถนนปริแตก พร้อมน้ำมันดิบ|พุ่งสูงเท่าตึก 3 ชั้น"],
  [["L03"], "และนี่คือสิ่งที่|จะเกิดขึ้นต่อจากนั้น"],
  [["L04"], "1 ชั่วโมงแรก แตกตื่นและรถติดตำนาน"],
  [["L05"], "ตอนแรกนึกว่าท่อแตก"],
  [["L06"], "แต่เพราะกลิ่นกำมะถันฟุ้ง"],
  [["L07"], "แยกอโศกก็เป็นอัมพาต"],
  [["L08"], "อินฟลูแห่ไลฟ์สด น้ำพุโคล่ากลางกรุง"],
  [["L09"], "ส่วนรถติดยาวไปถึงบางนา"],
  [["L10"], "3 ชั่วโมงต่อมา"],
  [["L11"], "กองทัพแกลลอนและขอหวย"],
  [["L12"], "เพราะรู้ว่าเป็น|น้ำมันดิบเกรดพรีเมียม"],
  [["L13"], "ชาวบ้านและพี่วิน|แห่หิ้วถังมาตักกลับบ้าน"],
  [["L14"], "แถมมีคนจุดธูปขอหวย"],
  [["L15"], "จนเจ้าหน้าที่ต้องตะโกนห้าม"],
  [["L16"], "เพราะกลัวระเบิด"],
  [["L17"], "12 ชั่วโมงต่อมา"],
  [["L18"], "สื่อนอกบุกและที่ดินพุ่ง"],
  [["L19"], "สื่อนอกพาดหัว"],
  [["L20"], "“แบงค็อก เดอะ นิว ดูไบ”"],
  [["L21"], "เศรษฐีตะวันออกกลาง"],
  [["L22"], "บินมาขอซื้อที่ดิน ตารางวาละ 10 ล้าน"],
  [["L23", "L24"], "ส่วนร้านข้างทาง|เปลี่ยนชื่อเป็น"],
  [["L25"], "“ก๋วยเตี๋ยวเรือบ่อน้ำมัน”"],
  [["L26"], "3 วันต่อมา"],
  [["L27"], "แท่นขุดเจาะข้าง BTS"],
  [["L28"], "นักธรณีวิทยาทั่วโลก|งงเป็นไก่ตาแตก"],
  [["L29"], "รัฐบาลตั้งแท่นขุดเจาะ|ยักษ์กลางแยก"],
  [["L30"], "โดยมี BTS วิ่งเฉียดข้าง ๆ"],
  [["L31"], "กลายเป็นจุดเช็กอินใหม่|ของนักท่องเที่ยว"],
  [["L32"], "1 เดือนต่อมา"],
  [["L33", "L34"], "รถไฟฟ้าฟรี แต่รถติดกว่าเดิม"],
  [["L35"], "ไทยเข้ากลุ่ม OPEC+"],
  [["L36"], "รัฐให้ขึ้น BTS MRT ฟรี"],
  [["L37"], "และแจกคูปองน้ำมัน"],
  [["L38"], "คนกรุงเลยแห่ซื้อรถเพิ่ม"],
  [["L39"], "จนสุขุมวิทติดหนึบกว่าเดิม"],
  [["L40"], "แต่เปลี่ยนเป็น|ซูเปอร์คาร์ทั้งถนน"],
  [["L41"], "1 ปีต่อมา"],
  [["L42"], "ยินดีต้อนรับสู่บางดูไบ"],
  [["L43"], "ตุ๊กตุ๊กอัปเกรด|เป็นสีทองติดแอร์"],
  [["L44"], "ตึกสูงผุดขึ้นรอบอโศก"],
  [["L45"], "และมีอนุสาวรีย์|หัวเจาะน้ำมันทองคำ"],
  [["L46"], "ตั้งหน้าเทอร์มินอล 21"],
  [["L47"], "เป็นแลนด์มาร์กแห่งใหม่"],
];
const byId = Object.fromEntries(lines.map((l) => [l.id, l]));
const seg = new Intl.Segmenter("th", { granularity: "word" });
const visLen = (s) => [...s].filter((ch) => !/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\s]/.test(ch)).length;
const cues = CUES.map(([ids, text0], k) => { let text = text0;
  const s = byId[ids[0]].start, e = byId[ids[ids.length - 1]].end;
  // word groups: join segmenter words into chunks of >= 4 visible chars (spaces split groups); "|" = forced line break
  const parts = text.split("|"); text = parts.join("");
  const groups = []; let forced = -1;
  parts.forEach((part, pi) => {
    const words = [...seg.segment(part)].map((x) => x.segment); let cur = ""; const pg = [];
    for (const w of words) {
      if (/^\s+$/.test(w)) { if (cur) pg.push(cur); pg.push(" "); cur = ""; continue; }
      cur += w; if (visLen(cur) >= 4) { pg.push(cur); cur = ""; }
    }
    if (cur) { if (pg.length && pg[pg.length - 1] !== " " && visLen(cur) < 3) pg[pg.length - 1] += cur; else pg.push(cur); }
    groups.push(...pg); if (pi === 0 && parts.length > 1) forced = groups.length - 1;
  });
  // line break for long cues: forced, else nearest group boundary to the middle (prefer spaces)
  const total = visLen(text); let brk = forced;
  if (brk < 0 && total > 21) { let acc = 0, best = 1e9; groups.forEach((g, gi) => { acc += visLen(g); const d = Math.abs(acc - total / 2) - (g === " " || groups[gi + 1] === " " ? total * 0.22 : 0); if (d < best && gi < groups.length - 1 && gi > 0) { best = d; brk = gi; } }); }
  // timing: reveal spread over 88% of the spoken span, by visible length
  let acc = 0; const span = (e - s) * 0.88;
  const gt = groups.map((g) => { const t = s + span * (acc / Math.max(1, total)); acc += visLen(g); return +t.toFixed(3); });
  return { k, s, e, text, groups, gt, brk };
});
cues.forEach((c, i) => { const next = cues[i + 1]; const hold = next ? Math.min(c.e + 0.6, next.s - 0.04) : Math.min(c.e + 0.5, VOICE_END + 0.1); c.out = +Math.max(c.e, hold).toFixed(3); });

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cueHtml = cues.map((c) => {
  let inner = "";
  c.groups.forEach((g, gi) => { inner += g === " " ? `<span class="sp"> </span>` : `<span class="wg">${esc(g)}</span>`; if (gi === c.brk) inner += "<br>"; });
  return `<div class="cue" id="cue-${c.k}"><div class="ln">${inner}</div></div>`;
}).join("\n      ");
const subJs = cues.map((c) => {
  const lines = [`tl.set("#cue-${c.k}", { opacity: 1 }, ${Math.max(0, c.s - 0.05).toFixed(3)});`];
  lines.push(`tl.fromTo("#cue-${c.k} .ln", { y: 14, scale: .96 }, { y: 0, scale: 1, duration: .18, ease: "power2.out" }, ${Math.max(0, c.s - 0.05).toFixed(3)});`);
  let wi = 0; c.groups.forEach((g, gi) => { if (g === " ") return; const t = c.gt[gi];
    lines.push(`tl.fromTo($$("#cue-${c.k} .wg")[${wi}], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .14, ease: "power2.out" }, ${Math.max(0, t - 0.04).toFixed(3)});`);
    lines.push(`tl.fromTo($$("#cue-${c.k} .wg")[${wi}], { color: "#ffd84a" }, { color: "#ffffff", duration: .5, ease: "power1.in", immediateRender: false }, ${(t + 0.12).toFixed(3)});`);
    wi++; });
  lines.push(`tl.set("#cue-${c.k}", { opacity: 0 }, ${c.out.toFixed(3)});`);
  return lines.join("\n    ");
}).join("\n    ");
const subsHtml = `<template>
  <style>
    ${FONT_CSS}
    #root { position: absolute; inset: 0; overflow: hidden; pointer-events: none; font-family: Kanit, sans-serif; }
    .clip { position: absolute; inset: 0; }
    /* safe area: bottom edge 330px above frame bottom, right 150px kept clear for app icons */
    .cue { position: absolute; left: 50px; width: 860px; bottom: 330px; text-align: center; opacity: 0; }
    .ln { display: inline-block; font-size: 56px; line-height: 1.38; font-weight: 800; color: #fff; padding: 8px 26px 14px; border-radius: 22px;
          background: rgba(16, 10, 6, .62); text-shadow: 0 3px 0 #1a0e06, 0 0 14px rgba(0,0,0,.6); transform-origin: 50% 100%; }
    .wg { display: inline-block; opacity: 0; white-space: nowrap; }
    .sp { display: inline-block; width: .32em; }
  </style>
  <div data-hf-id="hf-subs" id="root" data-composition-id="subs" data-width="1080" data-height="1920" data-layout-allow-overflow data-layout-allow-overlap>
    <div data-hf-id="hf-subs-clip" class="clip" data-start="0" data-duration="${TOTAL}" data-track-index="0">
      ${cueHtml}
    </div>
  </div>
  <script>
  (() => {
    const tl = gsap.timeline({ paused: true });
    const $$ = (s) => Array.from(document.querySelectorAll(s));
    ${subJs}
    window.__timelines = window.__timelines || {};
    window.__timelines["subs"] = tl;
  })();
  </script>
</template>
`;
writeFileSync(join(root, "compositions", "subs.html"), subsHtml);

// SRT
const ts = (t) => { const ms = Math.round(t * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60, x = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(x).padStart(3, "0")}`; };
mkdirSync(join(root, "renders"), { recursive: true });
const srt = cues.map((c, i) => `${i + 1}\n${ts(c.s)} --> ${ts(c.out)}\n${c.groups.map((g, gi) => g + (gi === c.brk ? "\n" : "")).join("").replace(/ \n/g, "\n").replace(/\n /g, "\n")}\n`).join("\n");
writeFileSync(join(root, "renders", "bang-dubai-v1.srt"), srt);
writeFileSync(join(root, "assets/voice/cues-tight.json"), JSON.stringify(cues, null, 1));

// ---------------- FX layer: whoosh flares at scene boundaries ----------------
const fxHtml = `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    .clip { position: absolute; inset: 0; }
    #fx-flare { position: absolute; left: -400px; top: 0; width: 1880px; height: 1920px; opacity: 0; mix-blend-mode: screen;
      background: linear-gradient(100deg, rgba(255,220,150,0) 32%, rgba(255,210,140,.5) 46%, rgba(255,250,230,.95) 50%, rgba(255,200,120,.45) 54%, rgba(255,220,150,0) 68%); }
    #fx-burst { position: absolute; inset: 0; opacity: 0; mix-blend-mode: screen; background: radial-gradient(circle at 50% 50%, rgba(255,240,210,.55) 0%, rgba(255,200,140,.18) 40%, rgba(0,0,0,0) 70%); }
    .streak { position: absolute; height: 6px; border-radius: 3px; background: rgba(255,255,255,.85); opacity: 0; }
  </style>
  <div data-hf-id="hf-fx" id="root" data-composition-id="fx" data-width="1080" data-height="1920" data-layout-allow-overflow data-layout-allow-overlap>
    <div data-hf-id="hf-fx-clip" class="clip" data-start="0" data-duration="${TOTAL}" data-track-index="0">
      <div id="fx-burst"></div><div id="fx-flare"></div>
      ${[...Array(8)].map((_, i) => `<div class="streak" id="fx-s${i}" style="top:${180 + i * 210}px;left:-600px;width:${380 + (i * 97) % 300}px"></div>`).join("")}
    </div>
  </div>
  <script>
  (() => {
    const tl = gsap.timeline({ paused: true });
    ${JSON.stringify(BOUNDS.slice(1))}.forEach((b, i) => {
      const dir = i % 2 ? -1 : 1;
      tl.fromTo("#fx-flare", { opacity: 0, x: -900 * dir }, { keyframes: [{ opacity: .55, x: -100 * dir, duration: .22, ease: "power2.in" }, { opacity: 0, x: 700 * dir, duration: .32, ease: "power2.out" }], immediateRender: false }, b - 0.22);
      tl.fromTo("#fx-burst", { opacity: 0 }, { keyframes: [{ opacity: .9, duration: .12 }, { opacity: 0, duration: .3 }], immediateRender: false }, b - 0.08);
      for (let k = 0; k < 8; k++) tl.fromTo("#fx-s" + k, { opacity: 0, x: dir > 0 ? 0 : 2200 }, { keyframes: [{ opacity: .8, duration: .08 }, { x: dir > 0 ? 2200 : -200, opacity: 0, duration: .3 }], immediateRender: false }, b - 0.2 + (k % 4) * 0.025);
    });
    window.__timelines = window.__timelines || {};
    window.__timelines["fx"] = tl;
  })();
  </script>
</template>
`;
writeFileSync(join(root, "compositions", "fx.html"), fxHtml);

const index = `<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: #0c0806; }
    </style>
  </head>
  <body>
    <div data-hf-id="hf-main" id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="1080" data-height="1920">
${clips.join("\n")}
      <div data-hf-id="hf-clip-fx" id="fx" data-composition-id="fx" data-composition-src="compositions/fx.html" data-start="0" data-duration="${TOTAL}" data-track-index="2" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
      <div data-hf-id="hf-clip-subs" id="subs" data-composition-id="subs" data-composition-src="compositions/subs.html" data-start="0" data-duration="${TOTAL}" data-track-index="3" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
writeFileSync(join(root, "index.html"), index);
console.log("index.html written:", TOTAL, "s;", cues.length, "subtitle cues");
