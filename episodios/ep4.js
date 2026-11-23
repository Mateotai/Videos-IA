// =====================================================================
//  EPISODIO 4 (2D original) — "Hide & seek 🙈"
//  Mochi se esconde fatal 3 veces (cortina con la cola fuera, planta enana,
//  caja con las orejas asomando). Cambian: Pip se esconde... ¡en la cabeza
//  de Mochi! Mochi lo busca por todas partes. Final: "¡BOO!".
// =====================================================================
const DURATION = 24.5;
const CUR_X = 250, PLANT_X = 820, BOXX = 560;

const CAT = new Rig({ x: CUR_X, y: FLOOR, dir: 1, sx: 1, sy: 1, rot: 0, look: 0, paw: 0, wr: 0, tears: 0 });
const MOU = new Rig({ x: 680, y: FLOOR, dir: -1, sx: 1, sy: 1, look: 0, wr: 0 });
const CEX = new Steps('happy'), MEX = new Steps('happy');
const CAM = new Rig({ s: 2.2, cx: 330, cy: 1300 });
const CURT = new Rig({ pull: 0 }), BOXR = new Rig({ shake: 0 });

// ---------- ronda 1: la cortina (la cola asoma) ----------
MEX.at(2.25, 'normal');
MOU.key(2.3, { look: 0 }); MOU.key(2.5, { look: .4 });
walk(MOU, 2.6, 3.35, 680, 420, 3.4);
MOU.key(3.45, { sx: 1, sy: 1 }); MOU.key(3.6, { sx: 1.2, sy: .85 }, 'o'); MOU.key(3.75, { sx: 1, sy: 1 }, 'back');
CURT.key(3.6, { pull: 0 }); CURT.key(3.85, { pull: 1 }, 'back');
CEX.at(3.62, 'shock').at(4.1, 'sad'); MEX.at(3.7, 'happy');
CAT.key(3.62, { y: FLOOR }); CAT.key(3.74, { y: FLOOR - 40 }, 'oq'); CAT.key(3.88, { y: FLOOR }, 'iq');
// ---------- ronda 2: la planta enana ----------
MOU.key(4.3, { dir: -1 }); MOU.key(4.45, { dir: 1 });   // Pip se da la vuelta para contar
MEX.at(4.45, 'happy');
CEX.at(4.5, 'determined');
walk(CAT, 4.6, 5.55, CUR_X, PLANT_X - 40, 4.2);
CAT.key(5.6, { sy: 1, sx: 1 }); CAT.key(5.8, { sy: .82, sx: 1.08 });
CEX.at(5.7, 'happy');
MOU.key(6.15, { dir: 1 }); MOU.key(6.3, { dir: -1 }); MEX.at(6.3, 'normal').at(6.55, 'happy');
MOU.key(6.55, { y: FLOOR }); MOU.key(6.7, { y: FLOOR - 30 }, 'oq'); MOU.key(6.85, { y: FLOOR }, 'iq'); MOU.key(7.0, { y: FLOOR - 30 }, 'oq'); MOU.key(7.15, { y: FLOOR }, 'iq');
CEX.at(6.45, 'shock').at(6.9, 'sad');
CAT.key(7.4, { sy: .82, sx: 1.08 }); CAT.key(7.6, { sy: 1, sx: 1 });
// ---------- ronda 3: la caja ----------
MOU.key(7.7, { dir: -1 }); MOU.key(7.85, { dir: 1 }); MEX.at(7.85, 'happy');
CAT.key(7.75, { dir: 1 }); CAT.key(7.85, { dir: -1 }); CEX.at(7.9, 'determined');
jump(CAT, 8.1, [PLANT_X - 40, FLOOR], [BOXX, FLOOR - 22], 300, .55, .14);
CEX.at(8.9, 'happy');
const EARS = FLOOR - 22;
// Pip busca: cortina, planta... y pasa junto a la caja
MOU.key(9.35, { dir: 1 }); MOU.key(9.5, { dir: -1 }); MEX.at(9.5, 'normal');
walk(MOU, 9.6, 10.1, 420, 330, 3); MOU.key(10.15, { look: 0 }); MOU.key(10.35, { look: .5 }); MOU.key(10.55, { look: 0 });
MOU.key(10.6, { dir: -1 }); MOU.key(10.72, { dir: 1 });
walk(MOU, 10.75, 11.55, 330, 690, 3.6);
MOU.key(11.6, { dir: 1 }); MOU.key(11.75, { dir: -1 });
BOXR.key(11.7, { shake: 0 }); BOXR.key(11.8, { shake: 1 }); BOXR.key(12.15, { shake: 1 }); BOXR.key(12.25, { shake: 0 });
MEX.at(11.85, 'shock').at(12.35, 'happy');
CAT.key(12.25, { y: EARS }); CAT.key(12.42, { y: FLOOR - 110 }, 'oq'); CAT.key(12.6, { y: EARS - 60 }, 'iq'); CEX.at(12.25, 'happy');
// ---------- cambio: cuenta Mochi, Pip se sube a su cabeza ----------
jump(CAT, 12.75, [BOXX, EARS - 60], [640, FLOOR], 120, .45, .1);
CAT.key(13.4, { dir: -1 }); CAT.key(13.55, { dir: 1 }); CEX.at(13.5, 'happy');
MOU.key(13.0, { dir: -1 }); walk(MOU, 13.05, 13.5, 690, 520, 3.4); MOU.key(13.5, { dir: 1 }); MEX.at(13.3, 'happy');
const headPos = (t) => { const c = catState(t); return { x: c.x + 18 * c.dir * c.sx, y: c.y - 238 * c.sy }; };
// Mochi busca con Pip encima
CEX.at(14.7, 'normal');
CAT.key(14.6, { dir: 1 }); CAT.key(14.75, { dir: -1 });
walk(CAT, 14.8, 15.9, 640, 360, 3);
CAT.key(15.95, { rot: 0, paw: 0 }); CAT.key(16.2, { rot: -.12, paw: .6 }); CAT.key(16.6, { rot: 0, paw: 0 });
CEX.at(16.55, 'sad');
CAT.key(16.7, { dir: -1 }); CAT.key(16.85, { dir: 1 }); CEX.at(16.85, 'normal');
walk(CAT, 16.9, 18.0, 360, 690, 3);
CAT.key(18.05, { rot: 0, paw: 0 }); CAT.key(18.3, { rot: .14, paw: .6 }); CAT.key(18.7, { rot: 0, paw: 0 });
CEX.at(18.65, 'sad');
CAT.key(18.85, { dir: 1 }); CAT.key(19.0, { dir: -1 }); CEX.at(19.0, 'normal');
walk(CAT, 19.05, 19.45, 690, 620, 2.6);
CAT.key(19.5, { rot: 0, look: 0 }); CAT.key(19.75, { rot: -.22 }); CAT.key(20.1, { rot: 0 });
CEX.at(20.1, 'sad'); CAT.key(20.2, { sy: 1, sx: 1 }); CAT.key(20.45, { sy: .93, sx: 1.04, tears: .6 });
// ¡BOO!
const BOO = 21.0;
CEX.at(BOO + .02, 'shock');
CAT.key(BOO, { y: FLOOR, sy: .93, tears: .6 }); CAT.key(BOO + .05, { tears: 0, sy: 1.15 }); CAT.key(BOO + .25, { y: FLOOR - 170 }, 'oq'); CAT.key(BOO + .5, { y: FLOOR }, 'iq');
CAT.key(BOO + .55, { sy: .8, sx: 1.15 }, 'o'); CAT.key(BOO + .75, { sy: 1, sx: 1 }, 'back');
CEX.at(BOO + .9, 'happy'); MEX.at(BOO + .02, 'happy');
CAM.key(1.25, { s: 2.2, cx: 330, cy: 1300 }); CAM.key(2.1, { s: 1.3, cx: 560, cy: 1190 });
CAM.key(20.0, { s: 1.3, cx: 560, cy: 1190 }); CAM.key(20.6, { s: 1.75, cx: 600, cy: 1230 });
for (const r of [CAT, MOU, CAM, CURT, BOXR]) r.done();

