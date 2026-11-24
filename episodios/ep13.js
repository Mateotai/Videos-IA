// =====================================================================
//  EPISODIO 13 (3D) — "Surf 🏄"   35 s · 9:16 · PLAYA · personajes con diseño v2
//  Música: "Carefree" (Kevin MacLeod, CC BY 4.0)
//  GANCHO (0–2.4 s de vídeo): Mochi baja una ola GIGANTE en un flotador de flamenco, a cámara lenta,
//  con Pip surfeando sobre su cabeza. REBOBINADO VHS (2.4–2.9). Historia = vídeo − 2.9:
//  1 (0–4.5)    Pip surfea una olita sobre una hoja.
//  2 (4.5–10)   Mochi odia el agua: una salpicadura y salta a lo alto de la sombrilla… ¡coco en la cabeza!
//  3 (10–15)    Idea: infla un flamenco gigante para meterse al mar sin mojarse.
//  4 (15–20.9)  Relax en el mar… detrás crece una ola ENORME. Silencio. Se baja las gafas.
//  5 (20.9–26.5) Surfea la ola a cámara lenta (del miedo a la alegría) y acaba de cabeza en el castillo.
//  6 (26.5–32.1) Un cangrejo le pellizca la oreja; ¡salto! Al final, relax en el flamenco. Letrero.
// =====================================================================
const DURATION = 35;
const HOOK = 2.4, REW = .5, OFF = HOOK + REW;
const HOOK_S0 = 21.0, HOOK_K = (23.9 - HOOK_S0) / HOOK;
const SIGN_V = 32.3, MS = .72;
const SHOTS = [0, 4.5, 10, 15, 20.9, 26.5, 99];
const shotOf = s => { let i = 0; while (i < 5 && s >= SHOTS[i + 1]) i++; return i; };
mochi.root.scale.setScalar(MS); mochi.hemTail.visible = mochi.hemTip.visible = false;

// ---------- escenario ----------
const CASTLE = V3(-1.3, 0, 2.6), TOWEL = V3(1.85, 0, 3.6), UMB = V3(2.2, 0, 3.0), DEFL = V3(.95, 0, 4.0);
palm(4.4, 3.6, 5.0, -1.0); palm(-4.6, 3.4, 4.6, 1.05); palm(6.2, 1.8, 4.0, -.6);
const umb = umbrella(UMB.x, UMB.z); towel(TOWEL.x, TOWEL.z, .25);
const castle = sandcastle(CASTLE.x, CASTLE.z);
starfish(.9, 2.2); starfish(-2.6, 1.6, '#ffb347'); shell(-.4, 1.7, '#ffd6e0'); shell(1.2, 2.6, '#fff1c8'); shell(-2.0, 3.0, '#e8d6ff');
const ball = beachBall(-2.7, 3.9);
const crabby = crab(); crabby.scale.setScalar(1.4);
const flam = flamingo();
const UMB_TOP = V3(UMB.x + .17, sandY(UMB.x, UMB.z) + 2.92, UMB.z);
const CROWN = V3(4.4 - 2.5, sandY(4.4, 3.6) + 5.0, 3.6);
// tabla de Pip (hoja)
const leaf = new THREE.Group(); scene.add(leaf);
leaf.add(mesh(SPH, mat('#5fd07a', .45), { sx: .34, sy: .025, sz: .15 }));
leaf.add(mesh(new THREE.CylinderGeometry(.008, .008, .62, 6), mat('#e8ffd8', .5), { y: .022, rz: Math.PI / 2, shadow: false }));
// gafas de sol de Mochi
const glasses = new THREE.Group(); mochi.hT.add(glasses);
const GL = new THREE.MeshPhysicalMaterial({ color: '#1b1626', roughness: .05, clearcoat: 1 }), GLF = mat('#ff4f8b', .35);
for (const s of [-1, 1]) { glasses.add(mesh(new THREE.CylinderGeometry(.27, .27, .05, 32), GL, { x: s * .36, rx: Math.PI / 2, sy: .9 })); glasses.add(mesh(new THREE.TorusGeometry(.27, .035, 10, 32), GLF, { x: s * .36, sy: .9 })); glasses.add(mesh(SPH, MC.hl, { x: s * .36 - .1, y: .1, z: .04, sx: .06, sy: .04, sz: .01, shadow: false })); }
glasses.add(mesh(new THREE.CapsuleGeometry(.025, .12, 4, 8), GLF, { rz: Math.PI / 2, y: .03 }));
const flyGlasses = glasses.clone(); scene.add(flyGlasses);
const coconut = mesh(SPH, mat('#7a4e2a', .6), { sx: .17, sy: .19, sz: .17 }); scene.add(coconut);
// ---------- LA OLA ----------
const WAVE_GEO = (() => {
  const pts = [[-4, 0], [-2.5, 1.2], [-1.2, 2.6], [-.3, 3.4], [.4, 3.62], [1.0, 3.35], [1.3, 2.85], [1.0, 2.62], [.6, 2.78], [.25, 2.45], [.15, 1.6], [.5, .8], [1.2, .25], [2.0, 0]];
  const sh = new THREE.Shape(); sh.moveTo(...pts[0]); for (let i = 1; i < pts.length; i++) sh.lineTo(...pts[i]); sh.lineTo(-4, 0);
  const g = new THREE.ExtrudeGeometry(sh, { depth: 46, bevelEnabled: false, curveSegments: 4, steps: 60 });
  g.translate(0, 0, -23); g.rotateY(-Math.PI / 2);
  const p = g.attributes.position, col = [], c0 = new THREE.Color('#1a8fc0'), c1 = new THREE.Color('#5fe6e0'), cw = new THREE.Color('#ffffff');
  for (let i = 0; i < p.count; i++) { const y = p.getY(i) / 3.62, u = p.getZ(i), x = p.getX(i); let c = c0.clone().lerp(c1, clamp(y * 1.4 * (u > -.5 ? 1 : .5))); const streak = Math.max(0, Math.sin(x * 2.3 + y * 7 + Math.sin(x * .7) * 3)) ** 8 * clamp(y * 2) * .55; c.lerp(cw, streak); if (y > .86 || (u > .7 && y > .7)) c.lerp(cw, clamp((y - .84) * 6) + (u > .9 ? .6 : 0)); if (y < .12) c.lerp(cw, (.12 - y) * 5); col.push(c.r, c.g, c.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals(); return g;
})();
const wave = new THREE.Mesh(WAVE_GEO, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .1, clearcoat: 1, transparent: true, opacity: .94, side: THREE.DoubleSide }));
wave.renderOrder = 2; wave.castShadow = false; wave.receiveShadow = true; scene.add(wave);
const faceU = v => v >= 2.45 ? .25 : v >= 1.6 ? lerp(.15, .25, (v - 1.6) / .85) : v >= .8 ? lerp(.5, .15, (v - .8) / .8) : lerp(1.2, .5, v / .8);
const sprayP = pool(46, () => new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: '#ffffff', transparent: true, depthWrite: false })));
const dropsP = pool(30, () => mesh(SPH, new THREE.MeshPhysicalMaterial({ color: '#bff6ff', roughness: .05, clearcoat: 1, transparent: true, opacity: .85 }), { shadow: false }));

