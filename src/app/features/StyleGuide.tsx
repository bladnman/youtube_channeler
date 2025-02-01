'use client'

import { Box, Button, Code, Heading, HStack, SimpleGrid, Text, useColorMode, VStack } from '@chakra-ui/react'

export function StyleGuide() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <VStack spacing={8} w="full" align="stretch">
      <Heading size="lg" textAlign="center">Style Guide</Heading>
      <Text fontSize="xl" textAlign="center" mb={8}>
        Theme colors are defined in the theme.ts file.
      </Text>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        {/* Brand Color Section */}
        <Box p={6} borderWidth={1} borderRadius="lg" borderColor="brand.300">
          <Heading size="md" mb={4} color="brand.text">Brand Colors</Heading>
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <Text>Primary Action</Text>
              <Button size="sm" colorScheme="brand">Button</Button>
            </HStack>
            <HStack justify="space-between">
              <Text>Outline Style</Text>
              <Button size="sm" variant="outline" colorScheme="brand">Button</Button>
            </HStack>
            <Box p={3} bg="brand.hover" borderRadius="md">
              <Text fontSize="sm">Hover Background</Text>
            </Box>
            <Text color="brand.text">Brand Text Color</Text>
          </VStack>
        </Box>

        {/* Secondary Color Section */}
        <Box p={6} borderWidth={1} borderRadius="lg" borderColor="secondary.300">
          <Heading size="md" mb={4} color="secondary.text">Secondary Colors</Heading>
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <Text>Secondary Action</Text>
              <Button size="sm" colorScheme="secondary">Button</Button>
            </HStack>
            <HStack justify="space-between">
              <Text>Outline Style</Text>
              <Button size="sm" variant="outline" colorScheme="secondary">Button</Button>
            </HStack>
            <Box p={3} bg="secondary.hover" borderRadius="md">
              <Text fontSize="sm">Hover Background</Text>
            </Box>
            <Text color="secondary.text">Secondary Text Color</Text>
          </VStack>
        </Box>
      </SimpleGrid>

      <Box textAlign="center" p={6} bg={colorMode === 'light' ? 'gray.50' : 'gray.800'} borderRadius="lg">
        <VStack spacing={4}>
          <Text fontSize="sm" color="chakra-subtle-text">
            This theme supports both light and dark modes.
          </Text>
          <Button size="sm" onClick={toggleColorMode} colorScheme="secondary" variant="outline">
            Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </VStack>
      </Box>

      {/* Code Examples Section */}
      <Box p={6} borderWidth={1} borderRadius="lg" borderColor="gray.200">
        <Heading size="md" mb={4} color="brand.text">Code Examples</Heading>
        <VStack align="stretch" spacing={6}>
          {/* Color Scale Examples */}
          <Box>
            <Text mb={2} fontWeight="semibold">Color Scale Usage:</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontSize="sm" mb={1}>Brand Colors:</Text>
                <Code display="block" p={2} borderRadius="md" whiteSpace="pre">{`color="brand.500"    /* Primary */
color="brand.600"    /* Darker */
color="brand.400"    /* Lighter */
color="brand.text"   /* Semantic */`}</Code>
              </Box>
              <Box>
                <Text fontSize="sm" mb={1}>Secondary Colors:</Text>
                <Code display="block" p={2} borderRadius="md" whiteSpace="pre">{`color="secondary.500"    /* Primary */
color="secondary.600"    /* Darker */
color="secondary.400"    /* Lighter */
color="secondary.text"   /* Semantic */`}</Code>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Component Examples */}
          <Box>
            <Text mb={2} fontWeight="semibold">Component Usage:</Text>
            <Code display="block" p={2} borderRadius="md" whiteSpace="pre">
{`// Button with brand colors
<Button colorScheme="brand">
  Brand Button
</Button>

// Text with semantic colors
<Text color="brand.text">
  Brand Text
</Text>

// Background with hover state
<Box 
  bg="secondary.hover"
  color="secondary.text"
>
  Content
</Box>`}</Code>
          </Box>
        </VStack>
      </Box>
    </VStack>
  )
} 