import { Oliver } from '../../Structures/Oliver.mjs';
import { Undy } from '../../Structures/Undy.mjs';
import { Justin } from '../../Structures/Justin.mjs';
import { Jazmyn } from '../../Structures/Jazmyn.mjs';

export const name = Justin.Events.GuildMemberAdd;
export async function Execute(member) {
	
	const database = new Oliver({ guild: member.guild.id });
	const settings = await database.get(`settings`);

	if (!await database.get(`status.guild.member.add`)) {
		return;
	};

	await Undy.post({
		method: Jazmyn.DiscordJSEvent,
		interaction: member,
		channel: settings.channels.audit.member.add,
		data: {
			username: `Welcome ${member.username}!`,
			embeds: [
				{
					color: settings.color,
					title: `Welcome!`,
					author: { name: member.user.username, iconURL: member.user.displayAvatarURL() },
					description: `${member} joined **${member.guild.name}**.​​​`,
					fields: [{ name: `Discord Member Since`, value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)` }],
					thumbnail: { url: member.guild.iconURL() },
					timestamp: new Date().toISOString()
				}
			]
		}
	});
};