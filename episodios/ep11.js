// =====================================================================
//  EPISODIO 11 (3D) — "Bubble gum 🫧"   35 s · 9:16 · música: "Monkeys Spinning Monkeys" (Kevin MacLeod, CC BY 4.0)
//  GANCHO (0–2.4 s de vídeo): Mochi flota con un globo de chicle gigante, Pip lo pincha… ¡POP! a cámara lenta.
//  REBOBINADO VHS (2.4–2.9) y la historia (tiempo de historia = vídeo − 2.9):
//  1 (0–4.5)    Pip hace un globito de chicle perfecto.
//  2 (4.5–10)   Mochi se mete TODO el paquete en la boca. Intento 1: "pfff".
//  3 (10–15)    Intento 2: le explota en la cara; al despegarlo… ¡zas!, otra vez. Coge aire.
//  4 (15–22.3)  Intento 3: un globo gigante que le levanta del suelo. Pip coge un tenedor… silencio.
//  5 (22.3–27.6) ¡POP! a cámara lenta: Mochi queda cubierto de chicle, mira a cámara… y cae.
//  6 (27.6–32.1) Pip hace otro globito perfecto… que explota en la nariz de Mochi. Letrero "Mochi & Pip".
// =====================================================================
const DURATION = 35;
const HOOK = 2.4, REW = .5, OFF = HOOK + REW;
const HOOK_S0 = 21.95, HOOK_K = (24.5 - HOOK_S0) / HOOK;
const SIGN_V = 32.3;                         // letrero "Mochi & Pip" (tiempo de vídeo)
const MS = .72;                              // Mochi a escala reducida (cabe mejor en vertical)
const SHOTS = [0, 4.5, 10, 15, 22.3, 27.6, 99];
const shotOf = s => { let i = 0; while (i < 5 && s >= SHOTS[i + 1]) i++; return i; };

// ---------- disposición ----------
const PIPH = V3(-1.05, 0, 1.0), MH = V3(1.0, 0, .3), MYAW = -.85;
const PACK = V3(-.2, 0, .8), FORK0 = V3(-.75, 0, 1.75), STOOL = V3(-.3, 0, 1.4), STOOL_H = .36;
const POKE = 22.3, FREEZE = 21.85, FALL = 25.7;

// ---------- tiempo físico (cámara lenta del POP) ----------
const SLOW = [[POKE + .05, POKE + .2, .18], [25.5, FALL, 1]];
const rateAt = s => { if (s < SLOW[0][0]) return 1; if (s < SLOW[0][1]) return lerp(1, .18, seg(s, SLOW[0][0], SLOW[0][1])); if (s < SLOW[1][0]) return .18; if (s < SLOW[1][1]) return lerp(.18, 1, seg(s, SLOW[1][0], SLOW[1][1])); return 1; };
const TAUT = (() => { const dt = 1 / 600, n = Math.ceil(40 / dt), a = new Float32Array(n + 1); for (let i = 1; i <= n; i++) a[i] = a[i - 1] + rateAt((i - .5) * dt) * dt; return { a, dt }; })();
const phys = s => { const f = clamp(s, 0, 39.9) / TAUT.dt, i = Math.floor(f); return TAUT.a[i] + (TAUT.a[i + 1] - TAUT.a[i]) * (f - i); };
const P0 = phys(POKE);

// ---------- materiales de chicle ----------
const GUM = new THREE.MeshPhysicalMaterial({ color: '#ff8cc6', roughness: .22, clearcoat: 1, clearcoatRoughness: .15, sheen: .6, sheenColor: new THREE.Color('#ffd1ea') });
const GUM_BUBBLE = new THREE.MeshPhysicalMaterial({ color: '#ff86c4', roughness: .05, clearcoat: 1, transparent: true, opacity: .58, depthWrite: false, emissive: '#ff4f9e', emissiveIntensity: .55, fog: false });
const shine = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: '#ffffff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(shine);
const shine2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: '#ffffff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(shine2);

