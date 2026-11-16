// Shared SVG kit for บางดูไบ scenes. Pure functions, no DOM.
import { createPerson } from "../../../shared/flat-people/index.mjs";

export const W = 1080, H = 1920;
export const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const FONT = "Kanit, sans-serif";

export function placeChar(opts, x, feetY, scale = 1) {
  const id = opts.id || `p${Math.random().toString(36).slice(2, 7)}`;
  const p = createPerson({ ...opts, id, scale });
  return `<g class="fp-placed" data-id="${p.id}" transform="translate(${(x - 100).toFixed(1)} ${(feetY - 520).toFixed(1)})">${p.svg}</g>`;
}

export const PALETTES = {
  morning: {
    sky0: "#fff1c8", sky1: "#7eb8d8", sky2: "#f4c49a",
    sun: "#ffe08a", sunGlow: "#ffd18a",
    haze: "#ffd2a8",
    ground: "#3a3a42", ground2: "#2a2a32", curb: "#5a5a62",
    roadLine: "#f0e6c8",
    bldg: ["#f3ddc4", "#d7c2ab", "#c5d6e0", "#ead3b6", "#c8b8a4"],
    glass: "#7eafc8", glass2: "#5a8aaa",
    foliage: "#3d6a45",
    shadow: "rgba(20,10,8,.45)",
  },
  day: {
    sky0: "#e8f0c8", sky1: "#9ab87a", sky2: "#d8c878",
    sun: "#f0e08a", sunGlow: "#d8d070",
    haze: "#d8e090",
    ground: "#35353c", ground2: "#26262c", curb: "#55555c",
    roadLine: "#e8e0c0",
    bldg: ["#e8d4bc", "#c8b8a4", "#b8c8c0", "#dcc8b0", "#b8a894"],
    glass: "#6a9aa8", glass2: "#4a7a88",
    foliage: "#3a623e",
    shadow: "rgba(20,16,8,.5)",
  },
  dusk: {
    sky0: "#ffb070", sky1: "#c45a6a", sky2: "#4a2a58",
    sun: "#ffd08a", sunGlow: "#ff8a4a",
    haze: "#e89070",
    ground: "#2c2a32", ground2: "#1c1a22", curb: "#4a4850",
    roadLine: "#d8c8a0",
    bldg: ["#d4b098", "#8a6a70", "#6a7a8a", "#c09078", "#7a6a60"],
    glass: "#5a7a9a", glass2: "#3a4a6a",
    foliage: "#2a4a32",
    shadow: "rgba(8,4,16,.55)",
  },
  night: {
    sky0: "#3a4a7a", sky1: "#1a2040", sky2: "#0c1020",
    sun: "#f4e8c0", sunGlow: "#c0d8ff",
    haze: "#2a3a5a",
    ground: "#1c1c24", ground2: "#121218", curb: "#3a3a44",
    roadLine: "#c8b888",
    bldg: ["#4a3a3a", "#2a3048", "#3a2a38", "#2c2838", "#3a3840"],
    glass: "#7ec8f0", glass2: "#3a6a9a",
    foliage: "#1a3020",
    shadow: "rgba(0,0,0,.6)",
  },
  gold: {
    sky0: "#ffc878", sky1: "#e07a4a", sky2: "#5a2060",
    sun: "#ffe9a0", sunGlow: "#ffb050",
    haze: "#ffb070",
    ground: "#3a3228", ground2: "#2a241c", curb: "#6a5a40",
    roadLine: "#f0d48a",
    bldg: ["#f0d090", "#c8a878", "#7ec8c8", "#e8c070", "#d4b06a"],
    glass: "#5ad0d8", glass2: "#1a6a80",
    foliage: "#2a6a48",
    shadow: "rgba(40,20,8,.5)",
  },
};

export function timeBadge(text, { x = 540, y = 118, id = "tb", sub = "" } = {}) {
  const n = [...String(text)].length;
  const w = Math.max(320, n * 26 + 90);
  const h = sub ? 96 : 76;
  return `
  <g id="${id}" class="time-badge" transform="translate(${x} ${y})">
    <defs>
      <linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1a1208"/><stop offset="1" stop-color="#3a2710"/>
      </linearGradient>
    </defs>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="18" fill="url(#${id}-g)" stroke="#d8a64a" stroke-width="3"/>
    <rect x="${-w / 2 + 8}" y="${-h / 2 + 6}" width="${w - 16}" height="6" rx="2" fill="#d8a64a" opacity=".4"/>
    <text x="0" y="${sub ? 2 : 12}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="36" fill="#f7efe2">${esc(text)}</text>
    ${sub ? `<text x="0" y="28" text-anchor="middle" font-family="${FONT}" font-weight="500" font-size="18" fill="#e2c7ae">${esc(sub)}</text>` : ""}
  </g>`;
}

export function txt(x, y, text, o = {}) {
  const {
    size = 36, weight = 800, fill = "#f7efe2", anchor = "middle",
    stroke = "", sw = 0, italic = false,
  } = o;
  const st = stroke ? ` stroke="${stroke}" stroke-width="${sw}" paint-order="stroke" stroke-linejoin="round"` : "";
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-weight="${weight}" font-size="${size}" fill="${fill}"${italic ? ' font-style="italic"' : ""}${st}>${esc(text)}</text>`;
}

function windows(x, y, w, h, cols, rows, color, pad = 10) {
  const cw = (w - pad * 2) / cols, ch = (h - pad * 2) / rows;
  let s = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const xx = x + pad + c * cw + 3, yy = y + pad + r * ch + 3;
      s += `<rect x="${xx}" y="${yy}" width="${Math.max(3, cw - 6)}" height="${Math.max(3, ch - 6)}" rx="1.5" fill="${color}"/>`;
    }
  }
  return s;
}

function tower(x, y, w, h, fill, glass, { top = 24, cols = 5, rows = 12, cap = "#c8b8a4" } = {}) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${top}" fill="${cap}"/>
    <rect x="${x + w - 10}" y="${y}" width="10" height="${h}" fill="#000" opacity=".12"/>
    ${windows(x, y + top, w, h - top, cols, rows, glass)}
  `;
}

