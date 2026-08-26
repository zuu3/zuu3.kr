import Link from "next/link";
import { Dithered404 } from "@/components/ui/dithered-404";

export default function NotFound() {
  return (
    <section className="relative isolate min-h-svh overflow-hidden bg-[#0b0b12]">
      <Dithered404 color="#0cefd3" theme="dark" />
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-end gap-4 px-6 pb-20 text-center">
        <p className="text-sm text-white/50">페이지를 찾을 수 없습니다.</p>
        <Link
          href="/"
          className="text-sm font-medium text-white underline underline-offset-4 transition-colors hover:text-[#0cefd3]"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </section>
  );
}
