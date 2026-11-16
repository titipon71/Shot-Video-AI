#!/usr/bin/env python3
"""bang-dubai audio: FFmpeg-synthesized SFX + light music bed, ducked under voice-tight.wav.
All sounds are generated here (ffmpeg aevalsrc / anoisesrc); no third-party audio.
Output: assets/audio/bed-sfx.wav (music+sfx stem) and renders/bang-dubai-v1-mix.wav (final mix, -16 LUFS)."""
import json, os, subprocess, tempfile, hashlib
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
TOTAL = 98.0
VOICE = os.path.join(ROOT, "assets/voice/voice-tight.wav")
CACHE = os.path.join(tempfile.gettempdir(), "bd-sfx-cache"); os.makedirs(CACHE, exist_ok=True)
L = {l["id"]: l for l in json.load(open(os.path.join(ROOT, "assets/voice/lines-tight.json")))}
BOUNDS = [0, 12.017, 26.042, 39.629, 53.937, 68.426, 83.441, 91.143]
def S(i): return L[i]["start"]
def E(i): return L[i]["end"]

def ff(filtergraph, dur):
    """Render an ffmpeg lavfi graph to a float mono array (cached)."""
    key = hashlib.md5((filtergraph + str(dur)).encode()).hexdigest()
    out = os.path.join(CACHE, key + ".f32")
    if not os.path.exists(out):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", filtergraph, "-t", str(dur), "-ac", "1", "-ar", str(SR), "-f", "f32le", out], check=True)
    return np.fromfile(out, dtype=np.float32).astype(np.float64)

def ev(expr, dur):
    return ff(f"aevalsrc='{expr}':s={SR}:d={dur}", dur)

def noise(color, dur, chain=""):
    return ff(f"anoisesrc=color={color}:d={dur}:r={SR}:a=0.8:seed=7" + ("," + chain if chain else ""), dur)

def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1; return x / m * peak

def env(n, a=0.005, r=0.1):
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)) * np.minimum(1, (n / SR - t) / max(r, 1e-4)); return np.clip(e, 0, 1)

# ---------------- SFX library (all ffmpeg-generated) ----------------
SFX = {}
SFX["rumble"] = norm(noise("brown", 2.4, "lowpass=f=110,volume=2") * env(int(2.4 * SR), 0.3, 0.6) + 0.5 * ev("sin(2*PI*38*t)*(0.6+0.4*sin(2*PI*7*t))", 2.4) * env(int(2.4 * SR), 0.4, 0.6))
SFX["crack"] = norm(noise("white", 0.35, "highpass=f=900,afade=t=out:st=0.01:d=0.33") + 0.6 * ev("sin(2*PI*90*t)*exp(-12*t)", 0.35))
g = noise("pink", 7.0, "bandpass=f=700:width_type=h:w=1400,tremolo=f=7:d=0.35")
SFX["gush"] = norm(g * env(len(g), 0.15, 1.5) + 0.7 * noise("brown", 7.0, "lowpass=f=160") * env(len(g), 0.1, 1.5))
SFX["gushloop"] = norm(noise("pink", 28.0, "bandpass=f=600:width_type=h:w=1000,tremolo=f=6:d=0.3") * env(int(28 * SR), 0.6, 1.0))
w = noise("pink", 0.6, "highpass=f=300,lowpass=f=7000")
t = np.arange(len(w)) / SR; SFX["whoosh"] = norm(w * (np.sin(np.pi * np.clip(t / 0.6, 0, 1)) ** 2))
SFX["horn"] = norm(ev("0.3*sgn(sin(2*PI*415*t))+0.3*sgn(sin(2*PI*523*t))", 0.38) * env(int(0.38 * SR), 0.01, 0.06))
SFX["horn2"] = norm(ev("0.3*sgn(sin(2*PI*349*t))+0.3*sgn(sin(2*PI*440*t))", 0.5) * env(int(0.5 * SR), 0.01, 0.08))
SFX["horn3"] = norm(ev("0.3*sgn(sin(2*PI*466*t))+0.25*sgn(sin(2*PI*587*t))", 0.25) * env(int(0.25 * SR), 0.01, 0.05))
for k in ("horn", "horn2", "horn3"):  # soften the square edge
    SFX[k] = np.convolve(SFX[k], np.ones(6) / 6, mode="same")
