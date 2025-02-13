import { Box, Flex, Text } from '@chakra-ui/react'
import type { Video } from '../context/YouTubeContext'

interface VideoListCardProps {
  video: Video
  isSelected?: boolean
  onSelect?: (video: Video) => void
  hideChannelInfo?: boolean
}

const formatPublishedDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'Just now';
};

const formatNumber = (num?: string) => {
  if (!num) return '';
  const n = parseInt(num);
  if (isNaN(n)) return num;
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n);
};

export const VideoListCard = ({ video, isSelected, onSelect, hideChannelInfo }: VideoListCardProps) => {
  return (
    <Box
      onClick={() => onSelect?.(video)}
      cursor="pointer"
      borderRadius="md"
      overflow="hidden"
      transition="all 0.2s"
      backgroundColor={isSelected ? "rgba(255, 255, 255, 0.15)" : "transparent"}
      _hover={{
        backgroundColor: "rgba(255, 255, 255, 0.1)"
      }}
      p={2}
    >
      <Flex gap={3}>
        <Box width="180px" height="100px" position="relative" flexShrink={0}>
          <Box
            as="img"
            src={video.thumbnail}
            alt={video.title}
            width="100%"
            height="100%"
            objectFit="cover"
            borderRadius="md"
          />
          {video.duration && (
            <Box
              position="absolute"
              bottom={2}
              right={2}
              bg="rgba(0, 0, 0, 0.8)"
              color="white"
              px={1.5}
              py={0.5}
              borderRadius="sm"
              fontSize="xs"
            >
              {video.duration}
            </Box>
          )}
        </Box>
        <Box flex={1}>
          <Text fontSize="md" fontWeight="semibold" mb={1} noOfLines={2}>
            {video.title}
          </Text>
          <Flex direction="column" gap={0.5}>
            {!hideChannelInfo && video.channelTitle && (
              <Text color="gray.600" fontSize="sm">
                {video.channelTitle}
              </Text>
            )}
            <Flex gap={2} fontSize="sm" color="gray.500">
              {video.viewCount && (
                <Text>{formatNumber(video.viewCount)} views</Text>
              )}
              {video.publishedAt && (
                <>
                  <Text>•</Text>
                  <Text>{formatPublishedDate(video.publishedAt)}</Text>
                </>
              )}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}; 