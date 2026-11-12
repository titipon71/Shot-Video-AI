// scripts/cutout.mjs
// 1. If assets/octopus-happy.jpg or assets/octopus-angry.jpg are not placed yet,
//    generates cute placeholder JPEGs on a white (#FFFFFF) background via FFmpeg.
// 2. Cuts out the white background from assets/octopus-happy.jpg and assets/octopus-angry.jpg
//    using FFmpeg raw RGBA + border flood-fill + soft alpha feathering & white-halo defringing
//    (preserving interior whites such as eyes/teeth), outputting:
//      - assets/octopus-happy.png
//      - assets/octopus-angry.png

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = join(root, "assets");
mkdirSync(assetsDir, { recursive: true });

// Generate an 800x800 placeholder octopus JPEG on a white background if user hasn't dropped images yet
function generatePlaceholderJpg(outPath, mood) {
  const W = 800, H = 800;
  const buf = Buffer.alloc(W * H * 4);
  const isAngry = mood === "angry";

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // Pure white background (#FFFFFF)
      let r = 255, g = 255, b = 255;

      const cx = (x - 400) / 1;
      const cy = (y - 360) / 1;

      // Tentacles (8 wavy tentacles radiating from lower head)
      let inOctopus = false;
      let shade = 0;

      for (let t = 0; t < 8; t++) {
        const baseAngle = Math.PI * 0.12 + (t / 7) * Math.PI * 0.76;
        const spread = (t - 3.5) * 48;
        const ty = y - 450;
        if (ty > -40 && ty < 270) {
          const prog = Math.max(0, (ty + 40) / 310);
          const wave = Math.sin(prog * 5.2 + t * 1.1) * (28 * prog) + (isAngry ? Math.cos(prog * 8 + t) * 10 * prog : 0);
          const tx = 400 + spread * (0.45 + prog * 0.95) + wave;
          const radius = (1 - prog * 0.68) * 44;
          const dist = Math.hypot(x - tx, y - (450 + ty));
          if (dist < radius) {
            inOctopus = true;
            shade = (dist / radius) * 0.25;
          }
        }
      }

      // Main bulbous head
      const hx = cx / 195;
      const hy = (y - 315) / 175;
      const headDist = Math.hypot(hx, hy * (hy > 0 ? 1.15 : 0.95));
      if (headDist < 1.0) {
        inOctopus = true;
        shade = Math.max(0, headDist * 0.22);
      }

      if (inOctopus) {
        // Base body color: cute coral-pink when happy, fiery crimson-purple when angry
        const baseR = isAngry ? 225 : 255;
        const baseG = isAngry ? 52 : 112;
        const baseB = isAngry ? 70 : 148;
        const hl = Math.max(0, 1 - Math.hypot((x - 335) / 140, (y - 235) / 120)) * 0.28;
        r = Math.min(255, Math.round(baseR * (1 - shade) + 255 * hl));
        g = Math.min(255, Math.round(baseG * (1 - shade) + 200 * hl));
        b = Math.min(255, Math.round(baseB * (1 - shade) + 220 * hl));

        // Cute cheek blushes
        const leftCheek = Math.hypot((x - 275) / 34, (y - 360) / 22);
        const rightCheek = Math.hypot((x - 525) / 34, (y - 360) / 22);
        if (!isAngry && (leftCheek < 1 || rightCheek < 1)) {
          r = 255; g = 150; b = 185;
        }

        // Eyes (white sclera + dark pupil + white sparkle)
        for (const ex of [325, 475]) {
          const ey = 320;
          const ed = Math.hypot(x - ex, y - ey);
          // Angry slanted eyebrow cut
          const side = ex < 400 ? 1 : -1;
          const browY = ey - 18 + (x - ex) * side * 0.42;
          const underBrow = !isAngry || y > browY;

          if (ed < 42 && underBrow) {
            // White of eye (interior white — floodfill cutout will preserve this!)
            r = 252; g = 252; b = 255;
            if (ed < 26) {
              // Pupil
              r = isAngry ? 45 : 28;
              g = 18;
              b = 35;
              // Eye sparkle
              if (Math.hypot(x - (ex - 8), y - (ey - 8)) < 8) {
                r = 255; g = 255; b = 255;
              }
            }
          }
          // Angry thick brow line
          if (isAngry && Math.abs(y - browY) < 9 && Math.abs(x - ex) < 48) {
            r = 70; g = 10; b = 20;
          }
        }

        // Mouth
        if (!isAngry) {
          // Happy smile arc
          const mx = x - 400;
          const my = y - 365;
          const arcY = 22 - (mx * mx) / 65;
          if (Math.abs(mx) < 42 && Math.abs(my - arcY) < 7) {
            r = 65; g = 18; b = 40;
          }
        } else {
          // Angry open Jagged/frown mouth with white teeth
          const mx = x - 400;
          const my = y - 395;
          const frownY = -18 + (mx * mx) / 55;
          if (Math.abs(mx) < 48 && my > frownY - 12 && my < frownY + 22) {
            if (my < frownY - 2) {
              // White teeth
              r = 250; g = 250; b = 250;
            } else {
              r = 80; g = 12; b = 24;
            }
          }
        }
      }

      const idx = (y * W + x) * 4;
      buf[idx] = r;
      buf[idx + 1] = g;
      buf[idx + 2] = b;
      buf[idx + 3] = 255;
    }
  }

  const ff = spawnSync(
    "ffmpeg",
    ["-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${W}x${H}`, "-i", "-", "-q:v", "2", outPath],
    { input: buf }
  );
  if (ff.status !== 0) throw new Error(`Failed to generate placeholder ${outPath}`);
  console.log(`Generated placeholder: ${outPath}`);
}

