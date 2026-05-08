'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import TodoModel from '@/models/Todo'
import { revalidatePath } from 'next/cache'

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user?.id ?? null
}

// Thêm todo mới
export async function addTodo(title: string) {
  if (!title || !title.trim()) return
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()
  await TodoModel.create({ title: title.trim(), userId })
  revalidatePath('/')
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
  revalidatePath('/')
}

// Cập nhật tiêu đề todo
export async function updateTodo(id: string, title: string) {
  if (!title || !title.trim()) return
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()
  await TodoModel.findOneAndUpdate({ _id: id, userId }, { title: title.trim() })
  revalidatePath('/')
}

// Cập nhật mức độ ưu tiên (1-4)
export async function updatePriority(id: string, priority: number) {
  if (priority < 1 || priority > 4) return
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()
  await TodoModel.findOneAndUpdate({ _id: id, userId }, { priority })
  revalidatePath('/')
}

// Xoá todo
export async function deleteTodo(id: string) {
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')
  await connectDB()
  await TodoModel.findOneAndDelete({ _id: id, userId })
  revalidatePath('/')
}
