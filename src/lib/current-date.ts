export const APP_TIME_ZONE = 'Asia/Ho_Chi_Minh'

function formatDateParts(parts: Intl.DateTimeFormatPart[]) {
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )

  return `${values.year}-${values.month}-${values.day}`
}

export function getLocalDateString(timeZone = APP_TIME_ZONE, date = new Date()) {
  return formatDateParts(
    new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date)
  )
}

export function getMillisecondsUntilNextLocalDate(
  timeZone = APP_TIME_ZONE,
  date = new Date()
) {
  const currentDate = getLocalDateString(timeZone, date)
  const currentTime = date.getTime()
  let start = currentTime
  let end = currentTime + 48 * 60 * 60 * 1000

  while (end - start > 1000) {
    const middle = Math.floor((start + end) / 2)
    if (getLocalDateString(timeZone, new Date(middle)) === currentDate) {
      start = middle
    } else {
      end = middle
    }
  }

  return Math.max(1000, end - currentTime + 1000)
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
