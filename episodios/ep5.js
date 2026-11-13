// =====================================================================
//  EPISODIO 5 (3D) — "Birthday cake 🎂"
//  Pip lleva una tarta a Mochi (dormido). Mochi sopla tan fuerte que la nata
//  acaba encima de Pip. Pip trae una tarta de 3 pisos... Mochi sopla otra
//  vez y el piso de arriba le cae en la cabeza como un sombrero.
// =====================================================================
const DURATION = 23.5;
const K1X = 560, K2X = 770, MX = 330;

PROPS.table.visible = false; teapot.visible = false; jarGroup.visible = false; box.visible = false;
tableCookie.visible = false; catHalf.visible = false;

// ---------- tartas ----------
const pinkM = mat('#ffb3c8', .5), mintM = mat('#a8ecd0', .5), yelM = mat('#ffe58a', .5), creamM = mat('#fffaf2', .4), cherryM = mat('#e8193c', .2), plateM = mat('#ffffff', .3);
const flameTex = canvasTex(64, 128, (c, w, h) => { const g = c.createRadialGradient(32, 80, 2, 32, 70, 46); g.addColorStop(0, '#ffffff'); g.addColorStop(.3, '#ffe36b'); g.addColorStop(.7, 'rgba(255,140,40,.9)'); g.addColorStop(1, 'rgba(255,100,20,0)'); c.fillStyle = g; c.beginPath(); c.ellipse(32, 76, 22, 50, 0, 0, 7); c.fill(); });
function candle(y) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(.045, .045, .32, 12), mat('#7ec8ff', .4), { y: y + .16 }));
  for (let i = 0; i < 3; i++) g.add(mesh(new THREE.CylinderGeometry(.048, .048, .04, 12), mat('#ffffff', .4), { y: y + .06 + i * .1 }));
  const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  fl.position.y = y + .45; fl.scale.set(.2, .4, 1); g.add(fl); g.userData.flame = fl;
  return g;
}
function tier(r, h, m, y) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(r, r, h, 40), m, { y: y + h / 2 }));
  g.add(mesh(new THREE.TorusGeometry(r * .92, .07, 12, 40), creamM, { y: y + h, rx: Math.PI / 2 }));
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; g.add(mesh(SPH, creamM, { x: Math.cos(a) * r * .99, y: y + h - .1, z: Math.sin(a) * r * .99, sx: .09, sy: .14, sz: .09 })); }
  return g;
}
const cake1 = new THREE.Group();
cake1.add(mesh(new THREE.CylinderGeometry(.72, .72, .05, 40), plateM, { y: .025 }));
cake1.add(tier(.55, .55, pinkM, .05));
const top1 = new THREE.Group(); top1.add(mesh(SPH, creamM, { y: .62, sx: .42, sy: .16, sz: .42 })); top1.add(mesh(SPH, cherryM, { y: .8, sx: .12, sy: .12, sz: .12 })); cake1.add(top1);
const candle1 = candle(.66); cake1.add(candle1);
scene.add(cake1);
const cake2 = new THREE.Group();
cake2.add(mesh(new THREE.CylinderGeometry(1.0, 1.0, .05, 40), plateM, { y: .025 }));
cake2.add(tier(.85, .55, pinkM, .05)); cake2.add(tier(.66, .5, mintM, .6));
const tier3 = new THREE.Group(); tier3.add(tier(.47, .45, yelM, 0)); tier3.add(mesh(SPH, cherryM, { y: .55, sx: .13, sy: .13, sz: .13 }));
const candles2 = []; for (let i = 0; i < 5; i++) { const c = candle(.45); const a = i / 5 * Math.PI * 2; c.position.set(Math.cos(a) * .3, 0, Math.sin(a) * .3); tier3.add(c); candles2.push(c); }
cake2.add(tier3); tier3.position.y = 1.1;
scene.add(cake2);
// nata pegada a los personajes
const splatPip = new THREE.Group(); for (const [x, y, z, r] of [[0, .95, .2, .2], [-.18, .78, .35, .14], [.2, .6, .4, .15], [0, .4, .45, .17], [.25, 1.05, 0, .12]]) splatPip.add(mesh(SPH, creamM, { x, y, z, sx: r, sy: r * .8, sz: r }));
splatPip.add(mesh(SPH, cherryM, { y: 1.18, z: .1, sx: .12, sy: .12, sz: .12 }));
mouse.yawG.add(splatPip);
const splatCat = new THREE.Group(); for (const [x, y, z, r] of [[-.4, .3, .55, .16], [.35, .45, .55, .14], [.05, -.25, .7, .12], [-.55, -.1, .45, .12]]) splatCat.add(mesh(SPH, creamM, { x, y, z, sx: r, sy: r * .7, sz: r * .5 }));
cat.head.add(splatCat);

