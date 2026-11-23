// =====================================================================
//  EPISODIO 8 (2D original) — "Snow day ❄️"
//  Un copo hace estornudar a Mochi. Pip sale de la nieve y le acierta con una
//  bola. Construyen un muñeco de nieve con orejas de gato y nariz de galleta...
//  Mochi se come la nariz y la cabeza del muñeco le cae encima. Chocolate
//  caliente para los dos. Final: ahora estornuda Pip.
// =====================================================================
const DURATION = 23.5;
const SMX = 560;   // muñeco de nieve
const CAT = new Rig({ x: 300, y: FLOOR, dir: 1, sx: 1, sy: 1, rot: 0, look: 0, paw: 0, wr: 0, tears: 0 });
const MOU = new Rig({ x: 820, y: FLOOR + 140, dir: -1, sx: 1, sy: 1, look: 0, wr: 0 });
const CEX = new Steps('normal'), MEX = new Steps('happy');
const CAM = new Rig({ s: 2.4, cx: 330, cy: 1320 });
// bolas de nieve del muñeco: x, y (centro), r
const B1 = new Rig({ x: 230, r: 0 }), B2 = new Rig({ x: 880, y: FLOOR - 20, r: 0 }), B3 = new Rig({ x: 900, y: FLOOR - 15, r: 0 });
const NOSE = new Rig({ on: 0 }), HEADFALL = new Rig({ p: 0 }), SB = new Rig({ p: 0 }), MUG = new Rig({ x: 1150 });

