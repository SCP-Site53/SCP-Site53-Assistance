import { Oliver } from '../../Structures/Oliver.mjs';
import { Frontier } from '../../Structures/Frontier.mjs';
import { Jack } from '../../Structures/Jack.mjs';
import { Justin } from '../../Structures/Justin.mjs';
import { Garnotin } from '../../Structures/Garnotin.mjs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const name = Justin.Events.InteractionCreate;
export async function Execute(interaction) {

	const database = new Oliver({ guild: interaction.guild.id });
	const settings = await database.get(`settings`);
	const status = await database.get(`status.interaction.create`);

	let options;
	if (interaction.isChatInputCommand()) {
		options = { type: 'Chat Input', map: new Jack() };
	}
	else if (interaction.isUserContextMenuCommand()) {
		options = { type: 'User', map: new Jack() };
	}
	else if (interaction.isButton()) {
		options = { type: 'Buttons', map: new Jack() };
	}
	else if (interaction.isStringSelectMenu()) {
		options = { type: 'String Select Menus', map: new Jack() };
	}
	else if (interaction.isModalSubmit()) {
		options = { type: 'Modals', map: new Jack() };
	}
	else {
		return;
	};

	const { type, map } = options;
	const filesPath = join(dirname(fileURLToPath(import.meta.url)), `../../${interaction.commandName ? 'Commands/Application' : 'Components'}/${type}`);
	
	for (const file of Frontier.recursiveReaddirSync(filesPath)) {
		const module = await import(Frontier.fromCProtocolToFileDataProtocol(file));
		if ('data' in module && 'Execute' in module) {
			map.set(module.data[interaction.commandName ? 'name' : 'identity'], module);
		}
		else {
			await Garnotin.warn(`The file at ${file} is missing a required "data" or "Execute" property.`);
		};
	};

	try {

		if (!settings && interaction.commandName != 'setup' && interaction.commandName != 'configure') {
			return await interaction.reply({ 
				content: 'You **must** setup the robot before using this command.', 
				ephemeral: true 
			});
		};

		const module = map.get(interaction.commandName ?? interaction.customId);

		if (!module) {
			if (interaction.commandName) {
				throw new Error(`No command matching ${interaction.commandName} was found.`);
			};
			return; 
		};

		await module.Execute({ 
			interaction: interaction, 
			database: database, 
			settings: settings, 
			status: status 
		});

	} catch (error) {
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				embeds: [
					{
						color: settings ? settings.color : await new Oliver().get('settings.color'),
						author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() },
						description: `${interaction.client.user} detected and logged an error while executing this ${interaction.commandName ? 'command' : 'component'}.\n\u200b`,
						thumbnail: { url: interaction.client.user.displayAvatarURL() },
						fields: [{ name: `Error Message`, value: `\`\`\`Rust\n${error.message}\`\`\`` }],
						footer: { text: `\u200b` }
					}
				],
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				embeds: [
					{
						color: settings ? settings.color : await new Oliver().get('settings.color'),
						author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() },
						description: `${interaction.client.user} detected and logged an error while executing this ${interaction.commandName ? 'command' : 'component'}.\n\u200b`,
						thumbnail: { url: interaction.client.user.displayAvatarURL() },
						fields: [{ name: `Error Message`, value: `\`\`\`Rust\n${error.message}\`\`\`` }],
						footer: { text: `\u200b` }
					}
				],
				ephemeral: true,
			});
		}
		throw error;
	};
};