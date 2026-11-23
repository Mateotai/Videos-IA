// =====================================================================
//  EPISODIO 12 (3D) — "Jelly 🟢"   35 s · 9:16 · música: "Pixel Peeker Polka - faster" (Kevin MacLeod, CC BY 4.0)
//  GANCHO (0–2.4 s de vídeo): Mochi agachado sobre una gelatina gigante… ¡BOING! sale disparado a cámara lenta.
//  REBOBINADO VHS (2.4–2.9) y la historia (tiempo de historia = vídeo − 2.9):
//  1 (0–4.5)    Pip bota sobre su gelatina diminuta.
//  2 (4.5–10)   Mochi se sienta encima… ¡PLAF!, la aplasta.
//  3 (10–15)    Idea: trae un molde enorme… ¡una gelatina GIGANTE! Se sube.
//  4 (15–21)    Botes cada vez más altos; Pip se une. Se agacha muchísimo… silencio.
//  5 (21–26.5)  ¡BOING! a cámara lenta hasta el techo; Pip sale volando. Cae… DENTRO de la gelatina.
//  6 (26.5–32.1) Pip se come la gelatina con una cuchara; Mochi se abre paso comiendo. Letrero.
// =====================================================================
const DURATION = 35;
const HOOK = 2.4, REW = .5, OFF = HOOK + REW;
const HOOK_S0 = 20.55, HOOK_K = (23.0 - HOOK_S0) / HOOK;
const SIGN_V = 32.3, MS = .72;
const SHOTS = [0, 4.5, 10, 15, 21, 26.5, 99];
const shotOf = s => { let i = 0; while (i < 5 && s >= SHOTS[i + 1]) i++; return i; };

// ---------- disposición ----------
const SJ = V3(-1.0, 0, 1.0), PIPH = V3(-1.48, 0, 1.0);
const GJ = V3(.9, 0, .2), GJ_R = 1.25, GJ_H = 1.6;
const MH = V3(.35, 0, .55), SIDE = V3(2.45, 0, .45);
const SPOON0 = V3(-2.0, 0, .55);
const SQUAT = 19.3, FREEZE = 20.4, LAUNCH = 21.0;

// ---------- tiempo físico ----------
const SLOW = [[LAUNCH + .08, LAUNCH + .25, .2], [24.0, 24.2, 1]];
const rateAt = s => { if (s < SLOW[0][0]) return 1; if (s < SLOW[0][1]) return lerp(1, .2, seg(s, SLOW[0][0], SLOW[0][1])); if (s < SLOW[1][0]) return .2; if (s < SLOW[1][1]) return lerp(.2, 1, seg(s, SLOW[1][0], SLOW[1][1])); return 1; };
const TAUT = (() => { const dt = 1 / 600, n = Math.ceil(40 / dt), a = new Float32Array(n + 1); for (let i = 1; i <= n; i++) a[i] = a[i - 1] + rateAt((i - .5) * dt) * dt; return { a, dt }; })();
const phys = s => { const f = clamp(s, 0, 39.9) / TAUT.dt, i = Math.floor(f); return TAUT.a[i] + (TAUT.a[i + 1] - TAUT.a[i]) * (f - i); };
const P0 = phys(LAUNCH);
const G = 26, VUP = Math.sqrt(2 * G * 4.6);
const DROP_S = (() => { for (let s = LAUNCH + .1; s < 30; s += .002) { const u = phys(s) - P0; if (u > .3 && VUP * u - G * u * u / 2 <= 0) return s; } return 99; })();
const SUNK = DROP_S + .28;

// ---------- gelatina ----------
const JELLY = new THREE.MeshPhysicalMaterial({ color: '#6fe08a', roughness: .08, clearcoat: 1, clearcoatRoughness: .05, transparent: true, opacity: .74, depthWrite: false, emissive: '#2fb85a', emissiveIntensity: .28, side: THREE.DoubleSide });
const JELLY_GEO = (() => {
  const pts = []; for (let i = 0; i <= 28; i++) { const y = i / 28; const r = y < .88 ? lerp(1, .82, y / .88) : .82 * Math.sqrt(Math.max(0, 1 - ((y - .88) / .12) ** 2)) + .001; pts.push(new THREE.Vector2(Math.max(.001, r), y)); }
  const g = new THREE.LatheGeometry(pts, 72), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x), k = 1 + .06 * Math.cos(a * 8) * (p.getY(i) < .9 ? 1 : .3); p.setX(i, x * k); p.setZ(i, z * k); }
  g.computeVertexNormals(); return g;
})();
function makeJelly(R, Hh) {
  const g = new THREE.Group(), sq = new THREE.Group(); g.add(sq);
  const m = new THREE.Mesh(JELLY_GEO, JELLY); m.scale.set(R, Hh, R); m.renderOrder = 4; sq.add(m);
  for (let i = 0; i < 14; i++) sq.add(mesh(SPH, new THREE.MeshBasicMaterial({ color: '#e8fff0', transparent: true, opacity: .55 }), { x: (rnd(i) - .5) * R * 1.2, y: (.15 + rnd(i + 3) * .7) * Hh, z: (rnd(i + 5) - .5) * R * 1.2, sx: .03 * R, sy: .03 * R, sz: .03 * R, shadow: false }));
  sq.add(mesh(SPH, mat('#ff4d6d', .3), { x: .25 * R, y: .55 * Hh, z: .2 * R, sx: .12 * R, sy: .14 * R, sz: .12 * R, shadow: false }));   // fresa dentro
  scene.add(g); return { g, sq, m };
}
const small = makeJelly(.24, .26), giant = makeJelly(GJ_R, GJ_H);
const plate = new THREE.Group(); plate.position.copy(SJ); scene.add(plate);
{ const pts = [[0, 0], [.26, 0], [.3, .015], [.36, .045], [.37, .055], [.36, .062], [.3, .035], [.26, .025], [0, .025]].map(([x, y]) => new THREE.Vector2(x, y)); plate.add(mesh(new THREE.LatheGeometry(pts, 48), gloss('#fffdf8', { roughness: .2 }))); }
const flat = mesh(new THREE.CylinderGeometry(.42, .45, .04, 40), JELLY, { shadow: false }); flat.renderOrder = 4; scene.add(flat);
// molde gigante (olla boca abajo)
const mold = new THREE.Group(); scene.add(mold);
{ const M2 = gloss('#ff9f6b', { roughness: .25 }); mold.add(mesh(new THREE.CylinderGeometry(GJ_R * 1.08, GJ_R * 1.14, GJ_H * 1.08, 48, 1, true), M2, { y: GJ_H * .54 }));
  mold.add(mesh(new THREE.CylinderGeometry(GJ_R * 1.08, GJ_R * 1.08, .06, 48), M2, { y: GJ_H * 1.08 }));
  mold.add(mesh(new THREE.TorusGeometry(.22, .06, 10, 24), mat('#3a3640', .4), { y: GJ_H * 1.08 + .05, rx: Math.PI / 2 }));
  mold.add(mesh(new THREE.TorusGeometry(GJ_R * 1.14, .05, 10, 48), mat('#ffffff', .4), { y: .03, rx: Math.PI / 2 })); }