// ---------- atrezo ----------
const pack = new THREE.Group(); scene.add(pack);
pack.add(mesh(new THREE.BoxGeometry(.42, .08, .2), mat('#ff6fae', .45), { y: .04 }));
pack.add(mesh(new THREE.BoxGeometry(.43, .02, .21), mat('#ffffff', .4), { y: .06 }));
for (const x of [-.12, 0, .12]) pack.add(mesh(SPH, mat('#ffd23f', .4), { x, y: .085, sx: .03, sy: .01, sz: .03, shadow: false }));
const sticks = Array.from({ length: 5 }, () => { const m = mesh(new THREE.BoxGeometry(.06, .015, .17), mat('#ffb8d9', .5)); scene.add(m); return m; });
const fork = new THREE.Group(); scene.add(fork);
{
  const steel = mat('#dfe3ea', .2, { metalness: .8 });
  fork.add(mesh(new THREE.CylinderGeometry(.025, .03, .55, 12), steel, { y: .27 }));
  fork.add(mesh(new THREE.BoxGeometry(.16, .06, .025), steel, { y: .57 }));
  for (let i = 0; i < 4; i++) fork.add(mesh(new THREE.BoxGeometry(.018, .2, .018), steel, { x: -.06 + i * .04, y: .69 }));
}
const stool = new THREE.Group(); stool.position.copy(STOOL); scene.add(stool);
stool.add(mesh(new THREE.BoxGeometry(.5, STOOL_H, .46), mat('#d79a62', .55), { y: STOOL_H / 2 }));
stool.add(mesh(new THREE.BoxGeometry(.52, .03, .48), mat('#e8b07c', .5), { y: STOOL_H }));
// burbujas
const bigB = mesh(SPH, GUM_BUBBLE, { shadow: false }); bigB.renderOrder = 5; scene.add(bigB);
const pipB = mesh(SPH, GUM_BUBBLE, { shadow: false }); pipB.renderOrder = 5; scene.add(pipB);
// trozos de chicle del POP
const NSH = 150;
const SHARD_GEO = (() => { const g = new THREE.SphereGeometry(1, 6, 4, 0, .8, 0, .7); g.center(); return g; })();
const shards = new THREE.InstancedMesh(SHARD_GEO, new THREE.MeshPhysicalMaterial({ color: '#ff8cc6', roughness: .2, clearcoat: 1, side: THREE.DoubleSide }), NSH);
shards.frustumCulled = false; shards.castShadow = true; scene.add(shards);
const SH = []; for (let i = 0; i < NSH; i++) { const u = rnd(i) * 2 - 1, a = rnd(i + 99) * TAU, r = Math.sqrt(1 - u * u); SH.push({ d: V3(r * Math.cos(a), u, r * Math.sin(a)), v: 2.2 + rnd(i + 7) * 3.2, s: .14 + rnd(i + 3) * .22, ax: V3(rnd(i + 1) - .5, rnd(i + 2) - .5, rnd(i + 4) - .5).normalize(), sp: 3 + rnd(i + 5) * 7 }); }
// chicle en la cara, hilo al despegarlo, punto en la nariz
mochi.root.scale.setScalar(MS); mochi.hemTail.visible = mochi.hemTip.visible = false;
const faceGum = mesh(SPH, GUM, { y: -.18, z: .72, shadow: false }); mochi.hT.add(faceGum);
const noseDot = mesh(SPH, GUM, { y: .02, z: .96, shadow: false }); mochi.hT.add(noseDot);
const strand = mesh(new THREE.CylinderGeometry(1, 1, 1, 10), GUM, { shadow: false }); scene.add(strand);
const cheeks = [-1, 1].map(s => { const m = mesh(SPH, MC.fur, { x: s * .62, y: -.25, z: .38, sx: .01, sy: .01, sz: .01 }); mochi.hT.add(m); return m; });
// Mochi cubierto de chicle: cambio de materiales del pelaje
const FUR_MATS = [MC.fur, MC.dark, MC.cream];
const furMeshes = []; mochi.root.traverse(o => { if (o.isMesh && FUR_MATS.includes(o.material)) furMeshes.push({ o, m: o.material }); });
const GUM_DARK = GUM.clone(); GUM_DARK.color.set('#ff73b6');
function coat(on) { for (const f of furMeshes) f.o.material = on ? (f.m === MC.dark ? GUM_DARK : GUM) : f.m; }
const drips = Array.from({ length: 6 }, () => { const m = mesh(SPH, GUM, { shadow: false }); scene.add(m); return m; });

// =====================================================================
//  GUION
// =====================================================================
const MO = new Rig({ x: 4.6, y: 0, z: MH.z, yaw: -1.3, lean: 0, roll: 0, sx: 1, sy: 1, sz: 1, wr: 0, wamt: 0,
  aLf: .15, aLo: .22, aRf: .15, aRo: .22, hp: 0, hy: 0, hr: 0, hs: 1, eb: 1, pd: 1, lid: 0, lx: 0, ly: 0, sp: 0,
  mo: 0, tg: 0, tu: 0, lk: 0, br: 0, brA: 1, tw: 1, wg: 0, sn: 0, pk: 0, ed: 0, sit: 0, cross: 0, ck: 0, chew: 0 });
const MMODE = new Steps('hidden');
const PI_ = new Rig({ x: PIPH.x, y: 0, z: PIPH.z, yaw: .5, lean: 0, roll: 0, sx: 1, sy: 1, wr: 0, wamt: 0,
  aLf: .1, aLo: .25, aRf: .1, aRo: .25, hp: 0, hy: 0, hr: 0, lid: 0, lx: 0, ly: 0, sm: 1, mo: 0, ed: 0, must: 0, rub: 0, kick: 0, fid: 0, tailUp: 0, chew: 0, wave: 0 });
const BG_ = new Rig({ r: 0, pr: 0, face: 0, nose: 0 });                  // radios de las burbujas y chicle en la cara
const KM = (t, v, e) => MO.key(t, v, e), P = (t, v, e) => PI_.key(t, v, e), B = (t, v, e) => BG_.key(t, v, e);

