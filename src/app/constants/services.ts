export const YOUTUBE_API = {
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
  MAX_RESULTS: 10, // Maximum number of videos to fetch for a channel
} as const;

export const CACHE_KEYS = {
  VIDEO_PREFIX: 'video:',
  CHANNEL_PREFIX: 'channel:',
  HANDLE_PREFIX: 'handle:',
} as const; 