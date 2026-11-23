// =====================================================================
//  EPISODIO 9 (2D original, estilo pegatina kawaii) — "Gone fishing 🎣"
//  Pip pesca a Mochi con una galleta atada a una caña desde la estantería.
//  Mochi se da de morros, apila los 4 cojines del sofá, roza la galleta...
//  la torre se derrumba y tira de la caña: Pip cae encima. Mochi le atrapa
//  por la cola... y vuelta a empezar (bucle perfecto: 1er fotograma = último).
//  6 planos, 20 s, cámara fija y cortes secos. Único texto: "BONK!".
// =====================================================================
const DURATION = 20;

// ---------- estilo de este episodio: pastel, contorno fino marrón, sombreado suave ----------
Object.assign(C, {
  ink: '#4a2c22', cat: '#ffad5c', catDark: '#ee8d3d', belly: '#fff1dc', pink: '#ff9db4',
  mouse: '#c3bcd9', mouseDark: '#a59ec4', cookie: '#e9ae64', cookieDark: '#cf9047', chip: '#6b4230', white: '#fffdf8'
});
let LWF = 1;   // grosor de línea global (se ajusta a la escala de cámara: líneas finas también en primer plano)
{
  const d = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'lineWidth');
  Object.defineProperty(CanvasRenderingContext2D.prototype, 'lineWidth', { configurable: true, get() { return d.get.call(this) / LWF; }, set(v) { d.set.call(this, v * LWF); } });
}
const rgbOf = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mixc = (h, w, a) => { const c = rgbOf(h); return `rgb(${c.map((v, i) => Math.round(v + (w[i] - v) * a)).join(',')})`; };
const NOSHADE = new Set([C.ink, C.white, '#000', '#7a2440', '#bfe9ff']);
function shadeFill(fill, x, y, rx, ry) {   // degradado radial suave: luz arriba-izquierda
  if (typeof fill !== 'string' || fill[0] !== '#' || fill.length !== 7 || rx < 9 || NOSHADE.has(fill)) return fill;
  const g = ctx.createRadialGradient(x - rx * .35, y - ry * .45, 0, x - rx * .1, y - ry * .1, Math.max(rx, ry) * 1.25);
  g.addColorStop(0, mixc(fill, [255, 255, 255], .4)); g.addColorStop(.5, fill); g.addColorStop(1, mixc(fill, [110, 50, 40], .2));
  return g;
}
function ellipse(x, y, rx, ry, fill, stroke = true, lw = 8) {
  ctx.beginPath(); ctx.ellipse(x, y, Math.max(rx, .1), Math.max(ry, .1), 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = shadeFill(fill, x, y, rx, ry); ctx.fill(); }
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = C.ink; ctx.stroke(); }
}
function roundRect(x, y, w, h, r, fill, stroke = true, lw = 8) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = shadeFill(fill, x + w / 2, y + h / 2, w / 2, h / 2); ctx.fill(); }
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = C.ink; ctx.stroke(); }
}

// ---------- decorado ----------
const SH_X0 = 40, SH_X1 = 440, SH_TOP = 560;           // estantería
const SOFA_X = 690, SEAT = 1265;                          // sofá
const TOWER_X = 500, CUSH_H = 68, TOWER_TOP = FLOOR - 4 * CUSH_H;
const ROD_L = 230;
const CUSH_COL = ['#ffb3c7', '#b5ead7', '#cdb4f6', '#ffe3a0'];
const SOFA_SLOT = [[800, SEAT - 52, -.06], [880, SEAT - 54, .05], [960, SEAT - 52, -.04], [1040, SEAT - 54, .07]];
const HEAP_SLOT = [[-60, -34, -.05], [60, -34, .05], [-20, -100, .1], [35, -162, -.08]];
const PILE_SLOT = [[445, FLOOR - 36, -.25], [600, FLOOR - 34, .3], [522, FLOOR - 100, .06], [490, FLOOR - 162, -.18]];
const PILE_TOP = FLOOR - 196;
const COOKIE_R = 30, COOKIE_PILE = [560, 1352];

// ---------- planos (cortes secos) ----------
const SHOTS = [[0, 'cu'], [2, 'med'], [5, 'wide'], [8, 'glare'], [8.8, 'wide2'], [13, 'mid'], [17, 'pile'], [18.8, 'cu']];
const CAMS = {
  cu: { s: 8, cx: 610, cy: 1320 }, med: { s: 1.6, cx: 640, cy: 1250 }, wide: { s: 1.12, cx: 560, cy: 1010 },
  glare: { s: 2.5, cx: 700, cy: 1290 }, wide2: { s: 1.04, cx: 545, cy: 992 }, mid: { s: 1.22, cx: 560, cy: 1010 }, pile: { s: 1.85, cx: 520, cy: 1330 }
};
const shotAt = t => { let s = SHOTS[0]; for (const x of SHOTS) if (t >= x[0]) s = x; return s[1]; };

// ---------- personajes ----------
const CUX = 585;   // Mochi sentado (planos 1, 2 y final)
const CAT = new Rig({ x: CUX, y: FLOOR, dir: 1, sx: 1, sy: 1, rot: 0, look: 0, paw: 0, wr: 0, arm: 0 });
const MOU = new Rig({ x: 330, y: SH_TOP, dir: 1, sx: 1, sy: 1, rot: 0, comp: 0 });
const ROD = new Rig({ a: .35, len: 898, bend: 0 });
const WOB = new Rig({ w: 0 }), HEAP = new Rig({ x: 960 });
const CEX = new Steps('wide'), MEX = new Steps('smug');

