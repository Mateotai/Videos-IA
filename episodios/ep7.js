// =====================================================================
//  EPISODIO 7 (3D) — "Bedtime 🌙"
//  Noche. Pip ronca y Mochi no puede dormir: almohada en la cabeza, toquecito,
//  se va a una esquina... las "Z" le persiguen. Idea: ronronear MUY fuerte.
//  Pip se despierta, sonríe y se acurruca. Final: suena el despertador.
// =====================================================================
const DURATION = 23.5;
const BEDX = 560, MX = 500, PX = 650, CORNER = 170;
PROPS.table.visible = false; teapot.visible = false; jarGroup.visible = false; box.visible = false;
tableCookie.visible = false; catHalf.visible = false;

// ---------- noche ----------
scene.background = new THREE.Color('#1d2447');
for (const o of scene.children) if (o.isHemisphereLight) { o.color.set('#8fa3ff'); o.groundColor.set('#3a2c4a'); o.intensity = .75; }
key.color.set('#9fb4ff'); key.intensity = 1.0; rim.color.set('#b7a2ff'); rim.intensity = .7; fill.intensity = .25;
const lamp = new THREE.PointLight('#ffb75e', 14, 9, 1.6); lamp.position.set(U(820), 2.4, 1.6); scene.add(lamp);
const nightTex = canvasTex(512, 512, (c, w, h) => {
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0d1238'); g.addColorStop(1, '#2b3a7a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) { c.fillStyle = `rgba(255,255,230,${.4 + rnd(i) * .6})`; c.beginPath(); c.arc(rnd(i * 3) * w, rnd(i * 7) * h * .8, 1 + rnd(i * 11) * 2.5, 0, 7); c.fill(); }
  c.fillStyle = '#fff6c9'; c.beginPath(); c.arc(330, 150, 70, 0, 7); c.fill(); c.fillStyle = '#0d1238'; c.beginPath(); c.arc(300, 130, 64, 0, 7); c.fill();
  c.fillStyle = '#1b2a55'; c.beginPath(); c.ellipse(300, 520, 330, 120, 0, 0, 7); c.fill();
});
room.userData.win.userData.sky.material.map = nightTex; room.userData.win.userData.sky.material.needsUpdate = true;
// lamparita
const lampG = new THREE.Group(); lampG.position.set(U(840), 0, 1.0); scene.add(lampG);
lampG.add(mesh(new THREE.CylinderGeometry(.25, .3, .1, 24), mat('#c98a5a', .5), { y: .05 }));
lampG.add(mesh(new THREE.CylinderGeometry(.04, .04, 1.2, 12), mat('#c98a5a', .5), { y: .65 }));
lampG.add(mesh(new THREE.CylinderGeometry(.22, .42, .45, 24, 1, true), mat('#ffd99a', .6, { emissive: '#ffb75e', emissiveIntensity: .9, side: THREE.DoubleSide }), { y: 1.35 }));
// cama redonda
const bed = new THREE.Group(); bed.position.set(U(BEDX), 0, Z_CHAR); scene.add(bed);
bed.add(mesh(new THREE.TorusGeometry(1.45, .38, 20, 48), mat('#8a7cff', .8), { y: .3, rx: Math.PI / 2, sz: 1.0 }));
bed.add(mesh(new THREE.CylinderGeometry(1.45, 1.45, .22, 48), mat('#c8bfff', .9), { y: .14 }));
const pillow = mesh(new THREE.BoxGeometry(1.1, .32, .75, 4, 2, 2), mat('#ffffff', .8)); scene.add(pillow);
{ const p = pillow.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); p.setY(i, y * (1 - Math.abs(x) * .5) * (1 - Math.abs(z) * .3)); } p.needsUpdate = true; pillow.geometry.computeVertexNormals(); }
// despertador
const clock = new THREE.Group(); clock.position.set(U(780), 0, 1.7); scene.add(clock);
clock.add(mesh(new THREE.CylinderGeometry(.42, .42, .25, 32), mat('#ff4d6d', .35), { y: .55, rx: Math.PI / 2 }));
clock.add(mesh(new THREE.CylinderGeometry(.34, .34, .02, 32), mat('#fffaf0', .4), { y: .55, z: .13, rx: Math.PI / 2 }));
for (const s of [-1, 1]) { clock.add(mesh(SPH, mat('#ffd23f', .3), { x: s * .3, y: .98, sx: .17, sy: .14, sz: .17 })); clock.add(mesh(new THREE.CylinderGeometry(.03, .03, .35, 8), mat('#3a2a35', .5), { x: s * .25, y: .2, rz: s * .4 })); }
clock.add(mesh(new THREE.BoxGeometry(.03, .22, .02), mat('#3a2a35', .5), { y: .62, z: .15 })); clock.add(mesh(new THREE.BoxGeometry(.15, .03, .02), mat('#3a2a35', .5), { x: .06, y: .55, z: .15 }));
// pompa de mocos de Pip
const snot = new THREE.Mesh(new THREE.SphereGeometry(.2, 24, 16), new THREE.MeshPhysicalMaterial({ color: '#bfe8ff', emissive: '#4f7fa8', emissiveIntensity: .35, transparent: true, opacity: .62, roughness: .05, clearcoat: 1 }));
scene.add(snot);

