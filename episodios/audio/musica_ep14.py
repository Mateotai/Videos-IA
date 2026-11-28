"""Audio del Episodio 14 "Christmas tree" (35 s).
Base: "Jingle Bells" Kevin MacLeod (incompetech.com), CC BY 4.0 — ver audio/canciones/CREDITOS.md.
Tiempo de vídeo v; historia s = v - 2.9. canción(v) = v."""
import os, sys, subprocess
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *

HERE = os.path.dirname(os.path.abspath(__file__))
SONG = os.path.join(HERE, 'canciones', 'Jingle Bells - Kevin MacLeod.mp3')
OUT = os.path.join(os.path.dirname(HERE), 'salida', 'musica_ep14.wav')
DUR, OFF = 35.0, 2.9
HOOK, HOOK_S0 = 2.4, 21.25; HOOK_K = (23.65 - HOOK_S0) / HOOK
HV = lambda s: (s - HOOK_S0) / HOOK_K
V = lambda s: s + OFF
HANG, POUNCE, BONKP = 1.55, 7.45, 7.95
GIVE, CLIMB0, CLIMB1, POP, PLACE = 11.25, 11.7, 13.6, 13.75, 14.35
FREEZE, FALL = 19.9, 20.5
SL0, SL1 = FALL + .3, 23.6
OUTB, PLUG, EARO = 26.6, 28.6, 29.9
def rate(s):
    return 1 if s < SL0 else (1 - .8 * (s - SL0) / .15 if s < SL0 + .15 else (.2 if s < SL1 else (.2 + .8 * (s - SL1) / .15 if s < SL1 + .15 else 1)))
def first(target):
    p, s = 0, FALL
    while s < 32:
        p += rate(s) * .001; s += .001
        if p >= target: return s
    return 99
TREE_LAND = first(1.05); LAUNCH = first(.9); BOXLAND = LAUNCH + .55
X = Mix(DUR)

def load(path, extra=()):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, *extra, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, '<i2').reshape(-1, 2).astype(np.float64) / 32768
song = load(SONG); song_lp = load(SONG, ['-af', 'lowpass=f=500,lowpass=f=500'])
n = int(DUR * SR); tv = np.arange(n) / SR
def ramp(t, a, b): return np.clip((t - a) / (b - a), 0, 1)
lp = np.maximum(ramp(tv, HV(SL0), HV(SL0 + .15)) * (1 - ramp(tv, 2.25, 2.4)), ramp(tv, V(SL0), V(SL0 + .15)) * (1 - ramp(tv, V(SL1), V(SL1 + .15))))
gain = np.full(n, 1.45) * (1 - .35 * lp)
gain[(tv >= 2.4) & (tv < OFF)] = 0
gain *= 1 - .95 * ((tv > V(FREEZE)) & (tv < V(FALL)))
gain *= 1 - ramp(tv, DUR - 1.4, DUR)
idx = np.clip(np.round(tv * SR).astype(int), 0, len(song) - 1)
X.buf[:n] += (song[idx] * (1 - lp[:, None]) + song_lp[idx] * lp[:, None]) * gain[:, None]
a = int(6 * SR); chunk = song[a:a + int(5.5 * SR)][::-1][::11] * 1.4; k = np.linspace(0, 1, len(chunk))[:, None]
X.buf[int(2.4 * SR):int(2.4 * SR) + len(chunk)] += chunk * .5 * np.minimum(1, (1 - k) * 8)
tt = np.arange(int(.5 * SR)) / SR
X.add(np.sin(2 * np.pi * np.cumsum(900 - 600 * tt / .5 + 120 * np.sin(2 * np.pi * 30 * tt)) / SR) * .15 + np.diff(rng.standard_normal(len(tt) + 1)) * .06, 2.4, .6)
X.add(pop(1800, 400, .08), OFF - .01, .4)

def lp_noise(m, a):
    s = rng.standard_normal(m); o = np.zeros(m); y = 0
    for i in range(m): y += a * (s[i] - y); o[i] = y
    return o
