'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Tránh hydration mismatch – chỉ render sau khi mount ở client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
        aria-label="Toggle theme"
      >
        <Sun size={14} />
        <span>Sáng</span>
      </button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:bg-zinc-50 hover:shadow dark:border-white/10 dark:bg-white/5 dark:text-white dark:backdrop-blur-sm dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Sun size={14} className="text-amber-400" />
          <span>Sáng</span>
        </>
      ) : (
        <>
          <Moon size={14} className="text-indigo-500" />
          <span>Tối</span>
        </>
      )}
    </button>
  )
}
