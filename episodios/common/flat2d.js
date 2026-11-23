// =====================================================================
//  MOTOR 2D ORIGINAL (estilo del primer vídeo: plano con contorno)
//  Requiere common/rig.js. Cada episodio define DURATION y drawScene(t).
// =====================================================================
const W = 1080, H = 1920;
const cv = document.getElementById('c');
const octx = cv.getContext('2d');                       // salida final (con desenfoque de movimiento)
const work = document.createElement('canvas'); work.width = W; work.height = H;
const layer = document.createElement('canvas'); layer.width = W; layer.height = H;
const lctx = layer.getContext('2d');
let ctx = work.getContext('2d');                        // lienzo de trabajo de cada sub-fotograma

// ---------- animación secundaria (muelles) y fundido de expresiones ----------
const SECS = {}, EXPRS = {}, SEC0 = { hx: 0, hy: 0, ear: 0, tail: 0, sq: 0, lean: 0, tilt: 0 };
function buildSecondary(fn) {
  const dt = 1 / 240, N = Math.ceil((DURATION + .5) / dt), F = ['hx', 'hy', 'ear', 'tail', 'sq', 'lean', 'tilt'];
  const A = {}; for (const f of F) A[f] = new Float32Array(N);
  let hx = 0, hvx = 0, hy = 0, hvy = 0, sq = 0, sv = 0, ear = 0, ev = 0, tl = 0, tv = 0, ld = 0, lv = 0, ti = 0, tiv = 0;
  let p = fn(0), pvx = 0, pvy = 0;
  const cl = (v, m) => Math.max(-m, Math.min(m, v));
  for (let i = 0; i < N; i++) {
    const t = i * dt, st = fn(t);
    let vx = (st.x - p.x) / dt, vy = (st.y - p.y) / dt;
    if (i === 0 || Math.abs(st.x - p.x) > 60 || Math.abs(st.y - p.y) > 60) { vx = pvx; vy = pvy; }   // teletransportes: ignorar
    vx = cl(vx, 2600); vy = cl(vy, 2600);
    const dvx = vx - pvx, dvy = vy - pvy;
    hvx += -dvx * .2; hvy += -dvy * .16;                                  // la cabeza se queda atrás
    hvx += (-300 * hx - 12 * hvx) * dt; hvy += (-300 * hy - 12 * hvy) * dt;
    hx = cl(hx + hvx * dt, 28); hy = cl(hy + hvy * dt, 26);
    if (pvy > 200 && dvy < 0) sv += dvy * .0026;                          // aplastar al aterrizar
    sv += (-420 * sq - 11 * sv) * dt; sq = cl(sq + sv * dt, .3);
    ev += dvy * .0011 + Math.abs(dvx) * .0004;                            // orejas que rebotan
    ev += (-260 * ear - 7 * ev) * dt; ear = cl(ear + ev * dt, .6);
    tv += -dvx * .0016 * Math.sign(st.dir || 1) + dvy * .0006;            // cola con inercia
    tv += (-150 * tl - 5 * tv) * dt; tl = cl(tl + tv * dt, 1.1);
    lv += -dvx * .0003;                                                   // el cuerpo se inclina al frenar
    lv += (-220 * ld - 11 * lv) * dt; ld = cl(ld + lv * dt, .25);
    tiv += dvx * .00035 + dvy * .0002;                                    // la cabeza se ladea
    tiv += (-250 * ti - 10 * tiv) * dt; ti = cl(ti + tiv * dt, .3);
    A.hx[i] = hx; A.hy[i] = hy; A.ear[i] = ear; A.tail[i] = tl; A.sq[i] = sq + Math.min(.12, Math.abs(vy) * .00009); A.lean[i] = ld; A.tilt[i] = ti;
    p = st; pvx = vx; pvy = vy;
  }
  A.N = N; return A;
}
function secAt(name, t) {
  const A = SECS[name]; if (!A) return SEC0;
  const f = clamp(t, 0, DURATION) * 240, i = Math.min(Math.floor(f), A.N - 2), a = f - i, r = {};
  for (const k in SEC0) r[k] = A[k][i] * (1 - a) + A[k][i + 1] * a;
  return r;
}
function buildExpr(fn) { const ch = []; let prev = fn(0).expr; for (let t = 0; t < DURATION; t += 1 / 240) { const e = fn(t).expr; if (e !== prev) { ch.push([t, prev]); prev = e; } } return ch; }
function exprBlend(name, t) {
  const ch = EXPRS[name]; if (!ch) return null;
  for (let i = ch.length - 1; i >= 0; i--) { const [tc, prev] = ch[i]; if (tc <= t) return t - tc < .16 ? { prev, p: E.io((t - tc) / .16) } : null; }
  return null;
}
function blinkAmt(t, seed = 0) {
  for (let n = 0; n < 14; n++) { const bt = 1.1 + n * 2.6 + rnd(n + seed) * 1.2, d = t - bt; if (d > 0 && d < .17) return Math.sin(Math.PI * d / .17); }
  return 0;
}
function blendDraw(fn, name, st, t) {
  const b = exprBlend(name, t);
  if (!b || b.prev === st.expr) return fn(st, t);
  fn({ ...st, expr: b.prev }, t);
  const m = ctx.getTransform();
  lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.clearRect(0, 0, W, H); lctx.setTransform(m);
  const sv = ctx; ctx = lctx; fn(st, t); ctx = sv;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = b.p; ctx.drawImage(layer, 0, 0); ctx.restore();
}
function drawCat(st, t) { return blendDraw(drawCatRaw, 'cat', st, t); }
function drawMouse(st, t) { return blendDraw(drawMouseRaw, 'mouse', st, t); }
// ---------- paleta ----------
const C = {
  ink: '#2b2233', wall: '#ffe6c2', wallDot: '#ffd7a0', floor: '#d9925b', floorDark: '#c27c47',
  base: '#f4b183', cat: '#ffa53d', catDark: '#f08a1c', belly: '#fff0d6', pink: '#ff8fa3',
  mouse: '#b8b3cc', mouseDark: '#9c96b5', cookie: '#e0a458', cookieDark: '#c98a3c', chip: '#5a3825',
  table: '#a0603a', tableTop: '#b8734a', box: '#d9a86c', boxDark: '#c18e52', tape: '#efd7a6',
  teapot: '#7cc6fe', glass: 'rgba(200,235,255,0.45)', sky: '#9fe0ff', red: '#ff4d6d', white: '#ffffff'
};
const FLOOR = 1480, TABLE_TOP = 1020, TABLE_L = 520, TABLE_R = 960;
const BOX_W = 220, BOX_H = 250, BOX_TOP = FLOOR - BOX_H;
const COOKIE_X = 760, TEAPOT_X = 890;

