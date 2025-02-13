import { Box, Flex, Image, Stack, Text } from '@chakra-ui/react'

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url?: string
  duration?: string
  viewCount?: string
}

interface VideoListCardProps {
  video: Video
  isSelected: boolean
  onSelect: (video: Video) => void
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

export const VideoListCard = ({ video, isSelected, onSelect }: VideoListCardProps) => {
  return (
    <Flex
      width="full"
      borderRadius="lg"
      overflow="hidden"
      shadow="sm"
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => onSelect(video)}
      position="relative"
      borderWidth={isSelected ? "2px" : "1px"}
      borderColor={isSelected ? 'brand.500' : 'gray.200'}
      bg="white"
      _dark={{ 
        bg: 'gray.800',
        borderColor: isSelected ? 'brand.500' : 'gray.700'
      }}
      _hover={{ 
        transform: 'translateY(-2px)',
        shadow: 'md',
        borderColor: isSelected ? 'brand.500' : 'brand.200',
        _dark: {
          borderColor: isSelected ? 'brand.500' : 'brand.700'
        }
      }}
      p={2}
      gap={3}
      align="center"
    >
      <Box
        position="relative"
        width="180px"
        height="100px"
        flexShrink={0}
        borderRadius="md"
        overflow="hidden"
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          width="100%"
          height="100%"
          objectFit="cover"
        />
        {video.duration && (
          <Box
            position="absolute"
            bottom={1}
            right={1}
            bg="blackAlpha.700"
            color="white"
            px={1.5}
            py={0.5}
            borderRadius="sm"
            fontSize="xs"
            fontWeight="medium"
          >
            {video.duration}
          </Box>
        )}
      </Box>
      
      <Stack spacing={1} flex={1} minW={0}>
        <Text 
          fontWeight="semibold" 
          noOfLines={2}
          fontSize="sm"
        >
          {video.title}
        </Text>
        <Stack 
          direction="row" 
          spacing={2} 
          fontSize="xs"
          color="gray.600"
          _dark={{ color: 'gray.400' }}
        >
          {video.viewCount && (
            <Text>{formatNumber(video.viewCount)} views</Text>
          )}
          <Text>•</Text>
          <Text>{formatPublishedDate(video.publishedAt)}</Text>
        </Stack>
      </Stack>
    </Flex>
  )
} 