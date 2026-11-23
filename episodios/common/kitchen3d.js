// =====================================================================
//  COCINA 3D DE MOCHI & PIP (común a los episodios 9+)
//  Requiere common/rig.js y common/engine3d.js. Aporta: luz de mañana,
//  cocina (fondo desenfocado en la capa 1), materiales, Mochi bípedo, Pip,
//  tortitas deformables, efectos (vapor, nubes, destellos) y composición.
// =====================================================================
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const sstep = (a, b, x) => { const p = clamp((x - a) / (b - a)); return p * p * (3 - 2 * p); };
const TAU = Math.PI * 2;

// fuera el decorado y los personajes del motor
room.visible = false; tableCookie.visible = false; catHalf.visible = false;
cat.root.visible = false; mouse.root.visible = false;
const PIP_S = .8;

// ---------- luz de mañana ----------
for (const o of scene.children) if (o.isHemisphereLight) { o.color.set('#fff3e2'); o.groundColor.set('#e8b48a'); o.intensity = 1.3; }
key.color.set('#ffebcc'); key.intensity = 2.5; key.position.set(-9, 15, 11); key.target.position.set(0, 0, -1);
Object.assign(key.shadow.camera, { left: -13, right: 13, top: 13, bottom: -9, near: 1, far: 60 }); key.shadow.camera.updateProjectionMatrix();
key.shadow.mapSize.set(4096, 4096); key.shadow.map?.dispose(); key.shadow.map = null;
rim.color.set('#ffcf9e'); rim.intensity = 1.7; rim.position.set(4, 9, -12);
fill.color.set('#dcecff'); fill.intensity = .45;
scene.fog = new THREE.Fog('#ffe8cf', 22, 70);
const BG_COLOR = new THREE.Color('#ffe3c2');

// ---------- materiales ----------
const fur = (c, sheen = '#fff2dc') => new THREE.MeshPhysicalMaterial({ color: c, roughness: .82, sheen: 1, sheenRoughness: .5, sheenColor: new THREE.Color(sheen) });
const gloss = (c, extra = {}) => new THREE.MeshPhysicalMaterial({ color: c, roughness: .12, clearcoat: 1, clearcoatRoughness: .08, ...extra });
const MC = {
  fur: fur('#ff9b3d'), dark: fur('#e5741c', '#ffd2a0'), cream: fur('#fff0dc'), pink: mat('#ff9fb2', .55),
  nose: gloss('#ff7a98'), eyeW: gloss('#fbfdff'), iris: gloss('#3fcf63'), irisDark: gloss('#1f8f3c'), pupil: gloss('#120f16'),
  hl: new THREE.MeshBasicMaterial({ color: '#ffffff' }), mouth: mat('#6b1d36', .6), tongue: gloss('#ff86a3', { roughness: .35, clearcoat: .5 }),
  whisk: mat('#fff8ef', .5), blush: mat('#ff8fa8', .9, { transparent: true, opacity: .55 }),
};
const PC = { fur: fur('#b9b6c9', '#f2f0ff'), dark: fur('#9d99b2'), cream: fur('#f4f1fa'), pink: mat('#ffa5b8', .55), nose: gloss('#ff7f9e'),
  eye: gloss('#15121b'), lidc: fur('#b9b6c9'), whisk: mat('#4a4458', .5) };
const BUTTER = new THREE.MeshPhysicalMaterial({ color: '#ffe17a', roughness: .28, clearcoat: .7, clearcoatRoughness: .2, emissive: '#ffb400', emissiveIntensity: .12, sheen: .5, sheenColor: new THREE.Color('#fff6c0') });
const BUTTER_MELT = new THREE.MeshPhysicalMaterial({ color: '#ffd75a', roughness: .1, clearcoat: 1, transparent: true, opacity: .8, emissive: '#ffae00', emissiveIntensity: .15 });

