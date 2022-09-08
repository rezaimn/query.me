import { api } from './Api';

export const unsplash = () => {
  return api.get(`/unsplash/`).then(res => res.data);
};

export const unsplashRandom = () => {
  return api.get(`/unsplash/random`).then(res => res.data.result);
};

export const unsplashSearch = (keyword: string) => {
  const payload = { keyword: keyword };
  return api.post(`/unsplash/search`, payload).then(res => res.data);
};

export const downloadImageFromUnsplash = (download_url: string) => {
  const payload = { download_url: download_url };
  return api.post(`/unsplash/download`, payload).then(res => res.data);
};
