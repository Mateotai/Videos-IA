"""Música + efectos del anuncio de pupusas (20 s), 100 % sintetizada con numpy.

Cumbia alegre a 120 BPM (1 compás = 2 s), sincronizada con la animación:
  0.0        arranque con "whoosh" y acordeón
  2.75 / 4.4 la pupusa cae al comal / se voltea (golpe + boing), chisporroteo 2.7-5.9
  6.5-8.0    llegan las 4 pupusas (pops que suben de tono)
  9.0        sello "SOLO 7 €" (golpe + platillo)
  11 / 15    transiciones (whoosh)
  11.6-12.5  el calendario corre (tic-tic) · 12.5 golpe en el 28
  18.0       acorde final "ta-dá"
"""
import numpy as np
import wave
import os

SR = 44100
DUR = 20.0
N = int(SR * DUR)
mix = np.zeros((N, 2))
rng = np.random.default_rng(7)
BEAT = 0.5


def m(name):
    notes = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    return 12 * (int(name[-1]) + 1) + notes[name[0]] + (1 if '#' in name else 0) - (1 if 'b' in name[1:] else 0)


def hz(name):
    return 440.0 * 2 ** ((m(name) - 69) / 12)


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


def lowpass(x, a):
    y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y


def saw(f, t):
    return 2 * ((f * t) % 1) - 1


# ---------- instrumentos ----------
def accordion(f, dur):
    """dos lengüetas ligeramente desafinadas (efecto musette) + vibrato suave."""
    n = int(dur * SR); t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t)
    s = saw(f * vib, t) + saw(f * 1.006 * vib, t) * .8 + 0.5 * np.sign(np.sin(2 * np.pi * f * 2 * vib * t)) * .3
    s = lowpass(s, 0.25)
    e = np.minimum(1, t / .015) * np.minimum(1, np.maximum(0, dur - t) / .04)
    return s * e * .32


def bass(f, dur=0.42):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2 * t)
    return s * env(n, .004, .3) * np.minimum(1, (dur - t) / .03)


def guitar_chuck(freqs):
    """rasgueo corto en el contratiempo (guitarra/piano de cumbia)."""
    n = int(.18 * SR); t = np.arange(n) / SR
    s = sum(sum((.55 ** k) * np.sin(2 * np.pi * f * (k + 1) * t) for k in range(4)) for f in freqs) / len(freqs)
    return s * env(n, .002, .05)


def guira():
    n = int(.12 * SR); s = np.diff(rng.standard_normal(n + 1))
    return s * np.sin(np.linspace(0, np.pi, n)) ** 3 * .07


def conga(f=190, d=.12, slap=False):
    n = int(.3 * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(f * (1 + .5 * np.exp(-t / .01))) / SR) * env(n, .001, d)
    if slap:
        s += np.diff(rng.standard_normal(n + 1)) * env(n, .0005, .015) * .4
    return s


def kick():
    n = int(.3 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(50 + 90 * np.exp(-t / .04)) / SR) * env(n, .001, .1)


def cowbell():
    n = int(.25 * SR); t = np.arange(n) / SR
    s = np.sign(np.sin(2 * np.pi * 800 * t)) + np.sign(np.sin(2 * np.pi * 540 * t))
    return lowpass(s, .3) * env(n, .001, .06) * .25


def crash(dur=2.5):
    n = int(dur * SR); return np.diff(rng.standard_normal(n + 1)) * env(n, .001, .6) * .09


def thud():
    n = int(.35 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * np.cumsum(40 + 130 * np.exp(-t / .03)) / SR)
            + .3 * np.diff(rng.standard_normal(n + 1)) * np.exp(-t / .02)) * env(n, .001, .1)


def pop(pitch=1.0):
    n = int(.16 * SR); t = np.arange(n) / SR
    f = (450 + 2200 * (t / .16) ** .5) * pitch
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .001, .04)
    s[:int(.004 * SR)] += rng.standard_normal(int(.004 * SR)) * .4
    return s


def boing(dur=.4, f0=180, f1=650):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (t / dur) ** .6
    return np.sin(2 * np.pi * np.cumsum(f * (1 + .08 * np.sin(2 * np.pi * 30 * t))) / SR) * env(n, .003, .15)


def whoosh(dur=.5):
    n = int(dur * SR); t = np.arange(n) / SR; s = rng.standard_normal(n)
    out = np.zeros(n); y = 0; a = .04 + .45 * np.sin(np.pi * t / dur)
    for i in range(n):
        y += a[i] * (s[i] - y); out[i] = y
    return out * np.sin(np.pi * t / dur) * .5


def tick():
    n = int(.04 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2400 * t) * env(n, .0005, .008)


def sizzle(dur):
    """chisporroteo del comal: ruido agudo con crepitaciones."""
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.diff(np.diff(rng.standard_normal(n + 2))) * .05
    crack = (rng.random(n) < 0.0015) * rng.standard_normal(n) * 1.2
    s += np.convolve(crack, np.exp(-np.arange(200) / 30), 'same') * .15
    e = np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .4)
    return s * e


def marker(dur=.4):
    n = int(dur * SR); t = np.arange(n) / SR
    s = lowpass(rng.standard_normal(n), .3) * (1 + .5 * np.sin(2 * np.pi * 9 * t))
    return s * np.sin(np.pi * t / dur) * .12


