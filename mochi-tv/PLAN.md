# Mochi & Pip — Plan de episodios y prueba A/B

## Prueba A/B: 2D (estilo serie) vs 3D
Para que la comparación sea justa:
1. **Alterna estilos episodio a episodio** (Ep1 en ambos, luego 2D, 3D, 2D, 3D…).
2. **Sube a la misma hora** (ej. 18:00 de tu país) y con el mismo tipo de título/hashtags.
3. **Compara a las 48 h y a los 7 días**, en YouTube Studio → Analytics de cada Short:
   - **Visualizaciones** (lo que buscas al final).
   - **"Se ha visto" vs "Se ha deslizado"** (porcentaje de gente que se queda) → el mejor indicador del estilo.
   - **Duración media vista / % visto** (si pasa del 100 %, se re-ve: excelente).
4. Con **3 episodios de cada estilo** ya hay señal; con 1 solo vídeo es casi suerte.
5. Apunta los datos en una tabla (fecha, estilo, vistas 48 h, vistas 7 d, % se ha visto).

## Ideas de episodios (cada uno ~25 s, sin diálogos)
| # | Título | Idea en una línea | Gancho del primer segundo |
|---|---|---|---|
| 1 | One cookie 🍪 | Mochi quiere una galleta, Pip se la roba, la comparten… y aparece un tarro lleno | Mochi con ojos de corazón mirando la galleta |
| 2 | Bubbles 🫧 *(hecho)* | Mochi caza pompas, Pip le mete en una pompa gigante que sale volando | Pompa que se le acerca a la nariz y le pone bizco |
| 3 | The box 📦 | Llega un regalo enorme; a Mochi solo le interesa la caja; Pip se queda el juguete; al final los dos dentro de la caja | La caja temblando sola |
| 4 | Hide & seek 🙈 | Mochi se esconde fatal (la cola siempre asoma); Pip lo encuentra 3 veces; giro: Pip se esconde en la boca de… una taza | Cola naranja asomando detrás de una cortina |
| 5 | Birthday 🎂 | Pip prepara una tarta sorpresa; Mochi casi la descubre 3 veces; soplan las velas y la tarta vuela | Tarta tambaleándose en las manitas de Pip |
| 6 | Thunder ⛈️ | Tormenta: Pip tiene miedo, Mochi hace sombras chinescas para distraerlo; un trueno asusta a Mochi y Pip lo abraza | Relámpago que ilumina dos ojos asustados |
| 7 | Fishbowl 🐟 | Mochi quiere atrapar un pez de una pecera; el pez le salpica; acaban amigos y hacen burbujas juntos | Zarpa entrando en el agua a cámara lenta |
| 8 | Bedtime 🌙 | Mochi no puede dormir porque Pip ronca; prueba de todo; al final duermen acurrucados | Ronquido que hace temblar el cuadro |
| 9 | Snow day ❄️ | Primer día de nieve: muñeco de nieve con forma de Mochi; Pip le pone una galleta de nariz… y Mochi se la come | Copo cayendo en la nariz de Mochi |
| 10 | Yarn ball 🧶 | Pip juega con un ovillo; Mochi se enreda entero; Pip lo desenreda y acaban tejiendo una bufanda para los dos | Mochi envuelto como una momia de lana |

Regla de oro de cada guion: **gancho (0–2 s) → 3 intentos/escaladas → giro → momento tierno → remate sorpresa → tarjeta "Mochi & Pip / PART X"**.

## Cómo se hace un episodio nuevo (barato)
1. Copiar `ep2.html` → `epN.html` y cambiar: escenario (`bakeX`/`drawGround`), fotogramas clave de `C` (Mochi) y `M` (Pip), cámara (`cam2d`) y textos (`drawOverlay`). El motor (`engine.js`) no se toca.
2. Copiar `audio/musica_ep2.py` → `audio/musica_epN.py` y ajustar los tiempos de los efectos.
3. `node render.js --page epN.html --stills 0,5,10` para revisar; luego render completo y unir la música.

## Textos de subida — Episodio 2 "Bubbles"
**Título:** `Mochi vs the GIANT bubble 🫧🐱 #shorts`

**Descripción:**
```
Pip blows bubbles... Mochi pops them all! 🫧 But then comes the GIANT one 😱🐱🐭
Watch until the end! 👀

New Mochi & Pip cartoon every week ❤️

#shorts #cartoon #animation #cat #kids #funny #bubbles
```
**Traducciones del título:**
| Idioma | Título |
|---|---|
| Español | Mochi vs la burbuja GIGANTE 🫧🐱 #shorts |
| Português | Mochi vs a bolha GIGANTE 🫧🐱 #shorts |
| Français | Mochi vs la bulle GÉANTE 🫧🐱 #shorts |
| Hindi | मोची और विशाल बुलबुला 🫧🐱 #shorts |
| Indonesio | Mochi vs gelembung RAKSASA 🫧🐱 #shorts |

**Público:** creado para niños · **Categoría:** Cine y animación · **Lista:** Mochi & Pip