/** Colorful stacked mall inspired by Terminal 21 — no logos. */
function mall(x, y, pal, gold = false) {
  const blocks = gold
    ? [
        [0, 220, 280, 420, "#e8c878"],
        [40, 80, 220, 160, "#f0d898"],
        [70, 0, 160, 90, "#fff0c0"],
        [-40, 300, 140, 200, "#7ed0d0"],
        [200, 340, 120, 220, "#d4a05a"],
      ]
    : [
        [0, 220, 280, 420, "#f2d2c4"],
        [30, 90, 220, 150, "#f0c14a"],
        [70, 10, 150, 90, "#e07a7a"],
        [-50, 280, 150, 200, "#5bb3c9"],
        [210, 360, 130, 200, "#e8893a"],
        [90, 160, 100, 80, "#f4efe6"],
      ];
  let s = `<g class="mall" transform="translate(${x} ${y})">`;
  // shadow
  s += `<ellipse cx="140" cy="650" rx="160" ry="18" fill="#000" opacity=".25"/>`;
  for (const [bx, by, bw, bh, col] of blocks) {
    s += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="6" fill="${col}"/>`;
    s += `<rect x="${bx + bw - 12}" y="${by}" width="12" height="${bh}" fill="#000" opacity=".1"/>`;
    s += windows(bx, by + 8, bw, bh - 8, Math.max(3, Math.round(bw / 36)), Math.max(3, Math.round(bh / 32)), gold ? "#7edce0" : "#7eafc8", 8);
  }
  // generic mall entry
  s += `<rect x="70" y="520" width="140" height="100" rx="8" fill="${gold ? "#7edce0" : "#8ec8d8"}" opacity=".9"/>`;
  s += `<path d="M70 520 L140 480 L210 520 Z" fill="${gold ? "#fff0c0" : "#f4efe6"}"/>`;
  s += `</g>`;
  return s;
}

function bts(pal, { trainX = 200, gold = false, night = false, closeToRig = false } = {}) {
  const trackY = 900;
  let s = `<g class="bts">`;
  // pillars
  for (let x = 40; x < 1100; x += 180) {
    s += `<path d="M${x} ${trackY} L${x + 16} ${trackY} L${x + 28} 1180 L${x - 12} 1180 Z" fill="${gold ? "#c8a878" : "#6a6a70"}"/>`;
    s += `<rect x="${x - 18}" y="1170" width="48" height="14" fill="${gold ? "#a88858" : "#4a4a50"}"/>`;
  }
  // track bed
  s += `<rect x="-20" y="${trackY - 16}" width="1120" height="28" fill="${gold ? "#8a7050" : "#3a3a40"}"/>`;
  s += `<rect x="-20" y="${trackY - 4}" width="1120" height="4" fill="${gold ? "#d8b878" : "#c8c8d0"}"/>`;
  s += `<rect x="-20" y="${trackY + 6}" width="1120" height="3" fill="${gold ? "#d8b878" : "#c8c8d0"}"/>`;
  // railing
  s += `<rect x="-20" y="${trackY - 28}" width="1120" height="6" fill="${gold ? "#c8a060" : "#8a8a92"}"/>`;
  // train
  const ty = trackY - 78;
  const tw = 420, th = 64;
  const body = gold ? "#f0d48a" : night ? "#4a8a6a" : "#5aaa7a";
  const body2 = gold ? "#d4b060" : "#3a7a58";
  s += `<g class="bts-train" transform="translate(${trainX} ${ty})">`;
  s += `<rect x="0" y="8" width="${tw}" height="${th}" rx="14" fill="${body}"/>`;
  s += `<rect x="0" y="8" width="${tw}" height="16" fill="${body2}"/>`;
  s += `<path d="M${tw - 10} 8 Q${tw + 36} ${8 + th / 2} ${tw - 10} ${8 + th}" fill="${body}"/>`;
  for (let i = 0; i < 8; i++) {
    s += `<rect x="${18 + i * 50}" y="30" width="36" height="28" rx="4" fill="${night ? "#ffe9a0" : "#d8f0ff"}"/>`;
  }
  s += `<circle cx="40" cy="${th + 10}" r="7" fill="#2a2a30"/>`;
  s += `<circle cx="${tw - 40}" cy="${th + 10}" r="7" fill="#2a2a30"/>`;
  if (closeToRig) {
    // little sparks / proximity marks drawn by caller
  }
  s += `</g></g>`;
  return s;
}

/** Reusable Asok intersection background. Same layout, time-of-day palettes. */
export function asokBg({ time = "morning", prefix = "bg", trainX = 180, oil = false, rig = false, goldCity = false, park = false } = {}) {
  const pal = PALETTES[time] || PALETTES.morning;
  const gold = goldCity || time === "gold";
  const night = time === "night";
  const P = prefix;
  let s = `<g id="${P}-asok" class="asok-bg">`;
  s += `<defs>
    <linearGradient id="${P}-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${pal.sky0}"/>
      <stop offset=".42" stop-color="${pal.sky1}"/>
      <stop offset="1" stop-color="${pal.sky2}"/>
    </linearGradient>
    <radialGradient id="${P}-sun" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${pal.sun}" stop-opacity="1"/>
      <stop offset=".45" stop-color="${pal.sunGlow}" stop-opacity=".7"/>
      <stop offset="1" stop-color="${pal.sunGlow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${P}-road" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${pal.ground}"/>
      <stop offset="1" stop-color="${pal.ground2}"/>
    </linearGradient>
    <linearGradient id="${P}-haze" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${pal.haze}" stop-opacity="0"/>
      <stop offset="1" stop-color="${pal.haze}" stop-opacity=".35"/>
    </linearGradient>
  </defs>`;
  s += `<rect x="-20" y="-20" width="1120" height="1960" fill="url(#${P}-sky)"/>`;

  // sun / moon
  if (time === "morning") s += `<circle cx="860" cy="260" r="160" fill="url(#${P}-sun)"/><circle cx="860" cy="280" r="48" fill="${pal.sun}"/>`;
  if (time === "day") s += `<circle cx="700" cy="200" r="180" fill="url(#${P}-sun)"/><circle cx="700" cy="210" r="40" fill="${pal.sun}"/>`;
  if (time === "dusk" || time === "gold") {
    // sun low, maybe blocked by towers in gold mode
    s += `<circle cx="${gold ? 540 : 200}" cy="520" r="200" fill="url(#${P}-sun)"/>`;
    s += `<circle cx="${gold ? 540 : 200}" cy="560" r="58" fill="${pal.sun}"/>`;
  }
  if (time === "night") {
    s += `<circle cx="860" cy="200" r="120" fill="url(#${P}-sun)"/><circle cx="860" cy="210" r="34" fill="${pal.sun}"/>`;
    for (const [sx, sy, r] of [[80, 80, 2], [200, 140, 1.5], [400, 90, 2], [520, 60, 1], [980, 120, 2], [300, 220, 1], [640, 160, 1.5]]) {
      s += `<circle cx="${sx}" cy="${sy}" r="${r}" fill="#fff" opacity=".8"/>`;
    }
  }

  // far skyline silhouettes
  const sil = gold
    ? ["#c89050", "#8a5a30", "#d4a060"]
    : night
      ? ["#12141e", "#1a1c28", "#101218"]
      : ["#c8b0a0", "#b09a8c", "#d0c0b0"];
  s += `<path d="M-10 760 L40 700 L80 730 L120 640 L170 700 L220 620 L260 690 L320 600 L380 680 L440 640 L500 700 L560 630 L620 710 L680 650 L740 700 L800 610 L860 690 L920 630 L980 700 L1088 640 L1088 820 L-10 820 Z" fill="${sil[0]}" opacity=".85"/>`;
  s += `<path d="M-10 800 L60 740 L140 780 L200 700 L280 760 L360 690 L460 770 L540 710 L640 780 L740 700 L840 760 L960 690 L1088 750 L1088 880 L-10 880 Z" fill="${sil[1]}" opacity=".7"/>`;

  // left office towers
  if (gold) {
    // Dubai-like tapering towers that can shade the sun
    s += goldTowers(pal);
  } else {
    s += tower( -10, 430, 130, 760, pal.bldg[0], pal.glass, { cols: 4, rows: 16, cap: pal.bldg[3], top: 30 });
    s += tower( 110, 520, 100, 670, pal.bldg[1], pal.glass2, { cols: 3, rows: 14, cap: pal.bldg[4], top: 24 });
    s += tower( 200, 600, 80, 590, pal.bldg[2], pal.glass, { cols: 3, rows: 12, cap: pal.bldg[0], top: 18 });
    // mid-left shorter
    s += tower( 270, 700, 90, 490, pal.bldg[4], pal.glass2, { cols: 3, rows: 10, cap: pal.bldg[1], top: 16 });
  }

  // right mall + a slim tower behind it
  if (!gold) {
    s += tower( 680, 560, 90, 630, pal.bldg[2], pal.glass, { cols: 3, rows: 14, cap: pal.bldg[0], top: 20 });
  }
  s += mall(760, 560, pal, gold);

  if (park) s += oasisPark(pal);

  // haze over city feet
  s += `<rect x="-20" y="980" width="1120" height="220" fill="url(#${P}-haze)"/>`;

  // BTS
  s += bts(pal, { trainX, gold, night, closeToRig: rig });

  // GROUND / intersection
  s += `<rect x="-20" y="1180" width="1120" height="760" fill="url(#${P}-road)"/>`;
  // sidewalks
  s += `<path d="M-20 1180 L200 1180 L80 1920 L-20 1920 Z" fill="${pal.curb}"/>`;
  s += `<path d="M880 1180 L1100 1180 L1100 1920 L1000 1920 Z" fill="${pal.curb}"/>`;
  s += `<rect x="-20" y="1180" width="1120" height="14" fill="${pal.curb}"/>`;

  // perspective road markings toward vanishing point ~ (540, 1000)
  s += roadMarkings(pal, P);

  // traffic lights
  s += trafficLight(250, 1120, night || time === "dusk");
  s += trafficLight(820, 1120, night || time === "dusk");

  // street lamps
  for (const lx of [60, 300, 780, 1020]) s += lamp(lx, 1100, night || time === "dusk" || gold);

  // small intersection sign (generic Thai, no brand)
  s += `<g transform="translate(140 1080)">
    <rect x="-70" y="-28" width="140" height="40" rx="6" fill="#2a4a3a" stroke="#f4efe6" stroke-width="2"/>
    ${txt(0, 2, "แยกอโศก", { size: 18, weight: 700, fill: "#f4efe6" })}
  </g>`;

  s += `</g>`;
  return s;
}

function goldTowers(pal) {
  // Tapered glass-and-gold towers that rise high and shade the sun
  const spire = (x, baseY, baseW, h, fill, glass) => {
    const topW = Math.max(12, baseW * 0.18);
    const midY = baseY + h * 0.35;
    return `
      <path d="M${x} ${baseY + h} L${x + baseW} ${baseY + h} L${x + baseW * 0.5 + topW / 2} ${baseY} L${x + baseW * 0.5 - topW / 2} ${baseY} Z" fill="${fill}"/>
      <path d="M${x + baseW * 0.55} ${baseY + h} L${x + baseW} ${baseY + h} L${x + baseW * 0.5 + topW / 2} ${baseY} L${x + baseW * 0.5} ${baseY + 8} Z" fill="#000" opacity=".15"/>
      <path d="M${x + 10} ${baseY + h - 20} L${x + baseW - 10} ${baseY + h - 20} L${x + baseW * 0.5 + topW / 2 - 4} ${baseY + 30} L${x + baseW * 0.5 - topW / 2 + 4} ${baseY + 30} Z" fill="${glass}" opacity=".55"/>
      <rect x="${x + baseW * 0.5 - 3}" y="${baseY - 70}" width="6" height="80" fill="${fill}"/>
      <circle cx="${x + baseW * 0.5}" cy="${baseY - 74}" r="7" fill="#ffe08a"/>
    `;
  };
  let s = `<g class="gold-towers">`;
  s += spire(-30, 80, 180, 1110, "#e8c878", "#5ad0d8");
  s += spire(130, 200, 140, 990, "#c8a058", "#3aa0b0");
  s += spire(250, 340, 110, 850, "#f0d090", "#7edce0");
  // a very tall needle that covers the sun
  s += spire(420, -40, 90, 1230, "#f4e0b0", "#8ae8f0");
  s += `</g>`;
  return s;
}

function oasisPark(pal) {
  return `<g class="oasis" transform="translate(20 1020)">
    <ellipse cx="200" cy="160" rx="240" ry="90" fill="#1a4a40"/>
    <ellipse cx="200" cy="150" rx="190" ry="60" fill="#2a8a80"/>
    <ellipse cx="200" cy="142" rx="150" ry="44" fill="#4ad0d0" opacity=".8"/>
    <ellipse cx="180" cy="132" rx="80" ry="20" fill="#e8ffff" opacity=".45"/>
    ${palm(50, 130, 1.15)} ${palm(200, 90, 1.35)} ${palm(340, 140, 1.1)}
  </g>`;
}

export function palm(x, y, scale = 1) {
  const frond = (rot) => `<path d="M0 0 Q-10 -80 0 -130 Q10 -80 0 0" fill="#2a7a48" transform="rotate(${rot})"/>`;
  return `<g class="palm" transform="translate(${x} ${y}) scale(${scale})">
    <path d="M-6 0 L6 0 L10 140 L-10 140 Z" fill="#8a5a30"/>
    ${[0, 40, 80, 120, 160, 200, 240, 280, 320].map(frond).join("")}
    <circle cy="-8" r="10" fill="#3a8a4a"/>
  </g>`;
}

function roadMarkings(pal, P) {
  let s = `<g class="road-marks">`;
  // center dashed line going down, widening
  for (let i = 0; i < 10; i++) {
    const t = i / 10;
    const y = 1200 + t * 700;
    const sc = 0.5 + t * 1.1;
    const h = 22 * sc, w = 14 * sc, gap = 28 * sc;
    s += `<rect x="${540 - w / 2}" y="${y}" width="${w}" height="${h}" rx="2" fill="${pal.roadLine}" opacity=".85"/>`;
  }
  // zebra crossing mid
  for (let i = 0; i < 9; i++) {
    const x = 300 + i * 54;
    s += `<path d="M${x} 1320 L${x + 28} 1320 L${x + 40} 1420 L${x + 12} 1420 Z" fill="${pal.roadLine}" opacity=".9"/>`;
  }
  // a second zebra lower
  for (let i = 0; i < 9; i++) {
    const x = 260 + i * 62;
    s += `<path d="M${x} 1680 L${x + 32} 1680 L${x + 44} 1800 L${x + 12} 1800 Z" fill="${pal.roadLine}" opacity=".75"/>`;
  }
  // lane edges
  s += `<path d="M300 1194 L120 1920" stroke="${pal.roadLine}" stroke-width="4" opacity=".35" fill="none"/>`;
  s += `<path d="M780 1194 L960 1920" stroke="${pal.roadLine}" stroke-width="4" opacity=".35" fill="none"/>`;
  s += `</g>`;
  return s;
}

function trafficLight(x, y, on = false) {
  return `<g class="tlight" transform="translate(${x} ${y})">
    <rect x="-6" y="-70" width="12" height="70" fill="#2a2a30"/>
    <rect x="-16" y="-130" width="32" height="64" rx="6" fill="#1a1a20" stroke="#3a3a42" stroke-width="2"/>
    <circle cy="-112" r="7" fill="${on ? "#e0464c" : "#5a2020"}"/>
    <circle cy="-96" r="7" fill="${on ? "#f0c14a" : "#5a4a20"}"/>
    <circle cy="-80" r="7" fill="${on ? "#3dca6a" : "#1a4a20"}"/>
  </g>`;
}

function lamp(x, y, lit = false) {
  return `<g class="lamp" transform="translate(${x} ${y})">
    <rect x="-5" y="-100" width="10" height="110" fill="#4a4a52"/>
    <path d="M-5 -100 Q40 -120 48 -90" fill="none" stroke="#4a4a52" stroke-width="6"/>
    <ellipse cx="50" cy="-86" rx="14" ry="8" fill="${lit ? "#ffe9a0" : "#c8c8d0"}"/>
    ${lit ? `<ellipse cx="50" cy="-70" rx="40" ry="50" fill="#ffe9a0" opacity=".18"/>` : ""}
  </g>`;
}

export function oilGeyser({ x = 540, y = 1480, h = 720, prefix = "oil", crown = true, splash = true, mist = true } = {}) {
  const P = prefix;
  const top = y - h;
  let s = `<g id="${P}" class="oil-geyser">`;
  s += `<defs>
    <linearGradient id="${P}-col" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#1a1a22"/>
      <stop offset=".22" stop-color="#3a3a44"/>
      <stop offset=".45" stop-color="#0c0c10"/>
      <stop offset=".7" stop-color="#1a120c"/>
      <stop offset="1" stop-color="#050506"/>
    </linearGradient>
    <radialGradient id="${P}-pool" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#2a2a33"/>
      <stop offset=".5" stop-color="#0c0c10"/>
      <stop offset="1" stop-color="#050506"/>
    </radialGradient>
    <linearGradient id="${P}-sheen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6a8a6a" stop-opacity=".35"/>
      <stop offset=".4" stop-color="#4a3a6a" stop-opacity=".15"/>
      <stop offset="1" stop-color="#1a1a00" stop-opacity="0"/>
    </linearGradient>
  </defs>`;

  // cracks
  const cracks = [
    `M${x} ${y} L${x - 220} ${y + 80} L${x - 300} ${y + 40}`,
    `M${x} ${y} L${x - 80} ${y + 160} L${x - 40} ${y + 240}`,
    `M${x} ${y} L${x + 240} ${y + 60} L${x + 340} ${y + 20}`,
    `M${x} ${y} L${x + 60} ${y + 180} L${x + 20} ${y + 280}`,
    `M${x} ${y} L${x - 160} ${y - 20} L${x - 280} ${y + 10}`,
    `M${x} ${y} L${x + 180} ${y - 30}`,
    `M${x - 120} ${y + 40} L${x - 180} ${y + 140}`,
    `M${x + 140} ${y + 50} L${x + 200} ${y + 150}`,
  ];
  for (const d of cracks) {
    s += `<path d="${d}" fill="none" stroke="#0a0a0c" stroke-width="10" stroke-linecap="round"/>`;
    s += `<path d="${d}" fill="none" stroke="#1a1a22" stroke-width="4" stroke-linecap="round"/>`;
  }

  // pool
  s += `<ellipse cx="${x}" cy="${y + 16}" rx="210" ry="70" fill="url(#${P}-pool)"/>`;
  s += `<ellipse cx="${x - 20}" cy="${y}" rx="140" ry="36" fill="url(#${P}-sheen)"/>`;
  s += `<ellipse cx="${x}" cy="${y + 16}" rx="210" ry="70" fill="none" stroke="#000" stroke-width="3" opacity=".5"/>`;

  // column
  const col = `M${x - 50} ${y}
    C ${x - 70} ${y - h * 0.2}, ${x - 36} ${y - h * 0.35}, ${x - 58} ${y - h * 0.5}
    C ${x - 80} ${y - h * 0.62}, ${x - 30} ${y - h * 0.78}, ${x - 64} ${top + 80}
    C ${x - 90} ${top + 20}, ${x - 40} ${top + 10}, ${x} ${top}
    C ${x + 50} ${top - 10}, ${x + 110} ${top + 30}, ${x + 80} ${top + 90}
    C ${x + 40} ${y - h * 0.78}, ${x + 90} ${y - h * 0.62}, ${x + 54} ${y - h * 0.5}
    C ${x + 28} ${y - h * 0.35}, ${x + 74} ${y - h * 0.2}, ${x + 48} ${y}
    Z`;
  s += `<path class="oil-col" d="${col}" fill="url(#${P}-col)"/>`;
  // left highlight
  s += `<path d="M${x - 36} ${y - 20} C ${x - 50} ${y - h * 0.3}, ${x - 20} ${y - h * 0.55}, ${x - 40} ${top + 120}" fill="none" stroke="#6a6a78" stroke-width="8" stroke-linecap="round" opacity=".45"/>`;
  s += `<path d="M${x - 24} ${y - 40} C ${x - 30} ${y - h * 0.3}, ${x - 8} ${y - h * 0.55}, ${x - 22} ${top + 160}" fill="none" stroke="#9aa0aa" stroke-width="3" stroke-linecap="round" opacity=".35"/>`;
  // iridescent sheen patch
  s += `<ellipse cx="${x + 16}" cy="${y - h * 0.4}" rx="18" ry="50" fill="#4a6a8a" opacity=".25" transform="rotate(-8 ${x + 16} ${y - h * 0.4})"/>`;

  if (crown) {
    // mushroom crown / splash head
    s += `<ellipse cx="${x + 6}" cy="${top + 20}" rx="120" ry="48" fill="#0c0c10"/>`;
    s += `<ellipse cx="${x - 10}" cy="${top + 8}" rx="80" ry="28" fill="#2a2a33"/>`;
    s += `<ellipse cx="${x - 30}" cy="${top}" rx="40" ry="16" fill="#4a4a55" opacity=".5"/>`;
    // falling globs from crown
    const globs = [[-90, 30, 18], [90, 40, 22], [-50, 70, 14], [60, 90, 16], [0, -20, 20], [40, 16, 12], [-70, 10, 10]];
    for (const [dx, dy, r] of globs) {
      s += `<ellipse cx="${x + dx}" cy="${top + dy}" rx="${r}" ry="${r * 1.2}" fill="#0c0c10"/>`;
    }
  }

  if (splash) {
    const drops = [
      [x - 160, y - 200, 10], [x + 180, y - 260, 14], [x - 200, y - 420, 8],
      [x + 210, y - 480, 11], [x - 90, y - 560, 7], [x + 120, y - 600, 9],
      [x + 260, y - 180, 16], [x - 240, y - 120, 12], [x + 80, y - 80, 8],
      [x - 130, y - 320, 6], [x + 150, y - 360, 7], [x - 40, y - 640, 5],
      [x + 40, y - 680, 6], [x + 300, y - 300, 9], [x - 280, y - 250, 8],
    ];
    for (const [dx, dy, r] of drops) {
      s += `<ellipse class="oil-drop" cx="${dx}" cy="${dy}" rx="${r}" ry="${r * 1.25}" fill="#0a0a0c"/>`;
      s += `<ellipse cx="${dx - r * 0.3}" cy="${dy - r * 0.3}" rx="${r * 0.3}" ry="${r * 0.4}" fill="#4a4a55" opacity=".4"/>`;
    }
  }

  if (mist) {
    s += `<ellipse cx="${x}" cy="${top + 40}" rx="200" ry="80" fill="#1a1a20" opacity=".25"/>`;
    s += `<ellipse cx="${x}" cy="${y - 40}" rx="160" ry="50" fill="#2a2a28" opacity=".2"/>`;
  }

  s += `</g>`;
  return s;
}

export function heightMarker(x, y, h, label = "สูงเท่าตึก 3 ชั้น") {
  const mid = y - h / 2;
  return `<g class="height-mark">
    <path d="M${x} ${y} L${x} ${y - h}" stroke="#f7efe2" stroke-width="4" stroke-dasharray="10 7"/>
    <path d="M${x - 16} ${y} L${x + 16} ${y} M${x - 16} ${y - h} L${x + 16} ${y - h}" stroke="#f7efe2" stroke-width="4"/>
    <rect x="${x - 188}" y="${mid - 40}" width="170" height="80" rx="14" fill="#1a1208" stroke="#f0c14a" stroke-width="3"/>
    ${txt(x - 103, mid - 6, "สูงเท่า", { size: 20, weight: 700, fill: "#e2c7ae" })}
    ${txt(x - 103, mid + 24, "ตึก 3 ชั้น", { size: 24, weight: 800, fill: "#f7efe2" })}
  </g>`;
}

/** Vehicles — slightly elevated 3/4 cartoon view. */
export function vehicle(kind, x, y, o = {}) {
  const {
    color = "#c8282f", scale = 1, rot = 0, flip = false,
    label = "",
  } = o;
  const sc = `translate(${x} ${y}) rotate(${rot}) scale(${flip ? -scale : scale} ${scale})`;
  const shadow = `<ellipse cx="0" cy="22" rx="70" ry="10" fill="#000" opacity=".35"/>`;
  if (kind === "sedan" || kind === "taxi") {
    const body = kind === "taxi" ? (o.color || "#f0c14a") : color;
    const stripe = kind === "taxi" ? (o.stripe || "#3dca6a") : null;
    return `<g class="veh veh-${kind}" transform="${sc}">
      ${shadow}
      <path d="M-70 6 Q-74 -6 -50 -10 L-28 -10 L-16 -32 L22 -34 L38 -10 L62 -8 Q76 -4 74 8 L70 18 L-66 18 Z" fill="${body}"/>
      <path d="M-14 -28 L-4 -10 L36 -10 L20 -30 Z" fill="#b8d8ea"/>
      <path d="M-14 -28 L-24 -10 L-4 -10 Z" fill="#8ab0c4"/>
      ${stripe ? `<path d="M-60 2 L64 2 L62 10 L-62 10 Z" fill="${stripe}"/>` : ""}
      <circle cx="-42" cy="18" r="12" fill="#1a1a20"/><circle cx="-42" cy="18" r="6" fill="#6a6a70"/>
      <circle cx="40" cy="18" r="12" fill="#1a1a20"/><circle cx="40" cy="18" r="6" fill="#6a6a70"/>
      <rect x="58" y="0" width="8" height="6" rx="1" fill="#ffe08a"/>
      <rect x="-68" y="0" width="6" height="6" rx="1" fill="#e0464c"/>
      ${label ? txt(0, 6, label, { size: 10, weight: 700, fill: "#1a1a20" }) : ""}
    </g>`;
  }
  if (kind === "supercar") {
    return `<g class="veh veh-super" transform="${sc}">
      ${shadow}
      <path d="M-80 8 Q-82 0 -60 -6 L-20 -8 L-8 -22 L24 -22 L44 -8 L70 -4 Q86 0 84 10 L78 18 L-74 18 Z" fill="${color}"/>
      <path d="M-6 -20 L4 -8 L40 -8 L22 -20 Z" fill="#7ec8ff" opacity=".8"/>
      <path d="M-70 8 L80 8" stroke="#000" stroke-width="2" opacity=".25"/>
      <circle cx="-48" cy="16" r="13" fill="#1a1a20"/><circle cx="-48" cy="16" r="6" fill="#888"/>
      <circle cx="50" cy="16" r="13" fill="#1a1a20"/><circle cx="50" cy="16" r="6" fill="#888"/>
      <rect x="70" y="0" width="12" height="5" fill="#fff0c0"/>
    </g>`;
  }
  if (kind === "bus") {
    return `<g class="veh veh-bus" transform="${sc}">
      <ellipse cx="0" cy="28" rx="110" ry="12" fill="#000" opacity=".35"/>
      <rect x="-110" y="-46" width="220" height="70" rx="10" fill="${color}"/>
      <rect x="-110" y="-46" width="220" height="18" fill="${o.top || "#f4efe6"}"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${-90 + i * 34}" y="-24" width="26" height="22" rx="3" fill="#b8d8ea"/>`).join("")}
      <rect x="86" y="-24" width="16" height="36" rx="2" fill="#8ab0c4"/>
      <circle cx="-70" cy="28" r="14" fill="#1a1a20"/><circle cx="70" cy="28" r="14" fill="#1a1a20"/>
    </g>`;
  }
  if (kind === "moto") {
    return `<g class="veh veh-moto" transform="${sc}">
      <ellipse cx="0" cy="16" rx="36" ry="7" fill="#000" opacity=".3"/>
      <circle cx="-22" cy="12" r="10" fill="#1a1a20"/><circle cx="24" cy="12" r="10" fill="#1a1a20"/>
      <path d="M-16 4 L20 4 L16 -6 L-8 -4 Z" fill="${color}"/>
      <path d="M16 -6 L28 -16 L32 -8" stroke="#2a2a30" stroke-width="4" fill="none"/>
      <rect x="-6" y="-10" width="16" height="8" rx="2" fill="#3a3a42"/>
    </g>`;
  }
  if (kind === "tuktuk" || kind === "tuktuk-gold") {
    const body = kind === "tuktuk-gold" ? "#f0c14a" : (color || "#f0c14a");
    const trim = kind === "tuktuk-gold" ? "#fff0c0" : "#c8282f";
    return `<g class="veh veh-tuktuk" transform="${sc}">
      <ellipse cx="0" cy="28" rx="70" ry="10" fill="#000" opacity=".35"/>
      <path d="M-40 16 L-40 -8 L-10 -36 L50 -36 L62 -8 L62 16 Z" fill="${body}"/>
      <rect x="-8" y="-30" width="54" height="22" rx="4" fill="#7ec8ff" opacity=".7"/>
      <rect x="-40" y="-8" width="28" height="24" fill="${trim}"/>
      <circle cx="-28" cy="20" r="11" fill="#1a1a20"/>
      <circle cx="28" cy="20" r="11" fill="#1a1a20"/>
      <circle cx="52" cy="20" r="11" fill="#1a1a20"/>
      ${kind === "tuktuk-gold" ? `
        <rect x="-10" y="-58" width="52" height="20" rx="5" fill="#e8eef4" stroke="#8aa0b0" stroke-width="2.5"/>
        <rect x="-4" y="-52" width="40" height="8" rx="2" fill="#c8d8e4"/>
        <circle cx="6" cy="-66" r="4" fill="#8aa0b0"/>
        <path d="M-20 2 L58 2" stroke="#fff0c0" stroke-width="3"/>
        <path d="M-36 8 L-36 -8 L-10 -20" stroke="#d8a64a" stroke-width="5" fill="none"/>
      ` : ""}
    </g>`;
  }
  if (kind === "fire") {
    return `<g class="veh veh-fire" transform="${sc}">
      <ellipse cx="0" cy="28" rx="130" ry="12" fill="#000" opacity=".35"/>
      <rect x="-130" y="-28" width="260" height="50" rx="8" fill="#c8282f"/>
      <rect x="-80" y="-52" width="140" height="28" rx="4" fill="#a01c22"/>
      <rect x="-120" y="-20" width="40" height="22" rx="3" fill="#7ec8ff"/>
      <rect x="80" y="-20" width="28" height="16" fill="#f0c14a"/>
      <rect x="-20" y="-70" width="120" height="10" rx="3" fill="#c8c8d0"/>
      <circle cx="-80" cy="26" r="14" fill="#1a1a20"/>
      <circle cx="20" cy="26" r="14" fill="#1a1a20"/>
      <circle cx="90" cy="26" r="14" fill="#1a1a20"/>
    </g>`;
  }
  if (kind === "van") {
    return `<g class="veh veh-van" transform="${sc}">
      <ellipse cx="0" cy="24" rx="80" ry="10" fill="#000" opacity=".35"/>
      <path d="M-80 12 L-80 -20 L-40 -40 L70 -40 L80 -10 L80 16 Z" fill="${color}"/>
      <rect x="-28" y="-34" width="86" height="22" rx="3" fill="#b8d8ea"/>
      <circle cx="-50" cy="18" r="12" fill="#1a1a20"/>
      <circle cx="50" cy="18" r="12" fill="#1a1a20"/>
    </g>`;
  }
  return vehicle("sedan", x, y, o);
}

export function plane(x, y, scale = 1, rot = -12) {
  return `<g class="plane" transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})">
    <ellipse cy="0" rx="90" ry="14" fill="#f4efe6"/>
    <path d="M-10 0 L10 0 L0 48 Z" fill="#d8d0c8"/>
    <path d="M20 0 L70 -36 L50 0 Z" fill="#e8e0d8"/>
    <path d="M-70 -4 L-88 -24 L-60 -4 Z" fill="#e8e0d8"/>
    <circle cx="50" cy="-2" r="6" fill="#7ec8ff"/>
  </g>`;
}

export function barriers(x, y, n = 4, scale = 1) {
  let s = `<g class="barriers" transform="translate(${x} ${y}) scale(${scale})">`;
  for (let i = 0; i < n; i++) {
    const bx = i * 70;
    s += `<rect x="${bx}" y="-28" width="64" height="28" fill="#e0464c"/>`;
    s += `<rect x="${bx}" y="-28" width="64" height="28" fill="none" stroke="#f4efe6" stroke-width="2"/>`;
    s += `<rect x="${bx + 8}" y="0" width="8" height="18" fill="#c8c8d0"/>`;
    s += `<rect x="${bx + 48}" y="0" width="8" height="18" fill="#c8c8d0"/>`;
  }
  s += `</g>`;
  return s;
}

export function cautionTape(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  const ang = Math.atan2(dy, dx) * 180 / Math.PI;
  const stripes = Math.ceil(len / 28);
  let s = `<g class="tape" transform="translate(${x1} ${y1}) rotate(${ang})">`;
  s += `<rect y="-8" width="${len}" height="16" fill="#f0c14a"/>`;
  for (let i = 0; i < stripes; i++) {
    if (i % 2 === 0) s += `<rect x="${i * 28}" y="-8" width="14" height="16" fill="#1a1a20"/>`;
  }
  s += `</g>`;
  return s;
}

export function firetruckScene(x, y, scale = 1) {
  return vehicle("fire", x, y, { scale });
}

export function drillingRig({ x = 540, y = 1400, h = 980, prefix = "rig" } = {}) {
  const P = prefix;
  const top = y - h;
  let s = `<g id="${P}" class="rig">`;
  s += `<defs>
    <linearGradient id="${P}-steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8a9098"/><stop offset=".5" stop-color="#d0d4d8"/><stop offset="1" stop-color="#5a6068"/>
    </linearGradient>
  </defs>`;
  // platform
  s += `<rect x="${x - 180}" y="${y - 80}" width="360" height="28" fill="#4a4a52"/>`;
  s += `<rect x="${x - 190}" y="${y - 56}" width="380" height="16" fill="#3a3a42"/>`;
  // legs
  for (const lx of [x - 150, x - 60, x + 50, x + 140]) {
    s += `<path d="M${lx} ${y - 56} L${lx + 10} ${y - 56} L${lx + 24} ${y + 40} L${lx - 14} ${y + 40} Z" fill="#5a5a62"/>`;
  }
  // lattice derrick
  const half = 70;
  s += `<path d="M${x - half} ${y - 80} L${x - 18} ${top + 40} L${x + 18} ${top + 40} L${x + half} ${y - 80}" fill="#9aa0a8" stroke="#2a2a30" stroke-width="3"/>`;
  // cross braces
  const steps = 10;
  for (let i = 0; i < steps; i++) {
    const t0 = i / steps, t1 = (i + 1) / steps;
    const y0 = (y - 80) + (top + 40 - (y - 80)) * t0;
    const y1 = (y - 80) + (top + 40 - (y - 80)) * t1;
    const w0 = 18 + (half - 18) * (1 - t0);
    const w1 = 18 + (half - 18) * (1 - t1);
    s += `<path d="M${x - w0} ${y0} L${x + w1} ${y1} M${x + w0} ${y0} L${x - w1} ${y1}" stroke="#2a2a30" stroke-width="3" fill="none"/>`;
    s += `<path d="M${x - w0} ${y0} L${x + w0} ${y0}" stroke="#2a2a30" stroke-width="2"/>`;
  }
  // crown block
  s += `<rect x="${x - 28}" y="${top + 8}" width="56" height="36" fill="#d0d4d8" stroke="#2a2a30" stroke-width="2"/>`;
  s += `<rect x="${x - 4}" y="${top - 20}" width="8" height="30" fill="#c8a060"/>`;
  // hook + pipe
  s += `<rect x="${x - 6}" y="${top + 44}" width="12" height="${y - 120 - (top + 44)}" fill="#6a6a70"/>`;
  s += `<circle cx="${x}" cy="${y - 130}" r="14" fill="#c8a060"/>`;
  // stairs / cabin
  s += `<rect x="${x + 80}" y="${y - 150}" width="70" height="70" rx="4" fill="#c8282f"/>`;
  s += `<rect x="${x + 88}" y="${y - 140}" width="22" height="16" fill="#7ec8ff"/>`;
  s += `<rect x="${x + 114}" y="${y - 140}" width="22" height="16" fill="#7ec8ff"/>`;
  s += `</g>`;
  return s;
}

export function smellClouds(items) {
  let s = `<g class="smell">`;
  for (const [x, y, r, op = 0.45] of items) {
    s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.7}" fill="#c8d84a" opacity="${op}"/>`;
    s += `<ellipse cx="${x + r * 0.4}" cy="${y - r * 0.2}" rx="${r * 0.55}" ry="${r * 0.4}" fill="#a8c03a" opacity="${op * 0.8}"/>`;
    // stink lines
    s += `<path d="M${x - 10} ${y - r * 0.8} Q${x - 16} ${y - r * 1.1} ${x - 6} ${y - r * 1.3}" fill="none" stroke="#6a7a20" stroke-width="3" opacity=".5"/>`;
    s += `<path d="M${x + 8} ${y - r * 0.85} Q${x + 16} ${y - r * 1.15} ${x + 4} ${y - r * 1.35}" fill="none" stroke="#6a7a20" stroke-width="3" opacity=".5"/>`;
  }
  s += `</g>`;
  return s;
}