// ---------- estados ----------
function catState(t) {
  const wr = CAT.val('wr', t), ph = CAT.integ('wr', t), br = 1 + Math.sin(t * 4) * .015;
  return { x: CAT.val('x', t), y: CAT.val('y', t) - Math.abs(Math.sin(ph * Math.PI * 2)) * 14 * clamp(wr), dir: CAT.val('dir', t), sx: CAT.val('sx', t) / br, sy: CAT.val('sy', t) * br,
    rot: CAT.val('rot', t), look: CAT.val('look', t), paw: CAT.val('paw', t), walk: ph, tearsOn: CAT.val('tears', t), expr: CEX.get(t) };
}
const HEAD_ON = 14.2, HEAD_OFF = BOO - .05;
function mouseState(t) {
  const wr = MOU.val('wr', t), ph = MOU.integ('wr', t);
  let x = MOU.val('x', t), y = MOU.val('y', t) - Math.abs(Math.sin(ph * Math.PI * 2)) * 10 * clamp(wr), dir = MOU.val('dir', t), sx = MOU.val('sx', t), sy = MOU.val('sy', t);
  if (t >= 13.55 && t < HEAD_ON) { const h = headPos(HEAD_ON), p = seg(t, 13.55, HEAD_ON); x = lerp(520, h.x, p); y = lerp(FLOOR, h.y, p) - 4 * 150 * p * (1 - p); }
  if (t >= HEAD_ON && t < HEAD_OFF) { const h = headPos(t), c = catState(t); x = h.x; y = h.y + Math.sin(t * 9) * 2; dir = c.dir; }
  if (t >= HEAD_OFF) {
    const h = headPos(HEAD_OFF), c = catState(HEAD_OFF), p = seg(t, HEAD_OFF, HEAD_OFF + .25);
    const tx = c.x + 120 * c.dir, ty = FLOOR - 60;
    x = lerp(h.x, tx, p); y = t < HEAD_OFF + .25 ? lerp(h.y, ty, p) - 60 * Math.sin(Math.PI * p) : ty; dir = -c.dir;
    if (t > BOO + .5) { const q = seg(t, BOO + .5, BOO + .75); y = lerp(ty, FLOOR, E.iq(q)); }
    if (t > 21.9) { const b = (t - 21.9) % .4; y = FLOOR - 40 * Math.sin(Math.PI * b / .4) * (t < 23.5 ? 1 : 0); }
  }
  return { x, y, dir, sx, sy, look: MOU.val('look', t), expr: MEX.get(t) };
}

