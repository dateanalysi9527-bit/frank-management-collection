import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const shareImage = `${protocol}://${host}/og.png`;

  return {
    title: "Frank分享经管知识合集",
    description: "把值得反复阅读的经营管理文章，整理成一个清晰、好用的专题合集。",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Frank分享经管知识合集",
      description: "36 篇精选 · 经营分析 · 数字化与 AI · 管理认知",
      type: "website",
      locale: "zh_CN",
      images: [{ url: shareImage, width: 1200, height: 630, alt: "Frank分享经管知识合集" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Frank分享经管知识合集",
      description: "36 篇精选 · 经营分析 · 数字化与 AI · 管理认知",
      images: [shareImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
