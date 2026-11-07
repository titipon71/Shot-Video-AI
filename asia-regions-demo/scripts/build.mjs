// Write index.html and compositions/<scene>.html for one video config from its baked coords.
import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { mapsDir } from "./lib/config.mjs";

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
// Dark text on light fills, white on dark ones.
const ink = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 170 ? "#141414" : "#ffffff";
};

function scene(cfg, s, order, regionOf) {
  const { width: W, height: H, regions } = cfg;
  const { reveal, lines } = s;
  const coords = JSON.parse(readFileSync(join(mapsDir(cfg.root, cfg), `${s.id}-coords.json`), "utf8"));
  const holdT = +(s.dur * s.hold).toFixed(2);
  const done = new Set(order.slice(0, Math.max(0, order.indexOf(reveal))));
  const isIntro = s.type === "intro", isOutro = s.type === "outro";
  const p = s.id; // id prefix

  // Fills: revealed regions keep their colour, the revealed-now region animates in, the rest stay pale.
  const fills = coords.countries.map((c) => {
    const r = regionOf[c.name];
    const state = r === reveal ? "now" : done.has(r) || isOutro ? "done" : "todo";
    const fill = state === "todo" ? "#F4F1EA" : regions[r].color;
    return `<path class="${p}-fill ${p}-${state}" d="${c.d}" fill="${fill}" stroke="#ffffff" stroke-opacity="0.75" stroke-width="1.6" stroke-linejoin="round"/>`;
  });
  const states = new Set(fills.map((f) => f.match(/-(now|done|todo)"/)[1]));
  const nowCountries = coords.countries.filter((c) => regionOf[c.name] === reveal);
  const glow = nowCountries.map((c) => `<path d="${c.d}"/>`).join("");

  // Region anchor: union of the revealed region's boxes, kept inside the title-safe band.
  let anchor = { x: W / 2, y: (H * 19) / 48 };
  if (nowCountries.length) {
    const x0 = Math.min(...nowCountries.map((c) => c.bbox.x)), y0 = Math.min(...nowCountries.map((c) => c.bbox.y));
    const x1 = Math.max(...nowCountries.map((c) => c.bbox.x + c.bbox.w)), y1 = Math.max(...nowCountries.map((c) => c.bbox.y + c.bbox.h));
    anchor = { x: clamp((x0 + x1) / 2, 300, W - 300), y: clamp((y0 + y1) / 2, H / 6, (H * 35) / 64) };
  }
  const capTop = Math.round(H * 0.63);
  // Country names on the bigger countries of the revealed region.
  const labels = nowCountries
    .filter((c) => c.bbox.w > 70 && c.label.x > 90 && c.label.x < W - 90 && c.label.y > (H * 5) / 48 && c.label.y < capTop + 90)
    .filter((c) => Math.hypot(c.label.x - anchor.x, c.label.y - anchor.y) > 90)
    // Keep clear of the region tag, and drop a label that lands on one already placed (bigger first).
    .filter((c) => !(Math.abs(c.label.y - (anchor.y + 90)) < 55 && Math.abs(c.label.x - anchor.x) < 230))
    .sort((a, b) => b.bbox.w * b.bbox.h - a.bbox.w * a.bbox.h)
    .filter(function (c) {
      this.placed ??= [];
      if (this.placed.some((q) => Math.abs(q.x - c.label.x) < 150 && Math.abs(q.y - c.label.y) < 44)) return false;
      this.placed.push(c.label);
      return true;
    }, {})
    .map((c) => `<div id="${p}-lbl-${slug(c.name)}" class="${p}-lbl lbl" style="left:${(c.label.x - 120).toFixed(0)}px;top:${(c.label.y - 16).toFixed(0)}px">${esc(c.name)}</div>`);

  const capA = isIntro ? 0.2 : +(holdT + 0.2).toFixed(2);
  const capB = isIntro ? +(s.dur * 0.56).toFixed(2) : +(holdT + (s.dur - holdT) * 0.45).toFixed(2);
  const heroAt = isIntro ? 0.1 : holdT;
  const color = reveal ? regions[reveal].color : "#ffffff";
  const heroText = s.hero ?? (reveal ? regions[reveal].label : null);
  const showTag = reveal && !isOutro;

  return `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #05070d; font-family: Inter, sans-serif; }
    #${p}-cam { position: absolute; inset: 0; transform-origin: ${anchor.x.toFixed(0)}px ${anchor.y.toFixed(0)}px; }
    #${p}-map { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; object-fit: cover; }
    #${p}-svg { position: absolute; left: 0; top: 0; }
    .lbl { position: absolute; width: 240px; text-align: center; color: #fff; font-size: 30px; font-weight: 700;
      text-shadow: 0 2px 6px rgba(0,0,0,.85), 0 0 2px rgba(0,0,0,.9); }
    #${p}-hero { position: absolute; left: 0; width: ${W}px; top: ${(anchor.y - 60).toFixed(0)}px; text-align: center; }
    #${p}-hero span { display: inline-block; color: #fff; font-size: ${isIntro ? 104 : 96}px; font-weight: 900; letter-spacing: -0.02em;
      text-shadow: 0 6px 24px rgba(0,0,0,.6), 0 2px 4px rgba(0,0,0,.7); }
    #${p}-tag { position: absolute; left: 0; width: ${W}px; top: ${(anchor.y + 60).toFixed(0)}px; text-align: center; }
    #${p}-tag span { display: inline-block; background: ${color}; color: ${ink(color)}; font-size: 40px; font-weight: 700; padding: 6px 18px;
      border: 3px solid rgba(255,255,255,.85); text-shadow: 0 1px 3px rgba(0,0,0,.55); }
    .cap { position: absolute; left: 0; width: ${W}px; top: ${capTop}px; text-align: center; overflow: visible; }
    .cap span { display: inline-block; color: #fff; font-size: 52px; font-weight: 700; padding: 4px 16px; border-radius: 10px;
      background: rgba(0,0,0,.32); text-shadow: 0 2px 8px rgba(0,0,0,.8); }
    #${p}-legend { position: absolute; left: 120px; width: ${W - 240}px; top: ${Math.round((H * 13) / 24)}px; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
    #${p}-legend span { font-size: 30px; font-weight: 700; padding: 4px 14px; border: 2px solid rgba(255,255,255,.8); }
  </style>
  <div id="root" data-composition-id="${p}" data-width="${W}" data-height="${H}">
    <div id="${p}-cam">
      <video id="${p}-map" class="clip" src="assets/maps/${cfg.id}/${p}.mp4" muted playsinline data-start="0" data-duration="${s.dur}" data-track-index="0"></video>
      <svg id="${p}-svg" class="clip" data-start="0" data-duration="${s.dur}" data-track-index="1" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" data-layout-ignore>
        <defs><filter id="${p}-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter></defs>
        <g id="${p}-glow" fill="none" stroke="${color}" stroke-width="10" filter="url(#${p}-blur)">${glow}</g>
        <g id="${p}-fills">${fills.join("\n        ")}</g>
        <g id="${p}-edge" fill="none" stroke="#ffffff" stroke-width="3">${glow}</g>
      </svg>
      <div id="${p}-labels" class="clip" data-start="0" data-duration="${s.dur}" data-track-index="2" data-layout-allow-overlap>${labels.join("")}</div>
    </div>
    ${heroText ? `<div id="${p}-hero" class="clip" data-start="${heroAt}" data-duration="${(s.dur - heroAt).toFixed(2)}" data-track-index="3"><span data-var-text="${p}-hero">${esc(heroText)}</span></div>` : ""}
    ${showTag ? `<div id="${p}-tag" class="clip" data-start="${capB}" data-duration="${(s.dur - capB).toFixed(2)}" data-track-index="4"><span>${esc(regions[reveal].label)}</span></div>` : ""}
    ${isOutro ? `<div id="${p}-legend" class="clip" data-start="${capB}" data-duration="${(s.dur - capB).toFixed(2)}" data-track-index="4">${Object.values(regions).map((r) => `<span style="background:${r.color};color:${ink(r.color)}">${esc(r.label)}</span>`).join("")}</div>` : ""}
    <div id="${p}-capA" class="clip cap" data-start="${capA}" data-duration="${(capB - capA).toFixed(2)}" data-track-index="5"><span>${esc(lines[0])}</span></div>
    <div id="${p}-capB" class="clip cap" data-start="${capB}" data-duration="${(s.dur - capB).toFixed(2)}" data-track-index="5"><span>${esc(lines[1])}</span></div>
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    const H0 = ${holdT};
    // Overlays only show while the camera holds; the borders were projected at the held view.
    tl.fromTo("#${p}-fills", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" }, H0);
    ${states.has("done") ? "" : "//"}tl.fromTo(".${p}-done", { fillOpacity: 0.72 }, { fillOpacity: 0.72, duration: 0.01 }, 0);
    ${states.has("todo") ? "" : "//"}tl.fromTo(".${p}-todo", { fillOpacity: ${isIntro ? 0 : 0.5} }, { fillOpacity: ${isIntro ? 0.8 : 0.5}, duration: ${isIntro ? 0.9 : 0.01}, stagger: ${isIntro ? 0.02 : 0}, ease: "power2.out" }, H0);
    ${states.has("now") ? "" : "//"}tl.fromTo(".${p}-now", { fillOpacity: 0 }, { fillOpacity: 0.8, duration: 0.45, stagger: 0.06, ease: "power2.out" }, H0 + 0.15);
    ${glow ? "" : "//"}tl.fromTo("#${p}-glow", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, H0 + 0.15);
    ${glow ? "" : "//"}tl.fromTo("#${p}-edge", { opacity: 0 }, { opacity: 0.9, duration: 0.5, ease: "power2.out" }, H0 + 0.15);
    ${labels.length ? "" : "//"}tl.fromTo(".${p}-lbl", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.08, ease: "power2.out" }, ${capB});
    // Slow push while the camera holds (map and overlay move together).
    tl.fromTo("#${p}-cam", { scale: 1 }, { scale: 1.06, duration: ${(s.dur - holdT).toFixed(2)}, ease: "none" }, H0);
    ${heroText ? `tl.fromTo("#${p}-hero span", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, ${isIntro ? 0.1 : "H0 + 0.05"});
    tl.to("#${p}-hero span", { opacity: 0, duration: 0.25, ease: "power2.in" }, ${(capB - 0.3).toFixed(2)});` : ""}
    ${showTag ? `tl.fromTo("#${p}-tag span", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.5)" }, ${capB});` : ""}
    ${isOutro ? `tl.fromTo("#${p}-legend span", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.07, ease: "back.out(2)" }, ${capB});` : ""}
    tl.fromTo("#${p}-capA span", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, ${capA});
    tl.fromTo("#${p}-capB span", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, ${capB});
    window.__timelines["${p}"] = tl;
  </script>
</template>
`;
}

export function build(root, cfg) {
  const { width: W, height: H } = cfg;
  cfg.root = root;
  const order = cfg.scenes.map((s) => s.reveal).filter(Boolean);
  const regionOf = {};
  for (const [key, r] of Object.entries(cfg.regions)) for (const c of r.countries) regionOf[c] = key;

  // The project holds one video at a time: clear the previous one's scenes.
  const compDir = join(root, "compositions");
  mkdirSync(compDir, { recursive: true });
  for (const f of readdirSync(compDir)) if (f.endsWith(".html")) rmSync(join(compDir, f));

  let t = 0;
  const hosts = [];
  for (const s of cfg.scenes) {
    writeFileSync(join(compDir, `${s.id}.html`), scene(cfg, s, order, regionOf));
    hosts.push(`      <div id="${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${t}" data-duration="${s.dur}" data-track-index="1" data-track-kind="graphics" data-width="${W}" data-height="${H}"></div>`);
    t = +(t + s.dur).toFixed(2);
  }

  writeFileSync(join(root, "index.html"), `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #05070d; }
      #credit { position: absolute; left: 0; top: ${Math.round((H * 25) / 32)}px; width: ${W}px; text-align: center; z-index: 50; }
      #credit span { font-family: Inter, sans-serif; font-size: 20px; color: rgba(255,255,255,.85); background: rgba(0,0,0,.55); padding: 3px 10px; border-radius: 6px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${t}" data-width="${W}" data-height="${H}">
${hosts.join("\n")}
      <div id="credit" class="clip" data-start="0" data-duration="${t}" data-track-index="9" data-layout-ignore><span>${esc(cfg.credit)}</span></div>
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);
  return t;
}
