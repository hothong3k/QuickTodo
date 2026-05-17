'use client'

import { useEffect, useState, useRef } from 'react'
import { Menu, Check } from 'lucide-react'
import TodoForm from '@/components/todo-form'
import TodoList from '@/components/todo-list'
import { PRIORITY_CONFIG } from '@/components/priority-picker'
import { useTodoStore } from '@/store/todo-store'
import {
  addSubtask,
  addTodo,
  deleteSubtask,
  toggleTodo,
  toggleSubtask,
  updateTodo,
  updateTodoDescription,
  updateDueDate,
  deleteTodo,
  updatePriority,
  updateSubtask,
} from '@/actions/todo-actions'
import { getCurrentDateString, getLocalDateString } from '@/lib/current-date'
import {
  TODO_DESCRIPTION_MAX_LENGTH,
  TODO_TITLE_MAX_LENGTH,
  SUBTASK_MAX_COUNT,
  SUBTASK_TITLE_MAX_LENGTH,
  type Subtask,
  type Todo,
} from '@/types'

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

  // Zustand store dùng cho người chưa đăng nhập
  const storeTodos = useTodoStore((s) => s.todos)
  const storeAdd = useTodoStore((s) => s.addTodo)
  const storeToggle = useTodoStore((s) => s.toggleTodo)
  const storeUpdate = useTodoStore((s) => s.updateTodo)
  const storeDelete = useTodoStore((s) => s.deleteTodo)
  const storePriority = useTodoStore((s) => s.updatePriority)

  // Hydration-safe: chờ client mount mới đọc store
  const [hydrated, setHydrated] = useState(false)
  const [priorityFilters, setPriorityFilters] = useState<number[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [authNotice, setAuthNotice] = useState('')
  const [today, setToday] = useState(() => getLocalDateString())
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setHydrated(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    getCurrentDateString().then(setToday)
  }, [])

  // Đóng filter khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isFilterOpen])

  const toggleFilter = (level: number) => {
    setPriorityFilters((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    )
  }

  const showDescriptionLoginNotice = () => {
    setAuthNotice('Hãy đăng nhập để dùng tính năng này')
  }

  // --- Handlers cho người ĐÃ đăng nhập (gọi Server Actions) ---
  const showLoginNotice = () => {
    setAuthNotice('Hãy đăng nhập để dùng tính năng này')
  }

  const handleAddAuth = async (title: string, priority: number) => {
    const cleanTitle = title.trim().slice(0, TODO_TITLE_MAX_LENGTH)
    if (!cleanTitle) return

    // Optimistic update: thêm vào local state ngay lập tức
    const tempId = `temp_${Date.now()}`
    const newTodo: Todo = {
      id: tempId, // id tạm, sẽ bị thay bằng re-fetch
      title: cleanTitle,
      description: '',
      dueDate: null,
      subtasks: [],
      isDone: false,
      priority: priority,
      createdAt: new Date(),
    }
    setDbTodos((prev) =>
      [newTodo, ...prev].sort(
        (a, b) => a.priority - b.priority || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    )

    await addTodo(cleanTitle, priority) // revalidatePath bên trong
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
    const cleanTitle = title.trim().slice(0, TODO_TITLE_MAX_LENGTH)
    if (!cleanTitle) return

    setDbTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: cleanTitle } : t))
    )
    await updateTodo(id, cleanTitle)
  }

  const handleDescriptionAuth = async (id: string, description: string) => {
    if (id.startsWith('temp_')) return
    const cleanDescription = description.trim().slice(0, TODO_DESCRIPTION_MAX_LENGTH)

    setDbTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, description: cleanDescription } : t))
    )
    await updateTodoDescription(id, cleanDescription)
  }

  const handleDueDateAuth = async (id: string, dueDate: string | null) => {
    if (id.startsWith('temp_')) return

    setDbTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, dueDate } : t))
    )
    await updateDueDate(id, dueDate)
  }

  const handleAddSubtaskAuth = async (todoId: string, title: string) => {
    if (todoId.startsWith('temp_')) return
    const cleanTitle = title.trim().slice(0, SUBTASK_TITLE_MAX_LENGTH)
    if (!cleanTitle) return

    const newSubtask: Subtask = {
      id: `temp_subtask_${Date.now()}`,
      title: cleanTitle,
      isDone: false,
      createdAt: new Date(),
    }

    setDbTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== todoId) return todo
        const subtasks = todo.subtasks ?? []
        if (subtasks.length >= SUBTASK_MAX_COUNT) return todo
        return { ...todo, subtasks: [...subtasks, newSubtask] }
      })
    )
    const savedSubtask = await addSubtask(todoId, cleanTitle)
    setDbTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
            ...todo,
            subtasks: savedSubtask
              ? (todo.subtasks ?? []).map((subtask) =>
                subtask.id === newSubtask.id ? savedSubtask : subtask
              )
              : (todo.subtasks ?? []).filter(
                (subtask) => subtask.id !== newSubtask.id
              ),
          }
          : todo
      )
    )
  }

  const handleToggleSubtaskAuth = async (todoId: string, subtaskId: string) => {
    if (todoId.startsWith('temp_') || subtaskId.startsWith('temp_subtask_')) return

    setDbTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
            ...todo,
            subtasks: (todo.subtasks ?? []).map((subtask) =>
              subtask.id === subtaskId
                ? { ...subtask, isDone: !subtask.isDone }
                : subtask
            ),
          }
          : todo
      )
    )
    await toggleSubtask(todoId, subtaskId)
  }

  const handleUpdateSubtaskAuth = async (
    todoId: string,
    subtaskId: string,
    title: string
  ) => {
    if (todoId.startsWith('temp_') || subtaskId.startsWith('temp_subtask_')) return
    const cleanTitle = title.trim().slice(0, SUBTASK_TITLE_MAX_LENGTH)
    if (!cleanTitle) return

    setDbTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
            ...todo,
            subtasks: (todo.subtasks ?? []).map((subtask) =>
              subtask.id === subtaskId
                ? { ...subtask, title: cleanTitle }
                : subtask
            ),
          }
          : todo
      )
    )
    await updateSubtask(todoId, subtaskId, cleanTitle)
  }

  const handleDeleteSubtaskAuth = async (todoId: string, subtaskId: string) => {
    if (todoId.startsWith('temp_') || subtaskId.startsWith('temp_subtask_')) return

    setDbTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
            ...todo,
            subtasks: (todo.subtasks ?? []).filter(
              (subtask) => subtask.id !== subtaskId
            ),
          }
          : todo
      )
    )
    await deleteSubtask(todoId, subtaskId)
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
  const handleAddLocal = async (title: string, priority: number) => {
    storeAdd(title, priority)
  }

  const handleToggleLocal = async (id: string) => {
    storeToggle(id)
  }

  const handleUpdateLocal = async (id: string, title: string) => {
    storeUpdate(id, title)
  }

  const handleDescriptionLocal = async () => {
    showLoginNotice()
  }

  const handleDueDateLocal = async () => {
    showLoginNotice()
  }

  const handleSubtaskLocal = async () => {
    showLoginNotice()
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
    const filteredTodos = dbTodos.filter(
      (t) => priorityFilters.length === 0 || priorityFilters.includes(t.priority)
    )

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          {/* Nút Menu - Bộ lọc mức độ */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex h-14 w-14 items-center justify-center rounded-xl border transition-all duration-200 ${priorityFilters.length > 0
                ? 'border-blue-500 bg-blue-500/10 text-blue-600'
                : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
                }`}
              title="Bộ lọc mức độ"
            >
              <Menu size={24} />
              {priorityFilters.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {priorityFilters.length}
                </span>
              )}
            </button>

            {/* Dropdown bộ lọc */}
            {isFilterOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-56 animate-in fade-in slide-in-from-top-1 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-2 shadow-xl">
                <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] opacity-70">
                  Lọc theo mức độ
                </p>
                <div className="space-y-0.5">
                  {PRIORITY_CONFIG.map((p) => {
                    const isSelected = priorityFilters.includes(p.level)
                    return (
                      <button
                        key={p.level}
                        onClick={() => toggleFilter(p.level)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ${isSelected ? 'bg-blue-500/10' : 'hover:bg-[var(--muted)]'
                          }`}
                      >
                        <span className={`block h-3 w-3 shrink-0 rounded-full ${p.color}`} />
                        <span className="flex-1 text-sm font-medium text-[var(--foreground)]">
                          {p.label}
                        </span>
                        {isSelected && <Check size={16} className="shrink-0 text-blue-500" />}
                      </button>
                    )
                  })}
                </div>
                {priorityFilters.length > 0 && (
                  <button
                    onClick={() => setPriorityFilters([])}
                    className="mt-2 w-full border-t border-[var(--card-border)] pt-2 text-center text-xs font-semibold text-blue-500 hover:text-blue-600"
                  >
                    Xoá bộ lọc
                  </button>
                )}
              </div>
            )}
          </div>

          <TodoForm onAdd={handleAddAuth} />
        </div>

        <TodoList
          todos={filteredTodos}
          isLoggedIn={isLoggedIn}
          today={today}
          onToggle={handleToggleAuth}
          onUpdate={handleUpdateAuth}
          onUpdateDescription={handleDescriptionAuth}
          onUpdateDueDate={handleDueDateAuth}
          onAddSubtask={handleAddSubtaskAuth}
          onToggleSubtask={handleToggleSubtaskAuth}
          onUpdateSubtask={handleUpdateSubtaskAuth}
          onDeleteSubtask={handleDeleteSubtaskAuth}
          onDelete={handleDeleteAuth}
          onPriorityChange={handlePriorityAuth}
          onRequireLoginForDescription={showDescriptionLoginNotice}
          onRequireLoginForDueDate={showLoginNotice}
          onRequireLoginForSubtask={showLoginNotice}
        />
      </div>
    )
  }

  const filteredStoreTodos = storeTodos.filter(
    (t) => priorityFilters.length === 0 || priorityFilters.includes(t.priority)
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Banner nhắc nhở đăng nhập */}
      <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
        <span className="text-lg">💾</span>
        <span>
          Dữ liệu chỉ được lưu CỤC BỘ tại trình duyệt này, và sẽ KHÔNG ĐỒNG BỘ sang thiết bị khác. Hãy{' '}
          <a
            href="/auth/signin"
            className="font-semibold underline underline-offset-2 transition-colors hover:text-amber-600 dark:hover:text-amber-300"
          >
            đăng nhập
          </a>{' '}
          để đồng bộ dữ liệu và sử dụng các tính năng nâng cao.
        </span>
      </div>

      {authNotice && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-500/30 bg-blue-500/5 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
          <span>
            {authNotice}.{' '}
            <a
              href="/auth/signin"
              className="font-semibold underline underline-offset-2 transition-colors hover:text-blue-600 dark:hover:text-blue-200"
            >
              Đăng nhập
            </a>
          </span>
          <button
            type="button"
            onClick={() => setAuthNotice('')}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold hover:bg-blue-500/10"
          >
            Đóng
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Nút Menu - Bộ lọc mức độ */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex h-14 w-14 items-center justify-center rounded-xl border transition-all duration-200 ${priorityFilters.length > 0
              ? 'border-blue-500 bg-blue-500/10 text-blue-600'
              : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
              }`}
            title="Bộ lọc mức độ"
          >
            <Menu size={24} />
            {priorityFilters.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {priorityFilters.length}
              </span>
            )}
          </button>

          {/* Dropdown bộ lọc */}
          {isFilterOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-56 animate-in fade-in slide-in-from-top-1 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-2 shadow-xl">
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] opacity-70">
                Lọc theo mức độ
              </p>
              <div className="space-y-0.5">
                {PRIORITY_CONFIG.map((p) => {
                  const isSelected = priorityFilters.includes(p.level)
                  return (
                    <button
                      key={p.level}
                      onClick={() => toggleFilter(p.level)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ${isSelected ? 'bg-blue-500/10' : 'hover:bg-[var(--muted)]'
                        }`}
                    >
                      <span className={`block h-3 w-3 shrink-0 rounded-full ${p.color}`} />
                      <span className="flex-1 text-sm font-medium text-[var(--foreground)]">
                        {p.label}
                      </span>
                      {isSelected && <Check size={16} className="shrink-0 text-blue-500" />}
                    </button>
                  )
                })}
              </div>
              {priorityFilters.length > 0 && (
                <button
                  onClick={() => setPriorityFilters([])}
                  className="mt-2 w-full border-t border-[var(--card-border)] pt-2 text-center text-xs font-semibold text-blue-500 hover:text-blue-600"
                >
                  Xoá bộ lọc
                </button>
              )}
            </div>
          )}
        </div>

        <TodoForm onAdd={handleAddLocal} />
      </div>

      <TodoList
        todos={filteredStoreTodos}
        isLoggedIn={isLoggedIn}
        today={today}
        onToggle={handleToggleLocal}
        onUpdate={handleUpdateLocal}
        onUpdateDescription={handleDescriptionLocal}
        onUpdateDueDate={handleDueDateLocal}
        onAddSubtask={handleSubtaskLocal}
        onToggleSubtask={handleSubtaskLocal}
        onUpdateSubtask={handleSubtaskLocal}
        onDeleteSubtask={handleSubtaskLocal}
        onDelete={handleDeleteLocal}
        onPriorityChange={handlePriorityLocal}
        onRequireLoginForDescription={showDescriptionLoginNotice}
        onRequireLoginForDueDate={showLoginNotice}
        onRequireLoginForSubtask={showLoginNotice}
      />
    </div>
  )
}
