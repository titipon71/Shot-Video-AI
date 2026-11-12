// Write index.html and compositions/<scene>.html for a story video from its baked coords.
// Per scene: the baked camera move (video), then the held view as a still, with live overlays on top:
// country fills, pins, routes, icons (all projected at the held view), plus screen texts, a year
// badge and captions.
import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { mapsDir } from "../lib/config.mjs";
import { phrases } from "./timing.mjs";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const r2 = (v) => +(+v).toFixed(2);
const ink = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 170 ? "#141414" : "#ffffff";
};
// Numbers and years in captions stand out in yellow.
const hiNums = (t) => esc(t).replace(/(ค\.ศ\.|พ\.ศ\.)?\s?\d[\d,.–-]*/g, (m) => `<b>${m}</b>`);
const PUSH = 1.04; // slow push while the camera holds; the next scene starts from it

const yearLabel = (y) => (typeof y === "number" ? `ค.ศ. ${y} · พ.ศ. ${y + 543}` : y.text ?? (y.ad != null ? `ค.ศ. ${y.ad} · พ.ศ. ${y.ad + 543}` : String(y)));

// Smooth path through screen points (Catmull-Rom as cubic Béziers), its length and end direction.
function curve(pts) {
  const segs = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    segs.push([p1, { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }, { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }, p2]);
  }
  const bez = ([a, b, c, d], t) => {
    const u = 1 - t;
    return { x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x, y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y };
  };
  const samples = [pts[0]];
  for (const sg of segs) for (let k = 1; k <= 24; k++) samples.push(bez(sg, k / 24));
  let L = 0;
  const acc = [0];
  for (let k = 1; k < samples.length; k++) acc.push((L += Math.hypot(samples[k].x - samples[k - 1].x, samples[k].y - samples[k - 1].y)));
  const mid = samples[acc.findIndex((a) => a >= L / 2)];
  const last = segs.at(-1);
  const dir = Math.atan2(last[3].y - last[2].y, last[3].x - last[2].x);
  const d = `M${pts[0].x} ${pts[0].y}` + segs.map(([, b, c, e]) => ` C${b.x.toFixed(1)} ${b.y.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)} ${e.x} ${e.y}`).join("");
  return { d, L: Math.ceil(L), mid, end: pts.at(-1), dir };
}

