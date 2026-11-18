// ถ้ากรุงเทพฯ มีระบบทิปแบบอเมริกา — animated video (8 scenes + fx + Thai subtitles + index.html + SRT).
// Voice: assets/audio/tip-bangkok.wav (79.4 s). Times below come from a faster-whisper pass over that file.
// Reuses the บางดูไบ runtime (GSAP helpers), kit and flat-people characters so the series looks the same.
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { proj, repo, f1, placeChar, txt, asokBg, presets, tipScreen, tipBadge, bubble, comic, heading, coin,
  cafeBg, cafeCounter, storeFront, storeCounter, curryShopFront, hiringBoard, shophouseBg, diningTable, stool, condiments,
  btsGate, atm, phone, bedroomBg, piggy } from "./draw.mjs";
import { person, car } from "../../bang-dubai/scripts/video/common.mjs";
import { vehicle } from "../../bang-dubai/compositions/components/kit.mjs";

const RUNTIME = readFileSync(join(repo, "bang-dubai/scripts/video/runtime.js"), "utf8");
export const BOUNDS = [0, 8.4, 18.5, 27.95, 38.9, 48.1, 58.7, 71.4];
export const VOICE_END = 79.2;
export const TOTAL = 81.0;
const r2 = (n) => (+n).toFixed(2);

// ---------- shared pieces ----------
const DEFS = `<defs>
  <filter id="tbShadow" x="-20%" y="-30%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity=".35"/></filter>
  <radialGradient id="spot"><stop offset="0" stop-color="#fff6c8" stop-opacity=".75"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient>
</defs>`;
const g = (id, inner, o = "") => `<g id="${id}"${o}>${inner}</g>`;
const hide = ` opacity="0"`;
const hero = (reg, id, x, feet, s, o = {}) => person(reg, id, { ...presets.officeMale, expressions: ["worried", "shocked", "smile", "neutral"], armL: 10, armR: 10, ...o }, x, feet, s);
// a tip screen whose highlighted button can change: layers id-k0..n (k0 = nothing picked)
const screenL = (id, x, y, s, o, picks) => g(id, picks.map((p, i) => g(`${id}-k${i}`, tipScreen(x, y, s, { ...o, pick: p }), i ? hide : "")).join(""));
const badge = (id, pct, label) => g(id, tipBadge(pct, label));
const counterBox = (id, x, y, v, label = "ค่าทิปวันนี้", w = 300) => g(id, `<g transform="translate(${x} ${y})" filter="url(#tbShadow)">
    <rect x="${-w / 2}" y="-50" width="${w}" height="100" rx="22" fill="#fff8ec" stroke="#1a1208" stroke-width="5"/>
    ${txt(0, -12, label, { size: 26, weight: 700, fill: "#7a5a3a" })}
    ${txt(0, 34, v, { size: 46, weight: 900, fill: "#c8282f" }).replace("<text", `<text id="${id}-v"`)}</g>`);
const sweat = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#7ec8ff" stroke="#1a1208" stroke-width="3"><path d="M0 -26 Q16 0 0 12 Q-16 0 0 -26 Z"/></g>`;
const stamp = (x, y, text, { rot = -10, size = 54, fill = "#c8282f" } = {}) => `<g transform="translate(${x} ${y}) rotate(${rot})">
  <rect x="${-(text.length * size * 0.36 + 30)}" y="${-size * 0.95}" width="${text.length * size * 0.72 + 60}" height="${size * 1.45}" rx="14" fill="#fff8ec" stroke="${fill}" stroke-width="7"/>
  ${txt(0, size * 0.18, text, { size, weight: 900, fill })}</g>`;
const poof = (id, x, y, s = 1) => g(id, [[0, 0, 70], [-60, 20, 50], [60, 24, 54], [-30, -40, 46], [36, -36, 44]].map(([dx, dy, r]) =>
  `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${r * s}" fill="#ffffff" opacity=".9"/>`).join(""), hide);

// local-coordinate helpers for things drawn over a placed flat-person (frame 200x530, feet at local (100, 520))
const P2 = (x, feet, s) => (lx, ly) => `${f1(x + (lx - 100) * s)} ${f1(feet + (ly - 520) * s)}`;
const apron = (x, feet, s) => { const p = P2(x, feet, s);
  return `<path d="M${p(76, 262)} L${p(124, 262)} L${p(140, 440)} L${p(60, 440)} Z" fill="#fff8ec" stroke="#d9d2c8" stroke-width="3"/>
    <path d="M${p(80, 262)} Q${p(100, 236)} ${p(120, 262)}" fill="none" stroke="#fff8ec" stroke-width="${f1(6 * s)}"/>
    <rect x="${f1(x - 18 * s)}" y="${f1(feet + (330 - 520) * s)}" width="${f1(36 * s)}" height="${f1(26 * s)}" rx="${f1(4 * s)}" fill="#e9dcc4"/>`; };
const bowTie = (x, feet, s) => { const p = P2(x, feet, s);
  return `<path d="M${p(100, 250)} L${p(84, 240)} L${p(84, 262)} Z M${p(100, 250)} L${p(116, 240)} L${p(116, 262)} Z" fill="#1c1c22"/><circle cx="${f1(x)}" cy="${f1(feet + (250 - 520) * s)}" r="${f1(4 * s)}" fill="#1c1c22"/>`; };
const WAITER = { outfit: "shirt", shirtColor: "#fbf8f2", accent: "#e9e2d6", pantsColor: "#1c1c22", necktie: "", lanyard: "" };
const waiter = (reg, id, x, feet, s, o = {}) => { reg.push({ id, x, y: feet, s });
  const exps = ["worried", "shocked", "smile", "neutral"];
  return `<g id="${id}-w"><g id="${id}-b">${placeChar({ ...presets.officeMale, ...WAITER, id, expressions: exps, expression: exps[0], armL: 10, armR: 10, ...o }, x, feet, s)}${apron(x, feet, s)}${bowTie(x, feet, s)}</g></g>`; };

// extra runtime: piecewise counter + pick switch for layered tip screens
const EXTRA = `
const stepCounter = (el, from, steps, fmt) => driver((t) => { let v = from; for (const [at, d, to] of steps) { if (t >= at) { const k = clamp01((t - at) / d); v = lerp(v, to, 1 - Math.pow(1 - k, 3)); } } el.textContent = fmt(v); });
const baht = (v) => "฿" + Math.round(v).toLocaleString("en-US");
const pick = (id, i, n, at, ox, oy) => { for (let j = 0; j < n; j++) tl.set("#" + id + "-k" + j, { opacity: j === i ? 1 : 0 }, at);
  tl.fromTo("#" + id, { scale: 1.08, svgOrigin: ox + " " + oy }, { scale: 1, svgOrigin: ox + " " + oy, duration: .3, ease: "back.out(3)", immediateRender: false }, at); };
const badgeIn = (sel, at) => { pop(sel, at, 540, 210, { d: .5 }); tl.fromTo(sel, { rotation: -6, svgOrigin: "540 210" }, { rotation: 0, svgOrigin: "540 210", duration: .5, ease: "back.out(3)", immediateRender: false }, at); };
`;

