import {FULLSCREEN_VERT, fullscreenTriangle, link, uniforms} from '../../lib/gl';
import {Spring, clamp, easeInOutCubic, easeInOutSine, lerp, smoothstep} from '../../lib/motion';
import {prefersReducedMotion, watchVisible} from '../../lib/useNear';
import {moon, sun, type Px, type Tone} from './icons';
import {BODY_FRAG, PIXEL_FRAG, PIXEL_VERT} from './shader';

const ASPECT = 1.93; // track width / height
const KNOB = {half: 0.445, wide: 1.03, radius: 0.42}; // half-height (× track h), width/height, corner (× half-height)
const KNOB_SPRING = {stiff: 115, damp: 17}; // smooth glide with the faintest settle
const DRAG_START = 4; // px before a press becomes a drag
const STAGGER = 0.24; // how far apart (in knob travel) the pixels start their morph
const BURST = [1.4, 3.8]; // grid units a pixel flies out mid-way
const SPIN = 0.9;
const SPAN = 1.18; // strip half-span (rad)
const MAX_PX = 160;

/** Pixel colours [r, g, b] per tone, night and day. */
const INK: Record<Tone, [number[], number[]]> = {
  hi: [
    [1.0, 0.975, 0.93],
    [0.2, 0.19, 0.18],
  ],
  lo: [
    [0.55, 0.6, 0.7],
    [0.36, 0.35, 0.33],
  ],
  star: [
    [0.85, 0.97, 1.0],
    [0.2, 0.19, 0.18],
  ],
};

/** One pixel, paired once between the moon (t = 0) and the sun (t = 1). */
interface P {
  mx: number;
  my: number;
  sx: number;
  sy: number;
  cm: number[]; // rgba as part of the moon (alpha 0 if it only belongs to the sun)
  cs: number[]; // rgba as part of the sun
  dx: number; // burst offset at mid-morph (grid units)
  dy: number;
  spin: number;
  d: number; // start offset along t, 0 … STAGGER
  star: boolean;
  ox: number; // pointer push, sprung back
  oy: number;
  vx: number;
  vy: number;
}

const rgba = (tone: Tone, level: number, day: boolean) => [...INK[tone][day ? 1 : 0], level];

/**
 * Pair moon and sun pixels by angle round the centre, so the swarm swirls coherently from one icon to the other;
 * when one icon has more pixels, the spares fade in or out on the other side.
 */
function pairUp(): P[] {
  const byAngle = (a: Px[]) => [...a].sort((u, v) => Math.atan2(u.y, u.x) - Math.atan2(v.y, v.x));
  const M = byAngle(moon());
  const S = byAngle(sun());
  const n = Math.max(M.length, S.length);
  const usedM = new Set<number>();
  const usedS = new Set<number>();
  const out: P[] = [];
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  for (let k = 0; k < n && k < MAX_PX; k++) {
    const mi = Math.floor((k * M.length) / n);
    const si = Math.floor((k * S.length) / n);
    const m = M[mi];
    const s = S[si];
    const cm = rgba(m.tone, m.level, false);
    const cs = rgba(s.tone, s.level, true);
    if (usedM.has(mi)) cm[3] = 0;
    if (usedS.has(si)) cs[3] = 0;
    usedM.add(mi);
    usedS.add(si);
    const ang = Math.atan2(m.y + s.y + 0.01, m.x + s.x + 0.01) + (rnd() - 0.5) * 1.6;
    const r = BURST[0] + rnd() * (BURST[1] - BURST[0]);
    out.push({
      mx: m.x,
      my: m.y,
      sx: s.x,
      sy: s.y,
      cm,
      cs,
      dx: Math.cos(ang) * r,
      dy: Math.sin(ang) * r,
      spin: (rnd() - 0.5) * 2 * SPIN,
      d: rnd() * STAGGER,
      star: m.tone === 'star',
      ox: 0,
      oy: 0,
      vx: 0,
      vy: 0,
    });
  }
  return out;
}