function ellipse(x, y, rx, ry, fill, stroke = true, lw = 8) {
  ctx.beginPath(); ctx.ellipse(x, y, Math.max(rx, .1), Math.max(ry, .1), 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = C.ink; ctx.stroke(); }
}
function roundRect(x, y, w, h, r, fill, stroke = true, lw = 8) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = C.ink; ctx.stroke(); }
}
function heart(x, y, s, fill = C.red, stroke = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 12);
  ctx.bezierCurveTo(-26, -6, -18, -30, 0, -16);
  ctx.bezierCurveTo(18, -30, 26, -6, 0, 12);
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.lineWidth = 5 / s; ctx.strokeStyle = C.ink; ctx.stroke(); }
  ctx.restore();
}
function sparkle(x, y, s, a = 1, color = '#fff6a8') {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const an = i * Math.PI / 2;
    ctx.lineTo(Math.cos(an) * 26, Math.sin(an) * 26);
    ctx.lineTo(Math.cos(an + Math.PI / 4) * 7, Math.sin(an + Math.PI / 4) * 7);
  }
  ctx.closePath(); ctx.fillStyle = color; ctx.fill();
  ctx.lineWidth = 3 / s; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.restore();
}

// ---------- galleta ----------
function cookie(x, y, r, part = 'full', bite = 0, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.beginPath();
  if (part === 'full') {
    ctx.arc(0, 0, r, 0, Math.PI * 2);
  } else {
    const sgn = part === 'left' ? -1 : 1;
    ctx.moveTo(0, -r);
    ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, sgn < 0);
    // zigzag de rotura
    const n = 6;
    for (let i = n; i >= 0; i--) ctx.lineTo((i % 2 ? 7 : -3) * -sgn * 0.6, -r + (2 * r * i) / n);
    ctx.closePath();
  }
  ctx.fillStyle = C.cookie; ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.clip();
  // chips
  const chips = [[-.4, -.35], [.35, -.4], [.05, .1], [-.45, .35], [.45, .3], [.0, -.65], [-.1, .6]];
  for (const [cx, cy] of chips) ellipse(cx * r, cy * r, r * .13, r * .11, C.chip, false);
  // mordiscos
  if (bite > 0) {
    ctx.globalCompositeOperation = 'destination-out';
    const sgn = part === 'left' ? -1 : 1;
    for (let i = 0; i < 3; i++) {
      ellipse(sgn * r * .9, -r * .5 + i * r * .45, r * .45 * bite, r * .32 * bite, '#000', false);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
}

// ---------- gatito ----------
// (x,y) = punto entre las patas en el suelo.  expr: normal | love | shock | sad | dizzy | happy | determined | chew
function drawCatRaw(st, t) {
  const { x, y, dir = 1, sx = 1, sy = 1, rot = 0, expr = 'normal', look = 0, lookX = 0, paw = 0, walk = 0, chew = 0, tearsOn = 0 } = st;
  const SEC = secAt('cat', t), fd = Math.sign(dir) || 1;
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot + SEC.lean); ctx.scale(dir * sx * (1 - SEC.sq * .6), sy * (1 + SEC.sq));

  // sombra
  ctx.save(); ctx.globalAlpha = .18; ellipse(0, 4, 85, 14, '#000', false); ctx.restore();

  // cola (contorno + relleno)
  const wag = Math.sin(t * 5) * 18 + Math.sin(t * 2.3) * 6 + SEC.tail * 55;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-60, -50); ctx.quadraticCurveTo(-150, -90 + wag, -120, -190 + wag * .6);
  ctx.lineWidth = 38; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.lineWidth = 22; ctx.strokeStyle = C.cat; ctx.stroke();

  // patas traseras / delanteras
  const step = Math.sin(walk * Math.PI * 2) * 10, lift = Math.cos(walk * Math.PI * 2);
  ellipse(-42 + step, -10 - Math.max(0, lift) * 9 * (walk ? 1 : 0), 28, 15, C.cat);
  ellipse(42 - step, -10 - Math.max(0, -lift) * 9 * (walk ? 1 : 0), 28, 15, C.cat);

  // cuerpo
  ellipse(0, -72, 82, 70, C.cat);
  ellipse(14, -58, 46, 42, C.belly, false);
  // rayas del lomo
  ctx.lineWidth = 9; ctx.strokeStyle = C.catDark; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-30 + i * 22, -135, 14, Math.PI * .2, Math.PI * .8); ctx.stroke(); }

  // pata que se estira hacia la galleta
  if (paw > 0) {
    ctx.save(); ctx.translate(40, -80); ctx.rotate(-0.5 - paw * .5);
    roundRect(-14, -10, 60 + paw * 40, 28, 14, C.cat);
    ellipse(56 + paw * 40, 4, 18, 16, C.cat);
    ctx.restore();
  }

  // cabeza (con retraso y ladeo de la animación secundaria)
  const hx = 18 + SEC.hx * fd, hy = -168 + SEC.hy;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(SEC.tilt * fd + Math.sin(t * 1.7) * .02); ctx.translate(-hx, -hy);
  // orejas
  for (const s of [-1, 1]) {
    const ex = hx + s * 42;
    ctx.save(); ctx.translate(ex, hy - 40); ctx.rotate(s * (SEC.ear * .9 + Math.sin(t * 2.1 + s) * .03)); ctx.translate(-ex, -(hy - 40));
    ctx.beginPath(); ctx.moveTo(ex - 32, hy - 40); ctx.lineTo(ex + s * 14, hy - 112); ctx.lineTo(ex + 34 * (s > 0 ? 1 : 0.6), hy - 40); ctx.closePath();
    ctx.fillStyle = C.cat; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex - 16, hy - 52); ctx.lineTo(ex + s * 10, hy - 92); ctx.lineTo(ex + 18 * (s > 0 ? 1 : .5), hy - 52); ctx.closePath();
    ctx.fillStyle = C.pink; ctx.fill();
    ctx.restore();
  }
  ellipse(hx, hy, 84, 76, C.cat);
  // rayitas de la frente
  ctx.lineWidth = 8; ctx.strokeStyle = C.catDark;
  for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(hx + i * 18, hy - 72); ctx.lineTo(hx + i * 14, hy - 50); ctx.stroke(); }

  // mejillas
  ctx.save(); ctx.globalAlpha = .55; ellipse(hx - 46, hy + 22, 16, 10, C.pink, false); ellipse(hx + 56, hy + 22, 16, 10, C.pink, false); ctx.restore();

  // ojos
  const eyes = [[hx - 22, hy - 6], [hx + 34, hy - 6]];
  const ly = look * -8, lx = lookX * 8; // mirar arriba / a los lados
  for (const [ex, ey] of eyes) {
    if (expr === 'wide') {          // ojos enormes y brillantes (codicia)
      ellipse(ex, ey, 24, 28, C.white, true, 6);
      ellipse(ex + lx * 1.1, ey + ly + 2, 15, 18, C.ink, false);
      ellipse(ex + lx * 1.1 - 5, ey + ly - 6, 6, 7, C.white, false);
      ellipse(ex + lx * 1.1 + 6, ey + ly + 9, 3, 3, C.white, false);
    } else if (expr === 'glare') {  // mirada asesina: párpado plano
      ellipse(ex + lx, ey + ly + 4, 12, 13, C.ink, false);
      ctx.fillStyle = C.cat; ctx.fillRect(ex - 20, ey - 26, 40, 22);
      ctx.beginPath(); ctx.moveTo(ex - 17, ey - 4); ctx.lineTo(ex + 17, ey - 4); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
    } else if (expr === 'love') {
      heart(ex, ey + 4, 1.05 + Math.sin(t * 12) * .1);
    } else if (expr === 'happy' || expr === 'chew') {
      ctx.beginPath(); ctx.arc(ex, ey + 6, 14, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
    } else if (expr === 'dizzy') {
      ctx.save(); ctx.translate(ex, ey); ctx.rotate(t * 8);
      ctx.beginPath(); for (let a = 0; a < 12; a += .3) ctx.lineTo(Math.cos(a) * a * 1.3, Math.sin(a) * a * 1.3);
      ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore();
    } else if (expr === 'shock') {
      ellipse(ex, ey, 22, 26, C.white, true, 6);
      ellipse(ex + 2 + lx, ey + ly, 7, 8, C.ink, false);
    } else if (expr === 'sad') {
      ellipse(ex, ey + 2, 15, 19, C.ink, false);
      ellipse(ex - 4, ey - 5, 6, 7, C.white, false);
      ellipse(ex + 5, ey + 7, 3, 3, C.white, false);
      // ojos llorosos
      ctx.save(); ctx.globalAlpha = .6; ellipse(ex, ey + 18, 16, 6, '#8fd3ff', false); ctx.restore();
    } else {
      const bl = blinkAmt(t, 3);   // parpadeo progresivo
      if (bl > .82) { ctx.beginPath(); ctx.moveTo(ex - 13, ey + 2); ctx.quadraticCurveTo(ex, ey + 8, ex + 13, ey + 2); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke(); }
      else {
        ellipse(ex + lx, ey + ly + bl * 6, 13, 18 * (1 - bl), C.ink, false);
        if (bl < .5) ellipse(ex - 4 + lx, ey - 7 + ly + bl * 6, 5, 6 * (1 - bl), C.white, false);
      }
    }
  }
  // cejas
  if (expr === 'determined' || expr === 'glare') {
    ctx.lineWidth = 8; ctx.strokeStyle = C.ink;
    ctx.beginPath(); ctx.moveTo(hx - 40, hy - 34); ctx.lineTo(hx - 8, hy - 24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx + 52, hy - 34); ctx.lineTo(hx + 20, hy - 24); ctx.stroke();
  } else if (expr === 'sad') {
    ctx.lineWidth = 7; ctx.strokeStyle = C.ink;
    ctx.beginPath(); ctx.moveTo(hx - 38, hy - 26); ctx.lineTo(hx - 10, hy - 36); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx + 50, hy - 26); ctx.lineTo(hx + 22, hy - 36); ctx.stroke();
  }

  // nariz
  ctx.beginPath(); ctx.moveTo(hx + 4, hy + 16); ctx.lineTo(hx + 18, hy + 16); ctx.lineTo(hx + 11, hy + 24); ctx.closePath();
  ctx.fillStyle = C.pink; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke();

  // boca
  ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.lineCap = 'round';
  const my = hy + 30;
  if (expr === 'shock') {
    ellipse(hx + 11, my + 14, 13, 18, '#7a2440', true, 6);
  } else if (expr === 'sad') {
    ctx.beginPath(); ctx.arc(hx + 11, my + 16, 14, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
  } else if (expr === 'chew') {
    const o = (Math.sin(t * 22) + 1) / 2;
    ellipse(hx + 11, my + 6, 12, 4 + o * 9, '#7a2440', true, 5);
  } else if (expr === 'wide') {    // boquita abierta y babita
    ellipse(hx + 11, my + 6, 9, 8, '#7a2440', true, 5);
    ctx.save(); ctx.globalAlpha = .85; ellipse(hx + 24, my + 16 + Math.sin(t * 3) * 2, 4, 7, '#bfe9ff', true, 3); ctx.restore();
  } else if (expr === 'glare') {
    ctx.beginPath(); ctx.moveTo(hx - 2, my + 6); ctx.lineTo(hx + 24, my + 6); ctx.stroke();
  } else if (expr === 'love' || expr === 'happy') {
    ctx.beginPath(); ctx.arc(hx + 11, my - 2, 16, Math.PI * .1, Math.PI * .9); ctx.fillStyle = '#7a2440'; ctx.fill(); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.arc(hx + 3, my, 8, 0, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(hx + 19, my, 8, 0, Math.PI); ctx.stroke();
  }
  // bigotes
  ctx.lineWidth = 4;
  for (const s of [-1, 1]) for (const k of [-1, 1]) {
    const bx = hx + 11 + s * 50;
    ctx.beginPath(); ctx.moveTo(bx, my - 6 + k * 6); ctx.lineTo(bx + s * 46, my - 10 + k * 14); ctx.stroke();
  }
  // lágrimas cayendo
  if (tearsOn > 0) {
    for (let i = 0; i < 2; i++) {
      const ph = (t * 1.6 + i * .5) % 1;
      for (const ex of [hx - 22, hx + 34]) {
        ctx.save(); ctx.globalAlpha = (1 - ph) * tearsOn;
        ellipse(ex + (ex < hx ? -10 : 10), hy + 20 + ph * 90, 7, 11, '#7fd0ff', true, 3);
        ctx.restore();
      }
    }
  }
  ctx.restore();   // cabeza
  ctx.restore();
}

// ---------- ratoncito ----------
function drawMouseRaw(st, t) {
  const { x, y, dir = -1, sx = 1, sy = 1, rot = 0, expr = 'normal', look = 0, chew = 0, holding = null } = st;
  const SEC = secAt('mouse', t), fd = Math.sign(dir) || 1;
  ctx.save(); ctx.translate(x, y); ctx.rotate(SEC.lean + rot); ctx.scale(dir * sx * (1 - SEC.sq * .6), sy * (1 + SEC.sq));
  ctx.save(); ctx.globalAlpha = .18; ellipse(0, 3, 50, 9, '#000', false); ctx.restore();
  // cola
  ctx.beginPath(); ctx.moveTo(-40, -18); ctx.bezierCurveTo(-90, -10 + SEC.tail * 20, -80, -70 + SEC.tail * 30, -120, -50 + Math.sin(t * 6) * 8 + SEC.tail * 45);
  ctx.lineCap = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.lineWidth = 6; ctx.strokeStyle = C.pink; ctx.stroke();
  // patas
  ellipse(-20, -6, 14, 8, C.mouseDark, true, 5); ellipse(20, -6, 14, 8, C.mouseDark, true, 5);
  // cuerpo
  ellipse(0, -36, 46, 34, C.mouse, true, 7);
  ctx.save(); ctx.translate(48 + SEC.hx * fd * .8, -62 + SEC.hy * .8); ctx.rotate(SEC.tilt * fd + Math.sin(t * 2.2) * .03); ctx.translate(-48, 62);
  // orejas (rebotan)
  for (const [ex, ey, s] of [[26, -96, -1], [64, -92, 1]]) {
    ctx.save(); ctx.translate(ex, ey + 18); ctx.rotate(s * SEC.ear * 1.1 + Math.sin(t * 2.6 + s) * .04); ctx.translate(-ex, -(ey + 18));
    ellipse(ex, ey, 22, 22, C.mouse, true, 7); ellipse(ex, ey, 12, 12, C.pink, false);
    ctx.restore();
  }
  // cabeza
  ellipse(48, -62, 34, 30, C.mouse, true, 7);
  // ojo
  if (expr === 'happy' || expr === 'chew') {
    ctx.beginPath(); ctx.arc(54, -64, 8, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
  } else if (expr === 'smug') {      // ojo entornado de listillo
    ellipse(56, -64, 7, 7, C.ink, false); ellipse(54, -66, 2.5, 2.5, C.white, false);
    ctx.fillStyle = C.mouse; ctx.fillRect(46, -78, 20, 12);
    ctx.beginPath(); ctx.moveTo(46, -66); ctx.lineTo(66, -67); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(44, -86); ctx.quadraticCurveTo(55, -94, 66, -86); ctx.lineWidth = 4; ctx.stroke();
  } else if (expr === 'dizzy') {
    ctx.save(); ctx.translate(56, -66); ctx.rotate(t * 9);
    ctx.beginPath(); for (let a = 0; a < 10; a += .3) ctx.lineTo(Math.cos(a) * a * .9, Math.sin(a) * a * .9);
    ctx.lineWidth = 3.5; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore();
  } else if (expr === 'shock') {
    ellipse(54, -66, 12, 14, C.white, true, 4); ellipse(56, -68 - look * 4, 4, 5, C.ink, false);
  } else {
    const bl = blinkAmt(t, 11);
    if (bl > .82) { ctx.beginPath(); ctx.moveTo(49, -65); ctx.lineTo(63, -65); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke(); }
    else { ellipse(56, -66 - look * 4, 7, 9 * (1 - bl), C.ink, false); if (bl < .5) ellipse(54, -70 - look * 4, 3, 3, C.white, false); }
  }
  if (expr === 'guilty') { ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(44, -84); ctx.lineTo(64, -80); ctx.stroke(); }
  // nariz + bigotes
  ellipse(82, -58, 7, 6, C.pink, true, 3);
  ctx.lineWidth = 3; ctx.strokeStyle = C.ink;
  for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(78, -54); ctx.lineTo(108, -54 + k * 10); ctx.stroke(); }
  // boca
  if (expr === 'chew') { const o = (Math.sin(t * 24 + 1) + 1) / 2; ellipse(68, -44, 6, 2 + o * 5, '#7a2440', true, 3); }
  else if (expr === 'shock') ellipse(70, -44, 6, 8, '#7a2440', true, 3);
  else if (expr === 'smug' || expr === 'guilty') { ctx.beginPath(); ctx.moveTo(60, -46); ctx.quadraticCurveTo(70, -38, 80, -48); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke(); }
  ctx.save(); ctx.globalAlpha = .5; ellipse(44, -50, 9, 5, C.pink, false); ctx.restore();
  ctx.restore();   // cabeza
  // lo que sostiene
  if (holding) cookie(70, -30, holding.r, holding.part, holding.bite || 0, holding.rot || 0);
  ctx.restore();
}

// ---------- escenario ----------
function drawRoom(t, revealGlow, opts = {}) {
  // pared (muy ancha para los movimientos de cámara)
  ctx.fillStyle = C.wall; ctx.fillRect(-800, -1200, W + 1600, FLOOR + 1200);
  ctx.fillStyle = C.wallDot;
  for (let yy = -1100; yy < FLOOR - 40; yy += 90) for (let xx = -760; xx < W + 800; xx += 90) {
    ctx.beginPath(); ctx.arc(xx + ((yy / 90) % 2 ? 45 : 0), yy, 8, 0, Math.PI * 2); ctx.fill();
  }
  // ventana
  roundRect(90, 560, 300, 330, 20, C.sky);
  ctx.save(); ctx.beginPath(); ctx.roundRect(90, 560, 300, 330, 20); ctx.clip();
  const cx = 150 + ((t * 18) % 400);
  ellipse(cx, 660, 50, 26, C.white, false); ellipse(cx + 40, 645, 40, 28, C.white, false); ellipse(cx - 40, 668, 34, 18, C.white, false);
  ellipse(330, 830, 120, 60, '#8fd16a', false);
  ctx.restore();
  ctx.lineWidth = 10; ctx.strokeStyle = C.ink;
  ctx.beginPath(); ctx.moveTo(240, 560); ctx.lineTo(240, 890); ctx.moveTo(90, 725); ctx.lineTo(390, 725); ctx.stroke();
  roundRect(70, 885, 340, 26, 10, '#fff3e0');
  // cuadro
  roundRect(1000, 600, 160, 200, 10, '#ffd1dc');
  heart(1080, 700, 1.6, C.red);
  // estante + tarro de galletas
  if (opts.jar) drawJar(t, revealGlow);
  // zócalo
  ctx.fillStyle = C.base; ctx.fillRect(-800, FLOOR - 50, W + 1600, 50);
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(-800, FLOOR - 50); ctx.lineTo(W + 800, FLOOR - 50); ctx.stroke();
  // suelo
  ctx.fillStyle = C.floor; ctx.fillRect(-800, FLOOR, W + 1600, 900);
  ctx.strokeStyle = C.floorDark; ctx.lineWidth = 6;
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-800, FLOOR + 70 + i * 90); ctx.lineTo(W + 800, FLOOR + 70 + i * 90); ctx.stroke(); }
  for (let i = 0; i < 40; i++) { const xx = -800 + i * 140 + (i % 2) * 70; const row = i % 6; ctx.beginPath(); ctx.moveTo(xx, FLOOR + 70 + row * 90); ctx.lineTo(xx, FLOOR + 160 + row * 90); ctx.stroke(); }
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(-800, FLOOR); ctx.lineTo(W + 800, FLOOR); ctx.stroke();
  // alfombra
  ctx.save(); ctx.globalAlpha = .9; ellipse(300, FLOOR + 160, 260, 70, '#ff9fb4', true, 8); ellipse(300, FLOOR + 160, 200, 48, '#ffc4d1', false); ctx.restore();
}

