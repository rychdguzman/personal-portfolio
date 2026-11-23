"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";

const CARDS = [
  {
    title: "Capture",
    value: "11.4 kWh",
    detail: "Panels follow the strongest hours of sun and send every watt down the line.",
    glow: "#ffb21f",
    ink: "#c27500",
    accent: "text-[#b86f00] dark:text-[#ffbe45]",
  },
  {
    title: "Store",
    value: "13.5 kWh",
    detail: "The battery banks whatever you don't use and holds it for the evening.",
    glow: "#3ee08f",
    ink: "#0b9454",
    accent: "text-[#0b8a4e] dark:text-[#5eeba6]",
  },
  {
    title: "Power",
    value: "94%",
    detail: "Your home draws from the battery first and from the grid only when it must.",
    glow: "#4aa8ff",
    ink: "#1d6ad3",
    accent: "text-[#1d63c4] dark:text-[#6fb9ff]",
  },
];

const MAX_PARTICLES = 14000;
const FLOW_CELLS = 64;
const STREAMS = 3;
const PITCH = 7;
const CORNER = 20;

interface Current {
  focus: (index: number | null) => void;
  plume: (clientX: number, clientY: number) => void;
  destroy: () => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

const hexToRgb = (hex: string): [number, number, number] => {
  const value = Number.parseInt(hex.slice(1), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
};

const PERM = (() => {
  const base = Array.from({ length: 256 }, (_, i) => i);
  let state = 1337;
  for (let i = 255; i > 0; i--) {
    state = (state * 16807) % 2147483647;
    const j = state % (i + 1);
    const swap = base[i];
    base[i] = base[j];
    base[j] = swap;
  }
  const table = new Uint8Array(512);
  for (let i = 0; i < 512; i++) table[i] = base[i & 255];
  return table;
})();

const fadeCurve = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

const gradient = (hash: number, x: number, y: number, z: number) => {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
};

const noise3 = (x: number, y: number, z: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const X = xi & 255;
  const Y = yi & 255;
  const Z = zi & 255;
  const fx = x - xi;
  const fy = y - yi;
  const fz = z - zi;
  const u = fadeCurve(fx);
  const v = fadeCurve(fy);
  const w = fadeCurve(fz);
  const A = PERM[X] + Y;
  const AA = PERM[A] + Z;
  const AB = PERM[A + 1] + Z;
  const B = PERM[X + 1] + Y;
  const BA = PERM[B] + Z;
  const BB = PERM[B + 1] + Z;
  const lerp = (t: number, a: number, b: number) => a + t * (b - a);
  return lerp(
    w,
    lerp(
      v,
      lerp(u, gradient(PERM[AA], fx, fy, fz), gradient(PERM[BA], fx - 1, fy, fz)),
      lerp(u, gradient(PERM[AB], fx, fy - 1, fz), gradient(PERM[BB], fx - 1, fy - 1, fz)),
    ),
    lerp(
      v,
      lerp(u, gradient(PERM[AA + 1], fx, fy, fz - 1), gradient(PERM[BA + 1], fx - 1, fy, fz - 1)),
      lerp(u, gradient(PERM[AB + 1], fx, fy - 1, fz - 1), gradient(PERM[BB + 1], fx - 1, fy - 1, fz - 1)),
    ),
  );
};

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


const passVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const panelChunk = `
uniform vec4 uRects[3];
uniform float uCorner;

float box(vec2 p, vec4 r, float radius) {
  vec2 c = (r.xy + r.zw) * 0.5;
  vec2 h = (r.zw - r.xy) * 0.5;
  vec2 q = abs(p - c) - h + radius;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}
`;

const dotsFragment = `
uniform sampler2D uEnergy;
uniform sampler2D uFlow;
uniform vec2 uGrid;
uniform vec2 uOrigin;
uniform float uPitch;
uniform float uMaxRadius;
uniform float uBaseRadius;
uniform float uBase;
uniform float uGain;
uniform float uStretch;
uniform float uVariance;
uniform float uInk;
uniform float uFade;
uniform vec3 uTints[3];
uniform float uFocus[3];
uniform vec3 uBaseColor;
varying vec2 vUv;
${panelChunk}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float inside = 0.0;
  vec3 tint = vec3(0.0);
  float focus = 0.0;
  for (int i = 0; i < 3; i++) {
    float m = 1.0 - smoothstep(-1.5, 0.5, box(frag, uRects[i], uCorner));
    inside += m;
    tint += uTints[i] * m;
    focus += uFocus[i] * m;
  }
  if (inside <= 0.001) {
    gl_FragColor = vec4(0.0);
    return;
  }
  tint /= inside;
  focus /= inside;
  inside = min(inside, 1.0);
  vec2 rel = frag - uOrigin;
  vec2 cell = floor(rel / uPitch);
  if (cell.x < 0.0 || cell.y < 0.0 || cell.x >= uGrid.x || cell.y >= uGrid.y) {
    gl_FragColor = vec4(0.0);
    return;
  }
  vec2 local = rel - (cell + 0.5) * uPitch;
  vec2 uv = (cell + 0.5) / uGrid;
  vec4 energy = texture2D(uEnergy, uv);
  vec2 flow = texture2D(uFlow, uv).rg;
  float amount = max(energy.a, 0.0);
  float lit = (1.0 - exp(-amount * uGain * (1.0 + focus * 0.8))) * uFade;
  float shade = clamp(energy.r / max(amount, 0.0001), 0.0, 1.0);
  float speed = length(flow) / max(amount, 0.0001);
  vec2 along = speed > 0.00001 ? flow / (speed * max(amount, 0.0001)) : vec2(1.0, 0.0);
  vec2 across = vec2(-along.y, along.x);
  float stretch = 1.0 + uStretch * clamp(speed * 6.0, 0.0, 1.6) * smoothstep(0.02, 0.3, lit);
  float halftone = mix(uBaseRadius, uMaxRadius, sqrt(lit));
  float panel = uMaxRadius * (0.72 + 0.28 * smoothstep(0.0, 0.45, lit));
  float radius = mix(panel, halftone, uVariance);
  vec2 q = vec2(dot(local, along) / stretch, dot(local, across));
  float d = length(q) - radius;
  float cover = 1.0 - smoothstep(-0.65, 0.65, d);
  float baseCover = (1.0 - smoothstep(-0.6, 0.6, length(local) - uBaseRadius)) * uBase * (1.0 - lit);
  if (uInk > 0.5) {
    float a = clamp(cover * lit * 2.3, 0.0, 1.0);
    vec3 ink = tint * mix(0.82, 1.08, shade);
    float baseA = baseCover * (1.0 - a);
    gl_FragColor = vec4((ink * a + uBaseColor * baseA) * inside, (a + baseA) * inside);
    return;
  }
  vec3 emission = tint * lit * cover * 1.6 * mix(0.7, 1.1, shade) + vec3(1.0) * max(lit - 0.82, 0.0) * cover * 0.8;
  gl_FragColor = vec4((emission + uBaseColor * baseCover) * inside, inside);
}
`;

const compositeFragment = `
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uBloomStrength;
uniform float uInk;
uniform float uGrain;
uniform float uTime;
varying vec2 vUv;
${panelChunk}

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
  float inside = 0.0;
  for (int i = 0; i < 3; i++) inside += 1.0 - smoothstep(-1.5, 0.5, box(gl_FragCoord.xy, uRects[i], uCorner));
  inside = min(inside, 1.0);
  if (inside <= 0.001) {
    gl_FragColor = vec4(0.0);
    return;
  }
  vec4 scene = texture2D(uScene, vUv);
  if (uInk > 0.5) {
    gl_FragColor = scene * inside;
    return;
  }
  vec3 emission = scene.rgb + texture2D(uBloom, vUv).rgb * uBloomStrength;
  vec3 light = pow(neutral(max(emission, 0.0)), vec3(1.0 / 2.2));
  float peak = max(light.r, max(light.g, light.b));
  float n = hash(gl_FragCoord.xy + fract(uTime * 13.0) * 911.0) - 0.5;
  light = clamp(light + n * uGrain * 0.1 * smoothstep(0.0, 0.04, peak), 0.0, 1.0);
  peak = max(light.r, max(light.g, light.b));
  gl_FragColor = vec4(light * inside, peak * inside);
}
`;

function createCurrent(root: HTMLElement, panels: HTMLElement[]): Current | null {
  const doc = root.ownerDocument;
  const view = doc.defaultView ?? window;
  const canvas = doc.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;left:0;top:0;z-index:1;display:block;pointer-events:none";
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }
  root.appendChild(canvas);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0);

