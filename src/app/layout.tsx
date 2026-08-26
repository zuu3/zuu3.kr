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

const paperlogy = localFont({
  src: [
    { path: "./fonts/paperlogy/Paperlogy-1Thin.woff2", weight: "100" },
    { path: "./fonts/paperlogy/Paperlogy-2ExtraLight.woff2", weight: "200" },
    { path: "./fonts/paperlogy/Paperlogy-3Light.woff2", weight: "300" },
    { path: "./fonts/paperlogy/Paperlogy-4Regular.woff2", weight: "400" },
    { path: "./fonts/paperlogy/Paperlogy-5Medium.woff2", weight: "500" },
    { path: "./fonts/paperlogy/Paperlogy-6SemiBold.woff2", weight: "600" },
    { path: "./fonts/paperlogy/Paperlogy-7Bold.woff2", weight: "700" },
    { path: "./fonts/paperlogy/Paperlogy-8ExtraBold.woff2", weight: "800" },
    { path: "./fonts/paperlogy/Paperlogy-9Black.woff2", weight: "900" },
  ],
  variable: "--font-display",
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
    <html lang="ko" className={`${pretendard.variable} ${paperlogy.variable}`}>
      <body>
        <SmoothScroll />
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
