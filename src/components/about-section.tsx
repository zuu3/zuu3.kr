"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { profile as ProfileType } from "@/lib/content";

type Entry = { year: string; category: string; item: string };

function mergeTimeline(profile: typeof ProfileType): Entry[] {
  const entries: Entry[] = [];
  const add = (category: string, groups: { year: string; items: string[] }[]) => {
    for (const group of groups) for (const item of group.items) entries.push({ year: group.year, category, item });
  };
  add("Award", profile.awards);
  add("Activity", profile.activities);
  add("Certificate", profile.certificates);
  add("Leadership", profile.leadership);
  return entries.sort((a, b) => b.year.localeCompare(a.year));
}

export function AboutSection({ profile }: { profile: typeof ProfileType }) {
  const sectionRef = useRef<HTMLElement>(null);
  const timeline = mergeTimeline(profile);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(".about-row", { opacity: 0, y: 14 });
      gsap.to(".about-row", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-t border-neutral-200 px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-x-14 gap-y-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div>
            <div className="relative aspect-3/4 w-40 overflow-hidden rounded-[var(--radius-control)] bg-neutral-100">
              <Image
                src="/profile-photo.jpg"
                alt={`${profile.name} 프로필 사진`}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
            <p className="mt-8 text-xs font-bold tracking-wide text-neutral-400 uppercase">About</p>
            <h2 className="mt-1 max-w-[22ch] text-2xl leading-snug font-bold text-neutral-900 [font-family:var(--font-display)] md:text-[1.75rem]">
              {profile.tagline}
            </h2>
            <p className="mt-4 max-w-[40ch] text-base leading-relaxed font-normal text-neutral-500">
              {profile.bio}
            </p>
            <div className="mt-5 space-y-1 text-sm text-neutral-500">
              <p>{profile.birthdate}</p>
              <p>{profile.school}</p>
              <p>{profile.email}</p>
              <p>{profile.phone}</p>
            </div>
          </div>

          <div className="divide-y divide-neutral-200">
            {timeline.map((entry, i) => (
              <div
                key={`${entry.year}-${entry.category}-${i}`}
                className="about-row flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <span className="w-12 shrink-0 text-sm font-bold text-neutral-400">{entry.year}</span>
                <span className="w-24 shrink-0 text-xs font-bold tracking-wide text-neutral-400 uppercase">
                  {entry.category}
                </span>
                <span className="text-sm leading-relaxed text-neutral-700">{entry.item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
