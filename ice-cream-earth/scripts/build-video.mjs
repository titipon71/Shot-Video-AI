// ไอศกรีมโลก — builds the HyperFrames video (1080x1920, 20 s) from the storyboard drawings.
// Timed to the voice-over assets/audio/ice-cream-earth.wav (8 lines, ends 18.8 s).
// compositions/polar.html  0–8.5 s  POV at the South Pole: take a cone out, place it wide side down
// compositions/space.html  8.4–20 s   pull out to space, 180° turn, ice-cream reveal, moon cherry
// Audio (music + sfx) is made by scripts/make-audio.py -> assets/audio/mix.wav
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { proj, f1, T, heading, polarBg, penguin, cone, sleeve, mitten, space, globe, globeShade, poleXY, comic, DEFS, setSeed, rnd } from "./draw.mjs";

export const TOTAL = 20;
const POLAR = { start: 0, dur: 8.5 };
const SPACE = { start: 8.4, dur: +(TOTAL - 8.4).toFixed(3) };
const BASE = [1300, 2500]; // far-away shoulder so the arm can travel without showing its end

const DEFS_INNER = DEFS.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
const FONT_CSS = [["Medium", 500], ["SemiBold", 600], ["Bold", 700], ["ExtraBold", 800], ["Black", 900]]
  .map(([n, w]) => `@font-face { font-family: Kanit; font-weight: ${w}; font-display: block; src: url("assets/fonts/Kanit-${n}.ttf") format("truetype"); }`).join("\n");

function composition(id, dur, svg, js) {
  return `<template>
  <style>
${FONT_CSS}
    #root { position: absolute; inset: 0; overflow: hidden; background: #0a0d2c; font-family: Kanit, sans-serif; }
    .clip { position: absolute; inset: 0; }
    svg.scene { position: absolute; inset: 0; width: 1080px; height: 1920px; overflow: hidden; }
  </style>
  <div data-hf-id="hf-${id}" id="root" data-composition-id="${id}" data-width="1080" data-height="1920" data-layout-allow-overflow data-layout-allow-overlap>
    <div data-hf-id="hf-${id}-clip" id="${id}-clip" class="clip" data-start="0" data-duration="${dur}" data-track-index="1">
      <svg class="scene" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
        ${DEFS_INNER}
        ${svg}
      </svg>
    </div>
  </div>
  <script>
  (() => {
    const tl = gsap.timeline({ paused: true });
    ${js}
    window.__timelines = window.__timelines || {};
    window.__timelines["${id}"] = tl;
  })();
  </script>
</template>
`;
}

const sparkle = (x, y, s) => `<path d="M${x} ${y - s} L${x + s * 0.3} ${y} L${x} ${y + s} L${x - s * 0.3} ${y} Z M${x - s} ${y} L${x} ${y + s * 0.3} L${x + s} ${y} L${x} ${y - s * 0.3} Z"/>`;

// falling snow: two copies stacked so a 1920px drift loops seamlessly
function snowLayer(id, n, sd, rMin, rMax, op) {
  setSeed(sd);
  const flakes = [...Array(n)].map(() => `<circle cx="${f1(rnd() * 1080)}" cy="${f1(rnd() * 1920)}" r="${f1(rMin + rnd() * (rMax - rMin))}"/>`).join("");
  return `<g id="${id}" fill="#fff" opacity="${op}"><g>${flakes}</g><g transform="translate(0 -1920)">${flakes}</g></g>`;
}

