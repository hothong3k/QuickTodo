import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITodo extends Document {
  title: string
  description?: string
  dueDate?: string | null
  subtasks?: {
    id: string
    title: string
    isDone: boolean
    createdAt: Date
  }[]
  isDone: boolean
  priority: number
  createdAt: Date
  userId?: string // optional: chỉ có nếu user đăng nhập
}

const SubtaskSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    isDone: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const TodoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: String, default: null },
  subtasks: { type: [SubtaskSchema], default: [] },
  isDone: { type: Boolean, default: false },
  priority: { type: Number, default: 4 },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, index: true }, // index để query nhanh theo user
})

const cachedTodoModel = mongoose.models.Todo as Model<ITodo> | undefined

if (
  process.env.NODE_ENV !== 'production' &&
  cachedTodoModel &&
  !cachedTodoModel.schema.path('subtasks')
) {
  mongoose.deleteModel('Todo')
}

const TodoModel: Model<ITodo> =
  (mongoose.models.Todo as Model<ITodo> | undefined) ??
  mongoose.model<ITodo>('Todo', TodoSchema)

export default TodoModel
