"""Música + efectos del anuncio de pupusas (20 s).

Cumbia a 120 BPM (1 compás = 2 s) con instrumentos reales del banco General MIDI
FluidR3 (acordeón, bajo, guitarra, metales, güiro, congas, timbales, cencerro):
  1. se compone la partitura en MIDI (mido)
  2. se interpreta con fluidsynth + FluidR3_GM.sf2 (con reverb y chorus)
  3. se mezclan encima los efectos sincronizados con la animación (numpy)

Sincronía con el vídeo:
  0.0        arranque: platillo + metales + acordeón
  2.75 / 4.4 la pupusa cae al comal / se voltea · chisporroteo 2.7-5.9
  5.5-6.0    redoble de timbales → 6.5/7/7.5/8 las 4 pupusas (melodía que sube)
  9.0        sello "SOLO 7 €": golpe de metales + platillo
  12.0-12.5  corte (stop) mientras corre el calendario → 12.5 golpe en el 28
  16.0       sello del cartel final · 17-18 redoble creciente
  18.0       acorde final "ta-dá"

Requisitos: pip install mido numpy · apt install fluidsynth fluid-soundfont-gm
"""
import os
import subprocess
import wave
import numpy as np
import mido

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'salida')
os.makedirs(OUT, exist_ok=True)
SF2 = '/usr/share/sounds/sf2/FluidR3_GM.sf2'

SR = 44100
DUR = 20.0
TPB = 480                # ticks por pulso
BEAT = 0.5               # 120 BPM
rnd = np.random.default_rng(3)


def m(name):
    notes = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    return 12 * (int(name[-1]) + 1) + notes[name[0]] + (1 if '#' in name else 0) - (1 if name[1:2] == 'b' else 0)


# ============================================================
#  1. PARTITURA
# ============================================================
events = []  # (beat, canal, nota, duración_en_pulsos, velocidad)


def note(beat, ch, n, dur, vel, human=True):
    if human:
        beat += rnd.normal(0, .008)
        vel += int(rnd.integers(-6, 7))
    events.append((max(0.0, beat), ch, n if isinstance(n, int) else m(n), dur, int(np.clip(vel, 1, 127))))


ACC, ACC2, BASS, GTR, BRASS, PAD, DR = 0, 1, 2, 3, 4, 5, 9
PROGRAMS = {ACC: 21, ACC2: 21, BASS: 33, GTR: 25, BRASS: 61, PAD: 21}

CHORDS = {'C': ['C', 'E', 'G'], 'F': ['F', 'A', 'C'], 'G7': ['G', 'B', 'D', 'F']}
BARS = ['C', 'G7', 'G7', 'C', 'F', 'C', 'G7', 'C', 'G7']   # 0-18 s; a los 18 s acorde final en Do
ROOT2 = {'C': 'C2', 'F': 'F2', 'G7': 'G2'}
FIFTH2 = {'C': 'G2', 'F': 'C3', 'G7': 'D2'}

# --- melodía de acordeón: (nota, pulsos); 'R' = silencio ---
MEL = [
    [('G5', .5), ('E5', .5), ('G5', .5), ('A5', .5), ('G5', 1), ('E5', .5), ('C5', .5)],
    [('D5', .5), ('F5', .5), ('G5', .5), ('F5', .5), ('D5', 1), ('B4', .5), ('D5', .5)],
    [('F5', .5), ('E5', .5), ('D5', .5), ('B4', .5), ('G4', 1), ('R', 1)],
    [('G4', .5), ('B4', .5), ('C5', 1), ('E5', 1), ('G5', 1)],          # 1-2-3 pupusas
    [('C6', 1), ('A5', .5), ('F5', .5), ('C6', 1.5), ('A5', .5)],       # 4ª pupusa · sello 7 €
    [('G5', .5), ('E5', .5), ('C5', .5), ('E5', .5), ('G5', 1), ('R', 1)],
    [('R', 1), ('B5', 1), ('A5', .5), ('G5', .5), ('F5', 1)],           # golpe en el 28
    [('E5', .5), ('G5', .5), ('C6', 1), ('B5', .5), ('A5', .5), ('G5', 1)],
    [('G5', 1), ('D5', .25), ('E5', .25), ('F5', .25), ('G5', .25), ('A5', .5), ('B5', .5), ('D6', 1)],
]
SCALE = ['C', 'D', 'E', 'F', 'G', 'A', 'B']


