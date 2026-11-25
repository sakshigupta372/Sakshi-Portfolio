import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as RKeyboardEvent, type MutableRefObject, type PointerEvent as RPointerEvent } from "react";
import { animate, motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { Unplug } from "lucide-react";
import { AnimatedNumber } from "./kit/AnimatedNumber";
import { BlurSwap } from "./kit/BlurSwap";
import {
  BEAT,
  DEFAULTS,
  H,
  HEAD,
  JACK,
  JACKS,
  MOD,
  MODS,
  MOD_H,
  MOD_TOP,
  MOD_X,
  RAIL,
  RAIL_GAP,
  W,
  canPatch,
  cutoffOf,
  decayOf,
  fmtHz,
  jackPos,
  levelOf,
  pitchOf,
  rgba,
  type JackId,
  type ModId,
} from "./rack";
import { N, endDir, makeRope, ropePath, step, type Rope } from "./rope";
import { ModHeader, ModuleCard, SkillList, signal, type Engine } from "./modules";

/** The wiring shown on arrival: models and context feed the agents, the agents ship. */
const PIPELINE: [JackId, JackId][] = [
  ["osc.out", "flt.in"],
  ["env.out", "flt.cv"],
  ["flt.out", "out.in"],
];

type Mode = "drag" | "armed" | "plugged" | "drop" | "retract";
type Cable = {
  id: number;
  from: JackId;
  to: JackId | null;
  mode: Mode;
  rope: Rope;
  lenTarget: number;
  b: { x: number; y: number };
  magnet: JackId | null;
  seatT: number;
  pulseT: number;
  dropT: number;
  lift: number;
  commit?: number;
};
type Els = {
  shadow?: SVGPathElement | null;
  base?: SVGPathElement | null;
  body?: SVGPathElement | null;
  hi?: SVGPathElement | null;
  flow?: SVGPathElement | null;
  a?: SVGGElement | null;
  aBoot?: SVGGElement | null;
  b?: SVGGElement | null;
  bBoot?: SVGGElement | null;
  bShadow?: SVGEllipseElement | null;
  ring?: SVGCircleElement | null;
};
type Patch = Partial<Record<JackId, JackId>>;
type JackState = "idle" | "can" | "target" | "source" | "dim";

const SRC_HUE: Partial<Record<JackId, ModId>> = { "osc.out": "osc", "env.out": "env", "flt.out": "flt" };
const hueOf = (from: JackId) => MOD[SRC_HUE[from] ?? "osc"].hue;
const deepOf = (from: JackId) => MOD[SRC_HUE[from] ?? "osc"].deep;
const now = () => performance.now() / 1000;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function LivePatch() {
  const reduce = !!useReducedMotion();
  const [params, setParams] = useState(DEFAULTS);
  const [patch, setPatch] = useState<Patch>({}); // physical: plug is in
  const [links, setLinks] = useState<Patch>({}); // electrical: signal has arrived
  const [ids, setIds] = useState<number[]>([]);
  const [held, setHeld] = useState<{ from: JackId } | null>(null);
  const [magnet, setMagnet] = useState<JackId | null>(null);
  const [settled, setSettled] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const cables = useRef(new Map<number, Cable>());
  const els = useRef(new Map<number, Els>());
  const heldId = useRef<number | null>(null);
  const cursor = useRef({ x: W / 2, y: H + 80 });
  const down = useRef({ x: 0, y: 0, t: 0 });
  const nextId = useRef(1);
  const timers = useRef(new Set<number>());
  const patchRef = useRef<Patch>({});
  patchRef.current = patch;

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
    return id;
  }, []);
  useEffect(() => {
    const t = timers.current;
    const s = window.setTimeout(() => setSettled(true), 1800);
    return () => {
      clearTimeout(s);
      t.forEach((id) => clearTimeout(id));
      t.clear();
    };
  }, []);

  /* ── engine ─────────────────────────────────────────────────── */
  const fltIn = links["osc.out"] === "flt.in";
  const cv = links["env.out"] === "flt.cv";
  const outSrc: Engine["outSrc"] = links["flt.out"] === "out.in" ? "flt" : links["osc.out"] === "out.in" ? "osc" : null;
  const active: Record<ModId, boolean> = { osc: true, env: true, flt: fltIn, out: outSrc === "osc" || (outSrc === "flt" && fltIn) };
  const pitch = pitchOf(params.pitch);
  const eng = useRef<Engine>({
    t0: now(),
    pitch: pitch.hz,
    note: pitch.note,
    decay: decayOf(params.decay),
    cutoff: cutoffOf(params.cutoff),
    level: levelOf(params.level),
    fltIn,
    cv,
    outSrc,
    reduce,
  });
  Object.assign(eng.current, {
    pitch: pitch.hz,
    note: pitch.note,
    decay: decayOf(params.decay),
    cutoff: cutoffOf(params.cutoff),
    level: levelOf(params.level),
    fltIn,
    cv,
    outSrc: active.out ? outSrc : null,
    reduce,
  });

  /* ── light: each module blooms when signal reaches it ───────── */
  const litOsc = useMotionValue(0);
  const litEnv = useMotionValue(0);
  const litFlt = useMotionValue(0);
  const litOut = useMotionValue(0);
  const lit: Record<ModId, MotionValue<number>> = { osc: litOsc, env: litEnv, flt: litFlt, out: litOut };
  const first = useRef(true);
  useEffect(() => {
    const boot = first.current;
    first.current = false;
    const cs = (Object.keys(lit) as ModId[]).map((m) => {
      const on = active[m];
      if (on && !boot && lit[m].get() < 0.5) flashT.current[m] = now();
      const delay = boot ? (m === "osc" ? 0.62 : m === "env" ? 0.8 : 0) : 0;
      return animate(lit[m], on ? 1 : 0, on ? { duration: reduce ? 0.2 : 1.0, ease: [0.16, 1, 0.3, 1], delay } : { duration: reduce ? 0.2 : 0.6, ease: [0.4, 0, 0.2, 1] });
    });
    return () => cs.forEach((c) => c.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.osc, active.env, active.flt, active.out, reduce]);

  /* ── cable lifecycle ────────────────────────────────────────── */
  const occupiedBy = (to: JackId) => (Object.keys(patchRef.current) as JackId[]).find((f) => patchRef.current[f] === to) ?? null;
  const cableFrom = (from: JackId) => [...cables.current.values()].find((c) => c.from === from && c.mode !== "retract" && c.mode !== "drop");
  const cableTo = (to: JackId) => [...cables.current.values()].find((c) => c.to === to && c.mode === "plugged");

  const dropLink = (from: JackId) => {
    setPatch((p) => {
      const n = { ...p };
      delete n[from];
      return n;
    });
    setLinks((p) => {
      const n = { ...p };
      delete n[from];
      return n;
    });
  };

  const release = () => {
    heldId.current = null;
    setHeld(null);
    setMagnet(null);
  };

  const plug = (c: Cable, to: JackId) => {
    const A = jackPos(c.from);
    const B = jackPos(to);
    c.mode = "plugged";
    c.to = to;
    c.magnet = null;
    c.lenTarget = Math.hypot(B.x - A.x, B.y - A.y) * 1.03 + 40;
    c.seatT = c.pulseT = now();
    release();
    setPatch((p) => ({ ...p, [c.from]: to }));
    if (c.commit) clearTimeout(c.commit);
    c.commit = later(() => setLinks((p) => ({ ...p, [c.from]: to })), reduce ? 0 : 360);
  };

  const unplug = (c: Cable) => {
    if (c.commit) clearTimeout(c.commit);
    c.mode = "drag";
    c.to = null;
    c.lift = 0.4;
    dropLink(c.from);
  };

  const retract = (c: Cable) => {
    if (c.commit) clearTimeout(c.commit);
    if (c.to) dropLink(c.from);
    c.mode = "retract";
    c.to = null;
    c.magnet = null;
    if (heldId.current === c.id) release();
  };

  const spawn = (from: JackId) => {
    const A = jackPos(from);
    const c: Cable = {
      id: nextId.current++,
      from,
      to: null,
      mode: "drag",
      rope: makeRope(A.x, A.y, 14),
      lenTarget: 14,
      b: { ...A },
      magnet: null,
      seatT: -9,
      pulseT: -9,
      dropT: 0,
      lift: 0,
    };
    cables.current.set(c.id, c);
    setIds((l) => [...l, c.id]);
    return c;
  };

  const grab = (c: Cable) => {
    heldId.current = c.id;
    setHeld({ from: c.from });
    down.current = { ...cursor.current, t: now() };
  };

  const toRack = (cx: number, cy: number) => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return cursor.current;
    const k = W / r.width;
    return { x: (cx - r.left) * k, y: (cy - r.top) * k };
  };

  const findMagnet = (c: Cable) => {
    let best: JackId | null = null;
    let bd = 50;
    for (const j of JACKS) {
      if (!canPatch(c.from, j.id)) continue;
      const occ = occupiedBy(j.id);
      if (occ && occ !== c.from) continue;
      const p = jackPos(j.id);
      const d = Math.hypot(p.x - cursor.current.x, p.y - cursor.current.y);
      if (d < bd) ((bd = d), (best = j.id));
    }
    return best;
  };

  const heldCable = () => (heldId.current != null ? cables.current.get(heldId.current) : undefined);

  const pressJack = (id: JackId) => {
    const h = heldCable();
    if (h && h.mode === "armed") {
      const occ = occupiedBy(id);
      if (canPatch(h.from, id) && (!occ || occ === h.from)) plug(h, id);
      else retract(h);
      return;
    }
    const j = JACK[id];
    let c = j.kind === "out" ? cableFrom(id) : cableTo(id);
    if (c) unplug(c);
    else if (j.kind === "out") c = spawn(id);
    if (c) grab(c);
  };

  const onJackDown = (id: JackId) => (e: RPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    cursor.current = toRack(e.clientX, e.clientY);
    pressJack(id);
  };
  const onJackKey = (id: JackId) => (e: RKeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    const h = heldCable();
    if (!h) {
      const p = jackPos(id);
      cursor.current = { x: p.x + 24, y: p.y + 90 };
    }
    pressJack(id);
    const c = heldCable();
    if (c && c.mode === "drag") c.mode = "armed";
  };

  // pointer moves/ups anywhere while a cable is in hand
  useEffect(() => {
    const move = (e: PointerEvent) => {
      cursor.current = toRack(e.clientX, e.clientY);
      const c = heldCable();
      if (!c) return;
      const m = findMagnet(c);
      if (m !== c.magnet) {
        c.magnet = m;
        setMagnet(m);
      }
    };
    const up = () => {
      const c = heldCable();
      if (!c || c.mode !== "drag") return;
      const moved = Math.hypot(cursor.current.x - down.current.x, cursor.current.y - down.current.y);
      if (moved < 8 && now() - down.current.t < 0.4 && !c.magnet) {
        c.mode = "armed"; // click-to-patch: the plug follows the cursor until the next click
        return;
      }
      if (c.magnet) plug(c, c.magnet);
      else retract(c);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // second click while a plug is armed (anywhere on the catcher layer)
  const onCatcherDown = (e: RPointerEvent<HTMLDivElement>) => {
    const c = heldCable();
    if (!c || c.mode !== "armed") return;
    cursor.current = toRack(e.clientX, e.clientY);
    const m = findMagnet(c);
    if (m) plug(c, m);
    else retract(c);
  };

  const clearAll = () => {
    const list = [...cables.current.values()].filter((c) => c.mode !== "retract" && c.mode !== "drop").sort((a, b) => b.b.x - a.b.x);
    release();
    list.forEach((c, i) =>
      later(() => {
        if (!cables.current.has(c.id)) return;
        if (c.commit) clearTimeout(c.commit);
        if (c.to) dropLink(c.from);
        c.mode = "drop";
        c.to = null;
        c.dropT = now();
        // yank: the plug pops out of its jack
        const r = c.rope;
        r.py[N - 1] = r.y[N - 1] + 7;
        r.px[N - 1] = r.x[N - 1] + (i % 2 ? 2.5 : -2.5);
        r.py[N - 2] = r.y[N - 2] + 4;
      }, i * (reduce ? 0 : 130)),
    );
  };

  /* ── the frame loop: physics + paint ────────────────────────── */
  const cores = useRef<Partial<Record<ModId, HTMLDivElement | null>>>({});
  const beatDots = useRef<(HTMLSpanElement | null)[]>([]);
  const envLed = useRef<HTMLSpanElement | null>(null);
  const flashT = useRef<Partial<Record<ModId, number>>>({});
  const fltNum = useRef<HTMLSpanElement | null>(null);
  const fltUnit = useRef<HTMLSpanElement | null>(null);
  const outNum = useRef<HTMLSpanElement | null>(null);
  const outPeak = useRef<HTMLSpanElement | null>(null);

  useAnimationFrame((_, delta) => {
    const t = now();
    const e = eng.current;
    const sig = signal(e, t);
    const dt = Math.min(delta, 40) / 1000;
    const sub = Math.max(1, Math.ceil(dt / (1 / 120)));
    const hstep = dt / sub;
    const gone: number[] = [];

    for (const c of cables.current.values()) {
      const A = jackPos(c.from);
      const r = c.rope;
      if (c.mode === "drag" || c.mode === "armed") {
        const tgt = c.magnet ? jackPos(c.magnet) : cursor.current;
        const k = 1 - Math.exp(-dt * (c.magnet ? 34 : 22));
        c.b.x += (tgt.x - c.b.x) * k;
        c.b.y += (tgt.y - c.b.y) * k;
        c.lenTarget = Math.max(70, Math.hypot(c.b.x - A.x, c.b.y - A.y) * 1.05 + 44);
        c.lift += (1 - c.lift) * (1 - Math.exp(-dt * 14));
      } else if (c.mode === "plugged" && c.to) {
        const P = jackPos(c.to);
        const k = 1 - Math.exp(-dt * 40);
        c.b.x += (P.x - c.b.x) * k;
        c.b.y += (P.y - c.b.y) * k;
        c.lift = 0;
      } else if (c.mode === "drop") {
        c.lift *= 0.9;
        if (t - c.dropT > 0.36) c.mode = "retract";
      }
      if (c.mode === "retract") c.lenTarget = 0;
      r.len += (c.lenTarget - r.len) * (1 - Math.exp(-dt * (c.mode === "retract" ? 7 : c.mode === "plugged" ? 9 : 15)));
      if (c.mode === "retract") r.len = Math.max(0, r.len - 240 * dt);
      const pinned = c.mode === "drag" || c.mode === "armed" || c.mode === "plugged";
      const wind = reduce ? 0 : Math.sin(t * 0.7 + c.id * 1.9) * 16 + Math.sin(t * 1.9 + c.id) * 6;
      for (let i = 0; i < sub; i++) step(r, A.x, A.y, pinned ? c.b : null, hstep, wind);
      if (!pinned) ((c.b.x = r.x[N - 1]), (c.b.y = r.y[N - 1]));
      if (c.mode === "retract" && r.len < 2) {
        gone.push(c.id);
        continue;
      }

      /* paint */
      const el = els.current.get(c.id);
      if (!el) continue;
      const d = ropePath(r);
      el.shadow?.setAttribute("d", d);
      el.base?.setAttribute("d", d);
      el.body?.setAttribute("d", d);
      el.hi?.setAttribute("d", d);
      el.flow?.setAttribute("d", d);

      const srcLive = c.from === "flt.out" ? e.fltIn : true;
      let dash = "0 1";
      let off = 0;
      let op = 0;
      const since = t - c.pulseT;
      if (c.mode === "plugged" && since < 0.44 && !reduce) {
        const u = since / 0.44;
        const eu = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        dash = "0.2 3";
        off = 0.2 - eu * 1.22;
        op = 1;
      } else if (c.mode === "plugged" && srcLive) {
        if (JACK[c.from].sig === "cv") {
          const p = (((t - e.t0) % BEAT) + BEAT) % BEAT;
          const u = clamp01(p / 0.3);
          dash = "0.13 3";
          off = 0.13 - u * 1.15;
          op = u >= 1 ? 0 : 1;
        } else {
          dash = "0.014 0.07";
          off = -((t * 0.16) % 0.084);
          op = c.from === "flt.out" ? 0.25 + 0.55 * clamp01(sig.fltOut * 1.4) : 0.55;
        }
      }
      if (el.flow) {
        el.flow.setAttribute("stroke-dasharray", dash);
        el.flow.setAttribute("stroke-dashoffset", off.toFixed(4));
        el.flow.style.opacity = op.toFixed(3);
      }

      const da = endDir(r, 0);
      el.a?.setAttribute("transform", `translate(${A.x.toFixed(1)} ${A.y.toFixed(1)})`);
      el.aBoot?.setAttribute("transform", `rotate(${((Math.atan2(da.y, da.x) * 180) / Math.PI).toFixed(1)})`);
      const db = endDir(r, 1);
      let s = 1 + 0.13 * c.lift;
      const ts = t - c.seatT;
      if (c.mode === "plugged" && ts < 0.6) s = ts < 0.07 ? 1.13 - (0.19 * ts) / 0.07 : 1 - 0.06 * Math.exp(-(ts - 0.07) / 0.07) * Math.cos((ts - 0.07) * 32);
      const bx = r.x[N - 1];
      const by = r.y[N - 1];
      const fade = clamp01(r.len / 30);
      if (el.b) {
        el.b.setAttribute("transform", `translate(${bx.toFixed(1)} ${by.toFixed(1)}) scale(${s.toFixed(3)})`);
        el.b.style.opacity = fade.toFixed(3);
      }
      el.bBoot?.setAttribute("transform", `rotate(${((Math.atan2(db.y, db.x) * 180) / Math.PI).toFixed(1)})`);
      if (el.bShadow) {
        el.bShadow.setAttribute("cx", (bx + 3 + 9 * c.lift).toFixed(1));
        el.bShadow.setAttribute("cy", (by + 6 + 16 * c.lift).toFixed(1));
        el.bShadow.setAttribute("rx", (11.5 + 3 * c.lift).toFixed(1));
        el.bShadow.setAttribute("ry", (10 + 3 * c.lift).toFixed(1));
        el.bShadow.style.opacity = ((0.55 - 0.2 * c.lift) * fade).toFixed(3);
      }
      if (el.ring) {
        const u = ts / 0.5;
        if (c.mode === "plugged" && c.to && u < 1) {
          const P = jackPos(c.to);
          el.ring.setAttribute("cx", String(P.x));
          el.ring.setAttribute("cy", String(P.y));
          el.ring.setAttribute("r", (13 + 20 * (1 - Math.pow(1 - u, 3))).toFixed(1));
          el.ring.style.opacity = (0.9 * (1 - u)).toFixed(3);
        } else el.ring.style.opacity = "0";
      }
    }
    if (gone.length) {
      gone.forEach((id) => cables.current.delete(id));
      setIds((l) => l.filter((id) => !gone.includes(id)));
    }

    /* module cores breathe with the signal */
    const set = (m: ModId, v: number) => {
      const el = cores.current[m];
      const f = flashT.current[m];
      const burst = f && !reduce ? 1.1 * Math.exp(-(t - f) / 0.24) : 0;
      if (el) el.style.opacity = clamp01(v + burst).toFixed(3);
    };
    set("osc", lit.osc.get() * (0.32 + 0.04 * Math.sin(t * 2.1)));
    set("env", lit.env.get() * (0.1 + 0.62 * sig.env));
    set("flt", lit.flt.get() * clamp01(sig.fltOut * 1.25));
    set("out", lit.out.get() * clamp01((sig.out - 0.04) * 2.4));
    const b = Math.floor((t - e.t0) / BEAT) % 4;
    const ph = (((t - e.t0) % BEAT) + BEAT) % BEAT;
    beatDots.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = i === b ? String(0.45 + 0.55 * Math.exp(-ph * 9)) : "0.16";
    });
  });

  /* ── Portfolio change: plug in the pipeline, on arrival and on request ── */
  const spawnRef = useRef({ spawn, plug });
  spawnRef.current = { spawn, plug };
  const connect = useCallback(
    (delay: number) => {
      PIPELINE.forEach(([from, to], i) =>
        later(() => {
          const busy = [...cables.current.values()].some((c) => (c.from === from && c.mode !== "retract" && c.mode !== "drop") || (c.to === to && c.mode === "plugged"));
          if (busy || heldId.current != null) return;
          const { spawn, plug } = spawnRef.current;
          plug(spawn(from), to);
        }, delay + i * 320),
      );
    },
    [later],
  );
  useEffect(() => connect(1100), [connect]);

  /* ── derived UI ─────────────────────────────────────────────── */
  const jackState = (id: JackId): JackState => {
    if (!held) return "idle";
    if (id === held.from) return "source";
    const occ = (Object.keys(patch) as JackId[]).find((f) => patch[f] === id);
    if (!canPatch(held.from, id) || (occ && occ !== held.from)) return "dim";
    return magnet === id ? "target" : "can";
  };
  const grabbable = (id: JackId) => JACK[id].kind === "out" || Object.values(patch).includes(id);
  const live = active.out;
  const chain = useMemo(() => {
    const parts: string[] = [];
    if (links["osc.out"] === "out.in") parts.push("Models → Ship");
    if (links["osc.out"] === "flt.in") parts.push(links["flt.out"] === "out.in" ? "Models → Agents → Ship" : "Models → Agents");
    else if (links["flt.out"] === "out.in") parts.push("Agents → Ship");
    if (links["env.out"] === "flt.cv") parts.push("Context → Agents");
    return parts.join("  ·  ");
  }, [links]);
  const anyCable = ids.length > 0;

  const fltNow = fmtHz(cutoffOf(params.cutoff));
  const dur = settled ? 0.28 : 1.1;
  const setP = (k: keyof typeof DEFAULTS) => (v: number) => setParams((p) => ({ ...p, [k]: v }));

  return (
    <div className="relative isolate select-none" style={{ width: W, height: H }}>
      {/* room light: every lit module spills its hue around the rack; louder when the output is live */}
      {MODS.map((m) => (
        <RoomGlow key={m.id} hue={m.hue} x={MOD_X[m.id] + m.w / 2} lit={lit[m.id]} live={litOut} />
      ))}

      <motion.div
        ref={rootRef}
        className="relative"
        style={{ width: W, height: H }}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* header */}
        <motion.header
          className="absolute inset-x-[18px] top-0 flex h-[40px] items-center justify-between"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4">
            <span className="font-bricolage text-[23px] font-semibold leading-none tracking-[-0.035em] text-white">stack</span>
            <span className="h-4 w-px bg-white/[0.12]" />
            <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-white/[0.38]">Patch 01</span>
            <span className="font-bricolage text-[15px] font-medium tracking-[-0.01em] text-white/70">Agent pipeline</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="mr-2 font-jetbrains text-[10px] uppercase tracking-[0.14em] text-white/40">
              <BlurSwap swapKey={chain || "hint"}>{chain || "Drag from any Out jack"}</BlurSwap>
            </span>
            <div className="flex h-8 items-center gap-2.5 rounded-full bg-white/[0.045] px-3 ring-1 ring-white/[0.07]">
              <span className="flex gap-[3px]">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} ref={(el) => void (beatDots.current[i] = el)} className="block size-[5px] rounded-full" style={{ background: i === 0 ? "#fff" : MOD.env.hue, opacity: 0.16 }} />
                ))}
              </span>
              <span className="font-jetbrains text-[10.5px] tracking-[0.06em] text-white/70">16 tools</span>
            </div>
            <div className="flex h-8 w-[84px] items-center gap-2 rounded-full bg-white/[0.045] px-3 ring-1 ring-white/[0.07]">
              <span className="relative flex size-[7px]">
                {live && !reduce && <span className="absolute inset-0 animate-ping rounded-full" style={{ background: MOD.out.hue, opacity: 0.6 }} />}
                <span
                  className="relative block size-[7px] rounded-full transition-all duration-500"
                  style={{ background: live ? MOD.out.hue : "rgba(255,255,255,0.28)", boxShadow: live ? `0 0 10px ${MOD.out.hue}` : "none" }}
                />
              </span>
              <span className="font-jetbrains text-[10.5px] tracking-[0.06em] text-white/80">
                <BlurSwap swapKey={live ? "live" : "silent"}>{live ? "Live" : "Idle"}</BlurSwap>
              </span>
            </div>
            <motion.button
              data-qa="clear"
              type="button"
              onClick={anyCable ? clearAll : () => connect(0)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", duration: 0.2, bounce: 0.2 }}
              className="flex h-8 items-center gap-1.5 rounded-full bg-white/[0.07] pl-2.5 pr-3.5 font-bricolage text-[13px] font-medium text-white/90 ring-1 ring-white/10 outline-none transition-[background-color,opacity,box-shadow] duration-200 hover:bg-white/[0.12] hover:ring-white/20 focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white/[0.07]"
            >
              <Unplug size={14} strokeWidth={1.8} />
              {anyCable ? "Clear patch" : "Reconnect"}
            </motion.button>
          </div>
        </motion.header>

        {/* rails */}
        <Rail y={HEAD} />
        <Rail y={MOD_TOP + MOD_H + RAIL_GAP} />

        {/* modules */}
        <ModuleCard def={MOD.osc} lit={litOsc} x={MOD_X.osc} y={MOD_TOP} index={0}>
          <CoreRef m="osc" cores={cores} hue={MOD.osc.hue} />
          <ModHeader def={MOD.osc} lit={litOsc} />
          <SkillList def={MOD.osc} lit={lit.osc} caption="The brains" skills={["OpenAI API","Groq API","Gemini Vision","Hugging Face","Transformers","NLP"]} />
        </ModuleCard>

        <ModuleCard def={MOD.env} lit={litEnv} x={MOD_X.env} y={MOD_TOP} index={1}>
          <CoreRef m="env" cores={cores} hue={MOD.env.hue} />
          <ModHeader def={MOD.env} lit={litEnv} led={envLed} />
          <SkillList def={MOD.env} lit={lit.env} caption="What they can reach" skills={["MCP","RAG"]} />
        </ModuleCard>

        <ModuleCard def={MOD.flt} lit={litFlt} x={MOD_X.flt} y={MOD_TOP} index={2}>
          <CoreRef m="flt" cores={cores} hue={MOD.flt.hue} />
          <ModHeader def={MOD.flt} lit={litFlt} />
          <SkillList def={MOD.flt} lit={lit.flt} caption="Plan and coordinate" skills={["LangGraph","CrewAI","LangChain","AutoGen","Multi-Agent Systems","Agent Orchestration"]} />
        </ModuleCard>

        <ModuleCard def={MOD.out} lit={litOut} x={MOD_X.out} y={MOD_TOP} index={3}>
          <CoreRef m="out" cores={cores} hue={MOD.out.hue} />
          <ModHeader def={MOD.out} lit={litOut} />
          <SkillList def={MOD.out} lit={lit.out} caption="Out into the world" skills={["Docker","PyPi SDK"]} />
        </ModuleCard>

        {/* jacks */}
        <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
          {JACKS.map((j) => (
            <Jack key={j.id} id={j.id} state={jackState(j.id)} hue={held ? hueOf(held.from) : MOD[j.mod].hue} grabbable={grabbable(j.id)} onDown={onJackDown(j.id)} onKey={onJackKey(j.id)} />
          ))}
        </motion.div>

        {/* cables */}
        <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width={W} height={H} aria-hidden>
          <defs>
            <filter id="lp-cs" x="-20%" y="-20%" width="140%" height="160%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <filter id="lp-ps" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <radialGradient id="lp-metal" cx="0.36" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#F4F4F7" />
              <stop offset="0.38" stopColor="#A4A4AD" />
              <stop offset="0.72" stopColor="#4C4C55" />
              <stop offset="1" stopColor="#25252A" />
            </radialGradient>
            <radialGradient id="lp-cap" cx="0.35" cy="0.28" r="0.75">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.08" />
              <stop offset="1" stopColor="#000000" stopOpacity="0.35" />
            </radialGradient>
          </defs>
          <g filter="url(#lp-cs)" transform="translate(6 13)">
            {ids.map((id) => (
              <path key={id} ref={(el) => void (reg(els, id).shadow = el)} fill="none" stroke="rgba(0,0,0,0.62)" strokeWidth={8} strokeLinecap="round" />
            ))}
          </g>
          {ids.map((id) => {
            const c = cables.current.get(id);
            if (!c) return null;
            const hue = hueOf(c.from);
            const deep = deepOf(c.from);
            return (
              <g key={id}>
                <circle ref={(el) => void (reg(els, id).ring = el)} r={0} fill="none" stroke={hue} strokeWidth={2} style={{ opacity: 0, filter: `drop-shadow(0 0 6px ${hue})` }} />
                <path ref={(el) => void (reg(els, id).base = el)} fill="none" stroke={deep} strokeWidth={7.6} strokeLinecap="round" strokeLinejoin="round" />
                <path ref={(el) => void (reg(els, id).body = el)} fill="none" stroke={hue} strokeWidth={5.4} strokeLinecap="round" strokeLinejoin="round" />
                <path ref={(el) => void (reg(els, id).hi = el)} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.4} strokeLinecap="round" transform="translate(-0.6 -1.5)" />
                <path
                  ref={(el) => void (reg(els, id).flow = el)}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  pathLength={1}
                  style={{ opacity: 0, filter: `drop-shadow(0 0 4px ${hue}) drop-shadow(0 0 2px #fff)` }}
                />
                <Plug refs={(k, el) => void ((reg(els, id) as Record<string, unknown>)[k] = el)} end="a" hue={hue} deep={deep} />
                <ellipse ref={(el) => void (reg(els, id).bShadow = el)} fill="#000" filter="url(#lp-ps)" style={{ opacity: 0 }} />
                <Plug refs={(k, el) => void ((reg(els, id) as Record<string, unknown>)[k] = el)} end="b" hue={hue} deep={deep} />
              </g>
            );
          })}
        </svg>

        {/* while a cable is in hand, the whole rack becomes the catcher (grabbing cursor, second click plugs) */}
        {held && <div className="absolute -inset-[240px] z-40 cursor-grabbing" onPointerDown={onCatcherDown} />}
      </motion.div>
    </div>
  );
}