export function liveUI({ x = 800, y = 1280, caption = "อโศกเดือด! น้ำพุโคล่าผุดกลางกรุง", viewers = "12,482 กำลังดู" } = {}) {
  return `<g class="live-ui" transform="translate(${x} ${y})">
    <rect x="-200" y="-260" width="400" height="520" rx="28" fill="#1a1a20" stroke="#3a3a44" stroke-width="6"/>
    <rect x="-184" y="-236" width="368" height="420" rx="16" fill="#2a1a18"/>
    <!-- fake live footage: oil mini -->
    <ellipse cx="0" cy="40" rx="80" ry="28" fill="#0c0c10"/>
    <path d="M-20 40 C-30 -40, 10 -120, 0 -160 C40 -140, 30 -40, 20 40 Z" fill="#1a1a22"/>
    <g transform="translate(-150 -220)">
      <rect width="70" height="28" rx="6" fill="#e0464c"/>
      ${txt(35, 20, "LIVE", { size: 16, weight: 800, fill: "#fff" })}
    </g>
    ${viewers ? txt(40, -200, viewers, { size: 16, weight: 600, fill: "#f4efe6", anchor: "start" }) : ""}
    <!-- hearts -->
    ${[0, 1, 2, 3, 4].map((i) => {
      const hx = 150 + (i % 2) * 12, hy = 80 - i * 36, sc = 0.7 + (i % 3) * 0.15;
      return `<g transform="translate(${hx} ${hy}) scale(${sc})" opacity="${0.9 - i * 0.12}">
        <path d="M0 8 C0 2 -8 -4 -14 2 C-20 8 0 22 0 22 C0 22 20 8 14 2 C8 -4 0 2 0 8 Z" fill="${i % 2 ? "#e07a9a" : "#e0464c"}"/>
      </g>`;
    }).join("")}
    <!-- comments -->
    <g font-family="${FONT}">
      <rect x="-170" y="130" width="230" height="28" rx="14" fill="#000" opacity=".45"/>
      ${txt(-55, 150, "ท่อแตกหรือคะ", { size: 14, weight: 600, fill: "#fff", anchor: "start" }).replace('x="-55"', 'x="-158"')}
      <rect x="-170" y="164" width="260" height="28" rx="14" fill="#000" opacity=".45"/>
      ${txt(-158, 184, "กลิ่นพุ่งมากกก", { size: 14, weight: 600, fill: "#fff", anchor: "start" })}
      <rect x="-170" y="198" width="200" height="28" rx="14" fill="#000" opacity=".45"/>
      ${txt(-158, 218, "อโศกเดือดจริง", { size: 14, weight: 600, fill: "#fff", anchor: "start" })}
    </g>
    <!-- caption bar under the phone -->
    <rect x="-200" y="270" width="400" height="86" rx="14" fill="#1a1208" stroke="#e0464c" stroke-width="3"/>
    ${txt(0, 306, caption, { size: 20, weight: 800, fill: "#f7efe2" })}
    ${txt(0, 336, "ไลฟ์จากแยกอโศก", { size: 14, weight: 500, fill: "#e2c7ae" })}
  </g>`;
}