export class EmberEngine {
  private root: HTMLElement;
  private canvas: HTMLCanvasElement;
  private hit: HTMLButtonElement;
  private gl: WebGL2RenderingContext | null = null;
  private body: WebGLProgram | null = null;
  private pix: WebGLProgram | null = null;
  private ub: Record<string, WebGLUniformLocation | null> = {};
  private up: Record<string, WebGLUniformLocation | null> = {};
  private triVao: WebGLVertexArrayObject | null = null;
  private pixVao: WebGLVertexArrayObject | null = null;
  private partBuf: WebGLBuffer | null = null;
  private colBuf: WebGLBuffer | null = null;
  private partData = new Float32Array(MAX_PX * 4);
  private colData = new Float32Array(MAX_PX * 4);

  private W = 0;
  private H = 0;
  private dpr = 1;
  private track = {x: 0, y: 0, w: 0, h: 0};

  /**
   * Everything follows one number: the knob position t (0 = night/moon at the left, 1 = day/sun at the right).
   * Dragging sets it directly; otherwise a spring carries it to `target`.
   */
  private t = 0;
  private tv = 0;
  private target = 0;
  // The strip goes round the right side on the way to day and the left on the way to night; which way it is
  // heading only flips once the knob has come to rest at an end, so dragging back and forth never jumps.
  private toDay = true;
  private angPrev = Math.PI / 2;
  private angVel = 0;
  private press = new Spring(0, 420, 28);
  private drag: {id: number; x0: number; t0: number; on: boolean; lastX: number; lastT: number; vel: number} | null = null;
  private parts: P[] = pairUp();
  private ptr: {x: number; y: number} | null = null;
  private time = 0;

  private raf = 0;
  private last = 0;
  private settle = 0;
  private odd = false;
  private visible = true;
  private alive = true;
  private reduced = prefersReducedMotion();
  private cleanups: (() => void)[] = [];

  /** Called when the visitor picks a side (not when the site sets it through setDay). */
  private onChange?: (day: boolean) => void;

  // Portfolio change: the switch starts on the site's theme, reports choices back, and fills a small box.
  constructor(root: HTMLElement, canvas: HTMLCanvasElement, hit: HTMLButtonElement, options: {day?: boolean; onChange?: (day: boolean) => void} = {}) {
    this.t = this.target = options.day ? 1 : 0;
    this.toDay = !options.day;
    this.angPrev = options.day ? -Math.PI / 2 : Math.PI / 2;
    this.onChange = options.onChange;
    this.root = root;
    this.canvas = canvas;
    this.hit = hit;
    this.initGL();
    this.bind();
    this.fit();
    this.writeState();
    const ro = new ResizeObserver(() => this.fit());
    ro.observe(root);
    this.cleanups.push(() => ro.disconnect());
    this.cleanups.push(
      watchVisible(root, (v) => {
        this.visible = v;
        if (v) this.start();
      }),
    );
    const sec = root.closest<HTMLElement>('.sec');
    const tone = sec?.dataset.tone;
    if (sec) this.cleanups.push(() => (sec.dataset.tone = tone));
    this.start();
  }

  /** Follow a theme change made elsewhere on the site. */
  setDay(day: boolean) {
    if (this.target > 0.5 === day) return;
    this.target = day ? 1 : 0;
    this.writeState();
    this.start();
  }

  destroy() {
    this.alive = false;
    cancelAnimationFrame(this.raf);
    this.cleanups.forEach((f) => f());
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }

  // ── Derived state ───────────────────────────────────────────────────────────
  /** A pixel's position (grid units), colour and spin at knob position t. */
  private now(p: P, t: number) {
    const m = clamp((t - p.d) / (1 - STAGGER));
    const e = easeInOutCubic(m);
    const b = Math.sin(Math.PI * m);
    const burst = b ** 0.9;
    const x = lerp(p.mx, p.sx, e) + p.dx * burst + p.ox;
    const y = lerp(p.my, p.sy, e) + p.dy * burst + p.oy;
    const k = smoothstep(0.3, 0.7, m);
    const c = [lerp(p.cm[0], p.cs[0], k), lerp(p.cm[1], p.cs[1], k), lerp(p.cm[2], p.cs[2], k), lerp(p.cm[3], p.cs[3], k) * (1 - 0.3 * b)];
    return {x, y, c, rot: p.spin * b};
  }

