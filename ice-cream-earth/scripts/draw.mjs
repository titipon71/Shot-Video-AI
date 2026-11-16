// Shared drawing helpers for ice-cream-earth (storyboard + video). All output is SVG markup strings.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const proj = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(proj, "..");
const LAND = JSON.parse(readFileSync(join(proj, "assets", "land-110m.json"), "utf8"));
const FONT = "Kanit, sans-serif";
const f1 = (n) => +n.toFixed(1);

// deterministic random
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// ---------- text ----------
const T = (x, y, s, o = {}) => {
  const { size = 60, weight = 800, fill = "#fff", anchor = "middle", stroke = "", sw = 0, filter = "", op = 1 } = o;
  const st = stroke ? ` stroke="${stroke}" stroke-width="${sw}" paint-order="stroke" stroke-linejoin="round"` : "";
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-weight="${weight}" font-size="${size}" fill="${fill}" opacity="${op}"${st}${filter ? ` filter="url(#${filter})"` : ""}>${s}</text>`;
};
const heading = (th, en, y = 250) => `${T(540, y, th, { size: 74, weight: 800, filter: "txtShadow" })}${T(540, y + 62, en, { size: 36, weight: 500, op: 0.88, filter: "txtShadow" })}`;

// ---------- polar scene ----------
function polarBg({ pole = true } = {}) {
  seed = 11;
  const snow = [...Array(70)].map(() => `<circle cx="${f1(rnd() * 1080)}" cy="${f1(rnd() * 1900)}" r="${f1(2 + rnd() * 5)}" fill="#fff" opacity="${f1(0.35 + rnd() * 0.5)}"/>`).join("");
  const glints = [...Array(26)].map(() => { const x = f1(rnd() * 1080), y = f1(1180 + rnd() * 700), s = f1(4 + rnd() * 9); return `<path d="M${x} ${y - s} L${x + s * 0.25} ${y} L${x} ${y + s} L${x - s * 0.25} ${y} Z M${x - s} ${y} L${x} ${y + s * 0.25} L${x + s} ${y} L${x} ${y - s * 0.25} Z" fill="#fff" opacity=".9"/>`; }).join("");
  return `
  <rect width="1080" height="1920" fill="url(#duskSky)"/>
  <g filter="url(#blur24)" opacity=".6">
    <path d="M-100 360 C200 250 420 470 700 330 C880 240 1020 320 1200 260 L1200 420 C1000 470 860 400 700 480 C430 610 200 420 -100 520 Z" fill="url(#aurora)"/>
    <path d="M-100 560 C240 470 480 640 760 540 C920 480 1060 540 1200 500 L1200 580 C1040 620 900 580 760 630 C480 730 240 580 -100 650 Z" fill="url(#aurora)" opacity=".7"/>
  </g>
  <circle cx="220" cy="1050" r="420" fill="url(#sunGlow)"/>
  <circle cx="220" cy="1060" r="62" fill="#fff6e2"/>
  <path d="M0 1010 C90 960 160 990 240 950 C320 915 420 980 520 945 C640 905 720 975 840 940 C940 912 1010 950 1080 930 L1080 1110 L0 1110 Z" fill="#cdb9e3"/>
  <path d="M0 1050 C140 1020 260 1060 400 1030 C560 1000 680 1060 860 1030 C960 1015 1030 1040 1080 1030 L1080 1120 L0 1120 Z" fill="#e6d4ec"/>
  <rect y="1100" width="1080" height="820" fill="url(#snowGround)"/>
  <path d="M0 1260 C220 1210 420 1290 640 1240 C820 1200 960 1250 1080 1225 L1080 1330 L0 1330 Z" fill="#fff3ec" opacity=".8"/>
  <path d="M0 1520 C260 1460 520 1560 760 1500 C900 1465 1000 1500 1080 1480 L1080 1600 C900 1640 700 1580 480 1620 C260 1660 120 1600 0 1630 Z" fill="#d9d1f0" opacity=".55"/>
  ${pole ? `
  <ellipse cx="880" cy="1214" rx="120" ry="12" fill="#9d8fc8" opacity=".35" transform="skewX(-40)"/>
  <rect x="815" y="880" width="28" height="330" rx="6" fill="url(#barber)"/>
  <rect x="815" y="880" width="28" height="330" rx="6" fill="url(#cylShade)"/>
  <circle cx="829" cy="852" r="40" fill="url(#chrome)"/>
  <ellipse cx="816" cy="838" rx="12" ry="8" fill="#fff" opacity=".9"/>
  <g filter="url(#softShadow)"><rect x="736" y="950" width="186" height="56" rx="12" fill="#fffaf4"/></g>
  ${T(829, 988, "SOUTH POLE", { size: 26, weight: 800, fill: "#3b3566" })}` : ""}
  ${glints}${snow}`;
}

function penguin(x, y, s = 1, { tilt = 0, look = 0, q = false } = {}) {
  return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s})">
    <ellipse cx="10" cy="150" rx="120" ry="16" fill="#8f86c6" opacity=".35"/>
    <ellipse cx="-34" cy="146" rx="32" ry="13" fill="#ff9f43"/><ellipse cx="34" cy="146" rx="32" ry="13" fill="#ff9f43"/>
    <path d="M-78 -10 C-120 40 -112 90 -88 120" stroke="url(#pgBody)" stroke-width="26" fill="none" stroke-linecap="round"/>
    <path d="M78 -10 C120 40 112 90 88 120" stroke="url(#pgBody)" stroke-width="26" fill="none" stroke-linecap="round"/>
    <path d="M0 -150 C70 -150 92 -80 92 0 C92 90 66 150 0 150 C-66 150 -92 90 -92 0 C-92 -80 -70 -150 0 -150 Z" fill="url(#pgBody)"/>
    <path d="M0 -70 C52 -70 64 -10 64 40 C64 110 40 140 0 140 C-40 140 -64 110 -64 40 C-64 -10 -52 -70 0 -70 Z" fill="url(#pgBelly)"/>
    <ellipse cx="-58" cy="-62" rx="14" ry="24" fill="#ffc94d" transform="rotate(20 -58 -62)"/>
    <ellipse cx="58" cy="-62" rx="14" ry="24" fill="#ffc94d" transform="rotate(-20 58 -62)"/>
    <g transform="translate(${look * 10} 0)">
      <circle cx="-26" cy="-92" r="15" fill="#fff"/><circle cx="26" cy="-92" r="15" fill="#fff"/>
      <circle cx="${-24 + look * 4}" cy="-90" r="8" fill="#141a2b"/><circle cx="${28 + look * 4}" cy="-90" r="8" fill="#141a2b"/>
      <circle cx="${-21 + look * 4}" cy="-94" r="3" fill="#fff"/><circle cx="${31 + look * 4}" cy="-94" r="3" fill="#fff"/>
      <ellipse cx="-42" cy="-66" rx="12" ry="7" fill="#ff8fa3" opacity=".7"/><ellipse cx="42" cy="-66" rx="12" ry="7" fill="#ff8fa3" opacity=".7"/>
      <path d="M-14 -72 Q0 -60 14 -72 Q0 -50 -14 -72 Z" fill="#ff9f43"/>
    </g>
    ${q ? `<g transform="translate(96 -210)" filter="url(#softShadow)"><circle r="54" fill="#fff"/><path d="M-20 44 L-34 74 L4 50 Z" fill="#fff"/>${T(0, 26, "?", { size: 84, weight: 900, fill: "#ff5d73" })}</g>` : ""}
  </g>`;
}

