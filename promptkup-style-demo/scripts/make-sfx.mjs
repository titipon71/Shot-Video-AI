// scripts/make-sfx.mjs
// Generates a deterministic 12.0s moody ambient + foley audio track (assets/moody-ambience.wav)
// matching the 3 diorama scenes (0-4s Queue & Clock, 4-8s Hotpot & Spoon, 8-12s Desk & Coins).
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outWav = join(root, "assets", "moody-ambience.wav");
mkdirSync(join(root, "assets"), { recursive: true });

const SR = 44100;
const DUR = 12.0;
const N = Math.floor(SR * DUR);
const pcm = Buffer.alloc(N * 2); // 16-bit mono

let seed = 902107;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 0xffffffff) * 2 - 1;
};

let lp1 = 0;
let lp2 = 0;

for (let i = 0; i < N; i++) {
  const t = i / SR;
  const n = rand();
  lp1 += 0.03 * (n - lp1);
  lp2 += 0.006 * (lp1 - lp2);

  // Warm melancholic drone (A2 + E3 + C4 minor-ish warm pad)
  const fadeOut = t > 11.4 ? (12.0 - t) / 0.6 : t < 0.3 ? t / 0.3 : 1.0;
  const pad =
    (Math.sin(2 * Math.PI * 110 * t) * 0.07 +
      Math.sin(2 * Math.PI * 164.81 * t) * 0.05 +
      Math.sin(2 * Math.PI * 220 * t + Math.sin(2 * Math.PI * 0.5 * t) * 0.3) * 0.035) *
    fadeOut;

  // Subtle vinyl/film grain room tone
  const room = lp2 * 0.18 * fadeOut;

  // Soft clock ticks every 0.5s
  const tickPhase = t % 0.5;
  let tick = 0;
  if (tickPhase < 0.018) {
    tick = Math.sin(2 * Math.PI * 1150 * tickPhase) * Math.exp(-tickPhase * 260) * 0.09;
  }

  // Scene transition soft low whoosh at t=4.0s and t=8.0s
  let whoosh = 0;
  for (const wt of [4.0, 8.0]) {
    const dt = (t - wt) / 0.28;
    if (Math.abs(dt) < 1.5) {
      whoosh += lp1 * Math.exp(-dt * dt * 2.5) * 0.32;
    }
  }

  // Scene 2 (4-8s): Subtle simmering broth bubbles
  let simmer = 0;
  if (t >= 4.0 && t < 8.0) {
    for (const bt of [4.4, 4.9, 5.3, 5.8, 6.2, 6.7, 7.2, 7.6]) {
      const dt = t - bt;
      if (dt > 0 && dt < 0.09) {
        simmer += Math.sin(2 * Math.PI * (420 + dt * 1500) * dt) * Math.exp(-dt * 42) * 0.11;
      }
    }
  }

  // Scene 3 (8-12s): Soft metallic coin drops into jar
  let coin = 0;
  if (t >= 8.0) {
    for (const ct of [8.55, 9.25, 9.95, 10.65, 11.25]) {
      const dt = t - ct;
      if (dt > 0 && dt < 0.16) {
        coin +=
          (Math.sin(2 * Math.PI * 2480 * dt) * 0.6 + Math.sin(2 * Math.PI * 3720 * dt) * 0.4) *
          Math.exp(-dt * 32) *
          0.12;
      }
    }
  }

  const sample = Math.max(-0.95, Math.min(0.95, pad + room + tick + whoosh + simmer + coin));
  pcm.writeInt16LE(Math.round(sample * 32767), i * 2);
}

const ff = spawnSync(
  "ffmpeg",
  ["-y", "-loglevel", "error", "-f", "s16le", "-ar", String(SR), "-ac", "1", "-i", "-", outWav],
  { input: pcm }
);
if (ff.status !== 0) throw new Error("Failed to encode moody-ambience.wav");
console.log(`Generated audio: ${outWav}`);
