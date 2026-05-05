# QuickTodo – Walkthrough

## Tổng quan
Xây dựng ứng dụng QuickTodo với giao diện dark theme, hỗ trợ CRUD đầy đủ, hệ thống ưu tiên 4 cấp, và toggle sáng/tối.

## Các thay đổi chính

### Dependencies
- Cài `prisma@6` + `@prisma/client@6` (v7 chưa hỗ trợ MongoDB)
- Cài `lucide-react` (icons), `next-themes` (dark/light toggle)

### Backend
| File | Mô tả |
|------|--------|
| [schema.prisma](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/prisma/schema.prisma) | Model Todo với trường `priority` (1-4) |
| [.env](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/.env) | MongoDB Atlas connection string |
| [prisma.ts](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/src/lib/prisma.ts) | PrismaClient singleton |
| [todo-actions.ts](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/src/actions/todo-actions.ts) | Server actions: add, toggle, update, updatePriority, delete |
| [index.ts](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/src/types/index.ts) | Type definitions |

### UI Components
| File | Mô tả |
|------|--------|
| [theme-provider.tsx](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/src/components/theme-provider.tsx) | next-themes wrapper (dark mặc định) |
| [theme-toggle.tsx](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/src/components/theme-toggle.tsx) | Nút ☀ Sáng / 🌙 Tối |
| [todo-form.tsx](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/src/components/todo-form.tsx) | Input + nút "+ Thêm" |
| [priority-picker.tsx](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/src/components/priority-picker.tsx) | Popover 4 cấp ưu tiên (đỏ/cam/xanh/xám) |
| [todo-item.tsx](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/src/components/todo-item.tsx) | Todo card: checkbox, inline edit, priority, delete |
| [todo-list.tsx](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/src/components/todo-list.tsx) | Render danh sách + empty state |

### Pages & Styles
| File | Mô tả |
|------|--------|
| [layout.tsx](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/src/app/layout.tsx) | Font Inter, ThemeProvider, SEO metadata |
| [page.tsx](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/src/app/page.tsx) | Server component: fetch todos, render layout |
| [globals.css](file:///c:/Users/Thong/Documents/Code/Web/quicktodo/src/app/globals.css) | CSS variables, animations, scrollbar |

## Screenshots

### Dark theme với todos và priority
![QuickTodo priority dropdown](C:/Users/Thong/.gemini/antigravity/brain/ade647bb-2cc1-4670-96e9-e16485130750/priority_dropdown.png)

### Demo video
![QuickTodo full test recording](C:/Users/Thong/.gemini/antigravity/brain/ade647bb-2cc1-4670-96e9-e16485130750/quicktodo_full_test_1777987686274.webp)

## Verification
- ✅ Dev server chạy thành công (`npm run dev`)
- ✅ Thêm, sửa, xoá todo hoạt động
- ✅ Toggle checkbox đánh dấu hoàn thành
- ✅ Priority picker hiện đúng 4 cấp
- ✅ Border color thay đổi theo priority
- ✅ Tự động sắp xếp theo priority
- ✅ Dark theme mặc định, toggle sang light mode
- ✅ Footer hiển thị đúng "2026 – HO THONG 3K"
