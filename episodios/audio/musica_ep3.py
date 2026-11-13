"""Música y efectos del Episodio 3 "The box" (25 s)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *
X = Mix(25.0); B = 60 / 120

# 0–2: misterio (pizzicato grave) + golpes dentro de la caja
for k, n in enumerate(['C3', 'Eb3', 'G3', 'Eb3', 'C3', 'Eb3', 'G3', 'Bb3']): X.add(pizz(hz(n)), .05 + k * .25, .5)
for t in [.3, .9, 1.5]: X.add(thud(), t, .8); X.add(boing(.2, 180, 360), t + .02, .25)
# 2–11: tema alegre (Do mayor, 120 BPM)
prog = [['C2', 'E4', 'G4', 'C5'], ['A1', 'E4', 'A4', 'C5'], ['F1', 'F4', 'A4', 'C5'], ['G1', 'D4', 'G4', 'B4']]
mel = ['E5', 'G5', 'C6', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5', 'E5', 'A5', 'G5', 'E5', 'C5', 'D5', 'E5',
       'F5', 'A5', 'C6', 'A5', 'G5', 'F5', 'E5', 'D5', 'D5', 'G5', 'B5', 'A5', 'G5', 'F5', 'E5', 'D5']
def theme(t0, t1, gain=1.0):
    bar = 0
    while t0 + bar * 4 * B < t1:
        tb0 = t0 + bar * 4 * B; ch = prog[bar % 4]
        for b in range(4):
            tb = tb0 + b * B
            if tb > t1: break
            X.add(bass(hz(ch[0]) * 2, .4), tb, .5 * gain)
            X.add(kick(), tb, .65 * gain) if b in (0, 2) else X.add(clap(), tb, .5 * gain)
            X.add(hat(), tb + B / 2, .6 * gain, .3)
            for k, nn in enumerate(ch[1:]): X.add(pluck(hz(nn), .3, .09), tb + B / 2 + k * .01, .14 * gain, -.3)
        for kk in range(8):
            tn = tb0 + kk * B / 2; nn = mel[(bar % 4) * 8 + kk]
            if tn < t1: X.add(marimba(hz(nn)), tn, .3 * gain, .15)
        bar += 1
theme(2.0, 10.9)
for t in [2.1, 2.35, 2.6, 2.85]: X.add(hat(.01), t, 1.2, -.5); X.add(hat(.01), t + .12, 1.2, .5)
X.add(chime(hz('E6')), 3.1, .4); X.add(chime(hz('G6')), 3.5, .4)
X.add(boing(), 3.6, .5)
for t in [4.2, 4.42]: X.add(whistle(hz('A5'), .12), t, .3, .4)
X.add(bubble_pop(.8), 4.65, 1.0); X.add(boing(.5, 150, 900), 4.66, .6); X.add(crash(), 4.65, .35)
for t, p in [(4.7, 1.0), (5.15, 1.2), (5.55, 1.4), (5.85, 1.6)]: X.add(boing(.22, 300 * p, 700 * p), t, .4, .5)
X.add(thud(), 5.15, .6)
X.add(chime(hz('C6')), 6.0, .4); X.add(chime(hz('E6')), 6.2, .4)
X.add(boing(.4, 200, 800), 6.75, .5); X.add(thud(), 7.15, .8)
for k, n in enumerate(['C6', 'E6', 'G6', 'C7']): X.add(musicbox(hz(n)), 8.1 + k * .15, .3)
for k in range(5): X.add(whoosh(.12), 10.35 + k * .12, .35, (-1) ** k * .5)
X.add(whistle(hz('E5'), .2), 10.9, .3); X.add(whistle(hz('B4'), .35), 11.1, .3)
# 12–13.3: empujar (cartón que arrastra) + motorcito
X.add(whoosh(1.3) * .6, 12.0, .5)
for k in range(10): X.add(pizz(hz(['C4', 'D4', 'E4', 'F4', 'G4'][k % 5])), 12.0 + k * .13, .35)
X.add(boing(), 13.68, .45); X.add(boing(.25, 400, 900), 14.25, .35)
# 14.5–18.3: nana tierna (vals)
for k, (r, chs) in enumerate([('C2', ['E4', 'G4', 'C5']), ('A1', ['E4', 'A4', 'C5']), ('F1', ['F4', 'A4', 'C5']), ('G1', ['D4', 'G4', 'B4']), ('C2', ['E4', 'G4', 'C5'])]):
    X.add(pad([hz(c) for c in chs], .85), 14.5 + k * .75, .2); X.add(bass(hz(r) * 2, .6), 14.5 + k * .75, .3)
for k, n in enumerate(['G5', 'E5', 'C6', 'B5', 'A5', 'C6', 'G5', 'E5', 'F5', 'A5', 'G5', 'D5', 'E5', 'G5', 'C6']):
    X.add(musicbox(hz(n), .8), 14.5 + k * .25, .2, (-1) ** k * .3)
# 18.4 caída
X.add(slide(1400, 200, 1.0), 18.4, .45)
X.add(thud(), 19.4, 1.0); X.add(kick(), 19.4, 1.0); X.add(crash(), 19.4, .6)
X.add(pad([hz('C3'), hz('G3'), hz('C4'), hz('E4')], 1.4), 19.6, .2)
X.add(riser(.9), 20.3, .45)
X.add(boing(.4, 220, 900), 21.17, .45, .3); X.add(boing(.4, 180, 760), 21.45, .45, -.3)
X.add(thud(), 21.95, .7); X.add(thud(), 22.0, .5)
X.add(boing(.3, 300, 800), 22.6, .4); X.add(boing(.3, 400, 1000), 22.8, .35)
for n, t in [('C5', 23.0), ('E5', 23.15), ('G5', 23.3), ('C6', 23.45)]: X.add(marimba(hz(n), 1.0, .4), t, .4)
X.add(crash(), 23.0, .5)
for n in ['C3', 'E4', 'G4', 'C5']: X.add(pad([hz(n)], 1.6), 23.0, .1)
for i in range(6): tb = 23.0 + i * .25; X.add(kick(), tb, .45) if i % 2 == 0 else X.add(clap(), tb, .35)
out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'salida', 'musica_ep3.wav')
X.save(out); print('ok')