export function insetMap({ x = 200, y = 1680 } = {}) {
  return `<g class="inset-map" transform="translate(${x} ${y})">
    <rect x="-160" y="-110" width="320" height="210" rx="16" fill="#1a2420" stroke="#f4efe6" stroke-width="3"/>
    ${txt(0, -84, "รถติดถึงบางนา", { size: 18, weight: 700, fill: "#f4efe6" })}
    <!-- stylized roads -->
    <path d="M-120 0 L-20 -20 L40 10 L120 -10" fill="none" stroke="#4a5a52" stroke-width="14" stroke-linecap="round"/>
    <path d="M-40 -40 L-20 -20 L-10 50" fill="none" stroke="#4a5a52" stroke-width="10" stroke-linecap="round"/>
    <!-- red jam line -->
    <path d="M-120 0 L-20 -20 L40 10 L120 -10" fill="none" stroke="#e0464c" stroke-width="6" stroke-linecap="round"/>
    <circle cx="-120" cy="0" r="8" fill="#f0c14a"/>
    <circle cx="120" cy="-10" r="8" fill="#e0464c"/>
    ${txt(-120, 28, "อโศก", { size: 14, weight: 700, fill: "#f0c14a" })}
    ${txt(120, 18, "บางนา", { size: 14, weight: 700, fill: "#e0464c" })}
  </g>`;
}

