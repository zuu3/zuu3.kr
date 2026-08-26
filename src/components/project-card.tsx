import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div>
        <div className="flex items-center justify-between">
          <span
            className="text-sm font-black tabular-nums text-neutral-300 [font-family:var(--font-display)] transition-colors duration-300 group-hover:text-[var(--project-color)]"
            style={{ "--project-color": project.brandColor } as React.CSSProperties}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.brandColor }} />
        </div>
        <h3
          className="mt-4 text-2xl font-black [font-family:var(--font-display)] md:text-3xl"
          style={{ color: project.brandColor }}
        >
          {project.name}
        </h3>
        <p className="mt-3 text-sm text-neutral-500">{project.tagline}</p>
      </div>
      <div className="mt-8 flex items-end justify-between gap-3">
        <p className="text-xs tracking-wide text-neutral-400 uppercase">
          {project.techStack.join(" · ")}
        </p>
        <ArrowUpRight
          className="h-5 w-5 shrink-0 -translate-x-1 translate-y-1 text-neutral-400 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
          strokeWidth={2}
        />
      </div>
    </Link>
  );
}