// ============================ POLAR (0 – 8.25 s) ============================
const PX = 220, PY = 1450, PS = 1.2;
const polarSvg = `
<g id="pcam">
  ${polarBg()}
  <g id="aur2" opacity="0" filter="url(#blur24)"><path d="M-100 300 C220 200 460 420 740 300 C900 230 1040 290 1200 230 L1200 360 C1020 410 880 350 740 420 C460 540 220 380 -100 470 Z" fill="url(#aurora)"/></g>
  ${snowLayer("snowFar", 60, 3, 1.5, 3.5, 0.55)}
  <g id="pengA">${penguin(PX, PY, PS)}</g>
  <g id="pengB" opacity="0">${penguin(PX, PY, PS, { look: 1 })}</g>
  <g id="pengC" opacity="0">${penguin(PX, PY, PS, { tilt: -14, look: 1, q: true })}</g>
  <g id="armA">${sleeve(690, 1130, BASE)}${cone(640, 880, 250, 400)}${mitten(690, 1130, BASE)}</g>
  <g id="sparkA" fill="#fff" filter="url(#softShadow)">${[[500, 820, 14], [790, 760, 18], [770, 960, 10]].map(([x, y, s], i) => `<g id="spA${i}" opacity="0">${sparkle(x, y, s)}</g>`).join("")}</g>
  <ellipse id="shadowB" cx="540" cy="1590" rx="210" ry="30" fill="#9d8fc8" opacity="0"/>
  <g id="armB" opacity="0">${sleeve(575, 1105, BASE)}${cone(540, 1580, 330, -420)}${mitten(575, 1105, BASE)}</g>
  <g id="puffs" fill="#fff" opacity=".95">${[[350, 1580, 22], [380, 1550, 14], [730, 1585, 24], [700, 1550, 13], [320, 1610, 12], [760, 1615, 12]].map(([x, y, r], i) => `<circle class="puff" id="pf${i}" cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>
  ${snowLayer("snowNear", 26, 5, 4, 7, 0.8)}
  <g id="grab">${comic(800, 1760, "แกร๊บ!", 86, "#ffd166")}</g>
  <g id="h1" opacity="0">${heading("คุณอยู่ที่ขั้วโลกใต้", "You're at the South Pole")}</g>
  <g id="h2" opacity="0">${heading("หยิบโคนออกจากกระเป๋า", "Take a cone out of your bag")}</g>
  <g id="h3" opacity="0">${heading("วางด้านกว้างลงพื้น", "Wide side down")}</g>
