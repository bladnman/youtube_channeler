import { Icon, IconProps } from '@chakra-ui/react'

export const ViewGridIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z"
    />
  </Icon>
)

export const ViewListIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M3 4h18v4H3V4zm0 6h18v4H3v-4zm0 6h18v4H3v-4z"
    />
  </Icon>
) 