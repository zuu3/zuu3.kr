import { profile, projects } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";
import { MotionReveal } from "@/components/motion-reveal";
import { Hero } from "@/components/hero";

type TimelineGroup = { year: string; items: string[] };

function TimelineBlock({
  label,
  groups,
  accent,
}: {
  label: string;
  groups: TimelineGroup[];
  accent: string;
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-lg font-bold">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
        {label}
      </h3>
      <div className="mt-4 space-y-4">
        {groups.map((group) => (
          <div key={group.year}>
            <p className="text-sm font-semibold text-muted-foreground">{group.year}</p>
            <ul className="mt-1 space-y-1 text-sm leading-relaxed">
              {group.items.map((item) => (
                <li key={item} className="pl-4 -indent-4">
                  <span aria-hidden style={{ color: accent }}>
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

      <section className="mt-24">
        <h2 className="text-2xl font-normal md:text-3xl [font-family:var(--font-display)]">
          Awards &amp; Activities
        </h2>
        <div className="mt-8 grid gap-x-10 gap-y-10 md:grid-cols-2">
          <TimelineBlock label="Awards" groups={profile.awards} accent="#F5A524" />
          <TimelineBlock label="Activity" groups={profile.activities} accent="#EC4899" />
          <TimelineBlock label="Certificates" groups={profile.certificates} accent="#2563EB" />
          <TimelineBlock label="Leadership" groups={profile.leadership} accent="#171717" />
        </div>
      </section>

      <section className="mt-24">
        <h2 className="text-2xl font-normal md:text-3xl [font-family:var(--font-display)]">
          Projects
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
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
