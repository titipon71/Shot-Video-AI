// Bake each scene's basemap for one video config, one at a time. A scene whose camera, size and
// countries are unchanged since its last bake is skipped (force re-bakes everything).
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mapsDir } from "./lib/config.mjs";

const here = dirname(fileURLToPath(import.meta.url));

export function bakeParams(cfg, s) {
  const countries = Object.values(cfg.regions)
    .flatMap((r) => r.countries.map((c) => `${c}:${r.color}`))
    .join(",");
  const cam = s.camera;
  const env = {
    NAME: s.id,
    STYLE: cfg.style,
    W: String(cfg.width),
    H: String(cfg.height),
    FPS: String(cfg.fps),
    DUR: String(s.dur),
    HOLD: String(s.hold),
    CENTER: cam.center.join(","),
    ZSTART: String(cam.zstart),
    ZEND: String(cam.zoom),
    COUNTRIES: countries,
  };
  if (cam.from) {
    env.FROM = cam.from.join(",");
    env.PAN = String(+(s.hold * 0.9).toFixed(4));
  }
  return env;
}

// paramsOf builds the bake env for a scene. holdImage also writes <scene>-hold.jpg (the held view),
// for videos that bake only the camera move and show a still for the rest of the scene.
export function bakeAll(root, cfg, { force = false, only = [], paramsOf = bakeParams, holdImage = false } = {}) {
  const out = mapsDir(root, cfg);
  mkdirSync(out, { recursive: true });
  const failed = [];
  for (const s of cfg.scenes) {
    if (only.length && !only.includes(s.id)) continue;
    const params = paramsOf(cfg, s);
    const stamp = join(out, `${s.id}-params.json`);
    const hold = join(out, `${s.id}-hold.jpg`);
    const fresh =
      existsSync(join(out, `${s.id}.mp4`)) &&
      existsSync(join(out, `${s.id}-coords.json`)) &&
      (!holdImage || existsSync(hold)) &&
      existsSync(stamp) &&
      readFileSync(stamp, "utf8") === JSON.stringify(params);
    if (fresh && !force) {
      console.log(`[${s.id}] unchanged, skipping bake`);
      continue;
    }
    const r = spawnSync(process.execPath, [join(here, "bake-basemap.mjs")], {
      env: { ...process.env, ...params, OUT: out },
      stdio: "inherit",
    });
    if (r.status === 0 && holdImage) {
      const frames = join(out, `frames-${s.id}`);
      const last = readdirSync(frames).filter((f) => f.endsWith(".png")).sort().at(-1);
      const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", join(frames, last), "-q:v", "2", hold], { stdio: "inherit" });
      if (ff.status !== 0) {
        failed.push(s.id);
        continue;
      }
    }
    if (r.status === 0) writeFileSync(stamp, JSON.stringify(params));
    else failed.push(s.id);
  }
  if (failed.length) throw new Error(`bake failed for: ${failed.join(", ")}`);
}
