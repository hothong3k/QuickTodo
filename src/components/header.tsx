import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import AuthButton from "@/components/auth-button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-zinc-200 bg-[var(--background)] px-4 py-3 dark:border-zinc-800 md:px-6 md:py-4">
      <div className="flex min-w-0 items-center gap-6">
        <Link href="/" className="shrink-0 text-xl font-black tracking-tighter text-title uppercase transition-opacity hover:opacity-80 md:text-2xl">
          QUICKTODO
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            Trang Chủ
          </Link>
          <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">
            Liên Hệ
          </Link>
        </nav>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <AuthButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
