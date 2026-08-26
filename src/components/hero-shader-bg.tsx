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

// ponytail: flat soft-edged gradient blobs, barely drifting, plus a dithered
// film-grain overlay — that grain is what reads as "3D texture" in the
// florent-biffi reference, not glossy sphere lighting (tried that, too
// literal/too much motion — reverted).
const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float blob(vec2 p, vec2 center, float r) {
    return smoothstep(r, 0.0, length(p - center));
  }

  float grain(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    // Very slow, very small drift — this should read as "barely moving",
    // not swinging blobs.
    float t = uTime * 0.02;
    float s = uScroll * 0.15;

    vec3 color = vec3(1.0);
    color = mix(color, vec3(0.93, 0.99, 0.97), blob(p, vec2(-0.55 + sin(t) * 0.04, -0.3 + s), 0.9));
    color = mix(color, vec3(0.85, 0.97, 0.94), blob(p, vec2(0.6 + cos(t * 0.7) * 0.03, 0.35 - s * 0.6), 0.75));
    color = mix(color, vec3(0.70, 0.93, 0.87), blob(p, vec2(0.05, -0.55 + s * 0.4), 0.55) * 0.7);

    color += (grain(gl_FragCoord.xy) - 0.5) * 0.025;

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
        uScroll: { value: 0 },
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

    // Blobs drift with scroll too, not just time — normalized against
    // one viewport height so the shift stays gentle instead of racing off
    // past the fold.
    function handleScroll() {
      program.uniforms.uScroll.value = window.scrollY / window.innerHeight;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

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
      window.removeEventListener("scroll", handleScroll);
      gl.canvas.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    />
  );
}
