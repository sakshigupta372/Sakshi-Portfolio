/**
 * PIP_FRAG — one raymarched figure on a transparent canvas (premultiplied), plus its floor shadow.
 *
 * Body space: every shape rests on y = −1 and is ~2 units wide. World → body: lift off the hop, pivot about the
 * base point, undo the lean (roll about z, pitch about x, yaw about y), undo the squash (sy, with sxz = 1/√sy so the
 * volume holds), then evaluate `shape()` — a blend of two shape ids by `uShapeMix`, so a shape change morphs.
 * Shapes: 0 Bun (dome with a soft flat base), 1 Pebble (wide, low), 2 Cube (soft cube), 3 Drop (gumdrop with a tip).
 *
 * The face is a decal in body space projected along +z (`uv = q.xy`), faded out where the body turns away. Eyes are
 * ellipses (rx, ry·open) that morph into a "^" arc when happy; a highlight sits up-left in each; a small smile and
 * blush show with `uHappy`. Gaze slides the face across the body.
 *
 * Light: key softbox up-left, fill right, rim from behind; wrap diffuse for the soft, slightly translucent look,
 * a warm terminator, AO from the floor and the body's underside, Blinn spec by roughness, and for gloss a mirrored
 * softbox rectangle. Shadow: a soft ellipse on the floor plane (y = −1) that spreads and fades with the hop.
 */
