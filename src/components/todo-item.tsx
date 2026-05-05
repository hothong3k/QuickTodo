'use client'

import { useState, useTransition } from 'react'
import { toggleTodo, updateTodo, deleteTodo } from '@/actions/todo-actions'
import PriorityPicker, { getPriorityBorderClass } from '@/components/priority-picker'
import { Pencil, Trash2, Check, X, Loader2 } from 'lucide-react'
import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [isPending, startTransition] = useTransition()

  const borderClass = getPriorityBorderClass(todo.priority)

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTodo(todo.id)
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTodo(todo.id)
    })
  }

  const handleSave = () => {
    if (!editTitle.trim()) return
    startTransition(async () => {
      await updateTodo(todo.id, editTitle)
      setIsEditing(false)
    })
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  return (
    <div
      className={`group flex items-center gap-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-4 shadow-sm transition-all duration-200 hover:shadow-md ${borderClass} ${
        isPending ? 'opacity-50' : ''
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
          todo.isDone
            ? 'border-blue-500 bg-blue-500 text-white'
            : 'border-[var(--card-border)] hover:border-blue-500 bg-[var(--background)]'
        }`}
        aria-label={todo.isDone ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu hoàn thành'}
      >
        {todo.isDone && <Check size={14} strokeWidth={3} />}
      </button>

      {/* Tiêu đề hoặc input chỉnh sửa */}
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="min-w-0 flex-1 rounded-lg border border-blue-500 bg-transparent px-2 py-1 text-base font-semibold text-[var(--foreground)] outline-none ring-2 ring-blue-500/20"
        />
      ) : (
        <span
          className={`min-w-0 flex-1 break-words text-base font-semibold transition-all duration-200 ${
            todo.isDone
              ? 'text-[var(--muted-foreground)] line-through opacity-60'
              : 'text-[var(--foreground)]'
          }`}
        >
          {todo.title}
        </span>
      )}

      {/* Action buttons */}
      <div className="flex shrink-0 items-center gap-1">
        {/* Priority dot */}
        <PriorityPicker todoId={todo.id} currentPriority={todo.priority} />

        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-green-500 transition-colors hover:bg-green-500/10"
              aria-label="Lưu"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            </button>
            <button
              onClick={handleCancel}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              aria-label="Huỷ"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-blue-500"
              aria-label="Chỉnh sửa"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-500"
              aria-label="Xoá"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
