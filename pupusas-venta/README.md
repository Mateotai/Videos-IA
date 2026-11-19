# Anuncio: venta de pupusas · 4 por 7 €

Vídeo promocional vertical (1080×1920, 60 fps, 20 s) para WhatsApp / estados / Reels,
hecho 100 % con código: animación en Canvas con desenfoque de movimiento (5 sub-fotogramas por
fotograma) + cumbia compuesta en MIDI e interpretada con instrumentos reales (banco FluidR3 GM:
acordeón a dos voces, bajo, guitarra, metales, güiro, congas, timbales, cencerro) + efectos sincronizados.

**Guion (120 BPM, cada escena cae en el compás):**
1. 0 s — "¡PUPUSAS!" letra a letra + cinta "GRAN VENTA" y pupusa gigante girando.
2. 2.3 s — la pupusa cae al comal ("Hechas a mano, en comal"), se voltea en el aire ("¡Bien calientitas!").
3. 6 s — salta al plato y llegan 1-2-3-4 pupusas, curtido y salsa, sello "SOLO 7 €" con confeti.
4. 11 s — calendario que corre hasta el **sábado 28 de noviembre**, marcado con rotulador.
5. 15 s — cartel final: plato, "4 por 7 €", fecha, "Hechas por la Hna. Dinora", "¡Haz tu pedido!".

## Cómo regenerarlo
```bash
cd pupusas-venta
python3 musica.py          # -> salida/musica_<estilo>.wav/.mp3 para cada estilo
python3 musica.py --usar marimba   # elige el estilo que va en el vídeo (salida/musica.wav)
node render.js             # -> salida/pupusas_sin_audio.mp4  (prueba rápida: FPS=30 SUB=1 node render.js)
ffmpeg -y -i salida/pupusas_sin_audio.mp4 -i salida/musica.wav \
  -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart salida/pupusas_4x7.mp4
```
Requisitos: Node + Playwright, Python 3 + numpy + mido, ffmpeg, `apt install fluidsynth fluid-soundfont-gm`.

Música: `motor_audio.py` (MIDI → fluidsynth → efectos → master) y `estilos.py`
(marimba salvadoreña, xuc, cumbia de orquesta, chanchona, pito y tambor, merengue, urbano, pop y la cumbia de acordeón).

Textos editables al final de `animacion.html` (función `scene3`) y en `scene1` / `scene2`.
