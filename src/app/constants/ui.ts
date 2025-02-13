/**
 * UI Constants
 * Contains shared UI values used across components
 */

export const LAYOUT = {
  HEADER_HEIGHT: '54px',
  FAVORITES_HEIGHT: {
    BASE: '30vh',
    MD: '160px'
  },
  CONTAINER_MAX_WIDTH: {
    BASE: '90%',
    MD: '900px',
    LG: '1000px'
  }
} as const;

export const GLASSMORPHISM = {
  BLUR: '16px',
  BACKGROUND: {
    LIGHT: 'rgba(255, 255, 255, 0.2)',
    DARK: 'rgba(26, 32, 44, 0.3)'
  },
  BORDER: {
    LIGHT: 'rgba(255, 255, 255, 0.3)',
    DARK: 'rgba(255, 255, 255, 0.1)'
  }
} as const;

export const SCROLLBAR = {
  WIDTH: '8px',
  BORDER_RADIUS: '8px',
  BACKGROUND: {
    LIGHT: 'rgba(0, 0, 0, 0.05)',
    THUMB_LIGHT: 'rgba(0, 0, 0, 0.1)',
    THUMB_DARK: 'rgba(255, 255, 255, 0.1)'
  }
} as const; 