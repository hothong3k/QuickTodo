<!-- BEGIN:nextjs-agent-rules -->
# AGENTS.md

## Giới thiệu dự án
Đây là một ứng dụng web Todo list hiện đại, xây dựng với:
- **Next.js** (App Router) – framework React full‑stack.
- **Prisma ORM** – kết nối cơ sở dữ liệu MongoDB.
- **MongoDB** – cơ sở dữ liệu NoSQL (Atlas hoặc local).
- **Tailwind CSS**
- **TypeScript** – toàn bộ code được viết bằng TypeScript.

Mục tiêu: tạo ra một ứng dụng quản lý công việc cá nhân, giao diện dễ dùng, responsive, không cần đăng nhập, hỗ trợ CRUD đầy đủ.

## Yêu cầu dành cho AI Agent
File này cung cấp hướng dẫn để các AI coding agent (Copilot, Cursor, ChatGPT, v.v.) hiểu rõ cấu trúc, quy ước và cách triển khai tính năng trong dự án.
Với AI của Gemini, thực hiện theo đúng yêu cầu khi chat. Không thay đổi các thành phần UI hay thay đổi code mà không thật sự cần thiết. 
---

## 1. Công nghệ & Cài đặt cơ bản

### Phiên bản đề xuất
- Node.js 22+
- Next.js 16 (App Router)
- Prisma 6.19
- MongoDB 7+
- Tailwind CSS 3.4+

### Cài đặt dependencies
```bash
npx create-next-app@latest todo-app --typescript --tailwind --eslint
cd todo-app
npm install prisma @prisma/client
npx prisma init
npx shadcn-ui@latest init
```

### Cấu hình MongoDB
Trong file `.env`:
```env
DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/todoDB?retryWrites=true&w=majority"
```

---

## 2. Cấu trúc thư mục & Quy ước đặt tên

```
quicktodo/
├── docs/
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   ├── actions/
│   │   └── todo-actions.ts
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── priority-picker.tsx
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── todo-form.tsx
│   │   ├── todo-item.tsx
│   │   └── todo-list.tsx
│   ├── lib/
│   │   └── prisma.ts
│   └── types/
│       └── index.ts
├── .env
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 3. Prisma Schema

Khóa chính mặc định là `id String @id @default(auto()) @map("_id") @db.ObjectId`.
Không có model `User` hay trường `userId`. Mọi todo được lưu trữ chung, phù hợp cho ứng dụng single‑user hoặc demo.

Ví dụ schema:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Todo {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  isDone    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

Sau khi sửa schema, chạy:
```bash
npx prisma generate
npx prisma db push   # đồng bộ schema lên MongoDB (không cần migrate)
```

## 4. Khởi tạo Prisma Client
Tạo file `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## 5. Quy ước về Component & Data Fetching
- **Server Components** (mặc định): dùng để fetch dữ liệu trực tiếp từ Prisma mà không cần API route.
- **Client Components** (`'use client'`): khi cần tương tác (onClick, useState, useEffect), chỉ import và sử dụng các component Shadcn bên trong client component.
- **Server Actions**: dùng để xử lý form submit, mutate dữ liệu mà không cần tạo API endpoint. Đặt trong `src/actions/`.

Ví dụ action thêm Todo (không cần userId):

```typescript
// src/actions/todo-actions.ts
'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addTodo(formData: FormData) {
  const title = formData.get('title') as string
  if (!title) return
  await prisma.todo.create({ data: { title } })
  revalidatePath('/')
}
```

## 6. Sử dụng Shadcn/UI
Các component được thêm qua CLI: `npx shadcn-ui@latest add button input checkbox card dialog`

Mỗi component sẽ nằm trong `src/components/ui/`.

Chỉnh theme qua CSS variables trong `globals.css` (hỗ trợ dark mode).

Giao diện chủ yếu dùng Tailwind, các component Shadcn được import như:

```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
```

## 7. Style & Thiết kế
- Dùng CSS module hoặc Tailwind classes. Shadcn/UI đi kèm với class `cn()` utility từ `@/lib/utils`.
- Hỗ trợ responsive bằng grid/flex, mobile-first.
- Màu sắc theo bảng màu Tailwind, có thể tùy chỉnh qua `tailwind.config.ts`.

## 8. Quy tắc code cho AI Agent
- Luôn dùng **TypeScript**, khai báo kiểu rõ ràng.
- Ưu tiên **Server Component** trừ khi cần useState, useEffect, event handler.
- Khi tạo component mới: đặt trong `src/components/`, export default, tuân thủ cấu trúc thư mục.
- **Data fetching**:
    - **Server Component**: gọi `prisma.todo.findMany()` trực tiếp.
    - **Client Component**: dùng server actions hoặc API route (nếu cần). Hạn chế gọi API route không cần thiết.
- **Form**: dùng `react-hook-form` kết hợp `zod` để validation, bọc trong `<form action={addTodo}>` (Server Action).
- Không tự ý thêm thư viện lớn nếu chưa được phép. Nếu cần, hỏi trước.
- Comment code bằng tiếng Việt nếu cần giải thích logic phức tạp, nhưng tên biến/hàm nên đặt bằng tiếng Anh.
- Giữ code sạch, không lặp, tách thành hàm/utils nếu cần.
- Tôn trọng **dark mode**: dùng class `dark:` hoặc CSS variables do Shadcn cung cấp.
- Không thêm bất kỳ logic xác thực nào vì dự án không có người dùng; danh sách todo là dùng chung.

## 9. Testing (nếu có)
- Dùng **Vitest** + **React Testing Library** cho unit test.
- Có thể mock Prisma client bằng `jest-mock` hoặc `vitest-mock`.
- Không yêu cầu viết test ngay, nhưng kiến trúc nên dễ test (dependency injection, tách logic khỏi UI).

## 10. Khi có cập nhật
AI agent khi được yêu cầu thêm tính năng mới, hãy tuân theo các quy ước trên. 
- Dự án không có đăng nhập, không có bảng User, mọi thao tác đều tác động lên danh sách todo chung. 
- Ưu tiên Server Action để xử lý dữ liệu. 
- Mọi thay đổi schema Prisma đều phải chạy `prisma db push` và `prisma generate` để đồng bộ.
<!-- END:nextjs-agent-rules -->

