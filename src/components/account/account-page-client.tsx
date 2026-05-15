'use client'

import { FormEvent, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  AtSign,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  Save,
  Shield,
  User,
  UserPen,
} from 'lucide-react'
import {
  changePassword,
  updateAccountInfo,
  type AccountActionResult,
} from '@/actions/account-actions'
import type { AccountProfile } from '@/lib/account'

type AccountTab = 'overview' | 'edit' | 'password'

type MessageState = {
  type: 'success' | 'error'
  text: string
} | null

const tabs: Array<{
  id: AccountTab
  label: string
  mobileLabel: string
  icon: typeof User
}> = [
  {
    id: 'overview',
    label: 'Thông tin tài khoản',
    mobileLabel: 'Thông tin',
    icon: User,
  },
  {
    id: 'edit',
    label: 'Sửa thông tin',
    mobileLabel: 'Sửa',
    icon: UserPen,
  },
  {
    id: 'password',
    label: 'Đổi mật khẩu',
    mobileLabel: 'Mật khẩu',
    icon: KeyRound,
  },
]

function providerLabel(provider: AccountProfile['provider']) {
  return provider === 'google' ? 'Google' : 'Mail/Password'
}

function FormMessage({ message }: { message: MessageState }) {
  if (!message) return null

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${
        message.type === 'success'
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'border-red-500/30 bg-red-500/10 text-red-500'
      }`}
    >
      {message.text}
    </div>
  )
}

function ReadOnlyNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
      <Lock size={16} className="mt-0.5 shrink-0" />
      <p>{children}</p>
    </div>
  )
}

function Field({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof User
}) {
  return (
    <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        <Icon size={14} />
        {label}
      </div>
      <p className="break-words text-sm font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  )
}

function AccountOverview({ profile }: { profile: AccountProfile }) {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Thông tin tài khoản
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Thông tin đăng nhập hiện tại của bạn trên QuickTodo.
        </p>
      </div>

      <div className="grid gap-3">
        <Field
          label="Loại tài khoản"
          value={providerLabel(profile.provider)}
          icon={Shield}
        />
        <Field
          label="Tên người dùng"
          value={profile.name ?? 'Chưa có tên hiển thị'}
          icon={User}
        />
        <Field
          label="Email"
          value={profile.email ?? 'Chưa có email'}
          icon={Mail}
        />
      </div>

      {profile.provider === 'google' && (
        <div className="flex items-start gap-3 rounded-lg border border-blue-500/25 bg-blue-500/10 px-4 py-3 text-sm text-blue-600 dark:text-blue-300">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <p>Thông tin tài khoản này được quản lí bởi Google.</p>
        </div>
      )}
    </section>
  )
}

function EditProfileForm({ profile }: { profile: AccountProfile }) {
  const router = useRouter()
  const { update } = useSession()
  const [name, setName] = useState(profile.name ?? '')
  const [email, setEmail] = useState(profile.email ?? '')
  const [message, setMessage] = useState<MessageState>(null)
  const [isPending, startTransition] = useTransition()
  const disabled = !profile.canEditCredentials || isPending

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    startTransition(async () => {
      const result: AccountActionResult = await updateAccountInfo({ name, email })
      setMessage({
        type: result.ok ? 'success' : 'error',
        text: result.message,
      })

      if (result.ok) {
        await update({
          user: {
            name: result.name,
            email: result.email,
            image: profile.image,
          },
        })
        router.refresh()
      }
    })
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Sửa thông tin
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Cập nhật tên người dùng và email cho tài khoản Mail/Password.
        </p>
      </div>

      {!profile.canEditCredentials && (
        <ReadOnlyNotice>
          Tài khoản Google không thể sửa thông tin tại QuickTodo.
        </ReadOnlyNotice>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Tên người dùng
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
              <User size={16} />
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={disabled}
              maxLength={80}
              autoComplete="name"
              className="h-12 w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition-all placeholder:text-[var(--muted-foreground)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Email
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
              <AtSign size={16} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={disabled}
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition-all placeholder:text-[var(--muted-foreground)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <FormMessage message={message} />

        <button
          type="submit"
          disabled={disabled}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <Save size={16} />
          {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>
    </section>
  )
}

function ChangePasswordForm({ profile }: { profile: AccountProfile }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<MessageState>(null)
  const [isPending, startTransition] = useTransition()
  const disabled = !profile.canEditCredentials || isPending

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    startTransition(async () => {
      const result = await changePassword({ password, confirmPassword })
      setMessage({
        type: result.ok ? 'success' : 'error',
        text: result.message,
      })

      if (result.ok) {
        setPassword('')
        setConfirmPassword('')
        await signOut({ callbackUrl: '/auth/signin?callbackUrl=/profile' })
      }
    })
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Đổi mật khẩu
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Tạo mật khẩu mới cho lần đăng nhập tiếp theo.
        </p>
      </div>

      {!profile.canEditCredentials && (
        <ReadOnlyNotice>
          Tài khoản Google không dùng mật khẩu QuickTodo.
        </ReadOnlyNotice>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Nhập mật khẩu mới
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
              <KeyRound size={16} />
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={disabled}
              minLength={6}
              maxLength={128}
              autoComplete="new-password"
              placeholder="Ít nhất 6 ký tự"
              className="h-12 w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition-all placeholder:text-[var(--muted-foreground)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
              <Lock size={16} />
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={disabled}
              minLength={6}
              maxLength={128}
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu mới"
              className="h-12 w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition-all placeholder:text-[var(--muted-foreground)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <FormMessage message={message} />

        <button
          type="submit"
          disabled={disabled}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <KeyRound size={16} />
          {isPending ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
        </button>
      </form>
    </section>
  )
}

export default function AccountPageClient({ profile }: { profile: AccountProfile }) {
  const [activeTab, setActiveTab] = useState<AccountTab>('overview')

  const activeContent = useMemo(() => {
    if (activeTab === 'edit') return <EditProfileForm profile={profile} />
    if (activeTab === 'password') return <ChangePasswordForm profile={profile} />
    return <AccountOverview profile={profile} />
  }, [activeTab, profile])

  return (
    <div className="flex flex-1 flex-col bg-[var(--background)]">
      <main className="flex-1 px-4 py-8 pb-28 md:px-6 md:pb-8">
        <div className="mx-auto flex w-full max-w-6xl gap-8">
          <aside className="hidden w-64 shrink-0 md:block">
            <div className="sticky top-24 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-2 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-[var(--foreground)] hover:bg-[var(--muted)]'
                    }`}
                  >
                    <Icon
                      size={17}
                      className={isActive ? 'text-white' : 'text-[var(--muted-foreground)]'}
                    />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="max-w-2xl rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-sm sm:p-6">
              {activeContent}
            </div>
          </div>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-2 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] md:hidden">
          <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Icon size={17} />
                  <span className="max-w-full truncate">{tab.mobileLabel}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </main>

      <footer className="hidden border-t border-zinc-200 py-6 text-center dark:border-zinc-800 md:block">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
          2026 - HO THONG 3K
        </p>
      </footer>
    </div>
  )
}
