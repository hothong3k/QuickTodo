'use server'

import { connectDB } from '@/lib/mongoose'
import TodoModel from '@/models/Todo'
import { revalidatePath } from 'next/cache'

// Thêm todo mới (priority mặc định = 4: Không khẩn cấp)
export async function addTodo(title: string) {
  if (!title || !title.trim()) return
  await connectDB()
  await TodoModel.create({ title: title.trim() })
  revalidatePath('/')
}

// Đổi trạng thái hoàn thành
export async function toggleTodo(id: string) {
  await connectDB()
  const todo = await TodoModel.findById(id)
  if (!todo) return
  todo.isDone = !todo.isDone
  await todo.save()
  revalidatePath('/')
}

// Cập nhật tiêu đề todo
export async function updateTodo(id: string, title: string) {
  if (!title || !title.trim()) return
  await connectDB()
  await TodoModel.findByIdAndUpdate(id, { title: title.trim() })
  revalidatePath('/')
}

// Cập nhật mức độ ưu tiên (1-4)
export async function updatePriority(id: string, priority: number) {
  if (priority < 1 || priority > 4) return
  await connectDB()
  await TodoModel.findByIdAndUpdate(id, { priority })
  revalidatePath('/')
}

// Xoá todo
export async function deleteTodo(id: string) {
  await connectDB()
  await TodoModel.findByIdAndDelete(id)
  revalidatePath('/')
}
