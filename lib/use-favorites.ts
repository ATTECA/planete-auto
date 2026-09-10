'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'pa-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setFavorites(JSON.parse(stored))
    } catch {
      // ignore corrupted or inaccessible storage
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // ignore write failures (private browsing, storage full, etc.)
    }
  }, [favorites])

  const isFavorite = (id: number) => favorites.includes(id)

  const toggle = (id: number) => {
    setFavorites((current) => (current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id]))
  }

  return { favorites, isFavorite, toggle }
}
