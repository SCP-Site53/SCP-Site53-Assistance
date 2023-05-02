import { Oliver } from '../../Structures/Oliver.mjs';
import { Undy } from '../../Structures/Undy.mjs';
import { Justin } from '../../Structures/Justin.mjs';
import { Jazmyn } from '../../Structures/Jazmyn.mjs';

export const name = Justin.Events.GuildMemberUpdate;
export async function Execute(oldMember, newMember) {

	const database = new Oliver({ guild: oldMember.guild.id });
	const settings = await database.get(`settings`);

	if (!await database.get(`status.member.role.update`)) {
		return;
	};

	const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
	const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

	if (removedRoles.size > 0) {
		Undy.post({
			method: Jazmyn.DiscordJSEvent,
			channel: settings.channels.audit.member.roles.update,
			interaction: oldMember,
			data: {
				username: `Member Logs`,
				embeds: [
					{
						color: settings.color,
						title: `Member Roles Update`,
						author: { name: oldMember.user.tag, icon_url: oldMember.user.displayAvatarURL(), url: oldMember.user.displayAvatarURL() },
						description: `The roles ${addedRoles.map(r => r)} were removed from ${oldMember}.`,
						thumbnail: { url: oldMember.guild.iconURL() },
						fields: [
							{ name: `Member Identity`, value: `\`\`\`${oldMember.id}\`\`\`` },
							{ name: `Role Names`, value: `\`\`\`${removedRoles.map(r => r.name)}\`\`\``, inline: true },
							{ name: `Role Identities`, alue: `\`\`\`${removedRoles.map(r => r.id)}\`\`\``, inline: true }
						],
						timestamp: new Date().toISOString(),
						footer: settings.footer
					}
				]
			}
		});
	};
	
	if (addedRoles.size > 0) {
		Undy.post({
			method: Jazmyn.DiscordJSEvent,
			channel: settings.channels.audit.member.roles.update,
			interaction: oldMember,
			data: {
				username: `Member Logs`,
				embeds: [
					{
						color: settings.color,
						title: `Member Roles Update`,
						author: { name: oldMember.user.tag, icon_url: oldMember.user.displayAvatarURL(), url: oldMember.user.displayAvatarURL() },
						description: `The roles ${addedRoles.map(r => r)} were added to ${oldMember}.`,
						thumbnail: { url: oldMember.guild.iconURL() },
						fields: [
							{ name: `Member Identity`, value: `\`\`\`${oldMember.id}\`\`\`` },
							{ name: `Role Names`, value: `\`\`\`${addedRoles.map(r => r.name)}\`\`\``, inline: true },
							{ name: `Role Identities`, value: `\`\`\`${addedRoles.map(r => r.id)}\`\`\``, inline: true }
						],
						timestamp: new Date().toISOString(),
						footer: settings.footer
					}
				]
			}
		});
	};
}