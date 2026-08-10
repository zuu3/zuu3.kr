"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { profile as ProfileType } from "@/lib/content";

type TimelineGroup = { year: string; items: string[] };

function TimelineBlock({ label, groups }: { label: string; groups: TimelineGroup[] }) {
  return (
    <div className="awards-block">
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

export function AwardsSection({ profile }: { profile: typeof ProfileType }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(".awards-block", { opacity: 0, y: 28 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
      tl.to(headingRef.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.7,
        ease: "power3.out",
      }).to(
        ".awards-block",
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="mt-28">
      <h2 ref={headingRef} className="text-2xl font-black text-neutral-900 md:text-3xl">
        Awards &amp; Activities
      </h2>
      <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
        <TimelineBlock label="Awards" groups={profile.awards} />
        <TimelineBlock label="Activity" groups={profile.activities} />
        <TimelineBlock label="Certificates" groups={profile.certificates} />
        <TimelineBlock label="Leadership" groups={profile.leadership} />
      </div>
    </section>
  );
}