// =====================================================================
//  GUION
// =====================================================================
const MO = new Rig({ x: TOWEL.x, y: 0, z: TOWEL.z, yaw: -.25, lean: -.25, roll: 0, sx: 1, sy: 1, sz: 1, wr: 0, wamt: 0,
  aLf: .9, aLo: .9, aRf: .9, aRo: .9, hp: -.1, hy: 0, hr: 0, hs: 1, eb: 1, pd: 1, lid: .45, lx: 0, ly: 0, sp: 0,
  mo: 0, tg: 0, tu: 0, lk: 0, br: 0, brA: 1, tw: 1, wg: 0, sn: 0, pk: 0, ed: 0, sit: 1, cross: 0, ck: 0, gl: 0 });
const PI_ = new Rig({ x: -.3, y: 0, z: -6, yaw: .5, lean: .2, roll: 0, sx: 1, sy: 1, wr: 0, wamt: 0,
  aLf: .9, aLo: 1.1, aRf: .9, aRo: 1.1, hp: -.1, hy: 0, hr: 0, lid: 0, lx: 0, ly: 0, sm: 1, mo: .4, ed: 0, must: 0, rub: 0, kick: 0, fid: 0, tailUp: .6, wave: 0 });
const OB = new Rig({ fx: DEFL.x, fz: DEFL.z, fs: .25, inf: 0, fy: 0, wz: -40, wh: 0, crash: 0 });   // flamenco, ola
const KM = (t, v, e) => MO.key(t, v, e), P = (t, v, e) => PI_.key(t, v, e), O = (t, v, e) => OB.key(t, v, e);
const MODE = new Steps('sand');      // sand | float | wave | fly | beach

