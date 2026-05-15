import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import ThemeProvider from "@/components/theme-provider";
import NextAuthProvider from "@/components/session-provider";
import Header from "@/components/header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "QuickTodo – Quản lý công việc nhanh gọn",
  description:
    "Không tải app linh tinh, không đăng nhập vẫn dùng được. Chỉ cần tập trung tạo nhanh task cho todolist thôi!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <NextAuthProvider>
          <ThemeProvider>
            <Header />
            {children}
          </ThemeProvider>
        </NextAuthProvider>
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}
