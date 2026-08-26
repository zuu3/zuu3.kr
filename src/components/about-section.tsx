import Image from "next/image";
import type { profile as ProfileType } from "@/lib/content";

function collectByYear(profile: typeof ProfileType) {
  const map = new Map<string, string[]>();
  const push = (year: string, item: string) => {
    map.set(year, [...(map.get(year) ?? []), item]);
  };
  for (const group of profile.awards) group.items.forEach((item) => push(group.year, item));
  for (const group of profile.activities) group.items.forEach((item) => push(group.year, item));
  for (const group of profile.certificates) group.items.forEach((item) => push(group.year, item));
  for (const group of profile.leadership) group.items.forEach((item) => push(group.year, item));
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export function AboutSection({ profile }: { profile: typeof ProfileType }) {
  const byYear = collectByYear(profile);

  return (
    <section className="border-t border-neutral-200 px-6 py-20 md:px-16 lg:px-24">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 md:flex-row">
        <div className="w-32 shrink-0">
          <div className="relative aspect-square w-32 overflow-hidden rounded-[var(--radius-control)] bg-neutral-100">
            <Image
              src="/profile-photo.jpg"
              alt={`${profile.name} 프로필 사진`}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
          <p className="mt-4 text-sm text-neutral-500">{profile.school}</p>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-black [font-family:var(--font-display)]">About</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-500">{profile.bio}</p>
          <div className="mt-8 space-y-5">
            {byYear.map(([year, items]) => (
              <div key={year}>
                <p className="text-sm font-bold text-neutral-400">{year}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="rounded-[var(--radius-control)] bg-[#f6f6f6] px-3 py-1.5 text-xs text-neutral-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
