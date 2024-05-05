import { useRef, useSyncExternalStore } from 'react'
import type { Tab } from '../utils'
import { LAST_VISITED_PATH, getPage, getSlug, isValidRoute } from '../utils'

type Router = {
  tab: Tab
  roomId: string
  handleTabChange: (tab: string) => void
}

export function useRouter() {
  const router = useRef<Router>(getRouter())
  const lastVisitedPath = localStorage.getItem(LAST_VISITED_PATH)

  if (location.pathname === '/') {
    if (lastVisitedPath) {
      replaceState(lastVisitedPath)
      router.current = getRouter()
    }
  } else {
    if (location.pathname.split('/').length > 3) {
      const page = getPage(location.pathname)
      const slug = getSlug(location.pathname)
      replaceState(`/${page}/${slug}`)
    }

    localStorage.setItem(LAST_VISITED_PATH, location.pathname)
  }

  if (!isValidRoute(getPage(location.pathname))) {
    const homePage = '/kloc'
    localStorage.setItem(LAST_VISITED_PATH, homePage)
    replaceState(homePage)
    router.current = {
      ...getRouter(),
      tab: 'kloc',
    }
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
    window.addEventListener('popstate', handleChange)

    return () => {
      observer.disconnect()
      window.removeEventListener('popstate', handleChange)
    }
  }

  return useSyncExternalStore(subscribe, () => router.current)
}

function getRouter(): Router {
  return {
    tab: getPage(location.pathname) as Tab,
    roomId: getSlug(location.pathname),
    handleTabChange,
  }
}

function handleTabChange(tab: string) {
  const slug = getSlug(location.pathname)
  pushState(`/${tab}${slug ? `/${slug}` : ''}`)
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
