"""Audio del Episodio 12 "Jelly" (35 s).
Base: "Pixel Peeker Polka - faster" Kevin MacLeod (incompetech.com), CC BY 4.0 — ver audio/canciones/CREDITOS.md.
Tiempo de vídeo v; historia s = v - 2.9. canción(v) = v - 0.45 (arranca con el ¡BOING! del gancho).
La canción no tiene pausas en este tramo: el silencio cómico antes del súper bote se hace cortándola."""
import os, sys, subprocess
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *

HERE = os.path.dirname(os.path.abspath(__file__))
SONG = os.path.join(HERE, 'canciones', 'Pixel Peeker Polka - faster - Kevin MacLeod.mp3')
OUT = os.path.join(os.path.dirname(HERE), 'salida', 'musica_ep12.wav')
DUR, OFF, SONG_AT = 35.0, 2.9, -.45
HOOK, HOOK_S0 = 2.4, 20.55; HOOK_K = (23.0 - HOOK_S0) / HOOK
HV = lambda s: (s - HOOK_S0) / HOOK_K
V = lambda s: s + OFF
FREEZE, LAUNCH = 20.4, 21.0
# mismos cálculos que ep12.js (cámara lenta y caídas)
def rate(s):
    a0, a1, b0, b1 = LAUNCH + .08, LAUNCH + .25, 24.0, 24.2
    return 1 if s < a0 else (1 - .8 * (s - a0) / (a1 - a0) if s < a1 else (.2 if s < b0 else (.2 + .8 * (s - b0) / (b1 - b0) if s < b1 else 1)))
def first(cond):
    p, s = 0, LAUNCH
    while s < 32:
        p += rate(s) * .001; s += .001
        if cond(p): return s
    return 99
G = 26; VUP = np.sqrt(2 * G * 4.6)
DROP_S = first(lambda u: u > .3 and VUP * u - G * u * u / 2 <= 0)
PIP_LANDS = first(lambda u: u >= 1.25)
X = Mix(DUR)

def load(path, extra=()):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, *extra, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, '<i2').reshape(-1, 2).astype(np.float64) / 32768
song = load(SONG); song_lp = load(SONG, ['-af', 'lowpass=f=450,lowpass=f=450'])
n = int(DUR * SR); tv = np.arange(n) / SR
def ramp(t, a, b): return np.clip((t - a) / (b - a), 0, 1)
lp = np.maximum(ramp(tv, HV(LAUNCH + .08), HV(LAUNCH + .25)) * (1 - ramp(tv, 2.25, 2.4)), ramp(tv, V(LAUNCH + .08), V(LAUNCH + .25)) * (1 - ramp(tv, V(24.0), V(24.2))))
gain = np.full(n, .55) * (1 - .35 * lp)
gain[(tv >= 2.4) & (tv < OFF)] = 0
gain *= 1 - .95 * ((tv > V(FREEZE)) & (tv < V(LAUNCH)))        # silencio cómico
gain *= 1 - ramp(tv, DUR - 1.4, DUR)
idx = np.clip(np.round((tv + SONG_AT) * SR).astype(int), 0, len(song) - 1); valid = (tv + SONG_AT) >= 0
X.buf[:n] += (song[idx] * (1 - lp[:, None]) + song_lp[idx] * lp[:, None]) * (gain * valid)[:, None]
a = int(4.0 * SR); chunk = song[a:a + int(5.5 * SR)][::-1][::11]; k = np.linspace(0, 1, len(chunk))[:, None]
X.buf[int(2.4 * SR):int(2.4 * SR) + len(chunk)] += chunk * .5 * np.minimum(1, (1 - k) * 8)
tt = np.arange(int(.5 * SR)) / SR
X.add(np.sin(2 * np.pi * np.cumsum(900 - 600 * tt / .5 + 120 * np.sin(2 * np.pi * 30 * tt)) / SR) * .15 + np.diff(rng.standard_normal(len(tt) + 1)) * .06, 2.4, .6)
X.add(pop(1800, 400, .08), OFF - .01, .4)