function drawJar(t, glow) {
  const jx = 740, jy = 300;
  // brillo/rayos al descubrirlo
  if (glow > 0) {
    ctx.save(); ctx.translate(jx, jy - 160); ctx.rotate(t * .6);
    ctx.globalAlpha = .55 * glow;
    for (let i = 0; i < 12; i++) {
      ctx.rotate(Math.PI / 6);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-40, -520); ctx.lineTo(40, -520); ctx.closePath();
      ctx.fillStyle = i % 2 ? '#fff4a3' : '#ffe066'; ctx.fill();
    }
    ctx.restore();
  }
  // estante
  roundRect(500, jy, 480, 30, 8, C.tableTop);
  ctx.beginPath(); ctx.moveTo(560, jy + 30); ctx.lineTo(600, jy + 90); ctx.lineTo(600, jy + 30); ctx.fillStyle = C.table; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(920, jy + 30); ctx.lineTo(880, jy + 90); ctx.lineTo(880, jy + 30); ctx.fill(); ctx.stroke();
  // tarro
  ctx.save();
  ctx.beginPath(); ctx.roundRect(jx - 150, jy - 300, 300, 300, 40);
  ctx.save(); ctx.clip();
  ctx.fillStyle = 'rgba(210,240,255,.55)'; ctx.fillRect(jx - 160, jy - 310, 320, 320);
  // muchas galletas dentro
  let k = 0;
  for (let row = 0; row < 6; row++) for (let col = 0; col < 5; col++) {
    const cxx = jx - 120 + col * 60 + (row % 2) * 28 + (rnd(k) - .5) * 10;
    const cyy = jy - 30 - row * 46 + (rnd(k + 9) - .5) * 8;
    cookie(cxx, cyy, 34, 'full', 0, rnd(k + 3) * 6); k++;
  }
  ctx.restore();
  ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  // reflejo
  ctx.globalAlpha = .7; ctx.lineWidth = 12; ctx.strokeStyle = C.white; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(jx - 115, jy - 250); ctx.lineTo(jx - 115, jy - 120); ctx.stroke();
  ctx.restore();
  // tapa con galletas desbordando
  cookie(jx - 60, jy - 318, 34, 'full', 0, 1); cookie(jx + 50, jy - 322, 34, 'full', 0, 2.2); cookie(jx - 5, jy - 352, 34, 'full', 0, .4);
  roundRect(jx - 165, jy - 312, 330, 40, 14, C.red);
  // etiqueta
  roundRect(jx - 100, jy - 200, 200, 70, 14, '#fff7e6', true, 6);
  ctx.fillStyle = C.ink; ctx.font = '900 40px Inter, "DejaVu Sans", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('GALLETAS', jx, jy - 164);
}

