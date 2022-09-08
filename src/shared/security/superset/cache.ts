interface CacheKeyData {
  id: string;
}

export interface CacheEntry {
  id: string;
  access_token: string;
}

export interface ICache {
  save(entry: CacheEntry): void;
  get(key: CacheKeyData, expiryAdjustmentSeconds?: number): Partial<CacheEntry>;
  clear(): void;
}

const keyPrefix = '@@queryme@@';

const createKey = (e: CacheKeyData) =>
  `${keyPrefix}::${e.id}`;

type CachePayload = {
  body: Partial<CacheEntry>;
};

const wrapCacheEntry = (entry: CacheEntry): CachePayload => {
  return {
    body: entry
  };
};

export class LocalStorageCache implements ICache {
  public save(entry: CacheEntry): void {
    const cacheKey = createKey(entry);
    const payload = wrapCacheEntry(entry);

    window.localStorage.setItem(cacheKey, JSON.stringify(payload));
  }

  public get(
    key: CacheKeyData,
  ): Partial<CacheEntry> {
    const cacheKey = createKey(key);
    const payload = this.readJson(cacheKey);

    if (!payload) return {};

    return payload.body;
  }

  public clear() {
    for (var i = localStorage.length - 1; i >= 0; i--) {
      const value = localStorage.key(i);
      if (value && value.startsWith(keyPrefix)) {
        localStorage.removeItem(value);
      }
    }
  }

  private readJson(cacheKey: string): CachePayload | null {
    const json = window.localStorage.getItem(cacheKey);
    let payload;

    if (!json) {
      return null;
    }

    payload = JSON.parse(json);

    if (!payload) {
      return null;
    }

    return payload;
  }

  private writeJson(cacheKey: string, payload: CachePayload) {
    localStorage.setItem(cacheKey, JSON.stringify(payload));
  }
}

export class InMemoryCache {
  public enclosedCache: ICache = (function () {
    let cache: { [key: string]: CachePayload } = { };

    return {
      save(entry: CacheEntry) {
        const key = createKey(entry);
        const payload = wrapCacheEntry(entry);

        cache[key] = payload;
      },

      get(
        key: CacheKeyData
      ): Partial<CacheEntry> {
        const cacheKey = createKey(key);
        const wrappedEntry: CachePayload = cache[cacheKey];
        const nowSeconds = Math.floor(Date.now() / 1000);

        if (!wrappedEntry) {
          return {};
        }

        return wrappedEntry.body || {};
      },

      clear() {
        cache = { };
      }
    };
  })();
}
