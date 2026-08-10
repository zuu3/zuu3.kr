import Image from "next/image";
import { Mail, Phone, GraduationCap } from "lucide-react";
import { profile, projects } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";
import { MotionReveal } from "@/components/motion-reveal";

const SPONGE_COLORS = ["#F5A524", "#2563EB", "#EC4899", "#171717", "#F5A524", "#3B82F6"];

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
      <section className="grid items-center gap-12 md:grid-cols-[3fr_2fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-amber-700">
            Frontend Developer
          </p>
          <h1 className="mt-3 text-4xl leading-tight font-normal text-balance md:text-5xl [font-family:var(--font-display)]">
            <span className="text-amber-700">스펀지</span> 같은 개발자,
            <br />
            {profile.name}입니다.
          </h1>
          <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:text-lg">
            {profile.bio}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-4 w-4" strokeWidth={1.75} />
              {profile.email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-4 w-4" strokeWidth={1.75} />
              {profile.phone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" strokeWidth={1.75} />
              {profile.school}
            </span>
          </div>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-3xl bg-amber-700 md:aspect-4/5">
          <div className="absolute inset-3 grid grid-cols-3 gap-2" aria-hidden>
            {SPONGE_COLORS.map((color, i) => (
              <div
                key={i}
                className="rounded-2xl"
                style={{
                  backgroundColor: color,
                  opacity: 0.35,
                  gridRow: i === 0 ? "span 2" : undefined,
                  gridColumn: i === 4 ? "span 2" : undefined,
                }}
              />
            ))}
          </div>
          <Image
            src="/profile-photo.jpg"
            alt={`${profile.name} 프로필 사진`}
            fill
            sizes="(min-width: 768px) 40vw, 90vw"
            className="relative rounded-3xl object-cover"
            priority
          />
        </div>
      </section>

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
