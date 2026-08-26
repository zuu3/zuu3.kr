import { profile, projects } from "@/lib/content";
import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/about-section";
import { TechLogoLoop } from "@/components/tech-logo-loop";
import { ProjectNarrative } from "@/components/project-narrative";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { MobileMenu } from "@/components/mobile-menu";

export default function Home() {
  return (
    <main>
      <SiteNav profile={profile} projects={projects} />
      <MobileMenu profile={profile} projects={projects} />
      <Hero />
      <AboutSection profile={profile} />
      <TechLogoLoop />
      {projects.map((project, index) => (
        <ProjectNarrative key={project.slug} project={project} index={index} />
      ))}
      <SiteFooter profile={profile} />
    </main>
  );
}
