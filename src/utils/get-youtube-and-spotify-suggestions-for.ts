import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import SpotifyWebApi, { SpotifyApi } from 'spotify-web-api-node';
import getYouTubeSuggestionsFor from './get-youtube-suggestions-for.js';

const filterDuplicates = <T extends { name: string }>(items: T[]): T[] => {
  const seen = new Set<string>();
  return items.filter(item => {
    if (seen.has(item.name)) {
      return false;
    }
    seen.add(item.name);
    return true;
  });
};

const getYouTubeAndSpotifySuggestionsFor = async (
  query: string,
  spotify?: SpotifyWebApi,
  limit = 10
): Promise<APIApplicationCommandOptionChoice[]> => {
  const spotifyPromise = spotify
    ? spotify.search(query, ['album', 'track'], { limit })
    : null;

  const youtubePromise = getYouTubeSuggestionsFor(query);

  const [youtubeSuggestions, spotifyResponse] = await Promise.all([
    youtubePromise,
    spotifyPromise ? spotifyPromise : Promise.resolve(null),
  ]);

  const numOfYouTubeSuggestions = Math.min(limit, youtubeSuggestions.length);
  let suggestions: APIApplicationCommandOptionChoice[] = youtubeSuggestions.slice(0, numOfYouTubeSuggestions).map(suggestion => ({
    name: `YouTube: ${suggestion}`,
    value: suggestion,
  }));

  if (spotifyResponse) {
    const spotifyBody = spotifyResponse.body as SpotifyApi.SearchResponse;
    const spotifyAlbums = filterDuplicates(spotifyBody.albums?.items ?? []);
    const spotifyTracks = filterDuplicates(spotifyBody.tracks?.items ?? []);

    const totalSpotifyResults = spotifyAlbums.length + spotifyTracks.length;

    const maxSpotifySuggestions = Math.floor(limit / 2);
    const numOfSpotifySuggestions = Math.min(maxSpotifySuggestions, totalSpotifyResults);

    const maxSpotifyAlbums = Math.floor(numOfSpotifySuggestions / 2);
    const maxSpotifyTracks = numOfSpotifySuggestions - maxSpotifyAlbums;

    const spotifySuggestionsFormatted: APIApplicationCommandOptionChoice[] = [
      ...spotifyAlbums.slice(0, maxSpotifyAlbums).map(album => ({
        name: `Spotify: 💿 ${album.name}${album.artists.length > 0 ? ` - ${album.artists[0].name}` : ''}`,
        value: `spotify:album:${album.id}`,
      })),
      ...spotifyTracks.slice(0, maxSpotifyTracks).map(track => ({
        name: `Spotify: 🎵 ${track.name}${track.artists.length > 0 ? ` - ${track.artists[0].name}` : ''}`,
        value: `spotify:track:${track.id}`,
      })),
    ];

    const maxYouTubeSuggestions = limit - spotifySuggestionsFormatted.length;
    if (maxYouTubeSuggestions > 0) {
      suggestions = youtubeSuggestions.slice(0, maxYouTubeSuggestions).map(suggestion => ({
        name: `YouTube: ${suggestion}`,
        value: suggestion,
      }));
    } else {
      suggestions = [];
    }

    suggestions.push(...spotifySuggestionsFormatted);
  }

  return suggestions;
};

export default getYouTubeAndSpotifySuggestionsFor;