// Plano 2 (2–5): se lanza, la galleta sube de golpe, ¡BONK!
CEX.at(2.12, 'determined').at(2.45, 'shock').at(2.8, 'dizzy');
CAT.key(2.0, { sy: 1, sx: 1 }); CAT.key(2.28, { sy: .78, sx: 1.15 });
CAT.key(2.3, { x: CUX, y: FLOOR, rot: 0, paw: 0 }); CAT.key(2.38, { sy: 1.15, sx: .9 }, 'o'); CAT.key(2.42, { paw: 1 });
CAT.key(2.525, { y: FLOOR - 200 }, 'oq'); CAT.key(2.75, { y: FLOOR - 28 }, 'iq');
CAT.key(2.75, { x: 720 }, 'lin'); CAT.key(2.75, { rot: 1.15, paw: 1 }, 'iq'); CAT.key(2.95, { paw: 0 });
CAT.key(2.6, { sy: 1, sx: 1 }); CAT.key(2.8, { sy: .78, sx: 1.22 }, 'o'); CAT.key(3.1, { sy: 1, sx: 1 }, 'back');
ROD.key(2.32, { len: 898, a: .35 }); ROD.key(2.45, { len: 380, a: .55 }, 'o'); ROD.key(2.8, { a: .35 });
MEX.at(2.3, 'happy').at(2.9, 'smug');
// Plano 3 (5–8): Pip en lo alto de la estantería con su caña
CAT.key(5.5, { rot: 1.15, y: FLOOR - 28 }); CAT.key(5.85, { rot: 0, y: FLOOR }, 'back');
CAT.key(5.6, { dir: 1 }); CAT.key(5.72, { dir: -1 });
CEX.at(5.85, 'normal').at(7.0, 'shock').at(7.6, 'normal');
CAT.key(6.0, { look: 0 }); CAT.key(6.4, { look: 1 });
for (const t of [5.6, 6.3]) { ROD.key(t, { a: .35 }); ROD.key(t + .15, { a: .5 }, 'o'); ROD.key(t + .45, { a: .35 }); }
MEX.at(6.9, 'happy').at(7.7, 'smug');
for (const t of [7.0, 7.22, 7.44]) { MOU.key(t, { y: SH_TOP }); MOU.key(t + .1, { y: SH_TOP - 14 }, 'oq'); MOU.key(t + .2, { y: SH_TOP }, 'iq'); }
// Plano 4 (8–13): mirada asesina, torre de cojines, Pip sube la caña
CEX.at(8.0, 'glare').at(8.85, 'determined');
CAT.key(8.0, { look: .6 }); CAT.key(8.8, { look: .6 }); CAT.key(8.9, { look: 0 });
CAT.key(8.84, { dir: -1 }); CAT.key(8.92, { dir: 1 });
jump(CAT, 8.88, [720, FLOOR], [770, FLOOR], 60, .22, .07);
CAT.key(9.17, { paw: 0 }); CAT.key(9.25, { paw: 1 }, 'o'); CAT.key(9.45, { paw: .9 });
HEAP.key(9.5, { x: 960 }); HEAP.key(10.25, { x: 520 }, 'io');
CAT.key(9.5, { x: 770, wr: 0 }); CAT.key(9.6, { wr: 4 }); CAT.key(10.15, { wr: 4 }); CAT.key(10.25, { x: 330, wr: 0 }, 'io');
CAT.key(10.3, { paw: .9 });
for (let i = 0; i < 4; i++) { const t = 10.3 + i * .15; CAT.key(t + .02, { paw: .4 }); CAT.key(t + .1, { paw: 1 }, 'o'); }
CAT.key(10.9, { paw: 0 });
jump(CAT, 11.0, [330, FLOOR], [TOWER_X, TOWER_TOP], 120, .5, .12);
CAT.key(11.7, { look: 0, arm: 0 }); CAT.key(12.05, { look: 1, arm: 235 }, 'o');
CEX.at(11.8, 'wide').at(12.4, 'shock').at(12.75, 'determined');
ROD.key(12.15, { a: .35 }); ROD.key(12.6, { a: .8 }, 'io');
MEX.at(12.1, 'happy').at(12.7, 'smug');
WOB.key(11.62, { w: 0 }); WOB.key(11.66, { w: .4 }); WOB.key(11.95, { w: .1 }); WOB.key(12.3, { w: .15 }); WOB.key(13.0, { w: .6 }); WOB.key(13.7, { w: .45 }); WOB.key(14.05, { w: 1 });
// Plano 5 (13–17): se estira, la roza... ¡se derrumba! y Pip sale volando
CAT.key(13.0, { sy: 1, sx: 1, arm: 235 }); CAT.key(13.8, { sy: 1.18, sx: .92, arm: 310 }, 'io');
CEX.at(13.8, 'happy').at(14.05, 'shock');
MEX.at(13.85, 'shock').at(14.15, 'smug').at(14.45, 'shock');
CAT.key(14.1, { sy: 1, sx: 1 });
const FALL0 = 14.1, FALL1 = 14.45, HIDE = 14.56;
ROD.key(14.2, { bend: 0 }); ROD.key(14.45, { bend: .9 }, 'o');
MOU.key(14.42, { x: 330, rot: 0 }); MOU.key(14.62, { x: 405, rot: .35 }, 'o');
const TUGS = [14.95, 15.4, 15.8];
for (const [k, t] of TUGS.entries()) {
  MOU.key(t, { rot: .3 }); MOU.key(t + .07, { rot: .62, x: 410 + k * 4 }, 'o'); MOU.key(t + .35, { rot: .3 }, 'back');
  ROD.key(t, { bend: .9 }); ROD.key(t + .06, { bend: 1.25 }, 'o'); ROD.key(t + .3, { bend: .9 });
}
// 16.0 el último tirón: Pip cae dando vueltas
const PFALL0 = 16.0, PLAND = 17.15;
MOU.key(PFALL0, { x: 418, y: SH_TOP, rot: .45, comp: 0 }); MOU.key(PFALL0 + .15, { comp: 1 });
MOU.key(PFALL0 + .2, { y: SH_TOP - 50 }, 'oq'); MOU.key(PLAND, { y: PILE_TOP + 8 }, 'iq'); MOU.key(PLAND, { x: 505, rot: Math.PI * 4 }, 'lin');
MOU.key(PLAND + .01, { rot: 0 }, 'hold');
// Plano 6 (17–18.8): aterriza, suelta la caña... ¡zarpa! le atrapa por la cola
MOU.key(PLAND + .02, { sy: .75, sx: 1.2 }, 'o'); MOU.key(PLAND + .25, { sy: 1, sx: 1 }, 'back');
MOU.key(PLAND + .13, { y: PILE_TOP - 30 }, 'oq'); MOU.key(PLAND + .26, { y: PILE_TOP + 8 }, 'iq');
MEX.at(17.4, 'dizzy').at(18.05, 'shock').at(18.4, 'guilty');
const DROP = 17.5, PAW0 = 17.8, GRAB = 18.05;
MOU.key(GRAB, { sy: 1, x: 505 }); MOU.key(GRAB + .08, { sy: 1.2, sx: .88 }, 'o'); MOU.key(GRAB + .3, { sy: 1, sx: 1, x: 488 }, 'back');
for (const r of [CAT, MOU, ROD, WOB, HEAP]) r.done();

