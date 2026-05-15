export const APP_TIME_ZONE = 'Asia/Ho_Chi_Minh'

function formatDateParts(parts: Intl.DateTimeFormatPart[]) {
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )

  return `${values.year}-${values.month}-${values.day}`
}

export function getLocalDateString(timeZone = APP_TIME_ZONE) {
  return formatDateParts(
    new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date())
  )
}

export async function getCurrentDateString() {
  try {
    const response = await fetch('/api/current-date', {
      cache: 'no-store',
    })

    if (!response.ok) {
      return getLocalDateString()
    }

    const data = (await response.json()) as { today?: string }
    return data.today ?? getLocalDateString()
  } catch {
    return getLocalDateString()
  }
}
