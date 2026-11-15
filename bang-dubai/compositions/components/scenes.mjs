// Peak-moment SVG for each บางดูไบ scene (1080x1920).
import { presets } from "../../../shared/flat-people/index.mjs";
import {
  placeChar, timeBadge, txt, asokBg, oilGeyser, heightMarker, vehicle,
  plane, barriers, cautionTape, drillingRig, smellClouds, liveUI, insetMap,
  radioFire, newsChyron, worldNewsFrame, priceTag, stall, geoBoard, stamp,
  opecBadge, ticket, coupon, speechBubble, monument, sparkles, palm,
  vignetteDef, snowflakes, FONT,
} from "./kit.mjs";

const wrap = (id, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><${""}radialGradient id="vignette" cx="50%" cy="45%" r="72%">
    <stop offset=".55" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".4"/>
  </radialGradient></defs>
  ${body}
  <rect x="0" y="0" width="1080" height="1920" fill="url(#vignette)" pointer-events="none"/>
</svg>`;

// vignetteDef used via inline above (avoid unused import lint)

function jamCars(opts = {}) {
  const { shock = false, superOnly = false, oilStain = false } = opts;
  const sedan = [
    ["sedan", 200, 1260, { color: "#c8282f", scale: 0.7, rot: shock ? -18 : -6 }],
    ["taxi", 400, 1248, { color: "#f0c14a", stripe: "#3dca6a", scale: 0.65, rot: shock ? 14 : 4 }],
    ["sedan", 620, 1256, { color: "#2b6ea8", scale: 0.68, rot: shock ? 10 : 2, flip: true }],
    ["bus", 850, 1236, { color: "#e8893a", scale: 0.55, rot: -4 }],
    ["sedan", 160, 1380, { color: "#f07ab0", scale: 0.85, rot: shock ? -22 : -8 }],
    ["taxi", 380, 1368, { color: "#f0c14a", stripe: "#3dca6a", scale: 0.8, rot: shock ? 16 : 6 }],
    ["moto", 530, 1378, { color: "#f26a1b", scale: 0.95, rot: shock ? -30 : -4 }],
    ["sedan", 720, 1370, { color: "#4a7ab5", scale: 0.82, rot: shock ? 12 : 3, flip: true }],
    ["van", 940, 1360, { color: "#8a8a92", scale: 0.75, rot: 6 }],
    ["sedan", 240, 1540, { color: "#3dca6a", scale: 1.05, rot: shock ? -14 : -4 }],
    ["taxi", 500, 1560, { color: "#ff6aa0", scale: 1, rot: shock ? 20 : 5 }],
    ["sedan", 780, 1548, { color: "#f0c14a", scale: 1.05, rot: shock ? 8 : 2, flip: true }],
    ["moto", 120, 1580, { color: "#2a2a32", scale: 1.1, rot: -8 }],
    ["sedan", 160, 1720, { color: "#6a5a9a", scale: 1.2, rot: -3 }],
    ["bus", 500, 1740, { color: "#c45c6a", top: "#f4efe6", scale: 0.95, rot: 2 }],
    ["sedan", 860, 1720, { color: "#2b3a55", scale: 1.15, rot: 5, flip: true }],
  ];
  const supers = [
    ["supercar", 160, 1240, { color: "#c8282f", scale: 0.62, rot: -6 }],
    ["supercar", 340, 1230, { color: "#f0c14a", scale: 0.6, rot: 4 }],
    ["supercar", 520, 1244, { color: "#3d8a6a", scale: 0.62, rot: 2 }],
    ["supercar", 700, 1232, { color: "#4a2c6a", scale: 0.6, rot: -4, flip: true }],
    ["supercar", 880, 1240, { color: "#e8893a", scale: 0.62, rot: 3 }],
    ["supercar", 120, 1330, { color: "#2b6ea8", scale: 0.78, rot: -8 }],
    ["supercar", 310, 1320, { color: "#f07ab0", scale: 0.76, rot: 6 }],
    ["supercar", 500, 1336, { color: "#1a1a20", scale: 0.78, rot: 3 }],
    ["supercar", 690, 1324, { color: "#d4a017", scale: 0.76, rot: -5, flip: true }],
    ["supercar", 880, 1330, { color: "#c8282f", scale: 0.78, rot: 5 }],
    ["supercar", 90, 1440, { color: "#3dca6a", scale: 0.95, rot: -4 }],
    ["supercar", 300, 1450, { color: "#7ec8ff", scale: 0.92, rot: 5 }],
    ["supercar", 510, 1436, { color: "#8e1d24", scale: 0.95, rot: 2 }],
    ["supercar", 720, 1458, { color: "#f0c14a", scale: 0.94, rot: -3, flip: true }],
    ["supercar", 930, 1444, { color: "#4a2c6a", scale: 0.92, rot: 4 }],
    ["supercar", 70, 1570, { color: "#e8893a", scale: 1.12, rot: -5 }],
    ["supercar", 300, 1580, { color: "#2b6ea8", scale: 1.1, rot: 4 }],
    ["supercar", 530, 1564, { color: "#c8282f", scale: 1.12, rot: 2 }],
    ["supercar", 760, 1588, { color: "#3d8a6a", scale: 1.1, rot: -4, flip: true }],
    ["supercar", 980, 1570, { color: "#1a1a20", scale: 1.08, rot: 5 }],
    ["supercar", 40, 1710, { color: "#f07ab0", scale: 1.28, rot: -3 }],
    ["supercar", 280, 1724, { color: "#d4a017", scale: 1.25, rot: 2 }],
    ["supercar", 520, 1710, { color: "#7ec8ff", scale: 1.28, rot: 3 }],
    ["supercar", 760, 1730, { color: "#8e1d24", scale: 1.26, rot: -2, flip: true }],
    ["supercar", 1000, 1716, { color: "#f0c14a", scale: 1.24, rot: 4 }],
  ];
  const list = superOnly ? supers : sedan;
  return list.map(([k, x, y, o]) => vehicle(k, x, y, o)).join("") +
    (oilStain ? `<ellipse cx="540" cy="1500" rx="240" ry="80" fill="#0c0c10" opacity=".45"/>` : "");
}

export function scene0() {
  const body = `
    ${asokBg({ time: "morning", prefix: "s0", trainX: 240 })}
    ${jamCars({ shock: true })}
    ${oilGeyser({ x: 540, y: 1480, h: 740, prefix: "s0oil" })}
    ${heightMarker(330, 1480, 700, "สูงเท่าตึก 3 ชั้น")}
    <!-- dust -->
    <ellipse cx="540" cy="1460" rx="280" ry="70" fill="#c8b898" opacity=".35"/>
    <ellipse cx="400" cy="1420" rx="80" ry="30" fill="#d8c8b0" opacity=".3"/>
    <ellipse cx="700" cy="1430" rx="90" ry="34" fill="#d8c8b0" opacity=".3"/>
    <!-- pedestrians fleeing / shocked -->
    ${placeChar({ ...presets.officeMale, id: "s0om", expression: "shocked", armL: 70, armR: 70 }, 150, 1860, 0.85)}
    ${placeChar({ ...presets.officeFemale, id: "s0of", expression: "shocked", armL: 80, armR: 50, holdR: "phone" }, 280, 1880, 0.8)}
    ${placeChar({ ...presets.influencer, id: "s0inf", expression: "shocked", armL: 20, armR: 150, holdR: "phone" }, 820, 1870, 0.82)}
    ${placeChar({ ...presets.winMale, id: "s0win", expression: "worried", helmet: "moto", vest: true, holdR: undefined, armL: 30, armR: 40 }, 960, 1860, 0.78)}
    ${timeBadge("เช้าวันจันทร์", { id: "s0tb", y: 120 })}
    ${txt(540, 200, "แยกอโศกมนตรี", { size: 28, weight: 600, fill: "#3a2a18" })}
  `;
  return wrap("s0", body);
}

export function scene1() {
  const body = `
    ${asokBg({ time: "day", prefix: "s1", trainX: 320 })}
    ${jamCars({ shock: false, oilStain: true })}
    ${oilGeyser({ x: 540, y: 1460, h: 680, prefix: "s1oil" })}
    ${smellClouds([[280, 900, 90, 0.4], [760, 860, 110, 0.45], [500, 700, 70, 0.3], [200, 1100, 80, 0.35], [900, 1080, 70, 0.3]])}
    ${timeBadge("1 ชั่วโมงแรก", { id: "s1tb" })}
    <!-- people mid-foreground; insets sit in a clear bottom row -->
    ${placeChar({ ...presets.influencer, id: "s1inf", expression: "smile", armL: 16, armR: 155, holdR: "selfie" }, 160, 1640, 0.95)}
    ${placeChar({ ...presets.officeMale, id: "s1om", expression: "shocked", armL: 20, armR: 145, holdR: "phone" }, 360, 1650, 0.86)}
    ${placeChar({ ...presets.officeFemale, id: "s1of", expression: "worried", armL: 140, armR: 20, holdL: "phone" }, 520, 1636, 0.84)}
    ${liveUI({ x: 840, y: 1420, caption: "อโศกเดือด! น้ำพุโคล่าผุดกลางกรุง" })}
    ${insetMap({ x: 200, y: 1810 })}
    ${radioFire({ x: 540, y: 1810 })}
  `;
  return wrap("s1", body);
}

export function scene2() {
  const body = `
    ${asokBg({ time: "day", prefix: "s2", trainX: 80 })}
    ${oilGeyser({ x: 540, y: 1420, h: 600, prefix: "s2oil", crown: true })}
    ${vehicle("fire", 220, 1320, { scale: 1.15, rot: -8 })}
    ${barriers(20, 1400, 3, 1.1)}
    ${cautionTape(20, 1420, 1040, 1520)}
    ${cautionTape(40, 1600, 1000, 1540)}
    ${barriers(860, 1420, 3, 1.1)}
    <!-- ground props: gallons, bottles, curry bags around the pool -->
    ${vehicle("moto", 100, 1580, { color: "#f26a1b", scale: 1.1, rot: -20 })}
    <g class="ground-props">
      <g transform="translate(430 1520)">${''}
        <rect x="0" y="0" width="44" height="56" rx="5" fill="#d4542a"/><rect x="14" y="-10" width="16" height="12" fill="#2a1b17"/>
      </g>
      <g transform="translate(490 1540) rotate(-12)">
        <rect x="0" y="0" width="44" height="56" rx="5" fill="#f0c14a"/><rect x="14" y="-10" width="16" height="12" fill="#2a1b17"/>
      </g>
      <g transform="translate(620 1530)">
        <path d="M-16 0 L-20 44 Q0 52 20 44 L16 0 Z" fill="#4aa06a" opacity=".85"/>
        <path d="M-14 8 L-16 36 Q0 42 16 36 L14 8 Z" fill="#0a0a0c" opacity=".75"/>
      </g>
      <g transform="translate(680 1550) rotate(8)">
        <rect x="-8" y="0" width="16" height="36" rx="4" fill="#c8282f"/>
        <rect x="-6" y="-12" width="12" height="14" rx="3" fill="#f4efe6"/>
      </g>
    </g>
    <!-- scoopers around the oil pool -->
    ${placeChar({ ...presets.winMale, id: "s2w1", expression: "smile", armL: 20, armR: 28, holdR: "gallon" }, 280, 1580, 0.82)}
    ${placeChar({ gender: "male", hair: "short", outfit: "shirt", shirtColor: "#4a7ab5", pantsColor: "#2b3142", id: "s2m1", expression: "smile", armL: 24, armR: 30, holdR: "bottle" }, 430, 1600, 0.78)}
    ${placeChar({ gender: "female", hair: "pony", outfit: "shirt", shirtColor: "#e8893a", skirt: true, skirtColor: "#4a2a1e", id: "s2f1", expression: "smile", armL: 20, armR: 35, holdR: "bag" }, 720, 1590, 0.78)}
    ${placeChar({ ...presets.winMale, id: "s2w2", expression: "smirk", helmetColor: "#2c3a4a", armL: 30, armR: 22, holdR: "gallon", shirtColor: "#2a2a32" }, 880, 1600, 0.8)}
    ${placeChar({ ...presets.auntie, id: "s2au", expression: "smile", armL: 10, armR: 55, holdR: "incense" }, 180, 1840, 0.95)}
    <!-- incense smoke -->
    <g class="incense-smoke" transform="translate(230 1640)" opacity=".7">
      <path d="M0 0 Q-12 -30 4 -50 Q16 -70 0 -96" fill="none" stroke="#c8c8d0" stroke-width="6" stroke-linecap="round"/>
      <path d="M8 0 Q20 -36 2 -64" fill="none" stroke="#d8d0c8" stroke-width="4" stroke-linecap="round" opacity=".8"/>
    </g>
    ${placeChar({ ...presets.officer, id: "s2of", expression: "angry", armL: 110, armR: 12, holdL: "megaphone", holdR: undefined }, 880, 1868, 1.02)}
    ${speechBubble(620, 1680, "อย่าจุดไฟโว้ยยย!", { dir: "right", w: 360 })}
    ${timeBadge("3 ชั่วโมงต่อมา", { id: "s2tb" })}
    ${newsChyron("น้ำมันดิบเกรดพรีเมียม", { kicker: "ข่าวด่วน" })}
  `;
  return wrap("s2", body);
}

export function scene3() {
  const body = `
    ${asokBg({ time: "dusk", prefix: "s3", trainX: 400 })}
    ${oilGeyser({ x: 700, y: 1320, h: 420, prefix: "s3oil", splash: false, mist: true })}
    ${plane(200, 360, 1.15, -16)}
    ${placeChar({ ...presets.businessGulf, id: "s3g1", expression: "smirk", armL: 12, armR: 8, holdL: "briefcase" }, 260, 1280, 0.72)}
    ${placeChar({ ...presets.businessGulf, id: "s3g2", expression: "smile", keffiyehAccent: "#1a1a20", shirtColor: "#f4efe6", armL: 14, armR: 10, holdL: "briefcase" }, 400, 1300, 0.7)}
    ${placeChar({ ...presets.businessGulf, id: "s3g3", expression: "neutral", keffiyehColor: "#e8d8c8", keffiyehAccent: "#4a2a1a", armR: 20, holdL: "briefcase" }, 180, 1360, 0.78)}
    ${priceTag({ x: 860, y: 620, text: "10 ล้าน/ตร.ว." })}
    ${stall(240, 1580, { sign: "ก๋วยเตี๋ยวเรือ", sign2: "บ่อน้ำมัน", color: "#c8282f", w: 300 })}
    ${stall(760, 1580, { sign: "ชานมไข่มุก", sign2: "แบล็คโกลด์", color: "#1a1208", pot: "#3a2a20", w: 300 })}
    ${placeChar({ ...presets.vendorFemale, id: "s3v1", expression: "smile", armL: 20, armR: 40 }, 320, 1660, 0.62)}
    ${placeChar({ ...presets.vendorFemale, id: "s3v2", expression: "smile", hair: "bob", shirtColor: "#5b6b4a", armL: 16, armR: 30 }, 840, 1660, 0.62)}
    ${placeChar({ ...presets.touristMale, id: "s3q3", expression: "smile", holdR: undefined, armL: 8, armR: 8 }, 80, 1860, 0.7)}
    ${placeChar({ ...presets.officeMale, id: "s3q1", expression: "smile", lanyard: false, necktie: "#2b3a55", armL: 8, armR: 8 }, 200, 1868, 0.7)}
    ${placeChar({ ...presets.officeFemale, id: "s3q2", expression: "smile", armL: 8, armR: 8 }, 320, 1856, 0.66)}
    ${placeChar({ ...presets.touristFemale, id: "s3q4", expression: "smile", holdR: "phone", armR: 140 }, 500, 1864, 0.68)}
    ${placeChar({ gender: "male", hair: "short", shirtColor: "#2b3142", pantsColor: "#1a1a20", id: "s3q5", expression: "smile" }, 640, 1868, 0.7)}
    ${placeChar({ ...presets.influencer, id: "s3q6", expression: "smile", holdR: undefined, armL: 8, armR: 8, shirtColor: "#e07a9a" }, 960, 1856, 0.66)}
    ${worldNewsFrame({ headline: "Bangkok: The New Dubai of Asia" })}
    ${timeBadge("12 ชั่วโมงต่อมา", { id: "s3tb", y: 150 })}
  `;
  return wrap("s3", body);
}

export function scene4() {
  const body = `
    ${asokBg({ time: "day", prefix: "s4", trainX: 280, rig: true })}
    ${drillingRig({ x: 640, y: 1420, h: 1000, prefix: "s4rig" })}
    <!-- closeness callout between train and derrick -->
    <g transform="translate(470 820)">
      <path d="M0 -28 L8 -8 L28 -8 L12 4 L18 24 L0 12 L-18 24 L-12 4 L-28 -8 L-8 -8 Z" fill="#c8282f"/>
      ${txt(0, 8, "เฉียดฉิว!", { size: 20, weight: 800, fill: "#fff" })}
    </g>
    ${geoBoard({ x: 250, y: 1080 })}
    ${placeChar({ ...presets.geologist, id: "s4geo", expression: "worried", armL: 16, armR: 70, holdR: "pointer" }, 180, 1700, 0.9)}
    ${placeChar({ ...presets.touristFemale, id: "s4t1", expression: "smile", armL: 20, armR: 145, holdR: "phone" }, 400, 1860, 0.85)}
    ${placeChar({ ...presets.touristMale, id: "s4t2", expression: "smile", armL: 140, armR: 20, holdL: "phone" }, 560, 1872, 0.88)}
    ${placeChar({ ...presets.influencer, id: "s4t3", expression: "smile", armL: 12, armR: 155, holdR: "selfie" }, 900, 1868, 0.9)}
    ${stamp("ภาวะฉุกเฉินทางเศรษฐกิจ", { x: 860, y: 250, rot: -14 })}
    ${timeBadge("3 วันต่อมา", { id: "s4tb" })}
  `;
  return wrap("s4", body);
}

export function scene5() {
  const body = `
    ${asokBg({ time: "day", prefix: "s5", trainX: 500 })}
    ${jamCars({ superOnly: true })}
    ${opecBadge({ x: 200, y: 340 })}
    ${ticket(540, 340, { title: "BTS / MRT", sub: "ฟรีตลอดชีพ", color: "#3d8a6a" })}
    ${ticket(860, 360, { title: "คูปองน้ำมัน", sub: "10,000 บาท", color: "#2b6ea8" })}
    ${[ [120,520,18,0.9], [300,600,-14,1], [500,520,10,0.85], [700,580,-22,1.05], [900,520,8,0.9],
        [160,720,-8,0.8], [420,700,16,1], [640,740,-12,0.95], [840,700,20,0.85], [980,640,-6,0.8],
        [80,640,12,0.7], [760,620,-18,0.75] ].map(([x,y,r,s]) => coupon(x,y,r,s)).join("")}
    <!-- bored drivers standing by / in the jam -->
    ${placeChar({ ...presets.officeMale, id: "s5d1", expression: "angry", necktie: "#2a1b17", lanyard: false, armL: 8, armR: 8 }, 120, 1868, 0.85)}
    ${placeChar({ gender: "male", hair: "short", outfit: "shirt", shirtColor: "#f4efe6", pantsColor: "#1a1a20", id: "s5d2", expression: "smirk", armL: 16, armR: 6 }, 300, 1880, 0.8)}
    ${placeChar({ ...presets.officeFemale, id: "s5d3", expression: "worried", armL: 10, armR: 10, lanyard: false }, 720, 1860, 0.82)}
    ${placeChar({ gender: "female", hair: "long", outfit: "shirt", shirtColor: "#c8282f", pantsColor: "#1a1a20", id: "s5d4", expression: "angry", armL: 8, armR: 8 }, 900, 1872, 0.84)}
    ${txt(540, 1120, "สุขุมวิท รถติดเป็นตังเม", { size: 32, weight: 800, fill: "#f7efe2", stroke: "#1a1208", sw: 8 })}
    ${timeBadge("1 เดือนต่อมา", { id: "s5tb" })}
  `;
  return wrap("s5", body);
}

export function scene6() {
  const body = `
    ${asokBg({ time: "gold", prefix: "s6", trainX: 160, goldCity: true, park: true })}
    ${palm(70, 1480, 1.25)} ${palm(200, 1560, 1.0)}
    ${monument({ x: 780, y: 1480, scale: 1.25 })}
    ${vehicle("tuktuk-gold", 300, 1760, { scale: 1.85, rot: -6 })}
    ${snowflakes(330, 1620)}
    ${snowflakes(380, 1640)}
    ${placeChar({ ...presets.touristFemale, id: "s6t1", expression: "smile", armL: 12, armR: 145, holdR: "phone" }, 120, 1868, 0.78)}
    ${placeChar({ ...presets.touristMale, id: "s6t2", expression: "smile", armL: 8, armR: 8 }, 520, 1860, 0.82)}
    ${placeChar({ ...presets.businessGulf, id: "s6g", expression: "smile", holdL: "briefcase", armL: 14 }, 960, 1868, 0.85)}
    ${sparkles([[200,400,10],[360,260,8],[500,180,12],[640,300,7],[800,220,11],[940,360,8],[180,700,6],[860,600,9],[540,80,8],[1000,800,7],[60,500,6]])}
    ${txt(540, 1160, "ยินดีต้อนรับสู่", { size: 36, weight: 700, fill: "#fff0c0", stroke: "#5a2060", sw: 8 })}
    ${txt(540, 1240, "บางดูไบ", { size: 86, weight: 900, fill: "#f0c14a", stroke: "#3a1808", sw: 10 })}
    ${timeBadge("1 ปีต่อมา", { id: "s6tb" })}
  `;
  return wrap("s6", body);
}

export function scene7() {
  const body = `
    <defs>
      <linearGradient id="s7bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1a0e08"/><stop offset=".5" stop-color="#0c0806"/><stop offset="1" stop-color="#1a1208"/>
      </linearGradient>
      <radialGradient id="s7glow" cx="50%" cy="42%" r="50%">
        <stop offset="0" stop-color="#c89020" stop-opacity=".45"/>
        <stop offset="1" stop-color="#c89020" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#s7bg)"/>
    <path d="M0 620 L40 540 L90 580 L140 480 L200 560 L260 400 L300 520 L360 360 L400 500 L460 320 L500 480 L540 280 L580 480 L640 340 L700 520 L760 400 L820 540 L880 460 L940 560 L1080 500 L1080 700 L0 700 Z" fill="#2a1a0c" opacity=".55"/>
    <ellipse cx="540" cy="740" rx="360" ry="240" fill="url(#s7glow)"/>
    ${monument({ x: 540, y: 920, scale: 1.45 })}
    ${sparkles([[300,520,8],[740,500,7],[540,340,12],[400,420,6],[700,400,6],[200,720,5],[880,740,5],[160,400,5],[920,380,6]])}
    <line x1="200" y1="1160" x2="880" y2="1160" stroke="#d8a64a" stroke-width="2" opacity=".7"/>
    ${txt(540, 1240, "เมืองที่รถติดที่สุดในโลก…", { size: 36, weight: 700, fill: "#e2c7ae" })}
    ${txt(540, 1300, "เคยพลิกชีวิต", { size: 36, weight: 700, fill: "#e2c7ae" })}
    ${txt(540, 1360, "เพราะบ่อน้ำมันกลางสี่แยก", { size: 36, weight: 700, fill: "#e2c7ae" })}
    <line x1="200" y1="1420" x2="880" y2="1420" stroke="#d8a64a" stroke-width="2" opacity=".7"/>
    ${txt(540, 1560, "บางดูไบ", { size: 110, weight: 900, fill: "#f0c14a" })}
    ${txt(540, 1640, "BANG-DUBAI", { size: 28, weight: 600, fill: "#e2c7ae" })}
  `;
  return wrap("s7", body);
}

export const SCENES = [
  { id: "scene-0", title: "เช้าวันจันทร์", duration: 8, start: 0, fn: scene0 },
  { id: "scene-1", title: "1 ชั่วโมงแรก", duration: 10, start: 8, fn: scene1 },
  { id: "scene-2", title: "3 ชั่วโมงต่อมา", duration: 10, start: 18, fn: scene2 },
  { id: "scene-3", title: "12 ชั่วโมงต่อมา", duration: 10, start: 28, fn: scene3 },
  { id: "scene-4", title: "3 วันต่อมา", duration: 10, start: 38, fn: scene4 },
  { id: "scene-5", title: "1 เดือนต่อมา", duration: 10, start: 48, fn: scene5 },
  { id: "scene-6", title: "1 ปีต่อมา", duration: 10, start: 58, fn: scene6 },
  { id: "scene-7", title: "บางดูไบ", duration: 7, start: 68, fn: scene7 },
];