SFX["ping"] = norm(ev("0.6*sin(2*PI*1568*t)*exp(-9*t)+0.35*sin(2*PI*2349*t)*exp(-12*t)", 0.5))
SFX["pop"] = norm(ev("sin(2*PI*(260*t+1400*t*t))*exp(-22*t)", 0.18))
SFX["poplow"] = norm(ev("sin(2*PI*(140*t+500*t*t))*exp(-18*t)", 0.22))
SFX["bonk"] = norm(ev("sin(2*PI*(220*t-200*t*t))*exp(-20*t)+0.3*sin(2*PI*660*t)*exp(-30*t)", 0.2))
SFX["megaphone"] = norm(ff(f"aevalsrc='(0.6*sgn(sin(2*PI*(180+40*sin(2*PI*5*t))*t))+0.4*sin(2*PI*360*t))*(0.6+0.4*sgn(sin(2*PI*6*t)))':s={SR}:d=1.1,bandpass=f=1400:width_type=h:w=1800,acrusher=bits=6:mix=0.5", 1.1) * env(int(1.1 * SR), 0.02, 0.15))
SFX["alarm"] = norm(ev("0.5*sgn(sin(2*PI*880*t))*(lt(mod(t,0.24),0.14))", 1.0) * env(int(1.0 * SR), 0.005, 0.05))
SFX["alarm"] = np.convolve(SFX["alarm"], np.ones(8) / 8, mode="same")
SFX["ching"] = norm(ev("0.5*sin(2*PI*2637*t)*exp(-5*t)+0.4*sin(2*PI*3520*t)*exp(-6*t)+0.3*sin(2*PI*5274*t)*exp(-9*t)", 1.0) + 0.3 * noise("white", 1.0, "highpass=f=4000,afade=t=out:st=0:d=0.05"))
SFX["coin"] = norm(ev("0.5*sin(2*PI*3136*t)*exp(-14*t)+0.3*sin(2*PI*4186*t)*exp(-18*t)", 0.3))
jet = noise("pink", 2.8, "bandpass=f=1800:width_type=h:w=2400"); t = np.arange(len(jet)) / SR
SFX["jet"] = norm(jet * np.exp(-((t - 1.4) / 0.6) ** 2))
tr = noise("brown", 1.6, "lowpass=f=500") + 0.5 * ev("sgn(sin(2*PI*9*t))*0.3*exp(-30*mod(t,0.111))", 1.6); t = np.arange(len(tr)) / SR
SFX["train"] = norm(tr * np.exp(-((t - 0.8) / 0.45) ** 2))
SFX["tuktuk"] = norm(ff(f"aevalsrc='0.6*(2*mod(55*t,1)-1)*exp(-18*mod(t,0.075))':s={SR}:d=2.6,lowpass=f=900", 2.6) * env(int(2.6 * SR), 0.2, 0.5))
SFX["rise"] = norm(ev("sin(2*PI*(50*t+60*t*t))*0.8", 1.2) * env(int(1.2 * SR), 0.1, 0.4) + 0.6 * noise("brown", 1.2, "lowpass=f=200") * env(int(1.2 * SR), 0.2, 0.4))
SFX["chime"] = norm(np.sum([np.pad(ev(f"sin(2*PI*{f}*t)*exp(-4*t)", 1.2), (int(i * 0.09 * SR), int((3 - i) * 0.09 * SR))) for i, f in enumerate([1568, 1976, 2349, 3136])], axis=0))
SFX["shutter"] = norm(np.concatenate([noise("white", 0.04, "highpass=f=2000"), np.zeros(int(0.05 * SR)), noise("white", 0.05, "highpass=f=1500")]) * 1.0)
SFX["puff"] = norm(noise("pink", 0.9, "lowpass=f=900") * env(int(0.9 * SR), 0.2, 0.6))
SFX["clank"] = norm(ev("0.5*sin(2*PI*523*t)*exp(-10*t)+0.4*sin(2*PI*1187*t)*exp(-14*t)+0.3*sin(2*PI*1781*t)*exp(-18*t)", 0.5) + 0.4 * noise("white", 0.5, "highpass=f=2500,afade=t=out:st=0:d=0.03"))
SFX["boing"] = norm(ev("sin(2*PI*(300*t+80*sin(2*PI*9*t)/(2*PI*9)*40))*exp(-4*t)", 0.7))
SFX["news"] = norm(np.concatenate([ev("0.5*sin(2*PI*988*t)*exp(-6*t)+0.3*sin(2*PI*1976*t)*exp(-8*t)", 0.22), ev("0.5*sin(2*PI*740*t)*exp(-5*t)+0.3*sin(2*PI*1480*t)*exp(-7*t)", 0.5)]))
SFX["gloop"] = norm(ev("sin(2*PI*(600*t-900*t*t))*exp(-14*t)", 0.25))
SFX["rev"] = norm(ff(f"aevalsrc='0.6*(2*mod((80+260*t*t)*t,1)-1)':s={SR}:d=1.3,lowpass=f=2200", 1.3) * env(int(1.3 * SR), 0.1, 0.5))
SFX["paper"] = norm(noise("white", 1.2, "highpass=f=2500,tremolo=f=22:d=0.8") * env(int(1.2 * SR), 0.1, 0.5))
SFX["boom"] = norm(ev("sin(2*PI*(70*t-30*t*t))*exp(-3.5*t)", 1.6) + 0.5 * noise("brown", 1.6, "lowpass=f=300") * np.exp(-np.arange(int(1.6 * SR)) / SR * 4))
SFX["gong"] = norm(ev("0.5*sin(2*PI*196*t)*exp(-1.2*t)+0.35*sin(2*PI*293*t)*exp(-1.6*t)+0.3*sin(2*PI*415*t)*exp(-2*t)+0.2*sin(2*PI*622*t)*exp(-2.6*t)", 2.0))
SFX["tick"] = norm(ev("sin(2*PI*2400*t)*exp(-60*t)", 0.05))
SFX["amb"] = norm(noise("brown", 12.0, "lowpass=f=380") * env(int(12 * SR), 0.6, 0.8))
SFX["buzz"] = norm(ev("0.4*sgn(sin(2*PI*120*t))*(gt(sin(2*PI*14*t),0))", 0.6) * env(int(0.6 * SR), 0.01, 0.05))

