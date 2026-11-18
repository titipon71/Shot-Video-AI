#!/usr/bin/env python3
"""tip-bangkok audio: FFmpeg-synthesized SFX + light music bed, ducked under assets/audio/tip-bangkok.wav.
Reuses the บางดูไบ SFX library (all sounds generated with ffmpeg; no third-party audio).
Output: assets/audio/mix.wav (final mix, -16 LUFS) — read by index.html."""
import json, os, subprocess
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BD = os.path.join(os.path.dirname(ROOT), "bang-dubai", "scripts", "make-audio.py")
src = open(BD, encoding="utf-8").read()
lib = {"__file__": BD, "__name__": "bdlib"}
exec(src[:src.index("# ---------------- timeline of SFX events")], lib)
SR, SFX, ff, ev, noise, norm, env = (lib[k] for k in ("SR", "SFX", "ff", "ev", "noise", "norm", "env"))

meta = json.load(open(os.path.join(ROOT, "assets/audio/cues.json"), encoding="utf-8"))
BOUNDS, TOTAL = meta["BOUNDS"], meta["TOTAL"]
VOICE = os.path.join(ROOT, "assets/audio/tip-bangkok.wav")

# extra sounds for this video
SFX["beep"] = norm(np.concatenate([ev("0.6*sin(2*PI*1760*t)*exp(-18*t)", 0.09), ev("0.6*sin(2*PI*2349*t)*exp(-12*t)", 0.22)]))
SFX["blip"] = norm(ev("0.6*sin(2*PI*1320*t)*exp(-30*t)", 0.08))
SFX["sizzle"] = norm(noise("white", 6.5, "highpass=f=3000,tremolo=f=13:d=0.6") * env(int(6.5 * SR), 0.2, 0.8))
SFX["door"] = norm(np.concatenate([ev("0.5*sin(2*PI*1319*t)*exp(-4*t)", 0.35), ev("0.5*sin(2*PI*1047*t)*exp(-3*t)", 0.8)]))
SFX["ting"] = norm(ev("0.6*sin(2*PI*2093*t)*exp(-3*t)+0.4*sin(2*PI*4186*t)*exp(-5*t)+0.2*sin(2*PI*6272*t)*exp(-8*t)", 1.5))

EV = []
def add(name, t, db=-12, pan=0.0): EV.append((name, t, db, pan))
for b in BOUNDS[1:]: add("whoosh", b - 0.32, -11)
for b in BOUNDS[1:6]: add("pop", b + 0.28, -15)  # chapter badges
add("pop", BOUNDS[6] + 0.4, -15)
# 0 hook
add("amb", 0.0, -24); add("train", 0.6, -20, -0.4); add("horn3", 1.1, -24, 0.6); add("pop", 0.15, -15)
add("paper", 3.75, -20); add("bonk", 4.35, -12)
for i in range(5): add("blip", 4.75 + i * 0.09, -14, (i % 3 - 1) * 0.5)
add("beep", 5.95, -10); add("boom", 5.95, -15)
for i in range(6): add("tick", 6.85 + i * 0.22, -16)
# 1 coffee (B 8.4)
add("pop", 11.3, -15); add("whoosh", 12.85, -18); add("blip", 13.3, -14)
add("rise", 14.87, -16); add("boing", 15.2, -20)
add("beep", 17.1, -10); add("coin", 17.25, -14)
# 2 motorbike (B 18.5)
add("rev", 20.1, -12); add("pop", 21.5, -15); add("beep", 22.3, -12); add("coin", 22.45, -15)
add("beep", 24.0, -11); add("rev", 24.05, -11); add("coin", 24.15, -15)
add("blip", 24.87, -14); add("pop", 25.5, -16); add("horn2", 26.3, -22, -0.5)
for i in range(4): add("tick", 25.9 + i * 0.4, -17)
# 3 kaprao (B 27.95)
add("sizzle", 29.35, -24); add("clank", 29.6, -20, 0.4)
add("pop", 30.25, -16); add("pop", 30.85, -15); add("pop", 32.5, -15); add("gloop", 32.9, -14)
add("bonk", 34.75, -14); add("coin", 35.0, -15)
add("pop", 36.0, -15); add("blip", 36.7, -13)
add("bonk", 37.5, -13); add("beep", 38.2, -11); add("coin", 38.0, -15); add("coin", 38.6, -15)
# 4 store (B 38.9)
add("door", 39.0, -14); add("pop", 42.5, -15); add("pop", 42.8, -16); add("beep", 43.7, -11); add("coin", 43.8, -15)
add("pop", 44.65, -15); add("bonk", 46.25, -11); add("coin", 46.55, -15)
# 5 whole city (B 48.1)
for i in range(8): add("blip", 49.58 + i * 0.1, -13, (i % 3 - 1) * 0.6)
add("pop", 51.45, -15); add("beep", 51.7, -13, -0.4); add("pop", 53.45, -15); add("beep", 53.7, -13, 0.4)
add("whoosh", 55.6, -15); add("beep", 56.0, -12); add("buzz", 57.25, -16); add("pop", 57.35, -15)
for i, t in enumerate([50.2, 52.0, 54.0, 56.4]): add("coin", t, -16)
# 6 life changes (B 58.7)
add("boom", 61.0, -16)
for i in range(16): add("coin", 63.3 + i * 0.12 + (i % 4) * 0.15, -17, (i % 5 - 2) * 0.3)
add("ching", 62.8, -14); add("rev", 64.6, -10); add("horn2", 65.6, -17); add("pop", 65.3, -15)
add("pop", 67.37, -15); add("whoosh", 67.3, -18)
add("bonk", 68.6, -11); add("puff", 69.25, -14); add("boing", 69.35, -16)
# 7 piggy bank (B 71.4)
add("amb", 71.4, -28)
for i in range(3): add("coin", 73.54 + i * 0.12, -14)
for i in range(3): add("coin", 75.38 + 0.5 + i * 0.18, -13)
add("ting", 76.26, -10)
for i in range(6): add("blip", 76.93 + i * 0.16, -17)
add("beep", 78.37, -10); add("pop", 78.47, -15)