function drawTable() {
  // patas
  roundRect(TABLE_L + 30, TABLE_TOP + 30, 34, FLOOR - TABLE_TOP - 30, 8, C.table);
  roundRect(TABLE_R - 64, TABLE_TOP + 30, 34, FLOOR - TABLE_TOP - 30, 8, C.table);
  roundRect(TABLE_L + 50, TABLE_TOP + 40, TABLE_R - TABLE_L - 100, 30, 6, C.table);
  // tablero
  roundRect(TABLE_L - 20, TABLE_TOP, TABLE_R - TABLE_L + 40, 42, 12, C.tableTop);
  // mantel
  ctx.beginPath(); ctx.moveTo(TABLE_L + 120, TABLE_TOP + 4); ctx.lineTo(TABLE_R - 60, TABLE_TOP + 4); ctx.lineTo(TABLE_R - 90, TABLE_TOP + 90); ctx.lineTo(TABLE_L + 150, TABLE_TOP + 90); ctx.closePath();
  ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = '#ff9fb4';
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(TABLE_L + 175 + i * 40, TABLE_TOP + 60, 9, 0, Math.PI * 2); ctx.fill(); }
}

function drawTeapot() {
  const x = TEAPOT_X, y = TABLE_TOP;
  // pico
  ctx.beginPath(); ctx.moveTo(x - 50, y - 60); ctx.quadraticCurveTo(x - 110, y - 70, x - 120, y - 130); ctx.lineTo(x - 98, y - 132); ctx.quadraticCurveTo(x - 90, y - 90, x - 40, y - 85); ctx.closePath();
  ctx.fillStyle = C.teapot; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  // asa
  ctx.beginPath(); ctx.arc(x + 70, y - 80, 36, -Math.PI / 2, Math.PI / 2); ctx.lineWidth = 22; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 10; ctx.strokeStyle = C.teapot; ctx.stroke();
  ellipse(x, y - 75, 82, 74, C.teapot, true, 8);
  ellipse(x, y - 150, 50, 14, '#5bb2f0', true, 6);
  ellipse(x, y - 166, 14, 12, C.red, true, 5);
  ctx.save(); ctx.globalAlpha = .8; heart(x + 6, y - 72, 1.2, C.white, false); ctx.restore();
}

