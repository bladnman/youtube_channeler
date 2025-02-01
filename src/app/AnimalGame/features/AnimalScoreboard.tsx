'use client'

import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { useAnimalContext } from '../models/AnimalContext'

export const AnimalScoreboard = () => {
  const { animalStats, totalAnimals } = useAnimalContext()

  const sortedAnimals = Object.entries(animalStats)
    .sort(([, a], [, b]) => b - a)

  if (totalAnimals === 0) {
    return (
      <Box p={4} borderWidth={1} borderRadius="lg">
        <Text color="gray.500">No animals collected yet!</Text>
      </Box>
    )
  }

  return (
    <Box overflowX="auto" borderWidth={1} borderRadius="lg">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Animal</Th>
            <Th isNumeric>Count</Th>
            <Th isNumeric>Percentage</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedAnimals.map(([animal, count]) => (
            <Tr key={animal}>
              <Td fontSize="xl">{animal}</Td>
              <Td isNumeric>{count}</Td>
              <Td isNumeric>{((count / totalAnimals) * 100).toFixed(1)}%</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
} 