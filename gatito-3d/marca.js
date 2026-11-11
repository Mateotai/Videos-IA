// Genera el logo y el banner del canal a partir de escena.html
//   node marca.js  -> marca/logo_mochi_pip.png, marca/banner_mochi_pip.png (+ vistas previas)
const { chromium } = require('playwright');
const http = require('http'), path = require('path'), fs = require('fs');
const OUT = path.join(__dirname, 'marca'); fs.mkdirSync(OUT, { recursive: true });
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
  page.on('pageerror', e => console.error('PAGE ERROR', e));
  await page.goto(`http://127.0.0.1:${server.address().port}/escena.html`);
  await page.waitForFunction(() => window.ready === true);
  await page.evaluate(async () => { await document.fonts.load('700 100px Fredoka'); await document.fonts.load('600 50px Fredoka'); await document.fonts.ready; });
  const shot = async (fn, file) => {
    const b64 = await page.evaluate(f => { window[f](); return document.getElementById('out').toDataURL('image/png').split(',')[1]; }, fn);
    fs.writeFileSync(path.join(OUT, file), Buffer.from(b64, 'base64'));
  };
  await shot('renderLogo', 'logo_mochi_pip.png');
  await shot('renderBanner', 'banner_mochi_pip.png');
  await browser.close(); server.close();
  console.log('ok');
})();
