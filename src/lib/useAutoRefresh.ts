import { useEffect } from 'react'

export const useAutoRefresh = (
  callback: () => void,
  intervalMs = 15000
) => {
  useEffect(() => {
    callback() // initial fetch

    const id = setInterval(callback, intervalMs)
    return () => clearInterval(id)
  }, [callback, intervalMs])
}
