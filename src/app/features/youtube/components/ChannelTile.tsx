'use client'

import { Box, Card, CardBody, Heading, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'

export interface Channel {
  id: string
  title: string
  thumbnail: string
  description: string
  customUrl?: string
}

interface ChannelTileProps {
  channel: Channel
  onClick: (channel: Channel) => void
}

export function ChannelTile({ channel, onClick }: ChannelTileProps) {
  return (
    <Card 
      cursor="pointer" 
      onClick={() => onClick(channel)}
      _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
    >
      <CardBody>
        <VStack align="start" spacing={3}>
          <Box display="flex" alignItems="center" width="100%">
            <Box position="relative" width="50px" height="50px" borderRadius="full" overflow="hidden">
              <Image
                src={channel.thumbnail}
                alt={channel.title}
                fill
                sizes="50px"
                style={{ objectFit: 'cover' }}
              />
            </Box>
            <Heading size="md" ml={4} noOfLines={1}>
              {channel.title}
            </Heading>
          </Box>
          <Text color="gray.600" noOfLines={2}>
            {channel.description}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  )
} 