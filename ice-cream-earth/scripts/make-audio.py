#!/usr/bin/env python3
"""ice-cream-earth audio: voice-over + ffmpeg-synthesized SFX and music bed (ducked under the voice).
Voice: assets/audio/ice-cream-earth.wav. Output: assets/audio/mix.wav (stereo, -16 LUFS).
Event times match scripts/build-video.mjs.
Voice lines (s): 0.25-3.03 สมมติว่าตอนนี้ คุณอยู่ที่ขั้วโลกใต้ | 3.64-5.36 หยิบโคนไอติมออกมาจากกระเป๋า |
5.63-6.89 แล้ววางมันลงบนพื้น | 7.66-9.70 ทีนี้ ลองถอยออกมาดูไกล ๆ | 10.09-12.20 ในอวกาศไม่มีข้างบนข้างล่าง |
12.54-14.02 งั้น กลับหัวซะ | 14.74-17.39 ยินดีด้วย คุณเพิ่งได้ ไอศกรีมโลก | 17.76-18.81 เชอร์รี่ฟรีหนึ่งลูก"""
import json, os, subprocess, tempfile, hashlib
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
TOTAL = 20.0
VOICE = os.path.join(ROOT, "assets/audio/ice-cream-earth.wav")
CACHE = os.path.join(tempfile.gettempdir(), "ice-sfx-cache"); os.makedirs(CACHE, exist_ok=True)

def ff(graph, dur):
    key = hashlib.md5((graph + str(dur)).encode()).hexdigest()
    out = os.path.join(CACHE, key + ".f32")
    if not os.path.exists(out):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", graph, "-t", str(dur), "-ac", "1", "-ar", str(SR), "-f", "f32le", out], check=True)
    return np.fromfile(out, dtype=np.float32).astype(np.float64)
def ev(expr, dur): return ff(f"aevalsrc='{expr}':s={SR}:d={dur}", dur)
def noise(color, dur, chain="", seed=7): return ff(f"anoisesrc=color={color}:d={dur}:r={SR}:a=0.8:seed={seed}" + ("," + chain if chain else ""), dur)
def norm(x, peak=0.9): m = np.max(np.abs(x)) or 1; return x / m * peak
def env(n, a=0.005, r=0.1):
    t = np.arange(n) / SR; return np.clip(np.minimum(1, t / max(a, 1e-4)) * np.minimum(1, (n / SR - t) / max(r, 1e-4)), 0, 1)
def tt(x): return np.arange(len(x)) / SR