def third_below(name):
    i = SCALE.index(name[0]); o = int(name[-1])
    j = i - 2
    if j < 0:
        j += 7; o -= 1
    return SCALE[j] + str(o)


for b, line in enumerate(MEL):
    beat = b * 4
    for n, d in line:
        if n != 'R':
            length = d * (.8 if d <= .5 else .92)
            acc = 104 if (beat % 1 == 0) else 92
            # adorno: apoyatura rápida desde la nota de arriba en notas largas
            if d >= 1 and b not in (3,):
                up = SCALE[(SCALE.index(n[0]) + 1) % 7] + (n[-1] if n[0] != 'B' else str(int(n[-1]) + 1))
                note(beat - .09, ACC, up, .08, 80)
            note(beat, ACC, n, length, acc)
            note(beat, ACC2, third_below(n), length, acc - 30)
        beat += d

# --- acompañamiento por compás ---
NEXT_ROOT = BARS[1:] + ['C']
for b, ch in enumerate(BARS):
    t0 = b * 4
    # bajo: tónica (1), tónica (2&), quinta (3), nota de paso hacia el próximo acorde (4)
    nxt = m(ROOT2[NEXT_ROOT[b]])
    note(t0 + 0, BASS, ROOT2[ch], .9, 100)
    note(t0 + 1.5, BASS, ROOT2[ch], .45, 80)
    note(t0 + 2, BASS, FIFTH2[ch], .9, 95)
    note(t0 + 3, BASS, m(CHORDS[ch][1] + '2'), .45, 78)
    note(t0 + 3.5, BASS, nxt - 1, .45, 72)
    # guitarra: rasgueo corto en los contratiempos
    voic = [m(n + '4') for n in CHORDS[ch]]
    for k in range(4):
        if b == 6 and k < 1:   # corte antes del golpe del 28
            continue
        for v in voic:
            note(t0 + k + .5, GTR, v, .22, 74)
    # colchón suave de acordeón
    for n in CHORDS[ch][:3]:
        note(t0, PAD, n + '4', 3.9, 38, human=False)

# --- percusión (canal 10) ---
KICK, CRASH, CRASH2, COWBELL, CONGA_M, CONGA_O, CONGA_L = 36, 49, 57, 56, 62, 63, 64
TIMB_H, TIMB_L, MARACAS, GUIRO_S, GUIRO_L, CLAVES = 65, 66, 70, 73, 74, 75
STOP = (24.0, 25.0)   # pulsos 24-25 (12.0-12.5 s): corte

for b in range(9):
    t0 = b * 4
    for k in range(4):
        bt = t0 + k
        if STOP[0] <= bt < STOP[1]:
            continue
        note(bt, DR, GUIRO_L, .4, 78); note(bt + .5, DR, GUIRO_S, .2, 62); note(bt + .75, DR, GUIRO_S, .2, 55)
        note(bt, DR, MARACAS, .1, 40); note(bt + .5, DR, MARACAS, .1, 50)
    for off, n, v in [(0, CONGA_M, 55), (1, CONGA_M, 95), (1.5, CONGA_O, 65), (2, CONGA_M, 55), (3, CONGA_O, 90), (3.5, CONGA_L, 92)]:
        if not (STOP[0] <= t0 + off < STOP[1]):
            note(t0 + off, DR, n, .2, v)
    for off in (0, 2):
        if not (STOP[0] <= t0 + off < STOP[1]):
            note(t0 + off, DR, KICK, .2, 88)
    for off in (1, 3):
        if not (STOP[0] <= t0 + off < STOP[1]):
            note(t0 + off, DR, COWBELL, .1, 52)


def timbal_fill(start, n16, crescendo=False):
    for i in range(n16):
        v = 70 + (int(50 * i / max(1, n16 - 1)) if crescendo else 25)
        note(start + i * .25, DR, TIMB_H if i % 4 < 2 else TIMB_L, .2, v)


timbal_fill(11, 4)        # 5.5-6.0 s
timbal_fill(21, 4)        # 10.5-11.0 s
timbal_fill(29, 4)        # 14.5-15.0 s
timbal_fill(34, 8, True)  # 17.0-18.0 s

