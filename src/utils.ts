import clsx from 'clsx'
import { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function formatTime(timeinMs: number, padding: number = 0): string {
  const date = new Date(timeinMs),
    hh = prefixZero(date.getUTCHours()),
    mm = prefixZero(date.getUTCMinutes()),
    ss = prefixZero(date.getUTCSeconds()),
    ms = prefixZero(Math.floor(date.getUTCMilliseconds() / 10))

  const pad = '\u00A0'.repeat(padding)
  return `${hh !== '00' ? `${hh}${pad}:${pad}` : ''}${mm}${pad}:${pad}${ss}${pad}.${pad}${ms}`
}

export function prefixZero(unit: number): string {
  return `0${unit}`.slice(-2)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
