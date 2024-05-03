import { useSyncExternalStore } from 'react'
import type { Route } from '../utils'
import {
  LAST_VISITED_PATH,
  isRoute,
  redirectToHome,
  restoreLastVisitedPath,
} from '../utils'

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
  if (!isRoute(location.pathname)) {
    redirectToHome()
  }

  if (location.pathname === '/') {
    restoreLastVisitedPath()
  } else {
    localStorage.setItem(LAST_VISITED_PATH, location.pathname)
  }

  return useSyncExternalStore(
    subscribe,
    () => (localStorage.getItem(LAST_VISITED_PATH) ?? '/') as Route,
  )
}
