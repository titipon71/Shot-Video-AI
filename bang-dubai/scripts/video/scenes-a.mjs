// Animated scenes 0-3 for the bang-dubai video.
import { asokBg, heightMarker, plane, barriers, cautionTape, liveUI, priceTag, stall, vehicle, speechBubble, smellClouds } from "../../compositions/components/kit.mjs";
import { presets, person, car, NORMAL_CARS, badge, card, burst, questionMark, heart, gallon, geyserDefs, cracks, phoneFlash, pin, txt, FONT } from "./common.mjs";

const carsOf = (pre, list) => list.map(([k, x, y, o], i) => car(`${pre}-car${i}`, k, x, y, o)).join("");

// ---------------- Scene 0: Monday morning, the road cracks, oil gushes ----------------
export function scene0(L, dur) {
  const reg = [];
  const svg = `
    ${geyserDefs("s0g")}
    ${asokBg({ time: "morning", prefix: "s0", trainX: -520 })}
    <g id="s0-cars">${carsOf("s0", NORMAL_CARS)}</g>
    ${cracks("s0-crk", 540, 1440, 5, 10)}
    <g id="s0-dust"></g>
    <g id="s0-gey"></g>
    <g id="s0-hm">${heightMarker(300, 1440, 640, "สูงเท่าตึก 3 ชั้น")}</g>
    ${person(reg, "s0om", { ...presets.officeMale, expressions: ["neutral", "shocked"], armL: 10, armR: 12 }, 140, 1850, 0.86)}
    ${person(reg, "s0of", { ...presets.officeFemale, expressions: ["smile", "shocked"], armL: 10, armR: 20, holdR: "phone" }, 300, 1880, 0.82)}
    ${person(reg, "s0inf", { ...presets.influencer, expressions: ["smile", "shocked"], armL: 12, armR: 20, holdR: "phone" }, 800, 1872, 0.84)}
    ${person(reg, "s0win", { ...presets.winMale, expressions: ["neutral", "worried", "shocked"], holdR: undefined, armL: 14, armR: 14 }, 960, 1860, 0.8)}
    <g id="s0-clock"><g transform="translate(870 560)">
      <circle r="78" fill="#f7efe2" stroke="#2a1b17" stroke-width="7"/>
      ${[...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return `<circle cx="${(Math.sin(a) * 60).toFixed(1)}" cy="${(-Math.cos(a) * 60).toFixed(1)}" r="5" fill="#2a1b17"/>`; }).join("")}
      <g id="s0-hh"><rect x="-5" y="-38" width="10" height="44" rx="5" fill="#2a1b17"/></g>
      <g id="s0-mh"><rect x="-3.5" y="-58" width="7" height="64" rx="3.5" fill="#c8282f"/></g>
      <circle r="8" fill="#2a1b17"/>
    </g></g>
    ${badge("s0-tb", "เช้าวันจันทร์")}
    <g id="s0-sub">${txt(540, 330, "แยกอโศกมนตรี", { size: 34, weight: 700, fill: "#3a2a18", stroke: "#fff1c8", sw: 8 })}</g>
  `;
  const t2 = L.L02.s, t3 = L.L03.s;
  const tCrack = t2 + 1.3, tGush = t2 + 1.9, tHeight = t2 + 3.3;
  const js = `
    const r = rng(11);
    // morning traffic crawl + BTS passing
    tl.fromTo("#s0-asok .bts-train", { x: -520 }, { x: 1120, duration: 3.4, ease: "none" }, 0);
    $$("#s0-cars .car").forEach((c, i) => { const dx = (i % 2 ? -1 : 1) * (18 + r() * 30);
      tl.fromTo(c, { x: -dx }, { x: dx, duration: ${t2.toFixed(2)}, ease: "none" }, 0);
      bob(c.querySelector(".veh-b"), 0, ${(tGush).toFixed(2)}, 2.5, 0.35 + r() * 0.2); });
    pop("#s0-tb", 0.15, 540, 230); fadeIn("#s0-sub", 0.6, 0.4);
    // commuters stroll in
    slide("#s0om-w", 0, -260, 0, { d: 1.6, e: "power1.out" }); slide("#s0of-w", 0.2, -320, 0, { d: 1.7, e: "power1.out" });
    slide("#s0inf-w", 0.1, 300, 0, { d: 1.6, e: "power1.out" }); slide("#s0win-w", 0.3, 260, 0, { d: 1.5, e: "power1.out" });
    ["s0om","s0of","s0inf","s0win"].forEach((id, i) => bob("#" + id + "-b", 0, 1.9, 7, 0.42 + i * 0.03));
    // rumble then crack
    shake("#s0-shk", ${t2.toFixed(2)}, 5, 1.2); shake("#s0-shk", ${(t2 + 1.1).toFixed(2)}, 8, 0.8);
    $$("#s0-crk .crk").forEach((p, i) => draw(p, ${tCrack.toFixed(2)} - 0.5 + i * 0.05, 0.45, 260));
    // dust puffs at the crack
    (() => { const g = $("#s0-dust"); for (let i = 0; i < 12; i++) { const cx = 540 + (r() - .5) * 360, cy = 1440 + (r() - .5) * 60;
      const c = mk("ellipse", { cx, cy, rx: 50 + r() * 50, ry: 26 + r() * 20, fill: "#d8c8b0", opacity: 0 }, g);
      tl.fromTo(c, { opacity: 0, scale: .3, svgOrigin: cx + " " + cy }, { keyframes: [{ opacity: .6, scale: 1, duration: .35 }, { opacity: 0, scale: 1.6, y: -60, duration: 1.2 }] }, ${tCrack.toFixed(2)} - 0.3 + r() * 0.8); } })();
    gusher($("#s0-gey"), { id: "s0g", x: 540, y: 1440, H: 660, W: 54, t0: ${tGush.toFixed(2)}, rise: 1.0, seed: 3, sc: 1, puddle: [70, 330, 22, 95, ${tGush.toFixed(2)}, ${dur.toFixed(2)}] });
    shake("#s0-shk", ${tGush.toFixed(2)}, 20, 0.9);
    // cars jolt away from the blast
    $$("#s0-cars .car").forEach((c, i) => { const cx = +c.dataset.x, dir = cx < 540 ? -1 : 1, near = Math.max(0, 1 - Math.abs(cx - 540) / 500);
      tl.to(c.querySelector(".veh-b"), { x: dir * (30 + 60 * near), rotation: dir * (6 + 14 * near), svgOrigin: c.dataset.x + " " + c.dataset.y, duration: .35, ease: "back.out(3)" }, ${tGush.toFixed(2)} + 0.05 + r() * 0.15); });
    // everyone turns shocked and jumps
    [["s0om",0],["s0of",.08],["s0inf",.04],["s0win",.12]].forEach(([id, d]) => { face(id, "${"shocked"}", ${(tGush + 0.1).toFixed(2)} + d); jump("#" + id + "-b", ${(tGush + 0.1).toFixed(2)} + d, 46, .5); });
    face("s0win", "worried", ${(tGush + 0.2).toFixed(2)});
    arm("s0om", "L", ${(tGush + 0.15).toFixed(2)}, 150, .25); arm("s0om", "R", ${(tGush + 0.15).toFixed(2)}, -150, .25);
    // height marker for "สูงเท่าตึก 3 ชั้น"
    pop("#s0-hm", ${tHeight.toFixed(2)}, 300, 1440, { d: .5, from: 0.2 });
    // camera: slight push, tilt up to the gusher top, then settle
    cam("#s0-cam", [{ t: 0, s: 1.12, y: 40, d: 0.01 }, { t: 0.05, s: 1.0, y: 0, d: ${(t2 - 0.1).toFixed(2)}, e: "sine.inOut" },
      { t: ${tGush.toFixed(2)}, s: 1.1, y: 150, d: 1.2, e: "power2.out" }, { t: ${(tHeight + 0.4).toFixed(2)}, s: 1.0, y: 0, d: 1.2 },
      { t: ${t3.toFixed(2)}, s: 1.08, y: -40, d: ${(dur - t3).toFixed(2)}, e: "sine.inOut" }]);
    // "what happens next": a clock spins forward
    pop("#s0-clock", ${(t3 + 0.9).toFixed(2)}, 870, 560, { d: .5 });
    tl.fromTo("#s0-mh", { rotation: 0, svgOrigin: "870 560" }, { rotation: 1440, svgOrigin: "870 560", duration: ${(dur - t3 - 1.1).toFixed(2)}, ease: "power2.in" }, ${(t3 + 1.1).toFixed(2)});
    tl.fromTo("#s0-hh", { rotation: 0, svgOrigin: "870 560" }, { rotation: 120, svgOrigin: "870 560", duration: ${(dur - t3 - 1.1).toFixed(2)}, ease: "power2.in" }, ${(t3 + 1.1).toFixed(2)});
    // influencer pulls out the phone
    arm("s0inf", "R", ${(t3 + 0.3).toFixed(2)}, 150, .35); arm("s0of", "R", ${(t3 + 0.7).toFixed(2)}, 140, .35);
    ["s0om","s0of","s0inf","s0win"].forEach((id, i) => bob("#" + id + "-b", ${(tGush + 0.8).toFixed(2)}, ${dur.toFixed(2)}, 4, 0.5 + i * 0.05));
  `;
  return { svg, js, reg };
}

