// @shot-video/flat-people
// Reusable flat-vector cartoon people for HyperFrames / HTML / SVG / GSAP projects.
// Pure functions -> SVG markup. No runtime dependencies.
//
// Local frame: 200 x 530 (centre x = 100, feet on y = 520).
// Place the returned markup inside <svg viewBox="0 0 200 530"> or any
// <g transform="translate(...) scale(...)">.
//
// Quick start:
//   import { createPerson, createMale, createFemale } from "./index.mjs";
//   const { svg, hands, waist, id } = createPerson({ gender: "female", shirtColor: "#e0b04a", pantsColor: "#2c3550" });
//
// Animation hooks (replace {id} with the returned id):
//   #{id}-root          whole character
//   #{id}-armL / -armR  arms; rotate around data-pivot (default "56 238" / "144 238")
//   #{id}-legs          legs, skirt or trousers, and shoes
//   #{id}-headGroup     head, hair, and face (nod / turn)
//   #{id}-eyes          blink with scaleY (transformOrigin 50% 50%)
//   #{id}-exp-{name}    one expression group; siblings share class "{id}-exp"
//   #{id}-torso         clipPath for the torso
//   #{id}-head          clipPath for the head (not the head group)
//   .{id}-exp           all expression groups, for hiding before revealing one

const hex = (c) => { c = String(c).replace("#", ""); if (c.length === 3) c = c.split("").map((x) => x + x).join(""); return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16)); };
const toHex = (a) => "#" + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
export const mix = (a, b, t) => { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };

const SKIN = "#f4c7a1", SKIN2 = "#dca07c", INK = "#2a1b17", CHEEK = "#f08f8f";

export const FRAME = { width: 200, height: 530, cx: 100, feetY: 520, shoulderL: [56, 238], shoulderR: [144, 238], armLen: 92 };

export const EXPRESSIONS = ["neutral", "smile", "worried", "shocked", "fierce", "angry", "smirk"];

export const HAIR_STYLES = ["short", "bob", "long", "bun", "pony"];

export const OUTFITS = ["shirt", "jacket", "farmer", "blouse", "suit", "lab", "kandura"];

const EXP = {
  neutral: { brows: ["M66 138 L88 137", "M112 137 L134 138"], mouth: { d: "M91 186 Q100 191 109 186", stroke: true } },
  smile:   { brows: ["M66 137 Q77 132 88 136", "M112 136 Q123 132 134 137"], mouth: { d: "M86 182 Q100 198 114 182", stroke: true } },
  worried: { brows: ["M66 141 L88 133", "M112 133 L134 141"], mouth: { d: "M90 190 Q95 184 100 188 Q105 192 110 186", stroke: true } },
  shocked: { brows: ["M66 130 Q77 122 88 128", "M112 128 Q123 122 134 130"], mouth: { o: [100, 190, 7, 9] } },
  fierce:  { brows: ["M66 133 L88 141", "M112 141 L134 133"], mouth: { d: "M89 188 Q101 191 112 183", stroke: true } },
  angry:   { brows: ["M68 132 L90 142", "M110 142 L132 132"], mouth: { d: "M90 189 L110 189", stroke: true } },
  smirk:   { brows: ["M66 136 L88 134", "M112 138 L134 140"], mouth: { d: "M88 186 Q96 196 112 182", stroke: true } },
};

export const FEMALE_DEFAULTS = {
  gender: "female",
  hair: "bob",
  outfit: "shirt",
  top: "#e8899a",
  pants: "#3d3a5c",
  shoes: "#3a2620",
  accent: "#f7efe2",
  view: "front",
  blink: true,
  scale: 1,
};

export const MALE_DEFAULTS = {
  gender: "male",
  hair: "short",
  outfit: "shirt",
  top: "#4a7ab5",
  pants: "#2b3142",
  shoes: "#3a2620",
  accent: "#f7efe2",
  view: "front",
  blink: true,
  scale: 1,
};

export const HOOKS = {
  root: "#{id}-root",
  armL: "#{id}-armL",
  armR: "#{id}-armR",
  legs: "#{id}-legs",
  headGroup: "#{id}-headGroup",
  eyes: "#{id}-eyes",
  expression: "#{id}-exp-{name}",
  expressions: ".{id}-exp",
  torsoClip: "#{id}-torso",
  headClip: "#{id}-head",
};

let _seq = 0;
const autoId = () => "fp" + (++_seq);

function applyAccessories(src, a) {
  if (!a || typeof a !== "object") return;
  if (a.backpack) src.backpack = true;
  if (a.hairClip || a.clip) src.tie = true;
  if (a.mustache || a.moustache) src.mustache = true;
  if (a.halter) src.halter = true;
  if (a.wrinkles) src.wrinkles = true;
  if (a.greyTemples) src.greyTemples = true;
  if (a.sash) src.sash = a.sash;
  if (a.packColor) src.packColor = a.packColor;
  if (a.clipColor) src.accent2 = a.clipColor;
  if (a.helmet) src.helmet = a.helmet;
  if (a.vest) src.vest = a.vest;
  if (a.vestColor) src.vestColor = a.vestColor;
  if (a.labCoat) src.labCoat = true;
  if (a.glasses) src.glasses = true;
  if (a.keffiyeh) src.keffiyeh = true;
  if (a.lanyard) src.lanyard = a.lanyard;
  if (a.necktie) src.necktie = a.necktie;
  if (a.holdL) src.holdL = a.holdL;
  if (a.holdR) src.holdR = a.holdR;
}

function normalize(o = {}, { applyGenderDefaults = false } = {}) {
  const src = { ...o };
  if (src.shirtColor) src.top = src.shirtColor;
  if (src.pantsColor) src.pants = src.pantsColor;
  if (src.shoeColor) src.shoes = src.shoeColor;
  if (src.skinColor) src.skin = src.skinColor;
  if (src.hairStyle) src.hair = src.hairStyle;
  if (src.pose) src.view = src.pose;
  if (src.moustache) src.mustache = src.moustache;
  if (src.hairClip != null) src.tie = !!src.hairClip;
  if (src.clipColor) src.accent2 = src.clipColor;
  if (src.labcoat) src.labCoat = src.labcoat;
  if (src.heldL) src.holdL = src.heldL;
  if (src.heldR) src.holdR = src.heldR;
  if (src.handL) src.holdL = src.handL;
  if (src.handR) src.holdR = src.handR;
  applyAccessories(src, src.accessories);
  if (src.bottom === "skirt" || src.bottom === "pha-sin" || src.bottom === "phaSin") src.skirt = true;
  if (src.bottom === "pants" || src.bottom === "trousers") src.skirt = false;
  if (applyGenderDefaults) {
    const gender = src.gender === "male" ? "male" : "female";
    src.gender = gender;
    const d = gender === "male" ? MALE_DEFAULTS : FEMALE_DEFAULTS;
    for (const [k, v] of Object.entries(d)) if (src[k] == null) src[k] = v;
    if (src.skirt == null && src.bottom == null && src.skirtColor) src.skirt = true;
  }
  if (src.expression && !src.expressions) src.expressions = [src.expression];
  if (!src.id) src.id = autoId();
  if (src.blink == null) src.blink = true;
  return src;
}

