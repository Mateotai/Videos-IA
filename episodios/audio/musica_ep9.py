"""Música y efectos del Episodio 9 "Gone fishing" (20 s, bucle)."""
import os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *
X = Mix(20.0)


def pomf(t, pitch=1.0, g=.5):          # cojín que cae
    n = int(.22 * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(90 * pitch + 140 * pitch * np.exp(-tt / .03)) / SR) * env(n, .002, .07)
    s += np.diff(rng.standard_normal(n + 1)) * np.exp(-tt / .03) * .15
    X.add(s, t, g)
def squeak(t, f=2200, g=.25, pan=-.3):  # gritito de Pip
    X.add(slide(f, f * 1.5, .1), t, g, pan)
def ratchet(t0, n, gap=.045, g=.5, pan=-.3):   # carrete de la caña
    for k in range(n): X.add(hat(.012) * 3, t0 + k * gap, g, pan)
def twang(t, g=.45):                    # caña que se dobla
    n = int(.4 * SR); tt = np.arange(n) / SR
    f = 180 * (1 + .5 * np.exp(-tt / .05))
    X.add(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .14) * (1 + .3 * np.sin(2 * np.pi * 22 * tt)), t, g)
def birdies(t0, t1, g=.18):             # pajaritos del mareo
    k = 0
    while t0 + k * .16 < t1:
        X.add(whistle(hz(['E7', 'G7', 'D7', 'A7'][k % 4]), .07, vib=14), t0 + k * .16, g, (-1) ** k * .5); k += 1

# 0–2 y 18.8–20: la galleta columpiándose (caja de música + tic-tac con paneo)
def tease(t0, pans):
    for k, n in enumerate(['E6', 'G6', 'C7', 'B6', 'G6', 'E6']): X.add(musicbox(hz(n), 1.0), t0 + .05 + k * .3, .22)
    for tt, p in pans: X.add(pizz(hz('C6'), .1) * .6, t0 + tt, .35, p)
tease(0, [(.25, -.7), (1.0, .7), (1.75, -.7)])
X.add(pad([hz('C4'), hz('E4'), hz('G4')], 2.0), 0, .08)
# plano 2: ¡se lanza! la galleta sube de golpe... BONK
X.add(shaker(), 2.1, .5); X.add(shaker(), 2.2, .5)
X.add(whoosh(.45), 2.3, .55)
X.add(slide(500, 2600, .14), 2.32, .3, -.2); ratchet(2.32, 4, .03, .5)
X.add(thud(), 2.76, 1.0); X.add(boing(.45, 420, 110), 2.78, .5); X.add(crash(), 2.76, .25)
birdies(2.9, 4.8)
# plano 3: Pip con su caña (tema "listillo")
for k, n in enumerate(['D4', 'C#4', 'C4', 'B3']): X.add(pizz(hz(n), .3), 5.0 + k * .22, .5)
X.add(bass(hz('B1') * 2, .6), 5.66, .4)
for t in [5.6, 6.3]: X.add(pluck(hz('A5'), .25, .08), t, .2, -.4); X.add(pluck(hz('E6'), .25, .08), t + .15, .2, -.4)
X.add(pop(500, 900, .1), 5.85, .3)
X.add(pop(700, 1700, .1), 7.0, .45)
for k, t in enumerate([7.0, 7.22, 7.44]): squeak(t, 2400 + k * 200, .22)
# plano 4: mirada asesina
for k in range(14): X.add(pizz(hz('A2' if k % 2 else 'A#2'), .08), 8.0 + k * .055, .35)
X.add(bass(hz('A1') * 2, .7), 8.0, .5); X.add(kick(), 8.0, .5)
# 8.8–13: tema travieso (montar la torre)
B = 60 / 132
prog = [['D2', 'F3', 'A3'], ['A1', 'E3', 'A3'], ['D2', 'F3', 'A3'], ['G1', 'G3', 'B3']]
mel = ['D5', '-', 'F5', 'A5', 'G5', 'F5', 'E5', '-', 'C#5', '-', 'E5', 'A5', 'G5', 'E5', 'C#5', '-',
       'D5', 'F5', 'A5', 'D6', 'C6', 'A5', 'F5', 'D5', 'G5', '-', 'B5', 'D6', 'C#6', '-', 'A5', '-']
