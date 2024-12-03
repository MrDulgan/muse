import getYouTubeID from 'get-youtube-id';
import { EmbedBuilder } from 'discord.js';
import Player, { MediaSource, QueuedSong, STATUS } from '../services/player.js';
import getProgressBar from './get-progress-bar.js';
import { prettyTime } from './time.js';
import { truncate } from './string.js';
import memoize from 'lodash.memoize';

const NON_ASCII_REGEX = /[^\x00-\x7F]+/;
const YOUTUBE_BASE_URL = 'https://www.youtube.com/watch?v=';
const createEmbed = (
  color: string, 
  title: string, 
  description: string, 
  footer: string, 
  thumbnailUrl?: string, 
  fields?: any[]
): EmbedBuilder => {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: footer });

  if (thumbnailUrl) {
    embed.setThumbnail(thumbnailUrl);
  }

  if (fields) {
    embed.addFields(fields);
  }

  return embed;
};

const getMaxSongTitleLength = (title: string): number => (
  NON_ASCII_REGEX.test(title) ? 28 : 48
);

const getSongTitle = (
  { title, url, offset, source }: QueuedSong, 
  shouldTruncate: boolean = false
): string => {
  if (source === MediaSource.HLS) {
    return `[${title}](${url})`;
  }

  const cleanSongTitle = title.replace(/\[.*?\]/g, '').trim();
  const maxLength = getMaxSongTitleLength(cleanSongTitle);
  const songTitle = shouldTruncate ? truncate(cleanSongTitle, maxLength) : cleanSongTitle;
  
  const youtubeId = url.length === 11 ? url : getYouTubeID(url) || '';
  const timeParam = offset > 0 ? `&t=${offset}` : '';
  
  return `[${songTitle}](${YOUTUBE_BASE_URL}${youtubeId}${timeParam})`;
};

const getQueueInfo = (player: Player): string => {
  const queueSize = player.queueSize();
  if (queueSize === 0) return '-';
  return queueSize === 1 ? '1 song' : `${queueSize} songs`;
};

const getPlayerUI = (player: Player): string => {
  const song = player.getCurrent();
  if (!song) return '';

  const position = player.getPosition();
  const button = player.status === STATUS.PLAYING ? '⏹️' : '▶️';
  const progressBar = getProgressBar(10, position / song.length);
  const elapsedTime = song.isLive ? 'live' : `${prettyTime(position)}/${prettyTime(song.length)}`;
  const loop = player.loopCurrentSong ? '🔂' : player.loopCurrentQueue ? '🔁' : '';
  const vol = typeof player.getVolume() === 'number' ? `${player.getVolume()}%` : '';

  return `${button} ${progressBar} \`[${elapsedTime}]\`🔉 ${vol} ${loop}`;
};

class QueueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QueueError';
  }
}

export const buildPlayingMessageEmbed = (player: Player): EmbedBuilder => {
  const currentlyPlaying = player.getCurrent();
  if (!currentlyPlaying) throw new QueueError('No playing song found');

  const { artist, thumbnailUrl, requestedBy } = currentlyPlaying;
  const color = player.status === STATUS.PLAYING ? 'DarkGreen' : 'DarkRed';
  const title = player.status === STATUS.PLAYING ? 'Now Playing' : 'Paused';
  const description = `
    **${getSongTitle(currentlyPlaying)}**
    Requested by: <@${requestedBy}>\n
    ${getPlayerUI(player)}
  `;
  const footer = `Source: ${artist}`;

  return createEmbed(color, title, description, footer, thumbnailUrl);
};

export const buildQueueEmbed = (player: Player, page: number, pageSize: number): EmbedBuilder => {
  const currentlyPlaying = player.getCurrent();
  if (!currentlyPlaying) throw new QueueError('Queue is empty');

  const queue = player.getQueue();
  const queueSize = queue.length;
  const maxQueuePage = Math.ceil((queueSize + 1) / pageSize);

  if (page > maxQueuePage) throw new QueueError("The queue isn't that big");

  const queuePageBegin = (page - 1) * pageSize;
  const queuePageEnd = queuePageBegin + pageSize;
  const queuedSongs = queue.slice(queuePageBegin, queuePageEnd).map((song, index) => {
    const songNumber = index + 1 + queuePageBegin;
    const duration = song.isLive ? 'live' : prettyTime(song.length);
    return `\`${songNumber}.\` ${getSongTitle(song, true)} \`[${duration}]\``;
  }).join('\n');

  const { artist, thumbnailUrl, playlist, requestedBy } = currentlyPlaying;
  const playlistTitle = playlist ? `(${playlist.title})` : '';
  const totalLength = queue.reduce((acc, current) => acc + current.length, 0);

  let description = `**${getSongTitle(currentlyPlaying)}**\n`;
  description += `Requested by: <@${requestedBy}>\n\n`;
  description += `${getPlayerUI(player)}\n\n`;

  if (queueSize > 0) {
    description += '**Up next:**\n';
    description += queuedSongs;
  }

  const title = player.status === STATUS.PLAYING 
    ? `Now Playing ${player.loopCurrentSong ? '(loop on)' : ''}` 
    : 'Queued songs';
  const color = player.status === STATUS.PLAYING ? 'DarkGreen' : 'NotQuiteBlack';
  const footer = `Source: ${artist} ${playlistTitle}`;
  const fields = [
    { name: 'In queue', value: getQueueInfo(player), inline: true },
    { name: 'Total length', value: `${totalLength > 0 ? prettyTime(totalLength) : '-'}`, inline: true },
    { name: 'Page', value: `${page} out of ${maxQueuePage}`, inline: true }
  ];

  return createEmbed(color, title, description, footer, thumbnailUrl, fields);
};
