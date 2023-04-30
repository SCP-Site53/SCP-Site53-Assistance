import { Stylus } from '../../../Structures/Stylus.mjs';
import { Undy } from '../../../Structures/Undy.mjs';
import { Jazmyn } from '../../../Structures/Jazmyn.mjs';
import ms from 'ms';

export const data = { identity: 'ticket-delete' };
export async function Execute({ interaction, database, settings }) {
    if (!await Stylus.check(interaction))
        return await interaction.reply({ 
            content: await Stylus.message(), 
            ephemeral: settings.ephemeral 
        });
    const reason = interaction.fields.getTextInputValue('reason');
    const messages = await interaction.channel.messages.fetch();
    const ticket = await database.get(`tickets.${interaction.channelId}`);
    if (!ticket) {
        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: `Unknown Error`,
                    author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() },
                    description: `Something strange is going on. We could not find ticket \`${interaction.channelId}\` in our database.`,
                    thumbnail: { url: interaction.guild.iconURL() },
                    timestamp: new Date().toISOString(),
                    footer: settings.footer
                }
            ],
            ephermeral: settings.ephermeral
        });
        throw new Error(`No ticket identity matching ${interaction.channelId} was found.`);
    };
    await database.set(`Tickets.${interaction.channelId}.Closed`, Date.now());
    interaction.client.users.send(ticket.creator, {
        embeds: [
            {
                color: settings.color,
                title: `Ticket Deleted`,
                author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dyanmic: true }), url: interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }) },
                description: `Your ${ticket.type} support ticket was deleted. Please open a new support ticket if you have anymore questions or concerns.\n\u200b`,
                thumbnail: { url: interaction.guild.iconURL() },
                fields: [
                    { name: `Topic`, value: `${ticket.topic}\n\u200b` },
                    { name: `Reason`, value: `${reason}\n\u200b` }
                ],
                timestamp: new Date().toISOString(),
                footer: settings.footer
            }
        ],
        ephermeral: settings.ephermeral
    });
    await interaction.reply({
        embeds: [
            {
                color: settings.color,
                title: `Ticket Deleted`,
                author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dyanmic: true }), url: interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }) },
                description: `This ${ticket.type} support ticket will be deleted ${Math.floor([Date.now() + 1000] / 1000)}. Please open a new support ticket if you have anymore questions or concerns.\n\u200b`,
                thumbnail: { url: interaction.guild.iconURL() },
                fields: [
                    { name: `Topic`, value: `${ticket.topic}\n\u200b` },
                    { name: `Reason`, value: `${reason}\n\u200b` }
                ],
                timestamp: new Date().toISOString(),
                footer: settings.footer
            }
        ],
        ephermeral: settings.ephermeral
    });
    setTimeout(async () => {
        Undy.Post({
            method: Jazmyn.DiscordJSInteraction,
            channel: settings.channels.ticket.delete,
            interaction: interaction,
            data: {
                username: `Support System`,
                embeds: [
                    {
                        color: settings.color,
                        title: `Ticket ${interaction.channelId} Was Closed`,
                        author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dyanmic: true }), url: interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }) },
                        description: `${interaction.user} closed ticket ${interaction.channelId} created by <@${ticket.creator}>.\n\u200b`,
                        thumbnail: { url: interaction.guild.iconURL() },
                        fields: [
                            { name: `Topic`, value: `${ticket.topic}\n\u200b` },
                            { name: `Reason`, value: `${reason}\n\u200b` },
                            { name: `Ticket Created`, value: `<t:${Math.floor(ticket.created / 1000)}:F> (<t:${Math.floor(ticket.created / 1000)}:R>)\n\u200b`, inline: true },
                            { name: `Ticket Duration`, value: `${ms(Date.now() - ticket.created, { long: true })}\n\u200b`, inline: true, }
                        ],
                        timestamp: new Date().toISOString(),
                        footer: settings.footer
                    }
                ],
                files: [
                    {
                        data: { name: `transcript-${interaction.channel.name}.txt` },
                        attachment: Buffer.from(`Transcript for ${interaction.channel.name} (${interaction.channelId})\n\n ${messages.map(message => `[${message.createdAt.toLocaleDateString()} ${message.createdAt.toLocaleTimeString()}] ${message.author.tag}: ${message.content}`).join('\n')}`)
                    }
                ],
            }
        });
        interaction.channel.delete();
    }, 10000);
}