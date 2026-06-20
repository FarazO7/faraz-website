"use client";

import { useEffect, useRef } from "react";

// Page-wide reactive star field, adapted from React Bits' "Galaxy" (ogl/WebGL).
// Tuned deliberately SUBTLE — calm drift, faint twinkle, almost no rotation, and
// a small cursor parallax (the stars ease a hair toward the pointer rather than
// being shoved away). The demo component ships none of the production safeguards
// below; we add them: a single static frame under prefers-reduced-motion, a
// hidden-tab pause, pointer tracking on `window` (the canvas is pointer-events:
// none so it never blocks scroll/taps), a capped DPR, a dynamic client-only
// import of ogl (code-split, never in the SSR/critical path), and a deferred
// start so WebGL init never competes with the hero's LCP paint.

// --- Look knobs (edit these to retune the galaxy) --------------------------
const STAR_SPEED = 0.12; // flow speed of the layers (low = calm)
const DENSITY = 0.85; // star density
const HUE_SHIFT = 225; // cool blue/indigo, to match the star palette
const SPEED = 0.5; // global animation multiplier
const GLOW = 0.3; // star glow/flare intensity
const SATURATION = 0.42; // 0 = grayscale, 1 = vivid
const TWINKLE = 0.1; // twinkle amount (low = steady)
const ROTATION_SPEED = 0.012; // automatic rotation (near-still)
const MOUSE_LERP = 0.05; // pointer-follow smoothing
// ---------------------------------------------------------------------------

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) { return abs(fract(x) * 2.0 - 1.0); }

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;
      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));
      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;
      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      col += star * size * color;
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
  vec2 mouseNorm = uMouse - vec2(0.5);

  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    // Small, gentle parallax toward the cursor (kept subtle on purpose).
    vec2 mouseOffset = mouseNorm * 0.06 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

export default function ReactiveGalaxy() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ref.current;
    if (!ctn) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let teardown = () => {};

    const start = async () => {
      if (disposed || !ref.current) return;
      const { Renderer, Program, Mesh, Color, Triangle } = await import("ogl");
      if (disposed || !ref.current) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
      const gl = renderer.gl;
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new Color(1, 1, 1) },
          uFocal: { value: new Float32Array([0.5, 0.5]) },
          uRotation: { value: new Float32Array([1, 0]) },
          uStarSpeed: { value: STAR_SPEED },
          uDensity: { value: DENSITY },
          uHueShift: { value: HUE_SHIFT },
          uSpeed: { value: SPEED },
          uMouse: { value: new Float32Array([0.5, 0.5]) },
          uGlowIntensity: { value: GLOW },
          uSaturation: { value: SATURATION },
          uMouseRepulsion: { value: false },
          uTwinkleIntensity: { value: TWINKLE },
          uRotationSpeed: { value: ROTATION_SPEED },
          uRepulsionStrength: { value: 1 },
          uMouseActiveFactor: { value: 0 },
          uAutoCenterRepulsion: { value: 0 },
          uTransparent: { value: true },
        },
      });
      const mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        const w = ctn.clientWidth || window.innerWidth;
        const h = ctn.clientHeight || window.innerHeight;
        renderer.setSize(w * dpr, h * dpr);
        gl.canvas.style.width = "100%";
        gl.canvas.style.height = "100%";
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        );
      };
      resize();
      window.addEventListener("resize", resize);
      ctn.appendChild(gl.canvas);
      ctn.style.opacity = "1";

      const target = { x: 0.5, y: 0.5 };
      const smooth = { x: 0.5, y: 0.5 };
      let targetActive = 0;
      let smoothActive = 0;

      const onMove = (e: PointerEvent) => {
        target.x = e.clientX / window.innerWidth;
        target.y = 1 - e.clientY / window.innerHeight;
        targetActive = 1;
      };

      let raf = 0;
      const render = (t: number) => {
        program.uniforms.uTime.value = t * 0.001;
        program.uniforms.uStarSpeed.value = (t * 0.001 * STAR_SPEED) / 10;
        smooth.x += (target.x - smooth.x) * MOUSE_LERP;
        smooth.y += (target.y - smooth.y) * MOUSE_LERP;
        smoothActive += (targetActive - smoothActive) * MOUSE_LERP;
        program.uniforms.uMouse.value[0] = smooth.x;
        program.uniforms.uMouse.value[1] = smooth.y;
        program.uniforms.uMouseActiveFactor.value = smoothActive;
        renderer.render({ scene: mesh });
      };
      const loop = (t: number) => {
        if (disposed) return;
        raf = requestAnimationFrame(loop);
        render(t);
      };

      const onVisibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(raf);
        } else {
          raf = requestAnimationFrame(loop);
        }
      };

      if (reduced) {
        // One static frame; no loop, no pointer reactivity.
        render(0);
      } else {
        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("visibilitychange", onVisibility);
        raf = requestAnimationFrame(loop);
      }

      teardown = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", onVisibility);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      };
    };

    // Defer the first paint so WebGL init never competes with the hero LCP.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idleId = hasIdle
      ? window.requestIdleCallback(() => void start(), { timeout: 1500 })
      : window.setTimeout(() => void start(), 200);

    return () => {
      disposed = true;
      if (hasIdle) window.cancelIdleCallback(idleId as number);
      else window.clearTimeout(idleId as number);
      teardown();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 opacity-0 transition-opacity duration-700"
    />
  );
}