function draw(o) {
  const id = o.id;
  const t = o.tint || "#000000", ta = o.tintAmt ?? 0, dk = o.dark ?? 0;
  const C = (c) => mix(mix(c, t, ta), "#000000", dk);
  const skin = C(o.skin || SKIN), skin2 = C(o.skin2 || SKIN2);
  const hairC = C(o.hairColor || "#1b1312"), hairHi = C(mix(o.hairColor || "#1b1312", "#ffffff", 0.18));
  const top = C(o.top || "#d9a441"), top2 = C(o.top2 || mix(o.top || "#d9a441", "#000000", 0.25));
  const pants = C(o.pants || "#2c3550"), pants2 = C(mix(o.pants || "#2c3550", "#000000", 0.3));
  const shoes = C(o.shoes || "#3a2620"), accent = C(o.accent || "#f4efe6");
  const ink = mix(INK, "#000000", dk * 0.5), cheek = C(CHEEK);
  const rim = o.rim, rs = o.rimSide === "right" ? 1 : -1;
  const back = o.view === "back";
  const gender = o.gender || "";
  const out = [];
  const P = (s) => out.push(s);

  const shL = [56, 238], shR = [144, 238], armLen = 92;
  const hand = (sh, ang, side) => { const a = (ang * Math.PI) / 180; return [sh[0] + side * Math.sin(a) * armLen, sh[1] + Math.cos(a) * armLen]; };
  const hL = hand(shL, o.armL ?? 8, -1), hR = hand(shR, o.armR ?? 8, 1);
  const skirt = !!o.skirt;
  const robe = o.outfit === "kandura";
  const bodyBot = skirt ? 340 : robe ? 505 : 392;
  const scale = o.scale ?? 1;

  const cls = ["fp-person", gender ? `fp-${gender}` : "", back ? "fp-back" : "fp-front"].filter(Boolean).join(" ");
  P(`<g id="${id}-root" class="${cls}" data-fp-id="${id}"${gender ? ` data-gender="${gender}"` : ""} data-view="${back ? "back" : "front"}" data-blink="${o.blink ? "on" : "off"}">`);

  // shadow
  P(`<ellipse class="fp-shadow" cx="100" cy="523" rx="74" ry="11" fill="#000" opacity=".5"/>`);

  // legs + shoes
  P(`<g id="${id}-legs" class="fp-legs">`);
  if (skirt) {
    const sk = C(o.skirtColor || "#6b2a3a"), sk2 = C(mix(o.skirtColor || "#6b2a3a", "#000000", 0.3)), band = C(o.skirtBand || "#d8a64a");
    P(`<rect x="78" y="470" width="18" height="40" rx="8" fill="${skin2}"/><rect x="104" y="470" width="18" height="40" rx="8" fill="${skin2}"/>`);
    P(`<path d="M56 334 L144 334 L150 492 Q100 500 50 492 Z" fill="${sk}"/>`);
    P(`<path d="M120 334 L144 334 L150 492 Q136 495 124 496 Z" fill="${sk2}" opacity=".85"/>`);
    P(`<path d="M52 452 L148 452 L149 470 L51 470 Z" fill="${band}" opacity=".9"/><path d="M53 476 L147 476 L148 482 L52 482 Z" fill="${band}" opacity=".7"/>`);
    P(`<path d="M55 352 L145 352 L145.5 360 L54.5 360 Z" fill="${band}" opacity=".55"/>`);
  } else if (robe) {
    const hem = C(mix(o.top || "#f4efe6", "#000000", 0.12));
    P(`<path d="M52 470 L148 470 L158 508 Q100 520 42 508 Z" fill="${top}"/>`);
    P(`<path d="M118 470 L148 470 L158 508 Q138 516 124 516 Z" fill="${top2}" opacity=".85"/>`);
    P(`<path d="M48 492 L152 492 L154 500 L46 500 Z" fill="${hem}" opacity=".55"/>`);
  } else {
    P(`<rect x="72" y="372" width="26" height="136" rx="12" fill="${pants}"/>`);
    P(`<rect x="102" y="372" width="26" height="136" rx="12" fill="${pants2}"/>`);
  }
  P(`<path d="M60 508 Q60 498 74 498 L96 498 Q100 498 100 504 L100 520 L62 520 Q58 520 60 508 Z" fill="${shoes}"/>`);
  P(`<path d="M140 508 Q140 498 126 498 L104 498 Q100 498 100 504 L100 520 L138 520 Q142 520 140 508 Z" fill="${C(mix(o.shoes || "#3a2620", "#000000", 0.25))}"/>`);
  P(`</g>`);

  // arms (tube + round fist), rotatable groups pivoting on the shoulder
  const arm = (name, sh, hd, sleeve) => {
    P(`<g id="${id}-arm${name}" class="fp-arm fp-arm-${name.toLowerCase()}" data-pivot="${sh[0]} ${sh[1]}">`);
    P(`<path d="M${sh[0]} ${sh[1]} L${hd[0].toFixed(1)} ${hd[1].toFixed(1)}" stroke="${sleeve}" stroke-width="24" stroke-linecap="round" fill="none"/>`);
    P(`<circle cx="${hd[0].toFixed(1)}" cy="${(hd[1] + 6).toFixed(1)}" r="13.5" fill="${skin}"/>`);
    P(`<circle cx="${(hd[0] + 3).toFixed(1)}" cy="${(hd[1] + 9).toFixed(1)}" r="8" fill="${skin2}" opacity=".45"/>`);
    P(`</g>`);
  };
  arm("L", shL, hL, back ? top2 : top);
  arm("R", shR, hR, back ? top : top2);

  // neck
  P(`<rect class="fp-neck" x="88" y="200" width="24" height="34" rx="8" fill="${skin2}"/>`);
  // torso
  P(`<clipPath id="${id}-torso"><rect x="46" y="222" width="108" height="${bodyBot - 222}" rx="24"/></clipPath>`);
  P(`<g class="fp-torso" clip-path="url(#${id}-torso)">`);
  P(`<rect x="46" y="222" width="108" height="${bodyBot - 222}" fill="${top}"/>`);
  P(`<rect x="${back ? 46 : 124}" y="222" width="30" height="${bodyBot - 222}" fill="${top2}" opacity=".9"/>`);
  if (!back) {
    if (o.outfit === "shirt" || o.outfit === "farmer") {
      P(`<path d="M100 236 L100 ${bodyBot}" stroke="${C(mix(o.top || "#d9a441", "#000000", 0.35))}" stroke-width="2.5"/>`);
      for (let y = 254; y < bodyBot - 12; y += 30) P(`<circle cx="100" cy="${y}" r="3.6" fill="${accent}" opacity=".9"/>`);
    }
    if (o.outfit === "jacket") {
      P(`<path d="M100 226 L100 ${bodyBot}" stroke="${C("#1a1410")}" stroke-width="3" opacity=".6"/>`);
      P(`<rect x="58" y="318" width="30" height="24" rx="6" fill="${top2}"/><rect x="112" y="318" width="30" height="24" rx="6" fill="${top2}"/>`);
      P(`<path d="M58 324 L88 324 M112 324 L142 324" stroke="${C(mix(o.top || "#d9a441", "#ffffff", 0.25))}" stroke-width="2"/>`);
    }
    if (o.outfit === "blouse") {
      P(`<path d="M60 222 Q100 262 140 222" fill="${accent}" opacity=".9"/>`);
      P(`<path d="M76 226 Q100 250 124 226" fill="${skin2}"/>`);
      P(`<path d="M50 ${bodyBot - 14} L150 ${bodyBot - 14}" stroke="${accent}" stroke-width="3" opacity=".6"/>`);
      for (const [x, y] of [[70, 280], [128, 300], [86, 318], [116, 266], [62, 312]]) P(`<circle cx="${x}" cy="${y}" r="4" fill="${accent}" opacity=".55"/>`);
    }
    if (o.outfit === "farmer") {
      const kc = C(o.sash || "#b8323a");
      P(`<rect x="46" y="342" width="108" height="20" fill="${kc}"/>`);
      for (let x = 50; x < 154; x += 12) P(`<rect x="${x}" y="342" width="5" height="20" fill="${C("#f4e6cc")}" opacity=".45"/>`);
      P(`<rect x="46" y="349" width="108" height="5" fill="${C("#f4e6cc")}" opacity=".35"/>`);
    }
    if (o.outfit === "suit" || o.outfit === "lab") {
      const shirt = C(o.shirtUnder || o.accent || "#f4efe6");
      P(`<rect x="88" y="226" width="24" height="${bodyBot - 226}" fill="${shirt}"/>`);
      if (o.outfit === "suit") {
        P(`<path d="M46 222 L88 222 L100 268 L88 ${bodyBot} L46 ${bodyBot} Z" fill="${top}"/>`);
        P(`<path d="M154 222 L112 222 L100 268 L112 ${bodyBot} L154 ${bodyBot} Z" fill="${top2}"/>`);
        P(`<path d="M88 222 L100 262 L80 236 Z" fill="${C(mix(o.top || "#2b3142", "#000000", 0.2))}"/>`);
        P(`<path d="M112 222 L100 262 L120 236 Z" fill="${C(mix(o.top || "#2b3142", "#ffffff", 0.12))}"/>`);
      }
    }
    if (o.backpack) {
      const bc = C(o.packColor || "#6b4128");
      P(`<rect x="60" y="222" width="14" height="110" rx="5" fill="${bc}"/><rect x="126" y="222" width="14" height="110" rx="5" fill="${bc}"/>`);
      P(`<rect x="61" y="296" width="12" height="7" rx="2" fill="${C("#c9a36a")}"/><rect x="127" y="296" width="12" height="7" rx="2" fill="${C("#c9a36a")}"/>`);
    }
  } else if (o.backpack) {
    const bc = C(o.packColor || "#6b4128"), bc2 = C(mix(o.packColor || "#6b4128", "#000000", 0.3));
    P(`<rect x="58" y="236" width="84" height="122" rx="22" fill="${bc}"/>`);
    P(`<rect x="58" y="236" width="84" height="40" rx="18" fill="${bc2}"/>`);
    P(`<rect x="72" y="300" width="56" height="40" rx="10" fill="${bc2}"/><rect x="96" y="268" width="8" height="16" rx="3" fill="${C("#c9a36a")}"/>`);
  }
  P(`</g>`);
  if (!back && (o.outfit === "shirt" || o.outfit === "farmer" || o.outfit === "jacket")) {
    const col = o.outfit === "farmer" ? top2 : accent;
    P(`<path d="M80 222 L100 248 L92 258 L72 232 Z" fill="${col}"/><path d="M120 222 L100 248 L108 258 L128 232 Z" fill="${col}"/>`);
    P(`<path d="M86 222 L100 240 L114 222 Z" fill="${skin2}"/>`);
  }
  if (o.halter) P(`<path d="M84 226 Q100 244 116 226" fill="none" stroke="${C("#c8282f")}" stroke-width="7" stroke-linecap="round"/><circle cx="100" cy="238" r="6" fill="${C("#c8282f")}"/>`);

  // necktie (suit). Drawn only when o.necktie is set, so existing characters stay unchanged.
  if (!back && o.necktie) {
    const tc = C(typeof o.necktie === "string" ? o.necktie : "#8e1d24");
    P(`<path class="fp-necktie" d="M96 248 L104 248 L107 262 L100 268 L93 262 Z" fill="${tc}"/>`);
    P(`<path class="fp-necktie" d="M94 266 L106 266 L110 352 L100 368 L90 352 Z" fill="${tc}"/>`);
    P(`<path d="M96 268 L104 268 L106 352 L100 360 L94 352 Z" fill="${C(mix(typeof o.necktie === "string" ? o.necktie : "#8e1d24", "#000000", 0.25))}" opacity=".5"/>`);
  }

  // lanyard + ID badge
  if (!back && o.lanyard) {
    const lc = C(typeof o.lanyard === "string" && o.lanyard.startsWith("#") ? o.lanyard : (o.lanyardColor || "#c8282f"));
    P(`<path class="fp-lanyard" d="M86 228 Q74 300 92 328" fill="none" stroke="${lc}" stroke-width="4" stroke-linecap="round"/>`);
    P(`<path class="fp-lanyard" d="M114 228 Q126 300 108 328" fill="none" stroke="${lc}" stroke-width="4" stroke-linecap="round"/>`);
    P(`<rect x="86" y="326" width="28" height="36" rx="3" fill="${C("#f4efe6")}" stroke="${C("#2a1b17")}" stroke-width="1.5"/>`);
    P(`<rect x="90" y="330" width="20" height="14" rx="2" fill="${C("#9ec7e8")}"/>`);
    P(`<rect x="90" y="347" width="20" height="3" rx="1" fill="${C("#c8b8a8")}"/>`);
    P(`<rect x="90" y="353" width="14" height="3" rx="1" fill="${C("#c8b8a8")}"/>`);
  }

  // orange motorbike-taxi vest (front and back)
  if (o.vest) {
    const vc = C(o.vestColor || "#f26a1b"), vc2 = C(mix(o.vestColor || "#f26a1b", "#000000", 0.25));
    const refc = C("#f4f0d8");
    if (back) {
      P(`<path class="fp-vest" d="M58 226 L80 226 L84 250 L116 250 L120 226 L142 226 L146 360 L54 360 Z" fill="${vc}"/>`);
      P(`<path d="M70 250 L130 250 L126 360 L74 360 Z" fill="${vc2}" opacity=".35"/>`);
      P(`<path d="M64 300 L136 300" stroke="${refc}" stroke-width="7"/>`);
      P(`<path d="M64 318 L136 318" stroke="${refc}" stroke-width="4" opacity=".85"/>`);
    } else {
      P(`<path class="fp-vest" d="M58 226 L84 226 L92 262 L94 365 L60 365 L52 250 Z" fill="${vc}"/>`);
      P(`<path class="fp-vest" d="M142 226 L116 226 L108 262 L106 365 L140 365 L148 250 Z" fill="${vc2}"/>`);
      P(`<path d="M62 300 L90 300 M110 300 L138 300" stroke="${refc}" stroke-width="6"/>`);
      P(`<path d="M62 316 L90 316 M110 316 L138 316" stroke="${refc}" stroke-width="3.5" opacity=".85"/>`);
    }
  }

  // white lab coat over clothes
  if (!back && (o.labCoat || o.outfit === "lab")) {
    const coat = C(o.coatColor || "#f4f1ea"), coat2 = C(mix(o.coatColor || "#f4f1ea", "#000000", 0.12));
    P(`<path class="fp-labcoat" d="M50 222 L86 222 L96 250 L90 410 L48 400 L44 250 Z" fill="${coat}"/>`);
    P(`<path class="fp-labcoat" d="M150 222 L114 222 L104 250 L110 410 L152 400 L156 250 Z" fill="${coat2}"/>`);
    P(`<path d="M86 222 L100 255 L78 238 Z" fill="${C("#ffffff")}"/>`);
    P(`<path d="M114 222 L100 255 L122 238 Z" fill="${coat2}"/>`);
    P(`<rect x="58" y="320" width="26" height="28" rx="3" fill="${coat2}" opacity=".8"/>`);
    P(`<rect x="116" y="320" width="26" height="28" rx="3" fill="${C(mix(o.coatColor || "#f4f1ea", "#000000", 0.18))}" opacity=".8"/>`);
  }

  // head + hair + face
  P(`<g id="${id}-headGroup" class="fp-head">`);
  const hx = 100, hy = 148, hr = 64;
  if (!back) P(`<circle cx="37" cy="156" r="10" fill="${skin2}"/><circle cx="163" cy="156" r="10" fill="${skin2}"/>`);
  P(`<circle cx="${hx}" cy="${hy}" r="${hr}" fill="${skin}"/>`);
  const sh = rs > 0 ? -1 : 1;
  P(`<clipPath id="${id}-head"><circle cx="${hx}" cy="${hy}" r="${hr}"/></clipPath>`);
  P(`<circle cx="${hx + sh * hr * 1.45}" cy="${hy + 6}" r="${hr}" fill="${skin2}" opacity=".38" clip-path="url(#${id}-head)"/>`);

  const hair = o.hair || "short";
  P(`<g class="fp-hair" data-hair="${hair}">`);
  if (back) {
    P(`<circle cx="${hx}" cy="${hy - 2}" r="${hr + 2}" fill="${hairC}"/>`);
    if (hair === "bob") P(`<path d="M34 150 Q36 214 64 214 L136 214 Q164 214 166 150 Z" fill="${hairC}"/>`);
    if (hair === "long") P(`<path d="M32 150 Q26 250 62 258 L138 258 Q174 250 168 150 Z" fill="${hairC}"/>`);
    if (o.tie) P(`<rect x="134" y="104" width="20" height="9" rx="4" fill="${C(o.accent2 || "#c8282f")}" transform="rotate(28 144 108)"/>`);
    P(`<path d="M64 106 Q100 84 136 106" stroke="${hairHi}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`);
    if (hair === "pony") P(`<path d="M150 100 Q186 120 172 176 Q166 140 146 120 Z" fill="${hairC}"/><circle cx="152" cy="104" r="7" fill="${C(o.accent2 || "#c8282f")}"/>`);
    if (hair === "bun") P(`<circle cx="100" cy="78" r="26" fill="${hairC}"/>`);
  } else if (hair === "bob") {
    P(`<path d="M32 204 C24 126 50 80 100 80 C150 80 176 126 168 204 L150 206 C154 170 152 138 142 118 C122 136 86 140 58 116 C50 136 48 170 50 206 Z" fill="${hairC}"/>`);
    P(`<path d="M58 116 C86 140 122 136 142 118 C130 100 116 96 100 96 C80 96 66 102 58 116 Z" fill="${hairC}"/>`);
    P(`<path d="M60 96 Q96 78 134 92" stroke="${hairHi}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`);
    if (o.tie) P(`<rect x="134" y="108" width="20" height="9" rx="4" fill="${C(o.accent2 || "#c8282f")}" transform="rotate(-28 144 112)"/>`);
  } else if (hair === "long") {
    P(`<path d="M28 248 C18 150 50 78 100 78 C150 78 182 150 172 248 L154 250 C160 180 154 130 142 114 C122 136 86 140 58 114 C46 132 40 180 46 250 Z" fill="${hairC}"/>`);
    P(`<path d="M58 116 C86 140 122 136 142 118 C130 100 116 96 100 96 C80 96 66 102 58 116 Z" fill="${hairC}"/>`);
    P(`<path d="M60 96 Q96 78 134 92" stroke="${hairHi}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`);
    if (o.tie) P(`<rect x="134" y="108" width="20" height="9" rx="4" fill="${C(o.accent2 || "#c8282f")}" transform="rotate(-28 144 112)"/>`);
  } else if (hair === "short" || hair === "pony") {
    P(`<path d="M36 156 C30 104 60 80 100 80 C142 80 170 104 164 156 C158 134 150 120 140 112 C118 124 82 124 60 110 C50 122 42 136 36 156 Z" fill="${hairC}"/>`);
    P(`<path d="M62 94 Q98 78 136 92" stroke="${hairHi}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>`);
    if (o.greyTemples) P(`<path d="M37 150 C36 136 40 126 46 118 L50 128 C44 136 42 144 41 154 Z" fill="${C("#a59d96")}"/><path d="M163 150 C164 136 160 126 154 118 L150 128 C156 136 158 144 159 154 Z" fill="${C("#a59d96")}"/>`);
    if (hair === "pony") P(`<path d="M150 100 Q186 120 172 176 Q166 140 146 120 Z" fill="${hairC}"/><circle cx="152" cy="104" r="7" fill="${C(o.accent2 || "#c8282f")}"/>`);
  } else if (hair === "bun") {
    P(`<circle cx="100" cy="78" r="26" fill="${hairC}"/><path d="M84 70 Q100 60 116 70" stroke="${hairHi}" stroke-width="4" fill="none" opacity=".7"/>`);
    P(`<path d="M38 150 C34 104 62 84 100 84 C140 84 166 104 162 150 C156 132 146 118 130 112 C112 118 88 118 70 112 C54 118 44 132 38 150 Z" fill="${hairC}"/>`);
    P(`<path d="M66 100 Q100 88 134 100" stroke="${hairHi}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>`);
  }
  P(`</g>`);

  // keffiyeh + agal (opt-in)
  if (o.keffiyeh) {
    const k1 = C(o.keffiyehColor || "#f4efe6"), k2 = C(o.keffiyehAccent || "#2a1b17");
    if (back) {
      P(`<path class="fp-keffiyeh" d="M34 150 C28 110 56 78 100 76 C144 78 172 110 166 150 L168 200 Q100 220 32 200 Z" fill="${k1}"/>`);
      for (let i = 0; i < 6; i++) P(`<path d="M${40+i*20} 100 Q100 90 ${160-i*20} 130" stroke="${k2}" stroke-width="2.2" fill="none" opacity=".35"/>`);
    } else {
      P(`<path class="fp-keffiyeh" d="M32 168 C24 110 52 76 100 74 C148 76 176 110 168 168 L158 150 C150 112 130 96 100 96 C70 96 50 112 42 150 Z" fill="${k1}"/>`);
      P(`<path d="M32 168 L26 250 L50 256 L54 180 Q42 170 38 156 Z" fill="${k1}"/>`);
      P(`<path d="M168 168 L174 250 L150 256 L146 180 Q158 170 162 156 Z" fill="${k1}"/>`);
      for (let i = 0; i < 5; i++) P(`<path d="M${48+i*8} ${100+i*8} L${70+i*10} ${118+i*6}" stroke="${k2}" stroke-width="2" opacity=".3"/>`);
      for (let i = 0; i < 5; i++) P(`<path d="M${152-i*8} ${100+i*8} L${130-i*10} ${118+i*6}" stroke="${k2}" stroke-width="2" opacity=".3"/>`);
    }
    P(`<ellipse cx="100" cy="92" rx="58" ry="12" fill="${C("#1a1410")}"/>`);
    P(`<ellipse cx="100" cy="86" rx="56" ry="8" fill="${C("#2a2420")}"/>`);
  }

  if (!back) {
    P(`<g class="fp-face">`);
    P(`<ellipse cx="66" cy="178" rx="11" ry="6.5" fill="${cheek}" opacity=".6"/><ellipse cx="134" cy="178" rx="11" ry="6.5" fill="${cheek}" opacity=".6"/>`);
    P(`<g id="${id}-eyes" class="fp-eyes" data-blink="${o.blink ? "on" : "off"}"><circle cx="78" cy="160" r="6.5" fill="${ink}"/><circle cx="122" cy="160" r="6.5" fill="${ink}"/>` +
      `<circle cx="80.2" cy="157.6" r="2.1" fill="#fff"/><circle cx="124.2" cy="157.6" r="2.1" fill="#fff"/></g>`);
    if (o.wrinkles) P(`<path d="M68 170 Q74 173 80 170 M120 170 Q126 173 132 170" stroke="${skin2}" stroke-width="2" fill="none" opacity=".9"/><path d="M80 120 Q100 116 120 120" stroke="${skin2}" stroke-width="2" fill="none" opacity=".7"/>`);
    if (o.glasses) {
      const gc = C(o.glassesColor || "#2a1b17");
      P(`<g class="fp-glasses">`);
      P(`<rect x="60" y="150" width="36" height="26" rx="8" fill="${C("#cfe8f4")}" fill-opacity=".28" stroke="${gc}" stroke-width="3.2"/>`);
      P(`<rect x="104" y="150" width="36" height="26" rx="8" fill="${C("#cfe8f4")}" fill-opacity=".28" stroke="${gc}" stroke-width="3.2"/>`);
      P(`<path d="M96 162 L104 162" stroke="${gc}" stroke-width="3" stroke-linecap="round"/>`);
      P(`<path d="M60 160 L48 154 M140 160 L152 154" stroke="${gc}" stroke-width="3" stroke-linecap="round"/>`);
      P(`</g>`);
    }
    if (o.mustache) P(`<path class="fp-mustache" d="M86 178 Q93 172 100 177 Q107 172 114 178 Q107 182 100 180 Q93 182 86 178 Z" fill="${hairC}"/>`);
    (o.expressions || ["neutral"]).forEach((name, i) => {
      const e = EXP[name] || EXP.neutral;
      P(`<g id="${id}-exp-${name}" class="${id}-exp fp-exp"${i ? ' opacity="0"' : ""}>`);
      e.brows.forEach((d) => P(`<path d="${d}" stroke="${ink}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`));
      if (e.mouth.o) { const [x, y, rx, ry] = e.mouth.o; P(`<ellipse cx="${x}" cy="${y + (o.mustache ? 4 : 0)}" rx="${rx}" ry="${ry}" fill="${C("#6b2420")}"/>`); }
      else P(`<path d="${e.mouth.d}" stroke="${C("#7a2a24")}" stroke-width="4" stroke-linecap="round" fill="none"${o.mustache ? ' transform="translate(0 4)"' : ""}/>`);
      P(`</g>`);
    });
    P(`</g>`);
  }

  // helmet (opt-in) — on top of hair / keffiyeh
  if (o.helmet) {
    const kind = o.helmet === "officer" ? "officer" : "moto";
    const hc = C(o.helmetColor || (kind === "officer" ? "#2c3a4a" : "#d4542a"));
    const hc2 = C(mix(o.helmetColor || (kind === "officer" ? "#2c3a4a" : "#d4542a"), "#000000", 0.25));
    const vis = C("#9ad4ea");
    if (back) {
      P(`<ellipse cx="100" cy="132" rx="70" ry="62" fill="${hc}"/>`);
      P(`<path d="M32 140 Q100 200 168 140 L168 170 Q100 230 32 170 Z" fill="${hc}"/>`);
      P(`<path d="M44 110 Q100 88 156 110" stroke="${C("#ffffff")}" stroke-width="5" fill="none" opacity=".25"/>`);
    } else if (kind === "officer") {
      P(`<path class="fp-helmet" d="M36 150 C32 100 58 78 100 76 C142 78 168 100 164 150 L158 148 C150 110 130 96 100 96 C70 96 50 110 42 148 Z" fill="${hc}"/>`);
      P(`<path d="M34 148 L166 148 L162 158 L38 158 Z" fill="${hc2}"/>`);
      P(`<rect x="30" y="148" width="140" height="10" rx="3" fill="${hc2}"/>`);
      P(`<path d="M56 100 Q100 86 144 100" stroke="${C("#ffffff")}" stroke-width="4" fill="none" opacity=".3"/>`);
      if (o.helmetBadge) P(`<ellipse cx="100" cy="118" rx="10" ry="12" fill="${C("#d8a64a")}"/>`);
    } else {
      P(`<path class="fp-helmet" d="M30 158 C24 100 56 70 100 68 C144 70 176 100 170 158 L160 152 C152 108 130 90 100 90 C70 90 48 108 40 152 Z" fill="${hc}"/>`);
      P(`<path d="M36 156 Q100 188 164 156 L158 168 Q100 198 42 168 Z" fill="${hc2}"/>`);
      P(`<path d="M48 150 Q100 168 152 150" fill="${vis}" opacity=".35"/>`);
      P(`<path d="M52 100 Q100 84 148 100" stroke="${C("#ffffff")}" stroke-width="5" fill="none" opacity=".28"/>`);
      P(`<path d="M44 168 Q36 200 48 214" fill="none" stroke="${hc2}" stroke-width="6" stroke-linecap="round"/>`);
      P(`<path d="M156 168 Q164 200 152 214" fill="none" stroke="${hc2}" stroke-width="6" stroke-linecap="round"/>`);
    }
  }
  P(`</g>`); // headGroup

  if (rim) {
    const x0 = rs > 0 ? 1 : 0;
    const a0 = -60 * Math.PI / 180, a1 = 50 * Math.PI / 180;
    const p = (a) => [hx + rs * Math.cos(a) * (hr - 1.5), hy + Math.sin(a) * (hr - 1.5)];
    const [ax, ay] = p(a0), [bx, by] = p(a1);
    P(`<path class="fp-rim" d="M${ax.toFixed(1)} ${ay.toFixed(1)} A${hr - 1.5} ${hr - 1.5} 0 0 ${x0} ${bx.toFixed(1)} ${by.toFixed(1)}" stroke="${rim}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/>`);
    const ex = rs > 0 ? 151 : 49;
    P(`<path class="fp-rim" d="M${ex} 246 L${ex} ${bodyBot - 22}" stroke="${rim}" stroke-width="4" stroke-linecap="round" opacity=".55" clip-path="url(#${id}-torso)"/>`);
  }

  // held props, drawn on top so phones / megaphones sit in front of the body
  const holdItem = (name, sh, hd, kind) => {
    if (!kind) return;
    const x = hd[0], y = hd[1];
    const dir = name === "L" ? -1 : 1;
    P(`<g id="${id}-hold${name}" class="fp-hold fp-hold-${String(kind)}" data-pivot="${sh[0]} ${sh[1]}">`);
    const k = String(kind);
    if (k === "phone") {
      P(`<g transform="translate(${x.toFixed(1)} ${(y+4).toFixed(1)}) rotate(${dir*18})">`);
      P(`<rect x="-11" y="-28" width="22" height="40" rx="4" fill="${C("#1c1c22")}"/>`);
      P(`<rect x="-8" y="-24" width="16" height="30" rx="2" fill="${C("#7ec8ff")}"/>`);
      P(`<circle cx="0" cy="10" r="2.2" fill="${C("#666")}"/>`);
      P(`</g>`);
    } else if (k === "selfie" || k === "selfiestick" || k === "selfieStick") {
      P(`<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${(x+dir*18).toFixed(1)} ${(y-118).toFixed(1)}" stroke="${C("#2a2a32")}" stroke-width="5" stroke-linecap="round"/>`);
      P(`<g transform="translate(${(x+dir*18).toFixed(1)} ${(y-130).toFixed(1)}) rotate(${dir*-12})">`);
      P(`<rect x="-16" y="-28" width="32" height="52" rx="6" fill="${C("#1c1c22")}"/>`);
      P(`<rect x="-12" y="-23" width="24" height="40" rx="3" fill="${C("#7ec8ff")}"/>`);
      P(`<circle cx="0" cy="20" r="2.4" fill="${C("#888")}"/>`);
      P(`</g>`);
    } else if (k === "megaphone") {
      const tipX = x - dir*8, tipY = y - 4;
      P(`<g transform="translate(${tipX.toFixed(1)} ${tipY.toFixed(1)})">`);
      P(`<path d="M${dir*6} -8 L${dir*6} 10 L${dir*54} 22 L${dir*54} -20 Z" fill="${C("#d4a017")}"/>`);
      P(`<path d="M${dir*54} -20 L${dir*66} -28 L${dir*66} 30 L${dir*54} 22 Z" fill="${C("#c8282f")}"/>`);
      P(`<rect x="${dir>0? -6: -10}" y="8" width="16" height="20" rx="3" fill="${C("#2a1b17")}"/>`);
      P(`<circle cx="${dir*18}" cy="0" r="5" fill="${C("#f4efe6")}"/>`);
      P(`</g>`);
    } else if (k === "gallon" || k === "jerrycan") {
      P(`<g transform="translate(${x.toFixed(1)} ${(y+8).toFixed(1)})">`);
      P(`<rect x="${dir*2}" y="-8" width="40" height="52" rx="5" fill="${C("#d4542a")}"/>`);
      P(`<rect x="${dir*2+4}" y="-2" width="32" height="20" rx="2" fill="${C("#8a2a12")}" opacity=".35"/>`);
      P(`<rect x="${dir*2+14}" y="-16" width="14" height="10" rx="2" fill="${C("#2a1b17")}"/>`);
      P(`<path d="M${dir*2+8} -8 Q${dir*2+8} -22 ${dir*2+20} -22 Q${dir*2+32} -22 ${dir*2+32} -8" fill="none" stroke="${C("#2a1b17")}" stroke-width="4"/>`);
      P(`</g>`);
    } else if (k === "bottle") {
      P(`<g transform="translate(${x.toFixed(1)} ${(y+4).toFixed(1)}) rotate(${dir*8})">`);
      P(`<rect x="-8" y="-6" width="16" height="36" rx="4" fill="${C("#c8282f")}"/>`);
      P(`<rect x="-6" y="-18" width="12" height="14" rx="3" fill="${C("#f4efe6")}"/>`);
      P(`<rect x="-4" y="-24" width="8" height="8" rx="2" fill="${C("#2a1b17")}"/>`);
      P(`<rect x="-6" y="4" width="12" height="10" fill="${C("#0a0a0c")}" opacity=".7"/>`);
      P(`</g>`);
    } else if (k === "bag" || k === "curryBag") {
      P(`<g transform="translate(${x.toFixed(1)} ${(y+6).toFixed(1)})">`);
      P(`<path d="M-16 0 L-20 44 Q0 52 20 44 L16 0 Z" fill="${C("#4aa06a")}" opacity=".8"/>`);
      P(`<path d="M-14 8 L-16 36 Q0 42 16 36 L14 8 Z" fill="${C("#0a0a0c")}" opacity=".75"/>`);
      P(`<path d="M-16 0 Q0 -8 16 0" fill="none" stroke="${C("#2a1b17")}" stroke-width="3"/>`);
      P(`<path d="M-8 0 Q-14 -22 0 -22" fill="none" stroke="${C("#f4efe6")}" stroke-width="3"/>`);
      P(`<path d="M8 0 Q14 -22 0 -22" fill="none" stroke="${C("#f4efe6")}" stroke-width="3"/>`);
      P(`</g>`);
    } else if (k === "briefcase") {
      P(`<g transform="translate(${x.toFixed(1)} ${(y+10).toFixed(1)})">`);
      P(`<rect x="-4" y="-6" width="54" height="38" rx="4" fill="${C("#4a2c22")}"/>`);
      P(`<rect x="-4" y="10" width="54" height="4" fill="${C("#2a1810")}"/>`);
      P(`<rect x="16" y="-14" width="14" height="10" rx="2" fill="${C("#d8a64a")}"/>`);
      P(`</g>`);
    } else if (k === "incense") {
      P(`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">`);
      P(`<path d="M0 0 L-4 -70" stroke="${C("#c9a36a")}" stroke-width="2.4" stroke-linecap="round"/>`);
      P(`<path d="M0 0 L2 -74" stroke="${C("#e8d5a8")}" stroke-width="2.4" stroke-linecap="round"/>`);
      P(`<path d="M0 0 L8 -68" stroke="${C("#c9a36a")}" stroke-width="2.4" stroke-linecap="round"/>`);
      P(`<circle cx="-4" cy="-70" r="2.2" fill="${C("#e0464c")}"/>`);
      P(`<circle cx="2" cy="-74" r="2.2" fill="${C("#e0464c")}"/>`);
      P(`<circle cx="8" cy="-68" r="2.2" fill="${C("#e0464c")}"/>`);
      P(`</g>`);
    } else if (k === "stick" || k === "pointer") {
      P(`<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${(x+dir*70).toFixed(1)} ${(y-90).toFixed(1)}" stroke="${C("#4a2c22")}" stroke-width="4" stroke-linecap="round"/>`);
    }
    P(`</g>`);
  };
  holdItem("L", shL, hL, o.holdL);
  holdItem("R", shR, hR, o.holdR);

  P(`</g>`); // root

  let svg = out.join("\n");
  if (scale !== 1) {
    svg = `<g class="fp-scale" transform="translate(100 520) scale(${scale}) translate(-100 -520)">${svg}</g>`;
  }

  return {
    svg,
    id,
    hands: { L: hL, R: hR },
    waist: [100, 330],
    pivots: { armL: shL, armR: shR },
  };
}

