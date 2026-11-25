export const clamp = (x, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x))

/** Damped spring integrated with semi-implicit Euler; sub-steps keep stiff springs stable on slow frames. */
export class Spring {
  constructor(x = 0, stiffness = 170, damping = 20) {
    this.x = x
    this.v = 0
    this.target = x
    this.stiffness = stiffness
    this.damping = damping
  }

  step(dt) {
    const n = Math.max(1, Math.ceil(dt / (1 / 120)))
    const h = dt / n
    for (let i = 0; i < n; i++) {
      const a = (this.target - this.x) * this.stiffness - this.v * this.damping
      this.v += a * h
      this.x += this.v * h
    }
    return this.x
  }
}