// ---------- texturas ----------
const softTex = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.45, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
const pancakeTex = canvasTex(512, 512, (c, w, h) => {
  const g = c.createRadialGradient(256, 256, 20, 256, 256, 256);
  g.addColorStop(0, '#c97a2c'); g.addColorStop(.55, '#d98d3a'); g.addColorStop(.82, '#e9ad5c'); g.addColorStop(.95, '#f3cf8a'); g.addColorStop(1, '#f6d99a');
  c.fillStyle = g; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 260; i++) { const a = rnd(i) * TAU, r = Math.sqrt(rnd(i + 9)) * 225; c.fillStyle = `rgba(150,80,20,${.12 + rnd(i + 3) * .2})`; c.beginPath(); c.arc(256 + Math.cos(a) * r, 256 + Math.sin(a) * r, 2 + rnd(i + 5) * 6, 0, 7); c.fill(); }
  for (let i = 0; i < 70; i++) { const a = rnd(i + 400) * TAU, r = Math.sqrt(rnd(i + 409)) * 210; c.fillStyle = 'rgba(255,225,160,.35)'; c.beginPath(); c.arc(256 + Math.cos(a) * r, 256 + Math.sin(a) * r, 3 + rnd(i + 405) * 4, 0, 7); c.fill(); }
});
const burritoTex = canvasTex(512, 256, (c, w, h) => {
  c.fillStyle = '#dc923f'; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 40; i++) { const g = c.createRadialGradient(rnd(i) * w, rnd(i + 1) * h, 0, rnd(i) * w, rnd(i + 1) * h, 40 + rnd(i + 2) * 60); g.addColorStop(0, 'rgba(170,90,25,.35)'); g.addColorStop(1, 'rgba(170,90,25,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); }
  for (let i = 0; i < 160; i++) { c.fillStyle = `rgba(140,70,20,${.15 + rnd(i + 70) * .2})`; c.beginPath(); c.arc(rnd(i + 20) * w, rnd(i + 30) * h, 2 + rnd(i + 40) * 4, 0, 7); c.fill(); }
});
burritoTex.wrapS = burritoTex.wrapT = THREE.RepeatWrapping; burritoTex.repeat.set(2, 1);
const spiralTex = canvasTex(512, 512, (c, w, h) => {
  c.fillStyle = '#f7dca0'; c.fillRect(0, 0, w, h);
  c.translate(256, 256); c.strokeStyle = '#d58b3c'; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath();
  for (let a = 0; a < TAU * 3.2; a += .05) { const r = 40 + a * 11.5; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.stroke();
  c.strokeStyle = 'rgba(255,240,200,.6)'; c.lineWidth = 4; c.beginPath();
  for (let a = 0; a < TAU * 3.2; a += .05) { const r = 46 + a * 11.5; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.stroke();
});
const counterTex = canvasTex(1024, 1024, (c, w, h) => {
  const tones = ['#ebbb8c', '#e4b082', '#f0c697', '#e7b586', '#f2cb9f', '#e1ab7b'];
  const n = 8, sh = h / n;
  for (let i = 0; i < n; i++) {
    c.fillStyle = tones[i % tones.length]; c.fillRect(0, i * sh, w, sh);
    c.strokeStyle = 'rgba(150,90,45,.11)'; c.lineWidth = 2;
    for (let k = 0; k < 7; k++) { const y = i * sh + 8 + k * sh / 7; c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= w; x += 32) c.lineTo(x, y + Math.sin(x * .012 + i * 3 + k) * 4); c.stroke(); }
    c.fillStyle = 'rgba(120,70,30,.22)'; c.fillRect(0, i * sh, w, 3);
    const off = (i * 397) % w; c.fillRect(off, i * sh, 3, sh);
  }
});
counterTex.wrapS = counterTex.wrapT = THREE.RepeatWrapping;
const tileTex = canvasTex(512, 512, (c, w, h) => {
  c.fillStyle = '#f6efe2'; c.fillRect(0, 0, w, h);
  for (let r = 0; r < 4; r++) for (let k = -1; k < 3; k++) {
    const x = k * 256 + (r % 2) * 128 + 6, y = r * 128 + 6;
    const g = c.createLinearGradient(0, y, 0, y + 116); g.addColorStop(0, '#d2f0e3'); g.addColorStop(1, '#b6e2d0');
    c.fillStyle = g; c.beginPath(); c.roundRect(x, y, 244, 116, 14); c.fill();
    c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.roundRect(x + 14, y + 10, 120, 16, 8); c.fill();
  }
});
tileTex.wrapS = tileTex.wrapT = THREE.RepeatWrapping;
const wallTex2 = canvasTex(256, 256, (c, w, h) => {
  c.fillStyle = '#fff0dc'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffe2c2';
  for (const [x, y] of [[64, 64], [192, 192]]) { c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); }
});
wallTex2.wrapS = wallTex2.wrapT = THREE.RepeatWrapping;
const skyTex2 = canvasTex(512, 512, (c, w, h) => {
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#a6dcff'); g.addColorStop(.55, '#ffe6c8'); g.addColorStop(1, '#ffcfae');
  c.fillStyle = g; c.fillRect(0, 0, w, h);
  const s = c.createRadialGradient(170, 290, 0, 170, 290, 300); s.addColorStop(0, 'rgba(255,253,230,1)'); s.addColorStop(.15, 'rgba(255,244,200,.95)'); s.addColorStop(1, 'rgba(255,220,170,0)');
  c.fillStyle = s; c.fillRect(0, 0, w, h);
  c.fillStyle = 'rgba(255,255,255,.85)';
  for (const [x, y, k] of [[360, 120, 1], [90, 90, .7], [440, 230, .55]]) for (const [dx, dy, r] of [[0, 0, 34], [36, -12, 28], [-32, 6, 24], [64, 6, 20]]) { c.beginPath(); c.arc(x + dx * k, y + dy * k, r * k, 0, 7); c.fill(); }
  c.fillStyle = '#c7e6a8'; c.beginPath(); c.ellipse(330, 520, 330, 130, 0, 0, 7); c.fill();
  c.fillStyle = '#b3dc96'; c.beginPath(); c.ellipse(40, 540, 220, 120, 0, 0, 7); c.fill();
  for (const [x, y, r] of [[420, 400, 34], [460, 410, 26], [70, 420, 30]]) { c.fillStyle = '#9fd086'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
});
const gingham = canvasTex(256, 256, (c, w, h) => {
  c.fillStyle = '#fff6f2'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,140,170,.45)';
  for (let i = 0; i < 8; i += 2) { c.fillRect(i * 32, 0, 32, h); c.fillRect(0, i * 32, w, 32); }
}, [3, 4]);
const beamTex = canvasTex(128, 512, (c, w, h) => {
  const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(.5, 'rgba(255,240,200,1)'); g.addColorStop(1, 'rgba(255,240,200,0)');
  c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.globalCompositeOperation = 'destination-in'; const v = c.createLinearGradient(0, 0, 0, h); v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = v; c.fillRect(0, 0, w, h);
});
const sunPatchTex = canvasTex(512, 512, (c, w, h) => {
  c.filter = 'blur(18px)'; c.fillStyle = 'rgba(255,236,190,1)';
  for (const [x, y] of [[70, 60], [270, 60], [70, 270], [270, 270]]) c.fillRect(x, y, 170, 180);
});

// ---------- cocina ----------
const BG = new THREE.Group(); scene.add(BG);    // se dibuja desenfocado (profundidad de campo)
function worldPlane(w, h, uvScale, material) { // plano XY con UV en unidades del mundo
  const g = new THREE.PlaneGeometry(w, h), p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / uvScale[0], p.getY(i) / uvScale[1]);
  return new THREE.Mesh(g, material);
}
function counterPlane(x0, x1, z0, z1) {
  const g = new THREE.PlaneGeometry(x1 - x0, z1 - z0); g.rotateX(-Math.PI / 2); g.translate((x0 + x1) / 2, 0, (z0 + z1) / 2);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 7, -p.getZ(i) / 7);
  const m = new THREE.Mesh(g, mat('#ffffff', .55, { map: counterTex })); m.receiveShadow = true; return m;
}
scene.add(counterPlane(-40, 40, -4.9, 16));
BG.add(counterPlane(-40, 40, -6, -4.9));
{ // pared del fondo: azulejos + pared + ventana
  const tiles = worldPlane(80, 3.6, [1.8, 1.8], mat('#ffffff', .35, { map: tileTex })); tiles.position.set(0, 1.8, -6); BG.add(tiles);
  const up = worldPlane(80, 30, [2.2, 2.2], mat('#ffffff', .9, { map: wallTex2 })); up.position.set(0, 18.6, -6.01); BG.add(up);
  BG.add(mesh(new THREE.BoxGeometry(80, .22, .25), mat('#f3c9a0', .5), { y: 3.68, z: -5.9 }));
  const win = new THREE.Group(); win.position.set(-2.6, 6.4, -5.97); BG.add(win);
  win.add(new THREE.Mesh(new THREE.PlaneGeometry(5.2, 4.3), new THREE.MeshBasicMaterial({ map: skyTex2, fog: false })));
  const fm = mat('#fffaf2', .45);
  for (const [x, y, w, h] of [[0, 2.25, 5.6, .26], [0, -2.25, 5.6, .26], [-2.7, 0, .26, 4.7], [2.7, 0, .26, 4.7], [0, 0, .14, 4.3], [0, .3, 5.2, .14]]) win.add(mesh(new THREE.BoxGeometry(w, h, .22), fm, { x, y, z: .1 }));
  win.add(mesh(new THREE.BoxGeometry(6.2, .2, .7), fm, { y: -2.42, z: .32 }));
  // macetas en el alféizar
  for (const [x, c] of [[-1.6, '#ff9fb4'], [1.7, '#9fd8ff']]) {
    win.add(mesh(new THREE.CylinderGeometry(.32, .24, .5, 24), mat(c, .5), { x, y: -2.07, z: .4 }));
    for (let i = 0; i < 6; i++) win.add(mesh(SPH, mat('#79c47a', .7), { x: x + Math.cos(i) * .18, y: -1.7 + rnd(i + x) * .3, z: .4 + Math.sin(i) * .12, sx: .18, sy: .26, sz: .14 }));
  }
  // cortinas de cuadros
  for (const s of [-1, 1]) {
    const g = new THREE.PlaneGeometry(1.6, 5.2, 24, 1), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); const pinch = 1 - .45 * Math.exp(-((y + .6) ** 2) / .3); p.setX(i, x * pinch); p.setZ(i, Math.sin(x * 9) * .1); }
    g.computeVertexNormals();
    const cm = new THREE.Mesh(g, mat('#ffffff', .9, { map: gingham, side: THREE.DoubleSide })); cm.position.set(s * 3.3, .1, .35); win.add(cm);
  }
  win.add(mesh(new THREE.CylinderGeometry(.06, .06, 7.6, 12), mat('#e9b27a', .4), { y: 2.75, z: .4, rz: Math.PI / 2 }));
}
// estante de la izquierda con tarros
{
  const sh = new THREE.Group(); sh.position.set(-9.2, 5.2, -5.6); BG.add(sh);
  sh.add(mesh(new THREE.BoxGeometry(5, .2, .9), mat('#e2a874', .5)));
  const cols = ['#ffb3c1', '#b8e0ff', '#ffe08a', '#c8f0b8'];
  for (let i = 0; i < 4; i++) {
    const x = -1.8 + i * 1.2, hh = .9 + rnd(i) * .5;
    sh.add(mesh(new THREE.CylinderGeometry(.42, .42, hh, 28), mat('#eaf6ff', .15, { transparent: true, opacity: .55 }), { x, y: .1 + hh / 2 }));
    sh.add(mesh(new THREE.CylinderGeometry(.36, .36, hh * .7, 20), mat(['#f6e3b4', '#c98a52', '#fff6e8', '#e9c46a'][i], .9), { x, y: .1 + hh * .35 }));
    sh.add(mesh(new THREE.CylinderGeometry(.46, .46, .16, 28), mat(cols[i], .5), { x, y: .18 + hh }));
  }
}
// armarios de arriba a la derecha
{
  const cab = new THREE.Group(); cab.position.set(7.5, 8.2, -5.5); BG.add(cab);
  cab.add(mesh(new THREE.BoxGeometry(9, 3.6, 1), mat('#bfe7d8', .55)));
  for (let i = 0; i < 4; i++) {
    cab.add(mesh(new THREE.BoxGeometry(2.05, 3.2, .1), mat('#cdeee2', .5), { x: -3.35 + i * 2.23, z: .52 }));
    cab.add(mesh(SPH, mat('#f6c26b', .3, { metalness: .4 }), { x: -3.35 + i * 2.23 + (i % 2 ? -.75 : .75), y: -1.1, z: .62, sx: .11, sy: .11, sz: .08 }));
  }
}
// barra con utensilios colgados
{
  const rail = new THREE.Group(); rail.position.set(4.6, 5.4, -5.75); BG.add(rail);
  rail.add(mesh(new THREE.CylinderGeometry(.05, .05, 4.2, 12), mat('#f6c26b', .3, { metalness: .5 }), { rz: Math.PI / 2 }));
  const wood = mat('#d79a62', .5), steel = mat('#d9dde6', .25, { metalness: .6 });
  [[-1.5, 'spatula'], [-.5, 'ladle'], [.5, 'whisk'], [1.5, 'spoon']].forEach(([x, k]) => {
    rail.add(mesh(new THREE.TorusGeometry(.1, .025, 8, 16), steel, { x, y: -.12 }));
    rail.add(mesh(new THREE.CylinderGeometry(.045, .045, 1.1, 10), k === 'whisk' ? steel : wood, { x, y: -.75 }));
    if (k === 'spatula') rail.add(mesh(new THREE.BoxGeometry(.42, .55, .04), wood, { x, y: -1.5 }));
    if (k === 'ladle' || k === 'spoon') rail.add(mesh(SPH, k === 'ladle' ? steel : wood, { x, y: -1.42, sx: .26, sy: .2, sz: .14 }));
    if (k === 'whisk') for (let i = 0; i < 4; i++) rail.add(mesh(new THREE.TorusGeometry(.2, .012, 6, 24), steel, { x, y: -1.48, sy: 1.7, ry: i * Math.PI / 4 }));
  });
}
// cosas sobre la encimera del fondo
{
  const g = new THREE.Group(); g.position.z = -5.45; BG.add(g);
  // hervidor
  const kp = []; for (let i = 0; i <= 20; i++) { const a = -Math.PI / 2 + Math.PI * i / 20; kp.push(new THREE.Vector2(Math.max(.001, Math.cos(a) * .75), .7 + Math.sin(a) * .7)); }
  g.add(mesh(new THREE.LatheGeometry(kp, 40), mat('#ffb3c6', .3), { x: 9.2 }));
  g.add(mesh(new THREE.TorusGeometry(.42, .07, 12, 24, Math.PI), mat('#f4f0ea', .4), { x: 9.2, y: 1.38 }));
  // tarro de cucharas
  g.add(mesh(new THREE.CylinderGeometry(.42, .36, 1.0, 24), mat('#fff3e0', .4), { x: -6.6, y: .5 }));
  for (let i = 0; i < 4; i++) g.add(mesh(new THREE.CylinderGeometry(.04, .04, 1.4, 8), mat('#d79a62', .5), { x: -6.6 + (i - 1.5) * .12, y: 1.4, rz: (i - 1.5) * .12 }));
  // frutero con limones
  g.add(mesh(SPH, mat('#9fd8ff', .4), { x: -10.5, y: .3, sx: .9, sy: .35, sz: .7 }));
  for (let i = 0; i < 4; i++) g.add(mesh(SPH, mat('#ffe066', .5), { x: -10.9 + i * .28, y: .65 + (i % 2) * .15, z: (i % 2 ? .1 : -.1), sx: .26, sy: .2, sz: .2 }));
  // panera
  g.add(mesh(new THREE.BoxGeometry(2.0, 1.1, .9), mat('#ffd8a8', .6), { x: 12.4, y: .55 }));
}
// pared derecha
{
  const sw = worldPlane(40, 30, [2.2, 2.2], mat('#ffffff', .9, { map: wallTex2 })); sw.rotation.y = -Math.PI / 2; sw.position.set(15, 15, 6); BG.add(sw);
  const st = worldPlane(40, 3.6, [1.8, 1.8], mat('#ffffff', .35, { map: tileTex })); st.rotation.y = -Math.PI / 2; st.position.set(14.99, 1.8, 6); BG.add(st);
  const sw2 = worldPlane(40, 30, [2.2, 2.2], mat('#ffffff', .9, { map: wallTex2 })); sw2.rotation.y = Math.PI / 2; sw2.position.set(-16, 15, 6); BG.add(sw2);
  const st2 = worldPlane(40, 3.6, [1.8, 1.8], mat('#ffffff', .35, { map: tileTex })); st2.rotation.y = Math.PI / 2; st2.position.set(-15.99, 1.8, 6); BG.add(st2);
}
// rayos de sol
const beams = [];
for (let i = 0; i < 4; i++) {
  const b = new THREE.Mesh(new THREE.PlaneGeometry(1.1 + rnd(i) * .7, 11), new THREE.MeshBasicMaterial({ map: beamTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .2, fog: false, side: THREE.DoubleSide }));
  b.position.set(-4.4 + i * 1.2, 5.5, -3.0); b.rotation.set(-.62, 0, .18); BG.add(b); beams.push(b);
}
BG.traverse(o => o.layers.set(1));
scene.traverse(o => { if (o.isLight) o.layers.enableAll(); });
// mancha de sol en la encimera (en primer plano)
const sunPatch = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 5.4), new THREE.MeshBasicMaterial({ map: sunPatchTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .22, fog: false }));
sunPatch.rotation.x = -Math.PI / 2; sunPatch.position.set(-1.6, .004, -1.2); scene.add(sunPatch);

