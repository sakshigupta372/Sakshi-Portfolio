import {FULLSCREEN_VERT, fullscreenTriangle, link, uniforms} from '../../lib/gl';
import {Spring, clamp} from '../../lib/motion';
import {prefersReducedMotion, watchVisible} from '../../lib/useNear';
import {COLOURS, EYES, FINISHES, SHAPES} from './content';
import {PIP_FRAG} from './shaders';

const GAZE = {k: 230, d: 24, reach: 520}; // eyes: fast; reach = px from the figure that maps to a full look
const LEAN = {k: 64, d: 8.5, roll: 0.2, pitch: 0.16, yaw: 0.34}; // body follows the eyes, a little late and wobbly
const SQUASH = {k: 280, d: 10, tap: -5.5, land: -3.2};
const HOP = {g: 26, wake: 4.4, tap: 2.2, bounce: 0.28};
const BLINK = {min: 2400, max: 6200, ms: 150};
const SLEEP = {after: 30000, close: 2.2, breathe: 0.022, rate: 0.28}; // ms idle, s to close, squash depth, Hz
const HAPPY_MS = 1300;
const MORPH = {k: 90, d: 15};
const MAX_DPR = 3;

const hex = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export interface PipLook {
  shape: number;
  eyes: number;
  finish: number;
  colour: number;
}

export class PipEngine {
  private root: HTMLElement;
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext | null;
  private prog: WebGLProgram | null = null;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private vao: WebGLVertexArrayObject | null = null;
  private w = 1;
  private h = 1;
  private dpr = 1;

  private gx = new Spring(0, GAZE.k, GAZE.d);
  private gy = new Spring(0, GAZE.k, GAZE.d);
  private roll = new Spring(0, LEAN.k, LEAN.d);
  private pitch = new Spring(0, LEAN.k, LEAN.d);
  private yaw = new Spring(0, LEAN.k, LEAN.d);
  private sq = new Spring(1, SQUASH.k, SQUASH.d);
  private hop = 0;
  private hopV = 0;
  private open = new Spring(1, 420, 30);
  private happy = new Spring(0, 160, 18);
  private morph = new Spring(1, MORPH.k, MORPH.d);
  private shapeA = 0;
  private shapeB = 0;
  private eyeY = new Spring(SHAPES[0].eyeY, MORPH.k, MORPH.d);
  private rx = new Spring(EYES[0].rx, 200, 22);
  private ry = new Spring(EYES[0].ry, 200, 22);
  private sep = new Spring(EYES[0].sep, 200, 22);
  private rough = new Spring(FINISHES[1].rough, 120, 22);
  private gloss = new Spring(FINISHES[1].gloss, 120, 22);
  private col = hex(COLOURS[0].hex);
  private colTarget = hex(COLOURS[0].hex);

  private lastInput = performance.now();
  private nextBlink = performance.now() + 2500;
  private blinkAt = -1e9;
  private happyUntil = -1e9;
  private asleep = false;
  private raf = 0;
  private last = 0;
  private visible = false;
  private reduced = prefersReducedMotion();
  private cleanups: (() => void)[] = [];
  private timer = 0;
  onSleep?: (asleep: boolean) => void;

