"""Audio del Episodio 13 "Surf" (35 s) — playa.
Base: "Carefree" Kevin MacLeod (incompetech.com), CC BY 4.0 — ver audio/canciones/CREDITOS.md.
Tiempo de vídeo v; historia s = v - 2.9. canción(v) = v. Ambiente de olas y gaviotas de fondo."""
import os, sys, subprocess
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *

HERE = os.path.dirname(os.path.abspath(__file__))
SONG = os.path.join(HERE, 'canciones', 'Carefree - Kevin MacLeod.mp3')
OUT = os.path.join(os.path.dirname(HERE), 'salida', 'musica_ep13.wav')
DUR, OFF = 35.0, 2.9
HOOK, HOOK_S0 = 2.4, 21.0; HOOK_K = (23.9 - HOOK_S0) / HOOK
HV = lambda s: (s - HOOK_S0) / HOOK_K
V = lambda s: s + OFF
SPLASH, LEAP, TOP, SLIDE0, SLIDE1, BONK = 7.05, 7.35, 7.75, 9.0, 9.5, 9.85
IDEA, BLOW, HOPIN = 10.7, [11.45, 11.95, 12.45], 14.05
FREEZE, PICK, SLOW0, SLOW1, CRASH, LAND = 20.3, 20.9, 21.3, 24.0, 24.2, 25.45
LIFT, PINCH, JUMP, RELAX = 27.35, 28.25, 28.3, 30.0
X = Mix(DUR)

def load(path, extra=()):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, *extra, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, '<i2').reshape(-1, 2).astype(np.float64) / 32768
song = load(SONG); song_lp = load(SONG, ['-af', 'lowpass=f=500,lowpass=f=500'])
n = int(DUR * SR); tv = np.arange(n) / SR
def ramp(t, a, b): return np.clip((t - a) / (b - a), 0, 1)
lp = np.maximum(ramp(tv, HV(SLOW0), HV(SLOW0 + .15)) * (1 - ramp(tv, 2.25, 2.4)), ramp(tv, V(SLOW0), V(SLOW0 + .15)) * (1 - ramp(tv, V(SLOW1), V(SLOW1 + .15))))
gain = np.full(n, 1.5) * (1 - .35 * lp)
gain[(tv >= 2.4) & (tv < OFF)] = 0
gain *= 1 - .95 * ((tv > V(FREEZE)) & (tv < V(PICK)))
gain *= 1 - ramp(tv, DUR - 1.4, DUR)
idx = np.clip(np.round(tv * SR).astype(int), 0, len(song) - 1)
X.buf[:n] += (song[idx] * (1 - lp[:, None]) + song_lp[idx] * lp[:, None]) * gain[:, None]
a = int(6 * SR); chunk = song[a:a + int(5.5 * SR)][::-1][::11] * 1.5; k = np.linspace(0, 1, len(chunk))[:, None]
X.buf[int(2.4 * SR):int(2.4 * SR) + len(chunk)] += chunk * .5 * np.minimum(1, (1 - k) * 8)
tt = np.arange(int(.5 * SR)) / SR
X.add(np.sin(2 * np.pi * np.cumsum(900 - 600 * tt / .5 + 120 * np.sin(2 * np.pi * 30 * tt)) / SR) * .15 + np.diff(rng.standard_normal(len(tt) + 1)) * .06, 2.4, .6)
X.add(pop(1800, 400, .08), OFF - .01, .4)

def lp_noise(m, a):
    s = rng.standard_normal(m); o = np.zeros(m); y = 0
    for i in range(m): y += a * (s[i] - y); o[i] = y
    return o
def surfwash(d):                              # olas rompiendo suave en la orilla
    m = int(d * SR); t = np.arange(m) / SR
    return lp_noise(m, .08) * 5 * np.sin(np.pi * t / d) ** 2
def roar(d, rise=True):
    m = int(d * SR); t = np.arange(m) / SR
    e = (t / d) ** 2 if rise else np.exp(-t / (d * .3))
    return (lp_noise(m, .03) * 9 + lp_noise(m, .15) * 2) * e
