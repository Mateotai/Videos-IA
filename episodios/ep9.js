// =====================================================================
//  EPISODIO 9 (3D) — "Pancakes 🥞"   40 s · 9:16 · 6 planos · sin texto
//  1 (0–5)   Pip presenta su tortita diminuta con mantequilla.
//  2 (5–12)  Mochi la huele, ojos de plato, sueña con una montaña de tortitas
//            y arrastra una sartén de hierro más grande que él.
//  3 (12–18) Voltea una tortita gigante… le cae encima como una manta.
//  4 (18–25) La mantequilla resbala; Mochi se lanza y se enrolla en un burrito.
//  5 (25–32) La mantequilla sale disparada a cámara lenta y aplasta a Pip.
//  6 (32–40) Pip con bigote de mantequilla; Mochi lame su burrito; bucle.
//  El último fotograma es idéntico al primero (bucle perfecto).
// =====================================================================
const DURATION = 40;
const SHOTS = [0, 5, 12, 18, 25, 32, 40];
const shotOf = t => { let i = 0; while (i < 5 && t >= SHOTS[i + 1]) i++; return i; };
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const sstep = (a, b, x) => { const p = clamp((x - a) / (b - a)); return p * p * (3 - 2 * p); };
const TAU = Math.PI * 2;

// fuera el decorado y los personajes del motor
room.visible = false; tableCookie.visible = false; catHalf.visible = false;
cat.root.visible = false; mouse.root.visible = false;

// ---------- disposición ----------
const PL = V3(-4.0, 0, 1.2);                 // plato de Pip
const PANZ = -2.4, PAN_R = 2.45, H_ANG = .25, H_LEN = 2.6;
const PAN_X = 4.3;
const REACH = PAN_R + H_LEN * Math.cos(H_ANG) + .6;   // pan.x - mochi.x al arrastrar
const CATCH = V3(-0.6, 0, 0.5);
const BX = -1.95, BZ = -0.2, RB = 1.0, BL = 2.5, BYAW = -.38;      // burrito
const GPR = 2.2, GPT = .16;                          // tortita gigante
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
function drapeSurface(s, ph, a, hd, out, nrm) {
  const tab = arcTable(a, hd); domePoint(s, ph, a, hd, tab, out, nrm);
  let q = GPT; for (const E of [V3(-.45, hd - .12, .12), V3(.45, hd - .12, .12)]) q += .42 * Math.exp(-out.distanceToSquared(E) / .03) * 0;
  out.addScaledVector(nrm, q); return out;
}
const giant = buildSheet(GPR, GPT, 30, 96, PCK_TOP, PCK_SIDE); scene.add(giant.mesh);
const tiny = buildSheet(.2, .07, 8, 40, PCK_TOP, PCK_SIDE); updateSheet(tiny, { dr: 0 });

// ---------- mantequilla ----------
function roundedBox(w, h, d, r) {
  const sh = new THREE.Shape(), x = -w / 2 + r, y = -d / 2 + r, W2 = w - 2 * r, D2 = d - 2 * r;
  sh.moveTo(x, y - r); sh.lineTo(x + W2, y - r); sh.quadraticCurveTo(x + W2 + r, y - r, x + W2 + r, y); sh.lineTo(x + W2 + r, y + D2);
  sh.quadraticCurveTo(x + W2 + r, y + D2 + r, x + W2, y + D2 + r); sh.lineTo(x, y + D2 + r); sh.quadraticCurveTo(x - r, y + D2 + r, x - r, y + D2); sh.lineTo(x - r, y); sh.quadraticCurveTo(x - r, y - r, x, y - r);
  const g = new THREE.ExtrudeGeometry(sh, { depth: h - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r * .9, bevelSegments: 5, curveSegments: 6 });
  g.translate(0, 0, -(h - 2 * r) / 2); g.rotateX(-Math.PI / 2); return g;
}
const BUT_GEO = roundedBox(.3, .14, .24, .04);
const bigButter = mesh(BUT_GEO, BUTTER); scene.add(bigButter);
const butterTrail = []; for (let i = 0; i < 10; i++) { const m = mesh(SPH, BUTTER_MELT, { shadow: false }); m.visible = false; scene.add(m); butterTrail.push(m); }
const splat = new THREE.Group(); scene.add(splat);
splat.add(mesh(SPH, BUTTER, { sx: .2, sy: .06, sz: .17 }));
for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + .3; splat.add(mesh(SPH, BUTTER, { x: Math.cos(a) * .19, y: -.02, z: Math.sin(a) * .16, sx: .07, sy: .035, sz: .06 })); }

// ---------- plato + tortita de Pip ----------
const plate = new THREE.Group(); plate.position.copy(PL); scene.add(plate);
{
  const pts = [[0, 0], [.24, 0], [.29, .015], [.35, .045], [.37, .056], [.36, .064], [.3, .036], [.24, .026], [0, .026]].map(([x, y]) => new THREE.Vector2(x, y));
  plate.add(mesh(new THREE.LatheGeometry(pts, 64), gloss('#fffdf8', { roughness: .2 })));
  plate.add(mesh(new THREE.TorusGeometry(.335, .006, 8, 64), mat('#8fcfff', .3), { y: .053, rx: Math.PI / 2, shadow: false }));
}
const pipCake = new THREE.Group(); pipCake.position.set(0, .03, 0); plate.add(pipCake);
const tinyMesh = tiny.mesh; tinyMesh.position.y = .035; pipCake.add(tinyMesh);
const tinyCake2 = mesh(tiny.geo, [PCK_TOP, PCK_SIDE]); tinyCake2.position.y = -.005; tinyCake2.scale.set(.97, 1, .97); tinyCake2.rotation.y = 1.3; pipCake.add(tinyCake2);
const pat = mesh(BUT_GEO, BUTTER, { y: .1, sx: .3, sy: .3, sz: .3, ry: .5 }); pipCake.add(pat);
const patMelt = mesh(new THREE.CircleGeometry(1, 28), BUTTER_MELT, { y: .0715, rx: -Math.PI / 2, sx: .085, sy: .07, shadow: false }); pipCake.add(patMelt);
{ const p = patMelt.geometry.attributes.position; for (let i = 1; i < p.count; i++) { const a = Math.atan2(p.getY(i), p.getX(i)), k = 1 + .18 * Math.sin(a * 5) + .1 * Math.sin(a * 3 + 1); p.setX(i, p.getX(i) * k); p.setY(i, p.getY(i) * k); } }

// ---------- sartén de hierro ----------
const pan = new THREE.Group(); scene.add(pan);
const panTilt = new THREE.Group(); panTilt.position.x = PAN_R; pan.add(panTilt);
const panIn = new THREE.Group(); panIn.position.x = -PAN_R; panTilt.add(panIn);
{
  const IRON = new THREE.MeshPhysicalMaterial({ color: '#34303a', roughness: .42, metalness: .55, clearcoat: .3 });
  const pts = [[0, .02], [2.15, .02], [2.38, .08], [2.5, .46], [2.47, .53], [2.4, .5], [2.3, .16], [2.12, .11], [0, .11]].map(([x, y]) => new THREE.Vector2(x, y));
  panIn.add(mesh(new THREE.LatheGeometry(pts, 96), IRON));
  const hd = new THREE.Group(); hd.position.set(-PAN_R + .05, .42, 0); hd.rotation.z = -H_ANG; panIn.add(hd);
  hd.add(mesh(new THREE.BoxGeometry(H_LEN, .2, .3), IRON, { x: -H_LEN / 2 }));
  hd.add(mesh(new THREE.TorusGeometry(.16, .07, 12, 24), IRON, { x: -H_LEN + .05, rx: Math.PI / 2 }));
  hd.add(mesh(new THREE.BoxGeometry(.7, .26, .36), mat('#d6955a', .55), { x: -H_LEN + .5 }));
}

