"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

const VERTEX = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// ponytail: single-octave value noise, enough for a soft moving gradient blob at hero scale
const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 mouse = (uMouse - 0.5) * vec2(aspect, 1.0);

    float t = uTime * 0.06;
    float n = noise(p * 2.2 + vec2(t, -t));
    n += 0.5 * noise(p * 4.0 - vec2(t * 1.6, t));

    float d = length(p - mouse * 0.4);
    float glow = smoothstep(0.9, 0.0, d) * 0.35;

    vec3 amber = vec3(0.961, 0.647, 0.141);
    vec3 deep = vec3(0.09, 0.07, 0.03);
    vec3 base = mix(deep, amber, clamp(n * 0.6 + glow, 0.0, 1.0));

    float vignette = smoothstep(1.1, 0.2, length(p));
    vec3 color = mix(deep, base, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function HeroShaderBg() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const renderer = new Renderer({ alpha: false, antialias: true, dpr: Math.min(devicePixelRatio, 2) });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: [0.5, 0.5] },
        uResolution: { value: [1, 1] },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      const rect = container!.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      program.uniforms.uResolution.value = [rect.width, rect.height];
    }
    resize();
    window.addEventListener("resize", resize);

    // pointer-events-none on the container (so it never blocks clicks), so
    // mouse position is tracked from window and mapped onto its rect instead.
    function handlePointerMove(e: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      program.uniforms.uMouse.value = [
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height,
      ];
    }
    window.addEventListener("pointermove", handlePointerMove);

    let raf = 0;
    const start = performance.now();
    function loop(now: number) {
      program.uniforms.uTime.value = (now - start) / 1000;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      gl.canvas.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute -inset-x-16 -inset-y-24 -z-10 overflow-hidden opacity-40 blur-3xl md:-inset-x-32"
    />
  );
}
