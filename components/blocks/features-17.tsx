"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const OFFICES = [
  {
    city: "Manila, Philippines",
    company: "DXC Technology",
    detail:
      "Collaborated with cross-functional teams to develop business dashboards and automation solutions.",
  },
  {
    city: "Toronto, Canada",
    company: "Canadian Imperial Bank of Commerce (CIBC)",
    detail:
      "Developed the PDR (Project Data Repository) dashboard, a centralized solution for managing and monitoring the collection of servers.",
  },
  {
    city: "Perth, Australia",
    company: "Travel and Sports Australia (TASA)",
    detail:
      "Developed a cloud-based web application called GemX to modernize and streamline travel booking operations. ",
  },
];

const WARM = "#ff8a3d";
const COOL = "#3d7bff";
const BASE_RADIUS = 3.4;
const CYCLE = 4200;

interface Horizon {
  setSun: (index: number) => void;
  destroy: () => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const hexToRgb = (hex: string): [number, number, number] => {
  const value = Number.parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
};

const toLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const toGamma = (c: number) =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

const toOklab = ([r, g, b]: [number, number, number]) => {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const fromOklab = ([L, A, B]: number[]): [number, number, number] => {
  const l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3);
  const m = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3);
  const s = Math.pow(L - 0.0894841775 * A - 1.291485548 * B, 3);
  return [
    clamp(
      toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
      0,
      1,
    ),
    clamp(
      toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
      0,
      1,
    ),
    clamp(
      toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
      0,
      1,
    ),
  ];
};

