# El gatito y la galleta 🍪

Corto animado 2D para TikTok / Reels / Shorts, hecho 100 % con código.
Vertical 1080×1920, 30 fps, 26 s, sin voces: solo música y efectos.

**Historia:** un gatito quiere una galleta → falla dos saltos → "Plan B" con una caja →
justo cuando la alcanza, un ratón se la roba → el gatito llora → el ratón la parte y la comparte →
comen juntos → la cámara sube y revela un tarro lleno de galletas → *¿¡En serio!?* → saltan juntos al tarro → *¿Parte 2?*

## Fórmula viral aplicada
- **Gancho en el primer segundo:** texto "Él solo quería UNA galleta" ya visible en el fotograma 0.
- **Sin diálogos:** se entiende en cualquier idioma; los textos son cortos y grandes.
- **Giros cada 2–3 s:** intento 1 → intento 2 → plan B → robo → tristeza → amistad → remate.
- **Emoción + remate cómico:** ternura (compartir) y un final sorpresa que invita a comentar.
- **Música marcada por la acción:** cada salto, golpe y giro tiene su sonido.
- **Textos en la zona segura** (arriba y centro), lejos de los botones de TikTok.

## Trucos de retención (v2)
- **Primer fotograma = cara gigante** del gatito + zoom hacia atrás con "whoosh" en 0,5 s.
- **"ESPERA AL FINAL ⬇"** parpadeando los primeros 3 s (curiosidad).
- **Detalle escondido:** el ratón se asoma 4 veces detrás de la tetera con un chillido;
  al final se pregunta "¿Viste al ratón desde el principio?" → invita a volver a verlo.
- **Golpes de zoom, líneas de cómic y destellos** en los momentos clave (caída, robo, tarro).
- **Zoom lento en la parte triste** para subir la emoción.
- **Parpadeos** del gatito para que se sienta vivo.
- **Final en dos tiempos:** sorpresa ("¿¡EN SERIO!?") + acción ("¡AL ATAQUE!") + gancho de serie ("¿PARTE 2?").

## Archivos
- `animacion.html` — toda la animación en Canvas (ábrelo en el navegador para verla en bucle).
- `musica.py` — genera la música y los efectos con numpy.
- `render.js` — renderiza los fotogramas con Playwright y los codifica con ffmpeg.
- `salida/gatito_y_la_galleta.mp4` — vídeo final.

## Cómo regenerarlo
```bash
cd gatito-galleta
python3 musica.py          # -> salida/musica.wav
node render.js             # -> salida/gatito_sin_audio.mp4
ffmpeg -y -i salida/gatito_sin_audio.mp4 -i salida/musica.wav \
  -c:v copy -c:a aac -b:a 192k -shortest salida/gatito_y_la_galleta.mp4
```
Requiere Node + Playwright (Chromium), Python 3 + numpy, y ffmpeg.
