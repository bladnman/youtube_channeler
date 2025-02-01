'use client'

import { Box, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Switch, Text, VStack } from '@chakra-ui/react'
import { useAnimalContext } from '../models/AnimalContext'

export const AnimalControls = () => {
  const {
    isEnabled,
    setIsEnabled,
    addInterval,
    setAddInterval,
    temperament,
    setTemperament,
    totalAnimals
  } = useAnimalContext()

  return (
    <VStack spacing={4} align="stretch">
      <Box display="flex" alignItems="center" gap={3}>
        <Switch
          isChecked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
          isDisabled={totalAnimals >= 100}
        />
        <Text>
          {isEnabled ? 'Stop' : 'Start'} adding animals ({totalAnimals}/100)
        </Text>
      </Box>

      <Box>
        <Text mb={2}>Speed (ms between adds)</Text>
        <Slider
          min={100}
          max={2000}
          step={100}
          value={addInterval}
          onChange={setAddInterval}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>

      <Box>
        <Text mb={2}>Temperament (Gentle → Aggressive)</Text>
        <Slider
          value={temperament}
          onChange={setTemperament}
          min={0}
          max={100}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
    </VStack>
  )
} 