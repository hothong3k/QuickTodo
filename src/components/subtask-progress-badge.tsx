import type { Subtask } from '@/types'

interface SubtaskProgressBadgeProps {
  subtasks?: Subtask[]
}

export default function SubtaskProgressBadge({
  subtasks = [],
}: SubtaskProgressBadgeProps) {
  if (subtasks.length === 0) return null

  const doneCount = subtasks.filter((subtask) => subtask.isDone).length
  const totalCount = subtasks.length
  const isComplete = doneCount === totalCount

  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-full border px-2 text-xs font-semibold ${
        isComplete
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'border-[var(--card-border)] bg-[var(--background)] text-[var(--muted-foreground)]'
      }`}
      title="Tiến độ todo phụ"
    >
      {doneCount}/{totalCount} Todo phụ
    </span>
  )
}
