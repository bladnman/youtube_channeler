'use client'

import { Button, Flex, Input } from '@chakra-ui/react'
import { useState } from 'react'
import { useYouTubeContext } from '../context/YouTubeContext'

export const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('')
  const { searchChannel } = useYouTubeContext()

  const handleSearch = () => {
    if (searchInput.trim()) {
      searchChannel(searchInput.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Flex as="nav" bg="white" p={4} shadow="sm" position="sticky" top={0} zIndex={10}>
      <Flex maxW="container.xl" mx="auto" w="full" gap={4}>
        <Input
          flex={1}
          placeholder="Enter YouTube channel URL or name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button colorScheme="red" onClick={handleSearch}>
          Search
        </Button>
      </Flex>
    </Flex>
  )
} 