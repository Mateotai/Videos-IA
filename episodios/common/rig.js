// =====================================================================
//  Utilidades comunes de animación (los dos estilos: 2D original y 3D)
//  - Rig: fotogramas clave con curvas de aceleración (números)
//  - Steps: valores discretos (expresión de la cara, etc.)
//  - jump / walk: atajos para escribir saltos y paseos con buen "timing"
// =====================================================================
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const rnd = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const easeInOut = p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
const easeOut = p => 1 - Math.pow(1 - p, 3);
const easeOutBack = p => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
const E = {
  io: p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2,
  o: p => 1 - Math.pow(1 - p, 3), i: p => p * p * p,
  oq: p => 1 - (1 - p) * (1 - p), iq: p => p * p, lin: p => p,
  back: p => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  hold: p => p < 1 ? 0 : 1,
};
class Rig {
  constructor(def) { this.d = def; this.k = {}; this.cum = {}; }
  key(t, vals, e = 'io') { for (const n in vals) (this.k[n] ||= []).push({ t, v: vals[n], e }); return this; }
  done() { for (const n in this.k) this.k[n].sort((a, b) => a.t - b.t); return this; }
  val(n, t) {
    const ks = this.k[n]; if (!ks) return this.d[n];
    if (t <= ks[0].t) return ks[0].v;
    const last = ks[ks.length - 1]; if (t >= last.t) return last.v;
    let lo = 0, hi = ks.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (ks[mid].t < t) lo = mid; else hi = mid; }
    const a = ks[lo], b = ks[hi];
    if (b.t === a.t) return b.v;
    return a.v + (b.v - a.v) * E[b.e]((t - a.t) / (b.t - a.t));
  }
  // integral de un parámetro (p. ej. fase de los pasos a partir de la cadencia)
  integ(n, t) {
    const dt = 1 / 240;
    if (!this.cum[n]) { const N = 240 * 60, a = new Float32Array(N); let s = 0; for (let i = 0; i < N; i++) { a[i] = s; s += this.val(n, i * dt) * dt; } this.cum[n] = a; }
    const f = Math.max(0, t) / dt, i = Math.min(Math.floor(f), this.cum[n].length - 2), fr = f - i;
    return this.cum[n][i] * (1 - fr) + this.cum[n][i + 1] * fr;
  }
}
class Steps {
  constructor(v0) { this.k = [[-1e9, v0]]; }
  at(t, v) { this.k.push([t, v]); this.k.sort((a, b) => a[0] - b[0]); return this; }
  get(t) { let v = this.k[0][1]; for (const [kt, kv] of this.k) { if (kt <= t) v = kv; else break; } return v; }
}
// salto con anticipación, arco parabólico y aplastamiento al caer
function jump(r, t0, from, to, h, dur = .6, ant = .15, extra = {}) {
  const t1 = t0 + ant, t2 = t1 + dur, apexY = Math.min(from[1], to[1]) - h;
  r.key(t0, { sy: 1, sx: 1 }); r.key(t1 - .01, { sy: .76, sx: 1.14 });
  r.key(t1, { x: from[0], y: from[1] }); r.key(t1 + .07, { sy: 1.12, sx: .92, ...(extra.air || {}) }, 'o');
  r.key(t1 + dur * .5, { y: apexY }, 'oq'); r.key(t2, { y: to[1] }, 'iq'); r.key(t2, { x: to[0] }, 'lin');
  r.key(t1 + dur * .62, { sy: 1, sx: 1 });
  r.key(t2 + .07, { sy: .8, sx: 1.16 }, 'o'); r.key(t2 + .26, { sy: 1, sx: 1, ...(extra.land || {}) }, 'back');
  return t2;
}
// paseo: mueve x con cadencia de pasos (parámetro wr)
function walk(r, t0, t1, x0, x1, rate = 3) {
  r.key(t0, { x: x0, wr: 0 }); r.key(t0 + .1, { wr: rate }); r.key(t1 - .1, { wr: rate }); r.key(t1, { x: x1 }, 'io'); r.key(t1, { wr: 0 });
}
