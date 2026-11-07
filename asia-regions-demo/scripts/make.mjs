// One command per video: check the config, bake the maps it needs, write the compositions,
// and optionally render.
//   node scripts/make.mjs videos/asia-regions.json [--render] [--force] [--only=hook,west] [--dry] [--stills]
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./lib/config.mjs";
import { bakeAll, bakeParams } from "./bake-all.mjs";
import { build } from "./build.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const flag = (name) => args.includes(`--${name}`);
const only = (args.find((a) => a.startsWith("--only="))?.slice(7) ?? "").split(",").filter(Boolean);

if (!file) {
  console.error("usage: node scripts/make.mjs videos/<name>.json [--render] [--force] [--only=a,b] [--dry] [--stills]");
  process.exit(1);
}

// Use the CLI version the project pins in package.json, so renders stay reproducible.
const pin = readFileSync(join(root, "package.json"), "utf8").match(/hyperframes@[\d.]+/)?.[0] ?? "hyperframes";
const npx = (cmd) => {
  // Windows needs a shell to run npx.cmd.
  const r = spawnSync(`npx --yes ${pin} ${cmd}`, { cwd: root, stdio: "inherit", shell: true });
  if (r.status !== 0) throw new Error(`hyperframes ${cmd} failed`);
};

try {
  const cfg = await loadConfig(root, resolve(file));
  const total = cfg.scenes.reduce((t, s) => t + s.dur, 0);
  console.log(`${cfg.id}: ${cfg.scenes.length} scenes, ${total}s, ${cfg.width}x${cfg.height}`);
  for (const s of cfg.scenes) {
    const c = s.camera;
    console.log(`  ${s.id.padEnd(12)} ${s.type.padEnd(7)} ${String(s.dur).padStart(4)}s  center ${c.center.join(", ")}  zoom ${c.zstart} -> ${c.zoom}`);
  }
  if (flag("dry")) process.exit(0); // config and camera check only

  if (!process.env.CHROME && process.platform === "win32")
    process.env.CHROME = join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe");
  if (flag("stills")) {
    // One held frame per scene (seconds each), to check the framing before a full bake.
    const dir = join(root, ".cache", "stills", cfg.id);
    for (const s of cfg.scenes) {
      if (only.length && !only.includes(s.id)) continue;
      const { FROM, PAN, ...params } = bakeParams(cfg, s);
      spawnSync(process.execPath, [join(root, "scripts", "bake-basemap.mjs")], {
        env: { ...process.env, ...params, DUR: String(1 / cfg.fps), ZSTART: params.ZEND, OUT: dir },
        stdio: "ignore",
      });
      const png = join(dir, `${s.id}.png`);
      copyFileSync(join(dir, `frames-${s.id}`, "f0000.png"), png);
      console.log(`  still: ${png}`);
    }
    process.exit(0);
  }
  bakeAll(root, cfg, { force: flag("force"), only });
  build(root, cfg);
  console.log(`wrote index.html and ${cfg.scenes.length} scenes`);
  npx("lint");

  if (flag("render")) {
    mkdirSync(join(root, "renders"), { recursive: true });
    npx(`render --quality looks -o renders/${cfg.id}.mp4`);
  }
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
