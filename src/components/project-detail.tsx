import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TroubleshootingBlock } from "@/components/troubleshooting-block";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/content";

// ponytail: 25% RGB darken, per-channel clamp not needed since input channels are 0-255
function darken(hex: string, amount = 0.25) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - amount));
  const g = Math.round(((n >> 8) & 255) * (1 - amount));
  const b = Math.round((n & 255) * (1 - amount));
  return `rgb(${r}, ${g}, ${b})`;
}

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <main
      className="min-h-screen px-6 py-16"
      style={{ ["--brand" as string]: project.brandColor }}
    >
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium tracking-wide text-neutral-600 uppercase transition-colors hover:border-[var(--brand)] hover:bg-[var(--brand)] hover:text-white"
        >
          <ArrowLeft
            className="h-4 w-4 -translate-x-0.5 transition-transform duration-200 group-hover:-translate-x-1.5"
            strokeWidth={2}
          />
          목록으로
        </Link>
        <div
          className="mt-6 h-1.5 w-16 rounded-full"
          style={{ backgroundColor: project.brandColor }}
        />
        <p className="mt-4 text-sm font-medium" style={{ color: darken(project.brandColor) }}>
          {project.tagline}
        </p>
        <h1 className="mt-2 text-4xl font-black [font-family:var(--font-display)] md:text-5xl">{project.name}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              style={{ borderColor: project.brandColor, color: project.brandColor }}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-6 text-sm md:grid-cols-4">
          <div>
            <dt className="font-semibold">제작 기간</dt>
            <dd className="mt-1 text-muted-foreground">{project.period}</dd>
          </div>
          <div>
            <dt className="font-semibold">운영 기간</dt>
            <dd className="mt-1 text-muted-foreground">{project.operatingPeriod}</dd>
          </div>
          <div>
            <dt className="font-semibold">Role</dt>
            <dd className="mt-1 text-muted-foreground">{project.role}</dd>
          </div>
          <div>
            <dt className="font-semibold">기술스택</dt>
            <dd className="mt-1 text-muted-foreground">{project.techStack.join(", ")}</dd>
          </div>
        </dl>

        {project.contributions.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold [font-family:var(--font-display)]" style={{ color: project.brandColor }}>
              기여
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {project.contributions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {project.features.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold [font-family:var(--font-display)]" style={{ color: project.brandColor }}>
              Main features & Contribution
            </h2>
            <div className="mt-4 space-y-6">
              {project.features.map((feature) => (
                <div
                  key={feature.title}
                  className="border-l-2 pl-4"
                  style={{ borderColor: project.brandColor }}
                >
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.troubleshooting.length > 0 && (
          <section className="mt-12 space-y-10">
            <h2 className="text-xl font-bold [font-family:var(--font-display)]" style={{ color: project.brandColor }}>
              Troubleshooting
            </h2>
            {project.troubleshooting.map((entry) => (
              <TroubleshootingBlock key={entry.title} entry={entry} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
