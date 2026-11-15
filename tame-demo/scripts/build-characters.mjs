// Injects the shared flat-people characters into the TAME scene compositions,
// between <!-- char:NAME:start --> and <!-- char:NAME:end --> markers.
// Run: node scripts/build-characters.mjs   (re-run after editing a character's options)
import { readFileSync, writeFileSync } from "node:fs";
import { character, presets } from "../../shared/flat-people/index.mjs";

const { khwan: KHWAN, yot: YOT, ang: ANG, villagerMale, villagerFemale } = presets;

const chars = {
  "compositions/bind.html": {
    "bind-khwan": { ...KHWAN, id: "bdk", armL: 6, armR: 6, expressions: ["neutral", "worried", "shocked"], tint: "#ffe6c8", tintAmt: 0.06, rim: "#fff1dc", rimSide: "left" },
    "bind-yot": { ...YOT, id: "bdy", armR: 62, expressions: ["angry"], tint: "#2a1110", tintAmt: 0.22, dark: 0.3, rim: "#e0464c", rimSide: "right" },
    "bind-ang": { ...ANG, id: "bda", armR: 55, expressions: ["fierce"], tint: "#2a1110", tintAmt: 0.22, dark: 0.3, rim: "#e0464c", rimSide: "right" },
  },
  "compositions/road.html": {
    "road-khwan": { ...KHWAN, id: "rdk", view: "back", armL: 6, armR: 6, tint: "#4a5a8a", tintAmt: 0.18, dark: 0.12, rim: "#ffd9a8", rimSide: "left" },
  },
  "compositions/turn.html": {
    "turn-khwan": { ...KHWAN, id: "tnk", armL: 18, armR: 18, expressions: ["worried", "fierce"], tint: "#ff3b30", tintAmt: 0.12, rim: "#ff7a5a", rimSide: "right" },
    "turn-v1": { ...villagerMale, id: "tv1", expressions: ["shocked"], tint: "#3a0d10", tintAmt: 0.25, dark: 0.28, rim: "#ff4a3a", rimSide: "right" },
    "turn-v2": { ...villagerFemale, id: "tv2", expressions: ["worried"], tint: "#3a0d10", tintAmt: 0.25, dark: 0.28, rim: "#ff4a3a", rimSide: "left" },
  },
};

for (const [file, set] of Object.entries(chars)) {
  let html = readFileSync(file, "utf8");
  for (const [name, opts] of Object.entries(set)) {
    const re = new RegExp(`(<!-- char:${name}:start -->)[\\s\\S]*?(<!-- char:${name}:end -->)`);
    if (!re.test(html)) throw new Error(`marker char:${name} missing in ${file}`);
    const { svg, hands } = character(opts);
    html = html.replace(re, `$1\n${svg}\n$2`);
    console.log(file, name, "hands", JSON.stringify(hands));
  }
  writeFileSync(file, html);
}