function drawBox(bx) {
  roundRect(bx - BOX_W / 2, BOX_TOP, BOX_W, BOX_H, 10, C.box);
  ctx.fillStyle = C.boxDark; ctx.fillRect(bx - BOX_W / 2 + 6, BOX_TOP + 6, BOX_W - 12, 22);
  ctx.fillStyle = C.tape; ctx.fillRect(bx - 22, BOX_TOP + 4, 44, 90);
  ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.strokeRect(bx - 22, BOX_TOP + 4, 44, 90);
  ctx.fillStyle = C.ink; ctx.font = '900 30px Inter, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('↑ ↑', bx, BOX_TOP + 170);
}

// ---------- líneas de acción ----------
function focusLines(t, a) {
  ctx.save(); ctx.globalAlpha = a * .55; ctx.strokeStyle = C.ink; ctx.lineCap = 'round';
  const fr = Math.floor(t * 15);
  for (let i = 0; i < 46; i++) {
    const an = (i / 46) * Math.PI * 2 + rnd(i + fr) * .08;
    const r0 = 620 + rnd(i * 7 + fr) * 260;
    ctx.lineWidth = 4 + rnd(i * 3 + fr) * 10;
    ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(an) * r0, H / 2 + Math.sin(an) * r0 * 1.4);
    ctx.lineTo(W / 2 + Math.cos(an) * 1500, H / 2 + Math.sin(an) * 2100); ctx.stroke();
  }
  ctx.restore();
}