// ---------- burrito ----------
const burr = new THREE.Group(); burr.rotation.y = BYAW; scene.add(burr);
const bsq = new THREE.Group(); burr.add(bsq);
const bspin = new THREE.Group(); bsq.add(bspin);
{
  const side = new THREE.Mesh(new THREE.CylinderGeometry(RB, RB, BL, 72, 1, true), mat('#ffffff', .6, { map: burritoTex })); side.rotation.x = Math.PI / 2; side.castShadow = side.receiveShadow = true; bspin.add(side);
  for (const s of [-1, 1]) {
    bspin.add(mesh(new THREE.TorusGeometry(RB - .05, .07, 14, 72), PCK_SIDE, { z: s * BL / 2 }));
    bspin.add(mesh(new THREE.RingGeometry(s > 0 ? .76 : 0.001, RB - .02, 72), mat('#ffffff', .65, { map: spiralTex, side: THREE.DoubleSide }), { z: s * (BL / 2 + .005), ry: s > 0 ? 0 : Math.PI, shadow: false }));
  }
  bspin.add(mesh(new THREE.CircleGeometry(.78, 48), mat('#7a3f12', .9), { z: BL / 2 - .45, shadow: false }));
  // la solapa (borde exterior de la tortita enrollada)
  const flap = new THREE.Mesh(new THREE.CylinderGeometry(RB + .04, RB + .04, BL * .98, 48, 1, true, 0, .55), PCK_SIDE); flap.rotation.x = Math.PI / 2; flap.rotation.y = -.9; flap.castShadow = true; bspin.add(flap);
}
const burrPaws = [-1, 1].map(s => { const p = mesh(SPH, MC.cream, { sx: .17, sy: .14, sz: .16 }); bspin.add(p); p.userData.s = s; return p; });

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
    e.look.rotation.set(-s.ly * .5, s.lx * .55, 0);
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
    o.feet.forEach((f, i) => { const p = ph + i * Math.PI; f.position.set((i ? 1 : -1) * .34, .12 + Math.max(0, Math.sin(p)) * .16 * wa, .12 + Math.cos(p) * .24 * wa); f.rotation.x = -Math.max(0, Math.sin(p)) * .4 * wa; });
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
  const dp = ((t - 34.2) % 3.2 + 3.2) % 3.2 / 3.2;
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
// burbuja de pensamiento con la montaña de tortitas
const bubble = new THREE.Group(); scene.add(bubble);
const bubbleMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .9, emissive: '#fff4e6', emissiveIntensity: .35 });
for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; bubble.add(mesh(SPH, bubbleMat, { x: Math.cos(a) * 1.3, y: Math.sin(a) * 1.25, z: -.5, sx: .62, sy: .62, sz: .4, shadow: false })); }
bubble.add(mesh(SPH, bubbleMat, { z: -.6, sx: 1.6, sy: 1.55, sz: .45, shadow: false }));
const stack = new THREE.Group(); stack.position.set(0, -.95, .1); bubble.add(stack);
for (let i = 0; i < 11; i++) { const m = mesh(tiny.geo, [PCK_TOP, PCK_SIDE], { y: i * .15, ry: i * 1.7, shadow: false }); const k = 4.2 - i * .12; m.scale.set(k, 2.0, k); stack.add(m); }
stack.add(mesh(BUT_GEO, BUTTER, { y: 1.72, sx: 1.3, sy: 1.3, sz: 1.3, ry: .5, shadow: false }));
const SYRUP = gloss('#c8742a', { transparent: true, opacity: .85 });
stack.add(mesh(new THREE.CylinderGeometry(.7, .72, .06, 40), SYRUP, { y: 1.62, shadow: false }));
for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + .4; stack.add(mesh(new THREE.CapsuleGeometry(.06, .12 + rnd(i) * .22, 4, 8), SYRUP, { x: Math.cos(a) * .74, y: 1.5 - rnd(i) * .08, z: Math.sin(a) * .76, shadow: false })); }
stack.add(mesh(SPH, mat('#ff4d6d', .35), { y: 1.95, x: .2, sx: .18, sy: .2, sz: .18, shadow: false }));
const smallB = [0, 1, 2].map(i => { const m = mesh(SPH, bubbleMat, { shadow: false }); scene.add(m); return m; });

// =====================================================================
//  GUION (fotogramas clave)
// =====================================================================
const MO = new Rig({ x: 3.2, y: 0, z: .4, yaw: -1.25, lean: 0, roll: 0, sx: 1, sy: 1, sz: 1, wr: 0, wamt: 0,
  aLf: .15, aLo: .22, aRf: .15, aRo: .22, hp: 0, hy: 0, hr: 0, hs: 1, eb: 1, pd: 1, lid: 0, lx: 0, ly: 0, sp: 0,
  mo: 0, tg: 0, tu: 0, lk: 0, br: 0, brA: 1, tw: 1, wg: 0, sn: 0, pk: 0, ed: 0 });
const MMODE = new Steps('hidden');
const PI_ = new Rig({ x: -5.5, y: 0, z: 1.15, yaw: Math.PI / 2, lean: 0, roll: 0, sx: 1, sy: 1, wr: 0, wamt: 0,
  aLf: .1, aLo: .25, aRf: .1, aRo: .25, hp: 0, hy: 0, hr: 0, lid: 0, lx: 0, ly: 0, sm: 1, mo: 0, ed: 0, must: 0, rub: 0, kick: 0, fid: 0, tailUp: 0 });
const PN = new Rig({ x: 14, tilt: 0 });                        // sartén
const GP = new Rig({ dr: 0, hd: 1.55, lift: 0, bulge: 0, bx: 0, by: 1, bz: 0, ears: 1, a: 1.05 });
const GMODE = new Steps('hidden');
const BU = new Rig({ s: .02 });
const BMODE = new Steps('hidden');
const BR = new Rig({ x: CATCH.x, y: RB, z: BZ, spin: 0, sx: 1, sy: 1 });
const BB = new Rig({ k: 0 });                                   // burbuja de pensamiento
const KM = (t, v, e) => MO.key(t, v, e), P = (t, v, e) => PI_.key(t, v, e);

