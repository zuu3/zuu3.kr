import { ProjectDetail } from "@/components/project-detail";
import { projects } from "@/lib/content";

const project = projects.find((p) => p.slug === "church")!;

export const metadata = {
  title: `${project.name} | 오주현`,
  description: project.tagline,
};

export default function Page() {
  return <ProjectDetail project={project} />;
}
