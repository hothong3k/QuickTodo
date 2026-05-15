import { CalendarClock } from 'lucide-react'
import type { DueDateStatus } from '@/lib/due-date'

const BADGE_CONFIG: Record<Exclude<DueDateStatus, null>, { label: string; className: string }> = {
  today: {
    label: 'Hôm nay',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  overdue: {
    label: 'Quá hạn',
    className: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300',
  },
  upcoming: {
    label: 'Sắp tới',
    className: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300',
  },
}

interface DueDateBadgeProps {
  status: DueDateStatus
}

export default function DueDateBadge({ status }: DueDateBadgeProps) {
  if (!status) return null

  const config = BADGE_CONFIG[status]

  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center gap-1 rounded-full border px-2 text-[11px] font-semibold leading-none ${config.className}`}
    >
      <CalendarClock size={12} />
      {config.label}
    </span>
  )
}
