import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Project } from "@/lib/content";

// ponytail: 25% RGB darken for small-text-on-tint contrast, matches project-detail.tsx
function darken(hex: string, amount = 0.25) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - amount));
  const g = Math.round(((n >> 8) & 255) * (1 - amount));
  const b = Math.round((n & 255) * (1 - amount));
  return `rgb(${r}, ${g}, ${b})`;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <Card
        className="h-full gap-0 overflow-hidden border-0 py-0 ring-0 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg"
        style={{ boxShadow: `inset 0 0 0 1.5px ${project.brandColor}33` }}
      >
        <div className="h-1.5 w-full" style={{ backgroundColor: project.brandColor }} />
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-bold" style={{ color: project.brandColor }}>
              {project.name}
            </h3>
            <ArrowUpRight
              className="mt-1 h-5 w-5 shrink-0 -translate-x-1 translate-y-1 text-muted-foreground/50 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
              style={{ color: project.brandColor }}
              strokeWidth={2.25}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{project.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  color: darken(project.brandColor),
                  backgroundColor: `${project.brandColor}14`,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
