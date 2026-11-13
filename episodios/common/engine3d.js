// MOTOR 3D (Three.js). Requiere window.THREE y common/rig.js. Cada episodio define DURATION.
const W = 1080, H = 1920;
// ?global -> versión sin idioma (emojis + onomatopeyas) con tarjeta final de marca
const GLOBAL = true;
const T = (es, gl) => GLOBAL ? gl : es;
const out = document.getElementById('out');
const octx = out.getContext('2d');
const overlay = document.createElement('canvas'); overlay.width = W; overlay.height = H;
const ctx = overlay.getContext('2d');

// ---------- renderer ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true, premultipliedAlpha: false });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#ffe6c2');
const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 200);

// ---------- coordenadas: se reutiliza la línea de tiempo 2D ----------
const FLOOR = 1480, TABLE_TOP = 1020, TABLE_L = 520, TABLE_R = 960;
const BOX_W = 220, BOX_H = 250, BOX_TOP = FLOOR - BOX_H;
const COOKIE_X = 760, TEAPOT_X = 890, SHELF_Y = 300;
const U = x => (x - 540) / 100;          // 2D x  -> 3D x
const V = y => (FLOOR - y) / 100;        // 2D y  -> 3D y (suelo = 0)
const Z_CHAR = 0.6, Z_WALL = -1.7;
const TEAPOT_POS = new THREE.Vector3(3.95, V(TABLE_TOP), -0.75);


// ---------- materiales ----------
const mat = (color, rough = .6, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, ...extra });
const M = {
  cat: mat('#ffa040', .75), catDark: mat('#e9801c', .8), belly: mat('#fff1dc', .85),
  pink: mat('#ff8fa3', .6), black: mat('#1d1622', .15), white: mat('#ffffff', .3),
  mouthIn: mat('#7a2440', .5), mouse: mat('#b9b4cc', .75), mouseDark: mat('#9893b0', .75),
  red: mat('#ff3d5f', .35, { emissive: '#5a0010', emissiveIntensity: .3 }),
  cookie: mat('#e0a458', .8), chip: mat('#4a2c1a', .5), teapot: mat('#7cc6fe', .2),
  teapotDark: mat('#4fa6e8', .25), wood: mat('#a3633d', .55), woodLight: mat('#bd7a4f', .5),
  tear: mat('#8fd8ff', .05, { transparent: true, opacity: .85 }), cloud: mat('#9aa5b8', .9),
  rain: mat('#69b6f0', .2, { transparent: true, opacity: .8 }), yellow: mat('#ffe066', .3, { emissive: '#ffcc33', emissiveIntensity: .9 }),
  grey: mat('#aaaaaa', .4, { metalness: .5 }), dust: mat('#ffffff', 1, { transparent: true, opacity: .9 }),
};
M.cat.castShadow = true;

function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8;
  if (repeat) { tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(...repeat); }
  return tx;
}

function mesh(geo, material, { x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0, shadow = true } = {}) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.set(rx, ry, rz);
  m.castShadow = shadow; m.receiveShadow = true;
  return m;
}
const SPH = new THREE.SphereGeometry(1, 40, 28);
const SPH_LO = new THREE.SphereGeometry(1, 16, 12);

// Coloca un hijo sobre la superficie de una esfera (yaw/pitch en radianes)
function onSurface(parent, yaw, pitch, r, child) {
  const holder = new THREE.Group(); holder.rotation.set(pitch, yaw, 0, 'YXZ');
  child.position.z = r; holder.add(child); parent.add(holder); return holder;
}

// ---------- formas ----------
function heartShape(s = 1) {
  const sh = new THREE.Shape();
  sh.moveTo(0, -12 * s);
  sh.bezierCurveTo(-26 * s, 6 * s, -18 * s, 30 * s, 0, 16 * s);
  sh.bezierCurveTo(18 * s, 30 * s, 26 * s, 6 * s, 0, -12 * s);
  return sh;
}
const HEART_GEO = new THREE.ExtrudeGeometry(heartShape(0.01), { depth: .08, bevelEnabled: true, bevelThickness: .04, bevelSize: .03, bevelSegments: 4, curveSegments: 24 });
HEART_GEO.center();

function cookieGeo(part) {
  const r = .38, sh = new THREE.Shape();
  if (part === 'full') sh.absarc(0, 0, r, 0, Math.PI * 2, false);
  else {
    const sgn = part === 'left' ? -1 : 1;
    sh.moveTo(0, r);
    sh.absarc(0, 0, r, Math.PI / 2, -Math.PI / 2, sgn > 0);
    const n = 6;
    for (let i = 0; i <= n; i++) sh.lineTo((i % 2 ? .06 : -.02) * -sgn, -r + (2 * r * i) / n);
  }
  const g = new THREE.ExtrudeGeometry(sh, { depth: .1, bevelEnabled: true, bevelThickness: .035, bevelSize: .03, bevelSegments: 3, curveSegments: 40 });
  g.translate(0, 0, -.05);
  return g;
}
const COOKIE_GEO = { full: cookieGeo('full'), left: cookieGeo('left'), right: cookieGeo('right') };
const CHIPS = [[-.16, -.13], [.14, -.16], [.02, .04], [-.17, .14], [.17, .11], [0, -.25], [-.04, .23]];
function makeCookie(part = 'full') {
  const g = new THREE.Group();
  g.add(mesh(COOKIE_GEO[part], M.cookie));
  for (const [cx, cy] of CHIPS) {
    if (part === 'left' && cx > .02) continue;
    if (part === 'right' && cx < -.02) continue;
    for (const zs of [1, -1]) g.add(mesh(SPH_LO, M.chip, { x: cx, y: cy, z: zs * .085, sx: .05, sy: .045, sz: .03, shadow: false }));
  }
  return g;
}