// galleta en primer plano: izquierda → derecha (plano 1) y se para en el mismo sitio al final (bucle)
function cuOff(tl) {
  if (tl >= 0) return tl < .25 ? -1 : -Math.cos(Math.PI * (tl - .25) / .75);
  return tl > -.3 ? -1 : -Math.cos(Math.PI * (tl + .3) / .75);
}
const isCU = t => t < 2 || t >= 18.8;
const cuT = t => t >= 18.8 ? t - 20 : t;

// ---------- estados ----------
const sway = t => WOB.val('w', t) * Math.sin((t - 11.6) * 8);
function catState(t) {
  if (isCU(t)) return { x: CUX, y: FLOOR, dir: 1, sx: 1, sy: 1, rot: 0, look: -.5, lookX: cuOff(cuT(t)), expr: 'wide', paw: 0, walk: 0, arm: 0 };
  let x = CAT.val('x', t), y = CAT.val('y', t), rot = CAT.val('rot', t), expr = CEX.get(t);
  const wr = CAT.val('wr', t), ph = CAT.integ('wr', t);
  y -= Math.abs(Math.sin(ph * Math.PI * 2)) * 10 * clamp(wr);
  if (t >= 11.62 && t < FALL0) { const s = sway(t); x = TOWER_X + s * 28; y = TOWER_TOP - 8 * seg(t, 13, 13.8); rot = s * .1; }
  if (t >= FALL0) { const p = seg(t, FALL0, FALL1); x = lerp(TOWER_X + sway(FALL0) * 28, 540, p); y = lerp(TOWER_TOP, FLOOR, E.iq(p)); rot = lerp(.1, -.5, p); }
  return { x, y, dir: CAT.val('dir', t), sx: CAT.val('sx', t), sy: CAT.val('sy', t), rot, look: CAT.val('look', t), lookX: 0, paw: CAT.val('paw', t), walk: ph, expr, arm: CAT.val('arm', t) };
}
function mouseState(t) {
  let x = MOU.val('x', t), y = MOU.val('y', t), rot = MOU.val('rot', t);
  const c = MOU.val('comp', t) * 40;                       // al caer gira sobre el centro del cuerpo
  if (t >= PFALL0 - .01 && t < PLAND + .01) { x -= c * Math.sin(rot); y -= c * (1 - Math.cos(rot)); }
  return { x, y, dir: 1, sx: MOU.val('sx', t), sy: MOU.val('sy', t), rot, expr: MEX.get(t), holding: null };
}
// caña de pescar (en coordenadas del mundo)
function rodGeom(ms, t) {
  const a = ROD.val('a', t), b = ROD.val('bend', t), cr = Math.cos(ms.rot), sr = Math.sin(ms.rot);
  const R = (lx, ly) => [lx * cr - ly * sr, lx * sr + ly * cr];
  const [bx, by] = R(58, -24), [dx, dy] = R(Math.cos(a), -Math.sin(a)), [ex, ey] = R(Math.cos(a - b), -Math.sin(a - b));
  const base = [ms.x + bx, ms.y + by];
  return { base, ctrl: [base[0] + dx * ROD_L * .55, base[1] + dy * ROD_L * .55], tip: [base[0] + ex * ROD_L * (1 - b * .08), base[1] + ey * ROD_L * (1 - b * .08)], back: [base[0] - dx * 34, base[1] - dy * 34] };
}
let DROP_G = null;
function rodAt(t) {
  if (t < DROP) return rodGeom(mouseState(t), t);
  DROP_G ||= rodGeom(mouseState(DROP), DROP);
  const p = E.o(seg(t, DROP, DROP + .35)), hop = Math.sin(seg(t, DROP + .35, DROP + .55) * Math.PI) * 18;
  const b = [lerp(DROP_G.base[0], 600, p), lerp(DROP_G.base[1], FLOOR - 10, E.iq(seg(t, DROP, DROP + .35))) - hop];
  const a = lerp(Math.atan2(DROP_G.tip[1] - DROP_G.base[1], DROP_G.tip[0] - DROP_G.base[0]), -.04, p);
  const d = [Math.cos(a), Math.sin(a)];
  return { base: b, ctrl: [b[0] + d[0] * ROD_L * .55, b[1] + d[1] * ROD_L * .55], tip: [b[0] + d[0] * ROD_L, b[1] + d[1] * ROD_L], back: [b[0] - d[0] * 34, b[1] - d[1] * 34] };
}
// brazo estirado de Mochi (sale por detrás de la cabeza)
const shoulder = cs => [cs.x + 45 * cs.dir, cs.y - 105 * cs.sy];
let ARM_A = null;
function armGeom(cs, t, ck) {
  const sh = shoulder(cs);
  let a;
  if (t < 13.8) a = Math.atan2(ck[1] + COOKIE_R * .8 - sh[1], ck[0] - sh[0]);
  else { ARM_A ??= Math.atan2(cookieFree(13.8)[1] + COOKIE_R * .8 - shoulder(catState(13.8))[1], cookieFree(13.8)[0] - shoulder(catState(13.8))[0]); a = ARM_A; }
  return { sh, a, tip: [sh[0] + Math.cos(a) * cs.arm, sh[1] + Math.sin(a) * cs.arm] };
}
function cookieFree(t) {
  const g = rodAt(t), len = ROD.val('len', t);
  let sw = Math.sin(t * 2.2) * 8;
  if (t > 2.45) sw += 34 * Math.exp(-(t - 2.45) * 2.5) * Math.sin((t - 2.45) * 11);
  return [g.tip[0] + sw, g.tip[1] + len];
}
function cookiePos(t, cs) {
  if (t >= FALL1 + .05) return COOKIE_PILE;
  if (t >= 13.8 && cs.arm > 0) { const ag = armGeom(cs, t); return [ag.tip[0], ag.tip[1] - COOKIE_R * .7]; }
  return cookieFree(t);
}

