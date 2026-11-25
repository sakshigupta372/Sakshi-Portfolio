/**
 * The switch body in one pass over the whole stage (device px, y down): room → recessed track (a rounded rect
 * concentric with the knob, not a pill) → knob shadow →
 * glass knob → neon strip. The strip is the knob's own outline pushed out by a small gap (a rounded rect of
 * radius r + gap), lit only inside an angular window round the knob centre, so it is one smooth line that wraps
 * the corners, tapers at its ends and can travel round the knob. Its light falls on the track and the room
 * (wide bloom) and comes through the glass from that side (inner glow).
 */
export const BODY_FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform vec4 uTrack;   // x, y, w, h
uniform float uTRad;   // track corner radius (concentric with the knob's)
uniform vec4 uKnob;    // centre x, y, half w, half h
uniform float uKRad;   // knob corner radius
uniform float uTheme;  // 0 night … 1 day
uniform float uAng;    // strip centre angle (y down)
uniform float uSpan;   // strip half-span (rad)
uniform float uPx;     // one css px in device px

out vec4 outColor;

vec3 nd(vec3 night, vec3 day) { return mix(night, day, uTheme); }
float nd(float night, float day) { return mix(night, day, uTheme); }
float sdRR(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float px = uPx;
  vec2 tc = uTrack.xy + 0.5 * uTrack.zw;
  vec2 th = 0.5 * uTrack.zw;
  float H = uTrack.w;
  vec3 glow = nd(vec3(0.36, 0.82, 1.0), vec3(1.0, 0.58, 0.24));

  vec2 kc = uKnob.xy;
  vec2 kh = uKnob.zw;
  float kr = uKRad;
  vec2 kp = p - kc;

  // The strip: the knob outline pushed out by a gap, lit inside an angular window that fades at its ends.
  float gap = 0.026 * H;
  float dS = sdRR(kp, kh + gap, kr + gap);
  float ang = atan(kp.y, kp.x);
  float da = abs(atan(sin(ang - uAng), cos(ang - uAng)));
  float win = 1.0 - smoothstep(uSpan * 0.45, uSpan, da);

  // ── Room: lighter round the switch, falling off to the edges. ──
  vec2 uv = (p - tc) / uRes.y;
  vec3 room = nd(vec3(0.078, 0.082, 0.108), vec3(0.865, 0.85, 0.82));
  room *= mix(1.12, 0.72, smoothstep(0.05, 0.95, length(uv * vec2(0.75, 1.0))));
  vec3 col = room;

  // ── Recessed track. ──
  float dT = sdRR(p - tc, th, uTRad);
  // The room surface right round the recess: a dark lip on top, a lit lip below.
  float lipOut = exp(-max(dT, 0.0) / (2.5 * px)) * step(0.0, dT);
  col *= 1.0 - lipOut * nd(0.35, 0.12) * smoothstep(0.3, -0.8, (p.y - tc.y) / th.y);
  col += nd(vec3(0.06), vec3(0.18)) * lipOut * smoothstep(0.2, 0.9, (p.y - tc.y) / th.y);
  if (dT < px) {
    vec3 tr = nd(vec3(0.028, 0.03, 0.04), vec3(0.83, 0.815, 0.79));
    // Inner shadow, deepest under the top edge.
    float dTs = sdRR(p - tc - vec2(0.0, 0.06 * H), th, uTRad);
    float shade = 1.0 - smoothstep(0.0, 0.2 * H, -dTs);
    tr *= 1.0 - shade * nd(0.55, 0.22);
    tr *= 1.0 - (1.0 - smoothstep(0.0, 0.05 * H, -dT)) * nd(0.3, 0.1);
    // Lit lip along the inside of the bottom edge.
    float lip = exp(-abs(dT) / (1.3 * px)) * smoothstep(0.15, 0.8, (p.y - tc.y) / th.y);
    tr += nd(vec3(0.1, 0.11, 0.14), vec3(0.32)) * lip;
    col = mix(col, tr, 1.0 - smoothstep(-0.6 * px, 0.6 * px, dT));
  }

  // ── Light from the strip falling on the track and the room. ──
  float bloom = exp(-abs(dS) / (0.15 * H)) * win;
  col += glow * bloom * nd(0.32, 0.28);
  col += glow * exp(-abs(dS) / (0.045 * H)) * win * nd(0.22, 0.2);

  // ── Knob: soft shadow, then the frosted glass tile. ──
  float dK = sdRR(kp, kh, kr);
  float dKs = sdRR(kp - vec2(0.012 * kh.x, 0.09 * kh.y), kh, kr);
  float ksh = exp(-max(dKs, 0.0) / (0.12 * kh.y)) * nd(0.55, 0.32) * step(0.0, dK);
  col *= 1.0 - ksh;
  if (dK < px) {
    float v = clamp(kp.y / kh.y * 0.5 + 0.5, 0.0, 1.0);   // 0 top … 1 bottom
    vec3 kb = mix(nd(vec3(0.33, 0.35, 0.41), vec3(0.98, 0.975, 0.965)), nd(vec3(0.24, 0.26, 0.31), vec3(0.915, 0.905, 0.885)), v);
    // Frosted sheen from the upper left.
    float sheen = smoothstep(0.7, -0.9, kp.x / kh.x * 0.55 + kp.y / kh.y * 0.85);
    kb += nd(vec3(0.07, 0.075, 0.09), vec3(0.025)) * sheen;
    // Light coming through the glass from the strip's side.
    float inner = exp(dK / (0.3 * kh.y)) * win;
    kb += glow * inner * nd(0.62, 0.42);
    kb = mix(kb, mix(glow, vec3(1.0), 0.5), exp(dK / (0.05 * kh.y)) * win * nd(0.35, 0.3));
    // Crisp edge: a hairline catching the room light (top) and the strip (its side).
    float edge = exp(-abs(dK) / (0.9 * px));
    kb += vec3(1.0) * edge * nd(0.16, 0.45) * smoothstep(0.6, -1.0, kp.y / kh.y);
    kb += glow * edge * win * 0.7;
    // A whisper of grain so the frost isn't plastic.
    kb += (hash(p * 0.5) - 0.5) * nd(0.012, 0.01);
    col = mix(col, kb, 1.0 - smoothstep(-0.7 * px, 0.7 * px, dK));
  }

  // ── The strip itself: hot core over a tight glow, thinner toward its ends. ──
  float w = mix(0.6, 1.5, win) * px;
  float core = (1.0 - smoothstep(w - 0.8 * px, w + 0.8 * px, abs(dS))) * smoothstep(0.0, 0.3, win);
  col += glow * exp(-abs(dS) / (4.0 * px)) * win * 0.75;
  col = mix(col, mix(glow, vec3(1.0), nd(0.62, 0.5)), core);

  outColor = vec4(col + (hash(gl_FragCoord.xy) - 0.5) / 255.0, 1.0);
}
`;

/** One crisp rounded-square pixel per instance (premultiplied), with a soft halo when uGlow > 0. */
export const PIXEL_VERT = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aCorner;   // -1 … 1
layout(location = 1) in vec4 aPart;     // x, y (device px), size (device px), rotation
layout(location = 2) in vec4 aCol;      // rgb, alpha
uniform vec2 uRes;
uniform float uGlow;
out vec2 vUv;
out vec4 vCol;
out float vSize;
void main() {
  float pad = 1.0 + 1.4 * uGlow;
  vec2 c = aCorner * pad;
  float cs = cos(aPart.w), sn = sin(aPart.w);
  vec2 off = mat2(cs, sn, -sn, cs) * (c * 0.5 * aPart.z);
  vec2 pos = aPart.xy + off;
  vUv = c;
  vCol = aCol;
  vSize = aPart.z;
  vec2 clip = pos / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

export const PIXEL_FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
in vec4 vCol;
in float vSize;
uniform float uGlow;
out vec4 outColor;
void main() {
  // Rounded square of half-size 1 in uv, corner radius 0.2.
  vec2 q = abs(vUv) - vec2(0.8);
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.2;
  float aa = 2.0 / max(vSize, 1.0);
  float core = 1.0 - smoothstep(-aa, aa, d);
  float halo = exp(-max(d, 0.0) * 2.4) * uGlow * 0.32;
  float a = clamp(core + halo * (1.0 - core), 0.0, 1.0) * vCol.a;
  outColor = vec4(vCol.rgb * a, a);
}
`;
