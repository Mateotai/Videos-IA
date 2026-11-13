// =====================================================================
//  EPISODIO 6 (2D original) — "Yarn ball 🧶"
//  Un ovillo despierta al cazador: Mochi juega, rueda... y acaba envuelto
//  como una momia. Pip le desenreda corriendo en círculos y teje una bufanda
//  para los dos. Final: llega OTRO ovillo... y Mochi se lanza (con Pip atado).
// =====================================================================
const DURATION = 24;
const CAT = new Rig({ x: 330, y: FLOOR, dir: 1, sx: 1, sy: 1, rot: 0, spin: 0, look: 0, paw: 0, wr: 0, tears: 0, wrap: 0 });
const MOU = new Rig({ x: 1150, y: FLOOR, dir: -1, sx: 1, sy: 1, look: 0, wr: 0, knit: 0, scarf: 0 });
const BALL = new Rig({ x: 780, y: FLOOR - 40, r: 40, spin: 0 }), BALL2 = new Rig({ x: -150 });
const CEX = new Steps('normal'), MEX = new Steps('happy');
const CAM = new Rig({ s: 2.3, cx: 400, cy: 1330 });

// 0–1.3 el ovillo rueda hasta sus patas
BALL.key(0, { x: 780, spin: 0 }); BALL.key(1.2, { x: 445, spin: -8 }, 'o');
CAT.key(.8, { look: 0 }); CAT.key(1.1, { look: -.6 });
CEX.at(1.25, 'shock').at(1.65, 'determined');
CAT.key(1.25, { sy: 1 }); CAT.key(1.35, { sy: 1.1 }, 'o'); CAT.key(1.55, { sy: 1 });
// 1.6 aparece Pip
walk(MOU, 1.6, 2.4, 1150, 840, 3.4);
// 2.3 ¡zarpazo! el ovillo sale disparado y Mochi lo persigue
jump(CAT, 2.25, [330, FLOOR], [470, FLOOR], 120, .45, .12, { air: { paw: 1 } }); CAT.key(3.0, { paw: 0 });
BALL.key(2.82, { x: 445, spin: -8 }); BALL.key(3.6, { x: 720, spin: 10 }, 'o');
walk(CAT, 3.0, 3.6, 470, 640, 4.5);
jump(CAT, 3.6, [640, FLOOR], [700, FLOOR], 90, .35, .08, { air: { paw: 1 } }); CAT.key(4.15, { paw: 0 });
BALL.key(4.05, { x: 720, spin: 10 }); BALL.key(4.8, { x: 470, spin: -6 }, 'o');
// 4.2–8 rueda, salta y se enreda
CEX.at(4.2, 'happy');
CAT.key(4.2, { spin: 0, x: 700 }); CAT.key(4.9, { spin: -Math.PI * 2, x: 500 }, 'io');
CAT.key(4.91, { spin: 0 }, 'hold');
jump(CAT, 5.0, [500, FLOOR], [520, FLOOR], 200, .55, .12);
CAT.key(5.15, { spin: 0 }); CAT.key(5.67, { spin: Math.PI * 2 }, 'io'); CAT.key(5.68, { spin: 0 }, 'hold');
CAT.key(6.0, { spin: 0, x: 520 }); CAT.key(6.8, { spin: Math.PI * 2, x: 620 }, 'io'); CAT.key(6.81, { spin: 0 }, 'hold');
CEX.at(6.85, 'shock');
BALL.key(4.8, { x: 470 }); BALL.key(6.0, { x: 540 }); BALL.key(7.0, { x: 610 }); BALL.key(4.5, { r: 40 }); BALL.key(8.0, { r: 16 });
CAT.key(4.0, { wrap: 0 }); CAT.key(8.0, { wrap: 1 }, 'lin');
CAT.key(7.0, { sy: 1 }); CAT.key(7.4, { sy: .95 });
// 8.2 envuelto... se cae
CEX.at(8.2, 'dizzy');
CAT.key(8.3, { rot: 0 }); CAT.key(8.8, { rot: -1.4 }, 'iq'); CAT.key(9.0, { rot: -1.25 }, 'o'); CAT.key(9.15, { rot: -1.4 }, 'i');
MEX.at(8.4, 'shock').at(8.9, 'happy');
for (const t of [8.9, 9.2]) { MOU.key(t, { y: FLOOR }); MOU.key(t + .12, { y: FLOOR - 35 }, 'oq'); MOU.key(t + .25, { y: FLOOR }, 'iq'); }
walk(MOU, 9.5, 10.0, 840, 760, 3);
// 10–12 Pip le desenreda corriendo en círculos
CAT.key(10.0, { rot: -1.4 }); CAT.key(10.35, { rot: 0 }, 'back');
CEX.at(10.3, 'shock').at(11.0, 'dizzy');
CAT.key(10.2, { wrap: 1 }); CAT.key(12.0, { wrap: 0 }, 'lin');
MEX.at(10.1, 'happy');
const ORB0 = 10.2, ORB1 = 12.0;
// 12–13 mareado
CAT.key(12.0, { sy: 1 }); CAT.key(12.6, { sy: .9, sx: 1.05 }); CAT.key(13.0, { sy: 1, sx: 1 });
CEX.at(12.9, 'normal');
// 13–16 Pip teje una bufanda
MOU.key(12.2, { x: 760 }); MOU.key(12.6, { x: 760 }); MEX.at(13.0, 'normal');
MOU.key(13.1, { knit: 0, scarf: 0 }); MOU.key(13.3, { knit: 1 }); MOU.key(15.8, { knit: 1, scarf: 1 }, 'lin'); MOU.key(16.0, { knit: 0 });
CAT.key(13.0, { look: 0 }); CAT.key(13.5, { look: .4 });
CEX.at(14.0, 'normal').at(15.85, 'love'); MEX.at(15.85, 'happy');
// 16–17 se la pone a los dos
walk(MOU, 16.1, 16.7, 760, 745, 2.4);
CAT.key(17.0, { look: 0 }); CEX.at(17.0, 'happy');
// 20.5 ¡otro ovillo!
BALL2.key(20.4, { x: -150 }); BALL2.key(21.3, { x: 360 }, 'o');
CAT.key(20.9, { dir: 1 }); CAT.key(21.05, { dir: -1 }); CEX.at(21.05, 'shock').at(21.35, 'determined');
MEX.at(21.3, 'shock');
jump(CAT, 21.6, [620, FLOOR], [380, FLOOR], 160, .5, .12, { air: { paw: 1 } });
MOU.key(21.75, { x: 700, y: FLOOR }); MOU.key(22.05, { y: FLOOR - 120 }, 'oq'); MOU.key(22.35, { y: FLOOR }, 'iq'); MOU.key(22.35, { x: 480 }, 'lin');
MOU.key(21.72, { dir: -1 });
CAM.key(1.5, { s: 2.3, cx: 400, cy: 1330 }); CAM.key(2.3, { s: 1.45, cx: 560, cy: 1215 });
CAM.key(7.8, { s: 1.45, cx: 560, cy: 1215 }); CAM.key(8.5, { s: 1.8, cx: 620, cy: 1260 });
CAM.key(9.4, { s: 1.8, cx: 620, cy: 1260 }); CAM.key(10.1, { s: 1.5, cx: 640, cy: 1220 });
CAM.key(16.8, { s: 1.5, cx: 640, cy: 1220 }); CAM.key(17.4, { s: 1.85, cx: 650, cy: 1260 });
CAM.key(20.2, { s: 1.85, cx: 650, cy: 1260 }); CAM.key(20.9, { s: 1.45, cx: 560, cy: 1215 });
for (const r of [CAT, MOU, BALL, BALL2, CAM]) r.done();

