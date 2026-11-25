import { useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { motion, useAnimationFrame, useTransform, type MotionValue } from "framer-motion";
import { BEAT, ECHO_FB, MOD_H, envAt, fmtDb, fmtHz, lowpass, rgba, type ModDef } from "./rack";

/* ── the live engine every visual reads from (written by the root, read in rAF) ── */
export type Engine = {
  t0: number;
  pitch: number; // Hz
  note: string;
  decay: number; // ms
  cutoff: number; // Hz (knob)
  level: number; // dB (knob)
  fltIn: boolean; // audio reaching the filter
  cv: boolean; // envelope patched into cutoff
  outSrc: "osc" | "flt" | null;
  reduce: boolean;
};

export function signal(e: Engine, s: number) {
  const t = s - e.t0;
  const env = envAt(t, e.decay);
  const liveCut = e.cv ? Math.min(12000, e.cutoff * Math.pow(2, 2.7 * env)) : e.cutoff;
  const bright = 0.5 + 0.5 * Math.min(1, Math.log(liveCut / 120) / Math.log(66.7));
  const osc = 0.82;
  const flt = (te: number) => (e.fltIn ? osc * (e.cv ? 0.18 + 0.82 * te : 0.8) * bright : 0);
  const fltOut = flt(env);
  const outIn = e.outSrc === "osc" ? osc : e.outSrc === "flt" ? fltOut : 0;
  const gain = Math.pow(10, e.level / 20);
  // a whisper of room echo on the output bus (dotted eighth at 120 BPM)
  let tail = 0;
  if (e.outSrc === "flt" && e.cv) for (let k = 1; k <= 3; k++) tail += flt(envAt(t - k * 0.375, e.decay)) * Math.pow(ECHO_FB, k) * 0.5;
  return { t, env, liveCut, fltOut, out: (outIn + tail) * gain };
}

/* ── a module card: smoked panel that blooms in its own hue when signal arrives ── */
export function ModuleCard({
  def,
  lit,
  pulse,
  x,
  y,
  index,
  children,
}: {
  def: ModDef;
  lit: MotionValue<number>;
  pulse?: MutableRefObject<HTMLDivElement | null>;
  x: number;
  y: number;
  index: number;
  children: ReactNode;
}) {
  const field = useTransform(lit, (v) => 0.1 + 0.9 * v);
  const fieldY = useTransform(lit, (v) => `${(1 - v) * 18}%`);
  const edge = useTransform(lit, (v) => v);
  return (
    <motion.div
      data-qa={`mod-${def.id}`}
      className="absolute overflow-hidden"
      style={{ left: x, top: y, width: def.w, height: MOD_H, borderRadius: 26, background: "#0B0B0E" }}
      initial={{ opacity: 0, y: 26, filter: "blur(10px)", scale: 0.985 }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      transition={{ type: "spring", duration: 0.75, bounce: 0.08, delay: 0.12 + index * 0.075 }}
    >
      {/* the vivid field rising from the bottom edge */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: field,
          y: fieldY,
          background: `radial-gradient(135% 62% at 50% 106%, ${rgba(def.hue, 0.95)} 0%, ${rgba(def.hue, 0.55)} 28%, ${rgba(def.hue, 0.16)} 58%, ${rgba(def.hue, 0)} 78%)`,
        }}
      />
      {/* hot core: brightness follows the signal level */}
      {pulse && <div
        ref={pulse}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%]"
        style={{
          opacity: 0,
          background: `radial-gradient(60% 55% at 50% 100%, ${rgba("#FFFFFF", 0.32)} 0%, ${rgba(def.hue, 0.5)} 35%, ${rgba(def.hue, 0)} 72%)`,
          mixBlendMode: "screen",
        }}
      />}
      {/* sheen + edge light */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0) 26%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ borderRadius: 26, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 0 0 1px rgba(255,255,255,0.055)" }} />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: edge, borderRadius: 26, boxShadow: `inset 0 0 0 1px ${rgba(def.hue, 0.38)}, inset 0 -1px 0 ${rgba("#FFFFFF", 0.35)}` }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}

export function ModHeader({ def, lit, led }: { def: ModDef; lit: MotionValue<number>; led?: MutableRefObject<HTMLSpanElement | null> }) {
  const ledO = useTransform(lit, (v) => 0.25 + 0.75 * v);
  return (
    <div className="absolute inset-x-[18px] top-[17px] flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <motion.span
          ref={led}
          className="relative block size-[7px] rounded-full"
          style={{ opacity: ledO, background: def.hue, boxShadow: `0 0 0 2px ${rgba(def.hue, 0.16)}, 0 0 10px ${rgba(def.hue, 0.9)}` }}
        />
        <span className="font-bricolage text-[15px] font-medium tracking-[-0.01em] text-white/90">{def.name}</span>
      </div>
      <span className="font-jetbrains text-[9.5px] uppercase tracking-[0.16em] text-white/35">
        {def.code} · {def.idx}
      </span>
    </div>
  );
}

/* ── Portfolio change: each module lists real tools; rows brighten when signal reaches it ── */
export function SkillList({ def, lit, caption, skills }: { def: ModDef; lit: MotionValue<number>; caption: string; skills: string[] }) {
  const rows = useTransform(lit, (v) => 0.55 + 0.45 * v);
  return (
    <div className="absolute inset-x-[18px] top-[52px]">
      <p className="font-jetbrains text-[10.5px] tracking-[0.02em] text-white/55">{caption}</p>
      <motion.ul className="mt-4 space-y-[7px]" style={{ opacity: rows }}>
        {skills.map((s) => (
          <li
            key={s}
            className="flex items-center gap-2.5 rounded-[12px] bg-black/30 px-3 py-[9px] font-bricolage text-[14.5px] font-medium tracking-[-0.01em] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]"
          >
            <span aria-hidden className="size-[6px] shrink-0 rounded-full" style={{ background: def.hue, boxShadow: `0 0 8px ${def.hue}` }} />
            {s}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
