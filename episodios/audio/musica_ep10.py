"""Audio del Episodio 10 "Popcorn" (36 s).
Base: "Fluffing a Duck" Kevin MacLeod (incompetech.com), CC BY 4.0 — ver audio/canciones/CREDITOS.md.
Tiempo de vídeo v; tiempo de historia s = v - 2.9 (los primeros 2.9 s son el gancho + rebobinado).
La canción se alinea para que su pausa natural (30.4–31.35 s) caiga en el silencio antes del BOOM."""
import os, sys, subprocess, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *

HERE = os.path.dirname(os.path.abspath(__file__))
SONG = os.path.join(HERE, 'canciones', 'Fluffing a Duck - Kevin MacLeod.mp3')
OUT = os.path.join(os.path.dirname(HERE), 'salida', 'musica_ep10.wav')
DUR, OFF, SONG_AT = 36.0, 2.9, 3.9          # canción(v) = v + 3.9 (su pausa cae en el silencio antes del BOOM)
HOOK, HOOK_S0 = 2.4, 24.5; HOOK_K = (26.65 - HOOK_S0) / HOOK
HV = lambda s: (s - HOOK_S0) / HOOK_K       # historia -> vídeo dentro del gancho
X = Mix(DUR)
V = lambda s: s + OFF                       # historia -> vídeo

def load(path, extra=()):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, *extra, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, '<i2').reshape(-1, 2).astype(np.float64) / 32768
song = load(SONG)
song_lp = load(SONG, ['-af', 'lowpass=f=420,lowpass=f=420'])

# ---------- envolventes de la canción ----------
n = int(DUR * SR); tv = np.arange(n) / SR
def ramp(t, a, b): return np.clip((t - a) / (b - a), 0, 1)
SLOW1 = (V(24.75), V(24.95), V(28.4), V(28.6))     # cámara lenta grande
SLOW0 = (V(7.5), V(7.6), V(8.4), V(8.47))           # palomita en la nariz
lp = np.zeros(n)
lp = np.maximum(lp, ramp(tv, HV(24.75), HV(24.95)) * (1 - ramp(tv, 2.25, 2.4)))   # gancho (cámara lenta tras el BOOM)
for a, b, c, d in (SLOW0, SLOW1): lp = np.maximum(lp, ramp(tv, a, b) * (1 - ramp(tv, c, d)))
gain = np.full(n, .62)
gain *= 1 - .35 * lp
gain[tv < HV(24.6)] = 0                                                          # silencio tenso antes del BOOM
gain[(tv >= 2.4) & (tv < OFF)] = 0                                               # rebobinado (se sustituye)
gain *= 1 - ramp(tv, DUR - 1.4, DUR)                                             # fundido final
i0 = int(SONG_AT * SR)
seg_c = song[i0:i0 + n]; seg_l = song_lp[i0:i0 + n]
mixs = (seg_c * (1 - lp[:, None]) + seg_l * lp[:, None]) * gain[:, None]
X.buf[:len(mixs)] += mixs

# ---------- rebobinado: la canción hacia atrás y muy rápida ----------
a = int((SONG_AT + 3.0) * SR); chunk = song[a:a + int(5.5 * SR)][::-1][::11]
k = np.linspace(0, 1, len(chunk))[:, None]
X.buf[int(2.4 * SR):int(2.4 * SR) + len(chunk)] += chunk * .55 * np.minimum(1, (1 - k) * 8)
tt = np.arange(int(.5 * SR)) / SR
X.add(np.sin(2 * np.pi * np.cumsum(900 - 600 * tt / .5 + 120 * np.sin(2 * np.pi * 30 * tt)) / SR) * .15 + np.diff(rng.standard_normal(len(tt) + 1)) * .06, 2.4, .6)
X.add(pop(1800, 400, .08), OFF - .01, .4)

# ---------- utilidades ----------
def lp_noise(m, a):
    s = rng.standard_normal(m); o = np.zeros(m); y = 0
    for i in range(m): y += a * (s[i] - y); o[i] = y
    return o
def kpop(pitch=1.0):                         # "pop" de palomita: chasquido + golpe hueco
    m = int(.09 * SR); t = np.arange(m) / SR
    body = np.sin(2 * np.pi * np.cumsum(900 * pitch * np.exp(-t / .02) + 200 * pitch) / SR) * np.exp(-t / .025)
    click = np.zeros(m); click[:int(.003 * SR)] = rng.standard_normal(int(.003 * SR)) * .8
    return body * .7 + click
def slow(sig, f=3):                           # versión "cámara lenta": más grave y larga
    idx = np.arange(0, len(sig) - 1, 1 / f); return np.interp(idx, np.arange(len(sig)), sig)
def crunch():
    m = int(.07 * SR); return np.diff(rng.standard_normal(m + 1)) * (rng.random(m) > .6) * np.exp(-np.arange(m) / SR / .02) * .6