// ---------- guion ----------
const CAT = new Rig({ x: MX, y: FLOOR - 22, z: Z_CHAR, dir: .5, sx: 1, sy: 1, rot: -1.45, look: 0, paw: 0, wr: 0, tears: 0 });
const MOU = new Rig({ x: PX, y: FLOOR - 22, z: Z_CHAR + .3, dir: 0, sx: 1, sy: 1, look: 0, wr: 0 });
const CEX = new Steps('happy'), MEX = new Steps('happy');
const CAM = new Rig({ s: 2.6, cx: 620, cy: 1380 }), PIL = new Rig({ on: 0 }), SNORE = new Rig({ amp: 1 });
// ronquidos: intensidad (0 = silencio)
SNORE.key(6.6, { amp: 1 }); SNORE.key(6.75, { amp: 0 }); SNORE.key(8.1, { amp: 0 }); SNORE.key(8.25, { amp: 2.2 }, 'o'); SNORE.key(9.0, { amp: 1.2 });
SNORE.key(14.1, { amp: 1.2 }); SNORE.key(14.25, { amp: 0 });
// 0–3.5 Mochi abre un ojo... se sienta
CEX.at(1.0, 'determined');
CAT.key(2.4, { rot: -1.45, y: FLOOR - 22 }); CAT.key(2.9, { rot: 0 }, 'back');
// intento 1: la almohada en la cabeza
PIL.key(3.6, { on: 0 }); PIL.key(4.1, { on: 1 }, 'back');
CEX.at(4.1, 'happy').at(5.0, 'determined');
PIL.key(5.4, { on: 1 }); PIL.key(5.7, { on: 0 });
// intento 2: un toquecito... silencio... ¡RONQUIDO!
CAT.key(6.0, { paw: 0, dir: .5 }); CAT.key(6.35, { paw: 1, dir: .9 }); CAT.key(6.7, { paw: 0 });
MOU.key(6.4, { dir: 0 }); MOU.key(6.7, { dir: -.9 });
CEX.at(6.9, 'smile');
CAT.key(7.1, { rot: 0, dir: .9 }); CAT.key(7.6, { rot: -1.45, dir: .5 }); CEX.at(7.4, 'happy');
CEX.at(8.25, 'shock');
CAT.key(8.2, { rot: -1.45, sy: 1 }); CAT.key(8.45, { rot: 0, sy: 1.22 }, 'back'); CAT.key(8.9, { sy: 1 });
CEX.at(8.9, 'determined');
// intento 3: se va a una esquina... las Z le persiguen
CAT.key(9.1, { dir: .5 }); CAT.key(9.25, { dir: -1 });
walk(CAT, 9.3, 10.3, MX, CORNER, 2.6); CAT.key(9.3, { y: FLOOR - 22 }); CAT.key(9.6, { y: FLOOR }, 'iq');
PIL.key(9.2, { on: 0 }); PIL.key(9.4, { on: 2 }); PIL.key(10.3, { on: 2 }); PIL.key(10.6, { on: 3 });
CAT.key(10.4, { rot: 0, dir: -1 }); CAT.key(10.8, { rot: 1.45, dir: -.5 }); CEX.at(10.7, 'happy');
CEX.at(11.45, 'shock').at(11.9, 'sad');
CAT.key(11.45, { rot: 1.45 }); CAT.key(11.75, { rot: 0 }, 'back');
// ¡idea!: ronronear
CEX.at(12.3, 'smile');
CAT.key(12.6, { dir: -1 }); CAT.key(12.75, { dir: 1 });
walk(CAT, 12.8, 13.6, CORNER, MX, 2.2); CAT.key(13.6, { y: FLOOR }); CAT.key(13.75, { y: FLOOR - 22 }, 'oq');
PIL.key(12.7, { on: 3 }); PIL.key(12.8, { on: 0 }, 'hold');
CAT.key(13.75, { rot: 0, dir: 1 }); CAT.key(14.0, { rot: -1.45, dir: .5 }); CEX.at(13.9, 'happy');
const PURR0 = 14.0, PURR1 = 15.6;
MEX.at(14.3, 'shock').at(14.8, 'normal');
MOU.key(14.2, { dir: -.9, y: FLOOR - 22 }); MOU.key(14.35, { y: FLOOR - 60 }, 'oq'); MOU.key(14.5, { y: FLOOR - 22 }, 'iq'); MOU.key(14.55, { dir: -.6 });
CEX.at(14.9, 'smile');
// Pip sonríe y se acurruca: dormir juntos
MEX.at(15.4, 'happy');
MOU.key(15.6, { x: PX }); MOU.key(16.3, { x: 585 }, 'io'); MOU.key(16.3, { dir: -.3 });
CEX.at(15.9, 'happy');
// despertador
const RING = 20.4;
CEX.at(RING + .05, 'shock'); MEX.at(RING + .05, 'shock');
CAT.key(RING, { rot: -1.45, sy: 1 }); CAT.key(RING + .25, { rot: 0, sy: 1.25 }, 'back'); CAT.key(RING + .2, { y: FLOOR - 22 }); CAT.key(RING + .35, { y: FLOOR - 90 }, 'oq'); CAT.key(RING + .55, { y: FLOOR - 22 }, 'iq');
MOU.key(RING + .05, { y: FLOOR - 22 }); MOU.key(RING + .3, { y: FLOOR - 160 }, 'oq'); MOU.key(RING + .6, { y: FLOOR - 22 }, 'iq'); MOU.key(RING + .1, { dir: .4 });
CAT.key(RING + .7, { sy: 1 });
// cámara
CAM.key(1.6, { s: 2.6, cx: 620, cy: 1380 }); CAM.key(2.4, { s: 1.7, cx: 560, cy: 1300 });
CAM.key(9.1, { s: 1.7, cx: 560, cy: 1300 }); CAM.key(10.0, { s: 1.35, cx: 450, cy: 1240 });
CAM.key(12.4, { s: 1.35, cx: 450, cy: 1240 }); CAM.key(13.7, { s: 1.7, cx: 560, cy: 1300 });
CAM.key(16.4, { s: 1.7, cx: 560, cy: 1300 }); CAM.key(20.2, { s: 1.25, cx: 450, cy: 1050 });
CAM.key(20.4, { s: 1.25, cx: 450, cy: 1050 }); CAM.key(20.75, { s: 1.6, cx: 620, cy: 1280 });
for (const r of [CAT, MOU, CAM, PIL, SNORE]) r.done();

