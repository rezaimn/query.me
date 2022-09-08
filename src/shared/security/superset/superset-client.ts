import Lock from 'browser-tabs-lock';
import axios from 'axios';
import { Auth0Client } from '@auth0/auth0-spa-js';

import { InMemoryCache, ICache, LocalStorageCache, CacheEntry } from './cache';
import { ClientStorage, CookieStorage, CookieStorageWithLegacySameSite } from './storage';
import config from "../../../config";

export type CacheLocation = 'memory' | 'localstorage';

const cacheLocationBuilders: { [id: string]: any } = {
  memory: () => new InMemoryCache().enclosedCache,
  localstorage: () => new LocalStorageCache()
};

const cacheFactory = (location: string) => {
  return cacheLocationBuilders[location];
};

const CACHE_LOCATION_MEMORY = 'memory';
const CACHE_LOCATION_LOCAL_STORAGE = 'localstorage';

const GET_TOKEN_SILENTLY_LOCK_KEY = 'superset.lock.getTokenSilently';
const lock = new Lock();

interface SupersetClientOptions {
  cacheLocation: CacheLocation;
  useRefreshTokens: boolean;
  legacySameSiteCookie?: boolean;
}

interface GetTokenSilentlyOptions {
  ignoreCache?: boolean;
}

export default class SupersetClient {
  private cache: ICache;
  private cookieStorage: ClientStorage;
  cacheLocation: CacheLocation;

  constructor(private auth0Client: Auth0Client, private options: SupersetClientOptions) {
    this.cacheLocation = options.cacheLocation || CACHE_LOCATION_MEMORY;
    this.cache = cacheFactory(this.cacheLocation)();
    this.cookieStorage =
      options.legacySameSiteCookie === false
        ? CookieStorage
        : CookieStorageWithLegacySameSite;
  }

  public isAuthenticated() {
    const cache = this.cache.get({
      id: 'superset'
    });
    return !!cache;
  }
    
  public async getTokenSilently(options: GetTokenSilentlyOptions = {}) {
    const { ignoreCache, ...getTokenOptions } = {
      ignoreCache: false,
      ...options
    };

    const getAccessTokenFromCache = () => {
      const cache = this.cache.get(
        {
          id: 'superset'
        },
        60 // get a new token if within 60 seconds of expiring
      );

      return cache && cache.access_token;
    };

    // Check the cache before acquiring the lock to avoid the latency of
    // `lock.acquireLock` when the cache is populated.
    if (!ignoreCache) {
      let accessToken = getAccessTokenFromCache();
      if (accessToken) {
        return accessToken;
      }
    }

    try {
      await lock.acquireLock(GET_TOKEN_SILENTLY_LOCK_KEY, 5000);
      // Check the cache a second time, because it may have been populated
      // by a previous call while this call was waiting to acquire the lock.
      if (!ignoreCache) {
        let accessToken = getAccessTokenFromCache();
        if (accessToken) {
          return accessToken;
        }
      }

      /* const authResult = this.options.useRefreshTokens
        ? await this._getTokenUsingRefreshToken()
        : await this._getTokenFromIFrame(); */
      const authResult = await this._getTokenUsingRefreshToken();

      this.cache.save({ id: 'superset', ...authResult });

      this.cookieStorage.save('superset.is.authenticated', true, {
        daysUntilExpire: 1
      });

      return authResult.access_token;
    } catch (e) {
      throw e;
    } finally {
      await lock.releaseLock(GET_TOKEN_SILENTLY_LOCK_KEY);
    }
  }

  public setToken(authResult: CacheEntry) {
    this.cache.save({ id: 'superset', ...authResult });
  }

  private async _getTokenUsingRefreshToken(
  ): Promise<any> {

    const cache = this.cache.get({
      id: 'superset'
      });

    // If you don't have a refresh token in memory
    // and you don't have a refresh token in web worker memory
    // fallback to an iframe.
    /* if ((!cache || !cache.refresh_token)) {
      return await this._getTokenFromIFrame(options);
    } */

    const auth0AccessToken = await this.auth0Client.getTokenSilently();

    const result = await axios.post(config.app.url + '/api/v1/security/login', {}, {
      headers: {
        Authorization: `Bearer ${auth0AccessToken}`
      }
    });

    return result.data;
  }
}
