import { ProjectDetail } from "@/components/project-detail";
import { projects } from "@/lib/content";

const project = projects.find((p) => p.slug === "teachmon")!;

export default function Page() {
  return <ProjectDetail project={project} />;
}
