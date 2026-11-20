/**
 * QueryCache — Local cache for GraphQL queries
 * 
 * Designed for low-bandwidth environments (rural Venezuela).
 * Caches read-only query responses in localStorage to minimize
 * internet usage. Mutations (sell, pay, refund, auth) are NEVER cached.
 * 
 * TTL Rules:
 *  - allRaces / allTracks / allWagerTypes: 5 min (race data changes infrequently)
 *  - allScratches: 2 min (scratches can change closer to post time)
 *  - allResults: 30 min (results don't change once posted)
 *  - allTicketOffices / allTickets: 1 min
 *  - Default for other queries: 3 min
 */

// Queries that should NEVER be cached (mutations and auth)
const NEVER_CACHE_PATTERNS = [
  'mutation',
  'procAuthenticateJwt',
  'procCreateTicket',
  'procPayTicket',
  'procRefund',
  'procAnull',
  'procSellTicket',
  'procCreateSport',
  'debitAccount',
  'creditAccount',
  // Ticket list queries — must always return fresh data after a sale
  'allTicketsInhs',
  'allTickets',
  'allTicketsHsips',
  'allVTickets',
  'allHeaderTicketsCocks',
  'allTicketsAnimals',
  'procMyAllTicketsSportsTicketOffices',
  'allVTokensDetails',
  'allVTicketsSellersSummaries',
  'allVTicketsSellersSummaryByWinInhs',
  'allVTicketsSellersSummaryStalls',
  'allVMultipleDates',
];

// Custom TTL per query pattern (in milliseconds)
const TTL_RULES = {
  'allRaces':           5 * 60 * 1000,   // 5 min
  'getAllRaces':         5 * 60 * 1000,
  'allTracks':          10 * 60 * 1000,  // 10 min
  'getAllTracks':        10 * 60 * 1000,
  'allWagerTypes':      10 * 60 * 1000,  // 10 min
  'allScratches':       2 * 60 * 1000,   // 2 min
  'getAllScratches':     2 * 60 * 1000,
  'allResults':         30 * 60 * 1000,  // 30 min
  'getAllResults':       30 * 60 * 1000,
  'allTicketOffices':   2 * 60 * 1000,   // 2 min
  'currentTimestamp':   30 * 1000,       // 30 sec
};

const DEFAULT_TTL = 3 * 60 * 1000; // 3 min
const CACHE_PREFIX = 'qcache_';
const MAX_CACHE_SIZE = 4 * 1024 * 1024; // 4MB max cache in localStorage

class QueryCache {

  /**
   * Check if a query should be cached
   */
  static isCacheable(query) {
    if (!query || typeof query !== 'string') return false;

    const q = query.trim().toLowerCase();

    // Never cache mutations or auth operations
    for (const pattern of NEVER_CACHE_PATTERNS) {
      if (q.includes(pattern.toLowerCase())) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get the TTL for a query based on its content
   */
  static getTTL(query) {
    for (const [pattern, ttl] of Object.entries(TTL_RULES)) {
      if (query.includes(pattern)) {
        return ttl;
      }
    }
    return DEFAULT_TTL;
  }

  /**
   * Generate a cache key from the query string
   */
  static getCacheKey(query) {
    // Simple hash: use the query text itself (trimmed) as key
    // For localStorage, we prefix it
    let hash = 0;
    const str = query.trim();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return CACHE_PREFIX + Math.abs(hash).toString(36);
  }

  /**
   * Get cached response for a query
   * Returns null if not cached or expired
   */
  static get(query) {
    if (!this.isCacheable(query)) return null;

    try {
      const key = this.getCacheKey(query);
      const cached = localStorage.getItem(key);

      if (!cached) return null;

      const { data, timestamp, ttl } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age > ttl) {
        // Expired — remove it
        localStorage.removeItem(key);
        return null;
      }

      console.log(`[Cache HIT] age=${Math.round(age/1000)}s, ttl=${Math.round(ttl/1000)}s`);
      return data;
    } catch (e) {
      return null;
    }
  }

  /**
   * Store a response in cache
   */
  static set(query, responseData) {
    if (!this.isCacheable(query)) return;

    try {
      const key = this.getCacheKey(query);
      const ttl = this.getTTL(query);
      const entry = JSON.stringify({
        data: responseData,
        timestamp: Date.now(),
        ttl,
      });

      // Check if this entry is too large (> 500KB single entry)
      if (entry.length > 500 * 1024) {
        console.log('[Cache SKIP] Entry too large:', Math.round(entry.length/1024), 'KB');
        return;
      }

      // Try to store, if quota exceeded clean old entries
      try {
        localStorage.setItem(key, entry);
      } catch (e) {
        // Quota exceeded — clear cache and retry
        this.clearAll();
        try {
          localStorage.setItem(key, entry);
        } catch (e2) {
          // Still failed, give up silently
        }
      }
    } catch (e) {
      // Silently fail — cache is optional
    }
  }

  /**
   * Clear all cache entries (preserves non-cache localStorage items)
   */
  static clearAll() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    console.log(`[Cache] Cleared ${keysToRemove.length} entries`);
  }

  /**
   * Clear expired entries only
   */
  static clearExpired() {
    const now = Date.now();
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        try {
          const { timestamp, ttl } = JSON.parse(localStorage.getItem(key));
          if (now - timestamp > ttl) {
            keysToRemove.push(key);
          }
        } catch (e) {
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
}

export default QueryCache;
