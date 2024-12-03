import got from 'got';

const getYouTubeSuggestionsFor = async (query: string): Promise<string[]> => {
  const url = 'https://suggestqueries.google.com/complete/search';
  const searchParams = {
    client: 'firefox',
    ds: 'yt',
    q: query,
  };

  try {
    const response = await got(url, { searchParams }).json<[string, string[]]>();

    if (!Array.isArray(response) || response.length < 2 || !Array.isArray(response[1])) {
      throw new Error('Invalid response format from YouTube suggestions API.');
    }

    return response[1];
  } catch (error) {
    console.error(`Failed to fetch YouTube suggestions for query "${query}":`, error);
    throw new Error('Unable to retrieve YouTube suggestions.');
  }
};

export default getYouTubeSuggestionsFor;
