'use client'

import { useState, useRef, useEffect } from 'react'
import { updatePriority } from '@/actions/todo-actions'
import { useTransition } from 'react'
import { Check } from 'lucide-react'

// Cấu hình 4 cấp ưu tiên theo giao diện
const PRIORITY_CONFIG = [
  {
    level: 1,
    label: 'Cấp 1',
    description: 'Rất quan trọng, khẩn cấp',
    color: 'bg-red-500',
    ringColor: 'ring-red-500/30',
  },
  {
    level: 2,
    label: 'Cấp 2',
    description: 'Quan trọng, cần làm sớm',
    color: 'bg-orange-500',
    ringColor: 'ring-orange-500/30',
  },
  {
    level: 3,
    label: 'Cấp 3',
    description: 'Bình thường, không gấp',
    color: 'bg-blue-500',
    ringColor: 'ring-blue-500/30',
  },
  {
    level: 4,
    label: 'Cấp 4',
    description: 'Không khẩn cấp',
    color: 'bg-zinc-400',
    ringColor: 'ring-zinc-400/30',
  },
]

// Hàm lấy CSS class cho chấm màu ưu tiên
export function getPriorityDotClass(priority: number): string {
  const config = PRIORITY_CONFIG.find((p) => p.level === priority)
  return config?.color ?? 'bg-zinc-400'
}

// Hàm lấy màu border theo ưu tiên
export function getPriorityBorderClass(priority: number): string {
  switch (priority) {
    case 1:
      return 'border-red-500/60 dark:border-red-500/50'
    case 2:
      return 'border-orange-500/60 dark:border-orange-500/50'
    case 3:
      return 'border-blue-500/60 dark:border-blue-500/50'
    default:
      return 'border-zinc-200 dark:border-zinc-700'
  }
}

interface PriorityPickerProps {
  todoId: string
  currentPriority: number
}

export default function PriorityPicker({ todoId, currentPriority }: PriorityPickerProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
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

  const handleSelect = (level: number) => {
    if (level === currentPriority) {
      setOpen(false)
      return
    }
    startTransition(async () => {
      await updatePriority(todoId, level)
      setOpen(false)
    })
  }

  const dotClass = getPriorityDotClass(currentPriority)

  return (
    <div className="relative" ref={popoverRef}>
      {/* Chấm màu ưu tiên – click để mở popover */}
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 hover:ring-2 hover:ring-offset-1 dark:hover:ring-offset-zinc-800 ${
          PRIORITY_CONFIG.find((p) => p.level === currentPriority)?.ringColor ?? ''
        }`}
        aria-label="Chọn mức độ ưu tiên"
        title="Đổi mức độ ưu tiên"
      >
        <span className={`block h-3 w-3 rounded-full ${dotClass} transition-colors`} />
      </button>

      {/* Popover dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 animate-in fade-in slide-in-from-top-1 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-3 shadow-xl">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] opacity-80">
            Mức độ ưu tiên
          </p>
          <div className="space-y-0.5">
            {PRIORITY_CONFIG.map((p) => (
              <button
                key={p.level}
                onClick={() => handleSelect(p.level)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ${
                  currentPriority === p.level
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
                {currentPriority === p.level && (
                  <Check size={16} className="shrink-0 text-blue-500" />
                )}
              </button>
            ))}
          </div>
          <p className="mt-2 border-t border-[var(--card-border)] pt-2 text-center text-[10px] font-medium text-[var(--muted-foreground)] opacity-60">
            Chọn mức độ để lưu
          </p>
        </div>
      )}
    </div>
  )
}
