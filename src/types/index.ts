export interface Subtask {
  id: string
  title: string
  isDone: boolean
  createdAt: Date | string
}

export interface Todo {
  id: string
  title: string
  description?: string
  dueDate?: string | null
  subtasks?: Subtask[]
  isDone: boolean
  priority: number
  createdAt: Date | string
}

export const TODO_TITLE_MAX_LENGTH = 100
export const TODO_DESCRIPTION_MAX_LENGTH = 1000
export const TODO_DESCRIPTION_PREVIEW_LENGTH = 100
export const SUBTASK_TITLE_MAX_LENGTH = 100
export const SUBTASK_MAX_COUNT = 50
