// =====================================================================
//  EPISODIO 10 (3D) — "Popcorn 🍿"   36 s · 9:16 · música: "Fluffing a Duck" (Kevin MacLeod, CC BY 4.0)
//  GANCHO (0–2.4 s de vídeo): Mochi sentado en la olla… ¡BOOM! y sale volando a cámara lenta.
//  REBOBINADO estilo VHS (2.4–2.9) y empieza la historia (tiempo de historia = vídeo − 2.9):
//  1 (0–4.6)    Pip hace palomitas en una ollita.
//  2 (4.6–10.2) Mochi se asoma… una palomita le explota en la nariz a cámara lenta. ¡BONK!
//  3 (10.2–15.5) Intenta cazarlas con la boca: nariz, oreja… y la tercera cae en la cabeza de Pip.
//  4 (15.5–20)  Idea: un saco ENORME de maíz dentro de la ollita; tapa y se sienta encima.
//  5 (20–24.6)  La olla tiembla, se hincha… silencio total (coincide con la pausa de la canción).
//  6 (24.6–29.6) ¡BOOM! Géiser de palomitas a cámara lenta; Mochi vuela y se las come al vuelo.
//  7 (29.6–33)  Montaña de palomitas; Mochi con mofletes de hámster; hipo… palomita a la cabeza de Pip.
// =====================================================================
const DURATION = 36;
const HOOK = 2.4, REW = .5, OFF = HOOK + REW;   // el vídeo arranca con el gancho y rebobina
const HOOK_S0 = 24.5, HOOK_K = (26.65 - HOOK_S0) / HOOK;   // el gancho enseña la olla, el BOOM y el vuelo
const MS = .72;                                   // Mochi más pequeño en este episodio (cabe mejor en vertical)
const SHOTS = [0, 4.6, 10.2, 15.5, 20, 24.6, 29.6, 99];
const shotOf = s => { let i = 0; while (i < 6 && s >= SHOTS[i + 1]) i++; return i; };

// ---------- disposición ----------
const POT = V3(0, .36, .6);           // base de la olla (encima del fogón)
const POT_R = .34, POT_H = .36, RIM_Y = POT.y + POT_H;
const STOOL = V3(-1.12, 0, .72), STOOL_H = .36;
const MUG = V3(-1.95, 0, 1.05);
const MOUND = V3(0, 0, .3), MOUND_R = 3.4, MOUND_H = 2.25;
const shapeM = r => Math.pow(Math.max(0, 1 - (r / MOUND_R) ** 2), .8);
const BOOM = 24.6, KPOP = 7.3;
const HX = .95, HZ = -.35, HYAW = -.79;   // sitio de Mochi detrás del fogón (mira a la olla y a cámara)

// ---------- tiempo físico (cámara lenta) ----------
const SLOW = [[24.75, 24.95, .2], [28.4, 28.6, 1]];   // rampas de velocidad
const rateAt = s => { if (s < SLOW[0][0]) return 1; if (s < SLOW[0][1]) return lerp(1, .2, seg(s, SLOW[0][0], SLOW[0][1])); if (s < SLOW[1][0]) return .2; if (s < SLOW[1][1]) return lerp(.2, 1, seg(s, SLOW[1][0], SLOW[1][1])); return 1; };
const TAUT = (() => { const dt = 1 / 600, n = Math.ceil(40 / dt), a = new Float32Array(n + 1); for (let i = 1; i <= n; i++) a[i] = a[i - 1] + rateAt((i - .5) * dt) * dt; return { a, dt }; })();
const phys = s => { const f = clamp(s, 0, 39.9) / TAUT.dt, i = Math.floor(f); return TAUT.a[i] + (TAUT.a[i + 1] - TAUT.a[i]) * (f - i); };
const P0 = phys(BOOM);

// ---------- geometrías: palomita y grano ----------
function mergeIndexed(list) {
  const pos = [], nor = [], col = [], idx = []; let off = 0;
  for (const { g, color } of list) {
    const p = g.attributes.position.array, n = g.attributes.normal.array, c = new THREE.Color(color);
    for (let i = 0; i < p.length; i += 3) { pos.push(p[i], p[i + 1], p[i + 2]); nor.push(n[i], n[i + 1], n[i + 2]); col.push(c.r, c.g, c.b); }
    for (const k of g.index.array) idx.push(k + off); off += p.length / 3;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); return g;
}
const POPC_GEO = (() => {
  const blobs = [[0, 0, 0, .5, '#ffd88a'], [.42, .14, .05, .42, '#fff6e2'], [-.4, .18, -.1, .45, '#fff8ea'], [.05, .46, .1, .42, '#fffaf0'], [.12, -.34, .22, .37, '#fff3da'], [-.16, -.08, .45, .38, '#fff7e6'], [.22, .1, -.42, .38, '#fff5df'], [-.3, .45, .3, .3, '#fffaf2']];
  const g = mergeIndexed(blobs.map(([x, y, z, r, c]) => { const g = new THREE.SphereGeometry(r, 10, 7); g.scale(1, .88, 1); g.translate(x, y, z); return { g, color: c }; })); g.scale(.45, .45, .45); return g;
})();
const POPC_MAT = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .88, emissive: '#3a2a10', emissiveIntensity: .05 });
const KERN_GEO = (() => { const g = new THREE.SphereGeometry(1, 8, 6); g.scale(.05, .04, .045); return g; })();
const KERN_MAT = gloss('#f2a930', { roughness: .35 });
const popc = (s = .22) => { const m = new THREE.Mesh(POPC_GEO, POPC_MAT); m.scale.setScalar(s); m.castShadow = true; m.receiveShadow = true; scene.add(m); return m; };