// ---------- guion ----------
const CAT = new Rig({ x: MX, y: FLOOR, z: Z_CHAR, dir: .5, sx: 1, sy: 1, rot: -1.45, look: 0, paw: 0, wr: 0, tears: 0 });
const MOU = new Rig({ x: 1150, y: FLOOR, z: Z_CHAR + .3, dir: -1, sx: 1, sy: 1, look: 0, wr: 0 });
const CEX = new Steps('happy'), MEX = new Steps('normal');
const CAM = new Rig({ s: 1.9, cx: 1000, cy: 1290 });
const K1 = new Rig({ carry: 1, x: 1150, wob: 1, flame: 0, top: 0 }), K2 = new Rig({ x: 1350, wob: 0, flame: 1, fall: 0 });

// 0–2.6 Pip trae la tarta tambaleándose
walk(MOU, 0, 2.5, 1150, K1X + 140, 2.6);
K1.key(0, { x: 1150 }); K1.key(2.5, { x: K1X + 140 }, 'io'); K1.key(2.55, { carry: 1, x: K1X + 140 }); K1.key(2.95, { carry: 0, x: K1X }, 'io'); K1.key(2.95, { wob: 0 });
MEX.at(.1, 'normal');
// enciende la vela
MOU.key(3.0, { look: 0 }); MOU.key(3.2, { look: .6 }); K1.key(3.25, { flame: 0 }); K1.key(3.45, { flame: 1 }, 'back');
MEX.at(3.35, 'happy');
// 3.7 salta sobre Mochi para despertarle
jump(MOU, 3.6, [K1X + 140, FLOOR], [MX - 40, FLOOR - 95], 150, .5, .1); MOU.key(3.62, { dir: -1 });
CAT.key(4.22, { rot: -1.45, sy: 1 }); CAT.key(4.3, { sy: .85 }, 'o');
MOU.key(4.3, { x: MX - 40, y: FLOOR - 95 }); MOU.key(4.5, { y: FLOOR - 220 }, 'oq'); MOU.key(4.75, { y: FLOOR }, 'iq'); MOU.key(4.75, { x: MX + 200 }, 'lin');
MOU.key(4.78, { sy: .8, sx: 1.2 }, 'o'); MOU.key(4.95, { sy: 1, sx: 1 }, 'back'); MOU.key(4.8, { dir: -1 });
CEX.at(4.3, 'shock');
CAT.key(4.35, { rot: -1.45, y: FLOOR }); CAT.key(4.75, { rot: 0 }, 'back'); CAT.key(4.4, { sy: 1 }); CAT.key(4.55, { y: FLOOR - 40 }, 'oq'); CAT.key(4.72, { y: FLOOR }, 'iq');
CAT.key(4.75, { dir: .5 }); CAT.key(5.0, { dir: .8 }); CEX.at(5.05, 'love');
// fiesta
MEX.at(5.0, 'happy');
for (const t of [5.2, 5.6, 6.0]) { MOU.key(t, { y: FLOOR }); MOU.key(t + .15, { y: FLOOR - 50 }, 'oq'); MOU.key(t + .3, { y: FLOOR }, 'iq'); }
MOU.key(6.3, { x: MX + 200 }); MOU.key(6.6, { x: K1X + 150 }, 'io');
// gran inspiración... ¡y sopla!
CEX.at(6.7, 'determined');
CAT.key(6.7, { sy: 1, sx: 1 }); CAT.key(7.85, { sy: 1.24, sx: 1.2 }, 'io');
CAT.key(8.0, { sy: .84, sx: .9 }, 'o'); CAT.key(8.5, { sy: 1, sx: 1 }, 'back');
K1.key(8.0, { flame: 1 }); K1.key(8.05, { flame: 0 }); K1.key(8.0, { top: 0 }); K1.key(8.3, { top: 1 }, 'o');
MEX.at(8.05, 'shock');
MOU.key(8.0, { x: K1X + 150, dir: -1 }); MOU.key(8.55, { x: 840 }, 'o'); MOU.key(8.0, { look: 0 });
for (let i = 0; i < 4; i++) MOU.key(8.05 + i * .12, { dir: i % 2 ? -1 : 1 });
MOU.key(8.55, { dir: -1 });
CEX.at(8.4, 'shock').at(9.0, 'sad');
MEX.at(9.3, 'normal').at(9.9, 'happy');
MOU.key(9.85, { y: FLOOR }); MOU.key(10.0, { y: FLOOR - 40 }, 'oq'); MOU.key(10.15, { y: FLOOR }, 'iq');
CEX.at(10.1, 'happy');
// Pip se va... y vuelve con una tarta GIGANTE
walk(MOU, 10.6, 11.3, 840, 1350, 3.6); MOU.key(10.55, { dir: -1 }); MOU.key(10.65, { dir: 1 });
CEX.at(11.1, 'chew');
MOU.key(11.8, { dir: 1 }); MOU.key(11.85, { dir: -1 });
walk(MOU, 11.9, 13.1, 1350, K2X + 190, 2.2);
K2.key(11.9, { x: 1350 - 190 }); K2.key(13.1, { x: K2X }, 'io');
MEX.at(13.1, 'happy');
CEX.at(13.2, 'shock').at(13.6, 'love');
CAT.key(13.1, { dir: .8 });
// Pip se esconde; Mochi coge aire (¡más!)
walk(MOU, 13.9, 14.6, K2X + 190, 160, 4.5); MOU.key(13.85, { dir: -1 }); MEX.at(13.9, 'shock');
MOU.key(14.6, { z: Z_CHAR + .3 }); MOU.key(14.7, { z: Z_CHAR - .4 });
CEX.at(14.2, 'determined');
CAT.key(14.2, { sy: 1, sx: 1 }); CAT.key(15.35, { sy: 1.36, sx: 1.3 }, 'io');
CAT.key(15.5, { sy: .82, sx: .9 }, 'o'); CAT.key(16.0, { sy: 1, sx: 1 }, 'back');
K2.key(15.5, { flame: 1 }); K2.key(15.56, { flame: 0 });
K2.key(15.5, { wob: 0 }); K2.key(15.7, { wob: 1 }); K2.key(16.2, { wob: 1.6 }); K2.key(16.6, { wob: 0 });
K2.key(16.0, { fall: 0 }); K2.key(16.45, { fall: 1 }, 'lin');
CEX.at(15.6, 'happy').at(16.45, 'dizzy');
CAT.key(16.45, { sy: 1 }); CAT.key(16.52, { sy: .82, sx: 1.12 }, 'o'); CAT.key(16.8, { sy: 1, sx: 1 }, 'back');
// Pip se parte de risa; Mochi se relame
MOU.key(16.5, { z: Z_CHAR - .4 }); MOU.key(16.7, { z: Z_CHAR + .3 });
walk(MOU, 16.7, 17.3, 160, 170, 1); MEX.at(16.6, 'happy');
for (const t of [17.0, 17.35, 17.7]) { MOU.key(t, { y: FLOOR }); MOU.key(t + .15, { y: FLOOR - 45 }, 'oq'); MOU.key(t + .3, { y: FLOOR }, 'iq'); }
CEX.at(17.4, 'happy').at(17.9, 'chew');
// comen juntos
MOU.key(18.2, { dir: -1 }); MOU.key(18.3, { dir: 1 });
walk(MOU, 18.35, 19.3, 170, K2X - 140, 3); MEX.at(19.4, 'chew');
CAT.key(18.4, { dir: .8 }); CEX.at(19.9, 'love').at(20.5, 'chew');
// cámara
CAM.key(0, { s: 1.9, cx: 1060, cy: 1290 }); CAM.key(2.5, { s: 1.9, cx: 720, cy: 1290 }); CAM.key(3.2, { s: 1.7, cx: 520, cy: 1255 });
CAM.key(7.0, { s: 1.7, cx: 520, cy: 1255 }); CAM.key(7.9, { s: 1.85, cx: 470, cy: 1260 }); CAM.key(8.6, { s: 1.55, cx: 600, cy: 1240 });
CAM.key(11.6, { s: 1.55, cx: 600, cy: 1240 }); CAM.key(13.0, { s: 1.35, cx: 620, cy: 1200 });
CAM.key(16.3, { s: 1.35, cx: 620, cy: 1200 }); CAM.key(16.7, { s: 1.9, cx: 400, cy: 1240 });
CAM.key(18.2, { s: 1.9, cx: 400, cy: 1240 }); CAM.key(19.3, { s: 1.55, cx: 560, cy: 1225 });
for (const r of [CAT, MOU, CAM, K1, K2]) r.done();

