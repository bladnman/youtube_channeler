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

export const VideoCard = ({ video, isSelected, onSelect }: VideoCardProps) => {
  return (
    <Box
      width="320px"
      borderRadius="lg"
      overflow="hidden"
      shadow="md"
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => onSelect(video)}
      position="relative"
      borderWidth={isSelected ? "2px" : "0"}
      borderColor={isSelected ? 'brand.500' : 'transparent'}
      bg="white"
      _dark={{ bg: 'gray.800' }}
      _hover={{ transform: 'scale(1.02)' }}
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
      <Box p={4}>
        <Text fontWeight="semibold" noOfLines={2}>
          {video.title}
        </Text>
        <Text fontSize="sm" color="gray.600" mt={2}>
          {new Date(video.publishedAt).toLocaleDateString()}
        </Text>
      </Box>
    </Box>
  )
} 