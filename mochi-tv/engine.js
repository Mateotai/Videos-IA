// =====================================================================
//  MOTOR DE ANIMACIÓN "Mochi & Pip" (estilo serie de TV, cut-out 2D)
//  Lo comparten todos los episodios. Cada episodio define antes de usarlo:
//    DURATION, C, M (Rig), SIM_C, SIM_M, groundAt(x,y,t), drawWorld(t), drawOverlay(c,t)
// =====================================================================
const W = 1080, H = 1920;
const out = document.getElementById('out');
const octx = out.getContext('2d');
const work = document.createElement('canvas'); work.width = W; work.height = H;
let ctx = work.getContext('2d');

// ---------- utilidades ----------
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const rnd = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const E = {
  io: p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2,
  o: p => 1 - Math.pow(1 - p, 3), i: p => p * p * p,
  oq: p => 1 - (1 - p) * (1 - p), iq: p => p * p, lin: p => p,
  back: p => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  hold: p => p < 1 ? 0 : 1,
};
const easeOutBack = E.back;

// ---------- sistema de fotogramas clave ----------
class Rig {
  constructor(def) { this.d = def; this.k = {}; }
  key(t, vals, e = 'io') { for (const n in vals) (this.k[n] ||= []).push({ t, v: vals[n], e }); return this; }
  done() { for (const n in this.k) this.k[n].sort((a, b) => a.t - b.t); return this; }
  val(n, t) {
    const ks = this.k[n]; if (!ks) return this.d[n];
    if (t <= ks[0].t) return ks[0].v;
    const last = ks[ks.length - 1]; if (t >= last.t) return last.v;
    let lo = 0, hi = ks.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (ks[mid].t < t) lo = mid; else hi = mid; }
    const a = ks[lo], b = ks[hi];
    if (b.t === a.t) return b.v;
    return a.v + (b.v - a.v) * E[b.e]((t - a.t) / (b.t - a.t));
  }
  pose(t) { const o = {}; for (const n in this.d) o[n] = this.val(n, t); return o; }
}

// ---------- paleta ----------
const INK = '#3a2a35';
const K_CAT = { base: '#ffab4f', shade: '#f08a2b', line: '#c4661c', belly: '#fff4e2', bellyS: '#f3d9bb', stripe: '#ec8224', pink: '#ff9db2', pinkS: '#ef7f99' };
const K_MOUSE = { base: '#c6bfdf', shade: '#a79ec9', line: '#7b71a6', belly: '#f1edfb', bellyS: '#dad3ef', pink: '#ffb3c4', pinkS: '#f08fa6', tail: '#ffa7bb' };

