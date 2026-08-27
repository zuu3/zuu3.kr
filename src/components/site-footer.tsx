"use client";

import { Copy, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 text-sm">
        <p className="font-semibold text-neutral-900">{profile.name}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="h-auto gap-1.5 rounded-full border-[#ff6f0f] px-3.5 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-[#ff6f0f]/10"
            nativeButton={false}
            render={<a href="/docs/resume.pdf" target="_blank" rel="noreferrer" download />}
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
            이력서 PDF
          </Button>
          <Button
            variant="outline"
            className="h-auto gap-1.5 rounded-full border-[#ff6f0f] px-3.5 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-[#ff6f0f]/10"
            nativeButton={false}
            render={<a href="/docs/portfolio.pdf" target="_blank" rel="noreferrer" download />}
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
            포트폴리오 PDF
          </Button>
        </div>
      </div>
      <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center gap-1 text-sm text-neutral-500">
          <Button
            variant="ghost"
            className="h-auto gap-1.5 px-2 py-1 text-sm font-normal text-neutral-500 hover:bg-transparent hover:text-[#ff6f0f]"
            nativeButton={false}
            render={<a href={`mailto:${profile.email}`} />}
          >
            <Mail className="h-4 w-4" strokeWidth={1.75} />
            {profile.email}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="이메일 주소 복사"
            className="text-neutral-400 hover:bg-transparent hover:text-[#ff6f0f]"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(profile.email);
                toast.success("이메일 주소를 복사했습니다.");
              } catch {
                toast.error("복사에 실패했습니다.");
              }
            }}
          >
            <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Button>
          <Button
            variant="ghost"
            className="h-auto gap-1.5 px-2 py-1 text-sm font-normal text-neutral-500 hover:bg-transparent hover:text-[#ff6f0f]"
            nativeButton={false}
            render={<a href="https://github.com/zuu3" target="_blank" rel="noreferrer" />}
          >
            <GithubIcon className="h-4 w-4" />
            github.com/zuu3
          </Button>
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-xs text-neutral-400">
        © {new Date().getFullYear()} {profile.name}. All rights reserved.
      </p>
    </footer>
  );
}