// ---------------- Scene 0: hook — Asok morning, tip screens everywhere ----------------
function scene0(B) {
  const reg = [], t = (a) => r2(a - B);
  const minis = [[820, 640, -8], [200, 1000, 6], [880, 1060, 10], [560, 470, -4], [470, 1240, 8]];
  const slip = `<g transform="translate(290 650) rotate(-5)" filter="url(#tbShadow)">
    <rect x="-200" y="-120" width="400" height="240" rx="18" fill="#fff8ec" stroke="#1a1208" stroke-width="5"/>
    <rect x="-200" y="-120" width="400" height="62" rx="18" fill="#2b6ea8"/><rect x="-200" y="-80" width="400" height="22" fill="#2b6ea8"/>
    ${txt(0, -76, "สลิปเงินเดือน", { size: 34, weight: 800, fill: "#fff" })}
    ${txt(0, 30, "฿18,000", { size: 68, weight: 900, fill: "#1a1208" })}
    ${txt(0, 88, "เดือนนี้", { size: 28, weight: 600, fill: "#7a6a5a" })}</g>`;
  const svg = `
    ${asokBg({ time: "morning", prefix: "s0", trainX: -520 })}
    ${g("s0-glow", `<rect width="1080" height="1920" fill="#1a1208" opacity=".38"/><circle cx="540" cy="860" r="560" fill="url(#spot)"/>`, hide)}
    ${g("s0-slip", slip)}${g("s0-same", stamp(390, 770, "เท่าเดิม", { rot: -12, size: 50 }))}
    <g id="s0-minis">${minis.map(([x, y, r], i) => g(`s0-m${i}`, tipScreen(x, y, 0.4, { rot: r, pick: -1 }))).join("")}</g>
    ${screenL("s0-big", 540, 860, 1.85, {}, [-1, 0, 1, 2])}
    ${person(reg, "s0of", { ...presets.officeFemale, expressions: ["smile", "shocked"], armL: 12, armR: 20, holdL: "phone" }, 130, 1960, 1.3)}
    ${person(reg, "s0au", { ...presets.auntie, expressions: ["smile", "shocked"], holdR: "", armL: 12, armR: 12 }, 950, 1960, 1.25)}
    ${person(reg, "s0win", { ...presets.winMale, expressions: ["neutral", "smirk", "shocked"], holdR: "", armL: 10, armR: 10 }, 740, 1990, 1.35)}
    ${hero(reg, "s0y", 370, 2010, 1.45, { expressions: ["neutral", "shocked", "worried"] })}
    ${g("s0-head", heading(["ถ้ากรุงเทพฯ ใช้", "ระบบทิปแบบอเมริกา"], { y: 200, size: 84 }))}
  `;
  const tBig = 5.95 - B;
  const js = `
    tl.fromTo("#s0-asok .bts-train", { x: -520 }, { x: 1120, duration: 3.6, ease: "none" }, 0);
    pop("#s0-head", 0.15, 540, 250, { d: .55 });
    slide("#s0of-w", 0, -300, 0, { d: 1.3, e: "power1.out" }); slide("#s0au-w", 0.15, 300, 0, { d: 1.3, e: "power1.out" });
    slide("#s0win-w", 0.1, 260, 0, { d: 1.2, e: "power1.out" }); slide("#s0y-w", 0.25, -320, 0, { d: 1.3, e: "power1.out" });
    ["s0of","s0au","s0win","s0y"].forEach((id, i) => bob("#" + id + "-b", 0, 1.5, 8, 0.4 + i * 0.03));
    // "เงินเดือนเท่าเดิม"
    pop("#s0-slip", ${t(3.75)}, 290, 650, { d: .45, rot: -10 });
    pop("#s0-same", ${t(4.35)}, 390, 770, { d: .35, from: 2.2, op0: 0, e: "power3.out" });
    shake("#s0-shk", ${t(4.4)}, 6, .25);
    // "แต่ทุกอย่างต้องทิป": little tip screens pop everywhere
    ${minis.map(([x, y], i) => `pop("#s0-m${i}", ${t(4.75 + i * 0.09)}, ${x}, ${y}, { d: .35 });`).join("\n    ")}
    face("s0of", "shocked", ${t(4.9)}); face("s0au", "shocked", ${t(5.0)}); face("s0y", "worried", ${t(4.9)});
    // giant screen
    ${minis.map(([x, y], i) => `popOut("#s0-m${i}", ${r2(tBig - 0.2 + i * 0.02)}, ${x}, ${y}, { d: .2 });`).join("\n    ")}
    popOut("#s0-slip", ${r2(tBig - 0.25)}, 290, 650, { d: .2 }); popOut("#s0-same", ${r2(tBig - 0.25)}, 390, 770, { d: .2 });
    fadeIn("#s0-glow", ${r2(tBig - 0.1)}, .35);
    pop("#s0-big", ${r2(tBig)}, 540, 860, { d: .6, e: "back.out(1.6)" });
    shake("#s0-shk", ${r2(tBig + 0.15)}, 14, .5);
    [["s0of",0],["s0au",.08],["s0win",.04],["s0y",.12]].forEach(([id, d]) => { face(id, "shocked", ${r2(tBig + 0.15)} + d); jump("#" + id + "-b", ${r2(tBig + 0.15)} + d, 50, .5); });
    arm("s0y", "L", ${r2(tBig + 0.2)}, 150, .25); arm("s0y", "R", ${r2(tBig + 0.2)}, -150, .25);
    arm("s0au", "L", ${r2(tBig + 0.25)}, 140, .25);
    // buttons light up one after another
    ${[1, 2, 3, 1, 2, 3].map((k, i) => `pick("s0-big", ${k}, 4, ${r2(tBig + 0.9 + i * 0.22)}, 540, 860);`).join("\n    ")}
    cam("#s0-cam", [{ t: 0, s: 1.08, d: 0.01 }, { t: 0.05, s: 1.0, d: 2.5, e: "sine.out" }, { t: ${r2(tBig + 0.1)}, s: 1.1, y: 60, d: 2.2, e: "power2.out" }]);
  `;
  return { svg, js, reg };
}

// ---------------- Scene 1: ทิป 10% — first coffee ----------------
function scene1(B) {
  const reg = [], t = (a) => r2(a - B);
  const stare = (x, y) => `<g stroke="#c8282f" stroke-width="7" stroke-linecap="round" opacity=".85"><path class="st" d="M${x} ${y} l-70 40"/><path class="st" d="M${x + 10} ${y + 30} l-80 30"/><path class="st" d="M${x + 6} ${y - 30} l-60 20"/></g>`;
  const svg = `
    ${cafeBg()}
    ${person(reg, "s1b", { gender: "female", hair: "pony", shirtColor: "#5a3a2a", accent: "#f4efe6", expressions: ["smile", "smirk"], armL: 30, armR: 20 }, 800, 1700, 1.45)}
    ${cafeCounter()}
    ${g("s1-price", `<g transform="translate(330 1040) rotate(-4)" filter="url(#tbShadow)"><rect x="-200" y="-50" width="400" height="92" rx="20" fill="#fff8ec" stroke="#1a1208" stroke-width="5"/>${txt(0, 14, "อเมริกาโน่ ฿55", { size: 44, weight: 900, fill: "#1a1208" })}</g>`)}
    ${screenL("s1-scr", 470, 1190, 0.82, { rot: -6 }, [-1, 1])}
    ${person(reg, "s1q1", { gender: "female", hair: "long", shirtColor: "#e07a9a", expressions: ["neutral", "fierce"] }, 760, 2120, 1.55)}
    ${person(reg, "s1q2", { gender: "male", hair: "short", shirtColor: "#3d6a45", expressions: ["neutral", "angry"] }, 980, 2140, 1.6)}
    ${hero(reg, "s1y", 220, 2060, 1.6, { armR: 20 })}
    ${g("s1-sweat", sweat(340, 1300, 1.4), hide)}
    ${g("s1-stare", stare(640, 1440))}
    ${g("s1-jong", comic(860, 1290, "จ้อง…", 84, "#ffffff", 6))}
    ${g("s1-ting", comic(560, 1000, "ติ๊ด!", 80, "#7ef0c0", -8))}
    ${counterBox("s1-ct", 880, 410, "฿0")}
    ${badge("s1-tb", 10, "กาแฟแก้วแรก")}
  `;
  const tScr = t(12.9), tStare = t(14.87), tLast = t(16.15), tPress = t(17.1);
  const js = `
    badgeIn("#s1-tb", 0.25); pop("#s1-ct", 0.7, 880, 410, { d: .4 });
    slide("#s1y-w", 0.1, -360, 0, { d: .9 }); bob("#s1y-b", 0.1, 1.0, 9, .36);
    slide("#s1q1-w", 0.3, 420, 0, { d: 1.0 }); slide("#s1q2-w", 0.4, 420, 0, { d: 1.0 });
    bob("#s1b-b", 0, ${tScr}, 4, 1.1);
    pop("#s1-price", ${t(11.3)}, 330, 1040, { d: .45 });
    // barista turns the screen around
    arm("s1b", "R", ${r2(+tScr - 0.1)}, 70, .3);
    tl.fromTo("#s1-scr", { scale: 0.2, rotation: 80, opacity: 0, svgOrigin: "560 1300" }, { scale: 1, rotation: 0, opacity: 1, svgOrigin: "560 1300", duration: .55, ease: "back.out(1.8)" }, ${tScr});
    face("s1b", "smirk", ${r2(+tScr + 0.3)}); face("s1y", "worried", ${tScr});
    popOut("#s1-price", ${r2(+tScr + 0.1)}, 330, 1040, { d: .25 });
    // the queue stares
    face("s1q1", "fierce", ${tStare}); face("s1q2", "angry", ${r2(+tStare + 0.1)});
    $$("#s1-stare .st").forEach((p, i) => draw(p, ${tStare} + i * 0.08, .3, 100));
    pop("#s1-jong", ${r2(+tStare + 0.25)}, 860, 1290, { d: .4 });
    fadeIn("#s1-sweat", ${r2(+tStare + 0.4)}, .2); tl.fromTo("#s1-sweat", { y: -20 }, { y: 30, duration: 1.4, ease: "power1.in" }, ${r2(+tStare + 0.4)});
    shake("#s1q1-b", ${r2(+tStare + 0.2)}, 6, .4); shake("#s1q2-b", ${r2(+tStare + 0.3)}, 6, .4);
    cam("#s1-cam", [{ t: 0, s: 1.0, d: .01 }, { t: ${r2(+tStare - 0.1)}, s: 1.14, x: 200, y: -170, d: .7, e: "power3.out" }, { t: ${r2(+tLast + 0.1)}, s: 1.0, x: 0, y: 0, d: .6 }]);
    // "สุดท้าย กด 20%"
    arm("s1y", "R", ${tLast}, 140, .4);
    pick("s1-scr", 1, 2, ${tPress}, 470, 1190);
    pop("#s1-ting", ${tPress}, 560, 1000, { d: .3 }); fadeOut("#s1-ting", ${r2(+tPress + 0.7)}, .3);
    stepCounter($("#s1-ct-v"), 0, [[${r2(+tPress + 0.1)}, .7, 11]], baht);
    face("s1q1", "neutral", ${r2(+tPress + 0.3)}); face("s1q2", "neutral", ${r2(+tPress + 0.35)}); face("s1b", "smile", ${r2(+tPress + 0.2)});
    fadeOut("#s1-jong", ${r2(+tPress + 0.2)}, .25); fadeOut("#s1-stare", ${r2(+tPress + 0.2)}, .25);
  `;
  return { svg, js, reg };
}