def gull(t0, p=1.0):
    for k in range(3):
        m = int(.18 * SR); tt = np.arange(m) / SR; f = (1400 + 900 * np.sin(np.pi * tt / .18)) * p
        X.add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / .18) * .25 + lp_noise(m, .5) * .05, t0 + k * .22, .12, .6)
def splash(big=1.0):
    m = int(.6 * SR); t = np.arange(m) / SR
    return (lp_noise(m, .4) * 4 * np.exp(-t / (.08 * big)) + lp_noise(m, .15) * 2 * np.exp(-t / (.25 * big))) * .6
def chirp(f0, f1, d=.07):
    m = int(d * SR); t = np.arange(m) / SR
    return np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, m)) / SR) * np.sin(np.pi * t / d) * .5
def giggle(t0, nn=5, base=1800):
    for k in range(nn): X.add(chirp(base + 300 * (k % 2), base + 600, .06), t0 + k * .12, .22, .2)
def knock():
    m = int(.25 * SR); t = np.arange(m) / SR
    return (np.sin(2 * np.pi * 420 * t) * np.exp(-t / .03) + np.sin(2 * np.pi * 760 * t) * np.exp(-t / .02) + lp_noise(m, .5) * np.exp(-t / .01)) * .8
def puff():
    m = int(.35 * SR); t = np.arange(m) / SR
    return lp_noise(m, .3) * 2.5 * np.sin(np.pi * t / .35) + np.sin(2 * np.pi * np.cumsum(300 + 300 * t / .35) / SR) * .2 * np.sin(np.pi * t / .35)
def slow(sig, f=3):
    i = np.arange(0, len(sig) - 1, 1 / f); return np.interp(i, np.arange(len(sig)), sig)
def yowl():
    m = int(.6 * SR); t = np.arange(m) / SR; f = 500 + 900 * np.sin(np.pi * t / .6) ** .5
    return (np.sin(2 * np.pi * np.cumsum(f * (1 + .04 * np.sin(2 * np.pi * 9 * t))) / SR) + .3 * np.sin(4 * np.pi * np.cumsum(f) / SR)) * np.sin(np.pi * t / .6) * .4