// ---------------- PLANO 1 (0–5): la tortita de Pip ----------------
P(1.2, { x: -5.5, wr: 0, wamt: 0 }); P(1.3, { wr: 5.5, wamt: 1 }); P(1.9, { x: -4.62 }, 'o'); P(1.85, { wr: 5.5, wamt: 1 }); P(2.0, { wr: 0, wamt: 0 });
P(1.95, { yaw: Math.PI / 2 }); P(2.15, { yaw: 1.05 });
P(2.15, { lean: 0, aRf: .1, aRo: .25, rub: 0, lid: 0, hp: 0 }); P(2.4, { lean: .32, aRf: 1.25, aRo: -.25, hp: .25, lid: .25 }); P(2.45, { rub: 1 }); P(2.85, { rub: 1 }); P(2.95, { rub: 0 });
P(2.95, { lean: .32, aRf: 1.25, aRo: -.25, hp: .25, x: -4.62 }); P(3.25, { lean: -.2, aRf: -.35, aRo: .75, aLf: -.35, aLo: .75, hp: -.3, x: -4.68, lid: .9, sy: 1.08, sx: 1.04 }, 'back');
P(3.3, { y: 0, sy: 1.08 }); P(3.42, { y: .09, sy: 1.12 }, 'oq'); P(3.55, { y: 0 }, 'iq'); P(3.62, { sy: .9, sx: 1.08 }, 'o'); P(3.8, { sy: 1.08, sx: 1.04 }, 'back');
P(4.2, { lid: .9, hp: -.3, hy: 0, lean: -.2 }); P(4.35, { lid: 0, hp: 0, lean: 0, aLf: .1, aLo: .25, aRf: .1, aRo: .25, sy: 1, sx: 1 });
P(4.45, { hy: 0, lx: 0 }); P(4.6, { hy: .55, lx: .6, ed: .3 }); P(4.8, { hy: .55, lx: .6 }); P(4.9, { hy: .1, lx: -.2 });
P(4.4, { fid: 0, aLf: .1, aRf: .1, aLo: .25, aRo: .25 }); P(4.6, { fid: 1, aLf: .95, aRf: .95, aLo: -.55, aRo: -.55 });
// planos 2–4: Pip mira desde su plato
P(5.0, { fid: 1, hy: .1, lx: -.2, ed: .3 }); P(5.2, { fid: 0, aLf: .1, aRf: .1, aLo: .25, aRo: .25, hy: 0, lx: 0, ed: 0, yaw: 1.05 });
// ---------------- PLANO 5: oliendo su tortita… ¡SPLAT! ----------------
const SPLAT = 29.45;
P(26.4, { yaw: 1.05, lean: 0, lid: 0, hp: 0, sm: 1 }); P(27.2, { yaw: Math.PI / 2 - .15, lean: .42, lid: 1, hp: .2, x: -4.62 });
P(SPLAT, { x: -4.62, lean: .42, sy: 1, sx: 1, aLf: .1, aRf: .1, aLo: .25, aRo: .25, ed: 0, tailUp: 0 });
P(SPLAT + .05, { lid: 1 }); P(SPLAT + .08, { lid: 0 });
P(SPLAT + .19, { x: -4.38, lean: 1.15, aLf: 2.6, aRf: 2.6, aLo: .6, aRo: .6, tailUp: 1 }, 'i');
P(SPLAT + .24, { sy: .82, sx: 1.12, ed: 1 }, 'o'); P(SPLAT + .45, { sy: 1, sx: 1, aLf: 1.6, aRf: 1.6, aLo: .9, aRo: .9 }, 'back');
P(30.1, { kick: 0 }); P(30.2, { kick: 1 }); P(30.7, { kick: 1 }); P(30.8, { kick: 0 }); P(31.0, { tailUp: 1 }); P(31.6, { tailUp: .2 });
// ---------------- PLANO 6: bigote de mantequilla ----------------
P(32.3, { hp: .2, x: -4.38, lean: 1.15, aLf: 1.6, aRf: 1.6, aLo: .9, aRo: .9, ed: 1, lid: 0, sm: 1, tailUp: .2 });
P(33.3, { hp: 0, x: -4.55, lean: 0, aLf: .1, aRf: .1, aLo: .25, aRo: .25, tailUp: 0 }, 'io');
P(32.9, { lid: 0, sm: 1 }); P(33.2, { lid: .5, sm: 0, ed: .35, yaw: 1.05 }); P(33.6, { yaw: .3 });
P(33.95, { lid: .5 }); P(34.1, { lid: 1 }); P(34.4, { lid: .5 });
P(34.6, { hy: 0, lx: 0, yaw: .3 }); P(34.9, { hy: .6, lx: .7 }); P(35.7, { yaw: -.4 }); P(37.0, { hy: .6, lx: .7 }); P(37.3, { hy: 0, lx: 0 });
P(36.4, { lid: .5 }); P(36.55, { lid: 1 }); P(36.8, { lid: .5 });
P(38.1, { sy: 1, ed: .35 }); P(38.3, { sy: .9, ed: .6 }); P(38.55, { sy: 1 });
P(38.5, { yaw: -.4 }); P(38.75, { yaw: -Math.PI / 2 });
P(38.75, { x: -4.55, wr: 0, wamt: 0 }); P(38.85, { wr: 5, wamt: 1 }); P(40, { x: -5.75, wr: 5, wamt: 1 }, 'lin');
// mustache: aparece cuando la cara está en el plato
P(SPLAT + .2, { must: 0 }); P(SPLAT + .21, { must: 1 });

