import TodoItem from '@/components/todo-item'
import type { Todo } from '@/types'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => Promise<void>
  onUpdate: (id: string, title: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onPriorityChange: (id: string, priority: number) => Promise<void>
}

export default function TodoList({
  todos,
  onToggle,
  onUpdate,
  onDelete,
  onPriorityChange,
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
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onPriorityChange={onPriorityChange}
        />
      ))}
    </div>
  )
}
