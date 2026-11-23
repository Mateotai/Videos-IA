// =====================================================================
//  FOTOS DE PERFIL v3 — tres propuestas distintas con los personajes actuales.
//   A "abrazo"     primer plano: Pip abraza la mejilla de Mochi (menta)
//   B "chicle"     Mochi hace un globo de chicle y Pip va sentado encima (rosa)
//   C "campeones"  Mochi, sentado en palomitas, levanta a Pip en alto (cielo)
//  window.renderVariant('A'|'B'|'C', 800) -> PNG (dataURL)
// =====================================================================
const DURATION = 1;
scene.children.forEach(o => { if (!o.isLight && o !== key.target) o.visible = false; });
scene.fog = null;
mochi.root.visible = pip.root.visible = true; mochi.hemTail.visible = mochi.hemTip.visible = false;
key.position.set(-6, 12, 14); key.intensity = 2.6;
const props = new THREE.Group(); scene.add(props);
const popcorn = () => { const g = new THREE.Group(); for (const [x, y, z, r, c] of [[0, 0, 0, .5, '#ffd88a'], [.42, .14, .05, .42, '#fff6e2'], [-.4, .18, -.1, .45, '#fff8ea'], [.05, .46, .1, .42, '#fffaf0'], [.12, -.34, .22, .37, '#fff3da'], [-.16, -.08, .45, .38, '#fff7e6']]) g.add(mesh(SPH, mat(c, .85), { x, y, z, sx: r, sy: r * .88, sz: r })); return g; };
const pops = Array.from({ length: 40 }, () => { const p = popcorn(); props.add(p); return p; });
const GUMM = new THREE.MeshPhysicalMaterial({ color: '#ff8cc6', roughness: .06, clearcoat: 1, emissive: '#ff4f9e', emissiveIntensity: .22 });
const bubble = mesh(SPH, GUMM, {}); props.add(bubble);
const shineM = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .85 });
const bShine = mesh(SPH, shineM, { shadow: false }); props.add(bShine);
const mound = mesh(SPH, mat('#fbe9c4', .9), {}); props.add(mound);
const hearts3 = [0, 1, 2].map(() => { const h = mesh(HEART_GEO, M.red, { shadow: false }); props.add(h); return h; });

const BASE_M = { mode: 'full', x: 0, y: 0, z: 0, yaw: 0, lean: 0, roll: 0, sx: 1, sy: 1, sz: 1, walk: 0, wamt: 0,
  aLf: .35, aLo: .5, aRf: .35, aRo: .5, hp: 0, hy: 0, hr: 0, hs: 1, eb: 1.12, pd: 1.15, lid: 0, lx: 0, ly: 0, sp: 0,
  mo: .5, tg: 0, tu: 0, lk: 0, br: 0, brA: 1, tw: 1.4, wg: 0, sn: 0, pk: 0, ed: 0, sit: 0, cross: 0 };
const BASE_P = { x: 0, y: 0, z: 0, yaw: 0, lean: 0, roll: 0, sx: 1, sy: 1, walk: 0, wamt: 0,
  aLf: .3, aLo: .5, aRf: .3, aRo: .5, hp: 0, hy: 0, hr: 0, lid: 0, lx: 0, ly: 0, sm: 1, mo: .5, ed: 0, must: 0, rub: 0, kick: 0, fid: 0, tailUp: .5, dripT: 99 };

const VARIANTS = {
  A: {
    m: { yaw: .1, hr: -.14, hp: -.04, mo: .6, eb: 1.2, aRf: 1.6, aRo: .35, aLf: .25, aLo: .5, lx: .4, ly: .05 },
    p: { x: 1.02, y: 1.38, z: .62, yaw: -.6, roll: .14, aLf: 2.3, aLo: -.55, aRf: 2.1, aRo: -.15, lid: .88, sm: 1, mo: .35, hy: -.2 }, pipS: 1.3,
    cam: { pos: [.45, 2.1, 7.4], look: [.42, 1.8, 0] },
    setup() { hearts3.forEach((h, i) => { h.visible = true; h.position.set(1.2 + i * .22, 2.45 + i * .3, .6); h.scale.setScalar(.5 - i * .1); h.rotation.set(0, -.3, .2 - i * .2); }); },
    bg: { c0: '#f4fffa', c1: '#bdebdc', c2: '#8fd8c3', dots: 'rgba(255,255,255,.35)', rays: false, ring: '#ff8fb1' },
  },
  B: {
    m: { x: .55, yaw: -.78, hp: -.2, mo: .15, eb: 1.18, ly: .55, lx: -.25, aLf: .5, aLo: .6, aRf: .35, aRo: .7 },
    p: { yaw: .2, aLf: 2.7, aLo: .6, aRf: 2.6, aRo: .5, mo: .6, ly: -.3 }, pipS: 1.45,
    cam: { pos: [.15, 2.35, 10.4], look: [-.05, 2.1, 0] },
    setup() {
      scene.updateMatrixWorld(true);
      const m = mochi.hT.localToWorld(V3(0, -.36, .8)), f = mochi.hT.localToWorld(V3(0, -.36, 1.8)), d = f.sub(m).normalize();
      const R = .62, c = m.clone().addScaledVector(d, R * .95); bubble.visible = bShine.visible = true;
      bubble.position.copy(c); bubble.scale.setScalar(R); bShine.position.copy(c).add(V3(-R * .4, R * .45, R * .7)); bShine.scale.set(.14, .09, .03);
      const ps = { ...BASE_P, ...this.p, x: c.x + .05, y: c.y + R - .04, z: c.z - .05 }; setPip(pip, ps, 1);
    },
    bg: { c0: '#fff0f8', c1: '#ffb3d6', c2: '#ff7fb8', dots: 'rgba(255,255,255,.25)', rays: true, ring: '#ffffff' },
  },
  C: {
    m: { y: .55, sit: 1, yaw: 0, hp: -.1, mo: .75, eb: 1.15, ly: .5, aLf: 2.7, aLo: .75, aRf: 2.7, aRo: .75 },
    p: { x: -.02, y: 3.22, z: .1, yaw: .05, aLf: 2.8, aLo: .7, aRf: 2.8, aRo: .7, lid: .85, mo: .7, tailUp: 1 }, pipS: 1.4,
    cam: { pos: [.1, 2.4, 12.2], look: [0, 2.15, 0] },
    setup() {
      mound.visible = true; mound.position.set(0, -.25, 0); mound.scale.set(2.3, 1.0, 1.4);
      pops.forEach((p, i) => { p.visible = true; const a = rnd(i) * TAU, r = .6 + rnd(i + 3) * 1.7;
        if (i < 26) p.position.set(Math.cos(a) * r, .25 + rnd(i + 5) * .55 * (1 - r / 2.5), .3 + Math.abs(Math.sin(a)) * .9);
        else p.position.set((rnd(i + 7) - .5) * 3.6, 1.4 + rnd(i + 9) * 2.6, .2 + rnd(i + 2) * .6);
        p.rotation.set(rnd(i) * 3, rnd(i + 1) * 3, 0); p.scale.setScalar(.16 + rnd(i + 4) * .06); });
    },
    bg: { c0: '#f2fbff', c1: '#a9dcff', c2: '#6cbcf5', dots: 'rgba(255,255,255,.3)', rays: true, clouds: true, ring: '#ffd23f' },
  },
};

