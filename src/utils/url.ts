export const cleanYouTubeUrl = (inputUrl: string): string => {
  try {
    const url = new URL(inputUrl);

    const v = url.searchParams.get('v');
    url.searchParams.forEach((value, key) => {
      if (key !== 'v') {
        url.searchParams.delete(key);
      }
    });

    if (v) {
      url.searchParams.set('v', v);
    }

    const cleanedSearchParams = new URLSearchParams();
    if (v) {
      cleanedSearchParams.set('v', v);
    }
    url.search = cleanedSearchParams.toString();

    return url.toString();
  } catch (error) {
    console.error(`Invalid URL provided to cleanYouTubeUrl: "${inputUrl}". Error:`, error);
    return inputUrl;
  }
};
