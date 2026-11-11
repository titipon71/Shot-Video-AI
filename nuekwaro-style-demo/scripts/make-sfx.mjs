// scripts/make-sfx.mjs
// Generates a deterministic 12.0s suspenseful docu-drama & infographic SFX track
// for nuekwaro-style-demo (Notification pings, phone rings, bank slip transfer chime, sub drop).
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outWav = join(root, "assets", "scam-explainer-sfx.wav");
mkdirSync(join(root, "assets"), { recursive: true });

const SR = 44100;
const DUR = 12.0;
const N = Math.floor(SR * DUR);
const pcm = Buffer.alloc(N * 2); // 16-bit mono

let seed = 482910;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 0xffffffff) * 2 - 1;
};

let lp1 = 0;
let lp2 = 0;

for (let i = 0; i < N; i++) {
  const t = i / SR;
  const n = rand();
  lp1 += 0.04 * (n - lp1);
  lp2 += 0.008 * (lp1 - lp2);

  // 1. Tense Suspense Bed (D minor low drone + subtle pulsing bass)
  const fade = t > 11.5 ? (12.0 - t) / 0.5 : t < 0.2 ? t / 0.2 : 1.0;
  const drone =
    (Math.sin(2 * Math.PI * 73.42 * t) * 0.09 +
      Math.sin(2 * Math.PI * 110.0 * t) * 0.06 +
      Math.sin(2 * Math.PI * 146.83 * t + Math.sin(2 * Math.PI * 1.5 * t) * 0.2) * 0.04) *
    fade;
  const room = lp2 * 0.12 * fade;

  // 2. Scene 1 (0-4s): Phone Message Notification Chime at t=0.8s and t=2.4s
  let notification = 0;
  for (const nt of [0.8, 0.92, 2.4, 2.52]) {
    const dt = t - nt;
    if (dt > 0 && dt < 0.18) {
      const f = nt % 0.2 === 0 ? 1046.5 : 1318.5; // C6 / E6 crystal chime
      notification += Math.sin(2 * Math.PI * f * dt) * Math.exp(-dt * 32) * 0.14;
    }
  }

  // 3. Scene 2 (4-8s):
  // - Banking transfer success chime at t=4.8s (Arpeggiated G5 - B5 - D6)
  let bankChime = 0;
  const arpNotes = [
    { t: 4.8, f: 783.99 },
    { t: 4.95, f: 987.77 },
    { t: 5.1, f: 1174.66 }
  ];
  for (const note of arpNotes) {
    const dt = t - note.t;
    if (dt > 0 && dt < 0.35) {
      bankChime += Math.sin(2 * Math.PI * note.f * dt) * Math.exp(-dt * 18) * 0.16;
    }
  }

  // - Money counter digital tick stream (5.2s - 6.0s)
  let moneyTicks = 0;
  if (t >= 5.2 && t <= 6.0) {
    const tickPhase = (t - 5.2) % 0.08;
    if (tickPhase < 0.012) {
      moneyTicks = Math.sin(2 * Math.PI * 2200 * tickPhase) * Math.exp(-tickPhase * 400) * 0.08;
    }
  }

  // - Twist dramatic low impact sub thud at t=7.2s ("นึกว่ารอด...")
  let shockThud = 0;
  if (t >= 7.2 && t <= 8.5) {
    const dt = t - 7.2;
    const sub = Math.sin(2 * Math.PI * (58 - dt * 14) * dt) * Math.exp(-dt * 3.5) * 0.42;
    const snap = lp1 * Math.exp(-dt * 18) * 0.25;
    shockThud = sub + snap;
  }

  // 4. Scene 3 (8-12s): Infographic Tech Pulse & Incoming Phone Ring cadence
  let infoTech = 0;
  // Tech ticks at diagram nodes
  for (const nodeT of [8.4, 9.2, 10.0]) {
    const dt = t - nodeT;
    if (dt > 0 && dt < 0.05) {
      infoTech += Math.sin(2 * Math.PI * 1760 * dt) * Math.exp(-dt * 90) * 0.12;
    }
  }

  // Phone Ringing sound (two bursts per ring cycle: 8.8s & 9.2s, then 10.4s & 10.8s)
  let phoneRing = 0;
  for (const ringT of [8.8, 9.2, 10.4, 10.8]) {
    const dt = t - ringT;
    if (dt > 0 && dt < 0.28) {
      const dualTone =
        (Math.sin(2 * Math.PI * 440 * dt) + Math.sin(2 * Math.PI * 480 * dt)) * 0.5;
      phoneRing += dualTone * Math.exp(-dt * 10) * 0.15;
    }
  }

  // Warning Alert Ping at t=11.0s
  let warnPing = 0;
  if (t >= 11.0 && t <= 11.8) {
    const dt = t - 11.0;
    warnPing = Math.sin(2 * Math.PI * 880 * dt) * Math.exp(-dt * 8) * 0.15;
  }

  const sample = Math.max(
    -0.95,
    Math.min(
      0.95,
      drone + room + notification + bankChime + moneyTicks + shockThud + infoTech + phoneRing + warnPing
    )
  );
  pcm.writeInt16LE(Math.round(sample * 32767), i * 2);
}

const ff = spawnSync(
  "ffmpeg",
  ["-y", "-loglevel", "error", "-f", "s16le", "-ar", String(SR), "-ac", "1", "-i", "-", outWav],
  { input: pcm }
);
if (ff.status !== 0) throw new Error("Failed to encode scam-explainer-sfx.wav");
console.log(`Generated audio: ${outWav}`);
