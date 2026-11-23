// =====================================================================
//  EPISODIO 9 (2D original) — "Pancake 🥞"
//  Pip se prepara una tortita diminuta y perfecta. Mochi quiere LA MÁS
//  GRANDE: sartén enorme, tortita más grande que él, voltereta al cielo...
//  y la tortita le cae encima como una manta. Persiguiendo la mantequilla
//  se enrolla en un burrito; la mantequilla sale disparada y Pip acaba con
//  la cara en su desayuno. Remate: la tortita se come a Mochi primero.
// =====================================================================
const DURATION = 42.5;
const LIE = Math.PI / 2, FX = 405;                       // Mochi tumbado dentro del burrito
const CAT = new Rig({ x: -220, y: FLOOR, dir: 1, sx: 1, sy: 1, rot: 0, look: 0, paw: 0, wr: 0 });
const MOU = new Rig({ x: 1250, y: FLOOR, dir: -1, sx: 1, sy: 1, look: 0, rot: 0, wr: 0 });
const PAN = new Rig({ oy: 0, rot: 0 });
const PC = new Rig({ x: 500, y: FLOOR - 75, r: 0, spin: 0 });
const DR = new Rig({ x: 250, sy: 1, hop: 0 });
const LG = new Rig({ x: 300, sx: 1, sy: 1 });
const CEX = new Steps('normal'), MEX = new Steps('happy');
const CAM = new Rig({ s: 2.0, cx: 800, cy: 1340 });
const PAN_X = 500, PAN_Y = FLOOR - 14, HOOK = { x: 215, y: FLOOR - 560 };
const PLATE = { x: 790, y: FLOOR - 6 };

