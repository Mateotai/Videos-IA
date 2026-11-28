// =====================================================================
//  SALÓN DE NAVIDAD 3D (episodios 14+). Se carga después de kitchen3d.js (y chars_v2.js):
//  oculta la cocina y monta un salón de noche: chimenea con fuego, ventana con nieve,
//  árbol de Navidad (bolas, luces que parpadean, espumillón, estrella), regalos, calcetines.
//  Suelo y = 0; cámara mirando hacia -z. updateXmas(t) anima fuego, nieve y luces.
// =====================================================================
BG.visible = false; sunPatch.visible = false;
scene.children.forEach(o => { if (o.isMesh && o.material && o.material.map === counterTex) o.visible = false; });
const ROOM_BG = new THREE.Group(); scene.add(ROOM_BG);
// ---- luz de noche acogedora ----
for (const o of scene.children) if (o.isHemisphereLight) { o.color.set('#ffd6b0'); o.groundColor.set('#3b2a44'); o.intensity = .75; }
key.color.set('#ffcf9a'); key.intensity = 1.6; key.position.set(7, 9, 8); key.target.position.set(0, 1, -1.5);
Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -4, near: 1, far: 40 }); key.shadow.camera.updateProjectionMatrix();
rim.color.set('#8fb6ff'); rim.intensity = 1.0; rim.position.set(-8, 7, -7);
fill.color.set('#ffe2c4'); fill.intensity = .35;
scene.fog = null; BG_COLOR.set('#2a1d33');
const fireLight = new THREE.PointLight('#ff8a3a', 10, 9, 1.6); fireLight.position.set(2.8, .7, -3.6); scene.add(fireLight);
const treeLight = new THREE.PointLight('#ffcf7a', 5, 7, 1.6); scene.add(treeLight);
const treeLight2 = new THREE.PointLight('#ff6fa8', 2.5, 5, 1.6); scene.add(treeLight2);
scene.traverse(o => { if (o.isLight) o.layers.enableAll(); });

// ---- texturas ----
const wallpaper = canvasTex(256, 256, (c, w, h) => {
  c.fillStyle = '#2f5d4a'; c.fillRect(0, 0, w, h);
  c.fillStyle = 'rgba(255,230,170,.10)'; for (let i = 0; i < 8; i++) c.fillRect(i * 32, 0, 12, h);
  c.fillStyle = 'rgba(255,220,150,.22)'; for (const [x, y] of [[64, 64], [192, 192], [192, 64], [64, 192]]) { c.save(); c.translate(x, y); for (let k = 0; k < 4; k++) { c.rotate(Math.PI / 2); c.beginPath(); c.ellipse(0, -9, 4, 9, 0, 0, 7); c.fill(); } c.restore(); }
}); wallpaper.wrapS = wallpaper.wrapT = THREE.RepeatWrapping;
const planks = canvasTex(512, 512, (c, w, h) => {
  const tones = ['#8a5634', '#94603c', '#7e4e2e', '#9a6640'];
  for (let i = 0; i < 8; i++) { c.fillStyle = tones[i % 4]; c.fillRect(0, i * 64, w, 64); c.fillStyle = 'rgba(40,20,10,.45)'; c.fillRect(0, i * 64, w, 3); const off = (i * 173) % 512; c.fillRect(off, i * 64, 3, 64); c.fillRect((off + 256) % 512, i * 64, 3, 64);
    c.strokeStyle = 'rgba(60,30,15,.18)'; c.lineWidth = 2; for (let k = 0; k < 5; k++) { c.beginPath(); for (let x = 0; x <= w; x += 32) c.lineTo(x, i * 64 + 10 + k * 11 + Math.sin(x * .02 + k + i) * 3); c.stroke(); } }
}); planks.wrapS = planks.wrapT = THREE.RepeatWrapping;
const bricks = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#e8d6c8'; c.fillRect(0, 0, w, h); for (let r = 0; r < 8; r++) for (let k = -1; k < 5; k++) { const x = k * 64 + (r % 2) * 32 + 3, y = r * 32 + 3; c.fillStyle = ['#a8503c', '#b85c44', '#9c4a36', '#c0664c'][(r + k + 8) % 4]; c.fillRect(x, y, 58, 26); } }); bricks.wrapS = bricks.wrapT = THREE.RepeatWrapping;
const nightTex2 = canvasTex(512, 512, (c, w, h) => {
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0c1238'); g.addColorStop(.7, '#2a3c7a'); g.addColorStop(1, '#4a5c9a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(255,255,230,${.4 + rnd(i) * .6})`; c.beginPath(); c.arc(rnd(i * 3) * w, rnd(i * 7) * h * .6, 1 + rnd(i * 11) * 2, 0, 7); c.fill(); }
  c.fillStyle = '#fff6d0'; c.beginPath(); c.arc(380, 110, 46, 0, 7); c.fill();
  // tejados nevados con ventanitas encendidas
  for (let k = 0; k < 5; k++) { const x = k * 110 - 20, y = 330 + (k % 2) * 30; c.fillStyle = '#1b2350'; c.fillRect(x, y, 100, h - y); c.beginPath(); c.moveTo(x - 10, y); c.lineTo(x + 50, y - 50); c.lineTo(x + 110, y); c.fill(); c.fillStyle = '#f4f8ff'; c.beginPath(); c.moveTo(x - 10, y); c.lineTo(x + 50, y - 50); c.lineTo(x + 110, y); c.lineTo(x + 100, y + 8); c.lineTo(x + 50, y - 38); c.lineTo(x, y + 8); c.fill(); c.fillStyle = '#ffcf6a'; c.fillRect(x + 20, y + 30, 18, 18); c.fillRect(x + 60, y + 30, 18, 18); }
  c.fillStyle = '#f0f6ff'; c.fillRect(0, h - 40, w, 40);
});
const stripe2 = (a, b, n) => canvasTex(128, 128, (c, w, h) => { for (let i = 0; i < n; i++) { c.fillStyle = i % 2 ? a : b; c.fillRect(i * w / n, 0, w / n + 1, h); } });

