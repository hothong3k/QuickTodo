'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Loader2, Check } from 'lucide-react'
import { PRIORITY_CONFIG, getPriorityDotClass } from '@/components/priority-picker'

interface TodoFormProps {
  onAdd: (title: string, priority: number) => Promise<void>
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState(4)
  const [isPending, setIsPending] = useState(false)
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Đóng popover khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isPending) return

    setIsPending(true)
    try {
      await onAdd(title, priority)
      setTitle('')
      setPriority(4) // Reset về cấp 4 sau khi thêm
    } finally {
      setIsPending(false)
    }
  }

  const handleSelect = (level: number) => {
    setPriority(level)
    setOpen(false)
  }

  const dotClass = getPriorityDotClass(priority)

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-3">
      <div className="relative flex-1">
        {/* Nút chọn mức độ ưu tiên thay thế Pencil */}
        <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            disabled={isPending}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:bg-[var(--muted)] ${
              PRIORITY_CONFIG.find((p) => p.level === priority)?.ringColor ?? ''
            }`}
            title="Chọn mức độ ưu tiên"
          >
            <span className={`block h-3.5 w-3.5 rounded-full ${dotClass} transition-colors shadow-sm`} />
          </button>

          {/* Popover chọn nhanh */}
          {open && (
            <div className="absolute left-0 top-full mt-2 w-56 animate-in fade-in slide-in-from-top-1 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-3 shadow-xl">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] opacity-80">
                Mức độ ưu tiên
              </p>
              <div className="space-y-0.5">
                {PRIORITY_CONFIG.map((p) => (
                  <button
                    key={p.level}
                    type="button"
                    onClick={() => handleSelect(p.level)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 ${
                      priority === p.level
                        ? 'bg-blue-500/10'
                        : 'hover:bg-[var(--muted)]'
                    }`}
                  >
                    <span className={`block h-3 w-3 shrink-0 rounded-full ${p.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {p.label}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">{p.description}</p>
                    </div>
                    {priority === p.level && (
                      <Check size={16} className="shrink-0 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Việc cần làm của bạn là ... "
          disabled={isPending}
          className="h-14 w-full rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] pl-12 pr-4 text-base text-[var(--foreground)] shadow-sm outline-none transition-all duration-200 placeholder:text-[var(--muted-foreground)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !title.trim()}
        className="flex h-14 shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-6 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Plus size={16} />
        )}
        Thêm
      </button>
    </form>
  )
}

