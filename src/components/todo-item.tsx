'use client'

import { useState, type KeyboardEvent } from 'react'
import PriorityPicker, { getPriorityBorderClass } from '@/components/priority-picker'
import {
  Check,
  FileText,
  Loader2,
  Pencil,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import {
  TODO_DESCRIPTION_MAX_LENGTH,
  TODO_DESCRIPTION_PREVIEW_LENGTH,
  TODO_TITLE_MAX_LENGTH,
  type Todo,
} from '@/types'

interface TodoItemProps {
  todo: Todo
  isLoggedIn: boolean
  onToggle: (id: string) => Promise<void>
  onUpdate: (id: string, title: string) => Promise<void>
  onUpdateDescription: (id: string, description: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onPriorityChange: (id: string, priority: number) => Promise<void>
  onRequireLoginForDescription: () => void
}

function getDescriptionPreview(description?: string) {
  const cleanDescription = description?.trim() ?? ''
  if (!cleanDescription) return ''
  if (cleanDescription.length <= TODO_DESCRIPTION_PREVIEW_LENGTH) {
    return cleanDescription
  }
  return `${cleanDescription.slice(0, TODO_DESCRIPTION_PREVIEW_LENGTH).trimEnd()}...`
}

export default function TodoItem({
  todo,
  isLoggedIn,
  onToggle,
  onUpdate,
  onUpdateDescription,
  onDelete,
  onPriorityChange,
  onRequireLoginForDescription,
}: TodoItemProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDescription, setEditingDescription] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description ?? '')
  const [pendingAction, setPendingAction] = useState<'toggle' | 'delete' | 'title' | 'description' | null>(null)

  const borderClass = getPriorityBorderClass(todo.priority)
  const descriptionPreview = getDescriptionPreview(todo.description)
  const isPending = pendingAction !== null

  const withPending = async (
    action: NonNullable<typeof pendingAction>,
    fn: () => Promise<void>
  ) => {
    setPendingAction(action)
    try {
      await fn()
    } finally {
      setPendingAction(null)
    }
  }

  const handleToggle = () => withPending('toggle', () => onToggle(todo.id))
  const handleDelete = () => withPending('delete', () => onDelete(todo.id))

  const handleTitleSave = () => {
    const cleanTitle = editTitle.trim().slice(0, TODO_TITLE_MAX_LENGTH)
    if (!cleanTitle) return

    withPending('title', async () => {
      await onUpdate(todo.id, cleanTitle)
      setEditTitle(cleanTitle)
      setEditingTitle(false)
    })
  }

  const handleDescriptionEdit = () => {
    if (!isLoggedIn) {
      onRequireLoginForDescription()
      return
    }
    setEditingDescription(true)
  }

  const handleDescriptionSave = () => {
    if (!isLoggedIn) {
      onRequireLoginForDescription()
      return
    }

    const cleanDescription = editDescription.trim().slice(0, TODO_DESCRIPTION_MAX_LENGTH)
    withPending('description', async () => {
      await onUpdateDescription(todo.id, cleanDescription)
      setEditDescription(cleanDescription)
      setEditingDescription(false)
    })
  }

  const handleTitleCancel = () => {
    setEditTitle(todo.title)
    setEditingTitle(false)
  }

  const handleDescriptionCancel = () => {
    setEditDescription(todo.description ?? '')
    setEditingDescription(false)
  }

  const handleTitleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSave()
    if (e.key === 'Escape') handleTitleCancel()
  }

  const detailContent = (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
            Chi tiết công việc
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Cấp {todo.priority}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsDetailOpen(false)
            setEditingTitle(false)
            setEditingDescription(false)
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          aria-label="Đóng chi tiết"
        >
          <X size={18} />
        </button>
      </div>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[var(--muted-foreground)]">
            Tiêu đề
          </h3>
          {!editingTitle && (
            <button
              type="button"
              onClick={() => setEditingTitle(true)}
              className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-blue-500 transition-colors hover:bg-blue-500/10"
            >
              <Pencil size={14} />
              Sửa
            </button>
          )}
        </div>

        {editingTitle ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editTitle}
              maxLength={TODO_TITLE_MAX_LENGTH}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className="w-full rounded-lg border border-blue-500 bg-transparent px-3 py-2 text-base font-semibold text-[var(--foreground)] outline-none ring-2 ring-blue-500/20"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-[var(--muted-foreground)]">
                {editTitle.length}/{TODO_TITLE_MAX_LENGTH}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTitleCancel}
                  className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <X size={14} />
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleTitleSave}
                  disabled={pendingAction === 'title' || !editTitle.trim()}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                >
                  {pendingAction === 'title' ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  Lưu
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p
            className={`break-words text-lg font-bold text-[var(--foreground)] ${
              todo.isDone ? 'line-through opacity-60' : ''
            }`}
          >
            {todo.title}
          </p>
        )}
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[var(--muted-foreground)]">
            Mô tả
          </h3>
          {!editingDescription && (
            <button
              type="button"
              onClick={handleDescriptionEdit}
              className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-blue-500 transition-colors hover:bg-blue-500/10"
            >
              <Pencil size={14} />
              Sửa
            </button>
          )}
        </div>

        {editingDescription ? (
          <div className="space-y-2">
            <textarea
              value={editDescription}
              maxLength={TODO_DESCRIPTION_MAX_LENGTH}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={6}
              className="w-full resize-none rounded-lg border border-blue-500 bg-transparent px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-2 ring-blue-500/20"
              placeholder="Thêm mô tả cho công việc..."
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-[var(--muted-foreground)]">
                {editDescription.length}/{TODO_DESCRIPTION_MAX_LENGTH}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDescriptionCancel}
                  className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <X size={14} />
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleDescriptionSave}
                  disabled={pendingAction === 'description'}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                >
                  {pendingAction === 'description' ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  Lưu
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="min-h-20 whitespace-pre-wrap break-words rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm leading-6 text-[var(--foreground)]">
            {todo.description?.trim() || 'Chưa có mô tả.'}
          </p>
        )}
      </section>
    </div>
  )

  return (
    <>
      <div
        className={`group flex items-center gap-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-4 shadow-sm transition-all duration-200 hover:shadow-md ${borderClass} ${
          isPending ? 'opacity-50' : ''
        }`}
      >
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
            todo.isDone
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-[var(--card-border)] bg-[var(--background)] hover:border-blue-500'
          }`}
          aria-label={todo.isDone ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu hoàn thành'}
        >
          {todo.isDone && <Check size={14} strokeWidth={3} />}
        </button>

        <button
          type="button"
          onClick={() => setIsDetailOpen(true)}
          className="min-w-0 flex-1 text-left"
          aria-label="Mở chi tiết công việc"
        >
          <span
            className={`block break-words text-base font-semibold transition-all duration-200 ${
              todo.isDone
                ? 'text-[var(--muted-foreground)] line-through opacity-60'
                : 'text-[var(--foreground)]'
            }`}
          >
            {todo.title}
          </span>
          {descriptionPreview && (
            <span className="mt-1 block break-words text-sm leading-5 text-[var(--muted-foreground)]">
              {descriptionPreview}
            </span>
          )}
          {!descriptionPreview && (
            <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)] opacity-70">
              <FileText size={13} />
              Chi tiết
            </span>
          )}
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <PriorityPicker
            todoId={todo.id}
            currentPriority={todo.priority}
            onPriorityChange={(priority) => onPriorityChange(todo.id, priority)}
          />

          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-500"
            aria-label="Xoá"
          >
            {pendingAction === 'delete' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>

      {isDetailOpen && (
        <div className="lg:hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-sm">
          {detailContent}
        </div>
      )}

      {isDetailOpen && (
        <div className="hidden lg:block">
          <button
            type="button"
            aria-label="Đóng chi tiết"
            onClick={() => setIsDetailOpen(false)}
            className="fixed inset-0 z-40 bg-black/20"
          />
          <aside className="fixed right-0 top-0 z-50 h-dvh w-full max-w-md border-l border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-2xl">
            {detailContent}
          </aside>
        </div>
      )}
    </>
  )
}