// ---------------- 1 (0–4.5): Pip surfea ----------------
P(0, { z: -6, x: -.3 }); P(3.0, { z: .25, x: -.25 }, 'o');
P(0, { lean: .2, aLf: .9, aRf: .9, aLo: 1.1, aRo: 1.1, lid: 0, mo: .4 }); P(1.6, { lean: .3, roll: .12 }); P(2.4, { roll: -.1 }); P(3.0, { roll: 0, lean: 0 });
P(3.05, { y: 0 }); P(3.2, { y: .25 }, 'oq'); P(3.4, { y: 0 }, 'iq');
P(3.4, { aLf: .9, aRf: .9, aLo: 1.1, aRo: 1.1, sy: 1 }); P(3.55, { aLf: -.35, aLo: .75, aRf: 2.6, aRo: .4, sy: 1.08, lid: .85, mo: .5, hp: -.2 }, 'back');
P(4.3, { lid: .85 }); P(4.5, { lid: 0 });
// ---------------- 2 (4.5–10): ¡agua no! ----------------
const SPLASH = 7.05, LEAP = 7.35, TOP = 7.75, SLIDE0 = 9.0, SLIDE1 = 9.5, BONK = 9.85;
KM(4.5, { gl: 0, lid: .45, mo: 0 });
P(4.6, { x: -.25, z: .25, yaw: .5, wr: 0, wamt: 0, aRf: 2.6, aLf: -.35, sy: 1 }); P(4.7, { wr: 5.5, wamt: 1, yaw: .9, aLf: .1, aRf: .1, aLo: .25, aRo: .25, lid: 0, hp: 0 }); P(5.3, { x: 1.05, z: 2.7, wr: 5.5, wamt: 1 }, 'io'); P(5.35, { wr: 0, wamt: 0 });
P(5.4, { aRf: 1.4, aRo: -.6, yaw: .7, mo: .5 }); P(5.6, { aRf: 2.2, aRo: .6 }); P(5.8, { aRf: 1.4, aRo: -.6 }); P(6.0, { aRf: 2.2, aRo: .6 });
KM(5.6, { hr: 0, gl: 0, mo: 0 }); KM(5.75, { hr: .3 }); KM(5.9, { hr: -.3 }); KM(6.05, { hr: .3 }); KM(6.2, { hr: 0, aRf: .9 }); KM(6.35, { aRf: 1.6, aRo: .2 }); KM(6.6, { aRf: .9, aRo: .9 });
P(6.2, { yaw: .7, wr: 0, wamt: 0, aRf: 2.2 }); P(6.25, { wr: 6, wamt: 1, yaw: -2.6 }); P(6.7, { x: .35, z: .45, wr: 6, wamt: 1 }, 'io'); P(6.75, { wr: 0, wamt: 0 });
P(6.75, { yaw: -2.6 }); P(6.85, { yaw: .45 }); P(6.9, { lean: 0, aRf: .1 }); P(SPLASH, { lean: .5, aRf: 2.4, aLf: 2.0, aRo: .3, aLo: .3, mo: .7 }, 'o'); P(SPLASH + .2, { lean: 0 });
KM(LEAP - .05, { sit: 1, y: 0, eb: 1, lid: .45, gl: 0, sy: 1, sx: 1, tw: 1 });
KM(LEAP + .02, { sit: 0, sy: 1.45, sx: .8, eb: 1.8, lid: 0, mo: 1.3, aLf: 2.9, aRf: 2.9, aLo: 1.0, aRo: 1.0, ed: .9, tw: 6, gl: 2 }, 'o');
KM(LEAP, { x: TOWEL.x, z: TOWEL.z }); KM(TOP, { x: UMB_TOP.x, z: UMB_TOP.z }, 'o');
KM(LEAP, { y: 0 }); KM(LEAP + .22, { y: UMB_TOP.y + 1.0 }, 'oq'); KM(TOP, { y: UMB_TOP.y - .05 }, 'iq');
KM(TOP + .05, { sy: .85, sx: 1.12, mo: .4, eb: 1.4 }); KM(TOP + .3, { sy: 1, sx: 1 }, 'back');
KM(TOP + .3, { aLf: 1.4, aRf: 1.4, aLo: 1.3, aRo: 1.3, roll: 0 }); KM(8.2, { roll: .2 }); KM(8.5, { roll: -.2 }); KM(8.8, { roll: .15, eb: 1.4, ly: -.7 });
KM(SLIDE0, { y: UMB_TOP.y - .05, x: UMB_TOP.x, roll: .15 }); KM(SLIDE1, { y: 0, x: TOWEL.x, z: TOWEL.z, roll: 0, sit: 1 }, 'iq'); KM(SLIDE1 + .06, { sy: .8, sx: 1.15 }); KM(SLIDE1 + .3, { sy: 1, sx: 1 }, 'back');
KM(SLIDE1 + .2, { eb: 1.1, mo: 0, ly: 0, ed: .3, tw: 1, aLf: .9, aRf: .9, aLo: .9, aRo: .9, lid: 0 });
KM(BONK, { sy: 1 }); KM(BONK + .05, { sy: .82, cross: 1, eb: 1.2 }); KM(BONK + .3, { sy: 1 }, 'back'); KM(10.4, { cross: 1 }); KM(10.6, { cross: 0 });
P(SPLASH + .4, { lid: 0, sm: 1 }); P(LEAP + .2, { lid: .9, aLf: 2.2, aLo: -.75, aRf: .1, aRo: .25, hy: .2, mo: .6 });
for (let k = 0; k < 8; k++) { P(LEAP + .2 + k * .17, { sy: 1.08 }); P(LEAP + .28 + k * .17, { sy: .95 }); }
P(9.0, { lid: .9, sy: 1 }); P(9.2, { lid: 0, aLf: .1, aLo: .25, mo: 0 }); P(BONK + .1, { lid: .9, aLf: 2.2, aLo: -.75 }); P(10.6, { lid: .9 }); P(10.8, { lid: 0, aLf: .1, aLo: .25, hy: 0 });
// ---------------- 3 (10–15): el flamenco ----------------
const IDEA = 10.7, GRAB = 11.15, BLOW = [11.45, 11.95, 12.45], CARRY0 = 13.0, CARRY1 = 13.85, HOPIN = 14.05;
KM(IDEA, { lid: 0, sp: 0, eb: 1, mo: 0, br: 0 }); KM(IDEA + .15, { sp: 1, eb: 1.3, mo: .4, br: 1 }, 'back');
KM(GRAB - .3, { sit: 1, y: 0, lean: -.25, x: TOWEL.x }); KM(GRAB, { sit: 0, lean: 0, x: DEFL.x + .65, z: DEFL.z - .4, yaw: -.6, sp: 0, aLf: 1.2, aRf: 1.2, aLo: -.3, aRo: -.3 }, 'io');
BLOW.forEach((b, i) => { KM(b - .2, { ck: 0, eb: 1.1, mo: 0 }); KM(b, { ck: 1.6, eb: 1.35 }, 'o'); KM(b + .3, { ck: 0, eb: 1.1 }, 'i'); O(b, { inf: i / 3 }); O(b + .3, { inf: (i + 1) / 3 }, 'o'); });
O(GRAB, { fs: .25 }); O(12.8, { fs: .8 }, 'io');
KM(12.85, { lid: 0, mo: 0, gl: 2 }); KM(13.0, { gl: 1, mo: .4, lid: .2 }, 'o');
KM(CARRY0, { x: DEFL.x + .65, z: DEFL.z - .4, yaw: -.6, wr: 0, wamt: 0 }); KM(CARRY0 + .05, { wr: 3.4, wamt: 1, yaw: 2.7 }); KM(CARRY1, { x: .5, z: .2, wr: 3.4, wamt: 1 }, 'io'); KM(CARRY1 + .05, { wr: 0, wamt: 0 });
MODE.at(HOPIN + .3, 'float');
KM(HOPIN - .1, { x: .5, z: .2, y: 0, sit: 0, sy: 1 }); KM(HOPIN, { sy: .8 }); KM(HOPIN + .14, { y: 1.0, sy: 1.15, yaw: -.2 }, 'oq'); KM(HOPIN + .3, { x: .5, z: -.8, y: .3, sit: 1, sy: 1 }, 'iq');
P(11.0, { x: 1.05, z: 2.7 }); P(13.2, { x: 1.05, z: 2.7, yaw: .7, wr: 0, wamt: 0 }); P(13.25, { wr: 6, wamt: 1, yaw: -2.6 }); P(13.85, { x: -.35, z: .35, wr: 6, wamt: 1 }, 'io'); P(13.9, { wr: 0, wamt: 0 });
// ---------------- 4 (15–20.9): la ola ----------------
const FREEZE = 20.3, PICK = 20.9;
O(14.1, { fx: .5, fz: -.8 }); O(16.0, { fx: .45, fz: -4.2 }, 'io');
KM(15.2, { aLf: .9, aRf: .9, aLo: .9, aRo: .9, lid: .2, gl: 1, mo: .4 }); KM(15.8, { aLf: 2.7, aRf: 2.7, aLo: -.9, aRo: -.9, lid: .7, mo: .2, hp: -.2 }, 'io');
O(16.5, { wz: -44, wh: .3 }); O(19.2, { wz: -15, wh: 6.6 }, 'io'); O(FREEZE, { wz: -10.8, wh: 7.0 }); O(PICK, { wz: -10.2, wh: 7.0 });
P(17.6, { yaw: .3, hy: 0, ly: 0, mo: .3, aLf: .9, aRf: .9 }); P(17.9, { hy: -.9, ly: .3 }, 'o'); P(18.3, { hy: 0, mo: 1, aLf: 2.6, aRf: 2.6, aLo: .5, aRo: .5 }); P(18.6, { yaw: 1.2, aRf: 1.4, aRo: -.3 }); P(18.75, { aRf: .9 }); P(18.9, { aRf: 1.4 }); P(19.05, { aRf: .9 });
KM(18.6, { lid: .7, hp: -.2 }); KM(18.9, { lid: 0, hp: 0, aLf: .9, aRf: .9, aLo: .9, aRo: .9 }); KM(19.3, { gl: 1, aRf: .9 }); KM(19.55, { gl: 1.6, aRf: 2.4, aRo: -.4 }, 'o'); KM(19.7, { aRf: .9, aRo: .9 });
KM(19.7, { yaw: -.15, hy: 0 }); KM(20.15, { yaw: 2.6, hy: 0 }, 'io');
KM(FREEZE, { yaw: 2.6, eb: 1, mo: 0 }); KM(FREEZE + .25, { yaw: .1, eb: 1.65, pd: .7, mo: .35, ed: .6 }, 'io'); KM(PICK - .1, { sy: 1 }); KM(PICK - .03, { sy: .93 }); KM(PICK, { sy: 1 });
// ---------------- 5 (20.9–26.5): ¡a surfear! ----------------
const SLOW0 = 21.3, SLOW1 = 24.0, CRASH = 24.2, LAND = 25.45;
MODE.at(PICK, 'wave').at(CRASH + .12, 'fly').at(LAND, 'beach');
O(PICK, { wz: -10.2 }); O(SLOW0, { wz: -8.6 }, 'o'); O(SLOW1, { wz: -7.4 }); O(CRASH + .5, { wz: -5.6 });
O(CRASH, { crash: 0 }); O(CRASH + .45, { crash: 1 }, 'i');
// ---------------- 6 (26.5–32.1): el cangrejo ----------------
const LIFT = 27.35, PINCH = 28.25, JUMP = 28.3, RELAX = 30.0;
for (const r of [MO, PI_, OB]) r.done();

