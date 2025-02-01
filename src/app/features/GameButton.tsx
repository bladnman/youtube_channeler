'use client'

import { Button, ButtonProps, Text } from '@chakra-ui/react'

interface GameButtonProps extends ButtonProps {
  emoji?: string
  label: string
  isDashed?: boolean
}

export function GameButton({ emoji, label, isDashed = false, ...props }: GameButtonProps) {
  return (
    <Button
      height="150px"
      width="150px"
      display="flex"
      flexDirection="column"
      gap={3}
      bg={isDashed ? 'transparent' : undefined}
      border={isDashed ? '2px' : '1px'}
      borderStyle={isDashed ? 'dashed' : 'solid'}
      borderColor="brand.300"
      rounded="lg"
      _hover={isDashed ? { borderColor: 'brand.400' } : { transform: 'translateY(-2px)', shadow: 'md' }}
      transition="all 0.2s"
      colorScheme="brand"
      {...props}
    >
      <Text fontSize={emoji ? '3xl' : '2xl'}>{emoji || '✨'}</Text>
      <Text>{label}</Text>
    </Button>
  )
} 