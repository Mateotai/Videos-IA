"""Música y efectos del Episodio 8 "Snow day" (23.5 s)."""
import os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *
X = Mix(23.5); B = 60 / 120

def jingle(t, f=1.0, g=1.0):   # cascabel
    n = int(.25 * SR); tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * fr * tt) for fr in [2400, 3100, 3900]) * np.exp(-tt / .06) / 3
    X.add(s * .5 * g, t, 1.0, .3)
def sneeze(t, pitch=1.0):
    X.add(slide(300 * pitch, 900 * pitch, .25), t - .25, .3)
    n = int(.3 * SR); X.add(np.diff(rng.standard_normal(n + 1)) * env(n, .002, .08) * .9, t, 1.0)
    X.add(boing(.2, 500 * pitch, 300 * pitch), t + .02, .3)
# copo cayendo (caja de música) + estornudo
for k, n in enumerate(['E6', 'C6', 'G5', 'E5']): X.add(musicbox(hz(n)), .1 + k * .25, .25)
sneeze(1.36)
# tema invernal alegre (Fa mayor, cascabeles)
prog = [['F2', 'A3', 'C4', 'F4'], ['D2', 'A3', 'D4', 'F4'], ['Bb1', 'Bb3', 'D4', 'F4'], ['C2', 'G3', 'C4', 'E4']]
mel = ['A5', 'A5', 'A5', '-', 'A5', 'A5', 'A5', '-', 'A5', 'C6', 'F5', 'G5', 'A5', '-', '-', '-',
       'Bb5', 'Bb5', 'Bb5', 'Bb5', 'Bb5', 'A5', 'A5', 'A5', 'A5', 'G5', 'G5', 'A5', 'G5', '-', 'C6', '-']
def theme(t0, t1, g=1.0):
    bar = 0
    while t0 + bar * 4 * B < t1:
        tb0 = t0 + bar * 4 * B; ch = prog[bar % 4]
        for b in range(4):
            tb = tb0 + b * B
            if tb > t1: break
            X.add(bass(hz(ch[0]) * 2, .4), tb, .45 * g); X.add(kick(), tb, .55 * g) if b in (0, 2) else X.add(clap(), tb, .4 * g)
            jingle(tb + B / 2, 1.0, .5 * g)
            for k, nn in enumerate(ch[1:]): X.add(pluck(hz(nn), .3, .1), tb + B / 2 + k * .01, .12 * g, -.3)
        for kk in range(8):
            tn = tb0 + kk * B / 2; nn = mel[(bar % 4) * 8 + kk]
            if nn != '-' and tn < t1: X.add(marimba(hz(nn)), tn, .3 * g, .15)
        bar += 1
theme(2.3, 12.1)
X.add(boing(.35, 200, 700), 3.0, .45)                  # Pip sale de la nieve
X.add(whoosh(.5), 3.9, .5); X.add(thud(), 4.4, .7); X.add(pop(400, 900, .1), 4.42, .4)   # bola de nieve
for k in range(6): X.add(whistle(hz(['A6', 'C7'][k % 2]), .07), 4.6 + k * .1, .2, .5)
X.add(whoosh(1.3) * .4, 6.1, .4); X.add(whoosh(1.4) * .4, 6.6, .4, .4)   # rodar bolas
X.add(boing(.3, 200, 500), 8.25, .35); X.add(thud(), 8.7, .5)
X.add(boing(.35, 260, 900), 9.45, .4); X.add(thud(), 10.0, .45)
for k, n in enumerate(['F6', 'A6', 'C7']): X.add(chime(hz(n)), 10.1 + k * .15, .35)
X.add(pop(), 10.9, .5)
# 12–14: la galleta... ñam
for k, n in enumerate(['C6', 'E6']): X.add(chime(hz(n)), 12.2 + k * .2, .35)
X.add(boing(.35, 220, 800), 13.0, .45); X.add(pop(700, 1600, .1), 13.3, .5)
for k in range(4): X.add(pop(300, 500, .05), 13.5 + k * .18, .3)
X.add(whistle(hz('E5'), .15), 13.8, .3); X.add(whistle(hz('E5'), .15), 14.1, .3)
# 14.3: cabeza que cae
X.add(slide(900, 250, .45), 14.3, .35); X.add(thud(), 14.75, .9); X.add(crash(), 14.75, .3)
for k, n in enumerate(['E4', 'Eb4', 'D4', 'Db4']): X.add(whistle(hz(n), .24 if k < 3 else .5, vib=9), 15.0 + k * .25, .3)
# 16–17.6: tirita (trémolo frío)
for k in range(24): X.add(pizz(hz(['E5', 'F5'][k % 2]), .07), 15.8 + k * .07, .2, (-1) ** k * .3)
# 17.8–20.4: chocolate calentito (vals)
for k, (r, chs) in enumerate([('F2', ['A3', 'C4', 'F4']), ('D2', ['A3', 'D4', 'F4']), ('Bb1', ['Bb3', 'D4', 'F4']), ('C2', ['G3', 'C4', 'E4'])]):
    X.add(pad([hz(c) for c in chs], .85), 17.9 + k * .7, .2); X.add(bass(hz(r) * 2, .6), 17.9 + k * .7, .3)
for k, n in enumerate(['C5', 'F5', 'A5', 'G5', 'F5', 'D5', 'F5', 'Bb5', 'A5', 'G5', 'C5', 'E5']): X.add(musicbox(hz(n), .8), 17.9 + k * .23, .22, (-1) ** k * .3)
for k, n in enumerate(['A5', 'G5', 'F5', 'E5']): X.add(musicbox(hz(n)), 19.8 + k * .3, .18)
sneeze(21.0, 1.6); X.add(whoosh(.6), 21.05, .4)
for n, t in [('C5', 21.7), ('F5', 21.85), ('A5', 22.0), ('C6', 22.15)]: X.add(marimba(hz(n), 1.0, .4), t, .4)
X.add(crash(), 21.7, .45)
for n in ['F2', 'A3', 'C4', 'F4']: X.add(pad([hz(n)], 1.6), 21.7, .1)
for i in range(6): tb = 21.7 + i * .25; X.add(kick(), tb, .45) if i % 2 == 0 else X.add(clap(), tb, .35); jingle(tb + .12, 1.0, .5)
X.save(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'salida', 'musica_ep8.wav')); print('ok')
