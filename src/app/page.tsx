import Link from "next/link";
import { CheckCircle2, CloudSync, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[var(--background)]">
      <main className="flex-1 flex flex-col items-center pt-24 pb-16 px-4">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mb-16">
          <h1 className="text-5xl font-black tracking-tight text-title sm:text-6xl mb-6">
            Quản lý công việc <br />
            <span className="text-blue-500">nhanh gọn & tối ưu</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Không cần tải app linh tinh, không yêu cầu đăng nhập nếu bạn không muốn. Chỉ cần mở web lên và tập trung tạo nhanh các công việc cần làm của bạn!
            <br />
            (À nhưng mà nếu muốn tạo nhanh ở mọi thiết bị thì phải đăng nhập đấy nhé!)
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/todo"
              className="w-full sm:w-auto px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded-lg font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Dùng ngay!
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              Về người làm web
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full mb-20">
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <Smartphone className="w-12 h-12 mb-4 text-blue-500" />
            <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Đa nền tảng</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Sử dụng mượt mà trên cả điện thoại và máy tính trực tiếp qua trình duyệt.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CheckCircle2 className="w-12 h-12 mb-4 text-green-500" />
            <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Lưu trữ cục bộ</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Sử dụng ngay không cần tài khoản, dữ liệu được lưu an toàn trong trình duyệt của bạn.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CloudSync className="w-12 h-12 mb-4 text-purple-500" />
            <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Đồng bộ đám mây</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Đăng nhập để lưu trữ dữ liệu lên đám mây và đồng bộ trên nhiều thiết bị.
            </p>
          </div>
        </div>

        {/* How to use */}
        <div className="max-w-2xl w-full text-left bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-zinc-900 dark:text-zinc-100">Hướng dẫn sử dụng cơ bản</h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">1</span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">Truy cập Trang Todo</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Nhấp vào "Dùng ngay" hoặc nút Trang Chủ trên thanh điều hướng.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">2</span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">Thêm công việc</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Nhập nội dung công việc, chọn mức độ ưu tiên và nhấn Enter.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">3</span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">Quản lý hiệu quả</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Đánh dấu hoàn thành, sửa hoặc xóa công việc. Tạo tài khoản để lưu trữ online.</p>
              </div>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-6 text-center dark:border-zinc-800">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
          2026 – HO THONG 3K - V1.6
        </p>
      </footer>
    </div>
  );
}