// ---------------- Scene 1: first hour — panic, stink, live streams, jam to Bang Na ----------------
export function scene1(L, dur) {
  const reg = [];
  const t5 = L.L05.s, t6 = L.L06.s, t7 = L.L07.s, t8 = L.L08.s, t9 = L.L09.s;
  const svg = `
    ${geyserDefs("s1g")}
    ${asokBg({ time: "day", prefix: "s1", trainX: 320 })}
    <g id="s1-cars">${carsOf("s1", NORMAL_CARS)}</g>
    <g id="s1-gey"></g>
    <g id="s1-honks">${NORMAL_CARS.slice(0, 9).map(([, x, y], i) => `<g class="honk" data-x="${x}" data-y="${y - 70}"><g transform="translate(${x} ${y - 70})"><rect x="-30" y="-26" width="60" height="44" rx="12" fill="#f7efe2" stroke="#2a1b17" stroke-width="4"/><path d="M-6 6 L0 6 M-8 -14 L8 -14 L4 0 L-4 0 Z" fill="#c8282f" stroke="#c8282f" stroke-width="3"/><path d="M-10 18 L-18 30 L2 18 Z" fill="#f7efe2" stroke="#2a1b17" stroke-width="3"/></g></g>`).join("")}</g>
    <g id="s1-smell"></g>
    ${person(reg, "s1inf", { ...presets.influencer, expressions: ["smile", "worried"], armL: 16, armR: 20, holdR: "selfie" }, 170, 1720, 0.95)}
    ${person(reg, "s1om", { ...presets.officeMale, expressions: ["neutral", "worried", "shocked"], armL: 12, armR: 14, holdR: "phone" }, 380, 1740, 0.88)}
    ${person(reg, "s1of", { ...presets.officeFemale, expressions: ["worried", "shocked"], armL: 12, armR: 14, holdL: "phone" }, 560, 1730, 0.86)}
    ${person(reg, "s1t", { ...presets.touristMale, expressions: ["smile", "shocked"], armL: 12, armR: 14 }, 960, 1760, 0.84)}
    ${card("s1-think", 470, 1130, 230, 170, `
      <rect x="-80" y="-10" width="110" height="34" rx="6" fill="#8a8a92" stroke="#2a1b17" stroke-width="4"/>
      <rect x="40" y="-10" width="50" height="34" rx="6" fill="#8a8a92" stroke="#2a1b17" stroke-width="4" transform="rotate(18 40 7)"/>
      <path d="M30 -30 Q40 -50 34 -66 M48 -26 Q66 -44 62 -60" fill="none" stroke="#5aa0d8" stroke-width="6" stroke-linecap="round"/>
      <text x="-40" y="-26" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="54" fill="#c8282f">?</text>`, { rx: 60 })}
    <g id="s1-live">${liveUI({ x: 790, y: 1020, caption: "น้ำพุโคล่ากลางกรุง!" })}
      <rect x="610" y="782" width="190" height="34" rx="10" fill="#000" opacity=".55"/>
      <text id="s1-viewers" x="620" y="807" font-family="${FONT}" font-weight="700" font-size="22" fill="#fff">1,204 กำลังดู</text>
      <g id="s1-hearts"></g></g>
    <g id="s1-map">
      ${card("s1-mapc", 540, 640, 820, 470, `
        <rect x="-380" y="-205" width="760" height="410" rx="16" fill="#e8efe2"/>
        <path d="M-330 -120 C-200 -100 -150 20 -40 40 C80 60 160 0 330 140" fill="none" stroke="#b8c4b0" stroke-width="40" stroke-linecap="round"/>
        <path d="M-220 -200 L-160 200 M120 -200 L60 200 M-380 -10 L380 -60" stroke="#cfd8c8" stroke-width="18"/>
        <path id="s1-jam" d="M-330 -120 C-200 -100 -150 20 -40 40 C80 60 160 0 330 140" fill="none" stroke="#e0464c" stroke-width="20" stroke-linecap="round"/>
        <g transform="translate(-330 -120)"><circle r="24" fill="#f0c14a" stroke="#2a1b17" stroke-width="4"/>${txt(0, -36, "อโศก", { size: 34, weight: 800, fill: "#2a1b17" })}</g>
        <g id="s1-bn"><g transform="translate(330 140)"><circle r="24" fill="#e0464c" stroke="#2a1b17" stroke-width="4"/>${txt(-10, -36, "บางนา", { size: 34, weight: 800, fill: "#c8282f" })}</g></g>`, { fill: "#1a2420", stroke: "#f4efe6", sw: 6 })}
    </g>
    ${badge("s1-tb", "1 ชั่วโมงแรก")}
  `;
  const js = `
    const r = rng(21);
    gusher($("#s1-gey"), { id: "s1g", x: 540, y: 1420, H: 600, W: 52, t0: -2, rise: 0.5, seed: 5, puddle: [300, 340, 92, 104, 0, ${dur.toFixed(2)}] });
    pop("#s1-tb", 0.1, 540, 230);
    // panic: people rush in
    slide("#s1inf-w", 0.05, -320, 0, { d: .7 }); slide("#s1om-w", 0.15, -420, 0, { d: .75 }); slide("#s1of-w", 0.25, 520, 0, { d: .8 }); slide("#s1t-w", 0.1, 300, 0, { d: .7 });
    ["s1inf","s1om","s1of","s1t"].forEach((id, i) => bob("#" + id + "-b", 0, 1.2, 12, 0.3));
    face("s1om", "shocked", 0.2); face("s1t", "shocked", 0.3);
    $$("#s1-cars .car").forEach((c, i) => bob(c.querySelector(".veh-b"), 0, ${t7.toFixed(2)}, 2, 0.4 + r() * 0.2));
    // "first we thought a pipe burst"
    pop("#s1-think", ${t5.toFixed(2)}, 420, 1220, { d: .45 }); popOut("#s1-think", ${(t6 - 0.05).toFixed(2)}, 420, 1220);
    face("s1om", "worried", ${t5.toFixed(2)});
    // sulphur smell spreads
    (() => { const g = $("#s1-smell"); for (let i = 0; i < 14; i++) { const cx = 540 + (r() - .5) * 200, cy = 1100 + (r() - .5) * 300;
      const tx = (r() - .5) * 900, ty = (r() - .5) * 500, rr = 60 + r() * 70;
      const e = mk("ellipse", { cx, cy, rx: rr, ry: rr * .7, fill: i % 3 ? "#c8d84a" : "#a8c03a", opacity: 0 }, g);
      tl.fromTo(e, { opacity: 0, scale: .2, x: 0, y: 0, svgOrigin: cx + " " + cy }, { opacity: .45, scale: 1, x: tx, y: ty, duration: 1.4, ease: "power2.out" }, ${t6.toFixed(2)} + i * 0.05);
      tl.to(e, { opacity: 0, duration: 1.0 }, ${(t8 + 0.4).toFixed(2)} + i * 0.03); } })();
    ["s1om","s1of","s1inf"].forEach((id) => face(id, "worried", ${(t6 + 0.3).toFixed(2)}));
    arm("s1of", "R", ${(t6 + 0.3).toFixed(2)}, 160, .3); arm("s1om", "L", ${(t6 + 0.35).toFixed(2)}, 155, .3);
    // gridlock: horns everywhere
    $$("#s1-honks .honk").forEach((h, i) => { pop(h, ${t7.toFixed(2)} + i * 0.09, +h.dataset.x, +h.dataset.y + 30, { d: .3 });
      tl.to(h, { scale: 0, svgOrigin: h.dataset.x + " " + (+h.dataset.y + 30), duration: .2 }, ${(t8 + 0.1).toFixed(2)} + i * 0.02); });
    shake("#s1-shk", ${t7.toFixed(2)}, 5, .6);
    // live stream sub-shot
    cam("#s1-cam", [{ t: 0, s: 1.1, d: 0.01 }, { t: 0.05, s: 1.0, d: 1.2 }, { t: ${(t8 - 0.15).toFixed(2)}, s: 1.18, x: 40, y: -60, d: 0.6, e: "power3.out" },
      { t: ${(t9 - 0.2).toFixed(2)}, s: 1.0, x: 0, y: 0, d: 0.5, e: "power3.inOut" }]);
    slide("#s1-live", ${t8.toFixed(2)}, 600, 0, { d: .5, e: "back.out(1.4)" });
    arm("s1inf", "R", ${(t8 - 0.1).toFixed(2)}, 160, .3); face("s1inf", "smile", ${t8.toFixed(2)}); arm("s1om", "R", ${(t8 + 0.4).toFixed(2)}, 150, .3); arm("s1t", "R", ${(t8 + 0.6).toFixed(2)}, 150, .3); face("s1t", "smile", ${(t8 + 0.6).toFixed(2)});
    counter($("#s1-viewers"), ${(t8 + 0.3).toFixed(2)}, 3, 1204, 48920, (v) => Math.round(v).toLocaleString("en-US") + " กำลังดู");
    (() => { const g = $("#s1-hearts"); for (let i = 0; i < 18; i++) { const hx = 930 + (r() - .5) * 40, hy = 1100;
      const h = mk("path", { d: "M0 8 C0 2 -8 -4 -14 2 C-20 8 0 22 0 22 C0 22 20 8 14 2 C8 -4 0 2 0 8 Z", fill: i % 2 ? "#e07a9a" : "#e0464c", transform: "translate(" + hx + " " + hy + ") scale(" + (1 + r()) + ")", opacity: 0 }, g);
      tl.fromTo(h, { opacity: 0, x: 0, y: 0 }, { keyframes: [{ opacity: 1, duration: .15 }, { opacity: 0, x: (r() - .5) * 90, y: -260 - r() * 120, duration: 1.1 }] }, ${(t8 + 0.4).toFixed(2)} + i * 0.17); } })();
    slideOut("#s1-live", ${(t9 - 0.2).toFixed(2)}, 700, 0, { d: .35 });
    // jam all the way to Bang Na
    pop("#s1-map", ${t9.toFixed(2)}, 540, 640, { d: .5, e: "back.out(1.6)" });
    draw("#s1-jam", ${(t9 + 0.3).toFixed(2)}, 1.6, 1100);
    pop("#s1-bn", ${(t9 + 1.7).toFixed(2)}, 870, 780, { d: .4 });
    $$("#s1-cars .car").forEach((c, i) => tl.to(c.querySelector(".veh-b"), { y: -6, duration: .12, yoyo: true, repeat: 1 }, ${t9.toFixed(2)} + i * 0.05));
    ["s1inf","s1om","s1of","s1t"].forEach((id, i) => bob("#" + id + "-b", 1.3, ${dur.toFixed(2)}, 4, 0.55 + i * 0.04));
  `;
  return { svg, js, reg };
}

