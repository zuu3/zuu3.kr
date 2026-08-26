import { profile, projects } from "@/lib/content";
import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/about-section";
import { ProjectNarrative } from "@/components/project-narrative";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main>
      <Hero profile={profile} />
      <AboutSection profile={profile} />
      {projects.map((project, index) => (
        <ProjectNarrative key={project.slug} project={project} index={index} />
      ))}
      <SiteFooter profile={profile} />
    </main>
  );
}
