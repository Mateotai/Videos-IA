"""Audio del Episodio 11 "Bubble gum" (35 s).
Base: "Monkeys Spinning Monkeys" Kevin MacLeod (incompetech.com), CC BY 4.0 — ver audio/canciones/CREDITOS.md.
Tiempo de vídeo v; historia s = v - 2.9. canción(v) = v - 0.4 → su pausa (23.7–24.75 s) cae en el silencio
justo antes de que Pip pinche el globo, y la música vuelve con el ¡POP!"""
import os, sys, subprocess
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *

HERE = os.path.dirname(os.path.abspath(__file__))
SONG = os.path.join(HERE, 'canciones', 'Monkeys Spinning Monkeys - Kevin MacLeod.mp3')
OUT = os.path.join(os.path.dirname(HERE), 'salida', 'musica_ep11.wav')
DUR, OFF, SONG_AT = 35.0, 2.9, -.4
HOOK, HOOK_S0 = 2.4, 21.95; HOOK_K = (24.5 - HOOK_S0) / HOOK
HV = lambda s: (s - HOOK_S0) / HOOK_K         # historia -> vídeo dentro del gancho
V = lambda s: s + OFF                         # historia -> vídeo
POKE, FREEZE, FALL = 22.3, 21.85, 25.7
X = Mix(DUR)

def load(path, extra=()):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, *extra, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, '<i2').reshape(-1, 2).astype(np.float64) / 32768
song = load(SONG); song_lp = load(SONG, ['-af', 'lowpass=f=420,lowpass=f=420'])
n = int(DUR * SR); tv = np.arange(n) / SR
def ramp(t, a, b): return np.clip((t - a) / (b - a), 0, 1)
lp = np.maximum(ramp(tv, HV(22.35), HV(22.5)) * (1 - ramp(tv, 2.25, 2.4)), ramp(tv, V(22.35), V(22.5)) * (1 - ramp(tv, V(25.5), V(FALL))))
gain = np.full(n, .7) * (1 - .35 * lp)
gain[tv < HV(POKE)] = 0                                   # gancho: silencio tenso hasta el ¡POP!
gain[(tv >= 2.4) & (tv < OFF)] = 0                        # rebobinado
gain *= 1 - .85 * ((tv > V(FREEZE)) & (tv < V(POKE)))     # silencio cómico
gain *= 1 - ramp(tv, DUR - 1.4, DUR)
idx = np.clip(np.round((tv + SONG_AT) * SR).astype(int), 0, len(song) - 1); valid = (tv + SONG_AT) >= 0
mixs = (song[idx] * (1 - lp[:, None]) + song_lp[idx] * lp[:, None]) * (gain * valid)[:, None]
X.buf[:n] += mixs
# rebobinado
a = int((V(0) + 2.0 + SONG_AT) * SR); chunk = song[a:a + int(5.5 * SR)][::-1][::11]; k = np.linspace(0, 1, len(chunk))[:, None]
X.buf[int(2.4 * SR):int(2.4 * SR) + len(chunk)] += chunk * .55 * np.minimum(1, (1 - k) * 8)
tt = np.arange(int(.5 * SR)) / SR
X.add(np.sin(2 * np.pi * np.cumsum(900 - 600 * tt / .5 + 120 * np.sin(2 * np.pi * 30 * tt)) / SR) * .15 + np.diff(rng.standard_normal(len(tt) + 1)) * .06, 2.4, .6)
X.add(pop(1800, 400, .08), OFF - .01, .4)

# ---------- sonidos ----------
def lp_noise(m, a):
    s = rng.standard_normal(m); o = np.zeros(m); y = 0
    for i in range(m): y += a * (s[i] - y); o[i] = y
    return o
def squelch(d=.12, f=240):                    # chicle masticado
    m = int(d * SR); t = np.arange(m) / SR
    return (lp_noise(m, .25) * 3 + np.sin(2 * np.pi * np.cumsum(f * (1 + .3 * np.sin(2 * np.pi * 18 * t))) / SR) * .4) * np.sin(np.pi * t / d) * .5
