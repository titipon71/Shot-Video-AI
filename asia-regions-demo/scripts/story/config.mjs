// Story videos ("kind": "story"): narrated map scenes. Each scene carries its narration (`say`);
// every overlay is keyed to a cue phrase in it, so timings follow the voice. Without a voiceover the
// times come from a reading-speed estimate (cps); with one, from its word timestamps.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadAtlas, boundsOf, suggest } from "../lib/atlas.mjs";
import { frame } from "../lib/config.mjs";
import { cueTimes, alignVoice } from "./timing.mjs";

const HEX = /^#[0-9a-fA-F]{6}$/;
const LEAD = 0.1, TAIL = 0.45; // silence before the first word and after the last, per scene (no voice)
const CUT_LEAD = 0.35, END_HOLD = 1.2; // with a voice: cut at most this long before a scene's first word; hold after the last

export async function loadStory(root, path, raw) {
  const cfg = raw;
  cfg.width ??= 1080;
  cfg.height ??= 1920;
  cfg.fps ??= 30;
  cfg.style ??= "satellite";
  cfg.cps ??= 13; // Thai characters per second, spaces not counted
  cfg.credit ??= cfg.style === "satellite" ? "Imagery: Esri, Maxar, Earthstar Geographics" : "© CARTO, © OpenStreetMap";
  cfg.places ??= {};

  const errors = [];
  const atlas = await loadAtlas(root);
  if (!/^[a-z0-9-]+$/.test(cfg.id)) errors.push(`id "${cfg.id}" may use only a-z, 0-9 and -`);
  for (const [k, p] of Object.entries(cfg.places))
    if (!Array.isArray(p.at) || p.at.length !== 2 || !p.at.every(Number.isFinite)) errors.push(`places.${k}.at must be [lon, lat]`);
  const place = (id, at) => {
    if (!cfg.places[id]) errors.push(`${at}: place "${id}" is not in places`);
    return id;
  };
  const country = (c, at) => {
    if (!atlas.has(c)) {
      const near = suggest(atlas, c);
      errors.push(`${at}: "${c}" is not in world-atlas${near.length ? ` (did you mean ${near.slice(0, 4).map((n) => `"${n}"`).join(", ")}?)` : ""}`);
    }
  };

  // Voiceover: { audio, transcript } paths in the project. Without a transcript yet, fall back to the estimate.
  if (cfg.voice) {
    if (!existsSync(join(root, cfg.voice.audio ?? ""))) errors.push(`voice.audio "${cfg.voice.audio}" not found`);
    if (!existsSync(join(root, cfg.voice.transcript ?? ""))) {
      console.warn(`voice.transcript "${cfg.voice.transcript}" not found: timing from cps (run scripts/story/transcribe.py)`);
      cfg.voice.words = null;
    } else cfg.voice.words = JSON.parse(readFileSync(join(root, cfg.voice.transcript), "utf8"));
    // Length of the audio file (ffprobe), so its slot doesn't run past the end of it.
    const probe = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", join(root, cfg.voice.audio ?? "")], { encoding: "utf8" });
    cfg.voice.length = probe.status === 0 ? +(+probe.stdout.trim()).toFixed(3) || null : null;
  }

  const scenes = cfg.scenes ?? [];
  if (!scenes.length) errors.push("scenes is empty");
  const ids = new Set();
  let prev = null;
  for (const [i, s] of scenes.entries()) {
    const at = `scenes[${i}]${s.id ? ` (${s.id})` : ""}`;
    if (!/^[a-z0-9-]+$/.test(s.id ?? "")) errors.push(`${at}.id is required (a-z, 0-9, -)`);
    if (ids.has(s.id)) errors.push(`${at}.id is used twice`);
    ids.add(s.id);
    if (typeof s.say !== "string" || !s.say.trim()) errors.push(`${at}.say (the narration) is required`);
    s.fills ??= [];
    s.pins ??= [];
    s.routes ??= [];
    s.texts ??= [];
    s.icons ??= [];
    s.fills.forEach((f, j) => {
      (f.countries ?? []).forEach((c) => country(c, `${at}.fills[${j}]`));
      if (!f.countries?.length) errors.push(`${at}.fills[${j}].countries is empty`);
      if (!HEX.test(f.color ?? "")) errors.push(`${at}.fills[${j}].color must be #RRGGBB`);
    });
    s.pins.forEach((p, j) => place(p.place, `${at}.pins[${j}]`));
    s.routes.forEach((r, j) => {
      if (!(r.via?.length >= 2)) errors.push(`${at}.routes[${j}].via needs at least two places`);
      (r.via ?? []).forEach((v) => place(v, `${at}.routes[${j}]`));
    });
    s.icons.forEach((c, j) => place(c.place, `${at}.icons[${j}]`));
    s.texts.forEach((t, j) => {
      if (!t.text) errors.push(`${at}.texts[${j}].text is required`);
    });
    // Picture cards: the file's pixel size sets the card's shape.
    s.images ??= [];
    s.images.forEach((im, j) => {
      const file = join(root, im.src ?? "");
      if (!im.src || !existsSync(file)) return errors.push(`${at}.images[${j}].src "${im.src}" not found`);
      const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", file], { encoding: "utf8" });
      const [w, h] = (r.stdout ?? "").trim().split("x").map(Number);
      if (!(w > 0 && h > 0)) return errors.push(`${at}.images[${j}]: can't read the size of "${im.src}" (is ffprobe on PATH?)`);
      im.w = w;
      im.h = h;
    });
  }
  if (errors.length) throw new Error(`${path}:\n  - ${errors.join("\n  - ")}`);

  // With a voiceover, each scene runs from a cut in the pause before its first word to the next cut.
  if (cfg.voice?.words) {
    const al = alignVoice(scenes, cfg.voice.words);
    const fr = (t) => Math.round(t * cfg.fps) / cfg.fps;
    const cuts = al.map((a, k) => (k === 0 ? 0 : fr(Math.max((al[k - 1].last + a.first) / 2, a.first - CUT_LEAD))));
    cuts.push(fr(al.at(-1).last + END_HOLD));
    scenes.forEach((s, k) => {
      s.voice = { start: cuts[k], times: al[k].times };
      s.dur = +(cuts[k + 1] - cuts[k]).toFixed(3);
      if (al[k].matched < 0.5) console.warn(`${s.id}: only ${Math.round(al[k].matched * 100)}% of the narration matched the voice; check say vs the recording`);
    });
    cfg.voice.duration = cuts.at(-1);
  }

  for (const s of scenes) {
    // Duration: from the voiceover when there is one, else from the reading-speed estimate.
    const chars = s.say.replace(/\s/g, "").length;
    const cam = (s.camera ??= {});
    cam.move ??= 1.5;
    s.dur ??= +Math.max(cam.move + 1.5, LEAD + chars / cfg.cps + TAIL).toFixed(1);
    if (s.voice) cam.move = Math.min(cam.move, +(s.dur - 0.6).toFixed(2)); // a short spoken scene shortens its move
    s.speak = [LEAD, s.dur - TAIL];
    s.cue = cueTimes(s); // phrase -> seconds into the scene

    if (!cam.center || cam.zoom == null) {
      const names = cam.fit ?? [];
      const pts = names.filter((n) => cfg.places[n]).map((n) => cfg.places[n].at);
      const cs = names.filter((n) => !cfg.places[n]);
      cs.forEach((c) => country(c, `${s.id}.camera.fit`));
      if (errors.length) throw new Error(`${path}:\n  - ${errors.join("\n  - ")}`);
      if (!pts.length && !cs.length) throw new Error(`${path}: ${s.id}: camera needs center + zoom, or fit: [places or countries]`);
      const b = cs.length ? boundsOf(atlas, cs) : { west: 180, east: -180, south: 90, north: -90 };
      for (const [lon, lat] of pts) {
        b.west = Math.min(b.west, lon);
        b.east = Math.max(b.east, lon);
        b.south = Math.min(b.south, lat);
        b.north = Math.max(b.north, lat);
      }
      const fit = frame(b, cfg, cam.fill ?? 0.8);
      cam.center ??= fit.center;
      cam.zoom ??= fit.zoom;
    }
    cam.zstart ??= prev ? prev.zoom : +(cam.zoom - 0.3).toFixed(2);
    if (prev && !cam.from) cam.from = prev.center;
    if (cam.move >= s.dur - 0.5) throw new Error(`${path}: ${s.id}: camera.move (${cam.move}s) is too long for a ${s.dur}s scene`);
    prev = cam;
  }
  cfg.scenes = scenes;
  return cfg;
}

// Bake env for a story scene: bake the camera move only; the held view is a still (hold image).
export function storyBakeParams(cfg, s) {
  const cam = s.camera;
  const used = new Set();
  for (const p of s.pins) used.add(p.place);
  for (const r of s.routes) r.via.forEach((v) => used.add(v));
  for (const c of s.icons) used.add(c.place);
  for (const t of s.texts) if (t.place) used.add(t.place);
  for (const f of s.fills) if (f.labelAt) used.add(f.labelAt);
  const env = {
    NAME: s.id,
    STYLE: cfg.style,
    W: String(cfg.width),
    H: String(cfg.height),
    FPS: String(cfg.fps),
    DUR: String(cam.move),
    HOLD: "1",
    CENTER: cam.center.join(","),
    ZSTART: String(cam.zstart),
    ZEND: String(cam.zoom),
    COUNTRIES: [...new Set(s.fills.flatMap((f) => f.countries))].join(","),
    POINTS: [...used].map((id) => `${id}@${cfg.places[id].at.join(",")}`).join(";"),
  };
  if (cam.from) {
    env.FROM = cam.from.join(",");
    env.CAMPATH = "fly";
  }
  return env;
}