// cone: opening centred at (cx, cy), width w; tip at cy + h (h < 0 puts the tip above)
let coneN = 0;
function cone(cx, cy, w, h) {
  const id = `cone${coneN++}`;
  const tipY = cy + h, cell = Math.max(6, w / 6.5), sw = Math.max(1.5, w / 90);
  const lines = [];
  const L = Math.abs(h) + w;
  for (let k = -L; k <= L; k += cell) {
    lines.push(`M${cx - L} ${cy + k - L} L${cx + L} ${cy + k + L}`);
    lines.push(`M${cx - L} ${cy + k + L} L${cx + L} ${cy + k - L}`);
  }
  const rimH = w / 9, dir = Math.sign(h) || 1;
  return `<g>
    <defs><clipPath id="${id}"><path d="M${cx - w / 2} ${cy} L${cx + w / 2} ${cy} L${cx} ${tipY} Z"/></clipPath></defs>
    <path d="M${cx - w / 2} ${cy} L${cx + w / 2} ${cy} L${cx} ${tipY} Z" fill="url(#waffleGrad)"/>
    <g clip-path="url(#${id})">
      <path d="${lines.join(" ")}" stroke="#a9692c" stroke-width="${sw * 1.6}" opacity=".55"/>
      <path d="${lines.join(" ")}" stroke="#ffd79a" stroke-width="${sw * 0.6}" opacity=".35" transform="translate(${-sw} ${-sw})"/>
      <path d="M${cx - w / 2} ${cy} L${cx - w * 0.3} ${cy} L${cx} ${tipY} Z" fill="#fff" opacity=".18"/>
    </g>
    <path d="M${cx - w / 2} ${cy} L${cx} ${tipY} L${cx + w / 2} ${cy}" fill="none" stroke="#9a5d24" stroke-width="${sw}" stroke-linejoin="round" opacity=".7"/>
    <rect x="${cx - w / 2 - sw}" y="${cy - (dir > 0 ? rimH * 0.55 : rimH * 0.45)}" width="${w + sw * 2}" height="${rimH}" rx="${rimH / 2}" fill="url(#rimGrad)"/>
  </g>`;
}