// ---------- texturas ----------
const wallTex = canvasTex(256, 256, (c, w, h) => {
  c.fillStyle = '#ffe6c2'; c.fillRect(0, 0, w, h);
  c.fillStyle = '#ffd59a';
  for (const [x, y] of [[64, 64], [192, 192], [192, 64], [64, 192]]) { c.beginPath(); c.arc(x + (y === 192 ? 0 : 0), y, 12, 0, 7); c.fill(); }
  c.fillStyle = '#ffdcae'; c.beginPath(); c.arc(128, 128, 10, 0, 7); c.fill();
}, [14, 10]);
const floorTex = canvasTex(512, 512, (c, w, h) => {
  for (let i = 0; i < 8; i++) {
    c.fillStyle = i % 2 ? '#d48e58' : '#dc9862'; c.fillRect(0, i * 64, w, 64);
    c.fillStyle = 'rgba(120,60,20,.35)'; c.fillRect(0, i * 64, w, 3);
    const off = (i * 173) % 256; c.fillRect(off, i * 64, 3, 64); c.fillRect((off + 256) % 512, i * 64, 3, 64);
    c.strokeStyle = 'rgba(150,80,30,.15)'; c.lineWidth = 2;
    for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(0, i * 64 + 10 + k * 11); c.bezierCurveTo(150, i * 64 + 6 + k * 11, 300, i * 64 + 16 + k * 11, 512, i * 64 + 10 + k * 11); c.stroke(); }
  }
}, [6, 6]);
const clothTex = canvasTex(256, 256, (c, w, h) => {
  c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff9fb4';
  for (let y = 16; y < h; y += 42) for (let x = 16 + ((y / 42) % 2) * 21; x < w; x += 42) { c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill(); }
}, [3, 2]);
const boxTex = canvasTex(256, 256, (c, w, h) => {
  c.fillStyle = '#d9a86c'; c.fillRect(0, 0, w, h);
  c.fillStyle = '#c18e52'; c.fillRect(0, 0, w, 14);
  c.fillStyle = '#efd7a6'; c.fillRect(104, 0, 48, 90);
  c.fillStyle = '#5a3d22'; c.font = 'bold 54px sans-serif'; c.textAlign = 'center'; c.fillText('↑ ↑', 128, 190);
  c.font = 'bold 22px sans-serif'; if (!GLOBAL) c.fillText('FRÁGIL', 128, 230); else { c.font = '30px "Noto Color Emoji"'; c.fillText('🐾', 128, 232); }
});
const labelTex = canvasTex(512, 160, (c, w, h) => {
  c.fillStyle = '#fff7e6'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 30); c.fill();
  c.lineWidth = 8; c.strokeStyle = '#2b2233'; c.stroke();
  c.fillStyle = '#2b2233'; c.textAlign = 'center'; c.textBaseline = 'middle';
  if (GLOBAL) { c.font = '86px "Noto Color Emoji"'; c.fillText('🍪 ❤️ 🍪', w / 2, h / 2 + 6); }
  else { c.font = '900 78px Inter, sans-serif'; c.fillText('GALLETAS', w / 2, h / 2 + 4); }
});
const skyTex = canvasTex(512, 512, (c, w, h) => {
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#6cc8ff'); g.addColorStop(1, '#c6ecff');
  c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.fillStyle = '#ffffff';
  for (const [x, y, s] of [[120, 140, 1], [380, 250, .8], [260, 90, .6]]) {
    for (const [dx, dy, r] of [[0, 0, 40], [40, -14, 34], [-38, 6, 28], [74, 6, 26]]) { c.beginPath(); c.arc(x + dx * s, y + dy * s, r * s, 0, 7); c.fill(); }
  }
  c.fillStyle = '#8fd16a'; c.beginPath(); c.ellipse(300, 520, 330, 140, 0, 0, 7); c.fill();
  c.fillStyle = '#7cc25a'; c.beginPath(); c.ellipse(60, 540, 200, 110, 0, 0, 7); c.fill();
});
skyTex.wrapS = THREE.RepeatWrapping;
function starTex(color) {
  return canvasTex(128, 128, (c, w, h) => {
    const g = c.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,220,.9)'); g.addColorStop(.3, 'rgba(255,240,150,.25)'); g.addColorStop(1, 'rgba(255,240,150,0)');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.beginPath();
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 12 : 56; c.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); }
    c.closePath(); c.fillStyle = color; c.fill();
  });
}
const STAR_W = starTex('#fffbe0'), STAR_Y = starTex('#ffd93d');
const raysTex = canvasTex(512, 512, (c, w, h) => {
  c.translate(256, 256);
  for (let i = 0; i < 16; i++) {
    c.rotate(Math.PI / 8);
    const g = c.createLinearGradient(0, 0, 0, -256); g.addColorStop(0, 'rgba(255,230,120,.9)'); g.addColorStop(1, 'rgba(255,230,120,0)');
    c.fillStyle = g; c.beginPath(); c.moveTo(-6, 0); c.lineTo(-40, -256); c.lineTo(40, -256); c.lineTo(6, 0); c.fill();
  }
  const g = c.createRadialGradient(0, 0, 0, 0, 0, 200); g.addColorStop(0, 'rgba(255,250,200,.9)'); g.addColorStop(1, 'rgba(255,250,200,0)');
  c.fillStyle = g; c.beginPath(); c.arc(0, 0, 200, 0, 7); c.fill();
});

// ---------- luces ----------
scene.add(new THREE.HemisphereLight('#fff4e0', '#c98a5a', 1.35));
const key = new THREE.DirectionalLight('#fff1dc', 2.6);
key.position.set(-7, 16, 12); key.target.position.set(1, 4, 0);
key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -14, right: 14, top: 16, bottom: -4, near: 1, far: 50 });
key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 4;
scene.add(key, key.target);
const rim = new THREE.DirectionalLight('#ffd7f0', 1.1); rim.position.set(8, 10, -6); scene.add(rim);
const fill = new THREE.DirectionalLight('#cfe8ff', .55); fill.position.set(6, 5, 14); scene.add(fill);