export function radioFire({ x = 900, y = 1680 } = {}) {
  return `<g class="radio-fire" transform="translate(${x} ${y})">
    <ellipse cx="0" cy="70" rx="70" ry="14" fill="#000" opacity=".3"/>
    <rect x="-48" y="10" width="96" height="50" rx="8" fill="#2a2a32"/>
    <circle cy="34" r="14" fill="#1a1a20" stroke="#f0c14a" stroke-width="3"/>
    <rect x="-8" y="-36" width="16" height="50" fill="#6a6a70"/>
    <circle cy="-44" r="14" fill="#c8c8d0"/>
    <!-- flames -->
    <path d="M-30 -20 Q-40 -70 -10 -90 Q0 -50 16 -80 Q40 -40 20 -10 Z" fill="#e0464c"/>
    <path d="M-16 -16 Q-14 -50 6 -64 Q12 -40 18 -20 Z" fill="#f0c14a"/>
    <!-- ringing call icons -->
    <g transform="translate(-70 -20)">
      <circle r="22" fill="#e0464c"/>
      <path d="M-6 -8 Q-10 0 -6 8 L0 6 Q4 0 0 -6 Z" fill="#fff"/>
    </g>
    <g transform="translate(70 -8)">
      <circle r="18" fill="#e0464c"/>
      <path d="M-5 -6 Q-8 0 -5 6 L0 4 Q3 0 0 -4 Z" fill="#fff"/>
    </g>
    ${txt(0, 90, "วิทยุจราจร สายล้น", { size: 16, weight: 700, fill: "#f4efe6" })}
  </g>`;
}

