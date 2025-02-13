import { Box, BoxProps } from '@chakra-ui/react';

export function CrispText({ children, ...props }: BoxProps) {
  return (
    <Box
      css={{
        textRendering: 'geometricPrecision',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        '& > *': { // Apply to all direct children
          letterSpacing: '0.2px',
          fontWeight: 'medium',
        },
        '& p, & span, & div': { // Apply to text elements
          textShadow: '0 0 1px rgba(255, 255, 255, 0.05)',
        }
      }}
      {...props}
    >
      {children}
    </Box>
  );
} 