// 0–1.6 el copo en la nariz... ¡ACHÍS!
CAT.key(.3, { look: 0 }); CAT.key(.9, { look: .5 });
CEX.at(1.05, 'shock');
CAT.key(1.05, { sy: 1 }); CAT.key(1.3, { sy: 1.1, rot: -.08 }); CAT.key(1.38, { sy: .82, rot: .15 }, 'o'); CAT.key(1.7, { sy: 1, rot: 0 }, 'back');
CEX.at(1.4, 'happy').at(2.2, 'normal');
// 2.4 la nieve se mueve... ¡Pip!
MOU.key(2.9, { y: FLOOR + 140 }); MOU.key(3.25, { y: FLOOR }, 'back');
MEX.at(3.0, 'happy');
// bola de nieve con la cola
MOU.key(3.7, { dir: -1, sx: 1 }); MOU.key(3.85, { dir: 1 }); MOU.key(3.95, { dir: -1 });
SB.key(3.9, { p: 0 }); SB.key(4.4, { p: 1 }, 'lin');
CEX.at(4.4, 'shock').at(5.0, 'happy');
CAT.key(4.4, { rot: 0 }); CAT.key(4.5, { rot: -.15 }, 'o'); CAT.key(4.8, { rot: 0 }, 'back');
// construir el muñeco
CAT.key(5.6, { dir: 1 }); CAT.key(5.7, { dir: -1 });
walk(CAT, 5.7, 5.95, 300, 160, 3); CAT.key(5.95, { dir: -1 }); CAT.key(6.05, { dir: 1 });
CEX.at(6.0, 'determined');
walk(CAT, 6.1, 7.4, 160, SMX - 190, 1.8); B1.key(6.1, { x: 230, r: 30 }); B1.key(7.4, { x: SMX, r: 115 }, 'io');
CAT.key(6.1, { paw: .8 }); CAT.key(7.4, { paw: .8 }); CAT.key(7.6, { paw: 0 });
MEX.at(6.5, 'happy');
MOU.key(6.5, { x: 820, dir: -1 });
walk(MOU, 6.6, 8.0, 820, SMX + 120, 2.2); B2.key(6.6, { x: 760, y: FLOOR - 20, r: 20 }); B2.key(8.0, { x: SMX + 40, y: FLOOR - 75, r: 75 }, 'io');
// Mochi sube la bola mediana
CAT.key(8.1, { paw: 0 }); CAT.key(8.3, { paw: 1 }); CAT.key(8.8, { paw: 0 });
B2.key(8.2, { x: SMX + 40, y: FLOOR - 75 }); B2.key(8.7, { x: SMX, y: FLOOR - 230 - 75 + 20 }, 'io');
// Pip trae la cabeza y la sube saltando
walk(MOU, 8.4, 9.3, SMX + 120, SMX + 160, 2); B3.key(8.4, { x: 900, r: 10 }); B3.key(9.3, { x: SMX + 110, y: FLOOR - 45, r: 50 }, 'io');
jump(MOU, 9.35, [SMX + 160, FLOOR], [SMX + 60, FLOOR - 200], 140, .5, .1);
B3.key(9.5, { x: SMX + 110, y: FLOOR - 45 }); B3.key(10.0, { x: SMX, y: FLOOR - 230 - 150 - 50 + 30 }, 'io');
CEX.at(10.1, 'happy');
// nariz de galleta (Pip salta a la cara del muñeco)
NOSE.key(10.6, { on: 0 }); NOSE.key(10.9, { on: 1 }, 'back');
MOU.key(10.95, { x: SMX + 60, y: FLOOR - 200 }); MOU.key(11.25, { y: FLOOR - 300 }, 'oq'); MOU.key(11.55, { y: FLOOR }, 'iq'); MOU.key(11.55, { x: SMX + 190 }, 'lin');
MOU.key(11.6, { sy: .8, sx: 1.2 }, 'o'); MOU.key(11.8, { sy: 1, sx: 1 }, 'back');
// Mochi ve la galleta... ¡se la come!
CAT.key(11.8, { look: 0 }); CAT.key(12.2, { look: -1 }); CEX.at(12.2, 'love');
jump(CAT, 12.9, [SMX - 190, FLOOR], [SMX - 120, FLOOR], 220, .5, .12, { air: { paw: 1 } }); CAT.key(13.6, { paw: 0 });
NOSE.key(13.25, { on: 1 }); NOSE.key(13.3, { on: 2 }, 'hold');   // 2 = en la boca
CEX.at(13.55, 'chew');
MEX.at(13.4, 'shock').at(13.8, 'normal');
for (const t of [13.8, 14.1]) { MOU.key(t, { y: FLOOR }); MOU.key(t + .12, { y: FLOOR - 40 }, 'oq'); MOU.key(t + .25, { y: FLOOR }, 'iq'); }
// la cabeza del muñeco le cae encima
HEADFALL.key(14.3, { p: 0 }); HEADFALL.key(14.75, { p: 1 }, 'iq');
CEX.at(14.75, 'dizzy');
CAT.key(14.75, { sy: 1 }); CAT.key(14.82, { sy: .8, sx: 1.15 }, 'o'); CAT.key(15.05, { sy: 1, sx: 1 }, 'back');
MEX.at(14.9, 'happy');
// tirita... chocolate caliente
CEX.at(15.6, 'sad');
MOU.key(16.0, { dir: -1 }); MOU.key(16.1, { dir: 1 }); walk(MOU, 16.15, 16.6, SMX + 190, 1150, 4);
MOU.key(17.0, { dir: 1 }); MOU.key(17.05, { dir: -1 }); walk(MOU, 17.1, 18.0, 1150, SMX + 30, 2.6); MUG.key(17.1, { x: 1150 }); MUG.key(18.0, { x: SMX + 30 }, 'io');
CEX.at(18.1, 'love').at(18.6, 'happy');
// final: un copo en la nariz de Pip... ¡ACHÍS!
const SNEEZE = 21.0;
MEX.at(20.3, 'normal').at(SNEEZE, 'shock').at(SNEEZE + .5, 'happy');
MOU.key(SNEEZE - .2, { sy: 1 }); MOU.key(SNEEZE, { sy: 1.15 }); MOU.key(SNEEZE + .08, { sy: .8 }, 'o'); MOU.key(SNEEZE + .35, { sy: 1 }, 'back');
CEX.at(SNEEZE + .1, 'shock').at(SNEEZE + .6, 'happy');
CAM.key(1.5, { s: 2.4, cx: 330, cy: 1320 }); CAM.key(2.4, { s: 1.4, cx: 560, cy: 1200 });
CAM.key(13.0, { s: 1.4, cx: 560, cy: 1200 }); CAM.key(13.8, { s: 1.7, cx: 520, cy: 1240 });
CAM.key(17.0, { s: 1.7, cx: 520, cy: 1240 }); CAM.key(17.8, { s: 1.5, cx: 560, cy: 1220 });
CAM.key(20.4, { s: 1.5, cx: 560, cy: 1220 }); CAM.key(20.9, { s: 1.9, cx: 560, cy: 1260 });
for (const r of [CAT, MOU, CAM, B1, B2, B3, NOSE, HEADFALL, SB, MUG]) r.done();

