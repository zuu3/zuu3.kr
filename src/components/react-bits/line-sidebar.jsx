"use client";

import { useRef, useCallback, useEffect } from "react";
import "./line-sidebar.css";

const FALLOFF_CURVES = {
  linear: (p) => p,
  smooth: (p) => p * p * (3 - 2 * p),
  sharp: (p) => p * p * p,
};

export const LineSidebar = ({
  items,
  hrefs,
  accentColor = "#ff6f0f",
  textColor = "#a3a3a3",
  markerColor = "#d4d4d4",
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 12,
  falloff = "smooth",
  markerLength = 40,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 0.9,
  smoothing = 100,
  activeIndex: controlledActiveIndex = null,
  onItemClick,
  className = "",
}) => {
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const targetsRef = useRef([]);
  const currentRef = useRef([]);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const activeRef = useRef(controlledActiveIndex);
  const smoothingRef = useRef(smoothing);

  // Refs updated post-render (not during render) so rAF callbacks always
  // read the latest props without needing them in a dependency array.
  useEffect(() => {
    activeRef.current = controlledActiveIndex;
    smoothingRef.current = smoothing;
  });

  // Self-recursing rAF loop: kept behind a ref instead of a directly
  // self-referencing useCallback so the recursive requestAnimationFrame
  // call never closes over a not-yet-initialized binding, and assigned
  // in an effect rather than during render.
  const runFrameRef = useRef(null);
  useEffect(() => {
    runFrameRef.current = (now) => {
      const dt = Math.min((now - lastRef.current) / 1000, 0.05);
      lastRef.current = now;
      const tau = Math.max(smoothingRef.current, 1) / 1000;
      const k = 1 - Math.exp(-dt / tau);

      let moving = false;
      const items = itemRefs.current;
      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        if (!el) continue;
        const target = Math.max(targetsRef.current[i] || 0, activeRef.current === i ? 1 : 0);
        const cur = currentRef.current[i] || 0;
        const next = cur + (target - cur) * k;
        const settled = Math.abs(target - next) < 0.0015;
        const value = settled ? target : next;
        currentRef.current[i] = value;
        el.style.setProperty("--effect", value.toFixed(4));
        if (!settled) moving = true;
      }

      rafRef.current = moving ? requestAnimationFrame(runFrameRef.current) : null;
    };
  });

  const startLoop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrameRef.current);
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const pointerY = e.clientY - rect.top;
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;
      const items = itemRefs.current;
      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        if (!el) continue;
        const center = el.offsetTop + el.offsetHeight / 2;
        const distance = Math.abs(pointerY - center);
        targetsRef.current[i] = ease(Math.max(0, 1 - distance / proximityRadius));
      }
      startLoop();
    },
    [falloff, proximityRadius, startLoop],
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  useEffect(() => {
    startLoop();
  }, [controlledActiveIndex, startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    },
    [],
  );

  return (
    <nav
      className={`line-sidebar${showMarker ? " line-sidebar--markers" : ""}${scaleTick ? " line-sidebar--scale-tick" : ""}${className ? ` ${className}` : ""}`}
      style={{
        "--accent-color": accentColor,
        "--text-color": textColor,
        "--marker-color": markerColor,
        "--marker-length": `${markerLength}px`,
        "--marker-gap": `${markerGap}px`,
        "--tick-scale": tickScale,
        "--max-shift": `${maxShift}px`,
        "--item-gap": `${itemGap}px`,
        "--font-size": `${fontSize}rem`,
        "--smoothing": `${smoothing}ms`,
      }}
    >
      <ul ref={listRef} className="line-sidebar__list" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        {items.map((label, index) => (
          <li
            key={`${label}-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="line-sidebar__item"
          >
            <a
              href={hrefs?.[index] ?? "#"}
              className="line-sidebar__link"
              aria-current={controlledActiveIndex === index ? "true" : undefined}
              onClick={(event) => {
                if (!onItemClick) return;
                event.preventDefault();
                onItemClick(index, label);
              }}
            >
              {showMarker && <span className="line-sidebar__marker" aria-hidden="true" />}
              <span className="line-sidebar__label">
                {showIndex && <span className="line-sidebar__index">{String(index + 1).padStart(2, "0")}</span>}
                <span className="line-sidebar__text">{label}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LineSidebar;