// ---------- estados ----------
function catState(t) {
  const wr = CAT.val('wr', t), ph = CAT.integ('wr', t), br = 1 + Math.sin(t * 4) * .015;
  const spin = CAT.val('spin', t);
  let dir = CAT.val('dir', t), rot = CAT.val('rot', t) + spin;
  if (t > ORB0 + .2 && t < ORB1) dir = Math.cos((t - ORB0) * 9);       // gira como una peonza
  if (t >= ORB1 && t < 12.9) rot = Math.sin((t - ORB1) * 9) * .25 * (1 - seg(t, ORB1, 12.9));
  // girar sobre el centro del cuerpo (no sobre los pies)
  return { x: CAT.val('x', t) - 125 * Math.sin(spin), y: CAT.val('y', t) - 125 * (1 - Math.cos(spin)) - Math.abs(Math.sin(ph * Math.PI * 2)) * 14 * clamp(wr), dir, sx: CAT.val('sx', t) / br, sy: CAT.val('sy', t) * br,
    rot, look: CAT.val('look', t), paw: CAT.val('paw', t), walk: ph, tearsOn: CAT.val('tears', t), expr: CEX.get(t), wrap: CAT.val('wrap', t) };
}
function mouseState(t) {
  const wr = MOU.val('wr', t), ph = MOU.integ('wr', t);
  let x = MOU.val('x', t), y = MOU.val('y', t) - Math.abs(Math.sin(ph * Math.PI * 2)) * 10 * clamp(wr), dir = MOU.val('dir', t), behind = false;
  if (t > ORB0 && t < ORB1) {
    const a = (t - ORB0) / (ORB1 - ORB0) * Math.PI * 2 * 2.5, cx = CAT.val('x', t);
    x = cx + Math.cos(a) * 150; y = FLOOR - Math.abs(Math.sin(a * 3)) * 12; dir = -Math.sin(a) > 0 ? 1 : -1; behind = Math.sin(a) < 0;
  }
  return { x, y, dir, sx: MOU.val('sx', t), sy: MOU.val('sy', t), look: MOU.val('look', t), expr: MEX.get(t), behind };
}

