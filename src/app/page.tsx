import { profile, projects } from "@/lib/content";
import { Hero } from "@/components/hero";
import { AwardsSection } from "@/components/awards-section";
import { ProjectGallery } from "@/components/project-gallery";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main className="py-16 md:py-20">
      <div className="mx-auto max-w-[1600px] px-6 md:px-16 lg:px-24">
        <Hero profile={profile} />
        <AwardsSection profile={profile} />
      </div>

      <section className="mt-28">
        <h2 className="mx-auto max-w-[1600px] px-6 text-2xl font-black text-neutral-900 [font-family:var(--font-display)] md:px-16 md:text-3xl lg:px-24">
          Projects
        </h2>
        <div className="mt-10">
          <ProjectGallery projects={projects} />
        </div>
      </section>

      <SiteFooter profile={profile} />
    </main>
  );
}
