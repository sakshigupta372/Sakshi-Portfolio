/**
 * Pixel icons, as lists of lit cells on a grid centred on 0 (grid units = one pixel pitch).
 * `tone`: 'hi' bright, 'lo' the dim dithered shade, 'star' the twinkling sparkle.
 */
export type Tone = 'hi' | 'lo' | 'star';
export interface Px {
  x: number;
  y: number;
  tone: Tone;
  level: number;
}

/** Night: a crescent whose shadowed side is a dim checkerboard (so the whole disc reads), and a pixel star. */
export function moon(): Px[] {
  const out: Px[] = [];
  const R = 5.6;
  for (let y = -7; y <= 7; y++)
    for (let x = -7; x <= 7; x++) {
      const inDisc = Math.hypot(x + 0.6, y - 0.4) < R;
      if (!inDisc) continue;
      const inShadow = Math.hypot(x - 2.3, y + 2.1) < 4.7;
      if (!inShadow) out.push({x: x - 0.6, y, tone: 'hi', level: 1});
      else if ((x + y) % 2 === 0) out.push({x: x - 0.6, y, tone: 'lo', level: 0.3});
    }
  // Sparkle: a plus with a bright heart, and a couple of loose pixels.
  out.push({x: 5.4, y: -5, tone: 'star', level: 1});
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ])
    out.push({x: 5.4 + dx, y: -5 + dy, tone: 'lo', level: 0.5});
  out.push({x: 2.4, y: -6.4, tone: 'lo', level: 0.42});
  out.push({x: 6.6, y: -1.6, tone: 'lo', level: 0.36});
  return out;
}

/** Day: a solid sun with rounded corners and eight two-pixel rays, the diagonals set a little further out. */
export function sun(): Px[] {
  const out: Px[] = [];
  for (let y = -2; y <= 2; y++)
    for (let x = -2; x <= 2; x++) {
      if (Math.abs(x) === 2 && Math.abs(y) === 2) continue;
      out.push({x, y, tone: 'hi', level: 1});
    }
  const rays: [number, number][] = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];
  for (const [dx, dy] of rays) {
    const diag = dx !== 0 && dy !== 0;
    const r0 = diag ? 3 : 4;
    for (let k = 0; k < 2; k++) out.push({x: dx * (r0 + k), y: dy * (r0 + k), tone: k === 0 ? 'hi' : 'lo', level: k === 0 ? 0.92 : 0.7});
  }
  return out;
}
