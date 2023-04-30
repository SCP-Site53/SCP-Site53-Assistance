import { Undy } from '../../../../Structures/Undy.mjs';
import { Stylus } from '../../../../Structures/Stylus.mjs';
import { Jazmyn } from '../../../../Structures/Jazmyn.mjs';

export const data = {
    type: 1,
    name: 'add',
    description: 'Adds something.',
    options: [
        {
            type: 2,
            name: 'ticket',
            description: 'Adds something to a ticket.',
            options: [
                {
                    type: 1,
                    name: 'member',
                    description: 'Adds a member to a ticket.',
                    options: [
                        { type: 6, name: 'member', description: 'Select the member you want to timeout.', required: true },
                        { type: 7, name: 'channel', description: 'An alternative ticket channel' },
                        { type: 3, name: 'reason', description: 'Specify a reason.' },
                        { type: 3, name: 'note', description: 'Write a note.' }
                    ]
                },
            ]
        },
        {
            type: 2,
            name: 'member',
            description: 'Adds something to a member.',
            options: [
                {
                    type: 1,
                    name: 'role',
                    description: 'Adds a role to a member',
                    options: [
                        { type: 6, name: 'member', description: 'Select the member you want to timeout.', required: true },
                        { type: 8, name: 'role', description: 'Select the role.', required: true },
                        { type: 7, name: 'channel', description: 'An alternative ticket channel' },
                        { type: 3, name: 'reason', description: 'Specify a reason.' },
                        { type: 3, name: 'note', description: 'Write a note.' }
                    ]
                },
            ]
        },
        {
            type: 1,
            name: 'log',
            description: 'Adds a log.'
        },
        {
            type: 2,
            name: 'user',
            description: 'Adds something to a user.',
            options: [
                {
                    type: 1,
                    name: 'lookout',
                    description: 'Adds a lookout (BOLO) to a user.',
                    options: [
                        { type: 3, name: 'user', description: 'Enter the user.' },
                        { type: 6, name: 'discord', description: 'Select the user\'s Discord account (if possible).' },
                        { type: 7, name: 'channel', description: 'An alternative ticket channel' },
                        { type: 3, name: 'reason', description: 'Specify a reason.' },
                        { type: 3, name: 'note', description: 'Write a note.' }
                    ]
                },
            ]
        }
    ]
};
export async function Execute({ interaction, database, settings }) {
    if (!await Stylus.check(interaction))
        return await interaction.reply({ 
            content: await Stylus.message(),
            ephemeral: settings.ephemeral 
        });

    if (interaction.options.getSubcommand() === 'member') {

        const channel = interaction.options.getChannel('channel') ?? interaction.channel;
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? 'No reason specified.';
        const ticket = await database.get(`${interaction.guild.id}.tickets.${channel.id}`);

        if (!ticket)
            return interaction.reply({ 
                content: `The channel you slected is not a ticket channel. You can only add members to ticket channels.`, 
                ephemeral: settings.ephemeral 
            });

        else if (!member)
            return interaction.reply({ 
                content: `The user you selected is not in the server.`, 
                ephemeral: settings.ephemeral 
            });

        else if (member.id === interaction.user.id)
            return interaction.reply({ 
                content: `You already have access to that channel.`, 
                ephemeral: settings.ephemeral 
            });
        
        else if (member.id === interaction.client.user.id)
            return interaction.reply({ 
                content: `How kind of you to give me access to ${channel}, but I already have access to it.`,
                ephemeral: settings.ephemeral 
            });
        
        channel.permissionOverwrites.edit(
            member.id, 
            { ViewChannel: true }, 
            { reason: `Moderator: ${interaction.user.tag} (${interaction.user.id})\nReason: ${reason}` }
        );

        await Undy.post({
            method: Jazmyn.DiscordJSEvent,
            channel: settings.channels.moderation.commands,
            interaction: interaction,
            data: {
                username: `Command Logs`,
                embeds: [
                    {
                        color: settings.color,
                        author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                        description: `${interaction.user} added ${member} to ${channel}.`,
                        thumbnail: { url: interaction.guild.iconURL() },
                        fields: [
                            { name: '<:Identity:1061740821889679390> Ticket Identity', value: `\`\`\`${channel.id}\`\`\``, inline: true },
                            { name: '<:Ticket:1061740884485472266> Ticket Type', value: `\`\`\`${ticket.type}\`\`\``, inline: true },
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
                    author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                    description: `I added ${member} to ${channel}.`,
                    thumbnail: { url: interaction.guild.iconURL() },
                    footer: { text: `\u200b` }
                }
            ],
            ephemeral: settings.ephemeral
        });
    }
    else if (interaction.options.getSubcommand() === 'role') {
        
        let member = interaction.options.getMember('member') ?? interaction.member;
        const role = interaction.options.getRole('role');
        const reason = interaction.options.getString('reason') ?? "No reason specified.";

        member.lines = { 
            themself: member, 
            you: member 
        };

        if (!member)
            return await interaction.reply({ 
                content: `The user you selected is not a member of this server.`, 
                ephemeral: settings.ephemeral 
            });

        else if (member.id === interaction.user.id)
            member.lines = { 
                themself: `themself`, 
                you: `you` 
            };

        else if (member.id === interaction.client.user.id)
            member.lines = {
                themself: interaction.client.user, 
                you: `myself` 
            };

        else if (interaction.user.id != interaction.guild.ownerId && role.position >= interaction.member.roles.highest.position)
            return await interaction.reply({ 
                content: await Stylus.fetchQuote(), 
                ephemeral: settings.ephemeral 
            });

        member.roles.add(
            role, 
            { reason: `Moderator: ${interaction.user.tag} (${interaction.user.id})\nReason: ${reason}` }
        );

        await Undy.post({
            method: Jazmyn.DiscordJSEvent,
            channel: settings.channels.moderation.commands,
            interaction: interaction,
            data: {
                username: `Command Logs`,
                embeds: [
                    {
                        color: settings.color,
                        author: { name: member.user.tag, icon_ur: member.displayAvatarURL() },
                        description: `${interaction.user} gave ${member.lines.themself} the ${role} role.`,
                        thumbnail: { url: interaction.guild.iconURL() },
                        footer: { text: `\u200b` }
                    }
                ]
            }
        });

        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                    description: `I gave ${member.lines.you} the ${role} role.`,
                    thumbnail: { url: interaction.guild.iconURL() },
                    footer: { text: `\u200b` }
                }
            ],
            ephemeral: settings.ephemeral
        });
    }

    else if (interaction.options.getSubcommand() === 'log') {
        await interaction.reply({
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            custom_id: 'log',
                            placeholder: 'Select the log you will use.',
                            options: (
                                {
                                    label: 'Punishment Log',
                                    description: 'Logs kicks, bans, mutes, warning, etc.',
                                    emoji: '1057443050500141217',
                                    value: 'punishment',
                                }
                            )
                        }
                    ]
                }
            ],
            ephemeral: settings.ephemeral
        });
    }

    else if (interaction.options.getSubcommand() === 'lookout') {
        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: 'Lookout Options (B.E.T.A.)',
                    author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                    description: `Our bot offers different types of lookouts (BOLOs). Each type of BOLO does its own task. Select the BOLO that best fits your situation. All BOLOs are known to have issues. Please report any issues you find [here](https://discord.gg/pgfmgA6Tv2).\n\u200b`,
                    thumbnail: { url: interaction.guild.iconURL() },
                    fields: [
                        { name: `<:Ban:1057443089268097054> Ban BOLO`, value: `The Ban BOLO is the most advanced BOLO. Ex. A moderator will enter a suspect's username into our system. When the suspect is detected in the server, our system will ban them.​\n\u200b` },
                        { name: `<:Kick:1059194181903466507> Kick BOLO (Not Released)`, value: `The Kick BOLO can be used when you want to limit punishment to a user. Ex. A moderator will enter a suspect's username into our system. When the suspect is detected in the server, our system will kick them 1 time.​\n​\u200b` },
                        { name: `<:Events:1050993020230705172> Timeout BOLO (Not Released)`, value: `The Kick BOLO can be used when you want a user shutout for a long time. Ex. A moderator will enter a suspect's username into our system. When the suspect is detected in the server, our system will timeout them for 7 days.` }
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
                            custom_id: 'bolo',
                            placeholder: 'Select the lookout (BOLO) you will use.',
                            options: (
                                {
                                    label: 'Ban BOLO',
                                    description: 'Bans a user on sight.',
                                    emoji: '1057443089268097054',
                                    value: 'ban',
                                }
                            )
                        }
                    ]
                }
            ],
            ephemeral: settings.ephemeral
        });
    };
}