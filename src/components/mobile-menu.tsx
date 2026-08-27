"use client";

import BubbleMenu from "@/components/react-bits/bubble-menu";
import type { Project, profile as ProfileType } from "@/lib/content";

function shortName(project: Project) {
  if (project.slug === "church") return "Outsourcing";
  const match = project.name.match(/^(.+?)\(/);
  return match ? match[1] : project.name;
}

export function MobileMenu({ projects }: { profile: typeof ProfileType; projects: Project[] }) {
  const ids = ["home", "about", ...projects.map((p) => `project-${p.slug}`)];
  const labels = ["Home", "About", ...projects.map(shortName)];

  const rotations = [-8, 8, -8, 8, -8, 8];

  const items = labels.map((label, i) => ({
    label,
    rotation: rotations[i % rotations.length],
    onClick: () => {
      const target = document.getElementById(ids[i]);
      if (!target) return;
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
  }));

  return <BubbleMenu menuBg="#ffffff" menuContentColor="#171717" items={items} />;
}
