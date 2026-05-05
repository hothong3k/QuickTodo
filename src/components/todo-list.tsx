import TodoItem from '@/components/todo-item'
import type { Todo } from '@/types'

interface TodoListProps {
  todos: Todo[]
}

export default function TodoList({ todos }: TodoListProps) {
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
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}