// ---------------- PLANO 2 (5–12): ojos de plato y sartén ----------------
MMODE.at(5.0, 'full');
KM(5.0, { x: 3.4, z: -.6, yaw: -1.1, wr: 2.1, wamt: 1, lid: .45, tw: 1 }); KM(5.85, { wr: 2.1, wamt: 1 }); KM(6.0, { x: 1.45, z: .4, wr: 0, wamt: 0 }, 'o');
KM(5.7, { sn: 0, hp: 0, lid: .45, y: 0, sy: 1 }); KM(5.9, { sn: 1, hp: -.3, lid: .95, y: .06, sy: 1.05 }); KM(6.12, { sn: 1 }); KM(6.16, { sn: 0, lid: 0 });
KM(6.12, { hy: 0, yaw: -1.1 }); KM(6.24, { hy: -.5, yaw: -.75 }, 'o');
KM(6.2, { eb: 1, pd: 1, sp: 0, sy: 1.05 }); KM(6.5, { eb: 1.9, pd: 1.75, sp: 1, sy: 1.14, lx: -.35 }, 'back'); KM(6.7, { sy: 1, y: 0 });
KM(6.6, { hp: -.3, ly: 0 }); KM(6.95, { hp: -.42, hy: -.2, ly: .5, lx: -.1 });
KM(6.6, { aLf: .15, aLo: .22, aRf: .15, aRo: .22 }); KM(6.95, { aLf: 2.15, aLo: -.5, aRf: 2.15, aRo: -.5 }, 'back');
KM(7.0, { wg: 0, tw: 1 }); KM(7.3, { wg: 1, tw: 3 }); KM(8.9, { tw: 3 }); KM(9.6, { tw: 1.3 });
KM(7.3, { tg: 0, mo: 0, lk: 0 }); KM(7.5, { tg: .75, mo: .35, lk: 1 }); KM(8.4, { tg: .75, lk: 1 }); KM(8.6, { tg: 0, lk: 0, mo: 0 });
KM(8.85, { eb: 1.9, pd: 1.75, sp: 1, wg: 1, hp: -.42, hy: -.2, ly: .5, aLf: 2.15, aRf: 2.15, aLo: -.5, aRo: -.5 });
KM(9.0, { eb: 1.2, pd: 1, sp: 0, wg: 0, hp: 0, hy: 0, ly: 0, lx: .3, br: 1, brA: 1, mo: .3, aLf: .3, aRf: .3, aLo: .3, aRo: .3 }, 'o');
KM(9.05, { yaw: -.75 }); KM(9.16, { yaw: 1.35 }, 'o');
KM(9.16, { lean: 0, sy: 1, sx: 1, sz: 1 }); KM(9.4, { lean: -.4, sy: .8, sx: 1.12, aLf: -.7, aRf: -.7 }, 'o');
KM(9.42, { x: 1.45 }); KM(9.6, { x: 10, sz: 1.9, sy: .82, sx: .82, lean: .45 }, 'i');
MMODE.at(9.62, 'hidden');
// arrastra la sartén (camina hacia atrás tirando del mango)
const DRAG0 = 10.05, DRAG1 = 12.0, X0 = 6.6, X1 = -1.3;
MMODE.at(DRAG0 - .05, 'full');
KM(9.9, { x: 10, z: .4 }); KM(9.95, { x: X0, z: PANZ, yaw: Math.PI / 2, lean: 0, sz: 1, sx: 1, sy: 1, br: 1, brA: 1.2, lid: .55, mo: .2, tg: .4, tu: -.6, lx: 0, eb: 1, aLf: 1.15, aRf: 1.15, aLo: -.55, aRo: -.55, hp: .1 });
{
  const n = 5, dt = (DRAG1 - DRAG0) / n;
  for (let k = 0; k < n; k++) {
    const t0 = DRAG0 + k * dt, xa = lerp(X0, X1, k / n), xb = lerp(X0, X1, (k + 1) / n);
    KM(t0, { x: xa, lean: .12, sy: .92, wr: 0, wamt: 0 }); KM(t0 + dt * .55, { x: xb, lean: -.42, sy: 1.05, wr: 3.5, wamt: 1 }, 'o'); KM(t0 + dt * .62, { wr: 0, wamt: 0 }); KM(t0 + dt * .99, { lean: .12, sy: .92 }, 'io');
  }
}
PN.key(DRAG0 - .1, { x: X0 + REACH });
// ---------------- PLANO 3 (12–18): voltear… y PLAF ----------------
const FLIP = 12.68, LAND = 15.2;
KM(12.0, { x: X1, lean: .12, sy: .92, sx: 1, br: 1, brA: 1.2, lid: .3, mo: 0, tg: 0, tu: 0, aLf: 1.15, aRf: 1.15, aLo: -.55, aRo: -.55, hp: .1, eb: 1, ly: -.2 });
KM(12.42, { sy: .74, sx: 1.16, lean: .3, hp: .2 }, 'io');
KM(12.66, { sy: 1.25, sx: .88, lean: -.35, aLf: 2.5, aRf: 2.5, aLo: -.2, aRo: -.2, hp: -.2 }, 'o');
KM(12.9, { lid: 0, sy: 1, sx: 1, lean: 0, hp: -.7, ly: .5, eb: 1.3, br: 0, mo: .6, aLf: 2.8, aRf: 2.8, aLo: .5, aRo: .5 }, 'o');
KM(13.1, { x: X1, z: PANZ, yaw: Math.PI / 2, wr: 0, wamt: 0 }); KM(13.2, { wr: 3.4, wamt: 1 }); KM(13.6, { yaw: .3 }); KM(14.0, { x: CATCH.x + .35, z: CATCH.z, wr: 3.4, wamt: 1 }, 'io');
KM(13.2, { aLf: 2.8, aRf: 2.8 }); KM(13.6, { aLf: .7, aRf: .7, aLo: 1.0, aRo: 1.0 });
KM(14.0, { mo: .6, tg: 0 }); KM(14.3, { mo: 1.75, tg: .35, tu: .2, eb: 1.35 }, 'back');
KM(14.25, { x: CATCH.x + .35 }); KM(14.5, { x: CATCH.x - .35 }, 'io'); KM(14.75, { x: CATCH.x + .2 }, 'io'); KM(15.0, { x: CATCH.x, wr: 3.4, wamt: 1 }, 'io'); KM(15.08, { wr: 0, wamt: 0 });
KM(14.9, { sy: 1, hp: -.7 }); KM(15.15, { sy: 1.12, hp: -.8 });
MMODE.at(LAND + .02, 'blanket');
KM(LAND + .02, { lid: 0, lk: 0, sn: 0, sy: 1, sx: 1, mo: 0, tg: 0, eb: 1, hp: 0, ly: 0, lx: 0, x: CATCH.x, z: CATCH.z, yaw: 0, lean: 0, wr: 0, wamt: 0 });
GMODE.at(12.0, 'pan').at(FLIP, 'fly').at(LAND, 'drape').at(22.5, 'hidden');
GP.key(LAND, { dr: 0, hd: 2.9, ears: 0 }); GP.key(LAND + .1, { dr: 1, hd: 2.3 }, 'o'); GP.key(LAND + .3, { hd: 1.55, ears: 1 }, 'back');
GP.key(15.6, { bulge: 0, bx: .3, by: 1.2, bz: .5 }); GP.key(15.8, { bulge: .25, bx: .3 }); GP.key(16.0, { bulge: .05, bx: -.4 }); GP.key(16.2, { bulge: .22, bx: -.3, by: .9 }); GP.key(16.45, { bulge: 0 });
PN.key(12.45, { tilt: 0 }); PN.key(12.66, { tilt: -.42 }, 'o'); PN.key(12.8, { tilt: -.42 }); PN.key(13.05, { tilt: 0 }, 'i'); PN.key(13.25, { tilt: -.06 }, 'o'); PN.key(13.4, { tilt: 0 }, 'i');
BMODE.at(12.0, 'pan').at(FLIP, 'fly1').at(16.5, 'drop').at(17.1, 'slide').at(22.5, 'burrito').at(26.2, 'fly2').at(SPLAT, 'splat').at(SPLAT + .2, 'hidden');
// ---------------- PLANO 4 (18–25): la mantequilla resbala ----------------
const LUNGE = 22.35;
GP.key(18.2, { lift: 0 }); GP.key(18.6, { lift: 1 }, 'back');
KM(18.1, { pk: 0, hs: .82, eb: 1, ly: .2 }); KM(18.45, { pk: 1, ly: .55, lx: -.05 }, 'o');
BU.key(17.1, { s: .02 }); BU.key(18.9, { s: .03 }); BU.key(19.7, { s: .45 }, 'io'); BU.key(20.1, { s: .5 }); BU.key(21.1, { s: 1.25 }, 'io'); BU.key(21.4, { s: 1.3 }); BU.key(22.0, { s: 1.62 }, 'io');
KM(19.0, { ly: .55, eb: 1, pd: 1 }); KM(21.9, { ly: .25, eb: 1.3, pd: 1.4, mo: .15 }); KM(22.02, { eb: 1.75, pd: .7, mo: .5 }, 'back');
KM(20.3, { tg: 0, lk: 0 }); KM(LUNGE, { lid: 0 }); KM(20.6, { tg: .45, tu: .5, lk: .4 }); KM(21.4, { tg: .45 }); KM(21.6, { tg: 0, lk: 0 });
GP.key(22.0, { bulge: 0, bx: 0, by: .9, bz: .8 }); GP.key(22.25, { bulge: .35 });
GP.key(LUNGE - .05, { hd: 1.55 }); GP.key(LUNGE + .08, { hd: 2.2, lift: 1 }, 'o');
MMODE.at(LUNGE + .15, 'burrito');
const BLAND = 22.85, BSTOP = 23.45;
BR.key(LUNGE + .15, { x: CATCH.x, y: RB + .9, z: CATCH.z, spin: -2 * TAU - .45 });
BR.key(LUNGE + .32, { y: RB + 1.6 }, 'oq'); BR.key(BLAND, { y: RB }, 'iq'); BR.key(BLAND, { x: -1.6, z: BZ }, 'lin');
BR.key(BLAND, { spin: -.4 }, 'lin');
BR.key(BLAND, { sy: 1, sx: 1 }); BR.key(BLAND + .06, { sy: .8, sx: 1.15 }, 'o'); BR.key(BLAND + .25, { sy: 1, sx: 1 }, 'back');
BR.key(BSTOP, { x: BX, spin: 0 }, 'o');
BR.key(BSTOP + .2, { spin: -.12 }, 'io'); BR.key(BSTOP + .45, { spin: .05 }, 'io'); BR.key(BSTOP + .65, { spin: 0 }, 'io');
KM(LUNGE + .15, { pk: 1, hs: .8, eb: 1, pd: 1, mo: .2, lid: .5, ly: 0, lx: 0 }); KM(BSTOP + .7, { lid: .5, mo: .2 }); KM(BSTOP + .9, { lid: 0, mo: 0 });
KM(24.0, { ly: 0, hp: 0, sn: 0 }); KM(24.3, { ly: .7, hp: -.15, sn: 1 }); KM(24.5, { sn: 0 }); KM(24.5, { tg: 0, mo: 0 }); KM(24.7, { tg: 1, tu: 1.0, mo: .35, lk: 0 });
// ---------------- PLANO 5 (25–32): cámara lenta ----------------
const SHOOT = 26.2;
BR.key(25.0, { spin: 0, sx: 1, sy: 1 });
for (let i = 0; i < 4; i++) { const t0 = 25.0 + i * .25; BR.key(t0 + .12, { spin: (i % 2 ? -1 : 1) * .2, sx: 1.06, sy: .95 }, 'io'); BR.key(t0 + .25, { spin: 0, sx: 1, sy: 1 }, 'io'); }
BR.key(25.95, { sx: 1, sy: 1 }); BR.key(SHOOT, { sx: .8, sy: 1.22 }, 'i'); BR.key(SHOOT + .2, { sx: 1.08, sy: .92 }, 'o'); BR.key(SHOOT + .7, { sx: 1, sy: 1 }, 'back');
KM(25.0, { tg: 1, tu: 1, mo: .35, ly: .7, hp: -.15, hr: 0, eb: 1 }); KM(25.5, { hr: .15 }); KM(25.75, { hr: -.15 }); KM(25.95, { hr: 0, tg: .6 });
KM(SHOOT, { eb: 1, mo: .35, tg: .6 }); KM(SHOOT + .25, { eb: 1.55, pd: .8, mo: .9, tg: 0, ly: .8, lx: -.3 }, 'o');
KM(SHOOT + 2.5, { ly: .2, lx: -.8 }, 'io');
KM(SPLAT, { eb: 1.55, mo: .9 }); KM(SPLAT + .3, { eb: 1.2, mo: .6, ly: 0, lx: -.8 });
// ---------------- PLANO 6 (32–40): Mochi lame su burrito ----------------
KM(32.0, { lid: 0, mo: .5, tg: 0, lk: 0, eb: 1.1, lx: -.8, ly: 0, hp: 0, hr: 0, pd: 1 });
KM(34.6, { lid: 0, mo: .5, tg: 0 }); KM(35.0, { lid: .92, mo: .55, tg: 1, tu: .2, lk: 1, lx: 0, eb: 1 });
// ---------------- burbuja ----------------
BB.key(6.7, { k: 0 }); BB.key(7.25, { k: 1 }); BB.key(8.85, { k: 1 }); BB.key(8.95, { k: 1.15 }, 'o'); BB.key(9.0, { k: 0 });

