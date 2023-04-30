import { Michael } from '../../../../Structures/Michael.mjs';
import { Justin } from '../../../../Structures/Justin.mjs';

export const data = {
    type: 1,
    name: 'fetch',
    description: 'Fetches something.',
    options: [
        {
            type: 2,
            name: 'roblox',
            description: 'Fetches something from Roblox.',
            options: [
                {
                    type: 1,
                    name: 'member',
                    description: `Fetches a Roblox user by their username.`,
                    options: [{ type: 3, name: 'username', description: 'The username of the targeted user.', require: true }]
                },
            ]
        },
    ]
};
export async function Execute({ interaction, settings }) {
    
    if (interaction.options.getSubcommand() === 'username') {

        const username = interaction.options.getString('username');
        const res = await Michael.robloxRequest({
            url: `https://users.roblox.com/v1/users/search?keyword=${username}&limit=10`,
            method: Justin.Get
        });

        if (res.data.errors) {
            return await interaction.reply({
                embeds: [
                    {
                        color: settings.color,
                        title: `Pong!/Latency`,
                        author: { name: interaction.user.tag, icon_url: interaction.user.displayAvatarURL() },
                        thumbnail: { url: interaction.guild.iconURL() },
                        fields: [
                            { name: 'Roundtrip Latency', value: `\`\`\`Loading...\`\`\``, inline: true },
                            { name: 'Websocket Heartbeat', value: `\`\`\`${interaction.client.ws.ping}ms\`\`\``, inline: true }
                        ],
                        timestamp: new Date().toISOString(),
                        footer: settings.footer
                    }
                ],
                ephemeral: settings.ephemeral
            });
        }

        else if (res.data.data[0].name === username) {
            await interaction.reply({
                embeds: [
                    {
                        color: settings.color,
                        title: `Pong!/Latency`,
                        author: { name: interaction.user.tag, icon_url: interaction.user.displayAvatarURL() },
                        thumbnail: { url: interaction.guild.iconURL() },
                        fields: [
                            { name: 'Roundtrip Latency', value: `\`\`\`Loading...\`\`\``, inline: true },
                            { name: 'Websocket Heartbeat', value: `\`\`\`${interaction.client.ws.ping}ms\`\`\``, inline: true }
                        ],
                        timestamp: new Date().toISOString(),
                        footer: settings.footer
                    }
                ],
                ephemeral: settings.ephemeral
            });
        };
    };
}