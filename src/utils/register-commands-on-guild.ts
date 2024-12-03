import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { SlashCommandBuilder } from '@discordjs/builders';

interface RegisterCommandsOnGuildOptions {
  rest: REST;
  applicationId: string;
  guildId: string;
  commands: SlashCommandBuilder[];
}

const registerCommandsOnGuild = async ({
  rest,
  applicationId,
  guildId,
  commands,
}: RegisterCommandsOnGuildOptions): Promise<void> => {
  try {
    const commandsJSON = commands.map(command => command.toJSON());
    await rest.put(
      Routes.applicationGuildCommands(applicationId, guildId),
      { body: commandsJSON },
    );
    console.log(`Successfully registered ${commandsJSON.length} commands for guild ${guildId}.`);
  } catch (error) {
    console.error(`Failed to register commands for guild ${guildId}:`, error);
    throw new Error('Command registration failed.');
  }
};

export default registerCommandsOnGuild;