// =====================================================================
//  TORTITAS (malla deformable: plana, en vuelo, manta sobre Mochi)
// =====================================================================
function buildSheet(R, T, NR, NS, topMat, sideMat) {
  const base = [], uv = [], idx = [[], []];
  const top = [], bot = [];
  const add = (r, ph, s) => { base.push(r, ph, s); uv.push(.5 + .5 * r / R * Math.cos(ph), .5 + .5 * r / R * Math.sin(ph)); return base.length / 3 - 1; };
  for (let i = 0; i <= NR; i++) { top[i] = []; bot[i] = []; const r = R * i / NR; for (let j = 0; j <= NS; j++) { const ph = j / NS * TAU; top[i][j] = add(r, ph, 1); bot[i][j] = add(r, ph, -1); } }
  for (let i = 0; i < NR; i++) for (let j = 0; j < NS; j++) {
    const a = top[i][j], b = top[i + 1][j], c = top[i + 1][j + 1], d = top[i][j + 1];
    idx[0].push(a, c, b, a, d, c);
    const A = bot[i][j], B = bot[i + 1][j], C = bot[i + 1][j + 1], D = bot[i][j + 1];
    idx[1].push(A, B, C, A, C, D);
  }
  for (let j = 0; j < NS; j++) { const t0 = top[NR][j], t1 = top[NR][j + 1], b0 = bot[NR][j], b1 = bot[NR][j + 1]; idx[1].push(t0, t1, b0, t1, b1, b0); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(base.length), 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex([...idx[0], ...idx[1]]); g.addGroup(0, idx[0].length, 0); g.addGroup(idx[0].length, idx[1].length, 1);
  const m = new THREE.Mesh(g, [topMat, sideMat]); m.castShadow = true; m.receiveShadow = true;
  const th = r => T / 2 * (.35 + .65 * Math.sqrt(Math.max(0, 1 - (r / R) ** 6)));
  return { mesh: m, geo: g, base: new Float32Array(base), R, T, th, count: base.length / 3 };
}
const PCK_TOP = mat('#ffffff', .62, { map: pancakeTex }), PCK_SIDE = mat('#f2c37c', .7);
const ARC_N = 48;
function arcTable(a, hd) { const tab = new Float32Array(ARC_N + 1); let s = 0, px = 0, py = hd; for (let i = 1; i <= ARC_N; i++) { const al = i / ARC_N * Math.PI / 2, x = a * Math.sin(al), y = hd * Math.cos(al); s += Math.hypot(x - px, y - py); tab[i] = s; px = x; py = y; } return tab; }
function domePoint(r, ph, a, hd, tab, out, nrm) {
  const S = tab[ARC_N], c = Math.cos(ph), s = Math.sin(ph);
  if (r < S) {
    let lo = 0, hi = ARC_N; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (tab[mid] < r) lo = mid; else hi = mid; }
    const al = (lo + (r - tab[lo]) / (tab[hi] - tab[lo])) / ARC_N * Math.PI / 2, sa = Math.sin(al), ca = Math.cos(al);
    out.set(a * sa * c, hd * ca, a * sa * s); nrm.set(sa * c / a, ca / hd, sa * s / a).normalize();
    // falda: el borde se abre un poco al llegar al suelo
    const k = sstep(.75, 1, al / (Math.PI / 2)); nrm.lerp(V3(c, .35, s).normalize(), k * .5).normalize();
  } else { const rho = a + (r - S) * .95; out.set(rho * c, 0, rho * s); nrm.set(0, 1, 0); }
  return S;
}
const _B = V3(), _N = V3(), EARS = [V3(-.45, 0, .12), V3(.45, 0, .12)];
function updateSheet(sh, p) {
  const pos = sh.geo.attributes.position.array, base = sh.base, R = sh.R;
  const drape = p.dr > 0, tab = drape ? arcTable(p.a, p.hd) : null;
  if (drape) { EARS[0].y = EARS[1].y = p.hd - .12; }
  for (let k = 0; k < sh.count; k++) {
    const r = base[3 * k], ph = base[3 * k + 1], side = base[3 * k + 2], c = Math.cos(ph), s = Math.sin(ph);
    const thk = sh.th(r) * side;
    let x = r * c, y = thk + (p.Y0 || 0) + (p.flop || 0) * (r / R) ** 2 * R * .25 * Math.cos(2 * ph + (p.flopPh || 0)), z = r * s;
    if (drape) {
      const S = domePoint(r, ph, p.a, p.hd, tab, _B, _N);
      let q = sh.T / 2 + thk;
      if (p.ears) for (const E of EARS) q += p.ears * .42 * Math.exp(-_B.distanceToSquared(E) / .03);
      q += .06 * Math.sin(ph * 7 + 1.3) * sstep(S * .5, S, r);
      if (p.bulge) q += p.bulge * Math.exp(-((_B.x - p.bx) ** 2 + (_B.y - p.by) ** 2 + (_B.z - p.bz) ** 2) / .3);
      let dx = _B.x + _N.x * q, dy = _B.y + _N.y * q, dz = _B.z + _N.z * q;
      if (p.lift) {
        let d = ph - Math.PI / 2; d = Math.atan2(Math.sin(d), Math.cos(d));
        const w = Math.exp(-d * d / .22) * sstep(S * .62, S + .1, r) * p.lift;
        dy += .85 * w; dx += c * .42 * w; dz += s * .42 * w;
      }
      x = lerp(x, dx, p.dr); y = lerp(y, dy, p.dr); z = lerp(z, dz, p.dr);
    }
    pos[3 * k] = x; pos[3 * k + 1] = y; pos[3 * k + 2] = z;
  }
  sh.geo.attributes.position.needsUpdate = true; sh.geo.computeVertexNormals(); sh.geo.computeBoundingSphere();
}
// punto sobre la manta (para la mantequilla que resbala)
// ---------- mantequilla ----------
function roundedBox(w, h, d, r) {
  const sh = new THREE.Shape(), x = -w / 2 + r, y = -d / 2 + r, W2 = w - 2 * r, D2 = d - 2 * r;
  sh.moveTo(x, y - r); sh.lineTo(x + W2, y - r); sh.quadraticCurveTo(x + W2 + r, y - r, x + W2 + r, y); sh.lineTo(x + W2 + r, y + D2);
  sh.quadraticCurveTo(x + W2 + r, y + D2 + r, x + W2, y + D2 + r); sh.lineTo(x, y + D2 + r); sh.quadraticCurveTo(x - r, y + D2 + r, x - r, y + D2); sh.lineTo(x - r, y); sh.quadraticCurveTo(x - r, y - r, x, y - r);
  const g = new THREE.ExtrudeGeometry(sh, { depth: h - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r * .9, bevelSegments: 5, curveSegments: 6 });
  g.translate(0, 0, -(h - 2 * r) / 2); g.rotateX(-Math.PI / 2); return g;
}