function pill(text, t, t0, t1) {
  if (t < t0 || t > t1) return;
  const a = 1 - seg(t, t1 - .2, t1);
  const pulse = 1 + Math.sin(t * 9) * .04;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(W / 2, 420); ctx.scale(pulse, pulse);
  ctx.font = '900 50px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width + 70;
  roundRect(-w / 2, -40, w, 80, 40, C.red, true, 7);
  ctx.fillStyle = C.white; ctx.fillText(text + ' ⬇', 0, 2);
  ctx.restore();
}

// ---------- texto estilo TikTok ----------
function caption(text, t, t0, t1, opts = {}) {
  if (t < t0 || t > t1) return;
  const pIn = t0 === 0 ? 1 : seg(t, t0, t0 + .25);
  const pOut = seg(t, t1 - .15, t1);
  const s = easeOutBack(pIn) * (1 - pOut * .3);
  const size = opts.size || 104;
  const y = opts.y || 250;
  ctx.save(); ctx.globalAlpha = 1 - pOut; ctx.translate(W / 2, y); ctx.scale(s, s); ctx.rotate(opts.rot || 0);
  ctx.font = `900 ${size}px Inter, "Noto Color Emoji", "DejaVu Sans", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const lines = text.split('\n');
  lines.forEach((ln, i) => {
    const yy = (i - (lines.length - 1) / 2) * size * 1.12;
    ctx.lineJoin = 'round'; ctx.lineWidth = size * .22; ctx.strokeStyle = C.ink; ctx.strokeText(ln, 0, yy);
    ctx.fillStyle = (opts.highlight && i === lines.length - 1) ? '#ffd93d' : C.white;
    ctx.fillText(ln, 0, yy);
  });
  ctx.restore();
}


function brandTitle(c, x, y, size, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.font = `700 ${size}px Fredoka, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const parts = [['Mochi', '#ffa040'], [' & ', '#ff6b8b'], ['Pip', '#a9a2c9']];
  const widths = parts.map(([tx]) => c.measureText(tx).width), total = widths.reduce((a, b) => a + b, 0);
  let cx = -total / 2;
  parts.forEach(([tx], i) => { c.fillStyle = C.ink; for (let k = 1; k <= size * .07; k++) c.fillText(tx, cx + widths[i] / 2 + k * .4, k); cx += widths[i]; });
  cx = -total / 2;
  parts.forEach(([tx, col], i) => {
    const px = cx + widths[i] / 2;
    c.lineWidth = size * .16; c.strokeStyle = C.ink; c.strokeText(tx, px, 0);
    c.lineWidth = size * .07; c.strokeStyle = '#ffffff'; c.strokeText(tx, px, 0);
    c.fillStyle = col; c.fillText(tx, px, 0); cx += widths[i];
  });
  c.restore();
}
function endCard(t, t0, part) {
  if (t < t0) return;
  const p = easeOutBack(seg(t, t0, t0 + .3));
  ctx.save(); ctx.translate(W / 2, 300); ctx.scale(p, p); brandTitle(ctx, 0, 0, 150, -.03); ctx.restore();
  if (t > t0 + .35) caption(`PART ${part} ⏳`, t, t0 + .35, 99, { size: 70, y: 450 });
}
// cámara 2D: [escala, centro x, centro y]
function withCamera(cam, fn) {
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(cam.s, cam.s); ctx.translate(-cam.cx, -cam.cy); fn(); ctx.restore();
}
const SUB = 6, SHUTTER = .5 / 60;   // 6 sub-fotogramas por fotograma (60 fps -> 360 dibujos por segundo)
function startEpisode(drawFrame) {
  if (typeof catState === 'function') { SECS.cat = buildSecondary(catState); EXPRS.cat = buildExpr(catState); }
  if (typeof mouseState === 'function') { SECS.mouse = buildSecondary(mouseState); EXPRS.mouse = buildExpr(mouseState); }
  const render = t => {
    for (let i = 0; i < SUB; i++) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawFrame(Math.max(0, t + ((i + .5) / SUB - .5) * SHUTTER));
      octx.globalAlpha = 1 / (i + 1); octx.drawImage(work, 0, 0);
    }
    octx.globalAlpha = 1;
  };
  window.render = render; window.DURATION = DURATION; window.ready = true;
  if (!navigator.webdriver) {
    document.body.classList.add('preview');
    const start = performance.now();
    (function loop() { render(((performance.now() - start) / 1000) % DURATION); requestAnimationFrame(loop); })();
  }
}