// ---------- atrezo ----------
function drawCurtain(t, hide) {
  const pull = CURT.val('pull', t), x0 = 120, w = lerp(270, 70, pull), top = 470, bot = FLOOR - 4;
  ctx.fillStyle = '#b07a52'; ctx.fillRect(80, top - 14, 360, 14);
  ellipse(84, top - 7, 12, 12, '#d9a06a'); ellipse(436, top - 7, 12, 12, '#d9a06a');
  const sway = Math.sin(t * 2.2) * 5, bulge = hide ? 28 + Math.sin(t * 7) * 4 : 0;
  ctx.beginPath(); ctx.moveTo(x0, top);
  ctx.lineTo(x0 + w, top);
  ctx.quadraticCurveTo(x0 + w + bulge * .6 + sway, (top + bot) / 2, x0 + w + sway * 2, bot);
  for (let i = 0, n = Math.max(3, Math.round(w / 45)); i < n; i++) { const xa = x0 + w + sway * 2 - (i + .5) * w / n; ctx.quadraticCurveTo(xa, bot + 14, x0 + w + sway * 2 - (i + 1) * w / n, bot); }
  ctx.lineTo(x0, top); ctx.closePath();
  ctx.fillStyle = '#ff9fb8'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(200,80,120,.35)'; ctx.lineWidth = 10;
  for (let i = 1; i < 5; i++) { const xx = x0 + i * w / 5; ctx.beginPath(); ctx.moveTo(xx, top + 10); ctx.quadraticCurveTo(xx + bulge * .4, (top + bot) / 2, xx + sway, bot); ctx.stroke(); }
  if (hide) { ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.ellipse(x0 + w - 70, FLOOR - 160, 90, 130, 0, 0, 7); ctx.fill(); }
  ctx.restore();
  if (hide) {   // la cola que delata a Mochi
    const wag = Math.sin(t * 6) * 22;
    ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0 + w - 4, FLOOR - 50); ctx.quadraticCurveTo(x0 + w + 60, FLOOR - 40 + wag * .3, x0 + w + 70 + wag, FLOOR - 140);
    ctx.lineWidth = 38; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 22; ctx.strokeStyle = C.cat; ctx.stroke();
  }
}
function drawPlant(t) {
  const x = PLANT_X, sw = Math.sin(t * 1.8) * .04;
  for (const [a, l, w] of [[-1.0, 150, 34], [-.45, 190, 38], [0, 210, 40], [.45, 185, 38], [1.0, 145, 34]]) {
    ctx.save(); ctx.translate(x, FLOOR - 92); ctx.rotate(a * .55 + sw);
    ellipse(0, -l / 2, w, l / 2, '#5cc45a'); ctx.lineWidth = 4; ctx.strokeStyle = '#3f9a3e'; ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, -l + 20); ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath(); ctx.moveTo(x - 62, FLOOR - 100); ctx.lineTo(x + 62, FLOOR - 100); ctx.lineTo(x + 46, FLOOR); ctx.lineTo(x - 46, FLOOR); ctx.closePath();
  ctx.fillStyle = '#e07b4f'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  roundRect(x - 70, FLOOR - 112, 140, 24, 8, '#f08f60');
}
function leafHat(cs) {   // "disfraz" de hoja en la cabeza
  const h = { x: cs.x + 18 * cs.dir, y: cs.y - 250 * cs.sy };
  ctx.save(); ctx.translate(h.x, h.y); ctx.rotate(-.3);
  ellipse(0, -30, 18, 36, '#5cc45a'); ctx.lineWidth = 3; ctx.strokeStyle = '#3f9a3e'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -58); ctx.stroke();
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
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = C.wall; ctx.fillRect(0, 0, W, H);
  const sh = t > BOO && t < BOO + .3 ? 10 * (1 - seg(t, BOO, BOO + .3)) : 0;
  const cam = { s: CAM.val('s', t), cx: CAM.val('cx', t) + Math.sin(t * 80) * sh, cy: CAM.val('cy', t) };
  const cs = catState(t), ms = mouseState(t);
  const hideCurtain = t < 3.6, hidePlant = t >= 5.6 && t < 7.6, inBox = t >= 8.6 && t < 12.95;
  withCamera(cam, () => {
    drawRoom(t, 0, { jar: false });
    if (!hideCurtain) drawCurtain(t, false);
    if (!hidePlant) drawPlant(t);
    const bsh = BOXR.val('shake', t);
    const drawB = () => { ctx.save(); ctx.translate(BOXX, FLOOR); ctx.rotate(bsh * Math.sin(t * 40) * .03); ctx.translate(-BOXX, -FLOOR); drawBox(BOXX); ctx.restore(); };
    if (!inBox) drawB();
    if (!hideCurtain) drawCat(cs, t);
    if (hideCurtain) drawCurtain(t, true);
    if (hidePlant) { drawPlant(t); leafHat(cs); }
    if (inBox) drawB();
    drawMouse(ms, t);
    // efectos
    if (t > 3.62 && t < 4.4) for (let i = 0; i < 3; i++) { const p = seg(t, 3.62, 4.4); sparkle(cs.x + Math.cos(i * 2.1) * (80 + p * 60), cs.y - 200 + Math.sin(i * 2.1) * 60, .9 * (1 - p), 1 - p, '#ffd93d'); }
    if (t > 21.7) for (let i = 0; i < 5; i++) { const ph = ((t - 21.7) * .7 + i / 5) % 1; heart(560 + Math.sin(ph * 5 + i * 2) * 170, FLOOR - 340 - ph * 220, (.8 + (i % 3) * .2) * Math.sin(ph * Math.PI)); }
    worldWord('BOO!', cs.x + 120 * cs.dir, FLOOR - 230, t, BOO, BOO + .8, 110, '#a9a2c9', .1);
    if (t > 14.3 && t < 20.9) worldWord('🤫', headPos(t).x + 70 * cs.dir, headPos(t).y - 110, t, 14.3, 15.6, 60, '#fff', 0);
  });
  if (t > BOO && t < BOO + .5) focusLines(t, 1 - seg(t, BOO + .2, BOO + .5));
  caption('🙈 ❓', t, 0, 1.4, { size: 150 });
  pill('👀', t, 0, 3.2);
  caption('🐭 3 · 2 · 1', t, 1.45, 2.5, { size: 120 });
  caption('FOUND! 😹', t, 3.65, 4.5, { size: 120, highlight: true });
  caption('#2  🌱', t, 4.6, 6.1, { size: 130 });
  caption('😂 😂', t, 6.4, 7.6, { size: 140 });
  caption('#3  📦', t, 7.8, 9.5, { size: 130 });
  caption('👀 . . .', t, 9.6, 11.6, { size: 120 });
  caption('🤭', t, 11.75, 12.25, { size: 150 });
  caption('FOUND! 😹', t, 12.3, 13.0, { size: 120, highlight: true });
  caption('🔄  🐱 3 · 2 · 1', t, 13.1, 14.5, { size: 105 });
  caption('❓', t, 14.8, 16.0, { size: 140 });
  caption('❌', t, 16.25, 16.85, { size: 150 }); caption('❌', t, 18.35, 18.95, { size: 150 }); caption('❌', t, 19.8, 20.3, { size: 150 });
  caption('😿 ???', t, 20.35, 20.98, { size: 130 });
  caption('😂 ❤️', t, 21.9, 22.95, { size: 140 });
  endCard(t, 23.0, 5);
}
startEpisode(render);
