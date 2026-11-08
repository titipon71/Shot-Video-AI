// Load a video config (videos/<id>.json), check it, and fill in everything it leaves out:
// camera framing from the countries' bounds, camera starts from the previous scene, hold points.
import { readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { loadAtlas, boundsOf, suggest } from "./atlas.mjs";

const TYPES = ["intro", "region", "outro"];

export async function loadConfig(root, path) {
  const cfg = JSON.parse(readFileSync(path, "utf8"));
  cfg.id ??= basename(path, ".json");
  cfg.width ??= 1080;
  cfg.height ??= 1920;
  cfg.fps ??= 30;
  cfg.style ??= "satellite";
  cfg.credit ??= cfg.style === "satellite" ? "Imagery: Esri, Maxar, Earthstar Geographics" : "© CARTO, © OpenStreetMap";

  const errors = [];
  if (!/^[a-z0-9-]+$/.test(cfg.id)) errors.push(`id "${cfg.id}" may use only a-z, 0-9 and -`);
  const regions = cfg.regions ?? {};
  if (!Object.keys(regions).length) errors.push("regions is empty");
  const atlas = await loadAtlas(root);
  const seen = new Map();
  for (const [key, r] of Object.entries(regions)) {
    if (!r.label) errors.push(`regions.${key}.label is missing`);
    if (!/^#[0-9a-fA-F]{6}$/.test(r.color ?? "")) errors.push(`regions.${key}.color must be #RRGGBB`);
    for (const c of r.countries ?? []) {
      if (!atlas.has(c)) {
        const near = suggest(atlas, c);
        errors.push(`regions.${key}: "${c}" is not in world-atlas${near.length ? ` (did you mean ${near.slice(0, 4).map((n) => `"${n}"`).join(", ")}?)` : ""}`);
      }
      if (seen.has(c)) errors.push(`"${c}" is in both ${seen.get(c)} and ${key}`);
      seen.set(c, key);
    }
    if (!r.countries?.length) errors.push(`regions.${key}.countries is empty`);
  }

  const scenes = cfg.scenes ?? [];
  if (!scenes.length) errors.push("scenes is empty");
  const ids = new Set();
  scenes.forEach((s, i) => {
    const at = `scenes[${i}]${s.id ? ` (${s.id})` : ""}`;
    s.type ??= i === 0 ? "intro" : i === scenes.length - 1 && !s.reveal ? "outro" : "region";
    if (!TYPES.includes(s.type)) errors.push(`${at}.type must be one of ${TYPES.join(", ")}`);
    if (!/^[a-z0-9-]+$/.test(s.id ?? "")) errors.push(`${at}.id is required (a-z, 0-9, -)`);
    if (ids.has(s.id)) errors.push(`${at}.id is used twice`);
    ids.add(s.id);
    if (s.reveal && !regions[s.reveal]) errors.push(`${at}.reveal "${s.reveal}" is not a region`);
    if (s.type === "region" && !s.reveal) errors.push(`${at} is a region scene but has no reveal`);
    if (!Array.isArray(s.lines) || s.lines.length !== 2) errors.push(`${at}.lines must be two caption lines`);
    if (!(s.dur > 0)) errors.push(`${at}.dur must be a positive number of seconds`);
  });
  if (errors.length) throw new Error(`${path}:\n  - ${errors.join("\n  - ")}`);

  // Camera: held view from the config or framed on the revealed region (all regions for intro/outro);
  // each move starts where the previous scene held.
  const all = Object.values(regions).flatMap((r) => r.countries);
  let prev = null;
  for (const s of scenes) {
    const cam = (s.camera ??= {});
    if (!cam.center || cam.zoom == null) {
      const fit = frame(boundsOf(atlas, s.type === "region" ? regions[s.reveal].countries : all), cfg, cam.fill);
      cam.center ??= fit.center;
      cam.zoom ??= fit.zoom;
    }
    cam.zstart ??= prev ? prev.zoom : +(cam.zoom - 0.25).toFixed(2);
    if (prev && !cam.from) cam.from = prev.center;
    cam.move ??= 1.5;
    if (cam.move >= s.dur - 1) throw new Error(`${path}: scenes ${s.id}: camera.move (${cam.move}s) leaves under 1s of hold in a ${s.dur}s scene`);
    s.hold = +(cam.move / s.dur).toFixed(4);
    prev = cam;
  }
  cfg.regions = regions;
  cfg.scenes = scenes;
  return cfg;
}

// Mercator framing: fit the box inside the frame's text-safe band and place it a little above centre,
// leaving the lower part of the band for captions.
export function frame(b, cfg, fill = 0.78) {
  const W = cfg.width, H = cfg.height;
  const my = (lat) => (1 - Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) / Math.PI) / 2; // 0..1, north = 0
  const lonSpan = Math.max(b.east - b.west, 1);
  const ySpan = Math.max(my(b.south) - my(b.north), 0.002);
  const fitH = H > W ? H * 0.5 : H * 0.62;
  const zoom = Math.min(Math.log2((W * fill * 360) / (512 * lonSpan)), Math.log2(fitH / (512 * ySpan)));
  const z = Math.min(8, Math.max(1.6, +zoom.toFixed(2)));
  const world = 512 * 2 ** z;
  const targetY = H > W ? H * 0.4 : H * 0.45; // where the subject's middle lands
  const cy = (my(b.south) + my(b.north)) / 2 + (H / 2 - targetY) / world;
  const lat = (Math.atan(Math.sinh(Math.PI * (1 - 2 * cy))) * 180) / Math.PI;
  let lon = (b.west + b.east) / 2;
  while (lon > 180) lon -= 360;
  while (lon < -180) lon += 360;
  return { center: [+lon.toFixed(2), +lat.toFixed(2)], zoom: z };
}

export const mapsDir = (root, cfg) => join(root, "assets", "maps", cfg.id);
