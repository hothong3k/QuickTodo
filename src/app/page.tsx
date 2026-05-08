import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import TodoModel from "@/models/Todo";
import ThemeToggle from "@/components/theme-toggle";
import AuthButton from "@/components/auth-button";
import TodoClientWrapper from "@/components/todo-client-wrapper";
import type { Todo } from "@/types";

export default async function Home() {
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
      isDone: t.isDone ?? false,
      priority: t.priority ?? 4,
      createdAt: t.createdAt ?? new Date(),
    }));
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-title sm:text-5xl uppercase">
          QUICKTODO
        </h1>
        {/* Top-right controls */}
        <div className="absolute right-6 top-8 flex items-center gap-2">
          <AuthButton />
          <ThemeToggle />
        </div>
      </header>

      {/* Subtitle */}
      <div className="mx-auto mb-12 max-w-lg px-4 text-center">
        <div className="text-base font-medium leading-relaxed text-muted-foreground">
          <p>Không tải app linh tinh, không đăng nhập vẫn dùng được.</p>
          <p>Chỉ cần tập trung tạo nhanh task cho todolist thôi!</p>
          <p className="opacity-70">
            (À nhưng nếu bạn muốn nhiều hơn nữa thì nên đăng nhập nhé)
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-12">
        <TodoClientWrapper isLoggedIn={isLoggedIn} initialTodos={initialTodos} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-6 text-center dark:border-zinc-800">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
          2026 – HO THONG 3K - V1.5
        </p>
      </footer>
    </div>
  );
}
