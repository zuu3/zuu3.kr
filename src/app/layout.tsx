import type { Metadata } from "next";
import { Jua, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const jua = Jua({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
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
    <html lang="ko" className={`${notoSansKr.variable} ${jua.variable}`}>
      <body>{children}</body>
    </html>
  );
}
