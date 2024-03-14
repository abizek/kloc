import clsx from 'clsx'
import { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function formatTime(timeinMs: number, padding: number = 0): string {
  const date = new Date(timeinMs)
  const [hh, mm, ss, ms] = [
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    Math.floor(date.getUTCMilliseconds() / 10),
  ].map(prefixZero)

  return `${hh !== '00' ? `${hh} : ` : ''}${mm} : ${ss} . ${ms}`.replace(
    / /g,
    '\u00A0'.repeat(padding),
  )
}

export function prefixZero(unit: number): string {
  return `0${unit}`.slice(-2)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
