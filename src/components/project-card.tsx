import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border-t border-neutral-200 py-6 transition-colors first:border-t-0 md:border-t-0 md:border md:border-neutral-200 md:p-6 md:hover:border-neutral-300"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold" style={{ color: project.brandColor }}>
          {project.name}
        </h3>
        <ArrowUpRight
          className="mt-1 h-5 w-5 shrink-0 -translate-x-1 translate-y-1 text-neutral-400 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
          strokeWidth={2}
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{project.tagline}</p>
      <p className="mt-4 text-xs text-neutral-500">{project.techStack.join(" · ")}</p>
    </Link>
  );
}