// ---------- dibujo con sombreado tipo serie ----------
let FACE = 1;
function cel(path, base, shade, line, lw = 6, sdx = -13, sdy = -12) {
  path(); ctx.fillStyle = shade; ctx.fill();
  ctx.save(); path(); ctx.clip(); ctx.translate(sdx * FACE, sdy); path(); ctx.fillStyle = base; ctx.fill(); ctx.restore();
  if (line) { path(); ctx.lineWidth = lw; ctx.strokeStyle = line; ctx.lineJoin = 'round'; ctx.stroke(); }
}
const ell = (x, y, rx, ry, rot = 0) => () => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(rx, .1), Math.max(ry, .1), rot, 0, Math.PI * 2); };
function fillEll(x, y, rx, ry, col, a = 1) { ctx.save(); ctx.globalAlpha *= a; ell(x, y, rx, ry)(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
function softShadow(x, y, rx, ry, a = .28) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, `rgba(90,45,30,${a})`); g.addColorStop(.6, `rgba(90,45,30,${a * .5})`); g.addColorStop(1, 'rgba(90,45,30,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
function heartPath(s) { return () => { ctx.beginPath(); ctx.moveTo(0, 12 * s); ctx.bezierCurveTo(-26 * s, -6 * s, -18 * s, -30 * s, 0, -16 * s); ctx.bezierCurveTo(18 * s, -30 * s, 26 * s, -6 * s, 0, 12 * s); ctx.closePath(); }; }
function heart(x, y, s, base = '#ff4d6d', shade = '#e0294f', a = 1) {
  if (s <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  const sv = FACE; FACE = 1;
  cel(heartPath(s), base, shade, '#a3163a', 3.5 * Math.min(1, s * 1.5), -4 * s, -5 * s);
  fillEll(-7 * s, -10 * s, 4 * s, 3 * s, '#ffffff', .8);
  FACE = sv; ctx.restore();
}
function sparkle(x, y, s, a = 1, col = '#fff6c2') {
  if (s <= 0.01 || a <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 34); g.addColorStop(0, 'rgba(255,250,210,.8)'); g.addColorStop(1, 'rgba(255,250,210,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 34, 0, 7); ctx.fill();
  ctx.beginPath();
  for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4, r = i % 2 ? 6 : 24; ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r); }
  ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  ctx.restore();
}

// ---------- galleta ----------
const CHIPS = [[-.42, -.3], [.3, -.42], [.05, .05], [-.38, .38], [.42, .3], [-.02, -.68], [-.08, .66], [.62, -.05]];
function cookie(x, y, r, part = 'full', bite = 0, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const sv = FACE; FACE = 1;
  const path = () => {
    ctx.beginPath();
    if (part === 'full') { ctx.arc(0, 0, r, 0, Math.PI * 2); return; }
    const sgn = part === 'left' ? -1 : 1;
    ctx.moveTo(0, -r); ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, sgn < 0);
    for (let i = 6; i >= 0; i--) ctx.lineTo((i % 2 ? 8 : -4) * -sgn * .6, -r + (2 * r * i) / 6);
    ctx.closePath();
  };
  cel(path, '#e9ad62', '#cf8b3d', '#9b5d23', 5, -5, -6);
  ctx.save(); path(); ctx.clip();
  for (const [cx, cy] of CHIPS) { fillEll(cx * r, cy * r, r * .12, r * .1, '#5a3420'); fillEll(cx * r - r * .03, cy * r - r * .03, r * .04, r * .03, '#8a5a3c'); }
  ctx.globalAlpha = .35; fillEll(-r * .3, -r * .35, r * .35, r * .2, '#fff3d8');
  if (bite > 0) {
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'destination-out';
    const sgn = part === 'left' ? -1 : 1;
    for (let i = 0; i < 3; i++) fillEll(sgn * r * .95, -r * .45 + i * r * .45, r * .5 * bite, r * .34 * bite, '#000');
  }
  ctx.restore();
  FACE = sv; ctx.restore();
}

const BASE = { cross: 0, x: 0, y: 0, turn: .45, lean: 0, sx: 1, sy: 1, hTilt: 0, hLift: 0, lookX: .3, lookY: 0, lid: .05, happy: 0, eyeS: 1, pupS: 1, heart: 0, dizzy: 0, sad: 0, browA: 0, browY: 0, mouthO: 0, smile: .5, tongue: 0, chew: 0, puff: 0, aR: -12, aL: -12, bR: .3, bL: .3, rR: 1, rL: 1, walk: 0, walkLift: 0, earDroop: 0, tailWag: .4, sway: 0, blush: .5, tears: 0, sniff: 0, hidden: 0 };
const NEUT = { heart: 0, happy: 0, sad: 0, dizzy: 0, eyeS: 1, pupS: 1, browA: 0, browY: 0, mouthO: 0, smile: .5, tongue: 0, tears: 0, earDroop: 0, puff: 0, lid: .05 };

// ---------- animación secundaria (muelles), precalculada ----------
const SIM_DT = 1 / 240;
function simulate(rig) {
  const N = Math.ceil((DURATION + 1) / SIM_DT);
  const F = ['hx', 'hy', 'sq', 'st', 'ear', 'ld', 'ph', 't0', 't1', 't2', 't3', 't4'];
  const o = {}; for (const f of F) o[f] = new Float32Array(N);
  let hx = 0, hvx = 0, hy = 0, hvy = 0, sq = 0, sv = 0, ear = 0, ev = 0, ld = 0, lv = 0, ph = 0;
  const ta = [0, 0, 0, 0, 0], tv = [0, 0, 0, 0, 0];
  let px = rig.val('x', 0), py = rig.val('y', 0), pvx = 0, pvy = 0;
  const cl = (v, m) => Math.max(-m, Math.min(m, v));
  for (let i = 0; i < N; i++) {
    const t = i * SIM_DT;
    const x = rig.val('x', t), y = rig.val('y', t);
    let vx = (x - px) / SIM_DT, vy = (y - py) / SIM_DT;
    if (i === 0) { vx = 0; vy = 0; }
    vx = cl(vx, 4000); vy = cl(vy, 4000);
    const dvx = vx - pvx, dvy = vy - pvy;
    px = x; py = y;
    // cabeza con retraso
    hvx += -dvx * .22; hvy += -dvy * .18;
    hvx += (-320 * hx - 13 * hvx) * SIM_DT; hvy += (-320 * hy - 13 * hvy) * SIM_DT;
    hx = cl(hx + hvx * SIM_DT, 34); hy = cl(hy + hvy * SIM_DT, 34);
    // aplastar al aterrizar
    if (pvy > 250 && dvy < 0) sv += dvy * .0028;
    sv += (-420 * sq - 11 * sv) * SIM_DT; sq = cl(sq + sv * SIM_DT, .32);
    const st = Math.min(.16, Math.abs(vy) * .00011);
    // orejas
    ev += dvy * .0011 + dvx * .0004;
    ev += (-260 * ear - 7 * ev) * SIM_DT; ear = cl(ear + ev * SIM_DT, .7);
    // inercia del cuerpo
    lv += -dvx * .00035;
    lv += (-220 * ld - 11 * lv) * SIM_DT; ld = cl(ld + lv * SIM_DT, .3);
    // cola en cadena
    tv[0] += dvx * .0012 + dvy * .0005;
    tv[0] += (-180 * ta[0] - 6 * tv[0]) * SIM_DT; ta[0] = cl(ta[0] + tv[0] * SIM_DT, 1.2);
    for (let j = 1; j < 5; j++) { tv[j] += (160 * (ta[j - 1] - ta[j]) - 5 * tv[j]) * SIM_DT; ta[j] = cl(ta[j] + tv[j] * SIM_DT, 1.4); }
    ph += Math.PI * 2 * rig.val('walk', t) * SIM_DT;
    pvx = vx; pvy = vy;
    o.hx[i] = hx; o.hy[i] = hy; o.sq[i] = sq; o.st[i] = st; o.ear[i] = ear; o.ld[i] = ld; o.ph[i] = ph;
    o.t0[i] = ta[0]; o.t1[i] = ta[1]; o.t2[i] = ta[2]; o.t3[i] = ta[3]; o.t4[i] = ta[4];
  }
  o.N = N; return o;
}
function simAt(o, t) {
  const f = clamp(t, 0, DURATION + .9) / SIM_DT, i = Math.floor(f), a = f - i, j = Math.min(i + 1, o.N - 1);
  const r = {}; for (const key in o) if (key !== 'N') r[key] = o[key][i] * (1 - a) + o[key][j] * a;
  return r;
}
// parpadeos naturales
function blink(t, seed) {
  for (let n = 0; n < 12; n++) {
    const bt = 1.2 + n * 2.6 + rnd(n + seed) * 1.3;
    const d = t - bt; if (d > 0 && d < .16) return Math.sin(Math.PI * d / .16);
  }
  return 0;
}

// =====================================================================
//  GEOMETRÍA DEL RIG
// =====================================================================
function geom(rig, sim, t, scale = 1) {
  const P = rig.pose(t), S = simAt(sim, t);
  const face = P.turn >= 0 ? 1 : -1, tr = Math.abs(P.turn);
  const breath = Math.sin(t * Math.PI * 2 * .45);
  const wl = P.walkLift, bob = -Math.abs(Math.sin(S.ph)) * 14 * wl;
  const lean = P.lean + P.sway * Math.sin(t * Math.PI * 2 * 1.1) + S.ld;
  const sx = P.sx * (1 - S.sq * .6) * (1 - breath * .008) * (1 - S.st * .5) * scale;
  const sy = P.sy * (1 + S.sq + S.st) * (1 + breath * .012) * scale;
  return { P, S, face, tr, lean, sx, sy, x: P.x, y: P.y + bob, wl, ph: S.ph, scale };
}
function toW(g, lx, ly) {
  const X = lx * g.face * g.sx, Y = ly * g.sy, c = Math.cos(g.lean), s = Math.sin(g.lean);
  return { x: g.x + X * c - Y * s, y: g.y + X * s + Y * c };
}
function armHand(sh, a, r, side, len) {
  const an = a * Math.PI / 180, L = len * r;
  return { x: sh.x + side * Math.sin(an) * L, y: sh.y + Math.cos(an) * L };
}
const CAT_RIG = { shR: [50, -98], shL: [-44, -98], arm: 66, head: [10, -170] };
const MOUSE_RIG = { shR: [30, -66], shL: [-26, -66], arm: 44, head: [10, -128] };
function armAngles(g, side) {
  const P = g.P, sw = Math.sin(g.ph) * 35 * g.wl;
  return side > 0 ? { a: P.aR + sw, b: P.bR, r: P.rR } : { a: P.aL - sw, b: P.bL, r: P.rL };
}
function hands(g, R) {
  const res = {};
  for (const [nm, side, sh] of [['R', 1, R.shR], ['L', -1, R.shL]]) {
    const ag = armAngles(g, side), s = { x: sh[0] + g.tr * 8, y: sh[1] };
    const h = armHand(s, ag.a, ag.r, side, R.arm);
    res[nm] = toW(g, h.x, h.y);
  }
  res.mid = { x: (res.R.x + res.L.x) / 2, y: (res.R.y + res.L.y) / 2 };
  return res;
}

// ---------- piezas comunes ----------
function drawArm(g, side, R, K) {
  const ag = armAngles(g, side), s = { x: R.shR[0] * (side > 0 ? 1 : 0) + R.shL[0] * (side > 0 ? 0 : 1) + g.tr * 8, y: R.shR[1] };
  const h = armHand(s, ag.a, ag.r, side, R.arm);
  const mx = (s.x + h.x) / 2, my = (s.y + h.y) / 2, dx = h.x - s.x, dy = h.y - s.y, L = Math.hypot(dx, dy) || 1;
  const cx = mx - dy / L * ag.b * 26 * side, cy = my + dx / L * ag.b * 26 * side;
  const w = R === CAT_RIG ? 26 : 18;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.quadraticCurveTo(cx, cy, h.x, h.y);
  ctx.lineWidth = w + 9; ctx.strokeStyle = K.line; ctx.stroke();
  ctx.lineWidth = w; ctx.strokeStyle = K.base; ctx.stroke();
  const pr = R === CAT_RIG ? 15 : 11;
  cel(ell(h.x, h.y, pr, pr * .92), K.belly, K.bellyS, K.line, 5, -4, -4);
}
function drawEye(cx, cy, rx, ry, P0, t, K, kind, seed, side = 0) {
  const P = side && P0.cross ? { ...P0, lookX: P0.lookX - side * P0.cross * .95 } : P0;
  const bl = blink(t, seed) * (1 - P.heart) * (1 - P.happy) * (1 - P.dizzy) * clamp(1.3 - P.eyeS);
  if (P.happy > .5) {
    ctx.beginPath(); ctx.moveTo(cx - rx, cy + 6); ctx.quadraticCurveTo(cx, cy - ry * .9, cx + rx, cy + 6);
    ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); return;
  }
  const bead = kind === 'mouse' && P.eyeS < 1.25 && P.dizzy < .5;
  if (bead) {
    const px = cx + P.lookX * 3, py = cy + P.lookY * 3, pr = 1 - P.heart;
    if (pr > .02) {
      ell(px, py, rx * .78 * pr, ry * .82 * pr)(); ctx.fillStyle = '#2b1f2e'; ctx.fill();
      fillEll(px - rx * .25, py - ry * .3, rx * .3 * pr, rx * .3 * pr, '#fff'); fillEll(px + rx * .22, py + ry * .25, rx * .13 * pr, rx * .13 * pr, '#fff');
    }
    if (P.heart > 0) heart(px, py, P.heart * .62 * (1 + .08 * Math.sin(t * 14)));
    const lid = clamp(P.lid + bl);
    if (lid > .02) { ctx.save(); ell(px, py, rx * .85, ry * .9)(); ctx.clip(); ctx.fillStyle = K.base; ctx.fillRect(px - rx, py - ry, rx * 2, ry * 1.85 * lid); ctx.restore(); }
    return;
  }
  ell(cx, cy, rx, ry)(); ctx.fillStyle = '#ffffff'; ctx.fill();
  ctx.save(); ell(cx, cy, rx, ry)(); ctx.clip();
  fillEll(cx, cy + ry * .55, rx * 1.1, ry * .5, '#e8e2ef', .55);
  if (P.dizzy > .5) {
    ctx.beginPath(); for (let a = 0; a < 13; a += .25) ctx.lineTo(cx + Math.cos(a + t * 9) * a * rx * .07, cy + Math.sin(a + t * 9) * a * ry * .06);
    ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  } else {
    const px = cx + P.lookX * rx * .36, py = cy + P.lookY * ry * .34, pr = 1 - P.heart;
    if (pr > .02) {
      const prx = rx * .62 * P.pupS * pr / Math.max(1, P.eyeS * .85), pry = ry * .64 * P.pupS * pr / Math.max(1, P.eyeS * .85);
      ell(px, py, prx, pry)(); ctx.fillStyle = '#2b1f2e'; ctx.fill();
      fillEll(px - prx * .35, py - pry * .4, prx * .42, prx * .42, '#ffffff');
      fillEll(px + prx * .38, py + pry * .35, prx * .18, prx * .18, '#ffffff');
      if (P.sad > 0) { fillEll(px + prx * .1, py - pry * .05, prx * .2, prx * .2, '#ffffff', P.sad); fillEll(cx, cy + ry * .8, rx, ry * .35, '#9fdcff', .5 * P.sad); }
    }
    if (P.heart > 0) heart(px, py, P.heart * rx / 26 * (1 + .08 * Math.sin(t * 14)));
  }
  const lid = clamp(P.lid + bl);
  if (lid > .02) {
    const ly = cy - ry + ry * 2 * lid;
    ctx.beginPath(); ctx.moveTo(cx - rx - 2, cy - ry - 2); ctx.lineTo(cx + rx + 2, cy - ry - 2); ctx.lineTo(cx + rx + 2, ly); ctx.quadraticCurveTo(cx, ly + ry * .25, cx - rx - 2, ly); ctx.closePath();
    ctx.fillStyle = K.base; ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx - rx - 2, ly); ctx.quadraticCurveTo(cx, ly + ry * .25, cx + rx + 2, ly); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  }
  ctx.restore();
  ell(cx, cy, rx, ry)(); ctx.lineWidth = 4.5; ctx.strokeStyle = INK; ctx.stroke();
}
function drawBrow(ex, ey, inner, P, K, len = 15) {
  const a = Math.min(1, Math.abs(P.browA) * 1.6 + Math.abs(P.browY) * .8); if (a < .03) return;
  const y = ey + P.browY * 7;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(ex + inner * len, y - P.browA * 9); ctx.quadraticCurveTo(ex, y - 5 - Math.abs(P.browA) * 2, ex - inner * len, y + P.browA * 8);
  ctx.lineWidth = 7; ctx.strokeStyle = K.line; ctx.stroke(); ctx.restore();
}
function drawMouth(mx, my, w, P, t) {
  const chewO = P.chew * (.5 + .5 * Math.sin(t * Math.PI * 2 * 3.2)) * .42;
  const o = clamp(P.mouthO + chewO), sm = P.smile;
  const cy = my - sm * 7;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o < .06) {
    ctx.beginPath(); ctx.moveTo(mx - w, cy); ctx.quadraticCurveTo(mx - w / 2, my + 7 + sm * 4, mx, my); ctx.quadraticCurveTo(mx + w / 2, my + 7 + sm * 4, mx + w, cy);
    ctx.lineWidth = 4.5; ctx.strokeStyle = INK; ctx.stroke(); return;
  }
  const depth = 8 + o * 44, ww = w * (1 + o * .15);
  const path = () => { ctx.beginPath(); ctx.moveTo(mx - ww, cy); ctx.quadraticCurveTo(mx - ww / 2, my + 4, mx, my); ctx.quadraticCurveTo(mx + ww / 2, my + 4, mx + ww, cy); ctx.quadraticCurveTo(mx + ww * .6, my + depth + sm * 6, mx, my + depth + Math.max(0, sm) * 6); ctx.quadraticCurveTo(mx - ww * .6, my + depth + sm * 6, mx - ww, cy); ctx.closePath(); };
  path(); ctx.fillStyle = '#7d2c3f'; ctx.fill();
  ctx.save(); path(); ctx.clip(); fillEll(mx, my + depth + 2, ww * .65, 6 + depth * .35 * (.4 + P.tongue), '#ff7f98'); ctx.restore();
  path(); ctx.lineWidth = 4.5; ctx.strokeStyle = INK; ctx.stroke();
}
function drawTears(ex, ey, P, t, side) {
  if (P.tears < .02) return;
  ctx.save(); ctx.globalAlpha *= P.tears;
  ctx.lineCap = 'round'; ctx.lineWidth = 9; ctx.strokeStyle = 'rgba(140,210,255,.75)';
  ctx.beginPath(); ctx.moveTo(ex, ey); ctx.quadraticCurveTo(ex + side * 10, ey + 50, ex + side * 4, ey + 95); ctx.stroke();
  for (let n = 0; n < 2; n++) {
    const ph = (t * 1.5 + n * .5) % 1;
    ctx.globalAlpha = P.tears * (1 - ph);
    cel(ell(ex + side * 6, ey + 30 + ph * 120, 7, 10), '#bfe9ff', '#7fcbf5', '#4f9ccc', 2.5, -2, -2);
  }
  ctx.restore();
}

