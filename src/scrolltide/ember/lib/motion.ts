export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const easeInOutSine = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;
/** Damped spring integrated with semi-implicit Euler; sub-steps keep stiff springs stable on slow frames. */
export class Spring {
  x: number;
  v = 0;
  target: number;

  constructor(
    x = 0,
    public stiffness = 170,
    public damping = 20,
  ) {
    this.x = x;
    this.target = x;
  }

  step(dt: number) {
    const n = Math.max(1, Math.ceil(dt / (1 / 120)));
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = (this.target - this.x) * this.stiffness - this.v * this.damping;
      this.v += a * h;
      this.x += this.v * h;
    }
    return this.x;
  }
}
