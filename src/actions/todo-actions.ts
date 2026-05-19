'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import TodoModel from '@/models/Todo'
import { revalidatePath } from 'next/cache'
import {
  SUBTASK_MAX_COUNT,
  SUBTASK_TITLE_MAX_LENGTH,
  TODO_DESCRIPTION_MAX_LENGTH,
  TODO_TITLE_MAX_LENGTH,
  type Todo,
} from '@/types'
import { normalizeDueDate } from '@/lib/due-date'

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user?.id ?? null
}

// Thêm todo mới
export async function addTodo(title: string, priority: number = 4): Promise<Todo | undefined> {
  const cleanTitle = title.trim().slice(0, TODO_TITLE_MAX_LENGTH)
  if (!cleanTitle) return
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()
  const todo = await TodoModel.create({ title: cleanTitle, userId, priority })
  revalidatePath('/todo')

  return {
    id: String(todo._id),
    title: todo.title,
    description: todo.description ?? '',
    dueDate: todo.dueDate ?? null,
    subtasks: [],
    isDone: todo.isDone ?? false,
    priority: todo.priority ?? 4,
    createdAt: todo.createdAt?.toISOString?.() ?? new Date().toISOString(),
  }
}

// Đổi trạng thái hoàn thành
export async function toggleTodo(id: string) {
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()
  const todo = await TodoModel.findOne({ _id: id, userId })
  if (!todo) return
  todo.isDone = !todo.isDone
  await todo.save()
  revalidatePath('/todo')
}

// Cập nhật tiêu đề todo
export async function updateTodo(id: string, title: string) {
  const cleanTitle = title.trim().slice(0, TODO_TITLE_MAX_LENGTH)
  if (!cleanTitle) return
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()
  await TodoModel.findOneAndUpdate({ _id: id, userId }, { title: cleanTitle })
  revalidatePath('/todo')
}

// Cập nhật mô tả todo
export async function updateTodoDescription(id: string, description: string) {
  const cleanDescription = description.trim().slice(0, TODO_DESCRIPTION_MAX_LENGTH)
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()
  await TodoModel.findOneAndUpdate(
    { _id: id, userId },
    { description: cleanDescription }
  )
  revalidatePath('/todo')
}

// Cập nhật deadline todo
export async function updateDueDate(id: string, dueDate: string | null) {
  const cleanDueDate = normalizeDueDate(dueDate)
  if (dueDate && !cleanDueDate) return

  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()
  await TodoModel.findOneAndUpdate(
    { _id: id, userId },
    { dueDate: cleanDueDate }
  )
  revalidatePath('/todo')
}

// Thêm task phụ
export async function addSubtask(todoId: string, title: string) {
  const cleanTitle = title.trim().slice(0, SUBTASK_TITLE_MAX_LENGTH)
  if (!cleanTitle) return

  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()

  const todo = await TodoModel.findOne({ _id: todoId, userId })
  if (!todo) return

  const subtasks = todo.subtasks ?? []
  if (subtasks.length >= SUBTASK_MAX_COUNT) return

  const createdAt = new Date()
  const subtask = {
    id: crypto.randomUUID(),
    title: cleanTitle,
    isDone: false,
    createdAt,
  }

  subtasks.push(subtask)
  todo.subtasks = subtasks
  await todo.save()
  revalidatePath('/todo')

  return {
    ...subtask,
    createdAt: createdAt.toISOString(),
  }
}

// Đổi trạng thái hoàn thành task phụ
export async function toggleSubtask(todoId: string, subtaskId: string) {
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()

  const todo = await TodoModel.findOne({ _id: todoId, userId })
  if (!todo?.subtasks) return

  const subtask = todo.subtasks.find((item) => item.id === subtaskId)
  if (!subtask) return

  subtask.isDone = !subtask.isDone
  await todo.save()
  revalidatePath('/todo')
}

// Cập nhật tiêu đề task phụ
export async function updateSubtask(
  todoId: string,
  subtaskId: string,
  title: string
) {
  const cleanTitle = title.trim().slice(0, SUBTASK_TITLE_MAX_LENGTH)
  if (!cleanTitle) return

  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()

  const todo = await TodoModel.findOne({ _id: todoId, userId })
  if (!todo?.subtasks) return

  const subtask = todo.subtasks.find((item) => item.id === subtaskId)
  if (!subtask) return

  subtask.title = cleanTitle
  await todo.save()
  revalidatePath('/todo')
}

// Xoá task phụ
export async function deleteSubtask(todoId: string, subtaskId: string) {
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()

  const todo = await TodoModel.findOne({ _id: todoId, userId })
  if (!todo?.subtasks) return

  todo.subtasks = todo.subtasks.filter((item) => item.id !== subtaskId)
  await todo.save()
  revalidatePath('/todo')
}

// Cập nhật mức độ ưu tiên (1-4)
export async function updatePriority(id: string, priority: number) {
  if (priority < 1 || priority > 4) return
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()
  await TodoModel.findOneAndUpdate({ _id: id, userId }, { priority })
  revalidatePath('/todo')
}

// Xoá todo
export async function deleteTodo(id: string) {
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()
  await TodoModel.findOneAndDelete({ _id: id, userId })
  revalidatePath('/todo')
}
