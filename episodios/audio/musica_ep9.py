"""Música y efectos del Episodio 9 "Pancake" (42.5 s)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintes import *
X = Mix(42.5); B = 60 / 126

prog = [['F2', 'A3', 'C4', 'F4'], ['D2', 'A3', 'D4', 'F4'], ['Bb1', 'Bb3', 'D4', 'F4'], ['C2', 'G3', 'C4', 'E4']]
mel = ['C5', 'F5', 'A5', 'G5', 'F5', 'C5', 'D5', 'F5', 'D5', 'A5', 'F5', 'D5', 'C5', 'A4', 'C5', 'D5',
       'Bb4', 'D5', 'F5', 'Bb5', 'A5', 'F5', 'D5', 'F5', 'G5', 'E5', 'C5', 'G5', 'F5', 'E5', 'D5', 'C5']
def theme(t0, t1, g=1.0, lead=whistle, drums=True):
    bar = 0
    while t0 + bar * 4 * B < t1:
        tb0 = t0 + bar * 4 * B; ch = prog[bar % 4]
        for b in range(4):
            tb = tb0 + b * B
            if tb > t1: break
            X.add(bass(hz(ch[0]) * 2, .35), tb, .45 * g)
            if drums: X.add(kick(), tb, .55 * g) if b in (0, 2) else X.add(clap(), tb, .4 * g)
            X.add(shaker(), tb + B / 2, .7 * g, .3)
            for k, nn in enumerate(ch[1:]): X.add(pizz(hz(nn), .25), tb + B / 2 + k * .01, .12 * g, -.3)
        for kk in range(8):
            tn = tb0 + kk * B / 2
            if tn < t1: X.add(lead(hz(mel[(bar % 4) * 8 + kk]), B / 2 * .9), tn, .22 * g, .15)
        bar += 1

# 0–5: Pip y su tortita: caja de música tierna
for k, n in enumerate(['F5', 'A5', 'C6', 'A5', 'Bb5', 'D6', 'C6', 'A5', 'G5', 'Bb5', 'A5', 'F5']):
    X.add(musicbox(hz(n), .9), .1 + k * .38, .22, (-1) ** k * .2)
for k, c in enumerate([['F3', 'A3', 'C4'], ['D3', 'F3', 'A3'], ['Bb2', 'D3', 'F3'], ['C3', 'E3', 'G3']]):
    X.add(pad([hz(x) for x in c], 1.2), .1 + k * 1.15, .12)
X.add(pop(500, 900, .1), 2.05, .4); X.add(thud(), 2.1, .15)
for k in range(5): X.add(pop(1800, 2400, .03), 2.55 + k * .15, .2)
X.add(chime(hz('C7')), 3.3, .45); X.add(chime(hz('F7')), 3.42, .35)
# 5–10: entra Mochi + sueño + sartén
theme(5.0, 6.3, .8)
X.add(boing(.3, 300, 900), 6.35, .4)
for k, n in enumerate(['C6', 'E6', 'G6', 'C7', 'E7']): X.add(chime(hz(n)), 6.8 + k * .12, .25)
for k in range(10): X.add(pop(700 + k * 120, 1200 + k * 150, .08), 6.95 + k * .11, .25, (-1) ** k * .3)
X.add(pad([hz('F4'), hz('A4'), hz('C5'), hz('E5')], 1.6), 6.8, .15)
X.add(pop(400, 1500, .1), 8.4, .4)
X.add(boing(.4, 200, 1000), 9.1, .45); X.add(whoosh(.4), 9.35, .4)
X.add(crash(), 9.85, .45); X.add(thud(), 9.85, .7)
for f in [1800, 2400, 3100]: X.add(chime(f), 9.86, .2)
# 10–16: cocinando (tema principal)
theme(10.15, 15.7, 1.0)
X.add(slide(500, 250, 2.0), 10.5, .12)
for k in range(30): X.add(hat(.05), 11.5 + k * .14, .12, (-1) ** k * .5)   # chisporroteo
for k in range(8): X.add(bubble_pop(1 + k * .1), 12.7 + k * .17, .35)
X.add(slide(900, 300, .35), 13.95, .3); X.add(thud(), 14.3, .5); X.add(boing(.25, 150, 400), 14.32, .3)
X.add(riser(.7), 15.2, .3)
# 16–22: ¡voltereta!
X.add(whoosh(.6), 16.0, .55); X.add(slide(300, 1600, 1.3), 16.05, .3)
for k, n in enumerate(['F5', 'G5', 'A5', 'C6', 'D6', 'F6']): X.add(marimba(hz(n), .5), 16.05 + k * .1, .3)
for k in range(8): X.add(pizz(hz(['C5', 'D5'][k % 2]), .2), 17.6 + k * .3, .25)   # esperando...
X.add(slide(1500, 300, 1.4), 18.8, .25)
X.add(warble(800, 400, .8), 19.3, .2)
X.add(thud(), 20.2, .9); X.add(crash(), 20.2, .25); X.add(boing(.5, 120, 300), 20.25, .4)
for k in range(6): X.add(pop(300, 500, .06), 20.95 + k * .15, .3, (-1) ** k * .3)
# 22–29: mantequilla resbalando + burrito
X.add(slide(1200, 500, 1.0), 22.2, .25)
for k in range(4): X.add(pizz(hz(['A4', 'C5', 'A4', 'F4'][k]), .2), 23.2 + k * .15, .3)
X.add(boing(.3, 300, 800), 23.9, .4)
theme(24.2, 28.9, .9, lead=marimba)
for k in range(6): X.add(thud(), 24.3 + k * .27, .3)
X.add(whoosh(.5), 24.3, .3)
X.add(pop(600, 2000, .12), 26.0, .6)
for k, n in enumerate(['E4', 'Eb4', 'D4', 'Db4']): X.add(whistle(hz(n), .24 if k < 3 else .5, vib=9), 26.6 + k * .25, .25)
# 29–35: ¡squish! la mantequilla vuela -> BONK -> SPLAT
X.add(warble(300, 120, .3), 29.15, .5); X.add(pop(400, 2500, .15), 29.3, .6)
X.add(slide(600, 1400, .5), 29.35, .25); X.add(slide(1400, 500, .5), 29.85, .25)
X.add(pop(900, 300, .1), 30.35, .7); X.add(chime(hz('C7')), 30.36, .3)
X.add(thud(), 30.52, .8); X.add(bubble_pop(.6), 30.55, .5)
for k in range(8): X.add(pizz(hz(['F4', 'A4', 'C5', 'A4'][k % 4]), .15), 31.2 + k * .45, .2, (-1) ** k * .3)
X.add(boing(.3, 200, 500), 33.0, .2)
# 35–40: bigote de mantequilla + final tierno
X.add(boing(.4, 200, 900), 34.95, .45)
for k in range(3): X.add(chime(hz(['F6', 'A6', 'C7'][k])), 35.3 + k * .13, .3)
for k, (r, chs) in enumerate([('F2', ['A3', 'C4', 'F4']), ('D2', ['A3', 'D4', 'F4']), ('Bb1', ['Bb3', 'D4', 'F4']), ('C2', ['G3', 'C4', 'E4']), ('F2', ['A3', 'C4', 'F4'])]):
    X.add(pad([hz(c) for c in chs], .95), 35.8 + k * .85, .2); X.add(bass(hz(r) * 2, .6), 35.8 + k * .85, .3)
for k, n in enumerate(['C5', 'F5', 'A5', 'G5', 'F5', 'D5', 'F5', 'Bb5', 'A5', 'G5', 'C5', 'E5', 'G5', 'F5']): X.add(marimba(hz(n), .8, .3), 35.8 + k * .28, .22, (-1) ** k * .3)
for k in range(10): X.add(pop(2000, 2600, .03), 35.5 + k * .45, .15)   # lengüetazos
# 40: cierre
for n, t in [('F5', 40.0), ('A5', 40.15), ('C6', 40.3), ('F6', 40.45)]: X.add(marimba(hz(n), 1.0, .4), t, .4)
X.add(crash(), 40.0, .45)
for n in ['F2', 'A3', 'C4', 'F4']: X.add(pad([hz(n)], 1.8), 40.0, .1)
for i in range(6): tb = 40.0 + i * .23; X.add(kick(), tb, .45) if i % 2 == 0 else X.add(clap(), tb, .35)
X.save(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'salida', 'musica_ep9.wav')); print('ok')
