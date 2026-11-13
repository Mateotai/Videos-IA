// =====================================================================
//  EPISODIO 3 (3D) — "The box 📦"
//  Un regalo se mueve solo. Pip lo abre: sale una pelota. A Mochi solo le
//  interesa la caja. Pip la empuja con Mochi dentro y luego se mete con él.
//  Final: cae del cielo una caja GIGANTE y los dos se lanzan dentro.
// =====================================================================
const DURATION = 25;
const GX = 560, GW = 300, GH = 260;          // regalo (coordenadas 2D del mundo)
const BIGX = 880, BIGW = 380, BIGH = 400;    // caja gigante

// ---------- atrezo ----------
PROPS.table.visible = false; teapot.visible = false; jarGroup.visible = false; box.visible = false;
tableCookie.visible = false; catHalf.visible = false;
const giftTex = canvasTex(256, 256, (c, w, h) => {
  c.fillStyle = '#ff5f7e'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff';
  for (let y = 16; y < h; y += 44) for (let x = 16 + ((y / 44) % 2) * 22; x < w; x += 44) { c.beginPath(); c.arc(x, y, 8, 0, 7); c.fill(); }
}, [2, 2]);
const giftMat = mat('#ffffff', .55, { map: giftTex }), ribbonMat = mat('#ffd23f', .35), cardMat = mat('#d9a86c', .85), cardIn = mat('#b8864c', .9);
function openBox(w, h, d, outer, inner) {
  const g = new THREE.Group(), th = .08;
  g.add(mesh(new THREE.BoxGeometry(w, h, th), outer, { y: h / 2, z: d / 2 }));
  g.add(mesh(new THREE.BoxGeometry(w, h, th), outer, { y: h / 2, z: -d / 2 }));
  g.add(mesh(new THREE.BoxGeometry(th, h, d), outer, { x: -w / 2, y: h / 2 }));
  g.add(mesh(new THREE.BoxGeometry(th, h, d), outer, { x: w / 2, y: h / 2 }));
  g.add(mesh(new THREE.BoxGeometry(w, th, d), inner, { y: th / 2 }));
  return g;
}
const gift = openBox(GW / 100, GH / 100, 2.0, giftMat, giftMat);
for (const [w, h, d, x, z] of [[.36, GH / 100, .04, 0, 1.03], [.04, GH / 100, .36, GW / 200 + .03, 0], [.04, GH / 100, .36, -GW / 200 - .03, 0]]) gift.add(mesh(new THREE.BoxGeometry(w, h, d), ribbonMat, { x, y: GH / 200, z }));
scene.add(gift);
const lid = new THREE.Group();
lid.add(mesh(new THREE.BoxGeometry(GW / 100 + .14, .3, 2.14), giftMat));
lid.add(mesh(new THREE.BoxGeometry(.36, .32, 2.16), ribbonMat)); lid.add(mesh(new THREE.BoxGeometry(GW / 100 + .16, .32, .36), ribbonMat));
for (const s of [-1, 1]) lid.add(mesh(new THREE.TorusGeometry(.32, .1, 14, 30), ribbonMat, { x: s * .3, y: .38, rz: s * .5, ry: .3 }));
lid.add(mesh(SPH, ribbonMat, { y: .22, sx: .16, sy: .14, sz: .16 }));
scene.add(lid);
const bigBox = openBox(BIGW / 100, BIGH / 100, 2.6, mat('#ffffff', .85, { map: boxTex }), cardIn);
bigBox.add(mesh(new THREE.BoxGeometry(.6, .03, 2.62), mat('#efd7a6', .6), { y: BIGH / 100 + .01 }));
scene.add(bigBox);
const ballTex = canvasTex(256, 128, (c, w, h) => { const cols = ['#ff4d6d', '#ffd23f', '#4dc3ff', '#7ee081']; for (let i = 0; i < 8; i++) { c.fillStyle = cols[i % 4]; c.fillRect(i * 32, 0, 32, h); } c.fillStyle = '#fff'; c.beginPath(); c.arc(64, 40, 14, 0, 7); c.fill(); });
const ball = mesh(new THREE.SphereGeometry(.35, 32, 20), mat('#ffffff', .25, { map: ballTex }));
scene.add(ball);
const bigShadow = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshBasicMaterial({ color: '#3a2a35', transparent: true, opacity: 0, depthWrite: false }));
bigShadow.rotation.x = -Math.PI / 2; bigShadow.position.set(U(BIGX), .02, Z_CHAR - .2); scene.add(bigShadow);

