import { Theme as ChakraTheme, extendTheme, withDefaultColorScheme } from '@chakra-ui/react'

// Define our custom theme additions
interface LayoutTheme {
  header: {
    height: string
  }
}

// Extend the Chakra theme type
interface CustomTheme extends ChakraTheme {
  layout: LayoutTheme
}

const layout: LayoutTheme = {
  header: {
    height: '56px'
  }
}

// Create our theme object with proper typing
const themeOverrides: Partial<CustomTheme> = {
  layout,
  config: {
    cssVarPrefix: 'starter-nextjs-simple',
    initialColorMode: 'light',
    useSystemColorMode: false,
    disableTransitionOnChange: false,
    storageManager: {
      get: () => undefined, // Always return undefined to prevent persistence
      set: () => undefined, // No-op to prevent persistence
      type: 'localStorage'
    }
  },
  colors: {
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    brand: {
      50: '#FFF5F5',
      100: '#FED7D7',
      200: '#FEB2B2',
      300: '#FC8181',
      400: '#F56565',
      500: '#E53E3E',
      600: '#C53030',
      700: '#9B2C2C',
      800: '#822727',
      900: '#63171B'
    },
    secondary: {
      50: '#FAF5FF',
      100: '#F3E8FF',
      200: '#E9D5FF',
      300: '#D8B4FE',
      400: '#C084FC',
      500: '#A855F7',
      600: '#9333EA',
      700: '#7E22CE',
      800: '#6B21A8',
      900: '#581C87'
    }
  },
  semanticTokens: {
    colors: {
      'chakra-body-bg': { _light: 'transparent', _dark: 'transparent' },
      'chakra-border-color': { _light: 'gray.200', _dark: 'gray.700' },
      'chakra-body-text': { _light: 'gray.800', _dark: 'gray.100' },
      'chakra-inverse-text': { _light: 'gray.100', _dark: 'gray.800' },
      'chakra-subtle-text': { _light: 'gray.600', _dark: 'gray.400' },
      'chakra-inverse-subtle-text': { _light: 'gray.400', _dark: 'gray.600' },
      'brand.selected': { _light: 'brand.100', _dark: 'brand.900' },
      'brand.selected-border': { _light: 'brand.300', _dark: 'brand.700' },
      'brand.hover': { _light: 'brand.50', _dark: 'brand.800' },
      'brand.link': { _light: 'brand.600', _dark: 'brand.400' },
      'brand.text': { _light: 'brand.700', _dark: 'brand.200' },
      'brand.inverse-text': { _light: 'brand.200', _dark: 'brand.700' },
      'secondary.selected': { _light: 'secondary.100', _dark: 'secondary.900' },
      'secondary.selected-border': { _light: 'secondary.300', _dark: 'secondary.700' },
      'secondary.hover': { _light: 'secondary.50', _dark: 'secondary.800' },
      'secondary.link': { _light: 'secondary.600', _dark: 'secondary.400' },
      'secondary.text': { _light: 'secondary.700', _dark: 'secondary.200' },
      'secondary.inverse-text': { _light: 'secondary.200', _dark: 'secondary.700' }
    }
  },
  components: {
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.500'
      },
      variants: {
        outline: {
          field: {
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)'
            }
          }
        }
      }
    },
    Button: {
      variants: {
        outline: {
          color: 'brand.text',
          borderColor: 'brand.500',
          _hover: {
            bg: 'brand.hover'
          }
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          color: 'chakra-inverse-text'
        }
      }
    }
  },
  styles: {
    global: {
      'html, body': {
        bg: 'transparent',
        color: 'chakra-body-text'
      }
    }
  }
}

// Declare module to extend ChakraTheme
declare module '@chakra-ui/react' {
  interface Theme extends CustomTheme {}
}

export const theme = extendTheme(themeOverrides, withDefaultColorScheme({ colorScheme: 'brand' })) 