// ---------------- 1 (0–4.5): el globito de Pip ----------------
P(0, { chew: 1, lid: .3 }); P(1.0, { chew: 1 }); P(1.1, { chew: 0, lid: 0 });
B(1.1, { pr: 0 }); B(2.5, { pr: .15 }, 'io'); B(2.62, { pr: .16 }); B(2.64, { pr: 0 }, 'hold');
P(1.2, { sy: 1, ly: 0, lx: 0 }); P(2.4, { sy: 1.06, ly: .3, lx: -.2, lid: 0 }); P(2.62, { lid: 1, sy: 1.12, y: 0 }); P(2.8, { lid: 0, sy: 1, y: .1 }, 'oq'); P(2.95, { y: 0 }, 'iq');
P(3.0, { aLf: .1, aLo: .25, aRf: .1, aRo: .25, lid: 0 }); P(3.25, { aLf: -.35, aLo: .75, aRf: -.35, aRo: .75, hp: -.25, lid: .9, sy: 1.06 }, 'back');
P(3.9, { lid: .9, hp: -.25 }); P(4.1, { lid: 0, hp: 0, chew: 1 }); P(4.5, { chew: 1 });
// ---------------- 2 (4.5–10): todo el paquete ----------------
const GRAB = 6.0, GULP0 = 6.35, GULP1 = 7.0;
MMODE.at(4.5, 'full');
KM(4.5, { x: 4.6, yaw: -1.3, wr: 2.4, wamt: 1, lid: .3 }); KM(5.5, { wr: 2.4, wamt: 1 }); KM(5.6, { x: MH.x, wr: 0, wamt: 0 }, 'o'); KM(5.6, { yaw: -1.3 }); KM(5.75, { yaw: MYAW });
KM(5.55, { eb: 1, sp: 0, lid: .3 }); KM(5.75, { eb: 1.35, sp: .9, lid: 0, lx: -.5 }, 'back');
KM(5.75, { x: MH.x, z: MH.z, lean: 0, aRf: .15, aRo: .22 }); KM(GRAB, { x: .55, z: .55, lean: .5, aRf: 1.2, aRo: -.2, sp: 0 }, 'io');
KM(GRAB + .25, { x: .7, z: .45, lean: 0, aRf: 2.3, aRo: .1, hp: -.45, mo: 1.3, eb: 1.2 }, 'o');
KM(GULP1, { aRf: 2.3, mo: 1.3, hp: -.45 }); KM(GULP1 + .15, { aRf: .3, aRo: .22, mo: 0, hp: 0, ck: 0 }, 'o'); KM(GULP1 + .25, { ck: 1.45 }, 'back');
KM(GULP1 + .2, { chew: 0, lid: 0 }); KM(GULP1 + .3, { chew: 1, lid: .85 }); KM(8.8, { chew: 1, lid: .85, x: .7, z: .45 }); KM(9.0, { chew: 0, lid: 0, x: MH.x, z: MH.z });
P(4.5, { chew: 1 }); P(4.9, { chew: 0, hy: .5, lx: .5 }); P(GRAB, { mo: 0, aLf: .1, aRf: .1 }); P(GRAB + .3, { mo: 1, aLf: 2.6, aRf: 2.6, aLo: .4, aRo: .4, ed: .5, wave: 1 });
P(GULP1 + .2, { wave: 1, mo: 1 }); P(GULP1 + .4, { wave: 0, mo: 0, aLf: 1.4, aRf: .1, aLo: -.85, aRo: .25, lid: .6, hp: .3 }); P(9.8, { aLf: 1.4, lid: .6, hp: .3 }); P(10.0, { aLf: .1, aLo: .25, lid: 0, hp: 0, ed: 0, hy: .5 });
// intento 1: "pfff"
const T1 = 9.25;
B(T1, { r: 0 }); B(T1 + .25, { r: .1 }, 'o'); B(T1 + .32, { r: 0 }, 'hold');
KM(T1 - .1, { ck: 1.45, mo: 0 }); KM(T1, { ck: 1.65 }); KM(T1 + .3, { ck: 1.1 }); KM(T1 + .4, { ed: 0, lid: 0 }); KM(T1 + .6, { ed: .7, lid: .4 });
// ---------------- 3 (10–15): en la cara… y otra vez ----------------
const T2 = 10.3, SPL = 11.55, PEEL = 12.2, SNAP = 12.95;
KM(10.1, { ed: .7, lid: .4, br: 0 }); KM(10.3, { ed: 0, lid: 0, br: 1, brA: 1.1 });
B(T2, { r: 0 }); B(SPL - .02, { r: .58 }, 'io'); B(SPL, { r: 0 }, 'hold');
KM(T2, { ck: 1.1, eb: 1 }); KM(SPL - .3, { ck: 1.5, eb: 1.3, cross: 0 }); KM(SPL - .05, { cross: .8 });
B(SPL, { face: 0 }); B(SPL + .05, { face: 1.15 }, 'o'); B(SPL + .25, { face: 1 }, 'back');
KM(SPL, { ck: .6, cross: .8, eb: 1.3, lid: 0 }); KM(SPL + .3, { cross: 0, lid: .5 }); KM(SPL + .45, { lid: 0 });
KM(PEEL - .1, { aRf: .3, aRo: .22, lean: 0 }); KM(PEEL + .15, { aRf: 1.9, aRo: -.4 }, 'o'); KM(SNAP - .05, { aRf: 2.4, aRo: .5, lean: -.15 }, 'io');
B(PEEL + .1, { face: 1 }); B(PEEL + .2, { face: .85 }); B(SNAP - .02, { face: .55 }); B(SNAP + .04, { face: 1.25 }, 'o'); B(SNAP + .25, { face: 1 }, 'back');
KM(SNAP, { aRf: 2.4, lean: -.15 }); KM(SNAP + .15, { aRf: .3, aRo: .22, lean: .1, eb: 1, lid: .55, ed: .6 }, 'o');
KM(13.3, { hr: 0 }); KM(13.4, { hr: .35 }); KM(13.5, { hr: -.35 }); KM(13.6, { hr: .3 }); KM(13.7, { hr: 0, lid: 0, ed: 0 });
B(13.35, { face: 1 }); B(13.7, { face: 0 }, 'i');
P(SPL + .2, { lid: 0, sm: 1 }); P(SPL + .35, { lid: .9, aLf: 2.2, aLo: -.75, hy: .2 }); P(12.6, { lid: .9 }); P(12.75, { lid: 0, aLf: .1, aLo: .25 }); P(SNAP + .15, { lid: .9, aLf: 2.2, aLo: -.75 }); P(13.9, { lid: .9 }); P(14.1, { lid: 0, aLf: .1, aLo: .25, hy: .5 });
for (let k = 0; k < 4; k++) { P(SPL + .35 + k * .17, { sy: 1.08 }); P(SPL + .43 + k * .17, { sy: .95 }); P(SNAP + .2 + k * .17, { sy: 1.08 }); P(SNAP + .28 + k * .17, { sy: .95 }); }
P(13.9, { sy: 1 });
// coge aire
KM(13.9, { sx: 1, sy: 1, br: 1, brA: 1.3, lid: 0, eb: 1, hp: 0 }); KM(14.8, { sx: 1.16, sy: 1.1, ck: 1.7, hp: -.15, lid: .3 }, 'io');
// ---------------- 4 (15–22.3): ¡el globo gigante! ----------------
const T3 = 15.1;
B(T3, { r: 0 }); B(16.6, { r: .7 }, 'io'); B(18.2, { r: 1.05 }, 'io'); B(20.0, { r: 1.22 }, 'io'); B(POKE, { r: 1.25 });
KM(T3, { sx: 1.16, sy: 1.1, ck: 1.7 }); KM(16.4, { sx: 1, sy: 1, ck: 1.0, hp: 0 }, 'io');
KM(16.6, { lid: .3, br: 1, eb: 1 }); KM(17.4, { lid: .6, br: 0, mo: 0 });
KM(17.5, { y: 0 }); KM(19.2, { y: .55 }, 'io'); KM(21.3, { y: 1.25 }, 'io'); KM(POKE, { y: 1.32 });
KM(18.3, { lid: .6, ly: 0, eb: 1 }); KM(18.6, { lid: 0, ly: -.8, eb: 1.3, hp: .35 }, 'o'); KM(19.4, { ly: -.8, eb: 1.3, aLf: .15, aRf: .15, aLo: .22, aRo: .22 });
KM(19.7, { aLf: .9, aRf: 1.4, aLo: 1.1, aRo: 1.1, eb: 1.45, ed: .4 }); KM(21.5, { aLf: .9, aRf: 1.4 });
KM(21.6, { hy: 0, ly: -.8, lx: 0, hp: .35 }); KM(21.65, { ly: -.9, lx: -.6, eb: 1.7 }); KM(FREEZE, { eb: 1.7 });
P(17.4, { hy: .5, ly: 0, mo: 0 }); P(17.6, { ly: .8, mo: .8, hp: -.3 });
P(18.75, { x: PIPH.x, z: PIPH.z, yaw: .5, wr: 0, wamt: 0, hp: -.3 }); P(18.8, { yaw: 1.9, wr: 6, wamt: 1, hp: 0, mo: .4 }); P(19.4, { x: FORK0.x - .1, z: FORK0.z - .05, wr: 6, wamt: 1 }, 'io'); P(19.45, { wr: 0, wamt: 0 });
P(19.45, { lean: 0 }); P(19.6, { lean: .5, aRf: 1.1 }); P(19.8, { lean: 0, aRf: 2.8, aRo: .1, yaw: 1.9 });
P(19.85, { wr: 0, wamt: 0, x: FORK0.x - .1, z: FORK0.z - .05 }); P(19.9, { wr: 6, wamt: 1, yaw: 2.6 }); P(20.25, { x: STOOL.x - .32, z: STOOL.z + .05, wr: 6, wamt: 1 }, 'io'); P(20.3, { wr: 0, wamt: 0 });
P(20.3, { y: 0, sy: 1 }); P(20.36, { sy: .8 }); P(20.5, { y: STOOL_H + .25, x: STOOL.x - .16, sy: 1.1 }, 'oq'); P(20.62, { y: STOOL_H, x: STOOL.x, z: STOOL.z, sy: .85 }, 'iq'); P(20.75, { sy: 1 }, 'back');
P(20.6, { yaw: 2.6 }); P(20.8, { yaw: .25 }); P(20.8, { aRf: 2.8, aLf: .1, ly: .9, hp: -.35, mo: 0 });
P(21.0, { y: STOOL_H, sy: 1 }); P(21.3, { y: STOOL_H + .05, sy: 1.12 }); P(21.6, { y: STOOL_H + .05 });
P(FREEZE, { hy: 0, ly: .9, lx: 0, sm: 1, lid: 0 }); P(FREEZE + .1, { hy: .25, ly: 0, lx: .3, lid: .45, hp: 0 }, 'o');      // sonrisa traviesa a cámara
P(POKE - .08, { y: STOOL_H + .05, sy: 1.12, aRf: 2.8 }); P(POKE, { y: STOOL_H + .17, sy: 1.25 }, 'o');
// ---------------- 5 (22.3–27.6): ¡POP! ----------------
KM(POKE, { eb: 1.7, mo: 0, hy: 0, aLf: .9, aRf: 1.4 }); KM(POKE + .12, { eb: 1.8, mo: .6, aLf: 2.6, aRf: 2.6, aLo: .9, aRo: .9, ly: 0, lx: 0, hp: 0 }, 'o');
KM(24.55, { hy: 0, lx: 0, ly: 0 }); KM(25.0, { hy: .55, lx: .5, ly: .1, eb: 1.5, mo: .15 }, 'io'); KM(25.3, { lid: 0 }); KM(25.38, { lid: 1 }); KM(25.46, { lid: 0 });
P(POKE + .15, { mo: 1, lid: 0, sm: 1, hy: 0, lx: 0, ly: .9 }); P(26.4, { mo: 1, aRf: 2.8 }); P(26.6, { mo: 0, aRf: .1, aLf: .1, aLo: 1.0, aRo: 1.0, hp: .1, lid: .3, ly: 0 }, 'o');
// ---------------- 6 (27.6–32.1): el globito perfecto ----------------
const LAND = 26.05, PB0 = 29.05, PB1 = 30.2;
KM(LAND, { sit: 0 }); KM(LAND + .5, { sit: 1, hy: 0, lx: 0, eb: 1, mo: 0, aLf: .15, aRf: .15, aLo: .22, aRo: .22, lid: .4, ed: .5 });
KM(27.4, { lid: .4, hy: 0 }); KM(27.8, { lid: 0, ed: .2, hy: -.3, lx: -.6, ly: 0 });
P(26.9, { x: STOOL.x, y: STOOL_H, z: STOOL.z, yaw: .25, sy: 1 }); P(27.05, { y: STOOL_H + .2, x: STOOL.x + .15 }, 'oq'); P(27.2, { y: 0, x: STOOL.x + .3 }, 'iq');
P(27.6, { x: STOOL.x + .3, z: STOOL.z, wr: 0, wamt: 0, yaw: 1.4 }); P(27.65, { wr: 5.5, wamt: 1 }); P(28.4, { x: .25, z: .95, wr: 5.5, wamt: 1 }, 'io'); P(28.45, { wr: 0, wamt: 0, yaw: .3 });
P(28.5, { chew: 0, lid: .3, aLo: .25, aRo: .25, aLf: .1, aRf: .1, mo: 0, hp: 0 }); P(28.6, { chew: 1 }); P(PB0, { chew: 0, lid: 0, sm: 1 });
B(PB0, { pr: 0 }); B(PB1, { pr: .17 }, 'io'); B(PB1 + .02, { pr: 0 }, 'hold'); B(PB1, { nose: 0 }); B(PB1 + .08, { nose: 1 }, 'back');
KM(PB0, { lx: -.6, ly: 0, eb: 1, lid: 0, hy: -.3 }); KM(PB1 - .2, { eb: 1.3, lx: -.6 }); KM(PB1 + .1, { cross: 0, hy: -.3 }); KM(PB1 + .35, { cross: 1, hy: 0, lx: 0, eb: 1.2 }, 'o');
KM(31.2, { cross: 1, lid: 0 }); KM(31.5, { cross: 0, lid: .55, ed: .5, eb: 1 });
P(PB1 + .2, { lid: 0, sm: 1 }); P(PB1 + .35, { lid: .9, aLf: 2.2, aLo: -.75, hy: .2 }); P(31.5, { lid: .9 });
for (let k = 0; k < 6; k++) { P(PB1 + .35 + k * .17, { sy: 1.08 }); P(PB1 + .43 + k * .17, { sy: .95 }); }
for (const r of [MO, PI_, BG_]) r.done();

