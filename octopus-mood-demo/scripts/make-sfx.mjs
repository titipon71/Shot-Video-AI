// scripts/make-sfx.mjs
// Generates a deterministic 10.0s underwater + motion SFX track (assets/underwater-sfx.wav)
// synced to the 5 storyboard phases so the motion graphic has full sound design.
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outWav = join(root, "assets", "underwater-sfx.wav");
mkdirSync(join(root, "assets"), { recursive: true });

const SR = 44100;
const DUR = 10.0;
const N = Math.floor(SR * DUR);
const pcm = Buffer.alloc(N * 2); // 16-bit mono

// Deterministic PRNG
let seed = 133742;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 0xffffffff) * 2 - 1;
};

let lp1 = 0, lp2 = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const n = rand();
  lp1 += 0.025 * (n - lp1);
  lp2 += 0.008 * (lp1 - lp2);

  // 1. Calm underwater ambience (loops seamlessly at t=0 and t=10)
  const calmEnv = t < 2.5 ? 1.0 : t < 4.0 ? 1.0 - (t - 2.5) / 1.5 : t > 9.2 ? (t - 9.2) / 0.8 : 0.25;
  const subHum = Math.sin(2 * Math.PI * 55 * t) * 0.08 * calmEnv;
  const waterBed = lp2 * 0.35 * calmEnv;

  // 2. Gentle bubbles (0-2s & 9.4-10s)
  let bubble = 0;
  for (const bt of [0.4, 0.95, 1.5, 9.65]) {
    const dt = t - bt;
    if (dt > 0 && dt < 0.14) {
      const freq = 380 + dt * 1800;
      bubble += Math.sin(2 * Math.PI * freq * dt) * Math.exp(-dt * 28) * 0.16;
    }
  }

  // 3. School of fish swimming past & darkening tension (2-4s)
  let fishPass = 0;
  if (t >= 2.0 && t <= 4.0) {
    const p = (t - 2.0) / 2.0;
    const swishEnv = Math.sin(Math.PI * p);
    fishPass = lp1 * swishEnv * 0.28 + Math.sin(2 * Math.PI * (48 - p * 12) * t) * p * 0.18;
  }

  // 4. 3D Flip #1 whoosh (4.0-5.5s, peak at 4.75s)
  let flip1 = 0;
  if (t >= 4.05 && t <= 5.45) {
    const dt = (t - 4.75) / 0.35;
    const env = Math.exp(-dt * dt * 2.2);
    const sweep = 140 + 220 * env;
    flip1 = (lp1 * 0.65 + Math.sin(2 * Math.PI * sweep * t) * 0.35) * env * 0.55;
  }

  // 5. Rage phase (5.5-8.0s): deep rumble + rapid boiling bubbles + fish fleeing zip
  let rage = 0;
  if (t >= 5.5 && t <= 8.0) {
    const p = (t - 5.5) / 2.5;
    const env = p < 0.1 ? p / 0.1 : p > 0.88 ? (1 - p) / 0.12 : 1.0;
    const rumble = (Math.sin(2 * Math.PI * 42 * t + Math.sin(2 * Math.PI * 14 * t) * 1.5) * 0.28 + lp1 * 0.38) * env;
    const rapidBubbles = Math.sin(2 * Math.PI * (520 + Math.sin(t * 45) * 180) * t) * (0.5 + 0.5 * Math.sin(t * 60)) * 0.09 * env;
    rage = rumble + rapidBubbles;
  }

  // 6. Stare (8.0-9.0s) & 3D Flip #2 back to happy (9.0-10.0s, peak at 9.45s)
  let flip2 = 0;
  if (t >= 9.0 && t <= 9.9) {
    const dt = (t - 9.45) / 0.25;
    const env = Math.exp(-dt * dt * 2.5);
    const sweep = 180 + 260 * env;
    flip2 = (lp1 * 0.55 + Math.sin(2 * Math.PI * sweep * t) * 0.35) * env * 0.48;
  }

  const sample = Math.max(-0.95, Math.min(0.95, subHum + waterBed + bubble + fishPass + flip1 + rage + flip2));
  pcm.writeInt16LE(Math.round(sample * 32767), i * 2);
}

const ff = spawnSync(
  "ffmpeg",
  ["-y", "-loglevel", "error", "-f", "s16le", "-ar", String(SR), "-ac", "1", "-i", "-", outWav],
  { input: pcm }
);
if (ff.status !== 0) throw new Error("Failed to encode underwater-sfx.wav");
console.log(`Generated audio: ${outWav}`);
