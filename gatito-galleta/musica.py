"""Música + efectos para "El gatito y la galleta" (24 s), 100 % sintetizada con numpy.

Estructura sincronizada con la animación:
  0.0 - 12.5  tema alegre y saltarín (120 BPM)
  12.7        "womp" cuando el ratón roba la galleta
  13.3 - 16.4 sección triste (La menor, caja de música)
  16.4 - 21.0 tema cálido de amistad
  20.6 - 21.4 subida de tensión (riser)
  21.4 - 24.0 golpe final + acorde "ta-dá"
"""
import numpy as np
import wave
import os

SR = 44100
DUR = 26.0
N = int(SR * DUR)
mix = np.zeros((N, 2))


def note_hz(n):  # n = número MIDI
    return 440.0 * 2 ** ((n - 69) / 12)


NOTES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def m(name):  # "C5" -> MIDI
    return 12 * (int(name[-1]) + 1) + NOTES[name[0]] + (1 if '#' in name else 0)


def add(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N:
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


# ---------- instrumentos ----------
def marimba(freq, dur=0.5, d=0.18):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 4 * t) * np.exp(-t / 0.03)
    return s * env(n, 0.002, d)


def pluck(freq, dur=0.6, d=0.25):  # tipo ukelele
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum((0.6 ** k) * np.sin(2 * np.pi * freq * (k + 1) * t) for k in range(5))
    return s * env(n, 0.003, d) * 0.5


def musicbox(freq, dur=1.2):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t / 0.2)
    return s * env(n, 0.002, 0.5)


def bass(freq, dur=0.45):
    n = int(dur * SR); t = np.arange(n) / SR
    s = 2 / np.pi * np.arcsin(np.sin(2 * np.pi * freq * t))  # triangular
    return s * env(n, 0.005, 0.25)


def pad(freqs, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t + np.sin(2 * np.pi * 4 * t) * 0.3) for f in freqs) / len(freqs)
    e = np.minimum(1, t / 0.3) * np.minimum(1, (dur - t) / 0.4)
    return s * np.clip(e, 0, 1)


rng = np.random.default_rng(7)


def kick():
    n = int(0.3 * SR); t = np.arange(n) / SR
    f = 50 + 90 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.09)


def clap():
    n = int(0.2 * SR)
    s = np.diff(rng.standard_normal(n + 1))
    return s * env(n, 0.001, 0.05) * 0.35


def hat(d=0.025):
    n = int(0.08 * SR)
    s = np.diff(np.diff(rng.standard_normal(n + 2)))
    return s * env(n, 0.0005, d) * 0.12


def shaker():
    n = int(0.1 * SR)
    s = np.diff(rng.standard_normal(n + 1))
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return s * e * 0.06


def crash():
    n = int(2.5 * SR)
    s = np.diff(np.diff(rng.standard_normal(n + 2)))
    return s * env(n, 0.001, 0.8) * 0.18


# ---------- efectos ----------
def boing(dur=0.35, f0=200, f1=700):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (t / dur) ** 0.6
    vib = 1 + 0.08 * np.sin(2 * np.pi * 30 * t)
    return np.sin(2 * np.pi * np.cumsum(f * vib) / SR) * env(n, 0.003, 0.15)


def thud():
    n = int(0.3 * SR); t = np.arange(n) / SR
    f = 40 + 120 * np.exp(-t / 0.03)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.diff(rng.standard_normal(n + 1)) * np.exp(-t / 0.02)) * env(n, 0.001, 0.08)


def pop():
    n = int(0.12 * SR); t = np.arange(n) / SR
    f = 600 + 1400 * t / 0.12
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.04)


def whoosh(dur=0.45):
    n = int(dur * SR); t = np.arange(n) / SR
    s = rng.standard_normal(n)
    # filtro paso bajo simple que se abre y cierra
    out = np.zeros(n); y = 0
    a = 0.05 + 0.5 * np.sin(np.pi * t / dur)
    for i in range(n):
        y += a[i] * (s[i] - y); out[i] = y
    return out * np.sin(np.pi * t / dur) * 0.8


def womp():
    n = int(0.9 * SR); t = np.arange(n) / SR
    f = 330 * np.exp(-t * 1.3)
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.4 + np.sin(2 * np.pi * np.cumsum(f) / SR)
    return s * np.minimum(1, (0.9 - t) / 0.2) * 0.5