// =====================================================================
//  MOCHI (gato naranja, bípedo)
// =====================================================================
const LID_GEO = new THREE.SphereGeometry(1.14, 32, 16, 0, TAU, 0, Math.PI / 2);
function buildEye(parent, material, irisMat, scale) {
  const eg = new THREE.Group(); parent.add(eg);
  const es = new THREE.Group(); eg.add(es); es.userData.base = scale;
  es.add(mesh(SPH, MC.eyeW, { shadow: false }));
  const look = new THREE.Group(); es.add(look);
  look.add(mesh(SPH, irisMat || MC.iris, { z: .5, sx: .74, sy: .76, sz: .52, shadow: false }));
  const ring = mesh(new THREE.TorusGeometry(.64, .055, 8, 40), MC.irisDark, { z: .8, sx: 1, sy: 1.02, shadow: false }); look.add(ring);
  const pupil = mesh(SPH, MC.pupil, { z: .8, sx: .36, sy: .42, sz: .28, shadow: false }); look.add(pupil);
  es.add(mesh(SPH, MC.hl, { x: -.27, y: .32, z: .98, sx: .18, sy: .21, sz: .08, shadow: false }));
  es.add(mesh(SPH, MC.hl, { x: .26, y: -.24, z: .97, sx: .09, sy: .09, sz: .05, shadow: false }));
  const lid = new THREE.Mesh(LID_GEO, material); es.add(lid);
  return { eg, es, look, pupil, lid };
}
function buildMochi() {
  const root = new THREE.Group(), yawG = new THREE.Group(), lean = new THREE.Group(), sq = new THREE.Group();
  root.add(yawG); yawG.add(lean); lean.add(sq); scene.add(root);
  const bodyG = new THREE.Group(); sq.add(bodyG);
  const body = mesh(SPH, MC.fur, { y: 1.0, sx: .8, sy: .88, sz: .74 }); bodyG.add(body);
  bodyG.add(mesh(SPH, MC.cream, { y: .9, z: .34, sx: .56, sy: .62, sz: .45 }));
  for (const [yw, pt, w] of [[Math.PI, -.45, .3], [Math.PI, -.05, .36], [Math.PI, .35, .32], [Math.PI * .62, -.2, .22], [-Math.PI * .62, -.2, .22], [Math.PI * .62, .2, .2], [-Math.PI * .62, .2, .2]])
    onSurface(body, yw, pt, 1.0, mesh(SPH, MC.dark, { sx: w, sy: .065, sz: .05, shadow: false }));
  const feet = [-1, 1].map(s => { const f = mesh(SPH, MC.fur, { x: s * .34, y: .12, z: .12, sx: .25, sy: .15, sz: .33 }); sq.add(f); f.add(mesh(SPH, MC.cream, { z: .5, y: -.15, sx: .78, sy: .6, sz: .52, shadow: false })); return f; });
  const arms = [-1, 1].map(s => {
    const g = new THREE.Group(); g.position.set(s * .64, 1.4, .06); sq.add(g);
    g.add(mesh(new THREE.CapsuleGeometry(.14, .36, 8, 16), MC.fur, { y: -.28 }));
    g.add(mesh(SPH, MC.dark, { y: -.2, sx: .145, sy: .04, sz: .145, shadow: false }));
    g.add(mesh(SPH, MC.cream, { y: -.6, sx: .18, sy: .16, sz: .18 })); g.userData.s = s; return g;
  });
  const head = new THREE.Group(); sq.add(head);
  const hT = new THREE.Group(); head.add(hT);
  const skull = mesh(SPH, MC.fur, { sx: 1.0, sy: .86, sz: .88 }); hT.add(skull);
  for (const s of [-1, 1]) hT.add(mesh(new THREE.ConeGeometry(.2, .46, 16), MC.fur, { x: s * .92, y: -.24, z: .05, rz: -s * (Math.PI / 2 + .35), sz: .55 }));
  const ears = [];
  for (const s of [-1, 1]) {
    const ear = new THREE.Group(); ear.position.set(s * .5, .58, -.06); ear.rotation.set(-.12, 0, -s * .34); hT.add(ear);
    ear.add(mesh(new THREE.ConeGeometry(.3, .56, 32), MC.fur, { y: .2 }));
    ear.add(mesh(new THREE.ConeGeometry(.19, .38, 32), MC.pink, { y: .16, z: .11, sz: .45 }));
    ears.push(ear);
  }
  for (let i = -1; i <= 1; i++) onSurface(skull, i * .24, -.9, 1.0, mesh(SPH, MC.dark, { sx: .05, sy: .22, sz: .04, shadow: false }));
  for (const s of [-1, 1]) onSurface(skull, s * 1.25, -.25, 1.0, mesh(SPH, MC.dark, { sx: .04, sy: .15, sz: .2, shadow: false }));
  for (const s of [-1, 1]) onSurface(skull, s * .19, .4, .94, mesh(SPH, MC.cream, { sx: .23, sy: .19, sz: .14 }));
  onSurface(skull, 0, .62, .9, mesh(SPH, MC.cream, { sx: .17, sy: .12, sz: .12 }));
  onSurface(skull, 0, .2, 1.0, mesh(SPH, MC.nose, { sx: .1, sy: .07, sz: .07, shadow: false }));
  for (const s of [-1, 1]) hT.add(mesh(SPH, MC.blush, { x: s * .6, y: -.2, z: .6, sx: .15, sy: .08, sz: .05, ry: s * .7, shadow: false }));
  for (const s of [-1, 1]) for (const k of [-1, 0, 1]) {
    const w = mesh(new THREE.CylinderGeometry(.009, .006, .7, 6), MC.whisk, { shadow: false });
    const h = new THREE.Group(); h.position.set(s * .32, -.27 + k * .055, .74); h.rotation.set(0, -s * .3, Math.PI / 2 + k * .16 * s); h.add(w); w.position.y = -s * .36; hT.add(h);
  }
  const eyes = [-1, 1].map(s => { const e = buildEye(hT, MC.fur, MC.iris, [.25, .29, .13]); e.eg.position.set(s * .37, .1, .73); e.eg.rotation.set(-.05, s * .33, 0); e.s = s; return e; });
  const brows = [-1, 1].map(s => { const b = mesh(new THREE.CapsuleGeometry(.035, .2, 4, 8), MC.dark, { x: s * .37, y: .5, z: .74, rz: Math.PI / 2, ry: s * .3, shadow: false }); hT.add(b); b.userData.s = s; return b; });
  const mouth = new THREE.Group(); mouth.position.set(0, -.36, .74); mouth.rotation.x = .35; hT.add(mouth);
  const mW = new THREE.Group(); mouth.add(mW);
  for (const s of [-1, 1]) mW.add(mesh(new THREE.TorusGeometry(.065, .017, 8, 16, Math.PI), MC.pupil, { x: s * .064, z: .02, rz: Math.PI, shadow: false }));
  const mOpen = mesh(SPH, MC.mouth, { shadow: false }); mouth.add(mOpen);
  const mTongue = mesh(SPH, MC.tongue, { shadow: false }); mouth.add(mTongue);
  const tongueG = new THREE.Group(); tongueG.position.set(0, -.04, .05); mouth.add(tongueG);
  const tongue = mesh(new THREE.CapsuleGeometry(.075, .16, 6, 12), MC.tongue, { z: .14, rx: Math.PI / 2, sx: 1.25, sz: .55, shadow: false }); tongueG.add(tongue);
  const tail = new THREE.Mesh(new THREE.BufferGeometry(), MC.fur); tail.castShadow = true; sq.add(tail);
  const tailTip = mesh(SPH, MC.dark, { sx: .15, sy: .15, sz: .15 }); sq.add(tailTip);
  // cola suelta (asoma por debajo de la manta)
  const hemTail = new THREE.Mesh(new THREE.BufferGeometry(), MC.fur); hemTail.castShadow = true; scene.add(hemTail);
  const hemTip = mesh(SPH, MC.dark, { sx: .15, sy: .15, sz: .15 }); scene.add(hemTip);
  return { root, yawG, lean, sq, bodyG, feet, arms, head, hT, ears, eyes, brows, mouth, mW, mOpen, mTongue, tongueG, tail, tailTip, hemTail, hemTip };
}
function tubeAlong(meshT, tip, pts, r) {
  const curve = new THREE.CatmullRomCurve3(pts); meshT.geometry.dispose(); meshT.geometry = new THREE.TubeGeometry(curve, 28, r, 12); tip.position.copy(curve.getPoint(1)); tip.scale.setScalar(r * 1.15);
}
function setEyes(eyes, s, t) {
  for (const e of eyes) {
    const b = e.es.userData.base, k = s.eb;
    e.es.scale.set(b[0] * k, b[1] * k, b[2] * Math.min(k, 1.25));
    e.look.rotation.set(-s.ly * .5, s.lx * .55 - e.s * (s.cross || 0) * .5, 0);
    e.look.position.set(s.lx * .05, s.ly * .05, 0);
    e.pupil.scale.set(.36 * s.pd, .42 * s.pd, .28);
    let lid = s.lid; const bt = s.blink ?? 0; lid = Math.max(lid, bt);
    e.lid.rotation.x = -Math.PI / 2 + clamp(lid) * Math.PI * .98;
  }
}
const blinkAt = (t, period, off) => { const p = ((t + off) % period + period) % period; return p < .14 ? Math.sin(p / .14 * Math.PI) : 0; };

