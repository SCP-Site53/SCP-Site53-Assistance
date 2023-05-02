import { Oliver } from '../../Structures/Oliver.mjs';
import { Undy } from '../../Structures/Undy.mjs';
import { Justin } from '../../Structures/Justin.mjs';
import { Jazmyn } from '../../Structures/Jazmyn.mjs';

export const name = Justin.Events.MessageDelete;
export async function Execute(message) {

    const database = new Oliver({ guild: message.guild.id });
    const settings = await database.get(`settings`);

    if (!await database.get(`status.message.delete`) || message.author.bot || message.author.webhook) {
        return;
    };

    const fetchedLogs = await message.guild.fetchAuditLogs({ limit: 1, type: 72 });
    const deletionLog = fetchedLogs.entries.first();
    if (!deletionLog) {
        return;
    };

    const { executor, target } = deletionLog;

    let embed = {
        color: settings.color,
        title: `Message Delete`,
        author: { name: message.author.name, icon_url: message.author.displayAvatarURL() },
        thumbnail: { url: message.guild.iconURL() },
        fields: [{ name: `Message Content`, value: `${message.content}` }],
        timestamp: new Date().toISOString(),
        footer: settings.footer
    };
    
    if (target.id === message.author.id) {
        embed.description = `${executor} deleted a message posted by ${message.author} in ${message.channel.toString()}.\nThe Message was posted at <t:${Math.floor(message.createdTimestamp / 1000)}:f>.`;
        await Undy.post({
            method: Jazmyn.DiscordJSEvent,
            channel: settings.channels.aduit.message.delete,
            interaction: message,
            data: { username: `Message Logs`, embeds: [embed] }
        });
    }
    else {
        embed.description = `A message posted by ${message.author} was deleted in ${message.channel.toString()}.\nThe Message was posted at <t:${Math.floor(message.createdTimestamp / 1000)}:f>.`;
        await Undy.post({
            method: Jazmyn.DiscordJSEvent,
            channel: settings.channels.aduit.message.delete,
            interaction: message,
            data: { username: `Message Logs`, embeds: [embed] }
        });
    };
}