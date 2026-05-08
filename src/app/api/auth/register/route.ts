import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongoose'
import mongoose from 'mongoose'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Validation cơ bản
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ thông tin.' },
        { status: 400 }
      )
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Mật khẩu phải có ít nhất 6 ký tự.' },
        { status: 400 }
      )
    }

    await connectDB()
    const db = mongoose.connection.db
    if (!db) throw new Error('DB connection failed')

    // Kiểm tra email đã tồn tại chưa
    const existing = await db.collection('users').findOne({ email })
    if (existing) {
      return NextResponse.json(
        { message: 'Email này đã được sử dụng.' },
        { status: 409 }
      )
    }

    // Hash mật khẩu và tạo user mới
    const passwordHash = await bcrypt.hash(password, 12)
    await db.collection('users').insertOne({
      name,
      email,
      passwordHash,
      emailVerified: null,
      image: null,
      createdAt: new Date(),
    })

    return NextResponse.json(
      { message: 'Tạo tài khoản thành công!' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[REGISTER_ERROR]', error)
    return NextResponse.json(
      { message: 'Đã có lỗi xảy ra, vui lòng thử lại.' },
      { status: 500 }
    )
  }
}