// POV arm: parka sleeve from the bottom-right corner ending in a knitted mitten centred at (mx, my).
// The mitten points along the arm, so sleeve and mitten always meet at the cuff.
// sleeve() and mitten() take the same (mx, my) and can be layered separately (e.g. cone in between).
const ARM_BASE = [1010, 2060];
function armGeom(mx, my, base = ARM_BASE) {
  const [bx, by] = base, dx = mx - bx, dy = my - by, len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len;
  return { bx, by, ux, uy, wx: mx - ux * 96, wy: my - uy * 96, rot: Math.atan2(dy, dx) * 180 / Math.PI + 90 };
}
function sleeve(mx, my, base) {
  const { bx, by, ux, uy, wx, wy, rot } = armGeom(mx, my, base);
  const nx = -uy, ny = ux, b0 = 160, w0 = 96;
  const seams = [0.3, 0.55, 0.78].map((t) => {
    const px = bx + (wx - bx) * t, py = by + (wy - by) * t, hw = b0 + (w0 - b0) * t;
    return `M${f1(px + nx * hw)} ${f1(py + ny * hw)} Q${f1(px - ux * 30)} ${f1(py - uy * 30)} ${f1(px - nx * hw)} ${f1(py - ny * hw)}`;
  }).join(" ");
  return `<g filter="url(#softShadow)">
    <path d="M${f1(bx + nx * b0)} ${f1(by + ny * b0)} L${f1(wx + nx * w0)} ${f1(wy + ny * w0)} L${f1(wx - nx * w0)} ${f1(wy - ny * w0)} L${f1(bx - nx * b0)} ${f1(by - ny * b0)} Z" fill="url(#parka)"/>
    <path d="${seams}" stroke="#c9463f" stroke-width="5" fill="none" opacity=".6"/>
    <ellipse cx="${f1(wx)}" cy="${f1(wy)}" rx="${w0 + 6}" ry="40" transform="rotate(${f1(rot)} ${f1(wx)} ${f1(wy)})" fill="#fff4e4"/>
  </g>`;
}
function mitten(mx, my, base) {
  const { rot } = armGeom(mx, my, base);
  return `<g transform="translate(${mx} ${my}) rotate(${f1(rot)})" filter="url(#softShadow)">
    <ellipse cx="-78" cy="-10" rx="34" ry="52" fill="#2d4a8a" transform="rotate(-32 -78 -10)"/>
    <rect x="-84" y="-104" width="168" height="200" rx="84" fill="url(#mittenGrad)"/>
    <rect x="-84" y="34" width="168" height="26" fill="#fff4e4" opacity=".9"/>
    ${[-56, -20, 16, 52].map((x) => `<path d="M${x} 40 l8 8 l8 -8" stroke="#2d4a8a" stroke-width="4" fill="none"/>`).join("")}
  </g>`;
}