// ---------- 0–5: Pip y su tortita perfecta ----------
walk(MOU, 0, 1.6, 1250, 880, 3.6);
MOU.key(1.75, { sy: 1, rot: 0 }); MOU.key(1.95, { sy: .86, rot: -.15 }); MOU.key(2.25, { sy: 1, rot: 0 }, 'back');
MOU.key(2.5, { rot: 0 }); MOU.key(2.7, { rot: -.18 }); MOU.key(3.2, { rot: -.18 }); MOU.key(3.4, { rot: 0 });
MEX.at(0, 'normal').at(3.3, 'happy');
MOU.key(3.4, { sy: 1 }); MOU.key(3.7, { sy: 1.13, sx: .95 }, 'o'); MOU.key(4.7, { sy: 1.13, sx: .95 }); MOU.key(5.0, { sy: 1, sx: 1 });
// ---------- 5–10: Mochi lo ve, sueña con una montaña y coge la sartén enorme ----------
walk(CAT, 5.0, 6.3, -220, 330, 3.4);
MEX.at(5.3, 'normal').at(6.5, 'shock').at(7.1, 'normal');
CEX.at(6.35, 'shock').at(6.75, 'love').at(8.45, 'determined');
CAT.key(6.35, { sy: 1 }); CAT.key(6.45, { sy: 1.12 }, 'o'); CAT.key(6.65, { sy: 1 });
CAT.key(8.5, { dir: 1 }); CAT.key(8.65, { dir: -1 });
walk(CAT, 8.65, 9.0, 330, 260, 3.2);
jump(CAT, 9.0, [260, FLOOR], [120, FLOOR], 300, .55, .12, { air: { paw: 1 } });
CAT.key(9.7, { paw: 0 }); CAT.key(9.95, { dir: -1 }); CAT.key(10.1, { dir: 1 });
const PAN_FLY0 = 9.3, PAN_FLY1 = 9.85;
MEX.at(9.85, 'shock');
MOU.key(9.85, { y: FLOOR }); MOU.key(10.0, { y: FLOOR - 45 }, 'oq'); MOU.key(10.15, { y: FLOOR }, 'iq');
MOU.key(10.2, { sy: 1, x: 880 }); MOU.key(10.45, { sy: .7, x: 868 }); MOU.key(15.9, { sy: .7, x: 868 }); MOU.key(16.15, { sy: 1 }, 'back');
// ---------- 10–16: la tortita gigante ----------
CAT.key(10.2, { paw: 0 }); CAT.key(10.45, { paw: 1 }); CAT.key(12.6, { paw: 1 }); CAT.key(12.85, { paw: .3 });
PC.key(10.5, { r: 0 }); PC.key(12.6, { r: 232 }, 'o');
CEX.at(12.7, 'happy');
CAT.key(13.6, { paw: .3 }); CAT.key(13.8, { paw: 1 }); CAT.key(14.25, { paw: 1 }); CAT.key(14.45, { paw: .3 });
const BUT_DROP0 = 13.95, BUT_DROP1 = 14.3;
CEX.at(15.2, 'determined');
CAT.key(15.2, { sy: 1, sx: 1 }); CAT.key(15.8, { sy: .82, sx: 1.12 }); CAT.key(16.0, { sy: 1.15, sx: .9 }, 'o'); CAT.key(16.3, { sy: 1, sx: 1 });
// ---------- 16–22: ¡al cielo! ...y cae como una manta ----------
PAN.key(15.95, { oy: 0, rot: 0 }); PAN.key(16.05, { oy: -60, rot: -.3 }, 'o'); PAN.key(16.4, { oy: 0, rot: 0 }, 'back');
PC.key(16.02, { y: FLOOR - 75, x: 500, spin: 0 }); PC.key(17.4, { y: FLOOR - 1750 }, 'oq'); PC.key(18.3, { y: FLOOR - 1750 });
PC.key(20.2, { y: FLOOR - 330 }, 'iq'); PC.key(20.2, { x: 250, spin: Math.PI * 4 }, 'lin');
CAT.key(16.4, { paw: .3 }); CAT.key(16.6, { paw: 0 });
CEX.at(16.5, 'happy').at(17.4, 'determined').at(18.6, 'shock');
walk(CAT, 16.7, 17.3, 120, 250, 3);
CAT.key(17.2, { look: 0 }); CAT.key(17.5, { look: 1.4 });
for (const t of [18.8, 19.3]) { CAT.key(t, { sy: 1 }); CAT.key(t + .12, { sy: 1.08 }, 'o'); CAT.key(t + .3, { sy: 1 }); }
MOU.key(16.2, { look: 0 }); MOU.key(16.5, { look: 1.6 }); MOU.key(19.9, { look: 1.6 }); MOU.key(20.3, { look: 0 });
MEX.at(16.2, 'normal').at(20.2, 'shock').at(21.4, 'normal');
const DRAPE0 = 20.2, LOG0 = 24.2, HEAD0 = 26.0;
DR.key(20.2, { sy: .55 }); DR.key(20.36, { sy: 1.14 }, 'o'); DR.key(20.55, { sy: .94 }); DR.key(20.78, { sy: 1 });
// ---------- 22–29: la mantequilla resbala... ¡burrito! ----------
const BUT_SLIDE0 = 22.2, BUT_SLIDE1 = 23.2, BUT_STOP = 23.8, BUT_X = 540;
DR.key(23.85, { x: 250, hop: 0 }); DR.key(24.0, { hop: 60 }, 'oq'); DR.key(24.2, { x: 290, hop: 0 }, 'iq');
LG.key(24.2, { x: 300 }); LG.key(25.9, { x: FX + 25 }, 'o');
CAT.key(25.99, { x: 250, y: FLOOR, rot: 0, dir: 1, look: 0 }, 'hold');
CAT.key(26.0, { x: FX, y: FLOOR - 82, rot: LIE, dir: -1 }, 'hold');
CEX.at(26.0, 'shock').at(26.6, 'dizzy').at(28.4, 'normal');
MEX.at(26.05, 'happy');
for (const t of [26.3, 26.75]) { MOU.key(t, { y: FLOOR }); MOU.key(t + .14, { y: FLOOR - 40 }, 'oq'); MOU.key(t + .3, { y: FLOOR }, 'iq'); }
MEX.at(28.0, 'normal');
MOU.key(28.3, { rot: 0 }); MOU.key(28.65, { rot: -.35 }); MEX.at(28.65, 'happy');
// ---------- 29–35: la mantequilla sale disparada ----------
LG.key(29.0, { sx: 1, sy: 1 }); LG.key(29.25, { sx: 1.13, sy: .8 }); LG.key(29.4, { sx: .95, sy: 1.08 }, 'o'); LG.key(29.7, { sx: 1, sy: 1 });
CEX.at(29.15, 'shock').at(29.7, 'normal').at(30.4, 'shock').at(31.4, 'happy');
const SHOT0 = 29.3, SHOT1 = 30.35, BOUNCE1 = 30.8;
MEX.at(30.35, 'shock'); MOU.key(30.35, { rot: -.35 }); MOU.key(30.52, { rot: -.82 }, 'iq'); MEX.at(30.6, 'normal');
MOU.key(34.85, { rot: -.82 }); MOU.key(35.25, { rot: 0 }, 'back');
// ---------- 35–40: bigote de mantequilla y burrito que se lame ----------
MEX.at(35.25, 'shock').at(35.9, 'normal').at(36.5, 'happy').at(37.0, 'chew').at(37.9, 'happy');
CEX.at(35.3, 'happy');
// ---------- cámara ----------
CAM.key(0, { s: 2.0, cx: 800, cy: 1340 }); CAM.key(4.6, { s: 2.0, cx: 790, cy: 1340 });
CAM.key(5.6, { s: 1.15, cx: 520, cy: 1160 });
CAM.key(6.6, { s: 1.3, cx: 470, cy: 1130 }); CAM.key(8.4, { s: 1.3, cx: 470, cy: 1130 });
CAM.key(9.0, { s: 1.15, cx: 520, cy: 1160 });
CAM.key(12.4, { s: 1.15, cx: 520, cy: 1160 }); CAM.key(13.2, { s: 1.28, cx: 480, cy: 1200 });
CAM.key(15.6, { s: 1.28, cx: 480, cy: 1200 }); CAM.key(16.0, { s: 1.15, cx: 520, cy: 1160 });
CAM.key(16.2, { cy: 1160 }); CAM.key(17.1, { cy: 860 }, 'o'); CAM.key(18.0, { cy: 860 }); CAM.key(18.8, { cy: 1160 });
CAM.key(18.8, { s: 1.15, cx: 520 }); CAM.key(19.6, { s: 1.25, cx: 440 });
CAM.key(21.6, { s: 1.25, cx: 440, cy: 1160 }); CAM.key(22.3, { s: 1.3, cx: 470, cy: 1200 });
CAM.key(29.0, { s: 1.3, cx: 530, cy: 1200 }); CAM.key(29.6, { s: 1.4, cx: 610, cy: 1240 });
CAM.key(30.3, { s: 1.75, cx: 720, cy: 1340 }); CAM.key(34.6, { s: 1.75, cx: 720, cy: 1340 });
CAM.key(35.4, { s: 1.6, cx: 600, cy: 1336 });
for (const r of [CAT, MOU, PAN, PC, DR, LG, CAM]) r.done();

