# Anuncio: venta de pupusas · 4 por 7 €

Vídeo promocional vertical (1080×1920, 60 fps, 20 s) para WhatsApp / estados / Reels,
hecho 100 % con código: animación en Canvas + música tipo cumbia sintetizada con numpy.

**Guion (120 BPM, cada escena cae en el compás):**
1. 0 s — "¡PUPUSAS!" letra a letra + cinta "GRAN VENTA" y pupusa gigante girando.
2. 2.3 s — la pupusa cae al comal ("Hechas a mano, en comal"), se voltea en el aire ("¡Bien calientitas!").
3. 6 s — salta al plato y llegan 1-2-3-4 pupusas, curtido y salsa, sello "SOLO 7 €" con confeti.
4. 11 s — calendario que corre hasta el **sábado 28 de noviembre**, marcado con rotulador.
5. 15 s — cartel final: plato, "4 por 7 €", fecha, "Hechas por la Hna. Dinora", "¡Haz tu pedido!".

## Cómo regenerarlo
```bash
cd pupusas-venta
python3 musica.py          # -> salida/musica.wav
node render.js             # -> salida/pupusas_sin_audio.mp4  (FPS=30 node render.js para 30 fps)
ffmpeg -y -i salida/pupusas_sin_audio.mp4 -i salida/musica.wav \
  -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart salida/pupusas_4x7.mp4
```
Textos editables al final de `animacion.html` (función `scene3`) y en `scene1` / `scene2`.
