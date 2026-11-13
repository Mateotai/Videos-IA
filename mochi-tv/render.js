// Renderiza serie.html fotograma a fotograma y lo codifica con ffmpeg.
//   node render.js                    -> salida/serie_sin_audio.mp4 (60 fps)
//   node render.js --stills 0,3,12.5  -> salida/still_*.jpg
//   node render.js --page ep2.html --out ep2_sin_audio.mp4
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http'), path = require('path'), fs = require('fs');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const FPS = Number(arg('--fps', 60));
const OUT = path.join(__dirname, 'salida'); fs.mkdirSync(OUT, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const f = path.join(__dirname, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(__dirname) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e));
  page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  const PAGE = arg('--page', 'serie.html');
  await page.goto(`http://127.0.0.1:${server.address().port}/${PAGE}`);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
  await page.evaluate(async () => { await document.fonts.load('700 100px Fredoka'); await document.fonts.load('600 50px Fredoka'); await document.fonts.ready; });
  const duration = await page.evaluate(() => window.DURATION);
  const grab = async t => Buffer.from(await page.evaluate(tt => { window.render(tt); return document.getElementById('out').toDataURL('image/jpeg', 0.95).split(',')[1]; }, t), 'base64');
  const stills = arg('--stills');
  if (stills) {
    for (const s of stills.split(',').map(Number)) fs.writeFileSync(path.join(OUT, `still_${s.toFixed(2).padStart(6, '0')}.jpg`), await grab(s));
  } else {
    const total = Math.round(duration * FPS);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '17', '-movflags', '+faststart',
      path.join(OUT, arg('--out', 'serie_sin_audio.mp4'))], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let i = 0; i < total; i++) {
      const buf = await grab(i / FPS);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 120 === 0) console.log(`frame ${i}/${total}  (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    console.log('listo');
  }
  await browser.close(); server.close();
})();