// cuchara de Pip
const spoon = new THREE.Group(); scene.add(spoon);
{ const steel = mat('#dfe3ea', .2, { metalness: .8 }); spoon.add(mesh(new THREE.CylinderGeometry(.022, .028, .5, 10), steel, { y: .25 })); spoon.add(mesh(SPH, steel, { y: .58, sx: .1, sy: .13, sz: .04 })); }
const scoop = mesh(SPH, JELLY, { shadow: false }); scoop.renderOrder = 5; scene.add(scoop);
const jellyHat = mesh(SPH, JELLY, { shadow: false }); jellyHat.renderOrder = 5; scene.add(jellyHat);
const splashP = pool(24, () => mesh(SPH, JELLY, { shadow: false }));
mochi.root.scale.setScalar(MS); mochi.hemTail.visible = mochi.hemTip.visible = false;
const cheeks = [-1, 1].map(s => { const m = mesh(SPH, MC.fur, { x: s * .62, y: -.25, z: .38, sx: .01, sy: .01, sz: .01 }); mochi.hT.add(m); return m; });

// =====================================================================
//  GUION
// =====================================================================
const MO = new Rig({ x: 4.6, y: 0, z: MH.z, yaw: -1.3, lean: 0, roll: 0, sx: 1, sy: 1, sz: 1, wr: 0, wamt: 0,
  aLf: .15, aLo: .22, aRf: .15, aRo: .22, hp: 0, hy: 0, hr: 0, hs: 1, eb: 1, pd: 1, lid: 0, lx: 0, ly: 0, sp: 0,
  mo: 0, tg: 0, tu: 0, lk: 0, br: 0, brA: 1, tw: 1, wg: 0, sn: 0, pk: 0, ed: 0, sit: 0, cross: 0, ck: 0, chew: 0 });
const MMODE = new Steps('hidden');
const PI_ = new Rig({ x: PIPH.x, y: 0, z: PIPH.z, yaw: 1.1, lean: 0, roll: 0, sx: 1, sy: 1, wr: 0, wamt: 0,
  aLf: .1, aLo: .25, aRf: .1, aRo: .25, hp: 0, hy: 0, hr: 0, lid: 0, lx: 0, ly: 0, sm: 1, mo: 0, ed: 0, must: 0, rub: 0, kick: 0, fid: 0, tailUp: 0, chew: 0, wave: 0 });
const JL = new Rig({ ssy: 1, gsy: 1, flat: 0, mold: 0 });     // aplastamiento de las gelatinas
const KM = (t, v, e) => MO.key(t, v, e), P = (t, v, e) => PI_.key(t, v, e), J = (t, v, e) => JL.key(t, v, e);
// impactos (para el bamboleo): [tiempo, gelatina, fuerza]
const HITS = [];
function hop(R, t0, from, to, h, dur, who) {    // salto con anticipación y aplastamiento
  const t1 = t0 + .12, t2 = t1 + dur;
  R.key(t0, { sy: 1, sx: 1 }); R.key(t1 - .01, { sy: .78, sx: 1.12 }); R.key(t1, { x: from[0], y: from[1], z: from[2] });
  R.key(t1 + .06, { sy: 1.12, sx: .92 }, 'o'); R.key(t1 + dur * .5, { y: Math.max(from[1], to[1]) + h }, 'oq'); R.key(t2, { y: to[1] }, 'iq'); R.key(t2, { x: to[0], z: to[2] }, 'lin');
  R.key(t1 + dur * .6, { sy: 1, sx: 1 }); R.key(t2 + .06, { sy: .78, sx: 1.16 }, 'o'); R.key(t2 + .25, { sy: 1, sx: 1 }, 'back');
  if (who) HITS.push([t2, who[0], who[1]]);
  return t2;
}

