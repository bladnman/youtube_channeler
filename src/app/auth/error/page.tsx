'use client'

import { WarningIcon } from '@chakra-ui/icons'
import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthError() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'AccessDenied':
        return 'You need to allow access to your Google account to use this feature.'
      case 'Verification':
        return 'The verification link is no longer valid. Please try signing in again.'
      case 'Configuration':
        return 'There is a problem with the server configuration. Please try again later.'
      case 'OAuthSignin':
        return 'Could not sign in with Google. Please try again.'
      default:
        return 'An error occurred during sign in. Please try again.'
    }
  }

  return (
    <Container maxW="container.sm" py={16}>
      <VStack spacing={8} align="stretch">
        <VStack spacing={4} textAlign="center">
          <WarningIcon boxSize={12} color="red.500" />
          <Heading size="lg">Authentication Error</Heading>
          <Text color="gray.600">
            {error ? getErrorMessage(error) : 'An error occurred during sign in.'}
          </Text>
        </VStack>

        <Box textAlign="center">
          <Button
            colorScheme="red"
            onClick={() => router.push('/auth/signin')}
          >
            Try Again
          </Button>
        </Box>
      </VStack>
    </Container>
  )
} 