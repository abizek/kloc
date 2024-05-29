import type { ClassValue } from 'clsx'
import clsx from 'clsx'
import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import Kloc from './components/Kloc'
import Stopwatch from './components/Stopwatch'
import Timer from './components/Timer'

export function prefixZero(unit: number): string {
  return `0${unit}`.slice(-2)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const tabs = ['kloc', 'stopwatch', 'timer'] as const

export type Tab = (typeof tabs)[number]

type TabData = {
  tab: Tab
  label: string
  Content: FC
}

export const tabRecord: Record<Tab, TabData> = {
  kloc: {
    tab: 'kloc',
    label: 'Kloc',
    Content: Kloc,
  },
  stopwatch: {
    tab: 'stopwatch',
    label: 'Stopwatch',
    Content: Stopwatch,
  },
  timer: {
    tab: 'timer',
    label: 'Timer',
    Content: Timer,
  },
}

export const tabList = Object.values(tabRecord)
