import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react'
import FavoriteButton from '../../channels/components/FavoriteButton'

interface Channel {
  id: string
  title: string
  thumbnail: string
  description: string
}

interface ChannelHeaderProps {
  channel: Channel
}

export const ChannelHeader = ({ channel }: ChannelHeaderProps) => {
  return (
    <Box p={4} borderBottom="1px" borderColor="gray.200">
      <HStack spacing={4} align="center">
        <Image
          src={channel.thumbnail}
          alt={channel.title}
          boxSize="64px"
          borderRadius="full"
          objectFit="cover"
        />
        <VStack align="start" flex={1}>
          <HStack justify="space-between" width="100%">
            <Text fontSize="xl" fontWeight="bold">{channel.title}</Text>
            <FavoriteButton
              channelId={channel.id}
              channelTitle={channel.title}
              channelThumbnail={channel.thumbnail}
              description={channel.description}
            />
          </HStack>
          <Text color="gray.600" noOfLines={2}>{channel.description}</Text>
        </VStack>
      </HStack>
    </Box>
  )
} 