// =====================================================================
//  MOCHI
// =====================================================================
function drawCat(t, heldFn) {
  const g = geom(C, SIM_C, t), P = g.P, S = g.S, K = K_CAT, R = CAT_RIG;
  FACE = g.face;
  // sombra en el suelo
  const gy = groundAt(g.x, P.y, t);
  softShadow(P.x, gy + 4, 92 * clamp(1 - (gy - P.y) / 600, .4, 1), 18, .3 * clamp(1 - (gy - P.y) / 500, .25, 1));
  ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.lean); ctx.scale(g.face * g.sx, g.sy);
  const tr = g.tr;
  // cola
  {
    let x = -62, y = -42; const pts = [[x, y]];
    const wag = Math.sin(t * Math.PI * 2 * 1.4) * .5 * P.tailWag;
    const base = 1.05 - P.earDroop * .9;
    const angs = [S.t0, S.t1, S.t2, S.t3, S.t4];
    for (let i = 0; i < 5; i++) {
      const phi = base + wag * (0.3 + i * .25) + angs[i] * .6 - i * (.18 - P.earDroop * .25);
      x += -Math.sin(phi) * 34; y += -Math.cos(phi) * 34; pts.push([x, y]);
    }
    const tail = (w, col) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) ctx.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); ctx.lineTo(pts[5][0], pts[5][1]); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke(); };
    tail(31, K.line); tail(22, K.base);
    ctx.save(); ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.strokeStyle = K.stripe;
    ctx.beginPath(); ctx.moveTo(pts[4][0], pts[4][1]); ctx.lineTo(pts[5][0], pts[5][1]); ctx.stroke(); ctx.restore();
  }
  // brazo trasero
  drawArm(g, -1, R, K);
  // cuerpo
  const body = () => { ctx.beginPath(); ctx.moveTo(-72, -14); ctx.bezierCurveTo(-90, -70, -72, -140, -6, -146); ctx.bezierCurveTo(58, -148, 90, -86, 76, -22); ctx.bezierCurveTo(70, 4, -62, 8, -72, -14); ctx.closePath(); };
  cel(body, K.base, K.shade, K.line, 6);
  ctx.save(); body(); ctx.clip();
  ctx.lineCap = 'round'; ctx.lineWidth = 10; ctx.strokeStyle = K.stripe;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-74, -60 - i * 26); ctx.quadraticCurveTo(-52, -66 - i * 26, -44, -78 - i * 26); ctx.stroke(); }
  cel(ell(14 + tr * 10, -62, 46, 52), K.belly, K.bellyS, null);
  ctx.restore();
  // patas
  for (const [side, x0] of [[-1, -32], [1, 34]]) {
    const p = g.ph + (side > 0 ? 0 : Math.PI);
    const lift = Math.max(0, Math.sin(p)) * 24 * g.wl, step = Math.cos(p) * 18 * g.wl;
    cel(ell(x0 + step + tr * 6, -8 - lift, 31, 15), K.base, K.shade, K.line, 5, -5, -5);
    ctx.lineWidth = 3.5; ctx.strokeStyle = K.line; ctx.lineCap = 'round';
    for (const d of [-8, 8]) { ctx.beginPath(); ctx.moveTo(x0 + step + tr * 6 + d + 12, -14 - lift); ctx.lineTo(x0 + step + tr * 6 + d + 12, -4 - lift); ctx.stroke(); }
  }
  // cabeza
  ctx.save();
  ctx.translate(R.head[0] + tr * 10 + S.hx * g.face, R.head[1] + S.hy * .8 - P.earDroop * 6);
  ctx.rotate(P.hTilt - P.hLift * .2 + Math.sin(t * 1.7) * .02);
  const fx = tr * 26, fy = -P.hLift * 16 + P.lookY * 2;
  // orejas
  for (const side of [-1, 1]) {
    const far = side < 0 ? 1 - tr * .2 : 1;
    ctx.save(); ctx.translate(side * 54 + fx * .35, -58);
    ctx.rotate(side * (.22 + P.earDroop * 1.0) + S.ear * side + Math.sin(t * 2.3 + side) * .02);
    ctx.scale(side * far, 1);
    cel(() => { ctx.beginPath(); ctx.moveTo(-32, 10); ctx.quadraticCurveTo(-28, -50, -4, -88); ctx.quadraticCurveTo(4, -96, 12, -86); ctx.quadraticCurveTo(32, -42, 34, 10); ctx.closePath(); }, K.base, K.shade, K.line, 6, -6, -6);
    ctx.beginPath(); ctx.moveTo(-18, 2); ctx.quadraticCurveTo(-14, -40, 0, -68); ctx.quadraticCurveTo(14, -36, 18, 2); ctx.closePath(); ctx.fillStyle = K.pink; ctx.fill();
    ctx.restore();
  }
  const puff = P.puff + P.chew * .35 * (.5 + .5 * Math.sin(t * Math.PI * 2 * 3.2 + 1.5));
  const head = () => {
    ctx.beginPath(); ctx.moveTo(0, -92);
    ctx.bezierCurveTo(70, -92, 108, -56, 108, -8);
    ctx.lineTo(122 + puff * 10, 18); ctx.lineTo(104, 26); ctx.lineTo(114 + puff * 10, 46);
    ctx.bezierCurveTo(90 + puff * 8, 86, 44, 94, 0, 94);
    ctx.bezierCurveTo(-44, 94, -90 - puff * 8, 86, -114 - puff * 10, 46);
    ctx.lineTo(-104, 26); ctx.lineTo(-122 - puff * 10, 18); ctx.lineTo(-108, -8);
    ctx.bezierCurveTo(-108, -56, -70, -92, 0, -92); ctx.closePath();
  };
  cel(head, K.base, K.shade, K.line, 6, -14, -14);
  // rayitas de la frente
  ctx.lineCap = 'round'; ctx.lineWidth = 9; ctx.strokeStyle = K.stripe;
  for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(fx + i * 20, -88); ctx.lineTo(fx + i * 16, -64 + Math.abs(i) * 6); ctx.stroke(); }
  // mejillas
  fillEll(fx - 62 + tr * 10, 32 + fy * .3, 19, 11, '#ff8fa8', .45 * P.blush);
  fillEll(fx + 62 + tr * 4, 32 + fy * .3, 19, 11, '#ff8fa8', .45 * P.blush);
  // ojos
  const eyeY = -6 + fy, nearX = fx + 40, farX = fx - 36 + tr * 4, farS = 1 - tr * .22;
  drawEye(farX, eyeY, 23 * farS * P.eyeS, 28 * P.eyeS, P, t, K, 'cat', 3, -1);
  drawEye(nearX, eyeY, 23 * P.eyeS, 28 * P.eyeS, P, t, K, 'cat', 3, 1);
  drawBrow(farX, eyeY - 30 * P.eyeS - 8, 1, P, K, 13 * farS);
  drawBrow(nearX, eyeY - 30 * P.eyeS - 8, -1, P, K, 15);
  drawTears(farX, eyeY + 20, P, t, -1); drawTears(nearX, eyeY + 20, P, t, 1);
  // hocico, nariz, boca, bigotes
  const mzY = 30 + fy * .6;
  fillEll(fx - 15, mzY, 20, 15, K.belly); fillEll(fx + 15, mzY, 20, 15, K.belly);
  drawMouth(fx, mzY + 6, 20, P, t);
  cel(() => { ctx.beginPath(); ctx.moveTo(fx - 11, mzY - 16); ctx.quadraticCurveTo(fx, mzY - 22, fx + 11, mzY - 16); ctx.quadraticCurveTo(fx + 8, mzY - 6, fx, mzY - 3); ctx.quadraticCurveTo(fx - 8, mzY - 6, fx - 11, mzY - 16); ctx.closePath(); }, K.pink, K.pinkS, '#b9506a', 3, -2, -2);
  ctx.lineWidth = 3; ctx.strokeStyle = K.line;
  for (const s of [-1, 1]) for (const a of [-.16, 0, .16]) {
    const w = Math.sin(t * 3 + a * 10) * .04;
    ctx.beginPath(); ctx.moveTo(fx + s * 30, mzY + a * 20); ctx.lineTo(fx + s * 88, mzY - 6 + (a + w) * 120); ctx.stroke();
  }
  ctx.restore(); // cabeza
  ctx.restore();
  if (heldFn) heldFn(g);
  ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.lean); ctx.scale(g.face * g.sx, g.sy);
  drawArm(g, 1, R, K);
  ctx.restore();
  return g;
}

