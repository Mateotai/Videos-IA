// Renderiza animacion.html fotograma a fotograma y lo codifica con ffmpeg.
// Uso:
//   node render.js                 -> video completo (salida/gatito_sin_audio.mp4)
//   node render.js --stills 0,3,12 -> capturas PNG de esos segundos (salida/still_*.png)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const FPS = 30;
const OUT = path.join(__dirname, 'salida');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, 'animacion.html'));
  await page.evaluate(() => document.fonts.ready);
  const duration = await page.evaluate(() => window.DURATION);

  const grab = async t => {
    const b64 = await page.evaluate(tt => { window.render(tt); return document.getElementById('c').toDataURL('image/png').split(',')[1]; }, t);
    return Buffer.from(b64, 'base64');
  };

  const stillsArg = process.argv.indexOf('--stills');
  if (stillsArg > -1) {
    for (const s of process.argv[stillsArg + 1].split(',').map(Number)) {
      fs.writeFileSync(path.join(OUT, `still_${String(s).padStart(5, '0')}.png`), await grab(s));
    }
    await browser.close();
    return;
  }

  const total = Math.round(duration * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '18',
    path.join(OUT, 'gatito_sin_audio.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < total; i++) {
    const buf = await grab(i / FPS);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 60 === 0) process.stdout.write(`frame ${i}/${total}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('listo');
})();
