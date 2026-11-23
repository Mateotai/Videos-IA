"""Música y efectos del Episodio 2 "Burbujas" (25 s). Sincronizada con ep2.html."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *

X = Mix(25.0)
B = 60 / 128  # pulso

# 0 – 1.6: curiosidad (caja de música) mientras la pompa se acerca
for n, t in [('A5', .05), ('C6', .35), ('F6', .65), ('E6', .95), ('C6', 1.25)]:
    X.add(musicbox(hz(n)), t, .25, .2)
X.add(warble(300, 520, 1.5), .1, .25)
# 1.6 ¡pop en la nariz!
X.add(bubble_pop(1.0), 1.6, .9); X.add(boing(.25, 300, 600), 1.62, .3)

# 2.0 – 10.3: tema principal saltarín (Fa mayor)
prog = [['F2', 'A3', 'C4', 'F4'], ['C2', 'G3', 'C4', 'E4'], ['D2', 'A3', 'D4', 'F4'], ['Bb1', 'F3', 'Bb3', 'D4']]
mel = ['C5', 'F5', 'A5', 'G5', 'F5', 'C5', 'D5', 'F5', 'E5', 'G5', 'C6', 'Bb5', 'A5', 'G5', 'E5', 'C5',
       'D5', 'F5', 'A5', 'C6', 'D6', 'C6', 'A5', 'F5', 'Bb5', 'A5', 'G5', 'F5', 'D5', 'E5', 'F5', '-']
t0 = 2.05; bar = 0
while t0 + bar * 4 * B < 8.85:
    tb0 = t0 + bar * 4 * B; ch = prog[bar % 4]
    for b in range(4):
        tb = tb0 + b * B
        if tb > 8.85: break
        X.add(bass(hz(ch[0]) * 2, .35), tb, .5)
        X.add(kick(), tb, .7) if b in (0, 2) else X.add(clap(), tb, .55)
        X.add(hat(), tb + B / 2, .7, .3); X.add(shaker(), tb + B * .75, .8, -.3)
        for k, nn in enumerate(ch[1:]): X.add(pizz(hz(nn) * 2, .3), tb + B / 2 + k * .01, .12, -.3)
    for kk in range(8):
        tn = tb0 + kk * B / 2; nn = mel[(bar % 4) * 8 + kk]
        if nn != '-' and tn < 8.85: X.add(whistle(hz(nn), B / 2 * .9), tn, .26, .15)
    bar += 1
# efectos de la caza
for t in [4.6, 5.9, 7.2, 8.2]: X.add(boing(.3, 220, 760), t, .4)
for t, p in [(4.9, 1.0), (6.2, 1.25), (7.5, 1.5)]:
    X.add(bubble_pop(p), t, .9); X.add(chime(hz(['C6', 'E6', 'G6'][[4.9, 6.2, 7.5].index(t)])), t + .02, .35)
for t in [5.2, 6.5, 7.8]: X.add(thud(), t, .35)
X.add(whoosh(.35), 8.45, .7)                       # zarpazo al aire
X.add(slide(700, 180, .45), 8.45, .35)             # caída
X.add(thud(), 8.9, 1.0)                            # ¡tortazo!
for k, n in enumerate(['E4', 'Eb4', 'D4', 'Db4']):  # "wah wah" cómico
    X.add(whistle(hz(n) / 2 * 2, .26 if k < 3 else .6, vib=9), 9.05 + k * .27, .35)
# risita de Pip (chirridos)
for k in range(5): X.add(whistle(hz('A6') * (1 + .06 * (k % 2)), .07), 9.0 + k * .12, .2, .5)
# 10.3: enfado + idea traviesa (pizzicato sigiloso)
sneak = ['F3', 'A3', 'C4', 'A3', 'Db4', 'C4', 'A3', 'F3', 'F3', 'A3', 'C4', 'E4', 'F4', 'E4', 'C4', 'A3']
for k, n in enumerate(sneak):
    t = 10.35 + k * .2
    if t < 13.2: X.add(pizz(hz(n)), t, .45, -.2 if k % 2 else .2)
X.add(warble(180, 420, 2.2), 11.0, .45)             # la pompa gigante crece
X.add(boing(.4, 160, 380), 13.25, .45)              # se cierra/despega
# 13.3 – 16.5: maravilla flotante (vals soñador)
for k, (n1, chs) in enumerate([('F2', ['F4', 'A4', 'C5']), ('Bb1', ['F4', 'Bb4', 'D5']), ('C2', ['E4', 'G4', 'C5']), ('F2', ['F4', 'A4', 'C5'])]):
    X.add(pad([hz(c) for c in chs], 1.0), 13.35 + k * .8, .18)
    X.add(bass(hz(n1) * 2, .7), 13.35 + k * .8, .35)
arp = ['C6', 'F6', 'A6', 'F6', 'D6', 'F6', 'Bb6', 'F6', 'E6', 'G6', 'C7', 'G6', 'F6', 'A6', 'C7', 'A6']
for k, n in enumerate(arp): X.add(musicbox(hz(n), .7), 13.35 + k * .2, .16, (-1) ** k * .4)
for k in range(3): X.add(chime(hz(['A6', 'C7', 'F7'][k])), 13.4 + k * .15, .25)
# 16.5 – 19.3: tensión (notas repetidas que suben)
X.add(slide(600, 300, .35), 16.55, .3)
for k in range(28):
    t = 16.65 + k * .095; n = ['D4', 'D4', 'Eb4', 'Eb4', 'E4', 'E4', 'F4', 'F#4'][min(7, k // 4)]
    X.add(pizz(hz(n), .15), t, .35, (-1) ** k * .25)
    if k % 2 == 0: X.add(bass(hz('D2') * 2, .15), t, .3)
X.add(riser(.8), 18.5, .45)
for t in [17.3, 17.7, 18.48]: X.add(boing(.28, 260, 820), t, .35, .4)
# 19.3 ¡POP! gigante + caída
X.add(bubble_pop(.55), 19.3, 1.0); X.add(crash(), 19.3, .5); X.add(pop(400, 1400, .2), 19.31, .4)
X.add(slide(900, 200, .45), 19.32, .4)
X.add(thud(), 19.75, 1.0); X.add(boing(.3, 300, 900), 19.95, .45)
# 20.1 – 21.5: risas (reprise corto)
for k, (n, t) in enumerate([('F5', 20.1), ('A5', 20.25), ('C6', 20.4), ('A5', 20.55), ('F6', 20.75)]):
    X.add(marimba(hz(n), .6, .22), t, .4)
for b in range(3):
    tb = 20.1 + b * B * 2
    X.add(kick(), tb, .55); X.add(clap(), tb + B, .45); X.add(bass(hz('F2') * 2), tb, .4)
    for k, nn in enumerate(['A4', 'C5', 'F5']): X.add(pizz(hz(nn)), tb + B / 2 + k * .01, .14)
# 21.6 – 23.15: vuelve la curiosidad
for n, t in [('A5', 21.65), ('C6', 21.95), ('F6', 22.25), ('E6', 22.55), ('C6', 22.85)]: X.add(musicbox(hz(n)), t, .25, .2)
X.add(warble(520, 300, 1.5), 21.6, .2)
# 23.15 ¡pop! + final
X.add(bubble_pop(1.3), 23.15, .9); X.add(boing(.25, 300, 650), 23.18, .3)
for n, t in [('C5', 23.55), ('F5', 23.7), ('A5', 23.85), ('C6', 24.0)]: X.add(marimba(hz(n), 1.0, .4), t, .4)
X.add(crash(), 23.55, .5)
for n in ['F3', 'A4', 'C5', 'F5']: X.add(pad([hz(n)], 1.4), 23.55, .1)
for i in range(5):
    tb = 23.55 + i * .25; X.add(kick(), tb, .45) if i % 2 == 0 else X.add(clap(), tb, .35)

out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'salida', 'musica_ep2.wav')
os.makedirs(os.path.dirname(out), exist_ok=True)
X.save(out)
print('ok ->', out)