const mixLab = (a: number[], b: number[], t: number) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const passVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const sceneFragment = `
uniform vec2 uRes;
uniform float uTime;
uniform float uRoll;
uniform float uApex;
uniform float uRadius;
uniform float uSunArc;
uniform float uSpread;
uniform float uSunUp;
uniform float uAtmo;
uniform float uThick;
uniform float uRimGain;
uniform float uFlare;
uniform float uAirglow;
uniform float uClouds;
uniform float uStars;
uniform float uInk;
uniform vec3 uRimColor;
uniform vec3 uInner;
uniform vec3 uMid;
uniform vec3 uOuter;
uniform vec3 uGlowColor;
uniform vec3 uSunColor;
uniform vec3 uStarColor;
varying vec2 vUv;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 starField(vec2 p) {
  vec3 c = vec3(0.0);
  for (int k = 0; k < 2; k++) {
    float scale = k == 0 ? 70.0 : 130.0;
    vec2 g = p * scale + float(k) * 17.3;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash(id);
    vec2 offset = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
    float twinkle = 0.6 + 0.4 * sin(uTime * (1.0 + 3.0 * hash(id + 1.3)) + h * 50.0);
    float b = pow(h, 30.0) * twinkle;
    float d = length(f - offset * 0.7);
    c += uStarColor * b * exp(-d * d * 300.0) * (k == 0 ? 0.9 : 0.45);
  }
  return c;
}

void main() {
  vec2 frag = vUv * uRes;
  vec2 screen = (frag - 0.5 * uRes) / uRes.y;
  float cr = cos(uRoll);
  float sr = sin(uRoll);
  vec2 p = mat2(cr, -sr, sr, cr) * screen;
  float px = 1.0 / uRes.y;
  vec2 center = vec2(0.0, uApex - uRadius);
  vec2 q = p - center;
  float h = length(q) - uRadius;
  float arc = atan(q.x, q.y) * uRadius;
  float d = arc - uSunArc;
  float lit = exp(-d * d / (2.0 * uSpread * uSpread));
  float wide = exp(-d * d / (10.0 * uSpread * uSpread));
  float hot = exp(-d * d / (2.0 * 0.034 * 0.034));
  float halo = exp(-d * d / (2.0 * 0.17 * 0.17));
  float thick = uThick;
  float sunk = 1.0 - 0.8 * uInk;
  vec3 col = vec3(0.0);
  if (h > 0.0) {
    float rim = exp(-h / max(0.0012, px * 0.9));
    float inner = exp(-h / (0.007 * thick));
    float mid = exp(-h / (0.024 * thick));
    float outer = exp(-h / (0.07 * thick));
    col += lit * (rim * uRimColor * 2.2 * uRimGain + inner * uInner * 0.7 * uAtmo);
    col += wide * (mid * uMid * 0.2 + outer * uOuter * 0.055) * uAtmo;
    float layer = h - 0.042 * thick;
    float band = exp(-layer * layer / (0.00005 * thick * thick));
    if (uAirglow > 0.0 && band > 0.0001) {
      band *= 0.35 + 0.65 * fbm(vec2(arc * 9.0 - uTime * 0.04, uTime * 0.02));
      col += band * uGlowColor * 0.05 * (0.2 + 0.8 * wide) * uAirglow;
    }
    col += sunk * hot * uSunUp * (exp(-h / 0.003) * uSunColor * 4.0 + exp(-h / (0.016 * thick)) * uInner * 0.7);
    col += halo * uSunUp * (exp(-h / (0.045 * thick)) * uInner * 0.2 + exp(-h / (0.12 * thick)) * uMid * 0.06) * uAtmo;
    if (uStars > 0.0 && uInk < 0.5) col += starField(p) * smoothstep(0.04, 0.2, h) * (1.0 - 0.8 * wide) * uStars;
  } else {
    col += lit * exp(h / max(0.0008, px * 0.6)) * uRimColor * 1.1 * uRimGain;
    col += sunk * hot * uSunUp * exp(h / 0.005) * uMid * 0.3;
    if (uClouds > 0.0 && h > -0.12) {
      float tops = fbm(vec2(arc * 22.0 + uTime * 0.01, h * 160.0 + arc * 6.0));
      float catchLight = smoothstep(0.52, 0.78, tops) * exp(h / 0.018) * smoothstep(-0.12, -0.07, h) * lit;
      col += catchLight * mix(uMid, uInner, halo) * 0.14 * uClouds * uSunUp;
    }
  }
  vec2 sun = center + uRadius * vec2(sin(uSunArc / uRadius), cos(uSunArc / uRadius));
  float rs = length(p - sun);
  float crest = smoothstep(-0.0015, 0.0015, h);
  col += uSunUp * uSunUp * uFlare * sunk * (exp(-rs / 0.005) * uSunColor * 2.0 * crest + exp(-rs / 0.05) * uInner * 0.07);
  if (uInk > 0.5) {
    float peak = max(col.r, max(col.g, col.b));
    float alpha = 1.0 - exp(-peak * 1.5);
    float body = (1.0 - smoothstep(-0.002, 0.0, h)) * 0.05;
    vec3 tint = col / max(peak, 0.0001);
    gl_FragColor = vec4(tint * alpha + vec3(0.32) * body * (1.0 - alpha), alpha + body * (1.0 - alpha));
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

const downFragment = `
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uThreshold;
varying vec2 vUv;
vec3 tap(vec2 d) {
  vec3 c = texture2D(uSource, vUv + d * uTexel).rgb;
  float peak = max(c.r, max(c.g, c.b));
  return c * (max(peak - uThreshold, 0.0) / max(peak, 0.0001));
}
void main() {
  vec3 a = tap(vec2(-2.0, 2.0));
  vec3 b = tap(vec2(0.0, 2.0));
  vec3 c = tap(vec2(2.0, 2.0));
  vec3 d = tap(vec2(-2.0, 0.0));
  vec3 e = tap(vec2(0.0, 0.0));
  vec3 f = tap(vec2(2.0, 0.0));
  vec3 g = tap(vec2(-2.0, -2.0));
  vec3 h = tap(vec2(0.0, -2.0));
  vec3 i = tap(vec2(2.0, -2.0));
  vec3 j = tap(vec2(-1.0, 1.0));
  vec3 k = tap(vec2(1.0, 1.0));
  vec3 l = tap(vec2(-1.0, -1.0));
  vec3 m = tap(vec2(1.0, -1.0));
  vec3 color = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
  gl_FragColor = vec4(color, 1.0);
}
`;

const upFragment = `
uniform sampler2D uSource;
uniform vec2 uTexel;
varying vec2 vUv;
vec3 tap(vec2 d) { return texture2D(uSource, vUv + d * uTexel).rgb; }
void main() {
  vec3 color = tap(vec2(0.0)) * 4.0
    + (tap(vec2(-1.0, 0.0)) + tap(vec2(1.0, 0.0)) + tap(vec2(0.0, -1.0)) + tap(vec2(0.0, 1.0))) * 2.0
    + tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0)) + tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0));
  gl_FragColor = vec4(color / 16.0, 1.0);
}
`;

const compositeFragment = `
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform vec3 uBackground;
uniform vec2 uResolution;
uniform float uBloomStrength;
uniform float uGrain;
uniform float uTime;
uniform float uInk;
varying vec2 vUv;