// ---------- habitación ----------
const room = new THREE.Group(); scene.add(room);
const PROPS = {};
room.add(mesh(new THREE.PlaneGeometry(60, 40), mat('#ffffff', .95, { map: wallTex }), { y: 14, z: Z_WALL, shadow: false }));
const floor = mesh(new THREE.PlaneGeometry(60, 30), mat('#ffffff', .55, { map: floorTex }), { rx: -Math.PI / 2, z: 8, shadow: false }); room.add(floor);
room.add(mesh(new THREE.BoxGeometry(60, .5, .12), mat('#f4b183', .5), { y: .25, z: Z_WALL + .06 }));
// alfombra
room.add(mesh(new THREE.CylinderGeometry(2.6, 2.6, .05, 64), mat('#ff9fb4', .95), { x: U(300), y: .025, z: 2.6, sz: .45 }));
room.add(mesh(new THREE.CylinderGeometry(2.0, 2.0, .06, 64), mat('#ffc4d1', .95), { x: U(300), y: .03, z: 2.6, sz: .45 }));
// ventana
{
  const wx = U(240), wy = V(725), win = new THREE.Group(); win.position.set(wx, wy, Z_WALL + .02); room.add(win);
  const sky = mesh(new THREE.PlaneGeometry(2.9, 3.2), new THREE.MeshBasicMaterial({ map: skyTex }), { z: .01, shadow: false }); win.add(sky);
  win.userData.sky = sky;
  const fm = mat('#fff6ea', .5);
  for (const [x, y, w, h] of [[0, 1.65, 3.3, .2], [0, -1.65, 3.3, .2], [-1.55, 0, .2, 3.5], [1.55, 0, .2, 3.5], [0, 0, .12, 3.2], [0, 0, 3.0, .12]]) win.add(mesh(new THREE.BoxGeometry(w, h, .18), fm, { x, y, z: .08 }));
  win.add(mesh(new THREE.BoxGeometry(3.8, .18, .55), fm, { y: -1.82, z: .25 }));
  room.userData.win = win;
}
// cuadro con corazón
{
  const fr = new THREE.Group(); fr.position.set(U(1080), V(700), Z_WALL + .05); room.add(fr);
  fr.add(mesh(new THREE.BoxGeometry(1.7, 2.1, .12), mat('#ffffff', .5)));
  fr.add(mesh(new THREE.PlaneGeometry(1.4, 1.8), mat('#ffd1dc', .9), { z: .07, shadow: false }));
  fr.add(mesh(HEART_GEO, M.red, { z: .12, sx: 1.6, sy: 1.6, sz: 1 }));
}
// mesa
const TT = V(TABLE_TOP), TL = U(TABLE_L - 20), TR = U(TABLE_R + 20);
{
  const tb = new THREE.Group(); room.add(tb); PROPS.table = tb;
  const topW = TR - TL, cx = (TL + TR) / 2;
  tb.add(mesh(new THREE.BoxGeometry(topW, .38, 2.9), M.woodLight, { x: cx, y: TT - .19 }));
  for (const lx of [TL + .45, TR - .45]) for (const lz of [-1.05, 1.05]) tb.add(mesh(new THREE.CylinderGeometry(.16, .12, TT - .38, 20), M.wood, { x: lx, y: (TT - .38) / 2, z: lz }));
  tb.add(mesh(new THREE.BoxGeometry(topW - .9, .3, .12), M.wood, { x: cx, y: TT - .55, z: 1.05 }));
  // mantel (centro de mesa) que cuelga por delante
  tb.add(mesh(new THREE.BoxGeometry(2.6, .02, 2.95), mat('#ffffff', .9, { map: clothTex }), { x: cx + .2, y: TT + .01, shadow: false }));
  tb.add(mesh(new THREE.BoxGeometry(2.6, .7, .02), mat('#ffffff', .9, { map: clothTex }), { x: cx + .2, y: TT - .34, z: 1.47, shadow: false }));
}
// tetera
const teapot = new THREE.Group(); teapot.position.copy(TEAPOT_POS); room.add(teapot);
{
  const pts = [];
  for (let i = 0; i <= 24; i++) { const a = -Math.PI / 2 + Math.PI * i / 24; pts.push(new THREE.Vector2(Math.max(.001, Math.cos(a) * .85), .78 + Math.sin(a) * .74)); }
  const body = mesh(new THREE.LatheGeometry(pts, 48), M.teapot); teapot.add(body);
  teapot.add(mesh(new THREE.CylinderGeometry(.5, .55, .12, 40), M.teapotDark, { y: 1.5 }));
  teapot.add(mesh(SPH, M.teapotDark, { y: 1.56, sx: .48, sy: .18, sz: .48 }));
  teapot.add(mesh(SPH, M.red, { y: 1.72, sx: .14, sy: .12, sz: .14 }));
  const spout = new THREE.CatmullRomCurve3([new THREE.Vector3(-.65, .55, 0), new THREE.Vector3(-1.05, .75, 0), new THREE.Vector3(-1.2, 1.25, 0)]);
  teapot.add(mesh(new THREE.TubeGeometry(spout, 20, .12, 16), M.teapot));
  teapot.add(mesh(new THREE.TorusGeometry(.38, .09, 16, 32, Math.PI * 1.2), M.teapot, { x: .78, y: .82, rz: -Math.PI * .6 }));
  const TH = -2.13;
  teapot.rotation.y = TH;
  const hz = mesh(HEART_GEO, M.white, { x: -Math.sin(TH) * .84, z: Math.cos(TH) * .84, y: .8, sx: 1.3, sy: 1.3, sz: .4, ry: -TH }); teapot.add(hz);
}
// caja
const box = new THREE.Group(); room.add(box);
{
  const bw = BOX_W / 100, bh = BOX_H / 100;
  const side = mat('#ffffff', .85, { map: boxTex }), plain = mat('#d9a86c', .85);
  box.add(mesh(new THREE.BoxGeometry(bw, bh, 1.9), [plain, plain, mat('#c99a5f', .85), plain, side, plain], { y: bh / 2 }));
  box.add(mesh(new THREE.BoxGeometry(.5, .02, 1.92), mat('#efd7a6', .6), { y: bh + .01, shadow: false }));
}
// estante + tarro
const jarGroup = new THREE.Group(); room.add(jarGroup);
const SH_Y = V(SHELF_Y);
let rays;
{
  jarGroup.add(mesh(new THREE.BoxGeometry(7.2, .3, 1.7), M.woodLight, { x: 1.9, y: SH_Y - .15, z: Z_WALL + .85 }));
  for (const bx of [-.6, 4.4]) jarGroup.add(mesh(new THREE.BoxGeometry(.2, .9, 1.2), M.wood, { x: bx, y: SH_Y - .75, z: Z_WALL + .6 }));
  const jx = U(740), jz = Z_WALL + .95;
  const jar = new THREE.Group(); jar.position.set(jx, SH_Y, jz); jarGroup.add(jar);
  jar.add(mesh(new THREE.CylinderGeometry(1.42, 1.42, .1, 48), mat('#d8f0ff', .1, { transparent: true, opacity: .5 }), { y: .05 }));
  for (let i = 0; i < 34; i++) {
    const ck = makeCookie('full');
    const a = rnd(i) * Math.PI * 2, rr = Math.sqrt(rnd(i + 50)) * 1.0;
    ck.position.set(Math.cos(a) * rr, .45 + (i / 34) * 2.2 + rnd(i + 7) * .2, Math.sin(a) * rr * .8);
    ck.rotation.set(rnd(i + 1) * 3, rnd(i + 2) * 3, rnd(i + 3) * 3);
    ck.scale.setScalar(.95);
    jar.add(ck);
  }
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 3.0, 64, 1, true), new THREE.MeshPhysicalMaterial({ color: '#e6f6ff', roughness: .05, metalness: 0, transparent: true, opacity: .22, side: THREE.DoubleSide, depthWrite: false, clearcoat: 1 }));
  glass.position.y = 1.5; jar.add(glass);
  jar.add(mesh(new THREE.CylinderGeometry(1.55, 1.55, .32, 48), M.red, { y: 3.12 }));
  for (const [x, z, rx] of [[-.6, .2, 1.2], [.5, .1, -1.1], [0, -.2, 1.5], [-.1, .4, .3]]) { const ck = makeCookie('full'); ck.position.set(x, 3.45, z); ck.rotation.set(rx, x, 0); jar.add(ck); }
  const lbl = new THREE.Mesh(new THREE.CylinderGeometry(1.47, 1.47, .75, 32, 1, true, -.75, 1.5), mat('#ffffff', .7, { map: labelTex }));
  lbl.position.y = 1.55; jar.add(lbl);
  rays = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({ map: raysTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  rays.position.set(jx, SH_Y + 1.6, Z_WALL + .05); jarGroup.add(rays);
}

// =====================================================================
//  GATITO 3D
// =====================================================================
function buildCat() {
  const root = new THREE.Group(), tilt = new THREE.Group(), squash = new THREE.Group(), yawG = new THREE.Group();
  root.add(tilt); tilt.add(squash); squash.add(yawG);
  const body = new THREE.Group(); yawG.add(body);
  body.add(mesh(SPH, M.cat, { y: .78, sx: .82, sy: .72, sz: .76 }));
  body.add(mesh(SPH, M.belly, { y: .7, z: .36, sx: .52, sy: .5, sz: .45 }));
  for (const sx of [-1, 0, 1]) body.add(mesh(SPH, M.catDark, { x: sx * .28, y: 1.43, z: -.2, sx: .09, sy: .05, sz: .3, rx: .4 }));
  const feet = [];
  for (const [x, z] of [[-.4, .45], [.4, .45], [-.42, -.3], [.42, -.3]]) { const f = mesh(SPH, M.cat, { x, y: .13, z, sx: .25, sy: .15, sz: .3 }); body.add(f); feet.push(f); }
  // brazo que se estira
  const arm = new THREE.Group(); arm.position.set(.42, 1.05, .45); body.add(arm);
  const armM = mesh(new THREE.CapsuleGeometry(.14, .5, 8, 16), M.cat, { rx: Math.PI / 2, z: .3 }); arm.add(armM);
  const pawM = mesh(SPH, M.belly, { z: .62, sx: .17, sy: .15, sz: .15 }); arm.add(pawM);
  // cola
  const tail = mesh(new THREE.BufferGeometry(), M.cat); body.add(tail);
  const tailTip = mesh(SPH, M.catDark, { sx: .17, sy: .17, sz: .17 }); body.add(tailTip);

  // cabeza
  const head = new THREE.Group(); head.position.set(0, 1.72, .12); yawG.add(head);
  const skull = mesh(SPH, M.cat, { sx: .86, sy: .78, sz: .78 }); head.add(skull);
  for (const s of [-1, 1]) {
    const ear = new THREE.Group(); ear.position.set(s * .46, .56, -.05); ear.rotation.set(-.1, 0, -s * .38); head.add(ear);
    ear.add(mesh(new THREE.ConeGeometry(.3, .58, 32), M.cat, { y: .2 }));
    ear.add(mesh(new THREE.ConeGeometry(.18, .38, 32), M.pink, { y: .17, z: .11, sz: .45 }));
  }
  for (let i = -1; i <= 1; i++) onSurface(head, i * .2, -.95, .74, mesh(SPH, M.catDark, { sx: .045, sy: .16, sz: .03, shadow: false }));
  // hocico
  for (const s of [-1, 1]) onSurface(head, s * .15, .33, .68, mesh(SPH, M.belly, { sx: .19, sy: .14, sz: .12 }));
  onSurface(head, 0, .14, .78, mesh(SPH, M.pink, { sx: .09, sy: .065, sz: .06 }));
  for (const s of [-1, 1]) { const ch = mesh(SPH, M.pink, { sx: .15, sy: .09, sz: .04, shadow: false }); ch.material = M.pink; onSurface(head, s * .62, .2, .72, ch); }
  // bigotes
  for (const s of [-1, 1]) for (const k of [-1, 0, 1]) {
    const w = mesh(new THREE.CylinderGeometry(.008, .008, .62, 6), M.black, { shadow: false });
    const h = new THREE.Group(); h.position.set(s * .38, -.22 + k * .05, .62); h.rotation.set(0, -s * .35, Math.PI / 2 + k * .18 * s); h.add(w); w.position.y = -s * .32; head.add(h);
  }
  // ojos (varias versiones, se activan según la expresión)
  const eyes = [];
  for (const s of [-1, 1]) {
    const holder = new THREE.Group(); holder.rotation.set(-.04, s * .36, 0, 'YXZ'); head.add(holder);
    const e = { holder, s };
    e.normal = new THREE.Group(); e.normal.position.z = .74;
    e.normal.add(mesh(SPH, M.black, { sx: .12, sy: .17, sz: .07, shadow: false }));
    e.normal.add(mesh(SPH, M.white, { x: -.035, y: .06, z: .05, sx: .04, sy: .05, sz: .02, shadow: false }));
    e.normal.add(mesh(SPH, M.white, { x: .04, y: -.06, z: .05, sx: .018, sy: .018, sz: .01, shadow: false }));
    e.heart = mesh(HEART_GEO, M.red, { z: .78, sx: .5, sy: .5, sz: .5, shadow: false });
    e.arc = mesh(new THREE.TorusGeometry(.11, .025, 10, 24, Math.PI), M.black, { z: .76, y: -.02, shadow: false });
    e.shock = new THREE.Group(); e.shock.position.z = .73;
    e.shock.add(mesh(SPH, M.white, { sx: .17, sy: .2, sz: .08, shadow: false }));
    e.pupil = mesh(SPH, M.black, { z: .06, sx: .06, sy: .07, sz: .03, shadow: false }); e.shock.add(e.pupil);
    e.sad = new THREE.Group(); e.sad.position.z = .74;
    e.sad.add(mesh(SPH, M.black, { sx: .14, sy: .19, sz: .07, shadow: false }));
    e.sad.add(mesh(SPH, M.white, { x: -.04, y: .06, z: .05, sx: .055, sy: .065, sz: .02, shadow: false }));
    e.sad.add(mesh(SPH, M.white, { x: .05, y: -.05, z: .05, sx: .03, sy: .03, sz: .01, shadow: false }));
    e.sad.add(mesh(SPH, M.tear, { y: -.16, z: .03, sx: .15, sy: .05, sz: .05, shadow: false }));
    e.dizzy = mesh(new THREE.TorusGeometry(.09, .022, 8, 24, Math.PI * 1.7), M.black, { z: .76, shadow: false });
    e.brow = mesh(new THREE.CapsuleGeometry(.025, .2, 4, 8), M.black, { z: .76, y: .2, rz: Math.PI / 2, shadow: false });
    for (const k of ['normal', 'heart', 'arc', 'shock', 'sad', 'dizzy', 'brow']) holder.add(e[k]);
    e.arc.rotation.z = 0;
    eyes.push(e);
  }
  // boca
  const mouthH = new THREE.Group(); mouthH.rotation.set(.42, 0, 0, 'YXZ'); head.add(mouthH);
  const mW = new THREE.Group(); mW.position.z = .7;
  for (const s of [-1, 1]) mW.add(mesh(new THREE.TorusGeometry(.055, .016, 8, 16, Math.PI), M.black, { x: s * .055, rz: Math.PI, shadow: false }));
  const mOpen = mesh(SPH, M.mouthIn, { z: .68, shadow: false });
  const mTongue = mesh(SPH, M.pink, { z: .7, y: -.04, sx: .06, sy: .03, sz: .03, shadow: false });
  const mFrown = mesh(new THREE.TorusGeometry(.08, .018, 8, 16, Math.PI), M.black, { z: .7, y: -.05, shadow: false });
  mouthH.add(mW, mOpen, mTongue, mFrown);
  // lágrimas que caen
  const tears = [];
  for (let i = 0; i < 4; i++) { const tm = mesh(SPH, M.tear, { sx: .06, sy: .09, sz: .06, shadow: false }); head.add(tm); tears.push(tm); }

  const cat = { root, tilt, squash, yawG, head, eyes, feet, arm, armM, pawM, tail, tailTip, mW, mOpen, mTongue, mFrown, tears };
  scene.add(root);
  return cat;
}

function updateTail(cat, t, speed = 1) {
  const wag = Math.sin(t * 5 * speed) * .35;
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, .6, -.62), new THREE.Vector3(wag * .3, .7, -1.15),
    new THREE.Vector3(wag * .8, 1.3, -1.35), new THREE.Vector3(wag * 1.2, 1.95, -1.15)]);
  cat.tail.geometry.dispose();
  cat.tail.geometry = new THREE.TubeGeometry(curve, 28, .13, 14);
  cat.tailTip.position.copy(curve.getPoint(1));
}