def clank():
    m = int(.9 * SR); t = np.arange(m) / SR
    return sum(np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, d in [(520, .35), (1240, .2), (1870, .12), (2730, .08)]) * .3
def chirp(f0, f1, d=.07):
    m = int(d * SR); t = np.arange(m) / SR
    return np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, m)) / SR) * np.sin(np.pi * t / d) * .5
def boom():
    m = int(1.6 * SR); t = np.arange(m) / SR
    return (np.sin(2 * np.pi * np.cumsum(38 + 90 * np.exp(-t / .12)) / SR) * np.exp(-t / .5) + lp_noise(m, .08) * 5 * np.exp(-t / .3)) * .9
def giggle(t0, n=5, base=1700):
    for k in range(n): X.add(chirp(base + 300 * (k % 2), base + 600, .06), t0 + k * .12, .22, .2)

# ---------- GANCHO (vídeo 0–2.4: historia 24.5–26.65): Mochi en la olla… ¡BOOM! y vuelo a cámara lenta ----------
for k in range(4): X.add(kpop(.9 + k * .05), .0 + k * .025, .3, (-1) ** k * .4)   # la olla a punto de estallar
X.add(boom(), HV(24.6), 1.0); X.add(crash(), HV(24.6), .35); X.add(whoosh(.5), HV(24.62), .7)
X.add(slow(whoosh(.6), 4), HV(24.85), .55)
for k in range(12): X.add(slow(kpop(.8 + (k * .37) % 1 * .4), 3), HV(24.9) + k * .13, .18, (-1) ** k * .5)
for g in (25.75, 26.45): X.add(slow(chirp(500, 250, .12), 2.5), HV(g), .3)   # tragos a cámara lenta

# ---------- 1 (s 0–4.6): Pip hace palomitas ----------
for i in range(3): X.add(pop(2600, 2200, .04), V(.62 + i * .18), .25)       # granitos al fondo de la olla
X.add(clank() * .4, V(1.3), .35)
for i, t in enumerate([2.4, 2.9, 3.15]): X.add(kpop(1 + i * .1), V(t), .55, .2); X.add(clank() * .15, V(t + .04), .3)
X.add(boing(.2, 600, 1100), V(2.45), .3)
X.add(clank() * .3, V(3.42), .3); X.add(kpop(1.2), V(3.5), .55); X.add(whoosh(.25), V(3.5), .25)
for k in range(5): X.add(crunch(), V(4.2 + k * .09), .45)

# ---------- 2 (s 4.6–10.2): se asoma… ¡BONK! ----------
for k in range(5): X.add(pizz(hz(['E3', 'G3'][k % 2]), .2), V(4.7 + k * .26), .3)
for k in range(2): X.add(lp_noise(int(.09 * SR), .6) * np.hanning(int(.09 * SR)) * 1.5, V(5.4 + k * .13), .35)
X.add(chirp(400, 700, .2), V(6.3), .2)
X.add(kpop(1.1), V(7.3), .6)
X.add(slow(kpop(.9), 6), V(7.55), .7); X.add(slow(whoosh(.4), 3), V(7.6), .4); X.add(slow(chime(hz('C6')), 2), V(7.7), .25)
X.add(boing(.35, 150, 900), V(8.45), .7); X.add(thud(), V(8.45), .7); X.add(crash(), V(8.45), .15)
X.add(thud(), V(8.87), .6)
for k, n2 in enumerate(['G6', 'E6', 'G6', 'E6', 'C6']): X.add(chime(hz(n2)), V(8.95 + k * .17), .2)
giggle(V(9.0), 6, 1900)

# ---------- 3 (s 10.2–15.5): cazarlas al vuelo ----------
for c in (10.6, 12.0, 13.25): X.add(kpop(1.05), V(c), .55)
X.add(boing(.25, 300, 700), V(11.05), .55)                         # rebota en la nariz
X.add(pop(900, 1500, .06), V(12.5), .4); X.add(boing(.15, 700, 1000), V(12.55), .3)   # se queda en la oreja
X.add(thud() * .5, V(13.7), .5); X.add(pop(2500, 2500, .02), V(13.7), .4)             # ¡ñac! falla
X.add(pop(700, 500, .05), V(14.0), .4)                              # cae en la cabeza de Pip
for k in range(6): X.add(crunch(), V(14.65 + k * .12), .4)
X.add(slide(hz('G4'), hz('C4'), .7), V(14.5), .12)                 # Mochi triste

