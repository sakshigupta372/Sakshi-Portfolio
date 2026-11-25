/* A patch cable as a verlet rope: gravity, a little bending stiffness, both ends optionally pinned. */

export const N = 24;
const G = 1500; // px/s²
const DAMP = 0.991;
const ITERS = 10;

export type Rope = { x: Float32Array; y: Float32Array; px: Float32Array; py: Float32Array; len: number };

export function makeRope(ax: number, ay: number, len = 10): Rope {
  const x = new Float32Array(N).fill(ax);
  const y = new Float32Array(N);
  for (let i = 0; i < N; i++) y[i] = ay + (i * len) / (N - 1) * 0.2;
  return { x, y, px: Float32Array.from(x), py: Float32Array.from(y), len };
}

/** One fixed step. `b` = null leaves the far end free. `wind` is a tiny sideways force (px/s²). */
export function step(r: Rope, ax: number, ay: number, b: { x: number; y: number } | null, h: number, wind = 0) {
  const { x, y, px, py } = r;
  const gy = G * h * h;
  const gx = wind * h * h;
  for (let i = 1; i < N; i++) {
    const vx = (x[i] - px[i]) * DAMP;
    const vy = (y[i] - py[i]) * DAMP;
    px[i] = x[i];
    py[i] = y[i];
    x[i] += vx + gx;
    y[i] += vy + gy;
  }
  const seg = Math.max(0.01, r.len / (N - 1));
  const last = N - 1;
  for (let k = 0; k < ITERS; k++) {
    x[0] = ax;
    y[0] = ay;
    if (b) {
      x[last] = b.x;
      y[last] = b.y;
    }
    for (let i = 0; i < last; i++) {
      const dx = x[i + 1] - x[i];
      const dy = y[i + 1] - y[i];
      const d = Math.hypot(dx, dy) || 0.0001;
      const diff = (d - seg) / d;
      const pinA = i === 0;
      const pinB = b && i + 1 === last;
      if (pinA && pinB) continue;
      if (pinA) {
        x[i + 1] -= dx * diff;
        y[i + 1] -= dy * diff;
      } else if (pinB) {
        x[i] += dx * diff;
        y[i] += dy * diff;
      } else {
        x[i] += dx * diff * 0.5;
        y[i] += dy * diff * 0.5;
        x[i + 1] -= dx * diff * 0.5;
        y[i + 1] -= dy * diff * 0.5;
      }
    }
    // bending stiffness: keep i and i+2 from folding onto each other
    for (let i = 0; i < last - 1; i++) {
      const dx = x[i + 2] - x[i];
      const dy = y[i + 2] - y[i];
      const d = Math.hypot(dx, dy) || 0.0001;
      const min = seg * 1.82;
      if (d >= min) continue;
      const diff = ((d - min) / d) * 0.25;
      if (i !== 0) {
        x[i] += dx * diff;
        y[i] += dy * diff;
      }
      if (!(b && i + 2 === last)) {
        x[i + 2] -= dx * diff;
        y[i + 2] -= dy * diff;
      }
    }
  }
  x[0] = ax;
  y[0] = ay;
  if (b) {
    x[last] = b.x;
    y[last] = b.y;
  }
}

/** Smooth SVG path through the rope points (quadratic midpoints). */
export function ropePath(r: Rope) {
  const { x, y } = r;
  let d = `M${x[0].toFixed(1)} ${y[0].toFixed(1)}`;
  for (let i = 1; i < N - 1; i++) {
    const mx = (x[i] + x[i + 1]) / 2;
    const my = (y[i] + y[i + 1]) / 2;
    d += `Q${x[i].toFixed(1)} ${y[i].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  return d + `L${x[N - 1].toFixed(1)} ${y[N - 1].toFixed(1)}`;
}

/** Unit direction the cable leaves end `i` (0 or N-1). */
export function endDir(r: Rope, end: 0 | 1) {
  const a = end === 0 ? 0 : N - 1;
  const b = end === 0 ? 3 : N - 4;
  const dx = r.x[b] - r.x[a];
  const dy = r.y[b] - r.y[a];
  const d = Math.hypot(dx, dy) || 1;
  return { x: dx / d, y: dy / d };
}