function reg(m: MutableRefObject<Map<number, Els>>, id: number) {
  let e = m.current.get(id);
  if (!e) m.current.set(id, (e = {}));
  return e;
}

function CoreRef({ m, cores, hue }: { m: ModId; cores: MutableRefObject<Partial<Record<ModId, HTMLDivElement | null>>>; hue: string }) {
  return (
    <div
      ref={(el) => void (cores.current[m] = el)}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
      style={{ opacity: 0, background: `radial-gradient(60% 55% at 50% 100%, rgba(255,255,255,0.3) 0%, ${rgba(hue, 0.5)} 35%, ${rgba(hue, 0)} 72%)`, mixBlendMode: "screen" }}
    />
  );
}

function Plug({ refs, end, hue, deep }: { refs: (k: string, el: SVGGElement | null) => void; end: "a" | "b"; hue: string; deep: string }) {
  return (
    <g ref={(el) => refs(end, el)}>
      <g ref={(el) => refs(end === "a" ? "aBoot" : "bBoot", el)}>
        {/* strain relief leaving the plug along the cable */}
        <path d="M4 -5.4 L19 -3.4 Q21 0 19 3.4 L4 5.4 Z" fill={deep} />
        <path d="M4 -4.4 L18 -2.6 L18 2.6 L4 4.4 Z" fill={hue} opacity={0.85} />
      </g>
      <circle r={11.2} fill="url(#lp-metal)" stroke="rgba(0,0,0,0.55)" strokeWidth={0.8} />
      <circle r={8.6} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={1} />
      <circle r={7.2} fill={hue} />
      <circle r={7.2} fill="url(#lp-cap)" />
      <circle r={2.1} fill="rgba(0,0,0,0.35)" />
    </g>
  );
}