def lp_noise(m, a):
    s = rng.standard_normal(m); o = np.zeros(m); y = 0
    for i in range(m): y += a * (s[i] - y); o[i] = y
    return o
def blub(f=180, d=.25):                       # bamboleo de gelatina
    m = int(d * SR); t = np.arange(m) / SR
    return np.sin(2 * np.pi * np.cumsum(f * (1 + .35 * np.sin(2 * np.pi * 14 * t) * np.exp(-t / .1))) / SR) * np.exp(-t / (d * .4)) * .6
def jboing(f0=180, f1=520, d=.3):            # bote en gelatina
    return boing(d, f0, f1) * .8 + blub(f0 * .8, d) * .5
def splat(big=1.0):
    m = int(.5 * SR); t = np.arange(m) / SR
    return (lp_noise(m, .35) * 4 * np.exp(-t / (.07 * big)) + np.sin(2 * np.pi * np.cumsum(70 + 180 * np.exp(-t / .04)) / SR) * np.exp(-t / .14)) * .6
def creak(d):                                 # goma estirándose al agacharse
    m = int(d * SR); t = np.arange(m) / SR
    f = 120 * (1 + t / d * .6) * (1 + .05 * np.sin(2 * np.pi * 23 * t))
    return (np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .2 + lp_noise(m, .2) * .8) * np.minimum(1, t / .1) * np.minimum(1, (d - t) / .05) * .4
def slow(sig, f=3):
    i = np.arange(0, len(sig) - 1, 1 / f); return np.interp(i, np.arange(len(sig)), sig)
def chirp(f0, f1, d=.07):
    m = int(d * SR); t = np.arange(m) / SR
    return np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, m)) / SR) * np.sin(np.pi * t / d) * .5
def giggle(t0, nn=5, base=1800):
    for k in range(nn): X.add(chirp(base + 300 * (k % 2), base + 600, .06), t0 + k * .12, .22, .2)
def squelch(d=.12, f=240):
    m = int(d * SR); t = np.arange(m) / SR
    return (lp_noise(m, .25) * 3 + np.sin(2 * np.pi * np.cumsum(f * (1 + .3 * np.sin(2 * np.pi * 18 * t))) / SR) * .4) * np.sin(np.pi * t / d) * .5
def hopsnd(t0, dur, f=1.0, g=.45):           # despegue y aterrizaje de hop() (mismo cálculo que ep12.js)
    X.add(jboing(220 * f, 500 * f, .22), V(t0 + .12), g * .6); X.add(jboing(160 * f, 420 * f, .3), V(t0 + .12 + dur), g)

