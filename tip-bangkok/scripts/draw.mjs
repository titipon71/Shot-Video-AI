// ถ้ากรุงเทพฯ มีระบบทิปแบบอเมริกา — shared SVG drawing (storyboard + later the video).
// Builds on the บางดูไบ scene kit (Asok street, vehicles, flat-cartoon people) so the series looks the same.
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
export { placeChar, txt, asokBg, vehicle, stall, timeBadge, esc } from "../../bang-dubai/compositions/components/kit.mjs";
export { presets } from "../../shared/flat-people/index.mjs";
import { txt, esc } from "../../bang-dubai/compositions/components/kit.mjs";

export const proj = join(dirname(fileURLToPath(import.meta.url)), "..");
export const repo = join(proj, "..");
export const f1 = (n) => +n.toFixed(1);

// The tablet that asks for a tip. Centre (x, y), width 420 * s. pick = index of the highlighted button (or -1).
export function tipScreen(x, y, s = 1, { title = "เพิ่มทิปไหมคะ?", opts = ["18%", "20%", "25%"], pick = 1, rot = 0, sub = "" } = {}) {
  const W = 420, H = 300;
  const bw = 112, gap = 14, bx0 = -((bw * 3 + gap * 2) / 2);
  return `<g class="tip-screen" transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <rect x="${-W / 2 - 4}" y="${-H / 2 + 14}" width="${W + 8}" height="${H}" rx="30" fill="#000" opacity=".28"/>
    <rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" rx="28" fill="#1c1c22"/>
    <rect x="${-W / 2 + 16}" y="${-H / 2 + 16}" width="${W - 32}" height="${H - 32}" rx="16" fill="#fbf8f2"/>
    ${txt(0, -H / 2 + 72, title, { size: 34, weight: 800, fill: "#1c1c22" })}
    ${sub ? txt(0, -H / 2 + 104, sub, { size: 22, weight: 600, fill: "#7a7068" }) : ""}
    ${opts.map((o, i) => {
      const bx = bx0 + i * (bw + gap), on = i === pick;
      return `<rect x="${bx}" y="-10" width="${bw}" height="86" rx="16" fill="${on ? "#2fa36b" : "#ffffff"}" stroke="${on ? "#2fa36b" : "#d9d2c8"}" stroke-width="4"/>
        ${txt(bx + bw / 2, 48, o, { size: 38, weight: 900, fill: on ? "#ffffff" : "#1c1c22" })}`;
    }).join("")}
    ${txt(0, H / 2 - 40, "กำหนดเอง", { size: 22, weight: 700, fill: "#2fa36b" })}
    ${txt(0, H / 2 - 18, "ไม่ทิป", { size: 13, weight: 500, fill: "#c4bdb4" })}
  </g>`;
}

// Chapter card, same idea as บางดูไบ's time badge but bigger: "ทิป 15%" + a short label.
export function tipBadge(pct, label, { x = 540, y = 210 } = {}) {
  return `<g class="tip-badge" transform="translate(${x} ${y})" filter="url(#tbShadow)">
    <rect x="-300" y="-92" width="600" height="184" rx="34" fill="#1a1208" stroke="#d8a64a" stroke-width="6"/>
    <rect x="-286" y="-80" width="572" height="10" rx="4" fill="#d8a64a" opacity=".4"/>
    ${txt(0, 14, `ทิป ${pct}%`, { size: 104, weight: 900, fill: "#ffd166" })}
    ${txt(0, 66, label, { size: 38, weight: 700, fill: "#f7efe2" })}
  </g>`;
}

// Running "tips today" counter in the top-right corner.
export function tipCounter(amount, { x = 900, y = 420 } = {}) {
  return `<g class="tip-counter" transform="translate(${x} ${y})">
    <rect x="-150" y="-46" width="300" height="92" rx="22" fill="#fff8ec" stroke="#1a1208" stroke-width="5"/>
    ${txt(0, -10, "ค่าทิปวันนี้", { size: 26, weight: 700, fill: "#7a5a3a" })}
    ${txt(0, 32, `฿${amount}`, { size: 44, weight: 900, fill: "#c8282f" })}
  </g>`;
}

