import type { profile as ProfileType } from "@/lib/content";

export function SiteFooter({ profile }: { profile: typeof ProfileType }) {
  return (
    <footer className="mt-40 flex min-h-[70vh] flex-col justify-end px-6 py-16 md:px-16 lg:px-24">
      <p className="text-3xl font-black text-neutral-900 [font-family:var(--font-display)] md:text-5xl">
        같이 만들어봐요.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500">
        <a href={`mailto:${profile.email}`} className="hover:text-neutral-900">
          {profile.email}
        </a>
        <span>·</span>
        <span>{profile.phone}</span>
        <span>·</span>
        <span>© {new Date().getFullYear()} {profile.name}</span>
      </div>
    </footer>
  );
}
