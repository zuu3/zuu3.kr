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
        <p className="text-sm font-bold text-amber-700">만든 것들</p>
        <h2 className="mt-2 text-2xl font-black text-neutral-900 md:text-3xl">Projects</h2>
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
