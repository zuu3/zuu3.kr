import { profile, projects } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";
import { MotionReveal } from "@/components/motion-reveal";
import { Hero } from "@/components/hero";

type TimelineGroup = { year: string; items: string[] };

function TimelineBlock({ label, groups }: { label: string; groups: TimelineGroup[] }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-600" />
        {label}
      </h3>
      <div className="mt-4 space-y-4">
        {groups.map((group) => (
          <div key={group.year}>
            <p className="text-sm font-semibold text-muted-foreground">{group.year}</p>
            <ul className="mt-1 space-y-1 text-sm leading-relaxed">
              {group.items.map((item) => (
                <li key={item} className="pl-4 -indent-4">
                  <span aria-hidden className="text-amber-600">
                    ·{" "}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <Hero profile={profile} />

      <section className="mt-28">
        <p className="text-sm font-bold text-amber-700">경력과 활동</p>
        <h2 className="mt-2 text-2xl font-black text-neutral-900 md:text-3xl">
          Awards &amp; Activities
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
          <TimelineBlock label="Awards" groups={profile.awards} />
          <TimelineBlock label="Activity" groups={profile.activities} />
          <TimelineBlock label="Certificates" groups={profile.certificates} />
          <TimelineBlock label="Leadership" groups={profile.leadership} />
        </div>
      </section>

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