function setMochi(o, s, t) {
  const mode = s.mode;
  o.root.visible = mode !== 'hidden' && !(mode === 'blanket' && s.pk < .01);
  o.root.position.set(s.x, s.y, s.z);
  o.yawG.rotation.y = s.yaw;
  o.lean.rotation.set(s.lean, 0, s.roll);
  const full = mode === 'full';
  const ph = s.walk * TAU, wa = clamp(s.wamt);
  o.sq.scale.set(s.sx, s.sy, s.sz);
  o.sq.position.y = full ? Math.abs(Math.sin(ph)) * .07 * wa : 0;
  o.bodyG.visible = full; o.feet.forEach(f => f.visible = full); o.arms.forEach(a => a.visible = full); o.tail.visible = o.tailTip.visible = full;
  if (full) {
    o.head.position.set(0, 2.08, .07); o.head.scale.setScalar(1);
    const sit = s.sit || 0;
    o.feet.forEach((f, i) => { const p = ph + i * Math.PI; f.position.set((i ? 1 : -1) * .34, .12 + Math.max(0, Math.sin(p)) * .16 * wa + sit * .32, .12 + Math.cos(p) * .24 * wa + sit * .42); f.rotation.x = -Math.max(0, Math.sin(p)) * .4 * wa - sit * .7; });
    const swing = Math.sin(ph) * .5 * wa;
    o.arms.forEach((a, i) => { const sg = a.userData.s; const f = sg < 0 ? s.aLf : s.aRf, out = sg < 0 ? s.aLo : s.aRo; a.rotation.set(-(f + swing * sg), 0, sg * out); });
    const wag = Math.sin(t * 4 * s.tw) * .45;
    tubeAlong(o.tail, o.tailTip, [V3(0, .45, -.6), V3(wag * .25, .5, -1.05), V3(wag * .7, 1.0, -1.35), V3(wag * 1.1, 1.55, -1.3 + Math.cos(t * 3) * .1)], .12);
  } else {
    o.head.position.set(0, 0, 0); o.head.scale.setScalar(s.hs);
  }
  const sn = s.sn * Math.sin(t * 38) * .025;
  o.head.rotation.set(s.hp + sn, s.hy, s.hr + Math.sin(t * 1.7) * .03, 'YXZ');
  o.ears.forEach((e, i) => { const sg = i ? 1 : -1; e.rotation.z = -sg * (.34 + s.ed * .5) + Math.sin(t * 9 + i) * .02; e.rotation.x = -.12 - s.ed * .3; });
  setEyes(o.eyes, { ...s, blink: s.lid < .5 ? blinkAt(t, 3.3, .7) : 0 }, t);
  o.brows.forEach(b => { const sg = b.userData.s; b.visible = s.br > .02; b.scale.setScalar(Math.max(.01, s.br)); b.rotation.z = Math.PI / 2 + sg * .35 * s.brA; b.position.y = .5 + (s.eb - 1) * .25; });
  // boca
  const mo = s.mo;
  o.mW.visible = mo < .06;
  o.mOpen.visible = o.mTongue.visible = mo >= .06;
  o.mOpen.scale.set(.09 + .15 * mo, .05 + .17 * mo, .09); o.mOpen.position.set(0, -.06 * mo, .0);
  o.mTongue.scale.set(.06 + .09 * mo, .03 + .05 * mo, .06); o.mTongue.position.set(0, -.12 * mo, .03);
  o.tongueG.visible = s.tg > .02;
  o.tongueG.scale.set(1, 1, Math.max(.01, s.tg));
  o.tongueG.position.set(0, -.04 - .1 * mo, .05);
  o.tongueG.rotation.set(-s.tu * 1.25 + .25 + Math.sin(t * 6) * .12 * s.lk, Math.sin(t * 7.5) * .9 * s.lk, Math.sin(t * 7.5) * .5 * s.lk);
}