// ---------------- Scene 2: ทิป 15% — motorbike taxi ----------------
function scene2(B) {
  const reg = [], t = (a) => r2(a - B);
  const light = `<g transform="translate(150 980) scale(.9)"><rect x="-12" y="0" width="24" height="480" fill="#3a3a42"/>
    <rect x="-56" y="-270" width="112" height="280" rx="20" fill="#1c1c22"/>
    <circle cy="-205" r="36" fill="#5a1a1a"/><circle id="s2-red" cy="-205" r="36" fill="#ff3b3b"/><circle cy="-130" r="36" fill="#4a3a1a"/><circle cy="-55" r="36" fill="#1f3a26"/></g>`;
  const speed = [...Array(6)].map((_, i) => `<path class="sp" d="M${120 + (i % 3) * 30} ${1300 + i * 60} l-${160 + (i * 37) % 90} 0" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".85"/>`).join("");
  const svg = `
    ${asokBg({ time: "day", prefix: "s2", trainX: 520 })}
    ${g("s2-light", light)}
    <g id="s2-bike"><g id="s2-bike-b">
      ${person(reg, "s2w", { ...presets.winMale, expressions: ["smirk", "smile"], holdR: "", armL: 20, armR: 120 }, 900, 1700, 1.45)}
      ${vehicle("moto", 600, 1700, { color: "#f26a1b", scale: 7.5 })}
      <path d="M640 1600 L560 1360" stroke="#2a2a30" stroke-width="12"/>
      ${screenL("s2-scr", 540, 1210, 0.8, { title: "ทิปขั้นต่ำ 15%", opts: ["15%", "20%", "ซิ่ง+5%"], rot: 4 }, [-1, 0, 2])}
    </g></g>
    ${g("s2-speed", speed, hide)}
    ${hero(reg, "s2y", 210, 2000, 1.5, { holdL: "briefcase" })}
    ${g("s2-sweat", sweat(330, 1290, 1.3), hide)}
    ${g("s2-zing", comic(800, 960, "ซิ่งตามงบ!", 84, "#ffd166", 8))}
    ${g("s2-plus", comic(840, 1000, "ซิ่ง! +5%", 92, "#7ef0c0", 8))}
    ${g("s2-red2", comic(360, 680, "ไฟแดงอีกแล้ว…", 66, "#ff6a6a", -6))}
    ${counterBox("s2-ct", 880, 410, "฿11")}
    ${badge("s2-tb", 15, "วินมอเตอร์ไซค์")}
  `;
  const tZing = t(20.11), tMin = t(21.5), tFast = t(23.5), tLow = t(24.87), tRed = t(25.9);
  const js = `
    badgeIn("#s2-tb", 0.25); pop("#s2-ct", 0.6, 880, 410, { d: .4 });
    slide("#s2-bike", 0, 900, 0, { d: .9, e: "power3.out" });
    slide("#s2y-w", 0.2, -320, 0, { d: .8 }); bob("#s2y-b", 0.2, 1.0, 8, .35);
    bob("#s2-bike-b", 0.9, ${tMin}, 3, .18);
    // "พี่วินซิ่งตามงบ"
    pop("#s2-zing", ${tZing}, 800, 960, { d: .4 }); popOut("#s2-zing", ${r2(+tMin - 0.15)}, 800, 960, { d: .2 });
    face("s2w", "smile", ${tZing}); shake("#s2-bike-b", ${tZing}, 6, .6);
    // minimum tip screen
    pop("#s2-scr", ${tMin}, 560, 1360, { d: .45 }); pick("s2-scr", 1, 3, ${r2(+tMin + 0.8)}, 540, 1210);
    stepCounter($("#s2-ct-v"), 11, [[${r2(+tMin + 0.9)}, .6, 19], [${r2(+tFast + 0.6)}, .6, 24], [${r2(+tLow + 0.3)}, .5, 22]], baht);
    face("s2y", "worried", ${tMin});
    // "อยากถึงเร็ว เพิ่มอีก 5"
    pick("s2-scr", 2, 3, ${r2(+tFast + 0.5)}, 540, 1210);
    pop("#s2-plus", ${r2(+tFast + 0.55)}, 840, 1000, { d: .35 }); popOut("#s2-plus", ${r2(+tLow - 0.1)}, 840, 1000, { d: .2 });
    fadeIn("#s2-speed", ${r2(+tFast + 0.55)}, .1); $$("#s2-speed .sp").forEach((p, i) => tl.fromTo(p, { x: 0 }, { x: -120, duration: .25, repeat: 4, ease: "none", immediateRender: false }, ${r2(+tFast + 0.55)} + i * 0.03));
    fadeOut("#s2-speed", ${r2(+tLow - 0.1)}, .2);
    shake("#s2-bike-b", ${r2(+tFast + 0.55)}, 9, 1.0);
    // "ทิปน้อย… พาแวะทุกไฟแดง"
    pick("s2-scr", 1, 3, ${tLow}, 540, 1210); face("s2w", "smirk", ${tLow});
    pop("#s2-light", ${r2(+tRed - 0.4)}, 150, 1400, { d: .45 });
    tl.fromTo("#s2-red", { opacity: 1 }, { opacity: .25, duration: .2, yoyo: true, repeat: 7, ease: "none", immediateRender: false }, ${tRed});
    pop("#s2-red2", ${r2(+tRed + 0.2)}, 360, 680, { d: .4 });
    fadeIn("#s2-sweat", ${r2(+tRed + 0.3)}, .2); face("s2y", "worried", ${tRed});
    cam("#s2-cam", [{ t: 0, s: 1.0, d: .01 }, { t: ${r2(+tMin - 0.1)}, s: 1.06, x: 20, y: -50, d: .6, e: "power3.out" }, { t: ${r2(+tLow - 0.2)}, s: 1.0, x: 0, y: 0, d: .6 }]);
  `;
  return { svg, js, reg };
}

