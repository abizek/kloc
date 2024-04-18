import { useSyncExternalStore } from 'react'

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

function subscribe(callback: () => void): () => void {
  const observer = getObserver(callback)
  const body = document.querySelector('body')!
  observer.observe(body, { subtree: true, attributes: true })
  window.addEventListener('popstate', callback)

  return () => {
    observer.disconnect()
    window.removeEventListener('popstate', callback)
  }
}

export function usePathname() {
  return useSyncExternalStore(subscribe, () => location.pathname)
}
