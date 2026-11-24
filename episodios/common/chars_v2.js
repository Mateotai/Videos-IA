// =====================================================================
//  DISEÑO v2 DE LOS PERSONAJES (episodios 13+). Se carga después de common/kitchen3d.js
//  y añade detalle a Mochi y a Pip sin tocar los episodios anteriores:
//   Mochi: iris con degradado y vetas, almohadillas rosas (patas y manos), rayas en brazos,
//          colmillitos al abrir la boca, pelito blanco en las orejas, puntitos de bigote, mechón.
//   Pip:   iris de color con brillos grandes, mechón en la cabeza, pelusa del pecho,
//          deditos en manos y pies, oreja interior con degradado.
//  Usar setMochi2 / setPip2 en lugar de setMochi / setPip.
// =====================================================================
const BEAN = mat('#ff9fb6', .5);
const capGeo = (ang) => {     // casquete esférico mirando a +z con UV plana (para texturas radiales)
  const g = new THREE.SphereGeometry(1.004, 40, 20, 0, TAU, 0, ang); g.rotateX(Math.PI / 2);
  const p = g.attributes.position, uv = g.attributes.uv, k = .5 / Math.sin(ang);
  for (let i = 0; i < p.count; i++) uv.setXY(i, .5 + p.getX(i) * k, .5 + p.getY(i) * k);
  return g;
};
const irisTex = (c0, c1, c2, c3, vein) => canvasTex(256, 256, (c, w, h) => {
  const g = c.createRadialGradient(128, 128, 8, 128, 128, 128); g.addColorStop(0, c0); g.addColorStop(.38, c1); g.addColorStop(.82, c2); g.addColorStop(1, c3);
  c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.strokeStyle = vein; c.lineWidth = 3; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU + rnd(i) * .1, r0 = 36 + rnd(i + 3) * 12, r1 = 96 + rnd(i + 5) * 22; c.beginPath(); c.moveTo(128 + Math.cos(a) * r0, 128 + Math.sin(a) * r0); c.lineTo(128 + Math.cos(a) * r1, 128 + Math.sin(a) * r1); c.stroke(); }
  c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 10; c.beginPath(); c.arc(128, 128, 122, 0, 7); c.stroke();
});
// ---------- Mochi ----------
{
  const IRIS_M = new THREE.MeshPhysicalMaterial({ map: irisTex('#e8ffb0', '#7be07a', '#2aa555', '#0f5e2c', 'rgba(235,255,210,.35)'), roughness: .12, clearcoat: 1 });
  const CAP = capGeo(.74);
  for (const e of mochi.eyes) {
    e.look.children[0].visible = false; e.look.children[1].visible = false;          // iris y anillo antiguos
    const cap = new THREE.Mesh(CAP, IRIS_M); e.look.add(cap);
    e.es.children.filter(c => c.material === MC.hl).forEach(h => { h.position.z = 1.03; });
    e.es.add(mesh(SPH, MC.hl, { x: .05, y: .38, z: 1.03, sx: .05, sy: .05, sz: .03, shadow: false }));   // tercer brillito
  }
  // almohadillas en los pies (planta) y en las manos
  mochi.feet.forEach(f => { f.add(mesh(SPH, BEAN, { y: -.82, z: .05, sx: .5, sy: .2, sz: .42, shadow: false })); for (const x of [-.42, 0, .42]) f.add(mesh(SPH, BEAN, { x, y: -.72, z: .68, sx: .17, sy: .12, sz: .14, shadow: false })); });
  mochi.arms.forEach(a => { const paw = a.children[2]; paw.add(mesh(SPH, BEAN, { y: -.62, z: .45, sx: .45, sy: .25, sz: .3, shadow: false })); for (const x of [-.45, 0, .45]) paw.add(mesh(SPH, BEAN, { x, y: -.35, z: .82, sx: .14, sy: .12, sz: .1, shadow: false }));
    for (const y of [-.1, -.38]) a.add(mesh(new THREE.TorusGeometry(.143, .022, 8, 24), MC.dark, { y, rx: Math.PI / 2, shadow: false })); });
  // pelito blanco en las orejas
  mochi.ears.forEach(ear => { for (const [x, r] of [[-.05, .2], [.05, -.2]]) ear.add(mesh(new THREE.ConeGeometry(.05, .22, 8), MC.cream, { x, y: .08, z: .16, rz: r, shadow: false })); });
  // puntitos de bigote y mechón en la frente
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) mochi.hT.add(mesh(SPH, MC.dark, { x: s * (.16 + k * .06), y: -.24 - (k % 2) * .05, z: .9 - k * .03, sx: .014, sy: .014, sz: .01, shadow: false }));
  for (const [x, r] of [[-.06, .3], [0, 0], [.06, -.3]]) mochi.hT.add(mesh(new THREE.ConeGeometry(.06, .22, 10), MC.fur, { x, y: .86, z: .1, rz: r, rx: -.3 }));
  // colmillitos (se ven al abrir la boca)
  mochi.fangs = [-1, 1].map(s => { const f = mesh(new THREE.ConeGeometry(.03, .09, 8), MC.eyeW, { x: s * .06, y: .035, z: .1, rx: Math.PI, shadow: false }); mochi.mouth.add(f); return f; });
}
function setMochi2(o, s, t) { setMochi(o, s, t); o.fangs.forEach(f => { f.visible = s.mo > .35; f.position.y = .02 + .04 * Math.min(1, s.mo); }); }
// ---------- Pip ----------
{
  const IRIS_P = new THREE.MeshPhysicalMaterial({ map: irisTex('#7a5a46', '#4a3226', '#24160f', '#100a07', 'rgba(255,220,180,.18)'), roughness: .1, clearcoat: 1 });
  const CAP = capGeo(.78);
  for (const e of pip.eyes) {
    const cap = new THREE.Mesh(CAP, IRIS_P); e.look.add(cap);
    e.look.add(mesh(SPH, MC.pupil, { z: .9, sx: .36, sy: .4, sz: .2, shadow: false }));
    e.look.children.filter(c => c.material === MC.hl).forEach((h, i) => { h.position.z = .95; const k = i ? 1.1 : 1.25; h.scale.set(h.scale.x * k, h.scale.y * k, h.scale.z * .6); });
  }
  pip.head.add(mesh(new THREE.ConeGeometry(.03, .1, 8), PC.fur, { x: -.025, y: .19, z: .04, rz: .45 }));
  pip.head.add(mesh(new THREE.ConeGeometry(.035, .12, 8), PC.fur, { x: .015, y: .2, z: .05, rz: -.2 }));
  pip.sq.add(mesh(new THREE.ConeGeometry(.05, .08, 10), PC.cream, { y: .37, z: .1, rx: Math.PI + .5, shadow: false }));
  pip.arms.forEach(a => { const paw = a.children[1]; for (const x of [-.55, 0, .55]) paw.add(mesh(SPH, PC.pink, { x, y: -.75, z: .35, sx: .32, sy: .38, sz: .32, shadow: false })); });
  pip.feet.forEach(f => { for (const x of [-.5, 0, .5]) f.add(mesh(SPH, PC.pink, { x, y: .1, z: .9, sx: .28, sy: .5, sz: .25, shadow: false })); });
  const earTex = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(64, 64, 4, 64, 64, 64); g.addColorStop(0, '#ff8fab'); g.addColorStop(.7, '#ffb8c8'); g.addColorStop(1, '#ffd4de'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  pip.ears.forEach(ear => { const inner = ear.children[1]; inner.material = new THREE.MeshStandardMaterial({ map: earTex, roughness: .6 }); });
}
function setPip2(o, s, t) { setPip(o, s, t); }
