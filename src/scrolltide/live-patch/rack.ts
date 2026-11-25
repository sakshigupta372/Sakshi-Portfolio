/* Layout, jacks and the little signal engine behind the rack. Pixel-exact so cables know where every jack is. */

export type ModId = "osc" | "env" | "flt" | "out";
export type JackId = "osc.out" | "env.out" | "flt.in" | "flt.cv" | "flt.out" | "out.in";

export type ModDef = { id: ModId; name: string; code: string; idx: string; w: number; hue: string; deep: string };

export const MODS: ModDef[] = [
  { id: "osc", name: "Models", code: "LLM", idx: "01", w: 256, hue: "#FF6A2A", deep: "#7A2208" },
  { id: "env", name: "Context", code: "RET", idx: "02", w: 216, hue: "#FF3E86", deep: "#6E0B33" },
  { id: "flt", name: "Agents", code: "ORC", idx: "03", w: 288, hue: "#8A5BFF", deep: "#2E1673" },
  { id: "out", name: "Ship", code: "PROD", idx: "04", w: 232, hue: "#27D9B4", deep: "#06574A" },
];

export const PAD_X = 16;
export const GAP = 10;
export const HEAD = 58; // header row
export const RAIL = 20;
export const RAIL_GAP = 6;
export const MOD_H = 476;
export const W = PAD_X * 2 + MODS.reduce((s, m) => s + m.w, 0) + GAP * (MODS.length - 1);
export const MOD_TOP = HEAD + RAIL + RAIL_GAP;
export const H = MOD_TOP + MOD_H + RAIL_GAP + RAIL;
export const JACK_Y = MOD_H - 44; // inside a module

export const MOD_X: Record<ModId, number> = (() => {
  const o = {} as Record<ModId, number>;
  let x = PAD_X;
  for (const m of MODS) {
    o[m.id] = x;
    x += m.w + GAP;
  }
  return o;
})();
export const MOD: Record<ModId, ModDef> = Object.fromEntries(MODS.map((m) => [m.id, m])) as Record<ModId, ModDef>;

export type JackDef = { id: JackId; mod: ModId; kind: "in" | "out"; sig: "audio" | "cv"; label: string; fx: number };
export const JACKS: JackDef[] = [
  { id: "osc.out", mod: "osc", kind: "out", sig: "audio", label: "Out", fx: 0.5 },
  { id: "env.out", mod: "env", kind: "out", sig: "cv", label: "Out", fx: 0.5 },
  { id: "flt.in", mod: "flt", kind: "in", sig: "audio", label: "In", fx: 0.2 },
  { id: "flt.cv", mod: "flt", kind: "in", sig: "cv", label: "Context", fx: 0.5 },
  { id: "flt.out", mod: "flt", kind: "out", sig: "audio", label: "Out", fx: 0.8 },
  { id: "out.in", mod: "out", kind: "in", sig: "audio", label: "In", fx: 0.5 },
];
export const JACK: Record<JackId, JackDef> = Object.fromEntries(JACKS.map((j) => [j.id, j])) as Record<JackId, JackDef>;

/** Jack centre in rack coordinates. */
export const jackPos = (id: JackId) => {
  const j = JACK[id];
  const m = MOD[j.mod];
  return { x: MOD_X[m.id] + Math.round(m.w * j.fx), y: MOD_TOP + JACK_Y };
};
/** Jack centre inside its module. */
export const jackLocal = (id: JackId) => {
  const j = JACK[id];
  return { x: Math.round(MOD[j.mod].w * j.fx), y: JACK_Y };
};

export const canPatch = (from: JackId, to: JackId) => {
  const a = JACK[from];
  const b = JACK[to];
  return a.kind === "out" && b.kind === "in" && a.sig === b.sig && a.mod !== b.mod;
};

/* ── params (knobs are 0..1) ───────────────────────────────────── */
export const NOTE = ["A", "A♯", "B", "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯"];
export const pitchOf = (v: number) => {
  const s = Math.round(v * 48);
  return { hz: 55 * Math.pow(2, s / 12), note: `${NOTE[s % 12]}${1 + Math.floor((s + 9) / 12)}` };
};
export const decayOf = (v: number) => 60 * Math.pow(15, v); // ms
export const cutoffOf = (v: number) => 120 * Math.pow(8000 / 120, v); // Hz
export const levelOf = (v: number) => -30 + 30 * v; // dB

export const DEFAULTS = { pitch: 0.25, decay: Math.log(340 / 60) / Math.log(15), cutoff: Math.log(1200 / 120) / Math.log(8000 / 120), level: 0.8 };

export const BPM = 120;
export const BEAT = 60 / BPM;
export const ECHO_FB = 0.48;

/** Percussive envelope at phase p (s) of a beat. */
export const envAt = (t: number, decayMs: number) => {
  const p = ((t % BEAT) + BEAT) % BEAT;
  const a = 0.008;
  if (p < a) return p / a;
  return Math.exp(-(p - a) / ((decayMs / 1000) * 0.32));
};

/** 24 dB lowpass with resonance: magnitude at f for cutoff fc. */
export const lowpass = (f: number, fc: number, res = 0.62) => {
  const q = 0.707 + res * 3.6;
  const r = f / fc;
  const h1 = 1 / Math.sqrt((1 - r * r) ** 2 + (r / q) ** 2);
  const h2 = 1 / Math.sqrt((1 - r * r) ** 2 + (r / 0.62) ** 2);
  return h1 * h2;
};

export const fmtHz = (hz: number) => (hz >= 1000 ? { n: (hz / 1000).toFixed(2), u: "kHz" } : { n: String(Math.round(hz)), u: "Hz" });
export const fmtDb = (db: number) => (db <= -60 ? "−∞" : `${db < 0 ? "−" : "+"}${Math.abs(db).toFixed(1)}`);

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
