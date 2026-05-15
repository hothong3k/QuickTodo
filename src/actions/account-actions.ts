'use server'

import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { revalidatePath } from 'next/cache'
import { getCurrentAccountProfile, normalizeAccountEmail } from '@/lib/account'
import { connectDB } from '@/lib/mongoose'

export type AccountActionResult =
  | { ok: true; message: string; name?: string; email?: string }
  | { ok: false; message: string }

const NAME_MAX_LENGTH = 80
const PASSWORD_MIN_LENGTH = 6
const PASSWORD_MAX_LENGTH = 128
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email)
}

export async function updateAccountInfo(input: {
  name: string
  email: string
}): Promise<AccountActionResult> {
  const profile = await getCurrentAccountProfile()
  if (!profile) {
    return { ok: false, message: 'Bạn cần đăng nhập để cập nhật tài khoản.' }
  }

  if (!profile.canEditCredentials) {
    return {
      ok: false,
      message: 'Tài khoản Google không thể sửa thông tin tại QuickTodo.',
    }
  }

  const name = input.name.trim().slice(0, NAME_MAX_LENGTH)
  const email = normalizeAccountEmail(input.email)

  if (!name) {
    return { ok: false, message: 'Tên người dùng không được để trống.' }
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: 'Email không hợp lệ.' }
  }

  const userObjectId = new mongoose.Types.ObjectId(profile.id)

  await connectDB()
  const db = mongoose.connection.db
  if (!db) {
    return { ok: false, message: 'Không thể kết nối cơ sở dữ liệu.' }
  }

  const existingUser = await db.collection('users').findOne({
    email,
    _id: { $ne: userObjectId },
  })

  if (existingUser) {
    return { ok: false, message: 'Email này đã được sử dụng.' }
  }

  await db.collection('users').updateOne(
    { _id: userObjectId },
    {
      $set: {
        name,
        email,
      },
    }
  )

  revalidatePath('/profile')

  return {
    ok: true,
    message: 'Đã cập nhật thông tin tài khoản.',
    name,
    email,
  }
}

export async function changePassword(input: {
  password: string
  confirmPassword: string
}): Promise<AccountActionResult> {
  const profile = await getCurrentAccountProfile()
  if (!profile) {
    return { ok: false, message: 'Bạn cần đăng nhập để đổi mật khẩu.' }
  }

  if (!profile.canEditCredentials) {
    return {
      ok: false,
      message: 'Tài khoản Google không dùng mật khẩu QuickTodo.',
    }
  }

  const password = input.password
  const confirmPassword = input.confirmPassword

  if (password.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' }
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return { ok: false, message: 'Mật khẩu không được vượt quá 128 ký tự.' }
  }

  if (password !== confirmPassword) {
    return { ok: false, message: 'Xác nhận mật khẩu không khớp.' }
  }

  await connectDB()
  const db = mongoose.connection.db
  if (!db) {
    return { ok: false, message: 'Không thể kết nối cơ sở dữ liệu.' }
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await db.collection('users').updateOne(
    { _id: new mongoose.Types.ObjectId(profile.id) },
    { $set: { passwordHash } }
  )

  revalidatePath('/profile')

  return { ok: true, message: 'Đã cập nhật mật khẩu.' }
}
