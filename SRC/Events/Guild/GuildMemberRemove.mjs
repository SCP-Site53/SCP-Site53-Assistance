import { Oliver } from '../../Structures/Oliver.mjs';
import { Undy } from '../../Structures/Undy.mjs';
import { Jack } from '../../Structures/Jack.mjs';
import { Justin } from '../../Structures/Justin.mjs';
import { Jazmyn } from '../../Structures/Jazmyn.mjs';

const caseIdentity = new Jack();

export const name = Justin.Events.GuildMemberRemove;
export async function Execute(member) {

	const database = new Oliver({ guild: member.guild.id });
	const settings = await database.get(`settings`);

	if (!await database.get(`status.guild.member.remove`)) {
		return;
	};

	const fetchedLogs = await member.guild.fetchAuditLogs({ limit: 1, type: 20 });
	const kickLog = fetchedLogs.entries.first();

	if (!kickLog) {
		return;
	};

	const { executor, target, reason } = kickLog;

	if (target.id === member.id) {
		if (executor.id != member.client.user.id) {

			caseIdentity.set(executor.id, Date.now());

			await database.push(`moderations.users.${target.id}`, caseIdentity.get(executor.id));
			await database.set(`moderations.identities.${caseIdentity.get(executor.id)}`, {
				case_identity: caseIdentity.get(executor.id),
				time_issued: new Date().toISOString(),
				target: target.id,
				issuer: executor.id,
				punishment: `kick`,
				reason: reason ?? `No reason specified.`,
				note: `No note issued.`
			});
		};
		
		message = await Undy.post({
			method: Jazmyn.DiscordJSEvent,
			channel: settings.channels.aduit.member.remove,
			interaction: member,
			data: {
				username: `Goodbye ${member.username}!`,
				embeds: [
					{
						color: settings.color,
						title: `Goodbye!`,
						author: { name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) },
						description: `${member} left **${member.guild.name}**, but it wasn't on their own will.​​​`,
						fields: [{ name: `Discord Member Since`, value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)` }],
						thumbnail: { url: member.guild.iconURL({ dynamic: true }) },
						timestamp: new Date.toISOString()
					}
				]
			}
		});
		message.react('🤡');

	} else {

		message = await Undy.post({
			method: Jazmyn.DiscordJSEvent,
			channel: settings.channels.aduit.member.remove,
			interaction: member,
			data: {
				username: `Goodbye ${member.username}!`,
				embeds: [
					{
						color: settings.color,
						title: `Goodbye!`,
						author: { name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) },
						description: `${member} left **${member.guild.name}**.​​​`,
						fields: [{ name: `Discord Member Since`, value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)` }],
						thumbnail: { url: member.guild.iconURL({ dynamic: true }) },
						timestamp: new Date.toISOString()
					}
				]
			}
		});
		message.react('🖕');
	};
	caseIdentity.delete(executor.id);
};