# ---------------- SFX ----------------
S = {}
w = noise("pink", 8.4, "bandpass=f=500:width_type=h:w=700,tremolo=f=0.35:d=0.6", seed=3)
S["wind"] = norm(w * env(len(w), 0.8, 0.5) + 0.4 * noise("white", 8.4, "highpass=f=3000,lowpass=f=6000,tremolo=f=0.23:d=0.8", seed=4) * env(len(w), 1.0, 0.5))
z = noise("white", 0.42, "highpass=f=1800,lowpass=f=7000"); t = tt(z)
S["zip"] = norm(z * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * (40 * t + 60 * t * t)))) * env(len(z), 0.01, 0.06))
S["sparkle"] = norm(np.sum([np.pad(ev(f"sin(2*PI*{f}*t)*exp(-6*t)", 0.9), (int(i * 0.07 * SR), int((4 - i) * 0.07 * SR))) for i, f in enumerate([2093, 2637, 3136, 3951, 4186])], axis=0))
wh = noise("pink", 0.6, "highpass=f=300,lowpass=f=6000"); t = tt(wh)
S["whoosh"] = norm(wh * np.sin(np.pi * np.clip(t / 0.6, 0, 1)) ** 2)
wb = noise("pink", 1.1, "highpass=f=150,lowpass=f=8000", seed=9); t = tt(wb)
S["bigwhoosh"] = norm(wb * (np.clip(t / 0.75, 0, 1) ** 2) * np.exp(-np.clip(t - 0.75, 0, None) * 9) + 0.6 * ev("sin(2*PI*(80*t+260*t*t))", 1.1) * (np.clip(t / 0.75, 0, 1) ** 3) * np.exp(-np.clip(t - 0.75, 0, None) * 12))
S["thud"] = norm(ev("sin(2*PI*(120*t-150*t*t))*exp(-16*t)", 0.35) + 0.7 * noise("white", 0.35, "bandpass=f=2500:width_type=h:w=3000", seed=5) * np.exp(-tt(np.zeros(int(0.35 * SR))) * 22))
S["crunch"] = norm(noise("white", 0.4, "highpass=f=1200,tremolo=f=38:d=0.9", seed=6) * np.exp(-tt(np.zeros(int(0.4 * SR))) * 9))
S["boing"] = norm(ev("sin(2*PI*(330*t+30*sin(2*PI*11*t)))*exp(-4.5*t)", 0.7))
S["pop"] = norm(ev("sin(2*PI*(260*t+1400*t*t))*exp(-22*t)", 0.18))
S["ping"] = norm(ev("0.6*sin(2*PI*1568*t)*exp(-9*t)+0.35*sin(2*PI*2349*t)*exp(-12*t)", 0.5))
S["drone"] = norm(ev("0.5*sin(2*PI*55*t)+0.3*sin(2*PI*82.4*t)+0.2*sin(2*PI*110.3*t)", 12.0) * env(int(12 * SR), 1.5, 1.5) + 0.25 * noise("brown", 12.0, "lowpass=f=200", seed=11) * env(int(12 * SR), 1.5, 1.5))
r = ev("0.6*sin(2*PI*(220*t+140*t*t))+0.3*sin(2*PI*(330*t+210*t*t))", 1.75); t = tt(r)
S["riser"] = norm(r * (t / 1.75) ** 1.5 * env(len(r), 0.05, 0.08) + 0.5 * noise("white", 1.75, "highpass=f=2000", seed=12) * (t / 1.75) ** 3)
S["aha"] = norm(np.sum([np.pad(ev(f"(sin(2*PI*{f}*t)+0.3*sin(2*PI*{2*f}*t))*exp(-3*t)", 1.6), (int(i * 0.06 * SR), int((3 - i) * 0.06 * SR))) for i, f in enumerate([523.25, 659.25, 783.99, 1046.5])], axis=0))
sh = noise("white", 1.35, "highpass=f=5000", seed=13); t = tt(sh)
S["shimmer"] = norm(sh * np.sin(np.pi * np.clip(t / 1.35, 0, 1)) * (0.6 + 0.4 * np.sin(2 * np.pi * 14 * t)) * 0.5 + np.sum([np.pad(ev(f"sin(2*PI*{f}*t)*exp(-5*t)", 0.8), (int(i * 0.05 * SR), int((11 - i) * 0.05 * SR))) for i, f in enumerate([1046.5, 1318.5, 1568, 2093, 2637, 3136, 2637, 3136, 3951, 4186, 5274, 6272])], axis=0)[:len(sh)] * 0.6)
S["boom"] = norm(ev("sin(2*PI*(70*t-30*t*t))*exp(-4*t)", 1.4) + 0.4 * noise("brown", 1.4, "lowpass=f=300", seed=14) * np.exp(-tt(np.zeros(int(1.4 * SR))) * 5))
S["ching"] = norm(ev("0.5*sin(2*PI*2637*t)*exp(-5*t)+0.4*sin(2*PI*3520*t)*exp(-6*t)+0.3*sin(2*PI*5274*t)*exp(-9*t)", 1.0))
S["cork"] = norm(ev("sin(2*PI*(500*t+2500*t*t))*exp(-30*t)", 0.12) + 0.4 * noise("white", 0.12, "highpass=f=3000", seed=15) * np.exp(-tt(np.zeros(int(0.12 * SR))) * 60))

EV = []
def add(n, t, db=-12, pan=0.0): EV.append((n, t, db, pan))
# times follow the voice lines (see VOICE_LINES)
add("wind", 0.0, -17)
add("pop", 0.35, -20); add("pop", 3.55, -20); add("pop", 5.65, -20)
add("zip", 3.35, -15, 0.4); add("whoosh", 3.4, -19, 0.5); add("sparkle", 4.1, -17, 0.2)
add("whoosh", 5.3, -19, 0.5); add("whoosh", 5.55, -17, 0.3)
add("thud", 6.61, -9); add("crunch", 6.62, -13); add("pop", 6.65, -16)
add("boing", 7.05, -15, -0.5)
add("bigwhoosh", 7.65, -8)
add("drone", 8.4, -21); add("boom", 8.4, -15)
add("ping", 9.95, -17); add("pop", 10.1, -18, 0.5); add("pop", 10.6, -20)
add("pop", 12.55, -19); add("riser", 12.9, -15); add("whoosh", 13.3, -20)
add("aha", 14.65, -15)
add("shimmer", 14.75, -12); add("boom", 16.4, -14); add("pop", 16.42, -15)
add("whoosh", 17.5, -15, 0.6); add("cork", 18.2, -11); add("pop", 18.21, -13, 0.4); add("ching", 18.23, -16)
for i in range(4): add("sparkle", 18.25 + i * 0.08, -26, (i % 2) * 0.8 - 0.4)

# ---------------- music ----------------
BPM = 120; beat = 60 / BPM
def pluck(f, d=0.5, k=7): return ev(f"(0.6*sin(2*PI*{f}*t)+0.25*sin(2*PI*{2*f}*t)+0.1*sin(2*PI*{3*f}*t))*exp(-{k}*t)", d)
def bell(f, d=1.2): return ev(f"(0.6*sin(2*PI*{f}*t)+0.3*sin(2*PI*{2.76*f}*t)*exp(-6*t)+0.15*sin(2*PI*{5.4*f}*t)*exp(-9*t))*exp(-3*t)", d)
def bass(f, d=0.45): return ev(f"(0.8*sin(2*PI*{f}*t)+0.2*sin(2*PI*{2*f}*t))*exp(-5*t)*(1-exp(-200*t))", d)
KICK = norm(ev("sin(2*PI*(50*t+90*exp(-30*t)))*exp(-9*t)", 0.35))
HAT = norm(noise("white", 0.06, "highpass=f=7000") * np.exp(-np.arange(int(0.06 * SR)) / SR * 70))
SNAP = norm(noise("white", 0.12, "bandpass=f=1800:width_type=h:w=1500") * np.exp(-np.arange(int(0.12 * SR)) / SR * 35))
N = int(TOTAL * SR) + SR
mus = np.zeros(N)
def put(buf, x, t, g):
    i = int(t * SR)
    if 0 <= i < len(buf): n = min(len(x), len(buf) - i); buf[i:i + n] += x[:n] * g
