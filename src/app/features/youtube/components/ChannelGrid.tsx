'use client'

import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { Channel, ChannelTile } from './ChannelTile'

interface ChannelGridProps {
  channels: Channel[]
  onChannelClick?: (channel: Channel) => void
}

export function ChannelGrid({ channels, onChannelClick }: ChannelGridProps) {
  const router = useRouter()

  const handleChannelClick = (channel: Channel) => {
    if (onChannelClick) {
      onChannelClick(channel)
    } else {
      router.push(`/channel-v2/${channel.customUrl || channel.id}`)
    }
  }

  if (!channels?.length) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="gray.600">No channels found.</Text>
      </Box>
    )
  }

  return (
    <Box p={6}>
      <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
        {channels.map((channel) => (
          <GridItem key={channel.id}>
            <ChannelTile 
              channel={channel}
              onClick={handleChannelClick}
            />
          </GridItem>
        ))}
      </Grid>
    </Box>
  )
} 