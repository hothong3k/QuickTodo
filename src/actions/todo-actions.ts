'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import TodoModel from '@/models/Todo'
import { revalidatePath } from 'next/cache'
import { TODO_DESCRIPTION_MAX_LENGTH, TODO_TITLE_MAX_LENGTH } from '@/types'

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user?.id ?? null
}

// Thêm todo mới
export async function addTodo(title: string, priority: number = 4) {
  const cleanTitle = title.trim().slice(0, TODO_TITLE_MAX_LENGTH)
  if (!cleanTitle) return
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()
  await TodoModel.create({ title: cleanTitle, userId, priority })
  revalidatePath('/todo')
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
