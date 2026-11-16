// Node-side helpers for the animated bang-dubai video scenes.
import { presets } from "../../../shared/flat-people/index.mjs";
import { placeChar, vehicle, txt, esc, FONT } from "../../compositions/components/kit.mjs";
export { presets };

/** Character wrapped for animation: #id-w (pop/slide), #id-b (bob/jump). */
export function person(reg, id, opts, x, feetY, s = 1) {
  reg.push({ id, x, y: feetY, s });
  const exps = opts.expressions || [opts.expression || "neutral"];
  return `<g id="${id}-w"><g id="${id}-b">${placeChar({ ...opts, id, expressions: exps, expression: exps[0] }, x, feetY, s)}</g></g>`;
}

/** Vehicle wrapped: #id (pop/slide) > .veh-b (bounce). */
export function car(id, kind, x, y, o = {}) {
  return `<g id="${id}" class="car" data-x="${x}" data-y="${y}"><g class="veh-b">${vehicle(kind, x, y, o)}</g></g>`;
}

export const NORMAL_CARS = [
  ["sedan", 200, 1260, { color: "#c8282f", scale: 0.7, rot: -6 }],
  ["taxi", 400, 1248, { color: "#f0c14a", stripe: "#3dca6a", scale: 0.65, rot: 4 }],
  ["sedan", 640, 1256, { color: "#2b6ea8", scale: 0.68, rot: 2, flip: true }],
  ["bus", 860, 1236, { color: "#e8893a", scale: 0.55, rot: -4 }],
  ["sedan", 150, 1380, { color: "#f07ab0", scale: 0.85, rot: -8 }],
  ["taxi", 360, 1368, { color: "#f0c14a", stripe: "#3dca6a", scale: 0.8, rot: 6 }],
  ["moto", 540, 1378, { color: "#f26a1b", scale: 0.95, rot: -4 }],
  ["sedan", 740, 1370, { color: "#4a7ab5", scale: 0.82, rot: 3, flip: true }],
  ["van", 950, 1360, { color: "#8a8a92", scale: 0.75, rot: 6 }],
  ["sedan", 230, 1540, { color: "#3dca6a", scale: 1.05, rot: -4 }],
  ["taxi", 520, 1560, { color: "#ff6aa0", scale: 1, rot: 5 }],
  ["sedan", 820, 1548, { color: "#f0c14a", scale: 1.05, rot: 2, flip: true }],
];
export const SUPER_COLORS = ["#c8282f", "#f0c14a", "#3d8a6a", "#4a2c6a", "#e8893a", "#2b6ea8", "#f07ab0", "#1a1a20", "#d4a017", "#7ec8ff", "#8e1d24", "#3dca6a"];

export function badge(id, text, y = 230) {
  const n = [...text].length; const w = Math.max(340, n * 30 + 100);
  return `<g id="${id}"><g transform="translate(540 ${y})">
    <rect x="${-w / 2}" y="-44" width="${w}" height="88" rx="22" fill="#1a1208" stroke="#d8a64a" stroke-width="4"/>
    <rect x="${-w / 2 + 10}" y="-36" width="${w - 20}" height="7" rx="3" fill="#d8a64a" opacity=".45"/>
    <circle cx="${-w / 2 + 44}" cy="0" r="18" fill="none" stroke="#f0c14a" stroke-width="4"/>
    <path d="M${-w / 2 + 44} -10 L${-w / 2 + 44} 0 L${-w / 2 + 52} 6" stroke="#f0c14a" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${txt(18, 15, text, { size: 42, weight: 800, fill: "#f7efe2" })}
  </g></g>`;
}

/** Generic card with Thai text, centered at (x,y). */
export function card(id, x, y, w, h, inner, o = {}) {
  return `<g id="${id}"><g transform="translate(${x} ${y})">
    <rect x="${-w / 2 + 8}" y="${-h / 2 + 10}" width="${w}" height="${h}" rx="${o.rx ?? 22}" fill="#000" opacity=".25"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${o.rx ?? 22}" fill="${o.fill ?? "#f7efe2"}" stroke="${o.stroke ?? "#2a1b17"}" stroke-width="${o.sw ?? 5}"/>
    ${inner}
  </g></g>`;
}

export function burst(id, x, y, r, text, o = {}) {
  const n = 12; let d = "";
  for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2; const rr = i % 2 ? r * 0.72 : r; d += `${i ? "L" : "M"}${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr * 0.8).toFixed(1)} `; }
  return `<g id="${id}"><g transform="translate(${x} ${y}) rotate(${o.rot ?? -8})">
    <path d="${d}Z" fill="${o.fill ?? "#c8282f"}" stroke="#2a1b17" stroke-width="5"/>
    ${txt(0, (o.size ?? 44) * 0.36, text, { size: o.size ?? 44, weight: 900, fill: o.color ?? "#fff" })}
  </g></g>`;
}

