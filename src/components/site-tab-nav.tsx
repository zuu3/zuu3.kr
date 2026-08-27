"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home", key: "home" },
  { href: "/blog", label: "Blog", key: "blog" },
] as const;

export function SiteTabNav() {
  const pathname = usePathname();
  const active = pathname.startsWith("/blog") ? "blog" : "home";

  return (
    <nav className="fixed top-6 left-6 z-50 inline-flex w-fit gap-1 rounded-[var(--radius-control)] bg-white/90 p-1 shadow-sm backdrop-blur-sm md:top-8 md:left-8">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-[calc(var(--radius-control)-2px)] px-4 py-1.5 text-sm font-bold transition-colors ${
              isActive
                ? "bg-neutral-900 text-white"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
