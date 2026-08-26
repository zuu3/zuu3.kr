"use client";

import BubbleMenu from "@/components/bubble-menu";
import type { Project, profile as ProfileType } from "@/lib/content";

function shortName(name: string) {
  const match = name.match(/^(.+?)\(/);
  return match ? match[1] : name;
}

export function MobileMenu({ projects }: { profile: typeof ProfileType; projects: Project[] }) {
  const ids = ["home", "about", ...projects.map((p) => `project-${p.slug}`)];
  const labels = ["Home", "About", ...projects.map((p) => shortName(p.name))];

  const items = labels.map((label, i) => ({
    label,
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

  return (
    <div className="lg:hidden">
      <BubbleMenu logo="Z" menuBg="#ffffff" menuContentColor="#171717" items={items} />
    </div>
  );
}