// ---------- fogón, olla, taburete, taza ----------
const stove = new THREE.Group(); stove.position.set(POT.x, 0, POT.z); scene.add(stove);
{
  stove.add(mesh(new THREE.BoxGeometry(1.7, .34, 1.15), mat('#9fdcc8', .45), { y: .17 }));
  stove.add(mesh(new THREE.BoxGeometry(1.72, .03, 1.17), mat('#f5f7f8', .3, { metalness: .3 }), { y: .345 }));
  for (const x of [-.55, .55]) stove.add(mesh(SPH, mat('#ffcf6b', .3), { x, y: .17, z: .58, sx: .07, sy: .07, sz: .04 }));
  stove.add(mesh(new THREE.TorusGeometry(.26, .03, 8, 32), mat('#3a3640', .4, { metalness: .5 }), { y: .36, rx: Math.PI / 2 }));
}
const flames = []; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; const f = mesh(new THREE.ConeGeometry(.035, .12, 8), new THREE.MeshBasicMaterial({ color: '#69b8ff', transparent: true, opacity: .85 }), { x: Math.cos(a) * .2, y: .4, z: Math.sin(a) * .2, shadow: false }); stove.add(f); flames.push(f); }
const potG = new THREE.Group(); potG.position.copy(POT); scene.add(potG);
const potSq = new THREE.Group(); potG.add(potSq);
const ENAMEL = gloss('#ff7088', { roughness: .22 });
{
  const pts = [[0, .0], [.3, .0], [.34, .04], [.35, .34], [.37, .36], [.355, .375], [.33, .35], [.32, .06], [0, .06]].map(([x, y]) => new THREE.Vector2(x, y));
  potSq.add(mesh(new THREE.LatheGeometry(pts, 48), ENAMEL));
  potSq.add(mesh(new THREE.TorusGeometry(.355, .012, 8, 48), mat('#ffffff', .3), { y: .22, rx: Math.PI / 2, shadow: false }));
  for (const s of [-1, 1]) potSq.add(mesh(new THREE.TorusGeometry(.06, .022, 8, 16, Math.PI), mat('#3a3640', .4), { x: s * .38, y: .28, ry: Math.PI / 2, rz: 0 }));
}
const potInside = mesh(new THREE.CircleGeometry(.315, 32), mat('#ffd27a', .7), { y: .07, rx: -Math.PI / 2, shadow: false }); potSq.add(potInside);
const lid = new THREE.Group(); scene.add(lid);
{
  const pts = [[0, .1], [.12, .095], [.25, .06], [.37, .015], [.37, 0], [0, 0]].map(([x, y]) => new THREE.Vector2(x, y));
  lid.add(mesh(new THREE.LatheGeometry(pts, 48), ENAMEL));
  lid.add(mesh(SPH, mat('#3a3640', .4), { y: .13, sx: .06, sy: .05, sz: .06 }));
}
const stool = new THREE.Group(); stool.position.copy(STOOL); scene.add(stool);
stool.add(mesh(new THREE.BoxGeometry(.5, STOOL_H, .46), mat('#d79a62', .55), { y: STOOL_H / 2 }));
stool.add(mesh(new THREE.BoxGeometry(.52, .03, .48), mat('#e8b07c', .5), { y: STOOL_H }));
const mug = new THREE.Group(); mug.position.copy(MUG); scene.add(mug);
{
  const pts = [[0, 0], [.4, 0], [.44, .04], [.46, .8], [.42, .8], [.4, .06], [0, .06]].map(([x, y]) => new THREE.Vector2(x, y));
  mug.add(mesh(new THREE.LatheGeometry(pts, 40), gloss('#9fd1ff', { roughness: .25 })));
  mug.add(mesh(new THREE.TorusGeometry(.2, .05, 10, 24), gloss('#9fd1ff', { roughness: .25 }), { x: .5, y: .42, rz: 0 }));
  mug.add(mesh(HEART_GEO, M.red, { y: .45, z: .46, sx: 1.1, sy: 1.1, sz: .4, shadow: false }));
}
// saco de maíz
const burlapTex = canvasTex(256, 256, (c, w, h) => {
  c.fillStyle = '#d6b07a'; c.fillRect(0, 0, w, h);
  for (let i = 0; i < w; i += 6) { c.fillStyle = `rgba(120,80,40,${.12 + (i % 12 ? .05 : .12)})`; c.fillRect(i, 0, 2, h); c.fillRect(0, i, w, 2); }
  c.fillStyle = 'rgba(255,200,80,.85)'; c.beginPath(); c.arc(128, 140, 46, 0, 7); c.fill();
  c.fillStyle = 'rgba(255,240,200,.95)'; for (const [x, y, r] of [[112, 128, 18], [142, 124, 16], [128, 150, 18], [104, 152, 13], [150, 152, 13]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
});
const sack = new THREE.Group(); scene.add(sack);
const sackIn = new THREE.Group(); sack.add(sackIn);
{
  const pts = []; for (let i = 0; i <= 24; i++) { const y = i / 24 * 2.3; const r = .86 * Math.pow(Math.sin(Math.PI * Math.min(.96, y / 2.35)), .55) + (y > 1.95 ? -.25 * (y - 1.95) / .35 : 0); pts.push(new THREE.Vector2(Math.max(.05, r), y)); }
  const sm = mesh(new THREE.LatheGeometry(pts, 40), mat('#ffffff', .95, { map: burlapTex })); sm.rotation.y = -Math.PI / 2; sackIn.add(sm);
  sackIn.add(mesh(new THREE.TorusGeometry(.2, .04, 8, 20), mat('#a0703c', .8), { y: 2.0, rx: Math.PI / 2 }));
  for (let i = 0; i < 9; i++) sackIn.add(mesh(KERN_GEO, KERN_MAT, { x: (rnd(i) - .5) * .25, y: 2.28 + rnd(i + 3) * .05, z: (rnd(i + 5) - .5) * .25, sx: 1.4, sy: 1.4, sz: 1.4 }));
}
const sackMouth = new THREE.Object3D(); sackMouth.position.set(0, 2.32, 0); sackIn.add(sackMouth);
// montaña de palomitas
const moundTex = canvasTex(512, 512, (c, w, h) => {
  c.fillStyle = '#f6e2b8'; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 420; i++) { const x = rnd(i) * w, y = rnd(i + 1) * h, r = 10 + rnd(i + 2) * 18; const g = c.createRadialGradient(x - r * .3, y - r * .3, 1, x, y, r); g.addColorStop(0, '#fffdf6'); g.addColorStop(.7, '#fbefd6'); g.addColorStop(1, 'rgba(225,190,130,.9)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
});
moundTex.wrapS = moundTex.wrapT = THREE.RepeatWrapping; moundTex.repeat.set(10, 4);
const mound = (() => {
  const pts = []; for (let i = 0; i <= 32; i++) { const r = MOUND_R * (1 - i / 32); pts.push(new THREE.Vector2(r + .001, shapeM(r))); }
  const g = new THREE.LatheGeometry(pts.reverse().reverse(), 96); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); const n = .05 * (Math.sin(x * 7.1 + z * 3.3) + Math.sin(z * 8.3 - x * 2.7)); p.setY(i, p.getY(i) + n * (p.getY(i) > .02 ? 1 : 0) / MOUND_H); }
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat('#ffffff', .92, { map: moundTex })); m.castShadow = m.receiveShadow = true; m.position.copy(MOUND); scene.add(m); return m;
})();
// palomitas del géiser (instanciadas) y granos del saco
const NPOP = 900, NKER = 200;
const swarm = new THREE.InstancedMesh(POPC_GEO, POPC_MAT, NPOP); swarm.castShadow = true; swarm.receiveShadow = true; swarm.frustumCulled = false; scene.add(swarm);
const kernels = new THREE.InstancedMesh(KERN_GEO, KERN_MAT, NKER); kernels.castShadow = true; kernels.frustumCulled = false; scene.add(kernels);
const SW = [];
for (let i = 0; i < NPOP; i++) {
  const front = rnd(i + 900) < .16, a = rnd(i) * TAU, r = MOUND_R * Math.sqrt(rnd(i + 300)) * .97;
  const tl = P0 + Math.pow(rnd(i + 600), 1.6) * .55, D = .55 + rnd(i + 700) * .75;
  const end = front ? V3((rnd(i + 11) - .5) * 6, -.3, 3.5 + rnd(i + 12) * 4) : V3(MOUND.x + Math.cos(a) * r, 0, MOUND.z + Math.sin(a) * r);
  SW.push({ tl, D, end, r: front ? 99 : r, h: 3 + rnd(i + 800) * 5.5, s: .17 + rnd(i + 50) * .1, ax: V3(rnd(i + 1) - .5, rnd(i + 2) - .5, rnd(i + 3) - .5).normalize(), sp: 4 + rnd(i + 4) * 8,
    off: V3((rnd(i + 21) - .5) * .5, 0, (rnd(i + 22) - .9) * .5) });
}
const moundH = p => MOUND_H * E.io(clamp((p - P0 - .3) / 1.3));
for (const w of SW) { w.yEnd = w.r < 50 ? moundH(w.tl + w.D) * shapeM(w.r) + .06 : -.3; }
const KS = []; for (let i = 0; i < NKER; i++) KS.push({ t0: 17.55 + i / NKER * 1.0, spill: rnd(i + 40) < .3, a: rnd(i) * TAU, r: rnd(i + 2), s: .8 + rnd(i + 3) * .5 });

// ---------- extras de los personajes ----------
mochi.root.scale.setScalar(MS); sack.scale.setScalar(.8);
const cheeks = [-1, 1].map(s => { const m = mesh(SPH, MC.fur, { x: s * .62, y: -.25, z: .38, sx: .01, sy: .01, sz: .01 }); mochi.hT.add(m); return m; });
const sweat = mesh(SPH, gloss('#9fdcff', { transparent: true, opacity: .85 }), { sx: .07, sy: .1, sz: .05, shadow: false }); scene.add(sweat);
const earPop = popc(.2); const headPop = popc(.17);
const FP = Array.from({ length: 12 }, () => popc(.22));   // palomitas "actrices"
const FK = Array.from({ length: 4 }, () => { const m = mesh(KERN_GEO, KERN_MAT, { sx: 1.1, sy: 1.1, sz: 1.1 }); scene.add(m); return m; });

// =====================================================================
//  GUION
// =====================================================================
const MO = new Rig({ x: 4.5, y: 0, z: .9, yaw: -1.2, lean: 0, roll: 0, sx: 1, sy: 1, sz: 1, wr: 0, wamt: 0,
  aLf: .15, aLo: .22, aRf: .15, aRo: .22, hp: 0, hy: 0, hr: 0, hs: 1, eb: 1, pd: 1, lid: 0, lx: 0, ly: 0, sp: 0,
  mo: 0, tg: 0, tu: 0, lk: 0, br: 0, brA: 1, tw: 1, wg: 0, sn: 0, pk: 0, ed: 0, sit: 0, cross: 0, ck: 0, chew: 0 });
const MMODE = new Steps('hidden');
const PI_ = new Rig({ x: STOOL.x, y: STOOL_H, z: STOOL.z, yaw: 1.15, lean: 0, roll: 0, sx: 1, sy: 1, wr: 0, wamt: 0,
  aLf: .1, aLo: .25, aRf: .1, aRo: .25, hp: 0, hy: 0, hr: 0, lid: 0, lx: 0, ly: 0, sm: 1, mo: 0, ed: 0, must: 0, rub: 0, kick: 0, fid: 0, tailUp: 0, chew: 0, wave: 0 });
const LD = new Rig({ x: POT.x - .2, y: RIM_Y + .07, z: POT.z, rx: 0, rz: .45 });        // tapa
const RUM = new Rig({ r: 0 });                                                          // temblor de la olla
const SK = new Rig({ on: 0, tilt: 0, fx: 0, fy: 0, fz: 0 });                            // saco
const KM = (t, v, e) => MO.key(t, v, e), P = (t, v, e) => PI_.key(t, v, e), L_ = (t, v, e) => LD.key(t, v, e);

