// =====================================================================
//  PLAYA 3D (episodios 13+). Se carga después de kitchen3d.js: oculta la cocina y monta
//  cielo, mar animado, orilla con espuma, arena, palmeras y atrezo de playa.
//  Orilla en z = 0 (mar hacia -z, playa hacia +z). Nivel del agua y = 0.
//  updateBeach(t) anima el mar, la espuma, los brillos y las gaviotas.
// =====================================================================
// ---- fuera la cocina ----
BG.visible = false; sunPatch.visible = false;
scene.children.forEach(o => { if (o.isMesh && o.material && o.material.map === counterTex) o.visible = false; });
const BEACH_BG = new THREE.Group(); scene.add(BEACH_BG);   // capa 1 (desenfocada)
// ---- luz de mediodía ----
for (const o of scene.children) if (o.isHemisphereLight) { o.color.set('#dff3ff'); o.groundColor.set('#f4d9a6'); o.intensity = 1.35; }
key.color.set('#fff4e0'); key.intensity = 3.0; key.position.set(-8, 17, 13); key.target.position.set(0, 0, 0);
Object.assign(key.shadow.camera, { left: -14, right: 14, top: 14, bottom: -10, near: 1, far: 70 }); key.shadow.camera.updateProjectionMatrix();
rim.color.set('#fff0c8'); rim.intensity = 1.2; rim.position.set(6, 10, -14);
fill.color.set('#cfeaff'); fill.intensity = .5;
scene.fog = new THREE.Fog('#d9f1ff', 40, 170);
BG_COLOR.set('#bfe6ff');

// ---- cielo ----
const skyTex3 = canvasTex(8, 512, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#2f9cf0'); g.addColorStop(.42, '#7cc8ff'); g.addColorStop(.5, '#dff3ff'); g.addColorStop(1, '#dff3ff'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
BEACH_BG.add(new THREE.Mesh(new THREE.SphereGeometry(160, 32, 24), new THREE.MeshBasicMaterial({ map: skyTex3, side: THREE.BackSide, fog: false })));
const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: '#fff6c8', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
sunGlow.position.set(-55, 58, -120); sunGlow.scale.setScalar(70); BEACH_BG.add(sunGlow);
const sunDisc = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: '#ffffff', transparent: true, depthWrite: false, fog: false })); sunDisc.position.copy(sunGlow.position); sunDisc.scale.setScalar(16); BEACH_BG.add(sunDisc);
const CLOUD_M = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, emissive: '#ffffff', emissiveIntensity: .45, fog: false });
const clouds = [];
for (let i = 0; i < 9; i++) {
  const g = new THREE.Group(); const x = -90 + i * 22 + rnd(i) * 10, y = 16 + rnd(i + 3) * 18, z = -95 - rnd(i + 5) * 30;
  for (let k = 0; k < 6; k++) g.add(mesh(SPH, CLOUD_M, { x: (k - 2.5) * 3.2 + rnd(i * 9 + k) * 2, y: Math.sin(k) * 1.2 + rnd(k + i) * 1.5, sx: 4 + rnd(k * 3 + i) * 2.5, sy: 3 + rnd(k + i * 2) * 1.5, sz: 3, shadow: false }));
  g.position.set(x, y, z); g.userData.x0 = x; BEACH_BG.add(g); clouds.push(g);
}
// islas lejanas
for (const [x, z, sx, sy, c] of [[-60, -105, 26, 9, '#7fb98f'], [-38, -112, 16, 6, '#8cc39b'], [52, -100, 30, 11, '#76b48a'], [80, -118, 20, 7, '#8fc6a0']]) {
  BEACH_BG.add(mesh(SPH, mat(c, .9), { x, y: -1, z, sx, sy, sz: sx * .5, shadow: false }));
  for (let k = 0; k < 4; k++) BEACH_BG.add(mesh(new THREE.ConeGeometry(.6, 6, 6), mat('#5f9d6f', .9), { x: x + (k - 1.5) * sx * .25, y: sy * .75 + 1, z: z + sx * .2, shadow: false }));
}
// gaviotas
const GULL_M = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .8 });
const gulls = Array.from({ length: 4 }, (_, i) => {
  const g = new THREE.Group(); const wl = new THREE.Group(), wr = new THREE.Group(); g.add(wl, wr);
  g.add(mesh(SPH, GULL_M, { sx: .35, sy: .25, sz: .7, shadow: false })); g.add(mesh(new THREE.ConeGeometry(.08, .3, 6), mat('#ffb020', .5), { z: .8, rx: Math.PI / 2, shadow: false }));
  wl.add(mesh(SPH, GULL_M, { x: -.8, sx: .9, sy: .06, sz: .3, shadow: false })); wr.add(mesh(SPH, GULL_M, { x: .8, sx: .9, sy: .06, sz: .3, shadow: false }));
  g.userData = { wl, wr, ph: i * 1.7, r: 14 + i * 4, h: 9 + i * 1.5, cz: -22 - i * 6 }; BEACH_BG.add(g); return g;
});
BEACH_BG.traverse(o => o.layers.set(1));