// ---------------- Scene 3: ทิป 18% — made-to-order kaprao ----------------
function scene3(B) {
  const reg = [], t = (a) => r2(a - B);
  const egg = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 -4 Q-34 -26 -8 -24 Q10 -34 26 -18 Q40 -4 24 12 Q6 24 -14 16 Q-36 12 -30 -4 Z" fill="#fff"/><circle cx="-2" cy="-4" r="11" fill="#f6a623"/></g>`;
  const pill = (x, y, label, on) => `<rect x="${x - 78}" y="${y - 28}" width="156" height="50" rx="25" fill="${on ? "#f6a623" : "#ffffff"}" stroke="${on ? "#c98a3a" : "#d9d2c8"}" stroke-width="4"/>${txt(x, y + 8, label, { size: 28, weight: 800, fill: on ? "#fff" : "#7a6a5a" })}`;
  const menu = `<g transform="translate(395 690) scale(.72)" filter="url(#tbShadow)">
    <rect x="-470" y="-190" width="940" height="460" rx="18" fill="#ffe066" stroke="#c8282f" stroke-width="14"/>
    ${g("s3-r1", `${txt(-420, -110, "กะเพราหมูสับ", { size: 54, weight: 900, fill: "#1a1208", anchor: "start" })}${txt(150, -110, "฿50", { size: 50, weight: 900, fill: "#1a1208", anchor: "end" })}${txt(430, -110, "ทิป 18%", { size: 44, weight: 900, fill: "#c8282f", anchor: "end" })}`, hide)}
    ${g("s3-r2", `${egg(-385, -18, 1.1)}${txt(-335, -2, "+ ไข่ดาว", { size: 46, weight: 800, fill: "#1a1208", anchor: "start" })}${txt(150, -2, "+฿10", { size: 46, weight: 900, fill: "#1a1208", anchor: "end" })}`, hide)}
    ${g("s3-r2p", txt(430, -2, "+5%", { size: 44, weight: 900, fill: "#c8282f", anchor: "end" }), hide)}
    ${g("s3-r3", `${txt(-420, 84, "เลือกความสุกไข่", { size: 42, weight: 800, fill: "#1a1208", anchor: "start" })}${pill(-320, 150, "ไม่สุก", false)}${g("s3-pa", pill(-150, 150, "ยางมะตูม", false))}${g("s3-pb", pill(-150, 150, "ยางมะตูม", true), hide)}${pill(20, 150, "สุก", false)}`, hide)}
    ${g("s3-r3p", txt(430, 84, "+5%", { size: 44, weight: 900, fill: "#c8282f", anchor: "end" }), hide)}
    ${g("s3-tot", `<path d="M-430 200 L430 200" stroke="#1a1208" stroke-width="3" stroke-dasharray="10 8" opacity=".4"/>${txt(430, 250, "รวมทิป 28%", { size: 50, weight: 900, fill: "#c8282f", anchor: "end" })}`, hide)}
  </g>`;
  const plate = `<g transform="translate(660 1540) scale(1.05)"><ellipse rx="110" ry="30" fill="#f4efe6" stroke="#d9d2c8" stroke-width="4"/>
    <ellipse cx="-30" cy="-8" rx="58" ry="18" fill="#fff"/><path d="M14 -6 Q50 -30 84 -6 Q50 6 14 -6 Z" fill="#7a4a2a"/><circle cx="40" cy="-14" r="6" fill="#3a8a3a"/><circle cx="58" cy="-9" r="6" fill="#3a8a3a"/></g>`;
  const plateEgg = `<g transform="translate(660 1540) scale(1.05)"><ellipse cx="-34" cy="-30" rx="56" ry="22" fill="#ffffff"/><circle cx="-30" cy="-32" r="16" fill="#f6a623"/><path d="M-86 -28 Q-90 -38 -78 -42" stroke="#c98a3a" stroke-width="5" fill="none"/></g>`;
  const flames = `<g transform="translate(600 1120)">${[-50, -15, 20, 55].map((dx, i) => `<path class="fl" d="M${dx} 0 Q${dx - 18} -40 ${dx} -${70 + (i % 2) * 20} Q${dx + 18} -40 ${dx} 0 Z" fill="${i % 2 ? "#ffb02e" : "#ff6a2a"}"/>`).join("")}</g>`;
  const svg = `
    ${shophouseBg()}
    ${g("s3-menu", menu)}
    ${person(reg, "s3v", { ...presets.vendorFemale, expressions: ["smile", "smirk"], armL: 60, armR: 30 }, 790, 1440, 1.3)}
    <rect x="480" y="1150" width="600" height="330" fill="#b9c1c8"/><rect x="480" y="1470" width="600" height="14" fill="#8a939a"/><rect x="480" y="1140" width="600" height="20" rx="6" fill="#dfe4e8"/>
    ${g("s3-fire", flames, hide)}
    ${hero(reg, "s3y", 320, 1990, 1.45, { armL: 30, armR: 30 })}
    ${diningTable(540, 1560, 780)}
    ${condiments(470, 1560)}
    ${g("s3-plate", plate)}${g("s3-egg", plateEgg)}
    <path d="M860 1560 L870 1500" stroke="#3a3a42" stroke-width="10"/>
    ${screenL("s3-scr", 870, 1430, 0.5, { title: "ทิปไหมจ๊ะ?", opts: ["18%", "23%", "28%"], rot: 4 }, [-1, 2])}
    ${stool(200, 1850, 0.9)}${stool(880, 1850, 0.9)}
    ${g("s3-egg2", comic(330, 1150, "ไข่ดาวด้วย!", 70, "#ffd166", -6))}
    ${counterBox("s3-ct", 880, 410, "฿22")}
    ${badge("s3-tb", 18, "ร้านอาหารตามสั่ง")}
  `;
  const t1 = t(30.85), t2 = t(32.5), t2p = t(34.15), t3 = t(36.0), t3p = t(37.4);
  const js = `
    badgeIn("#s3-tb", 0.3); pop("#s3-ct", 0.65, 880, 410, { d: .4 });
    slide("#s3y-w", 0.1, -360, 0, { d: .8 }); bob("#s3y-b", 0.1, 0.9, 8, .35);
    // wok fire while the vendor cooks
    fadeIn("#s3-fire", ${t(29.4)}, .2); $$("#s3-fire .fl").forEach((f, i) => tl.fromTo(f, { scaleY: .6, svgOrigin: "0 0" }, { scaleY: 1.25, svgOrigin: "0 0", duration: .14 + i * .02, yoyo: true, repeat: 41, ease: "sine.inOut", immediateRender: false }, ${t(29.4)}));
    wave("s3v", "R", ${t(29.4)}, ${r2(+t1 + 6)}, 30, -20, .45);
    pop("#s3-menu", ${r2(+t1 - 0.6)}, 395, 690, { d: .5, from: .4 });
    // rows appear with the voice
    slide("#s3-r1", ${t1}, -60, 0, { d: .35, op0: 0 });
    pop("#s3-plate", ${t1}, 660, 1540, { d: .4 }); tl.set("#s3-egg", { opacity: 0 }, 0);
    slide("#s3-r2", ${t2}, -60, 0, { d: .35, op0: 0 });
    pop("#s3-egg2", ${r2(+t2 - 0.1)}, 330, 1150, { d: .35 }); popOut("#s3-egg2", ${r2(+t2p - 0.2)}, 330, 1150, { d: .2 });
    arm("s3y", "R", ${r2(+t2 - 0.1)}, 150, .3); face("s3y", "smile", ${r2(+t2 - 0.1)});
    tl.fromTo("#s3-egg", { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .35, ease: "bounce.out", immediateRender: false }, ${r2(+t2 + 0.4)});
    tl.fromTo("#s3-r2p", { opacity: 0, scale: 2.2, svgOrigin: "395 -2" }, { opacity: 1, scale: 1, svgOrigin: "395 -2", duration: .35, ease: "power3.out", immediateRender: false }, ${r2(+t2p + 0.6)});
    arm("s3y", "R", ${r2(+t2p + 0.6)}, 20, .3); face("s3y", "worried", ${r2(+t2p + 0.6)});
    stepCounter($("#s3-ct-v"), 22, [[${r2(+t2p + 0.8)}, .5, 27], [${r2(+t3p + 0.5)}, .5, 33], [${r2(+t3p + 1.1)}, .5, 39]], baht);
    slide("#s3-r3", ${t3}, -60, 0, { d: .35, op0: 0 });
    tl.set("#s3-pb", { opacity: 1 }, ${r2(+t3 + 0.7)}); face("s3v", "smirk", ${r2(+t3 + 0.7)});
    tl.fromTo("#s3-r3p", { opacity: 0, scale: 2.2, svgOrigin: "395 84" }, { opacity: 1, scale: 1, svgOrigin: "395 84", duration: .35, ease: "power3.out", immediateRender: false }, ${r2(+t3p + 0.1)});
    tl.fromTo("#s3-tot", { opacity: 0, scale: 1.6, svgOrigin: "300 240" }, { opacity: 1, scale: 1, svgOrigin: "300 240", duration: .4, ease: "back.out(2)", immediateRender: false }, ${r2(+t3p + 0.6)});
    pop("#s3-scr", ${r2(+t3p + 0.3)}, 870, 1500, { d: .4 }); pick("s3-scr", 1, 2, ${r2(+t3p + 0.9)}, 870, 1430);
    face("s3y", "shocked", ${r2(+t3p + 0.6)}); jump("#s3y-b", ${r2(+t3p + 0.6)}, 50, .5);
    shake("#s3-shk", ${r2(+t3p + 0.6)}, 8, .35);
    cam("#s3-cam", [{ t: 0, s: 1.0, d: .01 }, { t: ${r2(+t1 - 0.6)}, s: 1.12, x: 110, y: 240, d: .7, e: "power3.out" }, { t: ${r2(+t3p + 0.2)}, s: 1.0, x: 0, y: 0, d: .6 }]);
  `;
  return { svg, js, reg };
}