function draw3D(v, size) {
  props.children.forEach(o => o.visible = false);
  pip.root.scale.setScalar(v.pipS);
  setMochi(mochi, { ...BASE_M, ...v.m }, 1); setPip(pip, { ...BASE_P, ...v.p }, 1);
  const ck = v.m.ck || 0;
  v.setup && v.setup.call(v);
  renderer.setSize(size, size, false); camera.aspect = 1; camera.fov = 30; camera.updateProjectionMatrix();
  camera.position.set(...v.cam.pos); camera.lookAt(...v.cam.look); camera.layers.set(0); camera.updateMatrixWorld();
  scene.background = null; renderer.setClearColor(0x000000, 0); renderer.shadowMap.enabled = true;
  renderer.render(scene, camera);
  return renderer.domElement;
}

window.renderVariant = (name, size = 800) => {
  const v = VARIANTS[name], b = v.bg;
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d'), S = size / 800;
  const bg = g.createRadialGradient(400 * S, 360 * S, 30 * S, 400 * S, 400 * S, 560 * S); bg.addColorStop(0, b.c0); bg.addColorStop(.55, b.c1); bg.addColorStop(1, b.c2);
  g.fillStyle = bg; g.fillRect(0, 0, size, size);
  if (b.rays) { g.save(); g.translate(400 * S, 400 * S); g.fillStyle = 'rgba(255,255,255,.16)'; for (let i = 0; i < 16; i++) { g.rotate(Math.PI * 2 / 16); g.beginPath(); g.moveTo(0, 0); g.lineTo(-80 * S, -620 * S); g.lineTo(80 * S, -620 * S); g.closePath(); g.fill(); } g.restore(); }
  if (b.clouds) { g.fillStyle = 'rgba(255,255,255,.85)'; for (const [x, y, k] of [[150, 190, 1], [640, 150, .8], [690, 560, .7], [120, 600, .6]]) for (const [dx, dy, r] of [[0, 0, 40], [40, -14, 34], [-38, 6, 28], [74, 6, 26]]) { g.beginPath(); g.arc((x + dx * k) * S, (y + dy * k) * S, r * k * S, 0, 7); g.fill(); } }
  g.fillStyle = b.dots;
  for (let y = 0, row = 0; y < size + 60 * S; y += 52 * S, row++) for (let x = (row % 2) * 30 * S; x < size + 60 * S; x += 60 * S) { g.beginPath(); g.arc(x, y, 8 * S, 0, 7); g.fill(); }
  g.beginPath(); g.arc(400 * S, 400 * S, 380 * S, 0, 7); g.lineWidth = 24 * S; g.strokeStyle = b.ring; g.stroke();
  g.beginPath(); g.arc(400 * S, 400 * S, 367 * S, 0, 7); g.lineWidth = 6 * S; g.strokeStyle = '#2b2233'; g.stroke();
  g.save(); g.beginPath(); g.arc(400 * S, 400 * S, 364 * S, 0, 7); g.clip();
  g.drawImage(draw3D(v, size), 0, 0, size, size);
  g.restore();
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [x, y, r] of [[160, 230, 20], [650, 430, 15], [610, 200, 13], [210, 560, 11]]) { g.translate(x * S, y * S); g.fillStyle = 'rgba(255,255,235,.85)'; g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = (i % 2 ? .22 : 1) * r * S; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); g.fill(); g.setTransform(1, 0, 0, 1, 0, 0); }
  g.restore();
  return c.toDataURL('image/png');
};
window.render = () => {}; window.DURATION = DURATION; window.ready = true;
