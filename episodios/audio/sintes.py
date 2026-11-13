"""Instrumentos y efectos sintetizados (numpy) para los episodios de Mochi & Pip."""
import numpy as np, wave

SR = 44100
rng = np.random.default_rng(7)
NOTES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def m(name):
    return 12 * (int(name[-1]) + 1) + NOTES[name[0]] + (1 if '#' in name else 0) - (1 if name[1:2] == 'b' else 0)


def hz(name):
    return 440.0 * 2 ** ((m(name) - 69) / 12)


class Mix:
    def __init__(self, dur):
        self.dur = dur; self.N = int(SR * dur); self.buf = np.zeros((self.N, 2))

    def add(self, sig, t0, gain=1.0, pan=0.0):
        i = int(t0 * SR)
        if i >= self.N or i < 0: return
        sig = sig[: self.N - i]
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        self.buf[i:i + len(sig), 0] += sig * gain * l * 1.41
        self.buf[i:i + len(sig), 1] += sig * gain * r * 1.41

    def save(self, path, fade=.6):
        mix = self.buf.copy(); fo = int(fade * SR)
        mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
        mix = np.tanh(mix * 1.2); mix /= np.max(np.abs(mix)) * 1.05
        with wave.open(path, 'wb') as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((mix * 32767).astype('<i2').tobytes())


def env(n, a=0.005, d=0.3):
    t = np.arange(n) / SR; e = np.exp(-t / d); na = max(1, int(a * SR)); e[:na] *= np.linspace(0, 1, na); return e


def marimba(f, dur=.5, d=.18):
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / .03)) * env(n, .002, d)


def pluck(f, dur=.6, d=.25):
    n = int(dur * SR); t = np.arange(n) / SR
    return sum((.6 ** k) * np.sin(2 * np.pi * f * (k + 1) * t) for k in range(5)) * env(n, .003, d) * .5


def pizz(f, dur=.4):
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + .5 * np.sin(4 * np.pi * f * t) + .2 * np.sin(6 * np.pi * f * t)) * env(n, .002, .09)


def musicbox(f, dur=1.2):
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / .2)) * env(n, .002, .5)


def whistle(f, dur=.3, vib=6):
    n = int(dur * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f * (1 + .012 * np.sin(2 * np.pi * vib * t))) / SR
    e = np.minimum(1, t / .03) * np.minimum(1, (dur - t) / .05)
    return (np.sin(ph) + .08 * np.sin(2 * ph)) * np.clip(e, 0, 1) * .6


def bass(f, dur=.45):
    n = int(dur * SR); t = np.arange(n) / SR
    return 2 / np.pi * np.arcsin(np.sin(2 * np.pi * f * t)) * env(n, .005, .25)


def pad(freqs, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t + np.sin(2 * np.pi * 4 * t) * .3) for f in freqs) / len(freqs)
    return s * np.clip(np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .4), 0, 1)


def kick():
    n = int(.3 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(50 + 90 * np.exp(-t / .04)) / SR) * env(n, .001, .09)


def clap():
    n = int(.2 * SR); return np.diff(rng.standard_normal(n + 1)) * env(n, .001, .05) * .35


def hat(d=.025):
    n = int(.08 * SR); return np.diff(np.diff(rng.standard_normal(n + 2))) * env(n, .0005, d) * .12


def shaker():
    n = int(.1 * SR); return np.diff(rng.standard_normal(n + 1)) * np.sin(np.linspace(0, np.pi, n)) ** 2 * .06


def crash():
    n = int(2.5 * SR); return np.diff(np.diff(rng.standard_normal(n + 2))) * env(n, .001, .8) * .18


def boing(dur=.35, f0=200, f1=700):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (t / dur) ** .6
    return np.sin(2 * np.pi * np.cumsum(f * (1 + .08 * np.sin(2 * np.pi * 30 * t))) / SR) * env(n, .003, .15)


def thud():
    n = int(.3 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * np.cumsum(40 + 120 * np.exp(-t / .03)) / SR) + .3 * np.diff(rng.standard_normal(n + 1)) * np.exp(-t / .02)) * env(n, .001, .08)


def pop(f0=600, f1=2000, dur=.12):
    n = int(dur * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(f0 + (f1 - f0) * t / dur) / SR) * env(n, .001, .04)


def bubble_pop(pitch=1.0):
    """'plop' de pompa: barrido rápido hacia arriba + chasquido."""
    n = int(.16 * SR); t = np.arange(n) / SR
    f = (500 + 2600 * (t / .16) ** .5) * pitch
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .001, .035)
    s[:int(.004 * SR)] += rng.standard_normal(int(.004 * SR)) * .5
    return s


def whoosh(dur=.45):
    n = int(dur * SR); t = np.arange(n) / SR; s = rng.standard_normal(n)
    out = np.zeros(n); y = 0; a = .05 + .5 * np.sin(np.pi * t / dur)
    for i in range(n): y += a[i] * (s[i] - y); out[i] = y
    return out * np.sin(np.pi * t / dur) * .8


def slide(f0, f1, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f0 * (f1 / f0) ** (t / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, (dur - t) / .05) * np.minimum(1, t / .02) * .5


def warble(f0, f1, dur):
    """sonido de pompa que crece (tono que sube con vibrato)."""
    n = int(dur * SR); t = np.arange(n) / SR
    f = f0 * (f1 / f0) ** (t / dur) * (1 + .04 * np.sin(2 * np.pi * 7 * t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .2) * .35


def chime(f):
    return musicbox(f, .8) * .5


def riser(dur=.8):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(200 * 2 ** (t / dur * 3)) / SR) * .4 + np.diff(rng.standard_normal(n + 1)) * .15
    return s * (t / dur) ** 2