# ---------------- timeline of SFX events (global seconds, gain dB, pan -1..1) ----------------
EV = []
def add(name, t, db=-12, pan=0.0): EV.append((name, t, db, pan))
# scene 0
add("amb", 0.0, -24); add("train", 0.6, -20, -0.4); add("horn3", 0.8, -22, 0.6); add("horn2", 2.1, -24, -0.5); add("pop", 0.15, -16)
add("rumble", S("L02"), -9); add("crack", S("L02") + 1.3, -10); add("crack", S("L02") + 1.5, -14, 0.4)
add("gush", S("L02") + 1.9, -8); add("boom", S("L02") + 1.9, -12)
add("horn", S("L02") + 2.1, -18, -0.6); add("horn2", S("L02") + 2.3, -18, 0.6)
add("pop", S("L02") + 3.3, -16); add("pop", S("L03") + 0.9, -15)
for i in range(16): add("tick", S("L03") + 1.1 + (1 - (i / 16) ** 0.6) * 0 + sum(0.18 * (0.88 ** k) for k in range(i)), -16)
# scene transitions
for b in BOUNDS[1:]: add("whoosh", b - 0.32, -11)
add("gushloop", BOUNDS[1], -24)
# scene 1
add("pop", BOUNDS[1] + 0.1, -16); add("pop", S("L05"), -14); add("puff", S("L06"), -14)
for i, (h, p) in enumerate([("horn", -0.6), ("horn2", 0.5), ("horn3", -0.2), ("horn", 0.7), ("horn2", -0.7), ("horn3", 0.3), ("horn", 0.0), ("horn2", 0.6), ("horn3", -0.5)]):
    add(h, S("L07") + i * 0.09, -17, p)