// ---- arena ----
const sandTex = canvasTex(512, 512, (c, w, h) => {
  c.fillStyle = '#f6e0ae'; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 5000; i++) { c.fillStyle = `rgba(${150 + rnd(i) * 80 | 0},${110 + rnd(i + 1) * 70 | 0},${60 + rnd(i + 2) * 50 | 0},${.12 + rnd(i + 3) * .2})`; c.fillRect(rnd(i + 4) * w, rnd(i + 5) * h, 2, 2); }
  c.strokeStyle = 'rgba(210,170,110,.18)'; c.lineWidth = 3; for (let k = 0; k < 14; k++) { c.beginPath(); for (let x = 0; x <= w; x += 16) c.lineTo(x, k * 38 + Math.sin(x * .03 + k) * 6); c.stroke(); }
});
sandTex.wrapS = sandTex.wrapT = THREE.RepeatWrapping;
const sandY = (x, z) => (z < 7 ? .05 * z : .35 + (z - 7) * .02) + .06 * Math.sin(x * .45 + z * .3) * clamp((z - .5) / 3);
const sand = (() => {
  const g = new THREE.PlaneGeometry(90, 46, 180, 92); g.rotateX(-Math.PI / 2); g.translate(0, 0, 15);
  const p = g.attributes.position, uv = g.attributes.uv, col = [];
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, sandY(x, z)); uv.setXY(i, x / 6, z / 6); const wet = 1 - clamp((z - .1) / 1.6); col.push(1 - .25 * wet, 1 - .3 * wet, 1 - .35 * wet); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: sandTex, vertexColors: true, roughness: .95 })); m.receiveShadow = true; scene.add(m); return m;
})();
// ---- mar ----
const SEA = (() => {
  const g = new THREE.PlaneGeometry(260, 150, 200, 120); g.rotateX(-Math.PI / 2); g.translate(0, 0, -73);
  const p = g.attributes.position, col = [], base = new Float32Array(p.count * 2);
  const near = new THREE.Color('#7ff0e0'), mid = new THREE.Color('#25b9d8'), far = new THREE.Color('#1a6fc0');
  for (let i = 0; i < p.count; i++) { const z = p.getZ(i); base[2 * i] = p.getX(i); base[2 * i + 1] = z; const k = clamp(-z / 8), k2 = clamp((-z - 8) / 60); const c = near.clone().lerp(mid, k).lerp(far, k2); col.push(c.r, c.g, c.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  const m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .08, clearcoat: 1, clearcoatRoughness: .06, transparent: true, opacity: .9, depthWrite: true }));
  m.receiveShadow = true; m.renderOrder = 1; scene.add(m); return { m, g, base };
})();
const seaH = (x, z, t) => .05 * Math.sin(x * .7 + t * 1.6) + .04 * Math.sin(z * 1.1 - t * 2.1) + .025 * Math.sin((x + z) * 1.9 + t * 3.1);
// espuma de la orilla
const foamTex = canvasTex(512, 64, (c, w, h) => {
  for (let i = 0; i < 260; i++) { const x = rnd(i) * w, y = 10 + rnd(i + 1) * 40, r = 4 + rnd(i + 2) * 12; c.fillStyle = `rgba(255,255,255,${.4 + rnd(i + 3) * .5})`; c.beginPath(); c.ellipse(x, y, r * 1.6, r * .6, 0, 0, 7); c.fill(); }
  c.globalCompositeOperation = 'destination-in'; const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.35, 'rgba(0,0,0,1)'); g.addColorStop(.7, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
});
foamTex.wrapS = THREE.RepeatWrapping; foamTex.repeat.set(8, 1);
const foam = new THREE.Mesh(new THREE.PlaneGeometry(90, 1.1), new THREE.MeshBasicMaterial({ map: foamTex, transparent: true, depthWrite: false, opacity: .9 }));
foam.rotation.x = -Math.PI / 2; foam.renderOrder = 3; scene.add(foam);
const foam2 = foam.clone(); foam2.material = foam.material.clone(); foam2.material.map = foamTex.clone(); foam2.material.map.needsUpdate = true; foam2.material.map.repeat.set(6, 1); scene.add(foam2);
const glints = pool(30, () => new THREE.Sprite(new THREE.SpriteMaterial({ map: STAR_W, color: '#ffffff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

// ---- atrezo ----
const PALM_T = mat('#b88a5a', .85), PALM_L = mat('#4fbf6a', .6), PALM_L2 = mat('#3aa55a', .6);
function palm(x, z, h, lean) {
  const g = new THREE.Group(); g.position.set(x, sandY(x, z), z); scene.add(g);
  const pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push(V3(lean * u * u * h * .5, u * h, 0)); }
  const curve = new THREE.CatmullRomCurve3(pts);
  const N = 12;
  for (let i = 0; i < N; i++) { const a0 = curve.getPoint(i / N), a1 = curve.getPoint((i + 1) / N), d = a1.clone().sub(a0), L = d.length();
    const m = mesh(new THREE.CylinderGeometry(.19 - i * .008, .23 - i * .008, L * 1.08, 14), i % 2 ? PALM_T : mat('#a87a4c', .85)); m.position.copy(a0).addScaledVector(d, .5); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); g.add(m); }
  const top = curve.getPoint(1); const crown = new THREE.Group(); crown.position.copy(top); g.add(crown);
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; const leaf = new THREE.Group(); leaf.rotation.set(0, a, 0); crown.add(leaf);
    for (let k = 0; k < 5; k++) leaf.add(mesh(SPH, k % 2 ? PALM_L : PALM_L2, { x: .45 + k * .42, y: -k * k * .06, sx: .3, sy: .05, sz: .18 - k * .02, rz: -k * .12 })); }
  for (let i = 0; i < 3; i++) crown.add(mesh(SPH, mat('#7a4e2a', .6), { x: Math.cos(i * 2.1) * .22, y: -.2, z: Math.sin(i * 2.1) * .22, sx: .2, sy: .22, sz: .2 }));
  g.userData.crown = crown; return g;
}
const stripes = (a, b, n = 8) => canvasTex(256, 64, (c, w, h) => { for (let i = 0; i < n; i++) { c.fillStyle = i % 2 ? a : b; c.fillRect(i * w / n, 0, w / n + 1, h); } });
function umbrella(x, z) {
  const g = new THREE.Group(); g.position.set(x, sandY(x, z), z); scene.add(g);
  g.add(mesh(new THREE.CylinderGeometry(.04, .04, 2.6, 10), mat('#f4f0ea', .4), { y: 1.3, rz: .12 }));
  g.add(mesh(new THREE.ConeGeometry(1.6, .6, 16, 1, true), new THREE.MeshStandardMaterial({ map: stripes('#ff6f91', '#fff4e6', 16), side: THREE.DoubleSide, roughness: .7 }), { x: .16, y: 2.6, rz: .12 }));
  g.add(mesh(SPH, mat('#ff6f91', .5), { x: .17, y: 2.92, sx: .07, sy: .07, sz: .07 })); return g;
}
function towel(x, z, ry) { const m = mesh(new THREE.BoxGeometry(1.4, .02, 2.4), new THREE.MeshStandardMaterial({ map: stripes('#5ec8ff', '#ffffff', 10), roughness: .9 }), { x, y: sandY(x, z) + .01, z, ry }); scene.add(m); return m; }
function sandcastle(x, z) {
  const g = new THREE.Group(); g.position.set(x, sandY(x, z), z); scene.add(g); const S = mat('#e9c98a', .95), S2 = mat('#ddb876', .95);
  g.add(mesh(new THREE.CylinderGeometry(.42, .5, .45, 24), S, { y: .22 }));
  for (const [dx, dz] of [[-.4, .15], [.4, .15], [0, -.3]]) { g.add(mesh(new THREE.CylinderGeometry(.16, .19, .7, 16), S2, { x: dx, y: .35, z: dz }));
    for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; g.add(mesh(new THREE.BoxGeometry(.07, .08, .07), S2, { x: dx + Math.cos(a) * .14, y: .74, z: dz + Math.sin(a) * .14 })); } }
  g.add(mesh(new THREE.CylinderGeometry(.22, .26, .5, 18), S, { y: .67 })); g.add(mesh(new THREE.ConeGeometry(.24, .32, 18), S2, { y: 1.08 }));
  g.add(mesh(new THREE.CylinderGeometry(.01, .01, .35, 6), mat('#8a6a4a', .6), { y: 1.4 }));
  g.add(mesh(new THREE.PlaneGeometry(.2, .12), new THREE.MeshStandardMaterial({ color: '#ff4d6d', side: THREE.DoubleSide }), { x: .1, y: 1.5, shadow: false }));
  g.add(mesh(new THREE.BoxGeometry(.14, .2, .03), mat('#7a5030', .8), { y: .12, z: .48 }));
  for (const [dx, dz, c] of [[.65, .45, '#ffb8c8'], [-.7, .5, '#ffe6a8']]) g.add(mesh(SPH, mat(c, .5), { x: dx, y: .04, z: dz, sx: .1, sy: .04, sz: .08 }));
  return g;
}
function starfish(x, z, c = '#ff8a5c') { const g = new THREE.Group(); g.position.set(x, sandY(x, z) + .02, z); scene.add(g); for (let i = 0; i < 5; i++) g.add(mesh(SPH, mat(c, .7), { x: Math.cos(i / 5 * TAU) * .09, z: Math.sin(i / 5 * TAU) * .09, sx: .1, sy: .025, sz: .035, ry: -i / 5 * TAU })); return g; }
function shell(x, z, c) { const m = mesh(SPH, mat(c, .4), { x, y: sandY(x, z) + .02, z, sx: .08, sy: .04, sz: .07 }); scene.add(m); return m; }
function beachBall(x, z) { const tex = canvasTex(256, 128, (c, w, h) => { const cols = ['#ff5a5a', '#ffffff', '#ffd23f', '#ffffff', '#4fb8ff', '#ffffff']; cols.forEach((cc, i) => { c.fillStyle = cc; c.fillRect(i * w / 6, 0, w / 6 + 1, h); }); }); const m = mesh(new THREE.SphereGeometry(.32, 32, 20), new THREE.MeshStandardMaterial({ map: tex, roughness: .3 }), { x, y: sandY(x, z) + .3, z }); scene.add(m); return m; }
function crab() {
  const g = new THREE.Group(); scene.add(g); const R = mat('#ff5a4a', .45);
  g.add(mesh(SPH, R, { y: .09, sx: .16, sy: .08, sz: .12 }));
  for (const s of [-1, 1]) { g.add(mesh(new THREE.CylinderGeometry(.01, .01, .1, 6), R, { x: s * .05, y: .19, z: .06 })); g.add(mesh(SPH, MC.eyeW, { x: s * .05, y: .25, z: .06, sx: .03, sy: .03, sz: .03, shadow: false })); g.add(mesh(SPH, MC.pupil, { x: s * .05, y: .25, z: .087, sx: .015, sy: .015, sz: .01, shadow: false }));
    const cl = new THREE.Group(); cl.position.set(s * .17, .12, .08); g.add(cl); cl.add(mesh(SPH, R, { sx: .07, sy: .05, sz: .06 })); const pin = mesh(SPH, R, { x: s * .03, y: .04, z: .03, sx: .04, sy: .025, sz: .04 }); cl.add(pin); cl.userData.pin = pin;
    for (let k = 0; k < 3; k++) g.add(mesh(new THREE.CylinderGeometry(.008, .008, .14, 5), R, { x: s * .17, y: .05, z: -.05 + k * .05, rz: s * 1.1 })); }
  g.userData.claws = g.children.filter(c => c.userData.pin); return g;
}
function flamingo() {
  const g = new THREE.Group(); scene.add(g); const P = new THREE.MeshPhysicalMaterial({ color: '#ff8fb8', roughness: .2, clearcoat: 1 });
  g.add(mesh(new THREE.TorusGeometry(.75, .3, 20, 48), P, { y: .3, rx: Math.PI / 2 }));
  const neck = new THREE.CatmullRomCurve3([V3(0, .45, -.75), V3(0, 1.1, -.9), V3(0, 1.6, -.6), V3(0, 1.75, -.25)]);
  g.add(mesh(new THREE.TubeGeometry(neck, 20, .12, 12), P));
  g.add(mesh(SPH, P, { y: 1.78, z: -.2, sx: .2, sy: .18, sz: .22 }));
  g.add(mesh(new THREE.ConeGeometry(.07, .26, 10), mat('#2b2233', .4), { y: 1.7, z: .05, rx: 1.9 }));
  for (const s of [-1, 1]) g.add(mesh(SPH, MC.pupil, { x: s * .14, y: 1.84, z: -.15, sx: .03, sy: .035, sz: .02, shadow: false }));
  g.add(mesh(SPH, P, { y: .55, z: .75, sx: .25, sy: .3, sz: .12, rx: .5 }));     // cola
  return g;
}
function updateBeach(t) {
  const p = SEA.g.attributes.position, b = SEA.base;
  for (let i = 0; i < p.count; i++) { const x = b[2 * i], z = b[2 * i + 1]; p.setY(i, z > -40 ? seaH(x, z, t) : 0); }
  p.needsUpdate = true; SEA.g.computeVertexNormals();
  const sw = Math.sin(t * 1.3) * .35, sw2 = Math.sin(t * 1.3 - 1.2) * .3;
  foam.position.set(0, .03, .25 + sw); foam.material.opacity = .75 + .2 * Math.sin(t * 1.3 + .5); foam.material.map.offset.x = t * .01;
  foam2.position.set(0, .025, -.9 + sw2); foam2.material.opacity = .45; foam2.material.map.offset.x = -t * .008;
  glints.reset(); for (let i = 0; i < 26; i++) { const ph = (t * .6 + rnd(i) * 7) % 1, gl = glints.next(); gl.position.set(-12 + rnd(i + 1) * 24, .08, -2 - rnd(i + 2) * 18); gl.scale.setScalar(Math.sin(ph * Math.PI) ** 3 * (.25 + rnd(i + 3) * .25)); gl.material.opacity = 1; gl.material.rotation = i; }
  clouds.forEach((c, i) => { c.position.x = c.userData.x0 + t * .4; });
  gulls.forEach(g => { const u = g.userData, a = t * .25 + u.ph; g.position.set(Math.cos(a) * u.r, u.h + Math.sin(t * .8 + u.ph) * .6, u.cz + Math.sin(a) * u.r * .4); g.rotation.set(0, -a - Math.PI / 2 + Math.PI, Math.sin(a) * .3); const f = Math.sin(t * 7 + u.ph) * .5; u.wl.rotation.z = f; u.wr.rotation.z = -f; });
}
