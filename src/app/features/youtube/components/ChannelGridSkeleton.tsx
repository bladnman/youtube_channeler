import { Box, Grid, GridItem } from '@chakra-ui/react'
import { ChannelTileSkeleton } from './ChannelTileSkeleton'

export function ChannelGridSkeleton() {
  return (
    <Box p={6}>
      <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
        {[...Array(6)].map((_, i) => (
          <GridItem key={i}>
            <ChannelTileSkeleton />
          </GridItem>
        ))}
      </Grid>
    </Box>
  )
} 