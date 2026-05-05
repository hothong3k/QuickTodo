'use client'

import { useState, useTransition } from 'react'
import { addTodo } from '@/actions/todo-actions'
import { Plus, Loader2, Pencil } from 'lucide-react'

export default function TodoForm() {
  const [title, setTitle] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    startTransition(async () => {
      await addTodo(title)
      setTitle('')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-3">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
          <Pencil size={18} />
        </span>
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
