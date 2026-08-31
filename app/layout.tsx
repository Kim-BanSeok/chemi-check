import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "케미체크 - 이름, MBTI, 취향으로 보는 관계 궁합",
  description: "연인, 썸, 친구, 동료와 함께 답하고 두 사람만의 상세 케미 리포트를 확인해보세요.",
  verification: {
    google: "lSJTeWuV8EZQIBkHAfSRPQlK59uyaYjsnYH_DhIv2r4",
    other: {
      "naver-site-verification": "b0659947030829400a819f9d3a607d3feb044c3e",
    },
  },
  other: {
    "google-adsense-account": "ca-pub-7373977880685678",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
