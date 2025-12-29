import { useEffect, useState } from 'react'
import { useMounted } from './useMounted'

type Theme = 'dark' | 'deep'

export const useTheme = () => {
  const mounted = useMounted()
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    if (!mounted) return

    document.documentElement.setAttribute(
      'data-theme',
      theme === 'dark' ? '' : 'deep'
    )
  }, [theme, mounted])

  return {
    theme,
    toggleTheme: () =>
      setTheme(t => (t === 'dark' ? 'deep' : 'dark')),
  }
}
