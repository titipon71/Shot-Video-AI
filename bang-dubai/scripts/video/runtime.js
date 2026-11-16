// Runtime helpers injected into every bang-dubai video composition.
// Expects: const SCENE_DUR, and gsap loaded. Defines tl and helpers.
const tl = gsap.timeline({ paused: true });
const SVGNS = "http://www.w3.org/2000/svg";
const rng = (s) => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const mk = (tag, attrs, parent) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smooth = (v) => { v = clamp01(v); return v * v * (3 - 2 * v); };
const lerp = (a, b, t) => a + (b - a) * t;

// pop an SVG group in from scale 0 around a scene point
const pop = (sel, at, ox, oy, o = {}) => tl.fromTo(sel,
  { scale: o.from ?? 0, opacity: o.op0 ?? 1, rotation: o.rot ?? 0, svgOrigin: `${ox} ${oy}` },
  { scale: 1, opacity: 1, rotation: 0, svgOrigin: `${ox} ${oy}`, duration: o.d ?? 0.45, ease: o.e ?? "back.out(2.2)" }, at);
const popOut = (sel, at, ox, oy, o = {}) => tl.to(sel, { scale: 0, opacity: o.fade ? 0 : 1, svgOrigin: `${ox} ${oy}`, duration: o.d ?? 0.3, ease: o.e ?? "back.in(2)" }, at);
// slide in from an offset
const slide = (sel, at, dx, dy, o = {}) => tl.fromTo(sel, { x: dx, y: dy, opacity: o.op0 ?? 1 },
  { x: 0, y: 0, opacity: 1, duration: o.d ?? 0.6, ease: o.e ?? "power3.out" }, at);
const slideOut = (sel, at, dx, dy, o = {}) => tl.to(sel, { x: dx, y: dy, duration: o.d ?? 0.4, ease: o.e ?? "power2.in" }, at);
const fadeIn = (sel, at, d = 0.4) => tl.fromTo(sel, { opacity: 0 }, { opacity: 1, duration: d, ease: "power1.out" }, at);
const fadeOut = (sel, at, d = 0.3) => tl.to(sel, { opacity: 0, duration: d, ease: "power1.in" }, at);
// idle bob (y), finite repeats so the timeline stays seekable
const bob = (sel, t0, t1, amp = 6, per = 0.6) => {
  const n = Math.max(1, Math.floor((t1 - t0) / per));
  tl.fromTo(sel, { y: 0 }, { y: -amp, duration: per / 2, yoyo: true, repeat: n * 2 - 1, ease: "sine.inOut", immediateRender: false }, t0);
};
const sway = (sel, t0, t1, deg = 4, per = 1.2, ox = 0, oy = 0) => {
  const n = Math.max(1, Math.floor((t1 - t0) / per));
  tl.fromTo(sel, { rotation: -deg, svgOrigin: `${ox} ${oy}` }, { rotation: deg, svgOrigin: `${ox} ${oy}`, duration: per / 2, yoyo: true, repeat: n * 2 - 1, ease: "sine.inOut", immediateRender: false }, t0);
};
const jump = (sel, at, h = 40, d = 0.4) => tl.to(sel, { keyframes: [{ y: -h, duration: d * 0.45, ease: "power2.out" }, { y: 0, duration: d * 0.55, ease: "bounce.out" }] }, at);
const shake = (sel, at, amp = 12, dur = 0.5) => {
  const n = Math.max(3, Math.round(dur / 0.045)); const r = rng(Math.round(at * 1000));
  const kf = []; for (let i = 0; i < n; i++) { const k = 1 - i / n; kf.push({ x: (r() - .5) * 2 * amp * k, y: (r() - .5) * 2 * amp * k * 0.7, duration: dur / (n + 1), ease: "none" }); }
  kf.push({ x: 0, y: 0, duration: dur / (n + 1) });
  tl.to(sel, { keyframes: kf }, at);
};
const draw = (sel, at, d = 0.6, len = 1200) => tl.fromTo(sel, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: d, ease: "power2.inOut" }, at);
const blink = (sel, at) => tl.fromTo(sel, { scaleY: 1 }, { scaleY: 0.12, transformOrigin: "50% 50%", duration: 0.06, yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false }, at);
const blinkAll = (ids, seed = 1) => { const r = rng(seed); ids.forEach((id) => { let t = 0.4 + r() * 1.6; while (t < SCENE_DUR - 0.2) { if (document.getElementById(id + "-eyes")) blink("#" + id + "-eyes", t); t += 2.2 + r() * 2.2; } }); };
const face = (pre, name, at) => { tl.set(`.${pre}-exp`, { opacity: 0 }, at); tl.set(`#${pre}-exp-${name}`, { opacity: 1 }, at); };
// arm rotate around its pivot
const arm = (id, side, at, deg, d = 0.3, o = {}) => {
  const el = document.getElementById(`${id}-arm${side}`); if (!el) return;
  const pv = (el.getAttribute("data-pivot") || "100 238");
  tl.to(el, { rotation: deg, svgOrigin: pv, duration: d, ease: o.e ?? "power2.out" }, at);
};
const wave = (id, side, t0, t1, a = 20, b = -10, per = 0.5) => {
  const el = document.getElementById(`${id}-arm${side}`); if (!el) return;
  const pv = (el.getAttribute("data-pivot") || "100 238"); const n = Math.max(1, Math.floor((t1 - t0) / per));
  tl.fromTo(el, { rotation: a, svgOrigin: pv }, { rotation: b, svgOrigin: pv, duration: per / 2, yoyo: true, repeat: n * 2 - 1, ease: "sine.inOut", immediateRender: false }, t0);
};
// a getter/setter proxy so procedural drawing follows timeline seeks (no callbacks needed)
const driver = (fn, t0 = 0, t1 = SCENE_DUR) => {
  const p = { _v: -1, t(v) { if (v === undefined) return this._v; this._v = v; fn(v); } };
  tl.fromTo(p, { t: t0 }, { t: t1, duration: t1 - t0, ease: "none" }, t0);
  fn(t0);
};
// counter text
const counter = (el, at, d, from, to, fmt) => driver((t) => { const k = clamp01((t - at) / d); el.textContent = fmt(lerp(from, to, 1 - Math.pow(1 - k, 3))); }, 0, SCENE_DUR);