// ---------- estados ----------
function catState(t) {
  const wr = CAT.val('wr', t), ph = CAT.integ('wr', t), br = 1 + Math.sin(t * 4) * .015;
  return { x: CAT.val('x', t), y: CAT.val('y', t) - Math.abs(Math.sin(ph * Math.PI * 2)) * 14 * clamp(wr), dir: CAT.val('dir', t), sx: CAT.val('sx', t) / br, sy: CAT.val('sy', t) * br,
    rot: CAT.val('rot', t), look: CAT.val('look', t), paw: CAT.val('paw', t), walk: ph, expr: CEX.get(t) };
}
function mouseState(t) {
  const wr = MOU.val('wr', t), ph = MOU.integ('wr', t);
  let rot = MOU.val('rot', t);
  if (t > 30.6 && t < 34.85) rot += Math.sin(t * 17) * .03;   // pataleo con la cara en la tortita
  return { x: MOU.val('x', t), y: MOU.val('y', t) - Math.abs(Math.sin(ph * Math.PI * 2)) * 10 * clamp(wr), dir: MOU.val('dir', t), sx: MOU.val('sx', t), sy: MOU.val('sy', t),
    look: MOU.val('look', t), expr: MEX.get(t), rot };
}
const shake = (t, t0, amp, d = .45) => t > t0 && t < t0 + d ? Math.sin((t - t0) * 70) * amp * (1 - (t - t0) / d) : 0;