  const motionQuery = view.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = motionQuery.matches;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  const quadGeometry = new THREE.PlaneGeometry(2, 2);
  const quadScene = new THREE.Scene();
  const quad = new THREE.Mesh(quadGeometry);
  quad.frustumCulled = false;
  quadScene.add(quad);

  let columns = 1;
  let rows = 1;
  let energy = new Float32Array(4);
  let flow = new Float32Array(2);
  let energyTexture = new THREE.DataTexture(energy, 1, 1, THREE.RGBAFormat, THREE.FloatType);
  let flowTexture = new THREE.DataTexture(flow, 1, 1, THREE.RGFormat, THREE.FloatType);
  const rects = Array.from({ length: 3 }, () => new THREE.Vector4(-10, -10, -9, -9));
  const tints = Array.from({ length: 3 }, () => new THREE.Vector3());
  const focusLevels = [0, 0, 0];
  const focusGoals = [0, 0, 0];
  const baseColor = new THREE.Vector3();
  const corner = { value: CORNER };

  const dotsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uEnergy: { value: energyTexture },
      uFlow: { value: flowTexture },
      uGrid: { value: new THREE.Vector2(1, 1) },
      uOrigin: { value: new THREE.Vector2(0, 0) },
      uPitch: { value: PITCH },
      uMaxRadius: { value: 3 },
      uBaseRadius: { value: 1 },
      uBase: { value: 0.22 },
      uGain: { value: 0.7 },
      uStretch: { value: 0.25 },
      uVariance: { value: 0.35 },
      uInk: { value: 0 },
      uFade: { value: 0 },
      uTints: { value: tints },
      uFocus: { value: focusLevels },
      uBaseColor: { value: baseColor },
      uRects: { value: rects },
      uCorner: corner,
    },
    vertexShader: passVertex,
    fragmentShader: dotsFragment,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
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
  const downMaterial = new THREE.ShaderMaterial({
    uniforms: { uSource: { value: null }, uTexel: { value: new THREE.Vector2() }, uThreshold: { value: 0 } },
    vertexShader: passVertex,
    fragmentShader: downFragment,
    depthTest: false,
    depthWrite: false,
  });
  const upMaterial = new THREE.ShaderMaterial({
    uniforms: { uSource: { value: null }, uTexel: { value: new THREE.Vector2() } },
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
      uBloomStrength: { value: 0.32 },
      uInk: { value: 0 },
      uGrain: { value: 0.15 },
      uTime: { value: 0 },
      uRects: { value: rects },
      uCorner: corner,
    },
    vertexShader: passVertex,
    fragmentShader: compositeFragment,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
  });

  const px = new Float32Array(MAX_PARTICLES);
  const py = new Float32Array(MAX_PARTICLES);
  const age = new Float32Array(MAX_PARTICLES);
  const life = new Float32Array(MAX_PARTICLES);
  const weight = new Float32Array(MAX_PARTICLES);
  const tone = new Float32Array(MAX_PARTICLES);
  const dye = new Uint8Array(MAX_PARTICLES);
  let count = 0;
  let flowW = FLOW_CELLS;
  let flowH = 16;
  let psi = new Float32Array((flowW + 1) * (flowH + 1));
  let bandNode = new Float32Array((flowW + 1) * (flowH + 1));
  let velX = new Float32Array(flowW * flowH);
  let velY = new Float32Array(flowW * flowH);

  const probe = doc.createElement("canvas").getContext("2d", { willReadFrequently: true });
  let width = 0;
  let height = 0;
  let aspect = 1;
  let dpr = 1;
  let vertical = false;
  let gridKey = "";
  let colorKey = "";
  let ink = false;
  let travel = 0;
  let evolve = 0;
  let clock = 0;
  let fade = 0;
  let introStart = -1;
  let raf = 0;
  let last = 0;
  let visible = false;
  let destroyed = false;
  let lost = false;
  let seed = 7;
  const box = { left: 0, top: 0 };

  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const syncColors = () => {
    if (!probe) return false;
    let node: HTMLElement | null = panels[0];
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
    ink = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.55;
    CARDS.forEach((card, index) => {
      const rgb = hexToRgb(ink ? card.ink : card.glow);
      if (ink) tints[index].set(rgb[0], rgb[1], rgb[2]);
      else tints[index].set(toLinear(rgb[0]), toLinear(rgb[1]), toLinear(rgb[2]));
    });
    if (ink) baseColor.set(0.8, 0.8, 0.8);
    else baseColor.set(0.016, 0.016, 0.016);
    dotsMaterial.uniforms.uInk.value = ink ? 1 : 0;
    compositeMaterial.uniforms.uInk.value = ink ? 1 : 0;
    return true;
  };

  const measure = () => {
    const rootBox = root.getBoundingClientRect();
    const boxes = panels.map((panel) => panel.getBoundingClientRect());
    if (boxes.some((item) => item.width < 2 || item.height < 2)) return false;
    const left = Math.min(...boxes.map((item) => item.left));
    const top = Math.min(...boxes.map((item) => item.top));
    const right = Math.max(...boxes.map((item) => item.right));
    const bottom = Math.max(...boxes.map((item) => item.bottom));
    const nextWidth = Math.round(right - left);
    const nextHeight = Math.round(bottom - top);
    const nextDpr = Math.min(view.devicePixelRatio || 1, 2);
    box.left = left;
    box.top = top;
    canvas.style.left = `${Math.round(left - rootBox.left)}px`;
    canvas.style.top = `${Math.round(top - rootBox.top)}px`;
    canvas.style.width = `${nextWidth}px`;
    canvas.style.height = `${nextHeight}px`;
    vertical = boxes[1].top >= boxes[0].bottom - 1;
    boxes.forEach((item, index) => {
      rects[index].set(
        (item.left - left) * nextDpr,
        (bottom - item.bottom) * nextDpr,
        (item.right - left) * nextDpr,
        (bottom - item.top) * nextDpr,
      );
    });
    corner.value = CORNER * nextDpr;
    if (nextWidth === width && nextHeight === height && nextDpr === dpr) return false;
    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;
    aspect = width / Math.max(height, 1);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    const w = Math.round(width * dpr);
    const h = Math.round(height * dpr);
    sceneTarget.setSize(w, h);
    let bw = w;
    let bh = h;
    for (const bloomTarget of bloomTargets) {
      bw = Math.max(1, Math.round(bw / 2));
      bh = Math.max(1, Math.round(bh / 2));
      bloomTarget.setSize(bw, bh);
    }
    gridKey = "";
    return true;
  };

  const ensureGrid = () => {
    const pitch = Math.max(3, Math.round(PITCH * dpr));
    const key = [width, height, dpr, pitch].join("|");
    if (key === gridKey) return;
    gridKey = key;
    const deviceW = Math.round(width * dpr);
    const deviceH = Math.round(height * dpr);
    columns = Math.ceil(deviceW / pitch) + 1;
    rows = Math.ceil(deviceH / pitch) + 1;
    energy = new Float32Array(columns * rows * 4);
    flow = new Float32Array(columns * rows * 2);
    energyTexture.dispose();
    flowTexture.dispose();
    energyTexture = new THREE.DataTexture(energy, columns, rows, THREE.RGBAFormat, THREE.FloatType);
    flowTexture = new THREE.DataTexture(flow, columns, rows, THREE.RGFormat, THREE.FloatType);
    for (const texture of [energyTexture, flowTexture]) {
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      texture.needsUpdate = true;
    }
    const u = dotsMaterial.uniforms;
    u.uEnergy.value = energyTexture;
    u.uFlow.value = flowTexture;
    u.uGrid.value.set(columns, rows);
    u.uPitch.value = pitch;
    u.uOrigin.value.set((deviceW - columns * pitch) / 2, (deviceH - rows * pitch) / 2);
    u.uMaxRadius.value = pitch * 0.5 * 0.66;
    u.uBaseRadius.value = Math.max(0.6 * dpr, pitch * 0.5 * 0.66 * 0.22);
    if (aspect >= 1) {
      flowW = FLOW_CELLS;
      flowH = Math.max(12, Math.round(FLOW_CELLS / aspect));
    } else {
      flowH = FLOW_CELLS;
      flowW = Math.max(12, Math.round(FLOW_CELLS * aspect));
    }
    psi = new Float32Array((flowW + 1) * (flowH + 1));
    bandNode = new Float32Array((flowW + 1) * (flowH + 1));
    velX = new Float32Array(flowW * flowH);
    velY = new Float32Array(flowW * flowH);
  };

  const boost = () => 1 + 0.55 * Math.max(...focusLevels);
  const drift = () => 0.6 * 0.25 * boost();

  const updateFlow = () => {
    const d = drift();
    const theta = vertical ? -Math.PI / 2 : 0;
    const c = Math.cos(theta);
    const sn = Math.sin(theta);
    const meander = 0.6 * 0.3;
    const extent = aspect * Math.abs(sn) + Math.abs(c);
    const frequency = 1.35;
    const shift = travel * frequency * 0.6;
    for (let j = 0; j <= flowH; j++) {
      const oy = j / flowH - 0.5;
      for (let i = 0; i <= flowW; i++) {
        const ox = (i / flowW) * aspect - aspect / 2;
        const along = ox * c + oy * sn;
        const across = -ox * sn + oy * c;
        const n =
          noise3(along * frequency - shift, across * frequency * 1.2, evolve) +
          0.42 * noise3(along * frequency * 2.2 + 7.3 - shift * 1.3, across * frequency * 2.3 - 3.1, evolve * 1.6 + 11.7) +
          0.16 * noise3(along * frequency * 4.6 - 2.1 - shift * 1.7, across * frequency * 4.4 + 5.7, evolve * 2.3 + 3.3);
        const value = (across + meander * n) / extent;
        const node = j * (flowW + 1) + i;
        psi[node] = value;
        bandNode[node] = value + 0.5;
      }
    }
    const velocityScale = d * extent;
    const hx = aspect / flowW;
    const hy = 1 / flowH;
    const limit = d * 3 + 0.0001;
    for (let j = 0; j < flowH; j++) {
      for (let i = 0; i < flowW; i++) {
        const node = j * (flowW + 1) + i;
        const a = psi[node];
        const b = psi[node + 1];
        const e = psi[node + flowW + 1];
        const f = psi[node + flowW + 2];
        const dy = (e - a + f - b) / (2 * hy);
        const dx = (b - a + f - e) / (2 * hx);
        const level = (a + b + e + f) / 4 + 0.5;
        const pace = 0.62 + 0.76 * (0.5 + 0.5 * Math.sin(level * Math.PI * 6 + 0.9));
        let vx = dy * velocityScale * pace;
        let vy = -dx * velocityScale * pace;
        const speed = Math.hypot(vx, vy);
        if (speed > limit) {
          vx *= limit / speed;
          vy *= limit / speed;
        }
        velX[j * flowW + i] = vx;
        velY[j * flowW + i] = vy;
      }
    }
  };

  const sampleField = (field: Float32Array, x: number, y: number) => {
    const fx = clamp((x / aspect) * flowW - 0.5, 0, flowW - 1.001);
    const fy = clamp(y * flowH - 0.5, 0, flowH - 1.001);
    const i = Math.floor(fx);
    const j = Math.floor(fy);
    const tx = fx - i;
    const ty = fy - j;
    const a = field[j * flowW + i];
    const b = field[j * flowW + i + 1];
    const c = field[(j + 1) * flowW + i];
    const d = field[(j + 1) * flowW + i + 1];
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
  };

  const sampleBand = (x: number, y: number) => {
    const fx = clamp((x / aspect) * flowW, 0, flowW - 0.001);
    const fy = clamp(y * flowH, 0, flowH - 0.001);
    const i = Math.floor(fx);
    const j = Math.floor(fy);
    const tx = fx - i;
    const ty = fy - j;
    const stride = flowW + 1;
    const a = bandNode[j * stride + i];
    const b = bandNode[j * stride + i + 1];
    const c = bandNode[(j + 1) * stride + i];
    const d = bandNode[(j + 1) * stride + i + 1];
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
  };

  const streamHash = (n: number) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  };

  const bandOf = (x: number, y: number) => {
    const value = sampleBand(x, y);
    const base = 0.13 / STREAMS;
    let best = 0;
    for (let i = 0; i < STREAMS; i++) {
      const center = (i + 0.5 + (streamHash(i * 3.7 + 1.3) - 0.5) * 0.35) / STREAMS;
      const width = base * (0.55 + 0.9 * streamHash(i * 5.1 + 2.9));
      const offset = value - center;
      const profile = Math.exp(-(offset * offset) / (2 * width * width)) * (0.55 + 0.45 * streamHash(i * 2.3 + 0.7));
      if (profile > best) best = profile;
    }
    return best;
  };

  const spawn = (p: number, prewarm: boolean) => {
    let x = 0;
    let y = 0;
    let profile = 0;
    const margin = 0.18;
    for (let attempt = 0; attempt < 10; attempt++) {
      x = -margin + random() * (aspect + margin * 2);
      y = -margin + random() * (1 + margin * 2);
      profile = bandOf(x, y);
      if (random() < profile) break;
    }
    px[p] = x;
    py[p] = y;
    life[p] = 2.8 + random() * 3.6;
    age[p] = prewarm ? random() * life[p] : 0;
    const sparkle = random();
    weight[p] = profile * (0.22 + 0.78 * sparkle * sparkle * sparkle) * 1.6;
    tone[p] = random();
    dye[p] = 0;
  };

  const targetCount = () => {
    const area = (columns * rows) / 6000;
    return Math.round(clamp(3400 * area * Math.sqrt(STREAMS / 4), 600, MAX_PARTICLES - 1200));
  };

  const reseed = (prewarm: boolean) => {
    count = targetCount();
    for (let p = 0; p < count; p++) spawn(p, prewarm);
  };

  const emitPlume = (x: number, y: number) => {
    for (let n = 0; n < 110 && count < MAX_PARTICLES; n++) {
      const p = count++;
      const r = Math.sqrt(random()) * 0.055;
      const a = random() * Math.PI * 2;
      px[p] = x + Math.cos(a) * r;
      py[p] = y + Math.sin(a) * r;
      age[p] = random() * 0.25;
      life[p] = 3.2 + random() * 2.8;
      weight[p] = 0.32 + random() * 0.32;
      tone[p] = 0.7 + random() * 0.3;
      dye[p] = 1;
    }
  };

  const decayAndSplat = (dt: number) => {
    const tau = 0.08 + 0.6 * 0.9;
    const keep = Math.exp(-dt / tau);
    for (let i = 0; i < energy.length; i++) energy[i] *= keep;
    for (let i = 0; i < flow.length; i++) flow[i] *= keep;
    const fullW = Math.round(width * dpr);
    const fullH = Math.round(height * dpr);
    const pitch = dotsMaterial.uniforms.uPitch.value as number;
    const originX = (fullW - columns * pitch) / 2;
    const originY = (fullH - rows * pitch) / 2;
    const unit = dt * 60;
    for (let p = 0; p < count; p++) {
      const a = age[p];
      const l = life[p];
      const ramp = Math.min(1, a / 0.5) * Math.min(1, (l - a) / 0.7);
      if (ramp <= 0) continue;
      const w = weight[p] * ramp * unit;
      if (w <= 0.0001) continue;
      const cx = ((px[p] / aspect) * fullW - originX) / pitch - 0.5;
      const cy = (py[p] * fullH - originY) / pitch - 0.5;
      const i = Math.floor(cx);
      const j = Math.floor(cy);
      if (i < -1 || j < -1 || i >= columns || j >= rows) continue;
      const tx = cx - i;
      const ty = cy - j;
      const shade = 0.55 + 0.45 * tone[p];
      const vx = sampleField(velX, px[p], py[p]);
      const vy = sampleField(velY, px[p], py[p]);
      for (let k = 0; k < 4; k++) {
        const ci = i + (k & 1);
        const cj = j + (k >> 1);
        if (ci < 0 || cj < 0 || ci >= columns || cj >= rows) continue;
        const share = (k & 1 ? tx : 1 - tx) * (k >> 1 ? ty : 1 - ty) * w;
        const cell = cj * columns + ci;
        energy[cell * 4] += shade * share;
        energy[cell * 4 + 3] += share;
        flow[cell * 2] += vx * share;
        flow[cell * 2 + 1] += vy * share;
      }
    }
    energyTexture.needsUpdate = true;
    flowTexture.needsUpdate = true;
  };

  const advect = (dt: number) => {
    let write = 0;
    const baseCount = targetCount();
    for (let p = 0; p < count; p++) {
      age[p] += dt;
      px[p] += sampleField(velX, px[p], py[p]) * dt;
      py[p] += sampleField(velY, px[p], py[p]) * dt;
      const outside = px[p] < -0.25 || px[p] > aspect + 0.25 || py[p] < -0.25 || py[p] > 1.25;
      if (age[p] >= life[p] || outside) {
        if (dye[p] || write >= baseCount) continue;
        spawn(p, false);
      }
      if (write !== p) {
        px[write] = px[p];
        py[write] = py[p];
        age[write] = age[p];
        life[write] = life[p];
        weight[write] = weight[p];
        tone[write] = tone[p];
        dye[write] = dye[p];
      }
      write++;
    }
    count = write;
    while (count < baseCount) spawn(count++, false);
  };

  const simulate = (dt: number) => {
    travel += dt * drift();
    evolve += dt * 0.6 * 0.075;
    updateFlow();
    advect(dt);
    decayAndSplat(dt);
  };

  const prewarm = (seconds: number) => {
    ensureGrid();
    updateFlow();
    reseed(true);
    for (let t = 0; t < seconds; t += 1 / 30) simulate(1 / 30);
  };

  const render = () => {
    if (!width) return;
    ensureGrid();
    const u = dotsMaterial.uniforms;
    u.uGain.value = 1.05 / (60 * (0.08 + 0.6 * 0.9));
    u.uFade.value = fade;
    quad.material = dotsMaterial;
    renderer.setRenderTarget(sceneTarget);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(quadScene, camera);
    if (!ink) {
      let source: THREE.WebGLRenderTarget = sceneTarget;
      quad.material = downMaterial;
      for (const bloomTarget of bloomTargets) {
        downMaterial.uniforms.uThreshold.value = source === sceneTarget ? 0.25 : 0;
        downMaterial.uniforms.uSource.value = source.texture;
        downMaterial.uniforms.uTexel.value.set(1 / source.width, 1 / source.height);
        renderer.setRenderTarget(bloomTarget);
        renderer.render(quadScene, camera);
        source = bloomTarget;
      }
      quad.material = upMaterial;
      for (let i = bloomTargets.length - 1; i > 0; i--) {
        upMaterial.uniforms.uSource.value = bloomTargets[i].texture;
        upMaterial.uniforms.uTexel.value.set(1 / bloomTargets[i].width, 1 / bloomTargets[i].height);
        renderer.setRenderTarget(bloomTargets[i - 1]);
        renderer.render(quadScene, camera);
      }
    }
    compositeMaterial.uniforms.uTime.value = clock;
    quad.material = compositeMaterial;
    renderer.setRenderTarget(null);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(quadScene, camera);
  };

  const schedule = () => {
    if (destroyed || lost || !visible || raf) return;
    raf = view.requestAnimationFrame(tick);
  };

  function tick(now: number) {
    raf = 0;
    if (destroyed || lost) return;
    const dt = last && now - last < 100 ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    if (!width) measure();
    if (!width) return;
    if (count === 0) {
      prewarm(reduced ? 3 : 1.4);
      if (reduced) fade = 1;
    }
    for (let i = 0; i < focusLevels.length; i++) {
      focusLevels[i] += (focusGoals[i] - focusLevels[i]) * (reduced ? 1 : 1 - Math.exp(-dt / 0.3));
    }
    if (!reduced) {
      clock += dt;
      simulate(dt);
      if (introStart < 0) introStart = now;
      const progress = clamp((now - introStart) / 2000, 0, 1);
      fade = progress * progress * (3 - 2 * progress);
    } else {
      fade = 1;
    }
    render();
    const settling = focusLevels.some((level, i) => Math.abs(level - focusGoals[i]) > 0.002);
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
    gridKey = "";
    schedule();
  };

  const resizeObserver = new ResizeObserver(() => {
    if (measure()) {
      ensureGrid();
      if (count > 0) reseed(true);
    }
    if (!raf && visible) render();
    schedule();
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
  themes.observe(doc.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
  scheme.addEventListener("change", refresh);
  motionQuery.addEventListener("change", onMotion);
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);
  resizeObserver.observe(root);
  panels.forEach((panel) => resizeObserver.observe(panel));
  intersection.observe(root);
  syncColors();
  measure();

  return {
    focus: (index: number | null) => {
      focusGoals.forEach((_, i) => (focusGoals[i] = i === index ? 1 : 0));
      schedule();
    },
    plume: (clientX: number, clientY: number) => {
      if (reduced || !width) return;
      const rootBox = root.getBoundingClientRect();
      const left = rootBox.left + Number.parseFloat(canvas.style.left || "0");
      const top = rootBox.top + Number.parseFloat(canvas.style.top || "0");
      emitPlume(((clientX - left) / width) * aspect, 1 - (clientY - top) / height);
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
      energyTexture.dispose();
      flowTexture.dispose();
      sceneTarget.dispose();
      bloomTargets.forEach((item) => item.dispose());
      [dotsMaterial, downMaterial, upMaterial, compositeMaterial].forEach((item) => item.dispose());
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

export function Features16() {
  const reduceMotion = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const currentRef = useRef<Current | null>(null);
  const pressRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const row = rowRef.current;
    const panels = panelsRef.current.filter((panel): panel is HTMLDivElement => panel !== null);
    if (!row || panels.length !== CARDS.length) return;
    const current = createCurrent(row, panels);
    currentRef.current = current;
    return () => {
      current?.destroy();
      currentRef.current = null;
    };
  }, []);

  const onPanelDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pressRef.current = { x: event.clientX, y: event.clientY, time: performance.now() };
  };

  const onPanelUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const press = pressRef.current;
    pressRef.current = null;
    if (!press || performance.now() - press.time > 500) return;
    if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10) return;
    currentRef.current?.plume(event.clientX, event.clientY);
  };

  return (
    <section className="w-full bg-white px-4 py-20 text-neutral-950 dark:bg-neutral-950 dark:text-white sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          variants={sequence}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="grid max-w-3xl gap-5"
        >
          <motion.h2
            variants={rise}
            className="max-w-[16ch] text-balance text-[2.25rem] font-medium leading-[1.04] tracking-[-0.04em] sm:text-5xl"
          >
            Every watt, from roof to plug.
          </motion.h2>
          <motion.p
            variants={rise}
            className="max-w-[44ch] text-pretty text-base leading-relaxed text-neutral-600 dark:text-neutral-400"
          >
            Panels, battery and home work as one system, moving power to wherever it&apos;s needed.
          </motion.p>
        </motion.div>

        <div ref={rowRef} className="relative mt-12 grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-3">
          {CARDS.map((card, index) => (
            <motion.article
              key={card.title}
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.1 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") currentRef.current?.focus(index);
              }}
              onPointerLeave={() => currentRef.current?.focus(null)}
              className="flex flex-col rounded-[28px] bg-neutral-100 p-2 dark:bg-neutral-900"
            >
              <div
                ref={(element) => {
                  panelsRef.current[index] = element;
                }}
                aria-hidden="true"
                onPointerDown={onPanelDown}
                onPointerUp={onPanelUp}
                className="aspect-[4/3] w-full rounded-[20px] bg-white dark:bg-neutral-950"
              />
              <div className="flex flex-1 flex-col px-4 pb-4 pt-5 sm:px-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-medium tracking-[-0.01em]">{card.title}</h3>
                  <span className={`text-lg font-medium tabular-nums ${card.accent}`}>{card.value}</span>
                </div>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {card.detail}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features16;