// smooth closed/open path through points (quadratic midpoints)
const smoothPath = (pts, close = false) => {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    d += ` Q${x1.toFixed(1)} ${y1.toFixed(1)} ${((x1 + x2) / 2).toFixed(1)} ${((y1 + y2) / 2).toFixed(1)}`;
  }
  const l = pts[pts.length - 1]; d += ` L${l[0].toFixed(1)} ${l[1].toFixed(1)}`;
  return close ? d + " Z" : d;
};

/**
 * Procedural crude-oil gusher: undulating column, glossy highlight, crown,
 * rising/falling droplets, base splashes, top spray, spreading puddle.
 * o: { id, x, y, H, W, t0, rise, seed, sc, puddle:[rx0,rx1,ry0,ry1,pt0,pt1], drops, intensity }
 */
function gusher(g, o) {
  const r = rng(o.seed || 7), sc = o.sc ?? 1, W = o.W ?? 60, H = o.H ?? 700, x = o.x, y = o.y;
  const t0 = o.t0 ?? 0, rise = o.rise ?? 0.9;
  const pd = o.puddle || [180, 260, 50, 70, 0, SCENE_DUR];
  const puddle = mk("path", { fill: `url(#${o.id}-pool)` }, g);
  const pSheen = mk("path", { fill: "#6a7aa8", opacity: .22 }, g);
  const pRing = mk("path", { fill: "none", stroke: "#000", "stroke-width": 3 * sc, opacity: .45 }, g);
  const back = mk("g", {}, g);
  const col = mk("path", { fill: `url(#${o.id}-col)` }, g);
  const hl = mk("path", { fill: "none", stroke: "#c8d0e0", "stroke-width": 9 * sc, "stroke-linecap": "round", opacity: .42 }, g);
  const hl2 = mk("path", { fill: "none", stroke: "#ffffff", "stroke-width": 3.5 * sc, "stroke-linecap": "round", opacity: .55, "stroke-dasharray": `${60 * sc} ${34 * sc}` }, g);
  const flow = mk("path", { fill: "none", stroke: "#8890a8", "stroke-width": 5 * sc, "stroke-linecap": "round", opacity: .35, "stroke-dasharray": `${26 * sc} ${70 * sc}` }, g);
  const rimR = mk("path", { fill: "none", stroke: "#5a4a7a", "stroke-width": 5 * sc, "stroke-linecap": "round", opacity: .35 }, g);
  const crownG = mk("g", {}, g);
  const crown = []; const CN = 11;
  for (let i = 0; i < CN; i++) crown.push({ e: mk("ellipse", { fill: i % 4 === 0 ? "#1c1c26" : "#08080b" }, crownG), a: (i / CN) * Math.PI * 2, ph: r() * 6, k: 0.55 + r() * 0.5 });
  const crownHl = mk("ellipse", { fill: "#9aa4bc", opacity: .35 }, crownG);
  const front = mk("g", {}, g);
  const drops = [];
  const ND = o.drops ?? 46;
  for (let i = 0; i < ND; i++) {
    const kind = i < ND * 0.55 ? "top" : (i < ND * 0.8 ? "side" : "base");
    const e = mk("ellipse", { fill: "#08080b" }, r() < 0.5 ? back : front);
    const s = kind === "base" ? 0.6 : 1;
    drops.push({ e, h: mk("ellipse", { fill: "#aab4cc", opacity: .45 }, front), kind,
      per: kind === "base" ? 0.55 + r() * 0.5 : 0.9 + r() * 0.9, ph: r() * 3,
      vx: (r() - 0.5) * (kind === "top" ? 520 : kind === "side" ? 380 : 360) * sc,
      vy: -(kind === "top" ? 220 + r() * 420 : kind === "side" ? 80 + r() * 260 : 160 + r() * 260) * sc,
      sy: kind === "side" ? 0.25 + r() * 0.6 : 0, rad: (4 + r() * 11) * sc * s, off: (r() - 0.5) });
  }
  const spray = [];
  for (let i = 0; i < 26; i++) spray.push({ e: mk("circle", { fill: "#2a2630", opacity: 0 }, front), per: 0.6 + r() * 0.7, ph: r() * 2, vx: (r() - .5) * 700 * sc, vy: -(120 + r() * 260) * sc, rad: (1.5 + r() * 3.5) * sc });
  const mist = [];
  for (let i = 0; i < 5; i++) mist.push({ e: mk("ellipse", { fill: "#1a1612", opacity: 0 }, front), ph: r() * 6, dx: (r() - .5) * 2 });
  const GR = 1500 * sc;
  function edge(s, t, side) {
    const ph = side < 0 ? 0 : 2.1;
    return Math.sin(s * 10 - t * 9 + ph) * W * 0.2 + Math.sin(s * 23 - t * 15 + ph * 1.7) * W * 0.09 + Math.sin(s * 4.5 - t * 4 + ph) * W * 0.12;
  }
  function draw(t) {
    const k = smooth((t - t0) / rise);
    const pulse = 1 + 0.06 * Math.sin(t * 5.3) + 0.04 * Math.sin(t * 8.9 + 1);
    const h = H * (k < 1 ? (1 - Math.pow(1 - k, 3)) : pulse) * (o.intensity ?? 1);
    // puddle
    const pk = smooth((t - pd[4]) / (pd[5] - pd[4]));
    const prx = lerp(pd[0], pd[1], pk), pry = lerp(pd[2], pd[3], pk);
    if (t < t0 - 0.05) { puddle.setAttribute("d", ""); pSheen.setAttribute("d", ""); pRing.setAttribute("d", ""); }
    else {
      const pp = [], N = 26; const gk = smooth((t - t0 + 0.2) / 0.6);
      for (let i = 0; i <= N; i++) { const a = (i / N) * Math.PI * 2; const w = 1 + 0.05 * Math.sin(a * 5 + t * 2.2) + 0.03 * Math.sin(a * 9 - t * 3);
        pp.push([x + Math.cos(a) * prx * w * gk, y + 10 * sc + Math.sin(a) * pry * w * gk]); }
      const dP = smoothPath(pp, true); puddle.setAttribute("d", dP); pRing.setAttribute("d", dP);
      const sp = []; for (let i = 0; i <= 14; i++) { const a = (i / 14) * Math.PI * 2; sp.push([x - prx * 0.18 + Math.cos(a) * prx * 0.45 * gk, y + Math.sin(a) * pry * 0.35 * gk]); }
      pSheen.setAttribute("d", smoothPath(sp, true));
    }
    if (h < 4) {
      col.setAttribute("d", ""); hl.setAttribute("d", ""); hl2.setAttribute("d", ""); flow.setAttribute("d", ""); rimR.setAttribute("d", "");
      crown.forEach((c) => c.e.setAttribute("rx", 0)); crownHl.setAttribute("rx", 0);
      drops.forEach((d) => { d.e.setAttribute("rx", 0); d.h.setAttribute("rx", 0); });
      spray.forEach((s) => s.e.setAttribute("opacity", 0)); mist.forEach((m) => m.e.setAttribute("opacity", 0));
      return;
    }
    const N = 28, L = [], R = [], top = y - h;
    const cxAt = (s) => x + Math.sin(s * 3.2 - t * 2.3) * W * 0.3 * s;
    for (let i = 0; i <= N; i++) {
      const s = i / N, yy = y - s * h;
      const base = W * (1.15 - 0.35 * s) + W * 0.9 * smooth((s - 0.82) / 0.18) + W * 0.5 * smooth((0.08 - s) / 0.08);
      const c = cxAt(s);
      L.push([c - base - edge(s, t, -1), yy]); R.push([c + base + edge(s, t, 1), yy]);
    }
    const ctop = cxAt(1);
    const capW = W * 1.5;
    const pts = [...L, [ctop - capW * 0.6, top - W * 0.55], [ctop, top - W * 0.8], [ctop + capW * 0.6, top - W * 0.55], ...R.reverse()];
    col.setAttribute("d", smoothPath(pts, true));
    const hp = [], hp2 = [], rp = [];
    for (let i = 2; i <= N - 4; i++) { const s = i / N, yy = y - s * h, base = W * (1.15 - 0.35 * s); const c = cxAt(s);
      hp.push([c - base * 0.55 - edge(s, t, -1) * 0.6, yy]);
      if (i > 4 && i < N - 8) hp2.push([c - base * 0.42 - edge(s, t, -1) * 0.5 + Math.sin(s * 30 - t * 18) * 2 * sc, yy]);
      rp.push([c + base * 0.7 + edge(s, t, 1) * 0.7, yy]); }
    hl.setAttribute("d", smoothPath(hp)); hl2.setAttribute("d", smoothPath(hp2)); rimR.setAttribute("d", smoothPath(rp));
    const fp = []; for (let i = 1; i <= N - 3; i++) { const s = i / N, yy = y - s * h, base = W * (1.15 - 0.35 * s); fp.push([cxAt(s) + base * 0.15 + edge(s, t, 1) * 0.3, yy]); }
    flow.setAttribute("d", smoothPath(fp)); flow.setAttribute("stroke-dashoffset", (t * 520 * sc).toFixed(1)); hl2.setAttribute("stroke-dashoffset", (t * 380 * sc).toFixed(1));
    crown.forEach((c, i) => {
      const a = c.a + t * 0.8; const rr = W * (0.95 + 0.35 * Math.sin(t * 6 + c.ph)) * c.k;
      c.e.setAttribute("cx", ctop + Math.cos(a) * W * 1.1); c.e.setAttribute("cy", top - W * 0.25 + Math.sin(a) * W * 0.45);
      c.e.setAttribute("rx", rr); c.e.setAttribute("ry", rr * 0.8);
    });
    crownHl.setAttribute("cx", ctop - W * 0.5); crownHl.setAttribute("cy", top - W * 0.55); crownHl.setAttribute("rx", W * 0.55); crownHl.setAttribute("ry", W * 0.2);
    const active = t >= t0 + 0.15;
    drops.forEach((d) => {
      if (!active) { d.e.setAttribute("rx", 0); d.h.setAttribute("rx", 0); return; }
      const a = ((t - t0 + d.ph) % d.per + d.per) % d.per;
      let x0, y0;
      if (d.kind === "top") { x0 = ctop + d.off * W * 1.6; y0 = top - W * 0.3; }
      else if (d.kind === "side") { const s = d.sy; x0 = cxAt(s) + Math.sign(d.vx) * W * (1.1 - 0.3 * s); y0 = y - s * h; }
      else { x0 = x + d.off * W * 2.4; y0 = y; }
      const px = x0 + d.vx * a, vy = d.vy + GR * a, py = y0 + d.vy * a + 0.5 * GR * a * a;
      const life = a / d.per; const fade = life > 0.85 ? (1 - life) / 0.15 : 1;
      const sp = Math.min(2.2, 1 + Math.abs(vy) / (900 * sc));
      const ang = Math.atan2(vy, d.vx) * 180 / Math.PI - 90;
      if (d.kind === "base" && py > y + 30 * sc) { d.e.setAttribute("rx", 0); d.h.setAttribute("rx", 0); return; }
      d.e.setAttribute("cx", px); d.e.setAttribute("cy", py); d.e.setAttribute("rx", d.rad * fade); d.e.setAttribute("ry", d.rad * sp * fade);
      d.e.setAttribute("transform", `rotate(${ang.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})`);
      d.h.setAttribute("cx", px - d.rad * 0.3); d.h.setAttribute("cy", py - d.rad * 0.35); d.h.setAttribute("rx", d.rad * 0.28 * fade); d.h.setAttribute("ry", d.rad * 0.4 * fade);
    });
    spray.forEach((s) => {
      if (!active) { s.e.setAttribute("opacity", 0); return; }
      const a = ((t - t0 + s.ph) % s.per + s.per) % s.per, life = a / s.per;
      s.e.setAttribute("cx", ctop + s.vx * a); s.e.setAttribute("cy", top - W * 0.6 + s.vy * a + 0.5 * GR * 0.6 * a * a);
      s.e.setAttribute("r", s.rad); s.e.setAttribute("opacity", (0.7 * (1 - life)).toFixed(2));
    });
    mist.forEach((m, i) => {
      const a = (t * 0.25 + m.ph) % 1;
      m.e.setAttribute("cx", ctop + m.dx * W * 2 + Math.sin(t + i) * 20); m.e.setAttribute("cy", top - W * 0.4 - a * 120 * sc);
      m.e.setAttribute("rx", W * (1.6 + a * 2)); m.e.setAttribute("ry", W * (0.7 + a)); m.e.setAttribute("opacity", (active ? 0.22 * (1 - a) : 0).toFixed(2));
    });
  }
  driver(draw);
}

// zoom-through transitions (no fade to black)
const sceneIO = (sel, o = {}) => {
  if (o.in !== false) tl.fromTo(sel, { scale: o.inScale ?? 1.22, filter: "blur(10px)" }, { scale: 1, filter: "blur(0px)", duration: 0.38, ease: "power3.out" }, 0);
  if (o.out !== false) tl.to(sel, { scale: 1.2, filter: "blur(9px)", duration: 0.28, ease: "power2.in" }, SCENE_DUR - 0.28);
};
// camera move on an HTML container: keyframes [{t, s, x, y, d, e}]
const cam = (sel, moves) => { moves.forEach((m) => { const s = Math.max(1, m.s ?? 1), bx = (s - 1) * 540, by = (s - 1) * 960;
  const x = Math.max(-bx, Math.min(bx, m.x ?? 0)), y = Math.max(-by, Math.min(by, m.y ?? 0));
  tl.to(sel, { scale: s, x, y, duration: m.d ?? 1, ease: m.e ?? "power2.inOut" }, m.t); }); };
