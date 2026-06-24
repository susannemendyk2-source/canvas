import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polaris",
  description: "Polaris 是面向 AI 图像、视频与节点工作流的星图式创作系统。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Theme appearance="dark" accentColor="cyan" radius="medium">
          {children}
        </Theme>
      </body>
    </html>
  );
}