// =====================================================================
//  PIP
// =====================================================================
const MS = .8;
function drawMouse(t, heldFn) {
  const g = geom(M, SIM_M, t, MS), P = g.P, S = g.S, K = K_MOUSE, R = MOUSE_RIG;
  FACE = g.face;
  if (P.hidden < .5) { const gy = groundAt(g.x, P.y, t); softShadow(P.x, gy + 3, 50 * clamp(1 - (gy - P.y) / 600, .4, 1), 11, .28 * clamp(1 - (gy - P.y) / 500, .25, 1)); }
  ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.lean); ctx.scale(g.face * g.sx, g.sy);
  const tr = g.tr;
  // cola larga
  {
    let x = -36, y = -18; const pts = [[x, y]];
    const angs = [S.t0, S.t1, S.t2, S.t3, S.t4];
    for (let i = 0; i < 6; i++) {
      const phi = 1.75 + Math.sin(t * 5.5 - i * .7) * .28 * P.tailWag + angs[Math.min(i, 4)] * .7 - i * .22;
      x += -Math.sin(phi) * 26; y += -Math.cos(phi) * 26; pts.push([x, y]);
    }
    const tail = (w, col) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) ctx.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); ctx.lineTo(pts[6][0], pts[6][1]); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke(); };
    tail(13, K.line); tail(7, K.tail);
  }
  drawArm(g, -1, R, K);
  const body = () => { ctx.beginPath(); ctx.moveTo(-40, -8); ctx.bezierCurveTo(-54, -50, -34, -94, 0, -96); ctx.bezierCurveTo(36, -97, 56, -50, 42, -8); ctx.bezierCurveTo(36, 4, -34, 6, -40, -8); ctx.closePath(); };
  cel(body, K.base, K.shade, K.line, 6, -9, -9);
  ctx.save(); body(); ctx.clip(); cel(ell(8 + tr * 6, -40, 26, 32), K.belly, K.bellyS, null, 0, -5, -5); ctx.restore();
  for (const [side, x0] of [[-1, -20], [1, 22]]) {
    const p = g.ph + (side > 0 ? 0 : Math.PI);
    const lift = Math.max(0, Math.sin(p)) * 18 * g.wl, step = Math.cos(p) * 12 * g.wl;
    cel(ell(x0 + step + tr * 5, -6 - lift, 20, 10), K.shade, K.line, K.line, 4, -3, -3);
    cel(ell(x0 + step + tr * 5, -6 - lift, 20, 10), K.base, K.shade, K.line, 4, -3, -3);
  }
  // cabeza
  ctx.save();
  ctx.translate(R.head[0] + tr * 8 + S.hx * g.face / MS, R.head[1] + S.hy * .8 / MS);
  ctx.rotate(P.hTilt - P.hLift * .22 + Math.sin(t * 2.1) * .025);
  const fx = tr * 20, fy = -P.hLift * 14;
  for (const side of [-1, 1]) {
    const far = side < 0 ? 1 - tr * .25 : 1;
    ctx.save(); ctx.translate(side * 44 + fx * .3, -40 + P.earDroop * 18);
    ctx.rotate(side * (.25 + P.earDroop * .9) + S.ear * side * 1.3 + Math.sin(t * 2 + side) * .03);
    ctx.scale(far, 1);
    cel(ell(0, -22, 40, 40), K.base, K.shade, K.line, 6, -6, -6);
    cel(ell(2, -20, 25, 25), K.pink, K.pinkS, null, 0, -4, -4);
    ctx.restore();
  }
  cel(ell(0, 0, 54, 48), K.base, K.shade, K.line, 6, -10, -10);
  // hocico hacia el lado al que mira
  const sniff = P.sniff * Math.sin(t * 28) * 2.5;
  const snX = fx + 30 + tr * 18;
  cel(ell(snX, 18 + fy * .5, 30, 22), K.belly, K.bellyS, K.line, 4, -5, -5);
  if (P.puff > .02) for (const s2 of [-1, 1]) cel(ell(snX + s2 * 24 - 4, 24 + fy * .5, 15 * P.puff, 13 * P.puff), K.base, K.shade, K.line, 3, -3, -3);
  fillEll(fx - 34, 22 + fy * .3, 12, 7, '#ff8fa8', .5 * P.blush); fillEll(snX + 6, 30 + fy * .3, 10, 6, '#ff8fa8', .4 * P.blush);
  const eyeY = -8 + fy, nearX = fx + 16, farX = fx - 22, farS = 1 - tr * .25;
  const eS = P.eyeS;
  drawEye(farX, eyeY, 14 * farS * eS, 18 * eS, P, t, K, 'mouse', 9, -1);
  drawEye(nearX, eyeY, 14 * eS, 18 * eS, P, t, K, 'mouse', 9, 1);
  drawBrow(farX, eyeY - 22 * eS, 1, P, K, 9); drawBrow(nearX, eyeY - 22 * eS, -1, P, K, 10);
  drawTears(farX, eyeY + 14, P, t, -1); drawTears(nearX, eyeY + 14, P, t, 1);
  // boca + dientes
  const mY = 32 + fy * .5;
  drawMouth(snX - 4, mY, 11, P, t);
  if (P.mouthO < .5 && P.smile > .2) { ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(snX - 8, mY + 1, 8, 7); ctx.fill(); ctx.stroke(); }
  cel(ell(snX + 26 + sniff, 12 + fy * .5, 10, 8.5), K.pink, K.pinkS, '#b9506a', 3, -2, -2);
  ctx.lineWidth = 2.5; ctx.strokeStyle = K.line;
  for (const a of [-.2, 0, .2]) { ctx.beginPath(); ctx.moveTo(snX + 14, 20 + fy * .5); ctx.lineTo(snX + 58, 18 + fy * .5 + a * 70 + sniff); ctx.stroke(); ctx.beginPath(); ctx.moveTo(snX - 14, 20 + fy * .5); ctx.lineTo(snX - 50, 18 + fy * .5 + a * 70); ctx.stroke(); }
  ctx.restore();
  ctx.restore();
  if (heldFn) heldFn(g);
  ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.lean); ctx.scale(g.face * g.sx, g.sy);
  drawArm(g, 1, R, K);
  ctx.restore();
  return g;
}

