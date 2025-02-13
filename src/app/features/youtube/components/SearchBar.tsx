'use client'

import { Button, Flex, Input } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useYouTubeContext } from '../context/YouTubeContext'

interface SearchBarProps {
  variant?: 'default' | 'compact'
}

export const SearchBar = ({ variant = 'default' }: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState('')
  const { searchChannel } = useYouTubeContext()
  const router = useRouter()

  const handleSearch = async () => {
    if (searchInput.trim()) {
      try {
        const channelData = await searchChannel(searchInput.trim())
        if (channelData?.customUrl) {
          await router.push(`/channel-v2/${channelData.customUrl}`)
        } else if (channelData?.id) {
          await router.push(`/channel-v2/${channelData.id}`)
        }
      } catch (error) {
        console.error('Error searching for channel:', error)
      }
    }
  }

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      await handleSearch()
    }
  }

  const isCompact = variant === 'compact'

  return (
    <Flex gap={4} w="full">
      <Input
        flex={1}
        size={isCompact ? 'md' : 'lg'}
        fontSize={isCompact ? 'md' : 'xl'}
        fontWeight="500"
        placeholder="Enter YouTube channel URL or name"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyPress={handleKeyPress}
        bg="white"
        _dark={{
          bg: 'gray.800'
        }}
        borderWidth={2}
        _hover={{
          borderColor: 'red.500'
        }}
        _focus={{
          borderColor: 'red.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-red-500)'
        }}
      />
      <Button
        colorScheme="red"
        size={isCompact ? 'md' : 'lg'}
        fontSize={isCompact ? 'md' : 'xl'}
        fontWeight="600"
        px={isCompact ? 6 : 8}
        onClick={handleSearch}
      >
        Search
      </Button>
    </Flex>
  )
} 