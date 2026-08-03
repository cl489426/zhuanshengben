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
    description: "面向 2027 陕西统招专升本考生的一页式学习导航：每周自动计划、理工科课程、可下载电子题库、官方公告检查与原创预测套卷。",
    openGraph: {
      title: "陕西专升本 · 学习地图",
      description: "英语高数课程、可下载电子题库、每周自动计划与冲刺套卷。",
      type: "website",
      locale: "zh_CN",
      images: [{ url: imageUrl, width: 1733, height: 908, alt: "陕西专升本学习地图" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "陕西专升本 · 学习地图",
      description: "英语高数课程、可下载电子题库、每周自动计划与冲刺套卷。",
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