// ---------- cámaras (una por plano; los cortes son secos) ----------
const CAMS = [0, 1, 2, 3, 4, 5].map(() => new Rig({ tx: 0, ty: 1, tz: 0, d: 8, yw: 0, pt: .1, fov: 30, fw: 0, sh: 0 }));
const OPEN = { tx: PL.x + .02, ty: .2, tz: PL.z, d: 2.65, yw: .12, pt: .24 };
// 1
CAMS[0].key(0, OPEN).key(1.25, { ...OPEN, d: 2.5 }, 'io').key(2.5, { tx: -4.32, ty: .3, tz: 1.2, d: 4.1, yw: .06, pt: .16 }, 'io').key(5, { tx: -4.3, ty: .3, tz: 1.2, d: 3.8, yw: .1, pt: .16 }, 'io');
// 2
CAMS[1].key(5, { tx: 2.3, ty: 1.75, tz: -.2, d: 9.6, yw: -.22, pt: .05 }).key(6.2, { tx: 1.5, ty: 1.85, tz: .4, d: 9.0, yw: -.25, pt: .05 }, 'io')
  .key(6.7, { tx: 1.25, ty: 3.4, tz: .4, d: 12.6, yw: -.22, pt: .06 }, 'io').key(9.0, { tx: 1.2, ty: 3.35, tz: .4, d: 12.2, yw: -.25, pt: .06 }, 'io')
  .key(9.4, { tx: 1.6, ty: 1.85, tz: .4, d: 10.2, yw: -.22, pt: .05 }, 'io').key(9.95, { tx: 1.6, ty: 1.85, tz: .4, d: 10.2, yw: -.22, pt: .05 })
  .key(9.951, { tx: 3.6, ty: 1.7, tz: -2.2, d: 16.5, yw: .5, pt: .1 }).key(12, { tx: 1.3, ty: 1.7, tz: -2.0, d: 16, yw: .5, pt: .1 }, 'io');
// 3
CAMS[2].key(12, { tx: .7, ty: 1.9, tz: -2.0, d: 15.5, yw: .45, pt: .1 }).key(12.7, { tx: .8, ty: 2.0, tz: -2.0, d: 15.5, yw: .45, pt: .1 })
  .key(13.7, { tx: 1.0, ty: 5.0, tz: -1.2, d: 18.5, yw: .4, pt: .08 }, 'io').key(14.7, { tx: -.2, ty: 2.3, tz: .0, d: 12.5, yw: .3, pt: .1 }, 'io')
  .key(15.6, { tx: -.15, ty: 1.4, tz: .3, d: 10.5, yw: .2, pt: .14 }, 'io').key(18, { tx: -.25, ty: 1.2, tz: .4, d: 9.4, yw: .12, pt: .15 }, 'io');
CAMS[2].key(LAND, { sh: 0 }).key(LAND + .02, { sh: 1 }).key(LAND + .4, { sh: 0 });
// 4
CAMS[3].key(18, { tx: -.6, ty: .95, tz: .5, d: 7.2, yw: -.2, pt: .14 }).key(21.9, { tx: -.6, ty: .85, tz: .6, d: 5.6, yw: -.12, pt: .12 }, 'io')
  .key(22.08, { tx: -.6, ty: .7, tz: 1.0, d: 5.8, yw: -.1, pt: .08 }, 'o').key(LUNGE + .1, { tx: -.6, ty: .7, tz: 1.0, d: 5.6, yw: -.1, pt: .08 })
  .key(LUNGE + .45, { tx: -1.3, ty: 1.4, tz: .3, d: 8.2, yw: .0, pt: .12 }, 'o').key(BSTOP + .4, { tx: -1.9, ty: 1.15, tz: .3, d: 7.2, yw: .12, pt: .12 }, 'io')
  .key(25, { tx: -2.0, ty: 1.2, tz: .3, d: 6.6, yw: .16, pt: .12 }, 'io');
CAMS[3].key(BLAND, { sh: 0 }).key(BLAND + .02, { sh: .7 }).key(BLAND + .35, { sh: 0 });
// 5
CAMS[4].key(25, { tx: -2.0, ty: 1.45, tz: .4, d: 6.4, yw: .32, pt: .1 }).key(SHOOT, { tx: -2.0, ty: 1.45, tz: .4, d: 6.0, yw: .3, pt: .1 }, 'io')
  .key(SHOOT + .1, { fw: 0 }).key(SHOOT + .8, { fw: 1, d: 4.6, yw: .15, pt: .12 }, 'io').key(SPLAT - .4, { fw: 1, d: 4.7, yw: -.05, pt: .2 }, 'io')
  .key(SPLAT, { fw: .5, tx: -4.25, ty: .28, tz: 1.2, d: 3.7, yw: .05, pt: .24 }, 'io').key(SPLAT + .3, { fw: 0 }, 'o').key(32, { tx: -4.15, ty: .22, tz: 1.2, d: 2.9, yw: .18, pt: .3 }, 'io');
CAMS[4].key(SPLAT, { sh: 0 }).key(SPLAT + .02, { sh: .8 }).key(SPLAT + .45, { sh: 0 });
// 6
const TWO = { tx: -3.25, ty: .78, tz: .95, d: 6.6, yw: -1.0, pt: .08 };
CAMS[5].key(32, { tx: -4.45, ty: .42, tz: 1.2, d: 2.75, yw: .18, pt: .1 }).key(34.6, { tx: -4.45, ty: .44, tz: 1.2, d: 2.55, yw: .15, pt: .1 }, 'io')
  .key(35.9, TWO, 'io').key(38.6, { ...TWO, d: 8.2 }, 'io').key(40, OPEN, 'io');
for (const r of [MO, PI_, PN, GP, BU, BR, BB, ...CAMS]) r.done();

// ---------- estado ----------
function mochiState(t) {
  const s = {}; for (const k in MO.d) s[k] = MO.val(k, t);
  s.walk = MO.integ('wr', t); s.mode = MMODE.get(t);
  s.roll += Math.sin(t * 14) * .07 * s.wg;
  if (s.wg > 0) s.y += Math.abs(Math.sin(t * 14)) * .04 * s.wg;
  if (s.mode === 'full') s.sy *= 1 + Math.sin(t * 3.2) * .012;
  return s;
}
function pipState(t) { const s = {}; for (const k in PI_.d) s[k] = PI_.val(k, t); s.walk = PI_.integ('wr', t); s.sy *= 1 + Math.sin(t * 4.1) * .015; return s; }
function panX(t) { return t < DRAG1 + .01 && t > DRAG0 - .2 ? mochiState(t).x + REACH : (t >= DRAG1 ? X1 + REACH : 14); }

// trayectoria de la tortita gigante en vuelo (parábola) — devuelve {pos, rot, flop}
const LAUNCH = () => V3(X1 + REACH, .2, PANZ);
function flightAt(t) {
  const T = LAND - FLIP, u = clamp((t - FLIP) / T), p0 = LAUNCH(), p1 = V3(CATCH.x, 2.9, CATCH.z);
  const pos = V3(lerp(p0.x, p1.x, u), lerp(p0.y, p1.y, u) + 4 * 7.4 * u * (1 - u), lerp(p0.z, p1.z, u));
  return { pos, rot: 2 * TAU * E.io(u), flop: Math.sin(u * Math.PI * 7) * .35 * Math.sin(u * Math.PI) };
}
// mantequilla en vuelo hacia el plato (cámara lenta)
const B_FROM = () => V3(BX + Math.sin(BYAW) * .35, 2 * RB + .1, BZ + Math.cos(BYAW) * .35), B_TO = () => V3(PL.x + .01, .19, PL.z);
function butterU(t) {   // tiempo deformado: arranque rápido, tramo lento, final rápido
  const a = SHOOT, b = SPLAT;
  if (t < a + .18) return lerp(0, .1, seg(t, a, a + .18));
  if (t < b - .2) return lerp(.1, .9, seg(t, a + .18, b - .2));
  return lerp(.9, 1, seg(t, b - .2, b));
}
function butterFly(t) { const u = butterU(t), p0 = B_FROM(), p1 = B_TO(); return V3(lerp(p0.x, p1.x, u), lerp(p0.y, p1.y, u) + 4 * 2.2 * u * (1 - u), lerp(p0.z, p1.z, u)); }

