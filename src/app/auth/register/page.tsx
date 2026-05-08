'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Vui lòng điền đầy đủ thông tin.')
      return
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }
    setError('')
    setIsPending(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? 'Đăng ký thất bại, vui lòng thử lại.')
        return
      }
      // Đăng ký xong → tự đăng nhập luôn
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/',
      })
      if (result?.error) {
        router.push('/auth/signin')
      } else {
        router.push('/')
        router.refresh()
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4">
      {/* Logo */}
      <Link
        href="/"
        className="mb-8 text-2xl font-black tracking-tighter text-title uppercase hover:opacity-80 transition-opacity"
      >
        QUICKTODO
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-xl">
        <h2 className="mb-1 text-2xl font-bold text-[var(--foreground)]">Tạo tài khoản</h2>
        <p className="mb-6 text-sm text-[var(--muted-foreground)]">
          Đăng ký để sync todo của bạn trên nhiều thiết bị.
        </p>

        {/* Lỗi */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Tên hiển thị
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                <User size={16} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                className="h-12 w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-[var(--muted-foreground)]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Email
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="h-12 w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-[var(--muted-foreground)]"
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Mật khẩu
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                <Lock size={16} />
              </span>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                autoComplete="new-password"
                className="h-12 w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] pl-10 pr-12 text-sm text-[var(--foreground)] outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-[var(--muted-foreground)]"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                aria-label={showPw ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-60"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
            Tạo tài khoản
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          Đã có tài khoản?{' '}
          <Link
            href="/auth/signin"
            className="font-semibold text-blue-500 hover:text-blue-400 transition-colors"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}