// ---------- dibujo del salón ----------
function cloud(x, y, s, a = 1, col = '#ffffff') {
  ctx.save(); ctx.globalAlpha *= a;
  for (const [dx, dy, r] of [[-38, 6, 30], [0, -12, 40], [40, 4, 32], [12, 18, 30], [-16, 20, 26]]) ellipse(x + dx * s, y + dy * s, r * s, r * s, col, true, 5);
  for (const [dx, dy, r] of [[-38, 6, 30], [0, -12, 40], [40, 4, 32], [12, 18, 30], [-16, 20, 26]]) ellipse(x + dx * s, y + dy * s, r * s - 3, r * s - 3, col, false);
  ctx.restore();
}
function cushionShape(w, h) {
  const k = 10;
  ctx.beginPath(); ctx.moveTo(-w / 2 + 16, -h / 2);
  ctx.quadraticCurveTo(0, -h / 2 + k, w / 2 - 16, -h / 2); ctx.quadraticCurveTo(w / 2 + 4, -h / 2 - 4, w / 2, -h / 2 + 16);
  ctx.quadraticCurveTo(w / 2 - k, 0, w / 2, h / 2 - 16); ctx.quadraticCurveTo(w / 2 + 4, h / 2 + 4, w / 2 - 16, h / 2);
  ctx.quadraticCurveTo(0, h / 2 - k, -w / 2 + 16, h / 2); ctx.quadraticCurveTo(-w / 2 - 4, h / 2 + 4, -w / 2, h / 2 - 16);
  ctx.quadraticCurveTo(-w / 2 + k, 0, -w / 2, -h / 2 + 16); ctx.quadraticCurveTo(-w / 2 - 4, -h / 2 - 4, -w / 2 + 16, -h / 2);
  ctx.closePath();
}
function cushion(x, y, w, h, rot, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  cushionShape(w, h); ctx.fillStyle = shadeFill(col, 0, 0, w / 2, h / 2); ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.save(); ctx.globalAlpha = .45; ctx.setLineDash([8, 9]); ctx.lineWidth = 3; ctx.strokeStyle = mixc(col, [90, 40, 40], .35);
  ctx.beginPath(); ctx.ellipse(0, 0, w / 2 - 16, h / 2 - 14, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  ellipse(0, 0, 7, 6, mixc(col, [90, 40, 40], .25), true, 3);
  ctx.restore();
}
function drawLiving(t) {
  // pared
  const g = ctx.createLinearGradient(0, -400, 0, FLOOR);
  g.addColorStop(0, '#fff8f1'); g.addColorStop(1, '#fde9e2');
  ctx.fillStyle = g; ctx.fillRect(-600, -800, W + 1200, FLOOR + 800);
  ctx.fillStyle = 'rgba(255,190,200,.28)';
  for (let yy = -700; yy < FLOOR - 60; yy += 110) for (let xx = -560; xx < W + 600; xx += 110) {
    const ox = ((yy / 110) & 1) ? 55 : 0; heartDot(xx + ox, yy);
  }
  // ventana con cortinas
  const wx = 610, wy = 330, ww = 320, wh = 400;
  roundRect(wx - 16, wy - 16, ww + 32, wh + 32, 26, '#fffaf4', true, 6);
  ctx.save(); ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 16);
  const sk = ctx.createLinearGradient(0, wy, 0, wy + wh); sk.addColorStop(0, '#9fd8ff'); sk.addColorStop(1, '#dff3ff');
  ctx.fillStyle = sk; ctx.fill(); ctx.clip();
  const cx0 = wx + ((t * 14) % (ww + 200)) - 80;
  cloud(cx0, wy + 110, .9, 1); cloud(cx0 - 230, wy + 220, .7, 1);
  ellipse(wx + 80, wy + wh + 30, 160, 80, '#a8e6a1', false); ellipse(wx + 260, wy + wh + 40, 150, 90, '#8fd98f', false);
  ctx.restore();
  ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 16); ctx.stroke();
  ctx.lineWidth = 10; ctx.strokeStyle = '#fffaf4'; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.stroke();
  for (const s of [-1, 1]) {
    const cx = s < 0 ? wx - 10 : wx + ww + 10;
    ctx.beginPath(); ctx.moveTo(cx - 40 * s, wy - 30); ctx.lineTo(cx + 40 * s, wy - 30);
    ctx.quadraticCurveTo(cx + 10 * s, wy + 200, cx + 34 * s, wy + wh + 30); ctx.lineTo(cx - 44 * s, wy + wh + 30); ctx.closePath();
    ctx.fillStyle = shadeFill('#ffc2d1', cx, wy + 200, 40, 220); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  }
  roundRect(wx - 70, wy - 44, ww + 140, 20, 10, '#d9a06e', true, 5);
  // zócalo + suelo rosa pastel
  ctx.fillStyle = '#fbd3dc'; ctx.fillRect(-600, FLOOR - 40, W + 1200, 40);
  ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(-600, FLOOR - 40); ctx.lineTo(W + 600, FLOOR - 40); ctx.stroke();
  const fg = ctx.createLinearGradient(0, FLOOR, 0, FLOOR + 500); fg.addColorStop(0, '#f6b9c8'); fg.addColorStop(1, '#fcd6df');
  ctx.fillStyle = fg; ctx.fillRect(-600, FLOOR, W + 1200, 900);
  ctx.strokeStyle = 'rgba(232,150,172,.55)'; ctx.lineWidth = 4;
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-600, FLOOR + 60 + i * 95); ctx.lineTo(W + 600, FLOOR + 60 + i * 95); ctx.stroke(); }
  ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(-600, FLOOR); ctx.lineTo(W + 600, FLOOR); ctx.stroke();
  drawShelf(t); drawSofa();
}
function heartDot(x, y) { ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.bezierCurveTo(x - 13, y - 3, x - 9, y - 15, x, y - 8); ctx.bezierCurveTo(x + 9, y - 15, x + 13, y - 3, x, y + 6); ctx.fill(); }
function drawShelf(t) {
  const wood = '#d39a6a', dark = '#b97e50';
  roundRect(SH_X0, SH_TOP, SH_X1 - SH_X0, FLOOR - SH_TOP, 10, wood, true, 7);
  roundRect(SH_X0 + 22, SH_TOP + 22, SH_X1 - SH_X0 - 44, FLOOR - SH_TOP - 44, 6, dark, true, 5);
  roundRect(SH_X0 - 16, SH_TOP - 4, SH_X1 - SH_X0 + 32, 26, 10, wood, true, 6);
  const rows = [SH_TOP + 230, SH_TOP + 450, SH_TOP + 670];
  const BOOK = ['#ff9db4', '#9fd3f5', '#ffe08a', '#b5ead7', '#cdb4f6', '#ffbf8f'];
  let k = 0;
  for (const [ri, ry] of rows.entries()) {
    // libros
    let x = SH_X0 + 34;
    while (x < SH_X1 - 60) {
      if (ri === 1 && x > 240 && x < 330) { x += 100; continue; }
      const bw = 26 + rnd(k) * 20, bh = 120 + rnd(k + 5) * 70, lean = (ri === 2 && x > 300) ? -.18 : 0;
      ctx.save(); ctx.translate(x + bw / 2, ry); ctx.rotate(lean);
      roundRect(-bw / 2, -bh, bw, bh, 5, BOOK[k % BOOK.length], true, 5);
      ctx.fillStyle = 'rgba(255,255,255,.65)'; ctx.fillRect(-bw / 2 + 5, -bh + 18, bw - 10, 6); ctx.fillRect(-bw / 2 + 5, -30, bw - 10, 6);
      ctx.restore(); x += bw + 3; k++;
      if (ri === 2 && x > 300) break;
    }
    roundRect(SH_X0 + 16, ry - 4, SH_X1 - SH_X0 - 32, 22, 6, wood, true, 6);
  }
  // macetita y marco en las baldas
  const px = 290, py = rows[1];
  roundRect(px - 30, py - 60, 60, 60, 10, '#ffffff', true, 5);
  for (const s of [-1, 0, 1]) { ctx.save(); ctx.translate(px + s * 14, py - 60); ctx.rotate(s * .5); ellipse(0, -28, 13, 30, '#8fd98f', true, 4); ctx.restore(); }
  roundRect(px - 30, py - 60, 60, 60, 10, '#ffffff', true, 5);
  ctx.save(); ctx.translate(SH_X1 - 80, rows[2] - 70); ctx.rotate(.06); roundRect(-40, -50, 80, 100, 8, '#fff3c9', true, 5); heart(0, 4, 1.1, '#ff9db4'); ctx.restore();
  // patas
  roundRect(SH_X0 + 10, FLOOR - 16, 40, 16, 4, dark, true, 5); roundRect(SH_X1 - 50, FLOOR - 16, 40, 16, 4, dark, true, 5);
}
function drawSofa() {
  const col = '#a9cdf0', x0 = SOFA_X, x1 = 1180;
  roundRect(x0 + 40, 1050, x1 - x0, 260, 40, col, true, 7);              // respaldo
  roundRect(x0 + 10, SEAT - 10, x1 - x0, 150, 26, col, true, 7);          // asiento
  ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(74,44,34,.35)'; ctx.beginPath(); ctx.moveTo(x0 + 70, SEAT + 40); ctx.lineTo(x1, SEAT + 40); ctx.stroke();
  roundRect(x0 - 10, 1150, 90, 250, 34, '#9cc1e8', true, 7);              // reposabrazos
  for (const lx of [x0 + 20, x0 + 330]) roundRect(lx, FLOOR - 82, 26, 82, 6, '#b97e50', true, 5);
}

