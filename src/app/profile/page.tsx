import Link from 'next/link'
import { ArrowLeft, Construction } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 text-center">
      <div className="flex max-w-md flex-col items-center rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-10 shadow-xl transition-all duration-300">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 ring-8 ring-blue-500/5">
          <Construction size={40} />
        </div>
        
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Đang phát triển
        </h2>
        
        <p className="mb-8 text-base leading-relaxed text-[var(--muted-foreground)]">
          Tính năng này đang được phát triển. Vui lòng quay lại sau nhé!
        </p>

        <Link
          href="/"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98]"
        >
          <ArrowLeft size={16} />
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  )
}
