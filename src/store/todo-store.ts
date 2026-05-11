import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Todo } from '@/types'

// Helper tạo id ngẫu nhiên
function generateId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

interface TodoStore {
  todos: Todo[]
  addTodo: (title: string, priority: number) => void
  toggleTodo: (id: string) => void
  updateTodo: (id: string, title: string) => void
  deleteTodo: (id: string) => void
  updatePriority: (id: string, priority: number) => void
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: (title, priority) => {
        const newTodo: Todo = {
          id: generateId(),
          title: title.trim(),
          isDone: false,
          priority: priority,
          createdAt: new Date(),
        }
        set((state) => ({
          // Sắp xếp giống DB: priority tăng dần, createdAt mới nhất lên đầu
          todos: [newTodo, ...state.todos].sort(
            (a, b) => a.priority - b.priority || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
        }))
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, isDone: !t.isDone } : t
          ),
        }))
      },

      updateTodo: (id, title) => {
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, title: title.trim() } : t
          ),
        }))
      },

      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        }))
      },

      updatePriority: (id, priority) => {
        set((state) => ({
          todos: state.todos
            .map((t) => (t.id === id ? { ...t, priority } : t))
            .sort(
              (a, b) => a.priority - b.priority || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ),
        }))
      },
    }),
    {
      name: 'quicktodo-local', // key trong localStorage
    }
  )
)