// cojines: sofá → montón → arrastre → torre → derrumbe → pila
function arcLerp(p0, p1, u, h) { return [lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u) - h * 4 * u * (1 - u)]; }
function cushionState(i, t) {
  const S = SOFA_SLOT[i], hx = (t >= 9.5 ? HEAP.val('x', t) : 960) , bump = t > 9.5 && t < 10.25 ? Math.abs(Math.sin(t * 18 + i)) * 6 : 0;
  const Hs = [hx + HEAP_SLOT[i][0], FLOOR + HEAP_SLOT[i][1] - bump, HEAP_SLOT[i][2]];
  const sw = sway(t), Ts = [TOWER_X + sw * 28 * (i + 1) / 4, FLOOR - 34 - i * CUSH_H, sw * .06 * (i + 1) / 4];
  const P = PILE_SLOT[i];
  const t1 = 9.1 + i * .08, t2 = 10.3 + i * .15, t3 = FALL0 + [0, .02, .05, .1][i], t3e = [14.38, 14.46, 14.6, 14.72][i];
  if (t < t1) return [S[0], S[1], 110, 110, S[2]];
  if (t < t1 + .32) { const u = seg(t, t1, t1 + .32), q = arcLerp(S, Hs, E.oq(u), 90); return [q[0], q[1], lerp(110, 200, u), lerp(110, 68, u), lerp(S[2], Hs[2] + 2 * Math.PI * (i % 2 ? 1 : -1), u)]; }
  if (t < t2) return [Hs[0], Hs[1], 200, 68, Hs[2]];
  if (t < t2 + .3) { const u = seg(t, t2, t2 + .3), q = arcLerp(Hs, Ts, E.io(u), 130); return [q[0], q[1], 200, 68, lerp(Hs[2], Ts[2], u)]; }
  if (t < t3) {   // en la torre (se aplasta al saltar Mochi encima)
    const sq = t > 11.6 && t < 11.9 ? Math.sin(seg(t, 11.6, 11.9) * Math.PI) * 7 * (i + 1) / 4 : 0;
    return [Ts[0], Ts[1] + sq * (4 - i) * .5, 200 + sq, 68 - sq * .6, Ts[2]];
  }
  if (t < t3e) { const u = seg(t, t3, t3e), q = arcLerp(Ts, P, E.iq(u), [-10, 40, 60, 30][i]); return [q[0], q[1], 200, 68, lerp(Ts[2], P[2] + (i % 2 ? .5 : -.4), E.o(u))]; }
  // en la pila (botes al caer Pip y con los tirones)
  let dy = 0;
  if (i === 3 && t > PLAND && t < PLAND + .3) dy = Math.sin(seg(t, PLAND, PLAND + .3) * Math.PI) * 12;
  for (const tg of [...TUGS, PFALL0]) if (t > tg && t < tg + .25) dy -= Math.sin(seg(t, tg, tg + .25) * Math.PI) * 6 * (i === 1 ? 1.4 : .6);
  const settle = t < t3e + .25 ? Math.sin(seg(t, t3e, t3e + .25) * Math.PI) * 8 : 0;
  return [P[0], P[1] + dy + settle, 200 + settle, 68 - settle * .5, P[2] + (i % 2 ? .5 : -.4) * (1 - E.back(seg(t, t3e, t3e + .3)))];
}
function drawCushions(t) { for (let i = 0; i < 4; i++) { const [x, y, w, h, r] = cushionState(i, t); cushion(x, y, w, h, r, CUSH_COL[i]); } }

