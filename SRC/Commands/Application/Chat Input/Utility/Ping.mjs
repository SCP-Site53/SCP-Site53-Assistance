export const data = { 
    type: 1, 
    name: 'ping', 
    description: 'Replies with "Pong" & latency.' 
};

export async function Execute({ interaction, settings }) {

    const member = interaction.client;
    const sent = await interaction.reply({
        embeds: [
            {
                color: settings.color,
                title: `Pong!/Latency`,
                author: { name: `${member.user.username}#${member.user.discriminator}`, icon_url: member.user.displayAvatarURL() },
                thumbnail: { url: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) },
                fields: [
                    { name: 'Roundtrip Latency', value: `\`\`\`Loading...\`\`\``, inline: true },
                    { name: 'Websocket Heartbeat', value: `\`\`\`${interaction.client.ws.ping}ms\`\`\``, inline: true }
                ],
                timestamp: new Date().toISOString(),
                footer: settings.footer
            }
        ],
        fetchReply: true,
        ephemeral: settings.ephemeral,
    });
    
    interaction.editReply({
        embeds: [
            {
                color: settings.color,
                title: `Pong!/Latency`,
                author: { name: `${member.user.username}#${member.user.discriminator}`, icon_url: member.user.displayAvatarURL() },
                thumbnail: { url: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) },
                fields: [
                    { name: 'Roundtrip Latency', value: `\`\`\`${sent.createdTimestamp - interaction.createdTimestamp}ms\`\`\``, inline: true },
                    { name: 'Websocket Heartbeat', value: `\`\`\`${interaction.client.ws.ping}ms\`\`\``, inline: true }
                ],
                timestamp: new Date().toISOString(),
                footer: settings.footer
            }
        ],
        components: [
            {
                type: 1,
                components: (
                    {
                        type: 3,
                        custom_id: 'utilities',
                        placeholder: 'Additional Utility Features',
                        options: [
                            {
                                label: 'Bot Uptime',
                                description: 'Fetch the bot\'s uptime.',
                                emoji: '🤖',
                                value: 'uptime',
                            }
                        ]
                    }
                )
            }
        ],
        ephemeral: settings.ephemeral,
    });
};