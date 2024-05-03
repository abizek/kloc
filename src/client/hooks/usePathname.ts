import { useSyncExternalStore } from 'react'
import type { Tab } from '../utils'
import {
  LAST_VISITED_PATH,
  getPage,
  getSlug,
  redirectToTab,
  isValidRoute,
  redirectToHome,
  restoreLastVisitedPath,
} from '../utils'

type Store = {
  route: Tab
  slug: string
}

let store = {} as Store

function setStore() {
  store = {
    route: getPage(location.pathname) as Tab,
    slug: getSlug(location.pathname),
  }
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

function subscribe(onChange: () => void): () => void {
  const handleChange = () => {
    localStorage.setItem(LAST_VISITED_PATH, location.pathname)
    setStore()
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

export function usePathname() {
  if (location.pathname === '/') {
    restoreLastVisitedPath()
  } else if (location.pathname.split('/').length > 3) {
    redirectToTab(getPage(location.pathname))
  } else {
    localStorage.setItem(LAST_VISITED_PATH, location.pathname)
  }

  if (!isValidRoute(getPage(location.pathname))) {
    redirectToHome()
  }

  setStore()

  return useSyncExternalStore(subscribe, () => store)
}