// =====================================================================
//  PIP (ratoncito gris)
// =====================================================================
function buildPip() {
  const root = new THREE.Group(), yawG = new THREE.Group(), lean = new THREE.Group(), sq = new THREE.Group();
  root.add(yawG); yawG.add(lean); lean.add(sq); root.scale.setScalar(PIP_S); scene.add(root);
  sq.add(mesh(SPH, PC.fur, { y: .23, sx: .17, sy: .2, sz: .16 }));
  sq.add(mesh(SPH, PC.cream, { y: .21, z: .075, sx: .12, sy: .14, sz: .105 }));
  const feet = [-1, 1].map(s => { const f = mesh(SPH, PC.pink, { x: s * .085, y: .03, z: .05, sx: .06, sy: .035, sz: .085 }); sq.add(f); return f; });
  const arms = [-1, 1].map(s => {
    const g = new THREE.Group(); g.position.set(s * .14, .31, .03); sq.add(g);
    g.add(mesh(new THREE.CapsuleGeometry(.035, .08, 6, 10), PC.fur, { y: -.065 }));
    g.add(mesh(SPH, PC.pink, { y: -.135, sx: .043, sy: .04, sz: .043 })); g.userData.s = s; return g;
  });
  const head = new THREE.Group(); head.position.set(0, .49, .03); sq.add(head);
  head.add(mesh(SPH, PC.fur, { sx: .2, sy: .178, sz: .185 }));
  head.add(mesh(SPH, PC.fur, { y: -.05, z: .13, sx: .1, sy: .08, sz: .11 }));
  head.add(mesh(SPH, PC.cream, { y: -.075, z: .15, sx: .075, sy: .05, sz: .07 }));
  head.add(mesh(SPH, PC.nose, { y: -.035, z: .245, sx: .03, sy: .026, sz: .026 }));
  for (const s of [-1, 1]) head.add(mesh(SPH, MC.blush, { x: s * .12, y: -.07, z: .14, sx: .04, sy: .022, sz: .02, ry: s * .6, shadow: false }));
  const ears = [-1, 1].map(s => {
    const g = new THREE.Group(); g.position.set(s * .15, .13, -.03); head.add(g);
    g.add(mesh(new THREE.CylinderGeometry(.16, .16, .03, 32), PC.fur, { y: .12, rx: Math.PI / 2 }));
    g.add(mesh(new THREE.CylinderGeometry(.115, .115, .03, 32), PC.pink, { y: .12, z: .01, rx: Math.PI / 2 }));
    g.userData.s = s; return g;
  });
  const eyes = [-1, 1].map(s => {
    const eg = new THREE.Group(); eg.position.set(s * .085, .03, .148); eg.rotation.set(-.05, s * .28, 0); head.add(eg);
    const es = new THREE.Group(); es.scale.set(.058, .072, .04); eg.add(es);
    es.add(mesh(SPH, PC.eye, { shadow: false }));
    const look = new THREE.Group(); es.add(look);
    look.add(mesh(SPH, MC.hl, { x: -.3, y: .36, z: .82, sx: .34, sy: .36, sz: .2, shadow: false }));
    look.add(mesh(SPH, MC.hl, { x: .32, y: -.32, z: .86, sx: .15, sy: .15, sz: .1, shadow: false }));
    const lid = new THREE.Mesh(LID_GEO, PC.lidc); es.add(lid);
    return { eg, es, look, lid, s };
  });
  const mouth = new THREE.Group(); mouth.position.set(0, -.092, .19); mouth.rotation.x = .3; head.add(mouth);
  const smile = mesh(new THREE.TorusGeometry(.028, .007, 6, 16, Math.PI), MC.pupil, { rz: Math.PI, shadow: false }); mouth.add(smile);
  const flat = mesh(new THREE.CapsuleGeometry(.006, .04, 4, 8), MC.pupil, { rz: Math.PI / 2, shadow: false }); mouth.add(flat);
  const mOpen = mesh(SPH, MC.mouth, { shadow: false }); mouth.add(mOpen);
  for (const s of [-1, 1]) for (const k of [-1, 1]) {
    const w = mesh(new THREE.CylinderGeometry(.003, .002, .2, 5), PC.whisk, { shadow: false });
    const h = new THREE.Group(); h.position.set(s * .06, -.05, .21); h.rotation.set(0, -s * .3, Math.PI / 2 + k * .18 * s); h.add(w); w.position.y = -s * .1; head.add(h);
  }
  // bigote de mantequilla
  const must = new THREE.Group(); must.position.set(0, -.07, .215); head.add(must);
  must.add(mesh(SPH, BUTTER, { sx: .055, sy: .03, sz: .03 }));
  for (const s of [-1, 1]) {
    const c = mesh(new THREE.TorusGeometry(.04, .016, 10, 20, Math.PI * 1.15), BUTTER, { x: s * .055, y: .005, rz: s > 0 ? -Math.PI * .15 : Math.PI * 1.0, ry: s * .3 });
    must.add(c);
    must.add(mesh(SPH, BUTTER, { x: s * .1, y: .035, z: -.01, sx: .016, sy: .016, sz: .016 }));
  }
  const drip = mesh(SPH, BUTTER, { sx: .012, sy: .018, sz: .012 }); must.add(drip);
  const tail = new THREE.Mesh(new THREE.BufferGeometry(), PC.pink); tail.castShadow = true; sq.add(tail);
  const tailTip = mesh(SPH, PC.pink, { sx: .015, sy: .015, sz: .015 }); sq.add(tailTip);
  return { root, yawG, lean, sq, feet, arms, head, ears, eyes, smile, flat, mOpen, must, drip, tail, tailTip };
}
function setPip(o, s, t) {
  o.root.position.set(s.x, s.y, s.z);
  o.yawG.rotation.y = s.yaw;
  o.lean.rotation.set(s.lean, 0, s.roll);
  o.sq.scale.set(s.sx, s.sy, s.sx);
  const ph = s.walk * TAU, wa = clamp(s.wamt);
  o.sq.position.y = Math.abs(Math.sin(ph)) * .025 * wa;
  o.feet.forEach((f, i) => { const p = ph + i * Math.PI, kk = s.kick * Math.sin(t * 26 + i * 2) * .06; f.position.set((i ? 1 : -1) * .085, .03 + Math.max(0, Math.sin(p)) * .05 * wa + Math.max(0, kk), .05 + Math.cos(p) * .07 * wa + kk); });
  const swing = Math.sin(ph) * .6 * wa;
  o.arms.forEach(a => { const sg = a.userData.s; const f = sg < 0 ? s.aLf : s.aRf, out = sg < 0 ? s.aLo : s.aRo; const rub = sg > 0 ? Math.sin(t * 22) * .18 * s.rub : 0; const fid = Math.sin(t * 16 + sg) * .15 * s.fid; a.rotation.set(-(f + swing * sg + fid), 0, sg * (out + rub)); });
  o.head.rotation.set(s.hp, s.hy, s.hr + Math.sin(t * 2.3) * .04, 'YXZ');
  o.ears.forEach(e => { const sg = e.userData.s; e.rotation.set(-.2 + s.ed * .9, 0, -sg * (.45 + s.ed * .5) + Math.sin(t * 13 + sg) * .03 * (1 - s.ed)); });
  const bl = s.lid < .55 ? blinkAt(t, 2.9, .2) : 0;
  o.eyes.forEach(e => { e.look.position.set(s.lx * .25, s.ly * .2, 0); e.lid.rotation.x = -Math.PI / 2 + clamp(Math.max(s.lid, bl)) * Math.PI * .98; });
  o.smile.visible = s.sm > .5 && s.mo < .1; o.flat.visible = s.sm <= .5 && s.mo < .1;
  o.smile.scale.setScalar(.8 + s.sm * .5);
  o.mOpen.visible = s.mo >= .1; o.mOpen.scale.set(.03 + .02 * s.mo, .015 + .035 * s.mo, .02);
  o.must.visible = s.must > .5;
  const dp = ((t - (s.dripT ?? 34.2)) % 3.2 + 3.2) % 3.2 / 3.2;
  o.drip.position.set(.06, -.03 - dp * .06, 0); o.drip.scale.set(.012, .014 + dp * .012, .012);
  const tw = Math.sin(t * 4) * .5;
  tubeAlong(o.tail, o.tailTip, [V3(0, .12, -.14), V3(tw * .08, .06, -.3), V3(tw * .2, .12 + s.tailUp * .25, -.45), V3(tw * .1, .3 + s.tailUp * .3, -.55)], .014);
}