// ---------------- 1 (0–4.5): los botes de Pip ----------------
const STOP = .26;
P(0, { lid: 0, aRf: .1, lean: 0 }); P(.4, { aRf: 1.3, aRo: -.2, lean: .25 }); P(.75, { aRf: .1, aRo: .25, lean: 0 }); HITS.push([.6, 's', .5]);
P(.9, { yaw: 1.1 });
hop(PI_, 1.0, [PIPH.x, 0, PIPH.z], [SJ.x, STOP, SJ.z], .3, .4, ['s', .9]);
hop(PI_, 1.75, [SJ.x, STOP, SJ.z], [SJ.x, STOP, SJ.z], .55, .45, ['s', 1]);
hop(PI_, 2.55, [SJ.x, STOP, SJ.z], [SJ.x, STOP, SJ.z], .7, .5, ['s', 1]);
P(1.0, { lid: 0, sm: 1, aLf: .1, aRf: .1, aLo: .25, aRo: .25 }); P(1.6, { lid: .85, aLf: 2.4, aRf: 2.4, aLo: .5, aRo: .5 }); P(3.4, { lid: .85, aLf: 2.4 }); P(3.6, { lid: 0, aLf: .1, aRf: .1, aLo: .25, aRo: .25 });
P(3.6, { yaw: 1.1 }); P(3.9, { yaw: .3 });
// ---------------- 2 (4.5–10): ¡PLAF! ----------------
const SITS = 7.15;
MMODE.at(4.5, 'full');
KM(4.5, { x: 4.6, z: MH.z, yaw: -1.3, wr: 2.4, wamt: 1, lid: .3 }); KM(5.6, { wr: 2.4, wamt: 1 }); KM(5.75, { x: MH.x + .5, wr: 0, wamt: 0 }, 'o');
KM(5.7, { eb: 1, sp: 0, lid: .3, lx: 0 }); KM(5.95, { eb: 1.35, sp: .9, lid: 0, lx: -.5, mo: .4 }, 'back'); KM(6.3, { sp: .9 }); KM(6.5, { sp: 0 });
P(4.6, { yaw: .3, lx: 0 }); P(5.0, { yaw: .6, lx: .5 });
hop(PI_, 5.8, [SJ.x, STOP, SJ.z], [SJ.x - .55, 0, SJ.z + .15], .3, .4); P(6.4, { yaw: .6 });
KM(6.4, { x: MH.x + .5, z: MH.z, yaw: -1.3, wr: 0, wamt: 0 }); KM(6.45, { wr: 3, wamt: 1 }); KM(6.95, { x: SJ.x + .05, z: SJ.z - .35, wr: 3, wamt: 1 }, 'io'); KM(7.0, { wr: 0, wamt: 0, yaw: .05 });
KM(SITS - .05, { y: 0, sit: 0, sy: 1 }); KM(SITS + .08, { sit: 1, sy: .8, sx: 1.18 }, 'o'); KM(SITS + .35, { sy: 1, sx: 1 }, 'back');
J(SITS, { ssy: 1, flat: 0 }); J(SITS + .06, { ssy: .05, flat: 1 }, 'o');
KM(SITS + .1, { mo: 0, eb: 1, lid: .7, lx: 0 }); KM(7.7, { lid: 0, ly: -.8, eb: 1.3, hp: .3 }); KM(8.6, { ly: -.8 }); KM(8.9, { ly: 0, lx: -.6, hp: 0, eb: 1, mo: .25, ed: .5 });
P(SITS + .05, { mo: 0, lid: 0 }); P(SITS + .15, { mo: 1, aLf: 2.6, aRf: 2.6, aLo: .4, aRo: .4, sy: 1.15 }); P(8.2, { mo: 1 }); P(8.4, { mo: 0, aLf: 1.4, aRf: 1.4, aLo: -.9, aRo: -.9, lid: .5, hp: .1, sy: 1, ed: .4 });
// ---------------- 3 (10–15): la gelatina GIGANTE ----------------
const IDEA = 10.15, ZIP = 10.45, BACK0 = 10.95, PLONK = 11.35, LIFT = 11.6;
KM(IDEA - .2, { lid: 0, ed: .5, sit: 1 }); KM(IDEA + .15, { ed: 0, sp: 1, eb: 1.3, mo: .4, br: 1 }, 'back'); KM(IDEA + .25, { sit: 0, y: 0 }, 'o');
KM(ZIP - .05, { x: SJ.x + .05, yaw: .05, lean: 0, sy: 1 }); KM(ZIP + .03, { yaw: 1.45, lean: -.35, sy: .82 }); KM(ZIP + .05, { x: SJ.x + .05 }); KM(ZIP + .22, { x: 8, sz: 1.8, lean: .4 }, 'i');
MMODE.at(ZIP + .23, 'hidden').at(BACK0, 'full');
KM(BACK0 - .05, { x: SIDE.x + 1.5, z: GJ.z + .1, yaw: -1.5, sz: 1, sy: 1, sx: 1, lean: -.1, wr: 3.4, wamt: 1, sp: 0, aLf: 2.85, aRf: 2.85, aLo: .25, aRo: .25, eb: 1.1, mo: .3, br: 1 });
KM(PLONK - .1, { x: SIDE.x, z: SIDE.z, wr: 3.4, wamt: 1 }, 'o'); KM(PLONK, { wr: 0, wamt: 0, aLf: 2.85, aRf: 2.85 }); KM(PLONK + .1, { aLf: 2.2, aRf: 2.2, lean: .25 });
J(BACK0, { mold: 1 }); J(PLONK, { mold: 2 }, 'iq'); J(LIFT, { mold: 2 }); J(LIFT + .3, { mold: 3 }, 'o'); J(LIFT + .8, { mold: 4 }, 'i');
KM(LIFT, { aLf: 2.2, aRf: 2.2, lean: .25 }); KM(LIFT + .3, { aLf: 2.9, aRf: 2.9, lean: -.2 }, 'o'); KM(LIFT + .55, { aLf: .3, aRf: .3, aLo: .3, aRo: .3, lean: 0 });
KM(LIFT + .6, { yaw: -1.5 }); KM(12.15, { yaw: -1.2 }, 'io');
KM(12.1, { aLf: -.35, aLo: .75, aRf: -.35, aRo: .75, lean: -.15, hp: -.25, lid: .8, mo: .3 }, 'back'); KM(12.8, { lid: .8 }); KM(12.95, { lid: 0, hp: 0, lean: 0, aLf: .15, aRf: .15, aLo: .22, aRo: .22, mo: 0 });
HITS.push([LIFT + .05, 'g', 1.0]);
P(11.6, { lid: .5, mo: 0, aLf: 1.4, aRf: 1.4 }); P(11.9, { lid: 0, mo: 1, aLf: .1, aRf: .1, aLo: .25, aRo: .25, hp: -.3, ed: 0, yaw: .9, sy: 1.12 }); P(12.6, { mo: 1, sy: 1.12 }); P(12.8, { mo: .4, sy: 1, hp: -.15 });
// se sube y empieza a botar
const TOPY = GJ_H;
hop(MO, 13.1, [SIDE.x, 0, SIDE.z], [GJ.x, TOPY, GJ.z + .1], .8, .55, ['g', .8]);
KM(13.05, { yaw: -1.2 }); KM(13.3, { yaw: -.25 });
let tb = hop(MO, 14.05, [GJ.x, TOPY, GJ.z + .1], [GJ.x, TOPY, GJ.z + .1], .55, .45, ['g', .8]);
KM(14.0, { mo: .4, lid: 0, eb: 1.1 }); KM(14.3, { mo: .9, aLf: 2.6, aRf: 2.6, aLo: .6, aRo: .6 });
// ---------------- 4 (15–21): más alto… ----------------
tb = hop(MO, 15.0, [GJ.x, TOPY, GJ.z + .1], [GJ.x, TOPY, GJ.z + .1], 1.2, .62, ['g', 1.1]);
tb = hop(MO, 15.95, [GJ.x, TOPY, GJ.z + .1], [GJ.x, TOPY, GJ.z + .1], 1.9, .82, ['g', 1.3]);
tb = hop(MO, 17.15, [GJ.x, TOPY, GJ.z + .1], [GJ.x, TOPY, GJ.z + .1], 2.5, .95, ['g', 1.5]);
KM(17.0, { mo: .9, lid: 0 }); KM(17.6, { mo: 1.2, lid: .85 }); KM(18.25, { lid: .85 }); KM(18.5, { lid: 0, mo: .5, sp: 0 });
// Pip se sube al borde y también bota
const PEDGE = [GJ.x - .78, TOPY - .1, GJ.z + .55];
P(14.6, { x: SJ.x - .55, z: SJ.z + .15, yaw: .6 }); P(15.0, { yaw: 1.0 });
P(15.05, { x: SJ.x - .55, z: SJ.z + .15, wr: 0, wamt: 0 }); P(15.1, { wr: 6, wamt: 1 }); P(15.75, { x: GJ.x - 1.55, z: GJ.z + .85, wr: 6, wamt: 1 }, 'io'); P(15.8, { wr: 0, wamt: 0 });
hop(PI_, 15.85, [GJ.x - 1.55, 0, GJ.z + .85], PEDGE, .6, .45, ['g', .2]);
for (const t0 of [16.6, 17.3, 18.0, 18.7]) hop(PI_, t0, PEDGE, PEDGE, .35, .4, ['g', .15]);
P(16.5, { lid: 0, aLf: .1, aRf: .1 }); P(16.7, { lid: .85, aLf: 2.5, aRf: 2.5, aLo: .4, aRo: .4, sm: 1 });
// se agacha muchísimo… silencio
KM(18.5, { y: TOPY, sy: 1, sx: 1, br: 0, mo: .5 }); KM(SQUAT, { y: TOPY, sy: .62, sx: 1.25, br: 1, brA: 1.3, mo: 0, lid: .4, aLf: -.4, aRf: -.4, aLo: .6, aRo: .6, hp: .1 }, 'io');
J(18.5, { gsy: 1 }); J(SQUAT, { gsy: .66 }, 'io'); J(LAUNCH, { gsy: .66 }); J(LAUNCH + .08, { gsy: 1.32 }, 'o'); J(LAUNCH + .5, { gsy: 1 }, 'back');
KM(FREEZE, { hy: 0, lx: 0, ly: 0, lid: .4, mo: 0 }); KM(FREEZE + .15, { hy: .35, lx: .4, ly: .05, lid: .3, mo: .35, sp: .5 }, 'o'); KM(LAUNCH - .05, { hy: .35 });
P(19.2, { lid: .85, aLf: 2.5 }); P(19.4, { lid: 0, aLf: 1.25, aRf: 1.25, aLo: -.6, aRo: -.6, ly: .4, mo: .4, fid: 1 });
// ---------------- 5 (21–26.5): ¡BOING! ----------------
MMODE.at(LAUNCH, 'fly');
P(LAUNCH, { fid: 0, mo: 1 });
// ---------------- 6 (26.5–32.1): la cuchara ----------------
const PIP_LAND = V3(-.55, 0, 1.3), TAP = 27.9, EAT0 = 28.5, POPUP = 30.45;
P(26.55, { x: PIP_LAND.x, y: 0, z: PIP_LAND.z, roll: 0, yaw: 1.2, lid: 0, mo: 0, sm: 1, aLf: .1, aRf: .1, aLo: .25, aRo: .25, wr: 0, wamt: 0, lean: 0, sy: 1, sx: 1 });
P(26.75, { wr: 5, wamt: 1, yaw: -2.2 }); P(27.15, { x: SPOON0.x + .25, z: SPOON0.z + .2, wr: 5, wamt: 1 }, 'io'); P(27.2, { wr: 0, wamt: 0 });
P(27.25, { lean: .45, aRf: 1.2 }); P(27.4, { lean: 0, aRf: 1.6, yaw: 1.0 }); P(27.45, { wr: 5, wamt: 1 }); P(27.15, { yaw: 2.4 }); P(27.5, { yaw: 1.0 }); P(27.8, { x: GJ.x - 1.55, z: GJ.z + .95, wr: 5, wamt: 1 }, 'io'); P(27.85, { wr: 0, wamt: 0, yaw: 1.1 });
P(TAP - .1, { aRf: 1.6 }); P(TAP, { aRf: 1.0 }); P(TAP + .12, { aRf: 1.6 }); HITS.push([TAP, 'g', .35]);
P(EAT0, { aRf: 1.6, lean: 0 }); P(EAT0 + .2, { aRf: .9, lean: .3 }); P(EAT0 + .45, { aRf: 2.3, lean: 0, aRo: -.3 }); P(EAT0 + .6, { chew: 0 }); P(EAT0 + .7, { chew: 1, lid: .85 }); P(29.6, { chew: 1, lid: .85 }); P(29.8, { chew: 0, lid: 0, aRf: 1.3, aRo: .25 });
P(POPUP + .2, { lid: 0, sm: 1 }); P(POPUP + .35, { lid: .9, aLf: 2.2, aLo: -.75, hy: .2 }); P(31.9, { lid: .9 });
for (let k = 0; k < 6; k++) { P(POPUP + .35 + k * .17, { sy: 1.08 }); P(POPUP + .43 + k * .17, { sy: .95 }); }
for (const r of [MO, PI_, JL]) r.done();