</g>`;

const polarJs = `
const D = ${POLAR.dur};
// ambient: snow drift, aurora breathing, penguin idle
tl.fromTo("#snowFar", { y: 0 }, { y: 520, duration: D, ease: "none" }, 0);
tl.fromTo("#snowNear", { y: 0, x: 0 }, { y: 1100, x: -60, duration: D, ease: "none" }, 0);
tl.to("#aur2", { opacity: 0.55, x: 60, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0.2);
tl.fromTo("#pengA, #pengB, #pengC", { scaleY: 1 }, { scaleY: 1.025, svgOrigin: "${PX} ${PY + 180}", duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 9 }, 0);
// headings
const head = (id, a, b) => {
  tl.fromTo(id, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, a);
  tl.to(id, { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" }, b);
};
head("#h1", 0.35, 3.0); head("#h2", 3.55, 5.35); head("#h3", 5.65, 7.7);
// arm A: take the cone out (penguin turns to look)
tl.fromTo("#armA", { x: 620, y: 900 }, { x: 0, y: 0, duration: 0.7, ease: "back.out(1.3)" }, 3.45);
tl.to("#armA", { rotation: -3, svgOrigin: "690 1130", duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, 4.15);
tl.set("#pengA", { opacity: 0 }, 3.85); tl.set("#pengB", { opacity: 1 }, 3.85);
[0, 1, 2].forEach((i) => {
  tl.fromTo("#spA" + i, { opacity: 0, scale: 0.2, svgOrigin: ["500 820", "790 760", "770 960"][i] },
    { opacity: 1, scale: 1.15, duration: 0.25, ease: "back.out(3)" }, 4.1 + i * 0.12);
  tl.to("#spA" + i, { opacity: 0, scale: 0.4, duration: 0.3 }, 4.85 + i * 0.1);
});
tl.to("#armA", { x: 520, y: 820, duration: 0.4, ease: "power2.in" }, 5.3);
// arm B: flip it, wide side down, press
tl.set("#armB", { x: 320, y: -700 }, 0);
tl.set("#armB", { opacity: 1 }, 5.55);
tl.to("#armB", { x: 0, y: -130, duration: 0.5, ease: "power3.out" }, 5.55);
tl.to("#armB", { y: 0, duration: 0.17, ease: "power2.in" }, 6.45);
tl.to("#shadowB", { opacity: 0.4, duration: 0.3 }, 6.3);
tl.fromTo(".puff", { scale: 0, opacity: 0, svgOrigin: "540 1590" }, { scale: 1, opacity: 0.95, duration: 0.3, ease: "power3.out" }, 6.62);
tl.to(".puff", { opacity: 0, y: -30, duration: 0.6, ease: "power1.in" }, 7.15);
tl.fromTo("#grab", { scale: 0, rotation: -12, svgOrigin: "800 1730" }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(3)" }, 6.65);
tl.to("#grab", { opacity: 0, duration: 0.25 }, 7.75);
tl.fromTo("#pcam", { x: 0, y: 0 }, { keyframes: [{ x: -8, y: 6 }, { x: 7, y: -5 }, { x: -4, y: 3 }, { x: 0, y: 0 }], duration: 0.24, ease: "none" }, 6.62);
// penguin: head tilt "?"
tl.set("#pengB", { opacity: 0 }, 7.05); tl.set("#pengC", { opacity: 1 }, 7.05);
tl.from("#pengC", { scaleY: 0.9, scaleX: 1.06, svgOrigin: "${PX} ${PY + 180}", duration: 0.35, ease: "back.out(3)" }, 7.05);
// camera shoots up into space (world drops away)
tl.to("#pcam", { y: 1400, scale: 0.7, svgOrigin: "540 1600", duration: 0.5, ease: "power3.in" }, 7.95);
`;

// ============================ SPACE (8 – 20 s, local time) ============================
const G = { lon0: 20, lat0: -25 };
const R = 430;
const [qx, qy] = poleXY(0, 0, R, G).map(f1);           // pole offset from globe centre (north-up)
const C4 = [540, 1160], C5 = [540, 1160];                // globe centre: before / after the turn (stays put)
const MOON_DY = C5[1] - 900;                             // moon, pop, sparkles were drawn for a globe at y 900
const TITLE_DY = 160;                                    // title block sits lower, between the top edge and the moon's leaf
const P4 = [C4[0] - qx, C4[1] - qy];                     // pole on screen while south-up (panel 4)
const P5 = [C5[0] + qx, C5[1] + qy];                     // pole on screen after the turn
setSeed(19);
const speed4 = [...Array(22)].map((_, i) => { const a = (i / 22) * Math.PI * 2 + 0.1; const r0 = 560 + (i % 3) * 60; return `<line x1="${f1(540 + Math.cos(a) * r0)}" y1="${f1(1160 + Math.sin(a) * r0)}" x2="${f1(540 + Math.cos(a) * (r0 + 260))}" y2="${f1(1160 + Math.sin(a) * (r0 + 260))}" stroke-width="${3 + (i % 3) * 2}"/>`; }).join("");
const [px, py] = P5;
// turn arrows: arcs concentric with the globe, just outside the atmosphere (R 430, glow ~505).
// Globe-local coords, drawn clockwise from a0 to a1 degrees (0 = right, 90 = down).
const AR = 500;
const arc = (a0, a1, r = AR) => {
  const p = (a) => [f1(Math.cos((a * Math.PI) / 180) * r), f1(Math.sin((a * Math.PI) / 180) * r)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`;
};
const spaceSvg = `
<g id="scam">
  ${space()}
  <circle id="glow" cx="540" cy="1100" r="620" fill="url(#heroGlow)" opacity="0"/>
  <g id="zoom">
    <g transform="translate(${C4[0]} ${C4[1]})"><g id="gpos">
      <g id="gpop">
        <g id="grot" transform="rotate(180)">${globe(0, 0, R, { ...G, light: false })}</g>
        <defs><clipPath id="flavClip"><circle id="flavCircle" cx="${qx}" cy="${qy}" r="0"/></clipPath></defs>
        <g id="flav" clip-path="url(#flavClip)">${globe(0, 0, R, { ...G, flavored: true, light: false })}</g>
        <g transform="scale(${R / 400})"><g id="shadeReal">${globeShade(false)}</g><g id="shadeFlav" opacity="0">${globeShade(true)}</g></g>
        <g id="gcone" transform="rotate(180)">
          ${cone(qx, qy, 30, 46)}
          <circle id="ring" cx="${qx}" cy="${f1(qy + 20)}" r="62" fill="none" stroke="#ffd166" stroke-width="6" stroke-dasharray="14 10" opacity="0"/>
        </g>
      </g>
      <g id="arrows" opacity="0">
        <path d="${arc(196, 248)}" stroke="#ffd166" stroke-width="12" fill="none" stroke-linecap="round" marker-end="url(#arrow)"/>
        <path d="${arc(16, 68)}" stroke="#ffd166" stroke-width="12" fill="none" stroke-linecap="round" marker-end="url(#arrow)"/>
      </g>
      <g id="arrowsLabel" opacity="0">${T(-400, -420, "180°", { size: 64, weight: 900, fill: "#ffd166", filter: "txtShadow" })}</g>
    </g></g>
  </g>
  <g id="speed4" stroke="#fff" stroke-linecap="round" opacity="0">${speed4}</g>
  <g id="whoosh">${comic(540, 330, "วู้บบบ!", 120, "#fff")}</g>
  <g id="callout" opacity="0">
    <path d="M780 520 Q700 560 ${f1(P4[0] + 60)} ${f1(P4[1] - 40)}" stroke="#ffd166" stroke-width="7" fill="none" marker-end="url(#arrow)"/>
    ${T(820, 500, "โคนของคุณ", { size: 46, weight: 800, fill: "#ffd166", filter: "txtShadow" })}
  </g>
  <g id="h4" opacity="0">${heading("ในอวกาศ ไม่มีข้างบน-ข้างล่าง…", "In space, there's no up or down…", 250)}</g>
  <g id="speed6" stroke="#ffd166" stroke-width="9" stroke-linecap="round" opacity="0">
    <path d="M${px - 50} ${py + 6} l-60 -6 M${px - 44} ${py + 36} l-56 14 M${px + 50} ${py + 6} l60 -6 M${px + 44} ${py + 36} l56 14"/></g>
  <g transform="translate(0 ${MOON_DY})">
  <g id="moon">
    <circle cx="540" cy="390" r="150" fill="url(#moonGlow)"/>
    <path d="M548 332 C560 290 600 266 660 260" stroke="#3f8f45" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M630 266 C668 230 728 236 744 272 C702 286 656 286 630 266 Z" fill="#62b85a"/>
    <circle cx="540" cy="390" r="78" fill="url(#moonGrad)"/>
    <circle cx="512" cy="368" r="15" fill="#c9c6d6"/><circle cx="566" cy="412" r="11" fill="#c9c6d6"/><circle cx="562" cy="360" r="7" fill="#c9c6d6"/>
    <ellipse cx="510" cy="358" rx="22" ry="12" fill="#fff" opacity=".6"/>
  </g>
  <g id="pop"><g transform="translate(860 520) rotate(10)"><path d="M0 -90 L22 -34 L82 -40 L36 0 L70 52 L12 30 L-16 86 L-24 26 L-84 30 L-40 -6 L-70 -60 L-14 -34 Z" fill="#ff9ad5"/>${T(0, 18, "ป๊อป!", { size: 56, weight: 900, fill: "#fff", stroke: "#2b2350", sw: 8 })}</g></g>
  <g id="msp" fill="#fff">${[[400, 300, 16], [690, 420, 12], [450, 480, 10], [640, 230, 14]].map(([x, y, s], i) => `<g id="ms${i}" opacity="0">${sparkle(x, y, s)}</g>`).join("")}</g>
  </g>
  <g transform="translate(0 ${TITLE_DY})"><g id="title" opacity="0">
    <g id="t1">${T(540, 250, "ไอศกรีมโลก", { size: 140, weight: 900, fill: "url(#gold)", stroke: "#2b2350", sw: 18, filter: "softShadow" })}</g>
    <g id="t2">${T(540, 316, "EARTH ICE CREAM", { size: 44, weight: 700, fill: "#fff", filter: "txtShadow" })}</g>
  </g></g>
</g>
<rect id="flash" width="1080" height="1920" fill="#fff"/>`;

const spaceJs = `
const D = ${SPACE.dur};
tl.fromTo("#flash", { opacity: 1 }, { opacity: 0, duration: 0.5, ease: "power2.out" }, 0);
// pull out: start deep on the pole, the whole Earth arrives (south up, the cone a speck)
tl.fromTo("#zoom", { scale: 9, svgOrigin: "${f1(P4[0])} ${f1(P4[1])}" }, { scale: 1, duration: 1.9, ease: "expo.out" }, 0);
tl.fromTo("#speed4", { opacity: 0.9, scale: 0.55, svgOrigin: "540 1160" }, { opacity: 0, scale: 1.45, duration: 1.6, ease: "power2.out" }, 0);
tl.fromTo("#whoosh", { opacity: 0, scale: 0.4, svgOrigin: "540 300" }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)" }, 0.2);
tl.to("#whoosh", { opacity: 0, y: -40, duration: 0.3 }, 2.1);
// "your cone"
tl.to("#ring", { opacity: 1, duration: 0.01 }, 1.55);
tl.fromTo("#ring", { scale: 2.2, svgOrigin: "${qx} ${f1(qy + 20)}" }, { scale: 1, duration: 0.4, ease: "back.out(2)" }, 1.55);
tl.fromTo("#callout", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" }, 1.7);
tl.to("#callout, #ring", { opacity: 0, duration: 0.25 }, 3.0);
// the turn: 180°, Earth settles higher in frame
tl.fromTo("#grot, #gcone", { rotation: -180, svgOrigin: "0 0" }, { rotation: 0, duration: 1.45, ease: "power2.inOut" }, 4.85);
tl.fromTo("#arrows", { opacity: 0, scale: 0.9, svgOrigin: "0 0" }, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }, 4.15);
tl.fromTo("#arrows", { rotation: -25 }, { rotation: 20, svgOrigin: "0 0", duration: 2.15, ease: "power1.inOut", immediateRender: false }, 4.15);
tl.fromTo("#arrowsLabel", { opacity: 0, scale: 0.6, svgOrigin: "-400 -440" }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)" }, 4.25);
tl.to("#arrows, #arrowsLabel", { opacity: 0, duration: 0.35 }, 6.3);
tl.fromTo("#h4", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 2.2);
tl.to("#h4", { opacity: 0, duration: 0.3 }, 4.4);
// ice-cream reveal, spreading from the cone
tl.to("#flavCircle", { attr: { r: 1000 }, duration: 0.9, ease: "power2.inOut" }, 6.35);
tl.to("#shadeReal", { opacity: 0, duration: 0.9 }, 6.35);
tl.to("#shadeFlav", { opacity: 1, duration: 0.9 }, 6.35);
tl.to("#glow", { opacity: 1, duration: 1.0 }, 6.35);
tl.fromTo("#gpop", { scale: 1 }, { keyframes: [{ scale: 1.06, duration: 0.25, ease: "power2.out" }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }], svgOrigin: "0 0" }, 7.1);
tl.fromTo("#speed6", { opacity: 0 }, { keyframes: [{ opacity: 1, duration: 0.1 }, { opacity: 1, duration: 0.6 }, { opacity: 0, duration: 0.3 }] }, 7.15);
tl.to("#title", { opacity: 1, duration: 0.01 }, 8.0);
tl.fromTo("#t1", { opacity: 0, y: -120, scale: 1.3, svgOrigin: "540 210" }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.8)" }, 8.0);
tl.fromTo("#t2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, 8.35);
// the Moon drops on top as a cherry
tl.fromTo("#moon", { x: 560, y: ${-620 - MOON_DY}, rotation: -50, svgOrigin: "540 390" }, { x: 0, y: 0, rotation: 0, duration: 0.7, ease: "back.out(1.4)" }, 9.1);
tl.to("#title", { y: -80, duration: 0.5, ease: "power2.inOut" }, 9.1);
tl.fromTo("#gpop", { scale: 1 }, { keyframes: [{ scale: 0.97, duration: 0.1 }, { scale: 1, duration: 0.45, ease: "elastic.out(1, 0.4)" }], svgOrigin: "0 0", immediateRender: false }, 9.75);
tl.fromTo("#pop", { scale: 0, rotation: -30, svgOrigin: "860 520" }, { scale: 1, rotation: 0, duration: 0.4, ease: "back.out(3)" }, 9.8);
tl.to("#pop", { rotation: 6, svgOrigin: "860 520", duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, 10.2);
[0, 1, 2, 3].forEach((i) => {
  const o = ["400 300", "690 420", "450 480", "640 230"][i];
  tl.fromTo("#ms" + i, { opacity: 0, scale: 0.2, svgOrigin: o }, { opacity: 1, scale: 1.1, duration: 0.25, ease: "back.out(3)" }, 9.85 + i * 0.08);
  tl.to("#ms" + i, { opacity: 0, scale: 0.5, duration: 0.4 }, 10.7 + i * 0.1);
});
// slow push-in to the end
tl.fromTo("#scam", { scale: 1 }, { scale: 1.04, svgOrigin: "${C5[0]} ${C5[1]}", duration: D - 6.35, ease: "none" }, 6.35);
`;

mkdirSync(join(proj, "compositions"), { recursive: true });
writeFileSync(join(proj, "compositions", "polar.html"), composition("polar", POLAR.dur, polarSvg, polarJs));
writeFileSync(join(proj, "compositions", "space.html"), composition("space", SPACE.dur, spaceSvg, spaceJs));

const index = `<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: #0a0d2c; }
    </style>
  </head>
  <body>
    <div data-hf-id="hf-main" id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="1080" data-height="1920">
      <div data-hf-id="hf-clip-polar" id="polar" data-composition-id="polar" data-composition-src="compositions/polar.html" data-start="${POLAR.start}" data-duration="${POLAR.dur}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:1"></div>
      <div data-hf-id="hf-clip-space" id="space" data-composition-id="space" data-composition-src="compositions/space.html" data-start="${SPACE.start}" data-duration="${SPACE.dur}" data-track-index="2" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:2"></div>
      <audio data-hf-id="hf-clip-mix" id="mix" class="clip" src="assets/audio/mix.wav" data-start="0" data-duration="${TOTAL}" data-track-index="3"></audio>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
writeFileSync(join(proj, "index.html"), index);
writeFileSync(join(proj, "hyperframes.json"), JSON.stringify({ $schema: "https://hyperframes.heygen.com/schema/hyperframes.json", paths: { blocks: "compositions", assets: "assets" } }, null, 2) + "\n");
writeFileSync(join(proj, "meta.json"), JSON.stringify({ id: "ice-cream-earth", name: "ไอศกรีมโลก", createdAt: "2026-11-16T10:00:00.000Z" }, null, 2) + "\n");
console.log("built polar.html, space.html, index.html; pole offset", qx, qy, "P4", P4.map(f1), "P5", P5.map(f1));