// ---------------- 1 (0–4.6): Pip hace palomitas ----------------
P(0, { aRf: .1, aRo: .25, lean: 0, lid: 0 }); P(.25, { aRf: 1.5, aRo: -.2, lean: .25 }); P(.95, { aRf: 1.5 }); P(1.1, { aRf: 1.2, aRo: -.4 });
L_(1.05, { x: POT.x - .2, y: RIM_Y + .07, rz: .45 }); L_(1.3, { x: POT.x, y: RIM_Y, rz: 0 }, 'o');
P(1.35, { aRf: .1, aRo: .25, lean: 0 }); P(1.6, { aLf: -.35, aLo: .75, aRf: -.35, aRo: .75, lean: -.15, hp: -.25, lid: .9, sy: 1.06 }, 'back');
const POPS1 = [2.4, 2.9, 3.15];
for (const pt of POPS1) { L_(pt, { y: RIM_Y }); L_(pt + .06, { y: RIM_Y + .09 }, 'o'); L_(pt + .16, { y: RIM_Y }, 'iq'); }
P(2.4, { lid: .9, sy: 1.06, y: STOOL_H }); P(2.45, { lid: 0, sy: 1.15, y: STOOL_H + .08 }, 'o'); P(2.6, { y: STOOL_H, sy: 1 }, 'iq');
P(2.45, { aLf: -.35, aRf: -.35, aLo: .75, aRo: .75, hp: -.25 }); P(2.6, { aLf: .9, aRf: .9, aLo: -.5, aRo: -.5, hp: 0, lean: 0 });
P(3.3, { aRf: .9, aRo: -.5, lean: 0 }); P(3.45, { aRf: 2.1, aRo: -.3, lean: .2 });
L_(3.4, { x: POT.x, y: RIM_Y, rz: 0, rx: 0 }); L_(3.7, { x: POT.x - .58, y: .52, rz: .5 }, 'io'); L_(3.95, { x: POT.x - .6, y: .38, z: POT.z - .2, rz: .08 }, 'o');
P(3.75, { aRf: 2.1, aLf: .9 }); P(3.95, { aLf: 1.25, aRf: 1.25, aLo: -.45, aRo: -.45, lean: 0, hp: .15 });
P(4.05, { lid: 0, chew: 0, sm: 1 }); P(4.2, { lid: .85, chew: 1 }); P(4.6, { lid: .85, chew: 1 });
// ---------------- 2 (4.6–10.2): se asoma y ¡BONK! ----------------
MMODE.at(4.6, 'full');
KM(4.6, { x: 4.6, z: HZ, yaw: -1.2, wr: 2.2, wamt: 1, lid: .4 }); KM(5.75, { wr: 2.2, wamt: 1 }); KM(5.9, { x: HX, wr: 0, wamt: 0 }, 'o'); KM(5.7, { yaw: -1.2 }); KM(5.95, { yaw: HYAW });
KM(5.2, { sn: 0, hp: 0, lid: .4 }); KM(5.4, { sn: 1, hp: -.25, lid: .9 }); KM(5.75, { sn: 1 }); KM(5.85, { sn: 0, lid: 0, hp: 0 });
KM(5.95, { eb: 1, sp: 0, ly: 0 }); KM(6.15, { eb: 1.35, sp: .8, ly: -.3, lx: -.4 }, 'back'); KM(6.1, { tg: 0, lk: 0 }); KM(6.3, { tg: .6, lk: 1, mo: .3 }); KM(6.6, { tg: 0, lk: 0, mo: 0 });
P(4.6, { chew: 1, lid: .85 }); P(5.0, { chew: 0, lid: 0, hy: .5, lx: .6, ed: .3 }); P(5.3, { aLf: 1.25, aRf: 1.25, aLo: -.6, aRo: -.6, fid: 1 });
KM(6.6, { x: HX, lean: 0, hp: 0, sp: .8, eb: 1.35, aLf: .15, aRf: .15, aLo: .22, aRo: .22 }); KM(7.15, { x: HX, lean: .45, hp: -.08, sp: 0, eb: 1.15, ly: -.6, lx: 0, aLf: .6, aRf: .6, aLo: .5, aRo: .5 }, 'io');
// la palomita le explota en la nariz (cámara lenta 7.55–8.45)
KM(7.5, { eb: 1.15, cross: 0, pd: 1, ly: -.6 }); KM(7.9, { eb: 1.5, cross: 1, pd: .6, ly: 0 }, 'io'); KM(8.45, { eb: 1.6, cross: 1 });
const BONK = 8.45;
KM(BONK, { x: HX, z: HZ, lean: .45, y: 0, sit: 0, sy: 1, sx: 1 });
KM(BONK + .18, { x: HX + .5, z: HZ - .5, lean: -.55, y: .45, sy: 1.2, sx: .9, eb: 1.3, cross: 0, aLf: 2.4, aRf: 2.4, aLo: .8, aRo: .8 }, 'o');
KM(BONK + .18, { hp: -.2 }); KM(BONK + .42, { lean: -.25, y: 0, sit: 1, sy: .78, sx: 1.18 }, 'iq'); KM(BONK + .62, { sy: 1, sx: 1 }, 'back');
KM(BONK + .45, { lid: .5, ed: .8, hr: 0 }); KM(9.6, { lid: .5, ed: .8 }); KM(9.75, { lid: 0, ed: 0, hr: .2 }); KM(9.9, { hr: -.2 }); KM(10.05, { hr: 0 });
KM(9.65, { sit: 1, lean: -.25, y: 0, x: HX + .5, z: HZ - .5, aLf: 2.4, aRf: 2.4 }); KM(10.1, { sit: 0, lean: 0, aLf: .15, aRf: .15, aLo: .22, aRo: .22 }, 'back');
P(8.9, { fid: 0, hy: .5, lid: 0, sm: 1, aLf: 1.25, aRf: 1.25, aLo: -.6, aRo: -.6 }); P(9.0, { lid: .9, aLf: 2.2, aLo: -.75, hy: .2, sy: 1 });
for (let k = 0; k < 5; k++) { P(9.0 + k * .18, { sy: 1.08, y: STOOL_H + .04 }); P(9.09 + k * .18, { sy: .95, y: STOOL_H }); }
P(9.95, { lid: .9, aLf: 2.2, aLo: -.75 }); P(10.15, { lid: 0, aLf: .1, aLo: .25, aRf: .1, aRo: .25, sy: 1, hy: .3 });
// ---------------- 3 (10.2–15.5): cazarlas al vuelo ----------------
const C1 = 10.6, C2 = 12.0, C3 = 13.25;
KM(10.2, { x: HX + .5, z: HZ - .5, yaw: HYAW, mo: 0, br: 0 }); KM(10.4, { x: HX, z: HZ, mo: 1.2, br: 1, brA: 1.1, hp: -.25, ly: -.1, tw: 2 }, 'io');
KM(C1 + .4, { mo: 1.2, cross: 0, eb: 1 }); KM(C1 + .45, { cross: 1, mo: .2, eb: 1.3, hp: -.1 }); KM(C1 + .9, { cross: 1 }); KM(C1 + 1.1, { cross: 0, eb: 1, mo: 1.2, hp: -.25 });
KM(C2 + .48, { ed: 0, ly: -.1, lx: 0 }); KM(C2 + .55, { ed: .9, ly: .6, lx: .4, mo: .3 }); KM(C2 + .75, { ed: 0 }); KM(C2 + .95, { ed: .7 }); KM(C2 + 1.2, { ed: 0, ly: -.1, lx: 0, mo: 1.2 });
KM(C3 + .15, { x: HX, z: HZ, lean: 0, mo: 1.2, hy: 0 }); KM(C3 + .38, { x: HX - .45, z: HZ + .3, lean: .35, mo: 1.5, hy: -.3, y: .25 }, 'o'); KM(C3 + .45, { mo: 0, y: 0 }); KM(C3 + .6, { x: HX - .35, z: HZ + .2, lean: .1, hy: 0 });
KM(C3 + 1.1, { lid: 0, ed: 0, hp: -.25, br: 1 }); KM(C3 + 1.4, { lid: .35, ed: .7, hp: .25, br: 0, mo: 0, ly: -.3, lx: -.5 }); KM(15.3, { lid: .35, ed: .7 });
P(C3 + .7, { lid: 0, hp: 0, aLf: .1, aRf: .1, aLo: .25, aRo: .25, hy: .3 }); P(C3 + .85, { lid: .5, ly: .7 }); P(C3 + 1.05, { aLf: 2.6, aRf: 2.6, aLo: -.3, aRo: -.3 });
P(C3 + 1.3, { chew: 0, aLf: 1.25, aRf: 1.25, aLo: -.5, aRo: -.5, ly: 0, lid: 0 }); P(C3 + 1.4, { chew: 1, lid: .85, hy: .4 }); P(15.4, { chew: 1, lid: .85 }); P(15.6, { chew: 0, lid: 0 });
// ---------------- 4 (15.5–20): el saco gigante ----------------
const IDEA = 15.65, ZIP = 16.25, BACK0 = 16.75, BACK1 = 17.45, POUR0 = 17.5, POUR1 = 18.55, SLAM = 19.05, SIT = 19.55;
KM(IDEA, { lid: .35, ed: .7, hp: .25, sp: 0, mo: 0 }); KM(IDEA + .2, { lid: 0, ed: 0, hp: -.1, sp: 1, eb: 1.3, mo: .4, br: 1, brA: 1.2, ly: .3, lx: 0 }, 'back');
KM(ZIP - .05, { yaw: HYAW, lean: 0, sy: 1, x: HX - .35 }); KM(ZIP + .05, { yaw: 1.4, lean: -.4, sy: .82 }); KM(ZIP + .08, { x: HX - .35 }); KM(ZIP + .25, { x: 9, sz: 1.8, lean: .4 }, 'i');
MMODE.at(ZIP + .26, 'hidden').at(BACK0, 'full');
KM(BACK0 - .05, { x: 6.0, z: HZ, yaw: -1.2, sz: 1, sy: 1, sx: 1, lean: -.15, wr: 3.6, wamt: 1, sp: 0, eb: 1.1, aLf: 1.35, aRf: 1.35, aLo: -.75, aRo: -.75, mo: .3, ly: 0 });
KM(BACK1, { x: HX + .2, yaw: HYAW, wr: 3.6, wamt: 1 }, 'o'); KM(BACK1 + .08, { wr: 0, wamt: 0 });
SK.key(BACK0 - .05, { on: 1, tilt: 0 }); SK.key(POUR0, { tilt: 0 }); SK.key(POUR0 + .35, { tilt: .75 }, 'io'); SK.key(POUR1, { tilt: .8 }); SK.key(POUR1 + .05, { on: 1, fx: 0, fy: 0 });
SK.key(POUR1 + .45, { on: 2, fx: 6, fy: 2.4 }, 'o');
KM(POUR1, { aLf: 1.35, aRf: 1.35, aLo: -.75, aRo: -.75 }); KM(POUR1 + .15, { aLf: 2.6, aRf: 2.4, aLo: .2, aRo: .2 }, 'o');
P(POUR0 - .2, { yaw: 1.15, lid: 0, mo: 0, chew: 0, fid: 0 }); P(POUR0, { mo: 1, wave: 1, aLf: 2.6, aRf: 2.6, aLo: .3, aRo: .3, hy: .3, lx: .6 }); P(SLAM, { wave: 1, mo: 1 }); P(SLAM + .2, { wave: 0, mo: .5, aLf: 1.25, aRf: 1.25, aLo: -.6, aRo: -.6, fid: 1 });
L_(SLAM - .3, { x: POT.x - .6, y: .38, z: POT.z - .2, rz: .08 }); L_(SLAM, { x: POT.x, y: RIM_Y + .02, z: POT.z, rz: 0 }, 'o');
KM(SLAM - .3, { aLf: 2.6, aRf: 2.4, x: HX + .2, lean: 0 }); KM(SLAM - .05, { aRf: 1.4, aLf: 1.2, lean: .45, x: HX }, 'o');
KM(SIT - .4, { x: HX, y: 0, z: HZ, lean: .45, sit: 0, yaw: HYAW }); KM(SIT - .3, { sy: .8, lean: .2 });
KM(SIT - .1, { y: 1.3, x: .6, z: .1, sy: 1.15, lean: 0, yaw: -.5 }, 'oq'); KM(SIT, { y: RIM_Y + .02, x: POT.x, z: POT.z + .05, sit: 1 }, 'iq');
KM(SIT + .06, { sy: .78, sx: 1.15 }, 'o'); KM(SIT + .3, { sy: 1, sx: 1 }, 'back');
KM(SIT + .1, { aLf: 1.4, aRf: 1.4, aLo: -.95, aRo: -.95, lid: .5, mo: 0, br: .7, brA: 1.3, hp: -.15, tw: 1.5, yaw: -.35, ly: 0, lx: .3 });
// ---------------- 5 (20–24.6): tiembla… silencio ----------------
const FREEZE = 23.62;
RUM.key(20.0, { r: 0 }); RUM.key(21.0, { r: .3 }); RUM.key(22.4, { r: .7 }); RUM.key(FREEZE - .02, { r: 1.05 }, 'i'); RUM.key(FREEZE, { r: 0 }, 'hold');
KM(21.5, { lid: .5, br: .7, eb: 1, hp: -.15, lx: .3 }); KM(21.8, { lid: 0, br: 0, eb: 1.2, hp: .15, ly: -.5, lx: 0, ed: .4 }, 'o');
KM(22.6, { eb: 1.2, mo: 0 }); KM(22.75, { eb: 1.45, mo: .35, ed: .7, aLf: .8, aRf: .8, aLo: .9, aRo: .9 }, 'back');
KM(FREEZE + .1, { hy: 0, ly: -.5, yaw: -.35 }); KM(FREEZE + .55, { hy: .35, ly: 0, lx: .15 }, 'io'); KM(24.15, { sy: 1 }); KM(24.22, { sy: .94 }); KM(24.32, { sy: 1 });
P(20.25, { x: STOOL.x, y: STOOL_H, yaw: 1.15, fid: 1 }); P(20.3, { fid: 0, yaw: -1.6 }); P(20.4, { y: STOOL_H + .25, x: -1.35 }, 'oq'); P(20.55, { y: 0, x: -1.55 }, 'iq');
P(20.6, { wr: 0, wamt: 0, z: STOOL.z }); P(20.65, { wr: 6, wamt: 1 }); P(21.15, { x: -2.15, z: .5, wr: 6, wamt: 1 }, 'io'); P(21.2, { wr: 0, wamt: 0 });
P(21.15, { yaw: -1.6 }); P(21.4, { yaw: .5 }); P(21.4, { aLf: 1.25, aRf: 1.25, aLo: -.6, aRo: -.6, mo: .5 }); P(21.6, { aLf: 2.75, aRf: 2.75, aLo: -.35, aRo: -.35, ed: .3 });
P(21.6, { x: -2.15, roll: 0 }); P(21.9, { x: -2.42, roll: -.25 }, 'io');
// ---------------- 6 (24.6–29.6): ¡BOOM! ----------------
MMODE.at(BOOM, 'fly');
P(BOOM, { mo: .5, lid: 0 }); P(BOOM + .1, { mo: 1, aLf: 2.75 });
const GULPS = [25.75, 26.45, 27.1, 27.75];
// ---------------- 7 (29.6–33): montaña ----------------
const PIPUP = 29.95, MOUP = 30.4, HIC = 31.65;
const PIP_END = V3(-1.35, 0, 1.35), MO_END = V3(.3, 0, .1);
P(28.85, { x: -2.42, z: .5, roll: -.25, yaw: .5, aLf: 2.75, aRf: 2.75, aLo: -.35, aRo: -.35, mo: 1, ed: .3, lid: 0, sm: 1, chew: 0 });
P(28.9, { x: PIP_END.x, z: PIP_END.z, roll: 0, yaw: .45, aLf: .1, aRf: .1, aLo: .25, aRo: .25, mo: 0, ed: 0, lid: 0, sm: 1, chew: 0 });
P(PIPUP + .5, { chew: 0, aLf: 1.25, aRf: 1.25, aLo: -.5, aRo: -.5 }); P(PIPUP + .6, { chew: 1, lid: .85 });
P(HIC + .5, { chew: 1, lid: .85, hy: 0 }); P(HIC + .58, { chew: 0, lid: .45, sm: 0 }); P(HIC + .9, { hy: -.35, lx: -.3, yaw: .45 });
for (const r of [MO, PI_, LD, RUM, SK]) r.done();