// ---------- tiempo físico ----------
const rateAt = s => { if (s < SLOW0) return 1; if (s < SLOW0 + .15) return lerp(1, .22, seg(s, SLOW0, SLOW0 + .15)); if (s < SLOW1) return .22; if (s < SLOW1 + .15) return lerp(.22, 1, seg(s, SLOW1, SLOW1 + .15)); return 1; };
const TAUT = (() => { const dt = 1 / 600, n = Math.ceil(40 / dt), a = new Float32Array(n + 1); for (let i = 1; i <= n; i++) a[i] = a[i - 1] + rateAt((i - .5) * dt) * dt; return { a, dt }; })();
const phys = s => { const f = clamp(s, 0, 39.9) / TAUT.dt, i = Math.floor(f); return TAUT.a[i] + (TAUT.a[i + 1] - TAUT.a[i]) * (f - i); };

// ---------- olas: posición sobre la cara ----------
function waveK(s) { return OB.val('wh', s) / 3.62; }
function waveAt(s) { return { z: OB.val('wz', s), k: waveK(s), c: OB.val('crash', s) }; }
function rideLocal(s) {     // recorrido de los surfistas sobre la cara (tiempo físico entre PICK y CRASH)
  const u = clamp((phys(s) - phys(PICK)) / (phys(CRASH) - phys(PICK)));
  const climb = seg(s, PICK, SLOW0), v = lerp(lerp(.3, 1.05, E.o(climb)), .45, E.io(clamp((u - .12) / .88)));
  return { v, u: faceU(v) + .42, x: lerp(-1.6, 1.9, E.io(u)) };
}
function rideWorld(s) { const w = waveAt(s), r = rideLocal(s); return V3(r.x, r.v * w.k, w.z + r.u * w.k); }
const RIDE_END = () => rideWorld(CRASH + .12);
function flyPos(s, end, h) { const u = clamp((s - (CRASH + .12)) / (LAND - CRASH - .12)), p0 = RIDE_END(); return V3(lerp(p0.x, end.x, u), lerp(p0.y, end.y, u) + 4 * h * u * (1 - u), lerp(p0.z, end.z, u)); }
const FLAM_LAND = V3(.35, 0, 1.6), PIP_REST = V3(.35, 0, 1.6);

