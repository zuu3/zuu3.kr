"use client";

import { useEffect, useRef, useState } from "react";
import { LineSidebar } from "@/components/react-bits/line-sidebar";
import type { Project, profile as ProfileType } from "@/lib/content";

function shortName(name: string) {
  const match = name.match(/^(.+?)\(/);
  return match ? match[1] : name;
}

export function SiteNav({ projects }: { profile: typeof ProfileType; projects: Project[] }) {
  const ids = ["home", "about", ...projects.map((p) => `project-${p.slug}`)];
  const labels = ["Home", "About", ...projects.map((p) => shortName(p.name))];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = sections.indexOf(entry.target as HTMLElement);
          if (index !== -1 && index !== activeIndexRef.current) {
            activeIndexRef.current = index;
            setActiveIndex(index);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleItemClick(index: number) {
    const target = document.getElementById(ids[index]);
    if (!target) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div
      aria-hidden={activeIndex === 0}
      inert={activeIndex === 0}
      className={`pointer-events-none fixed top-1/2 left-8 z-40 hidden -translate-y-1/2 transition-opacity duration-300 lg:block xl:left-12 ${
        activeIndex === 0 ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className={activeIndex === 0 ? "" : "pointer-events-auto"}>
        <LineSidebar
          items={labels}
          activeIndex={activeIndex}
          onItemClick={handleItemClick}
          accentColor="#2c8177"
        />
      </div>
    </div>
  );
}