// ---------- estados ----------
const Y_HANG = 1.32, G = 30;
const LAND_S = (() => { for (let s = FALL; s < 30; s += .002) if (Y_HANG - .5 * G * (phys(s) - phys(FALL)) ** 2 <= 0) return s; return 99; })();
function mochiState(s) {
  const st = {}; for (const k in MO.d) st[k] = MO.val(k, s);
  st.walk = MO.integ('wr', s); st.mode = MMODE.get(s);
  if (st.mode === 'full') st.sy *= 1 + Math.sin(s * 3.2) * .012;
  if (s > 17.5 && s < POKE) { st.y += Math.sin(s * 2.2) * .06 * clamp((s - 17.5) / 1.5); st.roll += Math.sin(s * 1.7) * .06; st.walk = s * 1.4; st.wamt = .5 * clamp((s - 18.4) / .5); }
  if (s >= POKE) {   // flota quieto (gag de dibujos), mira a cámara y cae
    st.y = Y_HANG; st.walk = s * .8; st.wamt = .35;
    if (s >= FALL) { const u = phys(s) - phys(FALL); st.y = Math.max(0, Y_HANG - .5 * G * u * u); st.wamt = 0; }
    if (s >= LAND_S) { const k = seg(s, LAND_S, LAND_S + .35); st.sy = lerp(.55, 1, easeOutBack(k)); st.sx = lerp(1.4, 1, easeOutBack(k)); st.sz = st.sx; }
  }
  return st;
}
function pipState(s) {
  const st = {}; for (const k in PI_.d) st[k] = PI_.val(k, s);
  st.walk = PI_.integ('wr', s); st.sy *= 1 + Math.sin(s * 4.1) * .015;
  if (st.chew > 0) st.mo = Math.max(st.mo, (Math.sin(s * 22) * .5 + .5) * .5 * st.chew);
  if (st.wave > 0) { st.aLf += Math.sin(s * 18) * .35 * st.wave; st.aRf += Math.sin(s * 18 + 2) * .35 * st.wave; st.y += Math.abs(Math.sin(s * 9)) * .05 * st.wave; }
  st.dripT = 99;
  return st;
}

