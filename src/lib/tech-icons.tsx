import type { IconType } from "react-icons";
import { SiDocker, SiGraphql, SiMysql, SiNextdotjs, SiReact, SiReactquery, SiTypescript } from "react-icons/si";

// Zustand has no official SVG mark in Simple Icons — its actual brand
// symbol (used on its own GitHub README) is the 🐻 emoji.
const ZustandIcon: IconType = ({ className }) => (
  <span className={className} role="img" aria-label="Zustand">
    🐻
  </span>
);

export const TECH_ICON_MAP: Record<string, IconType> = {
  TypeScript: SiTypescript,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "TanStack Query": SiReactquery,
  GraphQL: SiGraphql,
  MySQL: SiMysql,
  Docker: SiDocker,
  Zustand: ZustandIcon,
};