// ---- habitación ----
const room3 = new THREE.Group(); scene.add(room3);
const floorG = new THREE.PlaneGeometry(20, 16); floorG.rotateX(-Math.PI / 2); floorG.translate(0, 0, 2); { const p = floorG.attributes.position, uv = floorG.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 4, p.getZ(i) / 4); }
const floor3 = new THREE.Mesh(floorG, new THREE.MeshStandardMaterial({ map: planks, roughness: .55 })); floor3.receiveShadow = true; room3.add(floor3);
const rugTex = canvasTex(512, 512, (c, w, h) => { c.translate(256, 256); for (let r = 250; r > 0; r -= 26) { c.fillStyle = (r / 26 | 0) % 2 ? '#b8323a' : '#f4ead8'; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill(); } c.fillStyle = '#2f6d4a'; for (let i = 0; i < 12; i++) { c.rotate(Math.PI / 6); c.beginPath(); c.arc(0, -150, 14, 0, 7); c.fill(); } });
room3.add(mesh(new THREE.CircleGeometry(2.6, 64), new THREE.MeshStandardMaterial({ map: rugTex, roughness: .95 }), { y: .006, z: -1.5, x: .3, rx: -Math.PI / 2, shadow: false }));
function wallPlane(w, h, x, y, z, ry, material) { const g = new THREE.PlaneGeometry(w, h), p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 2, p.getY(i) / 2); const m = new THREE.Mesh(g, material); m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true; return m; }
const WALL_M = new THREE.MeshStandardMaterial({ map: wallpaper, roughness: .9 });
ROOM_BG.add(wallPlane(20, 9, 0, 4.5, -4.5, 0, WALL_M)); ROOM_BG.add(wallPlane(16, 9, -7, 4.5, 2, Math.PI / 2, WALL_M)); ROOM_BG.add(wallPlane(16, 9, 7, 4.5, 2, -Math.PI / 2, WALL_M));
ROOM_BG.add(mesh(new THREE.BoxGeometry(20, 1.1, .08), mat('#f4ead8', .6), { y: .55, z: -4.45 }));
ROOM_BG.add(mesh(new THREE.BoxGeometry(20, .12, .14), mat('#e6d6bd', .5), { y: 1.12, z: -4.42 }));
ROOM_BG.add(mesh(new THREE.BoxGeometry(20, .18, .12), mat('#5a3a26', .6), { y: .09, z: -4.42 }));
// ventana con nieve
const WIN = V3(-3.3, 2.7, -4.45);
{
  const wg = new THREE.Group(); wg.position.copy(WIN); ROOM_BG.add(wg);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.8), new THREE.MeshBasicMaterial({ map: nightTex2 })); back.position.z = -1.6; back.scale.setScalar(1.5); wg.add(back);
  const fm = mat('#f4ead8', .5);
  for (const [x, y, w, h] of [[0, 1.45, 2.6, .18], [0, -1.45, 2.6, .18], [-1.25, 0, .18, 3.0], [1.25, 0, .18, 3.0], [0, 0, .1, 2.8], [0, .3, 2.4, .1]]) wg.add(mesh(new THREE.BoxGeometry(w, h, .16), fm, { x, y, z: .05 }));
  wg.add(mesh(new THREE.BoxGeometry(2.9, .14, .5), fm, { y: -1.58, z: .22 }));
  for (const s of [-1, 1]) { const cg = new THREE.PlaneGeometry(.9, 3.4, 18, 1), p = cg.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 14) * .06); cg.computeVertexNormals(); wg.add(mesh(cg, new THREE.MeshStandardMaterial({ color: '#a8283a', roughness: .8, side: THREE.DoubleSide }), { x: s * 1.6, y: .05, z: .28 })); }
  for (let i = 0; i < 9; i++) wg.add(mesh(SPH, mat(i % 2 ? '#2f7d4a' : '#3a9055', .7), { x: -1.4 + i * .35, y: 1.6 + Math.sin(i * 1.3) * .05, z: .3, sx: .22, sy: .14, sz: .14 }));
}
const snowP = (() => { const a = []; for (let i = 0; i < 70; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: '#ffffff', transparent: true, depthWrite: false })); ROOM_BG.add(sp); a.push(sp); } return a; })();
// chimenea
const FIRE = V3(3.7, 0, -4.1);
const fireplace = new THREE.Group(); fireplace.position.copy(FIRE); scene.add(fireplace);
{
  const B = new THREE.MeshStandardMaterial({ map: bricks, roughness: .9 });
  fireplace.add(mesh(new THREE.BoxGeometry(.6, 2.1, .7), B, { x: -1.0, y: 1.05 })); fireplace.add(mesh(new THREE.BoxGeometry(.6, 2.1, .7), B, { x: 1.0, y: 1.05 }));
  fireplace.add(mesh(new THREE.BoxGeometry(2.6, .7, .7), B, { y: 1.75 }));
  fireplace.add(mesh(new THREE.BoxGeometry(1.4, 1.4, .1), mat('#1a1010', .9), { y: .7, z: -.3 }));
  fireplace.add(mesh(new THREE.BoxGeometry(3.0, .16, .95), mat('#5a3a26', .5), { y: 2.18, z: .08 }));
  fireplace.add(mesh(new THREE.BoxGeometry(2.8, .1, .9), mat('#3a2a2a', .8), { y: .05, z: .2 }));
  for (const [x, r] of [[-.25, .3], [.25, -.3], [0, 1.57]]) fireplace.add(mesh(new THREE.CylinderGeometry(.1, .1, .8, 10), mat('#6a4028', .8), { x, y: .17, z: -.05, rz: Math.PI / 2, ry: r }));
  const SOCK = ['#c42b3a', '#2f7d4a', '#c42b3a'];
  for (let i = 0; i < 3; i++) { const x = -.9 + i * .9; const sk = new THREE.Group(); sk.position.set(x, 1.95, .5); fireplace.add(sk);
    sk.add(mesh(new THREE.CapsuleGeometry(.14, .4, 6, 12), mat(SOCK[i], .8), { y: -.3 })); sk.add(mesh(SPH, mat(SOCK[i], .8), { x: .12, y: -.55, sx: .2, sy: .13, sz: .14 })); sk.add(mesh(new THREE.CylinderGeometry(.17, .17, .14, 16), mat('#ffffff', .95), { y: -.02 })); }
  for (const x of [-1.2, 1.2]) { fireplace.add(mesh(new THREE.CylinderGeometry(.06, .06, .35, 12), mat('#fff6e6', .5), { x, y: 2.44 })); }
  for (let i = 0; i < 12; i++) fireplace.add(mesh(SPH, mat(i % 2 ? '#2f7d4a' : '#3a9055', .7), { x: -1.4 + i * .26, y: 2.3 + Math.sin(i * 1.2) * .04, z: .45, sx: .18, sy: .12, sz: .12 }));
}
const flames = Array.from({ length: 10 }, () => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: '#ffaa3a', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(sp); return sp; });
const candleF = [-1.2, 1.2].map(x => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: '#ffcf6a', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); sp.position.set(FIRE.x + x, 2.7, FIRE.z); sp.scale.setScalar(.18); scene.add(sp); return sp; });
// enchufe
// regleta en el suelo (delante, a la izquierda): aquí se enchufan las luces
const STRIP = V3(-.25, 0, 1.75), SOCKET = V3(STRIP.x + .12, .07, STRIP.z);
{ const g = new THREE.Group(); g.position.copy(STRIP); g.rotation.y = .25; scene.add(g);
  g.add(mesh(new THREE.BoxGeometry(.62, .07, .18), mat('#f4f0ea', .4), { y: .035 }));
  for (let i = 0; i < 3; i++) { g.add(mesh(new THREE.CylinderGeometry(.045, .045, .01, 16), mat('#e2ddd4', .4), { x: -.18 + i * .16, y: .072, shadow: false })); for (const s of [-1, 1]) g.add(mesh(new THREE.BoxGeometry(.012, .012, .03), mat('#2b2233', .5), { x: -.18 + i * .16 + s * .018, y: .076, shadow: false })); }
  g.add(mesh(SPH, mat('#ff3b4f', .3, { emissive: '#ff3b4f', emissiveIntensity: 1.2 }), { x: .26, y: .075, sx: .02, sy: .01, sz: .02, shadow: false }));
  const back = new THREE.CatmullRomCurve3([V3(-.31, .03, 0), V3(-.6, .02, -.3), V3(-.7, .02, -1.5), V3(-.4, .02, -3.0)]); g.add(mesh(new THREE.TubeGeometry(back, 30, .015, 5), mat('#f4f0ea', .5), { shadow: false })); }
