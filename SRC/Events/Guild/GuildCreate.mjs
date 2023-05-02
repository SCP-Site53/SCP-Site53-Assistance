import { Patricia } from '../../Structures/Patricia.mjs';
import { Justin } from '../../Structures/Justin.mjs';

export const name = Justin.Events.GuildCreate;
export const once = true;
export async function Execute(guild) {
	try {
		await Patricia.reloadApplicationCommands(guild.client.user.id, guild.id);
	} catch (error) {
		throw error;
	};
};