// =====================================================================
//  FOTO DE PERFIL del canal con los personajes actuales (Mochi bípedo de ojos verdes + Pip).
//  Usa la misma cocina/personajes que los episodios 9+ (common/kitchen3d.js).
//  window.renderLogo(800) -> PNG cuadrado (dataURL)
// =====================================================================
const DURATION = 1;
// sólo personajes, luces y atrezo: fuera la cocina
scene.children.forEach(o => { if (!o.isLight && o !== key.target) o.visible = false; });
scene.fog = null;
mochi.root.visible = pip.root.visible = true;
pip.root.scale.setScalar(1.45);    // Pip más grande en el logo para que se lea a tamaño pequeño
mochi.hemTail.visible = mochi.hemTip.visible = false;
key.position.set(-6, 12, 14); key.intensity = 2.6;
const props = new THREE.Group(); scene.add(props);

// tortitas con mantequilla (Ep. 9)
const cake = buildSheet(.2, .07, 8, 40, PCK_TOP, PCK_SIDE); updateSheet(cake, { dr: 0 });
const stack = new THREE.Group(); props.add(stack);
for (let i = 0; i < 3; i++) stack.add(mesh(cake.geo, [PCK_TOP, PCK_SIDE], { y: i * .075, ry: i * 1.3 }));
stack.add(mesh(roundedBox(.3, .14, .24, .04), BUTTER, { y: .27, sx: .55, sy: .55, sz: .55, ry: .5 }));
// palomitas (Ep. 10)
const popcorn = () => { const g = new THREE.Group(); for (const [x, y, z, r, c] of [[0, 0, 0, .5, '#ffd88a'], [.42, .14, .05, .42, '#fff6e2'], [-.4, .18, -.1, .45, '#fff8ea'], [.05, .46, .1, .42, '#fffaf0'], [.12, -.34, .22, .37, '#fff3da'], [-.16, -.08, .45, .38, '#fff7e6']]) g.add(mesh(SPH, mat(c, .85), { x, y, z, sx: r, sy: r * .88, sz: r })); return g; };
const pops = [popcorn(), popcorn(), popcorn()]; pops.forEach(p => props.add(p));
// globo de chicle (Ep. 11)
const bubble = mesh(SPH, new THREE.MeshPhysicalMaterial({ color: '#ff8cc6', roughness: .08, clearcoat: 1, emissive: '#ff4f9e', emissiveIntensity: .25 }), {}); props.add(bubble);
const bShine = mesh(SPH, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .8 }), { shadow: false }); props.add(bShine);

// poses
const MS0 = { mode: 'full', x: 0, y: 0, z: 0, yaw: .12, lean: 0, roll: .03, sx: 1, sy: 1, sz: 1, walk: 0, wamt: 0,
  aLf: .35, aLo: .95, aRf: 2.3, aRo: 1.25, hp: -.06, hy: .05, hr: .07, hs: 1, eb: 1.12, pd: 1.15, lid: 0, lx: .05, ly: .05, sp: 0,
  mo: .5, tg: 0, tu: 0, lk: 0, br: 0, brA: 1, tw: 1.4, wg: 0, sn: 0, pk: 0, ed: 0, sit: 0, cross: 0 };
const PS0 = { x: -.08, y: 2.66, z: .05, yaw: -.1, lean: 0, roll: -.08, sx: 1, sy: 1, walk: 0, wamt: 0,
  aLf: .3, aLo: .7, aRf: 2.7, aRo: .6, hp: -.05, hy: -.05, hr: -.1, lid: 0, lx: -.05, ly: .1, sm: 1, mo: .55, ed: 0, must: 0, rub: 0, kick: 0, fid: 0, tailUp: .6, dripT: 99 };