export function newsChyron(text, { y = 1780, kicker = "ข่าวด่วน" } = {}) {
  return `<g class="chyron">
    <rect x="0" y="${y}" width="1080" height="140" fill="#1a0c0c"/>
    <rect x="0" y="${y}" width="1080" height="8" fill="#c8282f"/>
    <rect x="0" y="${y + 8}" width="200" height="40" fill="#c8282f"/>
    ${txt(100, y + 36, kicker, { size: 20, weight: 800, fill: "#fff" })}
    ${txt(540, y + 100, text, { size: 40, weight: 800, fill: "#f7efe2" })}
  </g>`;
}

export function worldNewsFrame({ headline = "Bangkok: The New Dubai of Asia" } = {}) {
  return `<g class="world-news">
    <rect x="0" y="0" width="1080" height="86" fill="#0c1020"/>
    <rect x="0" y="86" width="1080" height="8" fill="#c8282f"/>
    ${txt(28, 38, "WORLD NEWS", { size: 22, weight: 800, fill: "#e2c7ae", anchor: "start" })}
    ${txt(28, 68, "BREAKING", { size: 16, weight: 700, fill: "#e0464c", anchor: "start" })}
    ${txt(1052, 56, "22:40 GMT", { size: 18, weight: 600, fill: "#c8c8d0", anchor: "end" })}
    <rect x="40" y="210" width="1000" height="120" rx="8" fill="#0c1020" opacity=".82"/>
    ${txt(540, 262, headline, { size: 38, weight: 800, fill: "#f7efe6" })}
    ${txt(540, 308, "กรุงเทพฯ แหล่งน้ำมันใหม่แห่งเอเชีย", { size: 22, weight: 600, fill: "#e2c7ae" })}
    <!-- ticker -->
    <rect x="0" y="1860" width="1080" height="60" fill="#0c1020"/>
    ${txt(540, 1900, "ที่ดินรอบอโศก    10 ล้านบาท / ตร.ว.    นายทุนบินลงสุวรรณภูมิ", { size: 20, weight: 600, fill: "#f4efe6" })}
  </g>`;
}