// ---------- trayectorias ----------
const arc = (p0, p1, u, h) => V3(lerp(p0.x, p1.x, u), lerp(p0.y, p1.y, u) + 4 * h * u * (1 - u), lerp(p0.z, p1.z, u));
const POT_MOUTH = () => V3(POT.x, RIM_Y + .05, POT.z);
const FL_END = V3(-.2, 0, 1.9), FL_R = Math.hypot(FL_END.x - MOUND.x, FL_END.z - MOUND.z);
const MO_LAUNCH = V3(POT.x, RIM_Y, POT.z + .05), G = 28, VUP = Math.sqrt(2 * G * 5.9);
function mochiFlight(s) {          // vuelo de Mochi con el tiempo físico
  const u = phys(s) - P0;
  const y = MO_LAUNCH.y + VUP * u - G * u * u / 2, k = clamp(u / 1.25);
  const k2 = E.o(clamp(u / .7));
  return { pos: V3(lerp(MO_LAUNCH.x, FL_END.x, k2), y, lerp(MO_LAUNCH.z, FL_END.z, k2)), u, vy: VUP - G * u };
}
const LAND_S_ = () => { for (let x = BOOM; x < 32; x += .005) if (phys(x) - P0 >= LAND_U) return x; return 99; };
const LAND_U = (() => { for (let u = .7; u < 3; u += .002) { const y = MO_LAUNCH.y + VUP * u - G * u * u / 2; if (y < MOUND_H * shapeM(FL_R) - .15) return u; } return 2; })();

