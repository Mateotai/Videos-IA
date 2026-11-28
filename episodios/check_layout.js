// Comprueba el maquetado de un episodio: recorre la historia y lista colisiones de los personajes.
//   node check_layout.js ep14.html [fin=32.1] [paso=0.05]
const { chromium } = require('playwright');
const http = require('http'), path = require('path'), fs = require('fs');
const PAGE = process.argv[2], END = Number(process.argv[3] || 32.1), STEP = Number(process.argv[4] || .05);
const server = http.createServer((req, res) => { const f = path.join(__dirname, decodeURIComponent(req.url.split('?')[0])); if (!f.startsWith(__dirname) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript' }[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); });
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/${PAGE}`);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
  const issues = await page.evaluate(([end, step]) => { const out = []; for (let s = 0; s <= end; s += step) out.push(...window.layoutCheck(s)); return out; }, [END, STEP]);
  if (!issues.length) console.log('maquetado OK: ningún personaje atraviesa nada');
  else { const seen = new Set(); for (const i of issues) { const key = i.split(' ').slice(1, 5).join(' '); if (!seen.has(key)) { seen.add(key); console.log(i); } } console.log(`${issues.length} muestras con problemas`); }
  await browser.close(); server.close();
})();