// Remove outer white background using FFmpeg + Border BFS Flood-Fill + Soft Feathering
function cutoutWhiteBg(inJpg, outPng) {
  const probe = spawnSync(
    "ffprobe",
    ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", inJpg],
    { encoding: "utf8" }
  );
  if (probe.status !== 0) throw new Error(`ffprobe failed on ${inJpg}`);
  const [W, H] = probe.stdout.trim().split("x").map(Number);

  const dec = spawnSync(
    "ffmpeg",
    ["-v", "error", "-i", inJpg, "-f", "rawvideo", "-pix_fmt", "rgba", "-"],
    { maxBuffer: W * H * 4 + 1024 * 1024 }
  );
  if (dec.status !== 0) throw new Error(`ffmpeg decode failed on ${inJpg}`);
  const rgba = Buffer.from(dec.stdout);

  // Measure how far a pixel is from neutral white:
  // Pure white background has R,G,B near 255 AND very low saturation (R≈G≈B).
  // Yellow/orange plush highlights have high R,G but lower B (higher saturation), so weighting saturation
  // heavily protects light yellow highlights on top of the happy octopus head!
  const whiteDist = (i) => {
    const r = rgba[i], g = rgba[i + 1], b = rgba[i + 2];
    const dr = 255 - r, dg = 255 - g, db = 255 - b;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    return Math.hypot(dr, dg, db) + sat * 2.2;
  };

  // Flood-fill from image borders so interior white parts (eye catchlights) remain 100% opaque
  const visited = new Uint8Array(W * H);
  const bgMask = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let head = 0, tail = 0;

  const THRESH_SOLID_BG = 36; // Strict neutral-white threshold so pastel yellow head highlights are untouched
  const push = (p) => {
    if (!visited[p]) {
      visited[p] = 1;
      if (whiteDist(p * 4) <= THRESH_SOLID_BG) {
        bgMask[p] = 1;
        queue[tail++] = p;
      }
    }
  };

  for (let x = 0; x < W; x++) {
    push(x);
    push((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    push(y * W);
    push(y * W + (W - 1));
  }

  while (head < tail) {
    const p = queue[head++];
    const x = p % W;
    const y = (p - x) / W;
    if (x > 0) push(p - 1);
    if (x < W - 1) push(p + 1);
    if (y > 0) push(p - W);
    if (y < H - 1) push(p + W);
  }

  // Apply transparency to flood-filled background and feather + defringe the 2px boundary
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      const i = p * 4;
      if (bgMask[p]) {
        rgba[i + 3] = 0;
        continue;
      }
      // Check if adjacent to background (within 2px) for smooth edge feathering & white-halo removal
      let nearBg = false;
      for (let dy = -2; dy <= 2 && !nearBg; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= H) continue;
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx;
          if (nx >= 0 && nx < W && bgMask[ny * W + nx]) {
            nearBg = true;
            break;
          }
        }
      }
      if (nearBg) {
        const d = whiteDist(i);
        // Smooth ramp between d=45 (transparent) and d=115 (opaque)
        const alpha = Math.max(0, Math.min(1, (d - 42) / 75));
        rgba[i + 3] = Math.round(alpha * 255);
        // Un-premultiply white halo on semi-transparent edge pixels
        if (alpha > 0.05 && alpha < 0.98) {
          rgba[i] = Math.max(0, Math.min(255, Math.round((rgba[i] - (1 - alpha) * 255) / alpha)));
          rgba[i + 1] = Math.max(0, Math.min(255, Math.round((rgba[i + 1] - (1 - alpha) * 255) / alpha)));
          rgba[i + 2] = Math.max(0, Math.min(255, Math.round((rgba[i + 2] - (1 - alpha) * 255) / alpha)));
        }
      }
    }
  }

  const enc = spawnSync(
    "ffmpeg",
    ["-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${W}x${H}`, "-i", "-", "-c:v", "png", outPng],
    { input: rgba, maxBuffer: W * H * 4 + 1024 * 1024 }
  );
  if (enc.status !== 0) throw new Error(`ffmpeg encode failed on ${outPng}`);
  console.log(`Cutout saved: ${outPng} (${W}x${H})`);
}

const happyJpg = join(assetsDir, "octopus-happy.jpg");
const angryJpg = join(assetsDir, "octopus-angry.jpg");

if (!existsSync(happyJpg)) generatePlaceholderJpg(happyJpg, "happy");
if (!existsSync(angryJpg)) generatePlaceholderJpg(angryJpg, "angry");

cutoutWhiteBg(happyJpg, join(assetsDir, "octopus-happy.png"));
cutoutWhiteBg(angryJpg, join(assetsDir, "octopus-angry.png"));