const LAND_S = LAND_S_();
function mochiState(s) {
  const st = {}; for (const k in MO.d) st[k] = MO.val(k, s);
  st.walk = MO.integ('wr', s); st.mode = MMODE.get(s);
  st.roll += Math.sin(s * 14) * .07 * st.wg;
  if (st.mode === 'full') st.sy *= 1 + Math.sin(s * 3.2) * .012;
  // temblor sobre la olla
  const rr = RUM.val('r', s); if (rr > 0 && s > SIT) { st.y += Math.abs(Math.sin(s * 11)) * .14 * rr; st.roll += Math.sin(s * 23) * .05 * rr; }
  if (st.mode === 'fly') {
    const f = mochiFlight(s), u = f.u;
    st.mode = u >= LAND_U ? 'hidden' : 'full';
    st.x = f.pos.x; st.y = f.pos.y; st.z = f.pos.z; st.sit = 0;
    const k = clamp(u / .35);
    st.yaw = lerp(-.35, .1, k) + Math.sin(u * 2.2) * .15; st.lean = 0; st.roll = Math.sin(u * 3) * .35 * (1 - clamp((u - .5) / .3)) + Math.sin(s * 1.2) * .08;
    st.sy = u < .12 ? lerp(1.35, 1, u / .12) : 1; st.sx = u < .12 ? lerp(.8, 1, u / .12) : 1; st.sz = 1;
    st.aLf = 2.8 + Math.sin(s * 3) * .15; st.aRf = 2.8 + Math.sin(s * 3 + 1) * .15; st.aLo = 1.2; st.aRo = 1.2;
    st.eb = u < .25 ? 1.6 : 1.25; st.pd = 1; st.lid = 0; st.br = 0; st.ed = 0; st.hy = 0; st.hp = -.1; st.cross = 0; st.lx = 0; st.ly = .2;
    st.mo = 1.3; st.tw = 3; st.sp = u > .3 ? .6 : 0;
    // tragos: la boca se cierra un momento y los mofletes crecen
    let ck = 0; for (const g of GULPS) { if (s > g) ck += .32; if (s > g && s < g + .35) st.mo = .15; }
    st.ck = ck; st.walk = s * 2; st.wamt = .6;
  }
  if (s >= 29.0) {    // asoma la cabeza de la montaña
    const k = easeOutBack(seg(s, MOUP, MOUP + .4)), hic = Math.exp(-((s - HIC) ** 2) / .004) * (s > HIC - .1 ? 1 : 0);
    st.mode = s > MOUP - .05 ? 'head' : 'hidden'; st.hs = .95;
    st.x = MO_END.x; st.z = MO_END.z; st.y = MOUND_H * shapeM(Math.hypot(MO_END.x - MOUND.x, MO_END.z - MOUND.z)) + .5 - (1 - k) * 1.3 + hic * .2 + Math.sin(s * 9) * .02 * (s > HIC + .5 ? 1 : 0);
    st.yaw = -.15; st.lean = 0; st.roll = Math.sin(s * 3) * .05; st.sx = st.sy = st.sz = 1 + hic * .1;
    st.ck = 1.45 - (s > HIC ? .3 : 0); st.lid = s > HIC + .45 ? .92 : (s > HIC - .05 && s < HIC + .3 ? 0 : .88); st.eb = s > HIC - .05 && s < HIC + .3 ? 1.45 : 1; st.mo = s > HIC && s < HIC + .15 ? .7 : 0;
    st.chew = s < HIC ? 1 : 0; st.hp = -.05; st.hy = s > HIC + .45 ? .25 : 0; st.ed = 0; st.cross = 0; st.lx = 0; st.ly = 0; st.br = 0; st.sp = 0;
    if (s > HIC + .45) st.hr = Math.sin(s * 14) * .06;    // risita
  }
  return st;
}
function pipState(s) {
  const st = {}; for (const k in PI_.d) st[k] = PI_.val(k, s);
  st.walk = PI_.integ('wr', s); st.sy *= 1 + Math.sin(s * 4.1) * .015;
  if (st.chew > 0) st.mo = Math.max(st.mo, (Math.sin(s * 22) * .5 + .5) * .6 * st.chew);
  if (st.wave > 0) { st.aLf += Math.sin(s * 18) * .35 * st.wave; st.aRf += Math.sin(s * 18 + 2) * .35 * st.wave; st.y += Math.abs(Math.sin(s * 9)) * .05 * st.wave; }
  st.dripT = 99;
  if (s >= 28.9) {   // sale de la montaña de palomitas
    const k = easeOutBack(seg(s, PIPUP, PIPUP + .35)), r = Math.hypot(PIP_END.x - MOUND.x, PIP_END.z - MOUND.z);
    st.y = MOUND_H * shapeM(r) - .08 - (1 - k) * .7; st.roll += Math.sin(s * 20) * .12 * (1 - seg(s, PIPUP + .3, PIPUP + .7));
  }
  return st;
}

// ---------- cámaras (por plano) + gancho ----------
const CAMS = SHOTS.slice(0, 7).map(() => new Rig({ tx: 0, ty: 1, tz: 0, d: 8, yw: 0, pt: .1, fov: 30, fw: 0, sh: 0, roll: 0 }));
CAMS[0].key(0, { tx: -.48, ty: .66, tz: .7, d: 5.3, yw: .18, pt: .14 }).key(4.6, { tx: -.45, ty: .66, tz: .7, d: 4.8, yw: .1, pt: .12 }, 'io');
CAMS[1].key(4.6, { tx: .85, ty: 1.6, tz: .2, d: 13, yw: .05, pt: .08 }).key(6.2, { tx: .6, ty: 1.55, tz: .2, d: 12.4, yw: .05, pt: .08 }, 'io')
  .key(7.2, { tx: .3, ty: 1.15, tz: .4, d: 6.5, yw: -.25, pt: .04 }, 'io').key(7.55, { fw: 0, tx: .3, ty: 1.15, tz: .4, d: 6.4, yw: -.25, pt: .04 })
  .key(7.551, { fw: 1, d: 4.6, yw: -.72, pt: .06 }).key(BONK, { fw: 1, d: 4.2, yw: -.78, pt: .05 })
  .key(BONK + .01, { fw: 0, tx: .7, ty: 1.55, tz: .1, d: 13, yw: .05, pt: .08 }).key(10.2, { tx: .6, ty: 1.55, tz: .1, d: 12.6, yw: .03, pt: .08 }, 'io');
CAMS[1].key(BONK, { sh: 0 }).key(BONK + .02, { sh: 1 }).key(BONK + .45, { sh: 0 });
CAMS[2].key(10.2, { tx: .6, ty: 1.6, tz: .1, d: 12.6, yw: .0, pt: .08 }).key(C3 + .4, { tx: .55, ty: 1.55, tz: .1, d: 12.0, yw: .0, pt: .08 }, 'io')
  .key(C3 + .8, { tx: -.75, ty: .75, tz: .75, d: 3.6, yw: .12, pt: .1 }, 'io').key(C3 + 1.6, { tx: -.75, ty: .75, tz: .75, d: 3.4, yw: .12, pt: .1 }, 'io')
  .key(C3 + 1.61, { tx: .75, ty: 2.0, tz: -.2, d: 10.0, yw: -.15, pt: .05 }).key(15.5, { tx: .75, ty: 2.0, tz: -.2, d: 9.5, yw: -.15, pt: .05 }, 'io');
CAMS[3].key(15.5, { tx: .75, ty: 2.0, tz: -.2, d: 9.5, yw: -.15, pt: .05 }).key(IDEA + .5, { tx: .75, ty: 2.35, tz: -.2, d: 10.5, yw: -.15, pt: .05 }, 'io')
  .key(ZIP + .3, { tx: 1.4, ty: 1.6, tz: .1, d: 12, yw: .0, pt: .08 }, 'io').key(BACK1, { tx: .75, ty: 1.65, tz: .1, d: 12.5, yw: .05, pt: .08 }, 'io')
  .key(SLAM, { tx: .6, ty: 1.6, tz: .2, d: 12, yw: .08, pt: .08 }, 'io').key(20, { tx: .1, ty: 1.95, tz: .5, d: 10.0, yw: .12, pt: .08 }, 'io');
CAMS[3].key(SLAM, { sh: 0 }).key(SLAM + .02, { sh: .5 }).key(SLAM + .25, { sh: 0 }).key(SIT, { sh: 0 }).key(SIT + .02, { sh: .6 }).key(SIT + .3, { sh: 0 });
CAMS[4].key(20, { tx: -.4, ty: 1.85, tz: .7, d: 10.0, yw: .12, pt: .08 }).key(21.3, { tx: -.75, ty: 1.7, tz: .7, d: 10.0, yw: .1, pt: .08 }, 'io')
  .key(22.45, { tx: .0, ty: 2.4, tz: .7, d: 6.8, yw: .05, pt: .05 }, 'io').key(FREEZE, { tx: .0, ty: 2.6, tz: .7, d: 6.0, yw: .05, pt: .05 }, 'io')
  .key(FREEZE + .01, { tx: .05, ty: 2.7, tz: .8, d: 7.6, yw: .1, pt: .03 }).key(BOOM, { tx: .05, ty: 2.7, tz: .8, d: 7.1, yw: .1, pt: .03 });
