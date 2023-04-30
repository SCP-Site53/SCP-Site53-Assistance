export const data = {
    type: 1,
    name: 'member',
    description: 'Do something with a member.',
    options: [
        {
            type: 1,
            name: 'information',
            description: 'Recieve information about a member in the server.',
            options: [
                { 
                    type: 6, 
                    name: 'member', 
                    description: 'Select a member.' 
                }
            ]
        },
        {
            type: 1,
            name: 'avatar',
            description: 'Fetches the avatar of an a member in the server.',
            options: [
                { 
                    type: 6, 
                    name: 'member', 
                    description: 'Select a member.' 
                }
            ]
        },
    ]
};

export async function Execute({ interaction, settings }) {

    const member = interaction.options.getMember('member') || interaction.member;

    if (interaction.getSubcommand() === 'information') {

        let rolesString = member.roles.cache.map(role => role).slice(0, -1).join(', ');
    
        if (rolesString.length > 1024) {
            rolesString = rolesString.substring(0, 1021) + "...";
        };

        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: `Member Information`,
                    author: { name: `${member.user.username}#${member.user.discriminator}`, icon_url: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) },
                    thumbnail: { url: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) },
                    fields: [
                        {
                            name: 'Account Info',
                            value: `
                                > Identity: \`${member.user.id}\`
                                > Bot: \`${member.user.bot ? 'Yes' : 'No'}\`
                                > Registered: <t:${Math.floor(member.user.createdTimestamp / 1000)}:f> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)
                                `,
                        },
                        {
                            name: 'Member Info',
                            value: `
                                > Joined Server: <t:${Math.floor(member.joinedTimestamp / 1000)}:f> (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)
                                > Nickname: \`${member.nickname || 'None'}\`
                                > Hoist Role: \`${member.roles.hoist ? member.roles.hoist.name : 'None'}\`
                                `,
                        },
                        {
                            name: `Roles [${member.roles.cache.size - 1}]`,
                            value: member.roles.cache.size ? `> ${rolesString}` : '> \`None\`',
                        }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: settings.footer
                }
            ],
            ephemeral: settings.ephemeral,
        });
    }
    else if (!interaction.getSubcommand() === 'avatar') {
        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: `${interaction.user.tag}'s Avatar`,
                    image: { url: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }) },
                    timestamp: new Date().toISOString(),
                    footer: settings.footer
                }
            ]
        })
    };
};