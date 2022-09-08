export interface IUnsplash {
  results: IUnsplashImage[];
  total: number;
}

export interface IUnsplashImage {
  id: string;
  created_by: string;
  download_url: string;
  image_url: string;
  thumbnail_url: string;
  created_by_profile_url: string;
}
