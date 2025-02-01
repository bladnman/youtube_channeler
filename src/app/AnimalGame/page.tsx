'use client'

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { AnimalControls } from './features/AnimalControls'
import { AnimalDisplay } from './features/AnimalDisplay'
import { AnimalScoreboard } from './features/AnimalScoreboard'
import { AnimalProvider } from './models/AnimalContext'

export default function Example() {
  return (
    <Container maxW="container.xl" py={10}>
      <AnimalProvider>
        <VStack gap={8} alignItems="stretch">
          <Box textAlign="center">
            <Heading size="2xl" mb={4}>
              Animal Emoji Collector
            </Heading>
            <Text fontSize="xl" color="gray.600" mb={8}>
              Toggle the switch to start collecting animal friends!
            </Text>
          </Box>
          
          <AnimalControls />
          <AnimalDisplay />
          <AnimalScoreboard />
        </VStack>
      </AnimalProvider>
    </Container>
  )
}