export function bubble(x, y, text, { w = 420, size = 34, tail = "left", fill = "#fffaf2" } = {}) {
  const h = size * 2.4;
  const t = tail === "left" ? `M${-w / 2 + 50} ${h / 2 - 4} L${-w / 2 + 20} ${h / 2 + 46} L${-w / 2 + 100} ${h / 2 - 4} Z`
    : tail === "right" ? `M${w / 2 - 50} ${h / 2 - 4} L${w / 2 - 20} ${h / 2 + 46} L${w / 2 - 100} ${h / 2 - 4} Z`
    : `M-30 ${h / 2 - 4} L0 ${h / 2 + 46} L30 ${h / 2 - 4} Z`;
  return `<g transform="translate(${x} ${y})" filter="url(#tbShadow)">
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="#1a1208" stroke-width="5"/>
    <path d="${t}" fill="${fill}" stroke="#1a1208" stroke-width="5" stroke-linejoin="round"/>
    <rect x="${-w / 2 + 40}" y="${h / 2 - 12}" width="${w - 80}" height="10" fill="${fill}"/>
    ${txt(0, size * 0.36, text, { size, weight: 800, fill: "#1a1208" })}
  </g>`;
}

export const comic = (x, y, s, size = 90, fill = "#ffd166", rot = -6) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})">${txt(0, 0, s, { size, weight: 900, fill, stroke: "#1a1208", sw: size / 6.5 })}</g>`;

export const heading = (lines, { y = 250, size = 92, fill = "#ffffff" } = {}) =>
  lines.map((l, i) => txt(540, y + i * size * 1.15, l, { size, weight: 900, fill, stroke: "#1a1208", sw: size / 6 })).join("");