# polar: a sparse music box (F major pentatonic), curious and quiet
box = [(0.2, 698.46), (0.8, 880.0), (1.4, 1046.5), (2.0, 880.0), (3.4, 1174.66), (4.0, 1046.5), (4.6, 880.0), (6.62, 783.99), (7.1, 698.46), (7.6, 587.33)]
for t0, f in box: put(mus, bell(f), t0, 0.16)
# space: groove enters with the flash (8.4), half-time until the reveal, full from 14.75 to the moon landing
prog = [(87.31, [349.23, 440.0, 523.25]), (98.0, [392.0, 493.88, 587.33]), (110.0, [440.0, 523.25, 659.25]), (130.81, [523.25, 659.25, 783.99])]
mel = [0, 2, 1, 2, 0, 1, 2, 1]
END = 18.2
t = 8.4; bar = 0
while t < END:
    root, ch = prog[bar % 4]
    for k in range(4):
        tb = t + k * beat; full = tb >= 14.75
        if tb >= END - 0.05: continue
        if full or k == 0: put(mus, KICK, tb, 0.55 if (not full or k in (0, 2)) else 0)
        if full: put(mus, SNAP, tb, 0.25 if k in (1, 3) else 0); put(mus, HAT, tb + beat / 2, 0.18)
        put(mus, bass(root if k != 3 else root * 1.5), tb, 0.42 if full else 0.3)
        put(mus, pluck(ch[mel[(bar * 4 + k) % 8] % len(ch)] * (2 if full else 1)), tb + (beat / 2 if k % 2 else 0), 0.2)
    t += 4 * beat; bar += 1
for f in (349.23, 440.0, 523.25, 698.46, 880.0): put(mus, pluck(f, 1.8, 1.6), END, 0.22)
put(mus, KICK, END, 0.6)
fade = int(0.6 * SR); e = int(TOTAL * SR); mus[e - fade:e] *= np.linspace(1, 0, fade); mus[e:] = 0

L = np.zeros(N); R = np.zeros(N)
for n, t0, db, pan in EV:
    g = 10 ** (db / 20)
    put(L, S[n], t0, g * (1 if pan <= 0 else (1 - pan) ** 0.5)); put(R, S[n], t0, g * (1 if pan >= 0 else (1 + pan) ** 0.5))

# ---------------- voice + ducking ----------------
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", VOICE, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
voice = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
v = np.zeros(N); v[:min(len(voice), N)] = voice[:N]
win = int(0.03 * SR); rms = np.sqrt(np.convolve(v ** 2, np.ones(win) / win, mode="same"))
act = np.clip((20 * np.log10(rms + 1e-9) + 45) / 20, 0, 1)
step = 240; a = act[::step]; sm = np.zeros_like(a); att = 1 - np.exp(-step / (0.03 * SR)); rel = 1 - np.exp(-step / (0.35 * SR)); c = 0
for i, x in enumerate(a): c += (x - c) * (att if x > c else rel); sm[i] = c
duck = np.repeat(sm, step)[:N]; duck = np.pad(duck, (0, N - len(duck)))
mus_g = 10 ** ((-1.0 - 9.0 * duck) / 20)    # music about -10 dB under speech
sfx_g = 10 ** (-4.0 * duck / 20)            # sfx about -4 dB under speech
music_level = 10 ** (-15 / 20) / (np.sqrt(np.mean(mus[int(8.4 * SR):e] ** 2)) + 1e-9) * 0.12
vref = np.sqrt(np.mean(v[v != 0] ** 2)) + 1e-9
vg = 0.2 / vref                              # voice sits well above the bed
n = int(TOTAL * SR)
bedL = L * sfx_g + mus * music_level * mus_g; bedR = R * sfx_g + mus * music_level * mus_g
mix = np.stack([(bedL + v * vg)[:n], (bedR + v * vg)[:n]], axis=1)
pk = np.max(np.abs(mix)); mix = mix * (0.95 / pk if pk > 0.95 else 1)
pre = os.path.join(CACHE, "premix.f32"); mix.astype(np.float32).tofile(pre)
os.makedirs(os.path.join(ROOT, "assets/audio"), exist_ok=True)
out = os.path.join(ROOT, "assets/audio/mix.wav")
m = subprocess.run(["ffmpeg", "-hide_banner", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", pre, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
js = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
af = f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", pre, "-af", af, "-ar", str(SR), "-c:a", "pcm_s16le", out], check=True)
print("events", len(EV), "->", out, "premix I", js["input_i"])
