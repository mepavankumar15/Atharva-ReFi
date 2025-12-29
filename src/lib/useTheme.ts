import { useEffect, useState } from 'react'

type Theme = 'dark' | 'deep' | 'light'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'dark' ? '' : theme
    )
  }, [theme])

  return {
    theme,
    toggleTheme: () =>
      setTheme(t =>
        t === 'dark' ? 'deep' : t === 'deep' ? 'light' : 'dark'
      ),
  }
}
