import Link from "next/link";
import { Dithered404 } from "@/components/ui/dithered-404";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative isolate min-h-svh overflow-hidden bg-[#0b0b12]">
      <Dithered404 color="#ffffff" theme="dark" />
      <div className="pointer-events-none relative z-10 flex min-h-svh flex-col items-center justify-end gap-4 px-6 pb-20 text-center">
        <p className="text-sm text-white/50">페이지를 찾을 수 없습니다.</p>
        <Button
          variant="outline"
          className="pointer-events-auto border-white/20 bg-white/5 text-white hover:bg-white/10"
          nativeButton={false}
          render={<Link href="/" />}
        >
          홈으로 돌아가기
        </Button>
      </div>
    </section>
  );
}