// ---------- estados ----------
function catState(t) {
  const wr = CAT.val('wr', t), ph = CAT.integ('wr', t), br = 1 + Math.sin(t * (t < 4.3 ? 2 : 4)) * (t < 4.3 ? .03 : .015);
  return { x: CAT.val('x', t), y: CAT.val('y', t), z: CAT.val('z', t), dir: CAT.val('dir', t), sx: CAT.val('sx', t) / br, sy: CAT.val('sy', t) * br,
    rot: CAT.val('rot', t), look: CAT.val('look', t), paw: CAT.val('paw', t), walk: ph, tearsOn: CAT.val('tears', t), expr: CEX.get(t) };
}
function mouseState(t) {
  const wr = MOU.val('wr', t), ph = MOU.integ('wr', t);
  return { x: MOU.val('x', t), y: MOU.val('y', t) - Math.abs(Math.sin(ph * Math.PI * 2)) * 10 * clamp(wr), z: MOU.val('z', t), dir: MOU.val('dir', t), sx: MOU.val('sx', t), sy: MOU.val('sy', t), look: MOU.val('look', t), expr: MEX.get(t) };
}
const CAMR = t => { let sh = 0; if (t > 8.0 && t < 8.4) sh = 8 * (1 - seg(t, 8.0, 8.4)); if (t > 16.45 && t < 16.8) sh = 10 * (1 - seg(t, 16.45, 16.8)); return { s: CAM.val('s', t), cx: CAM.val('cx', t) + Math.sin(t * 80) * sh, cy: CAM.val('cy', t) + Math.cos(t * 67) * sh }; };
const MOUTH = cs => new THREE.Vector3(U(cs.x) + .55, V(cs.y) + 1.55 * cs.sy, Z_CHAR + .6);