// =====================================================================
//  FOTOGRAMA
// =====================================================================
const _v = V3(), _n = V3(), _q = new THREE.Quaternion(), UP = V3(0, 1, 0);
function render(t) {
  resetFx(); for (const p of [steamP, puffP, sparkP, dropP, motes]) p.reset();
  const shot = shotOf(t);
  const ms = mochiState(t), ps = pipState(t);
  const gmode = GMODE.get(t), bmode = BMODE.get(t), mmode = ms.mode;

  // ---- Pip ----
  setPip(pip, ps, t);

  // ---- sartén ----
  pan.visible = t > DRAG0 - .2 && shot >= 1;
  pan.position.set(panX(t), 0, PANZ);
  panTilt.rotation.z = PN.val('tilt', t);
  if (t > DRAG0 && t < DRAG1) pan.rotation.y = Math.sin(t * 9) * .02; else pan.rotation.y = 0;

  // ---- tortita gigante ----
  giant.mesh.visible = gmode !== 'hidden';
  const gp = { dr: 0, a: GP.val('a', t), hd: GP.val('hd', t), ears: GP.val('ears', t), lift: GP.val('lift', t), bulge: GP.val('bulge', t), bx: GP.val('bx', t), by: GP.val('by', t), bz: GP.val('bz', t) };
  if (gmode === 'pan') {
    giant.mesh.position.set(X1 + REACH, .16, PANZ); giant.mesh.rotation.set(0, 0, 0);
    // la sartén se inclina: la tortita va con ella
    pan.updateMatrixWorld(true);
    const m4 = new THREE.Matrix4().copy(panIn.matrixWorld); giant.mesh.position.set(0, .16, 0).applyMatrix4(m4); giant.mesh.quaternion.setFromRotationMatrix(m4);
    updateSheet(giant, { dr: 0, Y0: 0, flop: Math.sin(t * 3) * .02 });
  } else if (gmode === 'fly') {
    const f = flightAt(t); giant.mesh.position.copy(f.pos); giant.mesh.rotation.set(0, 0, f.rot);
    updateSheet(giant, { dr: 0, Y0: 0, flop: f.flop, flopPh: t * 2 });
  } else if (gmode === 'drape') {
    let cx = CATCH.x, cz = CATCH.z, yy = 0;
    if (t > LUNGE - .05) { const k = seg(t, LUNGE - .05, LUNGE + .15); cx = lerp(CATCH.x, CATCH.x - .4, k); yy = Math.sin(k * Math.PI) * .5; }
    giant.mesh.position.set(cx, yy, cz); giant.mesh.rotation.set(0, 0, 0);
    gp.dr = GP.val('dr', t); gp.Y0 = 2.9; updateSheet(giant, gp);
  }

  // ---- Mochi ----
  const msS = { ...ms };
  if (mmode === 'blanket') { msS.x = CATCH.x; msS.z = CATCH.z + .82; msS.y = .3; msS.yaw = 0; msS.lean = 0; msS.roll = 0; msS.sx = msS.sy = msS.sz = 1; msS.y -= (1 - ms.pk) * .5; }
  burr.visible = mmode === 'burrito' && t >= LUNGE + .15;
  let bstate = null;
  if (burr.visible) {
    bstate = { x: BR.val('x', t), y: BR.val('y', t), z: BR.val('z', t), spin: BR.val('spin', t), sx: BR.val('sx', t), sy: BR.val('sy', t) };
    if (t > 32 && t < 40) { bstate.spin += Math.sin(t * 2.4) * .03; }
    burr.position.set(bstate.x, bstate.y * bstate.sy, bstate.z);
    bsq.scale.set(bstate.sx, bstate.sy, 1);
    bspin.rotation.z = bstate.spin;
    burrPaws.forEach(p => { const s = p.userData.s; const wig = t > 32 ? Math.sin(t * 5 + s) * .04 : Math.sin(t * 9 + s) * .03; p.position.set(s * .34, -.48 + wig, BL / 2 + .06); });
    msS.x = bstate.x + Math.sin(BYAW) * (BL / 2 - .22); msS.y = bstate.y * bstate.sy + .02; msS.z = bstate.z + Math.cos(BYAW) * (BL / 2 - .22); msS.yaw = BYAW; msS.lean = 0; msS.roll = bstate.spin; msS.sx = msS.sy = msS.sz = 1;
  }
  setMochi(mochi, msS, t);
  scene.updateMatrixWorld(true);
  // cola que asoma por debajo de la manta
  const hemOn = mmode === 'blanket' && t > 15.75;
  mochi.hemTail.visible = mochi.hemTip.visible = hemOn;
  if (hemOn) {
    const k = easeOutBack(seg(t, 15.75, 16.05)), w = Math.sin(t * 7) * .25 + (t > 22 ? Math.sin(t * 30) * .15 : 0), bx = CATCH.x + 1.15, bz = CATCH.z - .55;
    tubeAlong(mochi.hemTail, mochi.hemTip, [V3(bx - .2, .1, bz + .05), V3(bx + .25 * k, .14, bz - .05), V3(bx + .6 * k, .35 * k + .1, bz - .15 + w * .3), V3(bx + .7 * k + w * .2, .85 * k + .12, bz - .2 + w * .4)], .12);
  }

  // ---- mantequilla grande ----
  bigButter.visible = !['hidden', 'gone'].includes(bmode); splat.visible = false;
  butterTrail.forEach(m => m.visible = false);
  if (bmode === 'pan' || bmode === 'fly1') {
    giant.mesh.updateMatrixWorld(true);
    const lift = bmode === 'fly1' ? Math.max(0, t - (FLIP + .25)) : 0;
    if (lift > 0) { const f = flightAt(FLIP + .25); bigButter.position.set(f.pos.x, f.pos.y + lift * 9, f.pos.z); bigButter.rotation.set(t * 4, t * 3, 0); if (t > 13.4) bigButter.visible = false; }
    else { bigButter.position.set(.35, GPT + .07, .3).applyMatrix4(giant.mesh.matrixWorld); bigButter.quaternion.copy(giant.mesh.quaternion); bigButter.rotateY(.5); }
  } else if (bmode === 'drop') {
    const u = seg(t, 16.5, 16.92), top = 1.55 + GPT + .07;
    bigButter.position.set(CATCH.x + .02, lerp(9, top, E.iq(u)), CATCH.z + .02); bigButter.rotation.set((1 - u) * 2, .4, (1 - u) * 1.2);
    bigButter.scale.set(1, 1, 1);
    if (t > 16.92) { const b = seg(t, 16.92, 17.1); bigButter.position.y = top + Math.sin(b * Math.PI) * .25; bigButter.scale.set(1 + .25 * Math.sin(seg(t, 16.92, 16.98) * Math.PI), 1 - .3 * Math.sin(seg(t, 16.92, 16.98) * Math.PI), 1); bigButter.rotation.set(0, .4, 0); }
  } else if (bmode === 'slide') {
    const sArc = BU.val('s', t), phB = Math.PI / 2 + .22, hd = GP.val('hd', t);
    drapeSurface(sArc, phB, GP.val('a', t), hd, _v, _n);
    _v.y += .07; _v.x += CATCH.x; _v.z += CATCH.z;
    bigButter.position.copy(_v).addScaledVector(_n, .0);
    _q.setFromUnitVectors(UP, _n); bigButter.quaternion.copy(_q); bigButter.rotateY(.4); bigButter.scale.set(1, 1 - Math.sin(t * 5) * .03, 1);
    if (t > LUNGE) bigButter.visible = false;
    // rastro brillante
    butterTrail.forEach((m, i) => {
      const s2 = sArc - (i + 1) * .09; if (s2 < .05 || t < 19) return;
      drapeSurface(s2, phB, GP.val('a', t), hd, _v, _n); m.visible = true; m.position.set(_v.x + CATCH.x, _v.y + .005, _v.z + CATCH.z);
      _q.setFromUnitVectors(UP, _n); m.quaternion.copy(_q); m.scale.set(.09 - i * .006, .012, .07 - i * .005);
    });
  } else if (bmode === 'burrito') {
    if (!burr.visible) bigButter.visible = false;
    else { bigButter.position.set(0, RB + .06, .35).applyMatrix4(bspin.matrixWorld); bigButter.quaternion.setFromRotationMatrix(bspin.matrixWorld); bigButter.rotateY(.35); const j = t > 25 && t < SHOOT ? Math.sin(t * 30) * .04 : 0; bigButter.scale.set(1 + j, 1 - j, 1); }
  } else if (bmode === 'fly2') {
    const p = butterFly(t); bigButter.position.copy(p); bigButter.rotation.set((t - SHOOT) * 1.6, (t - SHOOT) * 1.1, (t - SHOOT) * .7); bigButter.scale.setScalar(1);
    // estela a cámara lenta
    butterTrail.forEach((m, i) => { if (i > 5) return; const q = butterFly(t - (i + 1) * .06); m.visible = true; m.position.copy(q); m.scale.setScalar(.06 - i * .008); });
  } else if (bmode === 'splat') {
    bigButter.visible = false; splat.visible = true;
    const k = seg(t, SPLAT, SPLAT + .08);
    splat.position.set(PL.x, .155, PL.z); splat.scale.set(lerp(.6, 1.1, k), lerp(2.2, 1, k), lerp(.6, 1.1, k));
  }

  // ---- burbuja de pensamiento ----
  const bk = BB.val('k', t);
  bubble.visible = bk > .01;
  const headW = mochi.head.getWorldPosition(V3());
  if (bubble.visible) {
    bubble.position.set(headW.x - .35, headW.y + 2.45 + Math.sin(t * 2) * .08, headW.z - .2); bubble.scale.setScalar(Math.max(.001, bk) * 1.05);
    bubble.rotation.y = .22; stack.rotation.y = t * .8; stack.position.y = -.95 + Math.sin(t * 2.6) * .06;
  }
  smallB.forEach((m, i) => { const st = 6.7 + i * .15, k = easeOutBack(seg(t, st, st + .2)) * (t < 9.0 ? 1 : 0); m.visible = k > .01; m.position.set(headW.x - .2 - i * .25, headW.y + 1.05 + i * .45, headW.z); m.scale.setScalar(Math.max(.001, k) * (.12 + i * .07)); });
  if (t > 8.95 && t < 9.4) { const k = seg(t, 8.95, 9.4); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, sp = puffP.next(); sp.position.set(headW.x - .35 + Math.cos(a) * (1.2 + k * 1.2), headW.y + 2.45 + Math.sin(a) * (1.1 + k * 1.1), headW.z); sp.scale.setScalar(.9 * (1 - k) + .2); sp.material.opacity = (1 - k) * .9; } }

  // ---- efectos ----
  // vapor de la tortita de Pip (periódico: bucle perfecto)
  if (!(t > SPLAT + .15 && t < 33.2)) for (let i = 0; i < 8; i++) {
    const ph = ((t / 2.5) + i / 8) % 1, sp = steamP.next();
    sp.position.set(PL.x + Math.sin(ph * 6 + i * 2.1) * .05 * (1 + ph * 2), .16 + ph * .75, PL.z + Math.cos(ph * 5 + i) * .03);
    sp.scale.setScalar(.09 + ph * .26); sp.material.opacity = Math.sin(ph * Math.PI) ** 1.5 * .32;
  }
  // vapor de la tortita gigante en la sartén
  if (gmode === 'pan') for (let i = 0; i < 10; i++) {
    const ph = ((t / 1.8) + i / 10) % 1, sp = steamP.next();
    sp.position.set(X1 + REACH + Math.cos(i * 2.4) * 1.3 + Math.sin(ph * 5 + i) * .2, .4 + ph * 2.4, PANZ + Math.sin(i * 2.4) * 1.3);
    sp.scale.setScalar(.5 + ph * 1.2); sp.material.opacity = Math.sin(ph * Math.PI) * .3;
  }
  // motas de polvo en la luz
  for (let i = 0; i < 22; i++) {
    const ph = (t * .05 + i / 22) % 1, sp = motes.next();
    sp.position.set(-6 + rnd(i) * 10 + Math.sin(ph * TAU * 2 + i) * .3, .5 + ((rnd(i + 7) + ph * .4) % 1) * 6, -3 + rnd(i + 3) * 6);
    sp.scale.setScalar(.05 + rnd(i + 11) * .05); sp.material.opacity = Math.sin(ph * Math.PI) * .7;
  }
  // brillo de orgullo en la tortita (plano 1)
  if (t > 2.9 && t < 4.9) for (let i = 0; i < 3; i++) { const ph = ((t - 2.9) * .9 + i / 3) % 1, sp = sparkP.next(); sp.position.set(PL.x + Math.cos(i * 2.1) * .2, .22 + Math.sin(i * 1.7) * .1 + .1, PL.z + .15); sp.scale.setScalar(Math.sin(ph * Math.PI) * .16); sp.material.opacity = .95; sp.material.rotation = t * 2; }
  // ojos de plato con destellos
  if (ms.sp > .02 && mmode === 'full') for (const e of mochi.eyes) {
    const p = e.es.localToWorld(V3(-.25, .3, 1.05));
    for (let i = 0; i < 2; i++) { const sp = sparkP.next(); sp.position.copy(p).add(V3(i * .12 * e.s, -i * .14, .02)); const pulse = .5 + .5 * Math.sin(t * 14 + i * 2 + e.s); sp.scale.setScalar(ms.sp * (i ? .22 : .42) * (.75 + .35 * pulse)); sp.material.opacity = 1; sp.material.rotation = t * 3 * e.s; }
  }
  // babas de ilusión (gotitas de brillo alrededor de la cabeza)
  if (t > 6.5 && t < 8.9) for (let i = 0; i < 6; i++) { const ph = ((t - 6.5) * .8 + i / 6) % 1, sp = sparkP.next(); const a = i / 6 * TAU + t * .5; sp.position.set(headW.x + Math.cos(a) * 1.4, headW.y + Math.sin(a) * 1.1 + .3, headW.z + .3); sp.scale.setScalar(Math.sin(ph * Math.PI) * .3); sp.material.opacity = 1; }
  // polvo al salir disparado
  if (t > 9.4 && t < 10.0) for (let i = 0; i < 10; i++) { const st = 9.42 + i * .016, k = seg(t, st, st + .55); if (k <= 0) continue; const sp = puffP.next(); sp.position.set(1.45 + i * .45, .25 + k * .3 + rnd(i) * .3, .4 + (rnd(i + 3) - .5) * .6); sp.scale.setScalar(.35 + k * .6); sp.material.opacity = (1 - k) * .85; }
  // polvo al arrastrar la sartén
  if (t > DRAG0 && t < DRAG1 + .3) for (let i = 0; i < 8; i++) { const ph = ((t * 1.7) + i / 8) % 1, sp = puffP.next(); const px = panX(t) + PAN_R * .9 + ph * .8; sp.position.set(px, .15 + ph * .4, PANZ + (rnd(i) - .5) * 3.6); sp.scale.setScalar(.3 + ph * .5); sp.material.opacity = (1 - ph) * .5 * (t < DRAG1 ? 1 : 1 - seg(t, DRAG1, DRAG1 + .3)); }
  // ¡PLAF! nube al caer la tortita
  if (t > LAND && t < LAND + .8) { const k = seg(t, LAND + .05, LAND + .8); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, sp = puffP.next(); sp.position.set(CATCH.x + Math.cos(a) * (1.4 + k * 1.3), .15 + k * .25, CATCH.z + Math.sin(a) * (1.3 + k * 1.2)); sp.scale.setScalar(.45 + k * .6); sp.material.opacity = (1 - k) * .8; } }
  // golpe de la mantequilla al caer
  if (t > 16.92 && t < 17.3) { const k = seg(t, 16.92, 17.3); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU, sp = sparkP.next(); sp.position.set(CATCH.x + Math.cos(a) * (.2 + k * .5), 1.85 + Math.sin(a) * (.15 + k * .35), CATCH.z + .2); sp.scale.setScalar((1 - k) * .3); sp.material.opacity = 1; } }
  // nube de harina: la manta se convierte en burrito
  if (t > LUNGE && t < LUNGE + 1.0) { const k = seg(t, LUNGE, LUNGE + 1.0); for (let i = 0; i < 26; i++) { const a = i / 26 * TAU + rnd(i), r = .3 + rnd(i + 5) * 1.6 * (.4 + k), sp = puffP.next(); const cx = lerp(CATCH.x, -1.4, Math.min(1, k * 2)); sp.position.set(cx + Math.cos(a) * r, 1.2 + Math.sin(a) * r * .8 + k * .4, lerp(CATCH.z, BZ, k) + (rnd(i + 9) - .2) * .6); sp.scale.setScalar((.9 + rnd(i + 2) * .8) * (1 - k * .6)); sp.material.opacity = (1 - E.iq(k)) * .95; } }
  if (t > BLAND && t < BLAND + .6) { const k = seg(t, BLAND, BLAND + .6); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, sp = puffP.next(); sp.position.set(BR.val('x', t) + Math.cos(a) * (1 + k), .15 + k * .2, BZ + Math.sin(a) * (1.4 + k)); sp.scale.setScalar(.35 + k * .4); sp.material.opacity = (1 - k) * .7; } }
  // mareo tras rodar
  if (t > BSTOP - .1 && t < BSTOP + 1.0) { const k = seg(t, BSTOP - .1, BSTOP + 1.0); for (let i = 0; i < 4; i++) { const a = t * 6 + i / 4 * TAU, sp = sparkP.next(); sp.position.set(headW.x + Math.cos(a) * .7, headW.y + .8, headW.z + Math.sin(a) * .3); sp.scale.setScalar(.25 * (1 - k)); sp.material.opacity = 1; } }
  // gotitas de mantequilla en el SPLAT
  if (t > SPLAT && t < SPLAT + .9) { const k = seg(t, SPLAT, SPLAT + .9); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + rnd(i), v = .5 + rnd(i + 3) * .7, d = dropP.next(); d.position.set(PL.x + Math.cos(a) * v * k * 1.1, .18 + (2.4 * rnd(i + 7) + .6) * k - 4.5 * k * k, PL.z + Math.sin(a) * v * k * .8); if (d.position.y < .02) d.visible = false; d.scale.setScalar(.022 + rnd(i + 1) * .02); } }
  if (t > SPLAT && t < SPLAT + .5) { const k = seg(t, SPLAT, SPLAT + .5); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, sp = puffP.next(); sp.position.set(PL.x + Math.cos(a) * (.3 + k * .6), .1 + k * .1, PL.z + Math.sin(a) * (.3 + k * .5)); sp.scale.setScalar(.15 + k * .25); sp.material.opacity = (1 - k) * .4; } }
  // brillos a cámara lenta alrededor de la mantequilla
  if (bmode === 'fly2') { const p = bigButter.position; for (let i = 0; i < 5; i++) { const a = t * 2 + i / 5 * TAU, sp = sparkP.next(); sp.position.set(p.x + Math.cos(a) * .3, p.y + Math.sin(a) * .25, p.z + .1); sp.scale.setScalar(.12 + .06 * Math.sin(t * 5 + i)); sp.material.opacity = .9; } }
  // corazoncitos de felicidad al lamer (plano 6)
  if (t > 35.2 && t < 40) for (let i = 0; i < 3; i++) { const ph = ((t - 35.2) * .45 + i / 3) % 1, h = hearts.next(); h.position.set(headW.x + .45 + Math.sin(ph * 6 + i) * .3, headW.y + .55 + ph * 1.4, headW.z + .1); h.scale.setScalar(Math.sin(ph * Math.PI) * .55); h.rotation.y = Math.sin(t * 2 + i) * .5; }
  // sol que respira
  beams.forEach((b, i) => b.material.opacity = .16 + .05 * Math.sin(t * TAU / 10 + i * 1.7));

  // ---- cámara ----
  const C = CAMS[shot], c = {}; for (const k in C.d) c[k] = C.val(k, t);
  if (c.fw > 0 && bmode === 'fly2') { const p = bigButter.position; c.tx = lerp(c.tx, p.x, c.fw); c.ty = lerp(c.ty, p.y - .15, c.fw); c.tz = lerp(c.tz, p.z, c.fw); }
  else if (c.fw > 0 && shot === 4) { const p = B_TO(); c.tx = lerp(c.tx, p.x, c.fw); c.ty = lerp(c.ty, p.y, c.fw); c.tz = lerp(c.tz, p.z, c.fw); }
  if (c.sh > 0) { c.tx += Math.sin(t * 83) * .06 * c.sh * c.d / 6; c.ty += Math.cos(t * 71) * .06 * c.sh * c.d / 6; }
  camera.fov = c.fov; camera.updateProjectionMatrix();
  const cp = Math.cos(c.pt);
  camera.position.set(c.tx + c.d * Math.sin(c.yw) * cp, c.ty + c.d * Math.sin(c.pt), c.tz + c.d * Math.cos(c.yw) * cp);
  camera.lookAt(c.tx, c.ty, c.tz); camera.updateMatrixWorld();

  // ---- dos pasadas: fondo desenfocado + primer plano nítido ----
  const blur = clamp(6.5 / Math.max(1, c.d) * 4.2, 1.2, 9);
  octx.fillStyle = '#f5d9b6'; octx.fillRect(0, 0, W, H);
  camera.layers.set(1); scene.background = BG_COLOR; renderer.shadowMap.enabled = false;
  renderer.render(scene, camera);
  octx.filter = `blur(${blur.toFixed(1)}px)`; octx.drawImage(renderer.domElement, 0, 0); octx.filter = 'none';
  camera.layers.set(0); scene.background = null; renderer.setClearColor(0x000000, 0); renderer.shadowMap.enabled = true;
  renderer.render(scene, camera);
  octx.drawImage(renderer.domElement, 0, 0);

  // ---- acabado: líneas de velocidad, viñeta cálida, destello ----
  ctx.clearRect(0, 0, W, H);
  if (t > 9.42 && t < 9.75) {
    const a = 1 - seg(t, 9.6, 9.75); ctx.save(); ctx.globalAlpha = a * .8; ctx.strokeStyle = '#fff7ea'; ctx.lineCap = 'round';
    for (let i = 0; i < 9; i++) { const y = 1150 + (rnd(i) - .5) * 520, x0 = 200 + rnd(i + 3) * 300; ctx.lineWidth = 8 + rnd(i + 5) * 14; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 300 + rnd(i + 8) * 300, y); ctx.stroke(); }
    ctx.restore();
  }
  if (t > SHOOT + .15 && t < SPLAT) { const a = Math.min(1, seg(t, SHOOT + .15, SHOOT + .6)) * (1 - seg(t, SPLAT - .15, SPLAT)); const g = ctx.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .75); g.addColorStop(0, 'rgba(60,30,10,0)'); g.addColorStop(1, `rgba(60,30,10,${.35 * a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  const vg = ctx.createRadialGradient(W / 2, H * .48, H * .3, W / 2, H * .5, H * .78); vg.addColorStop(0, 'rgba(120,60,20,0)'); vg.addColorStop(1, 'rgba(120,60,20,.28)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createLinearGradient(0, 0, W, H * .6); glow.addColorStop(0, 'rgba(255,236,200,.16)'); glow.addColorStop(1, 'rgba(255,236,200,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  if (t > SPLAT && t < SPLAT + .06) { ctx.fillStyle = 'rgba(255,250,235,.55)'; ctx.fillRect(0, 0, W, H); }
  octx.drawImage(overlay, 0, 0);
}
startEpisode(render);