CAMS[4].key(20, { sh: 0 }).key(FREEZE - .05, { sh: .35 }, 'i').key(FREEZE, { sh: 0 }, 'hold');
CAMS[5].key(BOOM, { tx: 0, ty: 3.2, tz: .6, d: 12, yw: .05, pt: .02, fw: 0 }).key(BOOM + .3, { fw: 1, d: 9.0, pt: -.05 }, 'o').key(26.6, { fw: 1, d: 7.0, yw: .2, pt: -.1 }, 'io')
  .key(28.2, { fw: .9, d: 7.5, yw: -.15, pt: -.06 }, 'io').key(28.6, { fw: .3, tx: 0, ty: 2.2, tz: .6, d: 9.5, yw: .05, pt: .12 }, 'io').key(29.6, { fw: 0, tx: -.2, ty: 2.0, tz: .6, d: 9.5, yw: .05, pt: .14 }, 'io');
CAMS[5].key(BOOM, { sh: 0 }).key(BOOM + .02, { sh: 1.2 }).key(BOOM + .5, { sh: .2 }).key(28.7, { sh: 0 }).key(28.75, { sh: .8 }).key(29.2, { sh: 0 });
CAMS[6].key(29.6, { tx: -.7, ty: 2.15, tz: .9, d: 9.0, yw: -.3, pt: .12 }).key(HIC - .1, { tx: -.75, ty: 2.15, tz: .9, d: 8.2, yw: -.3, pt: .12 }, 'io')
  .key(HIC + .55, { tx: -.95, ty: 2.1, tz: 1.0, d: 6.4, yw: -.3, pt: .1 }, 'io').key(33.5, { tx: -.95, ty: 2.1, tz: 1.0, d: 6.1, yw: -.3, pt: .1 }, 'io');
CAMS[6].key(HIC, { sh: 0 }).key(HIC + .02, { sh: .3 }).key(HIC + .2, { sh: 0 });
CAMS.forEach(c => c.done());
const HOOK_CAM = (s, m) => {   // plano claro: la olla y Mochi primero; luego sigue su vuelo
  // 1) Mochi sentado en la olla  2) ¡BOOM!: la cámara se abre y se ve la olla y a Mochi saliendo disparado  3) le sigue en el aire
  const a = E.o(seg(s, BOOM + .02, 24.95)), k = E.io(seg(s, 25.05, 25.9)), sh = s > BOOM && s < BOOM + .5 ? (1 - seg(s, BOOM, BOOM + .5)) : 0;
  const w = { tx: .05, ty: lerp(1.55, 3.9, a), tz: .6, d: lerp(8.6, 13.5, a), pt: lerp(.06, .02, a) };
  return { tx: lerp(w.tx, m.x, k) + Math.sin(s * 83) * .08 * sh, ty: lerp(w.ty, m.y + 1.0, k) + Math.cos(s * 71) * .08 * sh, tz: lerp(w.tz, m.z, k), d: lerp(w.d, 7.8, k), yw: lerp(.1, .16, k), pt: lerp(w.pt, -.08, k), fov: 30 };
};

// ---------- mapeo vídeo → historia ----------
function storyTime(v) {
  if (v < HOOK) return HOOK_S0 + v * HOOK_K;
  if (v < OFF) return lerp(HOOK_S0 + HOOK * HOOK_K, 0, E.i(seg(v, HOOK, OFF)));
  return v - OFF;
}

// =====================================================================
//  FOTOGRAMA
// =====================================================================
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s3 = V3(), _p = V3(), _e = new THREE.Euler();
const vhs = document.createElement('canvas'); vhs.width = W; vhs.height = H; const vctx = vhs.getContext('2d');
function headWorld(off) { return mochi.hT.localToWorld(off.clone()); }

