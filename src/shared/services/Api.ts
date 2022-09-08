import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import * as Sentry from "@sentry/react";

import config from "../../config";

export const api = axios.create({
  baseURL: config.app.url + '/api/v1',
});
axiosRetry(api, {
  retries: 3, // number of retries
  retryDelay: (retryCount: number) => {
    return retryCount * 1000; // time interval between retries
  },
  retryCondition: (error: any) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return error.response ? error.response.status === 502 : false;
  },
});
export const configureSecurityInterceptorWithTokens = async ({
  accessToken, csrfToken
}: {
  accessToken: string;
  csrfToken: string;
}): Promise<void> => {
  api.interceptors.request.use(async config => {
    const requestConfig = config;
    if (accessToken) {
      requestConfig.headers.common.Authorization = `Bearer ${accessToken}`;
    }

    return requestConfig;
  });
};
export const configureDefaultErrorInterceptor = async (
): Promise<void> => {
  // console.log('>> configureErrorInterceptor', config.app.url);
  api.interceptors.response.use(function (response) {
    return response;
  }, async function (error) {
    // const originalRequest = error.config;
    if (error.response.status === 401) {
      window.location.href = config.app.url + '/logout'
      return Promise.reject(error);
    } else if (error.response.status === 404) {
      window.location.href = config.app.url + '/notfound'
    } else if (error.response.status === 422) {
      return Promise.reject(error);
    } else if (error.response.status === 500) {
      return Promise.reject(error);
    }
    if (error?.response?.status === 502) {
      Sentry.captureException(new Error(JSON.stringify(error)), {
        tags: {
          section: 'Error 502 Bad Gateway',
        },
      });
    }
    return Promise.reject(error);
  });
};

export const configureSecurityInterceptor = async (
  auth0Client: any, supersetClient: any
): Promise<void> => {
  // console.log('>> configureSecurityInterceptor');
  api.interceptors.request.use(async config => {
    const requestConfig = config;
    const isAuthenticated = await auth0Client.isAuthenticated();
    if (isAuthenticated) {
      const accessToken = await supersetClient.getTokenSilently();
      requestConfig.headers.common.Authorization = `Bearer ${accessToken}`;
    }

    return requestConfig;
  });
};

export const configureErrorInterceptor = async (
  auth0Client: any, supersetClient: any
): Promise<void> => {
  // console.log('>> configureErrorInterceptor');
  api.interceptors.response.use(function (response) {
    return response;
  }, async function (error) {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.response.data.msg === 'Token has expired' &&
      !originalRequest._retry
    ) {
      const auth0AccessToken = await auth0Client.getTokenSilently();

      const loginResult = await axios.post(config.app.url + '/api/v1/security/login', {}, {
        headers: {
          Authorization: `Bearer ${auth0AccessToken}`
        }
      });
      const newToken = loginResult.data;

      supersetClient.setToken(loginResult);

      return api({
        ...originalRequest,
        headers: originalRequest.headers ? {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken.access_token}`
        } : {
          Authorization: `Bearer ${newToken.access_token}`
        }
      });
    }
    return Promise.reject(error);
  });
};
