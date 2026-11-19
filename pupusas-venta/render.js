// Renderiza animacion.html fotograma a fotograma (con desenfoque de movimiento) y lo codifica con ffmpeg.
// Uso:
//   node render.js                  -> salida/pupusas_sin_audio.mp4 (60 fps, 5 sub-fotogramas)
//   node render.js --stills 0,3,12  -> capturas PNG (salida/still_*.png)
//   FPS=30 SUB=1 node render.js     -> render rápido de prueba
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const FPS = Number(process.env.FPS || 60);
const SUB = Number(process.env.SUB || 5);       // sub-fotogramas por fotograma
const SHUTTER = 0.5 / FPS;                      // obturador de 180°
const OUT = path.join(__dirname, 'salida');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, 'animacion.html'));
  await page.evaluate(async () => { await document.fonts.load('700 100px Fredoka'); await document.fonts.load('600 100px Fredoka'); await document.fonts.ready; window.render(0); window.render(17); });
  const duration = await page.evaluate(() => window.DURATION);

  const grab = async (t, sub) => {
    const b64 = await page.evaluate(([tt, n, sh]) => window.renderBlur(tt, n, sh).toDataURL('image/png').split(',')[1], [t, sub, SHUTTER]);
    return Buffer.from(b64, 'base64');
  };

  const stillsArg = process.argv.indexOf('--stills');
  if (stillsArg > -1) {
    for (const s of process.argv[stillsArg + 1].split(',').map(Number)) {
      fs.writeFileSync(path.join(OUT, `still_${s.toFixed(2).padStart(5, '0')}.png`), await grab(s, SUB));
    }
    await browser.close();
    return;
  }

  const total = Math.round(duration * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '17',
    path.join(OUT, 'pupusas_sin_audio.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < total; i++) {
    const buf = await grab(i / FPS, SUB);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 120 === 0) process.stdout.write(`frame ${i}/${total}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('listo');
})();