def bell(f, d=.6):
    m = int(d * SR); t = np.arange(m) / SR
    return sum(np.sin(2 * np.pi * f * r * t) * np.exp(-t / (d * w)) for r, w in [(1, .5), (2.76, .25), (5.4, .12), (8.9, .06)]) * .3
def jingle(t0, n=6, g=.25):
    for k in range(n): X.add(bell(2600 + (k % 3) * 400, .25), t0 + k * .05 + rnd_(k) * .03, g, (-1) ** k * .4)
def rnd_(k): return (np.sin(k * 127.1 + 311.7) * 43758.5453) % 1
def ting(f=2200): return bell(f, .9)
def chirp(f0, f1, d=.07):
    m = int(d * SR); t = np.arange(m) / SR
    return np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, m)) / SR) * np.sin(np.pi * t / d) * .5
def giggle(t0, nn=5, base=1800):
    for k in range(nn): X.add(chirp(base + 300 * (k % 2), base + 600, .06), t0 + k * .12, .22, .2)
def creak(d):
    m = int(d * SR); t = np.arange(m) / SR; f = 90 + 40 * np.sin(2 * np.pi * .7 * t)
    return (np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .15 + lp_noise(m, .1) * 1.5) * (.5 + .5 * np.sin(2 * np.pi * 11 * t)) * np.minimum(1, t / .2) * np.minimum(1, (d - t) / .2) * .5
def rustle(d):
    m = int(d * SR); t = np.arange(m) / SR
    return lp_noise(m, .6) * 1.2 * (.5 + .5 * np.abs(np.sin(2 * np.pi * 6 * t))) * np.minimum(1, t / .1) * np.minimum(1, (d - t) / .1)
def slow(sig, f=3):
    i = np.arange(0, len(sig) - 1, 1 / f); return np.interp(i, np.arange(len(sig)), sig)
def crashbig():
    m = int(1.2 * SR); t = np.arange(m) / SR
    return (lp_noise(m, .05) * 8 * np.exp(-t / .3) + np.sin(2 * np.pi * np.cumsum(45 + 80 * np.exp(-t / .1)) / SR) * np.exp(-t / .4)) * .8
def yowl():
    m = int(.7 * SR); t = np.arange(m) / SR; f = 500 + 900 * np.sin(np.pi * t / .7) ** .5
    return (np.sin(2 * np.pi * np.cumsum(f * (1 + .04 * np.sin(2 * np.pi * 9 * t))) / SR) + .3 * np.sin(4 * np.pi * np.cumsum(f) / SR)) * np.sin(np.pi * t / .7) * .4
fire = lp_noise(n, .12) * .6 + (rng.random(n) > .9993) * rng.standard_normal(n) * 1.5     # chimenea crepitando
X.buf[:n, 0] += fire * .12; X.buf[:n, 1] += fire * .12