for bt, n, v in [(0, CRASH, 100), (12, CRASH2, 80), (18, CRASH, 115), (22, CRASH2, 90), (25, CRASH, 110),
                 (30, CRASH2, 95), (32, CRASH, 110), (36, CRASH, 127), (36, CRASH2, 110)]:
    note(bt, DR, n, 1, v, human=False)
    note(bt, DR, KICK, .2, 110, human=False)

# --- metales: golpes en los momentos clave ---
STABS = [(0, ['C4', 'E4', 'G4', 'C5'], .45), (18, ['F4', 'A4', 'C5', 'F5'], .9), (25, ['G4', 'B4', 'D5', 'F5'], .6),
         (32, ['G4', 'B4', 'D5', 'F5'], .45), (36, ['C4', 'E4', 'G4', 'C5', 'E5'], 2.6)]
for bt, ns, d in STABS:
    for n in ns:
        note(bt, BRASS, n, d, 112, human=False)
# pequeño "pa-pa" de metales en el contratiempo antes del sello
for n in ['A4', 'C5', 'F5']:
    note(17.5, BRASS, n, .2, 95, human=False)

# --- final: acorde "ta-dá" a los 18 s ---
for n in ['C4', 'E4', 'G4', 'C5', 'E5', 'G5']:
    note(36, ACC2 if int(n[-1]) < 5 else ACC, n, 2.6, 105, human=False)
note(36, ACC, 'C6', 2.6, 115, human=False)
note(36, BASS, 'C2', 2.4, 115, human=False)
note(36, DR, TIMB_L, .3, 120, human=False)

# --- exportar MIDI ---
mid = mido.MidiFile(ticks_per_beat=TPB)
track = mido.MidiTrack(); mid.tracks.append(track)
track.append(mido.MetaMessage('set_tempo', tempo=500000, time=0))
msgs = []
for ch, prog in PROGRAMS.items():
    msgs.append((0, 0, mido.Message('program_change', channel=ch, program=prog)))
    msgs.append((0, 0, mido.Message('control_change', channel=ch, control=91, value=50)))   # reverb
    msgs.append((0, 0, mido.Message('control_change', channel=ch, control=93, value=25)))   # chorus
PAN = {ACC: 70, ACC2: 58, BASS: 64, GTR: 40, BRASS: 84, PAD: 64, DR: 64}
VOL = {ACC: 112, ACC2: 92, BASS: 115, GTR: 72, BRASS: 100, PAD: 70, DR: 105}
for ch in PAN:
    msgs.append((0, 0, mido.Message('control_change', channel=ch, control=10, value=PAN[ch])))
    msgs.append((0, 0, mido.Message('control_change', channel=ch, control=7, value=VOL[ch])))
msgs.append((0, 0, mido.Message('control_change', channel=DR, control=91, value=30)))
for beat, ch, n, d, v in events:
    on = int(round(beat * TPB)); off = int(round((beat + d) * TPB))
    msgs.append((on, 2, mido.Message('note_on', channel=ch, note=n, velocity=v)))
    msgs.append((off, 1, mido.Message('note_off', channel=ch, note=n, velocity=0)))
msgs.sort(key=lambda x: (x[0], x[1]))
last = 0
for tick, _, msg in msgs:
    track.append(msg.copy(time=tick - last)); last = tick
midi_path = os.path.join(OUT, 'banda.mid')
mid.save(midi_path)

# ============================================================
#  2. INTERPRETACIÓN CON FLUIDSYNTH
# ============================================================
band_path = os.path.join(OUT, 'banda.wav')
subprocess.run(['fluidsynth', '-ni', '-g', '0.7', '-r', str(SR), '-R', '1', '-C', '1',
                '-F', band_path, SF2, midi_path], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
with wave.open(band_path) as w:
    band = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2) / 32768.0
N = int(SR * DUR)
mix = np.zeros((N, 2))
mix[:min(N, len(band))] = band[:N]
mix /= np.max(np.abs(mix)) + 1e-9
mix *= .75


# ============================================================
#  3. EFECTOS DE SONIDO (sintetizados)
# ============================================================
def add(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(sig), 0] += sig * gain * l * 1.41
    mix[i:i + len(sig), 1] += sig * gain * r * 1.41


def env(n, a=0.005, d=0.3):
    t = np.arange(n) / SR
    e = np.exp(-t / d)
    na = max(1, int(a * SR))
    e[:na] *= np.linspace(0, 1, na)
    return e


