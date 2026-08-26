"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { profile as ProfileType } from "@/lib/content";

type TimelineGroup = { year: string; items: string[] };

function TimelineBlock({ label, groups }: { label: string; groups: TimelineGroup[] }) {
  return (
    <div className="awards-block">
      <h3 className="flex items-center gap-2 text-xl font-bold text-neutral-900">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#0cefd3]" />
        {label}
      </h3>
      <div className="mt-3 space-y-3">
        {groups.map((group) => (
          <div key={group.year}>
            <p className="text-sm font-semibold text-muted-foreground">{group.year}</p>
            <ul className="mt-1 space-y-1 text-[15px] leading-relaxed">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="group flex items-start gap-1.5 transition-colors hover:text-[#0cefd3]"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#0cefd3] transition-transform group-hover:translate-x-0.5"
                  />
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

export function AwardsSection({ profile }: { profile: typeof ProfileType }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set([".profile-block", ".awards-block"], { opacity: 0, y: 28 });

      gsap.to([".profile-block", ".awards-block"], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef}>
      <div className="grid gap-x-10 gap-y-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="profile-block">
          <div className="relative aspect-3/4 w-40 overflow-hidden rounded-[var(--radius-card)] bg-neutral-100">
            <Image
              src="/profile-photo.jpg"
              alt={`${profile.name} 프로필 사진`}
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
          <p className="mt-5 text-2xl font-black text-balance text-neutral-900 [font-family:var(--font-display)] md:text-3xl">
            {profile.tagline}
          </p>
          <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
            {profile.bio}
          </p>
          <div className="mt-5 space-y-1 text-sm text-neutral-500">
            <p>{profile.birthdate}</p>
            <p>{profile.phone}</p>
            <p>{profile.email}</p>
            <p>{profile.school}</p>
          </div>
        </div>

        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          <TimelineBlock label="Awards" groups={profile.awards} />
          <TimelineBlock label="Activity" groups={profile.activities} />
          <TimelineBlock label="Certificates" groups={profile.certificates} />
          <TimelineBlock label="Leadership" groups={profile.leadership} />
        </div>
      </div>
    </section>
  );
}
