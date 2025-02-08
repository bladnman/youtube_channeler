'use client'

import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { FaGoogle } from 'react-icons/fa'

export default function SignIn() {
  return (
    <Container maxW="container.sm" py={16}>
      <VStack spacing={8} align="stretch">
        <VStack spacing={4} textAlign="center">
          <Heading size="xl">Welcome to Channel Surfer</Heading>
          <Text color="gray.600">
            Sign in to save your favorite YouTube channels and access them from anywhere
          </Text>
        </VStack>

        <Box
          p={8}
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          border="1px"
          borderColor="gray.100"
        >
          <VStack spacing={6}>
            <Button
              w="100%"
              size="lg"
              leftIcon={<FaGoogle />}
              onClick={() => signIn('google')}
              colorScheme="red"
            >
              Continue with Google
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
} 