// ---------- estados ----------
function catState(t) {
  const wr = CAT.val('wr', t), ph = CAT.integ('wr', t), br = 1 + Math.sin(t * 4) * .015;
  let x = CAT.val('x', t);
  if (t > 15.3 && t < 18.0) x += Math.sin(t * 60) * 3;   // tirita
  return { x, y: CAT.val('y', t) - Math.abs(Math.sin(ph * Math.PI * 2)) * 12 * clamp(wr), dir: CAT.val('dir', t), sx: CAT.val('sx', t) / br, sy: CAT.val('sy', t) * br,
    rot: CAT.val('rot', t), look: CAT.val('look', t), paw: CAT.val('paw', t), walk: ph, tearsOn: CAT.val('tears', t), expr: CEX.get(t) };
}
function mouseState(t) {
  const wr = MOU.val('wr', t), ph = MOU.integ('wr', t);
  return { x: MOU.val('x', t), y: MOU.val('y', t) - Math.abs(Math.sin(ph * Math.PI * 2)) * 10 * clamp(wr), dir: MOU.val('dir', t), sx: MOU.val('sx', t), sy: MOU.val('sy', t), look: MOU.val('look', t), expr: MEX.get(t) };
}
const headOf = cs => ({ x: cs.x + 18 * cs.dir * cs.sx, y: cs.y - 168 * cs.sy });