// ---------- estados ----------
function wobble(s, which) { let w = 0; for (const [t, g, a] of HITS) if (g === which && s > t) { const u = s - t; w += a * Math.exp(-u * 3.2) * Math.sin(u * 22); } return w; }
function mochiState(s) {
  const st = {}; for (const k in MO.d) st[k] = MO.val(k, s);
  st.walk = MO.integ('wr', s); st.mode = MMODE.get(s);
  if (st.mode === 'full') st.sy *= 1 + Math.sin(s * 3.2) * .012;
  // sobre la gelatina gigante: sube y baja con ella
  if (s > 13.6 && s < LAUNCH && st.y >= TOPY - .6) { const gy = gelSy(s); st.y += (gy - 1) * GJ_H; }
  if (st.mode === 'fly') {
    st.mode = 'full';
    const u = phys(s) - P0;
    if (s < DROP_S) { st.y = TOPY + VUP * u - G * u * u / 2; st.x = GJ.x; st.z = GJ.z + .1; st.sy = u < .15 ? lerp(1.5, 1, u / .15) : 1; st.sx = u < .15 ? lerp(.75, 1, u / .15) : 1; st.sz = st.sx;
      st.aLf = 2.8; st.aRf = 2.8; st.aLo = .9; st.aRo = .9; st.eb = 1.5; st.mo = 1.2; st.lid = 0; st.hy = 0; st.lx = 0; st.ly = .3; st.br = 0; st.sp = 0;
      st.roll = Math.sin(u * 3) * .25; st.yaw = -.25 + Math.sin(u * 2) * .2; st.walk = s * 1.5; st.wamt = .6; st.ed = 0;
      if (s > 22.9 && s < 24.0) { st.hy = .3; st.lx = .4; st.mo = .3; st.eb = 1.3; }       // mira a cámara en lo alto
      if (u > 1.0) { st.eb = 1.7; st.mo = .9; st.ly = -.7; st.aLf = 3.0; st.aRf = 3.0; }
    } else {   // dentro de la gelatina
      const k = E.o(seg(s, DROP_S, SUNK)); st.x = GJ.x; st.z = GJ.z + .1; st.y = lerp(TOPY, .12, k); st.yaw = -.25; st.roll = 0; st.lean = 0;
      st.sy = s < SUNK + .2 ? lerp(.8, 1, seg(s, DROP_S, SUNK + .2)) : 1; st.sx = 1; st.sz = 1;
      st.aLf = 2.9; st.aRf = 2.9; st.aLo = .9; st.aRo = .9; st.walk = 0; st.wamt = 0; st.eb = 1.45; st.mo = 0; st.ck = 1.2; st.lid = 0; st.hy = 0; st.lx = 0; st.ly = 0; st.sp = 0; st.br = 0;
      if (s > TAP + .05) { st.lx = -.6; st.hy = -.25; }
      if (s > EAT0 + .7) { st.chew = 1; st.ck = 1.4; st.lx = -.4; }
      if (s > POPUP) { const kk = easeOutBack(seg(s, POPUP, POPUP + .35)); st.y = lerp(.12, .72, kk); st.chew = s < POPUP + .5 ? 1 : 0; st.ck = s > POPUP + .5 ? .9 : 1.4; st.eb = 1.1; st.lid = s > POPUP + .5 ? .85 : 0; st.mo = s > POPUP + .5 ? .45 : 0; st.tg = s > POPUP + .5 ? .9 : 0; st.lk = 1; st.tu = .3; st.aLf = 1.2; st.aRf = 1.2; st.aLo = .6; st.aRo = .6; st.hy = 0; st.lx = 0; }
      st.y += wobble(s, 'g') * .04;
    }
  }
  return st;
}
function pipState(s) {
  const st = {}; for (const k in PI_.d) st[k] = PI_.val(k, s);
  st.walk = PI_.integ('wr', s); st.sy *= 1 + Math.sin(s * 4.1) * .015;
  if (st.chew > 0) st.mo = Math.max(st.mo, (Math.sin(s * 22) * .5 + .5) * .5 * st.chew);
  if (st.fid > 0) st.aLf += Math.sin(s * 16) * .15 * st.fid;
  st.dripT = 99;
  if (s > 15.8 && s < LAUNCH && st.y > TOPY - .4) st.y += (gelSy(s) - 1) * GJ_H;
  if (s >= LAUNCH && s < 26.55) {   // sale despedido
    const u = phys(s) - P0, T = 1.25, k = clamp(u / T);
    const p = V3(lerp(PEDGE[0], PIP_LAND.x, k), lerp(PEDGE[1], 0, k) + 4 * 2.2 * k * (1 - k), lerp(PEDGE[2], PIP_LAND.z, k));
    st.x = p.x; st.y = p.y; st.z = p.z; st.roll = k < 1 ? u * 5 : 0; st.yaw = 1.2; st.mo = 1; st.lid = 0; st.aLf = 2.6; st.aRf = 2.6; st.aLo = .9; st.aRo = .9; st.wr = 0; st.walk = 0; st.wamt = 0;
    if (k >= 1) { const sit = seg(s, PIP_LANDS, PIP_LANDS + .2); st.sy = lerp(.75, 1, easeOutBack(sit)); st.mo = 0; st.lid = .5; st.aLf = .1; st.aRf = .1; st.aLo = .9; st.aRo = .9; }
  }
  return st;
}
const PIP_LANDS = (() => { for (let s = LAUNCH; s < 30; s += .002) if (phys(s) - P0 >= 1.25) return s; return 99; })();
function gelSy(s) { return JL.val('gsy', s) * (1 + wobble(s, 'g') * .06); }

