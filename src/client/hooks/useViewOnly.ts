export function useViewOnly() {
  const params = new URLSearchParams(location.search)
  const viewOnly = params.get('view-only')
  if (viewOnly === '') return true

  return false
}