function Rail({ y }: { y: number }) {
  return (
    <motion.div
      aria-hidden
      className="absolute left-[6px] right-[6px] rounded-[7px]"
      style={{
        top: y,
        height: RAIL,
        background: "linear-gradient(180deg, #2A2A2F 0%, #18181B 48%, #101012 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.6), 0 6px 14px -6px rgba(0,0,0,0.8)",
      }}
      initial={{ opacity: 0, scaleX: 0.94 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
    >
      {/* threaded strip */}
      <div
        className="absolute inset-x-[10px] top-1/2 h-[6px] -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle at 5px 3px, #050506 1.5px, rgba(255,255,255,0.07) 2.1px, rgba(0,0,0,0) 2.6px) 0 0 / 10px 6px repeat-x",
          boxShadow: "inset 0 1px 1px rgba(0,0,0,0.5)",
        }}
      />
      {MODS.map((m, i) =>
        [14, m.w - 14].map((dx, k) => (
          <span
            key={`${m.id}${k}`}
            className="absolute top-1/2 size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: MOD_X[m.id] + dx - 6,
              background: "radial-gradient(circle at 35% 30%, #D8D8DE, #7B7B84 45%, #34343A 100%)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.7), inset 0 0 0 0.5px rgba(0,0,0,0.4)",
            }}
          >
            <span className="absolute left-1/2 top-1/2 h-[1.6px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/55" style={{ transform: `translate(-50%,-50%) rotate(${(i * 47 + k * 71) % 180}deg)` }} />
          </span>
        )),
      )}
    </motion.div>
  );
}

