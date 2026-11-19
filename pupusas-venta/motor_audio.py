"""Motor de audio común: partitura MIDI → fluidsynth (FluidR3 GM) → efectos sincronizados → master.

Todas las músicas van a 120 BPM (1 pulso = 0.5 s, 1 compás = 2 s) para caer en los golpes de la animación:
  pulso 0      arranque                       pulso 11-12  redoble → escena del plato
  pulsos 13-16 llegan las 4 pupusas (6.5-8 s)  pulso 18     sello "SOLO 7 €" (9 s)
  pulso 21-22  redoble → calendario (11 s)     pulsos 24-25 corte; golpe en el 28 (12.5 s)
  pulso 29-30  redoble → cartel final (15 s)   pulso 32     sello final (16 s)
  pulsos 34-36 subida → pulso 36 acorde final (18 s)
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
TPB = 480

# momentos clave en pulsos
HITS = [0, 18, 25, 32, 36]
FILLS = [(11, 4), (21, 4), (29, 4)]   # (pulso inicial, nº de semicorcheas)
BUILD = (34, 8)                        # subida final
STOP = (24.0, 25.0)                    # corte antes del golpe en el 28

PCS = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def m(name):
    """'C5', 'F#4', 'Bb3' -> número MIDI"""
    if isinstance(name, (int, np.integer)):
        return int(name)
    acc = name[1:-1]
    return 12 * (int(name[-1]) + 1) + PCS[name[0]] + acc.count('#') - acc.count('b')


def chord_pcs(sym):
    """'C', 'Am', 'G7', 'F#m', 'Bb', 'E7' -> (raíz pc, [pcs])"""
    root = PCS[sym[0]]; rest = sym[1:]
    if rest[:1] in ('#', 'b'):
        root += 1 if rest[0] == '#' else -1; rest = rest[1:]
    root %= 12
    minor = rest.startswith('m')
    pcs = [root, (root + (3 if minor else 4)) % 12, (root + 7) % 12]
    if '7' in rest:
        pcs.append((root + 10) % 12)
    return root, pcs


def voicing(sym, low=60):
    """acorde cerrado a partir de la nota `low`"""
    root, pcs = chord_pcs(sym)
    out = []
    for pc in pcs:
        n = low + ((pc - low) % 12)
        out.append(n)
    return sorted(out)


def bass_note(sym, low=36, deg=0):
    root, pcs = chord_pcs(sym)
    pc = pcs[deg] if deg < len(pcs) else root
    return low + ((pc - low) % 12)


class Song:
    def __init__(self, seed=3):
        self.events = []
        self.programs = {}          # canal -> programa GM
        self.mix = {}               # canal -> (volumen, pan, reverb, chorus)
        self.drum_prog = 0          # 0 = kit estándar, 25 = TR-808
        self.rnd = np.random.default_rng(seed)

    def inst(self, ch, program, vol=100, pan=64, rev=45, cho=20):
        self.programs[ch] = program
        self.mix[ch] = (vol, pan, rev, cho)

    def note(self, beat, ch, n, dur, vel, human=True):
        if human:
            beat += self.rnd.normal(0, .007)
            vel += int(self.rnd.integers(-6, 7))
        self.events.append((max(0.0, beat), ch, m(n), max(.02, dur), int(np.clip(vel, 1, 127))))

    def chord(self, beat, ch, notes, dur, vel, strum=0.0, human=True):
        for i, n in enumerate(notes):
            self.note(beat + i * strum, ch, n, dur, vel, human)

    def melody(self, ch, bars, vel=100, harm=None, scale=None, harm_steps=-2, harm_vel=-28,
               legato=.92, stacc=.8, grace=False, tremolo=None, unit=1.0, skip_grace_bars=()):
        """bars: lista de compases; cada uno lista de (nota|'R', duración en `unit` de pulso)."""
        for b, line in enumerate(bars):
            beat = b * 4.0
            for n, d in line:
                d *= unit
                if n != 'R':
                    mid = m(n)
                    accent = vel if abs(beat - round(beat)) < 1e-6 else vel - 10
                    if grace and d >= 1 and b not in skip_grace_bars:
                        self.note(beat - .09, ch, self.dia(mid, scale, 1), .08, accent - 22)
                    notes = [(ch, mid, accent)]
                    if harm is not None:
                        notes.append((harm, self.dia(mid, scale, harm_steps), accent + harm_vel))
                    for c, nn, vv in notes:
                        if tremolo and d >= tremolo:
                            k = 0; step = 1 / 6
                            while k * step < d - .05:
                                self.note(beat + k * step, c, nn, step * 1.1, vv - (0 if k == 0 else 14 + 4 * (k % 2)))
                                k += 1
                        else:
                            self.note(beat, c, nn, d * (stacc if d <= .5 else legato), vv)
                beat += d

    @staticmethod
    def dia(n, scale, steps):
        """mueve `n` `steps` grados dentro de la escala (lista de pcs ascendentes)."""
        pc = n % 12
        if scale is None or pc not in scale:
            return n - 3 if steps < 0 else n + 2
        i = scale.index(pc)
        octs, j = divmod(i + steps, len(scale))
        return n - pc + scale[j] + 12 * octs

    # ---------- exportar e interpretar ----------
    def to_midi(self, path):
        mid = mido.MidiFile(ticks_per_beat=TPB)
        tr = mido.MidiTrack(); mid.tracks.append(tr)
        tr.append(mido.MetaMessage('set_tempo', tempo=500000, time=0))
        msgs = []
        for ch, prog in self.programs.items():
            vol, pan, rev, cho = self.mix[ch]
            msgs += [(0, 0, mido.Message('program_change', channel=ch, program=prog)),
                     (0, 0, mido.Message('control_change', channel=ch, control=7, value=vol)),
                     (0, 0, mido.Message('control_change', channel=ch, control=10, value=pan)),
                     (0, 0, mido.Message('control_change', channel=ch, control=91, value=rev)),
                     (0, 0, mido.Message('control_change', channel=ch, control=93, value=cho))]
        vol, pan, rev, cho = self.mix.get(9, (105, 64, 25, 0))
        msgs += [(0, 0, mido.Message('program_change', channel=9, program=self.drum_prog)),
                 (0, 0, mido.Message('control_change', channel=9, control=7, value=vol)),
                 (0, 0, mido.Message('control_change', channel=9, control=91, value=rev))]
        for beat, ch, n, d, v in self.events:
            on = int(round(beat * TPB)); off = int(round((beat + d) * TPB))
            msgs.append((on, 2, mido.Message('note_on', channel=ch, note=n, velocity=v)))
            msgs.append((off, 1, mido.Message('note_off', channel=ch, note=n, velocity=0)))
        msgs.sort(key=lambda x: (x[0], x[1]))
        last = 0
        for tick, _, msg in msgs:
            tr.append(msg.copy(time=tick - last)); last = tick
        mid.save(path)

    def render(self, name, sfx_gain=1.0):
        midi_path = os.path.join(OUT, f'banda_{name}.mid')
        wav_path = os.path.join(OUT, f'banda_{name}.wav')
        self.to_midi(midi_path)
        subprocess.run(['fluidsynth', '-ni', '-g', '0.7', '-r', str(SR), '-R', '1', '-C', '1',
                        '-F', wav_path, SF2, midi_path], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        with wave.open(wav_path) as w:
            band = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2) / 32768.0
        N = int(SR * DUR)
        mix = np.zeros((N, 2))
        mix[:min(N, len(band))] = band[:N]
        mix /= np.max(np.abs(mix)) + 1e-9
        mix *= .75
        add_sfx(mix, sfx_gain, self.rnd)
        out = os.path.join(OUT, f'musica_{name}.wav')
        write_wav(out, master(mix))
        return out


# ============================================================
#  EFECTOS DE SONIDO
# ============================================================
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


def add_sfx(mix, g, rnd):
    N = len(mix)

    def add(sig, t0, gain=1.0, pan=0.0):
        i = int(t0 * SR)
        if i >= N or i < 0:
            return
        sig = sig[: N - i]
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        mix[i:i + len(sig), 0] += sig * gain * g * l * 1.41
        mix[i:i + len(sig), 1] += sig * gain * g * r * 1.41

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
#  MASTER
# ============================================================
def master(mix):
    N = len(mix)
    fade = np.ones(N); nf = int(.7 * SR); fade[-nf:] = np.linspace(1, 0, nf) ** 1.5
    mix = mix * fade[:, None]
    lvl = np.max(np.abs(mix), axis=1)
    k = int(.03 * SR); lvl = np.convolve(lvl, np.ones(k) / k, 'same')
    k2 = int(.15 * SR); lvl = np.maximum(lvl, np.convolve(lvl, np.ones(k2) / k2, 'same'))
    thr = np.percentile(lvl, 60)
    gain = np.where(lvl > thr, (lvl / thr) ** (1 / 3 - 1), 1.0)   # compresor 3:1
    mix = mix * gain[:, None]
    mix /= np.max(np.abs(mix)) + 1e-9
    mix = np.tanh(mix * 1.4) / np.tanh(1.4)
    mix /= np.max(np.abs(mix)) + 1e-9
    return mix * .94


def write_wav(path, mix):
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
