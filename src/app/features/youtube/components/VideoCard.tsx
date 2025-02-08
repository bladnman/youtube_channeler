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
      width={{ base: "full", sm: "280px" }}
      borderRadius="lg"
      overflow="hidden"
      shadow="md"
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => onSelect(video)}
      position="relative"
      borderWidth={isSelected ? "4px" : "0"}
      borderColor={isSelected ? 'brand.500' : 'transparent'}
      _hover={{ transform: 'scale(1.02)' }}
    >
      <Image
        src={video.thumbnail}
        alt={video.title}
        width="100%"
        height="auto"
        objectFit="cover"
      />
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