function scene(cfg, s, i, prevYear) {
  const { width: W, height: H } = cfg;
  const p = s.id;
  const coords = JSON.parse(readFileSync(join(mapsDir(cfg.root, cfg), `${p}-coords.json`), "utf8"));
  const pt = Object.fromEntries((coords.points ?? []).map((q) => [q.id, q]));
  const country = Object.fromEntries(coords.countries.map((c) => [c.name, c]));
  const move = s.camera.move, dur = s.dur;
  const when = (o, def) => (o.at != null ? o.at : o.cue ? s.cue(o.cue) : def);
  const onMap = (o, def) => r2(Math.max(move + 0.05, when(o, def))); // map overlays need the held view
  const until = (o) => r2(o.outAt != null ? o.outAt : o.outCue ? s.cue(o.outCue) : dur);
  const svg = [], defs = [], html = [], tw = [];

  // Country fills, each group fading in at its cue.
  s.fills.forEach((f, j) => {
    const paths = f.countries.map((c) => country[c]?.d).filter(Boolean);
    const t = onMap(f, move + 0.1);
    svg.push(`<g id="${p}-f${j}" opacity="0"><g fill="none" stroke="${f.color}" stroke-width="10" filter="url(#${p}-blur)">${paths.map((d) => `<path d="${d}"/>`).join("")}</g>` +
      `<g fill="${f.color}" fill-opacity="${f.opacity ?? 0.55}" stroke="#ffffff" stroke-opacity="0.8" stroke-width="2" stroke-linejoin="round">${paths.map((d) => `<path d="${d}"/>`).join("")}</g></g>`);
    tw.push(`tl.fromTo("#${p}-f${j}", { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" }, ${t});`);
    if (f.label) {
      const at = f.labelAt ? pt[f.labelAt] : country[f.countries[0]]?.label;
      if (at) {
        html.push(`<div class="flbl" style="left:${at.x.toFixed(0)}px;top:${at.y.toFixed(0)}px"><span id="${p}-fl${j}">${esc(f.label)}</span></div>`);
        tw.push(`tl.fromTo("#${p}-fl${j}", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, ${r2(t + 0.25)});`);
      }
    }
  });

  // Routes: a line that draws itself (masked, so dashed lines draw too), arrowhead and label at the end.
  s.routes.forEach((r, j) => {
    const c = curve(r.via.map((v) => pt[v]));
    const t = onMap(r, move + 0.2), draw = r.draw ?? 1.6;
    const col = r.color ?? "#ffffff";
    defs.push(`<mask id="${p}-rm${j}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><path id="${p}-rmp${j}" d="${c.d}" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round" stroke-dasharray="${c.L} ${c.L + 40}" stroke-dashoffset="${c.L}"/></mask>`);
    const a = c.dir, ax = c.end.x, ay = c.end.y, sz = 26;
    const tri = [[ax + Math.cos(a) * sz * 0.6, ay + Math.sin(a) * sz * 0.6], [ax + Math.cos(a + 2.4) * sz, ay + Math.sin(a + 2.4) * sz], [ax + Math.cos(a - 2.4) * sz, ay + Math.sin(a - 2.4) * sz]];
    svg.push(`<g mask="url(#${p}-rm${j})"><path d="${c.d}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="${c.d}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round"${r.dashed ? ` stroke-dasharray="16 12"` : ""}/></g>` +
      (r.arrow === false ? "" : `<polygon id="${p}-ra${j}" points="${tri.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="${col}" stroke="#000" stroke-opacity="0.35" stroke-width="2" opacity="0"/>`));
    tw.push(`tl.fromTo("#${p}-rmp${j}", { attr: { "stroke-dashoffset": ${c.L} } }, { attr: { "stroke-dashoffset": 0 }, duration: ${draw}, ease: "power1.inOut" }, ${t});`);
    if (r.arrow !== false) tw.push(`tl.fromTo("#${p}-ra${j}", { opacity: 0 }, { opacity: 1, duration: 0.15 }, ${r2(t + draw - 0.1)});`);
    if (r.label) {
      const lp = r.labelAt ? pt[r.labelAt] : c.mid;
      html.push(`<div class="rlbl" style="left:${lp.x.toFixed(0)}px;top:${lp.y.toFixed(0)}px"><span id="${p}-rl${j}" style="background:${col};color:${ink(col)}">${esc(r.label)}</span></div>`);
      tw.push(`tl.fromTo("#${p}-rl${j}", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, ${r2(t + draw * 0.5)});`);
    }
  });

  // Pins: dot with a pulse, and the place name beside it.
  s.pins.forEach((pin, j) => {
    const q = pt[pin.place], col = pin.color ?? "#ffffff";
    const t = onMap(pin, move + 0.25);
    const name = pin.label ?? cfg.places[pin.place].name;
    svg.push(`<g id="${p}-p${j}" opacity="0"><circle id="${p}-pr${j}" cx="${q.x}" cy="${q.y}" r="12" fill="none" stroke="${col}" stroke-width="4"/>` +
      `<circle cx="${q.x}" cy="${q.y}" r="12" fill="${col}" stroke="#141414" stroke-opacity="0.6" stroke-width="3"/></g>`);
    tw.push(`tl.fromTo("#${p}-p${j}", { opacity: 0 }, { opacity: 1, duration: 0.2 }, ${t});`);
    tw.push(`tl.fromTo("#${p}-pr${j}", { scale: 1, opacity: 1, transformOrigin: "50% 50%" }, { scale: 3.2, opacity: 0, duration: 1.1, repeat: ${pin.pulse ?? 2}, ease: "power1.out" }, ${t});`);
    if (name) {
      // Keep the label on screen: estimated width, flip sides or slide along the edge.
      const est = name.length * 24 + 50;
      let side = pin.side ?? "right";
      if (side === "right" && q.x + 24 + est > W - 20) side = "left";
      else if (side === "left" && q.x - 24 - est < 20) side = "right";
      const cx = Math.min(W - 20 - est / 2, Math.max(20 + est / 2, q.x));
      const pos = { right: `left:${q.x + 24}px;top:${q.y}px;transform:translateY(-50%)`, left: `left:${q.x - 24}px;top:${q.y}px;transform:translate(-100%,-50%)`, top: `left:${cx}px;top:${q.y - 26}px;transform:translate(-50%,-100%)`, bottom: `left:${cx}px;top:${q.y + 26}px;transform:translateX(-50%)` }[side];
      html.push(`<div class="plbl" style="${pos}"><span id="${p}-pl${j}" style="border-color:${col}">${esc(name)}</span></div>`);
      tw.push(`tl.fromTo("#${p}-pl${j}", { opacity: 0, x: ${side === "left" ? 12 : side === "right" ? -12 : 0} }, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, ${r2(t + 0.1)});`);
    }
  });

  // Icons: a spinning typhoon over a place.
  s.icons.forEach((ic, j) => {
    const q = pt[ic.place], t = onMap(ic, move + 0.3), k = ic.size ?? 1.4;
    svg.push(`<g transform="translate(${q.x} ${q.y}) scale(${k})"><g id="${p}-i${j}" opacity="0">` +
      `<circle r="62" fill="#ffffff" fill-opacity="0.16"/><circle r="15" fill="none" stroke="#fff" stroke-width="8"/>` +
      `<path d="M-5 -15 C-12 -40 14 -58 44 -50" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>` +
      `<path d="M5 15 C12 40 -14 58 -44 50" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/></g></g>`);
    tw.push(`tl.fromTo("#${p}-i${j}", { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, ${t});`);
    tw.push(`tl.fromTo("#${p}-i${j}", { rotation: 0, transformOrigin: "50% 50%" }, { rotation: ${-Math.round((dur - t) * 160)}, duration: ${r2(dur - t)}, ease: "none", immediateRender: false }, ${t});`);
  });

  // Screen texts.
  const texts = s.texts.map((t, j) => {
    const a = r2(when(t, 0)), b = until(t), style = t.style ?? "hero";
    const col = t.color ?? (style === "tag" ? "#F5A623" : "#ffffff");
    const top = t.y ?? { hero: 300, kanji: 330, tag: 470, sub: 470 }[style];
    const look = style === "tag" ? `background:${col};color:${ink(col)}` : `color:${col}`;
    const inDur = style === "kanji" ? 0.5 : 0.35;
    tw.push(`tl.fromTo("#${p}-t${j} span", { opacity: 0, scale: ${style === "kanji" ? 1.35 : 0.8} }, { opacity: 1, scale: 1, duration: ${inDur}, ease: "${style === "kanji" ? "power3.out" : "back.out(2)"}" }, ${a});`);
    if (b < dur) tw.push(`tl.to("#${p}-t${j} span", { opacity: 0, duration: 0.2, ease: "power2.in" }, ${r2(Math.max(b - 0.2, a + inDur))});`);
    return `<div id="${p}-t${j}" class="clip txt ${style}" style="top:${top}px" data-start="${a}" data-duration="${r2(b - a)}" data-track-index="${10 + j}"><span style="${look}">${esc(t.text)}</span></div>`;
  });

  // Picture cards: the whole image (never cropped, so licences that forbid changes stay satisfied),
  // in a white frame between the headline area and the captions; pops in, drifts closer, fades out.
  const images = s.images.map((im, j) => {
    const a = r2(when(im, move)), b = r2(Math.min(dur - 0.1, im.outAt != null || im.outCue ? until(im) : a + (im.dur ?? 3.5)));
    const top = im.top ?? 450, bottom = im.bottom ?? 1240, maxW = im.maxW ?? 880, credH = im.credit ? 54 : 0;
    const k = Math.min(maxW / im.w, (bottom - top - credH) / im.h);
    const cw = Math.round(im.w * k), ch = Math.round(im.h * k);
    const x0 = im.x ?? im.left ?? Math.round((W - cw) / 2);
    const y0 = im.y ?? Math.round(top + (bottom - top - credH - ch) / 2);
    tw.push(`tl.fromTo("#${p}-im${j} .card", { opacity: 0, scale: 0.84, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.6)" }, ${a});`);
    tw.push(`tl.fromTo("#${p}-im${j} .push", { scale: 1 }, { scale: 1.05, duration: ${r2(b - a)}, ease: "none" }, ${a});`);
    tw.push(`tl.to("#${p}-im${j} .card", { opacity: 0, scale: 0.96, duration: 0.25, ease: "power2.in" }, ${r2(Math.max(b - 0.25, a + 0.4))});`);
    return `<div id="${p}-im${j}" class="clip pic" data-layout-allow-occlusion data-start="${a}" data-duration="${r2(b - a)}" data-track-index="${30 + j}">` +
      `<div class="push" style="left:${x0}px;top:${y0}px;width:${cw}px"><div class="card">` +
      `<img src="${esc(im.src)}" alt="" style="width:${cw}px;height:${ch}px">` +
      (im.credit ? `<div class="icred"><span>${esc(im.credit)}</span></div>` : "") +
      `</div></div></div>`;
  });

  // Year badge: carries over from the previous scene; changes at cues.
  const years = (Array.isArray(s.year) ? s.year : s.year != null ? [s.year] : []).map((y) => ({ label: yearLabel(y), t: r2(typeof y === "object" ? when(y, 0) : 0) }));
  if (!years.length && prevYear) years.push({ label: prevYear, t: 0 });
  // The previous scene's year stays up until this scene's first one, unless that comes right away.
  if (years.length && years[0].t < 0.8) years[0].t = 0;
  else if (years.length && prevYear) years.unshift({ label: prevYear, t: 0 });
  const yearHtml = years.map((y, j) => {
    const end = j + 1 < years.length ? years[j + 1].t : dur;
    const carried = j === 0 && y.t === 0 && y.label === prevYear;
    if (!carried) tw.push(`tl.fromTo("#${p}-y${j} span", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35, ease: "back.out(2)" }, ${y.t});`);
    if (end < dur) tw.push(`tl.to("#${p}-y${j} span", { opacity: 0, y: -24, duration: 0.2, ease: "power2.in" }, ${r2(end - 0.2)});`);
    return `<div id="${p}-y${j}" class="clip year" data-start="${y.t}" data-duration="${r2(end - y.t)}" data-track-index="8"><span>${esc(y.label)}</span></div>`;
  });

  // Captions, one phrase at a time.
  const caps = phrases(s).map((c, j) => {
    tw.push(`tl.fromTo("#${p}-c${j} span", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, ${c.start});`);
    return `<div id="${p}-c${j}" class="clip cap" data-start="${c.start}" data-duration="${r2(c.end - c.start)}" data-track-index="9"><span>${hiNums(c.text)}</span></div>`;
  });

  const hasMap = svg.length || html.length;
  const ox = W / 2, oy = Math.round(H * 0.45);
  return {
    year: years.at(-1)?.label ?? prevYear,
    html: `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #05070d; font-family: Kanit, sans-serif; }
    #${p}-cam { position: absolute; inset: 0; transform-origin: ${ox}px ${oy}px; }
    #${p}-map, #${p}-still { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; object-fit: cover; }
    #${p}-svg { position: absolute; left: 0; top: 0; }
    .plbl, .flbl, .rlbl { position: absolute; white-space: nowrap; }
    .plbl span { display: inline-block; font-size: 34px; font-weight: 600; color: #fff; background: rgba(10,12,18,.72); padding: 2px 14px 4px; border-left: 6px solid #fff; border-radius: 6px; }
    .flbl { transform: translate(-50%, -50%); }
    .flbl span { display: inline-block; font-size: 40px; font-weight: 800; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.9), 0 0 3px rgba(0,0,0,.9); }
    .rlbl { transform: translate(-50%, -50%); }
    .rlbl span { display: inline-block; font-size: 32px; font-weight: 800; padding: 0 12px 2px; border: 3px solid rgba(255,255,255,.9); border-radius: 8px; }
    .txt { position: absolute; left: 60px; width: ${W - 120}px; text-align: center; }
    .txt span { display: inline-block; line-height: 1.3; }
    .hero span { font-size: 88px; font-weight: 800; text-shadow: 0 6px 24px rgba(0,0,0,.65), 0 2px 4px rgba(0,0,0,.8); }
    .sub span { font-size: 54px; font-weight: 600; text-shadow: 0 3px 12px rgba(0,0,0,.8), 0 1px 3px rgba(0,0,0,.9); }
    ${s.texts.some((t) => t.style === "kanji") ? `@font-face { font-family: KanjiJP; font-weight: 900; src: local("Yu Gothic Bold"), local("YuGothic-Bold"), local("Microsoft YaHei Bold"); }` : ""}
    .kanji span { font-family: KanjiJP, Kanit, sans-serif; font-size: 300px; font-weight: 900; line-height: 1; text-shadow: 0 8px 40px rgba(0,0,0,.7), 0 0 6px rgba(0,0,0,.8); }
    .tag span { font-size: 46px; font-weight: 600; padding: 2px 22px 6px; border: 3px solid rgba(255,255,255,.9); border-radius: 10px; }
    .year { position: absolute; left: 0; width: ${W}px; top: 170px; text-align: center; }
    .year span { display: inline-block; font-size: 40px; font-weight: 600; color: #fff; background: rgba(10,12,18,.78); padding: 4px 26px 8px; border: 2px solid rgba(255,255,255,.55); border-radius: 40px; }
    .cap { position: absolute; left: 70px; width: ${W - 140}px; top: ${cfg.captionTop ?? 1420}px; text-align: center; }
    .cap span { display: inline-block; font-size: 58px; font-weight: 800; line-height: 1.45; color: #fff; padding: 0 22px 6px; border-radius: 14px; background: rgba(0,0,0,.42);
      text-shadow: 0 3px 10px rgba(0,0,0,.85), 0 0 3px rgba(0,0,0,.9); }
    .cap b { color: #FFD43B; font-weight: 800; }
    .pic { position: absolute; inset: 0; }
    .pic .push { position: absolute; transform-origin: 50% 50%; }
    .pic .card { transform-origin: 50% 60%; }
    .pic img { display: block; border: 8px solid #fff; border-radius: 18px; box-shadow: 0 18px 50px rgba(0,0,0,.6), 0 4px 12px rgba(0,0,0,.5); background: #fff; }
    .icred { margin-top: 8px; text-align: center; }
    .icred span { display: inline-block; font-size: 28px; font-weight: 600; color: rgba(255,255,255,.92); background: rgba(0,0,0,.6); padding: 2px 12px 4px; border-radius: 6px; }
  </style>
  <div id="root" data-composition-id="${p}" data-width="${W}" data-height="${H}">
    <div id="${p}-cam">
      <video id="${p}-map" class="clip" src="assets/maps/${cfg.id}/${p}.mp4" muted playsinline data-start="0" data-duration="${move}" data-track-index="0"></video>
      <img id="${p}-still" class="clip" src="assets/maps/${cfg.id}/${p}-hold.jpg" alt="" data-start="${move}" data-duration="${r2(dur - move)}" data-track-index="0">
      ${hasMap ? `<svg id="${p}-svg" class="clip" data-start="${move}" data-duration="${r2(dur - move)}" data-track-index="1" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" data-layout-ignore>
        <defs><filter id="${p}-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>${defs.join("")}</defs>
        ${svg.join("\n        ")}
      </svg>
      <div id="${p}-labels" class="clip" data-start="${move}" data-duration="${r2(dur - move)}" data-track-index="2" data-layout-allow-overlap>${html.join("")}</div>` : ""}
    </div>
    ${images.join("\n    ")}
    ${yearHtml.join("\n    ")}
    ${texts.join("\n    ")}
    ${caps.join("\n    ")}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    // Start from the previous scene's push so the cut is seamless, settle during the move, push again while holding.
    tl.fromTo("#${p}-cam", { scale: ${i ? PUSH : 1} }, { scale: 1, duration: ${move}, ease: "power2.out" }, 0);
    tl.to("#${p}-cam", { scale: ${PUSH}, duration: ${r2(dur - move)}, ease: "none" }, ${move});
    ${tw.join("\n    ")}
    ${hasMap ? `tl.to(["#${p}-svg", "#${p}-labels"], { opacity: 0, duration: 0.3, ease: "power1.in" }, ${r2(dur - 0.3)});` : ""}
    window.__timelines["${p}"] = tl;
  </script>
</template>
`,
  };
}