// ---------- utilería ----------
const GOLD = '#f6bf63', GOLD_SIDE = '#d98a3a', TOAST = '#c9792f', BUTTER = '#ffe066';
function pancake(x, y, rx, ry, thick) {           // tortita vista de lado (y = cara de arriba)
  ellipse(x, y + thick, rx, ry, GOLD_SIDE);
  ctx.fillStyle = GOLD_SIDE; ctx.fillRect(x - rx, y, rx * 2, thick);
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(x - rx, y); ctx.lineTo(x - rx, y + thick); ctx.moveTo(x + rx, y); ctx.lineTo(x + rx, y + thick); ctx.stroke();
  ellipse(x, y, rx, ry, GOLD);
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, rx * .97, ry * .95, 0, 0, 7); ctx.clip();
  ctx.globalAlpha = .35; ellipse(x, y, rx * .62, ry * .62, TOAST, false); ctx.restore();
}
function butterPat(x, y, w, h, rot = 0, lw = 6) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = '#e8b923'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2 + h * .25, w, h * .75, h * .2); ctx.fill();
  roundRect(-w / 2, -h / 2, w, h * .75, h * .2, BUTTER, true, lw);
  ctx.globalAlpha = .8; ctx.lineWidth = Math.max(2, h * .12); ctx.strokeStyle = '#fff8c8'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-w * .3, -h * .32); ctx.lineTo(w * .15, -h * .32); ctx.stroke();
  ctx.restore();
}
function pipPlate(x, y, t, nudge = 0) {           // plato diminuto con la tortita perfecta
  ellipse(x, y, 64, 14, '#ffffff', true, 6); ellipse(x, y - 2, 46, 9, '#cfe9ff', false);
  pancake(x, y - 20, 42, 10, 9); pancake(x, y - 30, 40, 10, 9);
  if (t < 30.5 || t > 35) butterPat(x + nudge, y - 34, 18, 12, 0, 4);
}
function bigButter(x, y, rot = 0) { butterPat(x, y, 64, 40, rot); }
function pan(x, y, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-182, -48); ctx.lineTo(-292, -104); ctx.lineWidth = 34; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 20; ctx.strokeStyle = '#7a5236'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-200, -55); ctx.quadraticCurveTo(-196, 0, -150, 0); ctx.lineTo(150, 0); ctx.quadraticCurveTo(196, 0, 200, -55); ctx.closePath();
  ctx.fillStyle = '#4a4458'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ellipse(0, -55, 200, 30, '#6e6780'); ellipse(0, -53, 182, 22, '#2f2a3a', false);
  ctx.save(); ctx.globalAlpha = .5; ctx.lineWidth = 6; ctx.strokeStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(-150, -22); ctx.quadraticCurveTo(-60, -10, 40, -14); ctx.stroke(); ctx.restore();
  ctx.restore();
}
function hangingPan(x, y, sw) {                  // sartén colgada vista de frente
  ctx.save(); ctx.translate(x, y - 220); ctx.rotate(sw);
  ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 100);
  ctx.lineWidth = 34; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 20; ctx.strokeStyle = '#7a5236'; ctx.stroke();
  ellipse(0, 6, 9, 9, '#dff3ea', true, 4);
  ellipse(0, 250, 160, 160, '#4a4458', true, 9); ellipse(0, 250, 128, 128, '#2f2a3a', false);
  ctx.save(); ctx.globalAlpha = .45; ctx.lineWidth = 10; ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 250, 105, 3.6, 4.6); ctx.stroke(); ctx.restore();
  ctx.restore();
}
function burner(t, on) {
  ellipse(PAN_X, FLOOR - 10, 150, 22, '#3b3646'); ellipse(PAN_X, FLOOR - 12, 110, 14, '#2a2633', false);
  if (on <= 0) return;
  for (let i = 0; i < 9; i++) {
    const fx = PAN_X - 120 + i * 30, h = (22 + Math.sin(t * 23 + i * 1.7) * 7) * on;
    ctx.beginPath(); ctx.moveTo(fx - 9, FLOOR - 16); ctx.quadraticCurveTo(fx, FLOOR - 16 - h * 1.6, fx + 9, FLOOR - 16); ctx.closePath();
    ctx.fillStyle = i % 2 ? '#5fb8ff' : '#8fd3ff'; ctx.fill();
  }
}
function bowl(x, y, tilt, s) {
  if (s <= .01) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(tilt);
  ctx.beginPath(); ctx.moveTo(-95, -30); ctx.quadraticCurveTo(-90, 70, 0, 70); ctx.quadraticCurveTo(90, 70, 95, -30); ctx.closePath();
  ctx.fillStyle = '#ff8fa3'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ellipse(0, -30, 95, 22, '#ffd1dc'); ellipse(0, -28, 80, 15, '#fff1c9', false);
  ctx.fillStyle = C.white; for (const [hx, hy] of [[-40, 20], [10, 35], [50, 12]]) { ctx.beginPath(); ctx.arc(hx, hy, 7, 0, 7); ctx.fill(); }
  ctx.restore();
}
function batterStream(x0, y0, x1, y1, t, a) {
  if (a <= 0) return;
  ctx.save(); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + 70, y0 + 20, x1 + Math.sin(t * 9) * 4, y1);
  ctx.lineWidth = 34 * a; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 20 * a; ctx.strokeStyle = '#fff1c9'; ctx.stroke();
  ctx.restore();
}
function steam(x, y, t, a, n = 4, w = 180) {
  if (a <= 0) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = '#ffffff';
  for (let i = 0; i < n; i++) {
    const ph = (t * .7 + i / n) % 1, xx = x - w / 2 + (i + .5) * w / n;
    ctx.globalAlpha = a * Math.sin(ph * Math.PI) * .75;
    ctx.beginPath(); ctx.moveTo(xx, y - ph * 160);
    ctx.bezierCurveTo(xx + 20, y - 40 - ph * 160, xx - 20, y - 80 - ph * 160, xx + Math.sin(t * 3 + i) * 10, y - 120 - ph * 160); ctx.stroke();
  }
  ctx.restore();
}
function flyingDisc(x, y, r, spin, butter) {
  const ry = Math.max(14, r * Math.abs(Math.sin(spin + .25)));
  ellipse(x, y + 10, r, ry, GOLD_SIDE); ellipse(x, y, r, ry, GOLD);
  ctx.save(); ctx.globalAlpha = .35; ellipse(x, y, r * .6, ry * .6, TOAST, false); ctx.restore();
  if (butter && Math.cos(spin) > 0) bigButter(x, y - 14 * Math.cos(spin), 0);
}
function thought(x, y, t, t0, t1) {               // bocadillo: la montaña de tortitas soñada
  if (t < t0 || t > t1) return;
  const p = easeOutBack(seg(t, t0, t0 + .35)) * (1 - seg(t, t1 - .2, t1));
  ctx.save(); ctx.translate(x, y); ctx.scale(p, p);
  ellipse(-170, 260, 16, 16, C.white, true, 6); ellipse(-130, 200, 26, 26, C.white, true, 7);
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; ctx.arc(Math.cos(a) * 180, Math.sin(a) * 120, 62, a - 1.2, a + 1.2); }
  ctx.closePath(); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = C.white; ctx.beginPath(); ctx.ellipse(0, 0, 200, 135, 0, 0, 7); ctx.fill();
  // montaña de tortitas que crece
  const n = Math.floor(clamp((t - t0 - .2) / 1.1) * 10);
  for (let i = 0; i < n; i++) { const w = 120 - i * 5 + Math.sin(i * 2.3) * 6; pancake(Math.sin(i * 1.7) * 6, 95 - i * 20, w, 14, 9); }
  if (n >= 10) {
    butterPat(Math.sin(9 * 1.7) * 6, 95 - 9 * 20 - 10, 40, 24);
    ctx.fillStyle = '#b5651d'; ctx.beginPath(); ctx.ellipse(0, 95 - 9 * 20 + 2, 70, 12, 0, 0, 7); ctx.fill();
    for (const dx of [-60, -10, 45]) { ctx.beginPath(); ctx.roundRect(dx, 95 - 9 * 20, 14, 40 + (dx % 3) * 8 + Math.sin(t * 3 + dx) * 6, 7); ctx.fill(); }
    for (let i = 0; i < 3; i++) sparkle(-150 + i * 150, -90 + (i % 2) * 40, .7 + Math.sin(t * 8 + i) * .15, 1, '#ffd93d');
  }
  ctx.restore();
}
function drapeShape(x, sy, wob) {               // la tortita caída sobre Mochi como una manta
  ctx.beginPath();
  ctx.moveTo(x - 262, FLOOR);
  for (let i = 0; i <= 8; i++) ctx.quadraticCurveTo(x - 262 + (i - .5) * 65.5, FLOOR - 16, x - 262 + i * 65.5, FLOOR);
  ctx.bezierCurveTo(x + 250, FLOOR - 120 * sy, x + 150 + wob, FLOOR - 230 * sy, x + 95 + wob, FLOOR - 300 * sy);
  ctx.lineTo(x + 70 + wob, FLOOR - 345 * sy); ctx.lineTo(x + 35 + wob, FLOOR - 312 * sy);       // oreja derecha
  ctx.quadraticCurveTo(x + wob, FLOOR - 322 * sy, x - 35 + wob, FLOOR - 312 * sy);
  ctx.lineTo(x - 70 + wob, FLOOR - 345 * sy); ctx.lineTo(x - 95 + wob, FLOOR - 300 * sy);       // oreja izquierda
  ctx.bezierCurveTo(x - 150 + wob, FLOOR - 230 * sy, x - 250, FLOOR - 120 * sy, x - 262, FLOOR);
  ctx.closePath();
}
function drape(x, sy, wob, t, eyes) {
  ctx.save(); ctx.globalAlpha = .18; ellipse(x, FLOOR + 4, 270, 16, '#000', false); ctx.restore();
  drapeShape(x, sy, wob); ctx.fillStyle = GOLD; ctx.fill();
  ctx.save(); ctx.clip();
  ctx.globalAlpha = .22; ellipse(x, FLOOR - 140 * sy, 170, 130 * sy, TOAST, false); ctx.globalAlpha = .5; for (const [dx, dy] of [[-120, -90], [80, -150], [-10, -250], [150, -50], [-60, -170], [30, -60]]) ellipse(x + dx, FLOOR + dy * sy, 5, 4, TOAST, false);
  ctx.globalAlpha = 1; ctx.fillStyle = GOLD_SIDE; ctx.fillRect(x - 280, FLOOR - 18, 560, 20);
  ctx.restore();
  drapeShape(x, sy, wob); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
  if (eyes > 0) {                                // dos agujeritos con ojos que miran
    const look = clamp((t - 22.0) / .3) * 10;
    for (const ex of [-30, 34]) {
      ellipse(x + ex + wob, FLOOR - 205 * sy, 22 * eyes, 26 * eyes, '#2b2233', true, 5);
      ellipse(x + ex + wob + look * .6, FLOOR - 205 * sy + 2, 12 * eyes, 15 * eyes, C.white, false);
      ellipse(x + ex + wob + look, FLOOR - 203 * sy, 6 * eyes, 8 * eyes, C.ink, false);
    }
  }
}
function drapeTopPoint(x, sy, p) {               // camino de la mantequilla: cima -> lado derecho -> suelo
  const P0 = [x, FLOOR - 322 * sy - 22], P1 = [x + 120, FLOOR - 305 * sy], P2 = [x + 210, FLOOR - 170 * sy], P3 = [x + 268, FLOOR - 20];
  const u = 1 - p;
  return [u * u * u * P0[0] + 3 * u * u * p * P1[0] + 3 * u * p * p * P2[0] + p * p * p * P3[0], u * u * u * P0[1] + 3 * u * u * p * P1[1] + 3 * u * p * p * P2[1] + p * p * p * P3[1], .2 + p * .9];
}
function logBody(lx, t, rollA, sx, sy) {         // el burrito (tortita enrollada)
  const cy = FLOOR - 85;
  ctx.save(); ctx.translate(lx, FLOOR); ctx.scale(sx, sy); ctx.translate(-lx, -FLOOR);
  ctx.save(); ctx.globalAlpha = .18; ellipse(lx, FLOOR + 4, 140, 14, '#000', false); ctx.restore();
  roundRect(lx - 115, cy - 85, 230, 170, 70, GOLD, true, 8);
  ctx.save(); ctx.beginPath(); ctx.roundRect(lx - 115, cy - 85, 230, 170, 70); ctx.clip();
  ctx.lineWidth = 10; ctx.strokeStyle = GOLD_SIDE;
  for (let i = -3; i <= 3; i++) {                // vueltas de la tortita: se desplazan al rodar
    const yy = cy + (((i * 60 + rollA * 85) % 360) + 360) % 360 - 180;
    ctx.beginPath(); ctx.moveTo(lx - 120, yy + 18); ctx.quadraticCurveTo(lx, yy - 14, lx + 120, yy + 18); ctx.stroke();
  }
  ctx.globalAlpha = .3; ellipse(lx + 30, cy - 30, 40, 24, TOAST, false); ellipse(lx - 50, cy + 30, 30, 18, TOAST, false);
  ctx.restore();
  // espiral en el extremo izquierdo
  ellipse(lx - 100, cy, 34, 82, GOLD_SIDE, true, 7);
  ctx.save(); ctx.translate(lx - 100, cy); ctx.rotate(-rollA);
  ctx.beginPath(); for (let a = 0; a < 15; a += .25) ctx.lineTo(Math.cos(a) * a * 1.9 * .42, Math.sin(a) * a * 1.9 * 1.05 * .42 * 2.2);
  ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore();
  ctx.restore();
}
function burritoFeet(lx, t, wig) {              // patitas y cola que asoman y se mueven
  const cy = FLOOR - 85;
  ctx.lineCap = 'round';
  const tw = Math.sin(t * 5) * 14;
  ctx.beginPath(); ctx.moveTo(lx - 120, cy + 20); ctx.quadraticCurveTo(lx - 210, cy + 10 + tw, lx - 230, cy - 70 + tw);
  ctx.lineWidth = 38; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 22; ctx.strokeStyle = C.cat; ctx.stroke();
  for (const [k, dy] of [[0, -40], [1, 38]]) {
    const w = Math.sin(t * 16 + k * 2.2) * 10 * wig;
    ellipse(lx - 132 - Math.abs(w) * .4, cy + dy + w, 26, 17, C.cat);
    ctx.lineWidth = 4; ctx.strokeStyle = C.ink;
    for (const s of [-6, 6]) { ctx.beginPath(); ctx.moveTo(lx - 150 - Math.abs(w) * .4, cy + dy + w + s); ctx.lineTo(lx - 140 - Math.abs(w) * .4, cy + dy + w + s); ctx.stroke(); }
  }
}
function puff(x, y, t, t0, R = 1) {
  const p = seg(t, t0, t0 + .6); if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.globalAlpha = 1 - p;
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + .3, d = (60 + p * 170) * R; ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d * .55, (55 - p * 20) * R, (45 - p * 15) * R, '#ffffff', true, 6); }
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
function mouseRot(ms, fn) {                      // inclinar a Pip sobre sus patas
  ctx.save(); ctx.translate(ms.x, ms.y); ctx.rotate(ms.rot); ctx.translate(-ms.x, -ms.y); fn(); ctx.restore();
}
function mustache(ms, t) {                       // bigote de mantequilla
  mouseRot(ms, () => {
    ctx.save(); ctx.translate(ms.x, ms.y); ctx.scale(ms.dir * ms.sx, ms.sy);
    const w = 1 + Math.sin(t * 6) * .03;
    ctx.beginPath(); ctx.moveTo(82, -48);
    ctx.bezierCurveTo(70, -36, 50, -34, 42, -46 * w); ctx.bezierCurveTo(54, -40, 68, -44, 82, -50);
    ctx.bezierCurveTo(96, -44, 110, -40, 122, -46 * w); ctx.bezierCurveTo(114, -34, 94, -36, 82, -48);
    ctx.fillStyle = BUTTER; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke();
    ellipse(68, -30, 6, 9, BUTTER, true, 3);
    ctx.restore();
  });
}

