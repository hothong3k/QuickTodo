export interface Todo {
  id: string
  title: string
  description?: string
  dueDate?: string | null
  isDone: boolean
  priority: number
  createdAt: Date
}

export const TODO_TITLE_MAX_LENGTH = 100
export const TODO_DESCRIPTION_MAX_LENGTH = 1000
export const TODO_DESCRIPTION_PREVIEW_LENGTH = 100