ROOM_BG.traverse(o => o.layers.set(1));

// ---- árbol de Navidad ----
const TREE = V3(.3, 0, -2.0), TREE_H = 4.65;
const treeR = y => y < .55 ? 0 : 1.65 * Math.max(0, 1 - (y - .55) / 4.1) + .08;
const tree = new THREE.Group(); tree.position.copy(TREE); scene.add(tree);
const ORN = [], BULBS = [];
const star = new THREE.Group();
{
  tree.add(mesh(new THREE.CylinderGeometry(.55, .45, .5, 24), gloss('#c42b3a', { roughness: .3 }), { y: .25 }));
  tree.add(mesh(new THREE.TorusGeometry(.55, .05, 8, 32), mat('#ffd23f', .3, { metalness: .6 }), { y: .48, rx: Math.PI / 2 }));
  tree.add(mesh(new THREE.CylinderGeometry(.14, .17, 1.0, 12), mat('#6a4028', .8), { y: .8 }));
  const G1 = new THREE.Color('#2a7a46'), G2 = new THREE.Color('#4fae68');
  for (let i = 0; i < 6; i++) {
    const r = 1.75 - i * .26, h = 1.05 - i * .06, y0 = .55 + i * .62;
    const g = new THREE.ConeGeometry(r, h, 36, 4, true), p = g.attributes.position, col = [];
    for (let k = 0; k < p.count; k++) { const x = p.getX(k), z = p.getZ(k), yy = p.getY(k), a = Math.atan2(z, x), lowEdge = clamp((-yy / h) + .5); const f = 1 + .13 * Math.sin(a * 13 + i) * lowEdge; p.setX(k, x * f); p.setZ(k, z * f); p.setY(k, yy - .1 * lowEdge * (.5 + .5 * Math.sin(a * 13 + i))); const c = G1.clone().lerp(G2, lowEdge * .7 * (.6 + .4 * Math.sin(a * 13 + i))); col.push(c.r, c.g, c.b); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .8, side: THREE.DoubleSide })); m.position.y = y0 + h / 2; m.castShadow = m.receiveShadow = true; tree.add(m);
    for (let k = 0; k < 18; k++) { const a = k / 18 * TAU + i; tree.add(mesh(new THREE.ConeGeometry(.08, .32, 6), mat(k % 2 ? '#3a9055' : '#2a7a46', .8), { x: Math.cos(a) * r * .97, y: y0 + .05, z: Math.sin(a) * r * .97, rx: Math.sin(a) * 1.2, rz: -Math.cos(a) * 1.2, shadow: false })); }
  }
  // espumillón dorado
  const pts = []; for (let i = 0; i <= 120; i++) { const u = i / 120, y = .75 + u * 3.5, a = u * TAU * 4 + 1.2, r = treeR(y) + .07; pts.push(V3(Math.cos(a) * r, y, Math.sin(a) * r)); }
  tree.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, .02, 6), new THREE.MeshPhysicalMaterial({ color: '#ffd76a', metalness: .9, roughness: .3, emissive: '#7a5400', emissiveIntensity: .3 }), { shadow: false }));
  // bolas
  const COLS = ['#e8283c', '#ffd23f', '#2f8cff', '#e8e8f0', '#ff6fb8', '#8f4fff'];
  for (let i = 0; i < 30; i++) { const y = .85 + rnd(i * 3) * 3.3, a = rnd(i * 7) * TAU, r = treeR(y) * .98, R = .09 + rnd(i + 11) * .06;
    const o = new THREE.Group(); o.position.set(Math.cos(a) * r, y - .08, Math.sin(a) * r); tree.add(o);
    o.add(mesh(SPH, new THREE.MeshPhysicalMaterial({ color: COLS[i % 6], metalness: .75, roughness: .12, clearcoat: 1, emissive: COLS[i % 6], emissiveIntensity: .12 }), { sx: R, sy: R, sz: R }));
    o.add(mesh(new THREE.CylinderGeometry(R * .3, R * .3, R * .3, 10), mat('#ffd23f', .3, { metalness: .8 }), { y: R }));
    o.userData = { R, home: o.position.clone(), col: COLS[i % 6] }; ORN.push(o); }
  // luces
  const LC = ['#ff3b4f', '#ffd23f', '#3bff8f', '#3bb8ff', '#ff6fe0'];
  for (let i = 0; i < 70; i++) { const u = i / 70, y = .8 + u * 3.6, a = u * TAU * 5.3, r = treeR(y) + .02;
    const b = mesh(new THREE.CapsuleGeometry(.03, .05, 4, 8), new THREE.MeshStandardMaterial({ color: LC[i % 5], emissive: LC[i % 5], emissiveIntensity: 2 }), { x: Math.cos(a) * r, y, z: Math.sin(a) * r, shadow: false });
    const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: LC[i % 5], transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); gl.scale.setScalar(.32); b.add(gl); b.userData = { gl, i };
    tree.add(b); BULBS.push(b); }
  // estrella
  const sh = new THREE.Shape(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? .14 : .34; i ? sh.lineTo(Math.cos(a) * r, -Math.sin(a) * r) : sh.moveTo(Math.cos(a) * r, -Math.sin(a) * r); } sh.closePath();
  const sg = new THREE.ExtrudeGeometry(sh, { depth: .08, bevelEnabled: true, bevelThickness: .03, bevelSize: .03, bevelSegments: 3 }); sg.center();
  star.add(mesh(sg, new THREE.MeshPhysicalMaterial({ color: '#ffd23f', metalness: .7, roughness: .2, emissive: '#ffb000', emissiveIntensity: .8 })));
  const sglow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: '#ffe680', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); sglow.scale.setScalar(1.3); star.add(sglow); star.userData.glow = sglow;
  scene.add(star);
}
// regalos
const GIFTS = V3(-2.3, 0, -3.4);     // regalos bajo la ventana (a la izquierda del árbol, contra la pared)
const giftBoxes = [];
function giftBox(w, h, d, c, rib) {
  const g = new THREE.Group(); g.add(mesh(new THREE.BoxGeometry(w, h, d), gloss(c, { roughness: .35 }), { y: h / 2 }));
  g.add(mesh(new THREE.BoxGeometry(w + .02, h + .02, d * .18), mat(rib, .35), { y: h / 2 })); g.add(mesh(new THREE.BoxGeometry(w * .18, h + .02, d + .02), mat(rib, .35), { y: h / 2 }));
  for (const s of [-1, 1]) g.add(mesh(new THREE.TorusGeometry(w * .14, w * .045, 8, 16), mat(rib, .35), { x: s * w * .12, y: h + w * .1, rz: s * .6, ry: .3 }));
  scene.add(g); return g;
}
for (const [x, z, w, h, d, c, rib, ry] of [[-.55, .1, .8, .65, .7, '#e8283c', '#ffd23f', .2], [.35, -.05, .65, .5, .6, '#2f8cff', '#ffffff', -.3], [.0, .62, .5, .38, .5, '#ffd23f', '#e8283c', .5], [-1.15, -.1, .55, .8, .55, '#2f9d5a', '#ffd23f', .1], [-.6, .75, .42, .32, .42, '#ff6fb8', '#ffffff', -.4], [.75, .55, .45, .4, .45, '#8f4fff', '#ffd23f', .7]]) {
  const b = giftBox(w, h, d, c, rib); b.position.set(GIFTS.x + x, 0, GIFTS.z + z); b.rotation.y = ry; b.userData = { home: b.position.clone(), ry, h, i: giftBoxes.length }; giftBoxes.push(b);
}
// caja grande abierta (Mochi acaba dentro)
const BIGBOX = V3(-2.6, 0, .3);
const bigBox = new THREE.Group(); bigBox.position.copy(BIGBOX); scene.add(bigBox);
{ const BM = gloss('#e8283c', { roughness: .35, side: THREE.DoubleSide }), RB = mat('#ffd23f', .35);
  for (const [x, z, w, d] of [[0, .6, 1.25, .04], [0, -.6, 1.25, .04], [.6, 0, .04, 1.25], [-.6, 0, .04, 1.25]]) bigBox.add(mesh(new THREE.BoxGeometry(w, .95, d), BM, { x, y: .475, z }));
  bigBox.add(mesh(new THREE.BoxGeometry(1.2, .04, 1.2), BM, { y: .02 }));
  bigBox.add(mesh(new THREE.BoxGeometry(.2, .96, 1.27), RB, { y: .475 })); bigBox.add(mesh(new THREE.BoxGeometry(1.27, .96, .2), RB, { y: .475 })); }