def onepole(x, a):
    y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y


def thud():
    n = int(.35 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * np.cumsum(45 + 120 * np.exp(-t / .03)) / SR)
            + .2 * np.diff(rnd.standard_normal(n + 1)) * np.exp(-t / .015)) * env(n, .001, .1)


def pop(pitch=1.0):
    n = int(.15 * SR); t = np.arange(n) / SR
    f = (420 + 1900 * (t / .15) ** .5) * pitch
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .04)


def boing(dur=.45, f0=170, f1=620):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (t / dur) ** .6
    return np.sin(2 * np.pi * np.cumsum(f * (1 + .06 * np.sin(2 * np.pi * 28 * t))) / SR) * env(n, .004, .16)


def whoosh(dur=.5):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rnd.standard_normal(n)
    a = .03 + .3 * np.sin(np.pi * t / dur) ** 2
    out = np.zeros(n); y = 0.0
    for i in range(n):
        y += a[i] * (x[i] - y); out[i] = y
    return out * np.sin(np.pi * t / dur) ** 1.5 * .6


def tick():
    n = int(.035 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2200 * t) * env(n, .0005, .007)


def sizzle(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    hiss = np.diff(rnd.standard_normal(n + 1)) * .02 * (1 + .5 * np.sin(2 * np.pi * 3.1 * t))
    crack = (rnd.random(n) < 0.002) * rnd.standard_normal(n)
    crack = np.convolve(crack, np.exp(-np.arange(160) / 25), 'same') * .12
    return (hiss + np.diff(np.concatenate([[0], crack]))) * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .4)


def marker(dur=.45):
    n = int(dur * SR); t = np.arange(n) / SR
    s = onepole(rnd.standard_normal(n), .25) * (1 + .5 * np.sin(2 * np.pi * 9 * t))
    return s * np.sin(np.pi * t / dur) * .1


def sparkle():
    out = np.zeros(int(.7 * SR))
    for k, f in enumerate([2093, 2637, 3136, 4186]):
        n = int(.4 * SR); t = np.arange(n) / SR
        s = np.sin(2 * np.pi * f * t) * env(n, .002, .12) * .25
        i = int(k * .06 * SR); out[i:i + n] += s[:len(out) - i]
    return out


add(whoosh(.5), 0.0, .35)
add(whoosh(.45), 2.3, .35)
add(thud(), 2.75, .55)
add(sizzle(3.2), 2.7, .9)
add(boing(), 3.88, .22)
add(thud(), 4.4, .45)
add(whoosh(.5), 5.9, .35)
for k, lt in enumerate([6.5, 7.0, 7.5, 8.0]):
    add(pop(1 + k * .2), lt, .3, (-.3, .3, -.2, .2)[k])
add(whoosh(.3), 8.45, .22, -.5); add(whoosh(.3), 8.6, .22, .5)
add(thud(), 9.0, .6)
add(whoosh(.55), 10.85, .4)
for k in range(10):
    add(tick(), 11.6 + k * .09, .25)
add(thud(), 12.5, .5)
add(marker(), 12.7, 1.0)
for k, lt in enumerate([13.2, 13.3]):
    add(pop(.8 + k * .2), lt, .22)
add(whoosh(.55), 14.85, .4)
for k, lt in enumerate([15.45, 15.55, 15.65, 15.75]):
    add(pop(1 + k * .2), lt, .2)
add(thud(), 16.0, .5)
add(sparkle(), 18.05, .5)

# ============================================================
#  4. MASTER
# ============================================================
fade = np.ones(N); nf = int(.7 * SR); fade[-nf:] = np.linspace(1, 0, nf) ** 1.5
mix *= fade[:, None]
# compresor suave (ratio 3:1) para que el groove suene lleno y el final no se coma todo
lvl = np.max(np.abs(mix), axis=1)
k = int(.03 * SR); lvl = np.convolve(lvl, np.ones(k) / k, 'same')
k2 = int(.15 * SR); lvl = np.maximum(lvl, np.convolve(lvl, np.ones(k2) / k2, 'same'))
thr = np.percentile(lvl, 60)
gain = np.where(lvl > thr, (lvl / thr) ** (1 / 3 - 1), 1.0)
mix *= gain[:, None]
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(mix * 1.4) / np.tanh(1.4)            # saturación suave
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.94
out = os.path.join(OUT, 'musica.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', out)
