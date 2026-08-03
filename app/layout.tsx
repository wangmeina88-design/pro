import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "王美娜 — UI/UX Designer",
  description: "王美娜的 UI/UX 个人作品集：让复杂业务变成清晰而有价值的产品体验。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