def crunch():
    n = int(0.35 * SR)
    s = rng.standard_normal(n) * (rng.random(n) > 0.9)
    return s * env(n, 0.001, 0.12) * 0.9


def chime(f=1568):
    return musicbox(f, 0.8) * 0.5


def riser(dur=0.8):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 200 * 2 ** (t / dur * 3)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + np.diff(rng.standard_normal(n + 1)) * 0.15
    return s * (t / dur) ** 2


# ---------- sección 1: alegre (0 - 12.5 s) ----------
BEAT = 0.5  # 120 BPM
chords1 = [['C3', 'C4', 'E4', 'G4'], ['G2', 'B3', 'D4', 'G4'], ['A2', 'C4', 'E4', 'A4'], ['F2', 'A3', 'C4', 'F4']]
melody1 = ['E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5', 'D5',
           'D5', 'G5', 'B5', 'A5', 'G5', '-', 'D5', '-',
           'C5', 'E5', 'A5', 'G5', 'E5', 'D5', 'C5', 'E5',
           'F5', 'A5', 'G5', 'F5', 'E5', 'D5', 'C5', '-']
t = 0.0
bar = 0
while t < 12.5:
    ch = chords1[bar % 4]
    for b in range(4):
        tb = t + b * BEAT
        if tb >= 12.5: break
        add(bass(note_hz(m(ch[0]))), tb, 0.55)
        add(kick(), tb, 0.8) if b in (0, 2) else add(clap(), tb, 0.7)
        add(hat(), tb + BEAT / 2, 0.8, 0.3)
        add(hat(0.01), tb, 0.5, 0.3)
        # acordes "staccato" de ukelele a contratiempo
        for k, nn in enumerate(ch[1:]):
            add(pluck(note_hz(m(nn)), 0.3, 0.08), tb + BEAT / 2 + k * 0.008, 0.18, -0.3)
    for k in range(8):
        tn = t + k * BEAT / 2
        nn = melody1[(bar % 4) * 8 + k]
        if nn != '-' and tn < 12.5:
            add(marimba(note_hz(m(nn))), tn, 0.32, 0.15)
    t += 4 * BEAT
    bar += 1

# ---------- sección 2: triste (13.3 - 16.4 s) ----------
add(pad([note_hz(m(n)) for n in ['A3', 'C4', 'E4']], 1.6), 13.3, 0.22)
add(pad([note_hz(m(n)) for n in ['F3', 'A3', 'C4']], 1.6), 14.9, 0.22)
sad = [('E5', 13.4), ('C5', 13.8), ('A4', 14.2), ('B4', 14.6), ('C5', 15.0), ('A4', 15.4), ('F4', 15.8)]
for nn, tn in sad:
    add(musicbox(note_hz(m(nn))), tn, 0.3, 0.1)
add(bass(note_hz(m('A2')), 1.5), 13.3, 0.4)
add(bass(note_hz(m('F2')), 1.5), 14.9, 0.4)

# ---------- sección 3: amistad (16.4 - 20.6 s) ----------
chords3 = [['C3', 'E4', 'G4', 'C5'], ['F2', 'F4', 'A4', 'C5'], ['G2', 'D4', 'G4', 'B4'], ['C3', 'E4', 'G4', 'C5']]
melody3 = ['G5', 'E5', 'C5', 'E5', 'G5', '-', 'A5', 'G5',
           'A5', 'F5', 'C6', 'A5', 'G5', '-', 'F5', 'E5',
           'D5', 'G5', 'B5', 'A5', 'G5', 'F5', 'E5', 'D5',
           'E5', 'G5', 'C6', '-', '-', '-', '-', '-']
