import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-sans",
  weight: "45 920",
  display: "swap",
});

const paperlogy = localFont({
  src: "./fonts/Paperlogy-Black.woff2",
  variable: "--font-display",
  weight: "900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "오주현 | 스펀지 같은 개발자",
  description:
    "프론트엔드 개발자 오주현의 포트폴리오. 새로운 기술을 빠르게 흡수하고 팀에 필요할 때 꺼내 쓰는 스펀지 같은 개발자입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${paperlogy.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