// ---------- estados ----------
function snoreAt(t) {   // ciclo de ronquido: 0..1
  const ph = (t % 1.6) / 1.6; return { inh: Math.sin(Math.PI * clamp(ph / .6)), ex: ph > .6 ? Math.sin(Math.PI * (ph - .6) / .4) : 0, ph };
}
function catState(t) {
  const wr = CAT.val('wr', t), ph = CAT.integ('wr', t), sleeping = CAT.val('rot', t) < -1 || CAT.val('rot', t) > 1;
  const br = 1 + Math.sin(t * (sleeping ? 2 : 4)) * (sleeping ? .03 : .015);
  let sy = CAT.val('sy', t) * br, x = CAT.val('x', t);
  if (t > PURR0 && t < PURR1) { x += Math.sin(t * 70) * 3; sy *= 1 + Math.sin(t * 60) * .02; }
  return { x, y: CAT.val('y', t) - Math.abs(Math.sin(ph * Math.PI * 2)) * 10 * clamp(wr), z: CAT.val('z', t), dir: CAT.val('dir', t), sx: CAT.val('sx', t) / br, sy,
    rot: CAT.val('rot', t), look: CAT.val('look', t), paw: CAT.val('paw', t), walk: ph, tearsOn: CAT.val('tears', t), expr: CEX.get(t) };
}
function mouseState(t) {
  const s = snoreAt(t), amp = SNORE.val('amp', t);
  return { x: MOU.val('x', t), y: MOU.val('y', t), z: MOU.val('z', t), dir: MOU.val('dir', t), sx: MOU.val('sx', t) * (1 + s.inh * .06 * amp), sy: MOU.val('sy', t) * (1 + s.inh * .1 * amp), look: MOU.val('look', t), expr: MEX.get(t) };
}
const CAMR = t => { let sh = 0; if (t > 8.25 && t < 8.6) sh = 6; if (t > RING && t < RING + 1.0) sh = 7 * (1 - seg(t, RING + .6, RING + 1.0)); return { s: CAM.val('s', t), cx: CAM.val('cx', t) + Math.sin(t * 80) * sh, cy: CAM.val('cy', t) + Math.cos(t * 67) * sh }; };