export function priceTag({ x = 860, y = 700, text = "10 ล้าน/ตร.ว." } = {}) {
  return `<g class="price-tag" transform="translate(${x} ${y})">
    <rect x="-150" y="-90" width="300" height="200" rx="16" fill="#1a1208" stroke="#d8a64a" stroke-width="4"/>
    ${txt(0, -50, "ราคาที่ดิน", { size: 20, weight: 600, fill: "#e2c7ae" })}
    ${txt(0, 0, text, { size: 34, weight: 800, fill: "#f0c14a" })}
    <!-- rocket graph -->
    <path d="M-110 70 L-40 50 L10 20 L80 -10 L120 -60" fill="none" stroke="#3dca6a" stroke-width="6" stroke-linecap="round"/>
    <path d="M120 -60 L100 -40 L118 -44 Z" fill="#3dca6a"/>
    <path d="M-110 70 L120 70" stroke="#f4efe6" stroke-width="2" opacity=".4"/>
  </g>`;
}

export function stall(x, y, { sign = "", sign2 = "", color = "#c8282f", pot = "#f0c14a", w = 180 } = {}) {
  const lines = sign2 ? [sign, sign2] : [sign];
  const sh = lines.length === 2 ? 78 : 50;
  const fontSize = 22;
  return `<g class="stall" transform="translate(${x} ${y})">
    <ellipse cx="0" cy="20" rx="${w / 2 + 10}" ry="14" fill="#000" opacity=".3"/>
    <rect x="${-w / 2}" y="-40" width="${w}" height="60" fill="#6a4a30"/>
    <path d="M${-w / 2 - 16} -40 L${w / 2 + 16} -40 L${w / 2} -80 L${-w / 2} -80 Z" fill="${color}"/>
    <rect x="${-w / 2 - 10}" y="${-80 - sh}" width="${w + 20}" height="${sh}" rx="10" fill="#1a1208" stroke="#f0c14a" stroke-width="4"/>
    ${lines.map((line, i) => txt(0, -80 - sh + 34 + i * 28, line, { size: fontSize, weight: 800, fill: "#f7efe2" })).join("")}
    <ellipse cx="-20" cy="-20" rx="22" ry="10" fill="${pot}"/>
    <ellipse cx="30" cy="-16" rx="16" ry="8" fill="#f4efe6"/>
  </g>`;
}

export function geoBoard({ x = 260, y = 1180 } = {}) {
  return `<g class="geo-board" transform="translate(${x} ${y})">
    <rect x="-200" y="-280" width="400" height="340" rx="10" fill="#f4efe6" stroke="#2a1b17" stroke-width="4"/>
    ${txt(0, -246, "แอ่งเจ้าพระยา", { size: 22, weight: 800, fill: "#2a1b17" })}
    <!-- layers -->
    <path d="M-170 -220 L170 -220 L170 -160 L-170 -140 Z" fill="#c8d8a0"/>
    <path d="M-170 -140 L170 -160 L170 -100 L-170 -80 Z" fill="#c8b898"/>
    <path d="M-170 -80 L170 -100 L170 -40 L-170 -20 Z" fill="#8a7a60"/>
    <path d="M-170 -20 L170 -40 L170 20 L-170 30 Z" fill="#4a3a30"/>
    <!-- unexpected oil pocket -->
    <ellipse cx="20" cy="-8" rx="60" ry="22" fill="#0c0c10"/>
    ${txt(-110, -180, "ดินตะกอน", { size: 14, weight: 600, fill: "#2a1b17", anchor: "start" })}
    ${txt(-110, -110, "หินทราย", { size: 14, weight: 600, fill: "#2a1b17", anchor: "start" })}
    ${txt(-110, -50, "หินดินดาน", { size: 14, weight: 600, fill: "#f4efe6", anchor: "start" })}
    ${txt(20, 0, "น้ำมัน??", { size: 16, weight: 800, fill: "#f0c14a" })}
    <!-- question marks -->
    ${txt(150, -200, "?", { size: 48, weight: 800, fill: "#c8282f" })}
    ${txt(-150, -40, "?", { size: 56, weight: 800, fill: "#c8282f" })}
    ${txt(130, 10, "?", { size: 40, weight: 800, fill: "#c8282f" })}
    <rect x="-180" y="40" width="360" height="44" rx="6" fill="#1a1208"/>
    ${txt(0, 70, "ตามหลักธรณีวิทยา ไม่ควรมี", { size: 16, weight: 700, fill: "#f4efe6" })}
  </g>`;
}

export function stamp(text, { x = 820, y = 420, rot = -18 } = {}) {
  const n = [...text].length;
  const w = n * 22 + 40;
  return `<g class="stamp" transform="translate(${x} ${y}) rotate(${rot})">
    <rect x="${-w / 2}" y="-40" width="${w}" height="80" rx="8" fill="none" stroke="#c8282f" stroke-width="8"/>
    <rect x="${-w / 2 + 8}" y="-32" width="${w - 16}" height="64" rx="4" fill="none" stroke="#c8282f" stroke-width="2"/>
    ${txt(0, 12, text, { size: 26, weight: 800, fill: "#c8282f" })}
  </g>`;
}

