import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "升本地图｜陕西专升本学习资源与备考路线",
    description: "面向 2027 陕西统招专升本考生的一页式学习导航：理工科知识点课程、免费视频、可打印配套试卷与七个月复习计划。",
    openGraph: {
      title: "陕西专升本 · 学习地图",
      description: "理工科知识点课程、免费视频、配套 PDF 试卷与 7 个月备考路线。",
      type: "website",
      locale: "zh_CN",
      images: [{ url: imageUrl, width: 1733, height: 908, alt: "陕西专升本学习地图" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "陕西专升本 · 学习地图",
      description: "理工科知识点课程、免费视频、配套 PDF 试卷与 7 个月备考路线。",
      images: [imageUrl],
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