// Coins and money
export const coin = (x, y, r = 22) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#e8b53a" stroke="#a87418" stroke-width="${r / 6}"/><circle r="${r * 0.62}" fill="none" stroke="#fff0b8" stroke-width="${r / 9}" opacity=".7"/>${txt(0, r * 0.36, "฿", { size: r * 1.05, weight: 900, fill: "#a87418" })}</g>`;
export function coinBag(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-70 -40 Q-100 60 -60 100 L60 100 Q100 60 70 -40 Z" fill="#c9a36a" stroke="#6a4a2a" stroke-width="6"/>
    <path d="M-50 -40 Q0 -70 50 -40 L40 -60 Q0 -80 -40 -60 Z" fill="#a8844a" stroke="#6a4a2a" stroke-width="6"/>
    <rect x="-48" y="-56" width="96" height="16" rx="6" fill="#c8282f"/>
    ${txt(0, 52, "฿", { size: 84, weight: 900, fill: "#6a4a2a" })}
  </g>`;
}

// Interiors and props -----------------------------------------------------------------
export function cafeBg() {
  return `<rect width="1080" height="1920" fill="#f1dfc6"/>
    <rect y="0" width="1080" height="120" fill="#4a2f22"/>
    ${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${140 + i * 200} 120)"><path d="M0 0 L0 70" stroke="#2a1b17" stroke-width="4"/><path d="M-36 70 L36 70 L22 104 L-22 104 Z" fill="#f0c14a"/><circle cy="110" r="10" fill="#fff4c8"/></g>`).join("")}
    <rect x="60" y="400" width="560" height="400" rx="20" fill="#2c3a33" stroke="#8a6a4a" stroke-width="12"/>
    ${txt(340, 470, "เมนู", { size: 50, weight: 900, fill: "#f7efe2" })}
    ${[["อเมริกาโน่", "55"], ["ลาเต้", "65"], ["มอคค่า", "70"], ["ชาไทย", "50"]].map(([n, p], i) => `${txt(110, 545 + i * 62, n, { size: 40, weight: 700, fill: "#f7efe2", anchor: "start" })}${txt(570, 545 + i * 62, p, { size: 40, weight: 700, fill: "#ffd166", anchor: "end" })}`).join("")}
    <g transform="translate(860 700)"><circle r="120" fill="#6a4128"/><circle r="96" fill="#f4e6d0"/>${txt(0, 18, "COFFEE", { size: 40, weight: 900, fill: "#6a4128" })}</g>
    <rect x="0" y="1240" width="1080" height="680" fill="#c99b6a"/>`;
}
export const cafeCounter = () => `<rect x="0" y="1320" width="1080" height="600" fill="#6a4128"/><rect x="0" y="1300" width="1080" height="40" fill="#8a5a38"/>
  <g transform="translate(980 1180)"><rect x="-90" y="0" width="180" height="120" rx="10" fill="#9aa4aa"/><rect x="-70" y="20" width="140" height="40" rx="6" fill="#2a2a30"/><rect x="-40" y="100" width="20" height="26" fill="#2a2a30"/><rect x="20" y="100" width="20" height="26" fill="#2a2a30"/></g>
  <g transform="translate(120 1250)"><path d="M-30 0 L30 0 L24 50 L-24 50 Z" fill="#fff"/><path d="M30 12 Q52 12 50 30 Q48 44 28 40" fill="none" stroke="#fff" stroke-width="8"/><ellipse cy="2" rx="28" ry="6" fill="#4a2a1a"/></g>`;

export function storeFront() {
  return `<rect width="1080" height="1920" fill="#e9eef2"/>
    <rect x="0" y="0" width="1080" height="330" fill="#1f7a8c"/>
    <rect x="0" y="330" width="1080" height="34" fill="#f28c28"/>
    ${txt(540, 438, "ร้านสะดวกซื้อ 24 ชม.", { size: 56, weight: 900, fill: "#1f7a8c" })}
    ${[0, 1, 2].map((r) => `<rect x="60" y="${600 + r * 150}" width="960" height="18" fill="#b8c2ca"/>${[...Array(12)].map((_, i) => `<rect x="${80 + i * 78}" y="${528 + r * 150}" width="56" height="72" rx="6" fill="${["#c8282f", "#2b6ea8", "#f0c14a", "#3dca6a", "#e07a9a", "#ffffff"][(i + r) % 6]}"/>`).join("")}`).join("")}
    <rect x="0" y="1200" width="1080" height="720" fill="#d6dde3"/>`;
}
export const storeCounter = () => `<rect x="0" y="1340" width="1080" height="580" fill="#f4f6f8"/><rect x="0" y="1320" width="1080" height="36" fill="#1f7a8c"/>
  <rect x="0" y="1356" width="1080" height="14" fill="#f28c28"/>
  <g transform="translate(240 1250)"><rect x="-20" y="-30" width="40" height="100" rx="12" fill="#bfe6ff" opacity=".9"/><rect x="-14" y="-48" width="28" height="22" rx="4" fill="#2b6ea8"/><rect x="-20" y="10" width="40" height="26" fill="#2b6ea8"/></g>
  ${txt(240, 1210, "฿10", { size: 40, weight: 900, fill: "#c8282f" })}`;

// Made-to-order stir-fry stall (ร้านตามสั่ง) seen from the front: counter with a sign panel, wok on a burner, plate of kaprao + egg.
export function kapraoCart(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="12" rx="300" ry="24" fill="#000" opacity=".3"/>
    <rect x="-260" y="-260" width="520" height="260" rx="14" fill="#a8743f"/>
    <rect x="-280" y="-280" width="560" height="34" rx="10" fill="#c9d3da"/>
    <rect x="-220" y="-220" width="440" height="140" rx="16" fill="#c8282f" stroke="#f0c14a" stroke-width="8"/>
    ${txt(0, -128, "อาหารตามสั่ง", { size: 66, weight: 900, fill: "#fff8ec" })}
    <circle cx="-210" cy="0" r="30" fill="#2a2a30"/><circle cx="210" cy="0" r="30" fill="#2a2a30"/>
    <g transform="translate(-130 -282)">
      <path d="M-34 0 L-44 -26 L44 -26 L34 0 Z" fill="#3a3a42"/>
      <path d="M-100 -30 Q0 40 100 -30 Z" fill="#2a2a30"/><path d="M100 -32 L170 -60" stroke="#6a4128" stroke-width="14" stroke-linecap="round"/>
      <path d="M-60 -40 Q-50 -80 -30 -50 M0 -44 Q14 -90 26 -52 M50 -40 Q64 -76 76 -48" stroke="#fff" stroke-width="6" fill="none" opacity=".6" stroke-linecap="round"/>
    </g>
    <g transform="translate(140 -296)">
      <ellipse rx="86" ry="22" fill="#f4efe6"/>
      <ellipse cx="-24" cy="-8" rx="46" ry="14" fill="#fff"/><path d="M14 -6 Q40 -24 64 -6 Q40 4 14 -6 Z" fill="#7a4a2a"/><circle cx="34" cy="-12" r="5" fill="#3a8a3a"/><circle cx="48" cy="-8" r="5" fill="#3a8a3a"/>
      <ellipse cx="-30" cy="-26" rx="44" ry="18" fill="#ffffff"/><circle cx="-26" cy="-28" r="13" fill="#f6a623"/><path d="M-70 -24 Q-74 -32 -64 -36" stroke="#c98a3a" stroke-width="4" fill="none"/>
    </g>
  </g>`;
}

// Shophouse ร้านตามสั่ง interior: white tiled wall, drinks fridge, stainless kitchen counter with gas stove + wok, tiled floor.
export function shophouseBg() {
  const tiles = [];
  for (let y = 120; y < 1300; y += 60) tiles.push(`M0 ${y} L1080 ${y}`);
  for (let x = 0; x <= 1080; x += 60) tiles.push(`M${x} 120 L${x} 1300`);
  const floor = [];
  for (let y = 1300; y < 1920; y += 90) floor.push(`M0 ${y} L1080 ${y}`);
  for (let x = -540; x <= 1620; x += 120) floor.push(`M${540 + (x - 540) * 0.45} 1300 L${x} 1920`);
  return `<rect width="1080" height="1920" fill="#f4f1ea"/>
    <path d="${tiles.join(" ")}" stroke="#d9d4ca" stroke-width="3"/>
    <rect x="0" y="0" width="1080" height="120" fill="#c8282f"/><rect x="0" y="112" width="1080" height="10" fill="#f0c14a"/>
    <rect x="0" y="1300" width="1080" height="620" fill="#c9cdd2"/><path d="${floor.join(" ")}" stroke="#b2b7bd" stroke-width="4"/>
    <g transform="translate(905 560)">
      <rect x="0" y="0" width="175" height="700" rx="10" fill="#d23a3a"/><rect x="14" y="40" width="147" height="620" rx="6" fill="#bfe3f2" opacity=".9"/>
      ${[0, 1, 2, 3].map((r) => `<rect x="14" y="${190 + r * 150}" width="147" height="8" fill="#8ab0c4"/>${[0, 1, 2, 3].map((c) => `<rect x="${24 + c * 34}" y="${118 + r * 150}" width="22" height="70" rx="6" fill="${["#2b6ea8", "#3dca6a", "#c8282f", "#f0c14a"][(c + r) % 4]}"/>`).join("")}`).join("")}
      ${txt(88, 30, "COLD", { size: 26, weight: 900, fill: "#fff" })}
    </g>
    <rect x="480" y="1150" width="600" height="150" fill="#b9c1c8"/><rect x="480" y="1140" width="600" height="20" rx="6" fill="#dfe4e8"/>
    <g transform="translate(600 1140)"><rect x="-70" y="-22" width="140" height="22" rx="4" fill="#3a3a42"/>
      <path d="M-110 -26 Q0 50 110 -26 Z" fill="#2a2a30"/><path d="M110 -28 L180 -60" stroke="#6a4128" stroke-width="14" stroke-linecap="round"/>
      <path d="M-60 -44 Q-50 -90 -30 -56 M0 -48 Q14 -100 26 -58 M50 -44 Q64 -86 76 -52" stroke="#9aa4aa" stroke-width="7" fill="none" opacity=".6" stroke-linecap="round"/></g>`;
}
export const kapraoPlate = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse rx="110" ry="30" fill="#f4efe6" stroke="#d9d2c8" stroke-width="4"/>
  <ellipse cx="-30" cy="-8" rx="58" ry="18" fill="#fff"/><path d="M14 -6 Q50 -30 84 -6 Q50 6 14 -6 Z" fill="#7a4a2a"/><circle cx="40" cy="-14" r="6" fill="#3a8a3a"/><circle cx="58" cy="-9" r="6" fill="#3a8a3a"/>
  <ellipse cx="-34" cy="-30" rx="56" ry="22" fill="#ffffff"/><circle cx="-30" cy="-32" r="16" fill="#f6a623"/><path d="M-86 -28 Q-90 -38 -78 -42" stroke="#c98a3a" stroke-width="5" fill="none"/></g>`;
export function diningTable(x, y, w = 680) {
  return `<g transform="translate(${x} ${y})">
    <rect x="${-w / 2}" y="0" width="${w}" height="34" rx="8" fill="#dfe4e8"/><rect x="${-w / 2}" y="30" width="${w}" height="16" fill="#9aa4aa"/>
    <rect x="${-w / 2 + 40}" y="46" width="18" height="380" fill="#9aa4aa"/><rect x="${w / 2 - 58}" y="46" width="18" height="380" fill="#9aa4aa"/>
  </g>`;
}
export const stool = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="70" ry="20" fill="#e03a3a"/><path d="M-62 4 L-48 150 L48 150 L62 4 Z" fill="#c8282f"/><ellipse cx="0" cy="70" rx="30" ry="34" fill="#a01c22"/><ellipse cx="0" cy="0" rx="50" ry="12" fill="#f05a5a"/></g>`;
export const condiments = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-60" y="-20" width="120" height="20" rx="6" fill="#9aa4aa"/>
  ${[-36, 0, 36].map((dx, i) => `<path d="M${dx - 14} -20 L${dx - 12} -56 L${dx + 12} -56 L${dx + 14} -20 Z" fill="#e9f4f8" opacity=".85"/><rect x="${dx - 12}" y="-48" width="24" height="22" fill="${["#c8282f", "#a8743f", "#f0c14a"][i]}"/>`).join("")}</g>`;

// The auntie's rice-and-curry shophouse at dusk: shop sign, striped awning, glass cabinet of curry trays,
// open doorway (left), a hiring board, sidewalk and a strip of road at the bottom.
export function curryShopFront() {
  const curries = ["#c8282f", "#e8a23a", "#3a8a3a", "#7a4a2a", "#f0c14a", "#d2603a", "#5a8a3a", "#a8432a"];
  return `<defs><linearGradient id="duskSky7" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb070"/><stop offset="1" stop-color="#c45a6a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#duskSky7)"/>
    <rect x="0" y="360" width="1080" height="1100" fill="#e8d2b4"/>
    ${[0, 1, 2].map((i) => `<rect x="${110 + i * 330}" y="400" width="200" height="150" rx="8" fill="#6a4a3a"/><rect x="${122 + i * 330}" y="412" width="176" height="126" rx="4" fill="#ffd89a" opacity=".85"/><path d="M${210 + i * 330} 412 L${210 + i * 330} 538" stroke="#6a4a3a" stroke-width="8"/>`).join("")}
    <rect x="40" y="590" width="1000" height="150" rx="16" fill="#c8282f" stroke="#f0c14a" stroke-width="10"/>
    ${txt(540, 690, "ร้านข้าวแกงป้า", { size: 86, weight: 900, fill: "#fff8ec" })}
    <path d="M0 770 L1080 770 L1060 880 L20 880 Z" fill="#fff8ec"/>
    ${[...Array(9)].map((_, i) => `<path d="M${i * 120} 770 L${i * 120 + 60} 770 L${i * 120 + 58} 880 L${i * 120 + 2} 880 Z" fill="#2f8f5b"/>`).join("")}
    ${[...Array(18)].map((_, i) => `<path d="M${20 + i * 58} 880 q29 36 58 0" fill="${i % 2 ? "#fff8ec" : "#2f8f5b"}"/>`).join("")}
    <rect x="120" y="930" width="220" height="530" fill="#3a2a22"/><rect x="132" y="942" width="196" height="518" fill="#5a3f30"/>
    <g transform="translate(400 1030)">
      <rect x="0" y="0" width="620" height="330" rx="10" fill="#b9c1c8"/><rect x="14" y="14" width="592" height="300" rx="6" fill="#dff1f8" opacity=".9"/>
      ${[0, 1].map((r) => [0, 1, 2, 3].map((c) => { const k = r * 4 + c; return `<rect x="${34 + c * 144}" y="${46 + r * 140}" width="120" height="90" rx="10" fill="#c9cdd2"/><ellipse cx="${94 + c * 144}" cy="${86 + r * 140}" rx="48" ry="30" fill="${curries[k]}"/>`; }).join("")).join("")}
      <rect x="0" y="330" width="620" height="100" fill="#8a939a"/>
    </g>
    <rect x="0" y="1460" width="1080" height="200" fill="#bdb6aa"/><rect x="0" y="1460" width="1080" height="16" fill="#9a9488"/>
    <rect x="0" y="1660" width="1080" height="260" fill="#3a3a42"/><rect x="0" y="1660" width="1080" height="14" fill="#f0e6c8"/>`;
}
export function hiringBoard(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#tbShadow)">
    <path d="M-110 260 L-60 60 M110 260 L60 60" stroke="#6a4128" stroke-width="14" stroke-linecap="round"/>
    <rect x="-160" y="-150" width="320" height="300" rx="14" fill="#fff8ec" stroke="#c8282f" stroke-width="8"/>
    ${txt(0, -86, "รับสมัคร", { size: 48, weight: 900, fill: "#c8282f" })}${txt(0, -28, "เด็กเสิร์ฟ ด่วน!", { size: 44, weight: 900, fill: "#1a1208" })}
    <rect x="-130" y="10" width="260" height="110" rx="12" fill="#c8282f"/>
    ${txt(0, 52, "ตอนนี้ถึง", { size: 30, weight: 700, fill: "#fff8ec" })}${txt(0, 104, "คิวที่ 12,000", { size: 46, weight: 900, fill: "#fff8ec" })}
  </g>`;
}

export function btsGate(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-150" y="-40" width="90" height="220" rx="14" fill="#c9d3da"/><rect x="60" y="-40" width="90" height="220" rx="14" fill="#c9d3da"/>
    <path d="M-60 40 L-8 40 L-8 70 L-60 70 Z" fill="#c8282f"/><path d="M60 40 L8 40 L8 70 L60 70 Z" fill="#c8282f"/>
    <circle cx="-105" cy="10" r="22" fill="#3dca6a"/>
  </g>`;
}
export function atm(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-130" y="-200" width="260" height="400" rx="22" fill="#5a6a7a"/>
    <rect x="-110" y="-180" width="220" height="40" rx="8" fill="#2fa36b"/>${txt(0, -150, "ATM", { size: 30, weight: 900, fill: "#fff" })}
    <rect x="-100" y="-120" width="200" height="130" rx="10" fill="#1c1c22"/>
    ${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${-60 + c * 44}" y="${40 + r * 36}" width="36" height="28" rx="5" fill="#c9d3da"/>`).join("")).join("")}
  </g>`;
}
export function phone(x, y, s = 1, rot = 0, inner = "") {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <rect x="-110" y="-200" width="220" height="400" rx="34" fill="#1c1c22"/>
    <rect x="-96" y="-180" width="192" height="360" rx="22" fill="#fbf8f2"/>${inner}
  </g>`;
}

