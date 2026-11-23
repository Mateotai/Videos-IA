# Mochi & Pip — guía del canal

Canal de YouTube Shorts de dibujos animados para niños, hechos 100 % con código.
Lee esto antes de tocar nada: aquí está lo que no se puede improvisar.

- Habla con el usuario en **español**. Los textos del vídeo y de YouTube van en **inglés** (idioma principal del canal).
- **Nunca subas vídeos (`.mp4`) al repo.** Ver «Entrega de los vídeos».

## La serie

- **Mochi**: gato naranja (`#ffa53d`, barriga `#fff0d6`). Glotón, impulsivo, exagerado; casi siempre pierde por querer más.
- **Pip**: ratón gris lila (`#b8b3cc`). Pequeño, listo y tierno; suele salir ganando o tener la idea final.
- Son amigos: hay pique, pero **siempre** hay un momento tierno. Nada de violencia real ni de miedo de verdad: público infantil.
- **Sin diálogos ni voces.** Solo música, efectos y textos cortos con emojis y onomatopeyas (versión «global», se entiende en cualquier idioma).
- Logo en pantalla: «Mochi» `#ffa040` · « & » `#ff6b8b` · «Pip» `#a9a2c9`, con contorno tinta `#2b2233`.

### Fórmula de cada guion
**gancho (0–2 s) → 3 intentos / escaladas → giro → momento tierno → remate sorpresa → tarjeta final «Mochi & Pip / PART N ⏳»**

- El primer fotograma ya tiene que enganchar: algo raro o una cara en primer plano.
- Un cambio cada 2–3 s. Cada golpe, salto y giro tiene su sonido.
- La tarjeta final (`endCard(t, t0, N)`) anuncia el **siguiente** número de episodio (Ep. 3–8).
- Desde el Ep. 10 la fórmula 3D es: **gancho a cámara lenta (el clímax) → rebobinado VHS ◀◀ → la historia desde el principio → letrero «Mochi & Pip» arriba al final** (sin «PART», con destello y campanita). Ver `ep10.js`–`ep12.js`.
- Textos grandes y en la zona segura (arriba y centro), lejos de los botones de Shorts.

### Formato técnico
Vertical **1080×1920, 60 fps**, H.264 + AAC 192k. Duración habitual 23–26 s en los Ep. 3–8; 35–40 s desde el Ep. 9.

## Estilos (prueba A/B en curso)
| Estilo | Motor | Episodios |
|---|---|---|
| 2D original (plano con contorno, desenfoque de movimiento, muelles) | `episodios/common/flat2d.js` | 4, 6, 8 (y las versiones alternativas del 9) |
| 3D (Three.js) | `episodios/common/engine3d.js` (+ `kitchen3d.js`, cocina común desde el Ep. 9; Ep. 1: `gatito-3d/escena.html`) | 1, 3, 5, 7, 9, 10, 11, 12 |
| 2D «serie de TV» (rig cut-out) | `mochi-tv/engine.js` | 2 (y una versión alternativa del 1) |

**Ep. 9 tiene tres versiones**, hechas en sesiones distintas: `ep9` (3D «Pancakes», la oficial, la que siguen los Ep. 10–12), `ep9_2d` (2D «Pancake») y `ep9_fishing` (2D «Gone fishing»). Las tres están en `SUBIDAS.md`.

Se alternan estilos y se apuntan las métricas en la tabla A/B de `episodios/SUBIDAS.md`. Pregunta al usuario qué estilo toca si no está claro.