function setCat(cat, st, t) {
  const { x, y, dir = 1, sx = 1, sy = 1, rot = 0, expr = 'normal', look = 0, paw = 0, walk = 0, tearsOn = 0, z = Z_CHAR } = st;
  cat.root.position.set(U(x), V(y), z);
  cat.tilt.rotation.z = -rot;
  cat.squash.scale.set(sx, sy, sx);
  const yaw = dir * .78;
  cat.yawG.rotation.y = yaw;
  cat.head.rotation.set(-look * .17, -yaw * .5 + Math.sin(t * 1.3) * .05, Math.sin(t * 2.1) * .04, 'YXZ');
  // patas al andar
  const stp = Math.sin(walk * Math.PI * 2) * .12;
  cat.feet[0].position.z = .45 + stp; cat.feet[1].position.z = .45 - stp; cat.feet[2].position.z = -.3 - stp; cat.feet[3].position.z = -.3 + stp;
  // brazo
  cat.arm.visible = paw > 0.01;
  cat.arm.rotation.set(-(.25 + paw * .75), -.15, 0);
  cat.arm.scale.set(1, 1, .6 + paw * .7);
  updateTail(cat, t, expr === 'sad' ? .3 : 1);
  // ojos
  const blink = ((t + .4) % 2.8) < .12;
  for (const e of cat.eyes) {
    for (const k of ['normal', 'heart', 'arc', 'shock', 'sad', 'dizzy', 'brow']) e[k].visible = false;
    if (expr === 'love') { e.heart.visible = true; const p = 1 + Math.sin(t * 12) * .1; e.heart.scale.set(.5 * p, .5 * p, .5); }
    else if (expr === 'happy' || expr === 'chew') e.arc.visible = true;
    else if (expr === 'dizzy') { e.dizzy.visible = true; e.dizzy.rotation.z = t * 9 * e.s; }
    else if (expr === 'shock') { e.shock.visible = true; e.pupil.position.y = look * .03; }
    else if (expr === 'sad') { e.sad.visible = true; e.brow.visible = true; e.brow.rotation.z = Math.PI / 2 - e.s * .35; e.brow.position.y = .22; }
    else { e.normal.visible = true; e.normal.scale.y = blink ? .12 : 1; e.normal.position.y = look * .02; }
    if (expr === 'determined') { e.brow.visible = true; e.brow.rotation.z = Math.PI / 2 + e.s * .45; e.brow.position.y = .17; }
  }
  // boca
  cat.mW.visible = cat.mOpen.visible = cat.mTongue.visible = cat.mFrown.visible = false;
  if (expr === 'shock') { cat.mOpen.visible = true; cat.mOpen.scale.set(.1, .14, .05); }
  else if (expr === 'chew') { const o = (Math.sin(t * 22) + 1) / 2; cat.mOpen.visible = true; cat.mOpen.scale.set(.09, .03 + o * .07, .05); }
  else if (expr === 'love' || expr === 'happy' || expr === 'smile') { cat.mOpen.visible = cat.mTongue.visible = true; cat.mOpen.scale.set(.13, .08, .05); }
  else if (expr === 'sad') cat.mFrown.visible = true;
  else cat.mW.visible = true;
  // lágrimas
  cat.tears.forEach((tm, i) => {
    const s = i % 2 ? 1 : -1, ph = (t * 1.6 + Math.floor(i / 2) * .5) % 1;
    tm.visible = tearsOn > .05;
    tm.position.set(s * .42, -.05 - ph * .9, .55);
    tm.scale.setScalar(tearsOn * (1 - ph * .5)); tm.scale.y *= 1.4; tm.scale.multiplyScalar(.07);
  });
}

