import { Mail, Phone } from "lucide-react";
import type { profile as ProfileType } from "@/lib/content";

// lucide-react dropped brand icons; GitHub mark inlined instead of adding a dependency.
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-1.94c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.15v3.19c0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function SiteFooter({ profile }: { profile: typeof ProfileType }) {
  return (
    <footer className="border-t border-neutral-200 px-6 py-10 md:px-16 lg:pl-72 lg:pr-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-neutral-900">{profile.name}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-neutral-500">
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-1.5 transition-colors hover:text-[#0cefd3]"
          >
            <Mail className="h-4 w-4" strokeWidth={1.75} />
            {profile.email}
          </a>
          <a
            href="https://github.com/zuu3"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-[#0cefd3]"
          >
            <GithubIcon className="h-4 w-4" />
            github.com/zuu3
          </a>
          <span className="flex items-center gap-1.5">
            <Phone className="h-4 w-4" strokeWidth={1.75} />
            {profile.phone}
          </span>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-xs text-neutral-400">
        © {new Date().getFullYear()} {profile.name}. All rights reserved.
      </p>
    </footer>
  );
}