## Estructura del repo
- `episodios/`: **aquí se hacen los episodios nuevos.**
  - `common/rig.js`: fotogramas clave (`Rig`, `Steps`, `jump`, `walk`) compartidos por los dos motores.
  - `common/flat2d.js`, `common/engine3d.js`: motores. Cada episodio define `DURATION` y su escena.
  - `epN.html` + `epN.js`: un episodio (guion = fotogramas clave). El `.js` empieza con un comentario que resume la historia.
  - `audio/sintes.py` (sintetizador con numpy) + `audio/musica_epN.py` → `salida/musica_epN.wav`.
  - `audio/canciones/`: canciones de Kevin MacLeod (CC BY 4.0) que usan los Ep. 10–12; el crédito va en la descripción del vídeo y está en `CREDITOS.md`.
  - `marca/`: logo nuevo (Mochi bípedo + Pip) y las propuestas de foto de perfil, con sus scripts.
  - `render.js`: renderiza con Playwright y codifica con ffmpeg.
  - `SUBIDAS.md`: títulos, descripciones, traducciones y tabla A/B de cada episodio.
- `mochi-tv/`: Ep. 1 y 2 en estilo serie de TV (`PLAN.md` tiene la lista de ideas y el plan A/B).
- `gatito-3d/`: piloto 3D, Ep. 1 global, y `marca/` (logo y banner del canal).
- `gatito-galleta/`: piloto 2D original.
- `pupusas-venta/`: anuncio «Venta de pupusas 4 x 7 €» (no es de Mochi & Pip; música con fluidsynth). Ver su README.
- `salida/` en cada proyecto: renders locales, **ignorados por Git**.

## Hacer un episodio nuevo
1. Copia el episodio más reciente del mismo estilo (`epN.html`/`epN.js`) y reescribe el guion. **No toques los motores** salvo que el usuario lo pida: afectan a todos los episodios.
2. Copia `audio/musica_epN.py` y ajusta los tiempos de efectos a la nueva línea de tiempo.
3. Renderiza:
   ```bash
   cd episodios
   npm install                                   # solo hace falta para los episodios 3D (three)
   node render.js --page epN.html --stills 0,5,10   # fotogramas sueltos en salida/ para revisar
   python3 audio/musica_epN.py                   # -> salida/musica_epN.wav
   node render.js --page epN.html --out epN_nombre.mp4 --audio salida/musica_epN.wav
   ```
   Revisa los fotogramas sueltos (míralos tú) antes del render completo, que tarda.
4. Añade su bloque a `SUBIDAS.md` (ver abajo) y haz commit del código.

Requisitos: Node + Playwright (Chromium), Python 3 + numpy, ffmpeg.

## Textos de subida (`SUBIDAS.md`)
Cada episodio lleva el mismo bloque:
- **Título**: `<Mochi/Pip hace algo EXAGERADO> <2-3 emojis> #shorts` (una palabra en MAYÚSCULAS, cuenta el remate sin destriparlo del todo).
- **Descripción**:
  ```
  <1-2 frases con la historia y emojis>
  Watch until the end! 👀

  New Mochi & Pip cartoon every week ❤️

  #shorts #cartoon #animation #cat #kids #funny #<tema>
  ```
- **Etiquetas fijas**: `mochi and pip, cartoon, animation, funny cat, animated shorts, cat cartoon, comedy animation`. En cada vídeo se cambian 2-3 por lo que pasa de verdad en pantalla. Nunca `#games` ni `#gameplay`.
- **Títulos traducidos**: ES · PT · FR · HI · ID.
- **Ajustes fijos**: Público · «Sí, es contenido creado para niños» · Categoría Cine y animación · Idioma del vídeo «No aplicable» · Lista **Mochi & Pip**.
- Publicar uno al día, siempre a la misma hora.

## Entrega de los vídeos
- Los `.mp4` **no van al repo** (`.gitignore` lo impide). El código basta para volver a generarlos.
- Al terminar un render, envía el vídeo al usuario como archivo adjunto (herramienta de envío de archivos de la sesión) desde `salida/`. Él lo sube a mano a la carpeta de Google Drive **«MOCHI Y PIP»**.
- No intentes subirlo a Drive con el conector: desde estas sesiones solo admite unos 3 MB por archivo y los episodios pesan 8–40 MB.
- Haz commit y push del **código** del episodio antes de acabar la sesión: el contenedor se borra.