// ---------- escenario: cocina ----------
function drawKitchen(t) {
  ctx.fillStyle = '#dff3ea'; ctx.fillRect(-800, -1400, W + 1600, FLOOR + 1400);
  ctx.strokeStyle = '#c4e6d8'; ctx.lineWidth = 5;
  for (let yy = FLOOR - 50; yy > -1400; yy -= 90) { ctx.beginPath(); ctx.moveTo(-800, yy); ctx.lineTo(W + 800, yy); ctx.stroke(); }
  for (let xx = -800; xx < W + 800; xx += 90) { ctx.beginPath(); ctx.moveTo(xx, -1400); ctx.lineTo(xx, FLOOR - 50); ctx.stroke(); }
  // ventana
  roundRect(560, 470, 320, 340, 20, C.sky);
  ctx.save(); ctx.beginPath(); ctx.roundRect(560, 470, 320, 340, 20); ctx.clip();
  const cx = 600 + ((t * 18) % 420);
  ellipse(cx, 570, 50, 26, C.white, false); ellipse(cx + 40, 555, 40, 28, C.white, false); ellipse(cx - 40, 578, 34, 18, C.white, false);
  ellipse(820, 780, 140, 70, '#8fd16a', false);
  ctx.restore();
  ctx.lineWidth = 10; ctx.strokeStyle = C.ink;
  ctx.beginPath(); ctx.moveTo(720, 470); ctx.lineTo(720, 810); ctx.moveTo(560, 640); ctx.lineTo(880, 640); ctx.stroke();
  roundRect(540, 805, 360, 26, 10, '#fff3e0');
  // cortinas
  for (const s of [-1, 1]) { ctx.beginPath(); const bx = 720 + s * 185; ctx.moveTo(bx, 440); ctx.quadraticCurveTo(bx - s * 50, 600, bx - s * 10, 760); ctx.lineTo(bx + s * 40, 760); ctx.lineTo(bx + s * 40, 440); ctx.closePath(); ctx.fillStyle = '#ff9fb4'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke(); }
  roundRect(500, 425, 440, 24, 12, '#c18e52');
  // estante con tarros
  roundRect(-300, FLOOR - 930, 640, 28, 8, C.tableTop);
  for (const [jx, h, col] of [[-200, 120, '#ffd93d'], [-60, 150, '#ff9fb4'], [80, 110, '#9fd7ff'], [210, 135, '#c9a0ff']]) {
    roundRect(jx - 45, FLOOR - 930 - h, 90, h, 18, 'rgba(255,255,255,.75)');
    ctx.save(); ctx.globalAlpha = .85; roundRect(jx - 37, FLOOR - 930 - h * .62, 74, h * .55, 12, col, false); ctx.restore();
    roundRect(jx - 50, FLOOR - 930 - h - 18, 100, 24, 8, C.red, true, 6);
  }
  // gancho de la sartén
  ellipse(HOOK.x, HOOK.y - 220, 12, 12, '#8a8399', true, 6);
  // encimera + armarios
  ctx.fillStyle = '#fbe9d0'; ctx.fillRect(-800, FLOOR - 50, W + 1600, 60);
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(-800, FLOOR - 50); ctx.lineTo(W + 800, FLOOR - 50); ctx.stroke();
  roundRect(-820, FLOOR + 6, W + 1640, 46, 14, C.tableTop);
  ctx.fillStyle = '#ffd3a8'; ctx.fillRect(-800, FLOOR + 52, W + 1600, 1200);
  for (let i = -3; i < 8; i++) {
    const dx = 20 + i * 270;
    roundRect(dx, FLOOR + 90, 240, 520, 22, '#ffc48c', true, 7);
    roundRect(dx + 30, FLOOR + 120, 180, 460, 16, '#ffd3a8', true, 5);
    ellipse(dx + (i % 2 ? 40 : 200), FLOOR + 330, 12, 12, C.red, true, 5);
  }
}