def chew(t0, dur, rate=4.5, g=.3):
    for k in range(int(dur * rate)): X.add(squelch(.1 + .04 * (k % 2), 200 + 60 * (k % 3)), t0 + k / rate, g)
def stretch(d, f0, f1, wob=6):                # globo que se infla: goma estirada
    m = int(d * SR); t = np.arange(m) / SR
    f = f0 * (f1 / f0) ** (t / d) * (1 + .03 * np.sin(2 * np.pi * wob * t))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) + .35 * np.sin(4 * np.pi * np.cumsum(f) / SR) + lp_noise(m, .3) * .8
    return s * np.minimum(1, t / .1) * np.minimum(1, (d - t) / .08) * .35
def gpop(size=1.0):                           # ¡pop! de chicle
    m = int(.35 * SR); t = np.arange(m) / SR
    body = np.sin(2 * np.pi * np.cumsum(140 / size + 900 / size * np.exp(-t / .015)) / SR) * np.exp(-t / (.05 * size))
    snap = lp_noise(m, .6) * 3 * np.exp(-t / .012)
    return (body + snap) * .7
def splat():
    m = int(.5 * SR); t = np.arange(m) / SR
    return (lp_noise(m, .35) * 4 * np.exp(-t / .08) + np.sin(2 * np.pi * np.cumsum(90 + 200 * np.exp(-t / .04)) / SR) * np.exp(-t / .12)) * .6
def slow(sig, f=3):
    i = np.arange(0, len(sig) - 1, 1 / f); return np.interp(i, np.arange(len(sig)), sig)
def chirp(f0, f1, d=.07):
    m = int(d * SR); t = np.arange(m) / SR
    return np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, m)) / SR) * np.sin(np.pi * t / d) * .5
def giggle(t0, nn=5, base=1800):
    for k in range(nn): X.add(chirp(base + 300 * (k % 2), base + 600, .06), t0 + k * .12, .22, .2)
def clank():
    m = int(.9 * SR); t = np.arange(m) / SR
    return sum(np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, d in [(1650, .3), (2470, .2), (3900, .1)]) * .25

# ---------- GANCHO (vídeo 0–2.4: historia 21.95–24.5) ----------
X.add(pop(3200, 3200, .02), HV(POKE) - .03, .4)              # "tic" del tenedor
X.add(gpop(2.2), HV(POKE), 1.0); X.add(crash(), HV(POKE), .3); X.add(slow(whoosh(.6), 3), HV(POKE) + .05, .6)
for k in range(10): X.add(slow(splat() * .3, 3), HV(22.5) + k * .2, .12, (-1) ** k * .5)