export function bedroomBg() {
  return `<rect width="1080" height="1920" fill="#2a2850"/>
    <rect x="600" y="320" width="380" height="460" rx="12" fill="#14183a" stroke="#4a4878" stroke-width="16"/>
    <circle cx="880" cy="420" r="46" fill="#fff4c8"/>
    ${[[640, 700, 50, 80], [700, 650, 40, 130], [760, 680, 60, 100], [840, 620, 50, 160], [910, 690, 50, 90]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#232a5a"/>`).join("")}
    <path d="M790 320 L790 780 M600 550 L980 550" stroke="#4a4878" stroke-width="10"/>
    <rect x="0" y="1300" width="1080" height="620" fill="#3a3466"/>
    <rect x="60" y="1180" width="700" height="40" rx="10" fill="#8a5a38"/><rect x="100" y="1220" width="30" height="300" fill="#6a4128"/><rect x="690" y="1220" width="30" height="300" fill="#6a4128"/>
    <circle cx="200" cy="560" r="300" fill="#ffd8a0" opacity=".08"/>
    <g transform="translate(180 1060)"><path d="M-50 120 L50 120 L30 0 L-30 0 Z" fill="#f0c14a"/><rect x="-6" y="120" width="12" height="20" fill="#6a4128"/></g>`;
}

// Digital piggy bank with a screen on its side. Centre (x, y).
export function piggy(x, y, s = 1, { screen = "" } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="210" rx="250" ry="26" fill="#000" opacity=".3"/>
    <rect x="-150" y="120" width="56" height="90" rx="20" fill="#e8798f"/><rect x="100" y="120" width="56" height="90" rx="20" fill="#e8798f"/>
    <ellipse cx="0" cy="0" rx="270" ry="200" fill="#ff9ab0"/>
    <ellipse cx="-60" cy="-90" rx="150" ry="70" fill="#ffc2d0" opacity=".6"/>
    <path d="M-150 -170 L-200 -250 L-90 -190 Z" fill="#e8798f"/>
    <circle cx="-210" cy="-40" r="16" fill="#1a1208"/><circle cx="-204" cy="-46" r="5" fill="#fff"/>
    <ellipse cx="-280" cy="20" rx="58" ry="68" fill="#ff8aa3" stroke="#e8798f" stroke-width="8"/>
    <ellipse cx="-296" cy="10" rx="9" ry="16" fill="#c45c6a"/><ellipse cx="-266" cy="10" rx="9" ry="16" fill="#c45c6a"/>
    <path d="M265 -10 Q320 -40 300 20 Q290 50 320 40" fill="none" stroke="#e8798f" stroke-width="12" stroke-linecap="round"/>
    <rect x="-50" y="-206" width="120" height="20" rx="10" fill="#7a2a3a"/>
    <g transform="translate(70 30)">
      <rect x="-150" y="-110" width="300" height="220" rx="26" fill="#1c1c22"/>
      <rect x="-136" y="-96" width="272" height="192" rx="16" fill="#0d1a24"/>
      ${screen}
    </g>
  </g>`;
}

export const SHEET_DEFS = `<svg width="0" height="0" style="position:absolute"><defs>
  <filter id="tbShadow" x="-20%" y="-30%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity=".35"/></filter>
  <radialGradient id="spot"><stop offset="0" stop-color="#fff6c8" stop-opacity=".7"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient>
  <linearGradient id="dim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".5" stop-color="#000" stop-opacity="0"/></linearGradient>
</defs></svg>`;
export { esc as escText };