export const PIP_FRAG = /* glsl */ `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uRes;
uniform float uDpr;
uniform vec3 uShape;     // id A, id B, mix
uniform vec3 uLean;      // roll, pitch, yaw (rad)
uniform float uSquash;   // sy
uniform float uHop;      // body lift
uniform vec2 uGaze;      // −1..1
uniform vec4 uEye;       // rx, ry, open, separation
uniform float uEyeY;
uniform float uHappy;
uniform vec3 uAlbedo;
uniform vec3 uEyeCol;
uniform float uRough;
uniform float uGloss;
uniform float uTime;

const float FOV = 0.52;
const vec3 RO = vec3(0.0, 0.42, 6.2);
const vec3 TARGET = vec3(0.0, -0.18, 0.0);

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float smax(float a, float b, float k) { return -smin(-a, -b, k); }
float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}
float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float shape(vec3 p, float id) {
  if (id < 0.5) return smax(sdEllipsoid(p - vec3(0.0, -0.24, 0.0), vec3(1.06, 0.98, 0.98)), -(p.y + 0.985), 0.22);
  if (id < 1.5) return sdEllipsoid(p - vec3(0.0, -0.33, 0.0), vec3(1.16, 0.68, 0.94));
  if (id < 2.5) return sdRoundBox(p - vec3(0.0, -0.12, 0.0), vec3(0.5, 0.5, 0.46), 0.38);
  float body = sdEllipsoid(p - vec3(0.0, -0.32, 0.0), vec3(0.96, 0.7, 0.9));
  return smin(body, length(p - vec3(0.0, 0.5, 0.0)) - 0.14, 0.58);
}

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1, 0, 0, 0, c, s, 0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0, -s, 0, 1, 0, s, 0, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0, -s, c, 0, 0, 0, 1); }

/** World → body space. */
vec3 toBody(vec3 w, out float lip) {
  vec3 p = w - vec3(0.0, uHop - 1.0, 0.0); // pivot at the base
  mat3 R = rotZ(uLean.x) * rotX(uLean.y) * rotY(uLean.z);
  p = transpose(R) * p;
  float sy = uSquash, sxz = inversesqrt(max(sy, 0.2));
  p.y /= sy;
  p.xz /= sxz;
  lip = min(sy, sxz);
  return p + vec3(0.0, -1.0, 0.0);
}
float map(vec3 w) {
  float lip;
  vec3 q = toBody(w, lip);
  float d = mix(shape(q, uShape.x), shape(q, uShape.y), uShape.z);
  return d * lip;
}
vec3 normalAt(vec3 p) {
  const vec2 e = vec2(0.0015, -0.0015);
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}

float sdArcUp(vec2 q, float R, float w) {
  // upper half of a ring: the "^" of a happy eye
  if (q.y < 0.0) return length(vec2(abs(q.x) - R, q.y)) - w;
  return abs(length(q) - R) - w;
}
float sdArcDown(vec2 q, float R, float w) {
  if (q.y > 0.0) return length(vec2(abs(q.x) - R, q.y)) - w;
  return abs(length(q) - R) - w;
}

/** Face decal: rgb premultiplied by coverage, a = coverage. */
vec4 face(vec2 uv, float px) {
  vec2 g = uGaze * vec2(0.17, 0.12);
  vec4 col = vec4(0.0);
  float happy = smoothstep(0.25, 0.75, uHappy);
  // blush
  for (int i = 0; i < 2; i++) {
    vec2 c = vec2(i == 0 ? -1.0 : 1.0, 0.0) * (uEye.w + 0.1) + vec2(0.0, uEyeY - 0.13) + g * 0.85;
    vec2 q = (uv - c) / vec2(0.12, 0.065);
    float b = exp(-dot(q, q) * 1.6) * 0.42 * uHappy;
    col = vec4(mix(col.rgb, vec3(1.0, 0.45, 0.5) * b, b), max(col.a, b));
  }
  float d = 1e3;
  float hl = 1e3;
  for (int i = 0; i < 2; i++) {
    vec2 c = vec2(i == 0 ? -uEye.w : uEye.w, uEyeY) + g;
    vec2 q = uv - c;
    float rx = uEye.x, ry = max(uEye.y * uEye.z, 0.014);
    float de = (length(q / vec2(rx, ry)) - 1.0) * min(rx, ry);
    float closed = sdArcDown(q - vec2(0.0, 0.018), rx * 1.05, 0.014); // asleep: soft downward lid line
    de = mix(closed, de, smoothstep(0.12, 0.3, uEye.z));
    float dh = sdArcUp(q + vec2(0.0, 0.02), max(rx, 0.06) * 1.05, 0.019);
    de = mix(de, dh, happy);
    d = min(d, de);
    float h = length(q - vec2(-0.32 * rx, 0.38 * ry)) - 0.3 * rx;
    hl = min(hl, h + (1.0 - smoothstep(0.45, 0.8, uEye.z)) * 1.0 + happy * 1.0);
  }
  // smile
  float dm = sdArcDown(uv - vec2(0.0, uEyeY - 0.08) - g, 0.055, 0.013);
  d = min(d, mix(1.0, dm, happy));
  float a = 1.0 - smoothstep(-px, px, d);
  col = vec4(mix(col.rgb, uEyeCol * a, a), max(col.a, a));
  float ah = (1.0 - smoothstep(-px, px, hl)) * a;
  col.rgb = mix(col.rgb, vec3(1.0) * col.a, ah * 0.95);
  return col;
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, gl_FragCoord.y) / uDpr;
  vec2 ndc = (frag - uRes * 0.5) / (uRes.y * 0.5);
  vec3 fw = normalize(TARGET - RO);
  vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(fw + (ndc.x * rt + ndc.y * up) * tan(FOV * 0.5));
  float px = 1.6 * tan(FOV * 0.5) * 6.2 / (uRes.y * 0.5);

  // floor shadow (y = −1)
  vec4 outc = vec4(0.0);
  if (rd.y < 0.0) {
    float tf = (-1.0 - RO.y) / rd.y;
    vec3 f = RO + rd * tf;
    float spread = 1.0 + uHop * 0.9;
    vec2 q = f.xz / (vec2(1.15, 0.72) * spread * vec2(1.0 / sqrt(max(uSquash, 0.3)), 1.0));
    float r2 = dot(q, q);
    float sh = (exp(-r2 * 2.4) * 0.3 + exp(-r2 * 9.0) * 0.22) / (1.0 + uHop * 2.2);
    outc = vec4(vec3(0.0), sh);
  }

  // bound the march by a sphere round the figure
  vec3 c = vec3(0.0, -0.15 + uHop, 0.0);
  float R = 1.85;
  vec3 oc = RO - c;
  float b = dot(oc, rd);
  float h = b * b - (dot(oc, oc) - R * R);
  if (h > 0.0) {
    h = sqrt(h);
    float t = max(-b - h, 0.0), tEnd = -b + h;
    bool hit = false;
    for (int i = 0; i < 80; i++) {
      vec3 p = RO + rd * t;
      float d = map(p);
      if (d < 0.0008 * t) {
        hit = true;
        break;
      }
      t += d;
      if (t > tEnd) break;
    }
    if (hit) {
      vec3 p = RO + rd * t;
      vec3 n = normalAt(p);
      float lip;
      vec3 q = toBody(p, lip);
      vec3 base = uAlbedo;
      // face decal (front of the body)
      vec3 nb = normalize(transpose(rotZ(uLean.x) * rotX(uLean.y) * rotY(uLean.z)) * n);
      float front = smoothstep(0.15, 0.45, nb.z);
      vec4 fc = face(q.xy, px);
      base = mix(base, fc.rgb / max(fc.a, 1e-4), fc.a * front);

      vec3 v = -rd;
      vec3 L1 = normalize(vec3(-0.55, 0.85, 0.7)), L2 = normalize(vec3(0.85, 0.25, 0.45)), L3 = normalize(vec3(0.1, 0.6, -0.9));
      float w = 0.45;
      float d1 = max((dot(n, L1) + w) / (1.0 + w), 0.0);
      float d2 = max((dot(n, L2) + w) / (1.0 + w), 0.0);
      float ao = mix(0.55, 1.0, smoothstep(-1.0, -0.55, p.y - uHop * 0.6)) * (0.78 + 0.22 * (0.5 + 0.5 * n.y));
      vec3 col = base * (0.2 + 1.0 * d1 * vec3(1.0, 0.98, 0.95) + 0.35 * d2 * vec3(0.92, 0.95, 1.0)) * ao;
      // warm light bleeding through the terminator (soft, translucent body)
      col += base * vec3(1.0, 0.55, 0.4) * 0.12 * smoothstep(0.55, 0.0, abs(dot(n, L1))) * ao;
      // rim
      float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
      col += vec3(1.0) * fres * (0.1 + 0.5 * max(dot(n, L3), 0.0)) * (1.0 - fc.a * 0.6);
      // specular
      vec3 hv = normalize(L1 + v);
      float shin = mix(180.0, 6.0, uRough);
      float spec = pow(max(dot(n, hv), 0.0), shin) * mix(0.9, 0.12, uRough) * (shin + 2.0) / 60.0;
      col += vec3(1.0) * spec * (1.0 - fc.a * 0.3);
      // gloss: mirrored softbox up-left
      if (uGloss > 0.0) {
        vec3 r = reflect(rd, n);
        vec2 sb = vec2(dot(r, normalize(vec3(1.0, 0.0, 0.6))), r.y);
        float box = smoothstep(0.22, 0.17, abs(sb.x + 0.38)) * smoothstep(0.3, 0.24, abs(sb.y - 0.55));
        col += vec3(1.0) * box * uGloss * (0.45 + 0.55 * fres);
        col += vec3(1.0) * fres * 0.25 * uGloss;
      }
      col = pow(col, vec3(1.0 / 1.08));
      outc = vec4(col, 1.0);
    }
  }
  outColor = outc;
}
`;