// =====================================================================
//  RATONCITO 3D
// =====================================================================
function buildMouse() {
  const root = new THREE.Group(), squash = new THREE.Group(), yawG = new THREE.Group();
  root.add(squash); squash.add(yawG);
  yawG.add(mesh(SPH, M.mouse, { y: .38, sx: .42, sy: .37, sz: .48 }));
  yawG.add(mesh(SPH, M.belly, { y: .34, z: .2, sx: .28, sy: .26, sz: .3 }));
  for (const [x, z] of [[-.2, .3], [.2, .3], [-.22, -.25], [.22, -.25]]) yawG.add(mesh(SPH, M.mouseDark, { x, y: .07, z, sx: .12, sy: .07, sz: .16 }));
  const head = new THREE.Group(); head.position.set(0, .7, .32); yawG.add(head);
  head.add(mesh(SPH, M.mouse, { sx: .34, sy: .32, sz: .38 }));
  head.add(mesh(SPH, M.mouse, { y: -.07, z: .3, sx: .16, sy: .13, sz: .2 }));
  head.add(mesh(SPH, M.pink, { y: -.03, z: .5, sx: .07, sy: .06, sz: .06 }));
  for (const s of [-1, 1]) {
    head.add(mesh(new THREE.CylinderGeometry(.27, .27, .05, 32), M.mouse, { x: s * .3, y: .3, z: -.05, rx: Math.PI / 2 - .2, rz: s * .25 }));
    head.add(mesh(new THREE.CylinderGeometry(.17, .17, .05, 32), M.pink, { x: s * .3, y: .3, z: -.02, rx: Math.PI / 2 - .2, rz: s * .25 }));
    head.add(mesh(SPH, M.pink, { x: s * .2, y: -.1, z: .27, sx: .07, sy: .04, sz: .03, shadow: false }));
  }
  for (const s of [-1, 1]) for (const k of [-1, 1]) {
    const w = mesh(new THREE.CylinderGeometry(.006, .006, .4, 6), M.black, { shadow: false });
    const h = new THREE.Group(); h.position.set(s * .1, -.05, .45); h.rotation.set(0, 0, Math.PI / 2 + k * .2 * s); h.add(w); w.position.y = -s * .2; head.add(h);
  }
  const eyes = [];
  for (const s of [-1, 1]) {
    const e = { s };
    e.normal = new THREE.Group(); e.normal.position.set(s * .13, .06, .3);
    e.normal.add(mesh(SPH, M.black, { sx: .065, sy: .085, sz: .04, shadow: false }));
    e.normal.add(mesh(SPH, M.white, { x: -.02, y: .03, z: .03, sx: .022, sy: .025, sz: .01, shadow: false }));
    e.arc = mesh(new THREE.TorusGeometry(.055, .015, 8, 16, Math.PI), M.black, { x: s * .13, y: .04, z: .32, shadow: false });
    e.shock = new THREE.Group(); e.shock.position.set(s * .14, .07, .29);
    e.shock.add(mesh(SPH, M.white, { sx: .09, sy: .1, sz: .05, shadow: false }));
    e.pupil = mesh(SPH, M.black, { z: .04, sx: .03, sy: .035, sz: .02, shadow: false }); e.shock.add(e.pupil);
    e.brow = mesh(new THREE.CapsuleGeometry(.015, .1, 4, 8), M.black, { x: s * .13, y: .19, z: .3, rz: Math.PI / 2 - s * .4, shadow: false });
    for (const k of ['normal', 'arc', 'shock', 'brow']) head.add(e[k]);
    eyes.push(e);
  }
  const mOpen = mesh(SPH, M.mouthIn, { y: -.17, z: .4, shadow: false }); head.add(mOpen);
  const tail = new THREE.Mesh(new THREE.BufferGeometry(), M.pink); tail.castShadow = true; yawG.add(tail);
  const hold = new THREE.Group(); hold.position.set(0, .45, .62); yawG.add(hold);
  const ck = { full: makeCookie('full'), right: makeCookie('right') };
  hold.add(ck.full, ck.right);
  const mouse = { root, squash, yawG, head, eyes, mOpen, tail, hold, ck };
  scene.add(root);
  return mouse;
}