export function opecBadge({ x = 220, y = 360 } = {}) {
  return `<g class="opec" transform="translate(${x} ${y})">
    <circle r="90" fill="#1a3a2a" stroke="#d8a64a" stroke-width="6"/>
    <circle r="74" fill="none" stroke="#d8a64a" stroke-width="2"/>
    <path d="M-8 30 Q-30 -20 0 -50 Q30 -20 8 30 Z" fill="#0c0c10" stroke="#d8a64a" stroke-width="3"/>
    <ellipse cy="34" rx="16" ry="8" fill="#0c0c10"/>
    ${txt(0, 62, "OPEC+", { size: 22, weight: 800, fill: "#f0c14a" })}
    <!-- Thai flag (simplified bars, no crest) -->
    <g transform="translate(140 -10)">
      <rect x="0" y="0" width="90" height="60" rx="3" fill="#f4efe6"/>
      <rect x="0" y="0" width="90" height="10" fill="#c8282f"/>
      <rect x="0" y="10" width="90" height="10" fill="#f4efe6"/>
      <rect x="0" y="20" width="90" height="20" fill="#1a2a6a"/>
      <rect x="0" y="40" width="90" height="10" fill="#f4efe6"/>
      <rect x="0" y="50" width="90" height="10" fill="#c8282f"/>
    </g>
  </g>`;
}

export function ticket(x, y, { title = "BTS / MRT", sub = "ฟรีตลอดชีพ", color = "#3d8a6a" } = {}) {
  return `<g class="ticket" transform="translate(${x} ${y})">
    <rect x="-120" y="-50" width="240" height="100" rx="12" fill="${color}"/>
    <circle cx="-120" cy="0" r="14" fill="#1a1208"/>
    <circle cx="120" cy="0" r="14" fill="#1a1208"/>
    ${txt(0, -8, title, { size: 20, weight: 800, fill: "#f4efe6" })}
    ${txt(0, 28, sub, { size: 26, weight: 800, fill: "#fff0c0" })}
  </g>`;
}

export function coupon(x, y, rot = 0, scale = 1) {
  return `<g class="coupon" transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})">
    <rect x="-70" y="-32" width="140" height="64" rx="8" fill="#f4efe6" stroke="#3d8a4a" stroke-width="3" stroke-dasharray="7 4"/>
    ${txt(0, -4, "คูปองน้ำมัน", { size: 14, weight: 700, fill: "#2a4a28" })}
    ${txt(0, 22, "10,000 บาท", { size: 18, weight: 800, fill: "#1a5a28" })}
  </g>`;
}

export function speechBubble(x, y, text, { dir = "left", w = 280 } = {}) {
  const h = 110;
  const tail = dir === "left"
    ? `M${-20} ${h / 2 - 10} L${-70} ${h / 2 + 30} L${20} ${h / 2 - 4} Z`
    : `M${20} ${h / 2 - 10} L${70} ${h / 2 + 30} L${-20} ${h / 2 - 4} Z`;
  return `<g class="bubble" transform="translate(${x} ${y})">
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="20" fill="#f7efe2" stroke="#2a1b17" stroke-width="4"/>
    <path d="${tail}" fill="#f7efe2" stroke="#2a1b17" stroke-width="4"/>
    <path d="${tail}" fill="#f7efe2"/>
    ${txt(0, 12, text, { size: text.length > 12 ? 26 : 30, weight: 800, fill: "#c8282f" })}
  </g>`;
}

export function monument({ x = 540, y = 1500, scale = 1 } = {}) {
  return `<g class="monument" transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cy="24" rx="150" ry="22" fill="#000" opacity=".35"/>
    <path d="M-130 14 L130 14 L100 78 L-100 78 Z" fill="#6a5a48"/>
    <rect x="-88" y="-16" width="176" height="36" fill="#4a3a30"/>
    <rect x="-64" y="-46" width="128" height="30" fill="#c8a878"/>
    <!-- gold tricone bit pointing up: shaft + 3 cones -->
    <rect x="-18" y="-150" width="36" height="108" rx="4" fill="#d4a017"/>
    <rect x="-22" y="-70" width="44" height="28" rx="3" fill="#f0c14a"/>
    <rect x="-14" y="-150" width="6" height="100" fill="#fff0c0" opacity=".35"/>
    <circle cy="-160" r="26" fill="#e0b04a"/>
    <path d="M0 -250 L28 -168 L0 -150 L-28 -168 Z" fill="#f0c14a"/>
    <path d="M0 -250 L22 -200 L0 -180 L-8 -210 Z" fill="#fff0c0" opacity=".5"/>
    <path d="M-8 -160 L-62 -210 L-20 -130 Z" fill="#c89020"/>
    <path d="M8 -160 L62 -210 L20 -130 Z" fill="#d4a017"/>
    <path d="M-18 -200 L-62 -210 L-28 -168 Z" fill="#fff0c0" opacity=".25"/>
    <circle cx="-36" cy="-186" r="8" fill="#a87818"/>
    <circle cx="36" cy="-186" r="8" fill="#a87818"/>
    <circle cy="-210" r="8" fill="#a87818"/>
    <rect x="-80" y="20" width="160" height="32" rx="4" fill="#1a1208"/>
    ${txt(0, 42, "จุดเริ่มต้นบางดูไบ", { size: 15, weight: 700, fill: "#f0c14a" })}
  </g>`;
}

export function sparkles(pts) {
  return `<g class="sparkles">${pts.map(([x, y, r = 8]) =>
    `<g transform="translate(${x} ${y})">
      <path d="M0 ${-r} L${r * 0.2} ${-r * 0.2} L${r} 0 L${r * 0.2} ${r * 0.2} L0 ${r} L${-r * 0.2} ${r * 0.2} L${-r} 0 L${-r * 0.2} ${-r * 0.2} Z" fill="#fff0c0" opacity=".9"/>
    </g>`
  ).join("")}</g>`;
}

export function vignette() {
  return `<rect x="0" y="0" width="1080" height="1920" fill="url(#vignette)" pointer-events="none"/>`;
}

export function vignetteDef(id = "vignette") {
  return `<radialGradient id="${id}" cx="50%" cy="45%" r="72%">
    <stop offset=".55" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".42"/>
  </radialGradient>`;
}

export function snowflakes(x, y) {
  const flakes = [[-20, -30], [0, -50], [24, -36], [-8, -70], [16, -80], [30, -60], [-30, -55]];
  return `<g class="ac-snow" transform="translate(${x} ${y})">
    ${flakes.map(([fx, fy], i) =>
      `<g transform="translate(${fx} ${fy})" opacity="${0.8 - i * 0.05}">
        <path d="M0 -7 L0 7 M-6 -3.5 L6 3.5 M-6 3.5 L6 -3.5" stroke="#e8f4ff" stroke-width="1.8" stroke-linecap="round"/>
      </g>`
    ).join("")}
  </g>`;
}

export const FONT_CSS = `
@font-face { font-family: Kanit; font-weight: 400; font-style: normal; font-display: block; src: url("/assets/fonts/Kanit-Regular.ttf") format("truetype"); }
@font-face { font-family: Kanit; font-weight: 500; font-style: normal; font-display: block; src: url("/assets/fonts/Kanit-Medium.ttf") format("truetype"); }
@font-face { font-family: Kanit; font-weight: 600; font-style: normal; font-display: block; src: url("/assets/fonts/Kanit-SemiBold.ttf") format("truetype"); }
@font-face { font-family: Kanit; font-weight: 700; font-style: normal; font-display: block; src: url("/assets/fonts/Kanit-Bold.ttf") format("truetype"); }
@font-face { font-family: Kanit; font-weight: 800; font-style: normal; font-display: block; src: url("/assets/fonts/Kanit-ExtraBold.ttf") format("truetype"); }
@font-face { font-family: Kanit; font-weight: 900; font-style: normal; font-display: block; src: url("/assets/fonts/Kanit-Black.ttf") format("truetype"); }
`;

export const FONT_CSS_REL = FONT_CSS.replaceAll("/assets/fonts/", "assets/fonts/");
