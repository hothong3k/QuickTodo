import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import AuthButton from "@/components/auth-button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-[var(--background)] px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-black tracking-tighter text-title uppercase transition-opacity hover:opacity-80">
          QUICKTODO
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            Trang Chủ
          </Link>
          <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">
            Liên Hệ
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <AuthButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