function applyCam(cam, depth) {
  const s = Math.pow(cam.s, depth), cx = 540 + (cam.cx - 540) * depth, cy = 960 + (cam.cy - 960) * depth;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-cx, -cy);
}

function ballistic(p0, v0, rest, t) {
  const gr = 2600;
  const a = .5 * gr, b = v0.y, c = p0.y - rest;
  const th = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  if (t < th) return { x: p0.x + v0.x * t, y: p0.y + v0.y * t + a * t * t, rot: t * 9 * Math.sign(v0.x || 1) };
  const vHit = v0.y + gr * th, vb = -vHit * .28, tb = t - th, t2 = -2 * vb / gr;
  const xh = p0.x + v0.x * th, rot0 = th * 9 * Math.sign(v0.x || 1);
  if (tb < t2) return { x: xh + v0.x * .3 * tb, y: rest + vb * tb + .5 * gr * tb * tb, rot: rot0 + tb * 3 };
  return { x: xh + v0.x * .3 * t2, y: rest, rot: rot0 + t2 * 3 };
}
function caption(c, text, t, t0, t1, opts = {}) {
  if (t < t0 || t > t1) return;
  const pIn = t0 === 0 ? 1 : seg(t, t0, t0 + .28), pOut = seg(t, t1 - .18, t1);
  const s = easeOutBack(pIn) * (1 - pOut * .3), size = opts.size || 110, y = opts.y || 250;
  c.save(); c.globalAlpha = 1 - pOut; c.translate(W / 2, y); c.scale(s, s); c.rotate(opts.rot || 0);
  c.font = `700 ${size}px Fredoka, "Noto Color Emoji", sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  c.shadowColor = 'rgba(60,20,30,.35)'; c.shadowBlur = 16; c.shadowOffsetY = 7;
  c.lineWidth = size * .2; c.strokeStyle = INK; c.strokeText(text, 0, 0);
  c.shadowColor = 'transparent';
  c.fillStyle = opts.highlight ? '#ffd93d' : '#ffffff'; c.fillText(text, 0, 0);
  c.restore();
}
function brandTitle(c, x, y, size, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.font = `700 ${size}px Fredoka, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const parts = [['Mochi', '#ffa040'], [' & ', '#ff6b8b'], ['Pip', '#a9a2c9']];
  const widths = parts.map(([tx]) => c.measureText(tx).width), total = widths.reduce((a, b) => a + b, 0);
  let cx = -total / 2;
  parts.forEach(([tx], i) => { c.fillStyle = INK; for (let kk = 1; kk <= size * .07; kk++) c.fillText(tx, cx + widths[i] / 2 + kk * .4, kk); cx += widths[i]; });
  cx = -total / 2;
  parts.forEach(([tx, col], i) => {
    const px = cx + widths[i] / 2;
    c.lineWidth = size * .16; c.strokeStyle = INK; c.strokeText(tx, px, 0);
    c.lineWidth = size * .07; c.strokeStyle = '#ffffff'; c.strokeText(tx, px, 0);
    c.fillStyle = col; c.fillText(tx, px, 0); cx += widths[i];
  });
  c.restore();
}
// ---------- render con desenfoque de movimiento ----------
const SUB = 4, SHUTTER = 0.5 / 60;
function render(t) {
  octx.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < SUB; i++) {
    const ts = Math.max(0, t + ((i + .5) / SUB - .5) * SHUTTER);
    drawWorld(ts);
    octx.globalAlpha = 1 / (i + 1); octx.drawImage(work, 0, 0);
  }
  octx.globalAlpha = 1;
  drawOverlay(octx, t);
}


function startEpisode() {
  window.render = render;
  window.DURATION = DURATION;
  window.ready = true;
  if (!navigator.webdriver) {
    document.body.classList.add('preview');
    const start = performance.now();
    (function loop() { render(((performance.now() - start) / 1000) % DURATION); requestAnimationFrame(loop); })();
  }
}
