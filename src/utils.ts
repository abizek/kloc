import clsx from 'clsx'
import { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function formatTime(timeMS: number): string {
  const date = new Date(timeMS),
    hh = stringifyTimeUnit(date.getUTCHours()),
    mm = stringifyTimeUnit(date.getUTCMinutes()),
    ss = stringifyTimeUnit(date.getUTCSeconds()),
    ms = stringifyTimeUnit(date.getUTCMilliseconds())

  return `${hh !== '00' ? `${hh}:` : ''}${mm}:${ss}.${ms}`
}

function stringifyTimeUnit(unit: number): string {
  return `0${unit}`.slice(-2)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
