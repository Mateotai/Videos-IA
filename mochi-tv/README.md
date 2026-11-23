# Mochi & Pip — Episodio 1 (estilo serie de TV)

Versión 2D con acabado de serie infantil de televisión, hecha con la técnica
de animación por recortes ("cut-out") que usan muchas series:

- **Rig de personaje 2D**: cada personaje tiene ~40 controles (ojos, párpados, cejas,
  boca, brazos, orejas, cola…) animados por fotogramas clave con curvas de
  aceleración. Las expresiones se transforman poco a poco, no se cambian de golpe.
- **Animación secundaria con muelles**: la cabeza, las orejas y la cola siguen el
  movimiento con retraso; el cuerpo se aplasta al aterrizar y se estira al saltar.
- **Parpadeos, respiración y balanceo** automáticos para que nunca estén rígidos.
- **Desenfoque de movimiento** (4 sub-fotogramas) y **60 fps**.
- **Fondo en capas** con paralaje y desenfoque suave (profundidad), luz de ventana,
  sombras de contacto y gradación de color cálida.
- Versión **global**: sin idioma (emojis), con tarjeta final de marca.

Usa la misma línea de tiempo que las versiones anteriores, así que la música
de `../gatito-galleta/musica.py` encaja exactamente.

## Generarlo
```bash
cd mochi-tv
python3 ../gatito-galleta/musica.py
node render.js                       # -> salida/serie_sin_audio.mp4 (60 fps)
ffmpeg -y -i salida/serie_sin_audio.mp4 -i ../gatito-galleta/salida/musica.wav \
  -c:v copy -c:a aac -b:a 192k -shortest salida/mochi_pip_ep1_tv.mp4
```
Revisar momentos sueltos: `node render.js --stills 0,12.7,22`.
Requiere Playwright (Chromium) y ffmpeg.
