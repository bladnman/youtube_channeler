import { YOUTUBE_API } from '../constants/services';

interface CacheEntry {
  data: any;
  timestamp: number;
}

interface Cache {
  [key: string]: CacheEntry;
}

class ServerCache {
  private static cache: Cache = {};

  static set(key: string, data: any): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };
  }

  static get(key: string): any | null {
    const entry = this.cache[key];
    if (!entry) return null;

    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > YOUTUBE_API.CACHE_DURATION) {
      delete this.cache[key];
      return null;
    }

    return entry.data;
  }

  static clear(): void {
    this.cache = {};
  }
}

export default ServerCache; 