// ---------- estados ----------
function mochiState(s) {
  const st = {}; for (const k in MO.d) st[k] = MO.val(k, s);
  st.walk = MO.integ('wr', s); st.mode = 'full';
  const md = MODE.get(s);
  if (md === 'sand' && st.y < .05 && s < LEAP) st.y = sandY(st.x, st.z) + (st.sit ? .0 : 0);
  if (md === 'sand' && (s < LEAP || s > SLIDE1)) st.y = Math.max(st.y, sandY(st.x, st.z));
  if (s > 8.0 && s < SLIDE0) { st.x += Math.sin(s * 9) * .03; }
  if (md === 'float') { const f = flamPos(s); st.x = f.x; st.z = f.z + .02; st.y = f.y + .24; st.sit = 1; st.lean = -.3; st.wr = 0; st.wamt = 0; st.walk = 0; }
  if (md === 'wave') {
    const p = rideWorld(s); st.x = p.x; st.y = p.y + .26; st.z = p.z; st.sit = 1; st.lean = -.1; st.yaw = .35; st.walk = 0; st.wamt = 0;
    const u = clamp((phys(s) - phys(SLOW0)) / (phys(SLOW1) - phys(SLOW0)));
    st.gl = 1.6; st.eb = u < .3 ? 1.7 : 1.25; st.mo = u < .3 ? 1.3 : 1.0; st.lid = 0; st.pd = u < .3 ? .7 : 1.1; st.ed = u < .3 ? .7 : 0; st.hy = 0; st.lx = 0; st.ly = .1;
    st.aLf = u < .3 ? 2.9 : 2.6; st.aRf = u < .3 ? 2.9 : 2.6; st.aLo = u < .3 ? 1.0 : .7; st.aRo = st.aLo; st.roll = Math.sin(s * 2.5) * .12; st.tw = 4; st.sp = u > .4 ? .7 : 0;
  }
  if (md === 'fly') { const p = flyPos(s, CASTLE.clone().setY(sandY(CASTLE.x, CASTLE.z) + 1.8), 2.0), u = seg(s, CRASH + .12, LAND); st.x = p.x; st.y = p.y; st.z = p.z; st.sit = 0; st.yaw = 0; st.lean = lerp(0, Math.PI * .95, E.io(u)); st.walk = s; st.wamt = .5; st.eb = 1.6; st.mo = 1.1; st.gl = 2; st.aLf = 2.9; st.aRf = 2.9; st.aLo = .9; st.aRo = .9; st.sp = 0; }
  if (md === 'beach') {
    // de cabeza en el castillo (25.45–26.0) → se levanta con el castillo puesto → lo quita → cangrejo
    const y0 = sandY(CASTLE.x, CASTLE.z);
    st.x = CASTLE.x; st.z = CASTLE.z; st.yaw = -.1; st.walk = 0; st.wamt = 0; st.gl = 2; st.sp = 0; st.ck = 0;
    if (s < 26.0) { st.y = y0 + 2.05 - (s < LAND + .1 ? .25 * seg(s, LAND, LAND + .1) : .25); st.lean = Math.PI * .95; st.aLf = 2.9; st.aRf = 2.9; st.aLo = .9; st.aRo = .9; st.walk = s * 4; st.wamt = 1; }
    else { const k = easeOutBack(seg(s, 26.0, 26.4)); st.y = y0; st.lean = lerp(Math.PI * .95, 0, clamp(k)); st.sy = 1; st.walk = (s - 26.4) * 2.2; st.wamt = s > 26.4 && s < LIFT ? 1 : 0; st.x = CASTLE.x + (s > 26.4 ? Math.sin((s - 26.4) * 3) * .25 : 0); st.aLf = 1.4; st.aRf = 1.4; st.aLo = .6; st.aRo = .6; st.eb = 1.1; st.mo = .4; st.lid = 0; }
    if (s > LIFT - .1) { st.aLf = lerp(2.8, .2, seg(s, LIFT + .1, LIFT + .5)); st.aRf = st.aLf; st.aLo = .3; st.aRo = .3; st.mo = 0; st.eb = 1.1; st.cross = s > 27.75 ? 1 : 0; st.lx = 0; st.hy = s > 27.75 ? .3 : 0; }
    if (s > PINCH - .02) { const u = seg(s, JUMP, JUMP + .55); st.y = y0 + Math.sin(u * Math.PI) * 1.3; st.sy = u < .1 ? 1.4 : 1; st.eb = u < 1 ? 1.8 : 1.1; st.mo = u < 1 ? 1.4 : .3; st.cross = 0; st.ed = u < 1 ? .9 : .2; st.aLf = u < 1 ? 2.9 : .9; st.aRf = st.aLf; st.aLo = u < 1 ? 1.1 : .5; st.aRo = st.aLo; st.tw = u < 1 ? 7 : 1; st.hy = 0;
      if (s > JUMP + .55) { const k = seg(s, RELAX, RELAX + .6); const fp = V3(FLAM_LAND.x, 0, FLAM_LAND.z); st.x = lerp(CASTLE.x, fp.x + .05, E.io(k)); st.z = lerp(CASTLE.z, fp.z + .05, E.io(k)); st.y = lerp(y0, sandY(fp.x, fp.z) + .5, E.io(k)) + Math.sin(k * Math.PI) * .5; st.sit = k > .5 ? 1 : 0; st.lean = k > .5 ? -.3 : 0;
        if (s > 29.0 && s < RELAX) { st.hr = Math.sin(s * 9) * .05; st.aRf = 1.9; st.aRo = -.4; st.lid = .3; }     // se frota la oreja
        if (s > RELAX + .6) { st.gl = 1; st.mo = .5; st.lid = .1; st.aLf = 2.7; st.aLo = -.9; st.aRf = s > 31.0 ? 2.6 : 2.7; st.aRo = s > 31.0 ? .7 + Math.sin(s * 10) * .25 : -.9; st.eb = 1.05; st.tw = 2; }
      } }
  }
  if (st.mode === 'full') st.sy *= 1 + Math.sin(s * 3.2) * .012;
  return st;
}
function flamPos(s) {
  const md = MODE.get(s);
  if (s < GRAB) return V3(DEFL.x, sandY(DEFL.x, DEFL.z) + .02, DEFL.z);
  if (s < CARRY1 + .1) { const m = MO; const x = m.val('x', s), z = m.val('z', s), yaw = m.val('yaw', s); return V3(x + Math.sin(yaw) * .55, sandY(x, z) + .55, z + Math.cos(yaw) * .55); }
  if (s < HOPIN + .3) { const u = seg(s, CARRY1 + .1, HOPIN); return V3(lerp(.5 + Math.sin(2.7) * .55, .5, u), lerp(.55, seaH(.5, -.8, s) + .05, u), lerp(.2 + Math.cos(2.7) * .55, -.8, u)); }
  if (md === 'float') { const x = OB.val('fx', s), z = OB.val('fz', s); return V3(x, seaH(x, z, s) + .05 + Math.sin(s * 2) * .03, z); }
  if (md === 'wave') { const p = rideWorld(s); return p.add(V3(0, .02, 0)); }
  if (md === 'fly' || s < LAND + .5) { const u = seg(s, CRASH + .12, LAND + .1); const p0 = RIDE_END(), e = V3(FLAM_LAND.x, sandY(FLAM_LAND.x, FLAM_LAND.z) + .02, FLAM_LAND.z); const b = s > LAND + .1 ? Math.abs(Math.sin((s - LAND - .1) * 9)) * .25 * Math.exp(-(s - LAND) * 4) : 0; return V3(lerp(p0.x, e.x, u), lerp(p0.y, e.y, u) + 4 * 1.6 * u * (1 - u) + b, lerp(p0.z, e.z, u)); }
  return V3(FLAM_LAND.x, sandY(FLAM_LAND.x, FLAM_LAND.z) + .02, FLAM_LAND.z);
}
function pipState(s) {
  const st = {}; for (const k in PI_.d) st[k] = PI_.val(k, s);
  st.walk = PI_.integ('wr', s); st.sy *= 1 + Math.sin(s * 4.1) * .015; st.dripT = 99;
  const md = MODE.get(s);
  if (s < 3.05) { st.y = Math.max(seaH(st.x, st.z, s) + .04, sandY(st.x, st.z) + .04) + Math.sin(s * 3) * .03; }
  else if (md === 'sand' || md === 'float' && s < 14.2) st.y = Math.max(st.y, 0) + sandY(st.x, st.z) * (st.y < .3 ? 1 : 1);
  if (md === 'float' && s > 14.2) { const k = seg(s, 14.2, 14.9); const x = OB.val('fx', s) - .9, z = OB.val('fz', s) - .1; st.x = lerp(-.35, x, k); st.z = lerp(.35, z, k); st.y = Math.max(seaH(st.x, st.z, s) + .04, sandY(st.x, st.z)) + Math.sin(s * 2.3) * .03; if (s < 17.5) { st.yaw = .4; st.aLf = .9; st.aRf = .9; st.aLo = 1.1; st.aRo = 1.1; st.lean = .1; } }
  if (md === 'wave') {   // sobre la cabeza de Mochi, haciendo surf
    scene.updateMatrixWorld(true); const top = mochi.hT.localToWorld(V3(0, .82, 0)); st.x = top.x; st.y = top.y + .02; st.z = top.z; st.yaw = .7; st.lean = .15; st.roll = Math.sin(s * 3) * .1; st.aLf = 1.0; st.aRf = 1.0; st.aLo = 1.2; st.aRo = 1.2; st.lid = 0; st.mo = .7; st.sm = 1; st.walk = 0; st.wamt = 0;
  }
  if (md === 'fly') { const p = flyPos(s, V3(PIP_REST.x, sandY(PIP_REST.x, PIP_REST.z) + .55, PIP_REST.z), 2.6), u = seg(s, CRASH + .12, LAND); st.x = p.x; st.y = p.y; st.z = p.z; st.roll = u * 9; st.mo = 1; st.lid = 0; st.aLf = 2.6; st.aRf = 2.6; }
  if (md === 'beach') { const f = flamPos(s); st.x = f.x - .1; st.z = f.z + .35; st.y = f.y + .5; st.roll = 0; st.yaw = -.2; st.lean = 0; st.walk = 0; st.wamt = 0; st.sm = 1; st.mo = 0; st.aLf = .1; st.aRf = .1; st.aLo = .25; st.aRo = .25; st.lid = 0;
    if (s > JUMP + .05 && s < 29.6) { st.lid = .9; st.aLf = 2.2; st.aLo = -.75; st.mo = .6; st.sy *= 1 + Math.abs(Math.sin(s * 18)) * .08; st.hy = .3; }
    if (s > RELAX + .6) { st.x = f.x - .55; st.z = f.z + .3; st.y = f.y + .45; st.aRf = s > 31.0 ? 2.6 : .1; st.aRo = s > 31.0 ? .6 + Math.sin(s * 10 + 1) * .25 : .25; st.mo = .5; st.yaw = .2; }
  }
  return st;
}