const FONT_THAI = "U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC";
const FONT_LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

export function buildStory(root, cfg) {
  const { width: W, height: H } = cfg;
  cfg.root = root;
  const compDir = join(root, "compositions");
  mkdirSync(compDir, { recursive: true });
  for (const f of readdirSync(compDir)) if (f.endsWith(".html")) rmSync(join(compDir, f));

  let t = 0, year = null;
  const hosts = [];
  cfg.scenes.forEach((s, i) => {
    const out = scene(cfg, s, i, year);
    year = out.year;
    writeFileSync(join(compDir, `${s.id}.html`), out.html);
    if (s.voice) t = +s.voice.start.toFixed(3); // cut times from the voiceover (frame-aligned)
    hosts.push(`      <div id="${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${t}" data-duration="${s.dur}" data-track-index="1" data-track-kind="graphics" data-width="${W}" data-height="${H}"></div>`);
    t = +(t + s.dur).toFixed(3);
  });
  const voice = cfg.voice?.words
    ? `\n      <audio id="voice" src="${esc(cfg.voice.audio)}" data-start="0" data-duration="${Math.min(t, cfg.voice.length ?? t)}" data-track-index="20" data-volume="${cfg.voice.volume ?? 1}"></audio>`
    : "";
  const faces = [600, 800].flatMap((w) => [
    `@font-face { font-family: Kanit; font-weight: ${w}; font-display: block; src: url("assets/fonts/kanit-thai-${w}-normal.woff2") format("woff2"); unicode-range: ${FONT_THAI}; }`,
    `@font-face { font-family: Kanit; font-weight: ${w}; font-display: block; src: url("assets/fonts/kanit-latin-${w}-normal.woff2") format("woff2"); unicode-range: ${FONT_LATIN}; }`,
  ]);

  writeFileSync(join(root, "index.html"), `<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      ${faces.join("\n      ")}
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #05070d; }
      #credit { position: absolute; left: 0; top: ${cfg.creditTop ?? 1740}px; width: ${W}px; text-align: center; z-index: 50; }
      #credit span { font-family: Kanit, sans-serif; font-weight: 600; font-size: 20px; color: rgba(255,255,255,.85); background: rgba(0,0,0,.55); padding: 3px 10px; border-radius: 6px; }
      #disclaimer { position: absolute; left: 0; top: ${cfg.disclaimerTop ?? 1785}px; width: ${W}px; text-align: center; z-index: 50; }
      #disclaimer span { font-family: Kanit, sans-serif; font-weight: 500; font-size: 18px; color: rgba(255,255,255,.75); background: rgba(0,0,0,.45); padding: 2px 10px; border-radius: 6px; }
      ${cfg.logo ? `#logo { position: absolute; left: ${cfg.logoLeft ?? 60}px; top: ${cfg.logoTop ?? 145}px; width: ${cfg.logoSize ?? 90}px; height: ${cfg.logoSize ?? 90}px; border-radius: 50%; background-image: url("${esc(cfg.logo)}"); background-size: cover; background-position: center; border: 2.5px solid rgba(255, 215, 0, 0.85); box-shadow: 0 4px 16px rgba(0,0,0,0.7); z-index: 60; }` : ""}
      ${cfg.watermark ? `#watermark { position: absolute; left: 0; top: ${cfg.watermarkTop ?? 880}px; width: ${W}px; text-align: center; pointer-events: none; z-index: 40; }
      #watermark span { display: inline-block; font-family: Kanit, sans-serif; font-weight: 800; font-size: ${cfg.watermarkSize ?? 76}px; color: rgba(255, 255, 255, 0.12); transform: rotate(-15deg); letter-spacing: 6px; text-shadow: 0 0 10px rgba(0,0,0,0.3); }` : ""}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${t}" data-width="${W}" data-height="${H}">
${hosts.join("\n")}
      ${cfg.logo ? `<div id="logo" class="clip" data-start="0" data-duration="${t}" data-track-index="18" data-layout-ignore></div>` : ""}
      ${cfg.watermark ? `<div id="watermark" class="clip" data-start="0" data-duration="${t}" data-track-index="19" data-layout-ignore><span>${esc(cfg.watermark)}</span></div>` : ""}
      <div id="credit" class="clip" data-start="0" data-duration="${t}" data-track-index="16" data-layout-ignore><span>${esc(cfg.credit)}</span></div>
      ${cfg.disclaimer ? `<div id="disclaimer" class="clip" data-start="0" data-duration="${t}" data-track-index="17" data-layout-ignore><span>${esc(cfg.disclaimer)}</span></div>` : ""}${voice}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);
  return t;
}
