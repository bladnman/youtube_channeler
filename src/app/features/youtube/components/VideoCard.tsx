import { Box, Image, Text } from '@chakra-ui/react'

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url?: string
}

interface VideoCardProps {
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

export const VideoCard = ({ video, isSelected, onSelect }: VideoCardProps) => {
  return (
    <Box
      width="full"
      borderRadius="lg"
      overflow="hidden"
      shadow="md"
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => onSelect(video)}
      position="relative"
      borderWidth={isSelected ? "3px" : "1px"}
      borderColor={isSelected ? 'brand.500' : 'transparent'}
      bg="white"
      _dark={{ bg: 'gray.800' }}
      _hover={{ 
        transform: 'scale(1.02)',
        borderColor: isSelected ? 'brand.500' : 'brand.200',
        _dark: {
          borderColor: isSelected ? 'brand.500' : 'brand.700'
        }
      }}
    >
      <Box
        position="relative"
        width="100%"
        paddingTop="56.25%" // 16:9 aspect ratio
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
      <Box p={3}>
        <Text 
          fontWeight="semibold" 
          noOfLines={2}
          fontSize="sm"
        >
          {video.title}
        </Text>
        <Text 
          fontSize="xs" 
          color="gray.600" 
          _dark={{ color: 'gray.400' }}
          mt={2}
        >
          {formatPublishedDate(video.publishedAt)}
        </Text>
      </Box>
    </Box>
  )
} 