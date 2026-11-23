# El gatito y la galleta — versión 3D 🍪

La misma historia que `../gatito-galleta`, pero en 3D real con Three.js:
personajes modelados, luces, sombras suaves, tonos tipo película de animación
y una cámara con perspectiva que se mueve un poco para dar profundidad.
Formato vertical 1080×1920, **60 fps**, 26 s, sin voces (solo música y efectos).

Usa la misma línea de tiempo que la versión 2D, así que la música
(`../gatito-galleta/musica.py`) encaja exactamente.

## Archivos
- `escena.html` — escena 3D completa: modelos, animación, efectos y textos.
- `render.js` — abre la escena con Playwright, captura cada fotograma y lo codifica con ffmpeg.
- `salida/gatito3d_y_la_galleta.mp4` — vídeo final.

## Cómo regenerarlo
```bash
cd gatito-3d
npm install
python3 ../gatito-galleta/musica.py          # -> ../gatito-galleta/salida/musica.wav
node render.js --fps 60                       # -> salida/gatito3d_sin_audio.mp4
ffmpeg -y -i salida/gatito3d_sin_audio.mp4 -i ../gatito-galleta/salida/musica.wav \
  -c:v copy -c:a aac -b:a 192k -shortest salida/gatito3d_y_la_galleta.mp4
```
Para revisar momentos concretos sin renderizar todo: `node render.js --stills 0,12.5,22`.
