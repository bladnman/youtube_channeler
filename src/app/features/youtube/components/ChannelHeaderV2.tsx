'use client';

import FavoriteButton from '@/app/features/channels/components/FavoriteButton';
import { Channel } from '@/app/features/youtube/context/YouTubeContext';
import { formatCompactNumber } from '@/app/utils/formatters';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';

interface ChannelHeaderV2Props {
  channel: Channel;
}

export function ChannelHeaderV2({ channel }: ChannelHeaderV2Props) {
  return (
    <Flex align="center" gap={4}>
      <Avatar
        src={channel.thumbnail}
        name={channel.title}
        size="md"
      />
      <Box flex={1} css={{
        textRendering: 'geometricPrecision',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}>
        <Text 
          fontSize="lg" 
          fontWeight="bold" 
          mb={0.5}
          color="white"
          textShadow="0 1px 2px rgba(0, 0, 0, 0.8)"
        >
          {channel.title}
        </Text>
        <Text 
          fontSize="sm" 
          color="white"
          fontWeight="medium"
          letterSpacing="0.2px"
          textShadow="0 1px 2px rgba(0, 0, 0, 0.8)"
        >
          {formatCompactNumber(channel.subscriberCount)} subscribers
        </Text>
      </Box>
      <FavoriteButton 
        channelId={channel.id}
        channelTitle={channel.title}
        channelThumbnail={channel.thumbnail}
        description={channel.description || ''}
        customUrl={channel.customUrl}
      />
    </Flex>
  );
} 