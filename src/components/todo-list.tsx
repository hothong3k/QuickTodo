import TodoItem from '@/components/todo-item'
import type { Todo } from '@/types'

interface TodoListProps {
  todos: Todo[]
  isLoggedIn: boolean
  today: string
  onToggle: (id: string) => Promise<void>
  onUpdate: (id: string, title: string) => Promise<void>
  onUpdateDescription: (id: string, description: string) => Promise<void>
  onUpdateDueDate: (id: string, dueDate: string | null) => Promise<void>
  onAddSubtask: (todoId: string, title: string) => Promise<void>
  onToggleSubtask: (todoId: string, subtaskId: string) => Promise<void>
  onUpdateSubtask: (
    todoId: string,
    subtaskId: string,
    title: string
  ) => Promise<void>
  onDeleteSubtask: (todoId: string, subtaskId: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onPriorityChange: (id: string, priority: number) => Promise<void>
  onRequireLoginForDescription: () => void
  onRequireLoginForDueDate: () => void
  onRequireLoginForSubtask: () => void
}

export default function TodoList({
  todos,
  isLoggedIn,
  today,
  onToggle,
  onUpdate,
  onUpdateDescription,
  onUpdateDueDate,
  onAddSubtask,
  onToggleSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  onDelete,
  onPriorityChange,
  onRequireLoginForDescription,
  onRequireLoginForDueDate,
  onRequireLoginForSubtask,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="mb-4 text-5xl">📋</div>
        <p className="text-lg font-medium text-zinc-400 dark:text-zinc-500">
          Chưa có việc nào cả!
        </p>
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-600">
          Thêm việc mới ở ô phía trên nhé.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoggedIn={isLoggedIn}
          today={today}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onUpdateDescription={onUpdateDescription}
          onUpdateDueDate={onUpdateDueDate}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          onUpdateSubtask={onUpdateSubtask}
          onDeleteSubtask={onDeleteSubtask}
          onDelete={onDelete}
          onPriorityChange={onPriorityChange}
          onRequireLoginForDescription={onRequireLoginForDescription}
          onRequireLoginForDueDate={onRequireLoginForDueDate}
          onRequireLoginForSubtask={onRequireLoginForSubtask}
        />
      ))}
    </div>
  )
}
