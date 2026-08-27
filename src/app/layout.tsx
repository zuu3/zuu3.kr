import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-sans",
  weight: "45 920",
  display: "swap",
});

const title = "오주현 | 스펀지 같은 개발자";
const description =
  "프론트엔드 개발자 오주현의 포트폴리오. 새로운 기술을 빠르게 흡수하고 팀에 필요할 때 꺼내 쓰는 스펀지 같은 개발자입니다.";

export const metadata: Metadata = {
  metadataBase: new URL("https://zuu3.kr"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://zuu3.kr",
    siteName: "오주현 포트폴리오",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:rounded-[var(--radius-control)] focus-visible:bg-[#ff6f0f] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-bold focus-visible:text-white focus-visible:outline-none"
        >
          본문으로 바로가기
        </a>
        <SmoothScroll />
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
