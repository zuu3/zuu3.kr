import { profile, projects } from "@/lib/content";
import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about-section";
import { TechLogoLoop } from "@/components/layout/tech-logo-loop";
import { ProjectNarrative } from "@/components/sections/project-narrative";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";
import { MobileMenu } from "@/components/layout/mobile-menu";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  jobTitle: "Frontend Engineer",
  description: profile.bio,
  url: "https://zuu3.kr",
  sameAs: ["https://github.com/zuu3"],
  knowsAbout: Array.from(new Set(projects.flatMap((p) => p.techStack))),
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "부산소프트웨어마이스터고등학교",
  },
};

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <SiteNav profile={profile} projects={projects} />
      <MobileMenu profile={profile} projects={projects} />
      <Hero />
      <AboutSection profile={profile} />
      <TechLogoLoop />
      {projects.map((project, index) => (
        <ProjectNarrative key={project.slug} project={project} index={index} total={projects.length} />
      ))}
      <SiteFooter profile={profile} />
    </main>
  );
}