function setMouse(mo, st, t, pos3) {
  const { dir = -1, sx = 1, sy = 1, expr = 'normal', look = 0, holding = null } = st;
  mo.root.position.copy(pos3);
  mo.squash.scale.set(sx, sy, sx);
  const yaw = dir * .85;
  mo.yawG.rotation.y = yaw;
  mo.head.rotation.set(-look * .2, -yaw * .45, Math.sin(t * 3) * .05, 'YXZ');
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, .25, -.42), new THREE.Vector3(Math.sin(t * 6) * .2, .15, -.85), new THREE.Vector3(Math.sin(t * 6 + 1) * .3, .45, -1.15), new THREE.Vector3(Math.sin(t * 6 + 2) * .2, .55, -1.35)]);
  mo.tail.geometry.dispose(); mo.tail.geometry = new THREE.TubeGeometry(curve, 20, .035, 8);
  for (const e of mo.eyes) {
    for (const k of ['normal', 'arc', 'shock', 'brow']) e[k].visible = false;
    if (expr === 'happy' || expr === 'chew') e.arc.visible = true;
    else if (expr === 'shock') { e.shock.visible = true; e.pupil.position.y = look * .02; }
    else { e.normal.visible = true; e.normal.scale.y = ((t + 1.3) % 3.1) < .1 ? .15 : 1; }
    if (expr === 'guilty') e.brow.visible = true;
  }
  mo.mOpen.visible = expr === 'chew' || expr === 'shock';
  if (expr === 'chew') { const o = (Math.sin(t * 24 + 1) + 1) / 2; mo.mOpen.scale.set(.05, .02 + o * .04, .03); }
  if (expr === 'shock') mo.mOpen.scale.set(.05, .07, .03);
  mo.ck.full.visible = !!holding && holding.part === 'full';
  mo.ck.right.visible = !!holding && holding.part === 'right';
  if (holding && holding.part === 'right') mo.ck.right.scale.setScalar(1 - (holding.bite || 0) * .45);
}