// ---------- guion ----------
const CAT = new Rig({ x: -150, y: FLOOR, z: Z_CHAR, dir: 1, sx: 1, sy: 1, rot: 0, look: 0, paw: 0, wr: 0, tears: 0 });
const MOU = new Rig({ x: 1250, y: FLOOR, z: Z_CHAR, dir: -1, sx: 1, sy: 1, look: 0, wr: 0 });
const CEX = new Steps('normal'), MEX = new Steps('normal');
const BX = new Rig({ x: GX, shake: 0 }), LID = new Rig({ y: FLOOR - GH, x: GX, spin: 0 }), CAM = new Rig({ s: 2.0, cx: GX, cy: 1330 });
const BIG = new Rig({ y: FLOOR - 2600 });

// 0–2 el regalo tiembla solo
for (const t of [.3, .9, 1.5]) { BX.key(t - .02, { shake: 0 }); BX.key(t + .05, { shake: 1 }, 'o'); BX.key(t + .35, { shake: 0 }); }
// 2–3.2 entran los dos
walk(CAT, 2.0, 3.0, -150, 330, 3.2); walk(MOU, 2.0, 3.0, 1250, 790, 3.6);
CAT.key(3.0, { look: 0 }); CAT.key(3.3, { look: 1 });
CEX.at(3.05, 'shock').at(3.45, 'love'); MEX.at(3.05, 'shock').at(3.45, 'happy');
// 3.6 Pip salta a la tapa y tira del lazo
jump(MOU, 3.45, [790, FLOOR], [620, FLOOR - GH - 30], 120, .5, .12);
MOU.key(4.1, { look: 0 }); MEX.at(4.15, 'normal');
for (const t of [4.2, 4.42]) { MOU.key(t, { sx: 1, sy: 1 }); MOU.key(t + .1, { sx: 1.18, sy: .86 }, 'o'); MOU.key(t + .2, { sx: 1, sy: 1 }); }
// 4.65 ¡POP! la tapa sale volando, Pip cae
LID.key(4.65, { y: FLOOR - GH, x: GX, spin: 0 }); LID.key(5.4, { y: FLOOR - 2400, x: GX - 200, spin: 9 }, 'o');
MEX.at(4.66, 'shock');
MOU.key(4.66, { x: 620, y: FLOOR - GH - 30 }); MOU.key(4.9, { y: FLOOR - GH - 160 }, 'oq'); MOU.key(5.15, { y: FLOOR }, 'iq'); MOU.key(5.15, { x: 840 }, 'lin');
MOU.key(5.17, { sx: 1.2, sy: .8 }, 'o'); MOU.key(5.35, { sx: 1, sy: 1 }, 'back');
// la pelota sale rebotando y Pip la persigue
MEX.at(5.35, 'happy');
walk(MOU, 5.5, 6.4, 840, 1300, 4); MOU.key(5.45, { dir: -1 }); MOU.key(5.55, { dir: 1 });
// Mochi mira la caja... ¡le encanta!
CAT.key(4.7, { look: 1 }); CAT.key(5.1, { look: .4 }); CEX.at(4.7, 'shock').at(5.3, 'normal').at(6.0, 'love');
walk(CAT, 5.4, 6.1, 330, 300, 2.4); CAT.key(5.45, { dir: 1 });
CAT.key(6.1, { rot: 0 }); CAT.key(6.35, { rot: -.25 }); CAT.key(6.55, { rot: 0 });
// 6.7 salta dentro
jump(CAT, 6.6, [300, FLOOR], [GX, FLOOR + 40], 300, .55, .15); CEX.at(6.75, 'happy');
const IN = FLOOR - 95, HID = FLOOR + 60;   // asomando los ojos / escondido
CAT.key(7.6, { y: FLOOR + 40 }); CAT.key(8.1, { y: IN }, 'back'); CAT.key(8.1, { dir: .15 }); CEX.at(7.9, 'smile');
// 9–10 vuelve Pip con la pelota
walk(MOU, 9.0, 9.9, 1250, 830, 3.4); MOU.key(9.0, { dir: -1 });
MOU.key(10.0, { y: FLOOR }); MOU.key(10.12, { y: FLOOR - 40 }, 'oq'); MOU.key(10.25, { y: FLOOR }, 'iq');
// Mochi dice que no con la cabeza y se esconde
CEX.at(10.3, 'normal');
for (let i = 0; i < 5; i++) CAT.key(10.35 + i * .12, { dir: i % 2 ? -.5 : .5 });
CAT.key(11.0, { dir: .15 }); CAT.key(11.05, { y: IN }); CAT.key(11.3, { y: HID }, 'i');
MEX.at(10.6, 'normal'); MOU.key(10.7, { look: 0 }); MOU.key(11.1, { sy: 1 }); MOU.key(11.25, { sy: .92 });
// Pip suelta la pelota y empuja la caja
CAT.key(11.8, { y: HID }); CAT.key(12.2, { y: IN }, 'back');
MOU.key(11.4, { x: 830, sy: 1 }); MOU.key(11.75, { x: GX + 200 }, 'io');
BX.key(11.95, { x: GX }); BX.key(13.3, { x: 420 }, 'io');
MOU.key(11.95, { x: GX + 200, wr: 0 }); MOU.key(12.05, { wr: 2.2 }); MOU.key(13.2, { wr: 2.2 }); MOU.key(13.3, { x: 420 + 200, wr: 0 }, 'io');
MEX.at(11.9, 'normal');
CEX.at(12.2, 'happy');
// 13.6 Pip salta y aterriza en la cabeza de Mochi
const HEAD = IN - 250;
jump(MOU, 13.55, [620, FLOOR], [420, HEAD], 160, .55, .13); MEX.at(14.3, 'happy');
MOU.key(14.4, { dir: -.2 });
CAT.key(14.25, { sy: 1 }); CAT.key(14.33, { sy: .88 }, 'o'); CAT.key(14.55, { sy: 1 }, 'back');
CEX.at(14.3, 'smile');
// 18.4 algo cae del cielo...
CAT.key(18.3, { look: 0 }); CAT.key(18.6, { look: 2 }); MOU.key(18.3, { look: 0 }); MOU.key(18.6, { look: 2 });
CEX.at(18.5, 'normal'); MEX.at(18.5, 'normal');
BIG.key(18.6, { y: FLOOR - 2600 }); BIG.key(19.4, { y: FLOOR }, 'iq');
CEX.at(19.4, 'shock'); MEX.at(19.4, 'shock');
CAT.key(19.4, { y: IN }); CAT.key(19.5, { y: IN - 30 }, 'oq'); CAT.key(19.62, { y: IN }, 'iq');
CAT.key(19.6, { look: 2, dir: .15 }); CAT.key(20.0, { look: .3, dir: .9 }); MOU.key(19.6, { look: 2, dir: -.2 }); MOU.key(20.0, { look: .3, dir: .9 });
CEX.at(20.6, 'love'); MEX.at(20.6, 'happy');
// 21.1 ¡a la caja gigante!
jump(MOU, 21.05, [420, HEAD], [BIGX + 115, FLOOR + 40], 420, .7, .12);
jump(CAT, 21.3, [420, IN], [BIGX - 60, FLOOR + 80], 380, .7, .15);
CAT.key(21.3, { dir: .9 });
// 22.5 asoman los dos
CAT.key(22.3, { y: FLOOR + 80 }); CAT.key(22.75, { y: FLOOR - BIGH + 135 }, 'back'); CAT.key(22.75, { dir: .15, look: 0 });
MOU.key(22.45, { y: FLOOR + 40 }); MOU.key(22.9, { y: FLOOR - BIGH + 65 }, 'back'); MOU.key(22.9, { dir: -.3, look: 0 });
CEX.at(22.7, 'love'); MEX.at(22.85, 'happy');
// cámara
CAM.key(2.0, { s: 2.0, cx: GX, cy: 1330 }); CAM.key(2.8, { s: 1.45, cx: 560, cy: 1200 });
CAM.key(6.3, { s: 1.45, cx: 560, cy: 1200 }); CAM.key(7.0, { s: 1.85, cx: 520, cy: 1260 });
CAM.key(8.8, { s: 1.85, cx: 520, cy: 1260 }); CAM.key(9.4, { s: 1.5, cx: 620, cy: 1220 });
CAM.key(11.5, { s: 1.5, cx: 620, cy: 1220 }); CAM.key(12.6, { s: 1.5, cx: 520, cy: 1220 });
CAM.key(13.4, { s: 1.5, cx: 520, cy: 1220 }); CAM.key(14.6, { s: 1.85, cx: 470, cy: 1230 });
CAM.key(18.3, { s: 1.85, cx: 470, cy: 1230 }); CAM.key(19.9, { s: 1.08, cx: 650, cy: 1150 });
CAM.key(22.2, { s: 1.08, cx: 650, cy: 1150 }); CAM.key(23.5, { s: 1.3, cx: 760, cy: 1180 });
for (const r of [CAT, MOU, BX, LID, CAM, BIG]) r.done();

