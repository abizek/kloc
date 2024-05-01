import clsx from 'clsx'
import type { ClassValue } from 'clsx'
import { invert } from 'lodash'
import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { Kloc } from './components/Kloc/Kloc'
import { Stopwatch } from './components/Stopwatch/Stopwatch'
import { Timer } from './components/Timer/Timer'

export function prefixZero(unit: number): string {
  return `0${unit}`.slice(-2)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const routes = ['/', '/stopwatch', '/timer'] as const

type Route = (typeof routes)[number]

export const routeTabRecord: Record<Route, Tab> = {
  '/': 'kloc',
  '/stopwatch': 'stopwatch',
  '/timer': 'timer',
}

const tabRouteRecord = invert(routeTabRecord)

type TabData = {
  tab: Tab
  label: string
  Content: FC
}

export const tabsRecord: Record<Tab, TabData> = {
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

export const tabs = Object.values(tabsRecord)

export function isRoute(path: string): path is Route {
  return Boolean(routes.find((route) => route === path))
}

export function redirectToHome() {
  history.replaceState(null, '', '/')
}

export function handleTabChange(tab: string) {
  history.pushState(null, '', tabRouteRecord[tab])
}