// ---------- cámaras ----------
const CAMS = SHOTS.slice(0, 6).map(() => new Rig({ tx: 0, ty: 1, tz: 0, d: 8, yw: 0, pt: .1, fov: 30, sh: 0 }));
CAMS[0].key(0, { tx: -1.0, ty: .5, tz: 1.0, d: 3.5, yw: .12, pt: .1 }).key(2.4, { tx: -1.0, ty: .5, tz: 1.0, d: 3.1, yw: .1, pt: .1 }, 'io').key(4.5, { tx: -.9, ty: .55, tz: 1.0, d: 3.6, yw: .1, pt: .1 }, 'io');
CAMS[1].key(4.5, { tx: .1, ty: 1.0, tz: .65, d: 11, yw: .05, pt: .08 }).key(GRAB, { tx: .0, ty: .95, tz: .7, d: 9.6, yw: .05, pt: .08 }, 'io')
  .key(GULP1 + .2, { tx: .2, ty: 1.15, tz: .6, d: 8.6, yw: -.05, pt: .06 }, 'io').key(10, { tx: .2, ty: 1.15, tz: .55, d: 8.8, yw: -.05, pt: .06 }, 'io');
CAMS[1].key(T1, { sh: 0 }).key(T1 + .3, { sh: .25 }).key(T1 + .4, { sh: 0 });
CAMS[2].key(10, { tx: .35, ty: 1.2, tz: .5, d: 8.6, yw: -.2, pt: .06 }).key(SPL, { tx: .4, ty: 1.25, tz: .5, d: 7.6, yw: -.2, pt: .05 }, 'io')
  .key(13.8, { tx: .35, ty: 1.2, tz: .5, d: 8.0, yw: -.2, pt: .05 }, 'io').key(15, { tx: .45, ty: 1.3, tz: .5, d: 7.4, yw: -.2, pt: .05 }, 'io');