for i in range(8): add("ping", S("L08") + 0.4 + i * 0.34, -18, 0.5)
add("pop", S("L09"), -15); add("whoosh", S("L09") + 0.3, -19); add("horn2", S("L09") + 1.7, -17)
# scene 2
b = BOUNDS[2]; add("pop", b + 0.1, -16); add("gushloop", b, -24)
for i in range(10): add("bonk", S("L11") + (i % 5) * 0.08 + (0.03 if i >= 5 else 0), -17, -0.5 if i < 5 else 0.5)
add("pop", S("L11") + 1.2, -15); add("news", S("L12"), -13); add("pop", S("L12") + 1.2, -14); add("ching", S("L12") + 1.3, -18)
add("tuktuk", S("L13") - 0.1, -18, -0.5)
for i in range(4): add("gloop", S("L13") + 1.4 + i * 0.12, -17)
add("puff", S("L14") + 0.3, -20, -0.5)
add("megaphone", S("L15") + 0.45, -10, 0.4); add("clank", S("L15") + 0.6, -16)
add("alarm", S("L16"), -12); add("pop", S("L16") + 0.05, -13)
# scene 3
b = BOUNDS[3]; add("pop", b + 0.1, -16); add("gushloop", b, -27)
for d in (0.5, 0.8, 1.1, 1.6, 2.0): add("shutter", S("L18") + d, -16, 0.4)
add("rise", S("L18") + 1.0, -17); add("news", S("L19") - 0.1, -13)
for i in range(4): add("pop", S("L20") + i * 0.3, -17)
add("jet", S("L21") - 0.6, -12, 0.0)
add("pop", S("L22"), -15); add("ching", S("L22") + 0.4, -14); add("ching", S("L22") + 2.0, -14)
for i in range(10): add("coin", S("L22") + 0.3 + i * 0.08, -20, (i % 3 - 1) * 0.5)
add("whoosh", S("L25") - 0.1, -17); add("chime", S("L25") + 0.2, -14)
# scene 4
b = BOUNDS[4]; add("pop", b + 0.1, -16)
add("rise", S("L27"), -19); add("train", S("L27"), -21)
for i in range(4): add("pop", S("L28") + 0.5 + i * 0.25, -16)
add("boing", S("L28") + 1.7, -15)
for i in range(6): add("clank", S("L29") + 0.3 + i * 0.38 + 0.2, -15, (i % 2) * 0.4 - 0.2)
add("pop", S("L29") + 2.7, -15)
add("train", S("L30") + 0.2, -9); add("whoosh", S("L30") + 0.3, -13); add("pop", S("L30") + 0.6, -13)
add("pop", S("L31") + 0.4, -14)
for i in range(6): add("shutter", S("L31") + 1.0 + i * 0.22, -17, (i % 3 - 1) * 0.5)
# scene 5
b = BOUNDS[5]; add("pop", b + 0.1, -16)
add("train", S("L33") - 0.4, -17); add("ping", S("L33") + 0.45, -14)
for i in range(16): add("poplow", S("L34") + i * 0.06, -22)
add("horn", S("L34") + 1.1, -18, -0.5); add("horn3", S("L34") + 1.3, -18, 0.5)
add("pop", S("L35"), -14); add("ching", S("L35") + 0.15, -13)
for i in range(12): add("coin", S("L35") + 0.2 + i * 0.05, -20, (i % 3 - 1) * 0.6)
add("pop", S("L36"), -14); add("pop", S("L36") + 0.45, -14); add("ping", S("L36") + 0.5, -18)
add("paper", S("L37") - 0.1, -16)
add("pop", S("L38"), -14)
for i in range(6): add("poplow", S("L38") + 0.35 + i * 0.15, -16)
for i in range(3): add("ping", S("L38") + 0.6 + i * 0.3, -17)
add("horn2", S("L39") + 0.3, -16, -0.4); add("horn", S("L39") + 0.5, -17, 0.5)
add("rev", S("L40") + 0.2, -13); add("chime", S("L40") + 0.4, -14); add("ching", S("L40") + 1.0, -17)
# scene 6
b = BOUNDS[6]; add("pop", b + 0.05, -16)
add("pop", S("L42") + 0.05, -15); add("boom", S("L42") + 1.3, -14); add("chime", S("L42") + 1.4, -15)
add("tuktuk", S("L43"), -13, -0.3); add("puff", S("L43") + 0.9, -19)
add("rise", S("L44"), -11); add("rumble", S("L44"), -16)
# scene 7
b = BOUNDS[7]; add("rise", b + 0.1, -12); add("boom", b + 0.9, -14); add("chime", b + 1.0, -13)
add("buzz", S("L46") + 0.1, -22); add("pop", S("L47") - 0.1, -14)
for i in range(4): add("shutter", S("L47") + 0.4 + i * 0.25, -17, (i % 2) * 0.8 - 0.4)
tT = E("L47") - 0.35
add("whoosh", tT, -12); add("boom", tT + 0.75, -10); add("gong", tT + 0.75, -11); add("chime", tT + 1.0, -14)

