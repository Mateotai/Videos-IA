"""Estilos musicales para el anuncio. Todos a 120 BPM, 9 compases + acorde final (pulso 36 = 18 s).

Cada función recibe un `Song` y escribe su partitura. Ver motor_audio.py para la línea de tiempo.
"""
from motor_audio import Song, voicing, bass_note, m, HITS, FILLS, BUILD, STOP

# notas de percusión General MIDI (canal 10)
KICK, STICK, SNARE, CLAP, HH, HHO, CRASH, CRASH2 = 36, 37, 38, 39, 42, 46, 49, 57
TOM_L, TOM_LM, TOM_HM, TOM_H = 45, 47, 48, 50
TAMB, COWBELL, BONGO_H, BONGO_L = 54, 56, 60, 61
CONGA_M, CONGA_O, CONGA_L, TIMB_H, TIMB_L = 62, 63, 64, 65, 66
CABASA, MARACAS, GUIRO_S, GUIRO_L, CLAVES = 69, 70, 73, 74, 75
DR = 9


def stopped(b):
    return STOP[0] <= b < STOP[1]


def hits(s, crash=CRASH, extra=None):
    for b in HITS:
        s.note(b, DR, crash, 1, 115 if b in (18, 36) else 100, human=False)
        s.note(b, DR, KICK, .2, 115, human=False)
        if extra:
            s.note(b, DR, extra, .5, 100, human=False)


