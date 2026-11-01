// Bake every scene's basemap, one at a time: node scripts/bake-all.mjs [sceneId...]
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { REGIONS, SCENES } from "./scenes.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "assets", "maps");
const only = process.argv.slice(2);
const countries = Object.values(REGIONS)
  .flatMap((r) => r.countries.map((c) => `${c}:${r.color}`))
  .join(",");

for (const s of SCENES) {
  if (only.length && !only.includes(s.id)) continue;
  const env = {
    ...process.env,
    NAME: s.id,
    STYLE: "satellite",
    W: "1080",
    H: "1920",
    FPS: "30",
    DUR: String(s.dur),
    HOLD: String(s.hold),
    CENTER: s.center.join(","),
    ZSTART: String(s.zstart),
    ZEND: String(s.zend),
    COUNTRIES: countries,
    OUT: out,
  };
  if (s.from) {
    env.FROM = s.from.join(",");
    env.PAN = String(s.hold * 0.9);
  }
  const r = spawnSync(process.execPath, [join(here, "bake-basemap.mjs")], { env, stdio: "inherit" });
  if (r.status !== 0) console.error(`[${s.id}] bake exited ${r.status}`);
}