// ---------------- Scene 2: 3 hours later — gallon army, incense, megaphone ----------------
export function scene2(L, dur) {
  const reg = [];
  const t11 = L.L11.s, t12 = L.L12.s, t13 = L.L13.s, t14 = L.L14.s, t15 = L.L15.s, t16 = L.L16.s;
  const jugColors = ["#d4542a", "#f0c14a", "#4aa06a", "#2b6ea8", "#c8282f", "#f4efe6", "#e8893a", "#7a4ab5", "#d4542a", "#f0c14a"];
  const svg = `
    ${geyserDefs("s2g")}
    ${asokBg({ time: "day", prefix: "s2", trainX: 80 })}
    <g id="s2-fire">${vehicle("fire", 200, 1320, { scale: 1.1, rot: -6 })}</g>
    <g id="s2-gey"></g>
    <g id="s2-bar">${barriers(10, 1400, 3, 1.1)}${barriers(850, 1410, 3, 1.1)}${cautionTape(20, 1420, 1040, 1500)}</g>
    <g id="s2-jugs">${jugColors.map((c, i) => `<g class="jug" data-x="${i < 5 ? 120 + i * 85 : 560 + (i - 5) * 85}">${gallon(i < 5 ? 120 + i * 85 : 560 + (i - 5) * 85, 1690 + (i % 2) * 18, c, 1.25, (i % 3 - 1) * 6)}</g>`).join("")}</g>
    <g id="s2-moto">${vehicle("moto", 120, 1600, { color: "#f26a1b", scale: 1.15, rot: -8 })}</g>
    ${person(reg, "s2w1", { ...presets.winMale, expressions: ["smile"], armL: 20, armR: 28, holdR: "gallon" }, 300, 1600, 0.82)}
    ${person(reg, "s2m1", { gender: "male", hair: "short", outfit: "shirt", shirtColor: "#4a7ab5", pantsColor: "#2b3142", expressions: ["smile", "shocked"], armL: 24, armR: 30, holdR: "bottle" }, 420, 1620, 0.78)}
    ${person(reg, "s2f1", { gender: "female", hair: "pony", outfit: "shirt", shirtColor: "#e8893a", skirt: true, skirtColor: "#4a2a1e", expressions: ["smile", "shocked"], armL: 20, armR: 35, holdR: "bag" }, 700, 1610, 0.78)}
    ${person(reg, "s2w2", { ...presets.winMale, expressions: ["smirk", "shocked"], helmetColor: "#2c3a4a", armL: 30, armR: 22, holdR: "gallon", shirtColor: "#2a2a32" }, 860, 1620, 0.8)}
    ${person(reg, "s2au", { ...presets.auntie, expressions: ["smile", "shocked"], armL: 10, armR: 55, holdR: "incense" }, 190, 1760, 0.98)}
    <g id="s2-smoke" transform="translate(246 1500)">
      <path d="M0 0 Q-14 -34 4 -58 Q20 -82 0 -112 Q-16 -140 6 -170" fill="none" stroke="#c8c8d0" stroke-width="7" stroke-linecap="round" opacity=".8"/>
      <path d="M12 0 Q26 -40 4 -72 Q-10 -100 12 -130" fill="none" stroke="#e0d8d0" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    </g>
    ${card("s2-lotto", 330, 1150, 250, 120, `${txt(0, -14, "เลขเด็ด", { size: 30, weight: 800, fill: "#8e1d24" })}${txt(0, 36, "? ? ?", { size: 44, weight: 900, fill: "#2a1b17" })}`, { fill: "#fff0c0", stroke: "#8e1d24" })}
    ${person(reg, "s2of", { ...presets.officer, expressions: ["angry"], armL: 12, armR: 12, holdL: "megaphone", holdR: undefined }, 880, 1780, 1.02)}
    <g id="s2-waves" transform="translate(760 1250)">${[0, 1, 2].map((i) => `<path class="wv" d="M${-20 - i * 26} ${-30 - i * 18} Q${-40 - i * 30} 0 ${-20 - i * 26} ${30 + i * 18}" fill="none" stroke="#f7efe2" stroke-width="7" stroke-linecap="round"/>`).join("")}</g>
    <g id="s2-bub">${speechBubble(560, 1060, "ห้ามจุดไฟ!!", { dir: "right", w: 380 })}</g>
    <g id="s2-alert"><rect width="1080" height="1920" fill="#e0201c" opacity=".0"/></g>
    ${burst("s2-boom", 540, 760, 170, "อันตราย!", { fill: "#f0c14a", color: "#c8282f", size: 54 })}
    <g id="s2-news"><g transform="translate(0 360)">
      <rect x="0" y="0" width="1080" height="130" fill="#1a0c0c" opacity=".92"/>
      <rect x="0" y="0" width="1080" height="8" fill="#c8282f"/>
      <rect x="0" y="8" width="210" height="44" fill="#c8282f"/>${txt(105, 40, "ข่าวด่วน", { size: 28, weight: 800, fill: "#fff" })}
      ${txt(560, 104, "น้ำมันดิบเกรดพรีเมียม", { size: 50, weight: 800, fill: "#f7efe2" })}
    </g></g>
    <g id="s2-seal"><g transform="translate(910 610) rotate(-12)">
      <circle r="88" fill="#d4a017" stroke="#7a5408" stroke-width="6"/><circle r="70" fill="none" stroke="#fff0c0" stroke-width="3" stroke-dasharray="6 6"/>
      ${txt(0, -6, "PREMIUM", { size: 30, weight: 900, fill: "#3a2208" })}${txt(0, 30, "★★★", { size: 26, weight: 900, fill: "#fff0c0" })}
    </g></g>
    ${badge("s2-tb", "3 ชั่วโมงต่อมา")}
  `;
  const js = `
    const r = rng(31);
    gusher($("#s2-gey"), { id: "s2g", x: 540, y: 1400, H: 540, W: 50, t0: -2, rise: .5, seed: 9, puddle: [320, 360, 96, 108, 0, ${dur.toFixed(2)}] });
    pop("#s2-tb", 0.1, 540, 230);
    // gallon army marches in
    $$("#s2-jugs .jug").forEach((j, i) => { const left = i < 5; slide(j, ${t11.toFixed(2)} + (i % 5) * 0.08, left ? -700 : 700, 0, { d: .7, e: "power2.out" });
      bob(j, ${t11.toFixed(2)}, ${(t13 + 1).toFixed(2)}, 14, 0.3); });
    pop("#s2-lotto", ${(t11 + 1.2).toFixed(2)}, 330, 1150, { rot: -12 });
    popOut("#s2-lotto", ${(t12 + 0.1).toFixed(2)}, 330, 1150);
    // breaking news: premium crude
    slide("#s2-news", ${t12.toFixed(2)}, -1100, 0, { d: .45, e: "power3.out" });
    pop("#s2-seal", ${(t12 + 1.2).toFixed(2)}, 910, 610, { rot: -40, d: .5 });
    tl.to("#s2-seal", { rotation: 8, svgOrigin: "910 610", duration: 3, ease: "sine.inOut" }, ${(t12 + 1.7).toFixed(2)});
    slideOut("#s2-news", ${(t14 - 0.2).toFixed(2)}, 1100, 0); popOut("#s2-seal", ${(t14 - 0.2).toFixed(2)}, 910, 610);
    // villagers + win riders rush in with containers
    slide("#s2-moto", ${t13.toFixed(2)}, -500, 0, { d: .8, e: "power2.out" });
    [["s2w1",-520],["s2m1",-600],["s2f1",560],["s2w2",520]].forEach(([id, dx], i) => { slide("#" + id + "-w", ${t13.toFixed(2)} + i * 0.12, dx, 0, { d: .9, e: "power2.out" });
      bob("#" + id + "-b", ${t13.toFixed(2)}, ${(t13 + 1.2).toFixed(2)}, 12, 0.3); });
    ["s2w1","s2w2","s2m1","s2f1"].forEach((id, i) => { arm(id, "R", ${(t13 + 1.4).toFixed(2)} + i * 0.1, 70, .3); arm(id, "R", ${(t13 + 2.0).toFixed(2)} + i * 0.1, 25, .3); });
    // incense for lottery luck
    cam("#s2-cam", [{ t: 0, s: 1.1, d: .01 }, { t: .05, s: 1, d: 1.0 }, { t: ${(t14 - 0.1).toFixed(2)}, s: 1.32, x: 170, y: -300, d: .55, e: "power3.out" },
      { t: ${(t15 - 0.1).toFixed(2)}, s: 1.28, x: -150, y: -260, d: .5, e: "power3.inOut" }, { t: ${(t16 - 0.05).toFixed(2)}, s: 1.0, x: 0, y: 0, d: .4, e: "power3.out" }]);
    slide("#s2au-w", ${(t14 - 0.1).toFixed(2)}, -400, 0, { d: .5 });
    draw("#s2-smoke path", ${(t14 + 0.3).toFixed(2)}, 1.0, 260);
    tl.fromTo("#s2-smoke", { y: 0 }, { y: -40, duration: 3, ease: "sine.inOut" }, ${(t14 + 0.3).toFixed(2)});
    sway("#s2au-b", ${(t14 + 0.4).toFixed(2)}, ${(t15 + 0.4).toFixed(2)}, 3, 0.8, 190, 1760);
    // officer shouts through the megaphone
    slide("#s2of-w", ${(t15 - 0.1).toFixed(2)}, 420, 0, { d: .45 });
    arm("s2of", "L", ${(t15 + 0.2).toFixed(2)}, 100, .25);
    pop("#s2-bub", ${(t15 + 0.45).toFixed(2)}, 720, 1130, { d: .35, e: "back.out(3)" });
    $$("#s2-waves .wv").forEach((w, i) => tl.fromTo(w, { opacity: 0, x: 20 }, { opacity: 1, x: -20, duration: .3, yoyo: true, repeat: 5, ease: "sine.inOut" }, ${(t15 + 0.4).toFixed(2)} + i * 0.1));
    shake("#s2-shk", ${(t15 + 0.45).toFixed(2)}, 10, .4);
    pop("#s2-bar", ${(t15 + 0.6).toFixed(2)}, 540, 1450, { from: .6, op0: 0, d: .4 });
    // fear of explosion: red alert pulses
    tl.fromTo("#s2-alert rect", { opacity: 0 }, { opacity: .22, duration: .18, yoyo: true, repeat: 5, ease: "sine.inOut" }, ${t16.toFixed(2)});
    pop("#s2-boom", ${(t16 + 0.05).toFixed(2)}, 540, 760, { d: .35, e: "back.out(3)" });
    tl.to("#s2-boom", { scale: 1.08, svgOrigin: "540 760", duration: .15, yoyo: true, repeat: 3 }, ${(t16 + 0.4).toFixed(2)});
    shake("#s2-shk", ${t16.toFixed(2)}, 14, .6);
    [["s2m1",0],["s2f1",.05],["s2w2",.1],["s2au",.08]].forEach(([id, d]) => { face(id, "shocked", ${t16.toFixed(2)} + d); jump("#" + id + "-b", ${t16.toFixed(2)} + d, 40, .45); });
    $$("#s2-cam .car").forEach(() => {});
  `;
  return { svg, js, reg };
}

