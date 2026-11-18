// =====================================================================
//  MOTOR 2D ORIGINAL (estilo del primer vídeo: plano con contorno)
//  Requiere common/rig.js. Cada episodio define DURATION y drawScene(t).
// =====================================================================
const W = 1080, H = 1920;
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
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
function drawCat(st, t) {
  const { x, y, dir = 1, sx = 1, sy = 1, rot = 0, expr = 'normal', look = 0, paw = 0, walk = 0, chew = 0, tearsOn = 0 } = st;
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(dir * sx, sy);

  // sombra
  ctx.save(); ctx.globalAlpha = .18; ellipse(0, 4, 85, 14, '#000', false); ctx.restore();

  // cola (contorno + relleno)
  const wag = Math.sin(t * 5) * 18;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-60, -50); ctx.quadraticCurveTo(-150, -90 + wag, -120, -190 + wag * .6);
  ctx.lineWidth = 38; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.lineWidth = 22; ctx.strokeStyle = C.cat; ctx.stroke();

  // patas traseras / delanteras
  const step = Math.sin(walk * Math.PI * 2) * 10;
  ellipse(-42 + step, -10, 28, 15, C.cat);
  ellipse(42 - step, -10, 28, 15, C.cat);

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

  // cabeza
  const hx = 18, hy = -168;
  // orejas
  for (const s of [-1, 1]) {
    const ex = hx + s * 42;
    ctx.beginPath(); ctx.moveTo(ex - 32, hy - 40); ctx.lineTo(ex + s * 14, hy - 112); ctx.lineTo(ex + 34 * (s > 0 ? 1 : 0.6), hy - 40); ctx.closePath();
    ctx.fillStyle = C.cat; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex - 16, hy - 52); ctx.lineTo(ex + s * 10, hy - 92); ctx.lineTo(ex + 18 * (s > 0 ? 1 : .5), hy - 52); ctx.closePath();
    ctx.fillStyle = C.pink; ctx.fill();
  }
  ellipse(hx, hy, 84, 76, C.cat);
  // rayitas de la frente
  ctx.lineWidth = 8; ctx.strokeStyle = C.catDark;
  for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(hx + i * 18, hy - 72); ctx.lineTo(hx + i * 14, hy - 50); ctx.stroke(); }

  // mejillas
  ctx.save(); ctx.globalAlpha = .55; ellipse(hx - 46, hy + 22, 16, 10, C.pink, false); ellipse(hx + 56, hy + 22, 16, 10, C.pink, false); ctx.restore();

  // ojos
  const eyes = [[hx - 22, hy - 6], [hx + 34, hy - 6]];
  const ly = look * -8; // mirar hacia arriba
  for (const [ex, ey] of eyes) {
    if (expr === 'love') {
      heart(ex, ey + 4, 1.05 + Math.sin(t * 12) * .1);
    } else if (expr === 'happy' || expr === 'chew') {
      ctx.beginPath(); ctx.arc(ex, ey + 6, 14, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
    } else if (expr === 'dizzy') {
      ctx.save(); ctx.translate(ex, ey); ctx.rotate(t * 8);
      ctx.beginPath(); for (let a = 0; a < 12; a += .3) ctx.lineTo(Math.cos(a) * a * 1.3, Math.sin(a) * a * 1.3);
      ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore();
    } else if (expr === 'shock') {
      ellipse(ex, ey, 22, 26, C.white, true, 6);
      ellipse(ex + 2, ey + ly, 7, 8, C.ink, false);
    } else if (expr === 'sad') {
      ellipse(ex, ey + 2, 15, 19, C.ink, false);
      ellipse(ex - 4, ey - 5, 6, 7, C.white, false);
      ellipse(ex + 5, ey + 7, 3, 3, C.white, false);
      // ojos llorosos
      ctx.save(); ctx.globalAlpha = .6; ellipse(ex, ey + 18, 16, 6, '#8fd3ff', false); ctx.restore();
    } else {
      if ((t + 0.4) % 2.8 < .12) { // parpadeo: se ve "vivo"
        ctx.beginPath(); ctx.moveTo(ex - 13, ey); ctx.lineTo(ex + 13, ey); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
      } else {
        ellipse(ex, ey + ly, 13, 18, C.ink, false);
        ellipse(ex - 4, ey - 7 + ly, 5, 6, C.white, false);
      }
    }
  }
  // cejas
  if (expr === 'determined') {
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
  ctx.restore();
}

// ---------- ratoncito ----------
function drawMouse(st, t) {
  const { x, y, dir = -1, sx = 1, sy = 1, expr = 'normal', look = 0, chew = 0, holding = null } = st;
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * sx, sy);
  ctx.save(); ctx.globalAlpha = .18; ellipse(0, 3, 50, 9, '#000', false); ctx.restore();
  // cola
  ctx.beginPath(); ctx.moveTo(-40, -18); ctx.bezierCurveTo(-90, -10, -80, -70, -120, -50 + Math.sin(t * 6) * 8);
  ctx.lineCap = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.lineWidth = 6; ctx.strokeStyle = C.pink; ctx.stroke();
  // patas
  ellipse(-20, -6, 14, 8, C.mouseDark, true, 5); ellipse(20, -6, 14, 8, C.mouseDark, true, 5);
  // cuerpo
  ellipse(0, -36, 46, 34, C.mouse, true, 7);
  // orejas
  ellipse(26, -96, 22, 22, C.mouse, true, 7); ellipse(26, -96, 12, 12, C.pink, false);
  ellipse(64, -92, 22, 22, C.mouse, true, 7); ellipse(64, -92, 12, 12, C.pink, false);
  // cabeza
  ellipse(48, -62, 34, 30, C.mouse, true, 7);
  // ojo
  if (expr === 'happy' || expr === 'chew') {
    ctx.beginPath(); ctx.arc(54, -64, 8, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
  } else if (expr === 'shock') {
    ellipse(54, -66, 12, 14, C.white, true, 4); ellipse(56, -68 - look * 4, 4, 5, C.ink, false);
  } else {
    ellipse(56, -66 - look * 4, 7, 9, C.ink, false); ellipse(54, -70 - look * 4, 3, 3, C.white, false);
  }
  if (expr === 'guilty') { ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(44, -84); ctx.lineTo(64, -80); ctx.stroke(); }
  // nariz + bigotes
  ellipse(82, -58, 7, 6, C.pink, true, 3);
  ctx.lineWidth = 3; ctx.strokeStyle = C.ink;
  for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(78, -54); ctx.lineTo(108, -54 + k * 10); ctx.stroke(); }
  // boca
  if (expr === 'chew') { const o = (Math.sin(t * 24 + 1) + 1) / 2; ellipse(68, -44, 6, 2 + o * 5, '#7a2440', true, 3); }
  else if (expr === 'shock') ellipse(70, -44, 6, 8, '#7a2440', true, 3);
  ctx.save(); ctx.globalAlpha = .5; ellipse(44, -50, 9, 5, C.pink, false); ctx.restore();
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
function startEpisode(render) {
  window.render = render; window.DURATION = DURATION; window.ready = true;
  if (!navigator.webdriver) {
    document.body.classList.add('preview');
    const start = performance.now();
    (function loop() { render(((performance.now() - start) / 1000) % DURATION); requestAnimationFrame(loop); })();
  }
}
