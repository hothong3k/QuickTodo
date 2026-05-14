import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITodo extends Document {
  title: string
  description?: string
  isDone: boolean
  priority: number
  createdAt: Date
  userId?: string // optional: chỉ có nếu user đăng nhập
}

const TodoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  isDone: { type: Boolean, default: false },
  priority: { type: Number, default: 4 },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, index: true }, // index để query nhanh theo user
})

const TodoModel: Model<ITodo> =
  mongoose.models.Todo ?? mongoose.model<ITodo>('Todo', TodoSchema)

export default TodoModel