export function questionMark(id, x, y, s = 1, fill = "#c8282f") {
  return `<g id="${id}"><g transform="translate(${x} ${y}) scale(${s})">
    <circle r="34" fill="#f7efe2" stroke="#2a1b17" stroke-width="4"/>
    <text x="0" y="17" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="48" fill="${fill}">?</text>
  </g></g>`;
}

export function heart(x, y, s = 1, fill = "#e0464c") {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 8 C0 2 -8 -4 -14 2 C-20 8 0 22 0 22 C0 22 20 8 14 2 C8 -4 0 2 0 8 Z" fill="${fill}"/></g>`;
}

export function gallon(x, y, color = "#d4542a", s = 1, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <rect x="-24" y="-60" width="48" height="60" rx="7" fill="${color}" stroke="#2a1b17" stroke-width="3"/>
    <rect x="-8" y="-72" width="16" height="14" rx="2" fill="#2a1b17"/>
    <path d="M6 -56 Q22 -56 22 -40" fill="none" stroke="#2a1b17" stroke-width="5"/>
    <rect x="-16" y="-50" width="10" height="40" rx="4" fill="#fff" opacity=".25"/>
  </g>`;
}

export function geyserDefs(id) {
  return `<defs>
    <linearGradient id="${id}-col" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#262630"/><stop offset=".18" stop-color="#4a4a58"/><stop offset=".34" stop-color="#121218"/>
      <stop offset=".62" stop-color="#0a0a0e"/><stop offset=".85" stop-color="#1c1410"/><stop offset="1" stop-color="#050506"/>
    </linearGradient>
    <radialGradient id="${id}-pool" cx="45%" cy="40%" r="60%">
      <stop offset="0" stop-color="#34343f"/><stop offset=".45" stop-color="#0e0e13"/><stop offset="1" stop-color="#050506"/>
    </radialGradient>
  </defs>`;
}

export function cracks(id, x, y, seed = 3, n = 9) {
  let s = 1 + seed; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  let out = `<g id="${id}">`;
  for (let i = 0; i < n; i++) {
    const a = Math.PI * 2 * (i / n) + r() * 0.4; let px = x, py = y, d = `M${px} ${py}`;
    for (let k = 0; k < 4; k++) { px += Math.cos(a) * (50 + r() * 60) + (r() - .5) * 40; py += Math.sin(a) * (16 + r() * 22) + (r() - .5) * 10; d += ` L${px.toFixed(0)} ${py.toFixed(0)}`; }
    out += `<path class="crk" d="${d}" fill="none" stroke="#08080a" stroke-width="${9 - k0(i)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return out + `</g>`;
  function k0(i) { return i % 3 * 2; }
}

export function house(x, y, color, roof) {
  return `<g transform="translate(${x} ${y})">
    <rect x="-90" y="-110" width="180" height="110" fill="${color}" stroke="#2a1b17" stroke-width="4"/>
    <path d="M-110 -105 L0 -190 L110 -105 Z" fill="${roof}" stroke="#2a1b17" stroke-width="4"/>
    <rect x="-70" y="-80" width="44" height="40" fill="#7eafc8" stroke="#2a1b17" stroke-width="3"/>
    <rect x="10" y="-70" width="60" height="70" fill="#6a4a30" stroke="#2a1b17" stroke-width="3"/>
  </g>`;
}

export function phoneFlash(id, x, y) {
  return `<g id="${id}" opacity="0"><g transform="translate(${x} ${y})">
    <circle r="46" fill="#fff" opacity=".55"/><circle r="20" fill="#fff"/>
    <path d="M0 -70 L6 -10 L70 0 L6 10 L0 70 L-6 10 L-70 0 L-6 -10 Z" fill="#fff" opacity=".9"/>
  </g></g>`;
}

export function pin(id, x, y, s = 1, fill = "#e0464c") {
  return `<g id="${id}"><g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cy="6" rx="22" ry="7" fill="#000" opacity=".3"/>
    <path d="M0 0 C-10 -24 -40 -40 -40 -70 A40 40 0 1 1 40 -70 C40 -40 10 -24 0 0 Z" fill="${fill}" stroke="#2a1b17" stroke-width="4"/>
    <circle cy="-70" r="16" fill="#fff"/>
  </g></g>`;
}

export { txt, esc, FONT, vehicle };