// ---------- space + globe ----------
function space() {
  seed = 23;
  const stars = [...Array(160)].map(() => { const r = rnd(); return `<circle cx="${f1(rnd() * 1080)}" cy="${f1(rnd() * 1920)}" r="${f1(0.8 + r * r * 4)}" fill="#fff" opacity="${f1(0.35 + rnd() * 0.65)}"/>`; }).join("");
  const bright = [...Array(10)].map(() => { const x = f1(rnd() * 1080), y = f1(rnd() * 1920); return `<circle cx="${x}" cy="${y}" r="16" fill="url(#starGlow)"/><circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`; }).join("");
  return `<rect width="1080" height="1920" fill="url(#spaceGrad)"/>
    <circle cx="180" cy="420" r="520" fill="url(#nebPink)"/>
    <circle cx="960" cy="1520" r="560" fill="url(#nebTeal)"/>
    ${stars}${bright}`;
}

function project(lon, lat, lon0, lat0) {
  const r = Math.PI / 180, l = (lon - lon0) * r, p = lat * r, p0 = lat0 * r;
  const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  let x = Math.cos(p) * Math.sin(l), y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l);
  if (cosc < 0) { const n = Math.hypot(x, y) || 1; x /= n; y /= n; }
  return [x, -y, cosc >= 0];
}

let globeN = 0;
function globe(cx, cy, R, { lon0 = 20, lat0 = -25, southUp = false, flavored = false, light = true } = {}) {
  const id = `g${globeN++}`;
  const pal = flavored
    ? { ocean: "url(#oceanFlav)", land: "url(#landFlav)", ice: "#fff6df", rim: "#bff0ff" }
    : { ocean: "url(#oceanReal)", land: "url(#landReal)", ice: "#f3f7fb", rim: "#9fdcff" };
  const paths = { land: [], ice: [] };
  for (const ring of LAND) {
    const pts = ring.map(([lo, la]) => project(lo, la, lon0, lat0));
    if (!pts.some((p) => p[2])) continue;
    const d = "M" + pts.map(([x, y]) => `${f1(x * 400)} ${f1(y * 400)}`).join("L") + "Z";
    const avgLat = ring.reduce((s, p) => s + p[1], 0) / ring.length;
    const avgLon = ring.reduce((s, p) => s + p[0], 0) / ring.length;
    const icy = avgLat < -60 || (avgLat > 60 && avgLon > -75 && avgLon < -10);
    (icy ? paths.ice : paths.land).push(d);
  }
  seed = 31;
  const sprinkles = flavored ? [...Array(70)].map(() => {
    const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * 370, x = f1(Math.cos(a) * d), y = f1(Math.sin(a) * d);
    const c = ["#ff5d73", "#ffd166", "#9b7bff", "#ff9ad5", "#ffffff", "#5ee0b5"][Math.floor(rnd() * 6)];
    return `<rect x="${x - 11}" y="${y - 4}" width="22" height="8" rx="4" fill="${c}" transform="rotate(${f1(rnd() * 180)} ${x} ${y})"/>`;
  }).join("") : "";
  const clouds = flavored ? "" : `<g fill="#fff" opacity=".55" filter="url(#blur6)">
      <path d="M-300 -150 C-200 -175 -80 -140 40 -165 C120 -180 200 -150 260 -165" stroke="#fff" stroke-width="16" fill="none"/>
      <path d="M-250 90 C-150 70 -60 110 60 85 C150 68 230 95 330 80" stroke="#fff" stroke-width="12" fill="none"/>
      <path d="M-120 230 C-40 215 60 245 160 220" stroke="#fff" stroke-width="12" fill="none"/></g>`;
  const swirl = flavored ? `<g fill="none" stroke="#e8fbff" stroke-width="10" opacity=".45" stroke-linecap="round">
      <path d="M-360 -40 C-260 -90 -170 0 -60 -50"/><path d="M120 150 C200 110 280 170 360 120"/><path d="M-200 -280 C-120 -310 -40 -260 40 -290"/></g>` : "";
  return `<g transform="translate(${cx} ${cy}) rotate(${southUp ? 180 : 0}) scale(${R / 400})">
    <circle r="470" fill="url(#atmo)"/>
    <defs><clipPath id="${id}"><circle r="400"/></clipPath></defs>
    <g clip-path="url(#${id})">
      <circle r="400" fill="${pal.ocean}"/>
      ${swirl}
      <path d="${paths.land.join("")}" fill="${pal.land}" stroke="${flavored ? "#93cf5c" : "#4f9a54"}" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="${paths.ice.join("")}" fill="${pal.ice}" stroke="${pal.ice}" stroke-width="1.2"/>
      ${sprinkles}${clouds}
      ${light ? globeShade(flavored) : ""}
    </g>
    <circle r="400" fill="none" stroke="${pal.rim}" stroke-width="5" opacity=".7"/>
  </g>`;
}
// night side + specular highlight, in globe-local units (radius 400)
function globeShade(flavored = false) {
  return `<circle r="400" fill="url(#nightSide)"/>
      <ellipse cx="-150" cy="-170" rx="150" ry="100" fill="#fff" opacity="${flavored ? 0.32 : 0.16}" filter="url(#blur24)"/>`;
}
// screen position of the South Pole on a globe drawn with globe()
function poleXY(cx, cy, R, { lon0 = 20, lat0 = -25, southUp = false } = {}) {
  const [x, y] = project(0, -90, lon0, lat0);
  const k = southUp ? -1 : 1;
  return [cx + k * x * R, cy + k * y * R];
}