function RoomGlow({ hue, x, lit, live }: { hue: string; x: number; lit: MotionValue<number>; live: MotionValue<number> }) {
  const o = useTransform(() => lit.get() * (0.2 + 0.5 * live.get()));
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -z-10 h-[980px] w-[760px] -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: MOD_TOP + MOD_H * 0.62, opacity: o, background: `radial-gradient(closest-side, ${rgba(hue, 0.42)}, ${rgba(hue, 0.12)} 55%, ${rgba(hue, 0)})` }}
    />
  );
}

function Jack({
  id,
  state,
  hue,
  grabbable,
  onDown,
  onKey,
}: {
  id: JackId;
  state: JackState;
  hue: string;
  grabbable: boolean;
  onDown: (e: RPointerEvent<HTMLButtonElement>) => void;
  onKey: (e: RKeyboardEvent<HTMLButtonElement>) => void;
}) {
  const j = JACK[id];
  const P = jackPos(id);
  const can = state === "can";
  const target = state === "target";
  return (
    <motion.button
      type="button"
      data-qa={`jack-${id.replace(".", "-")}`}
      aria-label={`${MOD[j.mod].name} ${j.label} jack`}
      onPointerDown={onDown}
      onKeyDown={onKey}
      animate={{ opacity: state === "dim" ? 0.4 : 1 }}
      transition={{ duration: 0.25 }}
      className="group pointer-events-auto absolute size-[48px] -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/45"
      style={{ left: P.x, top: P.y, cursor: grabbable ? "grab" : "default" }}
    >
      <span
        className="pointer-events-none absolute left-1/2 top-[-9px] -translate-x-1/2 whitespace-nowrap font-jetbrains text-[9px] uppercase tracking-[0.15em] transition-colors duration-200"
        style={{ color: target ? "#fff" : can ? rgba(hue, 0.95) : "rgba(255,255,255,0.45)" }}
      >
        {j.label}
        {j.kind === "out" ? " ↗" : ""}
      </span>
      {/* halo: compatible jacks breathe while a cable is in hand; the target locks on */}
      <motion.span
        className="pointer-events-none absolute inset-[3px] rounded-full"
        animate={{
          opacity: target ? 1 : can ? [0.35, 0.9, 0.35] : 0,
          scale: target ? 1.12 : can ? [0.92, 1.04, 0.92] : 0.85,
        }}
        transition={target || !can ? { type: "spring", duration: 0.25, bounce: 0.3 } : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: `0 0 0 1.5px ${hue}, 0 0 18px ${rgba(hue, target ? 0.9 : 0.5)}`, background: target ? rgba(hue, 0.22) : "transparent" }}
      />
      {/* hex nut */}
      <span
        className="pointer-events-none absolute inset-[9px] transition-[filter] duration-200 group-hover:brightness-125"
        style={{
          clipPath: "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0 50%)",
          background: "linear-gradient(155deg, #8A8A92 0%, #3A3A40 42%, #5A5A62 68%, #1E1E22 100%)",
        }}
      />
      <span
        className="pointer-events-none absolute inset-[12.5px] rounded-full"
        style={{ background: "radial-gradient(circle at 40% 30%, #C9C9D0, #6A6A72 55%, #2C2C31)", boxShadow: "0 1px 1px rgba(0,0,0,0.5)" }}
      />
      {/* the hole: glows faintly in the hue on hover */}
      <span
        className="pointer-events-none absolute inset-[17px] rounded-full transition-shadow duration-200"
        style={{
          background: "radial-gradient(circle at 50% 60%, #000 0%, #050506 60%, #121215 100%)",
          boxShadow: target || can ? `inset 0 0 6px ${rgba(hue, 0.9)}` : "inset 0 1.5px 2px rgba(0,0,0,0.9)",
        }}
      />
      <span
        className="pointer-events-none absolute inset-[17px] rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 7px ${rgba(MOD[j.mod].hue, 0.85)}` }}
      />
    </motion.button>
  );
}