// ---------- cámaras ----------
const CAMS = SHOTS.slice(0, 6).map(() => new Rig({ tx: 0, ty: 1, tz: 0, d: 8, yw: 0, pt: .1, fov: 30, sh: 0, fw: 0 }));
CAMS[0].key(0, { tx: -1.15, ty: .45, tz: 1.0, d: 3.8, yw: .12, pt: .1 }).key(2.4, { tx: -1.12, ty: .55, tz: 1.0, d: 3.5, yw: .1, pt: .1 }, 'io').key(4.5, { tx: -1.1, ty: .55, tz: 1.0, d: 3.8, yw: .1, pt: .1 }, 'io');
CAMS[1].key(4.5, { tx: -.25, ty: 1.0, tz: .8, d: 10.5, yw: .05, pt: .08 }).key(6.6, { tx: -.55, ty: .95, tz: .8, d: 9.0, yw: .05, pt: .08 }, 'io')
  .key(SITS + .1, { tx: -.85, ty: .8, tz: .85, d: 7.2, yw: .05, pt: .08 }, 'o').key(10, { tx: -.8, ty: .85, tz: .85, d: 7.6, yw: .05, pt: .08 }, 'io');
CAMS[1].key(SITS, { sh: 0 }).key(SITS + .02, { sh: .7 }).key(SITS + .35, { sh: 0 });
CAMS[2].key(10, { tx: -.5, ty: 1.05, tz: .7, d: 8.6, yw: .05, pt: .08 }).key(ZIP + .3, { tx: .4, ty: 1.2, tz: .5, d: 11.5, yw: .05, pt: .08 }, 'io')
  .key(LIFT + .9, { tx: .75, ty: 1.35, tz: .4, d: 11.0, yw: .05, pt: .08 }, 'io')
  .key(LIFT + .91, { tx: SJ.x - .45, ty: .5, tz: SJ.z + .15, d: 3.8, yw: .15, pt: .08 }).key(12.8, { tx: SJ.x - .45, ty: .5, tz: SJ.z + .15, d: 3.6, yw: .15, pt: .08 })
  .key(12.81, { tx: 1.2, ty: 1.6, tz: .3, d: 11, yw: .0, pt: .08 }).key(15, { tx: 1.0, ty: 2.3, tz: .3, d: 11.6, yw: .0, pt: .08 }, 'io');
