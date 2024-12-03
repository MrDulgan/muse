import { Setting } from '@prisma/client';
import prisma from './db.js';
import { createGuildSettings } from '../events/guild-create.js';

export async function getGuildSettings(guildId: string): Promise<Setting> {
  try {
    let config = await prisma.setting.findUnique({ where: { guildId } });

    if (!config) {
      config = await createGuildSettings(guildId);
    }

    return config;
  } catch (error) {
    console.error(`Failed to retrieve or create settings for guild ${guildId}:`, error);
    throw new Error('Unable to retrieve guild settings.');
  }
}
