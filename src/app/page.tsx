import { profile, projects } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";
import { MotionReveal } from "@/components/motion-reveal";
import { Hero } from "@/components/hero";
import { AwardsSection } from "@/components/awards-section";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <Hero profile={profile} />

      <AwardsSection profile={profile} />

      <section className="mt-28">
        <h2 className="text-2xl font-black text-neutral-900 [font-family:var(--font-display)] md:text-3xl">
          Projects
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <MotionReveal key={project.slug} delay={i * 0.08}>
              <ProjectCard project={project} />
            </MotionReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