def fills(s, hi, lo, build_hi=None):
    for start, n in FILLS:
        for i in range(n):
            s.note(start + i * .25, DR, hi if i < n // 2 else lo, .2, 85 + 6 * i)
    start, n = BUILD
    for i in range(n):
        s.note(start + i * .25, DR, (build_hi or hi) if i % 2 == 0 else lo, .2, 60 + int(60 * i / (n - 1)))


# ============================================================
#  1. MARIMBA SALVADOREÑA (Fa mayor, aire de 12/8)
# ============================================================
def marimba(s: Song):
    FMAJ = [0, 2, 4, 5, 7, 9, 10]
    s.inst(0, 12, 118, 58, 50)        # marimba principal
    s.inst(1, 12, 96, 76, 50)         # marimba segunda voz
    s.inst(2, 32, 112, 64, 30)        # contrabajo
    s.inst(3, 12, 78, 44, 40)         # marimba de acompañamiento (pa-pa)
    s.inst(4, 48, 52, 64, 70)         # cuerdas suaves de fondo
    BARS = ['F', 'C7', 'C7', 'F', 'Bb', 'F', 'C7', 'F', 'C7']
    # melodía en tresillos (1 unidad = 1/3 de pulso, 12 por compás)
    MEL = [
        [('C5', 1), ('F5', 1), ('A5', 1), ('C6', 2), ('A5', 1), ('F5', 3), ('G5', 1), ('A5', 1), ('G5', 1)],
        [('E5', 1), ('G5', 1), ('Bb5', 1), ('C6', 2), ('Bb5', 1), ('G5', 3), ('A5', 1), ('G5', 1), ('F5', 1)],
        [('E5', 2), ('G5', 1), ('E5', 2), ('C5', 1), ('D5', 1), ('E5', 1), ('F5', 1), ('G5', 3)],
        [('C5', 2), ('E5', 1), ('F5', 3), ('A5', 3), ('C6', 3)],
        [('D6', 3), ('C6', 1), ('Bb5', 1), ('A5', 1), ('F6', 4), ('D6', 1), ('Bb5', 1)],
        [('C6', 1), ('A5', 1), ('F5', 1), ('C6', 1), ('A5', 1), ('F5', 1), ('A5', 3), ('R', 3)],
        [('R', 3), ('C6', 3), ('Bb5', 1), ('A5', 1), ('G5', 1), ('E5', 3)],
        [('F5', 1), ('A5', 1), ('C6', 1), ('F6', 3), ('E6', 1), ('D6', 1), ('C6', 1), ('A5', 3)],
        [('G5', 3), ('C6', 1), ('D6', 1), ('E6', 1), ('F6', 1), ('G6', 1), ('E6', 1), ('C6', 1), ('D6', 1), ('E6', 1)],
    ]
    s.melody(0, MEL, 108, harm=1, scale=FMAJ, harm_steps=-2, unit=1 / 3, tremolo=.9)
    for b, ch in enumerate(BARS):
        t0 = b * 4
        for k in range(4):
            bt = t0 + k
            if stopped(bt):
                continue
            s.note(bt, 2, bass_note(ch, 36, 0 if k % 2 == 0 else 2), .6, 100 if k % 2 == 0 else 85)
            for f in (1 / 3, 2 / 3):
                s.chord(bt + f, 3, voicing(ch, 55), .22, 68)
            s.note(bt, DR, MARACAS, .1, 60)
            for f in (1 / 3, 2 / 3):
                s.note(bt + f, DR, MARACAS, .1, 38)
            if k in (1, 3):
                s.note(bt + 2 / 3, DR, CLAVES, .1, 62)
                s.note(bt + 1 / 3, DR, BONGO_H, .1, 55); s.note(bt + 2 / 3, DR, BONGO_L, .1, 60)
            if k in (0, 2):
                s.note(bt, DR, KICK, .2, 70)
        s.chord(t0, 4, voicing(ch, 53), 3.9, 50, human=False)
    hits(s)
    # redobles en tresillos de toms
    for start, n in FILLS:
        for i in range(6):
            s.note(start + i / 3, DR, [TOM_H, TOM_HM, TOM_LM, TOM_L, TOM_L, TOM_L][i], .2, 80 + 6 * i)
    for i in range(12):   # subida final
        s.note(34 + i / 6, DR, TOM_H if i % 2 == 0 else TOM_L, .15, 55 + 5 * i)
    # final
    for n in ['F4', 'A4', 'C5', 'F5', 'A5', 'C6', 'F6']:
        for k in range(14):
            s.note(36 + k / 6, 0 if int(n[-1]) >= 6 else 1, n, .2, 110 - 4 * k, human=False)
    s.note(36, 2, 'F2', 2.5, 115, human=False)
    s.chord(36, 4, voicing('F', 53), 3, 80, human=False)


# ============================================================
#  2. MERENGUE CON METALES (Sol mayor)
# ============================================================
def merengue(s: Song):
    GMAJ = [0, 2, 4, 6, 7, 9, 11]
    s.inst(0, 56, 112, 72, 45)        # trompeta
    s.inst(1, 65, 96, 54, 45)         # saxo alto (voz de abajo)
    s.inst(2, 33, 112, 64, 25)        # bajo
    s.inst(3, 0, 92, 40, 35)          # piano
    s.inst(4, 57, 100, 80, 45)        # trombones (golpes)
    BARS = ['G', 'D7', 'D7', 'G', 'C', 'G', 'D7', 'G', 'D7']
    MEL = [
        [('D5', .5), ('G5', .5), ('B5', .5), ('D6', .5), ('B5', .25), ('D6', .25), ('B5', .5), ('G5', 1)],
        [('C6', .5), ('A5', .5), ('F#5', .5), ('A5', .5), ('C6', 1), ('B5', .5), ('A5', .5)],
        [('A5', .5), ('F#5', .5), ('D5', 1), ('R', .5), ('D5', .25), ('E5', .25), ('F#5', 1)],
        [('R', .5), ('D5', .5), ('G5', 1), ('B5', 1), ('D6', 1)],
        [('E6', 1), ('D6', .5), ('C6', .5), ('G6', 1.5), ('E6', .5)],
        [('D6', .5), ('B5', .5), ('G5', .5), ('B5', .5), ('D6', 1), ('R', 1)],
        [('R', 1), ('C6', 1), ('B5', .5), ('A5', .5), ('F#5', 1)],
        [('G5', .5), ('B5', .5), ('D6', 1), ('E6', .5), ('D6', .5), ('B5', 1)],
        [('A5', 1), ('D5', .25), ('E5', .25), ('F#5', .25), ('G5', .25), ('A5', .5), ('B5', .5), ('C6', 1)],
    ]
    s.melody(0, MEL, 110, harm=1, scale=GMAJ, harm_steps=-2, harm_vel=-18, stacc=.7)
    for b, ch in enumerate(BARS):
        t0 = b * 4
        v = voicing(ch, 55)
        for k in range(8):
            bt = t0 + k * .5
            if stopped(bt):
                continue
            n = v[k % 3] + (12 if k % 2 else 0)
            s.note(bt, 3, n, .3, 88 if k % 2 == 0 else 72)
            if k % 2:
                s.chord(bt, 3, [x + 12 for x in v], .2, 62)
        for off, deg, vel in [(0, 0, 105), (1.5, 2, 90), (2, 0, 98), (3.5, 2, 88)]:
            if not stopped(t0 + off):
                s.note(t0 + off, 2, bass_note(ch, 36, deg), .4, vel)
        for k in range(16):  # güira en semicorcheas
            bt = t0 + k * .25
            if not stopped(bt):
                s.note(bt, DR, CABASA, .1, 70 if k % 2 == 0 else 42)
        for k in range(4):
            bt = t0 + k
            if not stopped(bt):
                s.note(bt, DR, KICK, .2, 88)
                s.note(bt, DR, GUIRO_S, .1, 55)
        for off, n, vel in [(.5, STICK, 70), (1.5, STICK, 70), (2.75, TOM_L, 80), (3, TOM_L, 95), (3.5, TOM_LM, 90)]:
            if not stopped(t0 + off):
                s.note(t0 + off, DR, n, .2, vel)
    hits(s)
    fills(s, TOM_HM, TOM_L, build_hi=SNARE)
    STABS = {0: 'G', 18: 'C', 25: 'D7', 32: 'D7'}
    for bt, ch in STABS.items():
        s.chord(bt, 4, voicing(ch, 52), .45, 112, human=False)
        s.chord(bt, 0, [voicing(ch, 67)[-1]], .45, 110, human=False)
    for n in ['G3', 'B3', 'D4', 'G4']:
        s.note(36, 4, n, 2.4, 118, human=False)
    for n in ['B5', 'D6', 'G6']:
        s.note(36, 0, n, 2.4, 118, human=False)
    s.chord(36, 1, ['G4', 'B4', 'D5'], 2.4, 105, human=False)
    s.chord(36, 3, voicing('G', 43) + voicing('G', 67), 2.4, 110, human=False)
    s.note(36, 2, 'G2', 2.4, 118, human=False)


# ============================================================
#  3. URBANO / DEMBOW (La menor, batería 808)
# ============================================================
def urbano(s: Song):
    AMIN = [0, 2, 4, 5, 7, 9, 11]
    s.drum_prog = 25
    s.inst(0, 80, 82, 64, 55, 30)     # sintetizador principal (cuadrado)
    s.inst(1, 4, 92, 70, 55, 40)      # piano eléctrico (octava abajo)
    s.inst(2, 38, 118, 64, 10, 0)     # bajo sintetizado
    s.inst(3, 89, 72, 64, 80, 60)     # colchón cálido
    s.inst(4, 5, 70, 48, 50, 40)      # acordes de piano eléctrico
    s.mix[9] = (118, 64, 15, 0)
    BARS = ['Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G', 'E7']
    MEL = [
        [('E5', .5), ('E5', .5), ('C5', .5), ('E5', .5), ('D5', .75), ('C5', .75), ('A4', .5)],
        [('A4', .5), ('C5', .5), ('F5', .5), ('E5', .5), ('C5', .75), ('A4', .75), ('C5', .5)],
        [('G5', .5), ('E5', .5), ('G5', .5), ('E5', .5), ('D5', .75), ('C5', .75), ('R', .5)],
        [('R', .5), ('B4', .5), ('D5', 1), ('G5', 1), ('B5', 1)],
        [('C6', 1), ('B5', .5), ('A5', .5), ('E6', 1.5), ('C6', .5)],
        [('A5', .5), ('F5', .5), ('C5', .5), ('F5', .5), ('A5', 1), ('R', 1)],
        [('R', 1), ('C6', 1), ('B5', .5), ('G5', .5), ('E5', 1)],
        [('D5', .5), ('G5', .5), ('B5', 1), ('A5', .5), ('G5', .5), ('D5', 1)],
        [('E5', 1), ('B4', .25), ('D5', .25), ('E5', .25), ('G#5', .25), ('B5', .5), ('D6', .5), ('E6', 1)],
    ]
    s.melody(0, MEL, 100, harm=1, scale=AMIN, harm_steps=-7, harm_vel=-5, stacc=.75)
    for b, ch in enumerate(BARS):
        t0 = b * 4
        s.chord(t0, 3, voicing(ch, 57), 3.95, 60, human=False)
        for off in (0, .75, 1.5, 2, 2.75, 3.5):           # acordes con ritmo de dembow
            if not stopped(t0 + off):
                s.chord(t0 + off, 4, voicing(ch, 60), .3, 62)
        for off, dur, oc in [(0, .7, 0), (1.5, .4, 12), (2, .7, 0), (3.5, .4, 12)]:
            if not stopped(t0 + off):
                s.note(t0 + off, 2, bass_note(ch, 33) + oc, dur, 110)
        for half in (0, 2):                                # dembow: bombo 1-2, caja en la "a" del 1 y el "y" del 2
            for off, n, vel in [(0, KICK, 112), (1, KICK, 105), (.75, SNARE, 100), (1.5, SNARE, 105),
                                (.75, CLAP, 70), (1.5, CLAP, 75)]:
                bt = t0 + half + off
                if not stopped(bt):
                    s.note(bt, DR, n, .2, vel)
        for k in range(8):
            bt = t0 + k * .5
            if not stopped(bt):
                s.note(bt, DR, HH, .1, 62 if k % 2 else 48)
        if b % 2 == 1:                                     # redoblito de charles
            for k in range(4):
                s.note(t0 + 3.5 + k * .125, DR, HH, .06, 45 + 8 * k)
    hits(s, extra=CLAP)
    fills(s, SNARE, SNARE)
    s.chord(36, 3, voicing('Am', 57), 3, 90, human=False)
    s.chord(36, 4, voicing('Am', 60) + voicing('Am', 72), 2.5, 100, human=False)
    s.note(36, 0, 'A5', 2.5, 110, human=False)
    s.note(36, 1, 'A4', 2.5, 105, human=False)
    s.note(36, 2, 'A1', 2.5, 120, human=False)


# ============================================================
#  4. POP ALEGRE (Re mayor): silbido, glockenspiel, guitarrita y palmas
# ============================================================
def pop(s: Song):
    DMAJ = [1, 2, 4, 6, 7, 9, 11]
    s.inst(0, 78, 108, 64, 60)        # silbido
    s.inst(1, 9, 74, 84, 60)          # glockenspiel
    s.inst(2, 33, 106, 64, 25)        # bajo
    s.inst(3, 24, 104, 42, 40)        # guitarra de nailon (tipo ukelele)
    s.inst(4, 48, 48, 64, 70)         # cuerdas suaves
    BARS = ['D', 'A', 'Bm', 'G', 'D', 'A', 'G', 'D', 'A']
    MEL = [
        [('F#5', .5), ('A5', .5), ('A5', .5), ('B5', .5), ('A5', 1), ('F#5', .5), ('D5', .5)],
        [('E5', .5), ('A5', .5), ('A5', .5), ('B5', .5), ('C#6', 1), ('B5', .5), ('A5', .5)],
        [('B5', .5), ('A5', .5), ('F#5', 1), ('D5', .5), ('E5', .5), ('F#5', 1)],
        [('R', .5), ('D5', .5), ('G5', 1), ('B5', 1), ('D6', 1)],
        [('F#6', 1), ('E6', .5), ('D6', .5), ('A6', 1.5), ('F#6', .5)],
        [('E6', .5), ('C#6', .5), ('A5', .5), ('C#6', .5), ('E6', 1), ('R', 1)],
        [('R', 1), ('D6', 1), ('B5', .5), ('A5', .5), ('G5', 1)],
        [('F#5', .5), ('A5', .5), ('D6', 1), ('C#6', .5), ('B5', .5), ('A5', 1)],
        [('E5', 1), ('C#5', .25), ('D5', .25), ('E5', .25), ('F#5', .25), ('G5', .5), ('A5', .5), ('C#6', 1)],
    ]
    s.melody(0, MEL, 100, harm=1, scale=DMAJ, harm_steps=0, harm_vel=-12, stacc=.85)
    STRUM = [(0, 1, 92), (1, 1, 80), (1.5, -1, 66), (2.5, -1, 70), (3, 1, 84), (3.5, -1, 66)]
    for b, ch in enumerate(BARS):
        t0 = b * 4
        v = voicing(ch, 62) + [voicing(ch, 62)[0] + 12]
        for off, d, vel in STRUM:
            if not stopped(t0 + off):
                s.chord(t0 + off, 3, v if d > 0 else v[::-1], .45, vel, strum=.03)
        s.chord(t0, 4, voicing(ch, 54), 3.9, 46, human=False)
        for off, deg, dur in [(0, 0, .9), (1.5, 0, .4), (2, 2, .9), (3.5, 1, .4)]:
            if not stopped(t0 + off):
                s.note(t0 + off, 2, bass_note(ch, 38, deg), dur, 100)
        for k in range(4):
            bt = t0 + k
            if stopped(bt):
                continue
            if k in (0, 2):
                s.note(bt, DR, KICK, .2, 95)
            else:
                s.note(bt, DR, CLAP, .2, 100); s.note(bt, DR, SNARE, .2, 55)
            s.note(bt + .5, DR, TAMB, .1, 62)
            for q in range(4):
                s.note(bt + q * .25, DR, MARACAS, .08, 40 if q % 2 else 28)
        if not stopped(t0 + 2.5):
            s.note(t0 + 2.5, DR, KICK, .2, 75)
    hits(s)
    fills(s, SNARE, TOM_L)
    v = voicing('D', 62) + [74]
    s.chord(36, 3, v, 2.5, 110, strum=.04, human=False)
    s.chord(36, 4, voicing('D', 50) + voicing('D', 62), 3, 85, human=False)
    s.note(36, 0, 'D6', 2.4, 112, human=False)
    s.note(36, 1, 'D6', 2.4, 95, human=False)
    s.note(36, 2, 'D2', 2.4, 115, human=False)


# ============================================================
#  0. CUMBIA (la versión anterior, por si se quiere volver)
# ============================================================
def cumbia(s: Song):
    CMAJ = [0, 2, 4, 5, 7, 9, 11]
    s.inst(0, 21, 112, 70, 50, 25); s.inst(1, 21, 92, 58, 50, 25); s.inst(2, 33, 115, 64, 50, 25)
    s.inst(3, 25, 72, 40, 50, 25); s.inst(4, 61, 100, 84, 50, 25); s.inst(5, 21, 70, 64, 50, 25)
    BARS = ['C', 'G7', 'G7', 'C', 'F', 'C', 'G7', 'C', 'G7']
    MEL = [
        [('G5', .5), ('E5', .5), ('G5', .5), ('A5', .5), ('G5', 1), ('E5', .5), ('C5', .5)],
        [('D5', .5), ('F5', .5), ('G5', .5), ('F5', .5), ('D5', 1), ('B4', .5), ('D5', .5)],
        [('F5', .5), ('E5', .5), ('D5', .5), ('B4', .5), ('G4', 1), ('R', 1)],
        [('G4', .5), ('B4', .5), ('C5', 1), ('E5', 1), ('G5', 1)],
        [('C6', 1), ('A5', .5), ('F5', .5), ('C6', 1.5), ('A5', .5)],
        [('G5', .5), ('E5', .5), ('C5', .5), ('E5', .5), ('G5', 1), ('R', 1)],
        [('R', 1), ('B5', 1), ('A5', .5), ('G5', .5), ('F5', 1)],
        [('E5', .5), ('G5', .5), ('C6', 1), ('B5', .5), ('A5', .5), ('G5', 1)],
        [('G5', 1), ('D5', .25), ('E5', .25), ('F5', .25), ('G5', .25), ('A5', .5), ('B5', .5), ('D6', 1)],
    ]
    s.melody(0, MEL, 104, harm=1, scale=CMAJ, grace=True, skip_grace_bars=(3,))
    nxt = BARS[1:] + ['C']
    for b, ch in enumerate(BARS):
        t0 = b * 4
        s.note(t0, 2, bass_note(ch, 36), .9, 100); s.note(t0 + 1.5, 2, bass_note(ch, 36), .45, 80)
        s.note(t0 + 2, 2, bass_note(ch, 36, 2), .9, 95); s.note(t0 + 3, 2, bass_note(ch, 36, 1), .45, 78)
        s.note(t0 + 3.5, 2, bass_note(nxt[b], 36) - 1, .45, 72)
        for k in range(4):
            if not stopped(t0 + k + .5) and not (b == 6 and k == 0):
                s.chord(t0 + k + .5, 3, voicing(ch, 60), .22, 74)
        s.chord(t0, 5, voicing(ch, 60), 3.9, 38, human=False)
        for k in range(4):
            bt = t0 + k
            if stopped(bt):
                continue
            s.note(bt, DR, GUIRO_L, .4, 78); s.note(bt + .5, DR, GUIRO_S, .2, 62); s.note(bt + .75, DR, GUIRO_S, .2, 55)
        for off, n, v in [(0, CONGA_M, 55), (1, CONGA_M, 95), (1.5, CONGA_O, 65), (2, CONGA_M, 55), (3, CONGA_O, 90),
                          (3.5, CONGA_L, 92), (0, KICK, 88), (2, KICK, 88), (1, COWBELL, 52), (3, COWBELL, 52)]:
            if not stopped(t0 + off):
                s.note(t0 + off, DR, n, .2, v)
    hits(s)
    fills(s, TIMB_H, TIMB_L)
    for bt, ch, d in [(0, 'C', .45), (18, 'F', .9), (25, 'G7', .6), (32, 'G7', .45), (36, 'C', 2.6)]:
        s.chord(bt, 4, voicing(ch, 60), d, 112, human=False)
    s.chord(36, 1, voicing('C', 60), 2.6, 105, human=False)
    s.chord(36, 0, voicing('C', 72) + [84], 2.6, 112, human=False)
    s.note(36, 2, 'C2', 2.4, 115, human=False)


ESTILOS = {
    'marimba': (marimba, 'Marimba salvadoreña'),
    'merengue': (merengue, 'Merengue con metales'),
    'urbano': (urbano, 'Urbano / dembow'),
    'pop': (pop, 'Pop alegre (silbido y palmas)'),
    'cumbia': (cumbia, 'Cumbia (versión anterior)'),
}