# ---------- GANCHO ----------
X.add(creak(.4), 0, .4)
X.add(jboing(90, 700, .6), HV(LAUNCH), 1.0); X.add(crash(), HV(LAUNCH), .25); X.add(slow(whoosh(.6), 3), HV(LAUNCH + .05), .6)
X.add(slow(chirp(1500, 2600, .3), 3), HV(LAUNCH + .3), .3)
# ---------- 1 ----------
X.add(blub(260, .3), V(.6), .45)
for t0, d in [(1.0, .4), (1.75, .45), (2.55, .5)]: hopsnd(t0, d, 1.6, .4)
giggle(V(1.8), 6, 2000)
# ---------- 2 ----------
for k in range(5): X.add(pizz(hz(['E3', 'G3'][k % 2]), .2), V(4.6 + k * .22), .3)
for k, n2 in enumerate(['C6', 'G6', 'C7']): X.add(chime(hz(n2)), V(5.95) + k * .05, .35)
hopsnd(5.8, .4, 1.6, .3)
for k in range(3): X.add(pizz(hz('C3'), .2), V(6.5 + k * .17), .3)
X.add(splat(1.4), V(7.15), 1.0); X.add(blub(120, .4), V(7.17), .6)
X.add(chirp(2400, 3200, .12), V(7.3), .4)
for k, n2 in enumerate(['E4', 'Eb4', 'D4', 'Db4']): X.add(whistle(hz(n2), .24 if k < 3 else .55, vib=9), V(8.4 + k * .26), .22)
# ---------- 3 ----------
X.add(chime(hz('C7')), V(10.18), .45); X.add(whoosh(.35), V(10.45), .8); X.add(slide(500, 2200, .25), V(10.45), .25)
for k in range(4): X.add(thud(), V(10.95 + k * .1), .35)
X.add(thud(), V(11.35), .9); X.add(crash(), V(11.35), .15)
X.add(whoosh(.4), V(11.6), .5)
for k, n2 in enumerate(['C5', 'E5', 'G5', 'C6', 'E6', 'G6']): X.add(musicbox(hz(n2)), V(11.7 + k * .07), .25)
X.add(blub(150, .5), V(11.65), .6); X.add(chirp(900, 1900, .3), V(11.9), .35)
X.add(chime(hz('G6')), V(12.15), .3)
hopsnd(13.1, .55, 1.0, .6)
# ---------- 4 ----------
for t0, d, f in [(14.05, .45, 1.0), (15.0, .62, 1.15), (15.95, .82, 1.3), (17.15, .95, 1.5)]: hopsnd(t0, d, f, .65)
for t0, d in [(15.85, .45), (16.6, .4), (17.3, .4), (18.0, .4), (18.7, .4)]: hopsnd(t0, d, 2.0, .25)
giggle(V(16.7), 8, 2100)
X.add(creak(.8), V(18.5), .5)
# ---------- 5 ----------
X.add(jboing(80, 700, .6), V(LAUNCH), 1.0); X.add(crash(), V(LAUNCH), .25); X.add(slow(whoosh(.6), 3), V(LAUNCH + .05), .6)
X.add(slow(chirp(1500, 2600, .3), 3), V(LAUNCH + .3), .3)
X.add(pop(2500, 2500, .02), V(23.3), .3)
X.add(slide(hz('C6'), hz('C4'), .35), V(24.2), .3)
X.add(splat(1.6), V(DROP_S), 1.0); X.add(blub(90, .8), V(DROP_S + .02), .8)
X.add(thud() * .5, V(PIP_LANDS), .5)
for k, n2 in enumerate(['G6', 'E6', 'G6', 'E6']): X.add(chime(hz(n2)), V(PIP_LANDS + .15 + k * .17), .18)
# ---------- 6 ----------
for k in range(4): X.add(pizz(hz(['G5', 'A5'][k % 2]), .1), V(26.8 + k * .1), .2)
X.add(pop(3000, 3000, .02), V(27.3), .25)
for k in range(3): X.add(pizz(hz(['G5', 'A5'][k % 2]), .1), V(27.5 + k * .1), .2)
X.add(blub(240, .3), V(27.9), .5); X.add(boing(.15, 600, 900), V(27.9), .2)
X.add(squelch(.2, 200), V(28.7), .5)
for k in range(5): X.add(squelch(.1, 260), V(29.2 + k * .14), .3)
for k in range(7): X.add(squelch(.12, 140) * .6, V(29.3 + k * .16), .25)       # Mochi masticando dentro
X.add(pop(400, 1200, .1), V(30.45), .7); X.add(blub(200, .4), V(30.47), .5)
for k, n2 in enumerate(['C6', 'E6', 'G6']): X.add(chime(hz(n2)), V(30.6 + k * .08), .25)
giggle(V(30.8), 6, 2000)
for k in range(5): X.add(squelch(.08, 400), V(31.0 + k * .13), .25)
for k, n2 in enumerate(['C6', 'E6', 'G6', 'C7']): X.add(chime(hz(n2)), 32.3 + k * .06, .35)
X.save(OUT, fade=.05); print('ok', round(DROP_S, 3), round(PIP_LANDS, 3))