# ambiente: olas en la orilla cada ~4.8 s (el ciclo de la espuma) y gaviotas
for k in range(8): X.add(surfwash(3.2), .4 + k * 4.83, .18, (-1) ** k * .3)
for t0, p in [(1.2, 1), (9.8, 1.1), (16.2, .95), (31.2, 1.05)]: gull(t0, p)
# ---------- GANCHO ----------
X.add(roar(2.4, False) * .8, 0, .45); X.add(slow(whoosh(.6), 3), .05, .6)
X.add(slow(chirp(500, 1100, .4), 2.5), HV(21.7), .3)                    # ¡wiii! a cámara lenta
for k in range(6): X.add(slow(splash(.5), 2.5), .3 + k * .35, .15, (-1) ** k * .5)
# ---------- 1: Pip surfea ----------
X.add(whoosh(2.8) * .5, V(.1), .3); X.add(splash(.6), V(3.05), .4); X.add(boing(.2, 600, 1100), V(3.1), .25)
for k, n2 in enumerate(['C6', 'E6', 'G6']): X.add(chime(hz(n2)), V(3.55 + k * .07), .3)
# ---------- 2: ¡agua no! ----------
for k in range(5): X.add(pizz(hz('A5'), .08), V(4.75 + k * .11), .2)
for k in range(3): X.add(chirp(400, 300, .1), V(5.75 + k * .15), .25)        # "no, no"
for k in range(4): X.add(pizz(hz('C6'), .06), V(6.3 + k * .1), .2)
X.add(splash(.8), V(SPLASH), .6); X.add(whoosh(.25), V(SPLASH + .05), .3)
X.add(yowl(), V(LEAP), .7); X.add(boing(.35, 200, 1100), V(LEAP), .5)
X.add(thud() * .5, V(TOP), .4)
for k in range(5): X.add(boing(.12, 300 + k * 30, 380 + k * 30), V(TOP + .3 + k * .25), .15)   # la sombrilla se bambolea
X.add(slide(hz('G5'), hz('C4'), .5), V(SLIDE0), .25); X.add(thud(), V(SLIDE1), .5)
X.add(whistle(hz('C6'), .35), V(9.5), .12); X.add(knock(), V(BONK), .9)
for k, n2 in enumerate(['G6', 'E6', 'G6', 'E6']): X.add(chime(hz(n2)), V(BONK + .2 + k * .16), .18)
giggle(V(LEAP + .2), 8, 2100); giggle(V(BONK + .1), 6, 2000)
# ---------- 3: el flamenco ----------
X.add(chime(hz('C7')), V(IDEA + .05), .45)
for i, b in enumerate(BLOW): X.add(puff(), V(b), .5); X.add(chirp(200 + i * 80, 340 + i * 80, .3), V(b + .05), .25)
X.add(boing(.25, 500, 900), V(12.8), .3); X.add(pop(2500, 2500, .02), V(13.0), .3)
for k in range(6): X.add(pizz(hz(['E4', 'G4'][k % 2]), .12), V(13.05 + k * .14), .25)
X.add(boing(.25, 300, 800), V(HOPIN), .3); X.add(splash(.9), V(HOPIN + .3), .6)
# ---------- 4: la ola ----------
X.add(roar(3.8), V(16.5), .5)
for k in range(4): X.add(pizz(hz('C6'), .06), V(18.6 + k * .15), .2)
X.add(slide(hz('E5'), hz('C5'), .25), V(19.55), .2)
X.add(chirp(600, 250, .25), V(FREEZE + .3), .3)                           # trago de saliva
# ---------- 5: ¡a surfear! ----------
X.add(roar(.5, False), V(PICK), .8); X.add(whoosh(.5), V(PICK), .7); X.add(boing(.3, 200, 900), V(PICK + .05), .3)
X.add(slow(whoosh(.7), 3), V(SLOW0), .5); X.add(slow(chirp(500, 1100, .4), 2.5), V(21.7), .3)
for k in range(10): X.add(slow(splash(.5), 2.5), V(21.5) + k * .3, .14, (-1) ** k * .5)
for k, n2 in enumerate(['C5', 'E5', 'G5', 'C6', 'E6', 'G6']): X.add(musicbox(hz(n2)), V(22.6 + k * .12), .2)   # de miedo a alegría
X.add(roar(1.2, False) * 1.2, V(CRASH), 1.0); X.add(crash(), V(CRASH), .3)
X.add(whistle(hz('C6'), .3), V(CRASH + .2), .15); X.add(slide(hz('C6'), hz('C4'), .8), V(CRASH + .3), .25)
X.add(thud(), V(LAND), 1.0); X.add(lp_noise(int(.5 * SR), .4) * 2 * np.exp(-np.arange(int(.5 * SR)) / SR / .15), V(LAND), .5)
X.add(boing(.25, 300, 700), V(LAND + .1), .4)
for k in range(5): X.add(boing(.1, 250, 330), V(LAND + .15 + k * .11), .12)           # patalea
# ---------- 6: el cangrejo ----------
X.add(pop(500, 300, .1), V(26.0), .5)
for k in range(5): X.add(pizz(hz(['E4', 'F4'][k % 2]), .1), V(26.45 + k * .18), .2)
X.add(whoosh(.3), V(LIFT + .1), .4); X.add(thud() * .5, V(LIFT + .55), .3)
X.add(chime(hz('C7')), V(27.75), .2)
X.add(pop(3000, 2600, .03), V(PINCH), .6); X.add(pop(3000, 2600, .03), V(PINCH + .05), .5)
X.add(yowl(), V(JUMP), .8); X.add(boing(.35, 200, 1100), V(JUMP), .4)
giggle(V(JUMP + .05), 10, 1900)
for k in range(8): X.add(pizz(hz('G6'), .04), V(29.0 + k * .12), .12)                  # el cangrejo se va
X.add(boing(.2, 300, 700), V(RELAX + .5), .3)
for k, n2 in enumerate(['C6', 'E6', 'G6']): X.add(chime(hz(n2)), V(31.0 + k * .1), .25)
for k, n2 in enumerate(['C6', 'E6', 'G6', 'C7']): X.add(chime(hz(n2)), 32.3 + k * .06, .35)
X.save(OUT, fade=.05); print('ok')