function draw3D(size) {
  const t = 1.0;   // instante sin parpadeo
  setMochi(mochi, MS0, t); setPip(pip, PS0, t);
  stack.position.set(-1.4, 2.6, .2); stack.rotation.set(.35, .4, -.25); stack.scale.setScalar(1.9);
  [[1.5, 2.55, .1, .7], [-1.55, .7, .3, -.4], [-1.65, 1.55, .2, 1.1]].forEach(([x, y, z, r], i) => { pops[i].position.set(x, y, z); pops[i].rotation.set(r, r * 1.7, r * .5); pops[i].scale.setScalar(.2); });
  bubble.position.set(1.45, .75, .1); bubble.scale.setScalar(.33);
  bShine.position.set(1.35, .88, .41); bShine.scale.set(.07, .05, .02);
  renderer.setSize(size, size, false); camera.aspect = 1; camera.fov = 30; camera.updateProjectionMatrix();
  camera.position.set(.15, 1.95, 9.8); camera.lookAt(0, 1.78, 0); camera.layers.set(0); camera.updateMatrixWorld();
  scene.background = null; renderer.setClearColor(0x000000, 0); renderer.shadowMap.enabled = true;
  renderer.render(scene, camera);
  return renderer.domElement;
}

window.renderLogo = (size = 800) => {
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d'), S = size / 800;
  // fondo: degradado cálido + rayos + lunares (como el logo original)
  const bg = g.createRadialGradient(400 * S, 380 * S, 40 * S, 400 * S, 400 * S, 560 * S); bg.addColorStop(0, '#fff1b8'); bg.addColorStop(.55, '#ffc35e'); bg.addColorStop(1, '#ff9a3c');
  g.fillStyle = bg; g.fillRect(0, 0, size, size);
  g.save(); g.translate(400 * S, 400 * S); g.fillStyle = 'rgba(255,255,255,.16)';
  for (let i = 0; i < 18; i++) { g.rotate(Math.PI * 2 / 18); g.beginPath(); g.moveTo(0, 0); g.lineTo(-70 * S, -620 * S); g.lineTo(70 * S, -620 * S); g.closePath(); g.fill(); }
  g.restore();
  g.fillStyle = 'rgba(255,255,255,.2)';
  for (let y = 0, row = 0; y < size + 60 * S; y += 52 * S, row++) for (let x = (row % 2) * 30 * S; x < size + 60 * S; x += 60 * S) { g.beginPath(); g.arc(x, y, 9 * S, 0, 7); g.fill(); }
  // aro
  g.beginPath(); g.arc(400 * S, 400 * S, 378 * S, 0, 7); g.lineWidth = 26 * S; g.strokeStyle = '#ffffff'; g.stroke();
  g.beginPath(); g.arc(400 * S, 400 * S, 364 * S, 0, 7); g.lineWidth = 7 * S; g.strokeStyle = '#2b2233'; g.stroke();
  // sombra de contacto
  g.save(); g.beginPath(); g.arc(400 * S, 400 * S, 360 * S, 0, 7); g.clip();
  const sh = g.createRadialGradient(400 * S, 708 * S, 10 * S, 400 * S, 708 * S, 170 * S); sh.addColorStop(0, 'rgba(120,60,10,.35)'); sh.addColorStop(1, 'rgba(120,60,10,0)');
  g.fillStyle = sh; g.save(); g.translate(400 * S, 708 * S); g.scale(1, .22); g.translate(-400 * S, -708 * S); g.beginPath(); g.arc(400 * S, 708 * S, 170 * S, 0, 7); g.fill(); g.restore();
  // personajes en 3D (recortados dentro del aro, pero Pip puede asomar las orejas)
  const r3 = draw3D(size);
  g.drawImage(r3, 0, 0, size, size);
  g.restore();
  // brillos
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [x, y, r] of [[170, 210, 22], [640, 470, 16], [600, 175, 14], [205, 560, 12]]) {
    g.translate(x * S, y * S); g.fillStyle = 'rgba(255,255,230,.85)'; g.beginPath();
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = (i % 2 ? .22 : 1) * r * S; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); g.fill(); g.setTransform(1, 0, 0, 1, 0, 0);
  }
  g.restore();
  return c.toDataURL('image/png');
};
window.render = () => {}; window.DURATION = DURATION; window.ready = true;
