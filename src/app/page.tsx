import { prisma } from "@/lib/prisma";
import ThemeToggle from "@/components/theme-toggle";
import TodoForm from "@/components/todo-form";
import TodoList from "@/components/todo-list";
import type { Todo } from "@/types";

export default async function Home() {
  // Fetch todos sắp xếp theo priority (cao → thấp) rồi theo ngày tạo (mới nhất trước)
  const rawTodos = await prisma.todo.findMany({
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
  });

  // Chuyển đổi sang type Todo cho client component
  const todos: Todo[] = rawTodos.map((t) => ({
    id: t.id,
    title: t.title,
    isDone: t.isDone,
    priority: t.priority,
    createdAt: t.createdAt,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-title sm:text-5xl uppercase">
          QUICKTODO
        </h1>
        <div className="absolute right-6 top-8">
          <ThemeToggle />
        </div>
      </header>

      {/* Subtitle */}
      <div className="mx-auto mb-12 max-w-lg px-4 text-center">
        <p className="text-base font-medium leading-relaxed text-muted-foreground">
          Không đăng nhập rườm rà, không tải app linh tinh.
          <br />
          Chỉ cần tạo nhanh danh sách việc cần làm là đủ!
        </p>
      </div>

      {/* Main content */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 pb-12">
        {/* Form thêm todo */}
        <TodoForm />

        {/* Danh sách todo */}
        <TodoList todos={todos} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-6 text-center dark:border-zinc-800">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
          2026 – HO THONG 3K
        </p>
      </footer>
    </div>
  );
}