CAMS[2].key(PLONK, { sh: 0 }).key(PLONK + .02, { sh: .6 }).key(PLONK + .3, { sh: 0 });
CAMS[3].key(15, { tx: .75, ty: 2.4, tz: .4, d: 12, yw: .02, pt: .06 }).key(18.5, { tx: .7, ty: 2.5, tz: .45, d: 12.6, yw: .05, pt: .06 }, 'io')
  .key(SQUAT, { tx: .8, ty: 1.9, tz: .4, d: 9.0, yw: .05, pt: .06 }, 'io').key(FREEZE - .01, { tx: .8, ty: 1.9, tz: .4, d: 8.6, yw: .05, pt: .06 })
  .key(FREEZE, { tx: GJ.x + .05, ty: 2.3, tz: GJ.z + .2, d: 5.4, yw: .25, pt: .03 }).key(LAUNCH, { tx: GJ.x + .05, ty: 2.3, tz: GJ.z + .2, d: 5.1, yw: .25, pt: .03 });
CAMS[4].key(LAUNCH, { tx: .8, ty: 2.6, tz: .4, d: 11.5, yw: .05, pt: .04, fw: 0, sh: 1 }).key(LAUNCH + .4, { fw: .85, d: 9.0, sh: .2 }, 'o').key(23.6, { fw: .9, d: 8.0, yw: .25, pt: -.05, sh: 0 }, 'io')
  .key(24.15, { fw: .75, d: 10.5, yw: .05, pt: .05 }, 'io').key(DROP_S, { fw: 0, tx: .7, ty: 1.4, tz: .5, d: 10.5, yw: .05, pt: .07 }, 'io').key(26.5, { tx: .5, ty: 1.2, tz: .6, d: 10, yw: .05, pt: .08 }, 'io');
CAMS[4].key(DROP_S, { sh: 0 }).key(DROP_S + .02, { sh: 1 }).key(DROP_S + .4, { sh: 0 });
CAMS[5].key(26.5, { tx: .35, ty: 1.1, tz: .6, d: 10, yw: .05, pt: .08 }).key(EAT0, { tx: .3, ty: 1.05, tz: .7, d: 8.8, yw: .05, pt: .08 }, 'io')
  .key(POPUP, { tx: .45, ty: 1.2, tz: .6, d: 8.2, yw: .05, pt: .08 }, 'io').key(32.5, { tx: .4, ty: 1.45, tz: .6, d: 9.2, yw: .05, pt: .08 }, 'io');
CAMS.forEach(c => c.done());
const HOOK_CAM = (s, m) => { const k = E.io(seg(s, LAUNCH - .02, 21.55)); return { tx: lerp(.8, m.x, k), ty: lerp(2.0, m.y + 1.0, k), tz: lerp(.4, m.z, k), d: lerp(10.5, 8.6, k), yw: lerp(.08, .2, k), pt: lerp(.05, -.06, k), fov: 30 }; };
function storyTime(v) { if (v < HOOK) return HOOK_S0 + v * HOOK_K; if (v < OFF) return lerp(HOOK_S0 + HOOK * HOOK_K, 0, E.i(seg(v, HOOK, OFF))); return v - OFF; }
const arc = (p0, p1, u, h) => V3(lerp(p0.x, p1.x, u), lerp(p0.y, p1.y, u) + 4 * h * u * (1 - u), lerp(p0.z, p1.z, u));

