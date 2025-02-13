'use client';

import { Button, ButtonProps, forwardRef as chakraForwardRef, useTheme } from '@chakra-ui/react';

interface GlassmorphicButtonProps extends ButtonProps {
  glassStrength?: 'light' | 'medium' | 'strong';
}

export const GlassmorphicButton = chakraForwardRef<GlassmorphicButtonProps, 'button'>(
  ({ glassStrength = 'medium', colorScheme = 'blue', children, ...props }, ref) => {
    const theme = useTheme();
    const color = theme.colors[colorScheme][500];

    const opacity = {
      light: 0.2,
      medium: 0.3,
      strong: 0.4,
    }[glassStrength];

    return (
      <Button
        ref={ref}
        backgroundColor={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
        border="1px solid"
        borderColor={color}
        transition="all 0.2s"
        backdropFilter="blur(8px)"
        _hover={{
          backgroundColor: color,
        }}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

GlassmorphicButton.displayName = 'GlassmorphicButton'; 