// ---------- estados ----------
function catState(t) {
  const wr = CAT.val('wr', t), ph = CAT.integ('wr', t), br = 1 + Math.sin(t * 4) * .015;
  return { x: CAT.val('x', t), y: CAT.val('y', t) - Math.abs(Math.sin(ph * Math.PI * 2)) * 12 * clamp(wr), z: CAT.val('z', t), dir: CAT.val('dir', t),
    sx: CAT.val('sx', t) / br, sy: CAT.val('sy', t) * br, rot: CAT.val('rot', t), look: CAT.val('look', t), paw: CAT.val('paw', t), walk: ph, tearsOn: CAT.val('tears', t), expr: CEX.get(t) };
}
function mouseState(t) {
  const wr = MOU.val('wr', t), ph = MOU.integ('wr', t);
  return { x: MOU.val('x', t), y: MOU.val('y', t) - Math.abs(Math.sin(ph * Math.PI * 2)) * 10 * clamp(wr), z: MOU.val('z', t), dir: MOU.val('dir', t), sx: MOU.val('sx', t), sy: MOU.val('sy', t), look: MOU.val('look', t), expr: MEX.get(t) };
}
function ballPos(t) {
  if (t < 4.66) return null;
  if (t < 6.6) {
    const hops = [[4.66, GX, FLOOR - GH, 790, 520], [5.15, 790, FLOOR, 960, 240], [5.55, 960, FLOOR, 1080, 120], [5.85, 1080, FLOOR, 1400, 50]];
    for (let i = hops.length - 1; i >= 0; i--) {
      const [t0, x0, y0, x1, h] = hops[i]; if (t < t0) continue;
      const t1 = i + 1 < hops.length ? hops[i + 1][0] : 6.6, p = seg(t, t0, t1);
      return { x: lerp(x0, x1, p), y: lerp(y0, FLOOR, p) - 4 * h * p * (1 - p) - 35, spin: t * 8 };
    }
  }
  if (t < 9.0) return null;
  if (t < 11.4) return 'held';
  const p = seg(t, 11.4, 12.4);
  return { x: lerp(860, 990, E.o(p)), y: FLOOR - 35 - Math.abs(Math.sin(p * Math.PI * 2)) * 40 * (1 - p), spin: p * 5 };
}
const CAMR = t => { const sh = (t > 19.4 && t < 19.8) ? 14 * (1 - seg(t, 19.4, 19.8)) : 0; return { s: CAM.val('s', t), cx: CAM.val('cx', t) + Math.sin(t * 80) * sh, cy: CAM.val('cy', t) + Math.cos(t * 67) * sh }; };