// vanilla drips over the cone rim (scoop bottom = Antarctica)
function drips(cx, y, w) {
  seed = 41;
  const n = 9, step = w / (n - 1);
  const cols = [...Array(n)].map((_, i) => {
    const x = cx - w / 2 + i * step, len = 30 + rnd() * 110, r = 22 + rnd() * 10;
    return `<path d="M${f1(x - r)} ${y} L${f1(x - r)} ${f1(y + len)} A${f1(r)} ${f1(r)} 0 0 0 ${f1(x + r)} ${f1(y + len)} L${f1(x + r)} ${y} Z"/>`;
  }).join("");
  return `<g fill="#fff6df" filter="url(#softShadow)">
    <path d="M${cx - w / 2 - 30} ${y - 40} Q${cx} ${y + 40} ${cx + w / 2 + 30} ${y - 40} L${cx + w / 2 + 30} ${y + 10} Q${cx} ${y + 70} ${cx - w / 2 - 30} ${y + 10} Z"/>
    ${cols}</g>`;
}

const comic = (x, y, s, size, fill) => T(x, y, s, { size, weight: 900, fill, stroke: "#2b2350", sw: size / 7, filter: "softShadow" });

const DEFS = `<svg width="0" height="0" style="position:absolute"><defs>
  <linearGradient id="duskSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f2463"/><stop offset=".3" stop-color="#4b4396"/><stop offset=".5" stop-color="#b77fb8"/><stop offset=".6" stop-color="#ffb3a7"/><stop offset=".72" stop-color="#ffdcb5"/></linearGradient>
  <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4ef0c1" stop-opacity="0"/><stop offset=".3" stop-color="#4ef0c1"/><stop offset=".7" stop-color="#7ab8ff"/><stop offset="1" stop-color="#b48cff" stop-opacity="0"/></linearGradient>
  <radialGradient id="sunGlow"><stop offset="0" stop-color="#fff2d0" stop-opacity=".9"/><stop offset=".35" stop-color="#ffc9a0" stop-opacity=".45"/><stop offset="1" stop-color="#ffb3a7" stop-opacity="0"/></radialGradient>
  <linearGradient id="snowGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1e8"/><stop offset=".45" stop-color="#f1e9f6"/><stop offset="1" stop-color="#cfc8ec"/></linearGradient>
  <pattern id="barber" width="28" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><rect width="28" height="44" fill="#fffaf4"/><rect width="28" height="22" fill="#ff4d5e"/></pattern>
  <linearGradient id="cylShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#3b3566" stop-opacity=".35"/></linearGradient>
  <radialGradient id="chrome" cx=".35" cy=".32" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#d9d3ee"/><stop offset=".8" stop-color="#8f86b8"/><stop offset="1" stop-color="#ffcfb8"/></radialGradient>
  <linearGradient id="pgBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b4670"/><stop offset="1" stop-color="#161b33"/></linearGradient>
  <linearGradient id="pgBelly" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf7"/><stop offset="1" stop-color="#e8e2f3"/></linearGradient>
  <linearGradient id="waffleGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f6cf8c"/><stop offset=".5" stop-color="#e4a95e"/><stop offset="1" stop-color="#c0833f"/></linearGradient>
  <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9d79b"/><stop offset="1" stop-color="#c88a45"/></linearGradient>
  <linearGradient id="parka" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8a70"/><stop offset="1" stop-color="#e24f4a"/></linearGradient>
  <linearGradient id="mittenGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f75c9"/><stop offset="1" stop-color="#2d4a8a"/></linearGradient>
  <linearGradient id="spaceGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0d2c"/><stop offset=".55" stop-color="#1b1552"/><stop offset="1" stop-color="#0c1a3c"/></linearGradient>
  <radialGradient id="nebPink"><stop offset="0" stop-color="#ff6fb5" stop-opacity=".38"/><stop offset="1" stop-color="#ff6fb5" stop-opacity="0"/></radialGradient>
  <radialGradient id="nebTeal"><stop offset="0" stop-color="#3fe0d0" stop-opacity=".28"/><stop offset="1" stop-color="#3fe0d0" stop-opacity="0"/></radialGradient>
  <radialGradient id="starGlow"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#9fdcff" stop-opacity="0"/></radialGradient>
  <radialGradient id="heroGlow"><stop offset="0" stop-color="#ffd8a8" stop-opacity=".35"/><stop offset="1" stop-color="#ffd8a8" stop-opacity="0"/></radialGradient>
  <radialGradient id="atmo"><stop offset=".84" stop-color="#7fd4ff" stop-opacity=".55"/><stop offset="1" stop-color="#7fd4ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="oceanReal" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#3fa2e8"/><stop offset="1" stop-color="#14408f"/></radialGradient>
  <linearGradient id="landReal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cc46a"/><stop offset=".6" stop-color="#4f9a54"/><stop offset="1" stop-color="#c8a868"/></linearGradient>
  <radialGradient id="oceanFlav" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#9be6ff"/><stop offset="1" stop-color="#2ea7e6"/></radialGradient>
  <linearGradient id="landFlav" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cdf08f"/><stop offset="1" stop-color="#8fcc57"/></linearGradient>
  <radialGradient id="nightSide" cx=".3" cy=".25" r=".95"><stop offset=".55" stop-color="#0a0d2c" stop-opacity="0"/><stop offset="1" stop-color="#0a0d2c" stop-opacity=".5"/></radialGradient>
  <radialGradient id="moonGrad" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9b4cc"/></radialGradient>
  <radialGradient id="moonGlow"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c2"/><stop offset=".5" stop-color="#ffd166"/><stop offset="1" stop-color="#f29b38"/></linearGradient>
  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#ffd166"/></marker>
  <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#2b2350" flood-opacity=".35"/></filter>
  <filter id="txtShadow" x="-20%" y="-40%" width="140%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#1a1440" flood-opacity=".55"/></filter>
  <filter id="blur24" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="24"/></filter>
  <filter id="blur6" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="6"/></filter>
</defs></svg>`;

export { proj, repo, LAND, FONT, f1, T, heading, polarBg, penguin, cone, ARM_BASE, armGeom, sleeve, mitten, space, project, globe, globeShade, poleXY, drips, comic, DEFS };
export const setSeed = (s) => { seed = s; };
export { rnd };
