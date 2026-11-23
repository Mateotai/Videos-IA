// Genera la foto de perfil del canal con los personajes actuales.
//   node marca/render_logo.js   ->  marca/logo_mochi_pip_v2.png (800x800) y marca/logo_mochi_pip_v2_preview.png (círculo)
const { chromium } = require('playwright');
const http = require('http'), path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/marca/logo.html`);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
  const b64 = await page.evaluate(() => window.renderLogo(800).split(',')[1]);
  fs.writeFileSync(path.join(__dirname, 'logo_mochi_pip_v2.png'), Buffer.from(b64, 'base64'));
  // vista previa como la recorta YouTube (círculo)
  const prev = await page.evaluate(async (src) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + src; await img.decode();
    const c = document.createElement('canvas'); c.width = c.height = 800; const g = c.getContext('2d');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, 800, 800); g.beginPath(); g.arc(400, 400, 400, 0, 7); g.clip(); g.drawImage(img, 0, 0);
    return c.toDataURL('image/png').split(',')[1];
  }, b64);
  fs.writeFileSync(path.join(__dirname, 'logo_mochi_pip_v2_preview.png'), Buffer.from(prev, 'base64'));
  await browser.close(); server.close(); console.log('ok');
})();