  constructor(root: HTMLElement, canvas: HTMLCanvasElement, look: PipLook) {
    this.root = root;
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2', {premultipliedAlpha: true, alpha: true, antialias: false});
    this.setLook(look, true);
    if (!this.gl) {
      root.dataset.flat = 'true';
      return;
    }
    this.build();
    const lost = (e: Event) => {
      e.preventDefault();
      this.prog = null;
    };
    const restored = () => {
      this.build();
      this.kick();
    };
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', restored);
    this.cleanups.push(() => {
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', restored);
    });

    const move = (e: PointerEvent) => {
      const r = this.canvas.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height * 0.52;
      // Portfolio change: Pip is small and watches the whole page, so reach is a fixed distance.
      const reach = 420;
      this.gx.target = clamp((e.clientX - cx) / reach, -1, 1);
      this.gy.target = clamp(-(e.clientY - cy) / reach, -1, 1);
      this.input();
    };
    const leave = () => {
      this.gx.target = 0;
      this.gy.target = 0.1;
      this.kick();
    };
    const tap = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('.pp-ui')) return;
      const r = this.canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.55;
      if (x * x + y * y > 0.16) return; // tap on Pip itself
      const wasAsleep = this.asleep;
      this.input();
      if (wasAsleep || this.reduced) return;
      this.sq.v += SQUASH.tap;
      this.hopV = Math.max(this.hopV, HOP.tap);
      this.happyUntil = performance.now() + HAPPY_MS;
      this.happy.target = 1;
    };
    window.addEventListener('pointermove', move, {passive: true});
    document.documentElement.addEventListener('pointerleave', leave);
    root.addEventListener('pointerdown', tap);
    this.cleanups.push(() => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      root.removeEventListener('pointerdown', tap);
    });

    const ro = new ResizeObserver(() => this.resize());
    ro.observe(canvas);
    this.cleanups.push(() => ro.disconnect());
    this.cleanups.push(watchVisible(root, (v) => ((this.visible = v), v && this.kick())));
    this.resize();
  }

  private build() {
    const gl = this.gl!;
    this.prog = link(gl, FULLSCREEN_VERT, PIP_FRAG, ['aPos'], 'pip');
    if (!this.prog) {
      this.root.dataset.flat = 'true';
      return;
    }
    this.u = uniforms(gl, this.prog, ['uRes', 'uDpr', 'uShape', 'uLean', 'uSquash', 'uHop', 'uGaze', 'uEye', 'uEyeY', 'uHappy', 'uAlbedo', 'uEyeCol', 'uRough', 'uGloss', 'uTime']);
    this.vao = fullscreenTriangle(gl);
  }

  setLook(l: PipLook, instant = false) {
    const sh = SHAPES[l.shape];
    if (sh.id !== this.shapeB) {
      // morph from wherever the blend is now
      this.shapeA = this.morph.x > 0.5 ? this.shapeB : this.shapeA;
      this.shapeB = sh.id;
      this.morph.x = instant ? 1 : 0;
      this.morph.v = 0;
      this.morph.target = 1;
      if (!instant && !this.reduced) this.sq.v += -2.2;
    }
    this.eyeY.target = sh.eyeY;
    const e = EYES[l.eyes];
    this.rx.target = e.rx;
    this.ry.target = e.ry;
    this.sep.target = e.sep;
    const f = FINISHES[l.finish];
    this.rough.target = f.rough;
    this.gloss.target = f.gloss;
    this.colTarget = hex(COLOURS[l.colour].hex);
    if (instant) {
      this.col = [...this.colTarget];
      [this.eyeY, this.rx, this.ry, this.sep, this.rough, this.gloss].forEach((s) => (s.x = s.target));
    }
    this.input();
  }

  private input() {
    const now = performance.now();
    if (this.asleep) {
      this.asleep = false;
      this.onSleep?.(false);
      this.open.target = 1;
      if (!this.reduced) {
        this.hopV = HOP.wake;
        this.sq.v += SQUASH.land;
      }
      this.nextBlink = now + 700;
    }
    this.lastInput = now;
    this.kick();
  }

  private resize() {
    const r = this.canvas.getBoundingClientRect();
    this.w = Math.max(1, r.width);
    this.h = Math.max(1, r.height);
    // Portfolio change: the canvas is tiny, so render at twice its size or more to keep the edge smooth.
    this.dpr = Math.min(MAX_DPR, Math.max(2, (window.devicePixelRatio || 1) * 1.5));
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.kick();
  }

  private kick() {
    if (!this.raf && this.visible && this.gl) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  private frame = (now: number) => {
    this.raf = 0;
    const dt = Math.min(1 / 30, Math.max(0, (now - this.last) / 1000));
    this.last = now;

    // sleep
    if (!this.asleep && !this.reduced && now - this.lastInput > SLEEP.after) {
      this.asleep = true;
      this.onSleep?.(true);
      this.gx.target = 0;
      this.gy.target = -0.25;
    }
    if (this.asleep) this.open.target = Math.max(0.04, 1 - (now - this.lastInput - SLEEP.after) / (SLEEP.close * 1000));
    // blink
    if (!this.asleep && !this.reduced && now > this.nextBlink) {
      this.blinkAt = now;
      this.nextBlink = now + BLINK.min + Math.random() * (BLINK.max - BLINK.min);
    }
    const bt = (now - this.blinkAt) / BLINK.ms;
    if (!this.asleep) this.open.target = bt >= 0 && bt < 1 ? 0.06 : 1;
    if (now > this.happyUntil) this.happy.target = 0;

    // body follows the eyes
    this.roll.target = -this.gx.x * LEAN.roll;
    this.pitch.target = -this.gy.x * LEAN.pitch;
    this.yaw.target = this.gx.x * LEAN.yaw;
    const breathe = this.asleep && !this.reduced ? 1 + Math.sin(now / 1000 * Math.PI * 2 * SLEEP.rate) * SLEEP.breathe : 1;
    this.sq.target = breathe;

    // hop
    if (this.hop > 0 || this.hopV > 0) {
      this.hopV -= HOP.g * dt;
      this.hop += this.hopV * dt;
      if (this.hop <= 0) {
        this.hop = 0;
        const impact = -this.hopV;
        this.hopV = impact > 1.2 ? impact * HOP.bounce : 0;
        this.sq.v += SQUASH.land * Math.min(1, impact / 4);
      }
    }
    const springs = [this.gx, this.gy, this.roll, this.pitch, this.yaw, this.sq, this.open, this.happy, this.morph, this.eyeY, this.rx, this.ry, this.sep, this.rough, this.gloss];
    let moving = this.hop > 0 || this.hopV !== 0 || this.asleep;
    for (const s of springs) {
      s.step(dt);
      if (Math.abs(s.x - s.target) > 0.0008 || Math.abs(s.v) > 0.002) moving = true;
    }
    for (let i = 0; i < 3; i++) {
      const d = this.colTarget[i] - this.col[i];
      if (Math.abs(d) > 0.002) {
        this.col[i] += d * Math.min(1, dt * 9);
        moving = true;
      } else this.col[i] = this.colTarget[i];
    }
    if (this.morph.x >= 0.999 && this.morph.target === 1) this.shapeA = this.shapeB;

    this.draw(now);
    clearTimeout(this.timer);
    if (!this.visible) return;
    if (moving) this.raf = requestAnimationFrame(this.frame);
    else {
      // at rest: wake for the next blink or for falling asleep
      const due = Math.min(this.nextBlink, this.lastInput + SLEEP.after) - now;
      this.timer = window.setTimeout(() => this.kick(), Math.max(16, due));
    }
  };

  private draw(now: number) {
    const gl = this.gl;
    if (!gl || !this.prog) return;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.prog);
    gl.bindVertexArray(this.vao);
    const u = this.u;
    gl.uniform2f(u.uRes, this.w, this.h);
    gl.uniform1f(u.uDpr, this.dpr);
    gl.uniform3f(u.uShape, this.shapeA, this.shapeB, clamp(this.morph.x, 0, 1));
    gl.uniform3f(u.uLean, this.roll.x, this.pitch.x, this.yaw.x);
    gl.uniform1f(u.uSquash, clamp(this.sq.x, 0.6, 1.4));
    gl.uniform1f(u.uHop, this.hop);
    gl.uniform2f(u.uGaze, this.gx.x, this.gy.x);
    gl.uniform4f(u.uEye, this.rx.x, this.ry.x, clamp(this.open.x, 0, 1.1), this.sep.x);
    gl.uniform1f(u.uEyeY, this.eyeY.x);
    gl.uniform1f(u.uHappy, clamp(this.happy.x, 0, 1));
    gl.uniform3f(u.uAlbedo, this.col[0], this.col[1], this.col[2]);
    const lum = this.col[0] * 0.3 + this.col[1] * 0.59 + this.col[2] * 0.11;
    if (lum < 0.38) gl.uniform3f(u.uEyeCol, 0.96, 0.94, 0.9);
    else gl.uniform3f(u.uEyeCol, 0.1, 0.09, 0.09);
    gl.uniform1f(u.uRough, this.rough.x);
    gl.uniform1f(u.uGloss, Math.max(0, this.gloss.x));
    gl.uniform1f(u.uTime, (now / 1000) % 600);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.timer);
    this.cleanups.forEach((f) => f());
    if (this.gl && this.prog) this.gl.deleteProgram(this.prog);
  }
}