// ---------------- Scene 4: ทิป 20% — convenience store ----------------
function scene4(B) {
  const reg = [], t = (a) => r2(a - B);
  const svg = `
    ${storeFront()}
    ${person(reg, "s4c", { gender: "female", hair: "bob", shirtColor: "#1f7a8c", accent: "#f28c28", expressions: ["smile", "smirk"], armL: 30, armR: 20 }, 840, 1720, 1.45)}
    ${storeCounter()}
    ${screenL("s4-scr", 430, 1200, 0.75, { title: "ทิปไหมคะ?", opts: ["20%", "25%", "30%"], rot: -4 }, [-1, 0])}
    ${g("s4-hi", bubble(720, 1000, "สวัสดีค่ะ", { w: 360, size: 50, tail: "right" }))}
    ${g("s4-p5", stamp(860, 900, "+5%", { rot: 12, size: 58 }))}
    ${hero(reg, "s4y", 250, 2060, 1.55, { holdR: "bottle", armR: 20 })}
    ${g("s4-sum", txt(540, 820, "น้ำ ฿10 + ทิป ฿2", { size: 64, weight: 900, fill: "#c8282f", stroke: "#fff", sw: 12 }))}
    ${counterBox("s4-ct", 880, 540, "฿39")}
    ${badge("s4-tb", 20, "ร้านสะดวกซื้อ")}
  `;
  const tWater = t(40.4), tSum = t(42.5), tHi = t(44.55), tP5 = t(46.25);
  const js = `
    badgeIn("#s4-tb", 0.3); pop("#s4-ct", 0.7, 880, 540, { d: .4 });
    slide("#s4y-w", 0.1, -360, 0, { d: .8 }); bob("#s4y-b", 0.1, 0.9, 8, .35);
    arm("s4y", "R", ${tWater}, 110, .35);
    pop("#s4-sum", ${tSum}, 540, 800, { d: .45 });
    pop("#s4-scr", ${r2(+tSum + 0.3)}, 430, 1300, { d: .45 }); pick("s4-scr", 1, 2, ${r2(+tSum + 1.2)}, 430, 1200);
    stepCounter($("#s4-ct-v"), 39, [[${r2(+tSum + 1.3)}, .5, 41], [${r2(+tP5 + 0.3)}, .5, 43]], baht);
    face("s4y", "worried", ${tSum});
    // "สวัสดีค่ะ"
    wave("s4c", "R", ${tHi}, ${r2(+tHi + 1.4)}, 150, 120, .35); face("s4c", "smile", ${tHi});
    pop("#s4-hi", ${r2(+tHi + 0.1)}, 860, 1080, { d: .4 });
    // "+5%"
    pop("#s4-p5", ${tP5}, 860, 900, { d: .35, from: 2.5, op0: 0, e: "power3.out" }); shake("#s4-shk", ${r2(+tP5 + 0.1)}, 7, .3);
    face("s4c", "smirk", ${r2(+tP5 + 0.2)}); face("s4y", "shocked", ${r2(+tP5 + 0.1)}); jump("#s4y-b", ${r2(+tP5 + 0.1)}, 40, .45);
    arm("s4y", "R", ${r2(+tP5 + 0.1)}, 20, .3);
    cam("#s4-cam", [{ t: 0, s: 1.0, d: .01 }, { t: ${r2(+tHi - 0.1)}, s: 1.1, x: -120, y: 60, d: .6, e: "power3.out" }, { t: ${r2(+tP5 + 0.7)}, s: 1.0, x: 0, y: 0, d: .5 }]);
  `;
  return { svg, js, reg };
}

