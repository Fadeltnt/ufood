import { useState, useEffect, useCallback } from 'react'

export const useItemsPerScreen = () => {
  const getItemsPerScreen = useCallback(() => {
    const width = window.innerWidth
    if (width < 500) return 2
    if (width < 800) return 3
    if (width < 1100) return 4
    if (width < 1400) return 5
    if (width < 3202) return 6
    return 7
  }, [])

  const [itemsPerScreen, setItemsPerScreen] = useState(getItemsPerScreen())

  useEffect(() => {
    const handleResize = () => setItemsPerScreen(getItemsPerScreen())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [getItemsPerScreen])

  return itemsPerScreen
}
