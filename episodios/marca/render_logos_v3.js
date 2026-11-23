// Genera tres propuestas de foto de perfil (A abrazo, B chicle, C campeones).
//   node marca/render_logos_v3.js  ->  marca/logo_v3_A|B|C.png (800x800) + comparativa
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
  await page.goto(`http://127.0.0.1:${server.address().port}/marca/logos_v3.html`);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
  for (const v of ['A', 'B', 'C']) {
    const b64 = await page.evaluate(n => window.renderVariant(n, 800).split(',')[1], v);
    fs.writeFileSync(path.join(__dirname, `logo_v3_${v}.png`), Buffer.from(b64, 'base64'));
  }
  await browser.close(); server.close(); console.log('ok');
})();
