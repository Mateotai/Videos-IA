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

// ---------- disposición ----------
const PL = V3(-4.0, 0, 1.2);                 // plato de Pip
const PANZ = -2.4, PAN_R = 2.45, H_ANG = .25, H_LEN = 2.6;
const PAN_X = 4.3;
const REACH = PAN_R + H_LEN * Math.cos(H_ANG) + .6;   // pan.x - mochi.x al arrastrar
const CATCH = V3(-0.6, 0, 0.5);
const BX = -1.95, BZ = -0.2, RB = 1.0, BL = 2.5, BYAW = -.38;      // burrito
const GPR = 2.2, GPT = .16;                          // tortita gigante

function drapeSurface(s, ph, a, hd, out, nrm) {
  const tab = arcTable(a, hd); domePoint(s, ph, a, hd, tab, out, nrm);
  let q = GPT; for (const E of [V3(-.45, hd - .12, .12), V3(.45, hd - .12, .12)]) q += .42 * Math.exp(-out.distanceToSquared(E) / .03) * 0;
  out.addScaledVector(nrm, q); return out;
}
const giant = buildSheet(GPR, GPT, 30, 96, PCK_TOP, PCK_SIDE); scene.add(giant.mesh);
const tiny = buildSheet(.2, .07, 8, 40, PCK_TOP, PCK_SIDE); updateSheet(tiny, { dr: 0 });

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