// =====================================================================
//  EFECTOS 3D
// =====================================================================
function pool(n, factory) { const arr = []; for (let i = 0; i < n; i++) { const o = factory(i); o.visible = false; scene.add(o); arr.push(o); } let k = 0; return { reset() { arr.forEach(o => o.visible = false); k = 0; }, next() { const o = arr[k++ % arr.length]; o.visible = true; return o; } }; }
const hearts = pool(14, () => mesh(HEART_GEO, M.red, { shadow: false }));
const heartsPink = pool(6, () => mesh(HEART_GEO, M.pink, { shadow: false }));
const spritesW = pool(16, () => new THREE.Sprite(new THREE.SpriteMaterial({ map: STAR_W, transparent: true, depthWrite: false })));
const spritesY = pool(10, () => new THREE.Sprite(new THREE.SpriteMaterial({ map: STAR_Y, transparent: true, depthWrite: false })));
const puffs = pool(24, () => new THREE.Mesh(SPH, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, transparent: true, opacity: .9 })));
const crumbs = pool(24, () => mesh(SPH_LO, M.cookie, { shadow: false }));
const drops = pool(10, () => mesh(new THREE.CapsuleGeometry(.025, .18, 4, 8), M.rain, { shadow: false }));
const cloud = new THREE.Group();
for (const [x, y, r] of [[-.5, 0, .45], [.5, 0, .45], [0, .25, .55], [-.15, -.05, .5], [.25, -.08, .45]]) cloud.add(mesh(SPH, M.cloud, { x, y, sx: r, sy: r * .8, sz: r * .8, shadow: false }));
scene.add(cloud);
const bulb = new THREE.Group();
bulb.add(mesh(SPH, M.yellow, { sx: .38, sy: .42, sz: .38, shadow: false }));
bulb.add(mesh(new THREE.CylinderGeometry(.18, .16, .3, 20), M.grey, { y: -.5, shadow: false }));
const bulbGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: STAR_W, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); bulbGlow.scale.setScalar(2.2); bulb.add(bulbGlow);
scene.add(bulb);
const tableCookie = makeCookie('full'); scene.add(tableCookie);
const catHalf = makeCookie('left'); scene.add(catHalf);

function sprite(p, x, y, z, s, a) { const sp = p.next(); sp.position.set(x, y, z); sp.scale.setScalar(s); sp.material.opacity = a; return sp; }

const cat = buildCat();
const mouse = buildMouse();

