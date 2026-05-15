import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import TodoModel from "@/models/Todo";
import TodoClientWrapper from "@/components/todo-client-wrapper";
import type { Todo } from "@/types";

export default async function TodoPage() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user?.id;

  let initialTodos: Todo[] = [];

  if (isLoggedIn && session?.user?.id) {
    await connectDB();
    const rawTodos = await TodoModel.find({ userId: session.user.id })
      .sort({ priority: 1, createdAt: -1 })
      .lean();

    initialTodos = rawTodos.map((t) => ({
      id: String(t._id),
      title: t.title,
      description: t.description ?? '',
      dueDate: t.dueDate ?? null,
      subtasks: (t.subtasks ?? []).map((subtask) => ({
        id: subtask.id,
        title: subtask.title,
        isDone: subtask.isDone ?? false,
        createdAt: subtask.createdAt ?? new Date(),
      })),
      isDone: t.isDone ?? false,
      priority: t.priority ?? 4,
      createdAt: t.createdAt ?? new Date(),
    }));
  }

  return (
    <div className="flex flex-1 flex-col bg-[var(--background)] py-12">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-title">Todolist của bạn</h2>
        </div>
        <TodoClientWrapper isLoggedIn={isLoggedIn} initialTodos={initialTodos} />
      </main>

      <footer className="mt-12 border-t border-zinc-200 py-6 text-center dark:border-zinc-800">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
          2026 – HO THONG 3K
        </p>
      </footer>
    </div>
  );
}
