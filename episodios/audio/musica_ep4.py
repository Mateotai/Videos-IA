"""Música y efectos del Episodio 4 "Hide & seek" (24.5 s)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *
X = Mix(24.5); B = 60 / 112

# tema sigiloso de "escondite" (La menor -> Do), pizzicato + silbido
sneak = ['A3', 'C4', 'E4', 'C4', 'A3', 'C4', 'E4', 'G4', 'F3', 'A3', 'C4', 'A3', 'E3', 'G#3', 'B3', 'E4']
whis = ['E5', '-', 'A5', 'G5', 'E5', '-', 'C5', 'D5', 'F5', '-', 'E5', 'D5', 'B4', '-', 'E5', '-']
def sneaky(t0, t1, gain=1.0, whistle_on=True):
    k = 0
    while t0 + k * B / 2 < t1:
        t = t0 + k * B / 2; n = sneak[k % 16]
        X.add(pizz(hz(n)), t, .45 * gain, -.2 if k % 2 else .2)
        if k % 4 == 0: X.add(bass(hz(n) * 1, .3), t, .35 * gain)
        if k % 2 == 1: X.add(hat(.012), t, .6 * gain, .4)
        w = whis[k % 16]
        if whistle_on and w != '-': X.add(whistle(hz(w), B / 2 * .85), t, .22 * gain, .1)
        k += 1
# cuenta: 3·2·1 (campanitas)
def count(t0):
    for i, n in enumerate(['G5', 'E5', 'C5']): X.add(chime(hz(n)), t0 + i * .33, .45)
def found(t):
    X.add(crash(), t, .35); X.add(boing(.3, 300, 900), t, .45)
    for i, n in enumerate(['C5', 'E5', 'G5', 'C6']): X.add(marimba(hz(n), .5, .2), t + .05 + i * .07, .35)
sneaky(0, 3.55, .9)
count(1.5)
for t in [2.65, 2.85, 3.05, 3.25]: X.add(pizz(hz('E5'), .1), t, .35, .3)   # pasitos de Pip
X.add(whoosh(.3), 3.6, .7); found(3.62)
X.add(whistle(hz('A5'), .25), 3.95, .25); X.add(whistle(hz('F5'), .45), 4.2, .25)   # "ohh"
sneaky(4.5, 6.3, .8); count(4.7)
for t in [6.55, 6.85, 7.15]: X.add(whistle(hz('A6'), .08), t, .25, .5); X.add(whistle(hz('C7'), .08), t + .1, .25, .5)  # risitas
X.add(slide(500, 260, .5), 6.95, .3)
sneaky(7.8, 11.6, .85); count(8.0)
X.add(boing(.4, 200, 800), 8.24, .45); X.add(thud(), 8.8, .6)
for k in range(6): X.add(pizz(hz(['E6', 'D6'][k % 2]), .08), 11.75 + k * .08, .45, (-1) ** k * .4)   # la caja se ríe
found(12.25)
X.add(boing(.3, 260, 700), 12.85, .4)
count(13.1)
X.add(boing(.25, 400, 1000), 13.6, .35)
# búsqueda con Pip encima: tema sigiloso sin silbido + "no" en cada sitio
sneaky(14.6, 20.2, .85, whistle_on=True)
for t in [16.3, 18.4, 19.85]: X.add(whistle(hz('E5'), .14), t, .3); X.add(whistle(hz('B4'), .3), t + .16, .3)
X.add(slide(600, 250, .7), 20.2, .3)
X.add(pad([hz('A3'), hz('C4'), hz('E4')], .8), 20.2, .18)
# ¡BOO!
X.add(crash(), 21.0, .6); X.add(kick(), 21.0, 1.0); X.add(boing(.45, 180, 1100), 21.03, .55); X.add(thud(), 21.5, .8)
for k in range(8): X.add(whistle(hz(['A6', 'C7'][k % 2]), .07), 21.85 + k * .1, .22, (-1) ** k * .4)
for n, t in [('C5', 22.95), ('E5', 23.1), ('G5', 23.25), ('C6', 23.4)]: X.add(marimba(hz(n), 1.0, .4), t, .4)
X.add(crash(), 22.95, .45)
for n in ['C3', 'E4', 'G4', 'C5']: X.add(pad([hz(n)], 1.5), 22.95, .1)
for i in range(6): tb = 22.95 + i * .25; X.add(kick(), tb, .45) if i % 2 == 0 else X.add(clap(), tb, .35)
X.save(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'salida', 'musica_ep4.wav')); print('ok')