t0 = 16.4
SB = 0.35  # un pelín más rápido y bailable
for i in range(12):
    tb = t0 + i * SB
    if tb > 20.6: break
    ch = chords3[(i // 3) % 4]
    add(bass(note_hz(m(ch[0]))), tb, 0.5)
    add(kick(), tb, 0.6) if i % 2 == 0 else add(clap(), tb, 0.45)
    add(shaker(), tb + SB / 2, 1.0, 0.4)
    for k, nn in enumerate(ch[1:]):
        add(pluck(note_hz(m(nn)), 0.4, 0.12), tb + SB / 2 + k * 0.01, 0.16, -0.3)
for k, nn in enumerate(melody3):
    tn = t0 + k * SB / 2
    if nn != '-' and tn < 20.6:
        add(marimba(note_hz(m(nn)), 0.6, 0.22), tn, 0.3, 0.15)

# ---------- final ----------
add(riser(0.8), 20.6, 0.5)
add(crash(), 21.4, 1.0)
add(kick(), 21.4, 1.0)
for nn in ['C3', 'G3', 'C4', 'E4', 'G4', 'C5']:
    add(pad([note_hz(m(nn))], 2.6), 21.4, 0.12)
for nn, tn in [('C5', 21.4), ('E5', 21.55), ('G5', 21.7), ('C6', 21.85)]:
    add(marimba(note_hz(m(nn)), 1.2, 0.5), tn, 0.4)
for k in range(6):  # brillitos del tarro
    add(chime(note_hz(m(['C6', 'E6', 'G6', 'C7', 'G6', 'E6'][k]))), 22.0 + k * 0.25, 0.35, (-1) ** k * 0.4)

# ---------- efectos de sonido sincronizados ----------
for tt in (0.6, 1.3, 2.0):
    add(chime(note_hz(m('E6'))), tt, 0.25, 0.3)          # corazoncitos
add(boing(), 2.75, 0.5)                                   # salto 1
add(thud(), 3.45, 0.7)
add(boing(0.45, 180, 900), 4.1, 0.5)                      # salto 2
add(thud(), 4.85, 1.0)                                    # ¡pum!
for k in range(3):
    add(chime(note_hz(m(['G6', 'E6', 'C6'][k]))), 4.95 + k * 0.15, 0.3)  # estrellitas
add(pop(), 5.8, 0.6)                                      # bombilla
add(whoosh(0.4), 6.5, 0.6)                                # sale corriendo
add(boing(0.3, 250, 650), 9.35, 0.4)                      # sube a la caja
add(thud(), 9.75, 0.5)
add(boing(0.35, 220, 800), 10.15, 0.45)                   # salta a la mesa
add(thud(), 10.75, 0.5)
add(whoosh(0.45), 12.45, 1.0)                             # el ratón pasa volando
add(womp(), 12.75, 0.6)                                   # "womp womp"
add(pop(), 13.8, 0.4)                                     # nube de lluvia
add(crunch(), 16.4, 0.9)                                  # ¡crac!
add(pop(), 16.95, 0.5)                                    # nube desaparece
add(chime(note_hz(m('C6'))), 17.3, 0.4)                   # recibe la mitad
for k in range(6):
    add(crunch() * 0.3, 18.1 + k * 0.45, 0.4, (-1) ** k * 0.3)  # ñam ñam
add(whoosh(0.6), 20.7, 0.5)

# ---------- extras de retención ----------
add(whoosh(0.5), 0.15, 0.7)                               # zoom de salida del gancho
add(pop(), 0.35, 0.5)                                     # ojos de corazón
def squeak():
    n = int(0.12 * SR); t = np.arange(n) / SR
    f = 2200 + 900 * np.sin(np.pi * t / 0.12)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.05)
for tt in (1.15, 5.15, 8.15, 11.45):                      # el ratón se asoma
    add(squeak(), tt, 0.25, 0.5)
    add(squeak(), tt + 0.13, 0.2, 0.5)
add(boing(0.4, 200, 900), 23.45, 0.5)                     # ¡al ataque!
add(boing(0.4, 260, 1100), 23.5, 0.4, 0.4)
add(thud(), 24.15, 0.6)
# fanfarria final "¿parte 2?"
for nn, tn in [('G5', 24.35), ('C6', 24.5), ('E6', 24.65), ('G6', 24.8)]:
    add(marimba(note_hz(m(nn)), 1.0, 0.4), tn, 0.35)
add(crash(), 24.35, 0.6)
for nn in ['C3', 'E4', 'G4', 'C5']:
    add(pad([note_hz(m(nn))], 1.6), 24.35, 0.1)
for i in range(6):
    tb = 24.35 + i * 0.25
    add(kick(), tb, 0.5) if i % 2 == 0 else add(clap(), tb, 0.4)

# ---------- master ----------
fade = np.ones(N)
fo = int(0.6 * SR)
fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade[:, None]
mix = np.tanh(mix * 1.2)
mix /= np.max(np.abs(mix)) * 1.05

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'salida', 'musica.wav')
os.makedirs(os.path.dirname(out), exist_ok=True)
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok ->', out)