function render(v) {
  const s = storyTime(v), hook = v < HOOK, rew = v >= HOOK && v < OFF;
  resetFx(); for (const p of [steamP, puffP, sparkP, dropP, motes]) p.reset();
  const shot = shotOf(s), ps = pip.root; const pp = phys(s);
  const msd = mochiState(s), psd = pipState(s);

  // ---- olla, tapa, fogón ----
  const rr = RUM.val('r', s);
  const bulge = 1 + .14 * rr * Math.abs(Math.sin(s * 9));
  const boomed = s >= BOOM;
  potG.position.set(POT.x + Math.sin(s * 47) * .025 * rr, POT.y, POT.z + Math.cos(s * 53) * .02 * rr);
  potSq.scale.set(bulge, 1 + (bulge - 1) * .6, bulge);
  flames.forEach((f, i) => { f.scale.y = .8 + .4 * Math.abs(Math.sin(s * 13 + i * 1.7)); f.material.opacity = .65 + .25 * Math.sin(s * 9 + i); });
  if (!boomed) {
    lid.visible = true; lid.position.set(LD.val('x', s), LD.val('y', s), LD.val('z', s)); lid.rotation.set(LD.val('rx', s), 0, LD.val('rz', s));
    if (s > SIT) { lid.position.y = RIM_Y + .02 + (msd.y - (RIM_Y + .02)) * .9; lid.position.x = potG.position.x; lid.position.z = potG.position.z; lid.rotation.z = Math.sin(s * 23) * .06 * rr; }
  } else {
    const u = pp - P0; lid.visible = u < 2.2; lid.position.set(POT.x + u * 2.4, RIM_Y + 14 * u - 9 * u * u, POT.z + u * 3.2); lid.rotation.set(u * 9, 0, u * 5);
  }
  // ---- montaña ----
  const mh = boomed ? moundH(pp) : 0;
  mound.visible = mh > .01; mound.scale.set(1, Math.max(.001, mh), 1);
  const buried = h => mh * shapeM(h) ;
  stove.visible = potG.visible = !(mh > 1.0); stool.visible = mh < .9; mug.visible = mh < 1.4;

  // ---- Pip ----
  const pipR = Math.hypot(psd.x - MOUND.x, psd.z - MOUND.z);
  pip.root.visible = !(boomed && s < 28.9 && mh * shapeM(pipR) > .55) && !(s >= 28.9 && s < PIPUP - .02);
  setPip(pip, psd, s);

  // ---- Mochi ----
  setMochi(mochi, msd, s);
  cheeks.forEach(c => { const k = msd.ck; c.visible = k > .02; c.scale.set(.18 + .2 * k, .16 + .17 * k, .14 + .15 * k); c.position.set(Math.sign(c.position.x) * (.6 + .12 * k), -.25 - .05 * k + (msd.chew ? Math.sin(s * 20) * .015 : 0), .38); });
  scene.updateMatrixWorld(true);
  const nose = headWorld(V3(0, -.13, .97)), mouthP = headWorld(V3(0, -.38, .82)), headTop = headWorld(V3(0, .9, 0));
  const pipHead = pip.head.localToWorld(V3(0, .2, 0));

  // ---- saco ----
  const skOn = SK.val('on', s);
  sack.visible = msd.mode === 'full' && s > BACK0 - .06 && s < POUR1 + .5 || (s >= POUR1 && s < POUR1 + .5);
  if (sack.visible) {
    if (s < POUR1 + .05) { const fw = V3(Math.sin(msd.yaw), 0, Math.cos(msd.yaw)); sack.position.set(msd.x + fw.x * .55, .1 + msd.y + Math.abs(Math.sin(msd.walk * Math.PI * 2)) * .05, msd.z + fw.z * .55); sack.rotation.set(0, msd.yaw, 0); sack.rotateX(SK.val('tilt', s)); sack.position.y += SK.val('tilt', s) * .6; }
    else { const k = seg(s, POUR1 + .05, POUR1 + .5); sack.position.set(msd.x + 6 * k, 1.5 + 3 * k - 4 * k * k, msd.z - k); sack.rotateZ(.08); }
  }
  // granos: chorro del saco a la olla
  sack.updateMatrixWorld(true); const mouthS = sackMouth.getWorldPosition(V3());
  for (let i = 0; i < NKER; i++) {
    const k = KS[i]; let vis = s > k.t0 && s < BOOM + .05 && s >= POUR0, p;
    if (vis) {
      const u = clamp((s - k.t0) / .32);
      const tgt = k.spill ? V3(POT.x + Math.cos(k.a) * (.45 + k.r * .5), .37, POT.z + Math.sin(k.a) * (.35 + k.r * .4)) : V3(POT.x + Math.cos(k.a) * k.r * .28, RIM_Y - .05 + clamp((i / NKER - .3) * .5, 0, .14), POT.z + Math.sin(k.a) * k.r * .28);
      p = u < 1 ? arc(mouthS, tgt, u, .15) : tgt;
      if (!k.spill && s > SLAM - .05) vis = false;
      if (k.spill && mh > .3) vis = false;
    }
    _e.set(k.a * 3, k.a * 5, 0); _q.setFromEuler(_e); _s3.setScalar(vis ? k.s : 0);
    _m4.compose(vis ? p : V3(0, -5, 0), _q, _s3); kernels.setMatrixAt(i, _m4);
  }
  kernels.instanceMatrix.needsUpdate = true;
  // ---- géiser de palomitas ----
  for (let i = 0; i < NPOP; i++) {
    const w = SW[i]; let vis = boomed && pp > w.tl, p;
    if (vis) {
      const u = clamp((pp - w.tl) / w.D), p0 = POT_MOUTH().add(w.off.clone().multiplyScalar(.6));
      const end = V3(w.end.x, w.yEnd, w.end.z);
      p = arc(p0, end, u, w.h);
      _q.setFromAxisAngle(w.ax, (pp - w.tl) * w.sp * (u < 1 ? 1 : 0) + i);
      if (w.r < 50 && u >= 1 && mh * shapeM(w.r) > w.yEnd + .25) vis = false;   // enterrada
      _s3.setScalar(w.s * Math.min(1, u * 6 + .2));
    }
    _m4.compose(vis ? p : V3(0, -5, 0), vis ? _q : new THREE.Quaternion(), vis ? _s3 : V3(0, 0, 0)); swarm.setMatrixAt(i, _m4);
  }
  swarm.instanceMatrix.needsUpdate = true;

  // ---- palomitas actrices ----
  FP.forEach(m => m.visible = false); FK.forEach(m => m.visible = false); earPop.visible = headPop.visible = false;
  const show = (m, pos, rot = 0, sc) => { m.visible = true; m.position.copy(pos); m.rotation.set(rot, rot * .7, rot * .3); if (sc !== undefined) m.scale.setScalar(sc); };
  // 1: Pip echa tres granos
  for (let i = 0; i < 3; i++) { const t0 = .35 + i * .18; if (s > t0 - .1 && s < 2.4) { const u = seg(s, t0, t0 + .3); show(FK[i], arc(V3(POT.x - .3, .9, POT.z + .05), V3(POT.x + (i - 1) * .1, POT.y + .09, POT.z + (i % 2) * .08), u, .05), u * 4); } }
  // pops dentro de la olla con tapa
  if (s > 3.45 && s < 4.6) { const u = seg(s, 3.5, 3.85), paw = pip.root.localToWorld(V3(0, .38, .2)); show(FP[0], u < 1 ? arc(POT_MOUTH(), paw, u, .4) : paw, s * 6 * (1 - u), .2 * (s > 4.2 ? 1 - seg(s, 4.2, 4.6) * .6 : 1)); }
  // 2: el grano que explota en la nariz (cámara lenta 7.55–8.45)
  if (s > KPOP && s < BONK + .7) {
    const nTarget = nose.clone().add(V3(-.05, -.05, .12));
    if (s < 7.55) { const u = seg(s, KPOP, 7.55); show(FK[3], arc(POT_MOUTH(), nTarget, u, .12), u * 5); }
    else if (s < BONK) { const k = seg(s, 7.55, BONK); const g = easeOutBack(seg(k, .15, .95)); show(FK[3], nTarget, 1.4 + k * .5); FK[3].scale.setScalar(1.1 * (1 - seg(k, .1, .3))); show(FP[1], nTarget.clone().add(V3(0, 0, .02 + g * .12)), 1 + k * .6, .03 + g * .24); if (FK[3].scale.x < .01) FK[3].visible = false;
      if (k > .12 && k < .7) for (let i = 0; i < 6; i++) { const sp = puffP.next(); const a = i / 6 * TAU + k; sp.position.copy(nTarget).add(V3(Math.cos(a) * (.05 + k * .35), Math.sin(a) * (.05 + k * .35), .1)); sp.scale.setScalar(.08 + k * .2); sp.material.opacity = (1 - k) * .7; } }
    else { const u = seg(s, BONK, BONK + .7); show(FP[1], arc(nose.clone().add(V3(0, 0, .2)), V3(.9, .12, 1.6), u, .7), 1.6 + u * 8, .27); }
  }
  // 3: tres intentos
  if (s > C1 && s < C1 + 1.4) { const u1 = seg(s, C1, C1 + .45); if (u1 < 1) show(FP[2], arc(POT_MOUTH(), nose.clone().add(V3(0, .05, .12)), u1, .9), u1 * 6); else { const u2 = seg(s, C1 + .45, C1 + 1.15); show(FP[2], arc(nose.clone().add(V3(0, .05, .15)), V3(3.2, .12, .4), u2, .9), 3 + u2 * 9); } }
  const earL = mochi.ears[0].localToWorld(V3(0, .5, .05));
  if (s > C2 && s < 15.5) { const u = seg(s, C2, C2 + .5); if (u < 1) show(FP[3], arc(POT_MOUTH(), earL, u, 1.2), u * 6); else show(earPop, earL.clone().add(V3(0, -.05, 0)), .5, .2); }
  if (s > C3 && s < 15.0) { const u = seg(s, C3, C3 + .75); if (u < 1) show(FP[4], arc(POT_MOUTH(), pipHead, u, 1.9), u * 7); else if (s < C3 + 1.15) show(headPop, pipHead, .3, .17); else { const paw = pip.root.localToWorld(V3(0, .4, .2)); show(headPop, paw, .3, .17 * (1 - seg(s, C3 + 1.4, 15.0) * .7)); } }
  if (s > 10.3 && s < C3 + .05 && s > C1 + 1.2) { /* nada */ }
  // 6: palomitas que Mochi se traga al vuelo
  GULPS.forEach((g, i) => { if (s > g - 1.0 && s < g) { const u = seg(s, g - 1.0, g); show(FP[5 + i], arc(V3(mouthP.x + (i % 2 ? 1.4 : -1.4), mouthP.y + 1.4, mouthP.z + .3), mouthP, E.io(u), .2), s * 2, .26); } });
  // 7: Pip con su palomita; hipo de Mochi → palomita a la cabeza de Pip
  if (s > PIPUP && s < 33.5) { const paw = pip.root.localToWorld(V3(0, .4, .2)); show(FP[9], paw, .4, .17 * (1 - (s > PIPUP + .6 ? seg(s, PIPUP + .6, HIC) * .55 : 0))); }
  if (s > HIC && s < 33.5) { const u = seg(s, HIC, HIC + .5); show(FP[10], u < 1 ? arc(mouthP, pipHead, u, .9) : pipHead.clone().add(V3(0, .02, 0)), u < 1 ? u * 8 : .2, .2); }

  // ---- efectos ----
  // vapor de la olla (antes del saco: suave; con temblor: chorros)
  if (!boomed) for (let i = 0; i < 6; i++) { const ph = ((s / 2.0) + i / 6) % 1, sp = steamP.next(); sp.position.set(potG.position.x + Math.sin(ph * 6 + i * 2) * .1, RIM_Y + .1 + ph * .7, POT.z + Math.cos(ph * 5 + i) * .06); sp.scale.setScalar(.12 + ph * .3); sp.material.opacity = Math.sin(ph * Math.PI) * (.12 + rr * .25); }
  if (rr > .15) for (let i = 0; i < 8; i++) { const ph = ((s * 2.2) + i / 8) % 1, a = i / 8 * TAU, sp = steamP.next(); sp.position.set(potG.position.x + Math.cos(a) * (.4 + ph * .5), RIM_Y + ph * .3, POT.z + Math.sin(a) * (.35 + ph * .4)); sp.scale.setScalar(.12 + ph * .35); sp.material.opacity = (1 - ph) * .5 * rr; }
  // motas de luz (periódicas)
  for (let i = 0; i < 18; i++) { const ph = (s * .05 + i / 18) % 1, sp = motes.next(); sp.position.set(-5 + rnd(i) * 9 + Math.sin(ph * TAU * 2 + i) * .3, .5 + ((rnd(i + 7) + ph * .4) % 1) * 6, -3 + rnd(i + 3) * 6); sp.scale.setScalar(.05 + rnd(i + 11) * .05); sp.material.opacity = Math.sin(ph * Math.PI) * .6; }
  // estrellas de mareo tras el BONK
  if (s > BONK + .4 && s < 9.75) for (let i = 0; i < 5; i++) { const a = s * 6 + i / 5 * TAU, sp = sparkP.next(); sp.position.set(headTop.x + Math.cos(a) * .75, headTop.y + .1 + Math.sin(a * 2) * .05, headTop.z + Math.sin(a) * .35); sp.scale.setScalar(.3); sp.material.opacity = 1; }
  // risitas de Pip
  if (s > 9.0 && s < 9.95) for (let i = 0; i < 3; i++) { const ph = ((s - 9) * 1.4 + i / 3) % 1, h = heartsPink.next(); h.position.set(pipHead.x + .1 + ph * .2, pipHead.y + .1 + ph * .5, pipHead.z); h.scale.setScalar(Math.sin(ph * Math.PI) * .25); }
  // destellos de codicia / idea
  if (msd.sp > .02 && msd.mode === 'full') for (const e of mochi.eyes) { const p = e.es.localToWorld(V3(-.25, .3, 1.05)); const sp = sparkP.next(); sp.position.copy(p); sp.scale.setScalar(msd.sp * .4 * (.8 + .3 * Math.sin(s * 14 + e.s))); sp.material.opacity = 1; sp.material.rotation = s * 3 * e.s; }
  if (s > IDEA && s < ZIP) { const k = easeOutBack(seg(s, IDEA, IDEA + .2)) * (1 - seg(s, ZIP - .1, ZIP)); bulb.visible = true; bulb.position.set(headTop.x, headTop.y + .9, headTop.z); bulb.scale.setScalar(Math.max(.001, k) * .9); }
  // polvo al salir disparado
  if (s > ZIP + .05 && s < ZIP + .7) for (let i = 0; i < 9; i++) { const st0 = ZIP + .06 + i * .02, k = seg(s, st0, st0 + .55); if (k <= 0) continue; const sp = puffP.next(); sp.position.set(1.4 + i * .5, .25 + k * .3 + rnd(i) * .3, .9 + (rnd(i + 3) - .5) * .5); sp.scale.setScalar(.35 + k * .6); sp.material.opacity = (1 - k) * .8; }
  // golpe de la tapa y del culete
  for (const [t0, x, y] of [[SLAM, POT.x, RIM_Y + .05], [SIT, POT.x, RIM_Y + .2]]) if (s > t0 && s < t0 + .45) { const k = seg(s, t0, t0 + .45); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, sp = puffP.next(); sp.position.set(x + Math.cos(a) * (.4 + k * .6), y + k * .15, POT.z + Math.sin(a) * (.35 + k * .5)); sp.scale.setScalar(.18 + k * .3); sp.material.opacity = (1 - k) * .7; } }
  // gota de sudor
  sweat.visible = s > 22.7 && s < FREEZE + .9;
  if (sweat.visible) { const p = headWorld(V3(.62, .55 - seg(s, 22.7, FREEZE + .9) * .55, .5)); sweat.position.copy(p); }
  // ¡BOOM!: anillo de humo y destellos
  if (s > BOOM && pp < P0 + .7) { const k = clamp((pp - P0) / .7); for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, sp = puffP.next(); sp.position.set(POT.x + Math.cos(a) * (.5 + k * 3.2), RIM_Y + k * .5 + rnd(i) * .4, POT.z + Math.sin(a) * (.4 + k * 2.6)); sp.scale.setScalar(.5 + k * 1.3); sp.material.opacity = (1 - k) * .85; } }
  if (s > BOOM && pp < P0 + 1.4) for (let i = 0; i < 8; i++) { const k = clamp((pp - P0) / 1.4), sp = sparkP.next(); const a = i / 8 * TAU + k * 2; sp.position.set(POT.x + Math.cos(a) * (.6 + k * 3), 1 + k * 4 + Math.sin(a) * 1.5, POT.z + 1.2); sp.scale.setScalar((1 - k) * .45); sp.material.opacity = 1; }
  // aterrizaje de Mochi en la montaña
  const landS = LAND_S;
  if (s > landS && s < landS + .8) { const k = seg(s, landS, landS + .8); for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, sp = puffP.next(); sp.position.set(FL_END.x + Math.cos(a) * (.6 + k * 1.6), MOUND_H * shapeM(FL_R) - .1 + k * .6, FL_END.z + Math.sin(a) * (.5 + k * 1.2)); sp.scale.setScalar(.4 + k * .7); sp.material.opacity = (1 - k) * .85; } }
  // salpicón de palomitas al asomarse
  for (const [t0, p] of [[PIPUP, PIP_END], [MOUP, MO_END]]) if (s > t0 && s < t0 + .4) { const k = seg(s, t0, t0 + .4), r = Math.hypot(p.x - MOUND.x, p.z - MOUND.z); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; const sp = puffP.next(); sp.position.set(p.x + Math.cos(a) * (.2 + k * .5), MOUND_H * shapeM(r) + .1, p.z + Math.sin(a) * (.2 + k * .4)); sp.scale.setScalar(.2 + k * .3); sp.material.opacity = (1 - k) * .6; } }
  beams.forEach((b, i) => b.material.opacity = .16 + .05 * Math.sin(s * TAU / 10 + i * 1.7));

  // ---- cámara ----
  let c;
  if (hook) c = HOOK_CAM(s, msd);
  else {
    const C = CAMS[shot]; c = {}; for (const k in C.d) c[k] = C.val(k, s);
    if (c.fw > 0) {
      let p = null;
      if (shot === 1) p = nose; else if (shot === 5 && MMODE.get(s) === 'fly' && phys(s) - P0 < LAND_U) p = V3(msd.x, msd.y + 1.0, msd.z);
      if (p) { c.tx = lerp(c.tx, p.x, c.fw); c.ty = lerp(c.ty, p.y, c.fw); c.tz = lerp(c.tz, p.z, c.fw); }
    }
    if (c.sh > 0) { c.tx += Math.sin(s * 83) * .05 * c.sh * c.d / 6; c.ty += Math.cos(s * 71) * .05 * c.sh * c.d / 6; }
  }
  composite(c, shot === 5 || hook ? .7 : 1);

  // ---- acabado ----
  ctx.clearRect(0, 0, W, H);
  const slow = (hook && s > SLOW[0][0]) || (s > 7.55 && s < BONK) || (s > SLOW[0][0] && s < SLOW[1][1] && !rew);
  if (slow) { const a = hook ? seg(s, SLOW[0][0], SLOW[0][1]) : (s < 9 ? Math.min(1, seg(s, 7.55, 7.75)) : Math.min(seg(s, SLOW[0][0], SLOW[0][1]), 1 - seg(s, SLOW[1][0], SLOW[1][1]))); const g = ctx.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .75); g.addColorStop(0, 'rgba(60,30,10,0)'); g.addColorStop(1, `rgba(60,30,10,${.38 * a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  if (s > ZIP + .05 && s < ZIP + .35) { const a = 1 - seg(s, ZIP + .2, ZIP + .35); ctx.save(); ctx.globalAlpha = a * .8; ctx.strokeStyle = '#fff7ea'; ctx.lineCap = 'round'; for (let i = 0; i < 9; i++) { const y = 1100 + (rnd(i) - .5) * 520, x0 = 300 + rnd(i + 3) * 300; ctx.lineWidth = 8 + rnd(i + 5) * 14; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 300 + rnd(i + 8) * 300, y); ctx.stroke(); } ctx.restore(); }
  if ((s > BOOM && s < BOOM + .07) || (s > BONK && s < BONK + .05) ) { ctx.fillStyle = 'rgba(255,250,235,.6)'; ctx.fillRect(0, 0, W, H); }
  if (s > BOOM && s < BOOM + .45) focusLines(s, (1 - seg(s, BOOM + .15, BOOM + .45)) * (hook ? .6 : 1));
  warmGrade();
  octx.drawImage(overlay, 0, 0);
  // ---- rebobinado VHS ----
  if (rew || (v >= OFF && v < OFF + .12)) {
    const k = rew ? 1 : 1 - seg(v, OFF, OFF + .12);
    vctx.drawImage(out, 0, 0);
    for (let y = 0; y < H; y += 24) { const dx = (rnd(Math.floor(v * 60) * 7 + y) - .5) * 22 * k + Math.sin(y * .02 + v * 40) * 8 * k; octx.drawImage(vhs, 0, y, W, 24, dx, y, W, 24); }
    octx.save(); octx.globalCompositeOperation = 'screen'; octx.globalAlpha = .25 * k; octx.drawImage(vhs, 10 * k, 0); octx.restore();
    octx.fillStyle = `rgba(20,10,40,${.18 * k})`; octx.fillRect(0, 0, W, H);
    for (let i = 0; i < 3; i++) { const y = ((v * 2900 + i * 640) % (H + 200)) - 100; const g = octx.createLinearGradient(0, y - 40, 0, y + 40); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, `rgba(255,255,255,${.45 * k})`); g.addColorStop(1, 'rgba(255,255,255,0)'); octx.fillStyle = g; octx.fillRect(0, y - 40, W, 80); }
    octx.fillStyle = `rgba(255,255,255,${.05 * k})`; for (let i = 0; i < 160; i++) octx.fillRect(rnd(i + v * 999) * W, rnd(i * 3 + v * 777) * H, 3, 2);
    octx.save(); octx.globalAlpha = k * (.75 + .25 * Math.sin(v * 40)); octx.translate(W / 2, H * .44); octx.shadowColor = 'rgba(0,0,0,.45)'; octx.shadowBlur = 24;
    octx.fillStyle = '#ffffff'; for (const x0 of [-10, -150]) { octx.beginPath(); octx.moveTo(x0 + 130, -95); octx.lineTo(x0, 0); octx.lineTo(x0 + 130, 95); octx.closePath(); octx.fill(); }
    octx.restore();
  }
}
startEpisode(render);