# ---------- 1 (s 0–4.5) ----------
chew(V(0), 1.0, 4.5, .28)
X.add(stretch(1.4, 300, 700), V(1.1), .35); X.add(gpop(.6), V(2.64), .7); giggle(V(2.8), 4, 2000)
X.add(chime(hz('E6')), V(3.1), .25); chew(V(4.1), .4, 4.5, .25)
# ---------- 2 (s 4.5–10) ----------
for k in range(5): X.add(pizz(hz(['E3', 'G3'][k % 2]), .2), V(4.6 + k * .2), .3)
for k, n2 in enumerate(['C6', 'G6', 'C7']): X.add(chime(hz(n2)), V(5.75) + k * .05, .35)
X.add(whoosh(.3), V(6.0), .5)
for k in range(5): X.add(pop(900 + k * 120, 600, .05), V(6.35 + k * .1 + .26), .35)
X.add(chirp(500, 200, .25), V(7.0), .5); X.add(whoosh(.4), V(7.15), .4)
giggle(V(6.3), 6, 2400)                                        # "¡noo!" de Pip
chew(V(7.3), 1.5, 5, .45)
X.add(stretch(.25, 300, 380), V(9.25), .3); X.add(lp_noise(int(.2 * SR), .4) * np.hanning(int(.2 * SR)) * 2, V(9.5), .4); X.add(gpop(.4), V(9.57), .35)   # "pfff"
X.add(slide(hz('G4'), hz('D4'), .4), V(9.7), .1)
# ---------- 3 (s 10–15) ----------
X.add(stretch(1.25, 280, 760), V(10.3), .4); X.add(gpop(1.1), V(11.55), .85); X.add(splat(), V(11.57), .5)
giggle(V(11.9), 5, 2000)
X.add(stretch(.7, 160, 420, 14), V(12.25), .35); X.add(gpop(.8) * .5, V(12.95), .6); X.add(splat(), V(12.96), .6)   # ¡zas! vuelve a la cara
giggle(V(13.15), 5, 2100)
for k in range(4): X.add(chirp(300, 250, .08), V(13.3 + k * .1), .2)
m = int(.9 * SR); X.add(lp_noise(m, .2) * 3 * np.linspace(.1, 1, m) ** 2, V(13.9), .35)   # coge aire
# ---------- 4 (s 15–22.3) ----------
X.add(stretch(4.8, 200, 520, 3), V(15.1), .45)
for k, n2 in enumerate(['C5', 'E5', 'G5', 'C6', 'E6']): X.add(musicbox(hz(n2)), V(17.6 + k * .12), .2)   # ¡despega!
X.add(slide(hz('E5'), hz('C5'), .5), V(18.6), .15)
for k in range(5): X.add(pizz(hz('C6'), .05), V(18.85 + k * .1), .2)
X.add(clank() * .6, V(19.62), .4)
for k in range(4): X.add(pizz(hz('D6'), .05), V(19.95 + k * .08), .2)
X.add(boing(.2, 500, 1000), V(20.38), .3); X.add(thud(), V(20.62), .3)
for k in range(3): X.add(chirp(260, 180, .1), V(21.6 + k * .09), .3)        # Mochi: "no, no, no"
X.add(chime(hz('A6')), V(FREEZE + .1), .2)                                  # sonrisa traviesa de Pip
X.add(pop(3200, 3200, .02), V(POKE - .03), .4)
# ---------- 5 (s 22.3–27.6): ¡POP! ----------
X.add(gpop(2.2), V(POKE), 1.0); X.add(crash(), V(POKE), .3); X.add(slow(whoosh(.6), 3), V(POKE + .05), .55)
for k in range(14): X.add(slow(splat() * .3, 3), V(22.5 + k * .2), .12, (-1) ** k * .5)
X.add(pop(2500, 2500, .02), V(25.38), .3)                                   # parpadeo a cámara
X.add(slide(hz('C6'), hz('C4'), .35), V(FALL), .3)
LAND_S = 26.0     # = FALL + sqrt(2·1.32/30) (como en ep11.js)
X.add(splat(), V(LAND_S), 1.0); X.add(thud(), V(LAND_S), .8)
X.add(clank(), V(26.85), .4)
# ---------- 6 (s 27.6–32.1) ----------
X.add(thud() * .4, V(27.2), .3)
for k in range(6): X.add(pizz(hz(['G5', 'A5'][k % 2]), .1), V(27.7 + k * .12), .2)
chew(V(28.6), .45, 4.5, .25)
X.add(stretch(1.15, 320, 760), V(29.05), .35); X.add(gpop(.6), V(30.2), .7); X.add(splat() * .3, V(30.26), .4)
X.add(boing(.25, 400, 900), V(30.5), .3); giggle(V(30.55), 6, 2000)
X.add(lp_noise(int(.6 * SR), .15) * np.hanning(int(.6 * SR)) * 2, V(31.3), .3)    # suspiro
for k, n2 in enumerate(['C6', 'E6', 'G6', 'C7']): X.add(chime(hz(n2)), 32.3 + k * .06, .35)   # letrero
X.save(OUT, fade=.05); print('ok')