const bigLid = new THREE.Group(); scene.add(bigLid);
bigLid.add(mesh(new THREE.BoxGeometry(1.32, .18, 1.32), gloss('#e8283c', { roughness: .35 })));
bigLid.add(mesh(new THREE.BoxGeometry(.22, .2, 1.34), mat('#ffd23f', .35))); bigLid.add(mesh(new THREE.BoxGeometry(1.34, .2, .22), mat('#ffd23f', .35)));
for (const s of [-1, 1]) bigLid.add(mesh(new THREE.TorusGeometry(.2, .07, 8, 16), mat('#ffd23f', .35), { x: s * .18, y: .22, rz: s * .6 }));

function bulbOn(b, t, power = 1) { const k = b.userData.i, ph = (t * 2.2 + k * .37) % 3, on = (.55 + .45 * Math.sin(t * 3 + k * 1.7)) * (ph < 2.4 ? 1 : .35) * power; b.material.emissiveIntensity = .3 + 2.2 * on; b.userData.gl.material.opacity = .85 * on; b.userData.gl.scale.setScalar(.25 + .15 * on); }
function updateXmas(t) {
  flames.forEach((f, i) => { const ph = (t * 1.6 + i / 10) % 1; f.position.set(FIRE.x + Math.sin(i * 2.3 + t * 3) * .28 * (1 - ph), .3 + ph * .9, FIRE.z + .1); f.scale.set(.5 * (1 - ph * .6), .8 * (1 - ph * .4), 1); f.material.color.set(ph < .4 ? '#ffd06a' : '#ff6a2a'); f.material.opacity = Math.sin(ph * Math.PI) * .8; });
  fireLight.intensity = 9 + Math.sin(t * 13) * 1.2 + Math.sin(t * 7.3) * 1.5;
  candleF.forEach((c, i) => { c.scale.setScalar(.16 + .03 * Math.sin(t * 17 + i * 2)); c.material.opacity = .8; });
  snowP.forEach((sp, i) => { const ph = (t * (.08 + rnd(i) * .05) + rnd(i + 5)) % 1; sp.position.set(WIN.x - 1.15 + rnd(i + 1) * 2.3 + Math.sin(t * .8 + i) * .08, WIN.y + 1.35 - ph * 2.75, WIN.z - .3 - rnd(i + 2) * 1.0); sp.scale.setScalar(.04 + rnd(i + 3) * .05); sp.material.opacity = .9; });
}

// ---- huellas de colisión (para comprobar el maquetado) ----
const OBSTACLES = () => [
  ...giftBoxes.map(b => ({ name: 'regalo', x: b.position.x, z: b.position.z, r: .42 })),
  { name: 'caja grande', x: BIGBOX.x, z: BIGBOX.z, r: .66 },
  { name: 'chimenea', x: FIRE.x, z: FIRE.z + .1, r: 1.45 },
  { name: 'regleta', x: STRIP.x, z: STRIP.z, r: .3 },
];