// ---------- dibujo ----------
function yarn(x, y, r, rot, col = '#ff7fae', dark = '#e2558c') {
  if (r < 2) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ellipse(0, 0, r, r, col); ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.clip();
  ctx.lineWidth = Math.max(2, r * .09); ctx.strokeStyle = dark;
  for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.ellipse(i * r * .22, 0, r * .25, r * 1.05, .5, 0, 7); ctx.stroke(); }
  ctx.restore(); ctx.restore();
}
function thread(x0, y0, x1, y1, t, col = '#ff7fae') {
  ctx.lineCap = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = col;
  ctx.beginPath(); ctx.moveTo(x0, y0);
  const n = 8; for (let i = 1; i <= n; i++) { const p = i / n; ctx.lineTo(lerp(x0, x1, p) + Math.sin(p * 9 + t * 3) * 10, lerp(y0, y1, p) + Math.sin(p * Math.PI) * 18); }
  ctx.stroke();
}
function wrapBands(cs, t) {   // vendas de lana alrededor de Mochi
  const w = cs.wrap; if (w < .02) return;
  ctx.save(); ctx.translate(cs.x, cs.y); ctx.rotate(cs.rot); ctx.scale(Math.sign(cs.dir || 1) * Math.max(.15, Math.abs(cs.dir)) * cs.sx, cs.sy);
  const bands = [[-15, 80], [-45, 85], [-80, 82], [-110, 72], [-140, 88], [-205, 86], [-232, 70], [-126, 92]];
  const n = Math.floor(w * bands.length + .999);
  ctx.lineCap = 'round';
  bands.slice(0, n).forEach(([y, hw], i) => {
    const a = i === n - 1 ? (w * bands.length - i) : 1;
    ctx.beginPath(); ctx.moveTo(-hw, y + 10); ctx.quadraticCurveTo(0, y - 8 + (i % 2) * 14, -hw + 2 * hw * a, y - 6);
    ctx.lineWidth = 20; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 13; ctx.strokeStyle = i % 2 ? '#ff7fae' : '#ff9fc0'; ctx.stroke();
  });
  ctx.restore();
}
function needles(ms, t) {
  const k = MOU.val('knit', t); if (k < .02) return;
  const fx = ms.x + 52 * ms.dir, fy = ms.y - 60, c = Math.sin(t * 22) * .25;
  ctx.lineCap = 'round';
  for (const s of [-1, 1]) { ctx.save(); ctx.translate(fx, fy); ctx.rotate(s * (.5 + c * s)); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(0, -38); ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#c9a0ff'; ctx.stroke(); ellipse(0, -40, 7, 7, '#ffd93d', true, 4); ctx.restore(); }
  const L = MOU.val('scarf', t) * 240;
  if (L > 2) { const down = Math.min(L, FLOOR - 22 - (fy + 28)); scarfStrip(fx - 22, fy + 28, fx - 22, fy + 28 + down, 40); if (L > down) scarfStrip(fx - 22, FLOOR - 22, fx - 22 - (L - down) * ms.dir, FLOOR - 22, 40); }
  yarn(ms.x - 60 * ms.dir, FLOOR - 26, 26, t * 2);
}
function scarfStrip(x0, y0, x1, y1, w) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L * w / 2, ny = dx / L * w / 2;
  ctx.beginPath(); ctx.moveTo(x0 + nx, y0 + ny); ctx.lineTo(x1 + nx, y1 + ny); ctx.lineTo(x1 - nx, y1 - ny); ctx.lineTo(x0 - nx, y0 - ny); ctx.closePath();
  ctx.fillStyle = '#ff7fae'; ctx.fill(); ctx.save(); ctx.clip();
  for (let s = 0; s < L; s += 36) { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(x0 + dx * s / L + nx, y0 + dy * s / L + ny); ctx.lineTo(x0 + dx * (s + 14) / L + nx, y0 + dy * (s + 14) / L + ny); ctx.lineTo(x0 + dx * (s + 14) / L - nx, y0 + dy * (s + 14) / L - ny); ctx.lineTo(x0 + dx * s / L - nx, y0 + dy * s / L - ny); ctx.fill(); }
  ctx.restore();
  ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(x0 + nx, y0 + ny); ctx.lineTo(x1 + nx, y1 + ny); ctx.lineTo(x1 - nx, y1 - ny); ctx.lineTo(x0 - nx, y0 - ny); ctx.closePath(); ctx.stroke();
}
function sharedScarf(cs, ms, t) {   // la bufanda que los une
  const cn = { x: cs.x + 18 * cs.dir * cs.sx, y: cs.y - 108 * cs.sy }, mn = { x: ms.x + 20 * ms.dir, y: ms.y - 62 };
  ctx.save(); ctx.translate(cn.x, cn.y); ellipse(0, 0, 70, 22, '#ff7fae'); ctx.restore();
  ctx.save(); ctx.translate(mn.x, mn.y); ellipse(0, 0, 36, 14, '#ff7fae'); ctx.restore();
  scarfStrip(cn.x + 50, cn.y + 4, mn.x - 24, mn.y + 4, 30);
  scarfStrip(cn.x - 30, cn.y + 10, cn.x - 48 + Math.sin(t * 3) * 6, cn.y + 95, 30);
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
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = C.wall; ctx.fillRect(0, 0, W, H);
  const cam = { s: CAM.val('s', t), cx: CAM.val('cx', t), cy: CAM.val('cy', t) };
  const cs = catState(t), ms = mouseState(t);
  withCamera(cam, () => {
    drawRoom(t, 0, { jar: false });
    // ovillo y hilo
    const bx = BALL.val('x', t), br = BALL.val('r', t), by = FLOOR - br;
    if (t < 8.2) { if (t > 2.3) thread(bx, by, cs.x, cs.y - 60, t); yarn(bx, by, br, BALL.val('spin', t)); }
    if (ms.behind) drawMouse(ms, t);
    if (t > ORB0 && t < ORB1) thread(cs.x, cs.y - 120, ms.x, ms.y - 30, t);
    drawCat(cs, t);
    wrapBands(cs, t);
    if (!ms.behind) drawMouse(ms, t);
    if (t > ORB0 && t < 13.0) yarn(ms.x + 50 * ms.dir, ms.y - 30, 34 * seg(t, ORB0, ORB1) + 4, t * 6);
    needles(ms, t);
    if (t > 16.7 && t < 21.7) sharedScarf(cs, ms, t);
    const b2 = BALL2.val('x', t); if (t > 20.4) yarn(b2, FLOOR - 38, 38, b2 / 40, '#7fc8ff', '#4f9fdb');
    // efectos
    if (t > 8.3 && t < 12.9) for (let i = 0; i < 3; i++) { const a = t * 6 + i * 2.1; sparkle(cs.x + Math.cos(a) * 90, cs.y - 250 + Math.sin(a) * 22, .9, 1, '#ffd93d'); }
    if (t > 13.3 && t < 15.9) for (let i = 0; i < 3; i++) { const ph = (t * 1.5 + i / 3) % 1; sparkle(ms.x + 52 * ms.dir + Math.cos(i * 2) * 60, ms.y - 110 - ph * 60, .7 * Math.sin(ph * Math.PI), Math.sin(ph * Math.PI)); }
    if (t > 17.0 && t < 20.6) for (let i = 0; i < 6; i++) { const ph = ((t - 17) * .6 + i / 6) % 1; heart(660 + Math.sin(ph * 5 + i * 2) * 150, FLOOR - 330 - ph * 230, (.8 + (i % 3) * .2) * Math.sin(ph * Math.PI), i % 2 ? C.red : C.pink); }
    worldWord('BOP!', 520, FLOOR - 170, t, 2.82, 3.4, 70, '#ff9fc0'); worldWord('BOP!', 760, FLOOR - 170, t, 4.05, 4.6, 70, '#ff9fc0', .08);
  });
  caption('🧶 👀', t, 0, 1.6, { size: 150 });
  pill('👀', t, 0, 3.0);
  caption('🐾 🧶', t, 2.3, 4.1, { size: 140 });
  caption('🌀 🌀', t, 4.2, 7.9, { size: 140 });
  caption('😵 🧶', t, 8.3, 9.9, { size: 140, highlight: true });
  caption('🔄 🔄', t, 10.2, 12.0, { size: 140 });
  caption('💫', t, 12.1, 13.0, { size: 160 });
  caption('🧶 ➜ 🧣', t, 13.3, 16.0, { size: 130 });
  caption('🧣 ❤️', t, 17.1, 20.4, { size: 150 });
  caption('🧶 !?', t, 20.9, 21.6, { size: 140 });
  caption('NOOO 😱', t, 21.6, 22.4, { size: 130, rot: -.05 });
  endCard(t, 22.4, 7);
}
startEpisode(render);
