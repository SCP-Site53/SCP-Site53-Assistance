import { Niall } from '../../../../Structures/Niall.mjs';

export const data = { 
    type: 1, 
    name: 'uptime', 
    description: 'Fetch the bot\'s uptime.' 
};

export async function Execute({ interaction, settings }) {
    const member = interaction.client;
    await interaction.reply({
        embeds: [
            {
                color: settings.color,
                title: `Bot Uptime`,
                author: { name: `${member.user.username}#${member.user.discriminator}`, icon_url: member.user.displayAvatarURL() },
                thumbnail: { url: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) },
                description: `\`\`\`${Niall.timeformat(process.uptime() * 1000)}.\`\`\``,
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
                                label: 'Ping the Bot',
                                description: 'Replies with "Pong" & latency.',
                                emoji: '🤖',
                                value: 'ping',
                            }
                        ]
                    }
                )
            }
        ],
        ephemeral: settings.ephemeral
    });
}