# ---------- armonía ----------
CH = {
    'C': ['C', 'E', 'G'], 'F': ['F', 'A', 'C'], 'G7': ['G', 'B', 'D', 'F'],
}
BARS = ['C', 'C', 'G7', 'C', 'F', 'C', 'G7', 'C', 'G7']  # 9 compases de groove (0-18 s)

for b, ch in enumerate(BARS):
    t0 = b * 2.0
    root = CH[ch][0]
    fifth = CH[ch][2]
    # bajo de cumbia: tónica (1), tónica (2&), quinta (3), quinta (4)
    for beat, note, g in [(0, root + '2', 1), (1.5, root + '2', .7), (2, fifth + '2', .9), (3, fifth + '2', .6)]:
        add(bass(hz(note), .5), t0 + beat * BEAT, .5 * g)
    # rasgueo en los contratiempos
    freqs = [hz(n + '4') for n in CH[ch]]
    for k in range(4):
        add(guitar_chuck(freqs), t0 + (k + .5) * BEAT, .22, .25)
    # colchón suave de acordeón con el acorde (rellena huecos)
    for n_ in CH[ch][:3]:
        add(accordion(hz(n_ + '4'), 2.0), t0, .05, -.15)
    # güira en corcheas, acento en contratiempos
    for k in range(8):
        add(guira(), t0 + k * BEAT / 2, .9 if k % 2 else .5, -.3)
    # conga: tumbao
    add(conga(330, .05, True), t0 + 1 * BEAT, .32, .35)
    add(conga(200, .14), t0 + 3 * BEAT, .38, .35)
    add(conga(200, .14), t0 + 3.5 * BEAT, .32, .35)
    add(conga(260, .08), t0 + 1.5 * BEAT, .22, .35)
    # bombo en 1 y 3, cencerro en 2 y 4
    add(kick(), t0, .55); add(kick(), t0 + 2 * BEAT, .45)
    add(cowbell(), t0 + 1 * BEAT, .35, -.2); add(cowbell(), t0 + 3 * BEAT, .35, -.2)

# ---------- melodía de acordeón (corcheas; '-' alarga, '.' silencio) ----------
MEL = [
    'G4 C5 E5 G5 - E5 G5 -',
    'E5 - G5 - E5 D5 C5 -',
    'D5 - F5 - D5 C5 B4 -',
    'C5 E5 G5 C6 - . G5 -',
    'A5 - A5 G5 F5 - A5 -',
    'G5 - E5 - C5 - E5 G5',
    'F5 - D5 - B4 - D5 F5',
    'E5 - - - C5 - . .',
    'D5 E5 F5 G5 A5 B5 C6 D6',
]
E8 = BEAT / 2
for b, line in enumerate(MEL):
    toks = line.split()
    i = 0
    while i < len(toks):
        tk = toks[i]
        if tk in '.-':
            i += 1; continue
        L = 1
        while i + L < len(toks) and toks[i + L] == '-':
            L += 1
        t0 = b * 2.0 + i * E8
        add(accordion(hz(tk), L * E8 * .95), t0, .5, .1)
        add(accordion(hz(tk) / 2, L * E8 * .95), t0, .12, .1)  # octava grave de refuerzo
        i += L

# ---------- final (18 s): acorde "ta-dá" ----------
for n in ['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6']:
    add(accordion(hz(n), 1.6), 18.0, .18)
add(bass(hz('C2'), 1.2), 18.0, .7)
add(kick(), 18.0, .9); add(crash(), 18.0, 1.0)
for k, n in enumerate(['G5', 'C6', 'E6', 'G6']):  # brillo que sube
    add(pop(1 + k * .25), 18.05 + k * .06, .2)

# ---------- efectos sincronizados ----------
add(whoosh(.5), 0.0, .5)
add(crash(1.5), 0.0, .5)
add(whoosh(.45), 2.3, .45)
add(thud(), 2.75, .8)
add(sizzle(3.2), 2.7, .6)
add(boing(), 3.9, .35)
add(thud(), 4.4, .6)
add(whoosh(.5), 5.9, .45)
for k, lt in enumerate([6.5, 7.0, 7.5, 8.0]):
    add(pop(1 + k * .22), lt, .5)
    add(thud(), lt, .35)
add(whoosh(.3), 8.45, .3, -.5); add(whoosh(.3), 8.6, .3, .5)
add(thud(), 9.0, 1.0); add(crash(), 9.0, .9)
add(whoosh(.55), 10.85, .55)
for k in range(10):
    add(tick(), 11.6 + k * .09, .35)
add(thud(), 12.5, .8)
add(marker(.45), 12.7, 1.0)
for k, lt in enumerate([13.2, 13.3]):
    add(pop(.8 + k * .2), lt, .35)
add(whoosh(.55), 14.85, .55)
for k, lt in enumerate([15.45, 15.55, 15.65, 15.75]):
    add(pop(1 + k * .2), lt, .3)
add(thud(), 16.0, .8); add(crash(1.2), 16.0, .4)

# ---------- master ----------
fade = np.ones(N); nf = int(.6 * SR); fade[-nf:] = np.linspace(1, 0, nf)
mix *= fade[:, None]
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.93

os.makedirs(os.path.join(os.path.dirname(__file__), 'salida'), exist_ok=True)
out = os.path.join(os.path.dirname(__file__), 'salida', 'musica.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', out)
