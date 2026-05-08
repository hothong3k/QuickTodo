'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { LogIn, LogOut, User, ChevronDown, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  if (status === 'loading') {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted-foreground)]">
        <Loader2 size={18} className="animate-spin" />
      </div>
    )
  }

  // Chưa đăng nhập
  if (!session) {
    return (
      <Link
        href="/auth/signin"
        className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm transition-all duration-200 hover:border-blue-500 hover:text-blue-500 hover:shadow-md"
      >
        <LogIn size={16} />
        Đăng nhập
      </Link>
    )
  }

  // Đã đăng nhập
  const user = session.user
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--foreground)] shadow-sm transition-all duration-200 hover:border-blue-500/50 hover:shadow-md"
        aria-label="Menu tài khoản"
      >
        {/* Avatar */}
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name ?? 'Avatar'}
            width={26}
            height={26}
            className="rounded-full object-cover"
          />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
            {initials}
          </span>
        )}
        <span className="max-w-[120px] truncate hidden sm:inline">{user?.name ?? user?.email}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-[var(--muted-foreground)] transition-transform duration-200 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="animate-in absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-3 shadow-xl">
          {/* Thông tin user */}
          <div className="mb-2 flex items-center gap-3 rounded-lg bg-[var(--muted)] px-3 py-2.5">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? 'Avatar'}
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {initials}
              </span>
            )}
            <div className="min-w-0">
              {user?.name && (
                <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                  {user.name}
                </p>
              )}
              {user?.email && (
                <p className="truncate text-xs text-[var(--muted-foreground)]">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-0.5">
            <Link
              href="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
            >
              <User size={16} className="shrink-0 text-[var(--muted-foreground)]" />
              Tài khoản của tôi
            </Link>
            <button
              onClick={() => {
                setDropdownOpen(false)
                signOut({ callbackUrl: '/' })
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
            >
              <LogOut size={16} className="shrink-0" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