// ---------- fotograma ----------
function render(t) {
  resetFx();
  const cs = catState(t), ms = mouseState(t);
  setCat(cat, cs, t);
  setMouse(mouse, { ...ms, holding: null }, t, new THREE.Vector3(U(ms.x), V(ms.y), ms.z));
  // regalo
  const bx = BX.val('x', t), sh = BX.val('shake', t);
  gift.position.set(U(bx), sh * .12 * Math.abs(Math.sin(t * 30)), Z_CHAR);
  gift.rotation.z = sh * .06 * Math.sin(t * 38);
  lid.visible = t < 5.45;
  lid.position.set(U(t < 4.65 ? bx : LID.val('x', t)), V(LID.val('y', t)) + .15 + (t < 4.65 ? gift.position.y : 0), Z_CHAR);
  lid.rotation.set(LID.val('spin', t) * .3, 0, t < 4.65 ? gift.rotation.z : LID.val('spin', t));
  // caja gigante
  bigBox.visible = t > 18.6; bigBox.position.set(U(BIGX), V(BIG.val('y', t)), Z_CHAR - .2);
  // pelota
  const bp = ballPos(t);
  ball.visible = !!bp;
  if (bp === 'held') { const p = mouse.hold.getWorldPosition(new THREE.Vector3()); ball.position.set(p.x, p.y + .15, p.z + .1); ball.rotation.set(0, t, 0); }
  else if (bp) { ball.position.set(U(bp.x), V(bp.y), Z_CHAR + .3); ball.rotation.set(0, 0, -bp.spin); }
  // efectos
  const cx3 = U(cs.x), cy3 = V(cs.y);
  if (t > 3.5 && t < 4.6) for (let i = 0; i < 3; i++) { const ph = ((t - 3.5) * .9 + i / 3) % 1, h = hearts.next(); h.position.set(cx3 + .3 + Math.sin(ph * 6 + i) * .3, cy3 + 2.9 + ph * 1.4, Z_CHAR + .4); h.scale.setScalar(Math.sin(ph * Math.PI) * 1.2); h.rotation.y = Math.sin(t * 3 + i) * .6; }
  if ((t > 8.2 && t < 9.6) || (t > 14.6 && t < 18.3) || t > 22.9) for (let i = 0; i < 5; i++) {
    const ph = (t * .6 + i / 5) % 1, h = (i % 2 ? hearts : heartsPink).next();
    h.position.set(U(t > 22 ? BIGX : bx) + Math.sin(ph * 5 + i * 2) * 1.3, V(FLOOR - GH) + 1.4 + ph * 2.2 + (t > 22 ? 1.4 : 0), Z_CHAR + .6);
    h.scale.setScalar(Math.sin(ph * Math.PI) * 1.1); h.rotation.y = Math.sin(t * 2 + i);
  }
  for (const [tl, xx, yy, n] of [[5.15, 840, FLOOR, 1], [7.15, GX, FLOOR - GH, 1], [19.4, BIGX, FLOOR, 2.2], [21.95, BIGX, FLOOR - BIGH, 1.4]]) {
    const p = seg(t, tl, tl + .5);
    if (p > 0 && p < 1) for (const s of [-1, 1]) for (let k = 0; k < 3; k++) {
      const pf = puffs.next(), r = .22 * n * (1 - p * .4);
      pf.position.set(U(xx) + s * (.6 * n + p * 1.2 * n + k * .25), V(yy) + .12 + k * .08 + p * .2, Z_CHAR + (k - 1) * .3);
      pf.scale.set(r, r * .8, r); pf.material.opacity = (1 - p) * .9;
    }
  }
  if (t > 4.65 && t < 5.4) for (let i = 0; i < 10; i++) { const p = seg(t, 4.65, 5.4); sprite(i % 2 ? spritesY : spritesW, U(GX) + Math.cos(i * .63) * (1 + p * 2.4), V(FLOOR - GH) + .4 + Math.sin(i * .63) * (.6 + p * 1.6), Z_CHAR + .8, .5 * (1 - p) + .2, 1 - p); }
  bigShadow.visible = t > 18.6 && t < 19.45; if (bigShadow.visible) { const p = seg(t, 18.6, 19.4); bigShadow.material.opacity = .3 * p; bigShadow.scale.set(2.2 * p + .1, 1.4 * p + .1, 1); }

  placeCamera(t, CAMR(t));
  renderer.render(scene, camera);
  // ----- textos -----
  ctx.clearRect(0, 0, W, H);
  const flash = t > 19.4 && t < 19.55 ? 1 - seg(t, 19.4, 19.55) : 0;
  if (flash > 0) { ctx.fillStyle = `rgba(255,255,255,${flash * .5})`; ctx.fillRect(0, 0, W, H); }
  if (t > 19.4 && t < 20.2) focusLines(t, 1 - seg(t, 19.8, 20.2));
  caption('🎁 ❓', t, 0, 2.0, { size: 150 });
  pill('👀', t, 0, 3.4);
  caption('🎁 !!!', t, 3.1, 4.5, { size: 130, highlight: true });
  comicWord('POP!', t, 4.65, 5.3, new THREE.Vector3(U(GX), V(FLOOR - GH) + 1.6, Z_CHAR), 140, '#ffd93d', -.1);
  caption('🎉 🔴', t, 5.0, 6.1, { size: 140 });
  caption('📦 = 😻', t, 7.6, 9.3, { size: 140, highlight: true });
  caption('🔴 ?', t, 9.6, 10.3, { size: 130 });
  caption('❓', t, 10.9, 11.8, { size: 150 });
  caption('VROOM 😹', t, 12.1, 13.4, { size: 130, rot: -.04 });
  caption('📦 ❤️', t, 14.5, 18.3, { size: 150 });
  comicWord('THUD!', t, 19.4, 20.1, new THREE.Vector3(U(BIGX), V(FLOOR - BIGH) + 1.0, Z_CHAR), 150, '#ffffff', .06);
  caption('😮', t, 20.0, 21.0, { size: 170 });
  caption('YAAAY! 🎉', t, 21.1, 22.5, { size: 130, highlight: true });
  endCard(t, 23.0, 4);
  finishFrame();
}
startEpisode(render);
