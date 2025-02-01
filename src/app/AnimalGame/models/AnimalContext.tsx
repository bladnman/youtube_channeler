'use client'

import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

// Define animal categories by temperament
const ANIMAL_CATEGORIES = {
  gentle: ['🐰', '🐨', '🐼', '🐷', '🐮', '🐑', '🦒', '🐢'],
  neutral: ['🐶', '🐱', '🐭', '🐹', '🐸', '🦊', '🐻', '🐵'],
  aggressive: ['🦁', '🐯', '🐺', '🦈', '🐊', '🦂', '🦅', '🐍']
} as const

interface AnimalStats {
  [key: string]: number
}

interface AnimalContextType {
  isEnabled: boolean
  setIsEnabled: (value: boolean) => void
  animals: string[]
  addInterval: number
  setAddInterval: (value: number) => void
  temperament: number
  setTemperament: (value: number) => void
  animalStats: AnimalStats
  addRandomAnimal: () => void
  totalAnimals: number
}

const AnimalContext = createContext<AnimalContextType | null>(null)

export const useAnimalContext = () => {
  const context = useContext(AnimalContext)
  if (!context) throw new Error('useAnimalContext must be used within an AnimalProvider')
  return context
}

export const AnimalProvider = ({ children }: { children: ReactNode }) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [animals, setAnimals] = useState<string[]>([])
  const [addInterval, setAddInterval] = useState(500)
  const [temperament, setTemperament] = useState(50) // 0-100: gentle to aggressive
  const [animalStats, setAnimalStats] = useState<AnimalStats>({})

  const getRandomAnimal = useCallback(() => {
    // Determine which category to pick from based on temperament
    let category: keyof typeof ANIMAL_CATEGORIES
    if (temperament < 33) {
      category = 'gentle'
    } else if (temperament < 66) {
      category = 'neutral'
    } else {
      category = 'aggressive'
    }

    // Add some randomness - sometimes pick from adjacent categories
    const rand = Math.random()
    if (rand < 0.2) {
      if (category === 'gentle') category = 'neutral'
      else if (category === 'aggressive') category = 'neutral'
      else category = rand < 0.5 ? 'gentle' : 'aggressive'
    }

    const categoryAnimals = ANIMAL_CATEGORIES[category]
    return categoryAnimals[Math.floor(Math.random() * categoryAnimals.length)]
  }, [temperament])

  const addRandomAnimal = useCallback(() => {
    if (animals.length >= 100) {
      setIsEnabled(false)
      return
    }
    const newAnimal = getRandomAnimal()
    setAnimals(prev => [...prev, newAnimal])
    setAnimalStats(prev => ({
      ...prev,
      [newAnimal]: (prev[newAnimal] || 0) + 1
    }))
  }, [animals.length, getRandomAnimal])

  return (
    <AnimalContext.Provider
      value={{
        isEnabled,
        setIsEnabled,
        animals,
        addInterval,
        setAddInterval,
        temperament,
        setTemperament,
        animalStats,
        addRandomAnimal,
        totalAnimals: animals.length
      }}
    >
      {children}
    </AnimalContext.Provider>
  )
} 