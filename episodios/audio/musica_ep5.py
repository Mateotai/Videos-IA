"""Música y efectos del Episodio 5 "Birthday cake" (23.5 s)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *
X = Mix(23.5); B = 60 / 116

# 0–3.5: paseo tambaleante (pizzicato de puntillas) + nana suave (Mochi duerme)
for k in range(14):
    t = .05 + k * .2; X.add(pizz(hz(['G4', 'B4', 'D5', 'B4'][k % 4]), .2), t, .35, (-1) ** k * .2)
    if k % 2 == 0: X.add(whistle(hz(['D5', 'E5', 'D5', 'B4', 'G4', 'A4', 'B4'][k // 2 % 7]), .18), t, .18)
for k in range(5): X.add(slide(hz('D6'), hz('C6'), .12), .4 + k * .5, .08)   # tambaleos
X.add(chime(hz('G6')), 3.3, .4); X.add(chime(hz('D7')), 3.4, .3)   # se enciende la vela
for n, t in [('B5', 2.9), ('G5', 3.25), ('D5', 3.6)]: X.add(musicbox(hz(n)), t, .2)
X.add(boing(), 3.7, .45); X.add(boing(.3, 260, 900), 4.3, .4); X.add(thud(), 4.75, .5)
# 5–6.6: "cumpleaños feliz" alegre (melodía original de fiesta)
party = ['G5', 'G5', 'A5', 'G5', 'C6', 'B5', '-', 'G5', 'G5', 'A5', 'G5', 'D6', 'C6', '-']
for k, n in enumerate(party):
    t = 5.0 + k * B / 2
    if n != '-': X.add(marimba(hz(n), .5, .2), t, .38)
    if k % 2 == 0: X.add(kick(), t, .55); X.add(bass(hz(['C2', 'G1'][k // 4 % 2]) * 2), t, .45)
    else: X.add(clap(), t, .45)
X.add(crash(), 5.0, .35)
for k in range(8): X.add(pop(500 + k * 120, 1500 + k * 200, .08), 5.05 + k * .2, .2, (-1) ** k * .5)  # confeti
# 6.7–8: coge aire (subida)
X.add(riser(1.2), 6.75, .45); X.add(slide(200, 600, 1.15), 6.75, .25)
# 8.0: ¡sopla!
X.add(whoosh(.7), 8.0, 1.0); X.add(bubble_pop(.6), 8.3, .7); X.add(thud(), 8.55, .4)
for k, n in enumerate(['E4', 'Eb4', 'D4', 'Db4']): X.add(whistle(hz(n), .24 if k < 3 else .5, vib=9), 8.7 + k * .25, .3)
X.add(chime(hz('C6')), 9.9, .35); X.add(chime(hz('E6')), 10.05, .35)   # "ñam"
# 10.5–13: tema alegre suave mientras come / vuelve Pip
prog = [('C2', ['E4', 'G4', 'C5']), ('A1', ['E4', 'A4', 'C5']), ('F1', ['F4', 'A4', 'C5']), ('G1', ['D4', 'G4', 'B4'])]
for b in range(5):
    tb = 10.5 + b * B * 2; r, ch = prog[b % 4]
    X.add(bass(hz(r) * 2), tb, .4); X.add(kick(), tb, .45); X.add(clap(), tb + B, .35)
    for k, nn in enumerate(ch): X.add(pluck(hz(nn), .4, .12), tb + B / 2 + k * .01, .14)
for k in range(10): X.add(pizz(hz(['C4', 'E4', 'G4', 'C5', 'E5'][k % 5]), .15), 11.9 + k * .12, .3)  # empuja la tarta
X.add(crash(), 13.15, .35); X.add(chime(hz('C7')), 13.2, .4); X.add(chime(hz('G6')), 13.3, .4)
# 14.2–15.5: coge MUCHO aire
X.add(riser(1.3), 14.2, .55); X.add(slide(150, 900, 1.3), 14.2, .3)
for k in range(6): X.add(pizz(hz('E5'), .1), 13.9 + k * .11, .3, .4)   # Pip huye
# 15.5: soplido + tambaleo + SPLAT
X.add(whoosh(.8), 15.5, 1.0)
for k in range(5): X.add(slide(hz('A5'), hz('E5'), .12), 15.75 + k * .15, .25, (-1) ** k * .4)
X.add(slide(1200, 300, .4), 16.05, .35)
X.add(thud(), 16.45, 1.0); X.add(bubble_pop(.4), 16.45, .8); X.add(crash(), 16.45, .35)
for k in range(3): X.add(chime(hz(['G6', 'E6', 'C6'][k])), 16.6 + k * .15, .3)
for k in range(8): X.add(whistle(hz(['A6', 'C7'][k % 2]), .07), 17.0 + k * .11, .22, (-1) ** k * .4)  # risas de Pip
# 18–23.5: final alegre
for b in range(5):
    tb = 18.6 + b * B * 2; r, ch = prog[b % 4]
    X.add(bass(hz(r) * 2), tb, .4); X.add(kick(), tb, .5); X.add(clap(), tb + B, .4); X.add(hat(), tb + B / 2, .5)
    for k, nn in enumerate(ch): X.add(pluck(hz(nn), .4, .12), tb + B / 2 + k * .01, .14)
    for k, nn in enumerate(['E5', 'G5', 'C6', 'G5']): X.add(marimba(hz(nn)), tb + k * B / 2, .22)
for n, t in [('C5', 21.2), ('E5', 21.35), ('G5', 21.5), ('C6', 21.65)]: X.add(marimba(hz(n), 1.0, .4), t, .4)
X.add(crash(), 21.2, .5)
for n in ['C3', 'E4', 'G4', 'C5']: X.add(pad([hz(n)], 1.6), 21.2, .1)
X.save(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'salida', 'musica_ep5.wav')); print('ok')
