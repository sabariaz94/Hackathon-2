/**
 * Cache Service
 * Provides caching functionality for improved responsiveness
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number; // in milliseconds
}

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly defaultExpiry: number = 5 * 60 * 1000; // 5 minutes default expiry

  /**
   * Get an item from cache
   * @param key Cache key
   * @returns Cached data if valid, null otherwise
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.timestamp + entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set an item in cache
   * @param key Cache key
   * @param data Data to cache
   * @param expiry Expiry time in milliseconds (optional, uses default if not provided)
   */
  public set<T>(key: string, data: T, expiry?: number): void {
    const cacheExpiry = expiry || this.defaultExpiry;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry: cacheExpiry,
    };

    this.cache.set(key, entry);
  }

  /**
   * Delete an item from cache
   * @param key Cache key
   */
  public delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Check if an item exists in cache and is valid
   * @param key Cache key
   * @returns True if item exists and is not expired, false otherwise
   */
  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get cache size
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * Clean up expired entries
   */
  public cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  public getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create a singleton instance
export const cacheService = new CacheService();