// ---------- fotograma ----------
function render(t) {
  resetFx();
  const cs = catState(t), ms = mouseState(t);
  setCat(cat, cs, t);
  setMouse(mouse, { ...ms, holding: null }, t, new THREE.Vector3(U(ms.x), V(ms.y), ms.z));
  // tarta 1
  const carry = K1.val('carry', t), wob = K1.val('wob', t);
  if (carry > 0) { const top = mouse.root.position; cake1.position.set(lerp(U(K1.val('x', t)), top.x - .1, carry), lerp(0, top.y + 1.25 + Math.abs(Math.sin(t * 7)) * .05, carry), ms.z); }
  else cake1.position.set(U(K1.val('x', t)), 0, Z_CHAR + .1);
  cake1.rotation.z = wob * Math.sin(t * 5.5) * .18 * (carry > 0 ? 1 : 0);
  const f1 = K1.val('flame', t); candle1.userData.flame.visible = f1 > .02; candle1.userData.flame.scale.set(.2 * f1, (.38 + Math.sin(t * 30) * .04) * f1, 1);
  const tp = K1.val('top', t);   // la nata sale volando hacia Pip
  top1.visible = tp < .99; top1.position.set(tp * 2.85, tp * .8 + Math.sin(tp * Math.PI) * .6, tp * .3); top1.rotation.z = -tp * 4;
  splatPip.visible = t > 8.3 && t < 9.9 ? true : t >= 9.9 ? (t < 10.5) : false;
  // tarta 2
  cake2.visible = t > 11.8; cake2.position.set(U(K2.val('x', t)), 0, Z_CHAR - .1);
  const w2 = K2.val('wob', t); cake2.rotation.z = w2 * Math.sin(t * 9) * .06;
  const fall = K2.val('fall', t);
  const f2 = K2.val('flame', t); candles2.forEach(c => { c.userData.flame.visible = f2 > .02; c.userData.flame.scale.set(.2 * f2, (.36 + Math.sin(t * 28 + c.position.x * 9) * .04) * f2, 1); });
  if (t < 16.45) {
    if (tier3.parent !== cake2) { cake2.add(tier3); }
    const a = { x: 0, y: 1.1 }, headW = cat.head.getWorldPosition(new THREE.Vector3());
    const local = cake2.worldToLocal(headW.clone().add(new THREE.Vector3(0, .62, 0)));
    tier3.position.set(lerp(a.x, local.x, fall), lerp(a.y, local.y, fall) + Math.sin(fall * Math.PI) * 1.2, lerp(0, local.z, fall));
    tier3.rotation.set(0, 0, fall * 1.2 * Math.sin(fall * Math.PI));
  } else {
    if (tier3.parent !== cat.head) { cat.head.add(tier3); }
    tier3.position.set(0, .62, 0); tier3.rotation.set(0, 0, .15); tier3.scale.setScalar(1 / Math.max(.5, cat.squash.scale.y));
  }
  splatCat.visible = t > 16.45 && t < 18.6;
  // efectos
  const cx3 = U(cs.x), cy3 = V(cs.y);
  if (t > 5.0 && t < 7.0) for (let i = 0; i < 14; i++) { const ph = ((t - 5) * .7 + i / 14) % 1; sprite(i % 2 ? spritesY : spritesW, U(K1X) + Math.sin(i * 2.3 + ph * 4) * 2.4, V(FLOOR) + 4.2 - ph * 4, Z_CHAR + .8, .45, Math.sin(ph * Math.PI)); }
  if (t > 5.0 && t < 7.0) for (let i = 0; i < 4; i++) { const ph = ((t - 5) * .8 + i / 4) % 1, h = hearts.next(); h.position.set(cx3 + .2 + Math.sin(ph * 6 + i) * .3, cy3 + 2.9 + ph * 1.3, Z_CHAR + .4); h.scale.setScalar(Math.sin(ph * Math.PI) * 1.1); }
  for (const [t0, t1] of [[8.0, 8.6], [15.5, 16.1]]) if (t > t0 && t < t1) for (let i = 0; i < 12; i++) { const p = ((t - t0) * 2.5 + i / 12) % 1; const pf = puffs.next(); pf.position.set(cx3 + .8 + p * 5, cy3 + 1.3 + Math.sin(i * 1.7) * .5, Z_CHAR + .5 + Math.cos(i) * .3); pf.scale.set(.18 * (1 - p) + .05, .08, .08); pf.material.opacity = .7 * (1 - p); }
  if (t > 16.45 && t < 17.3) for (let i = 0; i < 3; i++) { const a = t * 7 + i * 2.1; sprite(spritesY, cx3 + Math.cos(a) * .8, cy3 + 3.6, Z_CHAR + .3 + Math.sin(a) * .8, .55, 1); }
  for (const [tl, xx, n] of [[4.75, MX + 200, .7], [16.45, MX, 1.4]]) {
    const p = seg(t, tl, tl + .5);
    if (p > 0 && p < 1) for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const pf = puffs.next(), r = .2 * n * (1 - p * .4); pf.position.set(U(xx) + s * (.6 * n + p * 1.1 * n + k * .25), (tl > 16 ? 3.0 : .12) + k * .08 + p * .2, Z_CHAR + (k - 1) * .3); pf.scale.set(r, r * .8, r); pf.material.opacity = (1 - p) * .9; }
  }
  if (t > 19.6) for (let i = 0; i < 5; i++) { const ph = ((t - 19.6) * .6 + i / 5) % 1, h = (i % 2 ? hearts : heartsPink).next(); h.position.set(U(560) + Math.sin(ph * 5 + i * 2) * 1.6, 3.2 + ph * 2.2, Z_CHAR + .6); h.scale.setScalar(Math.sin(ph * Math.PI) * 1.1); h.rotation.y = Math.sin(t * 2 + i); }

  placeCamera(t, CAMR(t));
  renderer.render(scene, camera);
  ctx.clearRect(0, 0, W, H);
  // Zzz mientras duerme
  if (t < 4.3) { const hp = toScreen(new THREE.Vector3(cx3 - 1.4, cy3 + .9, Z_CHAR)); for (let i = 0; i < 3; i++) { const ph = (t * .5 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); ctx.font = `900 ${40 + i * 14}px Inter, sans-serif`; ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.fillStyle = '#9fd8ff'; ctx.strokeText('z', hp.x - 30 + ph * 60, hp.y - ph * 160); ctx.fillText('z', hp.x - 30 + ph * 60, hp.y - ph * 160); ctx.restore(); } }
  // ráfagas de viento
  for (const [t0, t1] of [[8.0, 8.6], [15.5, 16.2]]) if (t > t0 && t < t1) {
    const m = toScreen(MOUTH(cs)), p = seg(t, t0, t1);
    ctx.save(); ctx.globalAlpha = .7 * (1 - p); ctx.strokeStyle = '#ffffff'; ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) { const yy = m.y - 60 + i * 24, off = ((t - t0) * 1400 + i * 90) % 500; ctx.lineWidth = 10 - i % 3 * 2; ctx.beginPath(); ctx.moveTo(m.x + 40 + off, yy); ctx.lineTo(m.x + 160 + off, yy); ctx.stroke(); }
    ctx.restore();
  }
  if (t > 16.45 && t < 16.9) focusLines(t, 1 - seg(t, 16.6, 16.9));
  caption('🎂 😰', t, 0, 2.4, { size: 150 });
  pill('👀', t, 0, 3.0);
  caption('🤫', t, 2.5, 3.5, { size: 150 });
  caption('🎂 🎉', t, 5.0, 6.6, { size: 140, highlight: true });
  caption('😤', t, 6.8, 7.95, { size: 160 });
  caption('💨 💨', t, 8.0, 9.0, { size: 150 });
  caption('😋', t, 9.9, 10.8, { size: 160 });
  caption('🎂🎂🎂 !?', t, 13.0, 14.1, { size: 120, highlight: true });
  caption('😤😤😤', t, 14.3, 15.45, { size: 130 });
  comicWord('SPLAT!', t, 16.45, 17.3, new THREE.Vector3(cx3 + .6, cy3 + 3.6, Z_CHAR), 140, '#ffb3c8', -.08);
  caption('😂 😂', t, 17.3, 18.6, { size: 140 });
  caption('🎂 ❤️', t, 19.6, 21.1, { size: 150 });
  endCard(t, 21.2, 6);
  finishFrame();
}
startEpisode(render);