// ---------- escenario nevado ----------
function snowScene(t) {
  const g = ctx.createLinearGradient(0, -400, 0, FLOOR); g.addColorStop(0, '#9fd3ff'); g.addColorStop(1, '#e8f6ff');
  ctx.fillStyle = g; ctx.fillRect(-800, -1200, 2800, FLOOR + 1300);
  ctx.fillStyle = 'rgba(255,255,255,.9)'; for (const [x, y, s] of [[200, 520, 1], [760, 380, .8], [1050, 640, .7]]) for (const [dx, dy, r] of [[0, 0, 50], [45, -18, 40], [-45, 8, 34], [85, 8, 30]]) { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, 7); ctx.fill(); }
  ellipse(250, 1330, 650, 200, '#ffffff', true, 6); ellipse(950, 1360, 600, 210, '#f4fbff', true, 6);
  for (const [x, y, s] of [[60, 1170, 1], [900, 1150, 1.15], [1200, 1200, .9], [420, 1230, .7]]) {
    roundRect(x - 12 * s, y + 160 * s, 24 * s, 50 * s, 6, '#8b5a3c');
    for (let i = 0; i < 3; i++) { const w = (110 - i * 28) * s, yy = y + 160 * s - i * 60 * s; ctx.beginPath(); ctx.moveTo(x - w, yy); ctx.lineTo(x, yy - 110 * s); ctx.lineTo(x + w, yy); ctx.closePath(); ctx.fillStyle = '#3fae6b'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - w * .55, yy - 50 * s); ctx.lineTo(x, yy - 110 * s); ctx.lineTo(x + w * .55, yy - 50 * s); ctx.quadraticCurveTo(x, yy - 70 * s, x - w * .55, yy - 50 * s); ctx.fillStyle = '#ffffff'; ctx.fill(); }
  }
  ctx.fillStyle = '#ffffff'; ctx.fillRect(-800, FLOOR - 30, 2800, 1000);
  ctx.fillStyle = '#dbeeff'; for (let i = 0; i < 5; i++) ctx.fillRect(-800, FLOOR + 50 + i * 95, 2800, 10);
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(-800, FLOOR - 30); for (let x = -800; x <= 2000; x += 80) ctx.quadraticCurveTo(x + 40, FLOOR - 42, x + 80, FLOOR - 30); ctx.stroke();
  // montón de nieve de Pip
  if (t < 3.3) { const w = t > 2.4 ? Math.sin(t * 40) * 4 : 0; ellipse(820 + w, FLOOR - 20, 95, 55, '#ffffff'); }
}
function snowflakes(t, front) {
  for (let i = 0; i < 70; i++) {
    if ((i % 2 === 0) !== front) continue;
    const sp = 60 + rnd(i) * 80, x = -200 + rnd(i * 3) * 1500 + Math.sin(t * 1.3 + i) * 30, y = ((rnd(i * 7) * 2600 + t * sp) % 2600) - 600;
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y, front ? 7 : 4.5, 0, 7); ctx.fill();
  }
}
function snowball(x, y, r) { if (r < 2) return; ellipse(x, y, r, r, '#ffffff', true, 7); ctx.save(); ctx.globalAlpha = .5; ellipse(x + r * .25, y + r * .3, r * .55, r * .4, '#dbeeff', false); ctx.restore(); }
function snowman(t, cs) {
  const b1 = B1.val('r', t), bx1 = B1.val('x', t), b2 = B2.val('r', t), b3 = B3.val('r', t);
  snowball(bx1, FLOOR - b1 + 6, b1);
  snowball(B2.val('x', t), B2.val('y', t), b2);
  if (t >= 10.0) {   // ramitas
    ctx.lineWidth = 8; ctx.strokeStyle = '#8b5a3c'; ctx.lineCap = 'round';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(SMX + s * 60, FLOOR - 310); ctx.lineTo(SMX + s * 135, FLOOR - 370); ctx.lineTo(SMX + s * 150, FLOOR - 395); ctx.stroke(); }
    for (let i = 0; i < 3; i++) ellipse(SMX, FLOOR - 285 + i * 30, 7, 7, C.ink, false);
  }
  // cabeza (con orejas de gato), puede caer sobre Mochi
  const hp = HEADFALL.val('p', t);
  let hx = B3.val('x', t), hy = B3.val('y', t);
  if (hp > 0) { const h = headOf(cs); hx = lerp(SMX, h.x, hp); hy = lerp(FLOOR - 230 - 150 - 50 + 30, h.y - 30, hp) - Math.sin(hp * Math.PI) * 60; }
  if (t > SNEEZE) { const q = t - SNEEZE; hx -= q * 1100; hy -= q * 900 - q * q * 900; }   // el estornudo de Pip la lanza
  return { hx, hy, b3, hp };
}
function snowHead(h, t, ears) {
  const { hx, hy, b3 } = h; if (b3 < 2) return;
  if (ears) for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(hx + s * 18, hy - b3 * .7); ctx.lineTo(hx + s * 42, hy - b3 * 1.45); ctx.lineTo(hx + s * 48, hy - b3 * .45); ctx.closePath(); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke(); }
  snowball(hx, hy, b3);
  if (ears) { ellipse(hx - 16, hy - 8, 6, 8, C.ink, false); ellipse(hx + 16, hy - 8, 6, 8, C.ink, false);
    ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(hx, hy + 14, 12, .2, Math.PI - .2); ctx.stroke(); }
}
function mug(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(26, -26, 14, -1.2, 1.2); ctx.stroke();
  roundRect(-24, -58, 50, 58, 10, '#ff6b8b'); ellipse(1, -56, 23, 7, '#7a4a2e', true, 5);
  ctx.globalAlpha = .7; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; for (const d of [-10, 10]) { ctx.beginPath(); ctx.moveTo(d, -68); ctx.bezierCurveTo(d - 10, -90, d + 10, -100, d, -122); ctx.stroke(); }
  ctx.restore();
}
function worldWord(text, x, y, t, t0, t1, size, col = '#ffffff', rot = -.08) {
  if (t < t0 || t > t1) return;
  const p = easeOutBack(seg(t, t0, t0 + .18)) * (1 - seg(t, t1 - .15, t1));
  ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.rotate(rot);
  ctx.font = `900 ${size}px Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * .2; ctx.strokeStyle = C.ink; ctx.strokeText(text, 0, 0); ctx.fillStyle = col; ctx.fillText(text, 0, 0);
  ctx.restore();
}

// ---------- fotograma ----------
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#e8f6ff'; ctx.fillRect(0, 0, W, H);
  const sh = (t > 14.75 && t < 15.0) ? 8 : 0;
  const cam = { s: CAM.val('s', t), cx: CAM.val('cx', t) + Math.sin(t * 80) * sh, cy: CAM.val('cy', t) };
  const cs = catState(t), ms = mouseState(t);
  withCamera(cam, () => {
    snowScene(t); snowflakes(t, false);
    const h = snowman(t, cs);
    if (h.hp < .01) snowHead(h, t, t > 10.0);
    // nariz de galleta
    const n = NOSE.val('on', t);
    if (n > 0 && n < 1.5 && h.hp < .01) cookie(lerp(ms.x + 40, h.hx + 2, Math.min(1, n)), lerp(ms.y - 80, h.hy + 2, Math.min(1, n)), 14 * Math.min(1, n));
    drawCat(cs, t);
    if (n >= 2 && t < 14.4) { const hd = headOf(cs); cookie(hd.x + 40 * cs.dir, hd.y + 40, 14); }
    if (h.hp > .01) snowHead(h, t, true);
    // nieve en la cara de Mochi
    if (t > 4.4 && t < 5.7) { const hd = headOf(cs), a = 1 - seg(t, 5.3, 5.7); ctx.save(); ctx.globalAlpha = a; for (const [dx, dy, r] of [[0, 10, 46], [-34, -10, 26], [32, -4, 28], [6, 40, 24]]) ellipse(hd.x + dx, hd.y + dy, r, r * .85, '#ffffff', true, 5); ctx.restore(); }
    drawMouse(ms, t);
    // bola de nieve lanzada
    const p = SB.val('p', t);
    if (p > 0 && p < 1) { const hd = headOf(catState(4.4)); snowball(lerp(ms.x - 60, hd.x, p), lerp(ms.y - 40, hd.y, p) - Math.sin(p * Math.PI) * 220, 24); }
    // tazas de chocolate
    if (t > 17.1) { mug(MUG.val('x', t), FLOOR - 4); if (t > 18.0) mug(cs.x + 70 * cs.dir, cs.y - 100, 1.15); }
    snowflakes(t, true);
    // copos protagonistas
    if (t < 1.1) { const hd = headOf(cs); const q = seg(t, 0, 1.05); ctx.save(); ctx.translate(lerp(hd.x + 160, hd.x + 45, q), lerp(hd.y - 260, hd.y + 30, q) + Math.sin(t * 6) * 10); ctx.rotate(t * 2); sparkle(0, 0, .9, 1, '#ffffff'); ctx.restore(); }
    if (t > 19.8 && t < SNEEZE) { const q = seg(t, 19.8, SNEEZE - .02); ctx.save(); ctx.translate(lerp(ms.x - 60, ms.x + 62 * ms.dir, q), lerp(ms.y - 300, ms.y - 50, q) + Math.sin(t * 6) * 8); ctx.rotate(t * 2); sparkle(0, 0, .7, 1, '#ffffff'); ctx.restore(); }
    // efectos
    if (t > 1.38 && t < 2.0) { const q = seg(t, 1.38, 2.0), hd = headOf(cs); for (let i = 0; i < 8; i++) { const a = -1 + i * .25; ellipse(hd.x + 80 + Math.cos(a) * q * 160, hd.y + 20 + Math.sin(a) * q * 120, 8 * (1 - q), 8 * (1 - q), '#cfefff', false); } }
    if (t > 10.0 && t < 11.0) for (let i = 0; i < 5; i++) { const q = seg(t, 10.0, 11.0); sparkle(SMX + Math.cos(i * 1.3) * (90 + q * 80), FLOOR - 380 + Math.sin(i * 1.3) * (80 + q * 60), .9 * (1 - q), 1 - q); }
    if (t > 14.8 && t < 15.6) for (let i = 0; i < 3; i++) { const a = t * 7 + i * 2.1; sparkle(cs.x + Math.cos(a) * 95, cs.y - 330 + Math.sin(a) * 22, .8, 1, '#ffd93d'); }
    if (t > 18.6 && t < 20.4) for (let i = 0; i < 6; i++) { const ph = ((t - 18.6) * .6 + i / 6) % 1; heart(SMX + Math.sin(ph * 5 + i * 2) * 170, FLOOR - 360 - ph * 220, (.8 + (i % 3) * .2) * Math.sin(ph * Math.PI), i % 2 ? C.red : C.pink); }
    worldWord('ACHOO!', headOf(cs).x + 60, headOf(cs).y - 175, t, 1.35, 2.1, 52, '#cfefff', -.1);
    worldWord('SPLAT!', headOf(catState(4.4)).x + 120, headOf(catState(4.4)).y - 130, t, 4.4, 5.1, 70, '#ffffff', .08);
    worldWord('BONK!', cs.x + 120, cs.y - 360, t, 14.75, 15.4, 80, '#cfefff', -.06);
    worldWord('ACHOO!', ms.x - 140, ms.y - 160, t, SNEEZE, SNEEZE + .7, 60, '#cfefff', .08);
  });
  caption('❄️ 👃', t, 0, 1.35, { size: 150 });
  pill('👀', t, 0, 3.0);
  caption('🐭 ❄️', t, 3.0, 3.9, { size: 140 });
  caption('⛄ ?', t, 5.8, 7.5, { size: 140 });
  caption('⛄ = 🐱', t, 10.2, 12.0, { size: 140, highlight: true });
  caption('🍪 😻', t, 12.1, 13.3, { size: 140 });
  caption('😤', t, 13.5, 14.3, { size: 160 });
  caption('⛄ 🐱 😂', t, 14.9, 16.0, { size: 130 });
  caption('🥶', t, 16.0, 17.6, { size: 160 });
  caption('☕ ❤️', t, 18.2, 20.3, { size: 150 });
  endCard(t, 21.7, 9);
}
startEpisode(render);
