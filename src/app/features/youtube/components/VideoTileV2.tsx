'use client';

import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { Video } from '../context/YouTubeContext';

interface VideoTileProps {
  video: Video;
  onClick?: () => void;
  isSelected?: boolean;
}

export function VideoTileV2({ video, onClick, isSelected = false }: VideoTileProps) {
  const bgColor = isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
  const hoverBgColor = 'rgba(255, 255, 255, 0.05)';

  return (
    <Flex
      onClick={onClick}
      cursor="pointer"
      p={3}
      gap={3}
      transition="all 0.2s"
      _hover={{
        backgroundColor: hoverBgColor,
      }}
      backgroundColor={bgColor}
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
      role="group"
      align="center"
    >
      {/* Thumbnail */}
      <Box 
        position="relative" 
        flexShrink={0} 
        width="120px" 
        height="68px"
        borderRadius="md"
        overflow="hidden"
        boxShadow="md"
        transition="transform 0.2s"
        _groupHover={{
          transform: 'scale(1.02)',
        }}
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          style={{ 
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Content */}
      <Box flex={1}>
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color="white"
          noOfLines={2}
          mb={1}
          transition="color 0.2s"
          _groupHover={{
            color: 'blue.200',
          }}
        >
          {video.title}
        </Text>
        <Text fontSize="xs" color="whiteAlpha.700">
          {new Date(video.publishedAt).toLocaleDateString()}
        </Text>
      </Box>
    </Flex>
  );
} 