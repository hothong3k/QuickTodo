'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [isGooglePending, setIsGooglePending] = useState(false)

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin.')
      return
    }
    setError('')
    setIsPending(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })
      if (result?.error) {
        setError('Email hoặc mật khẩu không chính xác.')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } finally {
      setIsPending(false)
    }
  }

  const handleGoogle = async () => {
    setIsGooglePending(true)
    await signIn('google', { callbackUrl })
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
        <h2 className="mb-1 text-2xl font-bold text-[var(--foreground)]">Đăng nhập</h2>
        <p className="mb-6 text-sm text-[var(--muted-foreground)]">
          Chào mừng trở lại! Đăng nhập để sync todo của bạn.
        </p>

        {/* Lỗi */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Form Email/Password */}
        <form onSubmit={handleCredentials} className="space-y-4">
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
                placeholder="Mật khẩu của bạn"
                autoComplete="current-password"
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
            Đăng nhập
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--card-border)]" />
          <span className="text-xs font-medium text-[var(--muted-foreground)]">hoặc</span>
          <div className="h-px flex-1 bg-[var(--card-border)]" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={isGooglePending}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-sm font-semibold text-[var(--foreground)] transition-all hover:border-blue-500/50 hover:shadow-md disabled:opacity-60"
        >
          {isGooglePending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Tiếp tục với Google
        </button>

        {/* Link đăng ký */}
        <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          Chưa có tài khoản?{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-blue-500 hover:text-blue-400 transition-colors"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[var(--background)]" />}>
      <SignInForm />
    </Suspense>
  )
}
