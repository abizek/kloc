import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from '@joaomoreno/unique-names-generator'
import { useRef, useSyncExternalStore } from 'react'
import type { Tab } from '../utils'
import { tabs } from '../utils'

type Router = {
  tab: Tab
  roomId: string
  handleTabChange: (tab: string) => void
  enterNewRoom: () => void
  exitRoom: () => void
}

const LAST_VISITED_PATH = 'last-visited-path'

export function useRouter() {
  const router = useRef<Router>(getRouter())
  const lastVisitedPath = localStorage.getItem(LAST_VISITED_PATH)

  if (location.pathname === '/') {
    if (lastVisitedPath) {
      replaceState(lastVisitedPath)
    }
  } else {
    if (location.pathname.split('/').length > 3) {
      const page = getPage()
      const slug = getSlug()
      replaceState(`/${page}/${slug}`)
    }

    localStorage.setItem(LAST_VISITED_PATH, location.pathname)
  }

  if (!isValidRoute(getPage())) {
    const homePage = '/kloc'
    localStorage.setItem(LAST_VISITED_PATH, homePage)
    replaceState(homePage)
  }

  const subscribe = (onChange: () => void): (() => void) => {
    const handleChange = () => {
      localStorage.setItem(LAST_VISITED_PATH, location.pathname)
      router.current = getRouter()
      onChange()
    }

    const observer = getObserver(handleChange)
    const body = document.querySelector('body')!
    observer.observe(body, { subtree: true, attributes: true })
    window.addEventListener('popstate', handleChange, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('popstate', handleChange)
    }
  }

  router.current = getRouter()
  return useSyncExternalStore(subscribe, () => router.current)
}

function getRouter(): Router {
  return {
    tab: getPage() as Tab,
    roomId: getSlug(),
    handleTabChange,
    enterNewRoom,
    exitRoom,
  }
}

function handleTabChange(tab: string) {
  const slug = getSlug()
  pushState(`/${tab}${slug ? `/${slug}` : ''}`)
}

function enterNewRoom() {
  const tab = getPage()
  const roomId = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: '-',
  })
  pushState(`/${tab}/${roomId}`)
}

function exitRoom() {
  const tab = getPage()
  pushState(`/${tab}`)
}

function pushState(value: string) {
  history.pushState(null, '', value)
}

function replaceState(value: string) {
  history.replaceState(null, '', value)
}

function getObserver(callback: () => void) {
  let currentPath = location.pathname
  const observer = new MutationObserver(() => {
    if (currentPath !== location.pathname) {
      currentPath = location.pathname
      callback()
    }
  })

  return observer
}

function isValidRoute(path: string): path is Tab {
  return typeof tabs.find((route) => route === path) === 'string'
}

function getPage() {
  return location.pathname.split('/')[1]
}

function getSlug() {
  return location.pathname.split('/')[2] ?? ''
}
