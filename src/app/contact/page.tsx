import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col bg-[var(--background)] py-12">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 items-center justify-center">
        <div className="mb-12 text-center">
          <div className="w-32 h-32 relative mx-auto mb-6">
            <Image
              src="/avatar.png"
              alt="Hồ Mai Duy Thống"
              fill
              sizes="128px"
              className="rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-xl"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-title mb-4">
            Về người làm web
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Xin chào! Mình là <strong>Hồ Mai Duy Thống (HoThong3K)</strong>, người phát triển trang web QuickTodo này.
            Dự án này được tạo ra với mục đích mang lại một công cụ quản lý công việc đơn giản, tiện lợi và không rườm rà.
          </p>
        </div>

        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-12 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-center text-zinc-900 dark:text-zinc-100">Thông tin liên hệ</h2>
          <div className="space-y-4">
            <a href="mailto:homaiduythong18106@gmail.com" className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700">
              <Mail className="w-6 h-6 text-blue-500" />
              <span className="font-medium text-zinc-900 dark:text-zinc-100">homaiduythong18106@gmail.com</span>
            </a>
            <a href="https://github.com/hothong3k" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700">
              <Image src="/github.svg" alt="GitHub" width={24} height={24} className="dark:invert" />
              <span className="font-medium text-zinc-900 dark:text-zinc-100">github.com/hothong3k</span>
            </a>
            <a href="https://www.linkedin.com/in/hothong/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700">
              <Image src="/linkedin-circle.svg" alt="LinkedIn" width={24} height={24} />
              <span className="font-medium text-zinc-900 dark:text-zinc-100">linkedin.com/in/hothong</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-center"
          >
            Trang Chủ
          </Link>
          <Link
            href="/todo"
            className="w-full sm:w-auto px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded-lg font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-center"
          >
            Thử QuickTodo
          </Link>
        </div>
      </main>

      <footer className="mt-12 border-t border-zinc-200 py-6 text-center dark:border-zinc-800">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
          2026 – HO THONG 3K
        </p>
      </footer>
    </div>
  );
}