// ---------- props y efectos ----------
function drawRod(g, ms, t, held) {
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(g.back[0], g.back[1]); ctx.lineTo(g.base[0], g.base[1]); ctx.lineWidth = 15; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#ff9db4'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(g.base[0], g.base[1]); ctx.quadraticCurveTo(g.ctrl[0], g.ctrl[1], g.tip[0], g.tip[1]);
  ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#f2d39b'; ctx.stroke();
  const rx = lerp(g.base[0], g.back[0], .45), ry = lerp(g.base[1], g.back[1], .45);
  ellipse(rx, ry + 10, 11, 11, '#ffe08a', true, 4);
  ctx.save(); ctx.translate(rx, ry + 10); ctx.rotate(t * (ROD.val('len', t) < 897 && t < 2.6 ? 60 : 2)); ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(9, 0); ctx.stroke(); ctx.restore();
  if (held) ellipse(g.base[0] + 4, g.base[1] + 2, 12, 11, C.mouse, true, 4);   // patita de Pip
}
function drawString(a, b) {
  ctx.lineCap = 'round'; ctx.lineWidth = 3.2; ctx.strokeStyle = C.ink;
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
}
function hangingCookie(x, y, rot) {
  cookie(x, y, COOKIE_R, 'full', 0, rot);
  // lazo de cuerda
  ctx.lineWidth = 3.2; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.ellipse(x, y - COOKIE_R - 2, 6, 5, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.save(); ctx.globalAlpha = .55; ellipse(x - 10, y - 12, 7, 4, '#ffffff', false); ctx.restore();
}
function star(x, y, r, rot, col = '#ffe066') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore();
}
function headPos(cs) {
  const lx = 18 * cs.dir * cs.sx, ly = -168 * cs.sy, c = Math.cos(cs.rot), s = Math.sin(cs.rot);
  return [cs.x + lx * c - ly * s, cs.y + lx * s + ly * c];
}
function bonk(t) {
  if (t < 2.76 || t > 3.9) return;
  const u = seg(t, 2.76, 2.94), p = easeOutBack(u) * (1 - seg(t, 3.7, 3.9)), sh = Math.sin(t * 70) * 6 * (1 - seg(t, 2.76, 3.2));
  ctx.save(); ctx.translate(780 + sh, 1170); ctx.rotate(-.12); ctx.scale(p * .82, p * .82);
  ctx.beginPath();   // estallido detrás del texto
  for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12, r = i % 2 ? 105 : 150; ctx.lineTo(Math.cos(a) * r * 1.35, Math.sin(a) * r * .8); }
  ctx.closePath(); ctx.fillStyle = '#fff6c7'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.font = '700 104px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 22; ctx.strokeStyle = C.ink; ctx.strokeText('BONK!', 0, 4);
  ctx.fillStyle = '#ff8fab'; ctx.fillText('BONK!', 0, 4);
  ctx.save(); ctx.globalAlpha = .5; ctx.fillStyle = '#ffffff'; ctx.fillText('BONK!', -3, -1); ctx.restore();
  ctx.fillStyle = '#ff8fab'; ctx.globalAlpha = .55; ctx.fillText('BONK!', 0, 4);
  ctx.restore();
}
function dizzyStars(t, cs, t0, t1) {
  if (t < t0 || t > t1) return;
  const [hx, hy] = headPos(cs), a = seg(t, t0, t0 + .2) * (1 - seg(t, t1 - .2, t1));
  for (let i = 0; i < 4; i++) {
    const an = t * 5 + i * Math.PI / 2;
    ctx.save(); ctx.globalAlpha = a; star(hx + Math.cos(an) * 105, hy - 70 + Math.sin(an) * 26, 17 + (i % 2) * 5, t * 3 + i); ctx.restore();
  }
}
function angerMark(x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + Math.sin(t * 16) * .08), s * (1 + Math.sin(t * 16) * .08));
  ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    ctx.save(); ctx.rotate(i * Math.PI / 2); ctx.beginPath(); ctx.moveTo(6, -22); ctx.quadraticCurveTo(8, -8, 22, -6);
    ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#ff5c7a'; ctx.stroke(); ctx.restore();
  }
  ctx.restore();
}
function dust(x, y, t, t0, dur = .5, s = 1) {
  if (t < t0 || t > t0 + dur) return;
  const u = seg(t, t0, t0 + dur);
  for (let i = 0; i < 4; i++) {
    const sgn = i % 2 ? 1 : -1, d = 30 + i * 18;
    ctx.save(); ctx.globalAlpha = (1 - u) * .9;
    ellipse(x + sgn * (d + u * 60), y - 10 - u * 20 - i * 4, (16 + i * 3) * s * (.6 + u * .6), (13 + i * 2) * s * (.6 + u * .6), '#ffffff', true, 4);
    ctx.restore();
  }
}
function pileTail(t) {   // solo asoma la cola de Mochi
  const tw = Math.sin(t * 7) * .12 + TUGS.concat([PFALL0]).reduce((s, tg) => s + (t > tg && t < tg + .3 ? Math.sin(seg(t, tg, tg + .3) * Math.PI) * .35 : 0), 0);
  const pop = E.back(seg(t, HIDE, HIDE + .3));
  ctx.save(); ctx.translate(640, 1410); ctx.rotate(.55 + tw); ctx.scale(pop, pop);
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(10, -90, -30, -150);
  ctx.lineWidth = 38; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 22; ctx.strokeStyle = C.cat; ctx.stroke();
  ctx.lineWidth = 7; ctx.strokeStyle = C.catDark;
  for (const [x, y] of [[8, -60], [2, -100], [-14, -132]]) { ctx.beginPath(); ctx.moveTo(x - 9, y + 4); ctx.lineTo(x + 9, y - 2); ctx.stroke(); }
  ctx.restore();
}
function pilePaw(t, ms, front) {   // la zarpa que sale de la pila
  if (t < PAW0) return;
  const u = E.back(seg(t, PAW0, PAW0 + .22)), grab = seg(t, GRAB - .05, GRAB + .05);
  const target = [ms.x - 112, ms.y - 44], start = [440, 1450], idle = [400, 1300];
  const tip = [lerp(start[0], lerp(idle[0], target[0], grab), u), lerp(start[1], lerp(idle[1], target[1], grab), u)];
  if (!front) {
    ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(start[0], start[1]); ctx.quadraticCurveTo(start[0] - 30, (start[1] + tip[1]) / 2, tip[0], tip[1] + 10);
    ctx.lineWidth = 46; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 32; ctx.strokeStyle = C.cat; ctx.stroke();
    return;
  }
  const wig = grab < 1 ? Math.sin(t * 20) * .15 : 0;
  ctx.save(); ctx.translate(tip[0], tip[1]); ctx.rotate(wig);
  ellipse(0, 0, 26, 22, C.cat, true, 6);
  if (grab >= 1) { ctx.lineWidth = 4; ctx.strokeStyle = C.ink; for (const dx of [-9, 0, 9]) { ctx.beginPath(); ctx.moveTo(dx, -20); ctx.lineTo(dx, -8); ctx.stroke(); } }
  else for (const dx of [-12, 0, 12]) ellipse(dx, -18, 7, 6, C.pink, true, 3);
  ctx.restore();
}
function drawArm(cs, t, ck) {
  if (!(cs.arm > 1) || t >= FALL1 + .1) return;
  const g = armGeom(cs, t, ck), wig = t < 13.8 ? Math.sin(t * 13) * 6 : 0;
  const tip = [g.tip[0] + wig, g.tip[1]];
  ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(g.sh[0], g.sh[1]); ctx.lineTo(tip[0], tip[1]);
  ctx.lineWidth = 40; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 27; ctx.strokeStyle = C.cat; ctx.stroke();
  ctx.save(); ctx.translate(tip[0], tip[1]); ctx.rotate(g.a + Math.PI / 2);
  ellipse(0, 0, 22, 20, C.cat, true, 6);
  for (const dx of [-10, 0, 10]) ellipse(dx, -12, 5, 5, C.pink, false);
  ctx.restore();
}

