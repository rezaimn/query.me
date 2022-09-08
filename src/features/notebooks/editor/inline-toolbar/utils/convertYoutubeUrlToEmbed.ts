export const convertYoutubeUrlToEmbed = (url: string) => {
  const ytLinkPattern = /(?:http?s?:\/\/)?(?:www\.)?((?:youtube\.com)\/(?:watch\?v=)|(youtu\.be\/))/g;
  if (ytLinkPattern.test(url)) {
    url = url.replace(ytLinkPattern, 'https://www.youtube.com/embed/');
  }
  return url;
};