// ---------- overlay 2D (textos estilo TikTok) ----------
const INK = '#2b2233';
function caption(text, t, t0, t1, opts = {}) {
  if (t < t0 || t > t1) return;
  const pIn = t0 === 0 ? 1 : seg(t, t0, t0 + .25);
  const pOut = seg(t, t1 - .15, t1);
  const s = easeOutBack(pIn) * (1 - pOut * .3);
  const size = opts.size || 104, y = opts.y || 250;
  ctx.save(); ctx.globalAlpha = 1 - pOut; ctx.translate(W / 2, y); ctx.scale(s, s); ctx.rotate(opts.rot || 0);
  ctx.font = `900 ${size}px Inter, "Noto Color Emoji", "DejaVu Sans", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
  const lines = text.split('\n');
  lines.forEach((ln, i) => {
    const yy = (i - (lines.length - 1) / 2) * size * 1.12;
    ctx.lineJoin = 'round'; ctx.lineWidth = size * .22; ctx.strokeStyle = INK; ctx.strokeText(ln, 0, yy);
  });
  ctx.shadowColor = 'transparent';
  lines.forEach((ln, i) => {
    const yy = (i - (lines.length - 1) / 2) * size * 1.12;
    ctx.fillStyle = (opts.highlight && i === lines.length - 1) ? '#ffd93d' : '#ffffff'; ctx.fillText(ln, 0, yy);
  });
  ctx.restore();
}
function pill(text, t, t0, t1) {
  if (t < t0 || t > t1) return;
  const a = 1 - seg(t, t1 - .2, t1), pulse = 1 + Math.sin(t * 9) * .04;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(W / 2, 420); ctx.scale(pulse, pulse);
  ctx.font = '900 50px Inter, "Noto Color Emoji", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(text + ' ⬇').width + 70;
  ctx.beginPath(); ctx.roundRect(-w / 2, -40, w, 80, 40); ctx.fillStyle = '#ff3d5f'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.fillText(text + ' ⬇', 0, 2);
  ctx.restore();
}
function focusLines(t, a) {
  ctx.save(); ctx.globalAlpha = a * .5; ctx.strokeStyle = INK; ctx.lineCap = 'round';
  const fr = Math.floor(t * 15);
  for (let i = 0; i < 46; i++) {
    const an = (i / 46) * Math.PI * 2 + rnd(i + fr) * .08, r0 = 620 + rnd(i * 7 + fr) * 260;
    ctx.lineWidth = 4 + rnd(i * 3 + fr) * 10;
    ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(an) * r0, H / 2 + Math.sin(an) * r0 * 1.4); ctx.lineTo(W / 2 + Math.cos(an) * 1500, H / 2 + Math.sin(an) * 2100); ctx.stroke();
  }
  ctx.restore();
}
function toScreen(v) { const p = v.clone().project(camera); return { x: (p.x + 1) / 2 * W, y: (1 - p.y) / 2 * H }; }
function comicWord(text, t, t0, t1, pos3, size, color, rot = 0) {
  if (t < t0 || t > t1) return;
  const p = easeOutBack(seg(t, t0, t0 + .2)) * (1 - seg(t, t1 - .15, t1));
  const sp = toScreen(pos3);
  ctx.save(); ctx.translate(sp.x, sp.y); ctx.scale(p, p); ctx.rotate(rot);
  ctx.font = `900 ${size}px Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.lineWidth = size * .18; ctx.strokeStyle = INK; ctx.strokeText(text, 0, 0); ctx.fillStyle = color; ctx.fillText(text, 0, 0);
  ctx.restore();
}

function polka(c, w, h, step, r, color) {
  c.fillStyle = color;
  for (let y = 0, row = 0; y < h + step; y += step * .866, row++) for (let x = (row % 2) * step / 2; x < w + step; x += step) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
}
function brandTitle(c, x, y, size, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.font = `700 ${size}px Fredoka, Inter, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const parts = [['Mochi', '#ffa040'], [' & ', '#ff6b8b'], ['Pip', '#a9a2c9']];
  const widths = parts.map(([t]) => c.measureText(t).width), total = widths.reduce((a, b) => a + b, 0);
  let cx = -total / 2;
  // sombra 3D del texto
  parts.forEach(([t], i) => { c.fillStyle = '#2b2233'; for (let k = 1; k <= size * .07; k++) c.fillText(t, cx + widths[i] / 2 + k * .4, k); cx += widths[i]; });
  cx = -total / 2;
  parts.forEach(([t, col], i) => {
    const px = cx + widths[i] / 2;
    c.lineWidth = size * .16; c.strokeStyle = '#2b2233'; c.strokeText(t, px, 0);
    c.lineWidth = size * .07; c.strokeStyle = '#ffffff'; c.strokeText(t, px, 0);
    c.fillStyle = col; c.fillText(t, px, 0);
    c.save(); c.globalAlpha = .35; c.fillStyle = '#fff'; c.beginPath(); c.rect(px - widths[i] / 2, -size * .45, widths[i], size * .25); c.clip(); c.fillText(t, px, 0); c.restore();
    cx += widths[i];
  });
  c.restore();
}


// ---------- cámara: [escala, centro x, centro y] en coordenadas 2D del mundo ----------
function placeCamera(t, c) {
  const target = new THREE.Vector3(U(c.cx), V(c.cy), Z_CHAR - .2);
  const d = (19.2 / c.s / 2) / Math.tan(THREE.MathUtils.degToRad(17.5));
  const yaw = .1 + Math.sin(t * .35) * .1, pitch = .1;
  camera.position.set(target.x + Math.sin(yaw) * d * Math.cos(pitch), target.y + Math.sin(pitch) * d, target.z + Math.cos(yaw) * d * Math.cos(pitch));
  camera.lookAt(target); camera.updateMatrixWorld();
}
function endCard(t, t0, part) {
  if (t < t0) return;
  const p = easeOutBack(seg(t, t0, t0 + .3));
  ctx.save(); ctx.translate(W / 2, 300); ctx.scale(p, p); brandTitle(ctx, 0, 0, 150, -.03); ctx.restore();
  if (t > t0 + .35) caption(`PART ${part} ⏳`, t, t0 + .35, 99, { size: 70, y: 450 });
}
function resetFx() { for (const p of [hearts, heartsPink, spritesW, spritesY, puffs, crumbs, drops]) p.reset(); cloud.visible = false; bulb.visible = false; }
function finishFrame() { octx.drawImage(renderer.domElement, 0, 0); octx.drawImage(overlay, 0, 0); }
function startEpisode(render) {
  window.render = render; window.DURATION = DURATION; window.ready = true;
  if (!navigator.webdriver) {
    document.body.classList.add('preview');
    const start = performance.now();
    (function loop() { render(((performance.now() - start) / 1000) % DURATION); requestAnimationFrame(loop); })();
  }
}
