"""Genera la música del anuncio en uno o varios estilos.

Uso:
  python3 musica.py                      -> todos los estilos: salida/musica_<estilo>.wav (+ .mp3 de muestra)
  python3 musica.py marimba pop          -> solo esos
  python3 musica.py --usar marimba       -> además lo copia como salida/musica.wav (la que se mezcla con el vídeo)

Estilos: ver estilos.py (marimba, merengue, urbano, pop, cumbia).
Requisitos: pip install mido numpy · apt install fluidsynth fluid-soundfont-gm · ffmpeg
"""
import os
import shutil
import subprocess
import sys
from motor_audio import Song, OUT
from estilos import ESTILOS

args = sys.argv[1:]
usar = None
if '--usar' in args:
    i = args.index('--usar'); usar = args[i + 1]; del args[i:i + 2]
nombres = args or ([usar] if usar else list(ESTILOS))
if usar and usar not in nombres:
    nombres.append(usar)

for n in nombres:
    fn, titulo = ESTILOS[n]
    s = Song()
    fn(s)
    wav = s.render(n)
    mp3 = wav[:-4] + '.mp3'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-b:a', '192k', mp3], check=True)
    print(f'{n:9s} {titulo:32s} -> {os.path.relpath(wav)}')

if usar:
    shutil.copy(os.path.join(OUT, f'musica_{usar}.wav'), os.path.join(OUT, 'musica.wav'))
    print('musica.wav <-', usar)