CAMS[2].key(SPL, { sh: 0 }).key(SPL + .02, { sh: .7 }).key(SPL + .3, { sh: 0 }).key(SNAP + .02, { sh: .6 }).key(SNAP + .3, { sh: 0 });
CAMS[3].key(15, { tx: .35, ty: 1.5, tz: .7, d: 9.0, yw: -.05, pt: .06 }).key(18.4, { tx: .15, ty: 1.9, tz: .9, d: 11.5, yw: .05, pt: .07 }, 'io')
  .key(21.55, { tx: .0, ty: 2.0, tz: 1.0, d: 12.2, yw: .08, pt: .07 }, 'io')
  .key(21.56, { tx: MH.x - .2, ty: 2.6, tz: MH.z + .2, d: 6.8, yw: -.3, pt: .02 }).key(FREEZE - .01, { tx: MH.x - .2, ty: 2.6, tz: MH.z + .2, d: 6.5, yw: -.3, pt: .02 })
  .key(FREEZE, { tx: STOOL.x, ty: .95, tz: STOOL.z, d: 3.2, yw: .15, pt: .1 }).key(POKE, { tx: STOOL.x, ty: .95, tz: STOOL.z, d: 3.0, yw: .15, pt: .1 });
const WIDE = { tx: .1, ty: 2.1, tz: 1.0, d: 11.5, yw: .1, pt: .04 };
CAMS[4].key(POKE, { ...WIDE, sh: 1 }).key(POKE + .5, { ...WIDE, d: 10.8, sh: .2 }, 'o').key(24.4, { tx: .3, ty: 2.25, tz: .9, d: 9.5, yw: -.05, pt: .03, sh: 0 }, 'io')
  .key(25.1, { tx: MH.x - .1, ty: 2.25, tz: MH.z, d: 6.8, yw: .3, pt: .02 }, 'io').key(FALL, { tx: MH.x - .1, ty: 2.2, tz: MH.z, d: 6.6, yw: .3, pt: .02 })
  .key(LAND_S, { tx: MH.x - .3, ty: 1.0, tz: .6, d: 8.6, yw: .1, pt: .08 }, 'io').key(27.6, { tx: MH.x - .4, ty: .95, tz: .6, d: 8.4, yw: .1, pt: .08 }, 'io');
CAMS[4].key(LAND_S, { sh: 0 }).key(LAND_S + .02, { sh: 1 }).key(LAND_S + .4, { sh: 0 });
CAMS[5].key(27.6, { tx: .55, ty: .85, tz: .75, d: 8.4, yw: .05, pt: .08 }).key(PB0, { tx: .5, ty: .8, tz: .8, d: 7.8, yw: .05, pt: .08 }, 'io')
  .key(PB1 + .4, { tx: .55, ty: .9, tz: .7, d: 6.6, yw: .0, pt: .06 }, 'io').key(32.5, { tx: .5, ty: 1.2, tz: .7, d: 8.4, yw: .05, pt: .07 }, 'io');
CAMS.forEach(c => c.done());
const HOOK_CAM = s => { const k = E.io(seg(s, POKE + .1, 24.5)); return { tx: lerp(.0, .4, k), ty: lerp(1.85, 2.25, k), tz: 1.0, d: lerp(11.8, 8.6, k), yw: lerp(.12, -.05, k), pt: .04, fov: 30 }; };
function storyTime(v) {
  if (v < HOOK) return HOOK_S0 + v * HOOK_K;
  if (v < OFF) return lerp(HOOK_S0 + HOOK * HOOK_K, 0, E.i(seg(v, HOOK, OFF)));
  return v - OFF;
}
const arc = (p0, p1, u, h) => V3(lerp(p0.x, p1.x, u), lerp(p0.y, p1.y, u) + 4 * h * u * (1 - u), lerp(p0.z, p1.z, u));