# ---------------- music bed (ffmpeg-synth one-shots, numpy arrangement) ----------------
BPM = 112; beat = 60 / BPM
def pluck(f, d=0.5): return ev(f"(0.6*sin(2*PI*{f}*t)+0.25*sin(2*PI*{2*f}*t)+0.1*sin(2*PI*{3*f}*t))*exp(-7*t)", d)
def bass(f, d=0.4): return ev(f"(0.8*sin(2*PI*{f}*t)+0.2*sin(2*PI*{2*f}*t))*exp(-5*t)*(1-exp(-200*t))", d)
KICK = norm(ev("sin(2*PI*(50*t+90*exp(-30*t)/30*30))*exp(-9*t)", 0.35))
HAT = norm(noise("white", 0.06, "highpass=f=7000") * np.exp(-np.arange(int(0.06 * SR)) / SR * 70))
SNAP = norm(noise("white", 0.12, "bandpass=f=1800:width_type=h:w=1500") * np.exp(-np.arange(int(0.12 * SR)) / SR * 35))
mus = np.zeros(int(TOTAL * SR) + SR)
def put(buf, x, t, gain):
    i = int(t * SR); 
    if i < 0 or i >= len(buf): return
    n = min(len(x), len(buf) - i); buf[i:i + n] += x[:n] * gain
# chord roots per bar (C major pentatonic feel); Hijaz flavour after scene 6
prog = [(130.81, [523.25, 659.25, 783.99]), (110.0, [440.0, 523.25, 659.25]), (87.31, [349.23, 440.0, 523.25]), (98.0, [392.0, 493.88, 587.33])]
hijaz = [(130.81, [523.25, 554.37, 659.25, 783.99]), (130.81, [698.46, 659.25, 554.37, 523.25])]
mel = [0, 2, 1, 2, 0, 1, 2, 1]
crack_t, back_t = S("L02") + 1.3, S("L03")
t = 0.0; bar = 0
while t < TOTAL - 0.8:
    gold = t >= BOUNDS[6]
    root, ch = (hijaz[bar % 2] if gold else prog[bar % 4])
    for k in range(4):
        tb = t + k * beat
        if crack_t - 0.05 < tb < back_t: continue  # musical drop when the road cracks
        if tb > TOTAL - 1.4: break
        put(mus, KICK, tb, 0.55 if k in (0, 2) else 0.0)
        put(mus, SNAP, tb, 0.25 if k in (1, 3) else 0.0)
        put(mus, HAT, tb + beat / 2, 0.18)
        put(mus, bass(root if k != 3 else root * 1.5), tb, 0.45)
        put(mus, pluck(ch[mel[(bar * 4 + k) % 8] % len(ch)]), tb + (beat / 2 if k % 2 else 0), 0.22)
    t += 4 * beat; bar += 1
