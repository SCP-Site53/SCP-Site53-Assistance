export const data = {
    type: 1,
    name: 'server',
    description: 'Do something with the server.',
    options: [
        {
            type: 1,
            name: 'information',
            description: `Recieve information about the server.`
        },
        {
            type: 2,
            name: 'member',
            description: 'Does something with server members.',
            options: [
                {
                    type: 1,
                    name: 'count',
                    description: 'View the server member count.'
                }
            ]
        }
    ]
};

export async function Execute({ interaction, settings }) {
    if (interaction.options.getSubcommand() === 'information') {
        
        const splitPascal = (string, seperator) => string.split(/(?=[A-U])/).join(seperator);
        const toPascalCase = (string, seperator = false) => {
            const Pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+()/g, (match, chr) => chr.toUpperCase());
            return seperator ? splitPascal(Pascal, seperator) : Pascal;
        };

        const mfaLeavels = {
            0: `Not required`,
            1: `Required`
        };

        const filterLevels = {
            0: 'Never scan media content',
            1: 'Scan media content sent by members without roles',
            2: 'Scan media content sent by all members'
        };

        const verificationLevels = {
            0: 'None',
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Very High'
        };

        const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const channels = interaction.guild.channels.cache;
        const emojis = interaction.guild.emojis.cache;
        const members = await interaction.guild.members.fetch({ withPresences: true });
        let rolesString = roles.join(`, `);

        if (rolesString.length > 1012)
            rolesString = roles.slice(0, 40).join(`, `) + `and ${roles.length - 40} more..`;
        
        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: `Server Information`,
                    author: { name: interaction.guild.name, icon_url: interaction.guild.iconURL() },
                    thumbnail: { url: interaction.guild.iconURL() },
                    description: `${interaction.guild.name}'s server information.\n\u200b`,
                    fields: [
                        {
                            name: `General`,
                            value: `
                                > Identity: \`${interaction.guild.id}\`.
                                > Created: <t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:f> (<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:R>).
                                > Owner: <@${interaction.guild.ownerId}>.
                                > Boost Tier: \`${interaction.guild.premiumTier ?? `0`}\`.
                                > Boost Count: \`${interaction.guild.premiumSubscriptionCount || `0`}\`.
                                \u200b
                                `
                        },
                        {
                            name: `Security`,
                            value: `
                                > MFA/2FA for Moderators: \`${mfaLeavels[interaction.guild.mfaLevel]}\`
                                > Explicit Filter: \`${filterLevels[interaction.guild.explicitContentFilter]}\`.
                                > Verification Level: \`${verificationLevels[interaction.guild.verificationLevel]}\`.
                                \u200b
                                `
                        },
                        {
                            name: `Emojis & Sitckers`,
                            value: `
                                > Total Emojis: \`${emojis.size}\`.
                                > Static Emojis: \`${emojis.filter(emoji => !emoji.animated).size}\`.
                                > Animated Emojis: \`${emojis.filter(emoji => emoji.animated).size}\`.
                                > Total Stickers: \`${interaction.guild.stickers.cache.size}\`.
                                > Static Stickers: \`${interaction.guild.stickers.cache.filter(emoji => !emoji.animated).size}\`.
                                > Animated Stickers: \`${interaction.guild.stickers.cache.filter(emoji => emoji.animated).size}\`.
                                \u200b
                                `,
                            inline: true
                        },
                        {
                            name: `Member`,
                            value: `
                                > Total: \`${interaction.guild.memberCount}\`.
                                > Humans: \`${members.filter(member => !member.user.bot).size}\`.
                                > Bots: \`${members.filter(member => member.user.bot).size}\`.
                                \u200b
                                `,
                            inline: true
                        },
                        {
                            name: `\u200b`,
                            value: `\u200b`
                        },
                        {
                            name: `Channels`,
                            value: `
                                > Total: \`${channels.size}\`.
                                > Text: \`${channels.filter(channel => channel.type === 'GUILD_TEXT').size}\`.
                                > Voice: \`${channels.filter(channel => channel.type === 'GUILD_VOICE').size}\`.
                                > Threads: \`${channels.filter(channel => channel.type === 'GUILD_NEWS_THREAD' && 'GUILD_PRIVATE_THREAD' && 'GUILD_PUBLIC_THREAD').size}\`.
                                > Categories: \`${channels.filter(channel => channel.type === 'GUILD_CATEGORY').size}\`.
                                > Stages: \`${channels.filter(channel => channel.type === 'GUILD_STAGE_VOICE').size}\`.
                                > News: \`${channels.filter(channel => channel.type === 'GUILD_NEWS').size}\`.
                                \u200b
                                `,
                            inline: true
                        },
                        {
                            name: `Presence`,
                            value: `
                                > Online: \`${members.filter(member => member.presence?.status === 'online').size}\`.
                                > Idle: \`${members.filter(member => member.presence?.status === 'idle').size}\`.
                                > Do Not Disturb: \`${members.filter(member => member.presence?.status === 'dnd').size}\`.
                                > Offline: \`${members.filter(member => member.presence?.status === 'offline').size}\`.
                                \u200b
                                `,
                            inline: true
                        },
                        {
                            name: `Roles [${roles.length - 1}]`,
                            value: `> ${rolesString}.\n\u200b`
                        },
                        {
                            name: `Features [${interaction.guild.features.length - 1}]`,
                            value: `> ${interaction.guild.features?.map(feature => toPascalCase(feature, ""))?.join(`, `) ?? `No features`}.\n\u200b`
                        }
                    ]
                }
            ],
            ephemeral: settings.ephemeral
        });
    }
    else if (interaction.options.getSubcommand() === 'count') {
        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: `${interaction.guild.name}'s Member Count`,
                    author: { name: interaction.user.tag, icon_url: interaction.user.displayAvatarURL() },
                    description: `\`\`\`${interaction.guild.memberCount}\`\`\``,
                    thumbnail: { url: interaction.guild.iconURL() },
                    footer: { text: '\u200b' }
                }
            ]
        });
    };
};