# ---------------- music bed ----------------
BPM = 116; beat = 60 / BPM
def pluck(f, d=0.5): return ev(f"(0.6*sin(2*PI*{f}*t)+0.25*sin(2*PI*{2*f}*t)+0.1*sin(2*PI*{3*f}*t))*exp(-7*t)", d)
def bass(f, d=0.4): return ev(f"(0.8*sin(2*PI*{f}*t)+0.2*sin(2*PI*{2*f}*t))*exp(-5*t)*(1-exp(-200*t))", d)
KICK = norm(ev("sin(2*PI*(50*t+90*exp(-30*t)/30*30))*exp(-9*t)", 0.35))
HAT = norm(noise("white", 0.06, "highpass=f=7000") * np.exp(-np.arange(int(0.06 * SR)) / SR * 70))
SNAP = norm(noise("white", 0.12, "bandpass=f=1800:width_type=h:w=1500") * np.exp(-np.arange(int(0.12 * SR)) / SR * 35))
mus = np.zeros(int(TOTAL * SR) + SR)
def put(buf, x, t, gain):
    i = int(t * SR)
    if i < 0 or i >= len(buf): return
    n = min(len(x), len(buf) - i); buf[i:i + n] += x[:n] * gain
prog = [(130.81, [523.25, 659.25, 783.99]), (146.83, [587.33, 698.46, 880.0]), (110.0, [440.0, 523.25, 659.25]), (98.0, [392.0, 493.88, 587.33])]
night = [(110.0, [440.0, 523.25, 659.25]), (87.31, [349.23, 440.0, 523.25])]
mel = [0, 2, 1, 2, 0, 1, 2, 0]
DROP0, DROP1 = 76.3, 78.47   # silence while the piggy bank boots, sting on the punchline
t = 0.0; bar = 0
while t < TOTAL - 0.8:
    home = t >= BOUNDS[7]
    root, ch = (night[bar % 2] if home else prog[bar % 4])
    for k in range(4):
        tb = t + k * beat
        if DROP0 - 0.05 < tb or tb > TOTAL - 1.4: break
        if not home:
            put(mus, KICK, tb, 0.55 if k in (0, 2) else 0.0)
            put(mus, SNAP, tb, 0.25 if k in (1, 3) else 0.0)
            put(mus, HAT, tb + beat / 2, 0.18)
        put(mus, bass(root if k != 3 else root * 1.5), tb, 0.45 if not home else 0.3)
        put(mus, pluck(ch[mel[(bar * 4 + k) % 8] % len(ch)]), tb + (beat / 2 if k % 2 else 0), 0.22)
    t += 4 * beat; bar += 1
for f in (261.63, 311.13, 392.0, 466.16): put(mus, pluck(f, 1.8), DROP1, 0.28)
mus[:int(0.6 * SR)] *= np.linspace(0, 1, int(0.6 * SR))
fade_n = int(0.8 * SR); end_i = int(TOTAL * SR); mus[end_i - fade_n:end_i] *= np.linspace(1, 0, fade_n); mus[end_i:] = 0

# ---------------- mix ----------------
sfxL = np.zeros_like(mus); sfxR = np.zeros_like(mus)
for name, t0, db, pan in EV:
    x = SFX[name]; gn = 10 ** (db / 20)
    put(sfxL, x, t0, gn * (1 if pan <= 0 else (1 - pan) ** 0.5))
    put(sfxR, x, t0, gn * (1 if pan >= 0 else (1 + pan) ** 0.5))
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", VOICE, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
voice = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
v = np.zeros_like(mus); v[:min(len(voice), len(v))] = voice[:len(v)]
win = int(0.03 * SR); rms = np.sqrt(np.convolve(v ** 2, np.ones(win) / win, mode="same"))
act = np.clip((20 * np.log10(rms + 1e-9) + 45) / 20, 0, 1)
step = 240; a = act[::step]; out = np.zeros_like(a); att = 1 - np.exp(-step / (0.03 * SR)); rel = 1 - np.exp(-step / (0.35 * SR)); c = 0
for i, x in enumerate(a): c += (x - c) * (att if x > c else rel); out[i] = c
duck = np.repeat(out, step)[:len(v)]
mus_g = 10 ** ((-1.0 - 9.0 * duck) / 20)
sfx_g = 10 ** ((-0.0 - 4.0 * duck) / 20)
music_level = 10 ** (-17 / 20) / (np.sqrt(np.mean(mus[:int(TOTAL * SR)] ** 2)) + 1e-9) * 0.12
n = int(TOTAL * SR)
bed = np.stack([(mus * music_level * mus_g + sfxL * sfx_g)[:n], (mus * music_level * mus_g + sfxR * sfx_g)[:n]], axis=1)
mix = bed + np.stack([v[:n], v[:n]], axis=1)
peak = np.max(np.abs(mix)); mix *= 0.95 / peak if peak > 0.95 else 1.0
tmp = os.path.join(lib["CACHE"], "tb-premix.f32"); mix.astype(np.float32).tofile(tmp)
mix_path = os.path.join(ROOT, "assets/audio/mix.wav")
m = subprocess.run(["ffmpeg", "-hide_banner", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", tmp, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
js = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
af = f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", tmp, "-af", af, "-ar", str(SR), "-c:a", "pcm_s16le", mix_path], check=True)
print("events", len(EV), "mix ->", mix_path, "premix I", js["input_i"])