// ---------------- Scene 5: ทิป 25% — the whole city asks ----------------
function scene5(B) {
  const reg = [], t = (a) => r2(a - B);
  const minis = [[170, 620, -8], [540, 560, 5], [900, 700, -6], [300, 960, 8], [780, 990, -4], [150, 1300, 6], [560, 1260, -7], [930, 1320, 9]];
  const appInner = `${txt(0, -130, "สั่งอาหาร", { size: 30, weight: 800, fill: "#1a1208" })}
    ${g("s5-none", `<rect x="-80" y="-104" width="160" height="70" rx="12" fill="#f0e6d8"/>${txt(0, -60, "(ยังไม่ได้เลือก)", { size: 20, weight: 600, fill: "#9a8a7a" })}`)}
    ${txt(0, 0, "ทิปไรเดอร์ก่อนสั่ง", { size: 24, weight: 800, fill: "#1a1208" })}
    ${["20%", "25%", "30%"].map((o, i) => `<rect x="${-84 + i * 58}" y="22" width="52" height="46" rx="10" fill="${i === 1 ? "#2fa36b" : "#fff"}" stroke="#d9d2c8" stroke-width="3"/>${txt(-58 + i * 58, 54, o, { size: 18, weight: 900, fill: i === 1 ? "#fff" : "#1a1208" })}`).join("")}
    <rect x="-84" y="96" width="168" height="44" rx="22" fill="#2fa36b"/>${txt(0, 126, "ทิปก่อน แล้วค่อยสั่ง", { size: 17, weight: 800, fill: "#fff" })}`;
  const lbl = (x, y, s) => txt(x, y, s, { size: 46, weight: 900, fill: "#fff", stroke: "#1a1208", sw: 9 });
  const svg = `
    ${asokBg({ time: "day", prefix: "s5", trainX: 300 })}<rect width="1080" height="1920" fill="#1a1208" opacity=".3"/>
    <g id="s5-minis">${minis.map(([x, y, r], i) => g(`s5-m${i}`, tipScreen(x, y, 0.36, { rot: r, pick: i % 3 }))).join("")}</g>
    ${g("s5-gate", `${btsGate(250, 1060, 1.3)}${tipScreen(250, 770, 0.62, { title: "แตะบัตร… ทิปไหม?", pick: 2 })}${lbl(250, 1340, "ประตูรถไฟฟ้า")}`)}
    ${g("s5-atm", `${atm(810, 1010, 1.05)}${tipScreen(810, 890, 0.5, { title: "ทิปตู้ ATM?", pick: 1 })}${lbl(810, 1290, "ตู้ ATM")}`)}
    ${g("s5-app", `${phone(540, 1000, 1.6, -4, appInner)}`)}
    ${g("s5-what", comic(800, 600, "ยังไม่ได้สั่งเลย!", 64, "#ffd166", 6))}
    ${counterBox("s5-ct", 880, 410, "฿43")}
    ${badge("s5-tb", 25, "ทั้งเมืองขอทิป")}
  `;
  const tAll = t(49.58), tGate = t(51.45), tAtm = t(53.45), tApp = t(55.7), tNot = t(57.25);
  const js = `
    badgeIn("#s5-tb", 0.25); pop("#s5-ct", 0.6, 880, 410, { d: .4 });
    tl.fromTo("#s5-asok .bts-train", { x: 300 }, { x: 1200, duration: 6, ease: "none" }, 0);
    ${minis.map(([x, y], i) => `pop("#s5-m${i}", ${r2(+tAll + i * 0.1)}, ${x}, ${y}, { d: .3 }); popOut("#s5-m${i}", ${r2(+tGate - 0.3 + i * 0.02)}, ${x}, ${y}, { d: .2 });`).join("\n    ")}
    shake("#s5-shk", ${r2(+tAll + 0.4)}, 5, .6);
    pop("#s5-gate", ${tGate}, 250, 1200, { d: .45 });
    pop("#s5-atm", ${tAtm}, 810, 1200, { d: .45 });
    // the phone takes the stage
    tl.to(["#s5-gate", "#s5-atm"], { opacity: .25, duration: .3 }, ${r2(+tApp - 0.1)});
    slide("#s5-app", ${tApp}, 0, 1200, { d: .55, e: "back.out(1.3)" });
    shake("#s5-none", ${tNot}, 10, .5); pop("#s5-what", ${r2(+tNot + 0.1)}, 800, 600, { d: .4 });
    stepCounter($("#s5-ct-v"), 43, [[${r2(+tAll + 0.6)}, 1.2, 98], [${r2(+tGate + 0.5)}, .6, 120], [${r2(+tAtm + 0.6)}, .6, 145], [${r2(+tApp + 0.7)}, .6, 180]], baht);
    cam("#s5-cam", [{ t: 0, s: 1.0, d: .01 }, { t: ${tAll}, s: 1.06, d: ${r2(+tApp - +tAll)}, e: "sine.inOut" }, { t: ${tApp}, s: 1.0, d: .5 }]);
  `;
  return { svg, js, reg };
}

// ---------------- Scene 6: ทิป 30% — life changes ----------------
function scene6(B) {
  const reg = [], t = (a) => r2(a - B);
  const queue = [[560, 1545, 0.82, "#5bb3c9", "female"], [690, 1565, 0.88, "#3d6a45", "male"], [820, 1585, 0.94, "#e07a9a", "female"], [950, 1610, 1.0, "#f0c14a", "male"]];
  const coins = [...Array(16)].map((_, i) => [80 + ((i * 397) % 920), -80 - (i % 4) * 90, 20 + (i % 3) * 8]);
  const income = `<g transform="translate(540 470)" filter="url(#tbShadow)"><rect x="-300" y="-70" width="600" height="140" rx="26" fill="#fff8ec" stroke="#1a1208" stroke-width="6"/>
    ${txt(0, -18, "รายได้ทิปของป้า วันนี้", { size: 34, weight: 800, fill: "#7a5a3a" })}
    ${txt(0, 46, "฿0", { size: 64, weight: 900, fill: "#2f8f5b" }).replace("<text", `<text id="s6-inc-v"`)}</g>`;
  const svg = `
    ${curryShopFront()}
    ${person(reg, "s6a", { ...presets.auntie, expressions: ["smile", "smirk"], holdR: "", armL: 12, armR: 12 }, 230, 1470, 1.0)}
    ${g("s6-auntie", comic(240, 990, "ป้าข้าวแกง", 64, "#ffd166", -4))}
    ${g("s6-board", hiringBoard(410, 1220, 0.82))}
    <g id="s6-q">${queue.map(([x, feet, s, c, gd], i) => person(reg, `s6q${i}`, { gender: gd, hair: gd === "female" ? "pony" : "short", shirtColor: c, expressions: ["neutral"], armL: 6, armR: 6 }, x, feet, s)).join("")}</g>
    ${car("s6-car", "supercar", 300, 1780, { color: "#f0c14a", scale: 3.4 })}
    <g id="s6-coins">${coins.map(([x, y, r], i) => g(`s6-c${i}`, coin(x, y, r))).join("")}</g>
    ${g("s6-inc", income)}
    ${hero(reg, "s6yo", 800, 2010, 1.45, { expressions: ["neutral", "smile"], holdL: "briefcase" })}
    ${waiter(reg, "s6yw", 800, 2010, 1.45, { expressions: ["smile"] })}
    ${poof("s6-poof", 800, 1560, 2.4)}
    ${g("s6-quit", comic(500, 1720, "ลาออก!", 84, "#ffffff", -8))}
    ${badge("s6-tb", 30, "ชีวิตเปลี่ยน")}
  `;
  const tLife = t(61.0), tRich = t(62.4), tCar = t(64.97), tOffice = t(67.37), tQuit = t(68.6);
  const js = `
    badgeIn("#s6-tb", 0.4);
    tl.set("#s6yw-w", { opacity: 0 }, 0);
    bob("#s6a-b", 0, ${tCar}, 4, .9);
    // "ชีวิตเปลี่ยน" + money pours in
    shake("#s6-shk", ${tLife}, 6, .35);
    pop("#s6-inc", ${tRich}, 540, 470, { d: .45 });
    stepCounter($("#s6-inc-v"), 0, [[${r2(+tRich + 0.3)}, 2.4, 48000]], baht);
    ${coins.map(([x, y], i) => `tl.fromTo("#s6-c${i}", { y: 0, rotation: 0, svgOrigin: "${x} ${y}" }, { y: ${2250 + (i % 5) * 60}, rotation: ${(i % 2 ? 1 : -1) * 360}, svgOrigin: "${x} ${y}", duration: ${r2(1.4 + (i % 4) * 0.15)}, ease: "power1.in" }, ${r2(+tRich + 0.1 + i * 0.12)});`).join("\n    ")}
    face("s6a", "smirk", ${tRich}); arm("s6a", "L", ${tRich}, 150, .35);
    // supercar
    tl.fromTo("#s6-car", { x: -1200 }, { x: 0, duration: .9, ease: "power3.out" }, ${r2(+tCar - 0.2)});
    tl.fromTo("#s6-car .veh-b", { rotation: 0, svgOrigin: "300 1780" }, { keyframes: [{ rotation: -3, duration: .15 }, { rotation: 0, duration: .3, ease: "bounce.out" }], immediateRender: false }, ${r2(+tCar + 0.65)});
    pop("#s6-auntie", ${r2(+tCar + 0.3)}, 240, 990, { d: .4 }); jump("#s6a-b", ${r2(+tCar + 0.3)}, 40, .5);
    popOut("#s6-inc", ${r2(+tOffice - 0.3)}, 540, 470, { d: .25 }); popOut("#s6-auntie", ${r2(+tOffice - 0.3)}, 240, 990, { d: .2 });
    // the office worker... quits to queue as a waiter
    pop("#s6-board", ${tOffice}, 410, 1460, { d: .45 });
    ${queue.map((_, i) => `slide("#s6q${i}-w", ${r2(+tOffice + 0.1 + i * 0.08)}, 700, 0, { d: .6 });`).join(" ")}
    slide("#s6yo-w", ${r2(+tOffice - 0.1)}, 520, 0, { d: .7 }); bob("#s6yo-b", ${r2(+tOffice - 0.1)}, ${r2(+tOffice + 0.6)}, 8, .35);
    pop("#s6-quit", ${tQuit}, 500, 1720, { d: .35, from: 2.4, op0: 0, e: "power3.out" }); shake("#s6-shk", ${r2(+tQuit + 0.05)}, 10, .35);
    tl.fromTo("#s6-poof", { opacity: 0, scale: .3, svgOrigin: "800 1560" }, { keyframes: [{ opacity: 1, scale: 1, duration: .2 }, { opacity: 0, scale: 1.3, duration: .45 }], immediateRender: false }, ${r2(+tQuit + 0.6)});
    tl.set("#s6yo-w", { opacity: 0 }, ${r2(+tQuit + 0.75)}); tl.set("#s6yw-w", { opacity: 1 }, ${r2(+tQuit + 0.75)});
    jump("#s6yw-b", ${r2(+tQuit + 0.8)}, 40, .5);
    tl.fromTo("#s6-board", { scale: 1, svgOrigin: "410 1300" }, { scale: 1.12, svgOrigin: "410 1300", duration: .25, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, ${r2(+tQuit + 1.4)});
    cam("#s6-cam", [{ t: 0, s: 1.0, d: .01 }, { t: ${r2(+tCar - 0.2)}, s: 1.07, x: 40, y: -60, d: .8, e: "power3.out" }, { t: ${r2(+tOffice - 0.2)}, s: 1.0, x: 0, y: 0, d: .6 }]);
  `;
  return { svg, js, reg };
}

// ---------------- Scene 7: ending — home, coins into the digital piggy bank, which asks for a tip ----------------
function scene7(B) {
  const reg = [], t = (a) => r2(a - B);
  const scrA = `${txt(0, -40, "ยอดเงินเก็บ", { size: 34, weight: 700, fill: "#9adfc0" })}${txt(0, 40, "฿3", { size: 84, weight: 900, fill: "#ffffff" })}`;
  const scrB = `${txt(0, -42, "ทิปไหมคะ?", { size: 40, weight: 900, fill: "#ffffff" })}
    ${["18%", "20%", "25%"].map((o, i) => `<rect x="${-120 + i * 82}" y="-8" width="74" height="60" rx="12" fill="${i === 1 ? "#2fa36b" : "#24343f"}" stroke="#5ad0a0" stroke-width="3"/>${txt(-83 + i * 82, 32, o, { size: 26, weight: 900, fill: "#fff" })}`).join("")}`;
  const hand = [[330, 1290], [380, 1250], [430, 1290]];
  const slot = [630, 975];
  const svg = `
    ${bedroomBg()}
    <g id="s7-pig">${piggy(620, 1180, 1.05, { screen: `${g("s7-sA", scrA, hide)}${g("s7-sB", scrB, hide)}<rect id="s7-flash" x="-136" y="-96" width="272" height="192" rx="16" fill="#9adfc0" opacity="0"/>` })}</g>
    ${hero(reg, "s7y", 230, 2040, 1.55, { ...WAITER, expressions: ["worried", "shocked", "neutral"], armL: 10, armR: 10 })}
    <g id="s7-apron">${apron(230, 2040, 1.55)}${bowTie(230, 2040, 1.55)}</g>
    ${hand.map(([x, y], i) => g(`s7-c${i}`, coin(x, y, 30))).join("")}
    ${g("s7-few", comic(400, 1110, "…ไม่กี่เหรียญ", 56, "#ffd166", -6))}
    ${g("s7-ting", comic(900, 900, "ติ๊ง!", 96, "#7ef0c0", 8))}
    ${g("s7-ask", bubble(600, 660, "…ทิปไหมคะ?", { w: 460, size: 56, tail: "center" }))}
  `;
  const tFew = t(73.54), tDrop = t(75.38), tAsk1 = t(76.33), tAsk = t(78.47);
  const js = `
    // tired walk home (apron follows the hero)
    slide("#s7y-w", 0, -420, 0, { d: 1.4, e: "power1.out" }); slide("#s7-apron", 0, -420, 0, { d: 1.4, e: "power1.out" });
    bob("#s7y-b", 0, 1.4, 6, .55); bob("#s7-apron", 0, 1.4, 6, .55);
    // a few coins
    arm("s7y", "R", ${r2(+tFew - 0.1)}, 120, .35);
    ${hand.map(([x, y], i) => `pop("#s7-c${i}", ${r2(+tFew + i * 0.12)}, ${x}, ${y}, { d: .3 });`).join(" ")}
    pop("#s7-few", ${r2(+tFew + 0.5)}, 400, 1110, { d: .35 }); popOut("#s7-few", ${r2(+tDrop - 0.1)}, 400, 1110, { d: .2 });
    // into the piggy bank
    ${hand.map(([x, y], i) => { const at = +tDrop + i * 0.18, dx = slot[0] - x, dy = slot[1] - y;
      return `tl.to("#s7-c${i}", { x: ${dx}, duration: .5, ease: "none" }, ${r2(at)}); tl.to("#s7-c${i}", { keyframes: [{ y: ${dy - 220}, duration: .24, ease: "power2.out" }, { y: ${dy}, duration: .26, ease: "power2.in" }] }, ${r2(at)}); tl.set("#s7-c${i}", { opacity: 0 }, ${r2(at + 0.5)});
    tl.fromTo("#s7-pig", { scaleY: 1, scaleX: 1, svgOrigin: "620 1400" }, { keyframes: [{ scaleY: .95, scaleX: 1.03, duration: .07 }, { scaleY: 1, scaleX: 1, duration: .2, ease: "back.out(3)" }], immediateRender: false }, ${r2(at + 0.5)});`; }).join("\n    ")}
    arm("s7y", "R", ${r2(+tDrop + 0.3)}, 10, .3);
    pop("#s7-ting", ${r2(+tDrop + 0.86)}, 900, 900, { d: .3 }); fadeOut("#s7-ting", ${r2(+tDrop + 1.6)}, .3);
    tl.set("#s7-sA", { opacity: 1 }, ${r2(+tDrop + 0.9)});
    // "แล้วกระปุกก็ถามว่า…" the screen flickers
    tl.fromTo("#s7-flash", { opacity: 0 }, { opacity: .8, duration: .08, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, ${r2(+tAsk1 + 0.6)});
    tl.set("#s7-sA", { opacity: 0 }, ${r2(+tAsk1 + 1.1)});
    face("s7y", "neutral", ${r2(+tAsk1 + 0.3)});
    cam("#s7-cam", [{ t: 0, s: 1.0, d: .01 }, { t: ${tAsk1}, s: 1.06, x: -5, y: 10, d: 2.0, e: "sine.inOut" }, { t: ${r2(+tAsk - 0.05)}, s: 1.14, x: -10, y: 20, d: .35, e: "power3.out" }]);
    // "…ทิปไหมคะ?"
    tl.set("#s7-sB", { opacity: 1 }, ${r2(+tAsk - 0.1)}); tl.fromTo("#s7-flash", { opacity: .9 }, { opacity: 0, duration: .3, immediateRender: false }, ${r2(+tAsk - 0.1)});
    pop("#s7-ask", ${tAsk}, 600, 740, { d: .4 });
    face("s7y", "shocked", ${r2(+tAsk + 0.2)}); jump("#s7y-b", ${r2(+tAsk + 0.2)}, 50, .5); jump("#s7-apron", ${r2(+tAsk + 0.2)}, 50, .5);
    shake("#s7-shk", ${r2(+tAsk + 0.2)}, 8, .3);
  `;
  return { svg, js, reg, noOut: true };
}

const FNS = [scene0, scene1, scene2, scene3, scene4, scene5, scene6, scene7];
const FONT_CSS = ["SemiBold:600", "Bold:700", "ExtraBold:800", "Black:900"].map((f) => { const [n, w] = f.split(":");
  return `@font-face { font-family: Kanit; font-weight: ${w}; font-display: block; src: url("assets/fonts/Kanit-${n}.ttf") format("truetype"); }`; }).join("\n");

mkdirSync(join(proj, "compositions"), { recursive: true });
const clips = [];
for (let i = 0; i < 8; i++) {
  const start = BOUNDS[i], end = i < 7 ? BOUNDS[i + 1] : TOTAL, dur = +(end - start).toFixed(3);
  const sc = FNS[i](start);
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
          ${DEFS}
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
    ${EXTRA}
    ${sc.js}
    blinkAll(${JSON.stringify(ids)}, ${17 + i});
    sceneIO("#${p}-io", { in: ${i > 0}, out: ${!sc.noOut} });
    window.__timelines = window.__timelines || {};
    window.__timelines["${id}"] = tl;
  })();
  </script>
</template>
`;
  writeFileSync(join(proj, "compositions", `${id}.html`), html);
  clips.push(`      <div data-hf-id="hf-clip-${id}" id="${id}" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${start}" data-duration="${dur}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>`);
  console.log("wrote", id, "dur", dur, "chars", ids.length);
}

// ---------------- Subtitles (times from the voice) ----------------
const CUES = [
  [0.05, 3.70, "ถ้าวันหนึ่ง กรุงเทพฯ|ใช้ระบบทิปแบบอเมริกา"],
  [3.75, 5.88, "เงินเดือนเท่าเดิม|แต่ทุกอย่างต้องทิป"],
  [5.91, 7.99, "และนี่คือสิ่งที่จะเกิดขึ้น"],
  [8.73, 9.57, "ทิป 10%"],
  [9.69, 11.10, "กาแฟแก้วแรกของวัน"],
  [11.30, 12.75, "อเมริกาโน่ 55 บาท"],
  [12.90, 14.70, "บาริสต้าหันจอมาให้เลือกทิป"],
  [14.87, 15.95, "คนข้างหลังจ้องอยู่…"],
  [16.15, 17.98, "สุดท้าย กด 20%"],
  [18.82, 20.02, "ทิป 15%"],
  [20.11, 21.45, "พี่วินซิ่งตามงบ"],
  [21.50, 23.00, "ทิปขั้นต่ำ 15%"],
  [23.50, 24.70, "อยากถึงเร็ว เพิ่มอีก 5"],
  [24.87, 27.49, "ทิปน้อย…|พี่วินพาแวะทุกไฟแดง"],
  [28.28, 30.86, "ทิป 18% ร้านอาหารตามสั่ง"],
  [30.85, 32.40, "กะเพราหมูสับ 50 บาท"],
  [32.50, 34.10, "เพิ่มไข่ดาว บวก 10 บาท"],
  [34.15, 35.70, "แล้วก็ทิปอีก 5%"],
  [36.00, 37.25, "ถ้าเลือกความสุกของไข่…"],
  [37.40, 38.17, "บวกอีก 5"],
  [39.20, 42.40, "ทิป 20%|น้ำเปล่าขวดเดียวก็ไม่รอด"],
  [42.50, 44.40, "น้ำ 10 บาท ทิปอีก 2 บาท"],
  [44.55, 46.10, "พนักงานพูดสวัสดีค่ะ"],
  [46.25, 47.35, "บวกอีก 5%"],
  [48.36, 49.58, "ทิป 25%"],
  [49.60, 51.35, "ทั้งเมืองขอทิป"],
  [51.45, 53.40, "แตะบัตรรถไฟฟ้า ประตูขอทิป"],
  [53.45, 55.68, "กดเงินจากตู้ ATM ก็ขอทิป"],
  [55.70, 57.22, "แอปส่งอาหารขอทิป"],
  [57.25, 58.31, "ตั้งแต่ยังไม่ได้สั่ง"],
  [59.11, 60.59, "ทิป 30%"],
  [61.00, 62.20, "ชีวิตเปลี่ยน"],
  [62.40, 64.79, "อาชีพบริการรวยขึ้นทุกวัน"],
  [64.97, 66.97, "ป้าข้าวแกงขับซูเปอร์คาร์"],
  [67.37, 68.45, "ส่วนพนักงานออฟฟิศ…"],
  [68.60, 71.26, "ลาออกไปสมัครเป็น|เด็กเสิร์ฟร้านป้า"],
  [71.59, 73.43, "เลิกงานกลับถึงบ้าน"],
  [73.54, 74.98, "ได้ทิปมาไม่กี่เหรียญ"],
  [75.38, 76.24, "หยอดลงกระปุก"],
  [76.33, 78.13, "แล้วกระปุกก็ถามว่า…"],
  [78.47, 79.19, "…ทิปไหมคะ?"],
];
const seg = new Intl.Segmenter("th", { granularity: "word" });
const visLen = (s) => [...s].filter((ch) => !/[ัิ-ฺ็-๎\s]/.test(ch)).length;
const cues = CUES.map(([s, e, text0], k) => {
  const parts = text0.split("|"); const text = parts.join("");
  const groups = []; let brk = -1;
  parts.forEach((part, pi) => {
    const words = [...seg.segment(part)].map((x) => x.segment); let cur = ""; const pg = [];
    for (const w of words) {
      if (/^\s+$/.test(w)) { if (cur) pg.push(cur); pg.push(" "); cur = ""; continue; }
      cur += w; if (visLen(cur) >= 4) { pg.push(cur); cur = ""; }
    }
    if (cur) { if (pg.length && pg[pg.length - 1] !== " " && visLen(cur) < 3) pg[pg.length - 1] += cur; else pg.push(cur); }
    groups.push(...pg); if (pi === 0 && parts.length > 1) brk = groups.length - 1;
  });
  const total = visLen(text); let acc = 0; const span = (e - s) * 0.88;
  const gt = groups.map((gp) => { const tt = s + span * (acc / Math.max(1, total)); acc += visLen(gp); return +tt.toFixed(3); });
  return { k, s, e, text, groups, gt, brk };
});
cues.forEach((c, i) => { const next = cues[i + 1]; const hold = next ? Math.min(c.e + 0.6, next.s - 0.04) : Math.min(c.e + 1.2, TOTAL - 0.1); c.out = +Math.max(c.e, hold).toFixed(3); });
const escH = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cueHtml = cues.map((c) => {
  let inner = "";
  c.groups.forEach((gp, gi) => { inner += gp === " " ? `<span class="sp"> </span>` : `<span class="wg">${escH(gp)}</span>`; if (gi === c.brk) inner += "<br>"; });
  return `<div class="cue" id="cue-${c.k}"><div class="ln">${inner}</div></div>`;
}).join("\n      ");
const subJs = cues.map((c) => {
  const L = [`tl.set("#cue-${c.k}", { opacity: 1 }, ${Math.max(0, c.s - 0.05).toFixed(3)});`];
  L.push(`tl.fromTo("#cue-${c.k} .ln", { y: 14, scale: .96 }, { y: 0, scale: 1, duration: .18, ease: "power2.out" }, ${Math.max(0, c.s - 0.05).toFixed(3)});`);
  let wi = 0; c.groups.forEach((gp, gi) => { if (gp === " ") return; const tt = c.gt[gi];
    L.push(`tl.fromTo($$("#cue-${c.k} .wg")[${wi}], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .14, ease: "power2.out" }, ${Math.max(0, tt - 0.04).toFixed(3)});`);
    L.push(`tl.fromTo($$("#cue-${c.k} .wg")[${wi}], { color: "#ffd84a" }, { color: "#ffffff", duration: .5, ease: "power1.in", immediateRender: false }, ${(tt + 0.12).toFixed(3)});`);
    wi++; });
  L.push(`tl.set("#cue-${c.k}", { opacity: 0 }, ${c.out.toFixed(3)});`);
  return L.join("\n    ");
}).join("\n    ");
writeFileSync(join(proj, "compositions", "subs.html"), `<template>
  <style>
    ${FONT_CSS}
    #root { position: absolute; inset: 0; overflow: hidden; pointer-events: none; font-family: Kanit, sans-serif; }
    .clip { position: absolute; inset: 0; }
    /* safe area: bottom edge 330px above frame bottom, right 150px kept clear for app icons */
    .cue { position: absolute; left: 50px; width: 860px; bottom: 330px; text-align: center; opacity: 0; }
    .ln { display: inline-block; font-size: 46px; line-height: 1.38; font-weight: 800; color: #fff; padding: 7px 22px 12px; border-radius: 18px;
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
`);
const ts = (x) => { const ms = Math.round(x * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60, z = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(z).padStart(3, "0")}`; };
mkdirSync(join(proj, "renders"), { recursive: true });
writeFileSync(join(proj, "renders", "tip-bangkok-v1.srt"), cues.map((c, i) => `${i + 1}\n${ts(c.s)} --> ${ts(c.out)}\n${c.text0 ?? CUES[i][2].replace("|", "\n")}\n`).join("\n"));

// ---------------- FX: flare + streaks at scene cuts ----------------
writeFileSync(join(proj, "compositions", "fx.html"), `<template>
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
`);

writeFileSync(join(proj, "index.html"), `<!doctype html>
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
      <div data-hf-id="hf-clip-subs" id="subs" data-composition-id="subs" data-composition-src="compositions/subs.html" data-start="0" data-duration="${TOTAL}" data-track-index="3" data-track-kind="captions" data-width="1080" data-height="1920"></div>
      <audio data-hf-id="hf-clip-mix" id="mix" class="clip" src="assets/audio/mix.wav" data-start="0" data-duration="${TOTAL}" data-track-index="4"></audio>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);
writeFileSync(join(proj, "assets/audio/cues.json"), JSON.stringify({ BOUNDS, TOTAL, cues: CUES.map(([s, e, x]) => ({ s, e, text: x.replace("|", " ") })) }, null, 1));
console.log("index.html written:", TOTAL, "s;", cues.length, "subtitle cues");