/** Legacy / low-level builder. Does not apply male/female colour defaults, so existing tame-demo configs stay pixel-faithful. */
export function character(o = {}) {
  return draw(normalize(o, { applyGenderDefaults: false }));
}

/** Recommended API. `createPerson({ gender: "female" })` or `{ gender: "male" }` is enough to get a finished figure. */
export function createPerson(o = {}) {
  return draw(normalize(o, { applyGenderDefaults: true }));
}

export function createMale(o = {}) {
  return createPerson({ ...o, gender: "male" });
}

export function createFemale(o = {}) {
  return createPerson({ ...o, gender: "female" });
}

/** Wrap inner markup in a standalone <svg> document string. */
export function toSvgDocument(optsOrResult = {}, extra = {}) {
  const r = optsOrResult && typeof optsOrResult.svg === "string"
    ? optsOrResult
    : createPerson(optsOrResult);
  const opt = (optsOrResult && optsOrResult.svg) ? extra : { ...optsOrResult, ...extra };
  const scale = opt.scale ?? 1;
  const w = opt.width ?? Math.round(FRAME.width * scale);
  const h = opt.height ?? Math.round(FRAME.height * scale);
  const bg = opt.background ? `<rect width="200" height="530" fill="${opt.background}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 530" width="${w}" height="${h}" overflow="visible">${bg}${r.svg}</svg>`;
}

