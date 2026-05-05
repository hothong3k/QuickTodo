'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Thêm todo mới (priority mặc định = 4: Không khẩn cấp)
export async function addTodo(title: string) {
  if (!title || !title.trim()) return
  await prisma.todo.create({
    data: { title: title.trim() },
  })
  revalidatePath('/')
}

// Đổi trạng thái hoàn thành
export async function toggleTodo(id: string) {
  const todo = await prisma.todo.findUnique({ where: { id } })
  if (!todo) return
  await prisma.todo.update({
    where: { id },
    data: { isDone: !todo.isDone },
  })
  revalidatePath('/')
}

// Cập nhật tiêu đề todo
export async function updateTodo(id: string, title: string) {
  if (!title || !title.trim()) return
  await prisma.todo.update({
    where: { id },
    data: { title: title.trim() },
  })
  revalidatePath('/')
}

// Cập nhật mức độ ưu tiên (1-4)
export async function updatePriority(id: string, priority: number) {
  if (priority < 1 || priority > 4) return
  await prisma.todo.update({
    where: { id },
    data: { priority },
  })
  revalidatePath('/')
}

// Xoá todo
export async function deleteTodo(id: string) {
  await prisma.todo.delete({ where: { id } })
  revalidatePath('/')
}
