// =====================================================================
//  EPISODIO 14 (3D) — "Christmas tree 🎄"   35 s · 9:16 · salón de Navidad · diseño v2
//  Música: "Jingle Bells" (Kevin MacLeod, CC BY 4.0)
//  MAQUETACIÓN (planta, cámara mirando a −z):
//    árbol en el centro-fondo (0.3, −2.0) · regalos bajo la ventana a la izquierda-fondo
//    caja gigante delante a la izquierda (−2.6, 0.3) · regleta en el suelo delante (−0.25, 1.75)
//    chimenea a la derecha-fondo · el árbol cae hacia la izquierda (−x).
//  GANCHO (0–2.4 s): el árbol cae a cámara lenta con Mochi abrazado a la estrella. REBOBINADO (2.4–2.9).
//  1 (0–4.5)     Pip cuelga una bolita roja.
//  2 (4.5–10)    Mochi, hipnotizado por la bola, le da un zarpazo… ¡a la cabeza de Pip!
//  3 (10–15)     Mochi trepa POR DENTRO del árbol para poner la estrella… y se la pone él.
//  4 (15–20.5)   El árbol se inclina. Silencio.
//  5 (20.5–26.5) ¡TIMBER! a cámara lenta; Mochi acaba dentro del regalo gigante.
//  6 (26.5–32.1) Sale enredado en las luces; Pip las enchufa: Mochi es el árbol. Letrero.
// =====================================================================
const DURATION = 35;
const HOOK = 2.4, REW = .5, OFF = HOOK + REW;
const HOOK_S0 = 21.25, HOOK_K = (23.65 - HOOK_S0) / HOOK;
const SIGN_V = 32.3, MS = .72;
const SHOTS = [0, 4.5, 10, 15, 20.5, 26.5, 99];
const shotOf = s => { let i = 0; while (i < 5 && s >= SHOTS[i + 1]) i++; return i; };
mochi.root.scale.setScalar(MS); mochi.hemTail.visible = mochi.hemTip.visible = false;

// ---------- sitios (todo separado: ningún personaje atraviesa nada) ----------
const ORN_HOOK = V3(TREE.x + .35, 1.0, TREE.z + 1.5);        // rama baja delantera
const PIP_HANG = V3(TREE.x + .45, 0, -.2);                   // Pip delante de la rama (fuera de las ramas)
const PIP2 = V3(-.45, 0, .45);                               // Pip se aparta a la izquierda
const MS1 = V3(2.25, 0, -.35), MPOUNCE = V3(1.75, 0, -.2);   // Mochi a la derecha del árbol (de perfil hacia la bola)
const MSTAR = V3(.55, 0, .6), MCLIMB = V3(TREE.x, 0, -.05);
const MOUT = V3(-1.2, 0, 1.0), PIP_END = V3(.2, 0, 1.35);

// ---------- extras ----------
const hat = new THREE.Group(); hat.position.set(0, .14, -.02); hat.rotation.set(-.2, 0, .25); pip.head.add(hat);
hat.add(mesh(new THREE.ConeGeometry(.15, .3, 20), mat('#d42a3a', .75), { y: .16, rz: -.15 }));
hat.add(mesh(new THREE.TorusGeometry(.15, .04, 10, 24), mat('#ffffff', .95), { y: .02, rx: Math.PI / 2 }));
hat.add(mesh(SPH, mat('#ffffff', .95), { x: .05, y: .32, sx: .05, sy: .05, sz: .05 }));
const pOrn = new THREE.Group(); scene.add(pOrn);
pOrn.add(mesh(SPH, new THREE.MeshPhysicalMaterial({ color: '#e8283c', metalness: .75, roughness: .1, clearcoat: 1, emissive: '#e8283c', emissiveIntensity: .15 }), { sx: .13, sy: .13, sz: .13 }));
pOrn.add(mesh(new THREE.CylinderGeometry(.04, .04, .04, 10), mat('#ffd23f', .3, { metalness: .8 }), { y: .13 }));
pOrn.add(mesh(SPH, MC.hl, { x: -.05, y: .06, z: .1, sx: .03, sy: .03, sz: .015, shadow: false }));
const wrap = new THREE.Group(); mochi.sq.add(wrap);
const WRAP_B = [];
{ const pts = []; for (let i = 0; i <= 160; i++) { const u = i / 160, y = .25 + u * 2.25, a = u * TAU * 3.6, rx = (y < 1.9 ? .86 : .9) * (1 - Math.max(0, y - 1.75) * .1), rz = y < 1.9 ? .8 : .85; pts.push(V3(Math.cos(a) * rx, y, Math.sin(a) * rz + (y > 1.6 ? .07 : 0))); }
  const curve = new THREE.CatmullRomCurve3(pts); wrap.add(mesh(new THREE.TubeGeometry(curve, 300, .025, 6), mat('#1e5a2e', .5), { shadow: false }));
  const LC = ['#ff3b4f', '#ffd23f', '#3bff8f', '#3bb8ff', '#ff6fe0'];
  for (let i = 0; i < 34; i++) { const p = curve.getPoint(i / 34 + .01); const b = mesh(new THREE.CapsuleGeometry(.05, .07, 4, 8), new THREE.MeshStandardMaterial({ color: LC[i % 5], emissive: LC[i % 5], emissiveIntensity: .2 }), { x: p.x, y: p.y, z: p.z, shadow: false });
    const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: LC[i % 5], transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); gl.scale.setScalar(.5); b.add(gl); b.userData = { gl, i }; wrap.add(b); WRAP_B.push(b); } }