# final chord on the title
for f in (261.63, 329.63, 392.0, 523.25): put(mus, pluck(f, 1.6), tT + 0.75, 0.25)
mus[:int(1.0 * SR)] *= np.linspace(0, 1, int(1.0 * SR))
fade_n = int(0.8 * SR); end_i = int(TOTAL * SR); mus[end_i - fade_n:end_i] *= np.linspace(1, 0, fade_n); mus[end_i:] = 0

# ---------------- mix ----------------
sfxL = np.zeros_like(mus); sfxR = np.zeros_like(mus)
for name, t0, db, pan in EV:
    x = SFX[name]; g = 10 ** (db / 20)
    put(sfxL, x, t0, g * (1 if pan <= 0 else (1 - pan) ** 0.5))
    put(sfxR, x, t0, g * (1 if pan >= 0 else (1 + pan) ** 0.5))
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", VOICE, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
voice = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
v = np.zeros_like(mus); v[:len(voice)] = voice[:len(v)]
# voice envelope -> ducking gain (attack 30 ms, release 350 ms)
win = int(0.03 * SR); rms = np.sqrt(np.convolve(v ** 2, np.ones(win) / win, mode="same"))
act = np.clip((20 * np.log10(rms + 1e-9) + 45) / 20, 0, 1)
step = 240; a = act[::step]; out = np.zeros_like(a); att = 1 - np.exp(-step / (0.03 * SR)); rel = 1 - np.exp(-step / (0.35 * SR)); c = 0
for i, x in enumerate(a): c += (x - c) * (att if x > c else rel); out[i] = c
duck = np.repeat(out, step)[:len(v)]
mus_g = 10 ** ((-1.0 - 9.0 * duck) / 20)     # music: about -10 dB under speech
sfx_g = 10 ** ((-0.0 - 4.0 * duck) / 20)     # sfx: about -4 dB under speech
music_level = 10 ** (-17 / 20) / (np.sqrt(np.mean(mus[:int(TOTAL * SR)] ** 2)) + 1e-9) * 0.12
bedL = mus * music_level * mus_g + sfxL * sfx_g
bedR = mus * music_level * mus_g + sfxR * sfx_g
n = int(TOTAL * SR)
bed = np.stack([bedL[:n], bedR[:n]], axis=1)
os.makedirs(os.path.join(ROOT, "assets/audio"), exist_ok=True)
bed_path = os.path.join(ROOT, "assets/audio/bed-sfx.wav")
pre = os.path.join(CACHE, "premix.f32")
mix = bed + np.stack([v[:n], v[:n]], axis=1)
peak = np.max(np.abs(mix)); scale = 0.95 / peak if peak > 0.95 else 1.0
(bed * scale).astype(np.float32).tofile(os.path.join(CACHE, "bed.f32"))
(mix * scale).astype(np.float32).tofile(pre)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", os.path.join(CACHE, "bed.f32"), "-c:a", "pcm_s16le", bed_path], check=True)
os.makedirs(os.path.join(ROOT, "renders"), exist_ok=True)
mix_path = os.path.join(ROOT, "renders/bang-dubai-v1-mix.wav")
# two-pass loudnorm to -16 LUFS / -1.5 dBTP
m = subprocess.run(["ffmpeg", "-hide_banner", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", pre, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
js = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
af = f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", pre, "-af", af, "-ar", str(SR), "-c:a", "pcm_s16le", mix_path], check=True)
print("events", len(EV), "bed ->", bed_path, "mix ->", mix_path, "premix I", js["input_i"])