# ---------- GANCHO ----------
X.add(slow(creak(.8), 2), 0, .5); X.add(slow(whoosh(.7), 3), .05, .6)
for k in range(12): X.add(slow(bell(2400 + (k % 4) * 500, .3), 2.5), .15 + k * .17, .14, (-1) ** k * .5)
X.add(slow(yowl(), 2), HV(21.5), .3)
# ---------- 1 ----------
for k in range(5): X.add(pizz(hz(['G5', 'A5'][k % 2]), .1), V(.15 + k * .14), .2)
X.add(ting(2600), V(HANG), .45); jingle(V(HANG + .05), 4, .15)
for k, n2 in enumerate(['C6', 'E6', 'G6']): X.add(chime(hz(n2)), V(2.45 + k * .07), .3)
# ---------- 2 ----------
for k in range(5): X.add(pizz(hz(['E3', 'G3'][k % 2]), .2), V(4.6 + k * .22), .3)
for k, n2 in enumerate(['C6', 'G6', 'C7', 'E7']): X.add(chime(hz(n2)), V(5.85) + k * .06, .3)        # hipnosis
X.add(slide(hz('C5'), hz('G5'), .6), V(6.1), .1); X.add(slide(hz('G5'), hz('C5'), .6), V(6.7), .1)
X.add(boing(.3, 200, 600), V(POUNCE), .4); X.add(whoosh(.3), V(POUNCE + .05), .4)
X.add(ting(3000), V(BONKP), .6); X.add(boing(.25, 700, 300), V(BONKP + .02), .3)
for k in range(6): X.add(whistle(hz(['C6', 'E6', 'G6', 'E6', 'C6', 'D6'][k]), .18), V(8.9 + k * .16), .12)     # silba disimulando
# ---------- 3 ----------
for k in range(4): X.add(boing(.1, 600 + k * 40, 900), V(10.5 + k * .25), .15)
X.add(chime(hz('A6')), V(GIVE), .3)
X.add(rustle(CLIMB1 - CLIMB0), V(CLIMB0), .3); jingle(V(CLIMB0 + .3), 10, .12); jingle(V(12.8), 8, .12)
X.add(pop(600, 1100, .1), V(POP), .5)
for k, n2 in enumerate(['C6', 'E6', 'G6', 'C7']): X.add(bell(hz(n2) * 2, .8), V(PLACE + k * .08), .25)
X.add(crash() * .4, V(PLACE), .2)
for k in range(6): X.add(lp_noise(int(.05 * SR), .5) * np.hanning(int(.05 * SR)) * 3, V(PLACE + .3 + k * .18), .25)   # aplausos de Pip
# ---------- 4 ----------
X.add(creak(1.4), V(16.4), .6); X.add(creak(1.2), V(18.0), .7); X.add(creak(1.0), V(19.2), .8)
for k in range(6): X.add(pizz(hz('C6'), .06), V(18.6 + k * .1), .2)
X.add(chirp(600, 250, .25), V(FREEZE + .25), .35)                     # trago
# ---------- 5 ----------
X.add(creak(.4), V(FALL), .8); X.add(whoosh(.5), V(FALL + .1), .6)
X.add(slow(whoosh(.7), 3), V(SL0), .5); X.add(slow(yowl(), 2), V(21.3), .35)
for k in range(16): X.add(slow(bell(2400 + (k % 4) * 500, .3), 2.5), V(21.0) + k * .17, .12, (-1) ** k * .5)
X.add(crashbig(), V(TREE_LAND), 1.0); jingle(V(TREE_LAND + .02), 12, .2)
X.add(whistle(hz('C6'), .25), V(LAUNCH), .12); X.add(slide(hz('C6'), hz('C4'), .5), V(LAUNCH + .05), .25)
X.add(thud(), V(BOXLAND), 1.0); X.add(pop(400, 900, .1), V(BOXLAND + .02), .4)
for k in range(6): X.add(thud() * .4, V(BOXLAND + .15 + k * .09), .25, (-1) ** k * .5)
for k, n2 in enumerate(['G6', 'E6', 'G6', 'E6']): X.add(chime(hz(n2)), V(BOXLAND + .35 + k * .17), .18)
# ---------- 6 ----------
X.add(boing(.3, 300, 800), V(OUTB), .35); jingle(V(OUTB + .1), 5, .1)
for k in range(8): X.add(pizz(hz(['G5', 'A5'][k % 2]), .1), V(26.6 + k * .14), .18)
for k in range(7): X.add(pizz(hz(['G5', 'A5'][k % 2]), .1), V(27.6 + k * .13), .18)
X.add(pop(3000, 2600, .03), V(PLUG), .5); X.add(lp_noise(int(.2 * SR), .7) * np.exp(-np.arange(int(.2 * SR)) / SR / .05) * 2, V(PLUG), .3)
for k, n2 in enumerate(['C6', 'E6', 'G6', 'C7', 'E7']): X.add(bell(hz(n2) * 1.5, .9), V(PLUG + .05 + k * .07), .3)
giggle(V(PLUG + .9), 6, 1800)
X.add(boing(.2, 500, 1000), V(29.75), .3); X.add(ting(2800), V(EARO), .4)
for k, n2 in enumerate(['C6', 'E6', 'G6', 'C7']): X.add(chime(hz(n2)), 32.3 + k * .06, .35)
X.save(OUT, fade=.05); print('ok', round(TREE_LAND, 3), round(LAUNCH, 3))
