"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { profile as ProfileType } from "@/lib/content";

type TimelineGroup = { year: string; items: string[] };

function TimelineBlock({ label, groups }: { label: string; groups: TimelineGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <div className="about-block">
      <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#0cefd3]" />
        {label}
      </h3>
      <div className="mt-3 space-y-3">
        {groups.map((group) => (
          <div key={group.year}>
            <p className="text-sm font-semibold text-neutral-400">{group.year}</p>
            <ul className="mt-1 space-y-1 text-[15px] leading-relaxed text-neutral-600">
              {group.items.map((item) => (
                <li key={item} className="flex items-start gap-1.5">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-300" />
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

export function AboutSection({ profile }: { profile: typeof ProfileType }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set([".profile-block", ".about-block"], { opacity: 0, y: 24 });
      gsap.to([".profile-block", ".about-block"], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-t border-neutral-200 px-6 py-20 md:px-16 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="profile-block">
            <div className="relative aspect-3/4 w-40 overflow-hidden rounded-[var(--radius-control)] bg-neutral-100">
              <Image
                src="/profile-photo.jpg"
                alt={`${profile.name} 프로필 사진`}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
            <p className="mt-5 text-2xl font-black text-balance text-neutral-900 [font-family:var(--font-display)]">
              {profile.tagline}
            </p>
            <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-neutral-500">{profile.bio}</p>
            <div className="mt-5 space-y-1 text-sm text-neutral-500">
              <p>{profile.school}</p>
              <p>{profile.email}</p>
              <p>{profile.phone}</p>
            </div>
          </div>

          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            <TimelineBlock label="Awards" groups={profile.awards} />
            <TimelineBlock label="Activity" groups={profile.activities} />
            <TimelineBlock label="Certificates" groups={profile.certificates} />
            <TimelineBlock label="Leadership" groups={profile.leadership} />
          </div>
        </div>
      </div>
    </section>
  );
}
