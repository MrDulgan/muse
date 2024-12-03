import { ChannelType, Guild, GuildMember, User, VoiceChannel } from 'discord.js';

export const isUserInVoice = (guild: Guild, user: User): boolean => {
  for (const channel of guild.channels.cache.values()) {
    if (channel.type === ChannelType.GuildVoice) {
      const voiceChannel = channel as VoiceChannel;
      if (voiceChannel.members.has(user.id)) {
        return true;
      }
    }
  }
  return false;
};

export const getSizeWithoutBots = (channel: VoiceChannel): number => {
  return channel.members.filter(member => !member.user.bot).size;
};

export const getMemberVoiceChannel = (member?: GuildMember): [VoiceChannel, number] | null => {
  const channel = member?.voice?.channel;
  if (channel?.type === ChannelType.GuildVoice) {
    return [channel as VoiceChannel, getSizeWithoutBots(channel as VoiceChannel)];
  }
  return null;
};

export const getMostPopularVoiceChannel = (guild: Guild): [VoiceChannel, number] => {
  let popularChannel: VoiceChannel | null = null;
  let maxSize = -1;

  for (const channel of guild.channels.cache.values()) {
    if (channel.type === ChannelType.GuildVoice) {
      const voiceChannel = channel as VoiceChannel;
      const size = getSizeWithoutBots(voiceChannel);
      if (size > maxSize) {
        maxSize = size;
        popularChannel = voiceChannel;
      }
    }
  }

  if (popularChannel) {
    return [popularChannel, maxSize];
  }

  throw new Error('No voice channels found in the guild.');
};
