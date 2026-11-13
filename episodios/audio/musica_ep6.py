"""Música y efectos del Episodio 6 "Yarn ball" (24 s)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *
X = Mix(24.0); B = 60 / 132

# 0–1.6: el ovillo rueda (glissando suave) y toca la pata
X.add(slide(300, 700, 1.1), .05, .18); X.add(boing(.2, 400, 800), 1.22, .35)
X.add(pizz(hz('E5')), 1.3, .4); X.add(pizz(hz('B5')), 1.45, .4)
# 2.3–8: tema juguetón rápido (Sol mayor)
prog = [['G2', 'B3', 'D4', 'G4'], ['E2', 'B3', 'E4', 'G4'], ['C2', 'C4', 'E4', 'G4'], ['D2', 'A3', 'D4', 'F#4']]
mel = ['D5', 'G5', 'B5', 'A5', 'G5', 'D5', 'E5', 'G5', 'E5', 'B5', 'G5', 'E5', 'D5', 'B4', 'D5', 'E5',
       'C5', 'E5', 'G5', 'C6', 'B5', 'G5', 'E5', 'G5', 'A5', 'F#5', 'D5', 'A5', 'G5', 'F#5', 'E5', 'D5']
def theme(t0, t1, g=1.0, lead=whistle):
    bar = 0
    while t0 + bar * 4 * B < t1:
        tb0 = t0 + bar * 4 * B; ch = prog[bar % 4]
        for b in range(4):
            tb = tb0 + b * B
            if tb > t1: break
            X.add(bass(hz(ch[0]) * 2, .35), tb, .45 * g)
            X.add(kick(), tb, .6 * g) if b in (0, 2) else X.add(clap(), tb, .45 * g)
            X.add(shaker(), tb + B / 2, .8 * g, .3)
            for k, nn in enumerate(ch[1:]): X.add(pizz(hz(nn), .25), tb + B / 2 + k * .01, .12 * g, -.3)
        for kk in range(8):
            tn = tb0 + kk * B / 2
            if tn < t1: X.add(lead(hz(mel[(bar % 4) * 8 + kk]), B / 2 * .9), tn, .24 * g, .15)
        bar += 1
theme(1.65, 8.1)
for t in [2.37, 3.68]: X.add(boing(.3, 260, 800), t, .4)
for t in [2.82, 4.05]: X.add(pop(400, 1200, .1), t, .5); X.add(thud(), t, .3)
for t0 in [4.2, 5.15, 6.0]:
    for k in range(5): X.add(whoosh(.12), t0 + k * .13, .3, (-1) ** k * .4)
# 8.2: enredado y al suelo
X.add(slide(800, 200, .6), 8.2, .35); X.add(thud(), 8.8, .7)
for k, n in enumerate(['E4', 'Eb4', 'D4', 'Db4']): X.add(whistle(hz(n), .24 if k < 3 else .5, vib=9), 8.95 + k * .25, .3)
for k in range(5): X.add(whistle(hz(['A6', 'C7'][k % 2]), .07), 8.9 + k * .11, .2, .5)
# 10.2–12: vueltas (tema acelerando) + desenredar
for k in range(28):
    t = 10.2 + k * .064; X.add(pizz(hz(['G4', 'B4', 'D5', 'G5', 'D5', 'B4'][k % 6]), .1), t, .35, np_pan := ((-1) ** k) * .5)
X.add(riser(1.6), 10.3, .3)
X.add(slide(900, 300, .8), 12.0, .3)
for k in range(3): X.add(chime(hz(['G6', 'E6', 'C6'][k])), 12.1 + k * .15, .3)
# 13.3–16: tejiendo (clic-clac de agujas + caja de música)
for k in range(30): X.add(pop(2200, 2600, .03), 13.3 + k * .085, .25, (-1) ** k * .3)
for k, n in enumerate(['G5', 'B5', 'D6', 'B5', 'C6', 'E6', 'D6', 'B5', 'A5', 'C6', 'B5', 'G5']): X.add(musicbox(hz(n), .8), 13.35 + k * .21, .22)
X.add(crash(), 15.85, .3); X.add(chime(hz('G6')), 15.9, .4); X.add(chime(hz('D7')), 16.05, .4)
# 16.7–20.4: tema tierno (vals)
for k, (r, chs) in enumerate([('G2', ['B3', 'D4', 'G4']), ('E2', ['B3', 'E4', 'G4']), ('C2', ['C4', 'E4', 'G4']), ('D2', ['A3', 'D4', 'F#4']), ('G2', ['B3', 'D4', 'G4'])]):
    X.add(pad([hz(c) for c in chs], .85), 16.8 + k * .75, .2); X.add(bass(hz(r) * 2, .6), 16.8 + k * .75, .3)
for k, n in enumerate(['D5', 'G5', 'B5', 'A5', 'G5', 'E5', 'G5', 'C6', 'B5', 'A5', 'D5', 'F#5', 'A5', 'G5', 'B5']): X.add(marimba(hz(n), .8, .3), 16.8 + k * .25, .22, (-1) ** k * .3)
# 20.5: ¡otro ovillo! + NOOO + salto
X.add(slide(300, 700, .8), 20.5, .18); X.add(pizz(hz('E5')), 21.05, .5); X.add(pizz(hz('B5')), 21.2, .5)
X.add(crash(), 21.55, .3); X.add(boing(.4, 200, 900), 21.72, .5); X.add(slide(1000, 400, .5), 21.8, .3)
for n, t in [('G5', 22.4), ('B5', 22.55), ('D6', 22.7), ('G6', 22.85)]: X.add(marimba(hz(n), 1.0, .4), t, .4)
X.add(crash(), 22.4, .45)
for n in ['G2', 'B3', 'D4', 'G4']: X.add(pad([hz(n)], 1.5), 22.4, .1)
for i in range(6): tb = 22.4 + i * .23; X.add(kick(), tb, .45) if i % 2 == 0 else X.add(clap(), tb, .35)
X.save(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'salida', 'musica_ep6.wav')); print('ok')
