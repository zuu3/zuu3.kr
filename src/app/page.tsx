import { profile, projects } from "@/lib/content";
import { Hero } from "@/components/hero";
import { ProjectNarrative } from "@/components/project-narrative";
import { AboutSection } from "@/components/about-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main>
      <Hero profile={profile} />
      {projects.map((project, index) => (
        <ProjectNarrative key={project.slug} project={project} index={index} />
      ))}
      <AboutSection profile={profile} />
      <SiteFooter profile={profile} />
    </main>
  );
}
