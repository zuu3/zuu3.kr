import { profile, projects } from "@/lib/content";
import { Hero } from "@/components/hero";
import { ProjectGallery } from "@/components/project-gallery";
import { AwardsSection } from "@/components/awards-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main>
      <Hero profile={profile} />

      <section className="mt-16 md:mt-24">
        <h2 className="mx-auto max-w-[1600px] px-6 text-2xl font-black text-neutral-900 [font-family:var(--font-display)] md:px-16 md:text-3xl lg:px-24">
          Projects
        </h2>
        <div className="mt-10">
          <ProjectGallery projects={projects} />
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-16 md:py-20 lg:px-24">
        <AwardsSection profile={profile} />
      </div>

      <SiteFooter profile={profile} />
    </main>
  );
}