// ---------- cámaras ----------
const CAMS = SHOTS.slice(0, 6).map(() => new Rig({ tx: 0, ty: 1, tz: 0, d: 8, yw: 0, pt: .1, fov: 30, sh: 0, fw: 0 }));
CAMS[0].key(0, { fw: 1, ty: .55, d: 4.4, yw: .2, pt: .05 }).key(3.0, { fw: 1, ty: .5, d: 3.8, yw: .12, pt: .06 }, 'io').key(4.5, { fw: 1, ty: .5, d: 3.6, yw: .08, pt: .06 }, 'io');
CAMS[1].key(4.5, { tx: .9, ty: 1.3, tz: 2.9, d: 9.5, yw: .1, pt: .08 }).key(6.6, { tx: .9, ty: 1.25, tz: 2.6, d: 9.5, yw: .1, pt: .08 }, 'io')
  .key(6.84, { tx: .45, ty: .5, tz: .6, d: 3.4, yw: .35, pt: .06 }).key(LEAP - .01, { tx: .45, ty: .5, tz: .6, d: 3.2, yw: .35, pt: .06 })
  .key(LEAP, { tx: 1.8, ty: 2.0, tz: 3.2, d: 10.5, yw: .05, pt: .06 }).key(8.6, { tx: 1.9, ty: 2.4, tz: 3.3, d: 10, yw: .05, pt: .06 }, 'io').key(10, { tx: 1.7, ty: 1.5, tz: 3.4, d: 8.6, yw: .05, pt: .07 }, 'io');
CAMS[1].key(BONK, { sh: 0 }).key(BONK + .02, { sh: .6 }).key(BONK + .3, { sh: 0 });
CAMS[2].key(10, { tx: 1.5, ty: 1.4, tz: 3.6, d: 8.0, yw: .05, pt: .07 }).key(12.8, { tx: 1.4, ty: 1.4, tz: 3.6, d: 7.2, yw: .05, pt: .07 }, 'io')
  .key(CARRY1, { tx: .6, ty: 1.2, tz: 1.0, d: 9.5, yw: .05, pt: .07 }, 'io').key(15, { tx: .2, ty: 1.0, tz: -.8, d: 9.5, yw: .05, pt: .06 }, 'io');
CAMS[3].key(15, { tx: .0, ty: 1.0, tz: -2.0, d: 9.0, yw: .05, pt: .05 }).key(17.0, { tx: -.1, ty: 1.0, tz: -3.6, d: 7.6, yw: .05, pt: .05 }, 'io')
  .key(19.2, { tx: .3, ty: 2.4, tz: -4.4, d: 8.0, yw: .35, pt: -.1 }, 'io').key(FREEZE - .01, { tx: .3, ty: 2.6, tz: -4.4, d: 8.4, yw: .35, pt: -.12 })
  .key(FREEZE, { tx: .45, ty: 1.5, tz: -4.1, d: 4.6, yw: .1, pt: .03 }).key(PICK, { tx: .45, ty: 1.5, tz: -4.1, d: 4.4, yw: .1, pt: .03 });
CAMS[4].key(PICK, { fw: .5, tx: 0, ty: 3.0, tz: -6, d: 9.5, yw: .6, pt: -.05 }).key(SLOW0, { fw: 1, d: 11.5, yw: .9, pt: -.04 }, 'o').key(23.0, { fw: 1, d: 6.6, yw: .5, pt: -.08 }, 'io')
  .key(SLOW1, { fw: 1, d: 7.0, yw: .3, pt: -.04 }, 'io').key(CRASH + .3, { fw: .3, tx: 0, ty: 2.0, tz: -1, d: 12, yw: .05, pt: .05 }, 'io')
  .key(LAND, { fw: 0, tx: -.5, ty: 1.3, tz: 2.4, d: 9.6, yw: .05, pt: .07 }, 'io').key(26.5, { fw: 0, tx: -.6, ty: 1.25, tz: 2.4, d: 9.0, yw: .05, pt: .07 }, 'io');
CAMS[4].key(CRASH, { sh: 0 }).key(CRASH + .05, { sh: .8 }).key(CRASH + .5, { sh: 0 }).key(LAND, { sh: 0 }).key(LAND + .02, { sh: .8 }).key(LAND + .35, { sh: 0 });
CAMS[5].key(26.5, { tx: -.7, ty: 1.2, tz: 2.4, d: 8.5, yw: .05, pt: .07 }).key(LIFT, { tx: -.9, ty: 1.4, tz: 2.5, d: 6.8, yw: .05, pt: .06 }, 'io')
  .key(27.7, { tx: -1.25, ty: 1.85, tz: 2.6, d: 4.2, yw: .25, pt: .04 }, 'io').key(JUMP + .1, { tx: -1.2, ty: 1.9, tz: 2.6, d: 4.4, yw: .25, pt: .04 })
  .key(JUMP + .6, { tx: -.6, ty: 1.4, tz: 2.2, d: 8.8, yw: .05, pt: .07 }, 'o').key(RELAX + .4, { tx: -.1, ty: 1.2, tz: 1.9, d: 8.2, yw: .05, pt: .07 }, 'io').key(32.5, { tx: .1, ty: 1.4, tz: 1.8, d: 7.6, yw: .05, pt: .07 }, 'io');
CAMS.forEach(c => c.done());
function storyTime(v) { if (v < HOOK) return HOOK_S0 + v * HOOK_K; if (v < OFF) return lerp(HOOK_S0 + HOOK * HOOK_K, 0, E.i(seg(v, HOOK, OFF))); return v - OFF; }
const HOOK_CAM = (s, m) => { const k = E.io(seg(s, HOOK_S0, 23.9)); return { tx: m.x, ty: m.y + lerp(2.6, 1.1, k), tz: m.z, d: lerp(13.5, 7.0, k), yw: lerp(.95, .6, k), pt: lerp(-.04, -.08, k), fov: 32 }; };
const arc = (p0, p1, u, h) => V3(lerp(p0.x, p1.x, u), lerp(p0.y, p1.y, u) + 4 * h * u * (1 - u), lerp(p0.z, p1.z, u));

