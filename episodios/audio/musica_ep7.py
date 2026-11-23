"""Música y efectos del Episodio 7 "Bedtime" (23.5 s)."""
import os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *
X = Mix(23.5)

def snore(t, amp=1.0):
    """ronquido: inspiración ruidosa grave + silbidito al soltar."""
    n = int(.9 * SR); tt = np.arange(n) / SR
    f = 70 + 30 * np.sin(2 * np.pi * 3 * tt)
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .3 + np.diff(rng.standard_normal(n + 1)) * .15
    e = np.sin(np.pi * np.clip(tt / .9, 0, 1)) ** 1.5
    X.add(s * e * .5 * amp, t, 1.0)
    X.add(whistle(900 * (1 + .1 * amp), .35, vib=12), t + .95, .18 * amp)
# nana de fondo (caja de música, muy suave) — toda la noche salvo el despertador
lull = ['E5', 'G5', 'C6', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5', 'E5', 'G5', 'E5', 'F5', 'E5', 'D5', 'C5']
for k in range(int(20.3 / .55)):
    t = .1 + k * .55; X.add(musicbox(hz(lull[k % 16]), 1.2), t, .14, (-1) ** k * .3)
    if k % 4 == 0: X.add(pad([hz(c) for c in [['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4']][(k // 4) % 4]], 2.2), t, .08)
# ronquidos (ciclo de 1.6 s, como la animación)
amp_at = lambda t: 0 if 6.7 < t < 8.2 or 14.2 < t < 15.4 else (2.2 if 8.2 <= t < 9.0 else (1.2 if t > 8 else 1.0))
for k in range(16):
    t = k * 1.6
    if t > 15.0: break
    a = amp_at(t + .5)
    if a > 0: snore(t, a)
# efectos
X.add(pizz(hz('E4')), 1.0, .3)                             # abre un ojo
X.add(boing(.25, 300, 600), 2.5, .3)                       # se sienta
X.add(whoosh(.3), 3.6, .5); X.add(thud(), 4.05, .3)        # almohada
X.add(pizz(hz('C5'), .1), 6.35, .4)                        # toquecito
X.add(chime(hz('E6')), 7.4, .25)
X.add(crash(), 8.25, .35); X.add(boing(.3, 200, 900), 8.27, .45)
for k in range(8): X.add(pizz(hz(['G4', 'E4'][k % 2]), .12), 9.3 + k * .13, .3)   # se va de puntillas
X.add(whoosh(.6), 10.8, .4); X.add(thud(), 11.42, .7); X.add(pop(500, 1200, .12), 11.43, .4)
X.add(pop(), 12.3, .5); X.add(chime(hz('C7')), 12.35, .4)
for k in range(8): X.add(pizz(hz(['C5', 'E5'][k % 2]), .12), 12.8 + k * .1, .3)
# ronroneo (PRRRR): zumbido grave con trémolo
n = int(1.6 * SR); tt = np.arange(n) / SR
purr = (np.sin(2 * np.pi * 55 * tt) + .5 * np.diff(rng.standard_normal(n + 1)) * .4) * (.6 + .4 * np.sign(np.sin(2 * np.pi * 24 * tt)))
X.add(purr * np.minimum(1, tt / .1) * np.minimum(1, (1.6 - tt) / .2) * .5, 14.0, 1.0)
X.add(boing(.2, 400, 900), 14.25, .3)
for k, n2 in enumerate(['C6', 'E6', 'G6']): X.add(chime(hz(n2)), 15.4 + k * .2, .3)
# despertador
n = int(1.1 * SR); tt = np.arange(n) / SR
bell = np.sin(2 * np.pi * 2100 * tt) * (np.sin(2 * np.pi * 18 * tt) > 0) * .35 + np.sin(2 * np.pi * 2600 * tt) * (np.sin(2 * np.pi * 18 * tt) <= 0) * .3
X.add(bell, 20.4, 1.0, .4); X.add(crash(), 20.4, .4); X.add(boing(.35, 200, 1000), 20.45, .45)
for n2, t in [('C5', 21.5), ('E5', 21.65), ('G5', 21.8), ('C6', 21.95)]: X.add(marimba(hz(n2), 1.0, .4), t, .4)
X.add(crash(), 21.5, .4)
for n2 in ['C3', 'E4', 'G4', 'C5']: X.add(pad([hz(n2)], 1.6), 21.5, .1)
for i in range(6): tb = 21.5 + i * .25; X.add(kick(), tb, .45) if i % 2 == 0 else X.add(clap(), tb, .35)
X.save(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'salida', 'musica_ep7.wav')); print('ok')
