export const data = { type: 2, name: 'Information' };
export async function Execute({ interaction, settings }) {

    const member = interaction.guild.members.cache.get(interaction.targetId) || interaction.member;

    let permissions = member.permissions.toArray().join(", ");
    let rolesString = member.roles.cache.map(role => role).slice(0, -1).join(', ');

    if (permissions.length > 1024)
        permissions = permissions.substring(0, 1020) + "...";

    if (rolesString.length > 1024)
        rolesString = rolesString.substring(0, 1020) + "...";

    await interaction.reply({
        embeds: [
            {
                color: settings.color,
                title: `User Information`,
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