// ---------- fotograma ----------
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#dff3ea'; ctx.fillRect(0, 0, W, H);
  const sh = shake(t, PAN_FLY1, 14) + shake(t, DRAPE0, 18) + shake(t, SHOT1 + .15, 10);
  const cam = { s: CAM.val('s', t), cx: CAM.val('cx', t) + sh, cy: CAM.val('cy', t) + sh * .6 };
  const cs = catState(t), ms = mouseState(t);
  withCamera(cam, () => {
    drawKitchen(t);
    // --- sartén: colgada, volando o en el fuego ---
    burner(t, seg(t, PAN_FLY1, PAN_FLY1 + .3) * (1 - seg(t, 16.6, 17.2)));
    let panX = PAN_X, panY = PAN_Y + PAN.val('oy', t), panR = PAN.val('rot', t);
    if (t < PAN_FLY0) { panX = HOOK.x + Math.sin(t * 1.3) * 3; panY = HOOK.y + 200; panR = 1.32 + (t > 9.2 ? Math.sin((t - 9.2) * 40) * .1 : 0); }
    else if (t < PAN_FLY1) { const p = seg(t, PAN_FLY0, PAN_FLY1); panX = lerp(HOOK.x, PAN_X, E.io(p)); panY = lerp(HOOK.y + 200, PAN_Y, E.iq(p)) - Math.sin(p * Math.PI) * 160; panR = lerp(1.32, -Math.PI * 2, E.o(p)); }
    if (t < PAN_FLY0) hangingPan(HOOK.x, HOOK.y, t > 9.2 ? Math.sin((t - 9.2) * 40) * .12 : Math.sin(t * 1.3) * .02);
    else pan(panX, panY, panR);
    // --- tortita gigante en la sartén ---
    const pr = PC.val('r', t);
    if (t >= 10.5 && t < 16.02 && pr > 2) {
      const top = PAN_Y - 60 + PAN.val('oy', t);
      pancake(PAN_X, top, pr, pr * .14, 12 + pr * .04);
      if (t > 12.6 && t < 14.2) for (let i = 0; i < 9; i++) { const ph = ((t - 12.6) * 1.4 + rnd(i) ) % 1; ellipse(PAN_X - 170 + rnd(i + 3) * 340, top - 8 + (rnd(i + 7) - .5) * 30, 9 * Math.sin(ph * Math.PI), 6 * Math.sin(ph * Math.PI), '#ffe3a3', true, 3); }
      if (t >= BUT_DROP1) bigButter(PAN_X + 10, top - 20 + Math.max(0, Math.sin((t - BUT_DROP1) * 18) * 12 * (1 - seg(t, BUT_DROP1, BUT_DROP1 + .5))));
    }
    if (t >= BUT_DROP0 && t < BUT_DROP1) bigButter(PAN_X + 10, lerp(FLOOR - 470, PAN_Y - 80, E.iq(seg(t, BUT_DROP0, BUT_DROP1))), (t - BUT_DROP0) * 4);
    steam(PAN_X, PAN_Y - 90, t, seg(t, 11.5, 12.5) * (1 - seg(t, 15.8, 16.1)), 5, 300);
    // --- cuenco de masa ---
    const bs = seg(t, 10.15, 10.35) * (1 - seg(t, 12.75, 12.95));
    bowl(255, FLOOR - 235, .35 + seg(t, 10.35, 10.6) * .55, bs);
    batterStream(320, FLOOR - 255, PAN_X - 20, PAN_Y - 70, t, seg(t, 10.5, 10.6) * (1 - seg(t, 12.35, 12.55)));
    // --- Pip y su plato ---
    let plx = PLATE.x, ply = PLATE.y;
    if (t < 2.15) { const p = E.io(seg(t, 1.75, 2.15)); plx = lerp(ms.x + 70 * ms.dir, PLATE.x, p); ply = lerp(ms.y - 22, PLATE.y, p); }
    const nudge = t > 2.55 && t < 3.3 ? Math.sin((t - 2.55) * 16) * 7 * (1 - seg(t, 2.55, 3.3)) : 0;
    const pipFirst = t < 1.75;              // mientras lo lleva, el plato va delante
    if (!pipFirst) pipPlate(plx, ply, t, nudge);
    mouseRot(ms, () => drawMouse(ms, t));
    if (pipFirst) pipPlate(plx, ply, t, 0);
    if (t > 30.5) {                          // la mantequilla de Mochi acaba en la tortita de Pip
      const p = seg(t, SHOT1, BOUNCE1);
      if (t >= BOUNCE1) bigButter(PLATE.x - 6, PLATE.y - 46, .05);
    }
    if (t > 34.95) mustache(ms, t);
    if (t > 3.25 && t < 4.6) for (let i = 0; i < 3; i++) { const ph = ((t - 3.25) * 1.2 + i / 3) % 1; sparkle(PLATE.x - 40 + i * 40, PLATE.y - 70 - ph * 60, .6 * Math.sin(ph * Math.PI), 1, '#ffd93d'); }
    // --- Mochi ---
    if (t < DRAPE0) drawCat(cs, t);
    thought(cs.x + 210, FLOOR - 640, t, 6.75, 8.45);
    // tortita volando
    if (t >= 16.02 && t < DRAPE0) flyingDisc(PC.val('x', t), PC.val('y', t), 232, PC.val('spin', t), true);
    // manta
    if (t >= DRAPE0 && t < LOG0) {
      const hop = DR.val('hop', t), dx = DR.val('x', t), wob = t > 20.9 && t < 21.9 ? Math.sin((t - 20.9) * 22) * 14 : 0;
      ctx.save(); ctx.translate(0, -hop);
      const sy = DR.val('sy', t) * (1 + (t > 20.9 && t < 21.9 ? Math.sin((t - 20.9) * 30) * .04 : 0));
      ctx.translate(dx, FLOOR); ctx.scale(1 / Math.sqrt(sy), 1); ctx.translate(-dx, -FLOOR);
      drape(dx, sy, wob, t, seg(t, 21.4, 21.6));
      if (t < BUT_SLIDE0) bigButter(dx + wob, FLOOR - 322 * sy - 22);
      ctx.restore();
    }
    // mantequilla resbalando por la manta y por la encimera
    if (t >= BUT_SLIDE0 && t < 25.6) {
      let bx, by, br;
      if (t < BUT_SLIDE1) [bx, by, br] = drapeTopPoint(250, 1, E.iq(seg(t, BUT_SLIDE0, BUT_SLIDE1)));
      else { bx = lerp(250 + 268, BUT_X, E.o(seg(t, BUT_SLIDE1, BUT_STOP))); by = FLOOR - 20; br = 0; }
      bigButter(bx, by, br);
    }
    // burrito rodando
    if (t >= LOG0) {
      const lx = LG.val('x', t), rollA = (lx - 300) / 85;
      if (t >= HEAD0) {                     // cabeza de Mochi asomando por la derecha
        ctx.save(); ctx.beginPath(); ctx.rect(lx + 70, FLOOR - 420, 500, 418); ctx.clip();
        const pop = easeOutBack(seg(t, HEAD0, HEAD0 + .3));
        ctx.translate(lx + 70, 0); ctx.scale(pop, 1); ctx.translate(-(lx + 70), 0);
        drawCat({ ...cs, sx: 1, sy: 1 }, t);
        if (t > 35.4) {                     // lengüetazos a la tortita
          const lk = Math.max(0, Math.sin((t - 35.4) * 5.5));
          ctx.save(); ctx.translate(cs.x, cs.y); ctx.rotate(LIE); ctx.scale(-1, 1);
          ctx.rotate(Math.sin(t * 11) * .25);
          ellipse(28, -126 + lk * 10, 13, 8 + lk * 14, '#ff6f91', true, 5);
          ctx.lineWidth = 3; ctx.strokeStyle = '#c94a6c'; ctx.beginPath(); ctx.moveTo(28, -128); ctx.lineTo(28, -118 + lk * 18); ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
      }
      const wig = t > 26.2 ? 1 : 0;
      if (t >= HEAD0) burritoFeet(lx, t, t > 35.3 ? 1.6 : wig);
      logBody(lx, t, rollA, LG.val('sx', t), LG.val('sy', t));
      if (t < HEAD0) for (const k of [0, 1]) { const a = rollA * 3 + k * 3; ellipse(lx + Math.cos(a) * 110, FLOOR - 85 + Math.sin(a) * 80, 22, 15, C.cat); }
      // la mantequilla queda atrapada y luego sale disparada
      if (t >= SHOT0 && t < BOUNCE1) {
        let bx, by;
        if (t < SHOT1) { const p = seg(t, SHOT0, SHOT1); bx = lerp(lx + 30, 818, p); by = lerp(FLOOR - 175, FLOOR - 92, p) - Math.sin(p * Math.PI) * 430; }
        else { const p = seg(t, SHOT1, BOUNCE1); bx = lerp(818, PLATE.x - 6, p); by = lerp(FLOOR - 92, PLATE.y - 46, p) - Math.sin(p * Math.PI) * 110; }
        bigButter(bx, by, (t - SHOT0) * 14);
      }
    }
    puff(DR.val('x', t) + 20, FLOOR - 120, t, LOG0 - .08, 1.1);
    puff(FX + 168, FLOOR - 110, t, HEAD0 - .05, .5);
    // efectos y palabras
    if (t > 7.0 && t < 8.3) for (let i = 0; i < 4; i++) { const ph = ((t - 7) * .9 + i / 4) % 1; heart(cs.x - 40 + i * 40, cs.y - 300 - ph * 120, .8 * Math.sin(ph * Math.PI), i % 2 ? C.red : C.pink); }
    if (t > 26.6 && t < 28.4) for (let i = 0; i < 3; i++) { const a = t * 6 + i * 2.1; sparkle(FX + 200 + Math.sin(a) * 30, FLOOR - 100 + Math.cos(a) * 110, .8, 1, '#ffd93d'); }
    if (t > 31.0 && t < 34.8) for (let i = 0; i < 3; i++) { const a = t * 6 + i * 2.1; sparkle(800 + Math.cos(a) * 70, FLOOR - 120 + Math.sin(a) * 20, .7, 1, '#ffd93d'); }
    if (t > 35.8 && t < 40) for (let i = 0; i < 6; i++) { const ph = ((t - 35.8) * .6 + i / 6) % 1; heart(640 + Math.sin(ph * 5 + i * 2) * 220, FLOOR - 330 - ph * 260, (.7 + (i % 3) * .2) * Math.sin(ph * Math.PI), i % 2 ? C.red : C.pink); }
    worldWord('CLANG!', PAN_X, FLOOR - 260, t, PAN_FLY1, PAN_FLY1 + .7, 90, '#9fd7ff');
    worldWord('FLIP!', PAN_X - 40, FLOOR - 380, t, 16.0, 16.7, 100, '#ffd93d', .06);
    worldWord('FLOP!', 300, FLOOR - 470, t, DRAPE0, DRAPE0 + .8, 110, '#ffd93d');
    worldWord('ROLL!', 420, FLOOR - 330, t, 24.3, 25.6, 90, '#ff9fc0', .06);
    worldWord('POP!', FX + 260, FLOOR - 300, t, HEAD0, HEAD0 + .5, 70, '#ffffff');
    worldWord('SQUISH!', FX + 30, FLOOR - 300, t, 29.15, 29.75, 70, '#ffd93d');
    worldWord('BONK!', 860, FLOOR - 230, t, SHOT1, SHOT1 + .55, 70, '#ffffff', .1);
    worldWord('SPLAT!', 800, FLOOR - 170, t, 30.5, 31.2, 64, '#ffd93d', -.05);
  });
  caption('🥞 ✨', t, 0, 1.75, { size: 150 });
  pill('👀', t, 0, 3.0);
  caption('🧈 👌', t, 3.3, 5.0, { size: 150 });
  caption('BIGGER! 😻', t, 6.8, 8.4, { size: 120, highlight: true });
  caption('🍳 😤', t, 8.6, 10.1, { size: 140 });
  caption('🥣 ➜ 🍳', t, 10.4, 12.6, { size: 130 });
  caption('🥞 > 🐱', t, 12.8, 15.7, { size: 140, highlight: true });
  caption('😮 ⬇️', t, 18.0, 20.1, { size: 150 });
  caption('🐱 ❓', t, 20.9, 22.1, { size: 150 });
  caption('🧈 👀', t, 22.2, 24.1, { size: 150 });
  caption('BURRITO 🌯😹', t, 26.1, 28.9, { size: 110, highlight: true });
  caption('🐭 💥 🥞', t, 31.0, 34.8, { size: 130 });
  caption('🧈 🥸', t, 35.4, 37.3, { size: 150 });
  caption('🥞 1 – 0 🐱', t, 37.4, 40.0, { size: 120, highlight: true });
  endCard(t, 40.0, 10);
}
startEpisode(render);