// ---------- fotograma ----------
function render(t) {
  resetFx();
  const cs = catState(t), ms = mouseState(t);
  setCat(cat, cs, t);
  setMouse(mouse, { ...ms, holding: null }, t, new THREE.Vector3(U(ms.x), V(ms.y), ms.z));
  // almohada: 0 = en la cama, 1 = en la cabeza, 2 = en brazos (paseo), 3 = en la esquina
  const on = PIL.val('on', t), hp = cat.head.getWorldPosition(new THREE.Vector3()), s = snoreAt(t), amp = SNORE.val('amp', t);
  const bedP = new THREE.Vector3(U(BEDX) - .5, .45, Z_CHAR - .6), headP = new THREE.Vector3(hp.x, hp.y + .75 + s.ex * .25 * amp, hp.z);
  const armP = new THREE.Vector3(U(cs.x) + .2 * Math.sign(cs.dir || 1), 1.25, Z_CHAR + .7), cornerP = new THREE.Vector3(U(CORNER) - .7, .2, Z_CHAR);
  const P = [bedP, headP, armP, cornerP], i0 = Math.floor(clamp(on, 0, 2.999)), fr = on - i0;
  pillow.position.lerpVectors(P[i0], P[Math.min(3, i0 + 1)], fr); pillow.rotation.set(0, 0, i0 === 0 ? fr * .3 : 0);
  // pompa de mocos (crece al respirar)
  snot.visible = amp > .05 && t < 15.3;
  const nose = mouse.head.localToWorld(new THREE.Vector3(.08, -.02, .55));
  snot.position.copy(nose).add(new THREE.Vector3(.12, -.02, .05)); snot.scale.setScalar(.3 + s.inh * 1.5 * Math.min(1.3, amp));
  // despertador
  clock.rotation.z = t > RING && t < RING + 1.2 ? Math.sin(t * 60) * .15 : 0;
  lamp.intensity = 14 + Math.sin(t * 2) * .5;
  // efectos
  const cx3 = U(cs.x), cy3 = V(cs.y);
  if (t > 16.5 && t < 20.3) for (let i = 0; i < 5; i++) { const ph = ((t - 16.5) * .5 + i / 5) % 1, h = (i % 2 ? hearts : heartsPink).next(); h.position.set(U(560) + Math.sin(ph * 5 + i * 2) * 1.2, 1.4 + ph * 2.2, Z_CHAR + .8); h.scale.setScalar(Math.sin(ph * Math.PI) * .9); h.rotation.y = Math.sin(t * 2 + i); }
  if (t > 12.25 && t < 12.9) { const p = easeOutBack(seg(t, 12.25, 12.45)) * (1 - seg(t, 12.75, 12.9)); bulb.visible = true; bulb.position.set(cx3, cy3 + 3.2, Z_CHAR); bulb.scale.setScalar(Math.max(.001, p)); }
  for (let i = 0; i < 12; i++) { const ph = (t * .15 + i / 12) % 1; sprite(spritesW, -4 + rnd(i) * 9, 4 + rnd(i + 5) * 6, Z_WALL + .2, .15 + .15 * Math.sin(ph * Math.PI * 2) ** 2, .8); }

  placeCamera(t, CAMR(t));
  renderer.render(scene, camera);
  ctx.clearRect(0, 0, W, H);
  // Z de los ronquidos
  if (amp > .05) {
    const src = toScreen(mouse.head.localToWorld(new THREE.Vector3(0, .3, .2)));
    for (let i = 0; i < 3; i++) {
      const ph = ((t * .62) + i / 3) % 1, sz = (30 + i * 16 + ph * 40) * Math.min(1.8, amp);
      let x = src.x + 40 + ph * 120, y = src.y - 40 - ph * 200;
      if (t > 10.8 && t < 11.5) { const q = seg(t, 10.8 + i * .08, 11.4), dst = toScreen(new THREE.Vector3(U(CORNER), 1.6, Z_CHAR)); x = lerp(src.x, dst.x, q); y = lerp(src.y - 120, dst.y, q) - Math.sin(q * Math.PI) * 200; }
      ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI) * .95 + (t > 10.8 && t < 11.5 ? .3 : 0); ctx.font = `900 ${sz}px Inter, sans-serif`; ctx.lineWidth = sz * .18; ctx.lineJoin = 'round';
      ctx.strokeStyle = INK; ctx.fillStyle = '#9fd8ff'; ctx.strokeText('Z', x, y); ctx.fillText('Z', x, y); ctx.restore();
    }
  }
  if (t > PURR0 && t < PURR1) { const hpS = toScreen(new THREE.Vector3(cx3, cy3 + 1.6, Z_CHAR)); ctx.save(); ctx.translate(hpS.x - 40 + Math.sin(t * 70) * 4, hpS.y - 170); ctx.rotate(-.08); ctx.font = '900 80px Inter, sans-serif'; ctx.lineWidth = 15; ctx.lineJoin = 'round'; ctx.strokeStyle = INK; ctx.fillStyle = '#ffd93d'; ctx.textAlign = 'center'; const tx = 'PRRRR'.slice(0, 1 + Math.floor(seg(t, PURR0, PURR0 + .5) * 4)); ctx.strokeText(tx, 0, 0); ctx.fillText(tx, 0, 0); ctx.restore(); }
  comicWord('BONK!', t, 11.42, 12.0, new THREE.Vector3(U(CORNER), 2.6, Z_CHAR), 100, '#9fd8ff', -.1);
  comicWord('RING! RING!', t, RING, RING + 1.1, new THREE.Vector3(U(780), 1.9, 1.7), 90, '#ff4d6d', .06);
  if (t > RING && t < RING + .5) focusLines(t, 1 - seg(t, RING + .2, RING + .5));
  caption('😴 💤', t, 0, 2.3, { size: 150 });
  pill('👀', t, 0, 3.0);
  caption('😾', t, 2.4, 3.5, { size: 160 });
  caption('#1  🛏️', t, 3.6, 5.8, { size: 130 });
  caption('🤫 . . .', t, 6.8, 8.1, { size: 120 });
  caption('#2  😤', t, 8.3, 9.2, { size: 130 });
  caption('#3  🏃', t, 9.3, 11.3, { size: 130 });
  caption('💡', t, 12.3, 13.4, { size: 160 });
  caption('😇', t, 14.6, 15.6, { size: 160 });
  caption('💤 ❤️', t, 16.6, 20.3, { size: 150 });
  caption('⏰ 😱', t, RING + .1, 21.4, { size: 150, highlight: true });
  endCard(t, 21.5, 8);
  finishFrame();
}
startEpisode(render);
