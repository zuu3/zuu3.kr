import Link from "next/link";

const TABS = [
  { href: "/", label: "Home", key: "home" },
  { href: "/blog", label: "Blog", key: "blog" },
] as const;

export function SiteTabNav({ active }: { active: (typeof TABS)[number]["key"] }) {
  return (
    <nav className="flex items-center gap-5 border-b border-neutral-200">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`border-b-2 pb-3 text-sm font-bold tracking-tight transition-colors ${
              isActive
                ? "border-[#ff6f0f] text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
