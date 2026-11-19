"""Música y efectos del Episodio 9 "Pancakes" (40 s, en bucle).
96 bpm -> 16 compases de 2.5 s exactos: C Am F G. El último compás (G) resuelve en el primero (C)."""
import os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *
X = Mix(40.0)
B = .625; E8 = B / 2                      # negra / corchea
CH = [['C3', 'E4', 'G4'], ['A2', 'C4', 'E4'], ['F2', 'A3', 'C4'], ['G2', 'B3', 'D4']]
SLOW0, SLOW1 = 26.2, 29.45
LAND, SPLAT = 15.2, 29.45               # cámara lenta (la música se apaga y se estira)

def lp_noise(n, a):
    s = rng.standard_normal(n); out = np.zeros(n); y = 0
    for i in range(n): y += a * (s[i] - y); out[i] = y
    return out

def sizzle(dur):
    n = int(dur * SR); s = np.diff(rng.standard_normal(n + 1)) * .25
    crack = (rng.random(n) > .9985) * rng.standard_normal(n) * 1.5
    return (s + crack) * np.minimum(1, np.arange(n) / SR / .1) * np.minimum(1, (dur - np.arange(n) / SR) / .2)

def scrape(dur=.25):
    n = int(dur * SR); t = np.arange(n) / SR
    s = lp_noise(n, .25) * 3 + np.sin(2 * np.pi * np.cumsum(180 + 40 * np.sin(2 * np.pi * 23 * t)) / SR) * .25
    return s * np.sin(np.pi * t / dur) * .6

def clank():
    n = int(1.2 * SR); t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, d in [(312, .5), (741, .3), (1187, .2), (1999, .12)]) * .3

def splat():
    n = int(.5 * SR); t = np.arange(n) / SR
    wet = lp_noise(n, .35) * 4 * np.exp(-t / .07)
    low = np.sin(2 * np.pi * np.cumsum(90 + 200 * np.exp(-t / .04)) / SR) * np.exp(-t / .12)
    return (wet + low) * .7

def lick():
    n = int(.16 * SR); t = np.arange(n) / SR
    return lp_noise(n, .5) * 2.5 * np.sin(np.pi * t / .16) ** 2 * .5

def purr(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * 52 * t) + .4 * lp_noise(n, .2) * 3) * (.6 + .4 * np.sign(np.sin(2 * np.pi * 23 * t)))
    return s * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .3) * .4