# ---------- 4 (s 15.5–20): el saco ----------
X.add(chime(hz('C7')), V(15.68), .45); X.add(chime(hz('G7')), V(15.75), .3)
X.add(whoosh(.35), V(16.25), .8); X.add(slide(500, 2200, .25), V(16.25), .25)
for k in range(5): X.add(thud(), V(16.8 + k * .14), .45)            # pasos pesados con el saco
m = int(1.05 * SR); rain = np.zeros(m)
for k in range(260): i = int(rng.random() * (m - 2000)); q = pop(2400 + rng.random() * 1600, 1800, .04); rain[i:i + len(q)] += q * (.3 + rng.random() * .7)
X.add(rain * .35, V(17.5), .7)                                      # granos cayendo
giggle(V(17.6), 6, 2300)                                            # "¡no, no, no!" de Pip
X.add(whoosh(.4), V(18.6), .5); X.add(clank(), V(19.05), .7); X.add(boing(.25, 250, 600), V(19.3), .35); X.add(thud(), V(19.55), .7)

# ---------- 5 (s 20–24.6): tiembla… silencio ----------
m = int((23.62 - 20.0) * SR); t = np.arange(m) / SR; amp = np.clip(t / (m / SR), 0, 1) ** 1.5
X.add(lp_noise(m, .03) * 7 * (.2 + amp) + np.sin(2 * np.pi * 48 * t) * .25 * amp, V(20.0), .55)
for k in range(28):
    tt0 = 20.3 + 3.3 * (k / 28) ** .7
    X.add(kpop(.9 + (k % 3) * .1), V(tt0), .25 + .25 * k / 28, (-1) ** k * .4)
    if k % 2: X.add(clank() * .12, V(tt0 + .02), .3)
X.add(lp_noise(int(1.8 * SR), .5) * .8 * np.linspace(.2, 1, int(1.8 * SR)), V(21.8), .25)   # silbido de vapor
for k in range(8): X.add(pizz(hz('C6'), .05), V(20.6 + k * .07), .2)                       # Pip corre
X.add(pop(1800, 900, .05), V(22.7), .3)                                                     # gota de sudor
X.add(chirp(600, 200, .25), V(24.2), .35)                                                   # trago de saliva
X.add(pop(3000, 3000, .02), V(24.45), .3)                                                   # "tic"
# ---------- 6 (s 24.6–29.6): ¡BOOM! ----------
X.add(boom(), V(24.6), 1.0); X.add(crash(), V(24.6), .35); X.add(whoosh(.5), V(24.62), .7)
X.add(slow(whoosh(.6), 4), V(24.85), .55)
for k in range(22): X.add(slow(kpop(.7 + (k % 5) * .1), 3), V(24.9 + k * .16), .16, (-1) ** k * .6)
for g in (25.75, 26.45, 27.1, 27.75): X.add(slow(chirp(500, 250, .12), 2.5), V(g), .35)
X.add(slide(hz('C6'), hz('C4'), .45), V(28.4), .25)
LAND_S = None
G, VUP, P0y = 28.0, np.sqrt(2 * 28 * 5.9), .72
def rate(s): return 1 if s < 24.75 else (1 - .8 * (s - 24.75) / .2 if s < 24.95 else (.2 if s < 28.4 else (.2 + .8 * (s - 28.4) / .2 if s < 28.6 else 1)))
p, s = 0, 24.6
target = 2.25 * (1 - (np.hypot(-.2, 1.6) / 3.4) ** 2) ** .8 - .15
while s < 32:
    p += rate(s) * .001; s += .001
    if p > .7 and P0y + VUP * p - G * p * p / 2 < target: LAND_S = s; break
X.add(thud(), V(LAND_S), 1.0); X.add(lp_noise(int(.5 * SR), .2) * 3 * np.exp(-np.arange(int(.5 * SR)) / SR / .15), V(LAND_S), .6)
for k in range(10): X.add(kpop(1 + (k % 4) * .1), V(LAND_S + .1 + k * .09), .2, (-1) ** k * .5)

# ---------- 7 (s 29.6–33): montaña ----------
X.add(pop(400, 900, .08), V(29.95), .5); X.add(lp_noise(int(.3 * SR), .3) * np.hanning(int(.3 * SR)) * 2, V(29.95), .3)
X.add(pop(300, 700, .1), V(30.4), .55); X.add(lp_noise(int(.4 * SR), .2) * np.hanning(int(.4 * SR)) * 2, V(30.4), .3)
for k in range(10): X.add(crunch(), V(30.55 + k * .11), .35)
X.add(chirp(700, 1700, .09), V(31.65), .55); X.add(kpop(1.3), V(31.67), .45)                # ¡hic!
X.add(pop(600, 450, .06), V(32.15), .4)                                                     # cae en la cabeza de Pip
giggle(V(32.2), 6, 1500)
for k, n2 in enumerate(['C6', 'E6', 'G6', 'C7']): X.add(chime(hz(n2)), 33.4 + k * .06, .35)   # aparece el letrero de la serie

X.save(OUT, fade=.05); print('ok', round(LAND_S, 3))
