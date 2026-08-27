"use client";

import { SiDocker, SiGraphql, SiMysql, SiNextdotjs, SiReact, SiReactquery, SiTypescript } from "react-icons/si";
import { LogoLoop } from "@/components/react-bits/logo-loop";

const TECH_ICONS = [
  { node: <SiTypescript />, title: "TypeScript" },
  { node: <SiReact />, title: "React" },
  { node: <SiNextdotjs />, title: "Next.js" },
  { node: <SiReactquery />, title: "TanStack Query" },
  { node: <SiGraphql />, title: "GraphQL" },
  { node: <SiMysql />, title: "MySQL" },
  { node: <SiDocker />, title: "Docker" },
];

export function TechLogoLoop() {
  return (
    <div className="border-t border-neutral-200 py-10 text-neutral-500 [&_svg]:h-full [&_svg]:w-full">
      <LogoLoop
        logos={TECH_ICONS}
        speed={40}
        logoHeight={28}
        gap={64}
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="사용 기술 스택"
      />
    </div>
  );
}
