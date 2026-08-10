import { TroubleshootingBlock } from "@/components/troubleshooting-block";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/content";

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <main
      className="min-h-screen px-6 py-16"
      style={{ ["--brand" as string]: project.brandColor }}
    >
      <div className="mx-auto max-w-4xl">
        <div
          className="h-1.5 w-16 rounded-full"
          style={{ backgroundColor: project.brandColor }}
        />
        <p className="mt-4 text-sm font-medium" style={{ color: project.brandColor }}>
          {project.tagline}
        </p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">{project.name}</h1>
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
            <h2 className="text-xl font-bold" style={{ color: project.brandColor }}>
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
            <h2 className="text-xl font-bold" style={{ color: project.brandColor }}>
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
            <h2 className="text-xl font-bold" style={{ color: project.brandColor }}>
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
