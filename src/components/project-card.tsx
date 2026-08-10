import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <Card
        className="h-full p-6 border-2 transition-transform group-hover:-translate-y-1"
        style={{ borderColor: project.brandColor }}
      >
        <h3 className="text-2xl font-bold" style={{ color: project.brandColor }}>
          {project.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{project.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}
