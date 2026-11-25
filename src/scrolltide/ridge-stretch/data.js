/* The route: one stage per stop in the career, oldest on the left, and a profile
   function. Heights are only the shape of the ridge; they mean nothing else. */
import { EXPERIENCES } from '../../data/experience.js'

const [blockx, freelance, study] = EXPERIENCES

export const WPS = [
  { km: 0, m: 1050, name: '', kind: 'town' },
  { km: 3.6, m: 1560, name: 'AI & autonomous systems', kind: 'pass' },
  { km: 7, m: 1380, name: 'NSSAFE 2025', sub: 'research presented', kind: 'lake' },
  { km: 10, m: 1760, name: 'Class of 2027', kind: 'hut' },
  { km: 12.8, m: 2180, name: 'Compliledger', sub: 'California', kind: 'pass' },
  { km: 15.4, m: 1900, name: 'Omelo', kind: 'alpe' },
  { km: 17.6, m: 2340, name: 'CoinX', kind: 'pass' },
  { km: 20, m: 2090, name: '4+ clients', kind: 'hut' },
  { km: 22.8, m: 2560, name: 'Agent SDK', kind: 'pass' },
  { km: 25.4, m: 2330, name: 'MCP servers', kind: 'alpe' },
  { km: 27.8, m: 2850, name: 'RAG chatbot', kind: 'pass' },
  { km: 30, m: 2640, name: 'BlockX', kind: 'town' },
]
export const END = WPS[WPS.length - 1].km

export const STAGES = [
  {
    ...study,
    year: '’23',
    short: 'AITR',
    k0: 0,
    k1: 10,
    sky: '#EAF1F8',
    chip: 'In progress',
    stats: [
      { label: 'CGPA', value: 7.4, decimals: 1, unit: '/ 10' },
      { label: 'Graduating', value: 2027, plain: true },
    ],
  },
  {
    ...freelance,
    year: '’24',
    short: 'Freelance',
    k0: 10,
    k1: 20,
    sky: '#F0F0EA',
    chip: 'Ongoing',
    stats: [
      { label: 'Clients', value: 4, suffix: '+', unit: 'international' },
      { label: 'Since', value: 2024, plain: true },
    ],
  },
  {
    ...blockx,
    year: '’25',
    short: 'BlockX',
    k0: 20,
    k1: 30,
    sky: '#FFEDE2',
    stats: [
      { label: 'Duration', value: 6, unit: 'months' },
      { label: 'Shipped', value: 3, unit: 'systems' },
    ],
  },
]

/* ── profile ──────────────────────────────────────────────────── */
// monotone cubic through the waypoints (no overshoot), plus rock texture that is zero at every waypoint
const xs = WPS.map((w) => w.km)
const ys = WPS.map((w) => w.m)
const slopes = (() => {
  const n = xs.length
  const d = xs.slice(0, -1).map((x, i) => (ys[i + 1] - ys[i]) / (xs[i + 1] - x))
  const m = new Array(n).fill(0)
  m[0] = d[0]
  m[n - 1] = d[n - 2]
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = m[i + 1] = 0
      continue
    }
    const a = m[i] / d[i]
    const b = m[i + 1] / d[i]
    const s = a * a + b * b
    if (s > 9) {
      const t = 3 / Math.sqrt(s)
      m[i] = t * a * d[i]
      m[i + 1] = t * b * d[i]
    }
  }
  return m
})()

export function elev(km) {
  const k = Math.min(END, Math.max(0, km))
  let i = 0
  while (i < xs.length - 2 && k > xs[i + 1]) i++
  const h = xs[i + 1] - xs[i]
  const t = (k - xs[i]) / h
  const t2 = t * t
  const t3 = t2 * t
  const base =
    (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * slopes[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * slopes[i + 1]
  const env = Math.sin(Math.PI * t)
  const rock = Math.sin(k * 7.1 + 0.7) * 26 + Math.sin(k * 17.3 + 2.1) * 13 + Math.sin(k * 36 + 4) * 6
  return base + rock * env
}

/** A distant range behind the route, for depth. */
export function farElev(km) {
  const k = km * 2.4
  return 2250 + Math.sin(k / 4.6 + 1.1) * 330 + Math.sin(k / 2.1 + 0.4) * 170 + Math.sin(k / 0.9 + 2.2) * 70
}
