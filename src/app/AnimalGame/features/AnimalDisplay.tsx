'use client'

import { Box, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useAnimalContext } from '../models/AnimalContext'

export const AnimalDisplay = () => {
  const { animals, isEnabled, addInterval, addRandomAnimal } = useAnimalContext()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isEnabled) {
      interval = setInterval(addRandomAnimal, addInterval)
    }
    return () => clearInterval(interval)
  }, [isEnabled, addInterval, addRandomAnimal])

  return (
    <Box
      borderWidth={1}
      borderRadius="lg"
      p={4}
      minHeight="200px"
      maxHeight="400px"
      overflowY="auto"
    >
      <Wrap spacing={2}>
        {animals.map((animal, index) => (
          <WrapItem key={index}>
            <Text fontSize="2xl">{animal}</Text>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  )
} 