// =====================================================================
//  FOTOGRAMA
// =====================================================================
const vhs = document.createElement('canvas'); vhs.width = W; vhs.height = H; const vctx = vhs.getContext('2d');
function render(v) {
  const s = storyTime(v), hook = v < HOOK, rew = v >= HOOK && v < OFF;
  resetFx(); for (const p of [steamP, puffP, sparkP, dropP, motes, splashP]) p.reset();
  const shot = shotOf(s);
  const msd = mochiState(s), psd = pipState(s);
  setPip(pip, psd, s); setMochi(mochi, msd, s);
  cheeks.forEach(c => { const k = msd.ck; c.visible = k > .02; c.scale.set(.18 + .2 * k, .16 + .17 * k, .14 + .15 * k); c.position.set(Math.sign(c.position.x) * (.6 + .12 * k), -.25 - .05 * k + (msd.chew ? Math.sin(s * 20) * .015 : 0), .38); });
  // gelatinas
  const fl = JL.val('flat', s), ssy = JL.val('ssy', s) * (1 + wobble(s, 's') * .12);
  small.g.position.set(SJ.x, .045, SJ.z); small.sq.scale.set(1 + (1 - ssy) * .4 * (1 - fl), Math.max(.01, ssy), 1 + (1 - ssy) * .4 * (1 - fl)); small.g.visible = fl < .99;
  flat.visible = fl > .01; flat.position.set(SJ.x, .06, SJ.z); flat.scale.set(fl, 1, fl);
  const gsy = gelSy(s), mk = JL.val('mold', s);
  giant.g.visible = mk >= 2.5 || s > LIFT; giant.g.position.copy(GJ); giant.sq.scale.set(1 + (1 - gsy) * .45, gsy, 1 + (1 - gsy) * .45); giant.sq.rotation.z = wobble(s, 'g') * .02;
  // molde
  mold.visible = s > BACK0 - .05 && mk < 3.99;
  if (mold.visible) {
    if (mk < 2) { const hand = V3(msd.x - .35, msd.y + 2.05 * MS + .25, msd.z); mold.position.copy(hand).lerp(GJ, E.io(clamp((mk - 1.6) / .4))); mold.rotation.set(0, 0, 0); }
    else if (mk < 3) { mold.position.set(GJ.x, (mk - 2) * 2.0, GJ.z); mold.rotation.set(0, 0, 0); }
    else { const u = mk - 3; mold.position.set(lerp(GJ.x, 4.5, u), 2.0 + Math.sin(u * Math.PI) * 1.2, lerp(GJ.z, -1.5, u)); mold.rotation.set(0, 0, -u * 1.8); }
  }
  // cuchara
  const spoonHeld = s > 27.3 && s < 32.5;
  if (!spoonHeld) { spoon.position.copy(SPOON0).add(V3(0, .03, 0)); spoon.rotation.set(0, .5, -Math.PI / 2); }
  else { scene.updateMatrixWorld(true); const paw = pip.arms[1].localToWorld(V3(0, -.14, 0)); spoon.position.copy(paw).add(V3(0, -.1, 0)); spoon.rotation.set(-pip.arms[1].rotation.x * .9, 0, 0); }
  scene.updateMatrixWorld(true);
  const spoonBowl = spoon.localToWorld(V3(0, .58, 0));
  scoop.visible = s > EAT0 + .25 && s < EAT0 + .7; if (scoop.visible) { scoop.position.copy(spoonBowl); scoop.scale.setScalar(.09); }
  jellyHat.visible = s > POPUP; if (jellyHat.visible) { const top = mochi.hT.localToWorld(V3(0, .72, .05)); jellyHat.position.copy(top); jellyHat.scale.set(.32, .14 + Math.sin(s * 9) * .015, .3); }

  // ---- efectos ----
  for (let i = 0; i < 18; i++) { const ph = (s * .05 + i / 18) % 1, sp = motes.next(); sp.position.set(-5 + rnd(i) * 9 + Math.sin(ph * TAU * 2 + i) * .3, .5 + ((rnd(i + 7) + ph * .4) % 1) * 6, -3 + rnd(i + 3) * 6); sp.scale.setScalar(.05 + rnd(i + 11) * .05); sp.material.opacity = Math.sin(ph * Math.PI) * .6; }
  const splash = (t0, c, n, rr, dur, sz) => { if (s > t0 && s < t0 + dur) { const k = seg(s, t0, t0 + dur); for (let i = 0; i < n; i++) { const a = i / n * TAU + rnd(i), d = splashP.next(); d.position.set(c.x + Math.cos(a) * (rr + k * rr * 2.2), c.y + (1.5 * rnd(i + 3) + .5) * k * rr * 2 - 3 * k * k * rr, c.z + Math.sin(a) * (rr + k * rr * 1.6)); d.scale.setScalar(sz * (1 - k * .5)); if (d.position.y < .02) d.visible = false; } } };
  splash(SITS + .05, V3(SJ.x, .1, SJ.z), 14, .3, .6, .05);
  splash(DROP_S, V3(GJ.x, TOPY, GJ.z), 20, .5, .9, .09);
  if (msd.sp > .02) for (const e of mochi.eyes) { const p = e.es.localToWorld(V3(-.25, .3, 1.05)); const sp = sparkP.next(); sp.position.copy(p); sp.scale.setScalar(msd.sp * .3 * (.8 + .3 * Math.sin(s * 14 + e.s))); sp.material.opacity = 1; sp.material.rotation = s * 3 * e.s; }
  const headTop = mochi.hT.localToWorld(V3(0, .9, 0));
  if (s > IDEA && s < ZIP) { const k = easeOutBack(seg(s, IDEA, IDEA + .2)) * (1 - seg(s, ZIP - .08, ZIP)); bulb.visible = true; bulb.position.set(headTop.x, headTop.y + .65, headTop.z); bulb.scale.setScalar(Math.max(.001, k) * .7); }
  if (s > ZIP && s < ZIP + .6) for (let i = 0; i < 9; i++) { const st0 = ZIP + .02 + i * .02, k = seg(s, st0, st0 + .55); if (k <= 0) continue; const sp = puffP.next(); sp.position.set(SJ.x + .4 + i * .5, .25 + k * .3 + rnd(i) * .3, SJ.z - .3 + (rnd(i + 3) - .5) * .5); sp.scale.setScalar(.3 + k * .5); sp.material.opacity = (1 - k) * .8; }
  if (s > PLONK && s < PLONK + .45) { const k = seg(s, PLONK, PLONK + .45); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, sp = puffP.next(); sp.position.set(GJ.x + Math.cos(a) * (1.3 + k * .8), .1 + k * .2, GJ.z + Math.sin(a) * (1.2 + k * .7)); sp.scale.setScalar(.25 + k * .4); sp.material.opacity = (1 - k) * .7; } }
  if (s > LAUNCH && s < LAUNCH + .6) { const k = seg(s, LAUNCH, LAUNCH + .6); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, sp = sparkP.next(); sp.position.set(GJ.x + Math.cos(a) * (.6 + k * 2), TOPY + .3 + Math.sin(a) * (.4 + k * 1.5), GJ.z + .6); sp.scale.setScalar((1 - k) * .4); sp.material.opacity = 1; } }
  if (s > PIP_LANDS && s < PIP_LANDS + .4) { const k = seg(s, PIP_LANDS, PIP_LANDS + .4); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, sp = puffP.next(); sp.position.set(PIP_LAND.x + Math.cos(a) * (.2 + k * .4), .08 + k * .1, PIP_LAND.z + Math.sin(a) * (.15 + k * .3)); sp.scale.setScalar(.12 + k * .2); sp.material.opacity = (1 - k) * .6; } }
  if (s > PIP_LANDS + .1 && s < PIP_LANDS + 1.4) { const ph0 = pip.head.localToWorld(V3(0, .3, 0)); for (let i = 0; i < 4; i++) { const a = s * 6 + i / 4 * TAU, sp = sparkP.next(); sp.position.set(ph0.x + Math.cos(a) * .3, ph0.y + .08, ph0.z + Math.sin(a) * .15); sp.scale.setScalar(.14); sp.material.opacity = 1; } }
  for (const t0 of [1.75, POPUP + .35]) if (s > t0 && s < t0 + 1.1) { const ph0 = pip.head.localToWorld(V3(0, .2, 0)); for (let i = 0; i < 3; i++) { const ph = ((s - t0) * 1.4 + i / 3) % 1, h = heartsPink.next(); h.position.set(ph0.x + .1 + ph * .2, ph0.y + .1 + ph * .5, ph0.z); h.scale.setScalar(Math.sin(ph * Math.PI) * .22); } }
  if (s > POPUP + .3 && s < 33) for (let i = 0; i < 3; i++) { const ph = ((s - POPUP) * .5 + i / 3) % 1, h = hearts.next(); h.position.set(headTop.x + .5 + Math.sin(ph * 6 + i) * .2, headTop.y + .1 + ph * 1.0, headTop.z + .2); h.scale.setScalar(Math.sin(ph * Math.PI) * .35); }
  beams.forEach((b, i) => b.material.opacity = .16 + .05 * Math.sin(s * TAU / 10 + i * 1.7));

  // ---- cámara ----
  let c;
  if (hook) c = HOOK_CAM(s, msd);
  else { const C = CAMS[shot]; c = {}; for (const k in C.d) c[k] = C.val(k, s); if (c.fw > 0 && s < DROP_S) { c.tx = lerp(c.tx, msd.x, c.fw); c.ty = lerp(c.ty, msd.y + 1.0, c.fw); c.tz = lerp(c.tz, msd.z, c.fw); } if (c.sh > 0) { c.tx += Math.sin(s * 83) * .05 * c.sh * c.d / 6; c.ty += Math.cos(s * 71) * .05 * c.sh * c.d / 6; } }
  if (hook && s > LAUNCH && s < LAUNCH + .5) { const k = 1 - seg(s, LAUNCH, LAUNCH + .5); c.tx += Math.sin(s * 83) * .1 * k; c.ty += Math.cos(s * 71) * .1 * k; }
  composite(c, shot === 4 || hook ? .8 : 1);

  // ---- acabado ----
  ctx.clearRect(0, 0, W, H);
  const slowA = s > SLOW[0][0] && s < SLOW[1][1] && !rew ? Math.min(seg(s, SLOW[0][0], SLOW[0][1]), 1 - seg(s, SLOW[1][0], SLOW[1][1])) : 0;
  if (slowA > 0) { const g = ctx.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .75); g.addColorStop(0, 'rgba(20,60,30,0)'); g.addColorStop(1, `rgba(20,60,30,${.34 * slowA})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  if ((s > LAUNCH && s < LAUNCH + .06) || (s > SITS + .05 && s < SITS + .1) || (s > DROP_S && s < DROP_S + .05)) { ctx.fillStyle = 'rgba(240,255,240,.5)'; ctx.fillRect(0, 0, W, H); }
  if (s > LAUNCH && s < LAUNCH + .5) focusLines(s, (1 - seg(s, LAUNCH + .15, LAUNCH + .5)) * (hook ? .6 : 1));
  if (s > ZIP && s < ZIP + .3) { const a = 1 - seg(s, ZIP + .15, ZIP + .3); ctx.save(); ctx.globalAlpha = a * .8; ctx.strokeStyle = '#fff7ea'; ctx.lineCap = 'round'; for (let i = 0; i < 9; i++) { const y = 1200 + (rnd(i) - .5) * 520, x0 = 300 + rnd(i + 3) * 300; ctx.lineWidth = 8 + rnd(i + 5) * 14; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 300 + rnd(i + 8) * 300, y); ctx.stroke(); } ctx.restore(); }
  warmGrade();
  if (v > SIGN_V) {
    const p = easeOutBack(seg(v, SIGN_V, SIGN_V + .35)), bob = Math.sin((v - SIGN_V) * 3) * 6;
    ctx.save(); ctx.translate(W / 2, 260 + bob); ctx.scale(p, p); brandTitle(ctx, 0, 0, 150, -.03); ctx.restore();
    const sh = seg(v, SIGN_V + .5, SIGN_V + 1.1);
    if (sh > 0 && sh < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const x = lerp(-300, W + 300, sh); const g = ctx.createLinearGradient(x - 120, 0, x + 120, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 160, W, 200); ctx.restore(); }
  }
  octx.drawImage(overlay, 0, 0);
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
