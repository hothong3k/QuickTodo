export type DueDateStatus = 'today' | 'overdue' | 'upcoming' | null

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function isValidDueDate(value: string | null | undefined): value is string {
  if (!value || !DATE_ONLY_PATTERN.test(value)) return false

  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return false

  return date.toISOString().slice(0, 10) === value
}

export function normalizeDueDate(value: string | null | undefined): string | null {
  if (!value) return null
  const cleanValue = value.trim()
  return isValidDueDate(cleanValue) ? cleanValue : null
}

export function getDueDateStatus(
  dueDate: string | null | undefined,
  today: string,
  isDone: boolean
): DueDateStatus {
  if (isDone || !isValidDueDate(dueDate) || !isValidDueDate(today)) {
    return null
  }

  if (dueDate < today) return 'overdue'
  if (dueDate === today) return 'today'
  return 'upcoming'
}
