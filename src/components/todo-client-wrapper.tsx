'use client'

import { useEffect, useState } from 'react'
import TodoForm from '@/components/todo-form'
import TodoList from '@/components/todo-list'
import { useTodoStore } from '@/store/todo-store'
import {
  addTodo,
  toggleTodo,
  updateTodo,
  deleteTodo,
  updatePriority,
} from '@/actions/todo-actions'
import type { Todo } from '@/types'

interface TodoClientWrapperProps {
  isLoggedIn: boolean
  initialTodos: Todo[] // Todos từ DB (nếu đã đăng nhập)
}

export default function TodoClientWrapper({
  isLoggedIn,
  initialTodos,
}: TodoClientWrapperProps) {
  // Todos hiển thị: nếu đã login thì dùng initialTodos, nếu không thì dùng store
  const [dbTodos, setDbTodos] = useState<Todo[]>(initialTodos)

  // Đồng bộ lại khi có dữ liệu mới từ Server (do revalidatePath)
  useEffect(() => {
    setDbTodos(initialTodos)
  }, [initialTodos])

  // Zustand store dùng cho người chưa đăng nhập
  const storeTodos = useTodoStore((s) => s.todos)
  const storeAdd = useTodoStore((s) => s.addTodo)
  const storeToggle = useTodoStore((s) => s.toggleTodo)
  const storeUpdate = useTodoStore((s) => s.updateTodo)
  const storeDelete = useTodoStore((s) => s.deleteTodo)
  const storePriority = useTodoStore((s) => s.updatePriority)

  // Hydration-safe: chờ client mount mới đọc store
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])

  // --- Handlers cho người ĐÃ đăng nhập (gọi Server Actions) ---
  const handleAddAuth = async (title: string) => {
    // Optimistic update: thêm vào local state ngay lập tức
    const tempId = `temp_${Date.now()}`
    const newTodo: Todo = {
      id: tempId, // id tạm, sẽ bị thay bằng re-fetch
      title: title.trim(),
      isDone: false,
      priority: 4,
      createdAt: new Date(),
    }
    setDbTodos((prev) =>
      [newTodo, ...prev].sort(
        (a, b) => a.priority - b.priority || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    )

    await addTodo(title) // revalidatePath bên trong
  }

  const handleToggleAuth = async (id: string) => {
    if (id.startsWith('temp_')) return
    setDbTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))
    )
    await toggleTodo(id)
  }

  const handleUpdateAuth = async (id: string, title: string) => {
    if (id.startsWith('temp_')) return
    setDbTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title } : t))
    )
    await updateTodo(id, title)
  }

  const handleDeleteAuth = async (id: string) => {
    if (id.startsWith('temp_')) return
    setDbTodos((prev) => prev.filter((t) => t.id !== id))
    await deleteTodo(id)
  }

  const handlePriorityAuth = async (id: string, priority: number) => {
    if (id.startsWith('temp_')) return
    setDbTodos((prev) =>
      prev
        .map((t) => (t.id === id ? { ...t, priority } : t))
        .sort(
          (a, b) => a.priority - b.priority || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    )
    await updatePriority(id, priority)
  }

  // --- Handlers cho người CHƯA đăng nhập (gọi Zustand store) ---
  const handleAddLocal = async (title: string) => {
    storeAdd(title)
  }

  const handleToggleLocal = async (id: string) => {
    storeToggle(id)
  }

  const handleUpdateLocal = async (id: string, title: string) => {
    storeUpdate(id, title)
  }

  const handleDeleteLocal = async (id: string) => {
    storeDelete(id)
  }

  const handlePriorityLocal = async (id: string, priority: number) => {
    storePriority(id, priority)
  }

  // Chưa hydrate client thì hiện spinner đơn giản
  if (!hydrated) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-14 w-full animate-pulse rounded-xl bg-[var(--card-bg)]" />
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-[var(--card-bg)]" />
          ))}
        </div>
      </div>
    )
  }

  if (isLoggedIn) {
    return (
      <div className="flex flex-col gap-6">
        <TodoForm onAdd={handleAddAuth} />
        <TodoList
          todos={dbTodos}
          onToggle={handleToggleAuth}
          onUpdate={handleUpdateAuth}
          onDelete={handleDeleteAuth}
          onPriorityChange={handlePriorityAuth}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Banner nhắc nhở đăng nhập */}
      <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
        <span className="text-lg">💾</span>
        <span>
          Dữ liệu đang được lưu tại trình duyệt này.{' '}
          <a href="/auth/signin" className="font-semibold underline underline-offset-2 hover:text-amber-600 dark:hover:text-amber-300 transition-colors">
            Đăng nhập
          </a>{' '}
          để đồng bộ và sử dụng trên nhiều thiết bị.
        </span>
      </div>
      <TodoForm onAdd={handleAddLocal} />
      <TodoList
        todos={storeTodos}
        onToggle={handleToggleLocal}
        onUpdate={handleUpdateLocal}
        onDelete={handleDeleteLocal}
        onPriorityChange={handlePriorityLocal}
      />
    </div>
  )
}