vec3 neutral(vec3 color) {
  const float start = 0.76;
  const float desaturation = 0.15;
  float x = min(color.r, min(color.g, color.b));
  float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
  color -= offset;
  float peak = max(color.r, max(color.g, color.b));
  if (peak < start) return color;
  const float d = 1.0 - start;
  float next = 1.0 - d * d / (peak + d - start);
  color *= next / peak;
  float g = 1.0 - 1.0 / (desaturation * (peak - next) + 1.0);
  return mix(color, vec3(next), g);
}

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  float n = hash(gl_FragCoord.xy + fract(uTime * 13.0) * 911.0) - 0.5;
  if (uInk > 0.5) {
    vec4 scene = texture2D(uScene, vUv);
    float cover = clamp(scene.a, 0.0, 1.0);
    vec3 ink = scene.rgb / max(scene.a, 0.0001);
    vec3 color = mix(uBackground, ink, cover);
    color += n * uGrain * 0.05 * smoothstep(0.0, 0.05, cover);
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    return;
  }
  vec2 c = vUv - 0.5;
  vec2 shift = c * 1.2 / uResolution.y;
  vec3 emission;
  emission.r = texture2D(uScene, vUv + shift).r;
  emission.g = texture2D(uScene, vUv).g;
  emission.b = texture2D(uScene, vUv - shift).b;
  emission += texture2D(uBloom, vUv).rgb * uBloomStrength;
  vec3 light = neutral(max(emission, 0.0));
  light = pow(light, vec3(1.0 / 2.2));
  vec3 color = 1.0 - (1.0 - uBackground) * (1.0 - light);
  float l = max(light.r, max(light.g, light.b));
  float mask = smoothstep(0.0, 0.04, l);
  color += n * uGrain * 0.1 * mask;
  color += (hash(gl_FragCoord.xy * 1.7) - 0.5) / 255.0 * mask;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

