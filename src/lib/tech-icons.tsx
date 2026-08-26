import type { IconType } from "react-icons";
import { SiDocker, SiGraphql, SiMysql, SiNextdotjs, SiReact, SiReactquery, SiTypescript } from "react-icons/si";

export const TECH_ICON_MAP: Record<string, IconType> = {
  TypeScript: SiTypescript,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "TanStack Query": SiReactquery,
  GraphQL: SiGraphql,
  MySQL: SiMysql,
  Docker: SiDocker,
};