// =====================================================================
//  FOTOGRAMA
// =====================================================================
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s3 = V3();
const vhs = document.createElement('canvas'); vhs.width = W; vhs.height = H; const vctx = vhs.getContext('2d');
function render(v) {
  const s = storyTime(v), hook = v < HOOK, rew = v >= HOOK && v < OFF;
  resetFx(); for (const p of [steamP, puffP, sparkP, dropP, motes]) p.reset();
  const shot = shotOf(s), pp = phys(s);
  const msd = mochiState(s), psd = pipState(s);
  setPip(pip, psd, s); setMochi(mochi, msd, s);
  coat(s >= POKE + .03);
  cheeks.forEach(c => { const k = msd.ck; c.visible = k > .02; c.scale.set(.18 + .2 * k, .16 + .17 * k, .14 + .15 * k); c.position.set(Math.sign(c.position.x) * (.6 + .12 * k), -.25 - .05 * k + (msd.chew ? Math.sin(s * 20) * .015 : 0), .38); c.material = s >= POKE + .03 ? GUM : MC.fur; });
  const fk = BG_.val('face', s); faceGum.visible = fk > .01; faceGum.scale.set(.62 * fk, .42 * fk, .3 * fk);
  const nk = BG_.val('nose', s); noseDot.visible = nk > .01; noseDot.scale.setScalar(.11 * nk);
  scene.updateMatrixWorld(true);
  const mouthW = mochi.hT.localToWorld(V3(0, -.36, .8)), fwdW = mochi.hT.localToWorld(V3(0, -.36, 1.8)), dir = fwdW.clone().sub(mouthW).normalize();
  const pipMouth = pip.head.localToWorld(V3(0, -.09, .22)), pipFwd = pip.head.localToWorld(V3(0, -.09, .5)), pdir = pipFwd.clone().sub(pipMouth).normalize();
  const pawR = mochi.arms[1].localToWorld(V3(0, -.6, 0));

  // ---- burbujas ----
  const r = BG_.val('r', s), pr = BG_.val('pr', s);
  bigB.visible = r > .005 && s < POKE + .01;
  shine.visible = shine2.visible = false;
  if (bigB.visible) {
    const wob = 1 + Math.sin(s * 9) * .03 * Math.min(1, r);
    const c = mouthW.clone().addScaledVector(dir, r * .92);
    bigB.position.copy(c); bigB.scale.set(r * wob, r / wob, r * wob);
    shine.visible = true; shine.position.copy(c).add(V3(-r * .38, r * .42, r * .5)); shine.scale.setScalar(r * .55); shine.material.opacity = .65;
    shine2.visible = true; shine2.position.copy(c).add(V3(r * .3, -r * .35, r * .55)); shine2.scale.setScalar(r * .25); shine2.material.opacity = .4;
  }
  pipB.visible = pr > .003;
  if (pipB.visible) { pipB.position.copy(pipMouth).addScaledVector(pdir, pr * .9); pipB.scale.setScalar(pr); }
  // ---- trozos del POP (en tiempo físico) ----
  for (let i = 0; i < NSH; i++) {
    const sh = SH[i]; let vis = s >= POKE, p;
    if (vis) {
      const u = pp - P0, R0 = 1.25;
      p = POP_CENTER.clone().addScaledVector(sh.d, R0 * (1 + .15 * Math.min(1, u * 8)) + sh.v * u); p.y -= 4.5 * u * u;
      if (p.y < .01) { p.y = .01; }
      _q.setFromAxisAngle(sh.ax, u * sh.sp + i); _s3.setScalar(sh.s * (1 - clamp((u - 1.4) / .4)));
      if (_s3.x < .005) vis = false;
    }
    _m4.compose(vis ? p : V3(0, -5, 0), vis ? _q : new THREE.Quaternion(), vis ? _s3 : V3(0, 0, 0)); shards.setMatrixAt(i, _m4);
  }
  shards.instanceMatrix.needsUpdate = true;
  // ---- hilo al despegar el chicle de la cara ----
  strand.visible = s > PEEL + .1 && s < SNAP;
  if (strand.visible) { const a = mochi.hT.localToWorld(V3(0, -.18, .9)), b = pawR, mid = a.clone().add(b).multiplyScalar(.5), len = a.distanceTo(b); strand.position.copy(mid); strand.quaternion.setFromUnitVectors(V3(0, 1, 0), b.clone().sub(a).normalize()); const th = .05 * (1 - seg(s, PEEL + .1, SNAP) * .6); strand.scale.set(th, len, th); }
  // ---- paquete y palitos ----
  const packHeld = s > GRAB + .05 && s < GULP1 + .15;
  pack.visible = !(s > GULP1 + 1.0);
  if (s < GRAB + .05) { pack.position.copy(PACK); pack.rotation.set(0, .3, 0); }
  else if (packHeld) { pack.position.copy(pawR); pack.rotation.set(-1.2 * seg(s, GRAB + .1, GULP0), .3, 0); }
  else { const u = seg(s, GULP1 + .15, GULP1 + 1.0); pack.position.copy(arc(V3(pawR.x, pawR.y, pawR.z), V3(3.2, .05, -.4), u, 1.2)); pack.rotation.set(u * 9, u * 4, 0); }
  sticks.forEach((m, i) => { const t0 = GULP0 + i * .1, u = seg(s, t0, t0 + .28); m.visible = s > t0 && u < 1; if (m.visible) { m.position.copy(arc(pack.position, mouthW, u, .35)); m.rotation.set(u * 8 + i, u * 5, 0); } });
  // ---- tenedor ----
  if (s < 19.75) { fork.position.copy(FORK0).add(V3(0, .03, 0)); fork.rotation.set(0, .4, -Math.PI / 2); }
  else if (s < 26.6) { const paw = pip.root.localToWorld(V3(.1, .42, .12)); fork.position.copy(paw).add(V3(0, -.25, 0)); fork.rotation.set(s > 20.3 ? 0 : -.6, 0, 0); if (s > POKE - .08 && s < POKE + .1) fork.position.y += .12 * Math.sin(seg(s, POKE - .08, POKE + .1) * Math.PI); }
  else { const u = seg(s, 26.6, 26.95); const p0 = pip.root.localToWorld(V3(.1, .2, .12)); fork.position.copy(arc(p0, V3(STOOL.x + .45, .03, STOOL.z + .2), u, .3)); fork.rotation.set(0, .4, -Math.PI / 2 * u); }
  // ---- goteo de chicle tras aterrizar ----
  drips.forEach((d, i) => { const ph = ((s - LAND_S) * .5 + i / 6) % 1; d.visible = s > LAND_S + .2; if (d.visible) { const base = mochi.root.localToWorld(V3((i - 2.5) * .25, .5 + rnd(i) * .6, .55)); d.position.copy(base).add(V3(0, -ph * .4, 0)); d.scale.set(.05, .06 + ph * .1, .05); } });

  // ---- efectos ----
  for (let i = 0; i < 18; i++) { const ph = (s * .05 + i / 18) % 1, sp = motes.next(); sp.position.set(-5 + rnd(i) * 9 + Math.sin(ph * TAU * 2 + i) * .3, .5 + ((rnd(i + 7) + ph * .4) % 1) * 6, -3 + rnd(i + 3) * 6); sp.scale.setScalar(.05 + rnd(i + 11) * .05); sp.material.opacity = Math.sin(ph * Math.PI) * .6; }
  // pops pequeños (Pip, intento 1, Pip final)
  for (const [t0, c, rr] of [[2.64, () => pipMouth.clone().addScaledVector(pdir, .14), .16], [T1 + .32, () => mouthW.clone().addScaledVector(dir, .1), .12], [PB1 + .02, () => pipMouth.clone().addScaledVector(pdir, .15), .17]]) if (s > t0 && s < t0 + .35) { const k = seg(s, t0, t0 + .35), C = c(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, d = dropP.next(); d.material = GUM; d.position.set(C.x + Math.cos(a) * (rr + k * .3), C.y + Math.sin(a) * (rr + k * .25) - k * k * .2, C.z + .05); d.scale.setScalar(.025 * (1 - k)); } }
  // explosión en la cara (intento 2)
  if (s > SPL && s < SPL + .4) { const k = seg(s, SPL, SPL + .4), C = mouthW.clone().addScaledVector(dir, .3); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, d = dropP.next(); d.material = GUM; d.position.set(C.x + Math.cos(a) * (.4 + k * .7), C.y + Math.sin(a) * (.35 + k * .55) - k * k * .4, C.z + .1); d.scale.setScalar(.04 * (1 - k)); } }
  // ojos codiciosos
  if (msd.sp > .02) for (const e of mochi.eyes) { const p = e.es.localToWorld(V3(-.25, .3, 1.05)); const sp = sparkP.next(); sp.position.copy(p); sp.scale.setScalar(msd.sp * .3 * (.8 + .3 * Math.sin(s * 14 + e.s))); sp.material.opacity = 1; sp.material.rotation = s * 3 * e.s; }
  // POP: anillo de aire + destellos
  if (s > POKE && pp < P0 + .5) { const k = clamp((pp - P0) / .5); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU, sp = puffP.next(); sp.position.set(POP_CENTER.x + Math.cos(a) * (1.2 + k * 1.6), POP_CENTER.y + Math.sin(a) * (1.2 + k * 1.6), POP_CENTER.z + .3); sp.scale.setScalar(.35 + k * .7); sp.material.opacity = (1 - k) * .55; sp.material.color.set('#ffd6ec'); } }
  if (s > POKE && pp < P0 + .9) for (let i = 0; i < 8; i++) { const k = clamp((pp - P0) / .9), sp = sparkP.next(), a = i / 8 * TAU; sp.position.set(POP_CENTER.x + Math.cos(a) * (1.4 + k * 2), POP_CENTER.y + Math.sin(a) * (1.3 + k * 2), POP_CENTER.z + .5); sp.scale.setScalar((1 - k) * .45); sp.material.opacity = 1; }
  // aterrizaje
  if (s > LAND_S && s < LAND_S + .6) { const k = seg(s, LAND_S, LAND_S + .6); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, sp = puffP.next(); sp.position.set(MH.x + Math.cos(a) * (.6 + k * 1.1), .12 + k * .2, MH.z + Math.sin(a) * (.5 + k * .9)); sp.scale.setScalar(.3 + k * .5); sp.material.opacity = (1 - k) * .7; sp.material.color.set('#ffe6f2'); } }
  // risitas de Pip
  for (const t0 of [SPL + .35, SNAP + .2, PB1 + .35]) if (s > t0 && s < t0 + .9) { const pipHead = pip.head.localToWorld(V3(0, .2, 0)); for (let i = 0; i < 3; i++) { const ph = ((s - t0) * 1.4 + i / 3) % 1, h = heartsPink.next(); h.position.set(pipHead.x + .1 + ph * .2, pipHead.y + .1 + ph * .5, pipHead.z); h.scale.setScalar(Math.sin(ph * Math.PI) * .22); } }
  beams.forEach((b, i) => b.material.opacity = .16 + .05 * Math.sin(s * TAU / 10 + i * 1.7));

  // ---- cámara ----
  let c;
  if (hook) c = HOOK_CAM(s);
  else { const C = CAMS[shot]; c = {}; for (const k in C.d) c[k] = C.val(k, s); if (c.sh > 0) { c.tx += Math.sin(s * 83) * .05 * c.sh * c.d / 6; c.ty += Math.cos(s * 71) * .05 * c.sh * c.d / 6; } }
  if (hook && s > POKE && s < POKE + .5) { const k = 1 - seg(s, POKE, POKE + .5); c.tx += Math.sin(s * 83) * .1 * k; c.ty += Math.cos(s * 71) * .1 * k; }
  composite(c, shot === 4 || hook ? .8 : 1);

  // ---- acabado ----
  ctx.clearRect(0, 0, W, H);
  const slowA = s > SLOW[0][0] && s < SLOW[1][1] && !rew ? Math.min(seg(s, SLOW[0][0], SLOW[0][1]), 1 - seg(s, SLOW[1][0], SLOW[1][1])) : 0;
  if (slowA > 0) { const g = ctx.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .75); g.addColorStop(0, 'rgba(60,20,40,0)'); g.addColorStop(1, `rgba(60,20,40,${.36 * slowA})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  if ((s > POKE && s < POKE + .06) || (s > SPL && s < SPL + .05) || (s > LAND_S && s < LAND_S + .05)) { ctx.fillStyle = 'rgba(255,240,248,.55)'; ctx.fillRect(0, 0, W, H); }
  if (s > POKE && s < POKE + .5) focusLines(s, (1 - seg(s, POKE + .15, POKE + .5)) * (hook ? .6 : 1));
  warmGrade();
  if (v > SIGN_V) {
    const p = easeOutBack(seg(v, SIGN_V, SIGN_V + .35)), bob = Math.sin((v - SIGN_V) * 3) * 6;
    ctx.save(); ctx.translate(W / 2, 260 + bob); ctx.scale(p, p); brandTitle(ctx, 0, 0, 150, -.03); ctx.restore();
    const sh = seg(v, SIGN_V + .5, SIGN_V + 1.1);
    if (sh > 0 && sh < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const x = lerp(-300, W + 300, sh); const g = ctx.createLinearGradient(x - 120, 0, x + 120, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 160, W, 200); ctx.restore(); }
  }
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
// centro de la burbuja gigante en el momento del POP (se calcula una vez)
const POP_CENTER = (() => { const st = mochiState(POKE - .01); setMochi(mochi, st, POKE - .01); scene.updateMatrixWorld(true); const m = mochi.hT.localToWorld(V3(0, -.36, .8)), f = mochi.hT.localToWorld(V3(0, -.36, 1.8)); return m.clone().addScaledVector(f.sub(m).normalize(), 1.25 * .92); })();
startEpisode(render);