// ---------- fotograma ----------
function render(t) {
  const tf = Math.round(t * 60) / 60, shot = shotAt(tf + 1e-6), cam = CAMS[shot];
  LWF = shot === 'cu' ? .6 / Math.pow(cam.s, .7) : .78 / Math.pow(cam.s, .55);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#fff8f1'; ctx.fillRect(0, 0, W, H);

  if (shot === 'cu') {   // Planos 1 y final: ojos enormes + galleta colgando delante de la nariz
    const tl = cuT(t), off = cuOff(tl), cs = catState(t);
    withCamera(cam, () => {
      drawLiving(tl < 0 ? tl + 2 : tl);
      drawCat(cs, tl);
      const ck = [CUX + 29 + off * 46, 1368 - off * off * 4];
      drawString([CUX + 29, 900], [ck[0], ck[1] - COOKIE_R - 6]);
      hangingCookie(ck[0], ck[1], off * .25);
    });
    return;
  }
  const cs = catState(t), ms = mouseState(t);
  const ck = cookiePos(t, cs), rod = rodAt(t), held = t < DROP;
  withCamera(cam, () => {
    drawLiving(t);
    const catVisible = t < HIDE;
    if (t < FALL0) drawCushions(t);
    if (catVisible) { drawArm(cs, t, ck); drawCat(cs, t); }
    if (t >= HIDE) { pileTail(t); pilePaw(t, ms, false); }
    if (t >= FALL0) drawCushions(t);
    // galleta + cuerda
    if (t < FALL1 + .05) { drawString(rod.tip, [ck[0], ck[1] - COOKIE_R - 6]); hangingCookie(ck[0], ck[1], Math.sin(t * 2.2) * .15); }
    else drawString(rod.tip, [COOKIE_PILE[0] + 10, PILE_TOP + 40]);
    drawMouse(ms, t);
    drawRod(rod, ms, t, held);
    if (t >= HIDE) pilePaw(t, ms, true);
    // efectos
    bonk(t); dizzyStars(t, cs, 2.85, 5.6);
    dust(CUX, FLOOR, t, 2.3, .4, .8); dust(870, FLOOR, t, 2.76, .6, 1.2);
    if (shot === 'glare' && t > 8.15) angerMark(650, 1175, 1.1, t);
    for (let k = 0; k < 6; k++) dust(cs.x + 30, FLOOR, t, 9.55 + k * .12, .35, .6);
    for (let i = 0; i < 4; i++) dust(TOWER_X, FLOOR - 4 * 68 + (3 - i) * 68, t, 10.58 + i * .15, .3, .5);
    dust(TOWER_X, TOWER_TOP, t, 11.6, .45, .9);
    if (t > 13.78 && t < 14.2) { const u = seg(t, 13.78, 14.2); sparkle(ck[0] + 30, ck[1] - 30, 1.3 * Math.sin(u * Math.PI), 1, '#fff3a3'); sparkle(ck[0] - 34, ck[1] + 10, .8 * Math.sin(u * Math.PI), 1, '#fff3a3'); }
    if (t > FALL1 - .05 && t < 15.1) { const u = seg(t, FALL1 - .05, 15.1); for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; cloud(520 + Math.cos(a) * (90 + u * 160), 1360 + Math.sin(a) * (50 + u * 70), .9 + u * .5, (1 - u)); } }
    if (t > PLAND && t < PLAND + .3) dust(505, PILE_TOP + 10, t, PLAND, .3, .6);
    if (t > DROP + .3 && t < DROP + .7) for (let i = 0; i < 3; i++) sparkle(720 + i * 40, FLOOR - 40 - i * 20, .5 * Math.sin(seg(t, DROP + .3, DROP + .7) * Math.PI));
    if (t > GRAB && t < GRAB + .35) { const u = seg(t, GRAB, GRAB + .35); for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .45; ctx.save(); ctx.globalAlpha = 1 - u; ctx.lineCap = 'round'; ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(ms.x + 40 + Math.cos(a) * (90 + u * 30), ms.y - 70 + Math.sin(a) * (90 + u * 30)); ctx.lineTo(ms.x + 40 + Math.cos(a) * (120 + u * 40), ms.y - 70 + Math.sin(a) * (120 + u * 40)); ctx.stroke(); ctx.restore(); } }
  });
}
startEpisode(render);