const cord = new THREE.Mesh(new THREE.BufferGeometry(), mat('#1e5a2e', .5)); scene.add(cord);
const plug = new THREE.Group(); scene.add(plug); plug.add(mesh(new THREE.BoxGeometry(.1, .14, .08), mat('#f4f0ea', .4))); for (const s of [-1, 1]) plug.add(mesh(new THREE.BoxGeometry(.015, .07, .015), mat('#d8c07a', .3, { metalness: .8 }), { x: s * .03, y: .09, shadow: false }));
const earOrn = new THREE.Group(); scene.add(earOrn); earOrn.add(mesh(SPH, new THREE.MeshPhysicalMaterial({ color: '#2f8cff', metalness: .75, roughness: .1, clearcoat: 1, emissive: '#2f8cff', emissiveIntensity: .2 }), { sx: .1, sy: .1, sz: .1 }));
const trailP = pool(40, () => new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: '#ffffff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

// =====================================================================
//  GUION
// =====================================================================
const MO = new Rig({ x: 4.8, y: 0, z: MS1.z, yaw: -1.4, lean: 0, roll: 0, sx: 1, sy: 1, sz: 1, wr: 0, wamt: 0,
  aLf: .15, aLo: .22, aRf: .15, aRo: .22, hp: 0, hy: 0, hr: 0, hs: 1, eb: 1, pd: 1, lid: 0, lx: 0, ly: 0, sp: 0,
  mo: 0, tg: 0, tu: 0, lk: 0, br: 0, brA: 1, tw: 1, wg: 0, sn: 0, pk: 0, ed: 0, sit: 0, cross: 0, ck: 0 });
const MMODE = new Steps('hidden');
const PI_ = new Rig({ x: 1.1, y: 0, z: .55, yaw: -.9, lean: 0, roll: 0, sx: 1, sy: 1, wr: 0, wamt: 0,
  aLf: .1, aLo: .25, aRf: .1, aRo: .25, hp: 0, hy: 0, hr: 0, lid: 0, lx: 0, ly: 0, sm: 1, mo: 0, ed: 0, must: 0, rub: 0, kick: 0, fid: 0, tailUp: 0 });
const TRL = new Rig({ lean: 0, shake: 0 });
const KM = (t, v, e) => MO.key(t, v, e), P = (t, v, e) => PI_.key(t, v, e), TK = (t, v, e) => TRL.key(t, v, e);

// ---------------- 1 (0–4.5): la bolita de Pip ----------------
const HANG = 1.55;
P(0, { x: 1.1, z: .55, yaw: -.9, wr: 0, wamt: 0 }); P(.1, { wr: 5, wamt: 1 }); P(.85, { x: PIP_HANG.x, z: PIP_HANG.z, wr: 5, wamt: 1 }, 'io'); P(.9, { wr: 0, wamt: 0, yaw: -2.9 });
P(.95, { aRf: .1, aRo: .25, lean: 0, y: 0, sy: 1 }); P(1.2, { aRf: 2.5, aRo: -.2, lean: -.1, sy: 1.12, y: .14 }, 'o'); P(HANG, { aRf: 2.5, y: .14 }); P(HANG + .2, { aRf: .1, aRo: .25, y: 0, sy: 1, lean: 0 }, 'io');
P(HANG + .3, { x: PIP_HANG.x, z: PIP_HANG.z, yaw: -2.9, wr: 0, wamt: 0 }); P(HANG + .35, { wr: 5, wamt: 1, yaw: -.8 }); P(2.35, { x: PIP2.x, z: PIP2.z, wr: 5, wamt: 1 }, 'io'); P(2.4, { wr: 0, wamt: 0, yaw: .1 });
P(2.45, { aLf: .1, aLo: .25, aRf: .1, aRo: .25, lid: 0 }); P(2.75, { aLf: -.35, aLo: .75, aRf: -.35, aRo: .75, lid: .9, hp: -.25, sy: 1.06 }, 'back'); P(3.8, { lid: .9 }); P(4.0, { lid: 0, hp: 0, sy: 1, aLf: .1, aRf: .1, aLo: .25, aRo: .25 });
// ---------------- 2 (4.5–10): hipnotizado ----------------
const POUNCE = 7.45, BONKP = 7.95;
MMODE.at(4.5, 'full');
KM(4.5, { x: 4.8, z: MS1.z, yaw: -1.4, wr: 2.3, wamt: 1, lid: .3 }); KM(5.4, { wr: 2.3, wamt: 1 }); KM(5.55, { x: MS1.x, wr: 0, wamt: 0 }, 'o');
KM(5.55, { lid: .3, eb: 1, pd: 1, sp: 0, hy: 0 }); KM(5.85, { lid: 0, eb: 1.35, pd: 1.9, sp: .8, hy: .35 }, 'back');    // gira un poco la cabeza hacia la bola (y hacia cámara)
KM(6.85, { lean: 0, sy: 1, sx: 1, aLf: .15, aRf: .15, wg: 0 }); KM(7.2, { lean: .4, sy: .78, sx: 1.12, aLf: .9, aRf: .9, wg: 1, br: 1, brA: 1.2 }, 'io');
KM(POUNCE - .02, { x: MS1.x, z: MS1.z, y: 0, wg: 1 }); KM(POUNCE + .12, { x: (MS1.x + MPOUNCE.x) / 2, z: (MS1.z + MPOUNCE.z) / 2, y: .45, sy: 1.2, sx: .9, aRf: 2.0, aRo: -.2, wg: 0, lean: .2 }, 'o'); KM(POUNCE + .35, { x: MPOUNCE.x, z: MPOUNCE.z, y: 0, sy: .85, sx: 1.1 }, 'iq'); KM(POUNCE + .55, { sy: 1, sx: 1, lean: 0, aRf: .15, aRo: .22, aLf: .15 }, 'back');
KM(BONKP + .05, { eb: 1.35, sp: 0, pd: 1, br: 0, mo: 0, hy: .35 }); KM(BONKP + .3, { eb: 1.2, mo: .3, ly: 0, lx: -.4, hy: .6 });
KM(8.6, { yaw: -1.4, hy: .6, ly: 0, lid: 0 }); KM(8.9, { yaw: -.4, hy: .35, ly: .6, lx: .3, lid: .45, mo: 0, aLf: -.2, aLo: .3, aRf: -.2, aRo: .3 }, 'io'); KM(9.8, { hy: .35, ly: .6 });
P(5.4, { yaw: .1, lx: 0, hy: 0 }); P(5.7, { hy: .5, lx: .5 });
P(BONKP, { sy: 1, lid: 0, ed: 0 }); P(BONKP + .05, { sy: .82, lid: .9, ed: .8 }, 'o'); P(BONKP + .3, { sy: 1, lid: .5, ed: .4, aLf: 1.4, aRf: 1.4, aLo: -.9, aRo: -.9, hp: .1, sm: 0, yaw: .6 }, 'back');
P(9.7, { lid: .5, aLf: 1.4, aRf: 1.4 }); P(10.0, { lid: 0, aLf: .1, aRf: .1, aLo: .25, aRo: .25, sm: 1, hp: 0, ed: 0, hy: 0, lx: 0 });
// ---------------- 3 (10–15): la estrella ----------------
const GIVE = 11.25, CLIMB0 = 11.75, CLIMB1 = 13.6, POP = 13.75, PLACE = 14.35;
P(10.0, { x: PIP2.x, z: PIP2.z, yaw: .6 }); P(10.3, { aLf: 2.6, aRf: 2.6, aLo: -.2, aRo: -.2, hp: -.5, ly: .9, yaw: .2, mo: 0 }, 'io');
P(10.5, { y: 0, sy: 1 }); P(10.62, { y: .2, sy: 1.15 }, 'oq'); P(10.75, { y: 0, sy: .9 }, 'iq'); P(10.85, { y: .25, sy: 1.15 }, 'oq'); P(11.0, { y: 0, sy: 1 }, 'iq');
KM(10.05, { x: MPOUNCE.x, z: MPOUNCE.z, yaw: -.4, wr: 0, wamt: 0, hy: .35, lid: .45 }); KM(10.1, { wr: 3, wamt: 1, yaw: -1.9, hy: 0, lid: 0, ly: 0 }); KM(10.75, { x: MSTAR.x, z: MSTAR.z, wr: 3, wamt: 1 }, 'io'); KM(10.8, { wr: 0, wamt: 0, yaw: -1.3, mo: .4 });
KM(10.9, { aRf: .15, aRo: .22 }); KM(11.05, { aRf: 1.3, aRo: -.6 }); KM(11.15, { aRf: .15, aRo: .22 }); KM(GIVE, { aRf: 1.3, aRo: -.2, lean: .25 }, 'io');
P(GIVE + .1, { aLf: 2.6, aRf: 2.6 }); P(GIVE + .3, { aLf: .1, aRf: .1, aLo: .25, aRo: .25, hp: 0, ly: 0, yaw: .3 });
KM(GIVE + .3, { lean: 0, aRf: 2.8, aRo: .2, yaw: -1.3 }); KM(GIVE + .35, { x: MSTAR.x, z: MSTAR.z, wr: 0, wamt: 0 }); KM(GIVE + .4, { wr: 3, wamt: 1, yaw: -2.9 }); KM(CLIMB0, { x: MCLIMB.x, z: MCLIMB.z, wr: 3, wamt: 1 }, 'io'); KM(CLIMB0 + .05, { wr: 0, wamt: 0, y: 0 });
KM(CLIMB0 + .1, { y: .3 }); KM(CLIMB1, { y: 2.7 }, 'io'); MMODE.at(CLIMB0 + .12, 'tree').at(POP - .05, 'full');
TK(CLIMB0 + .1, { shake: 0 }); TK(CLIMB0 + .3, { shake: 1 }); TK(CLIMB1, { shake: 1 }); TK(POP + .2, { shake: 0 });
KM(POP - .05, { yaw: -.15, aLf: .15, aRf: 2.8, aLo: .22, aRo: .2, eb: 1.1, mo: .4, lid: 0, y: 2.85 }); KM(POP + .2, { y: 3.2, sy: 1.12 }, 'back');
KM(PLACE - .2, { aRf: 2.8, aRo: .2 }); KM(PLACE, { aRf: 2.95, aLf: 2.95, aRo: .3, aLo: .3 }); KM(PLACE + .3, { aLf: 2.6, aRf: 2.6, aLo: .9, aRo: .9, lid: .85, mo: .55, sy: 1 }, 'back');
P(PLACE + .2, { lid: 0, aLf: .1, aRf: .1 }); for (let k = 0; k < 4; k++) { P(PLACE + .3 + k * .18, { aLf: 1.6, aRf: 1.6, aLo: -.8, aRo: -.8 }); P(PLACE + .39 + k * .18, { aLf: 1.6, aRf: 1.6, aLo: -.4, aRo: -.4 }); }
// ---------------- 4 (15–20.5): se inclina… ----------------
const FREEZE = 19.9, FALL = 20.5;
TK(15.3, { lean: 0 }); TK(16.6, { lean: .06 }, 'io'); TK(17.3, { lean: .02 }, 'io'); TK(18.2, { lean: .12 }, 'io'); TK(18.8, { lean: .08 }, 'io'); TK(19.6, { lean: .2 }, 'io'); TK(FALL, { lean: .24 });
KM(15.3, { lid: .85, mo: .55, aLf: 2.6, aRf: 2.6 }); KM(16.0, { lid: 0, eb: 1.3, mo: .2, ly: -.6, lx: -.3, aLf: 1.6, aRf: 1.6, aLo: 1.3, aRo: 1.3 }, 'o');
KM(16.6, { roll: 0 }); KM(17.0, { roll: -.35 }, 'io'); KM(17.6, { roll: .1 }, 'io'); KM(18.3, { roll: -.45 }, 'io'); KM(18.9, { roll: -.2 }); KM(19.6, { roll: -.5, eb: 1.45 }, 'io');
P(16.2, { yaw: .3, hp: 0, ly: 0 }); P(16.5, { hp: -.5, ly: .9, mo: .6 });
P(18.4, { aLf: .1, aRf: .1, aLo: .25, aRo: .25 }); for (let k = 0; k < 6; k++) { P(18.5 + k * .2, { aLf: 2.7, aRf: 2.7, aLo: .6, aRo: .6, y: .08 }); P(18.6 + k * .2, { aLf: 2.2, aRf: 2.2, aLo: .2, aRo: .2, y: 0 }); }    // "¡cuidado!" saltando
KM(FREEZE, { hy: 0, lx: -.3, ly: -.6, eb: 1.45, mo: .2 }); KM(FREEZE + .2, { hy: .5, lx: .45, ly: 0, eb: 1.6, pd: .7, mo: .3 }, 'o');
P(FREEZE, { hp: -.5, ly: .9, mo: .6, yaw: .3 }); P(FREEZE + .3, { yaw: .1, hp: 0, ly: 0, aLf: 2.6, aRf: 2.6, aLo: -.85, aRo: -.85, lean: 0, lid: .2, y: 0 }, 'o');   // se tapa los ojos
// ---------------- 5 (20.5–26.5): ¡TIMBER! ----------------
MMODE.at(FALL, 'fall');
P(FALL + .1, { aLf: 2.6, aRf: 2.6, aLo: -.85, aRo: -.85 }); P(21.0, { aLf: 2.0, aRf: 2.0, aLo: .3, aRo: .3, mo: 1, hp: -.2 });
// ---------------- 6 (26.5–32.1): el árbol humano ----------------
const OUTB = 26.6, PLUG = 28.6, EARO = 29.9;
P(26.4, { x: PIP2.x, z: PIP2.z, wr: 0, wamt: 0, mo: 0, aLf: .1, aRf: .1, aLo: .25, aRo: .25, hp: 0, yaw: .1, lid: 0 }); P(26.9, { yaw: -1.0, hy: -.4 });
P(27.4, { hy: 0, yaw: -1.0 }); P(27.45, { wr: 5, wamt: 1, yaw: -2.2 }); P(27.75, { x: MOUT.x + .85, z: MOUT.z + .15, wr: 5, wamt: 1 }, 'io'); P(27.8, { wr: 0, wamt: 0 });
P(27.85, { lean: .5, aRf: 1.2 }); P(28.0, { lean: 0, aRf: 1.0 }); P(28.05, { wr: 5, wamt: 1, yaw: 1.4 }); P(28.45, { x: SOCKET.x - .1, z: SOCKET.z - .52, wr: 5, wamt: 1 }, 'io'); P(28.5, { wr: 0, wamt: 0, yaw: 1.9 });
P(28.5, { aRf: 1.0, lean: 0 }); P(PLUG, { aRf: .8, lean: .45 }, 'o'); P(PLUG + .2, { aRf: .1, lean: 0 });
P(PLUG + .4, { yaw: 1.9 }); P(PLUG + .55, { yaw: -.3 }); P(PLUG + .6, { wr: 0, wamt: 0, x: SOCKET.x - .1, z: SOCKET.z - .52 }); P(PLUG + .65, { wr: 5, wamt: 1, yaw: -1.4 }); P(29.65, { x: PIP_END.x, z: PIP_END.z, wr: 5, wamt: 1 }, 'io'); P(29.7, { wr: 0, wamt: 0, yaw: -.9 });
P(29.72, { y: 0, sy: 1, x: PIP_END.x }); P(29.84, { y: 1.05, x: PIP_END.x - .55, aRf: 2.6 }, 'oq'); P(EARO, { y: 1.1, aRf: 2.2 }); P(30.18, { y: 0, x: PIP_END.x, aRf: .1, aRo: .25 }, 'iq');
P(30.4, { yaw: -.2, lid: 0 }); P(30.6, { lid: .85, aLf: 2.5, aRf: 2.5, aLo: .5, aRo: .5, mo: .5 });
for (const r of [MO, PI_, TRL]) r.done();

// ---------- tiempo físico ----------
const SL0 = FALL + .3, SL1 = 23.6;
const rateAt = s => { if (s < SL0) return 1; if (s < SL0 + .15) return lerp(1, .2, seg(s, SL0, SL0 + .15)); if (s < SL1) return .2; if (s < SL1 + .15) return lerp(.2, 1, seg(s, SL1, SL1 + .15)); return 1; };
const TAUT = (() => { const dt = 1 / 600, n = Math.ceil(40 / dt), a = new Float32Array(n + 1); for (let i = 1; i <= n; i++) a[i] = a[i - 1] + rateAt((i - .5) * dt) * dt; return { a, dt }; })();
const phys = s => { const f = clamp(s, 0, 39.9) / TAUT.dt, i = Math.floor(f); return TAUT.a[i] + (TAUT.a[i + 1] - TAUT.a[i]) * (f - i); };
const PF = phys(FALL), FALL_T = 1.05;
const fallAng = s => { const u = clamp((phys(s) - PF) / FALL_T); return .24 + (Math.PI / 2 - .2) * u * u; };     // cae hacia −x
const findS = f => { for (let s = FALL; s < 30; s += .002) if (f(s)) return s; return 99; };
const TREE_LAND = findS(s => phys(s) - PF >= FALL_T);
const LAUNCH = findS(s => phys(s) - PF >= .9), BOXLAND = LAUNCH + .55;

// ---------- estados ----------
const treeTop = ang => V3(0, TREE_H - .35, 0).applyMatrix4(new THREE.Matrix4().makeRotationZ(ang)).add(TREE);
function mochiState(s) {
  const st = {}; for (const k in MO.d) st[k] = MO.val(k, s);
  st.walk = MO.integ('wr', s); st.mode = MMODE.get(s);
  st.roll += Math.sin(s * 14) * .07 * st.wg;
  if (st.mode === 'tree') st.mode = 'hidden';
  if (s > POP - .05 && s < FALL) { const ang = TRL.val('lean', s), top = treeTop(ang); st.x = top.x; st.y = top.y - 1.45 + (st.y - 2.85) * .5; st.z = top.z + .15; st.roll += ang; }
  if (st.mode === 'fall') {
    st.mode = 'full';
    if (s < LAUNCH) { const ang = fallAng(s), top = treeTop(ang); st.x = top.x; st.y = top.y - 1.3; st.z = top.z + .2; st.roll = ang * .7; st.yaw = .1; st.aLf = 2.9; st.aRf = 2.9; st.aLo = .7; st.aRo = .7; st.eb = 1.7; st.mo = 1.3; st.pd = .7; st.ed = .8; st.lid = 0; st.hy = -.1; st.lx = 0; st.ly = .2; st.tw = 5; st.walk = s * 2; st.wamt = .6; st.sp = 0;
      if (s > 22.4 && s < 23.3) { st.hy = -.45; st.lx = -.5; st.mo = .3; st.eb = 1.5; } }
    else if (s < BOXLAND) { const u = seg(s, LAUNCH, BOXLAND), top = treeTop(fallAng(LAUNCH)), p0 = V3(top.x, top.y - 1.3, top.z + .2), p1 = V3(BIGBOX.x, -.3, BIGBOX.z); st.x = lerp(p0.x, p1.x, u); st.y = lerp(p0.y, p1.y, u) + 4 * 1.4 * u * (1 - u); st.z = lerp(p0.z, p1.z, u); st.roll = u * TAU; st.yaw = 0; st.eb = 1.7; st.mo = 1.2; st.aLf = 2.9; st.aRf = 2.9; st.aLo = 1; st.aRo = 1; st.walk = s * 3; st.wamt = .8; }
    else { st.x = BIGBOX.x; st.z = BIGBOX.z; st.y = -.3 + Math.max(0, Math.sin(seg(s, BOXLAND, BOXLAND + .3) * Math.PI)) * .15; st.roll = 0; st.yaw = .3; st.walk = 0; st.wamt = 0; st.eb = 1.1; st.mo = 0; st.lid = .5; st.cross = s < 26.0 ? 1 : 0; st.aLf = .15; st.aRf = .15; st.aLo = .22; st.aRo = .22; st.sy = s < BOXLAND + .25 ? .85 : 1; st.hy = 0; st.lx = 0; st.ly = 0; st.ed = .3; }
  }
  if (s >= OUTB) {
    const k = seg(s, OUTB, OUTB + .45); st.mode = 'full'; st.x = lerp(BIGBOX.x, MOUT.x, k); st.z = lerp(BIGBOX.z, MOUT.z, k); st.y = lerp(-.3, 0, k) + Math.sin(k * Math.PI) * 1.0; st.roll = 0; st.yaw = .35; st.walk = 0; st.wamt = 0; st.cross = 0;
    st.eb = 1.05; st.mo = .1; st.lid = .3; st.ed = .3; st.aLf = .8; st.aRf = .8; st.aLo = .9; st.aRo = .9; st.hy = 0; st.lx = .3; st.ly = 0; st.tw = 1;
    if (s > PLUG) { const u = seg(s, PLUG, PLUG + .25); st.eb = s < PLUG + .9 ? 1.6 : 1.05; st.sy = 1 + .2 * Math.sin(u * Math.PI); st.lid = s > PLUG + 1.0 ? .85 : 0; st.mo = s > PLUG + 1.0 ? .55 : .7; st.ed = 0; st.aLf = 2.0; st.aRf = 2.0; st.aLo = 1.3; st.aRo = 1.3; st.tw = 3; }
    if (s > EARO + .1) { st.lid = .85; st.hy = .3; st.lx = .4; }
  }
  if (st.mode === 'full') st.sy *= 1 + Math.sin(s * 3.2) * .012;
  return st;
}
function pipState(s) { const st = {}; for (const k in PI_.d) st[k] = PI_.val(k, s); st.walk = PI_.integ('wr', s); st.sy *= 1 + Math.sin(s * 4.1) * .015; st.dripT = 99; return st; }

// ---------- cámaras ----------
const CAMS = SHOTS.slice(0, 6).map(() => new Rig({ tx: 0, ty: 1, tz: 0, d: 8, yw: 0, pt: .1, fov: 30, sh: 0, fw: 0 }));
CAMS[0].key(0, { tx: PIP_HANG.x, ty: .7, tz: PIP_HANG.z, d: 4.6, yw: .7, pt: .06 }).key(1.9, { tx: PIP_HANG.x - .1, ty: .75, tz: PIP_HANG.z + .05, d: 4.6, yw: .6, pt: .06 }, 'io').key(2.6, { tx: .1, ty: .75, tz: .1, d: 6.0, yw: .2, pt: .06 }, 'io').key(4.5, { tx: .1, ty: 1.1, tz: -.1, d: 6.8, yw: .12, pt: .06 }, 'io');
CAMS[1].key(4.5, { tx: 1.3, ty: 1.25, tz: -.3, d: 11, yw: .05, pt: .07 }).key(5.6, { tx: 1.4, ty: 1.2, tz: -.3, d: 10.5, yw: .05, pt: .07 }, 'io')
  .key(5.61, { tx: 1.5, ty: 1.3, tz: -.4, d: 7.0, yw: -.55, pt: .03 }).key(6.85, { tx: 1.5, ty: 1.3, tz: -.4, d: 6.6, yw: -.55, pt: .03 }, 'io')
  .key(6.86, { tx: 1.0, ty: 1.15, tz: -.1, d: 12, yw: -.1, pt: .07 }).key(8.6, { tx: 1.0, ty: 1.15, tz: -.1, d: 11.5, yw: -.1, pt: .07 }, 'io').key(10, { tx: 1.2, ty: 1.3, tz: -.1, d: 9.5, yw: .0, pt: .06 }, 'io');
CAMS[1].key(BONKP, { sh: 0 }).key(BONKP + .02, { sh: .4 }).key(BONKP + .25, { sh: 0 });
CAMS[2].key(10, { tx: .15, ty: 1.0, tz: .35, d: 9.2, yw: .05, pt: -.06 }).key(11.2, { tx: .1, ty: 1.2, tz: .3, d: 9.4, yw: .05, pt: -.04 }, 'io')
  .key(11.21, { tx: TREE.x + .3, ty: 2.4, tz: TREE.z + .5, d: 13, yw: .05, pt: .05 }).key(CLIMB1, { tx: TREE.x + .2, ty: 2.6, tz: TREE.z + .4, d: 12.5, yw: .05, pt: .05 }, 'io')
  .key(POP, { tx: TREE.x, ty: 3.9, tz: TREE.z + .3, d: 9.2, yw: .1, pt: .02 }, 'io').key(15, { tx: TREE.x, ty: 3.9, tz: TREE.z + .3, d: 8.8, yw: .1, pt: .02 }, 'io');
CAMS[3].key(15, { tx: TREE.x - .3, ty: 2.5, tz: TREE.z + .6, d: 13, yw: .05, pt: .05 }).key(19.6, { tx: TREE.x - .5, ty: 2.4, tz: TREE.z + .6, d: 12, yw: .02, pt: .05 }, 'io')
  .key(FREEZE, { tx: TREE.x - .1, ty: 4.0, tz: TREE.z + .4, d: 5.6, yw: -.1, pt: .02 }).key(FALL, { tx: TREE.x - .1, ty: 4.0, tz: TREE.z + .4, d: 5.4, yw: -.1, pt: .02 });
CAMS[4].key(FALL, { fw: .6, tx: -.5, ty: 2.6, tz: -1.4, d: 12, yw: -.15, pt: .03 }).key(SL0 + .2, { fw: 1, d: 8.4, yw: -.35, pt: -.04 }, 'o').key(SL1, { fw: 1, d: 7.4, yw: -.15, pt: -.02 }, 'io')
  .key(LAUNCH, { fw: .8, d: 8.8, yw: -.1, pt: .02 }, 'io').key(BOXLAND, { fw: 0, tx: -2.3, ty: 1.1, tz: .2, d: 8.6, yw: .05, pt: .07 }, 'io').key(26.5, { fw: 0, tx: -2.2, ty: 1.05, tz: .3, d: 7.4, yw: .05, pt: .07 }, 'io');
CAMS[4].key(TREE_LAND, { sh: 0 }).key(TREE_LAND + .02, { sh: .9 }).key(TREE_LAND + .45, { sh: 0 }).key(BOXLAND, { sh: 0 }).key(BOXLAND + .02, { sh: .6 }).key(BOXLAND + .3, { sh: 0 });
CAMS[5].key(26.5, { tx: -2.0, ty: 1.05, tz: .4, d: 7.6, yw: .05, pt: .07 }).key(27.3, { tx: -1.2, ty: 1.1, tz: .9, d: 9.0, yw: .05, pt: .07 }, 'io')
  .key(PLUG + .5, { tx: -.75, ty: 1.15, tz: 1.1, d: 9.0, yw: .05, pt: .07 }, 'io').key(32.5, { tx: -.65, ty: 1.3, tz: 1.1, d: 8.2, yw: .05, pt: .06 }, 'io');
CAMS.forEach(c => c.done());
const HOOK_CAM = (s, m) => { const k = E.io(seg(s, HOOK_S0, 23.6)); return { tx: m.x + .3, ty: m.y + 1.0, tz: m.z, d: lerp(7.6, 6.4, k), yw: lerp(-.45, -.15, k), pt: lerp(-.12, -.04, k), fov: 32 }; };
function storyTime(v) { if (v < HOOK) return HOOK_S0 + v * HOOK_K; if (v < OFF) return lerp(HOOK_S0 + HOOK * HOOK_K, 0, E.i(seg(v, HOOK, OFF))); return v - OFF; }
const arc = (p0, p1, u, h) => V3(lerp(p0.x, p1.x, u), lerp(p0.y, p1.y, u) + 4 * h * u * (1 - u), lerp(p0.z, p1.z, u));

// ---------- comprobación de maquetado: ¿algún personaje dentro de un objeto? ----------
window.layoutCheck = (s) => {
  const out = [], md = MMODE.get(s), msd = mochiState(s), psd = pipState(s), hidden = md === 'hidden' || md === 'tree' || (s > CLIMB0 - .1 && s < CLIMB0 + .15) || (s >= OUTB && s < OUTB + .45) || (md === 'fall' && s >= BOXLAND && s < OUTB) || (s > POP - .05 && s < FALL) || (md === 'fall' && s < BOXLAND);
  const chars = [];
  if (!hidden && msd.mode === 'full' && msd.y < .4) chars.push({ who: 'Mochi', x: msd.x, z: msd.z, r: .55 });
  if (psd.y < .3) chars.push({ who: 'Pip', x: psd.x, z: psd.z, r: .17 });
  const obs = OBSTACLES(); const tr = treeR(.6);
  if (s < FALL) obs.push({ name: 'ramas del árbol', x: TREE.x, z: TREE.z, r: tr - .25 });
  for (const c of chars) { for (const o of obs) { const d = Math.hypot(c.x - o.x, c.z - o.z); if (d < c.r + o.r - .02) out.push(`${s.toFixed(2)} ${c.who} dentro de ${o.name} (${(c.r + o.r - d).toFixed(2)})`); } }
  if (chars.length === 2) { const [a, b] = chars, d = Math.hypot(a.x - b.x, a.z - b.z); if (d < a.r + b.r) out.push(`${s.toFixed(2)} Mochi y Pip se atraviesan (${(a.r + b.r - d).toFixed(2)})`); }
  return out;
};

// =====================================================================
//  FOTOGRAMA
// =====================================================================
const vhs = document.createElement('canvas'); vhs.width = W; vhs.height = H; const vctx = vhs.getContext('2d');
const _m = new THREE.Matrix4();
function render(v) {
  const s = storyTime(v), hook = v < HOOK, rew = v >= HOOK && v < OFF;
  resetFx(); for (const p of [steamP, puffP, sparkP, dropP, motes, trailP]) p.reset();
  updateXmas(s);
  const shot = shotOf(s);
  const msd = mochiState(s), psd = pipState(s);
  const ang = s >= FALL ? fallAng(s) : TRL.val('lean', s) + (TRL.val('shake', s) > 0 ? Math.sin(s * 31) * .012 * TRL.val('shake', s) : 0);
  tree.rotation.set(0, 0, ang);
  tree.position.set(TREE.x, s > TREE_LAND ? Math.abs(Math.sin((s - TREE_LAND) * 12)) * .12 * Math.exp(-(s - TREE_LAND) * 6) : 0, TREE.z);
  BULBS.forEach(b => bulbOn(b, s * (s >= FALL && s < TREE_LAND ? 3 : 1)));
  treeLight.position.set(TREE.x - Math.sin(ang) * 2.2, 2.3 * Math.cos(ang) + .3, TREE.z + .9); treeLight.intensity = 4.5 + Math.sin(s * 3) * .8;
  treeLight2.position.set(TREE.x + .6, 1.6, TREE.z + 1.2);
  setMochi2(mochi, msd, s); setPip2(pip, psd, s); scene.updateMatrixWorld(true);
  const pawP = pip.arms[1].localToWorld(V3(0, -.14, 0)), pawM = mochi.arms[1].localToWorld(V3(0, -.62, 0));
  const headTop = mochi.hT.localToWorld(V3(0, 1.0, 0));
  // estrella
  star.visible = true;
  if (s < GIVE + .05) { const pl = pip.arms[0].localToWorld(V3(0, -.14, 0)); if (s < 10.2) { star.position.set(PIP2.x + .35, .12, PIP2.z + .25); star.rotation.set(-1.4, 0, .3); } else { star.position.copy(pl.clone().lerp(pawP, .5).add(V3(0, .25, 0))); star.rotation.set(0, .2, 0); } star.scale.setScalar(.7); }
  else if (s < PLACE) { star.position.copy(pawM).add(V3(0, .2, 0)); star.rotation.set(0, 0, 0); star.scale.setScalar(.7); star.visible = !(s > CLIMB0 + .12 && s < POP - .05); }
  else { star.position.copy(headTop).add(V3(0, .22, 0)); star.quaternion.setFromRotationMatrix(_m.extractRotation(mochi.hT.matrixWorld)); star.scale.setScalar(.75); }
  star.userData.glow.material.opacity = s > PLUG ? .9 + Math.sin(s * 6) * .1 : .55;
  // bolita de Pip
  if (s < HANG) pOrn.position.copy(pawP).add(V3(0, -.05, 0));
  else if (s < POUNCE + .12) { const sw = s > 5.6 ? Math.sin((s - 5.6) * 4.5) * .45 : Math.sin(s * 2) * .08; pOrn.position.set(ORN_HOOK.x + Math.sin(sw) * .2, ORN_HOOK.y - .18 * Math.cos(sw), ORN_HOOK.z); pOrn.rotation.z = sw; }
  else if (s < BONKP) { const u = seg(s, POUNCE + .12, BONKP), ph = pip.head.localToWorld(V3(0, .25, 0)); pOrn.position.copy(arc(V3(ORN_HOOK.x, ORN_HOOK.y - .18, ORN_HOOK.z), ph, u, .5)); pOrn.rotation.z = u * 9; }
  else { const u = seg(s, BONKP, BONKP + .6), ph = pip.head.localToWorld(V3(0, .25, 0)), g = V3(PIP2.x - .55, .13, PIP2.z + .45); pOrn.position.copy(u < 1 ? arc(ph, g, u, .4) : g); pOrn.rotation.z = u < 1 ? u * 6 : 0; }
  // bolas del árbol: se sueltan al caer
  ORN.forEach((o, i) => {
    const pd = .25 + rnd(i * 5) * .55, up = phys(s) - PF;
    if (s < FALL || up < pd) { if (o.parent !== tree) tree.add(o); o.position.copy(o.userData.home); o.rotation.set(0, 0, Math.sin(s * 3 + i) * .1 * (TRL.val('shake', s) ? 4 : 1)); return; }
    if (o.parent === tree) scene.attach(o);
    const angD = .24 + (Math.PI / 2 - .2) * (pd / FALL_T) ** 2, w = 2 * (Math.PI / 2 - .2) * pd / FALL_T ** 2;
    const rel = o.userData.home.clone().applyMatrix4(new THREE.Matrix4().makeRotationZ(angD)), p0 = rel.clone().add(TREE);
    const vel = V3(-rel.y * w, rel.x * w, 0).add(V3((rnd(i + 1) - .7) * 1.4, rnd(i + 2) * 1.2, (rnd(i + 3) - .2) * 1.4));
    const tt = up - pd, R = o.userData.R; let x = p0.x + vel.x * tt, y = p0.y + vel.y * tt - 4.9 * tt * tt, z = p0.z + vel.z * tt;
    if (y < R) { const tl = (vel.y + Math.sqrt(vel.y * vel.y + 2 * 4.9 * Math.max(0, p0.y - R))) / 9.8, dt = tt - tl; x = p0.x + vel.x * (tl + dt * .4); z = p0.z + vel.z * (tl + dt * .4); y = R + Math.abs(Math.sin(dt * 9)) * .25 * Math.exp(-dt * 5); }
    o.position.set(x, y, Math.min(z, 1.6)); o.rotation.set(tt * 5, tt * 3, 0);
  });
  // regalos bajo la ventana: saltan cuando el árbol cae encima (vuelan hacia la pared y a la izquierda, lejos de todo)
  giftBoxes.forEach((b, i) => { const h = b.userData.home; if (s < TREE_LAND) { b.position.copy(h); b.rotation.set(0, b.userData.ry, 0); return; }
    const t = s - TREE_LAND, vx = -(.6 + rnd(i) * .9), vz = -(.15 + rnd(i + 2) * .25), vy = 2 + rnd(i + 4) * 1.4, tl = 2 * vy / 9.8, tt = Math.min(t, tl), extra = Math.max(0, t - tl);
    b.position.set(h.x + vx * (tt + extra * .15), Math.max(0, vy * tt - 4.9 * tt * tt), Math.max(-4.15, h.z + vz * (tt + extra * .15))); b.rotation.set(tt * 4 * (i % 2 ? 1 : -1), b.userData.ry + tt * 3, tt * 2); });
  bigLid.position.copy(s < BOXLAND ? V3(BIGBOX.x, 1.04, BIGBOX.z) : arc(V3(BIGBOX.x, 1.04, BIGBOX.z), V3(BIGBOX.x - 1.4, .1, BIGBOX.z + .9), seg(s, BOXLAND, BOXLAND + .7), 1.4));
  bigLid.rotation.set(s < BOXLAND ? 0 : seg(s, BOXLAND, BOXLAND + .7) * 5, 0, s < BOXLAND ? 0 : -seg(s, BOXLAND, BOXLAND + .7) * 1.5);
  // luces en Mochi, cable y enchufe
  wrap.visible = s >= OUTB;
  WRAP_B.forEach(b => { if (s > PLUG) bulbOn(b, s * 1.4, 1.2); else { b.material.emissiveIntensity = .15; b.userData.gl.material.opacity = 0; } });
  cord.visible = plug.visible = s >= OUTB;
  if (cord.visible) {
    const a = mochi.sq.localToWorld(V3(.8, .3, .2));
    const pl = s < 27.85 ? V3(MOUT.x + .9, .05, MOUT.z + .45) : (s < PLUG ? pawP.clone() : V3(SOCKET.x, SOCKET.y + .04, SOCKET.z));
    const mid = V3((a.x + pl.x) / 2, .03, (a.z + pl.z) / 2 + .15);
    cord.geometry.dispose(); cord.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, V3(a.x + .05, .04, a.z + .1), mid, V3(pl.x - .05, .04, pl.z), pl]), 40, .018, 5);
    plug.position.copy(pl); plug.rotation.set(s >= PLUG ? Math.PI : 0, 0, 0);
  }
  earOrn.visible = s > EARO; if (earOrn.visible) { const ep = mochi.ears[1].localToWorld(V3(0, .3, .1)); earOrn.position.copy(ep).add(V3(0, -.22 + Math.sin(s * 4) * .01, 0)); }

  // ---- efectos ----
  if (msd.sp > .02) for (const e of mochi.eyes) { const p = e.es.localToWorld(V3(-.25, .3, 1.05)); const sp = sparkP.next(); sp.position.copy(p); sp.scale.setScalar(msd.sp * .3 * (.8 + .3 * Math.sin(s * 14 + e.s))); sp.material.opacity = 1; sp.material.rotation = s * 3 * e.s; }
  if (s >= FALL && s < TREE_LAND + .3) for (let i = 0; i < 26; i++) { const sp = trailP.next(), u = i / 26, y = .9 + u * 3.6, a2 = u * TAU * 5.3; const rel = V3(Math.cos(a2) * treeR(y), y, Math.sin(a2) * treeR(y) + .2); const lag = (phys(s) - PF) - .06 * (1 + rnd(i) * 2); const angL = .24 + (Math.PI / 2 - .2) * clamp(lag / FALL_T) ** 2; const p = rel.applyMatrix4(new THREE.Matrix4().makeRotationZ(angL)).add(TREE); sp.position.copy(p); sp.scale.setScalar(.2 + rnd(i + 3) * .2); sp.material.opacity = .7; sp.material.color.set(['#ffd23f', '#ff6fe0', '#3bb8ff', '#3bff8f', '#ff3b4f'][i % 5]); }
  if (s > TREE_LAND && s < TREE_LAND + .9) { const k = seg(s, TREE_LAND, TREE_LAND + .9); for (let i = 0; i < 18; i++) { const sp = puffP.next(), x = TREE.x - .6 - i * .22; sp.position.set(x, .15 + k * .5 + rnd(i) * .3, TREE.z + (rnd(i + 2) - .5) * 1.6); sp.scale.setScalar(.35 + k * .6); sp.material.opacity = (1 - k) * .6; sp.material.color.set('#e8f6ff'); } }
  if (s > BOXLAND && s < BOXLAND + .8) { const k = seg(s, BOXLAND, BOXLAND + .8); for (let i = 0; i < 16; i++) { const a2 = i / 16 * TAU, sp = sparkP.next(); sp.position.set(BIGBOX.x + Math.cos(a2) * (.5 + k * 1.5), 1.1 + Math.sin(a2) * (.4 + k * 1.2), BIGBOX.z + .5); sp.scale.setScalar((1 - k) * .3); sp.material.opacity = 1; } }
  if (s > BOXLAND + .3 && s < 26.0) for (let i = 0; i < 4; i++) { const a2 = s * 6 + i / 4 * TAU, sp = sparkP.next(); sp.position.set(headTop.x + Math.cos(a2) * .6, headTop.y + .35, headTop.z + Math.sin(a2) * .3); sp.scale.setScalar(.22); sp.material.opacity = 1; }
  if (s > PLUG && s < PLUG + .6) { const k = seg(s, PLUG, PLUG + .6); for (let i = 0; i < 10; i++) { const a2 = i / 10 * TAU, sp = sparkP.next(); sp.position.set(SOCKET.x + Math.cos(a2) * (.1 + k * .5), .15 + Math.abs(Math.sin(a2)) * (.1 + k * .5), SOCKET.z + Math.sin(a2) * .2); sp.scale.setScalar((1 - k) * .2); sp.material.opacity = 1; } }
  if (s > PLUG + 1.0) for (let i = 0; i < 4; i++) { const ph = ((s - PLUG) * .45 + i / 4) % 1, h = hearts.next(); h.position.set(headTop.x - .7 + Math.sin(ph * 6 + i) * .25, headTop.y + ph * 1.2, headTop.z + .2); h.scale.setScalar(Math.sin(ph * Math.PI) * .35); }
  for (const t0 of [PLACE + .25]) if (s > t0 && s < t0 + 1.0) { const ph0 = pip.head.localToWorld(V3(0, .2, 0)); for (let i = 0; i < 3; i++) { const ph = ((s - t0) * 1.4 + i / 3) % 1, h = heartsPink.next(); h.position.set(ph0.x + .1 + ph * .2, ph0.y + .1 + ph * .5, ph0.z); h.scale.setScalar(Math.sin(ph * Math.PI) * .22); } }
  if (s > BONKP && s < BONKP + .9) { const ph0 = pip.head.localToWorld(V3(0, .3, 0)); for (let i = 0; i < 4; i++) { const a2 = s * 6 + i / 4 * TAU, sp = sparkP.next(); sp.position.set(ph0.x + Math.cos(a2) * .25, ph0.y + .05, ph0.z + Math.sin(a2) * .12); sp.scale.setScalar(.12); sp.material.opacity = 1; } }

  // ---- cámara ----
  let c;
  if (hook) c = HOOK_CAM(s, msd);
  else { const C = CAMS[shot]; c = {}; for (const k in C.d) c[k] = C.val(k, s);
    if (c.fw > 0) { const p = V3(msd.x, msd.y + 1.0, msd.z); c.tx = lerp(c.tx, p.x, c.fw); c.ty = lerp(c.ty, p.y, c.fw); c.tz = lerp(c.tz, p.z, c.fw); }
    if (c.sh > 0) { c.tx += Math.sin(s * 83) * .05 * c.sh * c.d / 6; c.ty += Math.cos(s * 71) * .05 * c.sh * c.d / 6; } }
  composite(c, 1.1);

  // ---- acabado ----
  ctx.clearRect(0, 0, W, H);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) { const ph = (s * .03 + rnd(i)) % 1, x = rnd(i + 1) * W, y = H * (.08 + ph * .25) + rnd(i + 2) * 60, r = 40 + rnd(i + 3) * 70; const col = ['255,90,110', '255,210,80', '90,255,160', '80,180,255', '255,120,230'][i % 5]; const g = ctx.createRadialGradient(x, y, r * .6, x, y, r); g.addColorStop(0, `rgba(${col},.10)`); g.addColorStop(.9, `rgba(${col},.07)`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  ctx.restore();
  const slowA = s > SL0 && s < SL1 + .15 && !rew ? Math.min(seg(s, SL0, SL0 + .15), 1 - seg(s, SL1, SL1 + .15)) : 0;
  if (slowA > 0) { const g = ctx.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .75); g.addColorStop(0, 'rgba(20,10,30,0)'); g.addColorStop(1, `rgba(20,10,30,${.35 * slowA})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  if ((s > TREE_LAND && s < TREE_LAND + .06) || (s > BOXLAND && s < BOXLAND + .05) || (s > PLUG && s < PLUG + .06)) { ctx.fillStyle = 'rgba(255,245,220,.45)'; ctx.fillRect(0, 0, W, H); }
  if (s > FALL && s < FALL + .4) focusLines(s, (1 - seg(s, FALL + .1, FALL + .4)) * (hook ? .5 : .8));
  const vg = ctx.createRadialGradient(W / 2, H * .5, H * .3, W / 2, H * .5, H * .8); vg.addColorStop(0, 'rgba(30,10,20,0)'); vg.addColorStop(1, 'rgba(30,10,20,.38)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
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