/** Mount a person into a DOM element (browser). Accepts a node or CSS selector. Returns the same object as createPerson, plus `el`. */
export function mountPerson(el, opts = {}) {
  const person = createPerson(opts);
  const node = typeof el === "string" ? document.querySelector(el) : el;
  if (!node) throw new Error("mountPerson: element not found");
  const markup = opts.wrap === false ? person.svg : toSvgDocument(person, opts);
  if (opts.append) node.insertAdjacentHTML("beforeend", markup);
  else node.innerHTML = markup;
  return { ...person, el: node };
}

/** TAME demo character presets (ขวัญ, น้ายศ, ยายอ่าง, villagers). */
export const presets = {
  khwan: {
    gender: "female",
    hair: "bob",
    hairClip: true,
    outfit: "shirt",
    backpack: true,
    shirtColor: "#e0b04a",
    pantsColor: "#2c3550",
    shoeColor: "#4a2c22",
    accent: "#f7efe2",
  },
  yot: {
    gender: "male",
    hair: "short",
    greyTemples: true,
    mustache: true,
    outfit: "farmer",
    shirtColor: "#33406b",
    pantsColor: "#1f1a18",
    sash: "#b8323a",
  },
  ang: {
    gender: "female",
    hair: "bun",
    hairColor: "#b9b2ab",
    wrinkles: true,
    outfit: "blouse",
    shirtColor: "#e9dcc4",
    top2: "#c9b89c",
    accent: "#b8323a",
    skirt: true,
    skirtColor: "#5a2340",
    skirtBand: "#d8a64a",
  },
  villagerMale: {
    gender: "male",
    hair: "short",
    outfit: "jacket",
    shirtColor: "#5b6b4a",
    pantsColor: "#2b2622",
    halter: true,
  },
  villagerFemale: {
    gender: "female",
    hair: "pony",
    outfit: "shirt",
    shirtColor: "#4b5d63",
    accent: "#e8dccb",
    skirt: true,
    skirtColor: "#4a2a1e",
    skirtBand: "#b8863a",
    halter: true,
  },
  officeMale: {
    gender: "male",
    hair: "short",
    outfit: "suit",
    shirtColor: "#2b3a55",
    pantsColor: "#1c2433",
    accent: "#f4efe6",
    necktie: "#8e1d24",
    lanyard: "#c8282f",
    shoeColor: "#1a1410",
  },
  officeFemale: {
    gender: "female",
    hair: "bob",
    outfit: "suit",
    shirtColor: "#3a2c4a",
    pantsColor: "#2a1f33",
    accent: "#f4efe6",
    necktie: "#c8282f",
    lanyard: "#2b6ea8",
    shoeColor: "#1a1410",
  },
  influencer: {
    gender: "female",
    hair: "long",
    outfit: "shirt",
    shirtColor: "#e07a9a",
    pantsColor: "#2c2038",
    shoeColor: "#f2d4a0",
    holdR: "selfie",
  },
  winMale: {
    gender: "male",
    hair: "short",
    outfit: "shirt",
    shirtColor: "#2b3142",
    pantsColor: "#1a1a20",
    vest: true,
    vestColor: "#f26a1b",
    helmet: "moto",
    helmetColor: "#d4542a",
    holdR: "gallon",
  },
  officer: {
    gender: "male",
    hair: "short",
    outfit: "shirt",
    shirtColor: "#3d4a3a",
    pantsColor: "#2a3228",
    helmet: "officer",
    helmetColor: "#2c3a4a",
    helmetBadge: true,
    holdR: "megaphone",
    shoeColor: "#1a1410",
  },
  auntie: {
    gender: "female",
    hair: "bun",
    hairColor: "#6a6058",
    wrinkles: true,
    outfit: "blouse",
    shirtColor: "#e8d5c4",
    top2: "#c9b89c",
    accent: "#c45c6a",
    skirt: true,
    skirtColor: "#6b2a3a",
    skirtBand: "#d8a64a",
    holdR: "incense",
  },
  geologist: {
    gender: "male",
    hair: "short",
    outfit: "shirt",
    shirtColor: "#3a5a7a",
    pantsColor: "#2b3142",
    labCoat: true,
    glasses: true,
    holdR: "pointer",
  },
  businessGulf: {
    gender: "male",
    hair: "short",
    outfit: "kandura",
    shirtColor: "#f4efe6",
    pantsColor: "#e8e0d4",
    keffiyeh: true,
    keffiyehColor: "#f4efe6",
    keffiyehAccent: "#8e1d24",
    holdL: "briefcase",
    shoeColor: "#1a1410",
  },
  vendorFemale: {
    gender: "female",
    hair: "pony",
    outfit: "shirt",
    shirtColor: "#e8893a",
    pantsColor: "#3d2a20",
    apron: false,
    skirt: true,
    skirtColor: "#2c3550",
    skirtBand: "#e0b04a",
  },
  touristFemale: {
    gender: "female",
    hair: "bob",
    outfit: "shirt",
    shirtColor: "#5bb3c9",
    pantsColor: "#f4efe6",
    holdR: "phone",
    shoeColor: "#e07a9a",
  },
  touristMale: {
    gender: "male",
    hair: "short",
    outfit: "shirt",
    shirtColor: "#f0c14a",
    pantsColor: "#2b4a6a",
    holdR: "phone",
    backpack: true,
    packColor: "#4a2c22",
  },
};

// Thai aliases for bang-dubai presets
presets["พนักงานชาย"] = presets.officeMale;
presets["พนักงานหญิง"] = presets.officeFemale;
presets["อินฟลู"] = presets.influencer;
presets["วิน"] = presets.winMale;
presets["เจ้าหน้าที่"] = presets.officer;
presets["คุณป้า"] = presets.auntie;
presets["นักธรณี"] = presets.geologist;
presets["นักธุรกิจ"] = presets.businessGulf;


presets["ขวัญ"] = presets.khwan;
presets["น้ายศ"] = presets.yot;
presets["ยายอ่าง"] = presets.ang;

export default createPerson;