  /** Strip angle (y down): bottom at night, top by day, via the right side going to day, the left coming back. */
  private stripAngle() {
    const e = easeInOutSine(clamp(this.t));
    return this.toDay ? Math.PI / 2 - Math.PI * e : -1.5 * Math.PI + Math.PI * e;
  }

  private get theme() {
    return smoothstep(0.05, 0.95, clamp(this.t));
  }

  // ── Input ───────────────────────────────────────────────────────────────────
  private bind() {
    const hit = this.hit;
    const on = <K extends keyof HTMLElementEventMap>(type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      hit.addEventListener(type, fn as EventListener);
      this.cleanups.push(() => hit.removeEventListener(type, fn as EventListener));
    };
    on('pointerdown', (e) => {
      if (e.button !== 0) return;
      const now = performance.now();
      this.drag = {id: e.pointerId, x0: e.clientX, t0: this.t, on: false, lastX: e.clientX, lastT: now, vel: 0};
      hit.setPointerCapture(e.pointerId);
      this.press.target = 1;
      this.start();
    });
    on('pointermove', (e) => {
      const r = this.root.getBoundingClientRect();
      this.ptr = {x: e.clientX - r.left, y: e.clientY - r.top};
      const d = this.drag;
      if (d && e.pointerId === d.id) {
        const dx = e.clientX - d.x0;
        if (!d.on && Math.abs(dx) > DRAG_START) {
          d.on = true;
          hit.classList.add('is-dragging');
        }
        if (d.on) {
          const now = performance.now();
          const dt = Math.max(1, now - d.lastT) / 1000;
          // Past the ends it gets heavy rather than stopping dead.
          let nt = d.t0 + dx / this.travel;
          if (nt < 0) nt *= 0.25;
          else if (nt > 1) nt = 1 + (nt - 1) * 0.25;
          d.vel = 0.6 * d.vel + 0.4 * ((nt - this.t) / dt);
          this.t = nt;
          this.tv = 0;
          d.lastX = e.clientX;
          d.lastT = now;
        }
      }
      this.start();
    });
    const end = (e: PointerEvent) => {
      const d = this.drag;
      if (!d || e.pointerId !== d.id) return;
      this.drag = null;
      this.press.target = 0;
      hit.classList.remove('is-dragging');
      if (d.on) {
        // Let go: a flick carries it; otherwise it settles at whichever end is nearer.
        const held = performance.now() - d.lastT > 90;
        this.tv = held ? 0 : clamp(d.vel, -8, 8);
        this.target = this.t + this.tv * 0.12 > 0.5 ? 1 : 0;
      } else {
        this.target = this.target > 0.5 ? 0 : 1;
      }
      this.writeState();
      this.onChange?.(this.target > 0.5);
      this.start();
    };
    on('pointerup', end);
    on('pointercancel', end);
    on('pointerleave', () => {
      this.ptr = null;
      this.start();
    });
    // Keyboard: Enter / Space arrive as a click with detail 0; arrows pick a side.
    on('click', (e) => {
      if ((e as MouseEvent).detail !== 0) return;
      this.target = this.target > 0.5 ? 0 : 1;
      this.writeState();
      this.onChange?.(this.target > 0.5);
      this.start();
    });
    on('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      this.target = e.key === 'ArrowRight' ? 1 : 0;
      this.writeState();
      this.onChange?.(this.target > 0.5);
      this.start();
    });
  }

  private writeState() {
    const day = this.target > 0.5;
    this.hit.setAttribute('aria-checked', String(day));
    this.hit.setAttribute('aria-label', day ? 'Day theme. Switch to night' : 'Night theme. Switch to day');
  }

  // ── Layout ──────────────────────────────────────────────────────────────────
  private fit() {
    const r = this.root.getBoundingClientRect();
    if (!r.width || !r.height) return;
    this.W = r.width;
    this.H = r.height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Portfolio change: the track fills its box instead of sitting in a full-screen room.
    const w = Math.min(this.W - 4, (this.H - 4) * ASPECT);
    const h = w / ASPECT;
    const cy = this.H / 2;
    this.track = {x: (this.W - w) / 2, y: cy - h / 2, w, h};
    Object.assign(this.hit.style, {
      left: `${this.track.x}px`,
      top: `${this.track.y}px`,
      width: `${w}px`,
      height: `${h}px`,
      borderRadius: `${this.trackRadius}px`,
    });
    this.canvas.width = Math.round(this.W * this.dpr);
    this.canvas.height = Math.round(this.H * this.dpr);
    this.start();
  }

  /** Track corners are concentric with the knob's: knob radius + the padding round the knob. */
  private get trackRadius() {
    const h = this.track.h;
    return h * KNOB.half * KNOB.radius + (h / 2 - h * KNOB.half);
  }

  private get travel() {
    const {w, h} = this.track;
    const pad = h / 2 - h * KNOB.half;
    return w - 2 * (pad + h * KNOB.half * KNOB.wide);
  }

  /** Knob centre, half extents and corner radius (css px), and the pixel pitch. */
  private knob() {
    const {x, y, h} = this.track;
    const sq = 1 - 0.03 * clamp(this.press.x);
    const hh = h * KNOB.half * sq;
    const hw = hh * KNOB.wide;
    const pad = h / 2 - h * KNOB.half;
    const x0 = x + pad + h * KNOB.half * KNOB.wide;
    return {cx: x0 + this.t * this.travel, cy: y + h / 2, hw, hh, r: hh * KNOB.radius, s: hh * 0.066};
  }

  // ── Frame ───────────────────────────────────────────────────────────────────
  private start() {
    this.settle = 0;
    if (!this.raf && this.alive && this.visible) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (!this.alive || !this.visible) return;
    const dt = Math.min(1 / 30, (now - this.last) / 1000);
    this.last = now;
    const busy = this.update(dt);
    // At rest at night the star still twinkles: redraw every other frame for that.
    this.odd = !this.odd;
    if (busy || this.odd) this.render();
    this.settle = busy ? 0 : this.settle + 1;
    if (this.settle < 3 || (this.t < 0.5 && !this.reduced)) this.raf = requestAnimationFrame(this.frame);
  };

  private update(dt: number) {
    this.time += dt;
    this.press.step(dt);

    if (!this.drag?.on) {
      const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
      const h = dt / steps;
      const stiff = this.reduced ? 300 : KNOB_SPRING.stiff;
      const damp = this.reduced ? 35 : KNOB_SPRING.damp;
      for (let i = 0; i < steps; i++) {
        this.tv += ((this.target - this.t) * stiff - this.tv * damp) * h;
        this.t += this.tv * h;
      }
      if (Math.abs(this.t - this.target) < 1e-4 && Math.abs(this.tv) < 1e-3) {
        this.t = this.target;
        this.tv = 0;
        // At rest at an end: the next trip goes round the other way.
        this.toDay = this.t < 0.5;
      }
    }

    const ang = this.stripAngle();
    const dAng = Math.atan2(Math.sin(ang - this.angPrev), Math.cos(ang - this.angPrev)); // the two branches meet 2π apart
    this.angVel = dt > 0 ? dAng / dt : 0;
    this.angPrev = ang;

    // The pointer pushes nearby pixels aside; they spring back home.
    const kn = this.knob();
    const ptr = this.ptr ? {x: (this.ptr.x - kn.cx) / kn.s, y: (this.ptr.y - kn.cy) / kn.s} : null;
    let moving = false;
    for (const p of this.parts) {
      if (ptr && !this.drag?.on) {
        const n = this.now(p, this.t);
        const dx = n.x - ptr.x;
        const dy = n.y - ptr.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 7) {
          const f = (1 - d2 / 7) * 90;
          const d = Math.sqrt(d2) + 0.25;
          p.vx += (dx / d) * f * dt;
          p.vy += (dy / d) * f * dt;
        }
      }
      p.vx += (-p.ox * 140 - p.vx * 15) * dt;
      p.vy += (-p.oy * 140 - p.vy * 15) * dt;
      p.ox += p.vx * dt;
      p.oy += p.vy * dt;
      if (Math.abs(p.ox) + Math.abs(p.oy) + Math.abs(p.vx) + Math.abs(p.vy) > 0.004) moving = true;
    }

    const n = this.theme;
    const room = [lerp(20, 221, n), lerp(21, 217, n), lerp(28, 209, n)];
    this.root.style.setProperty('--em-room', `rgb(${room.map((c) => c | 0).join(', ')})`);
    const sec = this.root.closest<HTMLElement>('.sec');
    if (sec) sec.dataset.tone = n < 0.5 ? 'dark' : 'light';

    return (
      moving ||
      !!this.drag?.on ||
      Math.abs(this.t - this.target) > 1e-4 ||
      Math.abs(this.tv) > 1e-4 ||
      Math.abs(this.press.x - this.press.target) > 1e-3
    );
  }

  private render() {
    const gl = this.gl;
    if (!gl || !this.body || !this.pix) return;
    const d = this.dpr;
    const kn = this.knob();
    const {x, y, w, h} = this.track;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    gl.disable(gl.BLEND);
    gl.useProgram(this.body);
    const ub = this.ub;
    gl.uniform2f(ub.uRes, this.canvas.width, this.canvas.height);
    gl.uniform4f(ub.uTrack, x * d, y * d, w * d, h * d);
    gl.uniform1f(ub.uTRad, this.trackRadius * d);
    gl.uniform4f(ub.uKnob, kn.cx * d, kn.cy * d, kn.hw * d, kn.hh * d);
    gl.uniform1f(ub.uKRad, kn.r * d);
    gl.uniform1f(ub.uTheme, this.theme);
    gl.uniform1f(ub.uAng, this.stripAngle());
    // The strip stretches into a short comet while it's travelling.
    gl.uniform1f(ub.uSpan, SPAN + Math.min(0.6, Math.abs(this.angVel) * 0.09));
    gl.uniform1f(ub.uPx, d);
    gl.bindVertexArray(this.triVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Pixels.
    const night = 1 - this.theme;
    const tw = 0.6 + 0.4 * Math.sin(this.time * 3.2);
    const t = clamp(this.t);
    let count = 0;
    for (const p of this.parts) {
      const n = this.now(p, t);
      let a = n.c[3];
      if (p.star) a *= lerp(1, tw, night);
      if (a <= 0.01) continue;
      this.partData.set([(kn.cx + n.x * kn.s) * d, (kn.cy + n.y * kn.s) * d, kn.s * 0.84 * d, n.rot], count * 4);
      this.colData.set([n.c[0], n.c[1], n.c[2], a], count * 4);
      if (++count >= MAX_PX) break;
    }
    if (count) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(this.pix);
      gl.uniform2f(this.up.uRes, this.canvas.width, this.canvas.height);
      gl.uniform1f(this.up.uGlow, night);
      gl.bindVertexArray(this.pixVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.partBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.partData.subarray(0, count * 4));
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colData.subarray(0, count * 4));
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
      gl.disable(gl.BLEND);
    }
  }

  private initGL() {
    const gl = this.canvas.getContext('webgl2', {antialias: false, alpha: false, premultipliedAlpha: false});
    if (!gl) {
      this.root.classList.add('em--flat');
      return;
    }
    const body = link(gl, FULLSCREEN_VERT, BODY_FRAG, ['aPos'], 'ember-body');
    const pix = link(gl, PIXEL_VERT, PIXEL_FRAG, ['aCorner', 'aPart', 'aCol'], 'ember-pixels');
    if (!body || !pix) {
      this.root.classList.add('em--flat');
      return;
    }
    this.gl = gl;
    this.body = body;
    this.pix = pix;
    this.ub = uniforms(gl, body, ['uRes', 'uTrack', 'uTRad', 'uKnob', 'uKRad', 'uTheme', 'uAng', 'uSpan', 'uPx']);
    this.up = uniforms(gl, pix, ['uRes', 'uGlow']);
    this.triVao = fullscreenTriangle(gl);

    this.pixVao = gl.createVertexArray();
    gl.bindVertexArray(this.pixVao);
    const corner = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, corner);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.partBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.partBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.partData.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(1, 1);
    this.colBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.colData.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(2, 1);
    gl.bindVertexArray(null);

    const lost = (e: Event) => {
      e.preventDefault();
      this.body = null;
    };
    const restored = () => {
      this.initGL();
      this.start();
    };
    this.canvas.addEventListener('webglcontextlost', lost);
    this.canvas.addEventListener('webglcontextrestored', restored);
    this.cleanups.push(() => {
      this.canvas.removeEventListener('webglcontextlost', lost);
      this.canvas.removeEventListener('webglcontextrestored', restored);
    });
  }
}