function createHorizon(
  root: HTMLElement,
  anchor: HTMLElement,
  columns: (HTMLElement | null)[],
  initial: number,
): Horizon | null {
  const doc = root.ownerDocument;
  const view = doc.defaultView ?? window;
  const canvas = doc.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:absolute;inset:0;z-index:-1;width:100%;height:100%;display:block;pointer-events:none";
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }
  root.prepend(canvas);
  renderer.autoClear = false;

  const motionQuery = view.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = motionQuery.matches;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  const quadGeometry = new THREE.PlaneGeometry(2, 2);
  const quadScene = new THREE.Scene();
  const quad = new THREE.Mesh(quadGeometry);
  quad.frustumCulled = false;
  quadScene.add(quad);

  const colorUniform = () => ({ value: new THREE.Vector3(1, 1, 1) });
  const sceneMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uRoll: { value: 0 },
      uApex: { value: -0.22 },
      uRadius: { value: BASE_RADIUS },
      uSunArc: { value: 0 },
      uSpread: { value: 0.3 },
      uSunUp: { value: 1 },
      uAtmo: { value: 1 },
      uThick: { value: 1 },
      uRimGain: { value: 1 },
      uFlare: { value: 1 },
      uAirglow: { value: 0.5 },
      uClouds: { value: 0.6 },
      uStars: { value: 0.35 },
      uInk: { value: 0 },
      uRimColor: colorUniform(),
      uInner: colorUniform(),
      uMid: colorUniform(),
      uOuter: colorUniform(),
      uGlowColor: colorUniform(),
      uSunColor: colorUniform(),
      uStarColor: colorUniform(),
    },
    vertexShader: passVertex,
    fragmentShader: sceneFragment,
    depthTest: false,
    depthWrite: false,
  });

  const target = () =>
    new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      generateMipmaps: false,
    });
  const sceneTarget = target();
  const bloomTargets = Array.from({ length: 5 }, target);
  const background = new THREE.Vector3(0.04, 0.04, 0.04);
  const downMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uSource: { value: null },
      uTexel: { value: new THREE.Vector2() },
      uThreshold: { value: 0 },
    },
    vertexShader: passVertex,
    fragmentShader: downFragment,
    depthTest: false,
    depthWrite: false,
  });
  const upMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uSource: { value: null },
      uTexel: { value: new THREE.Vector2() },
    },
    vertexShader: passVertex,
    fragmentShader: upFragment,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const compositeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uScene: { value: sceneTarget.texture },
      uBloom: { value: bloomTargets[0].texture },
      uBackground: { value: background },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uBloomStrength: { value: 0.5 },
      uGrain: { value: 0.2 },
      uTime: { value: 0 },
      uInk: { value: 0 },
    },
    vertexShader: passVertex,
    fragmentShader: compositeFragment,
    depthTest: false,
    depthWrite: false,
  });

  const probe = doc
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true });
  let width = 0;
  let height = 0;
  let dpr = 1;
  let colorKey = "";
  let ink = false;
  let time = 0;
  let introStart = -1;
  let rise = reduced ? 1 : 0;
  let apex = -0.3;
  let stops = [0.2, 0.5, 0.8];
  let index = initial;
  let sunX = 0;
  let placed = false;
  let raf = 0;
  let last = 0;
  let visible = false;
  let destroyed = false;
  let lost = false;

  const setColor = (name: string, rgb: [number, number, number]) => {
    const value = sceneMaterial.uniforms[name].value as THREE.Vector3;
    if (ink) value.set(rgb[0], rgb[1], rgb[2]);
    else value.set(toLinear(rgb[0]), toLinear(rgb[1]), toLinear(rgb[2]));
  };

  const syncColors = () => {
    if (!probe) return false;
    let node: HTMLElement | null = root;
    let fill = "rgba(0, 0, 0, 0)";
    while (node) {
      const value = view.getComputedStyle(node).backgroundColor;
      if (!/rgba?\(\s*0,\s*0,\s*0,\s*0\s*\)|transparent/.test(value)) {
        fill = value;
        break;
      }
      node = node.parentElement;
    }
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = "#0a0a0a";
    probe.fillStyle = fill;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
    const key = `${r},${g},${b}`;
    if (key === colorKey) return false;
    colorKey = key;
    const page = [r / 255, g / 255, b / 255];
    ink = 0.2126 * page[0] + 0.7152 * page[1] + 0.0722 * page[2] > 0.55;
    background.set(page[0], page[1], page[2]);
    const warm = toOklab(hexToRgb(WARM));
    const cool = toOklab(hexToRgb(COOL));
    const chromaOf = (lab: number[]) => Math.hypot(lab[1], lab[2]);
    const inkOf = (lab: number[], lightness: number) => {
      const chroma = chromaOf(lab);
      if (chroma < 0.02) return [lightness * 0.8, 0, 0];
      const scale = Math.max(1, 0.15 / chroma);
      return [lightness, lab[1] * scale, lab[2] * scale];
    };
    const mid = mixLab(warm, cool, 0.55);
    const glow = mixLab(warm, cool, 0.35);
    const lighten = (lab: number[], lightness: number, keep: number) => [
      Math.max(lab[0], lightness),
      lab[1] * keep,
      lab[2] * keep,
    ];
    if (ink) {
      setColor("uRimColor", fromOklab(inkOf(mixLab(warm, cool, 0.7), 0.42)));
      setColor("uInner", fromOklab(inkOf(warm, 0.62)));
      setColor("uMid", fromOklab(inkOf(mid, 0.55)));
      setColor("uOuter", fromOklab(inkOf(cool, 0.5)));
      setColor("uGlowColor", fromOklab(inkOf(glow, 0.58)));
      setColor("uSunColor", fromOklab(inkOf(mixLab(warm, cool, 0.5), 0.48)));
      setColor("uStarColor", fromOklab(inkOf(cool, 0.5)));
    } else {
      setColor("uRimColor", fromOklab(lighten(warm, 0.96, 0.22)));
      setColor("uInner", fromOklab(warm));
      setColor("uMid", fromOklab(mid));
      setColor("uOuter", fromOklab(cool));
      setColor("uGlowColor", fromOklab(lighten(glow, 0.78, 0.7)));
      setColor("uSunColor", fromOklab(lighten(warm, 0.98, 0.12)));
      setColor("uStarColor", fromOklab(lighten(cool, 0.93, 0.15)));
    }
    sceneMaterial.uniforms.uInk.value = ink ? 1 : 0;
    sceneMaterial.blending = ink ? THREE.NoBlending : THREE.NormalBlending;
    compositeMaterial.uniforms.uInk.value = ink ? 1 : 0;
    return true;
  };

  const radius = () =>
    BASE_RADIUS * clamp(width / Math.max(height, 1) / 1.6, 0.42, 1.8);

  const measure = () => {
    const box = root.getBoundingClientRect();
    const top = anchor.getBoundingClientRect().top - box.top;
    apex =
      0.5 - (top + Math.min(32, box.height * 0.04)) / Math.max(box.height, 1);
    stops = columns.map((column, i) => {
      if (!column) return [0.2, 0.5, 0.8][i];
      const rect = column.getBoundingClientRect();
      return (rect.left + rect.width / 2 - box.left) / Math.max(box.width, 1);
    });
    const spread = Math.max(...stops) - Math.min(...stops);
    if (spread < 0.1) stops = [0.24, 0.5, 0.76];
  };

  const resize = () => {
    const nextWidth = Math.round(root.clientWidth);
    const nextHeight = Math.round(root.clientHeight);
    if (nextWidth < 2 || nextHeight < 2) return false;
    const nextDpr = Math.min(view.devicePixelRatio || 1, 2);
    measure();
    if (nextWidth === width && nextHeight === height && nextDpr === dpr)
      return true;
    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    const deviceW = Math.round(width * dpr);
    const deviceH = Math.round(height * dpr);
    sceneTarget.setSize(deviceW, deviceH);
    let w = deviceW;
    let h = deviceH;
    for (const bloomTarget of bloomTargets) {
      w = Math.max(1, Math.round(w / 2));
      h = Math.max(1, Math.round(h / 2));
      bloomTarget.setSize(w, h);
    }
    sceneMaterial.uniforms.uRes.value.set(deviceW, deviceH);
    compositeMaterial.uniforms.uResolution.value.set(deviceW, deviceH);
    return true;
  };

  const goalX = () => (stops[index] - 0.5) * (width / Math.max(height, 1));

  const render = () => {
    if (!width) return;
    const r = radius();
    const travel = Math.abs(goalX() - sunX);
    const u = sceneMaterial.uniforms;
    u.uTime.value = time;
    u.uApex.value = apex;
    u.uRadius.value = r;
    u.uSunArc.value = Math.asin(clamp(sunX / r, -0.99, 0.99)) * r;
    u.uSpread.value = 0.05 + 0.25 * (0.15 + 0.85 * rise);
    u.uSunUp.value =
      (0.12 + 0.88 * rise) * (1 - 0.6 * Math.min(travel / 0.18, 1));
    compositeMaterial.uniforms.uTime.value = time;
    quad.material = sceneMaterial;
    renderer.setRenderTarget(sceneTarget);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(quadScene, camera);
    const bloom = ink ? 0 : 0.5;
    if (bloom > 0) {
      let source: THREE.WebGLRenderTarget = sceneTarget;
      quad.material = downMaterial;
      for (const bloomTarget of bloomTargets) {
        downMaterial.uniforms.uThreshold.value =
          source === sceneTarget ? 0.45 : 0;
        downMaterial.uniforms.uSource.value = source.texture;
        downMaterial.uniforms.uTexel.value.set(
          1 / source.width,
          1 / source.height,
        );
        renderer.setRenderTarget(bloomTarget);
        renderer.render(quadScene, camera);
        source = bloomTarget;
      }
      quad.material = upMaterial;
      for (let i = bloomTargets.length - 1; i > 0; i--) {
        upMaterial.uniforms.uSource.value = bloomTargets[i].texture;
        upMaterial.uniforms.uTexel.value.set(
          1 / bloomTargets[i].width,
          1 / bloomTargets[i].height,
        );
        renderer.setRenderTarget(bloomTargets[i - 1]);
        renderer.render(quadScene, camera);
      }
    }
    compositeMaterial.uniforms.uBloomStrength.value = bloom;
    quad.material = compositeMaterial;
    renderer.setRenderTarget(null);
    renderer.render(quadScene, camera);
  };

  const schedule = () => {
    if (destroyed || lost || !visible || raf) return;
    raf = view.requestAnimationFrame(tick);
  };

  function tick(now: number) {
    raf = 0;
    if (destroyed || lost) return;
    const dt =
      last && now - last < 100 ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    if (!width) resize();
    if (!width) return;
    if (!placed) {
      sunX = goalX();
      placed = true;
    }
    if (!reduced) {
      time += dt * 0.5;
      if (introStart < 0) introStart = now;
      const progress = clamp((now - introStart) / 3200, 0, 1);
      rise = progress * progress * (3 - 2 * progress);
    } else {
      rise = 1;
    }
    sunX += (goalX() - sunX) * (reduced ? 1 : 1 - Math.exp(-dt / 0.42));
    render();
    const settling = Math.abs(goalX() - sunX) > 0.0005 || rise < 1;
    if (!reduced || settling) schedule();
    else last = 0;
  }

  const refresh = () => {
    if (syncColors()) {
      if (!raf && visible) render();
      schedule();
    }
  };

  const onMotion = () => {
    reduced = motionQuery.matches;
    last = 0;
    schedule();
  };

  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    view.cancelAnimationFrame(raf);
    raf = 0;
  };

  const onRestored = () => {
    lost = false;
    colorKey = "";
    syncColors();
    schedule();
  };

  const resizeObserver = new ResizeObserver(() => {
    if (resize()) {
      if (!raf && visible) render();
      schedule();
    }
  });
  const intersection = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      last = 0;
      schedule();
    },
    { rootMargin: "120px" },
  );
  const themes = new MutationObserver(refresh);
  const scheme = view.matchMedia("(prefers-color-scheme: dark)");
  themes.observe(doc.documentElement, {
    attributes: true,
    attributeFilter: ["class", "style", "data-theme"],
  });
  scheme.addEventListener("change", refresh);
  motionQuery.addEventListener("change", onMotion);
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);
  resizeObserver.observe(root);
  resizeObserver.observe(anchor);
  columns.forEach((column) => column && resizeObserver.observe(column));
  intersection.observe(root);
  syncColors();
  resize();

  return {
    setSun: (next: number) => {
      index = clamp(next, 0, stops.length - 1);
      schedule();
    },
    destroy: () => {
      destroyed = true;
      view.cancelAnimationFrame(raf);
      themes.disconnect();
      resizeObserver.disconnect();
      intersection.disconnect();
      scheme.removeEventListener("change", refresh);
      motionQuery.removeEventListener("change", onMotion);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      sceneTarget.dispose();
      bloomTargets.forEach((item) => item.dispose());
      [sceneMaterial, downMaterial, upMaterial, compositeMaterial].forEach(
        (item) => item.dispose(),
      );
      quadGeometry.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}

const sequence: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Features17() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<(HTMLLIElement | null)[]>([]);
  const horizonRef = useRef<Horizon | null>(null);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const anchor = anchorRef.current;
    if (!section || !anchor) return;
    const horizon = createHorizon(section, anchor, columnsRef.current, 0);
    horizonRef.current = horizon;
    return () => {
      horizon?.destroy();
      horizonRef.current = null;
    };
  }, []);

  useEffect(() => {
    horizonRef.current?.setSun(active);
  }, [active]);

  useEffect(() => {
    if (held || reduceMotion) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % OFFICES.length),
      CYCLE,
    );
    return () => window.clearInterval(timer);
  }, [held, reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full overflow-hidden bg-white px-4 pt-20 text-neutral-950 dark:bg-neutral-950 dark:text-white sm:px-6 lg:px-8 lg:pt-28"
    >
      <motion.div
        variants={sequence}
        initial={reduceMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto w-full max-w-[1400px]"
      >
        <div className="grid max-w-3xl gap-5">
          <motion.h2
            variants={rise}
            className="max-w-[16ch] text-balance text-[2.25rem] font-medium leading-[1.04] tracking-[-0.04em] sm:text-5xl"
          >
            Clients I have worked with.
          </motion.h2>
          <motion.p
            variants={rise}
            className="max-w-[44ch] text-pretty text-base leading-relaxed text-neutral-600 dark:text-neutral-400"
          >
            Worked with various web application transforming their business
            processes, that generates income to their business.
          </motion.p>
        </div>

        <motion.ol
          variants={rise}
          onPointerLeave={() => setHeld(false)}
          className="mt-16 grid grid-cols-1 gap-8 sm:mt-24 sm:grid-cols-3 sm:gap-6"
        >
          {OFFICES.map((office, index) => {
            const on = index === active;
            return (
              <li
                key={office.city}
                ref={(element) => {
                  columnsRef.current[index] = element;
                }}
                tabIndex={0}
                aria-current={on ? "true" : undefined}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse") return;
                  setHeld(true);
                  setActive(index);
                }}
                onFocus={() => {
                  setHeld(true);
                  setActive(index);
                }}
                onBlur={() => setHeld(false)}
                onClick={() => {
                  setHeld(true);
                  setActive(index);
                }}
                className="flex cursor-default flex-col rounded-md outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current sm:items-center sm:text-center"
              >
                <span
                  className={`text-sm tabular-nums transition-colors duration-500 ${
                    on
                      ? "text-[#c25a00] dark:text-[#ffa25e]"
                      : "text-neutral-500"
                  }`}
                >
                  {office.company}
                </span>
                <span
                  className={`mt-2 text-[2.25rem] font-medium leading-none tracking-[-0.04em] transition-colors duration-500 sm:text-5xl ${
                    on
                      ? "text-neutral-950 dark:text-white"
                      : "text-neutral-400 dark:text-neutral-600"
                  }`}
                >
                  {office.city}
                </span>
                <span
                  className={`mt-4 max-w-[30ch] text-pretty text-sm leading-relaxed transition-colors duration-500 ${
                    on
                      ? "text-neutral-700 dark:text-neutral-300"
                      : "text-neutral-400 dark:text-neutral-600"
                  }`}
                >
                  {office.detail}
                </span>
              </li>
            );
          })}
        </motion.ol>
      </motion.div>
      <div
        ref={anchorRef}
        aria-hidden="true"
        className="mt-10 h-[clamp(9rem,20vw,16rem)] sm:mt-14"
      />
    </section>
  );
}

export default Features17;
