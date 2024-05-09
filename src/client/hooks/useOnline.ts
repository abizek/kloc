import { useSyncExternalStore } from 'react'

export function useOnline() {
  const getSnapshot = () => navigator.onLine

  const subscribe = (onChange: () => void): (() => void) => {
    window.addEventListener('online', onChange, { passive: true })
    window.addEventListener('offline', onChange, { passive: true })

    return () => {
      window.removeEventListener('online', onChange)
      window.removeEventListener('offline', onChange)
    }
  }

  return useSyncExternalStore(subscribe, getSnapshot)
}
