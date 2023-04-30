import { Undy } from '../../../Structures/Undy.mjs';
import { Jazmyn } from '../../../Structures/Jazmyn.mjs';

export const data = { identity: 'ticket-create-general' };
export async function Execute({ interaction, database, settings }) {
    const topic = interaction.fields.getTextInputValue('topic');
    const type = `general`;
    interaction.guild.channels.create({
        name: `│${type}-${interaction.user.username}`,
        type: 0,
        topic: `Created by ${interaction.user.tag} (1023408869122256906)`,
        permissionOverwrites: [
            [
                ...settings.roles.staff.ranks.moderator,
                ...settings.roles.staff.ranks.administrator,
                ...settings.roles.staff.ranks.internal_affairs,
                ...settings.roles.staff.ranks.management,
                ...settings.roles.staff.ranks.executive
            ]
                .map(role => [
                    {
                        id: role,
                        allow: ['VIEW_CHANNEL'],
                    }
                ])
                .join(', '),
            {
                id: interaction.guild.id,
                deny: ['VIEW_CHANNEL'],
            }
        ],
    }).then(async (ticket) => {
        await database.push(`tickets`, {
            identity: ticket.id,
            creator: interaction.user.id,
            created: Date.now(),
            name: ticket.name,
            topic: topic,
            type: type
        });
        await Undy.Post({
            method: Jazmyn.DiscordJSInteraction,
            channel: ticket.id,
            interaction: interaction,
            data: {
                username: `Support System`,
                embeds: [
                    {
                        color: settings.color,
                        title: `Welcome To Your Support Ticket!`,
                        author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() },
                        description: `Thanks for reaching out, ${interaction.user}! Let us know if you have any more questions or concerns. We are always here to help you.\n\u200b`,
                        thumbnail: { url: interaction.guild.iconURL() },
                        fields: [
                            { name: `Topic`, value: `${topic}\n\u200b` },
                            { name: `Ticket Creator Identity`, value: `${interaction.user.id}\n\u200b`, inline: true },
                            { name: `Ticket Identity`, value: `${ticket.id}\n\u200b`, inline: true }
                        ],
                        timestamp: new Date().toISOString(),
                        footer: settings.footer
                    }
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 3,
                                custom_id: 'configure-ticket',
                                placeholder: 'Configure Ticket',
                                options: [
                                    {
                                        label: 'Close Ticket',
                                        description: 'Deletes the support ticket and makes a transcript.',
                                        emoji: '❌',
                                        value: 'close',
                                    },
                                    {
                                        label: 'Transcript',
                                        description: 'Transcript all messages in the ticket channel.',
                                        emoji: '📩',
                                        value: 'transcript',
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
        await Undy.Post({
            method: Jazmyn.DiscordJSInteraction,
            channel: settings.channels.ticket.create,
            interaction: interaction,
            data: {
                username: `Ticket Logs`,
                embeds: [
                    {
                        color: settings.color,
                        title: `New Support Ticket`,
                        author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() },
                        description: `${interaction.user} created a ${type} support ticket.\n\u200b`,
                        thumbnail: { url: interaction.guild.iconURL() },
                        fields: [
                            { name: `Topic`, value: `${topic}\n\u200b` },
                            { name: `Ticket Creator Identity`, value: `${interaction.user.id}\n\u200b`, inline: true },
                            { name: `Ticket Identity`, value: `${ticket.id}\n\u200b`, inline: true }
                        ],
                        timestamp: new Date().toISOString(),
                        footer: settings.footer
                    }
                ]
            }
        });
        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: `Welcome To Your Support Ticket!`,
                    author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() },
                    description: `Thanks for reaching out, ${interaction.user}! Here is your support ticket, ${TicketChannel}.\n\u200b`,
                    thumbnail: { url: interaction.guild.iconURL() },
                    fields: [
                        { name: `Topic`, value: `${topic}\n\u200b` },
                        { name: `Ticket Creator Identity`, value: `${interaction.user.id}\n\u200b`, inline: true },
                        { name: `Ticket Identity`, value: `${ticket.id}\n\u200b`, inline: true }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: settings.footer
                }
            ],
            ephermeral: settings.ephermeral
        });
    });
};