def rumble(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    return lp_noise(n, .04) * 6 * np.sin(np.pi * t / dur)

def sniff(t0):
    for k in range(2): X.add(lp_noise(int(.09 * SR), .6) * np.hanning(int(.09 * SR)) * 1.5, t0 + k * .13, .35)

def music_gain(t):
    if SLOW0 + .15 < t < SLOW1: return .0
    if 15.2 < t < 16.4: return .35       # silencio cómico tras el PLAF
    return 1.0

# ---------------- música de fondo (cálida, de mañana) ----------------
mel = ['E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5', 'D5', 'E5', 'G5', 'C6', 'A5', 'G5', '-', 'E5', 'G5',
       'A5', 'C6', 'A5', 'G5', 'F5', 'E5', 'D5', 'E5', 'D5', 'B4', 'D5', 'G5', 'F5', 'E5', 'D5', '-']
for bar in range(16):
    tb = bar * 2.5; ch = CH[bar % 4]
    g = music_gain(tb + .1)
    if g > 0: X.add(pad([hz(n) for n in ch[1:]], 2.45), tb, .1 * g)
    for k in range(8):
        t = tb + k * E8; g = music_gain(t)
        if g == 0: continue
        # bajo pizzicato saltarín
        if k in (0, 3, 4, 6): X.add(pizz(hz(ch[0]) * (2 if k in (3, 6) else 1), .35), t, .42 * g)
        # ukelele (rasgueo suave)
        if k in (1, 3, 5, 7):
            for j, n in enumerate(ch[1:] + [ch[1][:-1] + str(int(ch[1][-1]) + 1)]): X.add(pluck(hz(n), .4, .12), t + j * .012, .1 * g, .3)
        X.add(shaker(), t, .5 * g, -.3)
        # melodía (marimba) en compases alternos con silbido
        n = mel[(bar % 4) * 8 + k]
        if n != '-' and bar not in (6, 7, 9, 10, 11): X.add(marimba(hz(n), .5, .2), t, .3 * g, .1)
        if n != '-' and bar in (0, 1, 12, 13, 14, 15) and k % 2 == 0: X.add(whistle(hz(n), .26), t, .1 * g)
# compases 7–8 (tortita gigante) y 9–11: tensión de puntillas
for k in range(16):
    t = 18.0 + k * .44
    if t > 22.3: break
    X.add(pizz(hz(['C4', 'E4', 'G4', 'E4', 'D4', 'F4', 'A4', 'F4'][k % 8]), .3), t, .3, (-1) ** k * .3)

# ---------------- PLANO 1 ----------------
X.add(chime(hz('E6')), .15, .25)
for k in range(5): X.add(pizz(hz(['G5', 'A5'][k % 2]), .12), 1.32 + k * .12, .22)    # pasitos de Pip
for k in range(4): X.add(lick() * .6, 2.45 + k * .12, .25)                          # frota el plato
for k, n in enumerate(['C6', 'E6', 'G6', 'C7']): X.add(chime(hz(n)), 3.05 + k * .08, .35)   # ¡orgulloso!
X.add(boing(.2, 500, 900), 3.32, .25)
X.add(pizz(hz('B5'), .1), 4.55, .3); X.add(pizz(hz('B5'), .1), 4.85, .3)            # mira nervioso

# ---------------- PLANO 2 ----------------
for k in range(4): X.add(pizz(hz(['E4', 'G4'][k % 2]), .15), 5.1 + k * .22, .25)    # pasos de Mochi
sniff(5.85)
X.add(boing(.25, 300, 1200), 6.2, .45)
for k, n in enumerate(['C6', 'G6', 'C7', 'E7']): X.add(chime(hz(n)), 6.25 + k * .05, .45)     # ojos de plato
for i, t in enumerate([6.7, 6.85, 7.0]): X.add(bubble_pop(1 + i * .2), t, .4)
for k, n in enumerate(['C5', 'E5', 'G5', 'C6', 'E6', 'G6', 'C7']): X.add(musicbox(hz(n)), 7.05 + k * .07, .22)   # sueño
X.add(warble(hz('C5'), hz('C6'), 1.6), 7.1, .25)
for k in range(5): X.add(lick(), 7.5 + k * .19, .35)                                # se relame
X.add(bubble_pop(.7), 8.95, .7)
X.add(slide(300, 900, .2), 9.15, .3)
X.add(whoosh(.35), 9.42, 1.0); X.add(slide(600, 2400, .25), 9.42, .3)              # ¡zas!
for k in range(5):
    t = 10.05 + k * .39
    X.add(scrape(.24), t, .8, .2); X.add(thud(), t + .21, .35); X.add(boing(.15, 140, 110), t, .25)
X.add(clank(), 11.98, .25)

# ---------------- PLANO 3 ----------------
X.add(sizzle(2.6), 12.0, .35, .3)
X.add(riser(.6), 12.08, .35); X.add(slide(150, 90, .4), 12.05, .3)                # esfuerzo
X.add(whoosh(.5), 12.6, .9); X.add(thud(), 12.66, .4)                              # ¡FLIP!
X.add(slide(hz('C4'), hz('C6'), .95), 12.7, .35)
X.add(clank(), 13.04, .6); X.add(clank(), 13.27, .25)
for k in range(5): X.add(pizz(hz(['D5', 'C5'][k % 2]), .12), 13.2 + k * .16, .25)
X.add(slide(hz('C6'), hz('C4'), 1.05), 14.15, .35)                                 # cae…
X.add(whoosh(.5), 14.75, .5)
X.add(thud(), LAND, 1.0); X.add(splat() * .6, 15.2, .8); X.add(crash(), 15.2, .2)
X.add(boing(.18, 220, 160), 15.75, .3); X.add(boing(.18, 260, 180), 16.15, .3)     # se retuerce ahí debajo
X.add(pizz(hz('A5'), .1), 15.8, .25)                                               # cola
X.add(slide(hz('G6'), hz('C5'), .4), 16.5, .2); X.add(pop(500, 300, .12), 16.92, .6); X.add(boing(.2, 400, 700), 16.95, .25)

# ---------------- PLANO 4 ----------------
X.add(boing(.25, 200, 500), 18.25, .3)                                             # se asoma
for t0, t1 in [(18.9, 19.7), (20.1, 21.1), (21.4, 22.0)]: X.add(slide(hz('A5') * (1.0 if t0 < 20 else .84 if t0 < 21 else .7), hz('E5') * (1.0 if t0 < 20 else .84 if t0 < 21 else .7), t1 - t0), t0, .15)
for k in range(5): X.add(lick() * .8, 20.6 + k * .18, .3)
X.add(boing(.3, 300, 1400), 21.98, .5); X.add(chime(hz('C7')), 22.0, .4)          # ¡ojos!
X.add(whoosh(.45), 22.33, 1.0); X.add(lp_noise(int(.6 * SR), .3) * 3 * np.exp(-np.arange(int(.6 * SR)) / SR / .2), 22.45, .5)   # puf de harina
X.add(slide(hz('C5'), hz('C6'), .3), 22.4, .25)
X.add(thud(), 22.85, .8); X.add(rumble(.65), 22.85, .5)
for k, n in enumerate(['G6', 'E6', 'G6', 'E6', 'C6']): X.add(chime(hz(n)), 23.5 + k * .17, .2)   # mareo
sniff(24.25)
X.add(warble(hz('E5'), hz('A5'), .6), 24.6, .25)                                   # lengua hacia arriba

# ---------------- PLANO 5 ----------------
for k in range(4): X.add(boing(.12, 300 + k * 40, 450 + k * 40), 25.1 + k * .25, .25)    # se menea
X.add(slide(200, 500, .25), 25.95, .25)
X.add(pop(400, 1600, .1), 26.2, .7); X.add(whoosh(.3), 26.2, .7)                    # ¡fiu!
# cámara lenta: zumbido grave estirado + latido + coro grave
n = int((SLOW1 - SLOW0) * SR); tt = np.arange(n) / SR
X.add(np.sin(2 * np.pi * np.cumsum(70 - 15 * tt / tt[-1]) / SR) * np.minimum(1, tt / .4) * .5 + lp_noise(n, .02) * 3 * np.minimum(1, tt / .5), SLOW0 + .1, .5)
X.add(pad([hz('C3'), hz('G3'), hz('Eb4')], SLOW1 - SLOW0 - .1), SLOW0 + .15, .25)
for k in range(4): X.add(kick(), SLOW0 + .45 + k * .7, .5); X.add(kick(), SLOW0 + .62 + k * .7, .3)
X.add(slide(hz('C4') * .5, hz('C4') * .45, 2.8), SLOW0 + .3, .15)
X.add(whoosh(.4), SPLAT - .4, .5)
X.add(splat(), SPLAT, 1.0); X.add(crash(), SPLAT, .3); X.add(thud(), SPLAT + .18, .7)     # SPLAT + cara al plato
for k in range(6): X.add(pop(900 + k * 150, 600, .07), SPLAT + .05 + k * .09, .2, (-1) ** k * .5)  # gotitas
for k in range(5): X.add(pizz(hz('E6'), .07), 30.2 + k * .1, .2)                 # pataleo
for k, n in enumerate(['E4', 'Eb4', 'D4', 'Db4']): X.add(whistle(hz(n), .26 if k < 3 else .6, vib=9), 30.85 + k * .28, .25)  # wah wah

# ---------------- PLANO 6 ----------------
X.add(lp_noise(int(.8 * SR), .3) * np.hanning(int(.8 * SR)) * 1.2, 32.4, .3)       # se despega del plato
X.add(pizz(hz('C6'), .1), 34.1, .25)                                                 # parpadeo seco
for k in range(3): X.add(pop(1200, 700, .06), 34.2 + k * 3.2 + .05, .25)            # gota del bigote
X.add(slide(hz('G5'), hz('D5'), .25), 34.75, .15)                                   # mirada de reojo
X.add(purr(4.8), 35.0, .5)
for k in range(13): X.add(lick(), 35.1 + k * .37, .4, .3)
X.add(pizz(hz('C6'), .1), 36.6, .2)
X.add(lp_noise(int(.5 * SR), .15) * np.hanning(int(.5 * SR)) * 2, 38.3, .3)        # suspiro
for k in range(9): X.add(pizz(hz(['G5', 'A5'][k % 2]), .1), 38.88 + k * .12, .2)    # se va

X.save(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'salida', 'musica_ep9.wav'), fade=.01); print('ok')
