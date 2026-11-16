// Animated scenes 4-7 for the bang-dubai video.
import { asokBg, drillingRig, opecBadge, ticket, vehicle, monument, palm, snowflakes } from "../../compositions/components/kit.mjs";
import { presets, person, car, NORMAL_CARS, SUPER_COLORS, badge, card, burst, questionMark, house, phoneFlash, pin, txt, FONT } from "./common.mjs";

// ---------------- Scene 4: 3 days later — geologists baffled, giant rig, BTS shaves past ----------------
export function scene4(L, dur) {
  const reg = [];
  const t27 = L.L27.s, t28 = L.L28.s, t29 = L.L29.s, t30 = L.L30.s, t31 = L.L31.s;
  // rig split into build tiers (bottom -> top) using clip rects
  const rig = drillingRig({ x: 640, y: 1420, h: 1000, prefix: "s4rig" });
  const tiers = 6, top = 420, bot = 1460;
  const tierSvg = [...Array(tiers)].map((_, i) => { const y1 = bot - (bot - top) * (i + 1) / tiers - (i === tiers - 1 ? 80 : 0), y0 = bot - (bot - top) * i / tiers + (i === 0 ? 60 : 0);
    return `<clipPath id="s4-tc${i}"><rect x="380" y="${y1.toFixed(0)}" width="520" height="${(y0 - y1 + 1).toFixed(0)}"/></clipPath><g class="tier" data-y="${y0.toFixed(0)}" clip-path="url(#s4-tc${i})">${rig.replace(/id="s4rig/g, `id="s4rig${i}`).replace(/url\(#s4rig-/g, `url(#s4rig${i}-`)}</g>`; }).join("");
  const svg = `
    ${asokBg({ time: "day", prefix: "s4", trainX: -560, rig: true })}
    <g id="s4-blue" opacity="0"><path d="M570 1340 L622 460 L658 460 L710 1340 Z M600 900 L680 900 M590 1100 L690 1100 M612 700 L668 700" fill="none" stroke="#f7efe2" stroke-width="5" stroke-dasharray="16 10"/></g>
    <g id="s4-rig"><defs>${[...Array(tiers)].map((_, i) => "").join("")}</defs>${tierSvg}
      <g id="s4-flag"><g transform="translate(644 380)"><rect x="0" y="0" width="70" height="46" fill="#f4efe6"/><rect y="0" width="70" height="8" fill="#c8282f"/><rect y="38" width="70" height="8" fill="#c8282f"/><rect y="15" width="70" height="16" fill="#1a2a6a"/><rect x="-4" y="-6" width="5" height="70" fill="#6a6a70"/></g></g>
    </g>
    <g id="s4-crane"><g transform="translate(900 1420)"><rect x="-10" y="-760" width="20" height="760" fill="#f0c14a" stroke="#2a1b17" stroke-width="3"/><rect x="-260" y="-780" width="320" height="18" fill="#f0c14a" stroke="#2a1b17" stroke-width="3"/><path id="s4-cable" d="M-220 -762 L-220 -600" stroke="#2a1b17" stroke-width="3"/><rect x="-240" y="-600" width="40" height="22" fill="#8a9098"/></g></g>
    <g id="s4-board">${card("s4-boardc", 270, 1000, 400, 420, `
      <path d="M-170 -150 L170 -150 L170 -95 L-170 -80 Z" fill="#c8d8a0"/><path d="M-170 -80 L170 -95 L170 -35 L-170 -20 Z" fill="#c8b898"/>
      <path d="M-170 -20 L170 -35 L170 25 L-170 40 Z" fill="#8a7a60"/><path d="M-170 40 L170 25 L170 90 L-170 100 Z" fill="#4a3a30"/>
      <ellipse id="s4-pocket" cx="10" cy="-60" rx="70" ry="24" fill="#0c0c10"/>
      <path d="M10 -84 L10 -170" stroke="#0c0c10" stroke-width="10"/>
      <g transform="translate(0 150)"><circle r="40" fill="#5aa0d8" stroke="#2a1b17" stroke-width="4"/><path d="M-20 -20 Q0 -5 -10 15 Q10 25 25 5 M5 -35 Q15 -20 30 -18" fill="none" stroke="#3d8a4a" stroke-width="8"/></g>`, { fill: "#f4efe6" })}</g>
    ${person(reg, "s4geo", { ...presets.geologist, expressions: ["worried", "shocked"], armL: 16, armR: 70, holdR: "pointer" }, 180, 1640, 0.9)}
    ${person(reg, "s4geo2", { ...presets.geologist, shirtColor: "#6a3a5a", hair: "bob", gender: "female", expressions: ["worried", "shocked"], armL: 16, armR: 16, holdR: undefined }, 420, 1660, 0.82)}
    <g id="s4-qs">${questionMark("s4-q1", 120, 1060, 1.1)}${questionMark("s4-q2", 330, 1180, 0.9)}${questionMark("s4-q3", 470, 1080, 1.2)}${questionMark("s4-q4", 230, 940, 0.8)}</g>
    <g id="s4-dizzy"><g transform="translate(180 1150)">${[0, 1, 2, 3].map((i) => `<path class="st" transform="rotate(${i * 90}) translate(70 0)" d="M0 -16 L4 -5 L16 -5 L6 2 L10 14 L0 6 L-10 14 L-6 2 L-16 -5 L-4 -5 Z" fill="#f0c14a" stroke="#2a1b17" stroke-width="2"/>`).join("")}</g></g>
    <g id="s4-lines">${[0, 1, 2, 3, 4].map((i) => `<rect x="${-300 + i * 40}" y="${812 + i * 16}" width="${220 - i * 20}" height="6" rx="3" fill="#fff" opacity=".85"/>`).join("")}</g>
    ${burst("s4-close", 470, 700, 150, "เฉียดฉิว!", { size: 46 })}
    ${person(reg, "s4t1", { ...presets.touristFemale, expressions: ["smile"], armL: 20, armR: 20, holdR: "phone" }, 330, 1760, 0.85)}
    ${person(reg, "s4t2", { ...presets.touristMale, expressions: ["smile"], armL: 20, armR: 20, holdR: "phone" }, 520, 1780, 0.88)}
    ${person(reg, "s4t3", { ...presets.influencer, expressions: ["smile"], armL: 12, armR: 20, holdR: "selfie" }, 900, 1770, 0.9)}
    ${phoneFlash("s4-f1", 380, 1400)}${phoneFlash("s4-f2", 560, 1380)}${phoneFlash("s4-f3", 940, 1390)}
    ${pin("s4-pin", 640, 380, 1.4)}
    ${badge("s4-tb", "3 วันต่อมา")}
  `;
  const js = `
    const r = rng(51);
    pop("#s4-tb", 0.1, 540, 230);
    // the plan: a rig next to the BTS
    tl.fromTo("#s4-blue", { opacity: 0 }, { opacity: 1, duration: .3 }, ${t27.toFixed(2)});
    draw("#s4-blue path", ${t27.toFixed(2)}, 1.0, 3000);
    tl.fromTo("#s4-asok .bts-train", { x: -560 }, { x: 160, duration: 1.4, ease: "power2.out" }, ${t27.toFixed(2)});
    tl.set("#s4-rig .tier, #s4-flag, #s4-crane", { opacity: 0 }, 0);
    // geologists baffled
    cam("#s4-cam", [{ t: 0, s: 1.06, d: .01 }, { t: .05, s: 1, d: 1 }, { t: ${(t28 - 0.1).toFixed(2)}, s: 1.3, x: 160, y: 40, d: .6, e: "power3.out" },
      { t: ${(t29 - 0.1).toFixed(2)}, s: 1.0, x: 0, y: 0, d: .6, e: "power3.inOut" }, { t: ${(t30 - 0.1).toFixed(2)}, s: 1.1, x: 0, y: 40, d: .5 }, { t: ${(t31 - 0.1).toFixed(2)}, s: 1.0, x: 0, y: 0, d: .6 }]);
    pop("#s4-board", ${(t28 - 0.1).toFixed(2)}, 270, 1200, { d: .45 });
    slide("#s4geo-w", ${(t28 - 0.1).toFixed(2)}, -400, 0, { d: .5 }); slide("#s4geo2-w", ${t28.toFixed(2)}, -600, 0, { d: .55 });
    $$("#s4-qs > g").forEach((q, i) => { const b = q.getBBox(); pop(q, ${(t28 + 0.5).toFixed(2)} + i * 0.25, b.x + b.width / 2, b.y + b.height / 2, { rot: -30 });
      tl.to(q, { rotation: 12, svgOrigin: (b.x + b.width / 2) + " " + (b.y + b.height / 2), duration: .35, yoyo: true, repeat: 5, ease: "sine.inOut" }, ${(t28 + 1).toFixed(2)} + i * 0.1); });
    arm("s4geo", "L", ${(t28 + 0.6).toFixed(2)}, 160, .3); arm("s4geo2", "R", ${(t28 + 0.8).toFixed(2)}, -160, .3); arm("s4geo2", "L", ${(t28 + 0.8).toFixed(2)}, 160, .3);
    face("s4geo", "shocked", ${(t28 + 1.7).toFixed(2)}); face("s4geo2", "shocked", ${(t28 + 1.8).toFixed(2)});
    pop("#s4-dizzy", ${(t28 + 1.7).toFixed(2)}, 180, 1150, { d: .3 });
    tl.fromTo("#s4-dizzy > g", { rotation: 0, svgOrigin: "180 1150" }, { rotation: 540, svgOrigin: "180 1150", duration: 1.6, ease: "none" }, ${(t28 + 1.7).toFixed(2)});
    jump("#s4geo-b", ${(t28 + 1.7).toFixed(2)}, 30, .4);
    // hide the board scene when the build starts
    [["#s4-board", 270, 1200], ["#s4-dizzy", 180, 1150]].forEach(([s, x, y]) => popOut(s, ${(t29 - 0.15).toFixed(2)}, x, y));
    $$("#s4-qs > g").forEach((q) => tl.to(q, { opacity: 0, duration: .2 }, ${(t29 - 0.15).toFixed(2)}));
    slideOut("#s4geo-w", ${(t29 - 0.15).toFixed(2)}, -500, 0); slideOut("#s4geo2-w", ${(t29 - 0.15).toFixed(2)}, -700, 0);
    // government builds a giant rig tier by tier
    fadeOut("#s4-blue", ${(t29 + 0.2).toFixed(2)}, .3);
    tl.fromTo("#s4-crane", { opacity: 0, y: 300 }, { opacity: 1, y: 0, duration: .5, ease: "power3.out" }, ${t29.toFixed(2)});
    $$("#s4-rig .tier").forEach((g, i) => { tl.fromTo(g, { opacity: 0, y: -260 }, { opacity: 1, y: 0, duration: .32, ease: "bounce.out" }, ${(t29 + 0.3).toFixed(2)} + i * 0.38);
      tl.call(() => {}, null, ${(t29 + 0.3).toFixed(2)} + i * 0.38); shake("#s4-shk", ${(t29 + 0.55).toFixed(2)} + i * 0.38, 4, .2); });
    pop("#s4-flag", ${(t29 + 2.7).toFixed(2)}, 644, 440, { d: .4 });
    tl.to("#s4-crane", { opacity: 0, y: 300, duration: .4, ease: "power2.in" }, ${(t30 - 0.3).toFixed(2)});
    // BTS shaves past
    tl.fromTo("#s4-asok .bts-train", { x: -560 }, { x: 1200, duration: 2.1, ease: "none", immediateRender: false }, ${(t30 - 0.1).toFixed(2)});
    tl.fromTo("#s4-lines", { opacity: 0, x: 0 }, { keyframes: [{ opacity: 1, x: 500, duration: .4 }, { opacity: 0, x: 1100, duration: .5 }] }, ${(t30 + 0.25).toFixed(2)});
    pop("#s4-close", ${(t30 + 0.6).toFixed(2)}, 470, 700, { d: .35, e: "back.out(3)" });
    tl.to("#s4-close", { scale: 1.08, svgOrigin: "470 700", duration: .14, yoyo: true, repeat: 3 }, ${(t30 + 1).toFixed(2)});
    popOut("#s4-close", ${(t31 - 0.05).toFixed(2)}, 470, 700);
    shake("#s4-shk", ${(t30 + 0.5).toFixed(2)}, 10, .5);
    // new check-in spot
    [["s4t1",-500],["s4t2",-600],["s4t3",500]].forEach(([id, dx], i) => { slide("#" + id + "-w", ${t31.toFixed(2)} + i * 0.1, dx, 0, { d: .5 }); arm(id, "R", ${(t31 + 0.6).toFixed(2)} + i * 0.1, 150, .3); });
    pop("#s4-pin", ${(t31 + 0.4).toFixed(2)}, 640, 380, { d: .5, e: "bounce.out" });
    ["#s4-f1","#s4-f2","#s4-f3","#s4-f1","#s4-f3","#s4-f2"].forEach((f, i) => tl.fromTo(f, { opacity: 0 }, { opacity: 1, duration: .06, yoyo: true, repeat: 1 }, ${(t31 + 1.0).toFixed(2)} + i * 0.22));
    ["s4t1","s4t2","s4t3"].forEach((id, i) => bob("#" + id + "-b", ${(t31 + 0.5).toFixed(2)}, ${dur.toFixed(2)}, 5, .5 + i * .05));
  `;
  return { svg, js, reg };
}

// ---------------- Scene 5: 1 month later — free trains, OPEC+, coupons, supercars ----------------
export function scene5(L, dur) {
  const reg = [];
  const t33 = L.L33.s, t34 = L.L34.s, t35 = L.L35.s, t36 = L.L36.s, t37 = L.L37.s, t38 = L.L38.s, t39 = L.L39.s, t40 = L.L40.s;
  const lanes = [];
  [[1250, 0.62, 6], [1350, 0.78, 5], [1460, 0.95, 5]].forEach(([y, s, n], li) => { for (let i = 0; i < n; i++) lanes.push([60 + i * (960 / (n - 1)) + (li % 2) * 40, y, s, li]); });
  const svg = `
    ${asokBg({ time: "day", prefix: "s5", trainX: -560 })}
    <g id="s5-normal">${lanes.map(([x, y, s], i) => car(`s5-n${i}`, ["sedan", "taxi", "van", "sedan", "bus"][i % 5], x, y, { color: ["#c8282f", "#f0c14a", "#8a8a92", "#2b6ea8", "#e8893a"][i % 5], stripe: "#3dca6a", scale: s * (i % 5 === 4 ? 0.8 : 1), rot: (i % 3 - 1) * 4, flip: i % 2 === 1 })).join("")}</g>
    <g id="s5-super">${lanes.map(([x, y, s], i) => car(`s5-s${i}`, "supercar", x, y, { color: SUPER_COLORS[i % SUPER_COLORS.length], scale: s, rot: (i % 3 - 1) * 3, flip: i % 2 === 1 })).join("")}</g>
    <g id="s5-sp"></g>
    <g id="s5-free"><g transform="translate(560 740)"><rect x="-70" y="-34" width="140" height="68" rx="16" fill="#3dca6a" stroke="#1a3a20" stroke-width="5"/>${txt(0, 15, "ฟรี", { size: 44, weight: 900, fill: "#fff" })}</g></g>
    <g id="s5-opec">${opecBadge({ x: 400, y: 560 })}</g>
    <g id="s5-coins"></g>
    <g id="s5-tk1">${ticket(300, 900, { title: "BTS", sub: "ฟรี", color: "#3d8a6a" })}</g>
    <g id="s5-tk2">${ticket(780, 900, { title: "MRT", sub: "ฟรี", color: "#2b4a8a" })}</g>
    <g id="s5-coupons"></g>
    <g id="s5-houses">
      <rect x="40" y="430" width="1000" height="560" rx="30" fill="#bfe0f0" stroke="#2a1b17" stroke-width="6"/>
      <rect x="40" y="860" width="1000" height="130" rx="0" fill="#7ab070"/>
      ${[[210, "#f2d2c4", "#c8282f"], [540, "#f0e0a8", "#2b6ea8"], [870, "#d8e8d0", "#8e5a2a"]].map(([x, c, rf], i) => `${house(x, 860, c, rf)}
        <g class="hc" data-x="${x}">${car(`s5-h${i}a`, "sedan", x - 70, 935, { color: SUPER_COLORS[i * 2], scale: 0.95 })}${car(`s5-h${i}b`, "supercar", x + 75, 945, { color: SUPER_COLORS[i * 2 + 5], scale: 0.95 })}</g>
        <g class="plus" data-x="${x}"><g transform="translate(${x + 70} 640)"><circle r="40" fill="#f0c14a" stroke="#2a1b17" stroke-width="4"/>${txt(0, 14, "+2", { size: 38, weight: 900, fill: "#2a1b17" })}</g></g>`).join("")}
    </g>
    <g id="s5-sign"><g transform="translate(540 1110)"><rect x="-200" y="-40" width="400" height="80" rx="10" fill="#2a4a3a" stroke="#f4efe6" stroke-width="4"/>${txt(0, 16, "ถ.สุขุมวิท", { size: 42, weight: 800, fill: "#f4efe6" })}</g></g>
    ${person(reg, "s5d1", { ...presets.officeMale, expressions: ["neutral", "angry"], necktie: "#2a1b17", lanyard: false, armL: 8, armR: 8 }, 110, 1820, 0.8)}
    ${person(reg, "s5d4", { gender: "female", hair: "long", outfit: "shirt", shirtColor: "#c8282f", pantsColor: "#1a1a20", expressions: ["neutral", "angry", "smile"], armL: 8, armR: 8 }, 950, 1820, 0.8)}
    ${badge("s5-tb", "1 เดือนต่อมา")}
  `;
  const js = `
    const r = rng(61);
    pop("#s5-tb", 0.1, 540, 230);
    tl.set("#s5-super .car", { scale: 0 }, 0);
    // free trains
    tl.fromTo("#s5-asok .bts-train", { x: -560 }, { x: 330, duration: 1.0, ease: "power3.out" }, ${(t33 - 0.3).toFixed(2)});
    pop("#s5-free", ${(t33 + 0.4).toFixed(2)}, 560, 740, { rot: -20 });
    // ...but traffic worse: cars pile in
    $$("#s5-normal .car").forEach((c, i) => { tl.fromTo(c, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: .3, ease: "bounce.out" }, ${t34.toFixed(2)} + i * 0.06);
      bob(c.querySelector(".veh-b"), ${(t34 + 1).toFixed(2)}, ${(t40 + 0.2).toFixed(2)}, 2, .5 + r() * .2); });
    popOut("#s5-free", ${(t35 - 0.2).toFixed(2)}, 560, 740);
    face("s5d1", "angry", ${(t34 + 0.5).toFixed(2)}); face("s5d4", "angry", ${(t34 + 0.6).toFixed(2)});
    // Thailand joins OPEC+
    cam("#s5-cam", [{ t: 0, s: 1.06, d: .01 }, { t: .05, s: 1, d: 1 }, { t: ${(t35 - 0.1).toFixed(2)}, s: 1.12, y: 160, d: .5 }, { t: ${(t38 - 0.2).toFixed(2)}, s: 1.0, y: 0, d: .4 },
      { t: ${(t39 - 0.1).toFixed(2)}, s: 1.15, y: -150, d: .6 }, { t: ${(t40 + 0.6).toFixed(2)}, s: 1.05, y: -60, d: 1.4 }]);
    pop("#s5-opec", ${t35.toFixed(2)}, 470, 560, { d: .5 });
    (() => { const g = $("#s5-coins"); for (let i = 0; i < 16; i++) { const x0 = 400, y0 = 560;
      const c = mk("circle", { cx: x0, cy: y0, r: 16, fill: "#f0c14a", stroke: "#7a5408", "stroke-width": 3, opacity: 0 }, g);
      const a = r() * Math.PI * 2, d = 200 + r() * 260;
      tl.fromTo(c, { opacity: 0, x: 0, y: 0 }, { keyframes: [{ opacity: 1, x: Math.cos(a) * d, y: Math.sin(a) * d * .7, duration: .5, ease: "power2.out" }, { y: Math.sin(a) * d * .7 + 300, opacity: 0, duration: .6, ease: "power1.in" }] }, ${(t35 + 0.2).toFixed(2)} + i * 0.03); } })();
    popOut("#s5-opec", ${(t37 - 0.2).toFixed(2)}, 470, 560);
    // free BTS / MRT
    pop("#s5-tk1", ${t36.toFixed(2)}, 300, 900, { rot: -25 }); pop("#s5-tk2", ${(t36 + 0.45).toFixed(2)}, 780, 900, { rot: 25 });
    tl.to(["#s5-tk1", "#s5-tk2"], { y: -20, duration: .4, yoyo: true, repeat: 3, ease: "sine.inOut" }, ${(t36 + 0.9).toFixed(2)});
    popOut("#s5-tk1", ${(t37 + 0.6).toFixed(2)}, 300, 900); popOut("#s5-tk2", ${(t37 + 0.6).toFixed(2)}, 780, 900);
    // fuel coupons rain down
    (() => { const g = $("#s5-coupons"); for (let i = 0; i < 16; i++) { const x0 = 80 + r() * 920;
      const cg = mk("g", { opacity: 0 }, g);
      cg.innerHTML = '<rect x="-80" y="-36" width="160" height="72" rx="8" fill="#f4efe6" stroke="#3d8a4a" stroke-width="4" stroke-dasharray="8 4"/><text x="0" y="12" text-anchor="middle" font-family="Kanit, sans-serif" font-weight="800" font-size="26" fill="#1a5a28">คูปองน้ำมัน</text>';
      cg.setAttribute("transform", "translate(" + x0 + " -80)");
      tl.fromTo(cg, { opacity: 1, y: 0, rotation: (r() - .5) * 60 }, { y: 2100, rotation: (r() - .5) * 200, duration: 1.2 + r() * .4, ease: "power1.in" }, ${(t37 - 0.1).toFixed(2)} + i * 0.05); } })();
    // everybody buys more cars
    pop("#s5-houses", ${(t38 - 0.05).toFixed(2)}, 540, 700, { d: .45, e: "back.out(1.6)" });
    tl.set("#s5-houses .hc .car", { scale: 0 }, 0); tl.set("#s5-houses .plus", { scale: 0 }, 0);
    $$("#s5-houses .hc .car").forEach((c, i) => pop(c, ${(t38 + 0.35).toFixed(2)} + i * 0.15, +c.dataset.x, +c.dataset.y + 20, { d: .35 }));
    $$("#s5-houses .plus").forEach((p, i) => pop(p, ${(t38 + 0.6).toFixed(2)} + i * 0.3, +p.dataset.x + 70, 640, { d: .35 }));
    popOut("#s5-houses", ${(t39 - 0.15).toFixed(2)}, 540, 700);
    // Sukhumvit gridlock, then every car becomes a supercar
    pop("#s5-sign", ${(t39 + 0.1).toFixed(2)}, 540, 1110, { d: .35 });
    shake("#s5-shk", ${(t39 + 0.3).toFixed(2)}, 4, .5);
    $$("#s5-normal .car").forEach((c, i) => tl.to(c, { scale: 0, svgOrigin: c.dataset.x + " " + c.dataset.y, duration: .18, ease: "back.in(2)" }, ${(t40 + 0.1).toFixed(2)} + i * 0.05));
    $$("#s5-super .car").forEach((c, i) => tl.fromTo(c, { scale: 0, svgOrigin: c.dataset.x + " " + c.dataset.y }, { scale: 1, svgOrigin: c.dataset.x + " " + c.dataset.y, duration: .32, ease: "back.out(2.5)", immediateRender: false }, ${(t40 + 0.26).toFixed(2)} + i * 0.05));
    (() => { const g = $("#s5-sp"); $$("#s5-super .car").forEach((c, i) => { const x = +c.dataset.x, y = +c.dataset.y - 30;
      const s = mk("path", { d: "M0 -22 L5 -5 L22 0 L5 5 L0 22 L-5 5 L-22 0 L-5 -5 Z", fill: "#fff0c0", transform: "translate(" + x + " " + y + ")", opacity: 0 }, g);
      tl.fromTo(s, { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1.4, duration: .2, yoyo: true, repeat: 1 }, ${(t40 + 0.35).toFixed(2)} + i * 0.05); }); })();
    face("s5d1", "neutral", ${(t40 + 0.6).toFixed(2)}); face("s5d4", "smile", ${(t40 + 0.6).toFixed(2)});
    ["s5d1","s5d4"].forEach((id, i) => bob("#" + id + "-b", 0, ${dur.toFixed(2)}, 3, .7 + i * .1));
  `;
  return { svg, js, reg };
}

// ---------------- Scene 6: 1 year later — welcome to Bang-Dubai, golden tuk-tuk, towers rise ----------------
export function scene6(L, dur) {
  const reg = [];
  const t42 = L.L42.s, t43 = L.L43.s, t44 = L.L44.s;
  const svg = `
    ${asokBg({ time: "gold", prefix: "s6", trainX: 160, goldCity: true })}
    ${palm(70, 1480, 1.2)} ${palm(1010, 1500, 1.1)}
    <g id="s6-title">
      <g transform="translate(540 560)"><ellipse rx="430" ry="190" fill="#3a1808" opacity=".35"/>
      ${txt(0, -50, "ยินดีต้อนรับสู่", { size: 64, weight: 800, fill: "#fff0c0", stroke: "#5a2060", sw: 12 })}
      <g id="s6-bd">${txt(0, 90, "บางดูไบ", { size: 150, weight: 900, fill: "#f0c14a", stroke: "#3a1808", sw: 16 })}</g></g>
    </g>
    <g id="s6-shine"><rect x="-300" y="380" width="120" height="400" fill="#fff" opacity=".35" transform="skewX(-20)"/></g>
    <g id="s6-tuk"><g id="s6-tukb">${vehicle("tuktuk-gold", 560, 1390, { scale: 3.0, rot: -3 })}</g></g>
    <g id="s6-snow">${snowflakes(420, 1180)}${snowflakes(520, 1160)}${snowflakes(330, 1200)}</g>
    ${person(reg, "s6t1", { ...presets.touristFemale, expressions: ["smile"], armL: 12, armR: 145, holdR: "phone" }, 120, 1820, 0.76)}
    ${person(reg, "s6g", { ...presets.businessGulf, expressions: ["smile"], holdL: "briefcase", armL: 14 }, 960, 1820, 0.82)}
    <g id="s6-sparks">${[[200, 400, 12], [360, 260, 9], [880, 300, 12], [960, 600, 9], [140, 700, 8], [760, 180, 10]].map(([x, y, rr]) => `<path transform="translate(${x} ${y})" d="M0 ${-rr * 2} L${rr * .4} ${-rr * .4} L${rr * 2} 0 L${rr * .4} ${rr * .4} L0 ${rr * 2} L${-rr * .4} ${rr * .4} L${-rr * 2} 0 L${-rr * .4} ${-rr * .4} Z" fill="#fff0c0"/>`).join("")}</g>
    <g id="s6-shade"><rect width="1080" height="1920" fill="#3a1a40" opacity="0"/></g>
    ${badge("s6-tb", "1 ปีต่อมา")}
  `;
  const js = `
    const r = rng(71);
    pop("#s6-tb", 0.05, 540, 230);
    tl.set("#s6-asok .gold-towers", { y: 1300 }, 0);
    tl.fromTo("#s6-asok .bts-train", { x: -500 }, { x: 900, duration: ${dur.toFixed(2)}, ease: "none" }, 0);
    pop("#s6-title", ${(t42 + 0.05).toFixed(2)}, 540, 560, { d: .5, e: "back.out(1.8)" });
    tl.fromTo("#s6-bd", { scale: 1.6, opacity: 0, svgOrigin: "540 620" }, { scale: 1, opacity: 1, svgOrigin: "540 620", duration: .35, ease: "power4.in" }, ${(t42 + 1.0).toFixed(2)});
    shake("#s6-shk", ${(t42 + 1.35).toFixed(2)}, 10, .35);
    tl.fromTo("#s6-shine", { x: 0 }, { x: 1500, duration: .7, ease: "power2.inOut" }, ${(t42 + 1.5).toFixed(2)});
    tl.fromTo("#s6-sparks path", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1.2, duration: .3, yoyo: true, repeat: 7, stagger: .12 }, ${(t42 + 0.5).toFixed(2)});
    tl.to("#s6-title", { y: -40, duration: 2, ease: "sine.inOut" }, ${(t42 + 1.5).toFixed(2)});
    // golden tuk-tuk with air-con
    cam("#s6-cam", [{ t: 0, s: 1.1, d: .01 }, { t: .05, s: 1.0, d: 1.2 }, { t: ${(t43 - 0.1).toFixed(2)}, s: 1.15, x: 0, y: -60, d: .6 }, { t: ${(t44 - 0.05).toFixed(2)}, s: 1.0, x: 0, y: 0, d: .5 }]);
    slide("#s6-tuk", ${t43.toFixed(2)}, -900, 0, { d: .9, e: "power3.out" });
    bob("#s6-tukb", ${t43.toFixed(2)}, ${dur.toFixed(2)}, 4, .22);
    $$("#s6-snow .ac-snow").forEach((s, i) => tl.fromTo(s, { opacity: 0, y: 30 }, { opacity: 1, y: -60, duration: .9, repeat: 2, ease: "power1.out" }, ${(t43 + 0.8).toFixed(2)} + i * 0.25));
    // towers sprout around Asok
    tl.to("#s6-asok .gold-towers", { y: 0, duration: .9, ease: "back.out(1.2)" }, ${(t44 + 0.05).toFixed(2)});
    shake("#s6-shk", ${(t44 + 0.1).toFixed(2)}, 6, .8);
    tl.to("#s6-shade rect", { opacity: .18, duration: .6 }, ${(t44 + 0.4).toFixed(2)});
    ["s6t1","s6g"].forEach((id, i) => bob("#" + id + "-b", 0, ${dur.toFixed(2)}, 4, .6 + i * .1));
    slide("#s6t1-w", 0.1, -300, 0, { d: .7 }); slide("#s6g-w", 0.15, 300, 0, { d: .7 });
  `;
  return { svg, js, reg };
}

// ---------------- Scene 7: golden drill-bit monument at the mall + title card ----------------
export function scene7(L, dur) {
  const reg = [];
  const t46 = L.L46.s, t47 = L.L47.s, tTitle = L.L47.e - 0.35;
  const svg = `
    <defs>
      <linearGradient id="s7-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1a40"/><stop offset=".45" stop-color="#e8885a"/><stop offset="1" stop-color="#ffd08a"/></linearGradient>
      <radialGradient id="s7-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff0a0" stop-opacity=".9"/><stop offset="1" stop-color="#f0c14a" stop-opacity="0"/></radialGradient>
      <linearGradient id="s7-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9ae0f0"/><stop offset="1" stop-color="#3a7a9a"/></linearGradient>
      <linearGradient id="s7-card" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0e08"/><stop offset=".5" stop-color="#0c0806"/><stop offset="1" stop-color="#2a1a08"/></linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#s7-sky)"/>
    <path d="M0 700 L60 380 L120 420 L170 200 L230 260 L290 120 L340 700 Z" fill="#c89050" opacity=".7"/>
    <path d="M760 700 L800 240 L850 300 L900 80 L950 260 L1010 180 L1080 320 L1080 700 Z" fill="#c89050" opacity=".7"/>
    <g id="s7-mall">
      <rect x="40" y="520" width="1000" height="700" rx="10" fill="#e8d8c0" stroke="#2a1b17" stroke-width="6"/>
      <rect x="80" y="660" width="920" height="400" fill="url(#s7-glass)" stroke="#2a1b17" stroke-width="4"/>
      ${[...Array(9)].map((_, i) => `<rect x="${80 + i * 102}" y="660" width="6" height="400" fill="#2a1b17" opacity=".5"/>`).join("")}
      <rect x="80" y="855" width="920" height="6" fill="#2a1b17" opacity=".5"/>
      <path d="M40 520 Q540 430 1040 520 Z" fill="#c8b8a0" stroke="#2a1b17" stroke-width="6"/>
      <g transform="translate(880 560) rotate(-8)"><path d="M-60 40 L0 -60 L30 -60 L10 40 Z" fill="#c8282f" stroke="#2a1b17" stroke-width="4"/></g>
      <g id="s7-sign"><rect x="250" y="560" width="580" height="86" rx="12" fill="#1a1208" stroke="#f0c14a" stroke-width="5"/>
      <text id="s7-signt" x="540" y="620" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="50" fill="#fff0c0">เทอร์มินอล 21</text></g>
      <rect x="400" y="1060" width="280" height="160" fill="#7edce0" stroke="#2a1b17" stroke-width="5"/>
      <rect x="40" y="1220" width="1000" height="40" fill="#b8a890"/>
    </g>
    <rect x="-20" y="1260" width="1120" height="700" fill="#6a5a48"/>
    <path d="M-20 1260 L1100 1260" stroke="#3a2a18" stroke-width="6"/>
    <g id="s7-rays">${[...Array(14)].map((_, i) => { const a = (i / 14) * Math.PI * 2; return `<path d="M540 980 L${(540 + Math.cos(a - 0.08) * 900).toFixed(0)} ${(980 + Math.sin(a - 0.08) * 900).toFixed(0)} L${(540 + Math.cos(a + 0.08) * 900).toFixed(0)} ${(980 + Math.sin(a + 0.08) * 900).toFixed(0)} Z" fill="#fff0a0" opacity=".22"/>`; }).join("")}</g>
    <ellipse cx="540" cy="980" rx="360" ry="360" fill="url(#s7-glow)"/>
    <g id="s7-mon">${monument({ x: 540, y: 1360, scale: 2.0 })}</g>
    <g id="s7-sparks">${[[360, 760], [720, 740], [540, 560], [300, 1000], [800, 1000], [440, 660], [660, 880]].map(([x, y], i) => `<path transform="translate(${x} ${y}) scale(${1 + (i % 3) * 0.4})" d="M0 -20 L5 -5 L20 0 L5 5 L0 20 L-5 5 L-20 0 L-5 -5 Z" fill="#fff8d0"/>`).join("")}</g>
    ${pin("s7-pin", 540, 560, 1.5, "#e0464c")}
    <g id="s7-star"><g transform="translate(540 450)"><path d="M0 -30 L9 -9 L30 -9 L13 5 L19 28 L0 14 L-19 28 L-13 5 L-30 -9 L-9 -9 Z" fill="#f0c14a" stroke="#2a1b17" stroke-width="3"/></g></g>
    ${person(reg, "s7t1", { ...presets.touristFemale, expressions: ["smile"], armL: 12, armR: 20, holdR: "phone" }, 160, 1700, 0.86)}
    ${person(reg, "s7t2", { ...presets.touristMale, expressions: ["smile"], armL: 20, armR: 20, holdR: "phone" }, 920, 1710, 0.88)}
    ${phoneFlash("s7-f1", 210, 1330)}${phoneFlash("s7-f2", 880, 1330)}
    <g id="s7-card"><rect width="1080" height="1920" fill="url(#s7-card)"/>
      <circle cx="540" cy="900" r="420" fill="url(#s7-glow)" opacity=".5"/>
      <g id="s7-cmon">${monument({ x: 540, y: 820, scale: 1.3 })}</g>
      <g id="s7-ttl">${txt(540, 1120, "บางดูไบ", { size: 190, weight: 900, fill: "#f0c14a", stroke: "#3a1808", sw: 10 })}</g>
      <g id="s7-en">${txt(540, 1210, "BANG-DUBAI", { size: 46, weight: 700, fill: "#e2c7ae" })}</g>
      <clipPath id="s7-tclip"><text x="540" y="1120" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="190">บางดูไบ</text></clipPath><g clip-path="url(#s7-tclip)"><rect id="s7-sheen" x="-200" y="900" width="110" height="260" fill="#fffbe8" opacity=".75" transform="skewX(-20)"/></g>
    </g>
  `;
  const js = `
    const r = rng(81);
    // monument rises in front of the mall
    tl.fromTo("#s7-mon", { y: 700 }, { y: 0, duration: 1.1, ease: "back.out(1.3)" }, 0.15);
    shake("#s7-shk", 0.9, 8, .5);
    tl.fromTo("#s7-rays", { opacity: 0, rotation: 0, svgOrigin: "540 980" }, { opacity: 1, rotation: 40, svgOrigin: "540 980", duration: ${dur.toFixed(2)}, ease: "none" }, 0.5);
    tl.fromTo("#s7-sparks path", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1.3, duration: .3, yoyo: true, repeat: 5, stagger: .1 }, 1.0);
    // pull back to reveal the Terminal-21-style mall sign
    cam("#s7-cam", [{ t: 0, s: 1.35, y: -260, d: .01 }, { t: ${(t46 - 0.2).toFixed(2)}, s: 1.0, y: 0, d: 1.0, e: "power3.inOut" }]);
    tl.fromTo("#s7-signt", { opacity: .2 }, { opacity: 1, duration: .08, repeat: 5, yoyo: true }, ${(t46 + 0.1).toFixed(2)});
    tl.set("#s7-signt", { opacity: 1 }, ${(t46 + 0.6).toFixed(2)});
    // new landmark
    pop("#s7-pin", ${(t47 - 0.1).toFixed(2)}, 540, 560, { d: .45, e: "bounce.out" });
    pop("#s7-star", ${(t47 + 0.3).toFixed(2)}, 540, 450, { rot: -90 });
    slide("#s7t1-w", ${(t46 + 0.2).toFixed(2)}, -400, 0, { d: .5 }); slide("#s7t2-w", ${(t46 + 0.3).toFixed(2)}, 400, 0, { d: .5 });
    arm("s7t1", "R", ${(t47).toFixed(2)}, 150, .3); arm("s7t2", "R", ${(t47 + 0.1).toFixed(2)}, 150, .3);
    ["#s7-f1","#s7-f2","#s7-f1","#s7-f2"].forEach((f, i) => tl.fromTo(f, { opacity: 0 }, { opacity: 1, duration: .06, yoyo: true, repeat: 1 }, ${(t47 + 0.4).toFixed(2)} + i * 0.25));
    // title card
    tl.fromTo("#s7-card", { clipPath: "circle(0px at 540px 900px)", opacity: 1 }, { clipPath: "circle(1400px at 540px 900px)", duration: .55, ease: "power3.in" }, ${tTitle.toFixed(2)});
    tl.fromTo("#s7-cmon", { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: "power3.out" }, ${(tTitle + 0.3).toFixed(2)});
    tl.fromTo("#s7-ttl", { scale: 2.2, opacity: 0, svgOrigin: "540 1060" }, { scale: 1, opacity: 1, svgOrigin: "540 1060", duration: .35, ease: "power4.in" }, ${(tTitle + 0.45).toFixed(2)});
    shake("#s7-shk", ${(tTitle + 0.8).toFixed(2)}, 12, .4);
    fadeIn("#s7-en", ${(tTitle + 0.9).toFixed(2)}, .4);
    tl.fromTo("#s7-sheen", { x: 0 }, { x: 1300, duration: .55, ease: "power2.inOut" }, ${(tTitle + 0.85).toFixed(2)});
  `;
  return { svg, js, reg, noOut: true };
}