// =====================================================================
//  FOTOGRAMA
// =====================================================================
const vhs = document.createElement('canvas'); vhs.width = W; vhs.height = H; const vctx = vhs.getContext('2d');
function render(v) {
  const s = storyTime(v), hook = v < HOOK, rew = v >= HOOK && v < OFF;
  resetFx(); for (const p of [steamP, puffP, sparkP, dropP, motes, sprayP, dropsP]) p.reset();
  updateBeach(s);
  const shot = shotOf(s), md = MODE.get(s);
  const msd = mochiState(s); setMochi2(mochi, msd, s); scene.updateMatrixWorld(true);
  const psd = pipState(s); setPip2(pip, psd, s);
  // ola
  const w = waveAt(s); wave.visible = w.k > .02 && w.c < .999 && s < CRASH + .55;
  wave.position.set(0, 0, w.z); wave.scale.set(1, w.k * (1 - .7 * w.c), w.k * (1 + .4 * w.c));
  // flamenco
  const fp = flamPos(s), inf = OB.val('inf', s), fs = OB.val('fs', s);
  flam.position.copy(fp); flam.scale.set(fs, fs * lerp(.18, 1, inf), fs);
  flam.rotation.set(md === 'fly' ? seg(s, CRASH + .12, LAND) * 6 : 0, md === 'sand' && s < HOPIN ? MO.val('yaw', s) : (md === 'wave' ? .35 : -.3), md === 'wave' ? Math.sin(s * 2.5) * .1 : Math.sin(s * 2) * .04 * (md === 'float' ? 1 : 0));
  // tabla de hoja de Pip
  if (s < 3.05) { leaf.visible = true; leaf.position.set(psd.x, psd.y - .01, psd.z); leaf.rotation.set(0, psd.yaw + Math.PI / 2, psd.roll * .6); }
  else if (s < 14.2) { leaf.visible = true; leaf.position.set(-.6, sandY(-.6, .5) + .2, .5); leaf.rotation.set(1.3, .3, 0); }
  else if (md === 'float' || md === 'wave') { leaf.visible = true; leaf.position.set(psd.x, psd.y - .01, psd.z); leaf.rotation.set(0, psd.yaw + Math.PI / 2, psd.roll * .6); }
  else if (md === 'fly') { leaf.visible = true; const p = arc(RIDE_END(), V3(-2.2, sandY(-2.2, 2.0) + .03, 2.0), seg(s, CRASH + .12, LAND + .2), 2.2); leaf.position.copy(p); leaf.rotation.set(s * 6, s * 3, 0); }
  else { leaf.visible = true; leaf.position.set(-2.2, sandY(-2.2, 2.0) + .03, 2.0); leaf.rotation.set(0, .6, 0); }
  // gafas: 0 en los ojos · 1 en la frente · 1.6 bajadas en la nariz · 2 fuera (volando o en la toalla)
  const gl = msd.gl;
  glasses.visible = gl < 1.95;
  const gk = gl <= 1 ? gl : 1 - (gl - 1) * 1.6;     // 1.6 -> casi en los ojos pero un poco caídas
  glasses.position.set(0, lerp(.1, .58, gl <= 1 ? gl : 0) - (gl > 1 ? (gl - 1) * .1 : 0), lerp(.98, .74, gl <= 1 ? gl : 0) + (gl > 1 ? .04 : 0)); glasses.rotation.set(gl <= 1 ? -gl * .55 : .15, 0, 0);
  flyGlasses.visible = gl >= 1.95 && s > LEAP && s < 13.05;
  if (flyGlasses.visible) { const u = seg(s, LEAP, LEAP + .7), p0 = V3(TOWEL.x, sandY(TOWEL.x, TOWEL.z) + 1.5, TOWEL.z), p1 = V3(TOWEL.x - .4, sandY(TOWEL.x - .4, TOWEL.z + .5) + .03, TOWEL.z + .5); flyGlasses.position.copy(u < 1 ? arc(p0, p1, u, 1.2) : p1); flyGlasses.rotation.set(u < 1 ? u * 10 : -Math.PI / 2, .4, 0); flyGlasses.scale.setScalar(MS);
    if (s > GRAB) { flyGlasses.visible = s < 12.9; } }
  // coco
  coconut.visible = s > 9.5 && s < 12;
  if (coconut.visible) { const head = mochi.hT.localToWorld(V3(0, .95, 0)); if (s < BONK) { const u = seg(s, 9.5, BONK); coconut.position.set(lerp(CROWN.x, head.x, u), lerp(CROWN.y, head.y + .1, E.iq(u)), lerp(CROWN.z, head.z, u)); } else { const u = seg(s, BONK, BONK + .6); coconut.position.copy(arc(V3(head.x, head.y + .1, head.z), V3(TOWEL.x + .8, sandY(TOWEL.x + .8, TOWEL.z + .6) + .17, TOWEL.z + .6), u, .6)); } coconut.rotation.set(s * 6, 0, 0); }
  // sombrilla: se dobla con Mochi encima
  umb.rotation.z = s > TOP && s < SLIDE1 ? Math.sin(s * 7) * .06 + (s > SLIDE0 ? -.25 * seg(s, SLIDE0, SLIDE1) : 0) : 0;
  // castillo: en su sitio, en la cabeza de Mochi, o tirado a un lado
  if (s < 26.0) { castle.position.set(CASTLE.x, sandY(CASTLE.x, CASTLE.z), CASTLE.z); castle.rotation.set(0, 0, 0); castle.scale.setScalar(1); }
  else if (s < LIFT + .1) { const top = mochi.hT.localToWorld(V3(0, -.1, 0)); castle.position.copy(top); castle.quaternion.setFromRotationMatrix(new THREE.Matrix4().extractRotation(mochi.hT.matrixWorld)); castle.rotateX(Math.PI); castle.translateY(-.55); castle.scale.setScalar(1.05); }
  else { const u = seg(s, LIFT + .1, LIFT + .55), p0 = mochi.hT.localToWorld(V3(0, 1.2, 0)), p1 = V3(CASTLE.x - 1.1, sandY(CASTLE.x - 1.1, CASTLE.z + .3), CASTLE.z + .3); castle.position.copy(u < 1 ? arc(p0, p1, u, .6) : p1); castle.rotation.set(u < 1 ? u * 3 : 0, .3, u < 1 ? u * 2 : Math.PI * .45); castle.scale.setScalar(1); }
  // cangrejo
  crabby.visible = s > LIFT;
  if (crabby.visible) {
    const ear = mochi.ears[1].localToWorld(V3(0, .38, .1));
    if (s < JUMP + .2) { crabby.position.copy(ear); crabby.rotation.set(0, -.3, -.4); }
    else { const u = seg(s, JUMP + .2, JUMP + .7), g0 = V3(CASTLE.x + .6, sandY(CASTLE.x + .6, CASTLE.z + .5), CASTLE.z + .5); if (u < 1) crabby.position.copy(arc(ear, g0, u, .4)); else { const k = s - (JUMP + .7); crabby.position.set(g0.x - k * .7, sandY(g0.x - k * .7, g0.z + k * .2), g0.z + k * .2); } crabby.rotation.set(0, u < 1 ? u * 6 : 1.2, 0); }
    crabby.userData.claws.forEach((cl, i) => { const snap = s > PINCH - .05 && s < PINCH + .2 ? Math.sin((s - PINCH) * 50) * .5 : Math.sin(s * 10 + i) * .25; cl.rotation.z = snap; });
  }
  ball.rotation.set(s * .3, 0, 0);

  // ---- efectos ----
  scene.updateMatrixWorld(true);
  // salpicadura de Pip
  if (s > SPLASH && s < LEAP + .05) { const u = seg(s, SPLASH, LEAP), p0 = V3(.45, .2, .7), p1 = mochi.hT.localToWorld(V3(0, 0, .9)); for (let i = 0; i < 10; i++) { const d = dropsP.next(); const off = V3((rnd(i) - .5) * .5, (rnd(i + 1) - .5) * .3, (rnd(i + 2) - .5) * .4); d.position.copy(arc(p0, p1.clone().add(off), clamp(u * (1 + rnd(i + 4) * .2)), .9)); d.scale.setScalar(.035 + rnd(i + 3) * .03); } }
  // estela de Pip surfeando y de los surfistas en la ola
  if (s < 3.05) for (let i = 0; i < 8; i++) { const ph = (s * 2 + i / 8) % 1, sp = sprayP.next(); sp.position.set(psd.x + (rnd(i) - .5) * .4, .05 + ph * .2, psd.z - .3 - ph * .8); sp.scale.setScalar(.12 + ph * .25); sp.material.opacity = (1 - ph) * .6; }
  if (wave.visible) { const k = w.k; for (let i = 0; i < 30; i++) { const ph = (phys(s) * .7 + i / 30) % 1, sp = sprayP.next(); const x = -8 + rnd(i) * 16; sp.position.set(x, (3.5 + ph * 1.2) * k, w.z + (.8 + ph * .9) * k); sp.scale.setScalar((.4 + ph * .9) * k / 1.3); sp.material.opacity = (1 - ph) * .7; } }
  if (md === 'wave') { const p = rideWorld(s); for (let i = 0; i < 12; i++) { const ph = (phys(s) * 2.2 + i / 12) % 1, d = dropsP.next(); d.position.set(p.x - .6 - ph * 1.2, p.y + .1 + Math.sin(ph * Math.PI) * .6, p.z + (rnd(i) - .5) * .5); d.scale.setScalar(.05 * (1 - ph * .6)); } }
  // rompe la ola
  if (s > CRASH && s < CRASH + 1.0) { const k = seg(s, CRASH, CRASH + 1.0); for (let i = 0; i < 30; i++) { const a = rnd(i) * TAU, sp = puffP.next(); sp.position.set(-8 + rnd(i + 1) * 16, (2.4 + Math.sin(a) * 1.2) * (1 - k * .6) + .3, w.z + 2 + rnd(i + 2) * 2 + k * 2.5); sp.scale.setScalar(1.0 + k * 1.6); sp.material.opacity = (1 - k) * .85; sp.material.color.set('#ffffff'); } }
  // aterrizajes en la arena
  for (const [t0, p] of [[LAND, V3(CASTLE.x, sandY(CASTLE.x, CASTLE.z), CASTLE.z)], [LAND + .1, V3(FLAM_LAND.x, sandY(FLAM_LAND.x, FLAM_LAND.z), FLAM_LAND.z)]]) if (s > t0 && s < t0 + .6) { const k = seg(s, t0, t0 + .6); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, sp = puffP.next(); sp.position.set(p.x + Math.cos(a) * (.4 + k * .9), p.y + .1 + k * .3, p.z + Math.sin(a) * (.3 + k * .7)); sp.scale.setScalar(.3 + k * .5); sp.material.opacity = (1 - k) * .7; sp.material.color.set('#f6e0ae'); } }
  // estrellitas: coco y salto
  const headTop = mochi.hT.localToWorld(V3(0, .95, 0));
  if (s > BONK && s < BONK + 1.0) for (let i = 0; i < 5; i++) { const a = s * 6 + i / 5 * TAU, sp = sparkP.next(); sp.position.set(headTop.x + Math.cos(a) * .55, headTop.y + .05, headTop.z + Math.sin(a) * .25); sp.scale.setScalar(.22); sp.material.opacity = 1; }
  if (msd.sp > .02) for (const e of mochi.eyes) { const p = e.es.localToWorld(V3(-.25, .3, 1.05)); const sp = sparkP.next(); sp.position.copy(p); sp.scale.setScalar(msd.sp * .3 * (.8 + .3 * Math.sin(s * 14 + e.s))); sp.material.opacity = 1; sp.material.rotation = s * 3 * e.s; }
  if (s > IDEA && s < GRAB) { const k = easeOutBack(seg(s, IDEA, IDEA + .2)) * (1 - seg(s, GRAB - .1, GRAB)); bulb.visible = true; bulb.position.set(headTop.x, headTop.y + .6, headTop.z); bulb.scale.setScalar(Math.max(.001, k) * .6); }
  // risas de Pip
  for (const t0 of [LEAP + .2, BONK + .1, JUMP + .05]) if (s > t0 && s < t0 + 1.2) { const ph0 = pip.head.localToWorld(V3(0, .2, 0)); for (let i = 0; i < 3; i++) { const ph = ((s - t0) * 1.4 + i / 3) % 1, h = heartsPink.next(); h.position.set(ph0.x + .1 + ph * .2, ph0.y + .1 + ph * .5, ph0.z); h.scale.setScalar(Math.sin(ph * Math.PI) * .22); } }
  if (s > RELAX + .8) for (let i = 0; i < 3; i++) { const ph = ((s - RELAX) * .5 + i / 3) % 1, h = hearts.next(); h.position.set(headTop.x + .5 + Math.sin(ph * 6 + i) * .2, headTop.y + .1 + ph * 1.0, headTop.z + .2); h.scale.setScalar(Math.sin(ph * Math.PI) * .32); }

  // ---- cámara ----
  let c;
  if (hook) c = HOOK_CAM(s, msd);
  else { const C = CAMS[shot]; c = {}; for (const k in C.d) c[k] = C.val(k, s);
    if (c.fw > 0) { let p = null; if (shot === 0) p = V3(psd.x, psd.y + .3, psd.z); else if (shot === 4 && (md === 'wave' || md === 'fly')) p = V3(msd.x, msd.y + .9, msd.z); if (p) { c.tx = lerp(c.tx, p.x, c.fw); c.ty = lerp(c.ty, p.y, c.fw); c.tz = lerp(c.tz, p.z, c.fw); } }
    if (c.sh > 0) { c.tx += Math.sin(s * 83) * .05 * c.sh * c.d / 6; c.ty += Math.cos(s * 71) * .05 * c.sh * c.d / 6; } }
  composite(c, .8);

  // ---- acabado ----
  ctx.clearRect(0, 0, W, H);
  const slowA = s > SLOW0 && s < SLOW1 + .15 && !rew ? Math.min(seg(s, SLOW0, SLOW0 + .15), 1 - seg(s, SLOW1, SLOW1 + .15)) : 0;
  if (slowA > 0) { const g = ctx.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .75); g.addColorStop(0, 'rgba(10,40,70,0)'); g.addColorStop(1, `rgba(10,40,70,${.32 * slowA})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  if ((s > CRASH && s < CRASH + .06) || (s > LAND && s < LAND + .05) || (s > BONK && s < BONK + .05)) { ctx.fillStyle = 'rgba(255,255,250,.5)'; ctx.fillRect(0, 0, W, H); }
  if (s > PICK && s < PICK + .45) focusLines(s, (1 - seg(s, PICK + .1, PICK + .45)) * (hook ? .5 : .8));
  if (s > PINCH && s < PINCH + .4) focusLines(s, 1 - seg(s, PINCH + .1, PINCH + .4));
  const vg = ctx.createRadialGradient(W / 2, H * .48, H * .32, W / 2, H * .5, H * .8); vg.addColorStop(0, 'rgba(20,60,90,0)'); vg.addColorStop(1, 'rgba(20,60,90,.2)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
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