t = 8.8; bar = 0
while t < 13.0:
    ch = prog[bar % 4]
    for b in range(4):
        tb = t + b * B
        if tb >= 13.0: break
        X.add(pizz(hz(ch[0]) * 2, .25), tb, .5); X.add(kick(), tb, .35) if b % 2 == 0 else X.add(clap(), tb, .25)
        X.add(hat(), tb + B / 2, .5)
        for k, nn in enumerate(ch[1:]): X.add(pizz(hz(nn), .15), tb + B / 2 + k * .01, .12, .3)
    for kk in range(8):
        tn = t + kk * B / 2; nn = mel[(bar % 4) * 8 + kk]
        if nn != '-' and tn < 13.0: X.add(marimba(hz(nn)), tn, .22, -.15)
    t += 4 * B; bar += 1
X.add(boing(.25, 300, 600), 8.95, .3)
X.add(whoosh(.35), 9.17, .5)
for i in range(4): pomf(9.4 + i * .08, 1.0 + i * .05, .45)
X.add(whoosh(.75) * .5, 9.5, .35);
for k in range(6): X.add(shaker(), 9.55 + k * .12, .6)
for i in range(4): pomf(10.58 + i * .15, 1.2 + i * .18, .5); X.add(pop(500 + i * 150, 1000 + i * 300, .08), 10.58 + i * .15, .25)
X.add(boing(.4, 220, 800), 11.1, .4); pomf(11.62, .9, .7)
for k, n in enumerate(['C7', 'E7', 'G7']): X.add(chime(hz(n)), 11.85 + k * .07, .3)
ratchet(12.15, 10, .045, .55)
X.add(pop(800, 1800, .1), 12.4, .4)
X.add(warble(300, 260, 1.6), 12.4, .45)
# plano 5: se estira... ¡tink! ...y se derrumba todo
X.add(riser(.8), 13.0, .35)
X.add(warble(260, 340, .8), 13.0, .35)
for k, n in enumerate(['G6', 'C7', 'E7']): X.add(chime(hz(n)), 13.8 + k * .05, .45)
X.add(pop(900, 2000, .09), 14.05, .35)
X.add(whoosh(.4), 14.1, .6); X.add(slide(1200, 300, .35), 14.1, .3)
for i, tt in enumerate([14.38, 14.46, 14.6, 14.72]): pomf(tt, 1.0 - i * .08, .7)
X.add(thud(), 14.45, .9); X.add(crash(), 14.45, .25)
X.add(slide(1500, 2600, .18), 14.45, .25, -.4); twang(14.45)
for tg in [14.95, 15.4, 15.8]: twang(tg, .5); squeak(tg + .03, 2600, .22, -.4); pomf(tg, 1.4, .3)
X.add(pad([hz('D4'), hz('G#4')], 1.5), 14.5, .08)
# 16: el último tirón — Pip cae dando vueltas
twang(16.0, .6); X.add(pop(600, 1400, .1), 16.0, .4)
X.add(slide(2000, 260, 1.1), 16.02, .45, -.2)
X.add(whoosh(.9) * .6, 16.2, .4)
pomf(17.15, 1.1, .8); X.add(boing(.35, 250, 700), 17.17, .45)
birdies(17.4, 18.0, .14)
for k, tt in enumerate([17.82, 17.95, 18.0]): X.add(pizz(hz(['G6', 'D6', 'A5'][k]), .08), tt, .3, .4)   # la caña rebota en el suelo
X.add(pop(300, 700, .12), 17.8, .45)
X.add(pop(900, 1900, .07), 18.05, .5); squeak(18.07, 2800, .35, 0)
for n in ['D4', 'F4', 'A4', 'D5']: X.add(marimba(hz(n), .6, .25), 18.08, .2)
X.add(whistle(hz('G5'), .14), 18.42, .25); X.add(whistle(hz('E5'), .22), 18.56, .25)
# 18.8: de vuelta al principio (bucle)
tease(18.8, [(.12, .7), (.5, -.2), (.95, -.7)])
X.add(pad([hz('C4'), hz('E4'), hz('G4')], 1.2), 18.8, .08)
X.save(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'salida', 'musica_ep9.wav'), fade=.12); print('ok')