// ---------------- Scene 3: 12 hours later — world media, sheikhs, land price, noodle stall ----------------
export function scene3(L, dur) {
  const reg = [];
  const t18 = L.L18.s, t19 = L.L19.s, t20 = L.L20.s, t21 = L.L21.s, t22 = L.L22.s, t23 = L.L23.s, t25 = L.L25.s;
  const svg = `
    ${geyserDefs("s3g")}
    ${asokBg({ time: "dusk", prefix: "s3", trainX: 400 })}
    <g id="s3-gey"></g>
    <g id="s3-plane">${plane(0, 0, 1.3, -10)}</g>
    <g id="s3-crew">
      ${person(reg, "s3r1", { gender: "female", hair: "bob", outfit: "suit", shirtColor: "#2b6ea8", pantsColor: "#1c2433", expressions: ["smile"], armL: 10, armR: 120, holdR: "phone" }, 560, 1560, 0.74)}
      ${person(reg, "s3r2", { gender: "male", hair: "short", outfit: "shirt", shirtColor: "#3a3a44", pantsColor: "#1a1a20", expressions: ["neutral"], armL: 120, armR: 120 }, 700, 1580, 0.76)}
      <g id="s3-tvcam"><g transform="translate(690 1290)"><rect x="-70" y="-38" width="120" height="76" rx="10" fill="#2a2a32" stroke="#111" stroke-width="4"/><circle cx="66" cy="0" r="30" fill="#1a1a20" stroke="#6a6a72" stroke-width="6"/><circle cx="66" cy="0" r="12" fill="#5a8aaa"/><rect x="-50" y="-60" width="50" height="22" rx="4" fill="#3a3a44"/><circle cx="-50" cy="-20" r="7" fill="#e0464c"/></g></g>
      ${person(reg, "s3r3", { gender: "male", hair: "short", outfit: "suit", shirtColor: "#6a2a2a", pantsColor: "#1a1a20", necktie: "#f0c14a", expressions: ["smile"], armL: 10, armR: 100 }, 880, 1570, 0.74)}
    </g>
    ${phoneFlash("s3-f1", 560, 1260)}${phoneFlash("s3-f2", 900, 1240)}${phoneFlash("s3-f3", 740, 1200)}
    <g id="s3-up"><g transform="translate(860 1100)"><path d="M-40 60 L-40 -20 L-80 -20 L0 -110 L80 -20 L40 -20 L40 60 Z" fill="#3dca6a" stroke="#1a3a20" stroke-width="6"/></g></g>
    ${person(reg, "s3g1", { ...presets.businessGulf, expressions: ["smirk"], armL: 12, armR: 8, holdL: "briefcase" }, 120, 1450, 0.74)}
    ${person(reg, "s3g2", { ...presets.businessGulf, expressions: ["smile"], keffiyehAccent: "#1a1a20", armL: 14, armR: 10, holdL: "briefcase" }, 250, 1470, 0.72)}
    ${person(reg, "s3g3", { ...presets.businessGulf, expressions: ["neutral", "smile"], keffiyehColor: "#e8d8c8", keffiyehAccent: "#4a2a1a", armL: 10, armR: 20, holdL: "briefcase" }, 380, 1460, 0.74)}
    <g id="s3-price">${priceTag({ x: 780, y: 760, text: "" })}<text id="s3-pv" x="780" y="770" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="40" fill="#f0c14a">0 บาท/ตร.ว.</text></g>
    <g id="s3-money"></g>
    <g id="s3-stall">
    ${person(reg, "s3v1", { ...presets.vendorFemale, expressions: ["smile"], armL: 20, armR: 40 }, 470, 1600, 0.62)}
    ${stall(300, 1640, { sign: "", color: "#c8282f", w: 330 }).replace(/<rect x="[^"]+" y="[^"]+" width="[^"]+" height="[^"]+" rx="10" fill="#1a1208"[^>]*>/, "")}
    <g id="s3-stallA"><g transform="translate(300 1450)"><rect x="-200" y="-56" width="400" height="104" rx="16" fill="#8e1d24" stroke="#f0c14a" stroke-width="6"/>${txt(0, 18, "ก๋วยเตี๋ยวเรือ", { size: 54, weight: 800, fill: "#fff0c0" })}</g></g>
    <g id="s3-stallB"><g transform="translate(300 1420)"><rect x="-230" y="-100" width="460" height="176" rx="18" fill="#0c0c10" stroke="#f0c14a" stroke-width="6"/>${txt(0, -24, "ก๋วยเตี๋ยวเรือ", { size: 54, weight: 800, fill: "#fff0c0" })}${txt(0, 52, "บ่อน้ำมัน", { size: 62, weight: 900, fill: "#f0c14a" })}<path d="M-190 40 C-200 20 -180 0 -176 -10 C-172 0 -152 20 -162 40 C-166 52 -186 52 -190 40 Z" fill="#2a2a33" stroke="#f0c14a" stroke-width="3"/><path d="M176 40 C166 20 186 0 190 -10 C194 0 214 20 204 40 C200 52 180 52 176 40 Z" fill="#2a2a33" stroke="#f0c14a" stroke-width="3"/></g></g></g>
        <g id="s3-queue">
      ${person(reg, "s3q1", { ...presets.officeMale, expressions: ["smile"], lanyard: false, necktie: "#2b3a55", armL: 8, armR: 8 }, 620, 1700, 0.66)}
      ${person(reg, "s3q2", { ...presets.officeFemale, expressions: ["smile"], armL: 8, armR: 8 }, 740, 1695, 0.64)}
      ${person(reg, "s3q3", { ...presets.touristFemale, expressions: ["smile"], holdR: "phone", armR: 140 }, 860, 1700, 0.66)}
      ${person(reg, "s3q4", { ...presets.touristMale, expressions: ["smile"], holdR: undefined, armL: 8, armR: 8 }, 980, 1695, 0.66)}
    </g>
    <g id="s3-spark">${[[90, 1330], [510, 1330], [300, 1250]].map(([x, y]) => `<path transform="translate(${x} ${y})" d="M0 -26 L6 -6 L26 0 L6 6 L0 26 L-6 6 L-26 0 L-6 -6 Z" fill="#fff0c0"/>`).join("")}</g>
    <g id="s3-wn"><g id="s3-wnbar">
      <rect x="0" y="0" width="1080" height="96" fill="#0c1020"/><rect x="0" y="96" width="1080" height="8" fill="#c8282f"/>
      ${txt(28, 44, "WORLD NEWS", { size: 28, weight: 800, fill: "#e2c7ae", anchor: "start" })}${txt(28, 80, "BREAKING", { size: 20, weight: 700, fill: "#e0464c", anchor: "start" })}
      <rect x="880" y="30" width="90" height="38" rx="6" fill="#c8282f"/>${txt(925, 58, "LIVE", { size: 22, weight: 800, fill: "#fff" })}
    </g>
    <g id="s3-head"><g transform="translate(540 430)">
      <rect x="-490" y="-80" width="980" height="160" rx="12" fill="#0c1020" opacity=".9" stroke="#c8282f" stroke-width="4"/>
      <text x="0" y="22" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="62" fill="#f7efe6">${["Bangkok:", "The", "New", "Dubai"].map((w, i) => `<tspan class="hw">${w}${i < 3 ? " " : ""}</tspan>`).join("")}</text>
    </g></g></g>
    ${badge("s3-tb", "12 ชั่วโมงต่อมา", 600)}
  `;
  const js = `
    const r = rng(41);
    gusher($("#s3-gey"), { id: "s3g", x: 540, y: 1330, H: 420, W: 34, t0: -2, rise: .5, seed: 13, sc: .75, drops: 34, puddle: [230, 250, 70, 76, 0, ${dur.toFixed(2)}] });
    pop("#s3-tb", 0.1, 540, 600); tl.to("#s3-tb", { y: -370, duration: .5, ease: "power3.inOut" }, ${(t19 - 0.6).toFixed(2)});
    // foreign media swarm in
    slide("#s3-crew", ${t18.toFixed(2)}, 700, 0, { d: .6, e: "power3.out" });
    [["#s3-f1", 0.5], ["#s3-f2", 0.8], ["#s3-f3", 1.1], ["#s3-f1", 1.6], ["#s3-f2", 2.0]].forEach(([f, d]) => tl.fromTo(f, { opacity: 0 }, { opacity: 1, duration: .06, yoyo: true, repeat: 1 }, ${t18.toFixed(2)} + d));
    pop("#s3-up", ${(t18 + 1.0).toFixed(2)}, 860, 1160, { d: .45 }); tl.to("#s3-up", { y: -40, duration: .5, yoyo: true, repeat: 3, ease: "sine.inOut" }, ${(t18 + 1.5).toFixed(2)});
    popOut("#s3-up", ${(t21 + 0.9).toFixed(2)}, 860, 1160);
    // world headline
    slide("#s3-wn", ${(t19 - 0.1).toFixed(2)}, 0, -560, { d: .5, e: "power3.out" });
    $$("#s3-head .hw").forEach((w, i) => tl.fromTo(w, { opacity: 0 }, { opacity: 1, duration: .12 }, ${t20.toFixed(2)} + i * 0.3));
    tl.fromTo("#s3-head", { opacity: 0 }, { opacity: 1, duration: .2 }, ${(t19 + 0.1).toFixed(2)});
    slideOut("#s3-wn", ${(t23 - 0.3).toFixed(2)}, 0, -600, { d: .4 });
    // sheikhs fly in
    tl.fromTo("#s3-plane", { x: -200, y: 300 }, { x: 1300, y: 120, duration: 2.6, ease: "power1.inOut" }, ${(t21 - 0.6).toFixed(2)});
    slideOut("#s3-crew", ${(t21 - 0.1).toFixed(2)}, 700, 0, { d: .5 });
    [["s3g1",-500],["s3g2",-560],["s3g3",-620]].forEach(([id, dx], i) => { slide("#" + id + "-w", ${t21.toFixed(2)} + i * 0.12, dx, 0, { d: .9, e: "power2.out" }); bob("#" + id + "-b", ${t21.toFixed(2)}, ${(t21 + 1.1).toFixed(2)}, 8, .36); });
    // 10 million per square wah
    pop("#s3-price", ${t22.toFixed(2)}, 780, 760, { d: .45 });
    counter($("#s3-pv"), ${(t22 + 0.2).toFixed(2)}, 1.8, 0, 10, (v) => (v >= 9.95 ? "10 ล้าน" : v < 1 ? Math.round(v * 1000).toLocaleString("en-US") + "K" : v.toFixed(1) + " ล้าน") + "/ตร.ว.");
    draw("#s3-price path", ${(t22 + 0.2).toFixed(2)}, 1.6, 500);
    tl.to("#s3-price", { scale: 1.1, svgOrigin: "780 760", duration: .15, yoyo: true, repeat: 1 }, ${(t22 + 2.0).toFixed(2)});
    arm("s3g3", "R", ${(t22 + 0.3).toFixed(2)}, 140, .3); face("s3g3", "smile", ${(t22 + 0.3).toFixed(2)});
    (() => { const g = $("#s3-money"); for (let i = 0; i < 14; i++) { const x0 = 400, y0 = 1270;
      const b = mk("rect", { x: x0 - 30, y: y0 - 16, width: 60, height: 32, rx: 4, fill: i % 2 ? "#3d8a4a" : "#5aaa6a", stroke: "#1a3a20", "stroke-width": 3, opacity: 0 }, g);
      tl.fromTo(b, { opacity: 0, x: 0, y: 0, rotation: 0, svgOrigin: x0 + " " + y0 }, { keyframes: [{ opacity: 1, duration: .1 }, { x: 120 + r() * 300, y: -300 - r() * 400, rotation: (r() - .5) * 360, svgOrigin: x0 + " " + y0, duration: 1.0, ease: "power2.out" }, { opacity: 0, duration: .3 }] }, ${(t22 + 0.3).toFixed(2)} + i * 0.08); } })();
    [["s3g1",-700],["s3g2",-700],["s3g3",-700]].forEach(([id, dx], i) => slideOut("#" + id + "-w", ${(t23 - 0.3).toFixed(2)} + i * 0.05, dx, 0, { d: .5 }));
    popOut("#s3-price", ${(t23 - 0.2).toFixed(2)}, 780, 760);
    // roadside stall renames itself
    cam("#s3-cam", [{ t: 0, s: 1.08, d: .01 }, { t: .05, s: 1, d: 1 }, { t: ${(t23 - 0.15).toFixed(2)}, s: 1.3, x: 150, y: -290, d: .7, e: "power3.inOut" }]);
    tl.set("#s3-stallB", { opacity: 0 }, 0);
    slide("#s3-stall", ${(t23 - 0.2).toFixed(2)}, -700, 0, { d: .5, e: "power3.out" });
    tl.to("#s3-stallA", { scaleY: 0, svgOrigin: "300 1450", duration: .15, ease: "power2.in" }, ${(t25 - 0.1).toFixed(2)});
    tl.fromTo("#s3-stallB", { opacity: 1, scaleY: 0, svgOrigin: "300 1450" }, { scaleY: 1, svgOrigin: "300 1450", duration: .3, ease: "back.out(2.5)", immediateRender: false }, ${(t25 + 0.05).toFixed(2)});
    tl.fromTo("#s3-spark path", { scale: 0, opacity: 0 }, { scale: 1.3, opacity: 1, transformOrigin: "50% 50%", duration: .25, yoyo: true, repeat: 3, stagger: .1 }, ${(t25 + 0.2).toFixed(2)});
    slide("#s3-queue", ${(t23 + 0.1).toFixed(2)}, 600, 0, { d: 1.2, e: "power2.out" });
    bob("#s3-queue", ${(t23 + 0.1).toFixed(2)}, ${(t23 + 1.3).toFixed(2)}, 6, .32);
    wave("s3v1", "R", ${t23.toFixed(2)}, ${dur.toFixed(2)}, 150, 110, .5);
  `;
  return { svg, js, reg };
}