const mochi = buildMochi();
const pip = buildPip();

// =====================================================================
//  EFECTOS
// =====================================================================
const sprite3 = (map, color = '#ffffff', blend = THREE.NormalBlending) => new THREE.Sprite(new THREE.SpriteMaterial({ map, color, transparent: true, depthWrite: false, blending: blend }));
const steamP = pool(30, () => sprite3(softTex, '#ffffff'));
const puffP = pool(40, () => sprite3(softTex, '#fff6ea'));
const sparkP = pool(24, () => sprite3(STAR_W, '#ffffff', THREE.AdditiveBlending));
const dropP = pool(26, () => mesh(SPH, BUTTER, { shadow: false }));
const motes = pool(26, () => sprite3(softTex, '#fff2c8', THREE.AdditiveBlending));

// ---------- composición: cámara orbital + fondo desenfocado + primer plano nítido ----------
function placeCam(c) {
  camera.fov = c.fov || 30; camera.updateProjectionMatrix();
  const cp = Math.cos(c.pt);
  camera.position.set(c.tx + c.d * Math.sin(c.yw) * cp, c.ty + c.d * Math.sin(c.pt), c.tz + c.d * Math.cos(c.yw) * cp);
  camera.lookAt(c.tx, c.ty, c.tz); if (c.roll) camera.rotateZ(c.roll); camera.updateMatrixWorld();
}
function composite(c, blurK = 1) {
  placeCam(c);
  const blur = clamp(6.5 / Math.max(1, c.d) * 4.2 * blurK, 1.2, 10);
  octx.fillStyle = '#f5d9b6'; octx.fillRect(0, 0, W, H);
  camera.layers.set(1); scene.background = BG_COLOR; renderer.shadowMap.enabled = false;
  renderer.render(scene, camera);
  octx.filter = `blur(${blur.toFixed(1)}px)`; octx.drawImage(renderer.domElement, 0, 0); octx.filter = 'none';
  camera.layers.set(0); scene.background = null; renderer.setClearColor(0x000000, 0); renderer.shadowMap.enabled = true;
  renderer.render(scene, camera);
  octx.drawImage(renderer.domElement, 0, 0);
}
function warmGrade() {
  const vg = ctx.createRadialGradient(W / 2, H * .48, H * .3, W / 2, H * .5, H * .78); vg.addColorStop(0, 'rgba(120,60,20,0)'); vg.addColorStop(1, 'rgba(120,60,20,.28)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createLinearGradient(0, 0, W, H * .6); glow.addColorStop(0, 'rgba(255,236,200,.16)'); glow.addColorStop(1, 'rgba(255,236,200,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
}
