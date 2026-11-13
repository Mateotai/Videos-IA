// Renderiza un episodio fotograma a fotograma y lo codifica con ffmpeg.
//   node render.js --page ep3.html --stills 0,5,10      -> salida/still_*.jpg
//   node render.js --page ep3.html --out ep3.mp4 [--fps 60] [--audio salida/x.wav]
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const http = require('http'), path = require('path'), fs = require('fs');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const FPS = Number(arg('--fps', 60)), PAGE = arg('--page'), OUTF = arg('--out');
const OUT = path.join(__dirname, 'salida'); fs.mkdirSync(OUT, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const f = path.join(__dirname, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(__dirname) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.goto(`http://127.0.0.1:${server.address().port}/${PAGE}`);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
  await page.evaluate(async () => { for (const f of ['700 100px Fredoka', '900 100px Inter']) await document.fonts.load(f); await document.fonts.ready; });
  const duration = await page.evaluate(() => window.DURATION);
  const grab = async t => Buffer.from(await page.evaluate(tt => { window.render(tt); const c = document.getElementById('out') || document.getElementById('c'); return c.toDataURL('image/jpeg', 0.95).split(',')[1]; }, t), 'base64');
  const stills = arg('--stills');
  if (stills) {
    for (const s of stills.split(',').map(Number)) fs.writeFileSync(path.join(OUT, `still_${s.toFixed(2).padStart(6, '0')}.jpg`), await grab(s));
  } else {
    const video = path.join(OUT, OUTF.replace('.mp4', '_sin_audio.mp4'));
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '17', '-movflags', '+faststart', video], { stdio: ['pipe', 'inherit', 'inherit'] });
    const total = Math.round(duration * FPS), t0 = Date.now();
    for (let i = 0; i < total; i++) {
      const buf = await grab(i / FPS);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 240 === 0) console.log(`frame ${i}/${total}  (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    const audio = arg('--audio');
    if (audio) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-i', audio, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(OUT, OUTF)]);
    console.log('listo');
  }
  await browser.close(); server.close();
})();
